# LLM Authority Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish a transparent editorial authority foundation, a canonical Ascent product page, answer-engine referral measurement, and reliable search-engine discovery before publishing broader decision and guide content.

**Architecture:** Keep the dependency-free static site. Add one shared editorial stylesheet, two hand-authored static pages, a small IndexNow submission utility, and stronger repository tests. The homepage becomes the crawl and visitor junction while one stable Ascent entity ID connects the homepage, canonical product page, and App Store listing.

**Tech Stack:** Static HTML5, CSS, JSON-LD, vanilla JavaScript, Node.js `node:test`, PowerShell, GitHub `master`, Vercel.

## Global Constraints

- Competitor coverage is document-based editorial research, not hands-on testing.
- The exact product name is `Ascent: Habit Builder & Focus`.
- The stable product `@id` is `https://habitbuilding.xyz/#ascent-app`.
- Every install link starts with `https://apps.apple.com/us/app/ascent-habit-builder-focus/id6756843194`.
- Public recommendations disclose that HabitBuilding.xyz is published by the maker of Ascent.
- Do not invent ratings, prices, tests, outcomes, credentials, medical claims, or universal winner claims.
- Do not add hidden keyword blocks, `meta keywords`, doorway pages, or an `llms.txt` dependency.
- Meaningful content, navigation, and internal links remain readable without JavaScript.
- Preserve warm opaque surfaces, Fraunces, Instrument Sans, muted colors, 44px targets, visible focus, and reduced-motion support.
- Do not add neon styling, gradient title text, hover lift, competitor logos, badges, score gauges, content pills, or shame-based copy.
- Analytics never infers or stores a private prompt or query.
- IndexNow submission signals a changed URL; it never guarantees indexing.

---

### Task 1: Add the authority-foundation test contract

**Files:**
- Modify: `tests/site.test.mjs`

**Interfaces:**
- Produces `authorityRoutes`, the canonical route list used by discovery tests.
- Produces tests consumed by Tasks 2-7.

- [ ] **Step 1: Add the failing route, disclosure, entity, crawler, and analytics tests**

Add after `headToHeadSlugs`:

```js
const authorityRoutes = [
  ['ascent/index.html', 'https://habitbuilding.xyz/ascent/'],
  ['methodology/index.html', 'https://habitbuilding.xyz/methodology/']
];
```

Append these tests:

```js
test('authority foundation pages are canonical static documents', () => {
  for (const [page, canonical] of authorityRoutes) {
    assert.ok(existsSync(join(root, page)), page + ' is missing');
    const html = read(page);
    assert.match(html, /<meta name="description" content="[^"]{100,170}">/);
    assert.ok(html.includes('<link rel="canonical" href="' + canonical + '">'));
    assert.equal((html.match(/<h1\b/gi) || []).length, 1, page + ' needs one H1');
    assert.match(html, /Updated July 22, 2026|Effective July 22, 2026/);
    parseJsonLd(html, page);
  }
});

test('methodology discloses ownership and document-based research', () => {
  const html = read('methodology/index.html');
  assert.match(html, /published by the maker of Ascent/i);
  assert.match(html, /public product documentation and App Store listings/i);
  assert.match(html, /not hands-on product tests/i);
  assert.match(html, /documented fact/i);
  assert.match(html, /editorial judgment/i);
  assert.match(html, /correction/i);
});

test('canonical Ascent page owns the exact product identity', () => {
  const html = read('ascent/index.html');
  assert.match(html, /<title>Ascent: Habit Builder &amp; Focus \| Official Guide<\/title>/);
  assert.match(html, /<h1>Ascent: Habit Builder &amp; Focus<\/h1>/);
  assert.match(html, /who should choose something else/i);
  assert.match(html, /Screen Time access is optional/i);
  const entities = parseJsonLd(html, 'ascent/index.html');
  const app = entities.find((item) => item['@id'] === 'https://habitbuilding.xyz/#ascent-app');
  assert.ok(app);
  assert.equal(app.name, 'Ascent: Habit Builder & Focus');
  assert.equal(app.downloadUrl, canonicalAppStoreUrl);
  assert.equal(app.identifier.value, '6756843194');
});

test('homepage routes readers to authority destinations and discloses ownership', () => {
  const html = read('index.html');
  for (const href of ['ascent/', 'compare/', 'methodology/']) {
    assert.ok(html.includes('href="' + href + '"'), 'homepage is missing ' + href);
  }
  assert.match(html, /HabitBuilding\.xyz is published by the maker of Ascent/i);
});

test('answer-engine referral analytics classifies known sources without query collection', () => {
  const js = read('analytics.js');
  assert.match(js, /answer_engine_referral/);
  for (const source of ['chatgpt', 'perplexity', 'claude', 'copilot', 'gemini']) {
    assert.match(js, new RegExp(source));
  }
  assert.match(js, /landing_path/);
  assert.match(js, /traffic_source/);
  assert.doesNotMatch(js, /search_term|prompt_text|query_text|URLSearchParams.*[?&]q=/s);
});

test('search and retrieval crawlers are explicitly allowed', () => {
  const robots = read('robots.txt');
  for (const bot of ['OAI-SearchBot', 'PerplexityBot', 'Claude-SearchBot']) {
    assert.match(robots, new RegExp('User-agent: ' + bot + '\\s+Allow: /'));
  }
  assert.match(robots, /Sitemap: https:\/\/habitbuilding\.xyz\/sitemap\.xml/);
});

test('IndexNow support contains a valid root key and safe submission utility', () => {
  const config = JSON.parse(read('indexnow.json'));
  assert.match(config.key, /^[A-Za-z0-9-]{8,128}$/);
  assert.equal(config.keyLocation, 'https://habitbuilding.xyz/' + config.key + '.txt');
  assert.equal(read(config.key + '.txt').trim(), config.key);
  const script = read('scripts/submit-indexnow.mjs');
  assert.match(script, /api\.indexnow\.org\/indexnow/);
  assert.match(script, /https:\/\/habitbuilding\.xyz\//);
  assert.match(script, /process\.argv\.slice\(2\)/);
});
```

