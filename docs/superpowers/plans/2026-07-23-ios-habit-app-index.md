# iOS Habit App Index and Citation Network Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a maintained 19-app iOS Habit App Index, six distinct citation-ready intent pages, stronger measurement, and a coherent internal authority graph.

**Architecture:** Keep the dependency-free static site. Store app facts in one validated JSON file, render a committed static index with a small Node script, progressively enhance it with an accessible filter, and hand-author focused editorial pages using the existing shared stylesheet. Extend the current Node test suite so data, HTML, structured data, links, analytics, and sitemap cannot drift silently.

**Tech Stack:** Static HTML5, CSS, JSON-LD, vanilla JavaScript, JSON, Node.js `node:test`, Git, GitHub, Vercel, IndexNow.

## Global Constraints

- Research mode is document-based editorial research, not hands-on testing.
- The index contains exactly 19 named apps and uses first-party HTTPS sources.
- Unverified capability fields use `not-confirmed`; absence of evidence is not treated as `no`.
- Pricing uses durable models, not amounts.
- The exact product name is `Ascent: Habit Builder & Focus`.
- The stable product `@id` is `https://habitbuilding.xyz/#ascent-app`.
- Every App Store link starts with `https://apps.apple.com/us/app/ascent-habit-builder-focus/id6756843194`.
- HabitBuilding.xyz's ownership of Ascent is visible before commercial recommendations.
- No medical treatment, outcome, market-leadership, hands-on, rating, or unsupported ranking claims.
- Core content and internal links remain available without JavaScript.
- All interactive targets are at least 44px and work at 320px width.

---

### Task 1: Define the index data contract

**Files:**
- Create: `data/habit-apps.json`
- Modify: `tests/site.test.mjs`

**Interfaces:**
- Produces: a JSON array of 19 app records with the exact fields and controlled vocabulary defined in the design.
- Consumes: first-party sources reviewed on 2026-07-23.

- [ ] **Step 1: Write failing tests**

