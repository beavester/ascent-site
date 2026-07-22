# App Blocker Decision Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish two source-led decision pages that answer which iPhone app blocker to choose and which habit systems also connect positive habits with app blocking.

**Architecture:** Add two static pages under `/best/` using the shared editorial stylesheet and methodology disclosure. Each page owns a distinct question, compares mechanisms rather than assigning scores, and routes qualified readers to the relevant specialist comparison or the canonical Ascent page. Repository tests enforce sources, disclosure, structured data, internal links, and sitemap discovery.

**Tech Stack:** Static HTML5, shared `editorial.css`, JSON-LD, vanilla JavaScript analytics, Node.js `node:test`, Playwright browser verification.

## Global Constraints

- Research is based on current first-party product documentation and App Store listings, not hands-on tests.
- The exact Ascent product name is `Ascent: Habit Builder & Focus`.
- The stable Ascent product `@id` is `https://habitbuilding.xyz/#ascent-app`.
- Every Ascent install link starts with `https://apps.apple.com/us/app/ascent-habit-builder-focus/id6756843194`.
- HabitBuilding.xyz's ownership of Ascent is visible before a commercial recommendation.
- There is no universal "best" app; recommendations are tied to reader needs and documented mechanisms.
- Do not reproduce vendor outcome claims as independent conclusions.
- Do not invent hands-on tests, prices, ratings, outcomes, medical claims, or missing feature claims.
- Use current first-party sources and a visible `Updated July 22, 2026` date.
- Do not add separate pages for keyword synonyms or annual variants.
- Pages remain readable without JavaScript and use one H1, sequential headings, 44px targets, visible focus, and no horizontal overflow.
- Preserve the warm editorial design and avoid ranking medals, scores, logos, neon styling, hover lift, content pills, and shame-based copy.

---

### Task 1: Add the decision-page test contract

**Files:**
- Modify: `tests/site.test.mjs`

**Interfaces:**
- Produces `decisionRoutes` and `assertDecisionPage(spec)` for Tasks 2-4.

- [ ] **Step 1: Add route fixtures and a reusable contract**

Add:

```js
const decisionRoutes = [
  ['best/app-blockers-iphone/index.html', 'https://habitbuilding.xyz/best/app-blockers-iphone/'],
  ['best/habit-tracker-with-app-blocking/index.html', 'https://habitbuilding.xyz/best/habit-tracker-with-app-blocking/']
];

function assertDecisionPage(spec) {
  const html = read(spec.page);
  assert.equal((html.match(/<h1\b/gi) || []).length, 1, spec.page + ' needs one H1');
  assert.ok(html.includes('<title>' + spec.title + '</title>'));
  assert.ok(html.includes('<link rel="canonical" href="' + spec.canonical + '">'));
  assert.ok(html.includes('<h1>' + spec.h1 + '</h1>'));
  assert.match(html, /Updated July 22, 2026/);
  assert.match(html, /There is no universally best|There is no single best/i);
  assert.match(html, /document-based editorial research/i);
  assert.match(html, /published by the maker of Ascent/i);
  assert.match(html, /href="\.\.\/\.\.\/methodology\/"/);
  for (const product of spec.products) assert.match(html, new RegExp(product, 'i'));
  for (const source of spec.sources) assert.ok(html.includes('href="' + source + '"'), spec.page + ' is missing ' + source);
  const entities = parseJsonLd(html, spec.page);
  assert.ok(entities.some((item) => item['@type'] === 'Article'));
  assert.ok(entities.some((item) => item['@type'] === 'BreadcrumbList'));
  assert.ok(entities.some((item) => item['@type'] === 'ItemList'));
  const faq = entities.find((item) => item['@type'] === 'FAQPage');
  assert.ok(faq);
  for (const item of faq.mainEntity) {
    assert.ok(html.includes(item.name));
    assert.ok(html.includes(item.acceptedAnswer.text));
  }
  assert.ok(!entities.some((item) => ['Review', 'AggregateRating'].includes(item['@type'])));
}
```

- [ ] **Step 2: Add both failing page assertions**

