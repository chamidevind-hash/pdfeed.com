import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { config, convertedDir } from "../config.js";
import { AppError } from "../utils/errors.js";
import { randomFileName, removeFiles } from "../utils/files.js";
import { runCommand } from "./process.js";

export async function convertOfficeToPdf(inputPath) {
  try {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "pdfeed-office-"));

    try {
      await runCommand(
        config.libreOfficePath,
        [
          "--headless",
          "--convert-to",
          "pdf",
          "--outdir",
          tempDir,
          inputPath,
        ],
        "LibreOffice",
      );

      const generatedPath = path.join(
        tempDir,
        `${path.basename(inputPath, path.extname(inputPath))}.pdf`,
      );

      try {
        await fs.access(generatedPath);
      } catch {
        throw new AppError(
          "LibreOffice completed without producing a PDF.",
          500,
          "OUTPUT_MISSING",
        );
      }

      const finalPath = path.join(convertedDir, randomFileName(".pdf"));
      await fs.rename(generatedPath, finalPath);
      return finalPath;
    } finally {
      await removeFiles([tempDir]);
    }
  } catch (error) {
    if (error.code === "CONVERTER_UNAVAILABLE") {
      throw new AppError(
        "Office conversion requires LibreOffice. Install it and set LIBREOFFICE_PATH if it is not on PATH.",
        503,
        "LIBREOFFICE_REQUIRED",
      );
    }
    throw error;
  }
}

export async function convertPdfToDocxWithLibreOffice(inputPath) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "pdfeed-pdf-word-"));

  try {
    await runCommand(
      config.libreOfficePath,
      [
        "--headless",
        "--infilter=writer_pdf_import",
        "--convert-to",
        "docx:Office Open XML Text",
        "--outdir",
        tempDir,
        inputPath,
      ],
      "LibreOffice PDF import",
    );

    const generatedPath = path.join(
      tempDir,
      `${path.basename(inputPath, path.extname(inputPath))}.docx`,
    );

    try {
      const stats = await fs.stat(generatedPath);
      if (stats.size === 0) throw new Error("Empty DOCX");
    } catch {
      throw new AppError(
        "LibreOffice could not import this PDF as an editable Word document.",
        500,
        "OUTPUT_MISSING",
      );
    }

    const finalPath = path.join(convertedDir, randomFileName(".docx"));
    await fs.rename(generatedPath, finalPath);
    return finalPath;
  } finally {
    await removeFiles([tempDir]);
  }
}
