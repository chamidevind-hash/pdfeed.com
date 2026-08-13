import type { ConverterCategoryId } from "@/lib/converters";

export type CategorySeoContent = {
  summary: string;
  useCases: string[];
  guideSlugs: string[];
};

export const categorySeoContent: Partial<Record<ConverterCategoryId, CategorySeoContent>> = {
  "pdf-tools": {
    summary:
      "PDFeed PDF tools help with common document workflows: converting editable files to PDF, turning PDFs into images or Word documents, merging related files, splitting pages, and reducing file size for sharing.",
    useCases: [
      "Prepare documents for email, upload portals, school, or client review.",
      "Combine supporting documents into one organized PDF.",
      "Reduce PDF size before sending a file with attachment limits.",
      "Convert image scans or office documents into shareable PDFs.",
    ],
    guideSlugs: [
      "how-to-compress-pdf-for-email",
      "how-to-merge-pdf-files-into-one-document",
      "how-to-convert-pdf-to-word-for-editing",
    ],
  },
  "word-tools": {
    summary:
      "Word tools focus on moving between editable Word documents and stable PDF files. Use them when a DOC or DOCX is ready to share, print, upload, or convert back into an editable draft.",
    useCases: [
      "Convert resumes, reports, invoices, and assignments to PDF.",
      "Create a fixed-layout copy from DOC and DOCX files.",
      "Recover an editable Word draft from a text-based PDF.",
      "Build a Word to PDF workflow from desktop or mobile browsers.",
    ],
    guideSlugs: [
      "how-to-convert-word-to-pdf-without-losing-formatting",
      "how-to-convert-word-to-pdf-on-iphone",
      "doc-vs-docx-vs-pdf",
    ],
  },
  "excel-tools": {
    summary:
      "Excel tools help convert spreadsheet workbooks into readable PDF snapshots. They are useful when formulas and raw sheets should stay in the original workbook while recipients receive a stable report.",
    useCases: [
      "Share XLS and XLSX files as printable PDF reports.",
      "Prepare financial summaries, schedules, price lists, and dashboards.",
      "Keep spreadsheet layouts stable for recipients who do not need to edit.",
    ],
    guideSlugs: ["how-to-convert-excel-to-pdf", "doc-vs-docx-vs-pdf"],
  },
  "powerpoint-tools": {
    summary:
      "PowerPoint tools turn PPT and PPTX presentations into PDFs for sharing, printing, and review. A PDF is a static copy, so it is best for distributing slides rather than presenting animations.",
    useCases: [
      "Send slides to people who do not have PowerPoint.",
      "Create printable handouts or meeting packets.",
      "Merge slide PDFs with reports, forms, or supporting documents.",
    ],
    guideSlugs: ["how-to-convert-powerpoint-to-pdf", "how-to-merge-pdf-files-into-one-document"],
  },
  "image-tools": {
    summary:
      "Image tools cover JPG, PNG, and WebP conversion, compression, resizing, and image-to-PDF workflows. Use them when an upload form requires a different format, smaller size, or exact dimensions.",
    useCases: [
      "Convert PNG, JPG, and WebP images for compatibility.",
      "Compress images before uploading or emailing them.",
      "Resize photos and graphics for forms, profiles, and websites.",
      "Turn phone images and scans into a PDF document.",
    ],
    guideSlugs: [
      "how-to-convert-png-to-jpg",
      "webp-vs-jpg-vs-png",
      "how-to-reduce-image-file-size",
    ],
  },
};
