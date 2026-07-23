# Ascent Homepage Conversion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the HabitBuilding.xyz homepage into a shorter, conversion-first Ascent product page while preserving the site's crawlable authority graph and evidence boundaries.

**Architecture:** Keep the homepage as one static, server-rendered `index.html` document with inline CSS and existing analytics. Rewrite the hero and product journey in place, remove redundant long-form homepage sections, and replace them with compact fit and research modules that retain the authority links required by the site tests.

**Tech Stack:** Static HTML5, inline CSS, vanilla JavaScript, Node.js test runner, Playwright visual check script

## Global Constraints

- The headline is “Build the habit before distraction wins.”
- The hero describes “one meaningful goal” and a “guided 70-day progression.”
- `screen-today.webp` must not appear in the hero.
- The homepage must explain that one goal may contain supporting habits while one next step remains prominent.
- “AI-generated” must not be a primary homepage benefit.
- The app index contains 19 apps including Ascent; comparison copy describes 18 specialist alternatives.
- Do not publish unverified testimonials, ratings, results, or scientific claims.
- Preserve server-rendered content, canonical URL, App Store identity, SoftwareApplication schema, crawler permissions, sitemap, and current privacy boundaries.
- Preserve opaque light surfaces, restrained blue accents, 44px interactive targets, and reduced-motion behavior.
- Do not modify or commit the unrelated concurrent changes in `.gitignore`, `package.json`, `scripts/build-site.mjs`, or `tests/build-output.test.mjs`.

---

### Task 1: Lock the homepage conversion contract

**Files:**
- Modify: `tests/site.test.mjs`
- Test: `tests/site.test.mjs`

**Interfaces:**
- Consumes: the static homepage at `index.html`
- Produces: regression tests for the hero, visual consistency, positioning, navigation, evidence boundaries, and app-count language

- [ ] **Step 1: Replace the old homepage intent assertion and add conversion-specific tests**

Replace the existing `homepage owns the iPhone habit-builder and app-blocker intent` test with:

```js
test('homepage leads with the conversion-first Ascent promise', () => {
  const html = read('index.html');
  assert.match(html, /<title>Ascent: iPhone Habit Builder &amp; App Blocker<\/title>/);
  assert.match(html, /<h1 class="display">Build the habit before distraction wins\.<\/h1>/);
  assert.match(html, /one meaningful goal into a guided 70-day progression/i);
  assert.match(html, /optional Screen Time/i);
  assert.match(html, />Download free</);
  assert.match(html, />See how it works</);
});
```

Add these tests next to it:

```js
test('homepage hero screenshots reinforce the product promise', () => {
  const html = read('index.html');
  const hero = html.match(/<section class="hero">[\s\S]*?<\/section>/)?.[0] ?? '';
  assert.match(hero, /screen-delay\.webp/);
  assert.match(hero, /screen-curriculum\.webp/);
  assert.match(hero, /screen-widgets\.webp/);
  assert.doesNotMatch(hero, /screen-today\.webp/);
});

test('homepage explains the one-goal and supporting-habits model', () => {
  const html = read('index.html');
  assert.match(html, /Ascent centers one meaningful goal/i);
  assert.match(html, /several supporting habits/i);
  assert.match(html, /one next step prominent/i);
  assert.doesNotMatch(html, /one goal, one curriculum, one daily action/i);
});

test('homepage presents the four connected mechanisms without AI-first copy', () => {
  const html = read('index.html');
  for (const phrase of [
    'Know what to do today',
    'See it before the feed',
    'Pause the distracting default',
    'Shrink the task instead of quitting'
  ]) {
    assert.ok(html.includes(phrase), 'homepage is missing mechanism: ' + phrase);
  }
  assert.doesNotMatch(html, /AI-generated daily plan|AI-generated curriculum/i);
});

test('homepage navigation prioritizes the product journey', () => {
  const html = read('index.html');
  const header = html.match(/<header id="hdr">[\s\S]*?<\/header>/)?.[0] ?? '';
  for (const label of ['How it works', 'Screens', 'Compare', 'Research', 'Get the App']) {
    assert.ok(header.includes(label), 'header is missing ' + label);
  }
  assert.doesNotMatch(header, />Blog</);
});

test('homepage states the app-index and alternative counts without drift', () => {
  const html = read('index.html');
  assert.match(html, /maintained 19-app index, including Ascent/i);
  assert.match(html, /18 specialist alternatives/i);
});
```

- [ ] **Step 2: Run the focused tests and verify they fail against the old homepage**

Run:

```powershell
node --test --test-name-pattern="homepage" tests/site.test.mjs
```

Expected: failures for the new headline, hero screenshots, supporting-habits explanation, four mechanisms, navigation labels, and explicit 19/18 count language.

- [ ] **Step 3: Commit the failing contract tests**

