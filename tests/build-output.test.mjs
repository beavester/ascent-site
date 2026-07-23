import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const exists = (path) => existsSync(join(root, path));

test("build emits the configured public directory without development artifacts", () => {
  const packageJson = JSON.parse(
    readFileSync(join(root, "package.json"), "utf8"),
  );
  const gitignore = readFileSync(join(root, ".gitignore"), "utf8");

  assert.match(packageJson.scripts.build, /scripts\/build-site\.mjs/);
  assert.match(gitignore, /^public\/$/m);

  const requiredFiles = [
    "public/index.html",
    "public/ascent/chatgpt-app/index.html",
    "public/ascent/handoff/handoff.js",
    "public/attention-management-iphone/index.html",
    "public/guides/app-pauses-vs-app-blocking/index.html",
    "public/privacy.html",
    "public/robots.txt",
    "public/sitemap.xml",
    "public/img/icon.png",
  ];
  for (const path of requiredFiles) assert.ok(exists(path), path);

  const excludedFiles = [
    "public/api/mcp.ts",
    "public/chatgpt-app/golden-prompts.json",
    "public/docs/superpowers/plans/2026-07-23-ascent-chatgpt-app.md",
    "public/package.json",
    "public/scripts/verify-mcp.ts",
    "public/src/ascent/server.ts",
    "public/tests/site.test.mjs",
  ];
  for (const path of excludedFiles) assert.equal(exists(path), false, path);
});
