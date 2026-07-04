import type { Metadata } from "next";
import { ArrowRight, CalendarDays, Clock3, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogCard } from "@/components/BlogCard";
import { blogPostMap, blogPosts } from "@/lib/blog-posts";
import { SITE_NAME, SITE_URL, SOCIAL_IMAGE_URL, absoluteUrl } from "@/lib/site";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPostMap[slug];
  if (!post) return {};
  const url = absoluteUrl(`/blog/${post.slug}`);

  return {
    title: post.title,
    description: post.description,
    keywords: [post.targetKeyword, "PDFeed", "online file converter"],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      siteName: SITE_NAME,
      title: post.title,
      description: post.description,
      url,
      publishedTime: post.publishedAt,
      images: [{ url: SOCIAL_IMAGE_URL, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [SOCIAL_IMAGE_URL],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = blogPostMap[slug];
  if (!post) notFound();

  const url = absoluteUrl(`/blog/${post.slug}`);
  const related = blogPosts.filter((item) => item.slug !== post.slug).slice(0, 3);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: SOCIAL_IMAGE_URL,
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: absoluteUrl("/android-chrome-512x512.png") },
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <article>
        <header className="article-hero">
          <div className="narrow-container article-hero-inner">
            <Link href="/blog" className="article-back">PDFeed Blog</Link>
            <h1>{post.title}</h1>
            <p>{post.description}</p>
            <div className="article-meta">
              <span><CalendarDays size={16} /> Published {post.publishedLabel}</span>
              <span><Clock3 size={16} /> {post.readTime}</span>
            </div>
          </div>
        </header>

        <div className="narrow-container article-layout">
          <nav className="article-toc" aria-label="Table of contents">
            <strong>Table of contents</strong>
            <ol>
              {post.sections.map((section) => (
                <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>
              ))}
              <li><a href="#frequently-asked-questions">Frequently asked questions</a></li>
            </ol>
          </nav>

          <div className="article-content">
            {post.sections.map((section) => (
              <section id={section.id} key={section.id}>
                <h2>{section.title}</h2>
                {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.steps && (
                  <ol className="article-steps">
                    {section.steps.map((step) => (
                      <li key={step.title}>
                        <div><strong>{step.title}</strong><p>{step.text}</p></div>
                      </li>
                    ))}
                  </ol>
                )}
                {section.bullets && (
                  <ul className="article-bullets">
                    {section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                  </ul>
                )}
              </section>
            ))}

            <aside className="article-safety-note">
              <ShieldCheck size={24} />
              <div>
                <strong>Temporary file processing</strong>
                <p>PDFeed automatically deletes uploaded and converted files after one hour. Avoid uploading highly sensitive files.</p>
              </div>
            </aside>

            <section className="article-cta">
              <span>Ready to get started?</span>
              <h2>Use the free PDFeed tool</h2>
              <p>No registration required. Files up to 25MB during the free beta.</p>
              <Link href={post.toolPath} className="button button-primary">
                {post.toolLabel}<ArrowRight size={18} />
              </Link>
            </section>

            <section id="frequently-asked-questions" className="article-faq">
              <h2>Frequently asked questions</h2>
              <div className="faq-list">
                {post.faqs.map((faq) => (
                  <details key={faq.question}>
                    <summary>{faq.question}</summary>
                    <p>{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>
        </div>
      </article>

      <section className="article-related">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Keep learning</span>
            <h2>Related guides</h2>
          </div>
          <div className="blog-grid blog-grid-three">
            {related.map((item) => <BlogCard key={item.slug} post={item} />)}
          </div>
        </div>
      </section>
    </main>
  );
}
