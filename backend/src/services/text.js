import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import PDFDocument from "pdfkit";
import { outputPath } from "../utils/files.js";

function fontCandidates() {
  return [
    process.env.TEXT_PDF_FONT_PATH,
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    "C:\\Windows\\Fonts\\arial.ttf",
    "C:\\Windows\\Fonts\\segoeui.ttf",
  ].filter(Boolean);
}

function resolveFontPath() {
  for (const candidate of fontCandidates()) {
    try {
      if (fs.existsSync(candidate)) return candidate;
    } catch {
      // Keep looking for a usable local font.
    }
  }
  return null;
}

export async function textToPdf(inputPath) {
  const text = await fsp.readFile(inputPath, "utf8");
  const destination = outputPath(".pdf");
  const fontPath = resolveFontPath();

  await new Promise((resolve, reject) => {
    const document = new PDFDocument({
      size: "A4",
      margins: { top: 54, right: 54, bottom: 54, left: 54 },
      autoFirstPage: true,
      info: {
        Title: `${path.basename(inputPath, path.extname(inputPath))}.pdf`,
        Creator: "PDFeed",
      },
    });
    const stream = fs.createWriteStream(destination);

    stream.on("finish", resolve);
    stream.on("error", reject);
    document.on("error", reject);
    document.pipe(stream);

    if (fontPath) document.font(fontPath);
    document.fontSize(11);
    document.text(text || " ", {
      width:
        document.page.width -
        document.page.margins.left -
        document.page.margins.right,
      lineGap: 3,
      paragraphGap: 0,
    });
    document.end();
  });

  return destination;
}