```powershell
git add tests/site.test.mjs
git commit -m "test: define conversion-first homepage contract"
```

---

### Task 2: Rewrite the metadata, navigation, hero, and core loop

**Files:**
- Modify: `index.html`
- Test: `tests/site.test.mjs`

**Interfaces:**
- Consumes: existing App Store URL, canonical URL, analytics query parameters, and image assets
- Produces: the conversion-first hero and the `#workflow` four-part mechanism used by navigation and downstream sections

- [ ] **Step 1: Update metadata and structured description**

Use:

```html
<meta name="description" content="Ascent turns one meaningful goal into a guided 70-day progression, keeps today's next step visible on iPhone, and can pause distracting apps.">
<meta property="og:description" content="Build one meaningful habit with a guided 70-day progression, visible next steps, smaller fallback actions, and optional Screen Time friction.">
```

Change the SoftwareApplication `description` to:

```json
"description": "An iPhone habit builder that combines a guided 70-day progression, visible next steps, two-minute fallback actions, reflection, and optional app-blocking friction."
```

- [ ] **Step 2: Replace the header navigation**

Use:

```html
<div class="nav-links">
  <a href="#workflow">How it works</a>
  <a href="#screens">Screens</a>
  <a href="compare/">Compare</a>
  <a href="#research">Research</a>
  <a class="btn primary" href="https://apps.apple.com/us/app/ascent-habit-builder-focus/id6756843194?utm_source=habitbuilding&utm_medium=site&utm_campaign=homepage&utm_content=nav">Get the App</a>
</div>
```

- [ ] **Step 3: Replace the hero copy and screenshots**

Use:

```html
<span class="kicker">iPhone habit builder + optional app blocker</span>
<h1 class="display">Build the habit before distraction wins.</h1>
<p class="hero-copy">Ascent turns one meaningful goal into a guided 70-day progression, keeps today's next step visible on your iPhone, scales it down when the day is hard, and can add optional Screen Time friction before distracting apps take over.</p>
<p class="hero-copy product-definition">Ascent is an iPhone attention-management system that interrupts automatic distraction and redirects the user toward a chosen action.</p>
```

Keep the existing canonical App Store URL and tracking parameters, but change the primary label to `Download free` and the secondary label to `See how it works`.

Use:

```html
<p class="fineprint">Free to start · No credit card · Set up in about two minutes</p>
```

Replace the hero collage with:

```html
<div class="hero-visual">
  <div class="phone p-left"><img src="img/screen-curriculum.webp" alt="Ascent 70-day progression screen" loading="eager"></div>
  <div class="phone p-main"><img src="img/screen-delay.webp" alt="Ascent delaying a distracting app from opening" loading="eager"></div>
  <div class="phone p-right"><img src="img/screen-widgets.webp" alt="Ascent widget screen" loading="eager"></div>
</div>
```

- [ ] **Step 4: Replace the stat-strip copy**

Use:

```html
<div class="stat-row">
  <div class="stat"><b>One goal</b><span>A guided 70-day progression</span></div>
  <div class="stat"><b>Today visible</b><span>Widgets before feeds</span></div>
  <div class="stat"><b>Optional friction</b><span>Pauses before distracting apps</span></div>
</div>
```

- [ ] **Step 5: Expand the workflow to four mechanisms**

Set `.loop` to four columns at desktop widths and retain the existing one-column mobile layout:

```css
.loop{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}
@media(max-width:980px){.loop{grid-template-columns:repeat(2,1fr)}}
@media(max-width:680px){.loop{grid-template-columns:1fr}}
```

Replace the workflow intro and cards with:

```html
<div class="sec-head center reveal">
  <span class="kicker" style="justify-content:center">The connected loop</span>
  <h2>The app is the setup. <em>The phone becomes the loop.</em></h2>
  <p>Ascent connects the plan, the cue, the distraction boundary, and the fallback so they support the same goal.</p>
</div>
<div class="loop">
  <div class="loop-card reveal">
    <span class="loop-time">Plan</span>
    <h3>Know what to do today</h3>
    <p>A guided 70-day progression turns the larger goal into a concrete next step.</p>
  </div>
  <div class="loop-card reveal d1">
    <span class="loop-time">Cue</span>
    <h3>See it before the feed</h3>
    <p>Widgets keep the goal and today's step on iPhone surfaces you already check.</p>
  </div>
  <div class="loop-card reveal d2">
    <span class="loop-time">Boundary</span>
    <h3>Pause the distracting default</h3>
    <p>Optional Screen Time friction slows selected apps before the reflex finishes.</p>
  </div>
  <div class="loop-card reveal d3">
    <span class="loop-time">Fallback</span>
    <h3>Shrink the task instead of quitting</h3>
    <p>A two-minute fallback preserves the direction of the habit when the full action does not fit.</p>
  </div>
</div>
```

