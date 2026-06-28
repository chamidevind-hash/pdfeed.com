import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how File Convert Web processes, protects, and deletes uploaded files.",
};

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <div className="container legal-container">
        <span className="eyebrow">Your files, your privacy</span>
        <h1>Privacy Policy</h1>
        <p className="legal-updated">Last updated: June 10, 2026</p>

        <h2>Information we process</h2>
        <p>
          File Convert Web processes the files you upload only to provide the
          conversion you request. The MVP does not require accounts and does not
          intentionally collect personal profile information.
        </p>

        <h2>Temporary file storage</h2>
        <p>
          Uploaded and converted files are stored temporarily using randomized
          filenames. They are automatically deleted after one hour. Avoid
          uploading files you do not have permission to process.
        </p>

        <h2>Technical information</h2>
        <p>
          Hosting providers may process standard technical data such as IP
          addresses, browser type, request time, and error logs for security and
          reliability. During the free beta, the application also keeps an
          in-memory count by IP address to enforce the daily conversion limit.
          These counts expire after 24 hours and are not linked to an account.
        </p>

        <h2>Security</h2>
        <p>
          We apply file-type and size restrictions and do not execute uploaded
          files. No online service can guarantee absolute security, so do not
          upload highly sensitive documents.
        </p>

        <h2>Changes</h2>
        <p>
          This policy may be updated as the service changes. The date above
          indicates the latest revision.
        </p>
      </div>
    </main>
  );
}
