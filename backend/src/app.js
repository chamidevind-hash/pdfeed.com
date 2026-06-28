import cors from "cors";
import express from "express";
import helmet from "helmet";
import multer from "multer";
import { config } from "./config.js";
import convertRoutes from "./routes/convert.js";
import downloadRoutes from "./routes/download.js";
import { AppError } from "./utils/errors.js";

export const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(helmet());
app.use(
  cors({
    origin: config.frontendUrl,
    methods: ["GET", "POST"],
  }),
);
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/convert", convertRoutes);
app.use("/api/download", downloadRoutes);

app.use((_req, _res, next) => {
  next(new AppError("Route not found.", 404, "NOT_FOUND"));
});

app.use((error, _req, res, _next) => {
  if (error instanceof multer.MulterError) {
    const message =
      error.code === "LIMIT_FILE_SIZE"
        ? "File is too large. The maximum upload size is 25MB per file."
        : error.code === "LIMIT_FILE_COUNT"
          ? "Too many files were uploaded."
          : "The uploaded file is not supported.";
    res.status(400).json({ error: message, code: error.code });
    return;
  }

  const status = error.status || 500;
  const message =
    status >= 500 && !error.status
      ? "An unexpected conversion error occurred."
      : error.message;

  if (status >= 500) console.error(error);
  res.status(status).json({
    error: message,
    code: error.code || "INTERNAL_ERROR",
    ...(error.quota ? { quota: error.quota } : {}),
  });
});
