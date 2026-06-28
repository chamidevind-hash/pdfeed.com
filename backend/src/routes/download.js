import fs from "node:fs/promises";
import express from "express";
import path from "node:path";
import { asyncHandler, AppError } from "../utils/errors.js";
import { resolveDownloadFile } from "../utils/files.js";

const router = express.Router();

router.get(
  "/:fileId",
  asyncHandler(async (req, res) => {
    const filePath = resolveDownloadFile(req.params.fileId);

    try {
      await fs.access(filePath);
    } catch {
      throw new AppError(
        "This file has expired or does not exist.",
        404,
        "FILE_NOT_FOUND",
      );
    }

    const requestedName = path.basename(
      String(req.query.name || req.params.fileId),
    );
    res.download(filePath, requestedName);
  }),
);

export default router;
