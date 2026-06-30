import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPage } from "@/components/ToolPage";
import { createPageMetadata } from "@/lib/site";
import { toolMap, tools, type ToolSlug } from "@/lib/tools";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = toolMap[slug as ToolSlug];
  if (!tool) return {};

  return createPageMetadata({
    title: tool.title,
    description: tool.seoDescription,
    path: `/${tool.slug}`,
  });
}

export default async function ConverterPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = toolMap[slug as ToolSlug];
  if (!tool) notFound();
  return <ToolPage tool={tool} />;
}
