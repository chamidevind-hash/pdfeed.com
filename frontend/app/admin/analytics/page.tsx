import type { Metadata } from "next";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";

export const metadata: Metadata = {
  title: "Analytics Admin",
  description: "Private PDFeed operational analytics dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminAnalyticsPage() {
  return (
    <main className="analytics-page">
      <section className="analytics-hero">
        <div className="container">
          <span className="eyebrow">Private admin</span>
          <h1>PDFeed analytics</h1>
          <p>
            Anonymous operational metrics for converter usage, reliability, and
            processing speed.
          </p>
        </div>
      </section>
      <section className="analytics-content">
        <div className="container">
          <AnalyticsDashboard />
        </div>
      </section>
    </main>
  );
}
