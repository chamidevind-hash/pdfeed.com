import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { AppError } from "../utils/errors.js";

const execFileAsync = promisify(execFile);

export async function runCommand(command, args, label, options = {}) {
  try {
    return await execFileAsync(command, args, {
      windowsHide: true,
      timeout: 5 * 60 * 1000,
      maxBuffer: 10 * 1024 * 1024,
      ...options,
    });
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new AppError(
        `${label} is not installed or its executable path is not configured.`,
        503,
        "CONVERTER_UNAVAILABLE",
      );
    }

    const detail = error.stderr?.trim() || error.message;
    throw new AppError(
      `${label} conversion failed${detail ? `: ${detail}` : "."}`,
      500,
      "CONVERSION_FAILED",
    );
  }
}
