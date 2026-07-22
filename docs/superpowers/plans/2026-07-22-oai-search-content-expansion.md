# OAI and Search Content Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make habitbuilding.xyz a useful, honest citation target for ChatGPT and search users comparing iPhone habit apps, while always identifying and linking the correct Ascent app.

**Architecture:** Keep the homepage focused on Ascent, keep `/compare/` as the 18-app category hub, and add seven static, hand-authored head-to-head pages under `/compare/`. A single CSS file provides the shared editorial layout; each HTML page owns unique visible copy and matching JSON-LD. Node's built-in test runner verifies query ownership, content sincerity, entity identity, internal links, structured data, and sitemap discovery.

**Tech Stack:** Static HTML5, CSS, JSON-LD, vanilla JavaScript, Node.js `node:test`, GitHub `master`, Vercel production deployment.

## Global Constraints

- The exact Ascent entity ID is `https://habitbuilding.xyz/#ascent-app`.
- Every Ascent install link starts with `https://apps.apple.com/us/app/ascent-habit-builder-focus/id6756843194`.
- Comparisons name the competitor's genuine strength, Ascent's genuine limitation, and when the competitor is the better choice.
- Do not invent ratings, prices, performance results, medical claims, or universal “best” claims.
- Do not add doorway pages, hidden keyword blocks, `meta keywords`, programmatic keyword swapping, or an `llms.txt` dependency.
- Every head-to-head page is readable without JavaScript and contains unique editorial copy.
- Use only current first-party product sources in “Sources reviewed.”
- Use one H1 per page, sequential headings, visible keyboard focus, 44px touch targets, and no horizontal overflow below 700px.
- Preserve the current warm editorial palette, Fraunces display type, Instrument Sans body type, and restrained blue accent.
- Do not add hover lift, neon treatments, scoring meters, badges, or shame-based language.
- `robots.txt` continues to allow `OAI-SearchBot` and declare the root sitemap.
- OpenAI discoverability is an eligibility improvement, not a ranking guarantee.

---

### Task 1: Give the homepage and comparison hub distinct search intent

**Files:**
- Modify: `tests/site.test.mjs`
- Modify: `index.html`
- Modify: `compare/index.html`

**Interfaces:**
- Produces homepage title `Ascent: iPhone Habit Builder & App Blocker` and H1 `Build habits on iPhone. Block the apps that get in the way.`
- Produces hub title `Best Habit Tracker Apps for iPhone (2026): 18 Compared | Ascent` and H1 `18 iPhone habit apps compared honestly`.
- Produces route links for the seven slugs consumed by Tasks 3–5.

- [ ] **Step 1: Add failing query-ownership and hub-answer tests**

In the existing `comparison page is a dated, canonical, structured article` test, replace:

```js
assert.match(html, /Last reviewed July 2026/);
```

with:

```js
assert.match(html, /Last reviewed July 22, 2026/);
```

Append this test code to `tests/site.test.mjs`:

```js
const headToHeadSlugs = [
  'ascent-vs-fabulous',
  'ascent-vs-tiimo',
  'ascent-vs-routinery',
  'ascent-vs-finch',
  'ascent-vs-streaks',
  'ascent-vs-one-sec',
  'ascent-vs-opal'
];

test('homepage owns the iPhone habit-builder and app-blocker intent', () => {
  const html = read('index.html');
  assert.match(html, /<title>Ascent: iPhone Habit Builder &amp; App Blocker<\/title>/);
  assert.match(html, /<h1 class="display">Build habits on iPhone\. Block the apps that get in the way\.<\/h1>/);
  assert.match(html, /70-day daily plan/i);
  assert.match(html, /optional Screen Time/i);
});

test('comparison hub owns the best iPhone habit-app intent', () => {
  const html = read('compare/index.html');
  assert.match(html, /<title>Best Habit Tracker Apps for iPhone \(2026\): 18 Compared \| Ascent<\/title>/);
  assert.match(html, /<h1>18 iPhone habit apps compared honestly<\/h1>/);
  assert.match(html, /id="short-answer"/);
  assert.match(html, /There is no universally best habit app/i);
});

test('hub answers which habit tracker also blocks distracting apps', () => {
  const html = read('compare/index.html');
  const question = 'Which iPhone habit tracker also blocks distracting apps?';
  assert.ok(html.split(question).length >= 3, 'question must appear visibly and in FAQ JSON-LD');
  assert.match(html, /one sec, Opal, Jomo, and ScreenZen/i);
});
```

- [ ] **Step 2: Run the suite and verify RED**

Run: `node --test tests/site.test.mjs`

Expected: the three new tests fail because the existing title, H1, short answer, and FAQ are absent.

- [ ] **Step 3: Update homepage metadata and visible hero**

In `index.html` make these exact replacements:

```html
<title>Ascent: iPhone Habit Builder &amp; App Blocker</title>
<meta name="description" content="Ascent is an iPhone habit builder and optional app blocker with a 70-day daily plan, home-screen widgets, two-minute fallback actions, and reflection.">
<meta property="og:title" content="Ascent: iPhone Habit Builder &amp; App Blocker">
<meta property="og:description" content="Build one meaningful habit with a 70-day daily plan, visible cues, smaller fallback actions, reflection, and optional Screen Time friction.">
```

Replace the hero heading and supporting paragraph with:

```html
<h1 class="display">Build habits on iPhone. Block the apps that get in the way.</h1>
<p class="hero-copy">Ascent turns one meaningful goal into a focused 70-day daily plan, keeps today’s action visible, shrinks it when the day is hard, and can add optional Screen Time friction before distracting apps.</p>
```

Keep the smart app banner, canonical, `SoftwareApplication` name, `@id`, `sameAs`, App Store ID, navigation, screenshot, and existing product sections unchanged.

- [ ] **Step 4: Update the comparison hub metadata, hero, and direct answer**

In `compare/index.html` use:

```html
<title>Best Habit Tracker Apps for iPhone (2026): 18 Compared | Ascent</title>
<meta name="description" content="Compare 18 of the best habit tracker apps for iPhone, including traditional trackers, guided routines, gamified tools, and app blockers—with honest strengths and limitations.">
<meta property="og:title" content="18 iPhone habit apps compared honestly">
<meta property="og:description" content="An honest 2026 comparison of 18 iPhone habit trackers, routine apps, self-care tools, and distraction blockers.">
```

