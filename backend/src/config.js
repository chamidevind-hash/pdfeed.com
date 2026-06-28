import path from "node:path";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const srcDir = path.dirname(currentFile);

export const backendDir = path.resolve(srcDir, "..");
export const uploadsDir = path.join(backendDir, "uploads");
export const convertedDir = path.join(backendDir, "converted");

export const config = {
  port: Number(process.env.PORT || 4000),
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  maxFileSize: 25 * 1024 * 1024,
  fileTtlMs: Number(process.env.FILE_TTL_MS || 60 * 60 * 1000),
  cleanupIntervalMs: Number(
    process.env.CLEANUP_INTERVAL_MS || 60 * 60 * 1000,
  ),
  dailyConversionLimit: Number(process.env.DAILY_CONVERSION_LIMIT || 10),
  conversionLimitWindowMs: Number(
    process.env.CONVERSION_LIMIT_WINDOW_MS || 24 * 60 * 60 * 1000,
  ),
  libreOfficePath: process.env.LIBREOFFICE_PATH || "libreoffice",
  pdftoppmPath: process.env.PDFTOPPM_PATH || "pdftoppm",
  ghostscriptPath: process.env.GHOSTSCRIPT_PATH || "",
  pdfToWordProvider: (process.env.PDF_TO_WORD_PROVIDER || "auto").toLowerCase(),
  pythonPath: process.env.PYTHON_PATH || "python",
  convertApiToken: process.env.CONVERTAPI_TOKEN || "",
  convertApiBaseUrl:
    process.env.CONVERTAPI_BASE_URL ||
    "https://v2.convertapi.com/convert/pdf/to/docx",
};
