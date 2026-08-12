import { Clock3, LockKeyhole, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { BetaBanner } from "@/components/BetaBanner";
import { BlogCard } from "@/components/BlogCard";
import { Converter } from "@/components/Converter";
import { PopularToolsSection } from "@/components/PopularToolsSection";
import { ToolCard } from "@/components/ToolCard";
import { SITE_NAME, absoluteUrl } from "@/lib/site";
import type { Converter as ConverterDefinition } from "@/lib/converters";
import {
  getRelatedArticlesForConverter,
  getRelatedConverters,
} from "@/lib/discovery";

export function ToolPage({ tool }: { tool: ConverterDefinition }) {
  const Icon = tool.icon;
  const pageUrl = absoluteUrl(`/${tool.slug}`);
  const categoryUrl = absoluteUrl(`/${tool.categorySlug}`);
  const relatedConverters = getRelatedConverters(tool);
  const relatedArticles = getRelatedArticlesForConverter(tool);
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: tool.title,
        url: pageUrl,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Web",
        description: tool.seoDescription,
        provider: {
          "@type": "Organization",
          name: SITE_NAME,
          url: absoluteUrl("/"),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: absoluteUrl("/"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: tool.categoryTitle,
            item: categoryUrl,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: tool.shortTitle,
            item: pageUrl,
          },
        ],
      },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <section className="tool-hero">
        <div className="container narrow-container">
          <BetaBanner />
          <nav className="tool-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href={`/${tool.categorySlug}`}>{tool.categoryTitle}</Link>
            <span aria-hidden="true">/</span>
            <span>{tool.shortTitle}</span>
          </nav>
          <span className={`page-tool-icon accent-${tool.accent}`}>
            <Icon size={30} />
          </span>
          <h1>{tool.title}</h1>
          <p>{tool.seoDescription}</p>
          {!tool.available && (
            <div className="coming-soon-note">
              This tool page is ready for SEO, but conversion support is coming
              soon.
            </div>
          )}
          <Converter
            tool={{
              slug: tool.slug,
              apiRoute: tool.apiRoute,
              uploadField: tool.uploadField,
              accept: tool.accept,
              acceptLabel: tool.acceptLabel,
              multiple: tool.multiple,
              minimumFiles: tool.minimumFiles,
              buttonLabel: tool.buttonLabel,
              available: tool.available,
            }}
          />
          <div className="mini-trust-row">
            <span>
              <ShieldCheck size={17} /> No registration
            </span>
            <span>
              <LockKeyhole size={17} /> Secure processing
            </span>
            <span>
              <Clock3 size={17} /> Auto-delete in 1 hour
            </span>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="container content-container">
          <div className="section-heading">
            <span className="eyebrow">Common questions</span>
            <h2>{tool.shortTitle} FAQ</h2>
          </div>
          <div className="faq-list">
            {tool.faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="related-section">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Keep working</span>
            <h2>Related tools</h2>
          </div>
          <div className="tools-grid related-grid">
            {relatedConverters.map((relatedTool) => (
              <ToolCard key={relatedTool.slug} tool={relatedTool} />
            ))}
          </div>
        </div>
      </section>

      {relatedArticles.length > 0 && (
        <section className="related-section related-guides-section">
          <div className="container">
            <div className="section-heading">
              <span className="eyebrow">Helpful guides</span>
              <h2>Learn more about this workflow</h2>
            </div>
            <div className="blog-grid blog-grid-three">
              {relatedArticles.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      <PopularToolsSection />
    </main>
  );
}
