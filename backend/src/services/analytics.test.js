import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { after, before, describe, it } from "node:test";

const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "pdfeed-analytics-test-"));
const analyticsDbPath = path.join(tempDir, "analytics.db");

process.env.ANALYTICS_DB_PATH = analyticsDbPath;
process.env.ANALYTICS_ADMIN_TOKEN = "test-admin-token";
process.env.DAILY_CONVERSION_LIMIT = "100";

const analytics = await import("./analytics.js");

describe("analytics service", () => {
  before(() => {
    analytics.initializeAnalytics({ dbPath: analyticsDbPath });
  });

  after(async () => {
    analytics.closeAnalytics();
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it("initializes the database with privacy-safe columns", () => {
    const columns = analytics.getStoredColumnNames();

    assert.ok(columns.includes("created_at"));
    assert.ok(columns.includes("event_type"));
    assert.ok(columns.includes("tool_slug"));
    assert.ok(columns.includes("file_size_bytes"));
    assert.ok(columns.includes("duration_ms"));
    assert.ok(columns.includes("error_code"));
    assert.ok(!columns.includes("filename"));
    assert.ok(!columns.includes("original_filename"));
    assert.ok(!columns.includes("uploaded_path"));
    assert.ok(!columns.includes("ip_address"));
    assert.ok(!columns.includes("user_agent"));
    assert.ok(!columns.includes("cookie"));
  });

  it("records page views and conversion lifecycle events", () => {
    assert.equal(
      analytics.recordAnalyticsEvent({
        eventType: "page_view",
        toolSlug: "png-to-jpg",
      }),
      true,
    );
    assert.equal(
      analytics.recordAnalyticsEvent({
        eventType: "conversion_started",
        toolSlug: "png-to-jpg",
        fileSizeBytes: 500000,
      }),
      true,
    );
    assert.equal(
      analytics.recordAnalyticsEvent({
        eventType: "conversion_success",
        toolSlug: "png-to-jpg",
        fileSizeBytes: 500000,
        durationMs: 120,
      }),
      true,
    );
    assert.equal(
      analytics.recordAnalyticsEvent({
        eventType: "conversion_failed",
        toolSlug: "jpg-to-png",
        fileSizeBytes: 2000000,
        durationMs: 45,
        errorCode: "INVALID_FILE_TYPE",
      }),
      true,
    );

    const summary = analytics.getAnalyticsSummary("30d");
    assert.equal(summary.pageViews, 1);
    assert.equal(summary.conversions, 1);
    assert.equal(summary.successes, 1);
    assert.equal(summary.failures, 1);
    assert.equal(summary.successRate, 50);
    assert.equal(summary.averageDurationMs, 120);
  });

  it("aggregates top tools and failures", () => {
    const tools = analytics.getTopTools("30d");
    const pngTool = tools.find((tool) => tool.toolSlug === "png-to-jpg");

    assert.equal(pngTool.views, 1);
    assert.equal(pngTool.conversionStarts, 1);
    assert.equal(pngTool.successes, 1);

    const failures = analytics.getFailures("30d");
    assert.deepEqual(failures[0], {
      toolSlug: "jpg-to-png",
      errorCode: "INVALID_FILE_TYPE",
      count: 1,
    });
  });

  it("returns daily usage and file size buckets", () => {
    assert.ok(analytics.getDailyUsage("30d").length >= 1);
    assert.ok(
      analytics
        .getFileSizeBuckets("30d")
        .some((bucket) => bucket.bucket === "Under 1 MB"),
    );
  });

  it("stores conversion duration in tool aggregates", () => {
    const tools = analytics.getTopTools("30d");
    const pngTool = tools.find((tool) => tool.toolSlug === "png-to-jpg");

    assert.equal(pngTool.averageDurationMs, 120);
  });

  it("groups larger uploads into file size buckets", () => {
    analytics.recordAnalyticsEvent({
      eventType: "conversion_started",
      toolSlug: "resize-image",
      fileSizeBytes: 2 * 1024 * 1024,
    });

    assert.ok(
      analytics
        .getFileSizeBuckets("30d")
        .some((bucket) => bucket.bucket === "1-5 MB"),
    );
  });

  it("ignores unsupported event types", () => {
    assert.equal(
      analytics.recordAnalyticsEvent({
        eventType: "filename_uploaded",
        toolSlug: "png-to-jpg",
      }),
      false,
    );
  });

  it("accepts only the documented analytics ranges", () => {
    assert.equal(analytics.parseAnalyticsRange("today"), "today");
    assert.equal(analytics.parseAnalyticsRange("7d"), "7d");
    assert.equal(analytics.parseAnalyticsRange("30d"), "30d");
    assert.equal(analytics.parseAnalyticsRange("90d"), "90d");
    assert.equal(analytics.parseAnalyticsRange("all"), "all");
    assert.equal(analytics.parseAnalyticsRange("365d"), null);
  });

  it("normalizes error codes into safe categories", () => {
    assert.equal(
      analytics.normalizeAnalyticsErrorCode({ code: "LIMIT_FILE_SIZE" }),
      "FILE_TOO_LARGE",
    );
    assert.equal(
      analytics.normalizeAnalyticsErrorCode({ code: "bad value / path leak" }),
      "BAD_VALUE_PATH_LEAK",
    );
  });

  it("deletes old events when retention is enabled", () => {
    process.env.ANALYTICS_RETENTION_DAYS = "1";
    analytics.recordAnalyticsEvent({
      eventType: "conversion_started",
      toolSlug: "png-to-jpg",
      createdAt: "2000-01-01T00:00:00.000Z",
    });

    assert.equal(analytics.cleanupOldAnalytics({ force: true }), true);
    assert.equal(
      analytics
        .getTopTools("all")
        .some((tool) => tool.toolSlug === "png-to-jpg" && tool.conversionStarts > 1),
      false,
    );
    delete process.env.ANALYTICS_RETENTION_DAYS;
  });

  it("keeps old events when retention is disabled", () => {
    process.env.ANALYTICS_RETENTION_DAYS = "0";
    analytics.recordAnalyticsEvent({
      eventType: "conversion_started",
      toolSlug: "jpg-to-png",
      createdAt: "2000-01-01T00:00:00.000Z",
    });

    assert.equal(analytics.cleanupOldAnalytics({ force: true }), false);
    assert.ok(
      analytics
        .getTopTools("all")
        .some((tool) => tool.toolSlug === "jpg-to-png" && tool.conversionStarts >= 1),
    );
    delete process.env.ANALYTICS_RETENTION_DAYS;
  });

  it("rejects unsupported analytics ranges", () => {
    assert.equal(analytics.parseAnalyticsRange("30"), null);
    assert.equal(analytics.parseAnalyticsRange("30d"), "30d");
    assert.throws(() => analytics.getAnalyticsSummary("not-a-range"));
  });

  it("does not throw when analytics database writes fail", async () => {
    analytics.closeAnalytics();
    const blockedPath = path.join(tempDir, "not-a-database-directory");
    await fs.mkdir(blockedPath, { recursive: true });
    process.env.ANALYTICS_DB_PATH = blockedPath;

    assert.equal(
      analytics.recordAnalyticsEvent({
        eventType: "conversion_success",
        toolSlug: "png-to-jpg",
      }),
      false,
    );

    process.env.ANALYTICS_DB_PATH = analyticsDbPath;
    analytics.initializeAnalytics({ dbPath: analyticsDbPath });
  });
});