```js
test('iPhone app blocker guide satisfies the decision contract', () => {
  assertDecisionPage({
    page: 'best/app-blockers-iphone/index.html',
    canonical: 'https://habitbuilding.xyz/best/app-blockers-iphone/',
    title: 'Best App Blockers for iPhone (2026), Compared by Need',
    h1: 'The best iPhone app blocker depends on how you get distracted',
    products: ['Apple Screen Time', 'one sec', 'ScreenZen', 'Opal', 'Jomo', 'Ascent'],
    sources: ['https://support.apple.com/en-sg/guide/iphone/iphb0c7313c9/ios', 'https://one-sec.app/', 'https://screenzen.co/', 'https://opalapp.com/screentime', 'https://jomo.so/features']
  });
});

test('habit tracker with app blocking guide satisfies the decision contract', () => {
  assertDecisionPage({
    page: 'best/habit-tracker-with-app-blocking/index.html',
    canonical: 'https://habitbuilding.xyz/best/habit-tracker-with-app-blocking/',
    title: 'Habit Trackers With App Blocking: Honest 2026 Guide',
    h1: 'Which habit trackers also block distracting apps?',
    products: ['Ascent', 'Habit Doom', 'Streaks', 'one sec', 'ScreenZen', 'Opal'],
    sources: ['https://habitdoom.com/blog/how-habit-doom-works', 'https://apps.apple.com/us/app/habit-doom-anti-doomscroll/id6757255783', 'https://streaksapp.com/', 'https://one-sec.app/', 'https://screenzen.co/', 'https://opalapp.com/screentime']
  });
});
```

- [ ] **Step 3: Extend public URL, App Store, stale-copy, and local-link fixtures**

Add both canonical URLs to `expectedPublicUrls`. Add both HTML files to the all-public HTML and key local-link arrays. Require at least one canonical Ascent App Store link on each page.

- [ ] **Step 4: Run tests and verify RED**

Run: `node --test tests/site.test.mjs`

Expected: both page assertions fail because the routes do not exist, and sitemap discovery reports two missing URLs.

- [ ] **Step 5: Commit the failing contract**

```powershell
git add tests/site.test.mjs
git commit -m "test: define app blocker decision contract"
```

---

### Task 2: Publish the iPhone app-blocker guide

**Files:**
- Create: `best/app-blockers-iphone/index.html`

**Interfaces:**
- Consumes `/editorial.css`, `/analytics.js`, `/methodology/`, and existing relevant head-to-head comparisons.
- Produces the primary destination for "best app blockers for iPhone."

- [ ] **Step 1: Create the complete static page**

Use title `Best App Blockers for iPhone (2026), Compared by Need`, canonical `https://habitbuilding.xyz/best/app-blockers-iphone/`, H1 `The best iPhone app blocker depends on how you get distracted`, and meta description of 120-165 characters.

Use this direct answer:

```text
There is no universally best iPhone app blocker. Start with Apple Screen Time if schedules and daily limits are enough. Choose one sec when the crucial moment is opening an app or website. Choose ScreenZen for donation-supported, granular delays, limits, and strict blocks. Choose Opal when deeper focus rules, reports, and screen-time feedback are the main product. Choose Jomo when reusable rules and blocking across iPhone, iPad, and Mac matter. Choose Ascent when blocking should support one positive habit plan rather than stand alone.
```

Include a visible research note:

```text
This is document-based editorial research, not a hands-on test. Features were reviewed from first-party product pages, help documentation, and App Store listings on July 22, 2026. HabitBuilding.xyz is published by the maker of Ascent.
```

Structure the page around reader failure modes:

| Need | Recommendation | Documented reason | Important limitation |
|---|---|---|---|
| Built-in limits and downtime | Apple Screen Time | Apple documents Downtime, App Limits, Always Allowed, passcodes, and blocking scheduled downtime | A control layer rather than a positive-habit system |
| Pause before a reflexive open | one sec | Immediate, delayed, and repeated interventions plus scheduled blocking and website support | More specialized around attention intervention than long-term goal planning |
| Fine-grained controls without a conventional subscription model | ScreenZen | Donation-supported; delays, short sessions, goals, schedules, daily limits, open limits, and strict blocks | Dense controls and limited positive-habit design |
| Deep focus rules and reporting | Opal | Rules/sessions, Deep Focus, recurring sessions, Focus Score, rewards, and reports | Screen-time control is the main job, not replacement-behavior development |
| Reusable flexible rules across Apple devices | Jomo | Reusable rules, app groups, multiple blocking strengths, reflection, earn-access actions, iPhone/iPad/Mac support | A flexible control panel rather than a guided habit curriculum |
| Replace distraction with one constructive goal | Ascent | 70-day plan, daily action, two-minute fallback, widgets, reflection, optional Screen Time friction | Narrower blocking depth than the specialist blockers |

