import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { after, before, describe, it } from "node:test";

const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "pdfeed-analytics-api-test-"));
process.env.ANALYTICS_DB_PATH = path.join(tempDir, "analytics.db");
process.env.ANALYTICS_ADMIN_TOKEN = "api-test-token";
process.env.DAILY_CONVERSION_LIMIT = "100";

let server;
let baseUrl;

describe("analytics API", () => {
  before(async () => {
    const { app } = await import("../app.js");
    const { recordAnalyticsEvent } = await import("../services/analytics.js");

    recordAnalyticsEvent({
      eventType: "page_view",
      toolSlug: "png-to-jpg",
    });
    recordAnalyticsEvent({
      eventType: "conversion_started",
      toolSlug: "png-to-jpg",
      fileSizeBytes: 1234,
    });
    recordAnalyticsEvent({
      eventType: "conversion_success",
      toolSlug: "png-to-jpg",
      fileSizeBytes: 1234,
      durationMs: 25,
    });
    recordAnalyticsEvent({
      eventType: "conversion_failed",
      toolSlug: "jpg-to-png",
      errorCode: "INVALID_FILE_TYPE",
    });

    server = app.listen(0);
    await new Promise((resolve) => server.once("listening", resolve));
    const { port } = server.address();
    baseUrl = `http://127.0.0.1:${port}`;
  });

  after(async () => {
    await new Promise((resolve) => server.close(resolve));
    const { closeAnalytics } = await import("../services/analytics.js");
    closeAnalytics();
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it("rejects admin API requests with missing token", async () => {
    const response = await fetch(`${baseUrl}/api/admin/analytics/summary?range=30d`);
    const body = await response.json();

    assert.equal(response.status, 401);
    assert.equal(body.code, "ADMIN_TOKEN_REQUIRED");
  });

  it("rejects admin API requests with invalid token", async () => {
    const response = await fetch(`${baseUrl}/api/admin/analytics/summary?range=30d`, {
      headers: { Authorization: "Bearer wrong-token" },
    });
    const body = await response.json();

    assert.equal(response.status, 403);
    assert.equal(body.code, "ADMIN_TOKEN_INVALID");
  });

  it("returns analytics for a valid admin token", async () => {
    const response = await fetch(`${baseUrl}/api/admin/analytics/summary?range=30d`, {
      headers: { Authorization: "Bearer api-test-token" },
    });
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.summary.pageViews, 1);
    assert.equal(body.summary.conversions, 1);
    assert.equal(body.summary.successes, 1);
    assert.equal(body.summary.failures, 1);
  });

  it("rejects invalid admin analytics ranges", async () => {
    const response = await fetch(`${baseUrl}/api/admin/analytics/summary?range=30`, {
      headers: { Authorization: "Bearer api-test-token" },
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.code, "INVALID_ANALYTICS_RANGE");
  });

  it("records valid page views and rejects invalid tool slugs", async () => {
    const valid = await fetch(`${baseUrl}/api/analytics/page-view`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toolSlug: "webp-to-jpg" }),
    });

    assert.equal(valid.status, 204);

    const invalid = await fetch(`${baseUrl}/api/analytics/page-view`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toolSlug: "../not-a-tool" }),
    });
    const body = await invalid.json();

    assert.equal(invalid.status, 400);
    assert.equal(body.code, "INVALID_TOOL_SLUG");

    const extraField = await fetch(`${baseUrl}/api/analytics/page-view`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toolSlug: "webp-to-jpg", path: "/tmp/example.png" }),
    });
    const extraFieldBody = await extraField.json();

    assert.equal(extraField.status, 400);
    assert.equal(extraFieldBody.code, "INVALID_ANALYTICS_PAYLOAD");
  });

  it("serves tool, failure, and file-size aggregations", async () => {
    const headers = { Authorization: "Bearer api-test-token" };
    const [toolsResponse, failuresResponse, fileSizesResponse] = await Promise.all([
      fetch(`${baseUrl}/api/admin/analytics/tools?range=30d`, { headers }),
      fetch(`${baseUrl}/api/admin/analytics/failures?range=30d`, { headers }),
      fetch(`${baseUrl}/api/admin/analytics/file-sizes?range=30d`, { headers }),
    ]);

    const tools = await toolsResponse.json();
    const failures = await failuresResponse.json();
    const fileSizes = await fileSizesResponse.json();

    assert.equal(toolsResponse.status, 200);
    assert.ok(tools.tools.some((tool) => tool.toolSlug === "png-to-jpg"));
    assert.equal(failuresResponse.status, 200);
    assert.equal(fileSizesResponse.status, 200);
    assert.ok(fileSizes.fileSizeBuckets.length >= 1);
    assert.ok(
      failures.failures.some(
        (failure) =>
          failure.toolSlug === "jpg-to-png" &&
          failure.errorCode === "INVALID_FILE_TYPE",
      ),
    );
  });
});
