import type { ConverterSlug } from "@/lib/converters";

export type ConverterContentLink = {
  href: string;
  label: string;
  text: string;
};

export type ConverterSeoContent = {
  intro: string;
  benefits: string[];
  howToSteps: Array<{ title: string; text: string }>;
  formatNotes: string;
  tips: string[];
  contextualLinks: ConverterContentLink[];
};

export const converterSeoContent: Partial<Record<ConverterSlug, ConverterSeoContent>> = {
  "word-to-pdf": {
    intro:
      "Use this Word to PDF converter when you need a stable document for sharing, printing, uploading, or archiving. PDFeed accepts DOC and DOCX files and exports a PDF using the existing server conversion workflow, so you can work from a laptop or phone without installing office software.",
    benefits: [
      "Turn editable DOC and DOCX files into PDFs that are easier to share.",
      "Keep resumes, invoices, reports, forms, and assignments in a fixed page layout.",
      "Use a browser-based workflow when Microsoft Word is not available on the device.",
      "Download the converted PDF before temporary files are deleted after one hour.",
    ],
    howToSteps: [
      {
        title: "Upload a DOC or DOCX file",
        text: "Choose the Word document from your device or drag it into the upload box. The current beta limit is 25MB.",
      },
      {
        title: "Convert the document",
        text: "Select Convert to PDF. PDFeed renders the Word file into a PDF with the saved layout, tables, images, and page settings as closely as possible.",
      },
      {
        title: "Download and review",
        text: "Open the PDF and check page breaks, headers, footers, links, images, and tables before sending it to someone else.",
      },
    ],
    formatNotes:
      "DOC is the older Microsoft Word format, while DOCX is the modern XML-based format used by current versions of Word and many compatible editors. Both can contain text, styles, images, tables, headers, footers, and page settings. A PDF is different: it is meant to preserve the final appearance rather than remain easy to edit.",
    tips: [
      "Accept or reject tracked changes before converting.",
      "Use common fonts when consistent layout matters.",
      "Add intentional page breaks instead of relying on long blank spaces.",
      "Check complex tables and images in the downloaded PDF.",
    ],
    contextualLinks: [
      {
        href: "/pdf-to-word",
        label: "PDF to Word",
        text: "Need to edit a finished PDF later? Try the PDF to Word converter.",
      },
      {
        href: "/compress-pdf",
        label: "Compress PDF",
        text: "If the result is too large to email, reduce it with Compress PDF.",
      },
      {
        href: "/merge-pdf",
        label: "Merge PDF",
        text: "Combine the PDF with other documents using Merge PDF.",
      },
      {
        href: "/powerpoint-to-pdf",
        label: "PowerPoint to PDF",
        text: "Preparing office files for sharing? Convert PowerPoint to PDF too.",
      },
      {
        href: "/excel-to-pdf",
        label: "Excel to PDF",
        text: "For spreadsheets, use Excel to PDF to create a readable snapshot.",
      },
    ],
  },
  "pdf-to-word": {
    intro:
      "Use PDF to Word when you need an editable DOCX version of a PDF. The result is most useful for text-based PDFs that contain selectable text, headings, tables, or images.",
    benefits: [
      "Recover editable text from a PDF when the original Word file is not available.",
      "Make small updates in a DOCX editor instead of rebuilding the document from scratch.",
      "Create a working draft from reports, forms, or proposals that need revision.",
    ],
    howToSteps: [
      { title: "Upload the PDF", text: "Choose a PDF up to 25MB. Text-based documents usually produce the cleanest DOCX output." },
      { title: "Convert to DOCX", text: "Start the conversion and wait for PDFeed to create a downloadable Word document." },
      { title: "Edit carefully", text: "Open the DOCX and review spacing, tables, images, and page breaks before using it as a final file." },
    ],
    formatNotes:
      "PDF is a final-layout format, while DOCX is editable. Because those formats solve different problems, complex PDFs can need cleanup after conversion, especially scanned pages, multi-column layouts, and documents with unusual fonts.",
    tips: [
      "Use the original Word file when you have it.",
      "Expect scanned PDFs to need OCR support.",
      "Check tables and columns after conversion.",
    ],
    contextualLinks: [
      { href: "/word-to-pdf", label: "Word to PDF", text: "After editing, convert the DOCX back to PDF." },
      { href: "/compress-pdf", label: "Compress PDF", text: "Compress large PDFs before sharing." },
      { href: "/merge-pdf", label: "Merge PDF", text: "Merge supporting PDFs into one packet." },
    ],
  },
  "jpg-to-pdf": {
    intro:
      "JPG to PDF is useful when photos, scans, receipts, or screenshots belong together in one document. PDFeed places each selected JPG, JPEG, or PNG image onto a PDF page.",
    benefits: [
      "Send multiple images as one organized PDF.",
      "Create simple document scans from phone photos.",
      "Make image collections easier to print, archive, or upload.",
    ],
    howToSteps: [
      { title: "Select images", text: "Upload JPG, JPEG, or PNG files in the order they should appear." },
      { title: "Create the PDF", text: "PDFeed converts each image into a page in one PDF document." },
      { title: "Review page order", text: "Open the finished PDF and check orientation, readability, and sequence." },
    ],
    formatNotes:
      "JPG works well for photos, while PNG is often better for screenshots or graphics with sharp edges. Converting to PDF packages the existing image quality; it cannot restore detail missing from the source image.",
    tips: [
      "Crop and rotate images before uploading.",
      "Use clear file names when selecting many images.",
      "Check small text after conversion.",
    ],
    contextualLinks: [
      { href: "/compress-pdf", label: "Compress PDF", text: "If the image PDF is too large, compress a copy." },
      { href: "/merge-pdf", label: "Merge PDF", text: "Merge the image PDF with other documents." },
      { href: "/png-to-jpg", label: "PNG to JPG", text: "Convert PNG images to JPG before sharing." },
    ],
  },
  "compress-pdf": {
    intro:
      "Compress PDF helps reduce file size for email, upload portals, and everyday sharing. It is best for distribution copies where smaller size matters more than preserving a print-production master.",
    benefits: [
      "Make large PDFs easier to email or upload.",
      "Reduce image-heavy files while keeping text readable.",
      "Create a smaller copy without changing the original file on your device.",
    ],
    howToSteps: [
      { title: "Upload a PDF", text: "Choose a PDF up to 25MB." },
      { title: "Compress the file", text: "Run the compressor to create a smaller downloadable PDF." },
      { title: "Compare quality", text: "Review images, diagrams, signatures, and small text before using the compressed copy." },
    ],
    formatNotes:
      "PDF size is often driven by scans and high-resolution images. Text-heavy PDFs may already be compact, so the size reduction can be modest.",
    tips: [
      "Keep an original copy before compression.",
      "Remove unnecessary pages before compressing.",
      "Avoid repeatedly compressing the same PDF.",
    ],
    contextualLinks: [
      { href: "/merge-pdf", label: "Merge PDF", text: "Merge first, then compress the final PDF if needed." },
      { href: "/split-pdf", label: "Split PDF", text: "Split out pages you do not need." },
      { href: "/word-to-pdf", label: "Word to PDF", text: "Convert Word files to PDF before compressing a final copy." },
    ],
  },
  "merge-pdf": {
    intro:
      "Merge PDF combines two or more PDF files into one document. It is useful for applications, reports, forms, receipts, and document packets that should stay together.",
    benefits: [
      "Package related PDFs into one download.",
      "Keep documents in the sequence you select.",
      "Simplify sharing when several attachments belong together.",
    ],
    howToSteps: [
      { title: "Choose at least two PDFs", text: "Select files in the order they should appear in the final document." },
      { title: "Merge the pages", text: "PDFeed copies pages from each source file into one PDF." },
      { title: "Inspect the result", text: "Check the first page, last page, and transitions between source documents." },
    ],
    formatNotes:
      "Merging keeps the visible page content from each source PDF. Existing page numbers, bookmarks, or document-level settings may not automatically update.",
    tips: [
      "Name files with numeric prefixes before selecting them.",
      "Remove blank or duplicate pages first.",
      "Compress the merged file only after checking page order.",
    ],
    contextualLinks: [
      { href: "/split-pdf", label: "Split PDF", text: "Split a source PDF first if you only need some pages." },
      { href: "/compress-pdf", label: "Compress PDF", text: "Compress the merged PDF if it is too large." },
      { href: "/jpg-to-pdf", label: "JPG to PDF", text: "Turn image scans into PDF before merging them." },
    ],
  },
  "png-to-jpg": {
    intro:
      "PNG to JPG converts PNG images into widely compatible JPEG files. It is useful for photos, website uploads, email attachments, and apps that do not accept PNG.",
    benefits: [
      "Create a smaller, broadly supported image format.",
      "Flatten transparent PNG areas onto a white background.",
      "Prepare images for forms, marketplaces, and social sharing.",
    ],
    howToSteps: [
      { title: "Upload a PNG", text: "Choose a PNG image up to 25MB." },
      { title: "Convert to JPG", text: "PDFeed uses Sharp to create a JPG while preserving orientation." },
      { title: "Download the image", text: "Review the JPG, especially areas that were transparent in the PNG." },
    ],
    formatNotes:
      "PNG supports transparency and is often good for screenshots or graphics. JPG does not support transparency, so transparent pixels need a solid background. PDFeed uses white to avoid unexpected black backgrounds.",
    tips: [
      "Use PNG for logos or graphics that need transparency.",
      "Use JPG for photos and broad compatibility.",
      "Compress or resize large images after conversion if needed.",
    ],
    contextualLinks: [
      { href: "/jpg-to-png", label: "JPG to PNG", text: "Convert JPG back to PNG when a PNG file is required." },
      { href: "/png-to-webp", label: "PNG to WebP", text: "Try PNG to WebP for modern web images." },
      { href: "/compress-image", label: "Compress Image", text: "Reduce image file size after conversion." },
      { href: "/resize-image", label: "Resize Image", text: "Resize images for upload requirements." },
    ],
  },
  "compress-image": {
    intro:
      "Compress Image reduces JPG, PNG, and WebP file sizes for websites, email, forms, and everyday sharing. You can choose the quality level and compare size savings after conversion.",
    benefits: [
      "Make images easier to upload or send.",
      "Choose a quality level instead of accepting a hidden preset.",
      "See original size, compressed size, and percentage saved.",
    ],
    howToSteps: [
      { title: "Upload an image", text: "Choose a JPG, PNG, or WebP file up to 25MB." },
      { title: "Pick quality", text: "Start around 80% for a balanced result, then adjust if the image needs more detail." },
      { title: "Download and compare", text: "Check both visual quality and the reported file-size reduction." },
    ],
    formatNotes:
      "Photos usually compress well. Screenshots and graphics with flat colors may behave differently depending on the source format. The best setting is the lowest quality that still looks good for the image's purpose.",
    tips: [
      "Keep the original image before compressing.",
      "Use higher quality for product photos and fine detail.",
      "Resize oversized images when dimensions are larger than needed.",
    ],
    contextualLinks: [
      { href: "/resize-image", label: "Resize Image", text: "Resize oversized images before or after compression." },
      { href: "/jpg-to-webp", label: "JPG to WebP", text: "Convert JPG to WebP for web-friendly files." },
      { href: "/png-to-jpg", label: "PNG to JPG", text: "Convert PNG photos to JPG when transparency is not needed." },
    ],
  },
  "powerpoint-to-pdf": {
    intro:
      "PowerPoint to PDF turns PPT and PPTX presentations into a stable format for sharing, printing, and review. A PDF is easier to open when the recipient does not need to edit slides.",
    benefits: [
      "Share slides without requiring PowerPoint.",
      "Preserve a presentation snapshot for clients, classes, or meetings.",
      "Make slide decks easier to print or attach to emails.",
    ],
    howToSteps: [
      { title: "Upload a PPT or PPTX", text: "Choose a presentation up to 25MB." },
      { title: "Convert to PDF", text: "PDFeed uses LibreOffice to export the slide deck as a PDF." },
      { title: "Review each slide", text: "Check fonts, images, charts, slide order, and speaker-note expectations before sharing." },
    ],
    formatNotes:
      "Animations, transitions, embedded video, and speaker notes are not the same in a static PDF. Convert the final visual deck, not a draft that still relies on motion or hidden notes.",
    tips: [
      "Use common fonts for better layout consistency.",
      "Check charts and cropped images after conversion.",
      "Keep the original PPTX for future editing.",
    ],
    contextualLinks: [
      { href: "/word-to-pdf", label: "Word to PDF", text: "Convert written handouts to PDF too." },
      { href: "/excel-to-pdf", label: "Excel to PDF", text: "Convert spreadsheet reports to PDF." },
      { href: "/merge-pdf", label: "Merge PDF", text: "Merge slides with handouts or reports." },
    ],
  },
  "webp-to-png": {
    intro:
      "WebP to PNG is useful when an app, editor, or upload form does not accept WebP. PNG also keeps transparency, making it a practical target for graphics and interface images.",
    benefits: [
      "Convert WebP files into a format accepted by more editing tools.",
      "Keep transparent areas when the source image includes transparency.",
      "Prepare graphics for workflows that require PNG.",
    ],
    howToSteps: [
      { title: "Upload a WebP", text: "Choose a WebP image up to 25MB." },
      { title: "Convert to PNG", text: "PDFeed creates a PNG while preserving orientation." },
      { title: "Download the PNG", text: "Open it in your editor or upload it where PNG is required." },
    ],
    formatNotes:
      "WebP is efficient for the web, while PNG is widely supported for editing, screenshots, and transparency. PNG output may be larger than the original WebP.",
    tips: [
      "Use WebP for websites when supported.",
      "Use PNG for transparency and editing compatibility.",
      "Compress large PNG files if size becomes a problem.",
    ],
    contextualLinks: [
      { href: "/webp-to-jpg", label: "WebP to JPG", text: "Use WebP to JPG when transparency is not needed." },
      { href: "/compress-image", label: "Compress Image", text: "Compress the PNG if it becomes large." },
      { href: "/resize-image", label: "Resize Image", text: "Resize the converted image for upload limits." },
    ],
  },
  "resize-image": {
    intro:
      "Resize Image changes the dimensions of JPG, PNG, and WebP files. It helps when websites, forms, profiles, and marketplaces require a specific width, height, or maximum size.",
    benefits: [
      "Set width, height, or both for upload requirements.",
      "Preserve aspect ratio to avoid stretched images.",
      "Avoid upscaling by default so small images are not enlarged accidentally.",
    ],
    howToSteps: [
      { title: "Upload an image", text: "Choose a JPG, PNG, or WebP image up to 25MB." },
      { title: "Enter dimensions", text: "Set width, height, or both. Leave aspect ratio enabled for natural resizing." },
      { title: "Resize and download", text: "Download the resized image and check that important details remain clear." },
    ],
    formatNotes:
      "Resizing changes pixel dimensions. It can make large images easier to upload, but it cannot add real detail to a small image. Upscaling is off by default for that reason.",
    tips: [
      "Use one dimension with aspect ratio enabled for simple resizing.",
      "Do not upscale low-resolution images unless a form requires exact dimensions.",
      "Compress after resizing if the file is still too large.",
    ],
    contextualLinks: [
      { href: "/compress-image", label: "Compress Image", text: "Compress the resized image if needed." },
      { href: "/png-to-jpg", label: "PNG to JPG", text: "Convert PNG photos to JPG for compatibility." },
      { href: "/jpg-to-webp", label: "JPG to WebP", text: "Convert resized JPG files to WebP for web use." },
    ],
  },
};