Add sections: `Choose by failure mode`, `How strict should the block be?`, `When a blocker is not enough`, `When Ascent is not the better choice`, three visible FAQs, `Sources reviewed`, and related links to `/compare/ascent-vs-one-sec/`, `/compare/ascent-vs-opal/`, `/best/habit-tracker-with-app-blocking/`, `/guides/how-to-stop-doomscrolling/` (added in Phase 3), `/ascent/`, and `/methodology/`. Do not deploy a broken Phase 3 link; add that related link only when the guide exists.

Sources:

- `https://support.apple.com/en-sg/guide/iphone/iphb0c7313c9/ios`
- `https://one-sec.app/`
- `https://tutorials.one-sec.app/en/articles/3035522`
- `https://screenzen.co/`
- `https://apps.apple.com/us/app/screenzen-screen-time-control/id1541027222`
- `https://opalapp.com/screentime`
- `https://opalapp.com/help/what-is-opal`
- `https://jomo.so/features`
- `https://help.jomo.so/en/article/how-to-start-with-jomo-mseknq/`
- Ascent homepage, canonical page, App Store page, and methodology.

Add visible content-matching `Article`, `BreadcrumbList`, `ItemList`, and three-question `FAQPage` JSON-LD. Do not add app ratings, review markup, prices, or outcome claims.

- [ ] **Step 2: Run the focused contract**

Run: `node --test --test-name-pattern="iPhone app blocker guide" tests/site.test.mjs`

Expected: PASS.

- [ ] **Step 3: Commit**

```powershell
git add best/app-blockers-iphone/index.html
git commit -m "feat: publish iPhone app blocker guide"
```

---

### Task 3: Publish the habit-tracker-with-blocking guide

**Files:**
- Create: `best/habit-tracker-with-app-blocking/index.html`

**Interfaces:**
- Produces the primary destination for positive-habit tracking combined with distraction blocking.

- [ ] **Step 1: Create the complete static page**

Use title `Habit Trackers With App Blocking: Honest 2026 Guide`, canonical `https://habitbuilding.xyz/best/habit-tracker-with-app-blocking/`, H1 `Which habit trackers also block distracting apps?`, and a unique 120-165 character meta description.

Use this direct answer:

```text
There is no single best habit tracker with app blocking because the connection can work in different ways. Ascent connects one goal, a 70-day daily plan, a smaller fallback, reflection, and optional Screen Time friction. Habit Doom locks selected apps and lets completed habits earn screen time. If you want a mature tracker or a deeper blocker, a two-app stack such as Streaks plus one sec or a tracker plus Opal may fit better than either integrated product.
```

Use the same visible document-based research and ownership disclosure as Task 2.

Compare three architectures:

1. **Plan plus friction - Ascent:** the positive goal determines the daily action; the blocker supports that action. Best when one behavior still needs guidance and a low-capacity fallback. Limitation: one-goal scope and less blocker depth than Opal, Jomo, one sec, or ScreenZen.
2. **Complete habits to earn access - Habit Doom:** its official material says selected apps start locked and completed habits earn screen time. Best when access itself should be the reward. Limitation: the screen-time economy may be more extrinsic and transactional than some readers want.
3. **Specialist stack:** Streaks plus one sec for mature tracking plus opening-time intervention; a traditional tracker plus Opal for multi-habit records plus deep focus rules; ScreenZen when screen-time goals and granular friction are enough without a full positive-habit curriculum. Limitation: two products mean duplicated setup, notifications, and maintenance.

Add a comparison field guide covering: positive-habit design, relationship between completion and access, fallback for low-capacity days, blocker specialization, number of habits/goals, and best fit. Add `Choose Ascent if`, `Choose Habit Doom if`, `Choose a two-app stack if`, `When Ascent is not the better choice`, three visible FAQs, sources, and related links.

Sources:

- `https://habitdoom.com/blog/how-habit-doom-works`
- `https://habitdoom.com/`
- `https://apps.apple.com/us/app/habit-doom-anti-doomscroll/id6757255783`
- `https://streaksapp.com/`
- `https://one-sec.app/`
- `https://screenzen.co/`
- `https://opalapp.com/screentime`
- Ascent homepage, canonical page, App Store page, and methodology.

