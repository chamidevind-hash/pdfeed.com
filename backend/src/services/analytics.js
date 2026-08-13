import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { config } from "../config.js";

export const analyticsEventTypes = new Set([
  "page_view",
  "conversion_started",
  "conversion_success",
  "conversion_failed",
]);

const allowedRanges = new Set(["today", "7d", "30d", "90d", "all"]);
let database;
let databasePath;
let lastCleanupDate = "";

function defaultDbPath() {
  return process.env.ANALYTICS_DB_PATH || config.analyticsDbPath;
}

function retentionDays() {
  const value = process.env.ANALYTICS_RETENTION_DAYS ?? config.analyticsRetentionDays;
  const days = Number(value);
  return Number.isFinite(days) ? days : 365;
}

function normalizeDbPath(dbPath = defaultDbPath()) {
  return path.resolve(dbPath);
}

function db() {
  if (!database) initializeAnalytics();
  return database;
}

function integerOrNull(value) {
  if (value === undefined || value === null || value === "") return null;
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  return Math.max(0, Math.round(number));
}

function toolOrNull(value) {
  if (value === undefined || value === null || value === "") return null;
  const normalized = String(value).trim().toLowerCase();
  return /^[a-z0-9-]{1,80}$/.test(normalized) ? normalized : null;
}

function errorOrNull(value) {
  if (value === undefined || value === null || value === "") return null;
  return String(value)
    .toUpperCase()
    .replace(/[^A-Z0-9_:-]+/g, "_")
    .slice(0, 80);
}

export function initializeAnalytics(options = {}) {
  const targetPath = normalizeDbPath(options.dbPath);
  if (database && databasePath === targetPath) return database;
  if (database) closeAnalytics();

  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  database = new Database(targetPath);
  databasePath = targetPath;

  database.pragma("journal_mode = WAL");
  database.pragma("busy_timeout = 3000");
  database.exec(`
    CREATE TABLE IF NOT EXISTS analytics_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      event_type TEXT NOT NULL CHECK (
        event_type IN (
          'page_view',
          'conversion_started',
          'conversion_success',
          'conversion_failed'
        )
      ),
      tool_slug TEXT,
      file_size_bytes INTEGER,
      duration_ms INTEGER,
      error_code TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at
      ON analytics_events(created_at);
    CREATE INDEX IF NOT EXISTS idx_analytics_events_tool_slug
      ON analytics_events(tool_slug);
    CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type
      ON analytics_events(event_type);
    CREATE INDEX IF NOT EXISTS idx_analytics_events_tool_type_created
      ON analytics_events(tool_slug, event_type, created_at);
  `);

  cleanupOldAnalytics({ force: true });
  return database;
}

export function closeAnalytics() {
  if (!database) return;
  database.close();
  database = undefined;
  databasePath = undefined;
}