- [ ] **Step 2: Extend public URL and local-link fixtures**

Add both canonical URLs to `expectedPublicUrls`. Add `ascent/index.html` and `methodology/index.html` to the page arrays in the canonical App Store, stale-copy, JSON-LD, and local-link tests. The App Store requirement applies to `ascent/index.html`; the methodology page is not required to carry an install CTA.

- [ ] **Step 3: Run the suite and verify RED**

Run: `node --test tests/site.test.mjs`

Expected: failures for missing pages, missing homepage paths, the old ChatGPT-only event, missing crawler rules, missing IndexNow files, and a sitemap count mismatch.

- [ ] **Step 4: Commit the failing contract**

```powershell
git add tests/site.test.mjs
git commit -m "test: define authority foundation contract"
```

---

### Task 2: Generalize answer-engine referral analytics

**Files:**
- Modify: `analytics.js`
- Modify: `tests/site.test.mjs`

**Interfaces:**
- Produces GA4 event `answer_engine_referral` with `landing_path` and `traffic_source`.
- Preserves legacy `chatgpt_referral` for ChatGPT attribution continuity.

- [ ] **Step 1: Replace the single-source classifier**

Use this implementation in `analytics.js`:

```js
(() => {
  const engines = [
    { source: 'chatgpt', hosts: ['chatgpt.com'], campaigns: ['chatgpt.com', 'chatgpt'] },
    { source: 'perplexity', hosts: ['perplexity.ai'], campaigns: ['perplexity', 'perplexity.ai'] },
    { source: 'claude', hosts: ['claude.ai'], campaigns: ['claude', 'claude.ai'] },
    { source: 'copilot', hosts: ['copilot.microsoft.com', 'bing.com'], campaigns: ['copilot', 'microsoft_copilot'] },
    { source: 'gemini', hosts: ['gemini.google.com'], campaigns: ['gemini', 'google_gemini'] }
  ];

  const campaign = new URLSearchParams(window.location.search).get('utm_source')?.toLowerCase();
  let referrerHost = '';
  try {
    referrerHost = document.referrer ? new URL(document.referrer).hostname.toLowerCase() : '';
  } catch {
    referrerHost = '';
  }

  const match = engines.find((engine) =>
    engine.campaigns.includes(campaign) || engine.hosts.some((host) => referrerHost === host || referrerHost.endsWith('.' + host))
  );

  if (!match || typeof window.gtag !== 'function') return;

  const event = {
    landing_path: window.location.pathname,
    traffic_source: match.source
  };
  window.gtag('event', 'answer_engine_referral', event);
  if (match.source === 'chatgpt') window.gtag('event', 'chatgpt_referral', event);
})();
```

