import { Clock3, LockKeyhole, ShieldCheck } from "lucide-react";
import { BetaBanner } from "@/components/BetaBanner";
import { Converter } from "@/components/Converter";
import { ToolCard } from "@/components/ToolCard";
import { toolMap, type Tool } from "@/lib/tools";

export function ToolPage({ tool }: { tool: Tool }) {
  const Icon = tool.icon;

  return (
    <main>
      <section className="tool-hero">
        <div className="container narrow-container">
          <BetaBanner />
          <span className={`page-tool-icon accent-${tool.accent}`}>
            <Icon size={30} />
          </span>
          <h1>{tool.title}</h1>
          <p>{tool.seoDescription}</p>
          {!tool.available && (
            <div className="coming-soon-note">
              This tool page is ready for SEO, but conversion support is coming
              soon.
            </div>
          )}
          <Converter
            tool={{
              slug: tool.slug,
              accept: tool.accept,
              acceptLabel: tool.acceptLabel,
              multiple: tool.multiple,
              minimumFiles: tool.minimumFiles,
              buttonLabel: tool.buttonLabel,
              available: tool.available,
            }}
          />
          <div className="mini-trust-row">
            <span>
              <ShieldCheck size={17} /> No registration
            </span>
            <span>
              <LockKeyhole size={17} /> Secure processing
            </span>
            <span>
              <Clock3 size={17} /> Auto-delete in 1 hour
            </span>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="container content-container">
          <div className="section-heading">
            <span className="eyebrow">Common questions</span>
            <h2>{tool.shortTitle} FAQ</h2>
          </div>
          <div className="faq-list">
            {tool.faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="related-section">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Keep working</span>
            <h2>Related tools</h2>
          </div>
          <div className="tools-grid related-grid">
            {tool.related.map((slug) => (
              <ToolCard key={slug} tool={toolMap[slug]} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
