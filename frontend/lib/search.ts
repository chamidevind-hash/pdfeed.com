import { blogPosts } from "@/lib/blog-posts";
import {
  categorySearchIndex,
  converterMap,
  converterSearchIndex,
  type ConverterSlug,
} from "@/lib/converters";

export type SearchResultType = "tool" | "category" | "guide";

export type SearchResult = {
  id: string;
  type: SearchResultType;
  title: string;
  description: string;
  href: string;
  icon: string;
  keywords: string[];
  searchText: string;
};

export const searchTypeLabels: Record<SearchResultType, string> = {
  tool: "Tools",
  category: "Categories",
  guide: "Guides",
};

const toolResults: SearchResult[] = converterSearchIndex.map((tool) => ({
  id: tool.id,
  type: "tool",
  title: tool.title,
  description: tool.description,
  href: tool.href,
  icon: "tool",
  keywords: [...tool.keywords, ...tool.input, ...tool.output, tool.category],
  searchText: [
    tool.title,
    tool.description,
    tool.category,
    ...tool.keywords,
    ...tool.input,
    ...tool.output,
  ].join(" "),
}));

const categoryResults: SearchResult[] = categorySearchIndex.map((category) => ({
  id: category.id,
  type: "category",
  title: category.title,
  description: category.description,
  href: category.href,
  icon: "category",
  keywords: category.keywords,
  searchText: [category.title, category.description, ...category.keywords].join(" "),
}));

const guideResults: SearchResult[] = blogPosts.map((post) => {
  const toolSlug = post.toolPath.replace("/", "") as ConverterSlug;
  const tool = converterMap[toolSlug];
  const keywords = [
    post.targetKeyword,
    post.toolLabel,
    ...(tool?.keywords || []),
    ...(tool?.input || []),
    ...(tool?.output || []),
    tool?.categoryTitle || "",
  ].filter(Boolean);

  return {
    id: post.slug,
    type: "guide",
    title: post.title,
    description: post.excerpt || post.description,
    href: `/blog/${post.slug}`,
    icon: "guide",
    keywords,
    searchText: [
      post.title,
      post.description,
      post.excerpt,
      post.targetKeyword,
      post.toolLabel,
      ...keywords,
    ].join(" "),
  };
});

export const searchIndex: SearchResult[] = [
  ...toolResults,
  ...categoryResults,
  ...guideResults,
];

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function scoreResult(result: SearchResult, query: string) {
  const normalizedTitle = normalize(result.title);
  const normalizedDescription = normalize(result.description);
  const normalizedKeywords = normalize(result.keywords.join(" "));
  const normalizedSearchText = normalize(result.searchText);
  const tokens = normalize(query).split(" ").filter(Boolean);

  if (tokens.length === 0) return 0;

  let score = 0;
  const normalizedQuery = tokens.join(" ");

  if (normalizedTitle === normalizedQuery) score += 120;
  if (normalizedTitle.startsWith(normalizedQuery)) score += 85;
  if (normalizedTitle.includes(normalizedQuery)) score += 60;
  if (normalizedKeywords.includes(normalizedQuery)) score += 38;
  if (normalizedDescription.includes(normalizedQuery)) score += 22;

  for (const token of tokens) {
    if (normalizedTitle.includes(token)) score += 18;
    if (normalizedKeywords.includes(token)) score += 10;
    if (normalizedDescription.includes(token)) score += 5;
    if (normalizedSearchText.includes(token)) score += 2;
  }

  if (result.type === "tool") score += 6;
  if (result.type === "category") score += 3;

  return score;
}

export function searchSite(query: string, limit?: number) {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const results = searchIndex
    .map((result) => ({ result, score: scoreResult(result, trimmed) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.result.title.localeCompare(b.result.title))
    .map(({ result }) => result);

  return typeof limit === "number" ? results.slice(0, limit) : results;
}

export function groupSearchResults(results: SearchResult[]) {
  return {
    tool: results.filter((result) => result.type === "tool"),
    category: results.filter((result) => result.type === "category"),
    guide: results.filter((result) => result.type === "guide"),
  };
}
