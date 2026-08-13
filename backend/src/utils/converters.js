export const converterSlugs = new Set([
  "pdf-to-word",
  "word-to-pdf",
  "jpg-to-pdf",
  "pdf-to-jpg",
  "merge-pdf",
  "split-pdf",
  "compress-pdf",
  "excel-to-pdf",
  "png-to-jpg",
  "jpg-to-png",
  "webp-to-jpg",
  "webp-to-png",
  "jpg-to-webp",
  "png-to-webp",
  "compress-image",
  "resize-image",
  "powerpoint-to-pdf",
  "txt-to-pdf",
]);

export function isValidConverterSlug(slug) {
  return converterSlugs.has(String(slug || "").trim().toLowerCase());
}
