import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <Link href="/" className="footer-brand">
            PDFeed
          </Link>
          <p>Simple, secure file conversion in your browser.</p>
          <p className="footer-premium">Premium plans coming soon.</p>
        </div>
        <div className="footer-links">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </div>
      <div className="container footer-bottom">
        © {new Date().getFullYear()} PDFeed. All rights reserved.
      </div>
    </footer>
  );
}
