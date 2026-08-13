"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { converterMap, type ConverterSlug } from "@/lib/converters";

const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL;
const apiBaseUrl =
  configuredApiUrl === undefined
    ? process.env.NODE_ENV === "production"
      ? ""
      : "http://localhost:4000"
    : configuredApiUrl.replace(/\/$/, "");

type Summary = {
  conversions: number;
  successes: number;
  failures: number;
  successRate: number;
  averageDurationMs: number;
  pageViews: number;
  uniqueTools: number;
};

type ToolRow = {
  toolSlug: string;
  views: number;
  conversionStarts: number;
  successes: number;
  failures: number;
  successRate: number;
  averageDurationMs: number;
};

type DailyRow = {
  day: string;
  pageViews: number;
  conversions: number;
  successes: number;
  failures: number;
  averageDurationMs: number;
};

type FailureRow = {
  toolSlug: string;
  errorCode: string;
  count: number;
};

type BucketRow = {
  bucket: string;
  count: number;
};

type DashboardData = {
  overview: {
    today: Summary;
    last7Days: Summary;
    last30Days: Summary;
  };
  summary: Summary;
  fileSizeBuckets: BucketRow[];
  daily: DailyRow[];
  tools: ToolRow[];
  failures: FailureRow[];
};

const ranges = [
  { label: "Today", value: "today" },
  { label: "7 days", value: "7d" },
  { label: "30 days", value: "30d" },
  { label: "90 days", value: "90d" },
  { label: "All time", value: "all" },
];

function percent(value: number) {
  return `${Number(value || 0).toFixed(1)}%`;
}

function duration(value: number) {
  if (!value) return "0 ms";
  if (value < 1000) return `${Math.round(value)} ms`;
  return `${(value / 1000).toFixed(1)} s`;
}

function toolName(toolSlug: string) {
  return converterMap[toolSlug as ConverterSlug]?.shortTitle || toolSlug;
}

class DashboardRequestError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function MetricCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: string | number;
  helper?: string;
}) {
  return (
    <div className="analytics-metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      {helper && <small>{helper}</small>}
    </div>
  );
}

