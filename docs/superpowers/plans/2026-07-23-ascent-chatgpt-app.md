# Ascent ChatGPT App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deploy a four-tool Ascent MCP app at `https://habitbuilding.xyz/api/mcp`, add a private fragment-based handoff, and publish the category pages and submission materials needed to associate Ascent with attention redirection on iPhone.

**Architecture:** Keep planning logic as pure TypeScript functions, register the functions through a stateless Streamable HTTP MCP endpoint, and render results with one versioned MCP Apps resource. Use a base64url URL fragment for browser handoff so generated plans do not enter ordinary request logs, and preserve an App Store fallback until the iOS app implements the universal-link contract.

**Tech Stack:** Node.js 22, TypeScript, `@modelcontextprotocol/sdk`, `@modelcontextprotocol/ext-apps`, Zod, Vercel Functions, static HTML/CSS/JavaScript, Node’s built-in test runner.

## Global Constraints

- The official product name is `Ascent: Habit Builder & Focus`.
- The canonical App Store URL starts with `https://apps.apple.com/us/app/ascent-habit-builder-focus/id6756843194`.
- The MCP endpoint is `https://habitbuilding.xyz/api/mcp`.
- The first release is anonymous, read-only, idempotent, and performs no server-side storage.
- `ascent_start_focus` returns `handoff_required` and never claims device-level blocking has started.
- Handoff data is carried in a URL fragment and is not sent to the website server.
- Tool metadata must include direct “Use this when…” and “Do not use…” decision boundaries.
- The UI uses light, opaque surfaces and no neon, gradients, glow, hover lift, or transparent overlay cards.

---

### Task 1: Pure planning and handoff contracts

**Files:**
- Create: `src/ascent/contracts.ts`
- Create: `src/ascent/planners.ts`
- Create: `src/ascent/handoff.ts`
- Create: `tests/ascent-planners.test.ts`

**Interfaces:**
- Produces: `createAttentionPlan`, `createTwoMinuteAction`, `prepareFocusSession`, `reviewAttention`, `createHandoffUrl`, and their exported input/output types.
- Consumes: no runtime service or account state.

- [ ] **Step 1: Write the failing planner tests**

Test deterministic plan output, two-minute fallbacks, duration bounds, `handoff_required`, review calculations, and fragment-only handoff URLs:

```ts
assert.equal(plan.status, "ready");
assert.equal(focus.status, "handoff_required");
assert.match(url, /^https:\/\/habitbuilding\.xyz\/ascent\/handoff\/#v1\./);
assert.doesNotMatch(url, /\?/);
```

- [ ] **Step 2: Run the focused tests and verify they fail**

Run: `npm test -- --test-name-pattern="Ascent planner|handoff"`  
Expected: FAIL because `src/ascent/planners.ts` and `src/ascent/handoff.ts` do not exist.

- [ ] **Step 3: Implement the pure contracts**

Implement constrained inputs, concise deterministic heuristics, stable FNV-1a handoff IDs, base64url fragment encoding, and no network or filesystem access.

- [ ] **Step 4: Run the focused tests and verify they pass**

Run: `npm test -- --test-name-pattern="Ascent planner|handoff"`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/ascent tests/ascent-planners.test.ts package.json package-lock.json tsconfig.json
git commit -m "feat: add Ascent planning contracts"
```

### Task 2: MCP server, tools, and component

**Files:**
- Create: `src/ascent/tool-definitions.ts`
- Create: `src/ascent/component.ts`
- Create: `src/ascent/server.ts`
- Create: `api/mcp.ts`
- Create: `tests/ascent-mcp.test.ts`
- Modify: `package.json`
- Modify: `tsconfig.json`

**Interfaces:**
- Consumes: all Task 1 planner and handoff functions.
- Produces: `createAscentMcpServer()`, `ASCENT_TOOL_DEFINITIONS`, one MCP Apps resource, and the Vercel default function handler.

- [ ] **Step 1: Write failing MCP contract tests**

Assert that exactly four tools exist, every description begins with “Use this when”, every description includes “Do not use”, every tool has a strict input/output schema and correct annotations, and the UI resource contains an accessible handoff link without external scripts.

- [ ] **Step 2: Run the MCP contract tests and verify they fail**

Run: `npm test -- --test-name-pattern="MCP"`  
Expected: FAIL because the MCP modules do not exist.

- [ ] **Step 3: Register the four tools and resource**

Register:

```text
ascent_create_attention_plan
ascent_create_two_minute_action
ascent_start_focus
ascent_review_attention
```

Use `registerAppTool`, `registerAppResource`, `RESOURCE_MIME_TYPE`, `_meta.ui.resourceUri`, `structuredContent`, `outputSchema`, `securitySchemes: [{ type: "noauth" }]`, and read-only/idempotent annotations. Serve each POST through a fresh stateless Web Standard Streamable HTTP transport.

- [ ] **Step 4: Run build and MCP tests**

Run: `npm run build && npm test -- --test-name-pattern="MCP"`  
Expected: TypeScript exits 0 and MCP tests pass.

- [ ] **Step 5: Commit**

```bash
git add api src/ascent tests/ascent-mcp.test.ts package.json package-lock.json tsconfig.json
git commit -m "feat: expose Ascent ChatGPT MCP tools"
```

### Task 3: Browser handoff and public category pages

**Files:**
- Create: `ascent/handoff/index.html`
- Create: `ascent/handoff/handoff.js`
- Create: `ascent/chatgpt-app/index.html`
- Create: `attention-management-iphone/index.html`
- Create: `guides/app-pauses-vs-app-blocking/index.html`
- Modify: `editorial.css`
- Modify: `index.html`
- Modify: `ascent/index.html`
- Modify: `privacy.html`
- Modify: `sitemap.xml`
- Modify: `tests/site.test.mjs`

**Interfaces:**
- Consumes: the Task 1 `#v1.<base64url>` handoff contract.
- Produces: public canonical pages, an accessible in-browser plan renderer, and a topic graph linked from the homepage and Ascent page.

