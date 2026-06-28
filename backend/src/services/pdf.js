import fs from "node:fs/promises";
import path from "node:path";
import { PDFDocument } from "pdf-lib";
import { config, convertedDir } from "../config.js";
import { AppError } from "../utils/errors.js";
import { outputPath, randomFileName, removeFiles } from "../utils/files.js";
import { createZip } from "./archive.js";
import { runCommand } from "./process.js";

export async function mergePdfs(inputPaths) {
  const mergedDocument = await PDFDocument.create();

  for (const inputPath of inputPaths) {
    const sourceBytes = await fs.readFile(inputPath);
    const sourceDocument = await PDFDocument.load(sourceBytes);
    const pages = await mergedDocument.copyPages(
      sourceDocument,
      sourceDocument.getPageIndices(),
    );
    pages.forEach((page) => mergedDocument.addPage(page));
  }

  const destination = outputPath(".pdf");
  await fs.writeFile(destination, await mergedDocument.save());
  return destination;
}

export async function splitPdf(inputPath) {
  const sourceBytes = await fs.readFile(inputPath);
  const sourceDocument = await PDFDocument.load(sourceBytes);
  const pagePaths = [];

  try {
    for (let pageIndex = 0; pageIndex < sourceDocument.getPageCount(); pageIndex += 1) {
      const pageDocument = await PDFDocument.create();
      const [page] = await pageDocument.copyPages(sourceDocument, [pageIndex]);
      pageDocument.addPage(page);

      const pagePath = path.join(convertedDir, randomFileName(".pdf"));
      await fs.writeFile(pagePath, await pageDocument.save());
      pagePaths.push(pagePath);
    }

    const zipPath = outputPath(".zip");
    await createZip(pagePaths, zipPath);
    return zipPath;
  } finally {
    await removeFiles(pagePaths);
  }
}

export async function pdfToJpg(inputPath) {
  const prefix = path.join(convertedDir, randomFileName("").replace(/\.$/, ""));

  await runCommand(
    config.pdftoppmPath,
    ["-jpeg", "-r", "150", inputPath, prefix],
    "Poppler (pdftoppm)",
  );

  const generatedFiles = (await fs.readdir(convertedDir))
    .filter((fileName) => fileName.startsWith(path.basename(prefix)))
    .filter((fileName) => /\.jpe?g$/i.test(fileName))
    .sort()
    .map((fileName) => path.join(convertedDir, fileName));

  if (generatedFiles.length === 0) {
    throw new AppError(
      "Poppler completed without producing any images.",
      500,
      "OUTPUT_MISSING",
    );
  }

  if (generatedFiles.length === 1) {
    const finalPath = outputPath(".jpg");
    await fs.rename(generatedFiles[0], finalPath);
    return finalPath;
  }

  try {
    const zipPath = outputPath(".zip");
    await createZip(generatedFiles, zipPath);
    return zipPath;
  } finally {
    await removeFiles(generatedFiles);
  }
}

function ghostscriptExecutable() {
  if (config.ghostscriptPath) return config.ghostscriptPath;
  return process.platform === "win32" ? "gswin64c" : "gs";
}

export async function compressPdf(inputPath) {
  const destination = outputPath(".pdf");

  try {
    await runCommand(
      ghostscriptExecutable(),
      [
        "-sDEVICE=pdfwrite",
        "-dCompatibilityLevel=1.4",
        "-dPDFSETTINGS=/ebook",
        "-dNOPAUSE",
        "-dQUIET",
        "-dBATCH",
        `-sOutputFile=${destination}`,
        inputPath,
      ],
      "Ghostscript",
    );
    return destination;
  } catch (error) {
    await removeFiles([destination]);
    if (error.code === "CONVERTER_UNAVAILABLE") {
      throw new AppError(
        "PDF compression requires Ghostscript. Install it and set GHOSTSCRIPT_PATH if it is not on PATH.",
        503,
        "GHOSTSCRIPT_REQUIRED",
      );
    }
    throw error;
  }
}