Use this visible hero:

```html
<span class="kicker">An honest field guide</span>
<h1>18 iPhone habit apps compared honestly</h1>
<p class="lede">The best habit app depends on the job: logging consistency, following a routine, planning a day, making self-care emotionally engaging, or interrupting distraction. This guide compares those jobs without pretending one app wins every category.</p>
<p class="review-date"><time datetime="2026-07-22">Last reviewed July 22, 2026</time> · Compared against current first-party product information.</p>
```

Insert immediately after the methodology:

```html
<section class="short-answer" id="short-answer" aria-labelledby="short-answer-title">
  <h2 id="short-answer-title">The short answer</h2>
  <p>There is no universally best habit app. Streaks is the cleaner pure tracker. Routinery is stronger for running a known routine step by step. Finch makes self-care more emotionally engaging. one sec and Opal are more specialized when distraction control is the entire need.</p>
  <p>Ascent is the relevant choice when you want one iPhone system to connect a meaningful goal, daily actions, home-screen visibility, smaller fallback actions, reflection, and optional app-blocking friction. If you only need one of those mechanisms, a specialist is usually the simpler choice.</p>
</section>
```

Add `The short answer` to the contents navigation. Add styling that uses a top and bottom rule, no card shadow, and the existing reading width.

- [ ] **Step 5: Add the visible and structured FAQ answer**

Add this `details` entry to the visible FAQ:

```html
<details>
  <summary>Which iPhone habit tracker also blocks distracting apps?</summary>
  <p>Ascent combines positive-habit guidance with optional Screen Time friction before distracting apps. If you only need specialized blocking or screen-time control, one sec, Opal, Jomo, and ScreenZen are more focused choices.</p>
</details>
```

Add the same question and answer text to the existing `FAQPage.mainEntity` array. Update the `Article` headline, description, and `dateModified` to match the visible page.

- [ ] **Step 6: Run tests and verify GREEN**

Run: `node --test tests/site.test.mjs`

Expected: all tests pass.

- [ ] **Step 7: Commit the intent separation**

```bash
git add index.html compare/index.html tests/site.test.mjs
git commit -m "feat: sharpen habit app search intent"
```

---

### Task 2: Establish the shared head-to-head page contract

**Files:**
- Create: `compare/head-to-head.css`
- Modify: `tests/site.test.mjs`

**Interfaces:**
- Produces CSS classes `comparison-hero`, `breadcrumbs`, `short-answer`, `dimension-list`, `choice-grid`, `source-list`, `related-list`, and `comparison-cta`.
- Produces test helper `assertHeadToHeadPage(spec)` consumed by Tasks 3–5.

- [ ] **Step 1: Add a failing stylesheet contract test and page assertion helper**

Append:

```js
function parseJsonLd(html, page) {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  assert.ok(blocks.length > 0, page + ' has no JSON-LD');
  return blocks.flatMap((match) => {
    const value = JSON.parse(match[1]);
    return Array.isArray(value) ? value : [value];
  });
}

function assertHeadToHeadPage(spec) {
  const page = 'compare/' + spec.slug + '/index.html';
  assert.ok(existsSync(join(root, page)), page + ' is missing');
  const html = read(page);

  assert.ok(html.includes('<title>' + spec.title + '</title>'));
  assert.match(html, new RegExp('<link rel="canonical" href="https:\\/\\/habitbuilding\\.xyz\\/compare\\/' + spec.slug + '\\/">'));
  assert.ok(html.includes('<h1>' + spec.h1 + '</h1>'));
  assert.match(html, new RegExp(spec.competitor, 'i'));
  assert.match(html, /<h2[^>]*>Short answer<\/h2>/);
  const shortAnswer = html.match(/<section class="short-answer"[\s\S]*?<p>([^<]+)<\/p>/)?.[1] ?? '';
  const shortAnswerWords = shortAnswer.trim().split(/\s+/).filter(Boolean).length;
  assert.ok(shortAnswerWords >= 120 && shortAnswerWords <= 180, page + ' short answer must be 120–180 words');
  assert.equal((html.match(/data-dimension="/g) || []).length, 5, page + ' needs five dimensions');
  assert.match(html, new RegExp('Choose ' + spec.competitor + ' if'));
  assert.match(html, /Choose Ascent if/);
  assert.match(html, /When Ascent is not the better choice/);
  assert.ok(html.includes('href="' + spec.source + '"'));
  assert.ok(html.includes(canonicalAppStoreUrl));
  assert.match(html, /href="\.\.\/"/);
  assert.match(html, /href="\.\.\/\.\.\/"/);
  assert.match(html, /Updated July 22, 2026/);

  const entities = parseJsonLd(html, page);
  const article = entities.find((item) => item['@type'] === 'Article');
  assert.ok(article);
  assert.equal(article.dateModified, '2026-07-22');
  assert.equal(article.mainEntityOfPage, 'https://habitbuilding.xyz/compare/' + spec.slug + '/');
  const faq = entities.find((item) => item['@type'] === 'FAQPage');
  assert.ok(faq);
  assert.equal(faq.mainEntity.length, 3);
  for (const item of faq.mainEntity) {
    assert.ok(html.includes(item.name), page + ' is missing visible FAQ question');
    assert.ok(html.includes(item.acceptedAnswer.text), page + ' is missing visible FAQ answer');
  }
  const ascent = entities.find((item) => item['@id'] === 'https://habitbuilding.xyz/#ascent-app');
  assert.ok(ascent, page + ' is missing the shared Ascent entity');
  assert.equal(ascent.downloadUrl, canonicalAppStoreUrl);
  assert.deepEqual(ascent.sameAs, [canonicalAppStoreUrl]);
  assert.equal(ascent.identifier.value, '6756843194');
  assert.ok(entities.some((item) => item['@type'] === 'SoftwareApplication' && item.name === spec.competitor));
  assert.ok(!entities.some((item) => ['Review', 'AggregateRating'].includes(item['@type'])));

  for (const question of spec.questions) {
    assert.ok(html.split(question).length >= 3, page + ' must mirror FAQ question: ' + question);
  }
}

test('head-to-head stylesheet is responsive and accessible', () => {
  const css = read('compare/head-to-head.css');
  assert.match(css, /a:focus-visible/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /@media\s*\(max-width:\s*700px\)/);
  assert.doesNotMatch(css, /translateY|text-shadow|box-shadow:\s*0\s+0/);
});
```

