import { blogPosts, type BlogPost } from "@/lib/blog-posts";
import {
  converterMap,
  converters,
  popularConverters,
  type Converter,
  type ConverterSlug,
} from "@/lib/converters";

export function getPopularConverters(limit = 6) {
  return popularConverters.slice(0, limit);
}

export function getRelatedConverters(tool: Converter, limit = 3) {
  const scored = converters
    .filter((candidate) => candidate.slug !== tool.slug)
    .map((candidate) => {
      let score = 0;

      if (candidate.categorySlug === tool.categorySlug) score += 40;
      if (candidate.input.some((format) => tool.input.includes(format))) score += 24;
      if (candidate.output.some((format) => tool.output.includes(format))) score += 20;
      if (candidate.featured) score += 8;
      if (candidate.popular) score += 6;
      if (tool.related.includes(candidate.slug)) score += 30;

      return { candidate, score };
    })
    .sort((a, b) => b.score - a.score || a.candidate.shortTitle.localeCompare(b.candidate.shortTitle));

  return scored.slice(0, limit).map(({ candidate }) => candidate);
}

function scorePostForTool(post: BlogPost, tool: Converter) {
  let score = 0;
  const postHaystack = [
    post.title,
    post.description,
    post.excerpt,
    post.targetKeyword,
    post.toolLabel,
  ]
    .join(" ")
    .toLowerCase();

  if (post.toolPath === `/${tool.slug}`) score += 90;
  if (postHaystack.includes(tool.shortTitle.toLowerCase())) score += 28;
  if (postHaystack.includes(tool.categoryTitle.toLowerCase())) score += 18;

  for (const keyword of tool.keywords) {
    if (postHaystack.includes(keyword.toLowerCase())) score += 10;
  }

  for (const format of [...tool.input, ...tool.output]) {
    if (postHaystack.includes(format.toLowerCase())) score += 6;
  }

  return score;
}

export function getRelatedArticlesForConverter(tool: Converter, limit = 3) {
  return blogPosts
    .map((post) => ({ post, score: scorePostForTool(post, tool) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.post.title.localeCompare(b.post.title))
    .slice(0, limit)
    .map(({ post }) => post);
}

export function getRelatedArticlesForPost(post: BlogPost, limit = 3) {
  const slug = post.toolPath.replace("/", "") as ConverterSlug;
  const tool = converterMap[slug];

  if (!tool) {
    return blogPosts.filter((item) => item.slug !== post.slug).slice(0, limit);
  }

  return blogPosts
    .filter((item) => item.slug !== post.slug)
    .map((item) => ({ post: item, score: scorePostForTool(item, tool) }))
    .sort((a, b) => b.score - a.score || a.post.title.localeCompare(b.post.title))
    .slice(0, limit)
    .map(({ post }) => post);
}