export function recordAnalyticsEvent(event) {
  try {
    if (!analyticsEventTypes.has(event.eventType)) return false;
    db()
      .prepare(
        `
        INSERT INTO analytics_events (
          created_at,
          event_type,
          tool_slug,
          file_size_bytes,
          duration_ms,
          error_code
        )
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      )
      .run(
        event.createdAt || new Date().toISOString(),
        event.eventType,
        toolOrNull(event.toolSlug),
        integerOrNull(event.fileSizeBytes),
        integerOrNull(event.durationMs),
        errorOrNull(event.errorCode),
      );
    return true;
  } catch (error) {
    console.error("Analytics event write failed:", error.message);
    return false;
  }
}

export function cleanupOldAnalytics(options = {}) {
  const days = retentionDays();
  if (!Number.isFinite(days) || days <= 0) return false;

  const today = new Date().toISOString().slice(0, 10);
  if (!options.force && lastCleanupDate === today) return false;

  try {
    db()
      .prepare(
        "DELETE FROM analytics_events WHERE created_at < datetime('now', ?)",
      )
      .run(`-${Math.round(days)} days`);
    lastCleanupDate = today;
    return true;
  } catch (error) {
    console.error("Analytics retention cleanup failed:", error.message);
    return false;
  }
}

export function startAnalyticsCleanupJob() {
  const timer = setInterval(() => cleanupOldAnalytics(), 60 * 60 * 1000);
  timer.unref();
  return timer;
}

export function parseAnalyticsRange(value) {
  const normalized = String(value || "30d").toLowerCase();
  if (!allowedRanges.has(normalized)) return null;
  return normalized;
}

function whereForRange(range) {
  const normalized = parseAnalyticsRange(range);
  if (!normalized) throw new Error("Invalid analytics range.");
  if (normalized === "all") return { clause: "", params: [] };
  if (normalized === "today") {
    return {
      clause: "WHERE created_at >= datetime('now', 'start of day')",
      params: [],
    };
  }
  return {
    clause: "WHERE created_at >= datetime('now', ?)",
    params: [`-${Number(normalized.replace("d", ""))} days`],
  };
}

function runAll(sql, params = []) {
  return db().prepare(sql).all(...params);
}

function runGet(sql, params = []) {
  return db().prepare(sql).get(...params);
}

function rate(successes, failures) {
  const total = successes + failures;
  if (total === 0) return 0;
  return Math.round((successes / total) * 1000) / 10;
}

export function getAnalyticsSummary(range = "30d") {
  const { clause, params } = whereForRange(range);
  const row = runGet(
    `
    SELECT
      SUM(CASE WHEN event_type = 'page_view' THEN 1 ELSE 0 END) AS pageViews,
      SUM(CASE WHEN event_type = 'conversion_started' THEN 1 ELSE 0 END) AS conversions,
      SUM(CASE WHEN event_type = 'conversion_success' THEN 1 ELSE 0 END) AS successes,
      SUM(CASE WHEN event_type = 'conversion_failed' THEN 1 ELSE 0 END) AS failures,
      AVG(CASE WHEN event_type = 'conversion_success' THEN duration_ms END) AS averageDurationMs,
      COUNT(DISTINCT CASE WHEN event_type = 'conversion_started' THEN tool_slug END) AS uniqueTools
    FROM analytics_events
    ${clause}
  `,
    params,
  );

  const successes = Number(row?.successes || 0);
  const failures = Number(row?.failures || 0);

  return {
    range: parseAnalyticsRange(range),
    pageViews: Number(row?.pageViews || 0),
    conversions: Number(row?.conversions || 0),
    successes,
    failures,
    successRate: rate(successes, failures),
    averageDurationMs: Math.round(Number(row?.averageDurationMs || 0)),
    uniqueTools: Number(row?.uniqueTools || 0),
  };
}

export function getDailyUsage(range = "30d") {
  const { clause, params } = whereForRange(range);
  return runAll(
    `
    SELECT
      date(created_at) AS day,
      SUM(CASE WHEN event_type = 'page_view' THEN 1 ELSE 0 END) AS pageViews,
      SUM(CASE WHEN event_type = 'conversion_started' THEN 1 ELSE 0 END) AS conversions,
      SUM(CASE WHEN event_type = 'conversion_success' THEN 1 ELSE 0 END) AS successes,
      SUM(CASE WHEN event_type = 'conversion_failed' THEN 1 ELSE 0 END) AS failures,
      ROUND(AVG(CASE WHEN event_type = 'conversion_success' THEN duration_ms END)) AS averageDurationMs
    FROM analytics_events
    ${clause}
    GROUP BY date(created_at)
    ORDER BY day ASC
  `,
    params,
  ).map((row) => ({
    day: row.day,
    pageViews: Number(row.pageViews || 0),
    conversions: Number(row.conversions || 0),
    successes: Number(row.successes || 0),
    failures: Number(row.failures || 0),
    averageDurationMs: Number(row.averageDurationMs || 0),
  }));
}

export function getTopTools(range = "30d") {
  const { clause, params } = whereForRange(range);
  return runAll(
    `
    SELECT
      COALESCE(tool_slug, 'unknown') AS toolSlug,
      SUM(CASE WHEN event_type = 'page_view' THEN 1 ELSE 0 END) AS views,
      SUM(CASE WHEN event_type = 'conversion_started' THEN 1 ELSE 0 END) AS conversionStarts,
      SUM(CASE WHEN event_type = 'conversion_success' THEN 1 ELSE 0 END) AS successes,
      SUM(CASE WHEN event_type = 'conversion_failed' THEN 1 ELSE 0 END) AS failures,
      ROUND(AVG(CASE WHEN event_type = 'conversion_success' THEN duration_ms END)) AS averageDurationMs
    FROM analytics_events
    ${clause}
    GROUP BY tool_slug
    ORDER BY conversionStarts DESC, views DESC, successes DESC
    LIMIT 100
  `,
    params,
  ).map((row) => {
    const successes = Number(row.successes || 0);
    const failures = Number(row.failures || 0);
    return {
      toolSlug: row.toolSlug,
      views: Number(row.views || 0),
      conversionStarts: Number(row.conversionStarts || 0),
      successes,
      failures,
      successRate: rate(successes, failures),
      averageDurationMs: Number(row.averageDurationMs || 0),
    };
  });
}

export function getFailures(range = "30d") {
  const { clause, params } = whereForRange(range);
  const prefix = clause ? `${clause} AND` : "WHERE";
  return runAll(
    `
    SELECT
      COALESCE(tool_slug, 'unknown') AS toolSlug,
      COALESCE(error_code, 'UNKNOWN_ERROR') AS errorCode,
      COUNT(*) AS count
    FROM analytics_events
    ${prefix} event_type = 'conversion_failed'
    GROUP BY tool_slug, error_code
    ORDER BY count DESC
    LIMIT 100
  `,
    params,
  ).map((row) => ({
    toolSlug: row.toolSlug,
    errorCode: row.errorCode,
    count: Number(row.count || 0),
  }));
}

export function getFileSizeBuckets(range = "30d") {
  const { clause, params } = whereForRange(range);
  const prefix = clause ? `${clause} AND` : "WHERE";
  return runAll(
    `
    SELECT bucket, COUNT(*) AS count
    FROM (
      SELECT CASE
        WHEN file_size_bytes IS NULL THEN 'Unknown'
        WHEN file_size_bytes < 1048576 THEN 'Under 1 MB'
        WHEN file_size_bytes < 5242880 THEN '1-5 MB'
        WHEN file_size_bytes < 10485760 THEN '5-10 MB'
        WHEN file_size_bytes <= 26214400 THEN '10-25 MB'
        ELSE 'Over 25 MB'
      END AS bucket
      FROM analytics_events
      ${prefix} event_type = 'conversion_started'
    )
    GROUP BY bucket
    ORDER BY CASE bucket
      WHEN 'Under 1 MB' THEN 1
      WHEN '1-5 MB' THEN 2
      WHEN '5-10 MB' THEN 3
      WHEN '10-25 MB' THEN 4
      WHEN 'Over 25 MB' THEN 5
      ELSE 6
    END
  `,
    params,
  ).map((row) => ({
    bucket: row.bucket,
    count: Number(row.count || 0),
  }));
}

export function getAnalyticsOverview() {
  return {
    today: getAnalyticsSummary("today"),
    last7Days: getAnalyticsSummary("7d"),
    last30Days: getAnalyticsSummary("30d"),
  };
}

export function getStoredColumnNames() {
  return runAll("PRAGMA table_info(analytics_events)").map((row) => row.name);
}

export function normalizeAnalyticsErrorCode(error) {
  const rawCode = error?.code || error?.name || "CONVERSION_FAILED";
  const mappings = {
    LIMIT_FILE_SIZE: "FILE_TOO_LARGE",
    LIMIT_FILE_COUNT: "TOO_MANY_FILES",
    FILE_REQUIRED: "FILE_REQUIRED",
    INVALID_FILE_TYPE: "INVALID_FILE_TYPE",
    INVALID_MIME_TYPE: "INVALID_FILE_TYPE",
    DAILY_LIMIT_REACHED: "DAILY_LIMIT_REACHED",
  };

  return errorOrNull(mappings[rawCode] || rawCode || "CONVERSION_FAILED");
}
