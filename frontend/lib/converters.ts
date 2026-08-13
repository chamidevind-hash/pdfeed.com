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

export type ConverterCategory = "PDF" | "Document" | "Image" | "Spreadsheet";
export type ConverterCategoryId =
  | "pdf-tools"
  | "word-tools"
  | "excel-tools"
  | "powerpoint-tools"
  | "image-tools"
  | "archive-tools"
  | "audio-tools"
  | "video-tools"
  | "ebook-tools"
  | "cad-tools";

export type ConverterIcon =
  | "pdf"
  | "word"
  | "image"
  | "images"
  | "excel"
  | "merge"
  | "split"
  | "compress"
  | "archive";

export type ConverterSlug =
  | "pdf-to-word"
  | "word-to-pdf"
  | "jpg-to-pdf"
  | "pdf-to-jpg"
  | "merge-pdf"
  | "split-pdf"
  | "compress-pdf"
  | "excel-to-pdf"
  | "png-to-jpg"
  | "jpg-to-png"
  | "webp-to-jpg"
  | "webp-to-png"
  | "jpg-to-webp"
  | "png-to-webp"
  | "compress-image"
  | "resize-image"
  | "powerpoint-to-pdf"
  | "txt-to-pdf";

export type ConverterConfig = {
  id: ConverterSlug;
  title: string;
  shortTitle: string;
  slug: ConverterSlug;
  category: ConverterCategoryId;
  input: string[];
  output: string[];
  description: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  icon: ConverterIcon;
  accent: string;
  featured: boolean;
  popular: boolean;
  available: boolean;
  accept: string;
  acceptLabel: string;
  multiple: boolean;
  minimumFiles?: number;
  maxFiles?: number;
  buttonLabel: string;
  apiRoute: `/api/convert/${ConverterSlug}`;
  uploadField: "file" | "files";
  resultType: "pdf" | "docx" | "jpg" | "png" | "webp" | "zip";
  options?: "image-compress" | "image-resize";
  faqs: Array<{ question: string; answer: string }>;
  related?: ConverterSlug[];
};

export type Converter = Omit<ConverterConfig, "icon" | "related"> & {
  icon: typeof FileText;
  related: ConverterSlug[];
  categoryTitle: string;
  categorySlug: ConverterCategoryId;
};

