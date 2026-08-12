import Link from "next/link";
import { PopularToolsSection } from "@/components/PopularToolsSection";
import { ToolCard } from "@/components/ToolCard";
import {
  categoryConfigMap,
  popularConverters,
  type CategoryPageData,
} from "@/lib/converters";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

export function CategoryPage({ category }: { category: CategoryPageData }) {
  const Icon = category.iconComponent;
  const pageUrl = absoluteUrl(`/${category.slug}`);
  const relatedCategories = category.related.map((id) => categoryConfigMap[id]);
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: category.title,
        url: pageUrl,
        description: category.seoDescription,
        isPartOf: {
          "@type": "WebSite",
          name: SITE_NAME,
          url: absoluteUrl("/"),
        },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: category.converters.map((converter, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: converter.shortTitle,
            url: absoluteUrl(`/${converter.slug}`),
          })),
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
            name: category.title,
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
      <section className="category-hero">
        <div className="container category-heading">
          <nav className="tool-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>{category.title}</span>
          </nav>
          <span className={`category-hero-icon accent-${category.accent}`}>
            <Icon size={30} />
          </span>
          <span className="eyebrow">PDFeed tools</span>
          <h1>{category.title}</h1>
          <p>{category.description}</p>
          <div className="category-count-card">
            <strong>{category.availableToolCount}</strong>
            <span>
              {category.availableToolCount === 1 ? "available tool" : "available tools"}
            </span>
          </div>
        </div>
      </section>

      <section className="tools-section">
        <div className="container">
          <div className="section-heading centered">
            <span className="eyebrow">Converters</span>
            <h2>All {category.shortTitle} tools</h2>
            <p>
              {category.converters.length > 0
                ? "Choose a converter and start processing your file online."
                : "Converters in this category are planned as PDFeed expands."}
            </p>
          </div>
          {category.converters.length > 0 ? (
            <div className="tools-grid">
              {category.converters.map((converter) => (
                <ToolCard key={converter.slug} tool={converter} />
              ))}
            </div>
          ) : (
            <div className="empty-category-card">
              <h2>More tools are coming soon</h2>
              <p>
                This category is part of the PDFeed platform structure, so new
                converters will appear here automatically when added.
              </p>
            </div>
          )}
        </div>
      </section>

      {category.featuredConverters.length > 0 && (
        <section className="featured-category-section">
          <div className="container">
            <div className="section-heading centered">
              <span className="eyebrow">Featured</span>
              <h2>Featured {category.shortTitle} converters</h2>
            </div>
            <div className="tools-grid related-grid">
              {category.featuredConverters.slice(0, 3).map((converter) => (
                <ToolCard key={converter.slug} tool={converter} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="category-links-section">
        <div className="container category-link-grid">
          <div className="category-link-card">
            <span className="eyebrow">Related categories</span>
            <h2>Explore more file tools</h2>
            <div className="category-pill-list">
              {relatedCategories.map((related) => (
                <Link href={`/${related.slug}`} key={related.id}>
                  {related.title}
                </Link>
              ))}
            </div>
          </div>
          <div className="category-link-card">
            <span className="eyebrow">Popular converters</span>
            <h2>Frequently used tools</h2>
            <div className="category-pill-list">
              {popularConverters.slice(0, 6).map((converter) => (
                <Link href={`/${converter.slug}`} key={converter.slug}>
                  {converter.shortTitle}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <PopularToolsSection />
    </main>
  );
}
