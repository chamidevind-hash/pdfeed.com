import express from "express";
import path from "node:path";
import {
  commitConversion,
  conversionLimit,
} from "../middleware/conversion-limit.js";
import { upload } from "../middleware/upload.js";
import {
  compressImage,
  convertImageFormat,
  imagesToPdf,
  resizeImage,
} from "../services/images.js";
import { convertOfficeToPdf } from "../services/office.js";
import { convertPdfToDocx } from "../services/pdf-to-word.js";
import {
  compressPdf,
  mergePdfs,
  pdfToJpg,
  splitPdf,
} from "../services/pdf.js";
import { textToPdf } from "../services/text.js";
import { asyncHandler, AppError } from "../utils/errors.js";
import { quotaForIp } from "../services/conversion-limit.js";
import {
  assertFileType,
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

function normalizeConversionOutput(output) {
  if (typeof output === "string") return { filePath: output };
  return output;
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
        assertFileType(req.file, expectedExtensions);
        const output = normalizeConversionOutput(
          await converter(req.file.path, req.body || {}),
        );
        const sourceName = safeOriginalName(req.file.originalname);
        const downloadName =
          typeof resultName === "function"
            ? resultName(sourceName, output.filePath)
            : `${sourceName}${resultName}`;
        const quota = commitConversion(req, res);
        await removeFiles([req.file.path]);
        res.json({
          ...downloadPayload(output.filePath, downloadName),
          ...(output.metadata ? { metadata: output.metadata } : {}),
          quota,
        });
      } finally {
        await removeFiles([req.file.path]);
      }
    }),
  ];
}

const singleFileConverters = [
  {
    slug: "word-to-pdf",
    expectedExtensions: [".doc", ".docx"],
    converter: convertOfficeToPdf,
    resultName: "-converted.pdf",
  },
  {
    slug: "excel-to-pdf",
    expectedExtensions: [".xls", ".xlsx"],
    converter: convertOfficeToPdf,
    resultName: "-converted.pdf",
  },
  {
    slug: "powerpoint-to-pdf",
    expectedExtensions: [".ppt", ".pptx"],
    converter: convertOfficeToPdf,
    resultName: "-converted.pdf",
  },
  {
    slug: "txt-to-pdf",
    expectedExtensions: [".txt"],
    converter: textToPdf,
    resultName: "-converted.pdf",
  },
  {
    slug: "pdf-to-jpg",
    expectedExtensions: [".pdf"],
    converter: pdfToJpg,
    resultName: (name, output) =>
      `${name}-images${extensionForResult(output) === ".zip" ? ".zip" : ".jpg"}`,
  },
  {
    slug: "split-pdf",
    expectedExtensions: [".pdf"],
    converter: splitPdf,
    resultName: "-split-pages.zip",
  },
  {
    slug: "compress-pdf",
    expectedExtensions: [".pdf"],
    converter: compressPdf,
    resultName: "-compressed.pdf",
  },
  {
    slug: "pdf-to-word",
    expectedExtensions: [".pdf"],
    converter: convertPdfToDocx,
    resultName: "-converted.docx",
  },
  {
    slug: "png-to-jpg",
    expectedExtensions: [".png"],
    converter: (inputPath) => convertImageFormat(inputPath, "jpg"),
    resultName: "-converted.jpg",
  },
  {
    slug: "jpg-to-png",
    expectedExtensions: [".jpg", ".jpeg"],
    converter: (inputPath) => convertImageFormat(inputPath, "png"),
    resultName: "-converted.png",
  },
  {
    slug: "webp-to-jpg",
    expectedExtensions: [".webp"],
    converter: (inputPath) => convertImageFormat(inputPath, "jpg"),
    resultName: "-converted.jpg",
  },
  {
    slug: "webp-to-png",
    expectedExtensions: [".webp"],
    converter: (inputPath) => convertImageFormat(inputPath, "png"),
    resultName: "-converted.png",
  },
  {
    slug: "jpg-to-webp",
    expectedExtensions: [".jpg", ".jpeg"],
    converter: (inputPath) => convertImageFormat(inputPath, "webp"),
    resultName: "-converted.webp",
  },
  {
    slug: "png-to-webp",
    expectedExtensions: [".png"],
    converter: (inputPath) => convertImageFormat(inputPath, "webp"),
    resultName: "-converted.webp",
  },
  {
    slug: "compress-image",
    expectedExtensions: [".jpg", ".jpeg", ".png", ".webp"],
    converter: compressImage,
    resultName: (name, output) => `${name}-compressed${extensionForResult(output)}`,
  },
  {
    slug: "resize-image",
    expectedExtensions: [".jpg", ".jpeg", ".png", ".webp"],
    converter: resizeImage,
    resultName: (name, output) => `${name}-resized${extensionForResult(output)}`,
  },
];

function multiFileRoute({
  expectedExtensions,
  minimumFiles,
  requiredMessage,
  requiredCode,
  converter,
  outputName,
}) {
  return [
    conversionLimit,
    upload.array("files", 20),
    asyncHandler(async (req, res) => {
    const files = req.files || [];
    if (files.length < minimumFiles) {
      throw new AppError(requiredMessage, 400, requiredCode);
    }

    try {
      files.forEach((file) =>
        assertFileType(file, expectedExtensions),
      );
      const output = await converter(files.map((file) => file.path));
      const quota = commitConversion(req, res);
      await removeFiles(files.map((file) => file.path));
      res.json({
        ...downloadPayload(output, outputName),
        quota,
      });
    } finally {
      await removeFiles(files.map((file) => file.path));
    }
    }),
  ];
}

const multiFileConverters = [
  {
    slug: "jpg-to-pdf",
    expectedExtensions: [".jpg", ".jpeg", ".png"],
    minimumFiles: 1,
    requiredMessage: "Please select at least one image.",
    requiredCode: "FILE_REQUIRED",
    converter: imagesToPdf,
    outputName: "images-converted.pdf",
  },
  {
    slug: "merge-pdf",
    expectedExtensions: [".pdf"],
    minimumFiles: 2,
    requiredMessage: "Please select at least two PDF files.",
    requiredCode: "MULTIPLE_FILES_REQUIRED",
    converter: mergePdfs,
    outputName: "merged-document.pdf",
  },
];

for (const converter of singleFileConverters) {
  router.post(
    `/${converter.slug}`,
    ...singleFileRoute(
      "file",
      converter.expectedExtensions,
      converter.converter,
      converter.resultName,
    ),
  );
}

for (const converter of multiFileConverters) {
  router.post(`/${converter.slug}`, ...multiFileRoute(converter));
}

export default router;