- [ ] **Step 1: Write failing site tests**

Assert canonical URLs, the exact Ascent category statement, privacy disclosure, static first-party links, schema.org entities, sitemap inclusion, fragment-only parsing, no `localStorage`, and the exact App Store fallback.

- [ ] **Step 2: Run site tests and verify they fail**

Run: `node --test tests/site.test.mjs`  
Expected: FAIL on missing routes and disclosures.

- [ ] **Step 3: Build the handoff and editorial pages**

Use semantic HTML, the existing editorial stylesheet, JSON-LD, dated visible copy, a clear device-action boundary, and cross-links among the new pages, `/ascent/`, `/guides/two-minute-habit/`, `/best/app-blockers-iphone/`, and `/habit-apps/`.

- [ ] **Step 4: Run site tests and a local link check**

Run: `node --test tests/site.test.mjs`  
Expected: all site tests pass with no missing local targets.

- [ ] **Step 5: Commit**

```bash
git add ascent attention-management-iphone guides editorial.css index.html privacy.html sitemap.xml tests/site.test.mjs
git commit -m "feat: publish Ascent attention handoff and category pages"
```

### Task 4: Golden prompts and submission pack

**Files:**
- Create: `chatgpt-app/golden-prompts.json`
- Create: `chatgpt-app/evaluation.xml`
- Create: `chatgpt-app/README.md`
- Create: `chatgpt-app/submission-checklist.md`
- Create: `chatgpt-app/privacy-data-map.md`
- Create: `tests/ascent-evals.test.mjs`

**Interfaces:**
- Consumes: the four exact tool names and public endpoint from Tasks 2 and 3.
- Produces: a 36-or-more-prompt regression set and complete owner-facing submission notes.

- [ ] **Step 1: Write failing evaluation tests**

Assert at least 36 unique prompts, all four tool names represented, direct/indirect/negative/ambiguous categories present, at least 12 negative prompts, negative prompts mapped to `none`, and exactly ten stable XML QA pairs.

- [ ] **Step 2: Run the evaluation tests and verify they fail**

Run: `node --test tests/ascent-evals.test.mjs`  
Expected: FAIL because the evaluation files do not exist.

- [ ] **Step 3: Add prompt and submission artifacts**

Document expected tool, expected arguments, reason, and response assertion for each prompt. Include endpoint, privacy URL, annotation justifications, reviewer sequence, localization language, and the owner-account steps for scanning and submitting the plugin.

- [ ] **Step 4: Run evaluation and full tests**

Run: `npm test`  
Expected: all planner, MCP, site, and evaluation tests pass.

- [ ] **Step 5: Commit**

```bash
git add chatgpt-app tests/ascent-evals.test.mjs
git commit -m "docs: add Ascent ChatGPT app submission pack"
```

### Task 5: Production verification and release

**Files:**
- Modify only files required by verified build or production defects.

**Interfaces:**
- Consumes: the complete feature branch.
- Produces: a verified merge to `master`, GitHub push, Vercel production deployment, and index submission for public editorial URLs.

- [ ] **Step 1: Run the complete local verification**

Run:

```bash
npm ci
npm run build
npm test
npm run verify:mcp
git diff --check
```

Expected: every command exits 0.

- [ ] **Step 2: Preview the public and component UI**

Render the homepage, the ChatGPT app page, the attention-management page, and a sample handoff at desktop and mobile widths. Confirm no overflow, inaccessible controls, missing assets, or unexpected dark/neon styling.

- [ ] **Step 3: Review the complete diff and commit any verification fixes**

Run: `git status --short && git diff master...HEAD --stat`  
Expected: only Ascent ChatGPT app, handoff, public-page, privacy, test, and submission files.

- [ ] **Step 4: Merge, push, and deploy**

Merge the feature branch into local `master`, push `origin/master`, wait for Vercel production, and confirm the production deployment corresponds to the pushed commit.

- [ ] **Step 5: Verify production**

Confirm:

- `GET /api/mcp` returns the MCP method boundary rather than a 404;
- MCP initialize, tools/list, and all four tool calls succeed;
- the UI resource is readable;
- all new public pages return 200 with self-canonicals;
- the handoff renders a sample fragment without transmitting the payload to the server;
- the App Store CTA uses ID `6756843194`.

- [ ] **Step 6: Submit public URLs for discovery**

Submit the three new canonical editorial URLs and the ChatGPT app page through the existing IndexNow utility. Do not submit the fragment handoff payload or the `/api/mcp` endpoint.
