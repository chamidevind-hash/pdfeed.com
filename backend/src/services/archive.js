import fs from "node:fs";
import archiver from "archiver";
import { AppError } from "../utils/errors.js";

export function createZip(filePaths, destinationPath) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(destinationPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", resolve);
    output.on("error", reject);
    archive.on("warning", (error) => {
      if (error.code !== "ENOENT") reject(error);
    });
    archive.on("error", (error) => {
      reject(
        new AppError(
          `Could not create the download archive: ${error.message}`,
          500,
          "ARCHIVE_FAILED",
        ),
      );
    });

    archive.pipe(output);
    for (const [index, filePath] of filePaths.entries()) {
      const extension = filePath.split(".").pop();
      archive.file(filePath, {
        name: `page-${String(index + 1).padStart(2, "0")}.${extension}`,
      });
    }
    archive.finalize();
  });
}
