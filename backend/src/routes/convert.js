import express from "express";
import path from "node:path";
import {
  commitConversion,
  conversionLimit,
} from "../middleware/conversion-limit.js";
import { upload } from "../middleware/upload.js";
import { imagesToPdf } from "../services/images.js";
import { convertOfficeToPdf } from "../services/office.js";
import { convertPdfToDocx } from "../services/pdf-to-word.js";
import {
  compressPdf,
  mergePdfs,
  pdfToJpg,
  splitPdf,
} from "../services/pdf.js";
import { asyncHandler, AppError } from "../utils/errors.js";
import { quotaForIp } from "../services/conversion-limit.js";
import {
  assertExtension,
  downloadPayload,
  removeFiles,
  safeOriginalName,
} from "../utils/files.js";

const router = express.Router();

router.get("/quota", (req, res) => {
  res.json({ quota: quotaForIp(req.ip) });
});

function extensionForResult(filePath) {
  return path.extname(filePath).toLowerCase();
}

function singleFileRoute(
  fieldName,
  expectedExtensions,
  converter,
  resultName,
) {
  return [
    conversionLimit,
    upload.single(fieldName),
    asyncHandler(async (req, res) => {
      if (!req.file) {
        throw new AppError("Please select a file to upload.", 400, "FILE_REQUIRED");
      }

      try {
        assertExtension(req.file, expectedExtensions);
        const output = await converter(req.file.path);
        const sourceName = safeOriginalName(req.file.originalname);
        const downloadName =
          typeof resultName === "function"
            ? resultName(sourceName, output)
            : `${sourceName}${resultName}`;
        const quota = commitConversion(req, res);
        res.json({ ...downloadPayload(output, downloadName), quota });
      } finally {
        await removeFiles([req.file.path]);
      }
    }),
  ];
}

router.post(
  "/word-to-pdf",
  ...singleFileRoute(
    "file",
    [".doc", ".docx"],
    convertOfficeToPdf,
    "-converted.pdf",
  ),
);

router.post(
  "/excel-to-pdf",
  ...singleFileRoute(
    "file",
    [".xls", ".xlsx"],
    convertOfficeToPdf,
    "-converted.pdf",
  ),
);

router.post(
  "/pdf-to-jpg",
  ...singleFileRoute(
    "file",
    [".pdf"],
    pdfToJpg,
    (name, output) =>
      `${name}-images${extensionForResult(output) === ".zip" ? ".zip" : ".jpg"}`,
  ),
);

router.post(
  "/split-pdf",
  ...singleFileRoute("file", [".pdf"], splitPdf, "-split-pages.zip"),
);

router.post(
  "/compress-pdf",
  ...singleFileRoute("file", [".pdf"], compressPdf, "-compressed.pdf"),
);

router.post(
  "/jpg-to-pdf",
  conversionLimit,
  upload.array("files", 20),
  asyncHandler(async (req, res) => {
    const files = req.files || [];
    if (files.length === 0) {
      throw new AppError(
        "Please select at least one image.",
        400,
        "FILE_REQUIRED",
      );
    }

    try {
      files.forEach((file) =>
        assertExtension(file, [".jpg", ".jpeg", ".png"]),
      );
      const output = await imagesToPdf(files.map((file) => file.path));
      const quota = commitConversion(req, res);
      res.json({
        ...downloadPayload(output, "images-converted.pdf"),
        quota,
      });
    } finally {
      await removeFiles(files.map((file) => file.path));
    }
  }),
);

router.post(
  "/merge-pdf",
  conversionLimit,
  upload.array("files", 20),
  asyncHandler(async (req, res) => {
    const files = req.files || [];
    if (files.length < 2) {
      throw new AppError(
        "Please select at least two PDF files.",
        400,
        "MULTIPLE_FILES_REQUIRED",
      );
    }

    try {
      files.forEach((file) => assertExtension(file, [".pdf"]));
      const output = await mergePdfs(files.map((file) => file.path));
      const quota = commitConversion(req, res);
      res.json({
        ...downloadPayload(output, "merged-document.pdf"),
        quota,
      });
    } finally {
      await removeFiles(files.map((file) => file.path));
    }
  }),
);

router.post(
  "/pdf-to-word",
  ...singleFileRoute(
    "file",
    [".pdf"],
    convertPdfToDocx,
    "-converted.docx",
  ),
);

export default router;
