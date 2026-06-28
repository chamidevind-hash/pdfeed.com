import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config, convertedDir } from "../config.js";
import { AppError } from "../utils/errors.js";
import { outputPath, removeFiles } from "../utils/files.js";
import { convertPdfToDocxWithLibreOffice } from "./office.js";
import { runCommand } from "./process.js";

const currentFile = fileURLToPath(import.meta.url);
const pythonScript = path.resolve(
  path.dirname(currentFile),
  "../../python/pdf_to_word.py",
);
const validProviders = new Set([
  "auto",
  "convertapi",
  "pdf2docx",
  "libreoffice",
  "fallback",
]);

async function assertDocx(filePath, providerName) {
  try {
    const file = await fs.open(filePath, "r");
    try {
      const signature = Buffer.alloc(2);
      await file.read(signature, 0, 2, 0);
      const stats = await file.stat();
      if (signature.toString("ascii") !== "PK" || stats.size === 0) {
        throw new Error("Invalid DOCX");
      }
    } finally {
      await file.close();
    }
  } catch {
    throw new AppError(
      `${providerName} did not produce a valid DOCX file.`,
      500,
      "OUTPUT_INVALID",
    );
  }
}

async function convertWithPython(inputPath, mode) {
  const destination = outputPath(".docx");
  try {
    await runCommand(
      config.pythonPath,
      [pythonScript, "--mode", mode, inputPath, destination],
      mode === "pdf2docx" ? "pdf2docx" : "Open-source PDF parser",
    );
    await assertDocx(
      destination,
      mode === "pdf2docx" ? "pdf2docx" : "Open-source PDF parser",
    );
    return destination;
  } catch (error) {
    await removeFiles([destination]);
    throw error;
  }
}

async function convertWithConvertApi(inputPath) {
  if (!config.convertApiToken) {
    throw new AppError(
      "ConvertAPI is not configured.",
      503,
      "CONVERTAPI_NOT_CONFIGURED",
    );
  }

  const source = await fs.readFile(inputPath);
  const body = new FormData();
  body.append("File", new Blob([source], { type: "application/pdf" }), "input.pdf");

  let response;
  try {
    response = await fetch(config.convertApiBaseUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.convertApiToken}`,
      },
      body,
      signal: AbortSignal.timeout(5 * 60 * 1000),
    });
  } catch (error) {
    throw new AppError(
      `ConvertAPI request failed: ${error.message}`,
      502,
      "CONVERTAPI_REQUEST_FAILED",
    );
  }

  if (!response.ok) {
    const detail = (await response.text()).slice(0, 500);
    throw new AppError(
      `ConvertAPI rejected the conversion (${response.status})${detail ? `: ${detail}` : "."}`,
      502,
      "CONVERTAPI_FAILED",
    );
  }

  const contentType = response.headers.get("content-type") || "";
  let outputBytes;

  if (
    contentType.includes(
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ) ||
    contentType.includes("application/octet-stream")
  ) {
    outputBytes = Buffer.from(await response.arrayBuffer());
  } else {
    const payload = await response.json();
    const convertedFile = payload.Files?.[0];
    if (convertedFile?.FileData) {
      outputBytes = Buffer.from(convertedFile.FileData, "base64");
    } else if (convertedFile?.Url) {
      const downloadResponse = await fetch(convertedFile.Url, {
        signal: AbortSignal.timeout(5 * 60 * 1000),
      });
      if (!downloadResponse.ok) {
        throw new AppError(
          "ConvertAPI created the DOCX but its download failed.",
          502,
          "CONVERTAPI_DOWNLOAD_FAILED",
        );
      }
      outputBytes = Buffer.from(await downloadResponse.arrayBuffer());
    } else {
      throw new AppError(
        "ConvertAPI returned no downloadable DOCX.",
        502,
        "CONVERTAPI_OUTPUT_MISSING",
      );
    }
  }

  const destination = outputPath(".docx");
  try {
    await fs.writeFile(destination, outputBytes);
    await assertDocx(destination, "ConvertAPI");
    return destination;
  } catch (error) {
    await removeFiles([destination]);
    throw error;
  }
}

const providers = {
  convertapi: convertWithConvertApi,
  pdf2docx: (inputPath) => convertWithPython(inputPath, "pdf2docx"),
  libreoffice: convertPdfToDocxWithLibreOffice,
  fallback: (inputPath) => convertWithPython(inputPath, "fallback"),
};

function providerOrder() {
  if (!validProviders.has(config.pdfToWordProvider)) {
    throw new AppError(
      `Invalid PDF_TO_WORD_PROVIDER value: ${config.pdfToWordProvider}`,
      500,
      "INVALID_PROVIDER_CONFIG",
    );
  }

  if (config.pdfToWordProvider !== "auto") {
    return [config.pdfToWordProvider];
  }

  return [
    ...(config.convertApiToken ? ["convertapi"] : []),
    "pdf2docx",
    "libreoffice",
    "fallback",
  ];
}

export async function convertPdfToDocx(inputPath) {
  const failures = [];

  for (const providerName of providerOrder()) {
    try {
      return await providers[providerName](inputPath);
    } catch (error) {
      failures.push(`${providerName}: ${error.message}`);
    }
  }

  throw new AppError(
    `PDF to Word conversion failed. ${failures.join(" | ")}`,
    503,
    "PDF_TO_WORD_UNAVAILABLE",
  );
}
