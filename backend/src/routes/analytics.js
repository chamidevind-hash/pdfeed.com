import crypto from "node:crypto";
import express from "express";
import { config } from "../config.js";
import {
  getAnalyticsOverview,
  getAnalyticsSummary,
  getDailyUsage,
  getFailures,
  getFileSizeBuckets,
  getTopTools,
  parseAnalyticsRange,
  recordAnalyticsEvent,
} from "../services/analytics.js";
import { asyncHandler, AppError } from "../utils/errors.js";
import { isValidConverterSlug } from "../utils/converters.js";

const router = express.Router();
const adminRouter = express.Router();

function timingSafeTokenEqual(actual, expected) {
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length) return false;
  return crypto.timingSafeEqual(actualBuffer, expectedBuffer);
}

function requireAnalyticsToken(req, _res, next) {
  const header = req.get("authorization") || "";
  if (!header.startsWith("Bearer ")) {
    next(new AppError("Analytics admin token is required.", 401, "ADMIN_TOKEN_REQUIRED"));
    return;
  }

  const token = header.slice("Bearer ".length).trim();
  const expectedToken = process.env.ANALYTICS_ADMIN_TOKEN || config.analyticsAdminToken;
  if (!expectedToken || !timingSafeTokenEqual(token, expectedToken)) {
    next(new AppError("Analytics admin token is invalid.", 403, "ADMIN_TOKEN_INVALID"));
    return;
  }

  next();
}

function requestedRange(req) {
  const range = parseAnalyticsRange(req.query.range || req.query.days || "30d");
  if (!range) {
    throw new AppError(
      "Invalid analytics range. Use today, 7d, 30d, 90d, or all.",
      400,
      "INVALID_ANALYTICS_RANGE",
    );
  }
  return range;
}

router.post(
  "/page-view",
  asyncHandler(async (req, res) => {
    const payload = req.body && typeof req.body === "object" ? req.body : {};
    const keys = Object.keys(payload);
    if (keys.length !== 1 || keys[0] !== "toolSlug") {
      throw new AppError("Invalid analytics payload.", 400, "INVALID_ANALYTICS_PAYLOAD");
    }

    const toolSlug = String(payload.toolSlug || "").trim().toLowerCase();
    if (!isValidConverterSlug(toolSlug)) {
      throw new AppError("Invalid converter slug.", 400, "INVALID_TOOL_SLUG");
    }

    recordAnalyticsEvent({
      eventType: "page_view",
      toolSlug,
    });

    res.status(204).end();
  }),
);

adminRouter.use(requireAnalyticsToken);

adminRouter.get("/summary", asyncHandler(async (req, res) => {
  const range = requestedRange(req);
  res.json({
    range,
    overview: getAnalyticsOverview(),
    summary: getAnalyticsSummary(range),
  });
}));

adminRouter.get("/daily", asyncHandler(async (req, res) => {
  const range = requestedRange(req);
  res.json({ range, daily: getDailyUsage(range) });
}));

adminRouter.get("/tools", asyncHandler(async (req, res) => {
  const range = requestedRange(req);
  res.json({ range, tools: getTopTools(range) });
}));

adminRouter.get("/failures", asyncHandler(async (req, res) => {
  const range = requestedRange(req);
  res.json({ range, failures: getFailures(range) });
}));

adminRouter.get("/file-sizes", asyncHandler(async (req, res) => {
  const range = requestedRange(req);
  res.json({ range, fileSizeBuckets: getFileSizeBuckets(range) });
}));

export { adminRouter };
export default router;
