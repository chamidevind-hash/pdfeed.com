import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryPage } from "@/components/CategoryPage";
import { ToolPage } from "@/components/ToolPage";
import { createPageMetadata } from "@/lib/site";
import {
  categoryPageMap,
  categorySlugs,
  converterMap,
  converters,
  type ConverterCategoryId,
  type ConverterSlug,
} from "@/lib/converters";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return [
    ...converters.map((converter) => ({ slug: converter.slug })),
    ...categorySlugs.map((category) => ({ slug: category.slug })),
  ];
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = converterMap[slug as ConverterSlug];
  if (tool) {
    return createPageMetadata({
      title: tool.seoTitle,
      description: tool.seoDescription,
      path: `/${tool.slug}`,
      keywords: tool.keywords,
    });
  }

  const category = categoryPageMap[slug as ConverterCategoryId];
  if (!category) return {};
  return createPageMetadata({
    title: category.seoTitle,
    description: category.seoDescription,
    path: `/${category.slug}`,
    keywords: category.keywords,
  });
}

export default async function ConverterPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = converterMap[slug as ConverterSlug];
  if (tool) return <ToolPage tool={tool} />;

  const category = categoryPageMap[slug as ConverterCategoryId];
  if (category) return <CategoryPage category={category} />;

  notFound();
}
