import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { convertedDir, uploadsDir } from "../config.js";
import { AppError } from "./errors.js";

export const allowedExtensions = new Set([
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".ppt",
  ".pptx",
  ".txt",
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
]);

const reliableMimeTypesByExtension = {
  ".pdf": ["application/pdf"],
  ".doc": ["application/msword"],
  ".docx": [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  ".xls": ["application/vnd.ms-excel"],
  ".xlsx": [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ],
  ".ppt": ["application/vnd.ms-powerpoint"],
  ".pptx": [
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ],
  ".txt": ["text/plain"],
  ".jpg": ["image/jpeg"],
  ".jpeg": ["image/jpeg"],
  ".png": ["image/png"],
  ".webp": ["image/webp"],
};

export async function ensureStorageDirectories() {
  await Promise.all([
    fs.mkdir(uploadsDir, { recursive: true }),
    fs.mkdir(convertedDir, { recursive: true }),
  ]);
}

export function randomFileName(extension) {
  const normalizedExtension = extension.startsWith(".")
    ? extension.toLowerCase()
    : `.${extension.toLowerCase()}`;
  return `${crypto.randomUUID()}${normalizedExtension}`;
}

export function safeOriginalName(name) {
  return path
    .basename(name, path.extname(name))
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70) || "converted-file";
}

export function assertExtension(file, expectedExtensions) {
  const extension = path.extname(file.originalname).toLowerCase();
  if (!expectedExtensions.includes(extension)) {
    throw new AppError(
      `This tool accepts only: ${expectedExtensions.join(", ")}`,
      400,
      "INVALID_FILE_TYPE",
    );
  }
}

export function assertFileType(file, expectedExtensions) {
  assertExtension(file, expectedExtensions);

  const extension = path.extname(file.originalname).toLowerCase();
  const expectedMimeTypes = reliableMimeTypesByExtension[extension] || [];
  const mimeType = String(file.mimetype || "").toLowerCase();

  if (
    mimeType &&
    mimeType !== "application/octet-stream" &&
    expectedMimeTypes.length > 0 &&
    !expectedMimeTypes.includes(mimeType)
  ) {
    throw new AppError(
      `The uploaded file MIME type does not match ${extension}.`,
      400,
      "INVALID_MIME_TYPE",
    );
  }
}

export function outputPath(extension) {
  return path.join(convertedDir, randomFileName(extension));
}

export async function removeFiles(paths) {
  await Promise.all(
    paths.filter(Boolean).map((filePath) =>
      fs.rm(filePath, { force: true, recursive: true }).catch(() => undefined),
    ),
  );
}

export function downloadPayload(filePath, downloadName) {
  const fileId = path.basename(filePath);
  return {
    fileId,
    fileName: downloadName,
    downloadUrl: `/api/download/${encodeURIComponent(fileId)}?name=${encodeURIComponent(downloadName)}`,
    expiresInSeconds: 3600,
  };
}

export function resolveDownloadFile(fileId) {
  if (!/^[0-9a-f-]{36}\.[a-z0-9]+$/i.test(fileId)) {
    throw new AppError("Invalid download link.", 400, "INVALID_DOWNLOAD_ID");
  }

  const resolved = path.resolve(convertedDir, fileId);
  if (path.dirname(resolved) !== path.resolve(convertedDir)) {
    throw new AppError("Invalid download link.", 400, "INVALID_DOWNLOAD_ID");
  }
  return resolved;
}
