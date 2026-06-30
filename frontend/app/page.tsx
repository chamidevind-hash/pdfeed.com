import {
  Check,
  Clock3,
  LockKeyhole,
  MousePointerClick,
  Sparkles,
  UploadCloud,
  Zap,
} from "lucide-react";
import { BetaBanner } from "@/components/BetaBanner";
import { GetQrlyBanner } from "@/components/GetQrlyBanner";
import { ToolCard } from "@/components/ToolCard";
import { tools } from "@/lib/tools";
import { SITE_DESCRIPTION, createPageMetadata } from "@/lib/site";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "PDFeed – Free Online File Converter",
    description: SITE_DESCRIPTION,
    path: "/",
  }),
  title: { absolute: "PDFeed – Free Online File Converter" },
};

const trustItems = [
  { icon: Zap, title: "Fast", text: "Quick online conversions" },
  { icon: LockKeyhole, title: "Secure", text: "Protected file processing" },
  {
    icon: Check,
    title: "No Registration",
    text: "Start without an account",
  },
  {
    icon: Clock3,
    title: "Auto Deleted",
    text: "Files removed after 1 hour",
  },
];

const plans = [
  {
    name: "Free Beta",
    label: "Available now",
    featured: true,
    features: [
      "10 conversions/day",
      "25MB max file size",
      "No registration",
      "Ads may be shown later",
    ],
  },
  {
    name: "Pro",
    label: "Coming Soon",
    features: [
      "Unlimited conversions",
      "200MB file size",
      "Batch conversion",
      "No ads",
      "Priority processing",
    ],
  },
  {
    name: "Business",
    label: "Coming Soon",
    features: [
      "API access",
      "Bulk uploads",
      "Team usage",
      "Priority support",
    ],
  },
];

export default function HomePage() {
  return (
    <main>
      <section className="home-hero">
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />
        <div className="container hero-content">
          <BetaBanner />
          <span className="hero-pill">
            <Sparkles size={15} />
            Simple tools. No sign-up.
          </span>
          <h1>Convert Files Online Free</h1>
          <p>Convert PDF, Word, Excel and Images instantly.</p>
          <a href="#tools" className="button button-primary hero-button">
            Choose a tool
            <MousePointerClick size={18} />
          </a>
          <div className="hero-visual" aria-hidden="true">
            <div className="hero-file-card hero-file-left">
              <span>DOCX</span>
              <strong>Report.docx</strong>
            </div>
            <div className="conversion-bubble">
              <UploadCloud size={24} />
            </div>
            <div className="hero-file-card hero-file-right">
              <span>PDF</span>
              <strong>Report.pdf</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="trust-strip">
        <div className="container trust-grid">
          {trustItems.map((item) => {
            const Icon = item.icon;
            return (
              <div className="trust-item" key={item.title}>
                <span>
                  <Icon size={20} />
                </span>
                <div>
                  <strong>{item.title}</strong>
                  <small>{item.text}</small>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="tools-section" id="tools">
        <div className="container">
          <div className="section-heading centered">
            <span className="eyebrow">Everything you need</span>
            <h2>Popular file conversion tools</h2>
            <p>
              Pick a tool, upload your file, and download the result. That’s it.
            </p>
          </div>
          <div className="tools-grid">
            {tools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      <section className="how-section">
        <div className="container">
          <div className="section-heading centered">
            <span className="eyebrow">Three easy steps</span>
            <h2>Convert without the clutter</h2>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <span>01</span>
              <h3>Choose a tool</h3>
              <p>Select the converter that matches your file and output.</p>
            </div>
            <div className="step-card">
              <span>02</span>
              <h3>Upload your file</h3>
              <p>Drag and drop a supported file up to 25MB.</p>
            </div>
            <div className="step-card">
              <span>03</span>
              <h3>Download the result</h3>
              <p>Your converted file is ready securely in moments.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="pricing-section" id="pricing">
        <div className="container">
          <div className="section-heading centered">
            <span className="eyebrow">Built to grow with you</span>
            <h2>Free during beta. More power later.</h2>
            <p>
              Use every conversion tool free today. Premium plans are being
              prepared for heavier workflows.
            </p>
          </div>
          <div className="pricing-grid">
            {plans.map((plan) => (
              <article
                className={`pricing-card ${plan.featured ? "is-featured" : ""}`}
                key={plan.name}
              >
                <div className="pricing-card-heading">
                  <h3>{plan.name}</h3>
                  <span>{plan.label}</span>
                </div>
                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}>
                      <Check size={17} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="promotion-section">
        <div className="container">
          <GetQrlyBanner />
        </div>
      </section>
    </main>
  );
}
import type { Metadata } from "next";
