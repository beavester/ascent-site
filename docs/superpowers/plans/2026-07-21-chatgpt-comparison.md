# ChatGPT-Discoverable Ascent Comparison Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a fair, crawlable Ascent competitor guide, tighten the homepage, correct science overstatements, and measure ChatGPT referral visits without collecting private queries.

**Architecture:** Keep the repository as a dependency-free static site. Add one static comparison page, one small shared analytics script, and one Node built-in test file that treats the HTML, sitemap, and robots file as the public interface. Production edits remain localized to the existing static pages.

**Tech Stack:** HTML5, CSS, browser JavaScript, JSON-LD, XML sitemap, robots.txt, Node.js `node:test` and `node:assert`.

## Global Constraints

- Preserve the existing Fraunces/Instrument Sans editorial visual identity.
- Keep all meaningful comparison and blog content in static HTML.
- Compare 18 competitors fairly; product limitations are fit trade-offs, not unsubstantiated defects.
- Use 70 days consistently.
- Do not promise ChatGPT placement or collect/infer private ChatGPT prompts.
- Do not add a framework, package manager, CMS, database, or OpenAI API.
- Avoid competitor logos, ratings, winner badges, hover-lift effects, pills for content, and horizontal mobile scrolling.
- Use official first-party product pages as the competitor feature sources.

## File map

- Create `compare/index.html`: complete editorial comparison, metadata, structured data, FAQ, and CTA.
- Create `analytics.js`: privacy-preserving ChatGPT referral event shared by landing pages.
- Create `tests/site.test.mjs`: dependency-free content, crawlability, and regression tests.
- Modify `index.html`: contrast, hero rendering, trust copy, 70-day consistency, comparison preview, navigation, and analytics.
- Modify `science/index.html`: cautious evidence language, 70-day consistency, navigation, and analytics.
- Modify `blog/index.html`: static post listing, correct local footer links, navigation, and analytics.
- Modify `robots.txt`: explicit OAI-SearchBot access.
- Modify `sitemap.xml`: add comparison page, remove duplicate/dead entries, update review dates.

## Verified comparison copy inventory

Use these exact editorial judgments, linked to the named first-party source:

| App | Official source | What it does best | Main trade-off |
| --- | --- | --- | --- |
| Streaks | `https://streaksapp.com/` | A clean Apple-native tracker with flexible schedules, widgets, Apple Watch and Health integration, and up to 24 tasks. | Its core loop is still record the action and protect the streak; it does not plan a larger goal or interrupt competing apps. |
| Habitify | `https://habitify.me/` | Detailed habit organization, reminders, cross-platform sync, integrations, and progress views. | The system is strongest as a dashboard; the user still defines and initiates the behavior. |
| Productive | `https://productiveapp.io/` | Polished routines, habit schedules, guided programs, challenges, reflection check-ins, and motivation prompts. | Its breadth can feel like another daily checklist, and it does not intervene when a distracting app opens. |
| Way of Life | `https://wayoflifeapp.com/` | Very fast positive-and-negative logging, notes, reminders, and long-range trend charts. | The deliberate simplicity is useful for recording patterns, not for designing a guided goal or changing the surrounding environment. |
| Tangerine | `https://tangerine.app/` | Habits, mood tracking, journaling, and self-care reflection in one calm experience. | It is strongest at awareness and reflection; execution guidance and distraction control are not its center of gravity. |
| Fabulous | `https://www.thefabulous.co/` | Guided Journeys, progressive routines, motivational coaching, challenges, and a deep content library. | The content-rich approach can feel prescriptive, and it does not control the distracting apps competing with the routine. |
| Routinery | `https://www.routinery.app/` | Walking users through known routines step by step with timers, voice prompts, schedules, and completion analytics. | It excels once a routine is defined; it is less focused on turning one meaningful long-term goal into a curriculum. |
| Structured | `https://structured.app/` | Putting tasks, routines, and calendar events onto one clear visual timeline. | It is primarily a planner. Habit formation remains downstream of scheduling and follow-through. |
| Tiimo | `https://www.tiimoapp.com/` | Neuroinclusive visual planning, AI task breakdown, time estimates, widgets, and flexible daily scheduling. | Its center of gravity is organizing today, not coordinating one 70-day goal with app-blocking friction. |
| Coach.me | `https://coach.me/` | Free habit tracking, community accountability, step-by-step plans, and access to human coaches. | Human coaching is the distinctive layer; without it, the product loop remains tracker-centered. |
| Finch | `https://finchcare.com/` | Making small self-care actions emotionally meaningful through a virtual pet, goals, reflection, and wellbeing activities. | Its broad self-care world can become a destination of its own, while long-term goal planning and app blocking are outside its main focus. |
| Habitica | `https://habitica.com/static/home` | Turning habits, dailies, and to-dos into a social retro RPG with avatars, equipment, parties, and quests. | The dense game layer and extrinsic rewards are the point; people who want a quiet behavior system may find them distracting. |
| (Not Boring) Habits | `https://notbor.ing/habits` | Exceptional interaction design and a focused 60-day journey for building or breaking an individual habit. | It focuses on the habit itself, with less long-range goal planning or environmental intervention. |
| TaskHero | `https://taskhero.app/` | Combining habit tracking, to-dos, timers, and character progression in a modern RPG. | For some users the game is the motivation; for others it may compete with the behavior underneath it. |
| one sec | `https://one-sec.app/` | Customizable interventions and delays at the exact moment a distracting app or website opens. | It is an excellent interruption layer, not a complete goal-planning and positive-habit system. |
| ScreenZen | `https://apps.apple.com/us/app/screenzen-screen-time-control/id1541027222` | Delaying openings, limiting sessions and opens, interrupting scrolling, and enforcing strict blocks in a donation-supported product. | It is intentionally utilitarian and offers little guidance for choosing and building a replacement behavior. |
| Opal | `https://opalapp.com/screentime` | Strong blocking, focus sessions, usage analytics, progress rewards, and community features. | It primarily sells focus and screen-time reduction rather than a broader goal curriculum. |
| Jomo | `https://jomo.so/features` | Flexible iPhone and Mac rules for sessions, limits, locks, unlock friction, websites, and cross-device focus. | It is a powerful control surface; users still define the positive replacement behavior themselves. |

---

### Task 1: Homepage accessibility, hero, trust, and 70-day consistency

**Files:**
- Create: `tests/site.test.mjs`
- Modify: `index.html:71-164, 330-440`

**Interfaces:**
- Consumes: current static `index.html`.
- Produces: a homepage whose primary content is immediately visible and whose navigation CTA has explicit high-contrast text.

- [ ] **Step 1: Write the failing homepage tests**

Create `tests/site.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(join(root, path), 'utf8');

test('homepage uses one 70-day promise', () => {
  const html = read('index.html');
  assert.doesNotMatch(html, /60[- ]day/i);
  assert.match(html, /70[- ]day/i);
});

test('navigation CTA has an explicit accessible foreground', () => {
  const html = read('index.html');
  assert.match(html, /\.nav-links \.btn\.primary\s*\{[^}]*color:var\(--paper\)/s);
});

test('above-the-fold hero is not hidden by reveal animation', () => {
  const html = read('index.html');
  const hero = html.match(/<section class="hero">[\s\S]*?<\/section>/)?.[0] ?? '';
  assert.doesNotMatch(hero, /class="[^"]*\breveal\b/);
});

test('homepage states the verified trust boundaries', () => {
  const html = read('index.html');
  assert.match(html, /Free tier/i);
  assert.match(html, /Screen Time inputs are optional/i);
  assert.match(html, /do not sell personal data/i);
});
```

- [ ] **Step 2: Run the homepage tests and verify RED**

Run: `node --test tests/site.test.mjs`

Expected: four failures for the current 60-day copy, missing CTA foreground override, hero `.reveal` classes, and missing trust text.

- [ ] **Step 3: Implement the minimal homepage corrections**

In `index.html`:

```css
.nav-links .btn.primary{color:var(--paper)}
.hero-trust{
  display:flex;flex-wrap:wrap;gap:8px 18px;margin-top:18px;
  color:var(--ink-faint);font-size:.82rem;
}
.hero-trust a{text-underline-offset:3px}
.reveal{opacity:0;transform:translateY(18px);transition:opacity .45s ease,transform .45s cubic-bezier(.2,.8,.2,1)}
.reveal.d1{transition-delay:.05s}.reveal.d2{transition-delay:.1s}.reveal.d3{transition-delay:.15s}
@media(max-width:900px){
  .hero-grid{gap:32px}
  .hero{padding-top:40px}
}
```

Remove `reveal`, `d1`, `d2`, and `d3` classes from every element inside `<section class="hero">`, including `.hero-visual` and `.stats`. Change the step-two heading to `AI turns it into a 70-day plan`.

Replace the hero fine print with:

```html
<p class="fineprint">Free to start · No credit card · Setup in under 2 minutes</p>
<div class="hero-trust" aria-label="Product and privacy notes">
  <span>Free tier available</span>
  <span>Screen Time inputs are optional</span>
  <a href="privacy.html">We do not sell personal data</a>
</div>
```

- [ ] **Step 4: Run the homepage tests and verify GREEN**

Run: `node --test tests/site.test.mjs`

Expected: `4` tests pass, `0` fail.

- [ ] **Step 5: Commit the homepage corrections**

```bash
git add index.html tests/site.test.mjs
git commit -m "fix: tighten homepage trust and accessibility"
```

---

### Task 2: Static comparison guide and homepage preview

**Files:**
- Create: `compare/index.html`
- Modify: `index.html:284-302, 535-561`
- Modify: `tests/site.test.mjs`

**Interfaces:**
- Consumes: the verified comparison copy inventory in this plan and the existing site tokens from `index.html`.
- Produces: `/compare/`, fragment IDs `traditional-trackers`, `guided-action`, `gamified`, `attention-interrupters`, `closest-competitors`, and `ascent-system`; homepage link `href="compare/"`.

- [ ] **Step 1: Append failing comparison tests**

Append to `tests/site.test.mjs`:

```js
const competitors = [
  'Streaks', 'Habitify', 'Productive', 'Way of Life', 'Tangerine',
  'Fabulous', 'Routinery', 'Structured', 'Tiimo', 'Coach.me',
  'Finch', 'Habitica', '(Not Boring) Habits', 'TaskHero',
  'one sec', 'ScreenZen', 'Opal', 'Jomo'
];

test('comparison page contains every named competitor and category', () => {
  assert.ok(existsSync(join(root, 'compare/index.html')), 'comparison page is missing');
  const html = read('compare/index.html');
  for (const name of competitors) assert.ok(html.includes(name), `missing ${name}`);
  for (const id of ['traditional-trackers', 'guided-action', 'gamified', 'attention-interrupters']) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
});

test('comparison page is a dated, canonical, structured article', () => {
  const html = read('compare/index.html');
  assert.match(html, /<link rel="canonical" href="https:\/\/habitbuilding\.xyz\/compare\/">/);
  assert.match(html, /Last reviewed July 2026/);
  assert.match(html, /"@type"\s*:\s*"Article"/);
  assert.match(html, /"@type"\s*:\s*"ItemList"/);
  assert.match(html, /"@type"\s*:\s*"SoftwareApplication"/);
});

test('comparison page names the closest seven and the full Ascent loop', () => {
  const html = read('compare/index.html');
  for (const name of ['Fabulous', 'Tiimo', 'Routinery', 'Finch', 'Streaks', 'one sec', 'Opal']) {
    assert.ok(html.includes(name), `missing close benchmark ${name}`);
  }
  for (const step of ['Choose a meaningful goal', 'Generate daily actions', 'Shrink the action', 'Keep it visible', 'Interrupt competing behavior', 'Reflect and adapt']) {
    assert.ok(html.includes(step), `missing chain step ${step}`);
  }
});

test('homepage links to an honest comparison preview', () => {
  const html = read('index.html');
  assert.match(html, /href="compare\/"/);
  assert.match(html, /six apps wearing the same trench coat/i);
});
```

- [ ] **Step 2: Run the comparison tests and verify RED**

Run: `node --test tests/site.test.mjs`

Expected: comparison tests fail because `compare/index.html` does not exist and the homepage has no `/compare/` link.

