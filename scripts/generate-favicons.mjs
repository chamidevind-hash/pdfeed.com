import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const publicDir = path.resolve("frontend/public");
const source = path.join(publicDir, "favicon.svg");

async function renderPng(fileName, size) {
  const output = path.join(publicDir, fileName);
  await sharp(source).resize(size, size).png().toFile(output);
  return fs.readFile(output);
}

function createIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  const directory = Buffer.alloc(images.length * 16);
  let offset = 6 + directory.length;

  images.forEach(({ size, data }, index) => {
    const entry = index * 16;
    directory.writeUInt8(size >= 256 ? 0 : size, entry);
    directory.writeUInt8(size >= 256 ? 0 : size, entry + 1);
    directory.writeUInt8(0, entry + 2);
    directory.writeUInt8(0, entry + 3);
    directory.writeUInt16LE(1, entry + 4);
    directory.writeUInt16LE(32, entry + 6);
    directory.writeUInt32LE(data.length, entry + 8);
    directory.writeUInt32LE(offset, entry + 12);
    offset += data.length;
  });

  return Buffer.concat([header, directory, ...images.map(({ data }) => data)]);
}

const icoImages = [];
for (const size of [16, 32, 48]) {
  const data = await sharp(source).resize(size, size).png().toBuffer();
  icoImages.push({ size, data });
}

await Promise.all([
  renderPng("favicon-16x16.png", 16),
  renderPng("favicon-32x32.png", 32),
  renderPng("android-chrome-192x192.png", 192),
  renderPng("android-chrome-512x512.png", 512),
  renderPng("apple-touch-icon.png", 180),
  fs.writeFile(path.join(publicDir, "favicon.ico"), createIco(icoImages)),
  fs.writeFile(
    path.join(publicDir, "site.webmanifest"),
    JSON.stringify(
      {
        name: "PDFeed",
        short_name: "PDFeed",
        description: "Free Online File Converter",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#2563EB",
        icons: [
          { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
        ],
      },
      null,
      2,
    ),
  ),
]);

console.log("PDFeed favicon assets generated.");
