import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, FolderOpen, Search as SearchIcon, Wrench } from "lucide-react";
import { PopularToolsSection } from "@/components/PopularToolsSection";
import { SearchBox } from "@/components/SearchBox";
import { createPageMetadata } from "@/lib/site";
import { groupSearchResults, searchSite, searchTypeLabels } from "@/lib/search";

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

const resultIcons = {
  tool: Wrench,
  category: FolderOpen,
  guide: BookOpen,
};

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q?.trim() || "";
  const metadata = createPageMetadata({
    title: query ? `Search results for ${query}` : "Search PDFeed",
    description:
      "Search PDFeed tools, categories, and guides for PDF, Word, Excel, and image conversion.",
    path: "/search",
  });

  if (!query) {
    metadata.robots = { index: false, follow: true };
  }

  return metadata;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() || "";
  const results = searchSite(query);
  const groups = groupSearchResults(results);
  const hasQuery = query.length > 0;

  return (
    <main>
      <section className="search-page-hero">
        <div className="container search-page-heading">
          <nav className="tool-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Search</span>
          </nav>
          <span className="eyebrow">Search PDFeed</span>
          <h1>{hasQuery ? `Search results for "${query}"` : "Find the right converter"}</h1>
          <p>
            Search tools, categories, and helpful guides from the local PDFeed
            converter library.
          </p>
          <SearchBox
            id="search-page-input"
            variant="page"
            className="search-page-box"
            initialQuery={query}
            placeholder="Search PDF, Word, Excel, JPG..."
          />
        </div>
      </section>

      <section className="search-page-results">
        <div className="container search-results-container">
          {!hasQuery ? (
            <div className="search-empty-card">
              <SearchIcon size={24} />
              <h2>Start typing to search PDFeed</h2>
              <p>
                Try searches like PDF, Word to PDF, merge, compress, JPG, or
                Excel.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="search-empty-card">
              <SearchIcon size={24} />
              <h2>No results found</h2>
              <p>Try a different file type, tool name, or conversion format.</p>
            </div>
          ) : (
            (["tool", "category", "guide"] as const).map((type) => {
              const group = groups[type];
              if (group.length === 0) return null;
              const Icon = resultIcons[type];

              return (
                <section className="search-results-group-full" key={type}>
                  <div className="section-heading">
                    <span className="eyebrow">{searchTypeLabels[type]}</span>
                    <h2>
                      {group.length} {group.length === 1 ? "result" : "results"}
                    </h2>
                  </div>
                  <div className="search-full-list">
                    {group.map((result) => (
                      <Link
                        href={result.href}
                        className="search-full-item"
                        key={`${result.type}-${result.id}`}
                      >
                        <span className="search-result-icon">
                          <Icon size={19} aria-hidden="true" />
                        </span>
                        <span>
                          <strong>{result.title}</strong>
                          <small>{result.type}</small>
                          <em>{result.description}</em>
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })
          )}
        </div>
      </section>

      <PopularToolsSection />
    </main>
  );
}
