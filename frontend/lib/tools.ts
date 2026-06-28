import {
  Archive,
  FileImage,
  FileSpreadsheet,
  FileText,
  Images,
  Layers,
  Minimize2,
  Scissors,
} from "lucide-react";

export type ToolSlug =
  | "pdf-to-word"
  | "word-to-pdf"
  | "jpg-to-pdf"
  | "pdf-to-jpg"
  | "merge-pdf"
  | "split-pdf"
  | "compress-pdf"
  | "excel-to-pdf";

export type Tool = {
  slug: ToolSlug;
  title: string;
  shortTitle: string;
  description: string;
  seoDescription: string;
  accept: string;
  acceptLabel: string;
  multiple: boolean;
  minimumFiles?: number;
  buttonLabel: string;
  icon: typeof FileText;
  accent: string;
  available: boolean;
  faqs: Array<{ question: string; answer: string }>;
  related: ToolSlug[];
};

const sharedFaqs = {
  security: {
    question: "Are my files secure?",
    answer:
      "Yes. Files receive randomized names, are used only for conversion, and are automatically deleted after one hour.",
  },
  limit: {
    question: "What is the maximum file size?",
    answer: "You can upload files up to 25MB each.",
  },
  software: {
    question: "Do I need to install software?",
    answer:
      "No. The conversion happens online in your browser and on our secure conversion server.",
  },
};

