import { ArrowUpRight, QrCode } from "lucide-react";

export function GetQrlyBanner({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <aside className={`getqrly-banner ${compact ? "is-compact" : ""}`}>
      <span className="getqrly-icon">
        <QrCode size={28} />
      </span>
      <div className="getqrly-copy">
        <h2>Need QR codes for your business?</h2>
        <p>
          Create dynamic QR codes, business QR codes, WiFi QR codes, menus, and
          more with GetQRly.
        </p>
      </div>
      <a
        className="button getqrly-button"
        href="https://getqrly.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        Try GetQRly
        <ArrowUpRight size={18} />
      </a>
    </aside>
  );
}