- [ ] **Step 2: Run the stylesheet test and verify RED**

Run: `node --test tests/site.test.mjs`

Expected: the new test fails because `compare/head-to-head.css` does not exist.

- [ ] **Step 3: Create the complete shared stylesheet**

Create `compare/head-to-head.css` with these rules:

```css
:root{--paper:#FAF7F2;--paper-deep:#F3EEE5;--ink:#1C1A16;--ink-soft:#5C574D;--ink-faint:#7B756A;--pine:#3D7FC1;--pine-deep:#1F4E7E;--pine-tint:#E2EEF9;--ember:#A94C26;--line:#DDD6C9;--card:#FFFFFF;--display:'Fraunces',Georgia,serif;--body:'Instrument Sans',-apple-system,sans-serif}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;scroll-padding-top:86px}
body{background:var(--paper);color:var(--ink);font-family:var(--body);font-size:17px;line-height:1.65;-webkit-font-smoothing:antialiased}
a{color:inherit}
a:focus-visible{outline:3px solid var(--ember);outline-offset:4px;border-radius:2px}
.wrap{width:min(1120px,calc(100% - 56px));margin:0 auto}
.reading{max-width:800px}
header{position:sticky;top:0;z-index:20;background:#FAF7F2F2;border-bottom:1px solid var(--line);backdrop-filter:blur(12px)}
.top-nav{min-height:68px;display:flex;align-items:center;justify-content:space-between;gap:24px}
.brand{display:flex;align-items:center;gap:10px;font-family:var(--display);font-size:1.25rem;font-weight:600;text-decoration:none}
.brand img{width:30px;height:30px;border-radius:8px}
.nav-links{display:flex;align-items:center;gap:28px;font-size:.92rem;font-weight:500}
.nav-links a{text-decoration:none;color:var(--ink-soft)}
.nav-links a:hover{text-decoration:underline;text-underline-offset:5px}
.btn{display:inline-flex;min-height:44px;align-items:center;justify-content:center;padding:10px 20px;border-radius:999px;background:var(--pine-deep);color:var(--paper);font-weight:600;text-decoration:none}
.nav-links .btn{color:var(--paper)}
.btn:hover{background:#173E66;text-decoration:none}
.breadcrumbs{padding-top:32px;font-size:.88rem;color:var(--ink-soft)}
.breadcrumbs ol{display:flex;flex-wrap:wrap;gap:8px;list-style:none}
.breadcrumbs li:not(:last-child)::after{content:"/";margin-left:8px;color:var(--ink-faint)}
.comparison-hero{padding:54px 0 58px;border-bottom:1px solid var(--line)}
.kicker{display:block;margin-bottom:20px;color:var(--pine-deep);font-size:.78rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase}
h1,h2,h3{font-family:var(--display);font-weight:500}
h1{max-width:15ch;font-size:clamp(2.7rem,6vw,4.8rem);line-height:1.02;letter-spacing:-.035em}
.lede{max-width:720px;margin-top:24px;color:var(--ink-soft);font-size:1.18rem}
.review-date{margin-top:18px;color:var(--ink-faint);font-size:.88rem}
main section{padding:76px 0;border-bottom:1px solid var(--line)}
main section:nth-of-type(even){background:var(--paper-deep)}
h2{font-size:clamp(2rem,4vw,3rem);line-height:1.08;letter-spacing:-.025em}
.section-intro{max-width:760px;margin-top:16px;color:var(--ink-soft)}
.short-answer p{max-width:800px;margin-top:18px;font-size:1.06rem}
.dimension-list{margin-top:36px;border-top:1px solid var(--line)}
.dimension{display:grid;grid-template-columns:180px 1fr 1fr;gap:28px;padding:26px 0;border-bottom:1px solid var(--line)}
.dimension h3{font-size:1.08rem}
.dimension p{color:var(--ink-soft)}
.dimension strong{display:block;margin-bottom:6px;color:var(--ink);font-size:.74rem;letter-spacing:.09em;text-transform:uppercase}
.choice-grid{display:grid;grid-template-columns:1fr 1fr;gap:48px;margin-top:34px}
.choice-grid h3{font-size:1.45rem}
.choice-grid ul{margin:16px 0 0 1.2rem}
.choice-grid li+li{margin-top:10px}
.limitation{max-width:800px;margin-top:38px;padding:26px 0;border-top:1px solid var(--ink);border-bottom:1px solid var(--ink)}
.limitation h3{font-size:1.2rem}
.limitation p{margin-top:8px;color:var(--ink-soft)}
.faq-list,.source-list,.related-list{max-width:850px;margin-top:32px;border-top:1px solid var(--line)}
.faq-list details{padding:20px 0;border-bottom:1px solid var(--line)}
.faq-list summary{cursor:pointer;font-family:var(--display);font-size:1.14rem;font-weight:600}
.faq-list p{max-width:740px;padding-top:12px;color:var(--ink-soft)}
.source-list,.related-list{list-style:none}
.source-list li,.related-list li{padding:14px 0;border-bottom:1px solid var(--line)}
.source-list a,.related-list a{text-underline-offset:4px}
.comparison-cta{background:var(--pine-deep)!important;color:var(--paper)}
.comparison-cta p{max-width:650px;margin:14px 0 24px;color:#DCE9F5}
.comparison-cta .btn{background:var(--paper);color:var(--pine-deep)}
footer{padding:42px 0;color:var(--ink-faint);font-size:.88rem}
.foot{display:flex;flex-wrap:wrap;justify-content:space-between;gap:20px}
.foot-links{display:flex;flex-wrap:wrap;gap:24px}
@media(max-width:700px){
  .wrap{width:min(100% - 36px,1120px)}
  .nav-links a:not(.btn){display:none}
  .comparison-hero{padding:42px 0 46px}
  h1{font-size:clamp(2.4rem,12vw,3.55rem)}
  main section{padding:58px 0}
  .dimension,.choice-grid{grid-template-columns:1fr;gap:14px}
  .choice-grid{gap:34px}
}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
```

- [ ] **Step 4: Run tests and verify GREEN**

Run: `node --test tests/site.test.mjs`

Expected: all tests pass.

- [ ] **Step 5: Commit the shared contract**

