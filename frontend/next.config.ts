import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  outputFileTracingRoot: path.resolve(__dirname, ".."),
  experimental: {
    cpus: 1,
    webpackBuildWorker: false,
  },
  turbopack: {
    root: path.resolve(__dirname, ".."),
  },
  // One canonical host: www.pdfeed.com -> pdfeed.com, so Google sees one copy of each page.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.pdfeed.com" }],
        destination: "https://pdfeed.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
