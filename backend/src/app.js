import cors from "cors";
import express from "express";
import helmet from "helmet";
import multer from "multer";
import { config } from "./config.js";
import analyticsRoutes, { adminRouter as analyticsAdminRoutes } from "./routes/analytics.js";
import convertRoutes from "./routes/convert.js";
import downloadRoutes from "./routes/download.js";
import {
  initializeAnalytics,
  normalizeAnalyticsErrorCode,
  recordAnalyticsEvent,
} from "./services/analytics.js";
import { AppError } from "./utils/errors.js";
import { isValidConverterSlug } from "./utils/converters.js";

export const app = express();

try {
  initializeAnalytics();
} catch (error) {
  console.error("Analytics initialization failed:", error.message);
}

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
app.use("/api/analytics", analyticsRoutes);
app.use("/api/admin/analytics", analyticsAdminRoutes);
app.use("/api/download", downloadRoutes);

app.use((_req, _res, next) => {
  next(new AppError("Route not found.", 404, "NOT_FOUND"));
});

app.use((error, _req, res, _next) => {
  const convertMatch = _req.path.match(/^\/api\/convert\/([a-z0-9-]+)/);
  if (!error.analyticsRecorded && convertMatch && isValidConverterSlug(convertMatch[1])) {
    recordAnalyticsEvent({
      eventType: "conversion_failed",
      toolSlug: convertMatch[1],
      errorCode: normalizeAnalyticsErrorCode(error),
    });
  }

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
