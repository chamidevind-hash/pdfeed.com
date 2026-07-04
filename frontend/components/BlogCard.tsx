import { ArrowUpRight, Clock3 } from "lucide-react";
import Link from "next/link";
import type { BlogPost } from "@/lib/blog-posts";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className={`blog-card blog-accent-${post.accent}`}>
      <Link href={`/blog/${post.slug}`} className="blog-card-link">
        <span className="blog-card-kicker">Guide</span>
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
        <span className="blog-card-meta">
          <Clock3 size={15} />
          {post.readTime}
          <ArrowUpRight className="blog-card-arrow" size={18} />
        </span>
      </Link>
    </article>
  );
}
