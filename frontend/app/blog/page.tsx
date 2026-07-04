import type { Metadata } from "next";
import { BlogCard } from "@/components/BlogCard";
import { blogPosts } from "@/lib/blog-posts";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "PDF and File Conversion Guides",
  description:
    "Read practical PDFeed guides for converting, merging, and compressing PDF, Word, Excel, and image files online.",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <main>
      <section className="blog-index-hero">
        <div className="container blog-index-heading">
          <span className="eyebrow">PDFeed Blog</span>
          <h1>Helpful file conversion guides</h1>
          <p>
            Clear, practical advice for preparing documents and getting better
            results from everyday PDF and file conversion tasks.
          </p>
        </div>
      </section>
      <section className="blog-index-section">
        <div className="container blog-grid">
          {blogPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </main>
  );
}
