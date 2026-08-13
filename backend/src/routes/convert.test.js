import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { after, before, beforeEach, describe, it } from "node:test";
import sharp from "sharp";
import { convertedDir, uploadsDir } from "../config.js";

process.env.DAILY_CONVERSION_LIMIT = "100";

const analyticsTempDir = await fs.mkdtemp(path.join(os.tmpdir(), "pdfeed-convert-analytics-test-"));
process.env.ANALYTICS_DB_PATH = path.join(analyticsTempDir, "analytics.db");

let server;
let baseUrl;

async function cleanTempStorage() {
  await Promise.all([
    fs.mkdir(uploadsDir, { recursive: true }),
    fs.mkdir(convertedDir, { recursive: true }),
  ]);

  for (const directory of [uploadsDir, convertedDir]) {
    const entries = await fs.readdir(directory);
    await Promise.all(
      entries.map((entry) =>
        fs.rm(`${directory}/${entry}`, { force: true, recursive: true }),
      ),
    );
  }
}

async function uploadFile(path, fileName, bytes, type = "image/png") {
  const formData = new FormData();
  formData.append("file", new Blob([bytes], { type }), fileName);

  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    body: formData,
  });

  return {
    response,
    body: await response.json(),
  };
}

describe("image conversion routes", () => {
  before(async () => {
    const { app } = await import("../app.js");
    server = app.listen(0);
    await new Promise((resolve) => server.once("listening", resolve));
    const { port } = server.address();
    baseUrl = `http://127.0.0.1:${port}`;
  });

  beforeEach(async () => {
    await cleanTempStorage();
  });

  after(async () => {
    await new Promise((resolve) => server.close(resolve));
    const { closeAnalytics } = await import("../services/analytics.js");
    closeAnalytics();
    await cleanTempStorage();
    await fs.rm(analyticsTempDir, { recursive: true, force: true });
  });

  it("rejects an empty upload", async () => {
    const response = await fetch(`${baseUrl}/api/convert/png-to-jpg`, {
      method: "POST",
      body: new FormData(),
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.code, "FILE_REQUIRED");
  });

  it("rejects the wrong extension", async () => {
    const { response, body } = await uploadFile(
      "/api/convert/png-to-jpg",
      "sample.txt",
      Buffer.from("not an image"),
      "text/plain",
    );

    assert.equal(response.status, 400);
    assert.equal(body.code, "INVALID_FILE_TYPE");
  });

  it("rejects oversized uploads", async () => {
    const oversized = Buffer.alloc(26 * 1024 * 1024);
    const { response, body } = await uploadFile(
      "/api/convert/png-to-jpg",
      "large.png",
      oversized,
    );

    assert.equal(response.status, 400);
    assert.equal(body.code, "LIMIT_FILE_SIZE");
  });

  it("converts a valid PNG to JPG and removes upload temp files", async () => {
    const png = await sharp({
      create: {
        width: 12,
        height: 12,
        channels: 4,
        background: { r: 0, g: 120, b: 255, alpha: 0.5 },
      },
    })
      .png()
      .toBuffer();

    const { response, body } = await uploadFile(
      "/api/convert/png-to-jpg",
      "sample.png",
      png,
    );

    assert.equal(response.status, 200);
    assert.match(body.fileName, /sample-converted\.jpg$/);
    assert.match(body.downloadUrl, /^\/api\/download\//);

    const uploadEntries = await fs.readdir(uploadsDir);
    const convertedEntries = await fs.readdir(convertedDir);

    assert.deepEqual(uploadEntries, []);
    assert.equal(convertedEntries.length, 1);
    assert.match(convertedEntries[0], /\.jpg$/);
  });

  it("returns compression metadata for image compression", async () => {
    const jpg = await sharp({
      create: {
        width: 120,
        height: 120,
        channels: 3,
        background: "#2563eb",
      },
    })
      .jpeg({ quality: 95 })
      .toBuffer();
    const formData = new FormData();
    formData.append("quality", "70");
    formData.append("file", new Blob([jpg], { type: "image/jpeg" }), "photo.jpg");

    const response = await fetch(`${baseUrl}/api/convert/compress-image`, {
      method: "POST",
      body: formData,
    });
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(typeof body.metadata.originalSize, "number");
    assert.equal(typeof body.metadata.convertedSize, "number");
    assert.equal(typeof body.metadata.savedPercent, "number");
  });

  it("does not fail a successful conversion when analytics storage is unavailable", async () => {
    const { closeAnalytics } = await import("../services/analytics.js");
    closeAnalytics();
    const blockedPath = path.join(analyticsTempDir, "blocked-directory");
    await fs.mkdir(blockedPath, { recursive: true });
    process.env.ANALYTICS_DB_PATH = blockedPath;

    const png = await sharp({
      create: {
        width: 10,
        height: 10,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      },
    })
      .png()
      .toBuffer();

    const { response, body } = await uploadFile(
      "/api/convert/png-to-jpg",
      "analytics-down.png",
      png,
    );

    assert.equal(response.status, 200);
    assert.match(body.downloadUrl, /^\/api\/download\//);
  });
});
