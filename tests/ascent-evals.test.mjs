import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const rootUrl = new URL("../", import.meta.url);
const promptPath = new URL("../chatgpt-app/golden-prompts.json", import.meta.url);
const evaluationPath = new URL("../chatgpt-app/evaluation.xml", import.meta.url);
const readmePath = new URL("../chatgpt-app/README.md", import.meta.url);
const checklistPath = new URL(
  "../chatgpt-app/submission-checklist.md",
  import.meta.url,
);
const privacyMapPath = new URL(
  "../chatgpt-app/privacy-data-map.md",
  import.meta.url,
);

const expectedTools = new Set([
  "ascent_create_attention_plan",
  "ascent_create_two_minute_action",
  "ascent_start_focus",
  "ascent_review_attention",
]);

test("golden prompt set covers direct, indirect, ambiguous, and negative routing", async () => {
  const prompts = JSON.parse(await readFile(promptPath, "utf8"));

  assert.ok(Array.isArray(prompts));
  assert.ok(prompts.length >= 36);
  assert.equal(new Set(prompts.map((entry) => entry.id)).size, prompts.length);
  assert.equal(
    new Set(prompts.map((entry) => entry.prompt.toLowerCase())).size,
    prompts.length,
  );

  const categories = new Set(prompts.map((entry) => entry.category));
  assert.deepEqual(
    categories,
    new Set(["direct", "indirect", "ambiguous", "negative"]),
  );

  const negativePrompts = prompts.filter(
    (entry) => entry.category === "negative",
  );
  assert.ok(negativePrompts.length >= 12);
  assert.ok(negativePrompts.every((entry) => entry.expected_tool === "none"));

  const representedTools = new Set(
    prompts
      .map((entry) => entry.expected_tool)
      .filter((name) => name !== "none"),
  );
  assert.deepEqual(representedTools, expectedTools);

  for (const entry of prompts) {
    assert.match(entry.id, /^[a-z0-9_]+$/);
    assert.ok(entry.prompt.length >= 8);
    assert.ok(entry.reason.length >= 20);
    assert.ok(Array.isArray(entry.response_assertions));
    assert.ok(entry.response_assertions.length >= 1);
    assert.ok(
      entry.expected_tool === "none" || expectedTools.has(entry.expected_tool),
    );
    if (entry.expected_tool === "none") {
      assert.equal(entry.expected_arguments, null);
    } else {
      assert.equal(typeof entry.expected_arguments, "object");
      assert.ok(entry.expected_arguments !== null);
    }
  }
});

test("evaluation pack contains ten stable single-answer checks", async () => {
  const xml = await readFile(evaluationPath, "utf8");
  const pairs = xml.match(/<qa_pair\b/g) ?? [];
  assert.equal(pairs.length, 10);
  assert.match(xml, /ascent_create_attention_plan/);
  assert.match(xml, /ascent_create_two_minute_action/);
  assert.match(xml, /ascent_start_focus/);
  assert.match(xml, /ascent_review_attention/);
  assert.doesNotMatch(xml, /\bTBD\b|\bTODO\b/i);
});

test("submission documents cover the endpoint, privacy boundary, review, and localization", async () => {
  const [readme, checklist, privacyMap] = await Promise.all([
    readFile(readmePath, "utf8"),
    readFile(checklistPath, "utf8"),
    readFile(privacyMapPath, "utf8"),
  ]);

  assert.match(readme, /https:\/\/habitbuilding\.xyz\/api\/mcp/);
  assert.match(readme, /npm run verify:mcp/);
  assert.match(readme, /developer mode/i);
  assert.match(checklist, /Ascent: Habit Builder & Focus/);
  assert.match(checklist, /en-US/);
  assert.match(checklist, /OpenAI review/i);
  assert.match(checklist, /no OAuth/i);
  assert.match(checklist, /privacy policy/i);
  assert.match(privacyMap, /fragment/i);
  assert.match(privacyMap, /not stored/i);
  assert.match(privacyMap, /review_attention/i);
  assert.doesNotMatch(
    `${readme}\n${checklist}\n${privacyMap}`,
    /\bTBD\b|\bTODO\b/i,
  );

  const expectedPublicFiles = [
    "ascent/chatgpt-app/index.html",
    "ascent/handoff/index.html",
    "privacy.html",
  ];
  for (const path of expectedPublicFiles) {
    await readFile(new URL(path, rootUrl), "utf8");
  }
});