```bash
git add compare/head-to-head.css tests/site.test.mjs
git commit -m "feat: add comparison article foundation"
```

---

### Task 3: Publish the guided-action comparisons

**Files:**
- Create: `compare/ascent-vs-fabulous/index.html`
- Create: `compare/ascent-vs-tiimo/index.html`
- Create: `compare/ascent-vs-routinery/index.html`
- Modify: `tests/site.test.mjs`

**Interfaces:**
- Consumes `compare/head-to-head.css` and `assertHeadToHeadPage(spec)`.
- Produces three canonical static articles and links back to `../`.

- [ ] **Step 1: Add three failing page-contract tests**

```js
test('Fabulous comparison satisfies the editorial contract', () => {
  assertHeadToHeadPage({
    slug: 'ascent-vs-fabulous',
    competitor: 'Fabulous',
    title: 'Ascent vs Fabulous (2026): Which Habit App Fits You?',
    h1: 'Ascent vs Fabulous: focused action or guided coaching?',
    source: 'https://www.thefabulous.co/',
    questions: [
      'Is Ascent or Fabulous better for building routines?',
      'Does Fabulous block distracting apps?',
      'Can Ascent and Fabulous be used together?'
    ]
  });
});

test('Tiimo comparison satisfies the editorial contract', () => {
  assertHeadToHeadPage({
    slug: 'ascent-vs-tiimo',
    competitor: 'Tiimo',
    title: 'Ascent vs Tiimo (2026): Habit Builder or Daily Planner?',
    h1: 'Ascent vs Tiimo: one habit goal or your whole day?',
    source: 'https://www.tiimoapp.com/',
    questions: [
      'Is Ascent or Tiimo better for ADHD?',
      'Does Tiimo block distracting apps?',
      'Can Ascent and Tiimo be used together?'
    ]
  });
});

test('Routinery comparison satisfies the editorial contract', () => {
  assertHeadToHeadPage({
    slug: 'ascent-vs-routinery',
    competitor: 'Routinery',
    title: 'Ascent vs Routinery (2026): Habit Goal or Routine Timer?',
    h1: 'Ascent vs Routinery: build a goal or run a routine?',
    source: 'https://www.routinery.app/',
    questions: [
      'Is Ascent or Routinery better for morning routines?',
      'Does Routinery block distracting apps?',
      'Can Ascent and Routinery be used together?'
    ]
  });
});
```

- [ ] **Step 2: Run the suite and verify RED**

Run: `node --test tests/site.test.mjs`

Expected: three failures reporting the missing HTML files.

- [ ] **Step 3: Create each complete document using the fixed article structure**

Each document must include, in order: metadata; GA and `/analytics.js`; Google fonts; JSON-LD; `../head-to-head.css`; primary navigation; breadcrumbs; hero; a single-paragraph 120–180 word Short answer; five dimensions; choice guidance; frank Ascent limitation; three FAQs; sources; related comparisons; Ascent CTA; footer.

Use these exact page-specific editorial facts:

| Page | Short answer and honest decision | Five dimensions: primary job; setup; daily execution; distraction control; feedback | Choose competitor if | Choose Ascent if | Frank Ascent limitation |
|---|---|---|---|---|---|
| Fabulous | Fabulous is better for people who want a rich coaching library, progressive Journeys, and guided morning, afternoon, and evening routines. Ascent is better for someone who wants to keep attention on one meaningful goal, receive a 70-day sequence of daily actions, and optionally put Screen Time friction in front of distracting apps. Fabulous offers more content and a broader self-care experience; Ascent is narrower and more execution-oriented. Neither is universally better. Fabulous may be the stronger fit when exploring several wellness areas or when coaching prompts are the reason you return. Ascent may be stronger when too much content becomes another distraction and you want the phone itself to cue one next step. Choose according to the missing behavior mechanism, not the longer feature list. | self-care coaching vs one-goal behavior system; choose a Journey or routines vs choose one goal and generate the plan; guided routines and coaching vs one action with two-minute fallback; deep-work guidance vs optional Screen Time pause/blocking; content and community encouragement vs reflection and visible evidence | you want guided programs; several routines matter at once; coaching content motivates you | one goal deserves priority; hard-day fallback matters; distraction friction should support the goal | Ascent has a smaller coaching library and is deliberately less broad |
| Tiimo | Tiimo is better when the central problem is organizing an entire day: a visual timeline, calendar, to-dos, focus timer, widgets, and AI task breakdown across devices. Ascent is better when the desired outcome is narrower: build one meaningful habit over 70 days and redirect distracting phone use toward today's action. Tiimo is a fuller planner and a stronger fit for people who need flexible executive-function support throughout the day. Ascent does not replace that. It trades breadth for a focused goal, a two-minute fallback, reflection, and optional app-blocking friction. If calendars, transitions, and many responsibilities need coordination, choose Tiimo. If daily planning already exists but one behavior still needs focused scaffolding, choose Ascent. The decision is breadth of daily organization versus depth around a single behavior. | visual daily planner vs one-goal habit system; calendar/to-do planning vs generated 70-day sequence; timeline and focus timer vs one daily action and fallback; no specialized app blocking claimed on source vs optional Screen Time friction; mood/planning feedback vs goal reflection and visible momentum | you need a daily planner; calendar and cross-device schedule matter; visual executive-function tools are the priority | you want one goal; replacement behavior should connect to phone friction; you do not want another full planner | Ascent cannot coordinate a whole calendar or replace Tiimo's day-planning breadth |
| Routinery | Routinery is better when you already know the sequence and want a timer to move you through it, especially for morning, evening, study, or self-care routines. Ascent is better when the sequence is not yet the point: you want one meaningful goal developed into a 70-day progression, with a smaller action available on difficult days and optional friction before distracting apps. Routinery is the clearer execution tool for repeated multi-step routines. Ascent is the broader behavior loop around one long-term outcome. If your problem is moving through a known sequence without drifting, Routinery has the more direct mechanism. If your problem is deciding what action will gradually produce an important change, Ascent provides more structure around that goal. Neither should be treated as a full daily planner. | routine timer vs goal-centered habit system; build/select step sequence vs choose goal and generate progression; timed steps and reminders vs one daily task and fallback; no dedicated blocking claim vs Screen Time pause/hard windows; routine calendar/history vs reflection and goal evidence | your routine is already known; timers keep transitions moving; you need several steps in order | you need help shaping a long-term goal; one task per day is calmer; phone distraction competes with the goal | Ascent is not a step-by-step timer and is weaker for running a detailed existing routine |

