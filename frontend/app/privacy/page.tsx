import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy Policy",
  description:
    "Learn how PDFeed handles uploaded files, technical data, cookies, analytics, and advertising.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <div className="container legal-container">
        <span className="eyebrow">Your files, your privacy</span>
        <h1>Privacy Policy</h1>
        <p className="legal-updated">Last updated: June 28, 2026</p>

        <h2>About PDFeed</h2>
        <p>
          PDFeed is an online file conversion website. Users can upload files
          to convert documents, PDFs, spreadsheets, and images into supported
          output formats. This Privacy Policy explains how information is
          handled when you use PDFeed.
        </p>

        <h2>Uploaded and converted files</h2>
        <p>
          Files you upload are temporarily stored only to perform the requested
          conversion. Converted files are made available for download and are
          automatically deleted after one hour. PDFeed does not sell uploaded
          files, converted files, or the personal files you process through the
          service.
        </p>

        <h2>Technical and usage data</h2>
        <p>
          We may collect basic technical and usage information, including your
          IP address, browser type, device type, pages visited, conversion tool
          used, timestamps, and error or security logs. This information helps
          us operate the website, enforce service limits, prevent abuse, and
          improve reliability.
        </p>

        <h2>Analytics</h2>
        <p>
          We may use analytics services such as Google Analytics and Microsoft
          Clarity to understand how visitors use PDFeed. These providers may
          process usage data and use cookies or similar technologies according
          to their own privacy policies.
        </p>

        <h2>Cookies</h2>
        <p>
          PDFeed and its service providers may use cookies or similar
          technologies for analytics, advertising, security, fraud prevention,
          preferences, and essential site functionality. You can control
          cookies through your browser settings, although disabling some
          cookies may affect website features.
        </p>

        <h2>Advertising</h2>
        <p>
          PDFeed may use Google AdSense or other advertising partners in the
          future. Advertising providers may use cookies or device information
          to display, measure, and personalize ads where permitted by law.
        </p>

        <h2>Your responsibility</h2>
        <p>
          Do not upload illegal, harmful, copyrighted, confidential, personal,
          or sensitive files unless you own them or have clear permission to
          process them. You are responsible for the files you upload and for
          complying with applicable laws and third-party rights.
        </p>

        <h2>Security and retention</h2>
        <p>
          We use reasonable technical measures such as file-type restrictions,
          randomized temporary filenames, and automatic deletion. No online
          system can guarantee absolute security, so you should avoid uploading
          information that would cause harm if disclosed.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          We may update this Privacy Policy as PDFeed changes. The latest
          revision date will always appear at the top of this page.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this Privacy Policy can be sent to{" "}
          <a href="mailto:support@pdfeed.com">support@pdfeed.com</a>.
        </p>
      </div>
    </main>
  );
}