export type CategoryConfig = {
  id: ConverterCategoryId;
  slug: ConverterCategoryId;
  title: string;
  shortTitle: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  icon: ConverterIcon;
  accent: string;
  related: ConverterCategoryId[];
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

export const converterIconMap = {
  pdf: FileText,
  word: FileText,
  image: FileImage,
  images: Images,
  excel: FileSpreadsheet,
  merge: Layers,
  split: Scissors,
  compress: Minimize2,
  archive: Archive,
} satisfies Record<ConverterIcon, typeof FileText>;

export const categoryConfigs: CategoryConfig[] = [
  {
    id: "pdf-tools",
    slug: "pdf-tools",
    title: "PDF Tools",
    shortTitle: "PDF",
    description:
      "Convert, merge, split, compress, and manage PDF files online with fast PDFeed tools.",
    seoTitle: "PDF Tools",
    seoDescription:
      "Browse free online PDF tools from PDFeed. Convert, merge, split, compress, and prepare PDF files securely in your browser.",
    keywords: ["PDF tools", "PDF converter", "merge PDF", "compress PDF"],
    icon: "pdf",
    accent: "blue",
    related: ["word-tools", "image-tools", "excel-tools"],
  },
  {
    id: "word-tools",
    slug: "word-tools",
    title: "Word Tools",
    shortTitle: "Word",
    description:
      "Convert Word documents to PDF and prepare editable document workflows online.",
    seoTitle: "Word Tools",
    seoDescription:
      "Use PDFeed Word tools to convert DOC and DOCX files online. Fast, secure document conversion with automatic file deletion.",
    keywords: ["Word tools", "Word to PDF", "DOCX converter"],
    icon: "word",
    accent: "violet",
    related: ["pdf-tools", "excel-tools", "powerpoint-tools"],
  },
  {
    id: "excel-tools",
    slug: "excel-tools",
    title: "Excel Tools",
    shortTitle: "Excel",
    description:
      "Convert spreadsheets and share Excel files as clean PDF documents.",
    seoTitle: "Excel Tools",
    seoDescription:
      "Browse PDFeed Excel tools for converting XLS and XLSX spreadsheets online. Create shareable PDFs quickly and securely.",
    keywords: ["Excel tools", "Excel to PDF", "XLSX converter"],
    icon: "excel",
    accent: "emerald",
    related: ["pdf-tools", "word-tools", "powerpoint-tools"],
  },
  {
    id: "powerpoint-tools",
    slug: "powerpoint-tools",
    title: "PowerPoint Tools",
    shortTitle: "PowerPoint",
    description:
      "Convert PowerPoint presentations into shareable PDF files online.",
    seoTitle: "PowerPoint Tools",
    seoDescription:
      "Use PDFeed PowerPoint tools to convert PPT and PPTX presentations to PDF online.",
    keywords: ["PowerPoint tools", "PPT converter", "PPTX to PDF"],
    icon: "pdf",
    accent: "orange",
    related: ["pdf-tools", "word-tools", "excel-tools"],
  },
  {
    id: "image-tools",
    slug: "image-tools",
    title: "Image Tools",
    shortTitle: "Image",
    description:
      "Convert, compress, resize, and prepare JPG, PNG, and WebP images online.",
    seoTitle: "Image Tools",
    seoDescription:
      "Use PDFeed image tools to convert JPG, PNG, WebP, and PDF image workflows online for free.",
    keywords: ["image tools", "JPG to PDF", "PDF to JPG", "PNG to JPG", "WebP converter"],
    icon: "images",
    accent: "pink",
    related: ["pdf-tools", "word-tools", "archive-tools"],
  },
  {
    id: "archive-tools",
    slug: "archive-tools",
    title: "Archive Tools",
    shortTitle: "Archive",
    description:
      "Archive conversion and compression tools are planned as PDFeed expands.",
    seoTitle: "Archive Tools",
    seoDescription:
      "Explore upcoming PDFeed archive tools for ZIP and compressed file workflows online.",
    keywords: ["archive tools", "ZIP converter", "file compression"],
    icon: "archive",
    accent: "cyan",
    related: ["pdf-tools", "image-tools", "ebook-tools"],
  },
  {
    id: "audio-tools",
    slug: "audio-tools",
    title: "Audio Tools",
    shortTitle: "Audio",
    description:
      "Audio conversion tools are planned for future PDFeed file workflows.",
    seoTitle: "Audio Tools",
    seoDescription:
      "Explore upcoming PDFeed audio tools for online audio file conversion.",
    keywords: ["audio tools", "audio converter", "MP3 converter"],
    icon: "archive",
    accent: "green",
    related: ["video-tools", "archive-tools", "image-tools"],
  },
  {
    id: "video-tools",
    slug: "video-tools",
    title: "Video Tools",
    shortTitle: "Video",
    description:
      "Video conversion tools are planned as PDFeed grows into more file types.",
    seoTitle: "Video Tools",
    seoDescription:
      "Explore upcoming PDFeed video tools for online video file conversion.",
    keywords: ["video tools", "video converter", "MP4 converter"],
    icon: "archive",
    accent: "red",
    related: ["audio-tools", "image-tools", "archive-tools"],
  },
  {
    id: "ebook-tools",
    slug: "ebook-tools",
    title: "eBook Tools",
    shortTitle: "eBook",
    description:
      "eBook conversion tools are planned for future PDFeed document workflows.",
    seoTitle: "eBook Tools",
    seoDescription:
      "Explore upcoming PDFeed eBook tools for converting digital book files online.",
    keywords: ["eBook tools", "ebook converter", "EPUB converter"],
    icon: "pdf",
    accent: "emerald",
    related: ["pdf-tools", "word-tools", "archive-tools"],
  },
  {
    id: "cad-tools",
    slug: "cad-tools",
    title: "CAD Tools",
    shortTitle: "CAD",
    description:
      "CAD file conversion tools are planned for future technical file workflows.",
    seoTitle: "CAD Tools",
    seoDescription:
      "Explore upcoming PDFeed CAD tools for technical drawing and design file conversion.",
    keywords: ["CAD tools", "CAD converter", "DWG converter"],
    icon: "archive",
    accent: "violet",
    related: ["pdf-tools", "image-tools", "archive-tools"],
  },
];

export const categoryConfigMap = Object.fromEntries(
  categoryConfigs.map((category) => [category.id, category]),
) as Record<ConverterCategoryId, CategoryConfig>;

export const converterConfigs: ConverterConfig[] = [
  {
    id: "pdf-to-word",
    title: "PDF to Word Converter",
    shortTitle: "PDF to Word",
    slug: "pdf-to-word",
    category: "pdf-tools",
    input: ["pdf"],
    output: ["docx"],
    description: "Turn PDF documents into editable DOCX files online.",
    seoTitle: "PDF to Word Converter - Convert PDF to DOCX Online",
    seoDescription:
      "Convert PDF to Word online and download an editable DOCX. Preserve text, images, tables, and layout with secure automatic file deletion.",
    keywords: ["PDF to Word", "convert PDF to Word", "PDF to DOCX"],
    icon: "word",
    accent: "violet",
    featured: true,
    popular: true,
    available: true,
    accept: ".pdf,application/pdf",
    acceptLabel: "PDF files",
    multiple: false,
    buttonLabel: "Convert to Word",
    apiRoute: "/api/convert/pdf-to-word",
    uploadField: "file",
    resultType: "docx",
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
  },
  {
    id: "word-to-pdf",
    title: "Convert Word to PDF Online",
    shortTitle: "Word to PDF",
    slug: "word-to-pdf",
    category: "word-tools",
    input: ["doc", "docx"],
    output: ["pdf"],
    description: "Convert DOC and DOCX documents into polished PDF files.",
    seoTitle: "Word to PDF Converter - Convert DOCX to PDF Free",
    seoDescription:
      "Convert Word to PDF online for free. Upload DOC or DOCX files, create a shareable PDF, and download it without installing software.",
    keywords: [
      "Word to PDF",
      "convert Word to PDF",
      "DOCX to PDF",
      "DOC to PDF",
      "Word document to PDF",
      "convert Word to PDF online",
    ],
    icon: "word",
    accent: "blue",
    featured: true,
    popular: true,
    available: true,
    accept:
      ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    acceptLabel: "DOC or DOCX files",
    multiple: false,
    buttonLabel: "Convert to PDF",
    apiRoute: "/api/convert/word-to-pdf",
    uploadField: "file",
    resultType: "pdf",
    faqs: [
      sharedFaqs.security,
      {
        question: "Does Word to PDF preserve formatting?",
        answer:
          "The converter uses LibreOffice to preserve fonts, images, tables, and page layout as closely as possible.",
      },
      sharedFaqs.software,
    ],
  },
  {
    id: "jpg-to-pdf",
    title: "JPG to PDF Converter",
    shortTitle: "JPG to PDF",
    slug: "jpg-to-pdf",
    category: "image-tools",
    input: ["jpg", "jpeg", "png"],
    output: ["pdf"],
    description: "Combine JPG and PNG images into one easy-to-share PDF.",
    seoTitle: "JPG to PDF Converter - Combine Images Into PDF",
    seoDescription:
      "Convert JPG and PNG images to PDF online. Add multiple images and combine them into one PDF in seconds.",
    keywords: ["JPG to PDF", "PNG to PDF", "image to PDF"],
    icon: "images",
    accent: "orange",
    featured: true,
    popular: true,
    available: true,
    accept: ".jpg,.jpeg,.png,image/jpeg,image/png",
    acceptLabel: "JPG, JPEG, or PNG files",
    multiple: true,
    maxFiles: 20,
    buttonLabel: "Create PDF",
    apiRoute: "/api/convert/jpg-to-pdf",
    uploadField: "files",
    resultType: "pdf",
    faqs: [
      sharedFaqs.security,
      {
        question: "Can I combine multiple images?",
        answer:
          "Yes. Select up to 20 JPG or PNG images and each image will become a page in the final PDF.",
      },
      sharedFaqs.limit,
    ],
  },
  {
    id: "pdf-to-jpg",
    title: "PDF to JPG Converter",
    shortTitle: "PDF to JPG",
    slug: "pdf-to-jpg",
    category: "image-tools",
    input: ["pdf"],
    output: ["jpg"],
    description: "Convert every PDF page into a clear JPG image.",
    seoTitle: "PDF to JPG Converter",
    seoDescription:
      "Convert PDF pages to high-quality JPG images online. Download a single image or a ZIP containing every page.",
    keywords: ["PDF to JPG", "PDF to image", "convert PDF pages to JPG"],
    icon: "image",
    accent: "pink",
    featured: true,
    popular: true,
    available: true,
    accept: ".pdf,application/pdf",
    acceptLabel: "PDF files",
    multiple: false,
    buttonLabel: "Convert to JPG",
    apiRoute: "/api/convert/pdf-to-jpg",
    uploadField: "file",
    resultType: "jpg",
    faqs: [
      sharedFaqs.security,
      {
        question: "How are multi-page PDFs downloaded?",
        answer:
          "A one-page PDF downloads as a JPG. Multi-page PDFs download as a ZIP containing one JPG per page.",
      },
      sharedFaqs.limit,
    ],
  },
  {
    id: "png-to-jpg",
    title: "PNG to JPG Converter",
    shortTitle: "PNG to JPG",
    slug: "png-to-jpg",
    category: "image-tools",
    input: ["png"],
    output: ["jpg"],
    description: "Convert PNG images to high-quality JPG files online.",
    seoTitle: "PNG to JPG Converter - Convert PNG Images Online",
    seoDescription:
      "Convert PNG to JPG online with PDFeed. Transparent areas are safely placed on a white background for clean JPG output.",
    keywords: ["PNG to JPG", "convert PNG to JPG", "PNG converter"],
    icon: "image",
    accent: "orange",
    featured: true,
    popular: true,
    available: true,
    accept: ".png,image/png",
    acceptLabel: "PNG files",
    multiple: false,
    buttonLabel: "Convert to JPG",
    apiRoute: "/api/convert/png-to-jpg",
    uploadField: "file",
    resultType: "jpg",
    faqs: [
      sharedFaqs.security,
      {
        question: "What happens to transparent PNG areas?",
        answer:
          "Transparent areas are flattened onto a white background so the JPG does not render transparency as black.",
      },
      sharedFaqs.limit,
    ],
  },
  {
    id: "jpg-to-png",
    title: "JPG to PNG Converter",
    shortTitle: "JPG to PNG",
    slug: "jpg-to-png",
    category: "image-tools",
    input: ["jpg", "jpeg"],
    output: ["png"],
    description: "Convert JPG and JPEG images into PNG files online.",
    seoTitle: "JPG to PNG Converter",
    seoDescription:
      "Convert JPG to PNG online for free. Upload a JPEG image and download a PNG file with PDFeed.",
    keywords: ["JPG to PNG", "JPEG to PNG", "convert JPG to PNG"],
    icon: "image",
    accent: "blue",
    featured: true,
    popular: false,
    available: true,
    accept: ".jpg,.jpeg,image/jpeg",
    acceptLabel: "JPG or JPEG files",
    multiple: false,
    buttonLabel: "Convert to PNG",
    apiRoute: "/api/convert/jpg-to-png",
    uploadField: "file",
    resultType: "png",
    faqs: [sharedFaqs.security, sharedFaqs.limit],
  },
  {
    id: "webp-to-jpg",
    title: "WebP to JPG Converter",
    shortTitle: "WebP to JPG",
    slug: "webp-to-jpg",
    category: "image-tools",
    input: ["webp"],
    output: ["jpg"],
    description: "Convert WebP images to widely compatible JPG files.",
    seoTitle: "WebP to JPG Converter",
    seoDescription:
      "Convert WebP to JPG online. Download a compatible JPEG image while preserving orientation and using a white background for transparency.",
    keywords: ["WebP to JPG", "convert WebP to JPG", "WebP converter"],
    icon: "image",
    accent: "pink",
    featured: true,
    popular: true,
    available: true,
    accept: ".webp,image/webp",
    acceptLabel: "WebP files",
    multiple: false,
    buttonLabel: "Convert to JPG",
    apiRoute: "/api/convert/webp-to-jpg",
    uploadField: "file",
    resultType: "jpg",
    faqs: [sharedFaqs.security, sharedFaqs.limit],
  },
  {
    id: "webp-to-png",
    title: "WebP to PNG Converter",
    shortTitle: "WebP to PNG",
    slug: "webp-to-png",
    category: "image-tools",
    input: ["webp"],
    output: ["png"],
    description: "Convert WebP images into PNG files online.",
    seoTitle: "WebP to PNG Converter - Convert WebP Images Online",
    seoDescription:
      "Convert WebP to PNG online with PDFeed. Upload a WebP image and download a clean PNG file.",
    keywords: ["WebP to PNG", "convert WebP to PNG", "WebP image converter"],
    icon: "image",
    accent: "violet",
    featured: true,
    popular: false,
    available: true,
    accept: ".webp,image/webp",
    acceptLabel: "WebP files",
    multiple: false,
    buttonLabel: "Convert to PNG",
    apiRoute: "/api/convert/webp-to-png",
    uploadField: "file",
    resultType: "png",
    faqs: [sharedFaqs.security, sharedFaqs.limit],
  },
  {
    id: "jpg-to-webp",
    title: "JPG to WebP Converter",
    shortTitle: "JPG to WebP",
    slug: "jpg-to-webp",
    category: "image-tools",
    input: ["jpg", "jpeg"],
    output: ["webp"],
    description: "Convert JPG images to modern WebP files online.",
    seoTitle: "JPG to WebP Converter",
    seoDescription:
      "Convert JPG to WebP online to create modern web-friendly images with good visual quality.",
    keywords: ["JPG to WebP", "JPEG to WebP", "convert image to WebP"],
    icon: "image",
    accent: "green",
    featured: true,
    popular: true,
    available: true,
    accept: ".jpg,.jpeg,image/jpeg",
    acceptLabel: "JPG or JPEG files",
    multiple: false,
    buttonLabel: "Convert to WebP",
    apiRoute: "/api/convert/jpg-to-webp",
    uploadField: "file",
    resultType: "webp",
    faqs: [sharedFaqs.security, sharedFaqs.limit],
  },
  {
    id: "png-to-webp",
    title: "PNG to WebP Converter",
    shortTitle: "PNG to WebP",
    slug: "png-to-webp",
    category: "image-tools",
    input: ["png"],
    output: ["webp"],
    description: "Convert PNG images to efficient WebP files.",
    seoTitle: "PNG to WebP Converter",
    seoDescription:
      "Convert PNG to WebP online with PDFeed. Create compact web-friendly images without installing software.",
    keywords: ["PNG to WebP", "convert PNG to WebP", "WebP converter"],
    icon: "image",
    accent: "emerald",
    featured: true,
    popular: false,
    available: true,
    accept: ".png,image/png",
    acceptLabel: "PNG files",
    multiple: false,
    buttonLabel: "Convert to WebP",
    apiRoute: "/api/convert/png-to-webp",
    uploadField: "file",
    resultType: "webp",
    faqs: [sharedFaqs.security, sharedFaqs.limit],
  },
  {
    id: "compress-image",
    title: "Compress Image Online",
    shortTitle: "Compress Image",
    slug: "compress-image",
    category: "image-tools",
    input: ["jpg", "jpeg", "png", "webp"],
    output: ["jpg", "png", "webp"],
    description: "Reduce image file size while keeping clear visual quality.",
    seoTitle: "Compress Image Online - Reduce JPG, PNG, and WebP Size",
    seoDescription:
      "Compress JPG, PNG, and WebP images online. Choose image quality and compare the original and compressed file sizes.",
    keywords: ["compress image", "image compressor", "reduce image size"],
    icon: "compress",
    accent: "cyan",
    featured: true,
    popular: true,
    available: true,
    accept: ".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp",
    acceptLabel: "JPG, PNG, or WebP files",
    multiple: false,
    buttonLabel: "Compress Image",
    apiRoute: "/api/convert/compress-image",
    uploadField: "file",
    resultType: "jpg",
    options: "image-compress",
    faqs: [
      sharedFaqs.security,
      {
        question: "What image quality should I choose?",
        answer:
          "The default 80% quality is a good balance for most web and sharing use cases. Use a higher value when fine details matter.",
      },
      sharedFaqs.limit,
    ],
  },
  {
    id: "resize-image",
    title: "Resize Image Online",
    shortTitle: "Resize Image",
    slug: "resize-image",
    category: "image-tools",
    input: ["jpg", "jpeg", "png", "webp"],
    output: ["jpg", "png", "webp"],
    description: "Resize JPG, PNG, and WebP images by width and height.",
    seoTitle: "Resize Image Online - Change Image Dimensions",
    seoDescription:
      "Resize images online with PDFeed. Set width and height, preserve aspect ratio, and avoid unwanted upscaling by default.",
    keywords: ["resize image", "image resizer", "change image dimensions"],
    icon: "image",
    accent: "red",
    featured: true,
    popular: true,
    available: true,
    accept: ".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp",
    acceptLabel: "JPG, PNG, or WebP files",
    multiple: false,
    buttonLabel: "Resize Image",
    apiRoute: "/api/convert/resize-image",
    uploadField: "file",
    resultType: "jpg",
    options: "image-resize",
    faqs: [
      sharedFaqs.security,
      {
        question: "Will PDFeed upscale small images?",
        answer:
          "No. Upscaling is disabled by default so small images are not enlarged unless you explicitly allow it.",
      },
      sharedFaqs.limit,
    ],
  },
  {
    id: "merge-pdf",
    title: "Merge PDF Files",
    shortTitle: "Merge PDF",
    slug: "merge-pdf",
    category: "pdf-tools",
    input: ["pdf"],
    output: ["pdf"],
    description: "Combine two or more PDF documents into a single file.",
    seoTitle: "Merge PDF Files Online - Combine PDFs Free",
    seoDescription:
      "Merge PDF files online for free. Select multiple PDFs and combine every page into one secure downloadable document.",
    keywords: ["merge PDF", "combine PDF", "merge PDF files online"],
    icon: "merge",
    accent: "cyan",
    featured: true,
    popular: true,
    available: true,
    accept: ".pdf,application/pdf",
    acceptLabel: "PDF files",
    multiple: true,
    minimumFiles: 2,
    maxFiles: 20,
    buttonLabel: "Merge PDFs",
    apiRoute: "/api/convert/merge-pdf",
    uploadField: "files",
    resultType: "pdf",
    faqs: [
      sharedFaqs.security,
      {
        question: "In what order are PDFs merged?",
        answer:
          "Files are merged in the order shown in the upload list. Select them in your preferred order.",
      },
      sharedFaqs.limit,
    ],
  },
  {
    id: "split-pdf",
    title: "Split PDF Online",
    shortTitle: "Split PDF",
    slug: "split-pdf",
    category: "pdf-tools",
    input: ["pdf"],
    output: ["zip"],
    description: "Separate every page of a PDF into its own document.",
    seoTitle: "Split PDF Online",
    seoDescription:
      "Split a PDF into individual pages online. Download all separated PDF pages together in one convenient ZIP file.",
    keywords: ["split PDF", "separate PDF pages", "PDF splitter"],
    icon: "split",
    accent: "red",
    featured: true,
    popular: true,
    available: true,
    accept: ".pdf,application/pdf",
    acceptLabel: "PDF files",
    multiple: false,
    buttonLabel: "Split PDF",
    apiRoute: "/api/convert/split-pdf",
    uploadField: "file",
    resultType: "zip",
    faqs: [
      sharedFaqs.security,
      {
        question: "How does PDF splitting work?",
        answer:
          "Every page is saved as a separate PDF and all pages are packaged into one ZIP download.",
      },
      sharedFaqs.limit,
    ],
  },
  {
    id: "compress-pdf",
    title: "Compress PDF Online",
    shortTitle: "Compress PDF",
    slug: "compress-pdf",
    category: "pdf-tools",
    input: ["pdf"],
    output: ["pdf"],
    description: "Reduce PDF file size for easier sharing and storage.",
    seoTitle: "Compress PDF Online - Reduce PDF File Size",
    seoDescription:
      "Compress PDF files online to reduce their size while keeping good visual quality. Fast, secure, and no sign-up required.",
    keywords: ["compress PDF", "reduce PDF size", "PDF compressor"],
    icon: "compress",
    accent: "green",
    featured: true,
    popular: true,
    available: true,
    accept: ".pdf,application/pdf",
    acceptLabel: "PDF files",
    multiple: false,
    buttonLabel: "Compress PDF",
    apiRoute: "/api/convert/compress-pdf",
    uploadField: "file",
    resultType: "pdf",
    faqs: [
      sharedFaqs.security,
      {
        question: "Will compression reduce quality?",
        answer:
          "The balanced compression preset reduces file size while retaining good on-screen and print quality.",
      },
      sharedFaqs.limit,
    ],
  },
  {
    id: "excel-to-pdf",
    title: "Excel to PDF Converter",
    shortTitle: "Excel to PDF",
    slug: "excel-to-pdf",
    category: "excel-tools",
    input: ["xls", "xlsx"],
    output: ["pdf"],
    description: "Convert XLS and XLSX spreadsheets into PDF documents.",
    seoTitle: "Excel to PDF Converter",
    seoDescription:
      "Convert Excel spreadsheets to PDF online. Upload XLS or XLSX files and download a shareable PDF without registration.",
    keywords: ["Excel to PDF", "XLSX to PDF", "convert Excel to PDF"],
    icon: "excel",
    accent: "emerald",
    featured: true,
    popular: true,
    available: true,
    accept:
      ".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    acceptLabel: "XLS or XLSX files",
    multiple: false,
    buttonLabel: "Convert to PDF",
    apiRoute: "/api/convert/excel-to-pdf",
    uploadField: "file",
    resultType: "pdf",
    faqs: [
      sharedFaqs.security,
      {
        question: "Are all spreadsheet sheets included?",
        answer:
          "LibreOffice exports the workbook according to its print settings, including printable sheets and page ranges.",
      },
      sharedFaqs.software,
    ],
  },
  {
    id: "powerpoint-to-pdf",
    title: "PowerPoint to PDF Converter",
    shortTitle: "PowerPoint to PDF",
    slug: "powerpoint-to-pdf",
    category: "powerpoint-tools",
    input: ["ppt", "pptx"],
    output: ["pdf"],
    description: "Convert PPT and PPTX presentations into PDF files.",
    seoTitle: "PowerPoint to PDF Converter - Convert PPTX to PDF",
    seoDescription:
      "Convert PowerPoint presentations to PDF online. Upload PPT or PPTX files and download a shareable PDF with PDFeed.",
    keywords: ["PowerPoint to PDF", "PPT to PDF", "PPTX to PDF"],
    icon: "pdf",
    accent: "orange",
    featured: true,
    popular: true,
    available: true,
    accept:
      ".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation",
    acceptLabel: "PPT or PPTX files",
    multiple: false,
    buttonLabel: "Convert to PDF",
    apiRoute: "/api/convert/powerpoint-to-pdf",
    uploadField: "file",
    resultType: "pdf",
    faqs: [
      sharedFaqs.security,
      {
        question: "Are slide layouts preserved?",
        answer:
          "PDFeed uses LibreOffice to export presentations to PDF while preserving slide layout, images, and text as closely as possible.",
      },
      sharedFaqs.software,
    ],
  },
  {
    id: "txt-to-pdf",
    title: "TXT to PDF Converter",
    shortTitle: "TXT to PDF",
    slug: "txt-to-pdf",
    category: "pdf-tools",
    input: ["txt"],
    output: ["pdf"],
    description: "Convert plain text files into readable PDF documents.",
    seoTitle: "TXT to PDF Converter",
    seoDescription:
      "Convert TXT files to PDF online. Preserve line breaks, support UTF-8 text, and create a readable multipage PDF.",
    keywords: ["TXT to PDF", "text to PDF", "convert text file to PDF"],
    icon: "pdf",
    accent: "blue",
    featured: true,
    popular: false,
    available: true,
    accept: ".txt,text/plain",
    acceptLabel: "TXT files",
    multiple: false,
    buttonLabel: "Convert to PDF",
    apiRoute: "/api/convert/txt-to-pdf",
    uploadField: "file",
    resultType: "pdf",
    faqs: [
      sharedFaqs.security,
      {
        question: "Does TXT to PDF preserve line breaks?",
        answer:
          "Yes. The converter reads the text file as UTF-8 and keeps line breaks while wrapping long lines across pages.",
      },
      sharedFaqs.limit,
    ],
  },
];

function relatedFor(converter: ConverterConfig): ConverterSlug[] {
  if (converter.related) return converter.related;

  return converterConfigs
    .filter((item) => item.slug !== converter.slug)
    .map((item) => {
      let score = 0;
      if (item.category === converter.category) score += 40;
      if (item.input.some((extension) => converter.input.includes(extension))) score += 24;
      if (item.output.some((extension) => converter.output.includes(extension))) score += 20;
      if (item.featured) score += 8;
      if (item.popular) score += 6;
      return { item, score };
    })
    .sort((a, b) => b.score - a.score || a.item.shortTitle.localeCompare(b.item.shortTitle))
    .slice(0, 3)
    .map(({ item }) => item.slug);
}

export const converters: Converter[] = converterConfigs.map((converter) => ({
  ...converter,
  icon: converterIconMap[converter.icon],
  related: relatedFor(converter),
  categoryTitle: categoryConfigMap[converter.category].title,
  categorySlug: converter.category,
}));

export const converterMap = Object.fromEntries(
  converters.map((converter) => [converter.slug, converter]),
) as Record<ConverterSlug, Converter>;

export const popularConverters = converters.filter((converter) => converter.popular);

export const featuredConverters = converters.filter((converter) => converter.featured);

export const converterCategories = categoryConfigs;

export const categorySlugs = categoryConfigs.map((category) => ({
  category: category.id,
  slug: category.slug,
}));

export const categoryMap = Object.fromEntries(
  categoryConfigs.map((category) => [category.slug, category]),
) as Record<ConverterCategoryId, CategoryConfig>;

export const convertersByCategory = Object.fromEntries(
  categoryConfigs.map((category) => [
    category.id,
    converters.filter((converter) => converter.category === category.id),
  ]),
) as Record<ConverterCategoryId, Converter[]>;

export const featuredConvertersByCategory = Object.fromEntries(
  categoryConfigs.map((category) => [
    category.id,
    converters.filter(
      (converter) => converter.category === category.id && converter.featured,
    ),
  ]),
) as Record<ConverterCategoryId, Converter[]>;

export const categoriesWithConverters = categoryConfigs.map((category) => ({
  ...category,
  iconComponent: converterIconMap[category.icon],
  converters: convertersByCategory[category.id],
  featuredConverters: featuredConvertersByCategory[category.id],
  availableToolCount: convertersByCategory[category.id].filter(
    (converter) => converter.available,
  ).length,
}));

export type CategoryPageData = (typeof categoriesWithConverters)[number];

export const categoryPageMap = Object.fromEntries(
  categoriesWithConverters.map((category) => [category.slug, category]),
) as Record<ConverterCategoryId, (typeof categoriesWithConverters)[number]>;

export const converterSearchIndex = converters.map((converter) => ({
  id: converter.id,
  title: converter.shortTitle,
  slug: converter.slug,
  href: `/${converter.slug}`,
  category: converter.category,
  description: converter.description,
  input: converter.input,
  output: converter.output,
  keywords: converter.keywords,
}));

export const categorySearchIndex = categoriesWithConverters.map((category) => ({
  id: category.id,
  type: "category" as const,
  title: category.title,
  slug: category.slug,
  href: `/${category.slug}`,
  description: category.description,
  keywords: category.keywords,
}));

export const siteSearchIndex = [
  ...converterSearchIndex.map((converter) => ({
    ...converter,
    type: "converter" as const,
  })),
  ...categorySearchIndex,
];

export const converterApiRoutes = Object.fromEntries(
  converterConfigs.map((converter) => [
    converter.slug,
    {
      apiRoute: converter.apiRoute,
      uploadField: converter.uploadField,
      input: converter.input,
      output: converter.output,
      multiple: converter.multiple,
      minimumFiles: converter.minimumFiles || 1,
      maxFiles: converter.maxFiles || 1,
      resultType: converter.resultType,
    },
  ]),
) as Record<
  ConverterSlug,
  {
    apiRoute: `/api/convert/${ConverterSlug}`;
    uploadField: "file" | "files";
    input: string[];
    output: string[];
    multiple: boolean;
    minimumFiles: number;
    maxFiles: number;
    resultType: "pdf" | "docx" | "jpg" | "png" | "webp" | "zip";
  }
>;