For every page:

- Use `<meta name="description">` that summarizes its unique decision in 150–165 characters.
- Use `Updated July 22, 2026` visibly and `2026-07-22` in `dateModified`.
- Render the five dimensions as five `<article class="dimension" data-dimension="...">` elements.
- Use H2 `Which should you choose?`, H3 `Choose [competitor] if…`, H3 `Choose Ascent if…`, and H3 `When Ascent is not the better choice`.
- Add a “Using both” paragraph: Fabulous can supply broader coaching while Ascent holds one priority goal; Tiimo can plan the day while Ascent owns the one habit; Routinery can run a repeated sequence while Ascent develops the longer-term goal.
- Use three visible `details` FAQs and copy those exact question and answer strings into `FAQPage`.
- Use separate JSON-LD objects for `Article`, Ascent `SoftwareApplication`, competitor `SoftwareApplication`, and `FAQPage`.
- Use the tested first-party product URL as each competitor `SoftwareApplication.url`.
- The shared Ascent object must reproduce the homepage name, ID, operating system, URL, download URL, `sameAs`, App Store identifier, image, and description.
- Link sources to the competitor URL from the test, `https://habitbuilding.xyz/`, and the canonical App Store URL.
- Related links: Fabulous → Tiimo and Routinery; Tiimo → Fabulous and Routinery; Routinery → Fabulous and Tiimo.
- Tag CTA URLs with `utm_source=habitbuilding&utm_medium=site&utm_campaign=head_to_head&utm_content=[slug]`.

- [ ] **Step 4: Run tests and verify GREEN**

Run: `node --test tests/site.test.mjs`

Expected: all tests pass.

- [ ] **Step 5: Commit the guided-action articles**

```bash
git add compare/ascent-vs-fabulous/index.html compare/ascent-vs-tiimo/index.html compare/ascent-vs-routinery/index.html tests/site.test.mjs
git commit -m "feat: compare Ascent with guided habit apps"
```

---

### Task 4: Publish the emotional and traditional-tracker comparisons

**Files:**
- Create: `compare/ascent-vs-finch/index.html`
- Create: `compare/ascent-vs-streaks/index.html`
- Modify: `tests/site.test.mjs`

**Interfaces:**
- Produces two more canonical articles under the same page contract.

- [ ] **Step 1: Add two failing page-contract tests**

```js
test('Finch comparison satisfies the editorial contract', () => {
  assertHeadToHeadPage({
    slug: 'ascent-vs-finch',
    competitor: 'Finch',
    title: 'Ascent vs Finch (2026): Habit Goal or Self-Care Pet?',
    h1: 'Ascent vs Finch: focused habit or self-care companion?',
    source: 'https://help.finchcare.com/hc/en-us/articles/37935669335309-Our-Approach-to-Self-Care',
    questions: [
      'Is Ascent or Finch better for self-care?',
      'Does Finch block distracting apps?',
      'Can Ascent and Finch be used together?'
    ]
  });
});

test('Streaks comparison satisfies the editorial contract', () => {
  assertHeadToHeadPage({
    slug: 'ascent-vs-streaks',
    competitor: 'Streaks',
    title: 'Ascent vs Streaks (2026): Habit Builder or Tracker?',
    h1: 'Ascent vs Streaks: build the behavior or track it?',
    source: 'https://streaksapp.com/',
    questions: [
      'Is Ascent or Streaks the better iPhone habit tracker?',
      'Does Streaks block distracting apps?',
      'Can Ascent and Streaks be used together?'
    ]
  });
});
```

- [ ] **Step 2: Run the suite and verify RED**

Run: `node --test tests/site.test.mjs`

Expected: two failures reporting missing HTML files.

- [ ] **Step 3: Create both complete documents with this exact content inventory**

| Page | Short answer and honest decision | Five dimensions | Choose competitor if | Choose Ascent if | Frank Ascent limitation |
|---|---|---|---|---|---|
| Finch | Finch is better when emotional warmth and daily self-care are the main need. Completing goals energizes and develops a virtual “birb,” while adventures, customization, reflections, and gentle goals make small acts feel consequential. Ascent is better when someone wants a less game-centered system organized around one meaningful 70-day goal, visible daily action, a two-minute fallback, reflection, and optional app-blocking friction. Finch offers the stronger companion relationship and a broader self-care world. Ascent keeps the emotional center on the user's goal rather than on caring for a character. Choose Finch when warmth, customization, and a sense of companionship make it easier to return. Choose Ascent when the constructive action itself should stay central and distracting apps are a direct obstacle. Someone seeking broad emotional support may find Ascent too narrow; someone avoiding game rewards may prefer that narrowness. | self-care companion vs one-goal behavior system; select self-care areas/goals vs choose one goal/plan; goals energize birb/adventures vs daily task/fallback; no specialist blocking claim vs optional Screen Time friction; character growth/rewards vs reflection/visible evidence | caring for a character is motivating; broad self-care matters; gentle game feedback helps consistency | you want one outcome; the goal should remain central; phone distraction directly competes | Ascent cannot match Finch's companionship, customization, or self-care content universe |
| Streaks | Streaks is better if you already know the habits and want a polished Apple-native record of whether they happened. It supports up to 24 tasks, flexible schedules, Apple Health automation, statistics, widgets, and Apple Watch. Ascent is better if logging is not enough: you want one goal turned into a 70-day plan, today's action kept visible, a two-minute fallback, reflection, and optional friction before distracting apps. Streaks is the cleaner tracker. Ascent asks for a narrower commitment and adds planning and environmental intervention. Choose Streaks when the behavior is already clear and the main need is fast, reliable recording across Apple devices. Choose Ascent when the next action still needs to be shaped or protected from distraction. Users with many established habits will probably find Ascent's one-goal scope restrictive. | habit logging vs goal development; create up to 24 tasks vs one goal/70-day plan; quick completion/automatic Health tracking vs one daily action/fallback; no app blocking vs optional Screen Time friction; streaks/statistics vs reflection/evidence without streak pressure | habits are already defined; Apple integrations matter; you want multiple concise trackers | you need the next action designed; missed capacity needs a smaller fallback; distraction blocks execution | Ascent tracks fewer things and does not offer Streaks' breadth of Apple Health automation |

