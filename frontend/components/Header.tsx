import { Files } from "lucide-react";
import Link from "next/link";
import { SearchBox } from "@/components/SearchBox";

export function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label="PDFeed home">
          <span className="brand-mark">
            <Files size={22} strokeWidth={2.4} />
          </span>
          <span>PDFeed</span>
        </Link>
        <div className="header-search">
          <SearchBox id="header-search" variant="header" />
        </div>
        <nav className="header-nav" aria-label="Main navigation">
          <Link href="/#tools">All tools</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/privacy">Privacy</Link>
        </nav>
        <details className="mobile-menu">
          <summary>Menu</summary>
          <div className="mobile-menu-panel">
            <SearchBox id="mobile-search" variant="mobile" />
            <Link href="/#tools">All tools</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </details>
      </div>
    </header>
  );
}
