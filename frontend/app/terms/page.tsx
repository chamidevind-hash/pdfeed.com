import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Terms of Service",
  description:
    "Read the terms for using PDFeed's free online file conversion tools.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <main className="legal-page">
      <div className="container legal-container">
        <span className="eyebrow">Service guidelines</span>
        <h1>Terms of Service</h1>
        <p className="legal-updated">Last updated: June 28, 2026</p>

        <h2>About the service</h2>
        <p>
          PDFeed provides free online file conversion tools. By using PDFeed,
          you agree to these Terms of Service and to use the website only for
          lawful purposes.
        </p>

        <h2>Your files and permissions</h2>
        <p>
          You are responsible for every file you upload. You must own the file
          or have the rights and permission needed to upload, process, and
          convert it. PDFeed does not review or verify ownership of uploaded
          content.
        </p>

        <h2>Prohibited use</h2>
        <p>
          You must not upload malware, illegal or abusive content, copyrighted
          files without permission, or confidential files that you are not
          authorized to process. You must not attempt to disrupt PDFeed, bypass
          limits, probe its security, or use automated traffic in a way that
          harms the service or other users.
        </p>

        <h2>Conversion results</h2>
        <p>
          PDFeed is provided “as is” and “as available.” We do not guarantee
          that every conversion will succeed or that formatting, fonts, images,
          tables, metadata, or layout will be preserved perfectly.
        </p>

        <h2>Temporary file storage</h2>
        <p>
          Uploaded and converted files are stored temporarily and automatically
          deleted after one hour. You are responsible for keeping your original
          files and downloading completed conversions before they expire.
        </p>

        <h2>Disclaimer and limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, PDFeed is not responsible for
          data loss, formatting issues, failed or incomplete conversions,
          service interruptions, unauthorized uploads, or misuse of converted
          files. You use the service at your own risk.
        </p>

        <h2>Future changes</h2>
        <p>
          PDFeed may introduce or change file-size limits, conversion limits,
          advertisements, paid plans, supported formats, or other features in
          the future. We may modify, suspend, or discontinue parts of the
          service at any time.
        </p>

        <h2>Abuse prevention</h2>
        <p>
          PDFeed may limit or block abusive users, automated systems, or
          suspicious traffic when reasonably necessary to protect the website,
          its infrastructure, or other users.
        </p>

        <h2>Changes to these terms</h2>
        <p>
          We may update these Terms of Service from time to time. Continued use
          of PDFeed after an update means you accept the revised terms.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these Terms of Service can be sent to{" "}
          <a href="mailto:support@pdfeed.com">support@pdfeed.com</a>.
        </p>
      </div>
    </main>
  );
}
