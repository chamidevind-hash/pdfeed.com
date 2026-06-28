import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://fileconvertweb.com",
  ),
  title: {
    default: "File Convert Web - Free Online File Converter",
    template: "%s | File Convert Web",
  },
  description:
    "Convert PDF, Word, Excel and image files online for free. Fast, secure and no registration required.",
  keywords: [
    "file converter",
    "PDF converter",
    "Word to PDF",
    "JPG to PDF",
    "merge PDF",
    "compress PDF",
  ],
  openGraph: {
    type: "website",
    siteName: "File Convert Web",
    title: "File Convert Web - Free Online File Converter",
    description:
      "Convert PDF, Word, Excel and images online. Fast, secure and free.",
  },
  twitter: {
    card: "summary_large_image",
  },
  verification: {
    google: "ZE_oAp9U5ABlW_Nw1bwfPQscmCrMGSePXeZAubrN77U",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${manrope.variable}`}>
        <div className="site-shell">
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