- [ ] **Step 3: Create the comparison page**

Create `compare/index.html` as a complete HTML document. Copy the color tokens, fonts, focus style, header, footer, button style, and GA tag from `index.html`. Start `<main>` with the following hero and category navigation:

```html
<main>
  <section class="guide-hero">
    <div class="wrap reading">
      <span class="kicker">An honest field guide</span>
      <h1>Ascent vs the habit-app landscape</h1>
      <p class="lede">Habit apps solve different parts of the same problem. This guide maps what each one does best, where its focus ends, and when Ascent is—or is not—the useful choice.</p>
      <p class="review-date"><time datetime="2026-07-21">Last reviewed July 2026</time> · Compared against current first-party product information.</p>
    </div>
  </section>
  <nav class="contents" aria-label="Comparison categories">
    <a href="#traditional-trackers">Traditional trackers</a>
    <a href="#guided-action">Guided action</a>
    <a href="#gamified">Gamified</a>
    <a href="#attention-interrupters">Attention interrupters</a>
    <a href="#closest-competitors">Closest competitors</a>
    <a href="#ascent-system">The Ascent system</a>
  </nav>
</main>
```

After the navigation and before `</main>`, add sections in this exact order: `traditional-trackers`, `guided-action`, `gamified`, `attention-interrupters`, `closest-competitors`, `ascent-system`, and `comparison-faq`. Each category section contains its category introduction followed by the inventory entries assigned to that category. The last three sections contain the benchmark analysis, six-step chain, and four-question FAQ defined below.

For each of the 18 rows in the copy inventory, render a static entry with the inventory's exact source, strength, and trade-off text. The canonical structure, shown with the complete Streaks entry, is:

```html
<article class="app-entry">
  <h3><a href="https://streaksapp.com/">Streaks <span aria-hidden="true">↗</span></a></h3>
  <div><span class="entry-label">What it does best</span><p>A clean Apple-native tracker with flexible schedules, widgets, Apple Watch and Health integration, and up to 24 tasks.</p></div>
  <div><span class="entry-label">Main trade-off</span><p>Its core loop is still record the action and protect the streak; it does not plan a larger goal or interrupt competing apps.</p></div>
</article>
```

Use four category introductions:

```html
<p>Traditional trackers are excellent records: they show whether the behavior happened and make consistency visible.</p>
<p>Guided-action apps do more than record behavior. They help structure or escort users through what comes next.</p>
<p>Gamified apps attach behavior to a character, world, social system, or reward loop so small actions feel consequential.</p>
<p>Attention interrupters operate at the moment of failure, where a conventional tracker is usually no longer present.</p>
```

Use this honest conclusion verbatim:

```html
<p>No single competitor is the whole competitive picture. The practical alternative to Ascent is often a stack: Fabulous or Tiimo for guidance, Streaks or Habitify for tracking, one sec or Opal for friction, Finch for emotional attachment, and Structured for daily visibility.</p>
<p>Ascent is trying to coordinate those mechanisms around one goal. That is useful only if the product feels like one behavior engine—not six apps wearing the same trench coat. If you already know that you need one specialist tool, the specialist may be the better choice.</p>
```

Render the chain as an ordered list with the six exact tested labels. Add four FAQ questions: `Is Ascent a traditional habit tracker?`, `Does Ascent replace a daily planner?`, `How is Ascent different from an app blocker?`, and `Who should choose a specialist app instead?` Answer each in two or three factual sentences.

Add JSON-LD with separate `Article`, `ItemList`, and `SoftwareApplication` objects. The `ItemList` must contain all 18 names and official URLs in the same order as the copy inventory. Do not add aggregate ratings.

CSS requirements:

```css
.reading{max-width:760px}
.guide-hero{padding:92px 0 64px;border-bottom:1px solid var(--line)}
.guide-hero h1{font-family:var(--display);font-size:clamp(2.7rem,6vw,4.8rem);line-height:1.02;letter-spacing:-.035em}
.lede{font-size:1.2rem;color:var(--ink-soft);margin-top:24px}
.review-date{font-size:.88rem;color:var(--ink-faint);margin-top:20px}
.category{padding:92px 0;border-bottom:1px solid var(--line)}
.category-head{display:grid;grid-template-columns:80px 1fr;gap:28px;margin-bottom:42px}
.category-num{font-family:var(--display);font-size:3rem;color:var(--pine)}
.app-entry{display:grid;grid-template-columns:minmax(180px,.7fr) 1fr 1fr;gap:28px;padding:28px 0;border-top:1px solid var(--line)}
.app-entry h3{font-family:var(--display);font-size:1.25rem}
.entry-label{display:block;color:var(--ink-faint);font-size:.74rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;margin-bottom:7px}
.app-entry p{color:var(--ink-soft)}
.system-chain{list-style:none;display:grid;grid-template-columns:repeat(3,1fr);border:1px solid var(--line);background:var(--card)}
.system-chain li{padding:24px;border:1px solid var(--line)}
@media(max-width:760px){
  .app-entry{grid-template-columns:1fr;gap:14px}
  .category-head{grid-template-columns:1fr;gap:8px}
  .system-chain{grid-template-columns:1fr}
}
```

- [ ] **Step 4: Replace the homepage comparison with a preview**

Replace the existing `.cmp-grid` section with a five-item editorial preview for `Guidance`, `Tracking`, `Friction`, `Emotional attachment`, and `Daily visibility`. Include the two-paragraph honest conclusion above in shortened form and this CTA:

```html
<a class="text-link" href="compare/">Read the honest comparison of 18 habit and focus apps <span aria-hidden="true">→</span></a>
```

Add `Compare` to the homepage navigation between `Science` and `Blog`.

- [ ] **Step 5: Run tests and verify GREEN**

Run: `node --test tests/site.test.mjs`

Expected: all homepage and comparison tests pass.

- [ ] **Step 6: Commit the comparison guide**

```bash
git add compare/index.html index.html tests/site.test.mjs
git commit -m "feat: add honest habit app comparison guide"
```

---

### Task 3: ChatGPT crawling, referral analytics, sitemap, and static blog index

**Files:**
- Create: `analytics.js`
- Modify: `robots.txt`
- Modify: `sitemap.xml`
- Modify: `index.html`
- Modify: `compare/index.html`
- Modify: `science/index.html`
- Modify: `blog/index.html`
- Modify: `tests/site.test.mjs`

**Interfaces:**
- Produces: GA4 event `chatgpt_referral` with fields `landing_path` and `traffic_source`; explicit crawler rule; discoverable static blog link.

- [ ] **Step 1: Append failing discoverability tests**

```js
test('OAI-SearchBot is explicitly allowed', () => {
  const robots = read('robots.txt');
  assert.match(robots, /User-agent: OAI-SearchBot\s+Allow: \//);
});

test('sitemap contains each live page once', () => {
  const xml = read('sitemap.xml');
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.equal(new Set(urls).size, urls.length);
  assert.ok(urls.includes('https://habitbuilding.xyz/compare/'));
  assert.ok(!urls.includes('https://habitbuilding.xyz/blog/scrolling-is-the-new-smoking/'));
});

test('blog post is present in static markup', () => {
  const html = read('blog/index.html');
  assert.match(html, /<div class="post-list"[\s\S]*href="youre-not-unmotivated\/"/);
  assert.match(html, /<h2>You.re Not Unmotivated\. You.re Desensitized\.<\/h2>/);
});

test('ChatGPT referral analytics records source and path only', () => {
  const js = read('analytics.js');
  assert.match(js, /chatgpt_referral/);
  assert.match(js, /landing_path/);
  assert.match(js, /traffic_source/);
  assert.doesNotMatch(js, /search_term|prompt_text|query_text/);
});
```

- [ ] **Step 2: Run tests and verify RED**

Run: `node --test tests/site.test.mjs`

Expected: failures for missing explicit bot rule, duplicate/dead sitemap entries, JS-only blog listing, and missing analytics file.

- [ ] **Step 3: Implement referral analytics**

Create `analytics.js`:

```js
(() => {
  const params = new URLSearchParams(window.location.search);
  let referredByChatGPT = params.get('utm_source') === 'chatgpt.com';

  if (!referredByChatGPT && document.referrer) {
    try {
      referredByChatGPT = new URL(document.referrer).hostname === 'chatgpt.com';
    } catch {
      referredByChatGPT = false;
    }
  }

  if (referredByChatGPT && typeof window.gtag === 'function') {
    window.gtag('event', 'chatgpt_referral', {
      landing_path: window.location.pathname,
      traffic_source: 'chatgpt.com'
    });
  }
})();
```

Add `<script defer src="/analytics.js"></script>` after the inline GA configuration in `index.html`, `compare/index.html`, `science/index.html`, and `blog/index.html`.

- [ ] **Step 4: Make crawler surfaces exact**

Replace `robots.txt` with:

```text
User-agent: OAI-SearchBot
Allow: /

User-agent: *
Allow: /

Sitemap: https://habitbuilding.xyz/sitemap.xml
```

Replace the sitemap URL list with exactly:

```text
https://habitbuilding.xyz/
https://habitbuilding.xyz/compare/
https://habitbuilding.xyz/science/
https://habitbuilding.xyz/blog/
https://habitbuilding.xyz/blog/youre-not-unmotivated/
https://habitbuilding.xyz/privacy.html
https://habitbuilding.xyz/terms.html
```

Use `2026-07-21` as `lastmod` for `/`, `/compare/`, `/science/`, `/blog/`, `/privacy.html`, and `/terms.html`; retain `2026-02-15` for the existing article. Use priorities `1.0`, `0.9`, `0.8`, `0.8`, `0.7`, `0.4`, and `0.4` in the same order.

- [ ] **Step 5: Make the blog index static**

Place this inside `<div class="post-list" id="posts">`:

```html
<a href="youre-not-unmotivated/" class="post-card">
  <div class="post-date"><time datetime="2026-02-15">February 15, 2026</time></div>
  <h2>You're Not Unmotivated. You're Desensitized.</h2>
  <p>Motivation isn't a resource you generate. It's a signal you've stopped being able to hear.</p>
</a>
```

Remove the post-array rendering script. Change blog footer Privacy and Terms links from `#` to `../privacy.html` and `../terms.html`. Add `Compare` to the blog, science, and homepage navigation.

- [ ] **Step 6: Run tests and verify GREEN**

Run: `node --test tests/site.test.mjs`

Expected: all tests pass.

- [ ] **Step 7: Commit discoverability changes**

```bash
git add analytics.js robots.txt sitemap.xml index.html compare/index.html science/index.html blog/index.html tests/site.test.mjs
git commit -m "feat: improve ChatGPT crawlability and referral tracking"
```

---

### Task 4: Science-language corrections

**Files:**
- Modify: `science/index.html:330-530`
- Modify: `tests/site.test.mjs`

**Interfaces:**
- Produces: a science page that distinguishes evidence from inference and does not frame Ascent as treatment.

- [ ] **Step 1: Append failing science tests**

```js
test('science page avoids overconfident medical language', () => {
  const html = read('science/index.html');
  for (const phrase of [
    'the receivers are shot',
    'This is molecular proof',
    'That flatness is the treatment working',
    'Most people report noticeable sensitivity improvement within 2-4 weeks',
    'Getting your receptors back'
  ]) {
    assert.ok(!html.includes(phrase), `overstatement remains: ${phrase}`);
  }
  assert.match(html, /does not establish the same mechanism for ordinary phone use/i);
  assert.match(html, /not, by itself, proof/i);
  assert.doesNotMatch(html, /60[- ]day/i);
  assert.match(html, /70 days/i);
});
```

- [ ] **Step 2: Run the science test and verify RED**

Run: `node --test tests/site.test.mjs`

Expected: science test fails on all five existing phrases and the 60-day footer.

- [ ] **Step 3: Replace the overstatements with exact cautious copy**

Use these replacements in `science/index.html`:

```html
<p>So lower-stimulation activities can begin to feel comparatively flat. Some research finds reduced D2 receptor availability in substance-use disorders, but that evidence does not establish the same mechanism for ordinary phone use. The useful product-design inference is narrower: repeated high-intensity rewards can make quieter alternatives harder to choose in the moment.</p>
```