- [ ] **Step 6: Run the focused tests**

Run:

```powershell
node --test --test-name-pattern="homepage" tests/site.test.mjs
```

Expected: hero, screenshot, mechanism, and navigation tests pass; supporting-habits and count-language tests may still fail until Task 3.

- [ ] **Step 7: Commit the hero and mechanism**

```powershell
git add index.html
git commit -m "feat: lead homepage with Ascent conversion journey"
```

---

### Task 3: Tighten the product proof, fit, and research sections

**Files:**
- Modify: `index.html`
- Test: `tests/site.test.mjs`

**Interfaces:**
- Consumes: `#workflow`, existing screenshot assets, authority routes, disclosure copy, and App Store URL
- Produces: concise `#screens`, product-fit, `#research`, and final CTA sections

- [ ] **Step 1: Remove redundant long-form homepage sections**

Delete the separate step-by-step section, neuroscience card section, full guide matrix, full app-category matrix, and full competitive-specialist matrix. Keep their canonical destination pages unchanged.

Keep the four product cards, but change:

```html
<h3>AI-generated curriculum</h3>
```

to:

```html
<h3>70-day guided progression</h3>
```

and use:

```html
<p>Turn a real goal into weekly milestones and concrete daily steps so the next action is not vague.</p>
```

Add this explanation directly after the feature grid:

```html
<p class="interface-note">Ascent centers one meaningful goal. That goal can include several supporting habits, but the app keeps one next step prominent so the day still has a clear focus.</p>
```

Style it with an opaque bordered surface:

```css
.interface-note{max-width:780px;margin:32px auto 0;padding:22px 24px;border:1px solid var(--line);border-radius:14px;background:var(--card);color:var(--ink-soft)}
```

- [ ] **Step 2: Limit the screenshot gallery to three decision-relevant screens**

Keep:

```html
<div class="shots-scroll reveal">
  <div class="shot-card"><img src="img/gallery/01-pause-before-x-opens.webp" alt="Pause before X opens — a short delay before the app" loading="lazy"></div>
  <div class="shot-card"><img src="img/gallery/02-next-step-already-chosen.webp" alt="The next step is already chosen — today's focus screen" loading="lazy"></div>
  <div class="shot-card"><img src="img/gallery/12-plan-on-home-screen.webp" alt="Your plan on the Home Screen" loading="lazy"></div>
</div>
```

Update `.shots-scroll` so the three cards fill the available row on desktop while retaining horizontal overflow on small screens.

- [ ] **Step 3: Add a candid fit section**

Add:

```html
<section class="fit-sec">
  <div class="wrap">
    <div class="sec-head reveal">
      <span class="kicker">Is Ascent the right fit?</span>
      <h2>Choose Ascent when the habit and the distraction are <em>part of the same problem.</em></h2>
    </div>
    <div class="fit-grid">
      <article class="reveal">
        <h3>Choose Ascent when</h3>
        <ul>
          <li>One meaningful goal needs a guided progression.</li>
          <li>The next action needs to remain visible.</li>
          <li>Low-capacity days need a smaller fallback.</li>
          <li>Phone distraction repeatedly displaces the intended behavior.</li>
        </ul>
      </article>
      <article class="reveal d1">
        <h3>Choose a specialist when</h3>
        <ul>
          <li>A simple tracker is enough for several established habits.</li>
          <li>A full-day planner is the main need.</li>
          <li>Strict blocking rules and screen-time analytics are the central job.</li>
        </ul>
        <a class="text-link" href="compare/">Compare Ascent with specialist apps <span aria-hidden="true">→</span></a>
      </article>
    </div>
  </div>
</section>
```

Add:

```css
.fit-sec{background:var(--paper-deep);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.fit-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}
.fit-grid article{padding:30px;border:1px solid var(--line);border-radius:var(--radius);background:var(--card)}
.fit-grid h3{font-family:var(--display);font-size:1.35rem;margin-bottom:14px}
.fit-grid ul{margin-left:1.2rem;color:var(--ink-soft)}
.fit-grid li+li{margin-top:9px}
@media(max-width:760px){.fit-grid{grid-template-columns:1fr}}
```

- [ ] **Step 4: Add the compact research library and preserve the topic graph**

Add:

```html
<section id="research">
  <div class="wrap">
    <div class="sec-head reveal">
      <span class="kicker">Research library</span>
      <h2>Inspect the system before you <em>choose it.</em></h2>
      <p>Browse the maintained 19-app index, including Ascent, or compare Ascent with 18 specialist alternatives.</p>
    </div>
    <div class="library-grid">
      <a href="guides/why-habit-trackers-fail/"><strong>Why habit trackers fail</strong><span>What a checkmark cannot design for you.</span></a>
      <a href="guides/two-minute-habit/"><strong>The two-minute fallback</strong><span>How to make difficult days recoverable.</span></a>
      <a href="habit-apps/"><strong>iOS habit app index</strong><span>19 sourced app records and documented limitations.</span></a>
      <a href="compare/"><strong>Compare specialist apps</strong><span>See when another product is the better choice.</span></a>
    </div>
    <div class="library-links" aria-label="More research">
      <a href="ascent/">Official Ascent guide</a>
      <a href="methodology/">Research methodology</a>
      <a href="guides/habit-tracker-vs-habit-builder/">Tracker vs habit builder</a>
      <a href="guides/how-to-stop-doomscrolling/">Stop doomscrolling</a>
      <a href="guides/how-to-build-a-habit-on-iphone/">Build a habit on iPhone</a>
      <a href="guides/habit-app-for-low-motivation/">Apps for low motivation</a>
      <a href="guides/do-streaks-build-habits/">Do streaks build habits?</a>
      <a href="guides/app-pauses-vs-app-blocking/">App pauses vs blocking</a>
      <a href="attention-management-iphone/">iPhone attention management</a>
      <a href="ascent/chatgpt-app/">Ascent ChatGPT app</a>
      <a href="best/app-blockers-iphone/">iPhone app blockers</a>
      <a href="best/habit-tracker-with-app-blocking/">Trackers with app blocking</a>
      <a href="best/habit-apps-executive-function/">Executive-function support</a>
      <a href="best/morning-routine-apps-iphone/">Morning routine apps</a>
      <a href="best/guided-routine-apps-iphone/">Guided routine apps</a>
      <a href="best/gamified-habit-apps/">Gamified habit apps</a>
    </div>
    <p class="publisher-note">HabitBuilding.xyz is published by the maker of Ascent. Comparisons use public product documentation and explain when another app is the better fit.</p>
  </div>
</section>
```

Add accessible grid and link styles with opaque cards, underlined hover feedback, 44px minimum targets, and one-column mobile behavior.

- [ ] **Step 5: Replace the final CTA copy**

Use:

```html
<h2>Give one goal a <em>clearer next step.</em></h2>
<p>Start free, put today's action where you can see it, and decide whether Ascent's connected loop fits better than another checklist.</p>
```

Keep the existing canonical App Store URL and `final-cta` analytics placement.

- [ ] **Step 6: Run all site tests**

Run:

```powershell
npm run test:site
```

Expected: all site tests pass. If the unrelated concurrent build-output work affects the broader `npm test` command, leave those files unchanged and report the result separately.

- [ ] **Step 7: Commit the tightened homepage**

```powershell
git add index.html tests/site.test.mjs
git commit -m "feat: tighten Ascent homepage conversion flow"
```

---

### Task 4: Verify build, accessibility contracts, and responsive rendering

**Files:**
- Modify only if verification exposes a homepage regression: `index.html`, `tests/site.test.mjs`
- Test: `tests/site.test.mjs`
- Use: `scripts/visual-check.py`

**Interfaces:**
- Consumes: completed homepage and existing verification scripts
- Produces: passing static checks and inspected desktop/mobile screenshots

- [ ] **Step 1: Run the type/build check**

Run:

```powershell
npm run build
```

Expected: TypeScript exits successfully with no diagnostics.

- [ ] **Step 2: Run the complete tracked test suite**

Run:

```powershell
npm test
```

Expected: all tracked tests pass. Preserve and report any failure originating only from the unrelated concurrent build-output work.

- [ ] **Step 3: Run the existing visual checker**

Run:

```powershell
python scripts/visual-check.py
```

Expected: the script completes, reports no overflow or accessibility assertion failures, and writes desktop/mobile screenshots to the temporary `ascent-chatgpt-visual` directory.

- [ ] **Step 4: Inspect homepage desktop and mobile screenshots**

Verify:

- The headline and primary action are immediately legible.
- The hero collage does not show the “0 of 4 habits” screen.
- The four mechanism cards form a balanced 4/2/1 responsive grid.
- The three screenshot cards remain readable without clipping.
- The fit and research modules use opaque light surfaces.
- The final CTA appears before a visitor has to traverse a long editorial directory.

- [ ] **Step 5: Check the final diff and working tree**

Run:

```powershell
git diff HEAD~3 --check
git status --short
git log -4 --oneline
```

Expected: no whitespace errors; the unrelated concurrent `.gitignore`, `package.json`, `scripts/build-site.mjs`, and `tests/build-output.test.mjs` changes remain uncommitted by this task; the design, test contract, and homepage commits are visible.

- [ ] **Step 6: Commit any verification-only correction**

Only if Step 4 required a correction:

```powershell
git add index.html tests/site.test.mjs
git commit -m "fix: polish responsive homepage conversion layout"
```