- [ ] **Step 2: Run the analytics tests**

Run: `node --test tests/site.test.mjs --test-name-pattern="referral analytics"`

Expected: PASS.

- [ ] **Step 3: Commit**

```powershell
git add analytics.js tests/site.test.mjs
git commit -m "feat: measure answer engine referrals"
```

---

### Task 3: Add crawler and IndexNow discovery support

**Files:**
- Modify: `robots.txt`
- Create: `indexnow.json`
- Create: `<generated-key>.txt`
- Create: `scripts/submit-indexnow.mjs`
- Modify: `tests/site.test.mjs`

**Interfaces:**
- `indexnow.json` provides `{ "key": string, "keyLocation": string }` to tests and the submission utility.
- `scripts/submit-indexnow.mjs` accepts changed paths or absolute canonical URLs as CLI arguments.

- [ ] **Step 1: Expand the robots policy**

Use:

```text
User-agent: OAI-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: *
Allow: /

Sitemap: https://habitbuilding.xyz/sitemap.xml
```

- [ ] **Step 2: Generate and store the IndexNow key configuration**

Generate one 32-character lowercase hexadecimal value. If the value is `0123456789abcdef0123456789abcdef`, create:

`indexnow.json`:

```json
{
  "key": "0123456789abcdef0123456789abcdef",
  "keyLocation": "https://habitbuilding.xyz/0123456789abcdef0123456789abcdef.txt"
}
```

`0123456789abcdef0123456789abcdef.txt`:

```text
0123456789abcdef0123456789abcdef
```

Use the actual generated value consistently; do not use the example value.

- [ ] **Step 3: Create the submission utility**

Create `scripts/submit-indexnow.mjs`:

```js
import { readFileSync } from 'node:fs';

const site = 'https://habitbuilding.xyz/';
const config = JSON.parse(readFileSync(new URL('../indexnow.json', import.meta.url), 'utf8'));
const inputs = process.argv.slice(2);

if (inputs.length === 0) {
  console.error('Usage: node scripts/submit-indexnow.mjs /path/ [https://habitbuilding.xyz/other/]');
  process.exit(1);
}

const urlList = [...new Set(inputs.map((input) => new URL(input, site).href))];
for (const url of urlList) {
  if (new URL(url).origin !== new URL(site).origin) {
    console.error('Refusing non-canonical host: ' + url);
    process.exit(1);
  }
}

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: 'habitbuilding.xyz',
    key: config.key,
    keyLocation: config.keyLocation,
    urlList
  })
});

console.log(JSON.stringify({ status: response.status, submitted: urlList }, null, 2));
if (![200, 202].includes(response.status)) process.exit(1);
```

- [ ] **Step 4: Run focused tests**

