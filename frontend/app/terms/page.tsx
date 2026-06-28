import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms for using the File Convert Web online conversion tools.",
};

export default function TermsPage() {
  return (
    <main className="legal-page">
      <div className="container legal-container">
        <span className="eyebrow">Service guidelines</span>
        <h1>Terms of Use</h1>
        <p className="legal-updated">Last updated: June 10, 2026</p>

        <h2>Using the service</h2>
        <p>
          You may use File Convert Web only for lawful file conversion. You must
          own the files you upload or have permission to process them.
        </p>

        <h2>Prohibited use</h2>
        <p>
          Do not upload malicious files, attempt to disrupt the service, bypass
          file restrictions, or use automated traffic that harms availability
          for others.
        </p>

        <h2>Availability and results</h2>
        <p>
          The service is provided on an as-available basis. Conversion results
          can vary based on document formatting, fonts, source quality, and
          third-party conversion software.
        </p>

        <h2>Free beta limits</h2>
        <p>
          During the free beta, usage is limited to 10 successful conversions
          per IP address during each 24-hour period, with a maximum file size of
          25MB per upload. Limits may change as premium plans are introduced.
        </p>

        <h2>Temporary downloads</h2>
        <p>
          Files are intended for immediate download and are automatically
          deleted after one hour. You are responsible for retaining your
          original files and downloaded results.
        </p>

        <h2>Liability</h2>
        <p>
          To the extent allowed by law, File Convert Web is not liable for data
          loss, formatting changes, interrupted availability, or indirect
          damages resulting from use of the service.
        </p>
      </div>
    </main>
  );
}
