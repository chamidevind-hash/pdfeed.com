import fs from "node:fs/promises";
import path from "node:path";
import { config, convertedDir, uploadsDir } from "../config.js";

async function cleanDirectory(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const cutoff = Date.now() - config.fileTtlMs;

  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);
      const stats = await fs.stat(entryPath);
      if (stats.mtimeMs < cutoff) {
        await fs.rm(entryPath, { recursive: true, force: true });
      }
    }),
  );
}

export async function deleteExpiredFiles() {
  await Promise.all([
    cleanDirectory(uploadsDir),
    cleanDirectory(convertedDir),
  ]);
}

export function startCleanupJob() {
  const timer = setInterval(() => {
    deleteExpiredFiles().catch((error) => {
      console.error("Temporary file cleanup failed:", error);
    });
  }, config.cleanupIntervalMs);
  timer.unref();
  return timer;
}