For both documents:

- Include metadata, GA, `/analytics.js`, Google fonts, JSON-LD, `../head-to-head.css`, navigation, breadcrumbs, hero, one 120–180 word Short answer paragraph, five dimension articles, choice guidance, the frank limitation, three FAQs, sources, related comparisons, CTA, and footer.
- Use a unique 150–165 character meta description, visible `Updated July 22, 2026`, and structured `dateModified` value `2026-07-22`.
- Render exactly five `data-dimension` articles and the exact headings `Choose [competitor] if…`, `Choose Ascent if…`, and `When Ascent is not the better choice`.
- Mirror all three visible FAQ question and answer strings in `FAQPage` JSON-LD.
- Include separate `Article`, shared Ascent `SoftwareApplication`, competitor `SoftwareApplication`, and `FAQPage` objects. Do not add ratings, reviews, or pricing.
- Use `https://finchcare.com/` as the Finch entity URL and `https://streaksapp.com/` as the Streaks entity URL.
- Use the canonical Ascent entity ID and App Store product URL from Global Constraints.
- Tag the App Store CTA with `utm_source=habitbuilding&utm_medium=site&utm_campaign=head_to_head&utm_content=[slug]` using the actual slug.

- Finch sources: the tested Finch self-care article, `https://help.finchcare.com/hc/en-us/articles/37779940291213-Creating-and-Completing-Goals`, Ascent homepage, Ascent App Store.
- Streaks sources: `https://streaksapp.com/`, Ascent homepage, Ascent App Store.
- “Using both”: Finch can remain the broad self-care companion while Ascent holds one priority goal; Streaks can log other established habits while Ascent develops the one habit that still needs scaffolding.
- Related links: Finch → Fabulous and Tiimo; Streaks → Routinery and one sec.

- [ ] **Step 4: Run tests and verify GREEN**

Run: `node --test tests/site.test.mjs`

Expected: all tests pass.

- [ ] **Step 5: Commit these comparison articles**

```bash
git add compare/ascent-vs-finch/index.html compare/ascent-vs-streaks/index.html tests/site.test.mjs
git commit -m "feat: compare Ascent with Finch and Streaks"
```

---

### Task 5: Publish the distraction-control comparisons

**Files:**
- Create: `compare/ascent-vs-one-sec/index.html`
- Create: `compare/ascent-vs-opal/index.html`
- Modify: `tests/site.test.mjs`

**Interfaces:**
- Completes the seven-page comparison set.

- [ ] **Step 1: Add two failing page-contract tests**

```js
test('one sec comparison satisfies the editorial contract', () => {
  assertHeadToHeadPage({
    slug: 'ascent-vs-one-sec',
    competitor: 'one sec',
    title: 'Ascent vs one sec (2026): Build Habits or Stop Scrolling?',
    h1: 'Ascent vs one sec: build the replacement or interrupt the reflex?',
    source: 'https://one-sec.app/',
    questions: [
      'Is Ascent or one sec better for stopping doomscrolling?',
      'Does one sec help build positive habits?',
      'Can Ascent and one sec be used together?'
    ]
  });
});

test('Opal comparison satisfies the editorial contract', () => {
  assertHeadToHeadPage({
    slug: 'ascent-vs-opal',
    competitor: 'Opal',
    title: 'Ascent vs Opal (2026): Habit Builder or App Blocker?',
    h1: 'Ascent vs Opal: build a habit or protect your focus?',
    source: 'https://opalapp.com/screentime',
    questions: [
      'Is Ascent or Opal the better app blocker?',
      'Does Opal help build positive habits?',
      'Can Ascent and Opal be used together?'
    ]
  });
});
```

- [ ] **Step 2: Run the suite and verify RED**

Run: `node --test tests/site.test.mjs`

Expected: two failures reporting missing HTML files.

- [ ] **Step 3: Create both complete documents with this exact content inventory**

| Page | Short answer and honest decision | Five dimensions | Choose competitor if | Choose Ascent if | Frank Ascent limitation |
|---|---|---|---|---|---|
| one sec | one sec is better when the central problem is the reflexive moment before a distracting app or website opens. Its customizable interruptions, app and site blocking, intention tracking, healthy alternatives, and cross-device tools specialize in that moment. Ascent is better when interruption should serve a larger positive goal: one 70-day plan, a visible daily action, a two-minute fallback, reflection, and optional Screen Time friction. one sec now reaches beyond a single breathing pause, so it would be inaccurate to call it only an interrupter. Ascent remains broader as a goal system and narrower as a blocking specialist. Choose one sec if the opening reflex is the clearest failure and you want intervention on phones and browsers. Choose Ascent if the larger unanswered question is what useful behavior should replace the scroll. A person can reasonably use both, but many users will only need the specialist. | attention interruption vs goal-centered behavior loop; choose target apps/interventions vs choose one meaningful goal; pause/intentional choice vs daily action/fallback; specialized interruptions/blocks/browser extension vs optional iPhone Screen Time friction; intention/emotion tracking vs goal reflection/evidence | opening reflex is the main failure; browser coverage matters; customizable interventions are the priority | positive replacement goal comes first; you want a 70-day progression; home-screen visibility and fallback matter | Ascent has fewer interruption types and no desktop browser extension |
| Opal | Opal is better when the main job is serious screen-time management: Focus Sessions, Deep Focus, recurring rules, time limits, analytics, Focus Score, rewards, and social focus features. Ascent is better when app blocking is one support inside a broader habit-building process centered on one goal, daily actions, a two-minute fallback, widgets, and reflection. Opal provides deeper controls and reporting. Ascent provides more guidance about what constructive behavior should replace the distraction. People who only want to reduce screen time should usually choose Opal. Choose Opal when strict or recurring focus rules and detailed screen-time feedback are the product you need. Choose Ascent when a constructive replacement behavior is the product and blocking is supporting infrastructure. Using both can make sense, but it also adds setup and two systems to maintain. | screen-time control vs one-goal habit building; configure rules/lists/sessions vs choose goal/generate plan; focus sessions vs daily replacement action; deeper multi-rule controls vs optional Screen Time friction; analytics/scores/rewards vs reflection and goal evidence | blocking depth is primary; analytics matter; recurring strict sessions are required | blocking should support a positive goal; one daily action should stay visible; low-motivation fallback matters | Ascent cannot match Opal's blocking depth, screen-time reporting, or multi-device focus specialization |

