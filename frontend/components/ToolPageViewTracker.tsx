"use client";

import { useEffect } from "react";

const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL;
const apiBaseUrl =
  configuredApiUrl === undefined
    ? process.env.NODE_ENV === "production"
      ? ""
      : "http://localhost:4000"
    : configuredApiUrl.replace(/\/$/, "");

const recentPageViews = new Map<string, number>();

export function ToolPageViewTracker({ toolSlug }: { toolSlug: string }) {
  useEffect(() => {
    const now = Date.now();
    const previous = recentPageViews.get(toolSlug) || 0;
    if (now - previous < 2000) return;
    recentPageViews.set(toolSlug, now);

    const controller = new AbortController();

    fetch(`${apiBaseUrl}/api/analytics/page-view`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toolSlug }),
      keepalive: true,
      signal: controller.signal,
    }).catch(() => {
      // Analytics is intentionally best-effort.
    });

    return () => controller.abort();
  }, [toolSlug]);

  return null;
}
