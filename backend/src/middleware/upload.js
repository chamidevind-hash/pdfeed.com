import path from "node:path";
import multer from "multer";
import { config, uploadsDir } from "../config.js";
import { allowedExtensions, randomFileName } from "../utils/files.js";

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, uploadsDir),
  filename: (_req, file, callback) => {
    callback(null, randomFileName(path.extname(file.originalname)));
  },
});

function fileFilter(_req, file, callback) {
  const extension = path.extname(file.originalname).toLowerCase();
  if (!allowedExtensions.has(extension)) {
    callback(
      new multer.MulterError(
        "LIMIT_UNEXPECTED_FILE",
        `Unsupported file type: ${extension || "unknown"}`,
      ),
    );
    return;
  }
  callback(null, true);
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.maxFileSize,
    files: 20,
  },
});