For both documents:

- Include metadata, GA, `/analytics.js`, Google fonts, JSON-LD, `../head-to-head.css`, navigation, breadcrumbs, hero, one 120–180 word Short answer paragraph, five dimension articles, choice guidance, the frank limitation, three FAQs, sources, related comparisons, CTA, and footer.
- Use a unique 150–165 character meta description, visible `Updated July 22, 2026`, and structured `dateModified` value `2026-07-22`.
- Render exactly five `data-dimension` articles and the exact headings `Choose [competitor] if…`, `Choose Ascent if…`, and `When Ascent is not the better choice`.
- Mirror all three visible FAQ question and answer strings in `FAQPage` JSON-LD.
- Include separate `Article`, shared Ascent `SoftwareApplication`, competitor `SoftwareApplication`, and `FAQPage` objects. Do not add ratings, reviews, or pricing.
- Use `https://one-sec.app/` as the one sec entity URL and `https://opalapp.com/` as the Opal entity URL.
- Use the canonical Ascent entity ID and App Store product URL from Global Constraints.
- Tag the App Store CTA with `utm_source=habitbuilding&utm_medium=site&utm_campaign=head_to_head&utm_content=[slug]` using the actual slug.

- one sec sources: `https://one-sec.app/`, Ascent homepage, Ascent App Store.
- Opal sources: `https://opalapp.com/screentime`, `https://opalapp.com/help/what-is-opal`, Ascent homepage, Ascent App Store.
- “Using both”: one sec can remain the specialized interruption layer while Ascent owns the positive goal; Opal can protect deep-focus periods while Ascent defines and adapts the habit action.
- Related links: one sec → Streaks and Opal; Opal → one sec and Tiimo.

- [ ] **Step 4: Run tests and verify GREEN**

Run: `node --test tests/site.test.mjs`

Expected: all tests pass.

- [ ] **Step 5: Commit the distraction-control articles**

```bash
git add compare/ascent-vs-one-sec/index.html compare/ascent-vs-opal/index.html tests/site.test.mjs
git commit -m "feat: compare Ascent with focus blockers"
```

---

### Task 6: Complete discovery, regression coverage, and App Store alignment

**Files:**
- Modify: `tests/site.test.mjs`
- Modify: `compare/index.html`
- Modify: `sitemap.xml`
- Create: `docs/app-store-metadata-2026-07.md`

**Interfaces:**
- Produces a root sitemap containing 14 unique public URLs.
- Produces a ready-to-paste App Store metadata proposal without claiming it was published.

- [ ] **Step 1: Add failing sitemap, link, JSON-LD, and stale-copy tests**

Append:

```js
test('sitemap discovers all comparison pages exactly once with current lastmod', () => {
  const xml = read('sitemap.xml');
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.equal(new Set(urls).size, urls.length);
  for (const slug of headToHeadSlugs) {
    const url = 'https://habitbuilding.xyz/compare/' + slug + '/';
    assert.equal(urls.filter((item) => item === url).length, 1, 'sitemap mismatch for ' + url);
    assert.ok(xml.includes('<loc>' + url + '</loc>\n    <lastmod>2026-07-22</lastmod>'));
  }
  for (const url of ['https://habitbuilding.xyz/', 'https://habitbuilding.xyz/compare/']) {
    assert.ok(xml.includes('<loc>' + url + '</loc>\n    <lastmod>2026-07-22</lastmod>'));
  }
});

test('comparison hub links all seven direct comparisons', () => {
  const html = read('compare/index.html');
  for (const slug of headToHeadSlugs) {
    assert.match(html, new RegExp('href="' + slug + '/"'), 'missing hub link for ' + slug);
  }
});

test('all public HTML uses current Ascent duration and App Store identity', () => {
  const pages = [
    'index.html',
    'compare/index.html',
    ...headToHeadSlugs.map((slug) => 'compare/' + slug + '/index.html'),
    'science/index.html',
    'blog/index.html',
    'blog/youre-not-unmotivated/index.html',
    'privacy.html',
    'terms.html'
  ];
  for (const page of pages) {
    const html = read(page);
    assert.doesNotMatch(html, /60[- ]day/i, page + ' contains stale duration');
    assert.doesNotMatch(html, /apps\.apple\.com\/us\/app\/ascent-habit-builder\/id6756843194/i, page + ' contains stale App Store slug');
    if (html.includes('application/ld+json')) parseJsonLd(html, page);
  }
});

test('all comparison local links resolve in both directions', () => {
  const pages = ['compare/index.html', ...headToHeadSlugs.map((slug) => 'compare/' + slug + '/index.html')];
  for (const page of pages) {
    const html = read(page);
    const base = dirname(join(root, page));
    for (const match of html.matchAll(/href="([^"]+)"/g)) {
      const href = match[1];
      if (/^(https?:|mailto:|#)/.test(href)) continue;
      const clean = href.split('#')[0].split('?')[0];
      const target = join(base, clean || '.');
      const resolved = existsSync(target) && statSync(target).isDirectory() ? join(target, 'index.html') : target;
      assert.ok(existsSync(resolved), page + ' has missing href ' + href);
    }
  }
});

test('App Store metadata proposal matches the website facts', () => {
  const copy = read('docs/app-store-metadata-2026-07.md');
  assert.match(copy, /Ascent: Habit Builder & Focus/);
  assert.match(copy, /Block apps\. Build habits\./);
  assert.match(copy, /70-day/i);
  assert.match(copy, /two-minute/i);
  assert.match(copy, /Screen Time.*optional/i);
  assert.match(copy, /https:\/\/habitbuilding\.xyz\//);
  assert.doesNotMatch(copy, /AI coach|60[- ]day|£|€/i);
});
```

- [ ] **Step 2: Run the suite and verify RED**

Run: `node --test tests/site.test.mjs`

Expected: failures for missing hub links, missing sitemap routes, stale hub/home `lastmod`, and the missing App Store metadata file.

- [ ] **Step 3: Link the completed articles from the hub**

Replace the seven plain benchmark names with these exact links while preserving each adjacent mechanism summary:

```html
<a href="ascent-vs-fabulous/">Ascent vs Fabulous</a>
<a href="ascent-vs-tiimo/">Ascent vs Tiimo</a>
<a href="ascent-vs-routinery/">Ascent vs Routinery</a>
<a href="ascent-vs-finch/">Ascent vs Finch</a>
<a href="ascent-vs-streaks/">Ascent vs Streaks</a>
<a href="ascent-vs-one-sec/">Ascent vs one sec</a>
<a href="ascent-vs-opal/">Ascent vs Opal</a>
```

- [ ] **Step 4: Update the sitemap**

Keep the seven current URLs. Change homepage and hub `lastmod` to `2026-07-22`. Insert each head-to-head URL once after `/compare/` using:

```xml
<url>
  <loc>https://habitbuilding.xyz/compare/ascent-vs-fabulous/</loc>
  <lastmod>2026-07-22</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

Repeat the full block with the other six approved slugs. Do not change unrelated `lastmod` dates.

- [ ] **Step 5: Create the ready-to-paste App Store metadata document**

Create `docs/app-store-metadata-2026-07.md` with:

```markdown
# Ascent App Store Metadata Proposal

**Prepared:** July 22, 2026

**Name:** Ascent: Habit Builder & Focus

**Subtitle:** Block apps. Build habits.

## Description

Most habit apps record what happened. Ascent helps shape what happens next.

Choose one meaningful goal and turn it into a focused 70-day plan. Each day has a concrete action, a smaller two-minute version for difficult days, and a short reflection so the plan can stay connected to real life.

Ascent keeps the next step where your attention already goes. Home Screen widgets make today's action visible before a distracting feed gets the first move.

When you want more support, optional Screen Time friction can add a pause before distracting apps, protect a waking window, or create scheduled hard-block periods. Screen Time access is optional.

Ascent includes:

- One focused goal and a 70-day daily plan
- Home Screen widgets for the goal, today's action, and motivation battery
- A two-minute fallback when the full action does not fit
- Daily reflection and visible progress
- Optional Screen Time app-blocking friction
- A calm, no-shame approach to missed or difficult days

Ascent is intentionally narrower than a full planner and more active than a traditional habit log. It is built for people who want a clear next action and a phone environment that supports it.

Free to start.

## URLs

- Developer website: https://habitbuilding.xyz/
- Habit-app comparison guide: https://habitbuilding.xyz/compare/
- App Store product: https://apps.apple.com/us/app/ascent-habit-builder-focus/id6756843194

## Publishing note

This file is a prepared proposal. Publishing requires authenticated access to the app's App Store Connect record. Confirm Apple's current character limits in App Store Connect before submission.
```

- [ ] **Step 6: Run tests and verify GREEN**

Run: `node --test tests/site.test.mjs`

Expected: all tests pass with zero failures.

- [ ] **Step 7: Commit discovery and metadata**

```bash
git add compare/index.html sitemap.xml docs/app-store-metadata-2026-07.md tests/site.test.mjs
git commit -m "feat: complete comparison discovery metadata"
```

---

### Task 7: Verify locally, deploy, and verify production

**Files:**
- Verify: `index.html`
- Verify: `compare/index.html`
- Verify: all seven head-to-head `index.html` files
- Verify: `compare/head-to-head.css`
- Verify: `sitemap.xml`
- Verify: `robots.txt`
- Verify: `docs/app-store-metadata-2026-07.md`

**Interfaces:**
- Produces a tested `master` branch pushed to GitHub, followed by Vercel's production deployment.
- Produces an explicit report of completed versus account-blocked Search Console actions.

- [ ] **Step 1: Run the complete automated suite**

Run:

```powershell
node --test tests/site.test.mjs
git diff --check
git status --short
```

Expected: every test passes; `git diff --check` prints nothing; the worktree is clean after the planned commits.

- [ ] **Step 2: Start a local static server**

Run:

```powershell
python -m http.server 4173
```

Expected: `http://127.0.0.1:4173/` serves the repository.

- [ ] **Step 3: Perform automated browser verification**

Use the browser verification skill against these nine routes at `1440 × 1000` and `390 × 844`:

```text
/
/compare/
/compare/ascent-vs-fabulous/
/compare/ascent-vs-tiimo/
/compare/ascent-vs-routinery/
/compare/ascent-vs-finch/
/compare/ascent-vs-streaks/
/compare/ascent-vs-one-sec/
/compare/ascent-vs-opal/
```

Verify: correct title/H1; no horizontal overflow; visible focus; readable CTA contrast; five dimensions; choice guidance; frank limitation; three FAQs; sources; related links; no missing resources; no console errors.

If a defect appears, add a failing regression to `tests/site.test.mjs` before changing production markup, then rerun the full suite.

- [ ] **Step 4: Validate structured data and links locally**

Run:

```powershell
node --test tests/site.test.mjs
```

Expected: JSON-LD parsing and local-link tests pass for every target route.

- [ ] **Step 5: Push the approved commits**

Run:

```bash
git push origin master
```

Expected: GitHub accepts `master` and Vercel begins the configured production deployment.

- [ ] **Step 6: Wait for and verify production**

For `https://habitbuilding.xyz/`, `/compare/`, all seven comparison routes, `/robots.txt`, and `/sitemap.xml`:

- confirm HTTP 200;
- confirm the deployed H1 or expected file content;
- confirm canonical App Store ID `6756843194`;
- fetch once with a normal user agent and once with `OAI-SearchBot/1.0`;
- confirm no `404: NOT_FOUND` response.

Do not call the deployment complete until the live commit matches local `HEAD` and every target route passes.

- [ ] **Step 7: Submit available Google indexing signals**

Open the already-authenticated Google Search Console property for `https://habitbuilding.xyz/` if it exists.

1. Submit `https://habitbuilding.xyz/sitemap.xml` in the Sitemaps report.
2. Request indexing for `/`, `/compare/`, and each of the seven head-to-head URLs through URL Inspection.
3. Record which requests were accepted.

If there is no authenticated, verified property, stop at the account boundary and report the exact nine URLs and sitemap URL the owner must submit. Do not create ownership records, alter DNS, or claim submission occurred.

- [ ] **Step 8: Report deployment and measurement expectations**

Report the production commit, live URLs, automated-test count, crawler results, sitemap result, Search Console result, and the prepared App Store metadata file. State clearly that indexing and ChatGPT citations are not guaranteed and that the first meaningful performance review is 28 days after indexing.
