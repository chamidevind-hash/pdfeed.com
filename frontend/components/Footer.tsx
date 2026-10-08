import Link from "next/link";

const popularConverters = [
  { href: "/word-to-pdf", label: "Word to PDF" },
  { href: "/compress-pdf", label: "Compress PDF" },
  { href: "/pdf-to-word", label: "PDF to Word" },
  { href: "/merge-pdf", label: "Merge PDF" },
  { href: "/jpg-to-pdf", label: "JPG to PDF" },
  { href: "/png-to-jpg", label: "PNG to JPG" },
] as const;

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
          <Link href="/blog">Blog</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
        <div className="footer-popular">
          <h2>Popular Converters</h2>
          <div className="footer-popular-links">
            {popularConverters.map((tool) => (
              <Link href={tool.href} key={tool.href}>
                {tool.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="footer-tools">
          <h2>Free Tools</h2>
          <a href="https://getqrly.com/qr-code-generator">Free QR Code Generator</a>
          <p>
            Create QR codes for links, WiFi, WhatsApp, Google reviews, business
            cards, and more.
          </p>
        </div>
      </div>
      <div className="container footer-bottom">
        © {new Date().getFullYear()} PDFeed. All rights reserved.
      </div>
    </footer>
  );
}
