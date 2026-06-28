import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Tool } from "@/lib/tools";

export function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;
  return (
    <Link href={`/${tool.slug}`} className="tool-card">
      <span className={`tool-icon accent-${tool.accent}`}>
        <Icon size={24} />
      </span>
      <span className="tool-card-content">
        <span className="tool-card-title-row">
          <strong>{tool.shortTitle}</strong>
          {!tool.available && <span className="soon-badge">Soon</span>}
        </span>
        <span>{tool.description}</span>
      </span>
      <ArrowRight className="tool-arrow" size={19} />
    </Link>
  );
}
