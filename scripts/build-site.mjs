import { cp, mkdir, rm } from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(root, "public");

if (dirname(output) !== root || basename(output) !== "public") {
  throw new Error(`Refusing to replace unexpected output path: ${output}`);
}

const publicFiles = [
  "analytics.js",
  "b68a9062ff2144f78a835e8c38b68d8e.txt",
  "editorial.css",
  "index.html",
  "indexnow.json",
  "privacy.html",
  "robots.txt",
  "sitemap.xml",
  "terms.html",
];

const publicDirectories = [
  "ascent",
  "attention-management-iphone",
  "best",
  "blog",
  "compare",
  "data",
  "guides",
  "habit-apps",
  "img",
  "methodology",
  "science",
];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

for (const file of publicFiles) {
  await cp(join(root, file), join(output, file));
}

for (const directory of publicDirectories) {
  await cp(join(root, directory), join(output, directory), { recursive: true });
}

console.log(
  `Prepared Vercel output with ${publicFiles.length} root files and ${publicDirectories.length} public directories.`,
);