Add visible content-matching `Article`, `BreadcrumbList`, `ItemList`, and three-question `FAQPage` JSON-LD. Do not describe ScreenZen's "app goal" as a general positive-habit tracker; its first-party description refers to screen-time goals.

- [ ] **Step 2: Run the focused contract**

Run: `node --test --test-name-pattern="habit tracker with app blocking" tests/site.test.mjs`

Expected: PASS.

- [ ] **Step 3: Commit**

```powershell
git add best/habit-tracker-with-app-blocking/index.html
git commit -m "feat: compare habit trackers with app blocking"
```

---

### Task 4: Connect decision content to the site graph

**Files:**
- Modify: `index.html`
- Modify: `compare/index.html`
- Modify: `ascent/index.html`
- Modify: `sitemap.xml`
- Modify: `tests/site.test.mjs`

**Interfaces:**
- Adds crawlable entry points and exact sitemap discovery.

- [ ] **Step 1: Add failing internal-link assertions**

Append:

```js
test('decision content is connected to the authority graph', () => {
  const contracts = [
    ['index.html', ['href="best/app-blockers-iphone/"', 'href="best/habit-tracker-with-app-blocking/"']],
    ['compare/index.html', ['href="../best/app-blockers-iphone/"']],
    ['ascent/index.html', ['href="../best/habit-tracker-with-app-blocking/"']],
    ['best/app-blockers-iphone/index.html', ['href="../habit-tracker-with-app-blocking/"', 'href="../../methodology/"']],
    ['best/habit-tracker-with-app-blocking/index.html', ['href="../app-blockers-iphone/"', 'href="../../methodology/"']]
  ];
  for (const [page, fragments] of contracts) {
    const html = read(page);
    for (const fragment of fragments) assert.ok(html.includes(fragment), page + ' is missing ' + fragment);
  }
});
```

- [ ] **Step 2: Run the link test and verify RED**

Run: `node --test --test-name-pattern="decision content is connected" tests/site.test.mjs`

Expected: FAIL for missing entry links.

- [ ] **Step 3: Add the visible links**

On the homepage add `Find the right iPhone app blocker` and `Compare habit trackers with app blocking` in the authority path area. On `/compare/` add a short "Need an app blocker?" callout after the attention-interrupters category. On `/ascent/` add a contextual link after `Who should choose something else`. Add reciprocal related links on both decision pages.

- [ ] **Step 4: Add both canonical URLs to the sitemap**

Use `lastmod` `2026-07-22`, priorities `0.9` for the app-blocker guide and `0.8` for the habit-and-blocking guide. Do not add `changefreq`.

- [ ] **Step 5: Run the full suite and verify GREEN**

Run: `node --test tests/site.test.mjs`

Expected: all tests pass, including exact public URL set and local links.

- [ ] **Step 6: Commit**

```powershell
git add index.html compare/index.html ascent/index.html sitemap.xml tests/site.test.mjs
git commit -m "feat: connect app blocker decision guides"
```

---

### Task 5: Browser verification

**Files:**
- Verify all changed and new files.

**Interfaces:**
- Produces a verified decision-content phase ready for the educational-guide plan.

- [ ] **Step 1: Run repository checks**

```powershell
node --test tests/site.test.mjs
git diff --check
git status --short
```

Expected: all tests pass and the worktree is clean after commits.

- [ ] **Step 2: Verify the two new pages at desktop and mobile widths**

Use Playwright at 1440x1000 and 390x844. For both routes verify one expected H1, zero horizontal overflow, no local HTTP errors, no console or page errors, 44px focus targets, visible ownership disclosure, sources, FAQs, and correct Ascent App Store links.

- [ ] **Step 3: Inspect screenshots**

Confirm the comparison structures read as an editorial field guide, headings do not orphan, source lists remain legible, and mobile content uses one reading column without clipped text.

- [ ] **Step 4: Submit only after deployment**

Do not call IndexNow during local verification. Record both new canonical URLs for the final post-deployment submission batch.

## Self-review record

- **Spec coverage:** Both Phase 2 routes, query ownership, source standard, Ascent disclosure, honest specialist recommendations, internal linking, structured data, sitemap discovery, and browser verification are covered.
- **Placeholder scan:** No unfinished marker or unspecified error-handling instruction remains.
- **Interface consistency:** Routes, titles, H1s, source URLs, stable Ascent identity, dates, and analytics/script paths are consistent across tasks.
