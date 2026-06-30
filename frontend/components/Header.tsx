import { Files } from "lucide-react";
import Link from "next/link";

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
        <nav className="header-nav" aria-label="Main navigation">
          <Link href="/#tools">All tools</Link>
          <Link href="/privacy">Privacy</Link>
        </nav>
      </div>
    </header>
  );
}