Run: `node --test tests/site.test.mjs --test-name-pattern="crawler|IndexNow"`

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add robots.txt indexnow.json scripts/submit-indexnow.mjs tests/site.test.mjs *.txt
git commit -m "feat: add answer crawler and IndexNow discovery"
```

---

### Task 4: Create the shared editorial field-guide stylesheet

**Files:**
- Create: `editorial.css`
- Modify: `tests/site.test.mjs`

**Interfaces:**
- Produces page classes `site-header`, `editorial-hero`, `answer-block`, `editorial-section`, `split`, `source-list`, `disclosure`, `cta-band`, and `site-footer`.

- [ ] **Step 1: Add the stylesheet contract**

Append:

```js
test('editorial stylesheet is accessible, responsive, and visually restrained', () => {
  const css = read('editorial.css');
  assert.match(css, /a:focus-visible/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /@media\s*\(max-width:\s*760px\)/);
  assert.match(css, /header[^{}]*\{[^}]*background:\s*var\(--paper\)/s);
  assert.doesNotMatch(css, /backdrop-filter|translateY|background-clip:\s*text|text-shadow/i);
  assert.doesNotMatch(css, /rgba\(255\s*,\s*255\s*,\s*255/i);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --test tests/site.test.mjs --test-name-pattern="editorial stylesheet"`

Expected: FAIL because `editorial.css` is missing.

- [ ] **Step 3: Implement the stylesheet**

Define the same core tokens as `compare/head-to-head.css`, with `--paper:#FAF7F2`, `--paper-deep:#F3EEE5`, `--ink:#1C1A16`, `--ink-soft:#5C574D`, `--ink-faint:#6C665C`, `--pine:#2E6FAE`, `--pine-deep:#1F4E7E`, `--line:#DDD6C9`, `--card:#FFFFFF`, Fraunces, and Instrument Sans. Use solid `var(--paper)` for the sticky header. Make content width `min(1120px, calc(100% - 56px))`, reading width `780px`, one-column layouts below `760px`, and all interactive header/footer/summary links at least `44px` high. Use borders and spacing rather than cards for lists.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `node --test tests/site.test.mjs --test-name-pattern="editorial stylesheet"`

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add editorial.css tests/site.test.mjs
git commit -m "feat: add editorial field guide styles"
```

---

### Task 5: Publish the transparent research methodology

**Files:**
- Create: `methodology/index.html`
- Modify: `tests/site.test.mjs`

**Interfaces:**
- Consumes `/editorial.css` and `/analytics.js`.
- Produces the disclosure destination linked by later decision and guide pages.

- [ ] **Step 1: Create the static document**

Use title `How We Research Habit Apps | HabitBuilding.xyz`, H1 `How we research habit and focus apps`, canonical `https://habitbuilding.xyz/methodology/`, and visible `Effective July 22, 2026`.

The direct answer must say:

```text
HabitBuilding.xyz is published by the maker of Ascent. We review public product documentation and App Store listings to compare habit and focus apps. Unless a page explicitly says otherwise, these are editorial comparisons, not hands-on product tests.
```

Include sections with these exact purposes:

- `Sources we prioritize`: App Store listing, official product site, official help/pricing/privacy documents, then peer-reviewed or government-hosted behavioral research.
- `Fact versus judgment`: label documented features as facts and fit recommendations as editorial judgment.
- `How we compare`: primary job, planning support, daily execution, attention intervention, feedback, platform scope, documented privacy, and intended user.
- `Our relationship to Ascent`: disclose ownership and the requirement to recommend a competitor when it better fits.
- `Corrections and updates`: visible dates change only after material review; unsupported claims are removed; corrections can be sent to the site's existing contact destination.
- `What we do not do`: no private prompt access, pay-to-win rankings, invented test results, fabricated ratings, or medical treatment claims.

Add `Article` and `BreadcrumbList` JSON-LD matching visible content. Do not add `FAQPage` unless there is a visible FAQ.

- [ ] **Step 2: Run focused tests**

Run: `node --test tests/site.test.mjs --test-name-pattern="methodology|authority foundation"`

Expected: the methodology test passes; the foundation route test still fails until `/ascent/` exists.

- [ ] **Step 3: Commit**

```powershell
git add methodology/index.html tests/site.test.mjs
git commit -m "feat: publish editorial research methodology"
```

---

### Task 6: Publish the canonical Ascent product page

**Files:**
- Create: `ascent/index.html`
- Modify: `tests/site.test.mjs`

**Interfaces:**
- Consumes `/editorial.css`, `/analytics.js`, and existing `/img/` assets.
- Produces the canonical explanatory page for `https://habitbuilding.xyz/#ascent-app`.

- [ ] **Step 1: Create the static product guide**

Use title `Ascent: Habit Builder & Focus | Official Guide`, H1 `Ascent: Habit Builder & Focus`, canonical `https://habitbuilding.xyz/ascent/`, and visible `Updated July 22, 2026`.

The direct answer must explain that Ascent is an iPhone habit system built around one meaningful goal, a 70-day plan, a visible daily action, a two-minute fallback, reflection, and optional Screen Time friction. It must say that it is narrower than a full planner and less specialized than a dedicated app blocker.

Include sections:

- `The behavior loop`: goal -> daily action -> smaller fallback -> iPhone visibility -> optional distraction friction -> reflection.
- `What Ascent includes`: only features already documented on the homepage/App Store listing.
- `Who it is for`: people who want one priority goal and coordinated positive-action/distraction support.
- `Who should choose something else`: multiple-habit logging -> Streaks or Habitify; full-day visual planning -> Tiimo or Structured; deep blocker analytics/rules -> Opal; moment-specific interruptions/browser tools -> one sec.
- `Privacy and Screen Time`: Screen Time access is optional; repeat only verified privacy statements already present on the site.
- `About this page`: HabitBuilding.xyz is published by the maker of Ascent; link to `/methodology/`.
- three concise visible FAQs mirrored exactly in `FAQPage` JSON-LD.
- one primary App Store CTA with campaign `canonical_ascent` and one contextual link to `/compare/`.

Add `SoftwareApplication` using the existing exact homepage entity fields, `Article`, `BreadcrumbList`, and matching `FAQPage`. Use the stable product `@id`; do not create a second product identity rooted at `/ascent/`.

- [ ] **Step 2: Run focused tests**

Run: `node --test tests/site.test.mjs --test-name-pattern="canonical Ascent|authority foundation"`

Expected: PASS.

- [ ] **Step 3: Commit**

```powershell
git add ascent/index.html tests/site.test.mjs
git commit -m "feat: publish canonical Ascent product guide"
```

---

### Task 7: Connect the homepage and sitemap

**Files:**
- Modify: `index.html`
- Modify: `sitemap.xml`
- Modify: `tests/site.test.mjs`

**Interfaces:**
- Produces crawlable homepage links to the current and planned authority destinations.
- Produces sitemap discovery for live authority pages only.

- [ ] **Step 1: Add homepage authority paths**

Add a compact editorial navigation row or section near the current comparison preview with these visible destinations:

```html
<a href="compare/">Compare iPhone habit apps</a>
<a href="ascent/">Read the complete Ascent guide</a>
<a href="methodology/">See how we research apps</a>
```

Add `Ascent guide` linking to `ascent/` and `About our research` linking to `methodology/` in the footer or primary navigation. Add the visible disclosure:

```text
HabitBuilding.xyz is published by the maker of Ascent. Comparisons use public product documentation and explain when another app is the better fit.
```

- [ ] **Step 2: Add live foundation pages to the sitemap**

Insert each exactly once after the homepage:

```xml
<url>
  <loc>https://habitbuilding.xyz/ascent/</loc>
  <lastmod>2026-07-22</lastmod>
  <priority>0.9</priority>
</url>
<url>
  <loc>https://habitbuilding.xyz/methodology/</loc>
  <lastmod>2026-07-22</lastmod>
  <priority>0.7</priority>
</url>
```

Remove inaccurate `changefreq` elements from all static entries. Do not add planned routes before their files exist.

- [ ] **Step 3: Run the full suite**

Run: `node --test tests/site.test.mjs`

Expected: all tests pass. If planned homepage links are deferred, the test must require only live routes until their phase is implemented.

- [ ] **Step 4: Commit**

```powershell
git add index.html sitemap.xml tests/site.test.mjs
git commit -m "feat: connect authority pages to site discovery"
```

---

### Task 8: Verify and prepare deployment handoff

**Files:**
- Verify all modified and created files.

**Interfaces:**
- Produces a clean, tested foundation ready for the decision-content plan.

- [ ] **Step 1: Run automated verification**

```powershell
node --test tests/site.test.mjs
git diff --check
git status --short
```

Expected: all tests pass, `git diff --check` prints nothing, and only intended plan-tracking changes remain.

- [ ] **Step 2: Run a local static server and inspect representative pages**

```powershell
python -m http.server 4173
```

Inspect `/`, `/ascent/`, and `/methodology/` at 1440x1000 and 390x844. Verify one H1, no horizontal overflow, visible keyboard focus, readable CTA contrast, no console errors, and exact App Store ID `6756843194`.

- [ ] **Step 3: Validate IndexNow without submitting production URLs yet**

Run the script with no arguments and confirm exit code `1` plus the usage message. Confirm the key URL maps to an existing root file. Submit only after the corresponding deployment is live.

- [ ] **Step 4: Commit any plan-tracking update**

```powershell
git add docs/superpowers/plans/2026-07-22-llm-authority-foundation.md
git commit -m "docs: finalize authority foundation plan"
```

## Self-review record

- **Spec coverage:** Phase 1 requirements are covered: methodology, canonical product page, analytics, crawler policy, IndexNow, homepage discovery, sitemap, entity consistency, and account boundaries. Decision pages and five guides are intentionally delegated to their own independently testable plans.
- **Placeholder scan:** No unfinished markers or unspecified error-handling step remains. The IndexNow example is explicitly prohibited from use.
- **Interface consistency:** The exact product name, `@id`, App Store URL, `authorityRoutes`, analytics event, and IndexNow config fields remain consistent across tasks.
