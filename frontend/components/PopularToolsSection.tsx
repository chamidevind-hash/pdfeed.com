import { ToolCard } from "@/components/ToolCard";
import { getPopularConverters } from "@/lib/discovery";

type PopularToolsSectionProps = {
  sectionId?: string;
  title?: string;
  eyebrow?: string;
  description?: string;
  limit?: number;
};

export function PopularToolsSection({
  sectionId,
  title = "Popular file conversion tools",
  eyebrow = "Popular tools",
  description = "Start with the converters people use most often on PDFeed.",
  limit = 6,
}: PopularToolsSectionProps) {
  const tools = getPopularConverters(limit);

  if (tools.length === 0) return null;

  return (
    <section className="popular-tools-section" id={sectionId}>
      <div className="container">
        <div className="section-heading centered">
          <span className="eyebrow">{eyebrow}</span>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <div className="tools-grid">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </div>
    </section>
  );
}
