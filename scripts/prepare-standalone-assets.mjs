import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const frontendRoot = path.join(repoRoot, "frontend");
const standaloneRoot = path.join(frontendRoot, ".next", "standalone", "frontend");

const copies = [
  {
    from: path.join(frontendRoot, ".next", "static"),
    to: path.join(standaloneRoot, ".next", "static"),
  },
  {
    from: path.join(frontendRoot, "public"),
    to: path.join(standaloneRoot, "public"),
  },
];

if (!existsSync(standaloneRoot)) {
  console.warn("Standalone output not found; skipping static asset copy.");
  process.exit(0);
}

for (const { from, to } of copies) {
  if (!existsSync(from)) {
    console.warn(`Static asset source not found: ${from}`);
    continue;
  }

  mkdirSync(path.dirname(to), { recursive: true });
  rmSync(to, { recursive: true, force: true });
  cpSync(from, to, { recursive: true });
  console.log(`Copied ${path.relative(repoRoot, from)} -> ${path.relative(repoRoot, to)}`);
}