export function AnalyticsDashboard() {
  const [token, setToken] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [range, setRange] = useState("30d");
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const stored = window.sessionStorage.getItem("pdfeed_analytics_token");
    if (stored) {
      setToken(stored);
      setTokenInput(stored);
    }
  }, []);

  async function fetchJson(path: string) {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new DashboardRequestError(
        body.error || "Could not load analytics.",
        response.status,
      );
    }

    return response.json();
  }

  function clearToken() {
    window.sessionStorage.removeItem("pdfeed_analytics_token");
    setToken("");
    setTokenInput("");
    setData(null);
  }

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    async function load() {
      setIsLoading(true);
      setError("");
      try {
        const [summary, daily, tools, failures, fileSizes] = await Promise.all([
          fetchJson(`/api/admin/analytics/summary?range=${range}`),
          fetchJson(`/api/admin/analytics/daily?range=${range}`),
          fetchJson(`/api/admin/analytics/tools?range=${range}`),
          fetchJson(`/api/admin/analytics/failures?range=${range}`),
          fetchJson(`/api/admin/analytics/file-sizes?range=${range}`),
        ]);

        if (!cancelled) {
          setData({
            overview: summary.overview,
            summary: summary.summary,
            fileSizeBuckets: fileSizes.fileSizeBuckets,
            daily: daily.daily,
            tools: tools.tools,
            failures: failures.failures,
          });
        }
      } catch (loadError) {
        if (!cancelled) {
          if (
            loadError instanceof DashboardRequestError &&
            (loadError.status === 401 || loadError.status === 403)
          ) {
            clearToken();
          }
          setError(loadError instanceof Error ? loadError.message : "Could not load analytics.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [token, range]);

  function saveToken(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = tokenInput.trim();
    if (!trimmed) return;
    window.sessionStorage.setItem("pdfeed_analytics_token", trimmed);
    setToken(trimmed);
  }

  const maxDaily = useMemo(
    () => Math.max(...(data?.daily.map((row) => row.conversions) || [0]), 1),
    [data],
  );

  if (!token) {
    return (
      <div className="analytics-login-card">
        <h2>Enter analytics admin token</h2>
        <p>
          The token is stored only in sessionStorage for this browser tab and is
          never bundled into the frontend.
        </p>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={saveToken}>
          <label htmlFor="analytics-token">Admin token</label>
          <input
            id="analytics-token"
            type="password"
            value={tokenInput}
            onChange={(event) => setTokenInput(event.target.value)}
            autoComplete="off"
          />
          <button className="button button-primary" type="submit">
            Open dashboard
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      <div className="analytics-toolbar">
        <div className="analytics-range-tabs" aria-label="Date range">
          {ranges.map((item) => (
            <button
              type="button"
              className={range === item.value ? "is-active" : ""}
              key={item.value}
              onClick={() => setRange(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <button className="analytics-ghost-button" type="button" onClick={clearToken}>
          Logout
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {isLoading && <div className="quota-message">Loading analytics...</div>}

      {data && (
        <>
          <section className="analytics-section">
            <h2>Overview</h2>
            <div className="analytics-metric-grid">
              <MetricCard
                label="Today conversions"
                value={data.overview.today.conversions}
                helper={`${data.overview.today.successes} successful, ${data.overview.today.failures} failed`}
              />
              <MetricCard
                label="Today success rate"
                value={percent(data.overview.today.successRate)}
                helper={`Avg ${duration(data.overview.today.averageDurationMs)}`}
              />
              <MetricCard
                label="Last 7 days"
                value={data.overview.last7Days.conversions}
                helper={`${data.overview.last7Days.uniqueTools} tools used`}
              />
              <MetricCard
                label="7-day success rate"
                value={percent(data.overview.last7Days.successRate)}
              />
              <MetricCard
                label="Last 30 days conversions"
                value={data.overview.last30Days.conversions}
              />
              <MetricCard
                label="Last 30 days page views"
                value={data.overview.last30Days.pageViews}
              />
            </div>
          </section>

          <section className="analytics-section">
            <h2>Popular tools</h2>
            <div className="analytics-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Tool</th>
                    <th>Views</th>
                    <th>Starts</th>
                    <th>Successes</th>
                    <th>Failures</th>
                    <th>Success Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {data.tools.map((tool) => (
                    <tr key={tool.toolSlug}>
                      <td>
                        <strong>{toolName(tool.toolSlug)}</strong>
                        <small>{tool.toolSlug}</small>
                      </td>
                      <td>{tool.views}</td>
                      <td>{tool.conversionStarts}</td>
                      <td>{tool.successes}</td>
                      <td>{tool.failures}</td>
                      <td>{percent(tool.successRate)}</td>
                    </tr>
                  ))}
                  {data.tools.length === 0 && (
                    <tr>
                      <td colSpan={6}>No tool activity in this range.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="analytics-section">
            <h2>Daily activity</h2>
            <div className="daily-chart">
              {data.daily.map((day) => (
                <div className="daily-chart-row" key={day.day}>
                  <span>{day.day}</span>
                  <div>
                    <i style={{ width: `${(day.conversions / maxDaily) * 100}%` }} />
                  </div>
                  <strong>{day.conversions}</strong>
                  <small>
                    {day.pageViews} views, {day.successes} successes, {day.failures} failures
                  </small>
                </div>
              ))}
              {data.daily.length === 0 && <p>No activity in this range.</p>}
            </div>
          </section>

          <section className="analytics-split">
            <div className="analytics-section">
              <h2>Failures</h2>
              <div className="analytics-table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Tool</th>
                      <th>Error code</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.failures.map((failure) => (
                      <tr key={`${failure.toolSlug}-${failure.errorCode}`}>
                        <td>
                          <strong>{toolName(failure.toolSlug)}</strong>
                          <small>{failure.toolSlug}</small>
                        </td>
                        <td>{failure.errorCode}</td>
                        <td>{failure.count}</td>
                      </tr>
                    ))}
                    {data.failures.length === 0 && (
                      <tr>
                        <td colSpan={3}>No failures in this range.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="analytics-section">
              <h2>File sizes</h2>
              <div className="analytics-table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Bucket</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.fileSizeBuckets.map((bucket) => (
                      <tr key={bucket.bucket}>
                        <td>{bucket.bucket}</td>
                        <td>{bucket.count}</td>
                      </tr>
                    ))}
                    {data.fileSizeBuckets.length === 0 && (
                      <tr>
                        <td colSpan={2}>No conversion file sizes in this range.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className="analytics-section">
            <h2>Processing speed</h2>
            <div className="analytics-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Tool</th>
                    <th>Average duration</th>
                    <th>Successful conversions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.tools.map((tool) => (
                    <tr key={`${tool.toolSlug}-speed`}>
                      <td>
                        <strong>{toolName(tool.toolSlug)}</strong>
                        <small>{tool.toolSlug}</small>
                      </td>
                      <td>{duration(tool.averageDurationMs)}</td>
                      <td>{tool.successes}</td>
                    </tr>
                  ))}
                  {data.tools.length === 0 && (
                    <tr>
                      <td colSpan={3}>No successful conversions in this range.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
