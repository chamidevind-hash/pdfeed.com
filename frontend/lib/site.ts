import type { Metadata } from "next";

export const SITE_NAME = "PDFeed";
export const SITE_URL = "https://pdfeed.com";
export const SITE_DESCRIPTION =
  "Convert PDF, Word, Excel, and image files online for free with PDFeed. Fast, secure, and easy file conversion.";

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

export const SOCIAL_IMAGE_URL = absoluteUrl("/og-image.png");

export function createPageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description,
      url,
      images: [
        {
          url: SOCIAL_IMAGE_URL,
          width: 1200,
          height: 630,
          alt: "PDFeed online file converter",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [SOCIAL_IMAGE_URL],
    },
  };
}
