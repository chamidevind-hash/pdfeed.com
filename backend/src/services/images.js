import fs from "node:fs/promises";
import { PDFDocument } from "pdf-lib";
import sharp from "sharp";
import { AppError } from "../utils/errors.js";
import { outputPath } from "../utils/files.js";

export async function imagesToPdf(imagePaths) {
  const document = await PDFDocument.create();

  for (const imagePath of imagePaths) {
    const normalizedImage = await sharp(imagePath)
      .rotate()
      .flatten({ background: "#ffffff" })
      .png()
      .toBuffer();
    const embeddedImage = await document.embedPng(normalizedImage);
    const { width, height } = embeddedImage.scale(1);

    const maxWidth = 595.28;
    const maxHeight = 841.89;
    const scale = Math.min(maxWidth / width, maxHeight / height, 1);
    const pageWidth = width * scale;
    const pageHeight = height * scale;
    const page = document.addPage([pageWidth, pageHeight]);

    page.drawImage(embeddedImage, {
      x: 0,
      y: 0,
      width: pageWidth,
      height: pageHeight,
    });
  }

  const destination = outputPath(".pdf");
  await fs.writeFile(destination, await document.save());
  return destination;
}

function safeQuality(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return fallback;
  return Math.min(Math.max(parsed, 1), 100);
}

function imagePipeline(inputPath) {
  return sharp(inputPath, { failOn: "error" }).rotate();
}

async function writeImage(pipeline, destination, format, quality) {
  if (format === "jpg" || format === "jpeg") {
    await pipeline
      .flatten({ background: "#ffffff" })
      .jpeg({ quality, mozjpeg: true })
      .toFile(destination);
    return;
  }

  if (format === "png") {
    await pipeline.png({ quality, compressionLevel: 9 }).toFile(destination);
    return;
  }

  if (format === "webp") {
    await pipeline.webp({ quality }).toFile(destination);
    return;
  }

  throw new Error(`Unsupported output format: ${format}`);
}

export async function convertImageFormat(inputPath, format, options = {}) {
  const normalizedFormat = format === "jpeg" ? "jpg" : format;
  const destination = outputPath(`.${normalizedFormat}`);
  const quality = safeQuality(options.quality, 92);

  await writeImage(
    imagePipeline(inputPath),
    destination,
    normalizedFormat,
    quality,
  );

  return destination;
}

export async function compressImage(inputPath, options = {}) {
  const metadata = await sharp(inputPath).metadata();
  const format = metadata.format === "jpeg" ? "jpg" : metadata.format;
  const outputFormat = ["jpg", "png", "webp"].includes(format) ? format : "jpg";
  const destination = outputPath(`.${outputFormat}`);
  const quality = safeQuality(options.quality, 80);
  const originalSize = (await fs.stat(inputPath)).size;

  await writeImage(imagePipeline(inputPath), destination, outputFormat, quality);

  const convertedSize = (await fs.stat(destination)).size;
  const savedPercent =
    originalSize > 0
      ? Math.max(0, Math.round(((originalSize - convertedSize) / originalSize) * 100))
      : 0;

  return {
    filePath: destination,
    metadata: {
      originalSize,
      convertedSize,
      savedPercent,
    },
  };
}

export async function resizeImage(inputPath, options = {}) {
  const width = Number.parseInt(options.width, 10);
  const height = Number.parseInt(options.height, 10);
  const preserveAspectRatio = options.preserveAspectRatio !== "false";
  const allowUpscale = options.allowUpscale === "true";

  if (
    (!Number.isFinite(width) || width <= 0) &&
    (!Number.isFinite(height) || height <= 0)
  ) {
    throw new AppError("Enter a valid width or height.", 400, "INVALID_DIMENSIONS");
  }

  const metadata = await sharp(inputPath).metadata();
  const format = metadata.format === "jpeg" ? "jpg" : metadata.format;
  const outputFormat = ["jpg", "png", "webp"].includes(format) ? format : "jpg";
  const destination = outputPath(`.${outputFormat}`);

  const resizeOptions = {
    width: Number.isFinite(width) && width > 0 ? width : undefined,
    height: Number.isFinite(height) && height > 0 ? height : undefined,
    fit: preserveAspectRatio ? "inside" : "fill",
    withoutEnlargement: !allowUpscale,
  };

  await writeImage(
    imagePipeline(inputPath).resize(resizeOptions),
    destination,
    outputFormat,
    safeQuality(options.quality, 92),
  );

  return destination;
}
