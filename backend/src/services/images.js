import fs from "node:fs/promises";
import { PDFDocument } from "pdf-lib";
import sharp from "sharp";
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
