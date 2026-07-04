export type BlogSection = {
  id: string;
  title: string;
  paragraphs?: string[];
  steps?: Array<{ title: string; text: string }>;
  bullets?: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  publishedAt: string;
  publishedLabel: string;
  readTime: string;
  targetKeyword: string;
  toolPath: string;
  toolLabel: string;
  accent: string;
  sections: BlogSection[];
  faqs: Array<{ question: string; answer: string }>;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-convert-word-to-pdf-online-free",
    title: "How to Convert Word to PDF Online Free",
    description:
      "Learn how to convert Word to PDF online for free, preserve your document layout, and prepare a clean PDF for sharing with PDFeed.",
    excerpt:
      "A practical guide to turning DOC and DOCX files into polished, shareable PDFs without installing software.",
    publishedAt: "2026-07-01",
    publishedLabel: "July 1, 2026",
    readTime: "6 min read",
    targetKeyword: "convert Word to PDF online",
    toolPath: "/word-to-pdf",
    toolLabel: "Convert Word to PDF",
    accent: "blue",
    sections: [
      {
        id: "why-convert",
        title: "Why convert a Word document to PDF?",
        paragraphs: [
          "Word documents are ideal while a file is being written and edited. Once the document is ready to send, however, PDF is often the more dependable format. A PDF fixes the page structure so headings, paragraphs, images, tables, headers, and page breaks are less likely to move when another person opens the file on a different device.",
          "That consistency matters for resumes, proposals, invoices, reports, school assignments, forms, and other documents where presentation is part of the message. A recipient can open a PDF on a phone, tablet, or computer without needing the same version of Microsoft Word or the same fonts installed. PDFs are also convenient for printing and archiving because their page dimensions remain predictable.",
          "You can convert Word to PDF online when you need a quick result and do not want to install desktop software. PDFeed accepts DOC and DOCX files up to 25MB and produces a downloadable PDF in a few steps. No account is required during the free beta.",
        ],
      },
      {
        id: "before-you-start",
        title: "Before you convert your document",
        paragraphs: [
          "Take a minute to review the source file before converting it. Resolve tracked changes, remove comments that should not be shared, confirm page breaks, and check that images are not extending beyond the page margins. If the document contains unusual fonts, consider replacing them with common fonts or embedding them when your editor supports that option. These small checks reduce surprises in the finished PDF.",
          "Online conversion is suitable for everyday files, but use judgment about privacy. PDFeed stores uploads temporarily for processing and automatically deletes uploaded and converted files after one hour. Even with that limited retention, avoid uploading highly sensitive documents such as unredacted identity records, confidential legal material, private health information, or files containing passwords and financial credentials.",
        ],
      },
      {
        id: "steps",
        title: "How to convert Word to PDF online",
        steps: [
          { title: "Open the Word to PDF tool", text: "Go to the PDFeed Word to PDF converter in any modern browser. You do not need to create an account or install an extension." },
          { title: "Choose your Word file", text: "Drag a DOC or DOCX file into the upload area, or select it from your device. Confirm that it is the correct version and is no larger than 25MB." },
          { title: "Start the conversion", text: "Select Convert to PDF. PDFeed sends the file to the conversion service, where LibreOffice renders the document as a PDF." },
          { title: "Download and review", text: "When processing finishes, use the download button to save the PDF. Open it and check page breaks, fonts, images, links, and tables before sharing it." },
        ],
      },
      {
        id: "formatting",
        title: "How to preserve formatting",
        paragraphs: [
          "Most ordinary Word layouts convert cleanly, but complex documents deserve an extra review. Floating text boxes, uncommon fonts, intricate equations, macros, and linked external content may render differently outside Word. Keeping images anchored, using built-in heading styles, and defining page margins consistently gives the converter a clearer structure to follow.",
          "If a page shifts, edit the original Word file rather than trying to repair the PDF. Add an intentional page break, resize an image, simplify a table, or switch an unsupported font, then convert the revised document again. This preserves an editable source and usually produces a cleaner result.",
        ],
        bullets: [
          "Use standard page sizes such as A4 or Letter.",
          "Accept or reject tracked changes before conversion.",
          "Check that headers, footers, and page numbers are correct.",
          "Compress oversized images in Word if the source file is too large.",
        ],
      },
      {
        id: "after-conversion",
        title: "What to do after conversion",
        paragraphs: [
          "Give the downloaded file a descriptive name and keep the editable Word original in a safe location. If several PDFs belong in one package, use PDFeed's Merge PDF tool to combine them. If the result is too large for an email attachment or upload portal, the Compress PDF tool can reduce its size. Always inspect the final version after any additional processing.",
          "A successful conversion makes sharing easier, but it does not prove that the content is accurate. Recheck names, dates, totals, signatures, and links before sending an important document. That final human review is the best way to catch both content mistakes and unusual formatting changes.",
        ],
      },
    ],
    faqs: [
      { question: "Can I convert Word to PDF without Microsoft Word?", answer: "Yes. PDFeed performs the conversion online using LibreOffice, so Microsoft Word does not need to be installed on your device." },
      { question: "Will links in my Word document still work?", answer: "Standard hyperlinks are usually preserved, although you should test important links in the downloaded PDF before sharing it." },
      { question: "Are my Word files kept permanently?", answer: "No. Uploaded and converted files are temporary and are automatically deleted after one hour." },
      { question: "Why did a page break move?", answer: "Font availability, floating objects, and complex spacing can affect pagination. Adjust the editable Word source, add explicit page breaks, and convert it again." },
    ],
  },
  {
    slug: "how-to-compress-pdf-without-losing-quality",
    title: "How to Compress PDF Without Losing Quality",
    description:
      "Learn how to compress PDF without losing quality, what affects PDF size, and how to get a smaller, readable file with PDFeed.",
    excerpt:
      "Understand PDF compression and reduce large documents while keeping text and images clear enough for their purpose.",
    publishedAt: "2026-07-01",
    publishedLabel: "July 1, 2026",
    readTime: "7 min read",
    targetKeyword: "compress PDF without losing quality",
    toolPath: "/compress-pdf",
    toolLabel: "Compress a PDF",
    accent: "green",
    sections: [
      {
        id: "quality-means",
        title: "What does “without losing quality” mean?",
        paragraphs: [
          "PDF compression is a balance between file size and visual fidelity. A smaller file is easier to email, upload, store, and download, but aggressive compression can soften photographs or introduce visible artifacts. When people ask how to compress PDF without losing quality, they usually mean reducing unnecessary data while keeping the document clear for its intended use.",
          "Text and vector graphics can often remain sharp because they are stored as instructions rather than large pixel grids. Scanned pages and photographs are different: they are images, and image data usually accounts for most of the file size. Compressing those images may be visually lossless at normal viewing size even though some technical image data is removed.",
          "The right result therefore depends on context. A PDF meant for reading on a screen can be smaller than a print-ready brochure. A scanned receipt can tolerate more reduction than an architectural plan with tiny labels. Review the compressed document at the zoom level and output method your recipients will use.",
        ],
      },
      {
        id: "why-large",
        title: "Why PDF files become large",
        paragraphs: [
          "High-resolution images, full-page scans, embedded fonts, duplicate resources, attachments, and unnecessary metadata can all increase PDF size. Smartphone scans are a common cause because every page may be stored as a large color photograph, even when the document contains only black text on white paper. Export settings from design and office applications also sometimes prioritize maximum print quality over practical sharing.",
          "Before compressing, check whether the PDF contains pages you do not need. Splitting out an unnecessary appendix can produce a better result than lowering image quality throughout the entire document. PDFeed's Split PDF tool separates pages into individual files, while Merge PDF can rebuild a document from only the pages you want.",
        ],
      },
      {
        id: "steps",
        title: "How to compress a PDF with PDFeed",
        steps: [
          { title: "Open the Compress PDF tool", text: "Visit PDFeed's online PDF compressor from a desktop or mobile browser. No registration is required during the free beta." },
          { title: "Upload the PDF", text: "Drag the document into the upload box or choose it from your device. The current maximum file size is 25MB." },
          { title: "Run the compression", text: "Select Compress PDF. The service applies a balanced compression preset designed to reduce size while retaining useful on-screen and print quality." },
          { title: "Download and compare", text: "Save the compressed file, compare its size with the original, and inspect text, photos, diagrams, and fine details before distributing it." },
        ],
      },
      {
        id: "best-results",
        title: "Tips for the best size-to-quality balance",
        paragraphs: [
          "Start from the cleanest source available. Repeatedly compressing a PDF can compound image degradation, just as repeatedly saving a JPEG can. Keep an untouched original and compress a copy. If the first result is suitable, avoid running it through another compressor simply to save a small additional amount.",
          "For scanned documents, scanning in grayscale instead of color can reduce the source size when color is not meaningful. A moderate scan resolution is enough for ordinary text, while photographs, detailed illustrations, and small annotations need more resolution. If you control the original export, optimize images before creating the PDF and avoid embedding assets at dimensions far beyond their displayed size.",
        ],
        bullets: [
          "Keep an original copy before compression.",
          "Remove unneeded pages instead of degrading every page.",
          "Check small text and fine lines at 100% zoom.",
          "Print a test page when the document is intended for physical distribution.",
          "Use grayscale for scans only when color is not important.",
        ],
      },
      {
        id: "privacy",
        title: "Security and responsible uploading",
        paragraphs: [
          "PDFeed uses temporary file storage for conversion. Uploaded files and compressed results are automatically deleted after one hour, and randomized file names are used during processing. The service does not require an account for beta use.",
          "Temporary deletion reduces long-term exposure, but an online converter should still not be your default choice for highly sensitive material. Avoid uploading confidential contracts, unredacted identity documents, medical records, financial credentials, or any file you are not permitted to process. Follow your workplace or organization's data-handling rules when they apply.",
        ],
      },
      {
        id: "when-not",
        title: "When compression is not the right solution",
        paragraphs: [
          "Do not compress a digital master intended for professional printing, archival preservation, or later editing unless you understand the required specifications. In those cases, preserving fonts, color profiles, image resolution, and metadata may matter more than file size. Create a separate distribution copy and retain the master unchanged.",
          "If a PDF is already efficiently optimized, compression may produce little improvement. That is normal. A modest size reduction with no obvious visual damage is often better than a dramatic reduction that makes the document difficult to read.",
        ],
      },
    ],
    faqs: [
      { question: "Does PDF compression always reduce image quality?", answer: "Not visibly. Balanced compression may remove redundant data or reduce oversized images without an obvious difference at normal viewing size, but every result should be reviewed." },
      { question: "Why did my PDF size barely change?", answer: "The file may already be optimized or may consist mostly of text and vector content. These documents have less removable image data." },
      { question: "Can I compress a password-protected PDF?", answer: "Protected files may need to be unlocked by an authorized owner before conversion. Never bypass protection on a document you do not own or have permission to process." },
      { question: "How long does PDFeed keep compressed files?", answer: "Uploaded and converted files are automatically deleted after one hour." },
    ],
  },
  {
    slug: "how-to-merge-pdf-files-online",
    title: "How to Merge PDF Files Online",
    description:
      "Learn how to merge PDF files online, arrange documents in the right order, and download one organized PDF using PDFeed.",
    excerpt:
      "Combine reports, forms, scans, and attachments into one orderly PDF with a simple browser-based workflow.",
    publishedAt: "2026-07-01",
    publishedLabel: "July 1, 2026",
    readTime: "6 min read",
    targetKeyword: "merge PDF files online",
    toolPath: "/merge-pdf",
    toolLabel: "Merge PDF Files",
    accent: "cyan",
    sections: [
      {
        id: "why-merge",
        title: "Why combine PDF files?",
        paragraphs: [
          "A single organized PDF is often easier to share and review than a folder full of separate attachments. You might combine a cover letter with a resume, join monthly statements into an annual record, package an invoice with supporting receipts, or assemble scanned pages into one complete document. Merging keeps related material together and helps recipients follow the intended order.",
          "PDF is particularly suited to this job because each source page keeps its fixed layout. Unlike copying content between editable documents, merging PDFs does not require rebuilding paragraphs, tables, or images. The pages are copied into a new document in sequence.",
          "PDFeed lets you merge PDF files online from a modern browser. You select two or more PDFs, start the merge, and download one combined file. No account is required, and beta uploads are limited to 25MB per file.",
        ],
      },
      {
        id: "prepare",
        title: "Prepare the files before merging",
        paragraphs: [
          "Decide on the final order before selecting your files. Clear file names such as 01-cover.pdf, 02-report.pdf, and 03-appendix.pdf make the sequence easier to recognize. Open each source document and remove blank, duplicated, or irrelevant pages. If only part of a PDF is needed, use the Split PDF tool first and retain the pages that belong in the final package.",
          "Also check page orientation and dimensions. A combined PDF can contain both portrait and landscape pages, or a mixture of A4 and Letter sizes, but abrupt changes may look untidy. Rotate or re-export problem pages in their source application when presentation matters. Confirm that the documents are not damaged and that you have permission to combine and distribute them.",
        ],
      },
      {
        id: "steps",
        title: "How to merge PDF files online with PDFeed",
        steps: [
          { title: "Open Merge PDF", text: "Go to the PDFeed Merge PDF tool. It works in the browser, with no desktop installation or account needed." },
          { title: "Select at least two PDFs", text: "Drag your files into the upload area or choose them from your device. Select them in the order in which they should appear." },
          { title: "Confirm the file list", text: "Review the displayed names before continuing. If the order is wrong, clear the selection and choose the documents again in the correct sequence." },
          { title: "Merge and download", text: "Select Merge PDFs. PDFeed copies all pages into one document and provides a download button when processing is complete." },
          { title: "Inspect the combined document", text: "Open the result and check the first page, transitions between source files, page orientation, and the final page." },
        ],
      },
      {
        id: "organization",
        title: "How to keep a merged PDF organized",
        paragraphs: [
          "A technically successful merge can still be confusing if the content lacks structure. Add a cover page or table of contents in the original source documents when a package is long. Consistent section titles and page numbers also help. Be aware that existing page numbers will not automatically renumber themselves when files are joined; they remain part of the original page artwork.",
          "For recurring tasks, use a predictable naming and ordering convention. This is useful for applications, audit packages, project records, and client deliverables. Save the separate source files as well as the merged result, because future edits are usually easier in the originals.",
        ],
        bullets: [
          "Put introductory material before supporting documents.",
          "Use descriptive source file names with numeric prefixes.",
          "Remove blank pages before merging.",
          "Check whether existing page numbers still make sense.",
          "Keep an unmerged copy of every source document.",
        ],
      },
      {
        id: "size",
        title: "Managing the size of the final PDF",
        paragraphs: [
          "The combined file will usually be close to the total size of its sources, sometimes with a small difference from how shared resources are stored. If you merge image-heavy scans, the final PDF may be too large for email or a web form. PDFeed's Compress PDF tool can create a smaller distribution copy after you verify the merge.",
          "Compress only after the page order is final, and keep the uncompressed merged document if quality matters. Review photographs, diagrams, signatures, and small text in the compressed copy before relying on it.",
        ],
      },
      {
        id: "privacy",
        title: "File privacy and permissions",
        paragraphs: [
          "PDFeed stores files temporarily while completing the merge. Uploaded PDFs and the combined result are automatically deleted after one hour. Randomized file names help separate stored processing files, and no login is required during beta.",
          "Do not upload highly sensitive documents merely for convenience. Confidential business records, identity documents, medical files, passwords, and protected client material may require approved offline software or an organization-managed system. You should also avoid uploading copyrighted or restricted content unless you have the right to process it.",
        ],
      },
    ],
    faqs: [
      { question: "How many PDFs do I need to merge?", answer: "The tool requires at least two PDF files. Select the files in the order you want their pages to appear." },
      { question: "Will merging change the content of each page?", answer: "The pages are copied into a new PDF. Their visible content should remain intact, although document-level features such as bookmarks may not always carry over." },
      { question: "Can I merge only selected pages?", answer: "For the MVP, split the source PDF into individual pages first, then merge the pages or documents you need." },
      { question: "When are my files deleted?", answer: "PDFeed automatically deletes uploads and converted results after one hour." },
    ],
  },
  {
    slug: "how-to-convert-jpg-to-pdf",
    title: "How to Convert JPG to PDF",
    description:
      "Learn how to convert JPG to PDF, combine multiple images into one document, and get a clean result with PDFeed.",
    excerpt:
      "Turn photos, scans, and screenshots into an easy-to-share PDF while keeping the pages clear and correctly ordered.",
    publishedAt: "2026-07-01",
    publishedLabel: "July 1, 2026",
    readTime: "6 min read",
    targetKeyword: "convert JPG to PDF",
    toolPath: "/jpg-to-pdf",
    toolLabel: "Convert JPG to PDF",
    accent: "orange",
    sections: [
      {
        id: "why-pdf",
        title: "Why turn images into a PDF?",
        paragraphs: [
          "JPG is convenient for individual photographs and scans, but a set of separate images can be awkward to send, print, or review. PDF places those images into pages within one document. This makes it useful for scanned notes, receipts, application documents, portfolios, worksheets, and screenshots that belong together.",
          "A PDF also establishes a clear reading order. Instead of asking a recipient to sort several similarly named image files, you can provide one download that opens page by page. Most phones and computers include a PDF viewer, so the result is straightforward to access without specialist image software.",
          "PDFeed can convert JPG to PDF and also accepts JPEG and PNG images. You can select multiple images, and each one becomes a page in the final file. The current MVP supports up to 20 images, with a maximum upload size of 25MB per file.",
        ],
      },
      {
        id: "prepare-images",
        title: "Prepare images for a better PDF",
        paragraphs: [
          "Good source images produce a better document. Crop away the table, floor, or background around a photographed page. Rotate images so text is upright, and avoid strong shadows across the page. If you are photographing a document, place it on a flat surface with even lighting and hold the camera parallel to the paper to reduce perspective distortion.",
          "Rename the images in their intended sequence or select them in order. Check that every page is included and that no image is duplicated. Very large photos may create a large PDF, so resize them sensibly when full camera resolution is unnecessary. Do not reduce them so far that text becomes difficult to read.",
        ],
      },
      {
        id: "steps",
        title: "How to convert JPG to PDF with PDFeed",
        steps: [
          { title: "Open the JPG to PDF converter", text: "Visit the PDFeed JPG to PDF tool using a modern desktop or mobile browser. No account or software installation is required." },
          { title: "Choose your images", text: "Drag JPG, JPEG, or PNG files into the upload area, or choose them from your device. You can add multiple images to one PDF." },
          { title: "Check the sequence", text: "Review the selected file names. The images will become PDF pages in the displayed selection order." },
          { title: "Create the PDF", text: "Select Create PDF. PDFeed processes the images and places each one on its own PDF page." },
          { title: "Download and review", text: "Save the finished document and check orientation, page order, readability, and overall file size." },
        ],
      },
      {
        id: "quality-size",
        title: "Image quality and file size",
        paragraphs: [
          "JPG uses lossy compression, which is efficient for photographs but can create artifacts around small text when saved repeatedly. Start with the original image whenever possible. PNG is often clearer for screenshots and graphics with sharp edges, although PNG files may be larger. PDFeed embeds supported images into the PDF while creating pages that fit their dimensions.",
          "For a document read on screen, an image does not need the full resolution of a modern phone camera. On the other hand, forms with small print and detailed diagrams need enough pixels to remain legible when zoomed or printed. Open the downloaded PDF at 100% zoom and inspect the smallest important text. If the final PDF is too large, use Compress PDF only after preserving an original copy.",
        ],
        bullets: [
          "Use JPG for photos and PNG for crisp screenshots when practical.",
          "Avoid repeatedly resaving JPG source files.",
          "Crop and rotate every page before conversion.",
          "Check small text at 100% zoom.",
          "Keep the original images after creating the PDF.",
        ],
      },
      {
        id: "common-uses",
        title: "Useful ways to organize image PDFs",
        paragraphs: [
          "For receipts, arrange pages chronologically or group them by category. For class notes, place the title page first and follow the original notebook order. For a portfolio, lead with the strongest relevant work and use consistent image orientation. A thoughtful sequence makes a basic image conversion feel like a finished document.",
          "If you later need to add a cover sheet or another PDF, use Merge PDF to combine the image PDF with that material. If you selected an incorrect page, Split PDF can separate all pages so you can rebuild the correct set.",
        ],
      },
      {
        id: "privacy",
        title: "A note about image privacy",
        paragraphs: [
          "Images can contain more private information than expected, including addresses, signatures, identification numbers, faces, or documents visible in the background. Inspect and crop each source carefully. PDFeed uses temporary storage and automatically deletes uploaded and converted files after one hour.",
          "Even with automatic deletion, avoid uploading highly sensitive images or any material you do not have permission to process. For identity records, private health data, financial information, and confidential workplace documents, follow the relevant security policy and use an approved offline workflow when required.",
        ],
      },
    ],
    faqs: [
      { question: "Can I put several JPG images in one PDF?", answer: "Yes. PDFeed supports multiple JPG, JPEG, and PNG files, with each selected image becoming a page in one PDF." },
      { question: "Does converting JPG to PDF improve image quality?", answer: "No. Conversion packages the existing image into a PDF page; it cannot restore detail missing from the source image." },
      { question: "Why is my image PDF very large?", answer: "High-resolution photos and PNG files can contain substantial image data. Resize unnecessary oversized images before conversion or compress a copy of the finished PDF." },
      { question: "How long are my images stored?", answer: "Uploads and generated files are temporary and are automatically deleted after one hour." },
    ],
  },
  {
    slug: "how-to-convert-excel-to-pdf",
    title: "How to Convert Excel to PDF",
    description:
      "Learn how to convert Excel to PDF, prepare spreadsheet print settings, and create a readable shareable document with PDFeed.",
    excerpt:
      "Prepare XLS and XLSX workbooks for reliable PDF output, with practical advice for sheets, scaling, margins, and review.",
    publishedAt: "2026-07-01",
    publishedLabel: "July 1, 2026",
    readTime: "7 min read",
    targetKeyword: "convert Excel to PDF",
    toolPath: "/excel-to-pdf",
    toolLabel: "Convert Excel to PDF",
    accent: "emerald",
    sections: [
      {
        id: "why-convert",
        title: "Why convert a spreadsheet to PDF?",
        paragraphs: [
          "Excel workbooks are designed for calculation, analysis, and editing. PDF is designed for stable presentation. Converting a finished workbook to PDF creates a version that recipients can read without accidentally changing formulas, sorting data, or overwriting cells. It also gives you more control over how the spreadsheet appears when printed.",
          "This is useful for financial summaries, schedules, price lists, reports, invoices, inventory sheets, and dashboards. The PDF preserves a snapshot of the workbook at the time of conversion. It is not a substitute for the editable spreadsheet, so keep the original XLS or XLSX file whenever future updates or formula inspection may be needed.",
          "PDFeed lets you convert Excel to PDF online without an account. It accepts XLS and XLSX files up to 25MB and uses LibreOffice for the export. The workbook's print settings strongly influence the result, so a little preparation can make a major difference.",
        ],
      },
      {
        id: "prepare-workbook",
        title: "Prepare Excel for PDF output",
        paragraphs: [
          "Open the workbook and decide which sheets should be printable. Hide or exclude working sheets that contain notes, lookup tables, raw imports, or confidential calculations not intended for the recipient. Set an appropriate print area for each sheet so empty rows and columns do not create blank pages.",
          "Use page layout settings to choose portrait or landscape orientation, paper size, margins, and scaling. Wide tables often work better in landscape. Scaling a sheet to one page wide can prevent columns from spilling onto separate pages, but fitting a very large sheet onto one page may make the text unreadably small. A better choice may be one page wide and several pages tall.",
          "Set repeating header rows when tables span multiple pages, and check manual page breaks. Review headers, footers, page numbers, dates, and file names. Finally, recalculate formulas and inspect cells for errors such as #REF!, #DIV/0!, or truncated values shown as ####.",
        ],
      },
      {
        id: "steps",
        title: "How to convert Excel to PDF with PDFeed",
        steps: [
          { title: "Review the workbook", text: "Confirm formulas, print areas, sheet visibility, page orientation, and scaling in Excel or another compatible spreadsheet editor." },
          { title: "Open the Excel to PDF tool", text: "Visit PDFeed's Excel to PDF converter in your browser. No registration or extension is needed." },
          { title: "Upload the XLS or XLSX file", text: "Drag the workbook into the upload box or choose it from your device. The current file-size limit is 25MB." },
          { title: "Convert the workbook", text: "Select Convert to PDF. LibreOffice exports the printable workbook content according to its saved layout settings." },
          { title: "Download and inspect every sheet", text: "Open the PDF and check page boundaries, column widths, repeated headings, charts, totals, and the transition between sheets." },
        ],
      },
      {
        id: "readability",
        title: "How to keep spreadsheet PDFs readable",
        paragraphs: [
          "The most common problem is trying to fit too much information onto too little paper. If text becomes tiny, reduce the number of columns in the print area, choose landscape orientation, or allow the table to span multiple pages. Consider moving secondary data to an appendix rather than shrinking the main report.",
          "Charts should have clear labels and enough contrast to work both on screen and in print. Avoid relying only on color to distinguish categories. Freeze panes help during editing but do not control printed repetition; use print-title settings for rows or columns that must appear on every page. Remove comments or notes that should not be included in the shared result.",
        ],
        bullets: [
          "Define a print area instead of exporting unused cells.",
          "Use landscape orientation for wide tables.",
          "Repeat header rows across printed pages.",
          "Avoid scaling that makes text too small to read.",
          "Check charts, formulas, and number formatting in the PDF.",
        ],
      },
      {
        id: "conversion-differences",
        title: "Why the converted PDF may look different",
        paragraphs: [
          "Spreadsheet rendering can vary between Microsoft Excel and LibreOffice, especially when a workbook uses uncommon fonts, macros, external data connections, advanced charts, or proprietary formatting. Formulas normally export as their calculated values, but macros are not executed as part of conversion. Refresh required data in the trusted source application before uploading the workbook.",
          "If the output is incorrect, return to the spreadsheet and simplify the affected element. Replace an unavailable font, adjust a chart, set explicit row heights, or update the print area. Save the workbook and convert it again. Repairing the source is safer and more repeatable than editing individual PDF pages.",
        ],
      },
      {
        id: "sharing-security",
        title: "Sharing and security considerations",
        paragraphs: [
          "A PDF can make a workbook easier to read, but it is not a complete security control. Hidden sheets, metadata, or information outside the print area may still exist in the uploaded source even when they do not appear in the result. Create a sanitized copy containing only the material you are authorized to process before using any online converter.",
          "PDFeed temporarily stores the workbook and converted PDF for processing, then automatically deletes both after one hour. Nevertheless, avoid uploading highly sensitive spreadsheets containing payroll, banking credentials, personal identifiers, health data, trade secrets, or confidential customer records. Use an approved offline or organization-managed workflow for restricted information.",
          "If the resulting report belongs with other documents, use Merge PDF to create one package. If it is too large to send, make a copy and try Compress PDF, then verify that charts and small figures remain clear.",
        ],
      },
    ],
    faqs: [
      { question: "Are all Excel sheets included in the PDF?", answer: "LibreOffice exports printable workbook content according to saved sheet visibility, print areas, and page settings. Review the result to confirm the intended sheets are present." },
      { question: "Will Excel formulas still work in the PDF?", answer: "A PDF is not an interactive spreadsheet. It displays the calculated values present at export time, so keep the original workbook for formulas and editing." },
      { question: "Why are my columns split across pages?", answer: "The saved print area, paper orientation, margins, and scaling determine pagination. Set landscape orientation or fit the sheet to one page wide before converting." },
      { question: "Does PDFeed keep my workbook?", answer: "No. Uploaded workbooks and converted PDFs are automatically deleted after one hour." },
    ],
  },
];

export const blogPostMap = Object.fromEntries(
  blogPosts.map((post) => [post.slug, post]),
) as Record<string, BlogPost>;