export const tools: Tool[] = [
  {
    slug: "pdf-to-word",
    title: "PDF to Word Converter",
    shortTitle: "PDF to Word",
    description: "Turn PDF documents into editable DOCX files online.",
    seoDescription:
      "Convert PDF to Word online and download an editable DOCX. Preserve text, images, tables, and layout with secure automatic file deletion.",
    accept: ".pdf,application/pdf",
    acceptLabel: "PDF files",
    multiple: false,
    buttonLabel: "Convert to Word",
    icon: FileText,
    accent: "violet",
    available: true,
    faqs: [
      sharedFaqs.security,
      {
        question: "Will the Word file keep my formatting?",
        answer:
          "The converter reconstructs text styles, images, tables, and page layout as closely as possible. Complex multi-column documents may still need small adjustments.",
      },
      {
        question: "Can it convert scanned PDFs?",
        answer:
          "Text-based PDFs work locally. Scanned PDFs require OCR, which is available when the optional ConvertAPI provider is configured.",
      },
      sharedFaqs.limit,
    ],
    related: ["word-to-pdf", "merge-pdf", "compress-pdf"],
  },
  {
    slug: "word-to-pdf",
    title: "Word to PDF Converter",
    shortTitle: "Word to PDF",
    description: "Convert DOC and DOCX documents into polished PDF files.",
    seoDescription:
      "Convert Word to PDF online for free. Upload a DOC or DOCX file and download a clean PDF without registration.",
    accept:
      ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    acceptLabel: "DOC or DOCX files",
    multiple: false,
    buttonLabel: "Convert to PDF",
    icon: FileText,
    accent: "blue",
    available: true,
    faqs: [
      sharedFaqs.security,
      {
        question: "Does Word to PDF preserve formatting?",
        answer:
          "The converter uses LibreOffice to preserve fonts, images, tables, and page layout as closely as possible.",
      },
      sharedFaqs.software,
    ],
    related: ["pdf-to-word", "merge-pdf", "compress-pdf"],
  },
  {
    slug: "jpg-to-pdf",
    title: "JPG to PDF Converter",
    shortTitle: "JPG to PDF",
    description: "Combine JPG and PNG images into one easy-to-share PDF.",
    seoDescription:
      "Convert JPG and PNG images to PDF online. Add multiple images and combine them into one PDF in seconds.",
    accept: ".jpg,.jpeg,.png,image/jpeg,image/png",
    acceptLabel: "JPG, JPEG, or PNG files",
    multiple: true,
    buttonLabel: "Create PDF",
    icon: Images,
    accent: "orange",
    available: true,
    faqs: [
      sharedFaqs.security,
      {
        question: "Can I combine multiple images?",
        answer:
          "Yes. Select up to 20 JPG or PNG images and each image will become a page in the final PDF.",
      },
      sharedFaqs.limit,
    ],
    related: ["pdf-to-jpg", "merge-pdf", "compress-pdf"],
  },
  {
    slug: "pdf-to-jpg",
    title: "PDF to JPG Converter",
    shortTitle: "PDF to JPG",
    description: "Convert every PDF page into a clear JPG image.",
    seoDescription:
      "Convert PDF pages to high-quality JPG images online. Download a single image or a ZIP containing every page.",
    accept: ".pdf,application/pdf",
    acceptLabel: "PDF files",
    multiple: false,
    buttonLabel: "Convert to JPG",
    icon: FileImage,
    accent: "pink",
    available: true,
    faqs: [
      sharedFaqs.security,
      {
        question: "How are multi-page PDFs downloaded?",
        answer:
          "A one-page PDF downloads as a JPG. Multi-page PDFs download as a ZIP containing one JPG per page.",
      },
      sharedFaqs.limit,
    ],
    related: ["jpg-to-pdf", "split-pdf", "compress-pdf"],
  },
  {
    slug: "merge-pdf",
    title: "Merge PDF Files",
    shortTitle: "Merge PDF",
    description: "Combine two or more PDF documents into a single file.",
    seoDescription:
      "Merge PDF files online for free. Select multiple PDFs and combine every page into one secure downloadable document.",
    accept: ".pdf,application/pdf",
    acceptLabel: "PDF files",
    multiple: true,
    minimumFiles: 2,
    buttonLabel: "Merge PDFs",
    icon: Layers,
    accent: "cyan",
    available: true,
    faqs: [
      sharedFaqs.security,
      {
        question: "In what order are PDFs merged?",
        answer:
          "Files are merged in the order shown in the upload list. Select them in your preferred order.",
      },
      sharedFaqs.limit,
    ],
    related: ["split-pdf", "compress-pdf", "jpg-to-pdf"],
  },
  {
    slug: "split-pdf",
    title: "Split PDF Online",
    shortTitle: "Split PDF",
    description: "Separate every page of a PDF into its own document.",
    seoDescription:
      "Split a PDF into individual pages online. Download all separated PDF pages together in one convenient ZIP file.",
    accept: ".pdf,application/pdf",
    acceptLabel: "PDF files",
    multiple: false,
    buttonLabel: "Split PDF",
    icon: Scissors,
    accent: "red",
    available: true,
    faqs: [
      sharedFaqs.security,
      {
        question: "How does PDF splitting work?",
        answer:
          "Every page is saved as a separate PDF and all pages are packaged into one ZIP download.",
      },
      sharedFaqs.limit,
    ],
    related: ["merge-pdf", "compress-pdf", "pdf-to-jpg"],
  },
  {
    slug: "compress-pdf",
    title: "Compress PDF Online",
    shortTitle: "Compress PDF",
    description: "Reduce PDF file size for easier sharing and storage.",
    seoDescription:
      "Compress PDF files online to reduce their size while keeping good visual quality. Fast, secure, and no sign-up required.",
    accept: ".pdf,application/pdf",
    acceptLabel: "PDF files",
    multiple: false,
    buttonLabel: "Compress PDF",
    icon: Minimize2,
    accent: "green",
    available: true,
    faqs: [
      sharedFaqs.security,
      {
        question: "Will compression reduce quality?",
        answer:
          "The balanced compression preset reduces file size while retaining good on-screen and print quality.",
      },
      sharedFaqs.limit,
    ],
    related: ["merge-pdf", "split-pdf", "pdf-to-jpg"],
  },
  {
    slug: "excel-to-pdf",
    title: "Excel to PDF Converter",
    shortTitle: "Excel to PDF",
    description: "Convert XLS and XLSX spreadsheets into PDF documents.",
    seoDescription:
      "Convert Excel spreadsheets to PDF online. Upload XLS or XLSX files and download a shareable PDF without registration.",
    accept:
      ".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    acceptLabel: "XLS or XLSX files",
    multiple: false,
    buttonLabel: "Convert to PDF",
    icon: FileSpreadsheet,
    accent: "emerald",
    available: true,
    faqs: [
      sharedFaqs.security,
      {
        question: "Are all spreadsheet sheets included?",
        answer:
          "LibreOffice exports the workbook according to its print settings, including printable sheets and page ranges.",
      },
      sharedFaqs.software,
    ],
    related: ["word-to-pdf", "merge-pdf", "compress-pdf"],
  },
];

export const toolMap = Object.fromEntries(
  tools.map((tool) => [tool.slug, tool]),
) as Record<ToolSlug, Tool>;