Add a test that loads `data/habit-apps.json`, asserts exactly 19 unique slugs and names, requires every design field, restricts categories and capability values, requires at least one first-party HTTPS source, and requires `verifiedDate: "2026-07-23"` plus `researchMode: "document-based editorial research"`.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --test --test-name-pattern="habit app data" tests/site.test.mjs`  
Expected: FAIL because `data/habit-apps.json` does not exist.

- [ ] **Step 3: Add the minimal validated dataset**

Create all 19 records. Use only documented claims. Use `not-confirmed` instead of inference.

- [ ] **Step 4: Run the focused and full suites**

Run: `node --test --test-name-pattern="habit app data" tests/site.test.mjs`  
Expected: PASS.

Run: `node --test tests/site.test.mjs`  
Expected: all tests pass.

### Task 2: Render the static iOS Habit App Index

**Files:**
- Create: `scripts/render-habit-app-index.mjs`
- Create: `habit-apps/index.html`
- Create: `habit-apps/index.css`
- Create: `habit-apps/index.js`
- Modify: `tests/site.test.mjs`

**Interfaces:**
- Consumes: `data/habit-apps.json`.
- Produces: static app records with `data-app-slug`, `data-category`, and verified capability attributes plus matching `ItemList` JSON-LD.

- [ ] **Step 1: Write failing index-renderer tests**

Require the canonical route, one H1, direct answer, disclosure, reviewed date, 19 visible app records, one source list per app, three FAQs, valid `Article`/`ItemList`/`BreadcrumbList`, and exact visible/structured-data name parity.

- [ ] **Step 2: Verify RED**

Run: `node --test --test-name-pattern="habit app index" tests/site.test.mjs`  
Expected: FAIL because the index files do not exist.

- [ ] **Step 3: Implement the renderer and static page**

Export `validateApps(apps)` and `renderHabitAppIndex(apps)` from the renderer. When executed directly, read the JSON and write `habit-apps/index.html`. Render all records before loading `habit-apps/index.js`.

- [ ] **Step 4: Add progressive filters**

Implement name, category, app-blocking, Apple Watch, and widget filters. Use the native `hidden` attribute, update an `aria-live` result count, and provide a 44px reset button. Do not send filter values to analytics.

- [ ] **Step 5: Verify GREEN**

Run the renderer, focused test, and full test suite. Expected: all pass and a second renderer run produces no diff.

### Task 3: Publish three category decision pages

**Files:**
- Create: `best/habit-apps-executive-function/index.html`
- Create: `best/morning-routine-apps-iphone/index.html`
- Create: `best/guided-routine-apps-iphone/index.html`
- Modify: `tests/site.test.mjs`

**Interfaces:**
- Consumes: app-index facts and existing editorial CSS.
- Produces: three canonical, sourced, non-overlapping decision pages.

- [ ] **Step 1: Write failing route-contract tests**

For every route require its canonical URL, unique H1 and title, direct-answer section, visible document-review disclosure, date, comparison table, strengths and limitations, at least three first-party source links, three visible/mirrored FAQs, Ascent disclosure, and parent/sibling/next-step links.

- [ ] **Step 2: Verify RED**

Run: `node --test --test-name-pattern="new decision pages" tests/site.test.mjs`  
Expected: FAIL because the routes are missing.

- [ ] **Step 3: Author the pages**

Use non-medical language on executive-function coverage. Distinguish running a known routine from designing one. Name cases where Routinery, Tiimo, Structured, Fabulous, or a simple tracker is the better fit.

- [ ] **Step 4: Verify GREEN**

Run focused and full tests. Expected: all pass.

### Task 4: Publish gamification and low-motivation guidance

**Files:**
- Create: `best/gamified-habit-apps/index.html`
- Create: `guides/habit-app-for-low-motivation/index.html`
- Create: `guides/do-streaks-build-habits/index.html`
- Modify: `tests/site.test.mjs`

**Interfaces:**
- Consumes: app-index facts, existing evidence sources, and editorial CSS.
- Produces: one product decision page and two evidence-led guides with separate query ownership.

- [ ] **Step 1: Write failing content-contract tests**

Require the same citation-ready contract plus explicit no-universal-best language, no shame-based streak framing, and peer-reviewed sources on the two behavioral guides.

- [ ] **Step 2: Verify RED**

Run: `node --test --test-name-pattern="motivation and gamification" tests/site.test.mjs`  
Expected: FAIL because the routes are missing.

- [ ] **Step 3: Author the pages**

Compare Finch, Habitica, TaskHero, and (Not Boring) Habits by reward mechanism. Explain that low motivation may call for a smaller action, clearer next step, environmental support, or rest—not a single universal app.

- [ ] **Step 4: Verify GREEN**

Run focused and full tests. Expected: all pass.

### Task 5: Strengthen existing authority pages and navigation

**Files:**
- Modify: `index.html`
- Modify: `compare/index.html`
- Modify: `best/app-blockers-iphone/index.html`
- Modify: `methodology/index.html`
- Modify: `science/index.html`
- Modify: `editorial.css`
- Modify: `tests/site.test.mjs`

**Interfaces:**
- Consumes: all new routes.
- Produces: a static link graph and visible methodology change log.

- [ ] **Step 1: Write failing graph tests**

Require homepage and comparison-hub links to `/habit-apps/`; require the index and each new page to link to a parent, sibling, `/methodology/`, and `/ascent/`; require the four-way blocker decision; require the methodology change log dated 2026-07-23.

- [ ] **Step 2: Verify RED**

Run the focused graph tests and confirm missing-link failures.

- [ ] **Step 3: Add the links and content**

Add a restrained homepage index preview, a comparison-hub reference strip, the one sec/Opal/ScreenZen/Jomo table, methodology maintenance language, and science links to the streak and low-motivation guides.

- [ ] **Step 4: Verify GREEN**

Run focused and full tests. Expected: all pass.

### Task 6: Add privacy-limited conversion measurement

**Files:**
- Modify: `analytics.js`
- Modify: `tests/site.test.mjs`

**Interfaces:**
- Produces: `app_store_cta_click` and `editorial_path_click` events with approved fields only.

- [ ] **Step 1: Write failing analytics tests**

Require `source_path`, approved placement and destination classes, and safe event listeners. Reject prompt, query, filter, input, email, and user identifiers.

- [ ] **Step 2: Verify RED**

Run the analytics test and confirm the new events are absent.

- [ ] **Step 3: Implement minimal event tracking**

Use click delegation. Classify placement by nearest `header`, `footer`, or body. Classify only known local path prefixes. Wrap `gtag` calls so navigation always proceeds.

- [ ] **Step 4: Verify GREEN**

Run focused and full tests. Expected: all pass.

### Task 7: Update discovery surfaces

**Files:**
- Modify: `sitemap.xml`
- Modify: `tests/site.test.mjs`

**Interfaces:**
- Consumes: seven new canonical routes.
- Produces: one current sitemap entry per public page.

- [ ] **Step 1: Write failing sitemap tests**

Extend `expectedPublicUrls`; require new pages exactly once with `2026-07-23` lastmod; require every sitemap HTML document to self-canonicalize.

- [ ] **Step 2: Verify RED**

Run the sitemap tests and confirm the seven new URLs are missing.

- [ ] **Step 3: Update the sitemap**

Add only canonical routes. Update existing lastmod values only where content changed materially.

- [ ] **Step 4: Verify GREEN**

Run focused and full tests. Expected: all pass.

### Task 8: Visual, production, and deployment verification

**Files:**
- No new production files unless verification exposes a defect.

**Interfaces:**
- Produces: evidence that the release meets the automated, responsive, crawler, and deployment contract.

- [ ] **Step 1: Run static verification**

Run:

```powershell
node scripts/render-habit-app-index.mjs
git diff --check
node --test tests/site.test.mjs
```

Expected: no renderer drift, no whitespace errors, and zero test failures.

- [ ] **Step 2: Run browser verification**

Check `/habit-apps/` and representative decision/guide pages at 1440px and 390px. Verify no horizontal overflow, one H1, readable static content, working filters, visible focus, 44px targets, source links, disclosure, and correct Ascent destinations.

- [ ] **Step 3: Commit and push**

Commit the complete verified feature to its isolated branch, integrate to `master`, and push `origin master`.

- [ ] **Step 4: Verify production**

Confirm every sitemap URL returns `200`, the exact self-canonical, and equivalent content to normal, OAI-SearchBot, PerplexityBot, and Claude-SearchBot user agents.

- [ ] **Step 5: Submit changed URLs**

Run `scripts/submit-indexnow.mjs` with the seven new routes and materially changed canonical pages. Confirm an accepted response. Confirm Bing sitemap processing and submit priority URLs where available.