```html
<p>These findings help explain why “just decide to stop” can be incomplete: as behavior becomes more cue-driven, conscious deliberation may play a smaller role. That is a mechanistic clue, not proof that any app can reprogram a habit. It suggests that changing cues and defaults is worth testing alongside deliberate choice.</p>
```

```html
<p>If ordinary activities feel flat after reducing stimulation, that experience can be uncomfortable. It is not, by itself, proof that receptors are “healing” or that a treatment is working.</p>
```

Change the heading `Getting your receptors back.` to `Giving quieter rewards room to register.` and replace the timeline paragraph with:

```html
<p>There is no reliable universal timeline for this adjustment, and studies of recovery after substance use or drug exposure should not be treated as a timetable for ordinary phone use. Sleep, stress, mental health, and the behavior being changed all matter. The practical point is simply that quieter activities may take time to feel rewarding again.</p>
```

Change the final line to `Free to start. One goal. 70 days.`

- [ ] **Step 4: Run tests and verify GREEN**

Run: `node --test tests/site.test.mjs`

Expected: all tests pass.

- [ ] **Step 5: Commit science corrections**

```bash
git add science/index.html tests/site.test.mjs
git commit -m "fix: qualify science claims"
```

---

### Task 5: Final static checks and browser verification

**Files:**
- Modify: `tests/site.test.mjs`
- Verify: `index.html`, `compare/index.html`, `science/index.html`, `blog/index.html`

**Interfaces:**
- Produces: verified local pages at `/`, `/compare/`, `/science/`, and `/blog/` with no missing local links or browser errors.

- [ ] **Step 1: Append the local-link regression test**

```js
test('key pages contain no missing local href targets', () => {
  for (const page of ['index.html', 'compare/index.html', 'science/index.html', 'blog/index.html']) {
    const html = read(page);
    const base = dirname(join(root, page));
    const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);
    for (const href of hrefs) {
      if (/^(https?:|mailto:|#)/.test(href)) continue;
      const clean = href.split('#')[0].split('?')[0];
      const target = join(base, clean || '.');
      const resolved = existsSync(target) && statSync(target).isDirectory() ? join(target, 'index.html') : target;
      assert.ok(existsSync(resolved), `${page} has missing href ${href}`);
    }
  }
});
```

No production-file change is expected in this task. If browser verification exposes a specific defect, first add a failing regression to `tests/site.test.mjs`, then change only the page that exhibits the defect and rerun the complete suite before continuing.

- [ ] **Step 2: Run the complete static suite**

Run: `node --test tests/site.test.mjs`

Expected: all tests pass with `0` failures.

- [ ] **Step 3: Start a local server**

Run from repository root:

```powershell
python -m http.server 4173
```

Expected: server listens at `http://127.0.0.1:4173/`.

- [ ] **Step 4: Verify desktop pages in a browser**

Inspect `/`, `/compare/`, `/science/`, and `/blog/` at a desktop viewport. Confirm:

- the navigation CTA is readable;
- hero text is visible immediately;
- the comparison guide has no artificial winner treatment;
- every competitor entry has one official link, one strength, and one trade-off;
- the chain and FAQ read naturally;
- no page produces console errors.

- [ ] **Step 5: Verify mobile pages in a browser**

Inspect the same four pages at `390 × 844`. Confirm:

- no horizontal overflow;
- product imagery begins near the first homepage screen;
- competitor entries collapse to one column;
- category navigation and CTA tap targets remain usable;
- headings do not clip beneath the sticky navigation.

- [ ] **Step 6: Run final repository checks**

Run:

```bash
node --test tests/site.test.mjs
git diff --check
git status --short
```

Expected: tests pass, `git diff --check` prints nothing, and status lists only intended modified files.

- [ ] **Step 7: Commit final verification adjustments**

```bash
git add index.html compare/index.html science/index.html blog/index.html tests/site.test.mjs
git commit -m "test: verify comparison pages and local links"
```

- [ ] **Step 8: Review branch history and diff**

Run:

```bash
git log --oneline master..HEAD
git diff --stat master...HEAD
```

Expected: the design commit plus focused homepage, comparison, discoverability, science, and verification commits; no unrelated files.
