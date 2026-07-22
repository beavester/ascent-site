# Habit Education Guides Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish five trustworthy, directly answerable habit guides that can serve people, search engines, and answer engines while routing relevant readers to the exact Ascent product page and App Store listing.

**Architecture:** Add five hand-authored static pages under `/guides/` using the shared editorial stylesheet. Each page opens with a concise answer, separates research evidence from editorial guidance, includes visible sources and ownership disclosure, mirrors three visible FAQs in JSON-LD, and joins the existing comparison and product pages through contextual internal links.

**Tech Stack:** Static HTML5, shared CSS, JSON-LD, vanilla analytics, Node.js `node:test`, local Playwright verification, GitHub, and Vercel.

## Global constraints

- Use the exact Ascent entity and product identity: `Ascent: Habit Builder & Focus`, `https://habitbuilding.xyz/#ascent-app`, and `https://apps.apple.com/us/app/ascent-habit-builder-focus/id6756843194`.
- Describe Ascent's 70 days as its program design, never as a universal habit-formation timeline.
- Describe the two-minute action as a practical fallback, never as a scientifically fixed threshold.
- Do not use medical claims, ratings, review schema, dopamine-addiction shorthand, fabricated testing, or universal best claims.
- Say that the research is document-based and that HabitBuilding.xyz is published by the maker of Ascent.
- Use current first-party sources for Apple and product features; use peer-reviewed sources for behavioral claims.
- Keep one H1, sequential headings, 44px targets, visible focus, reduced-motion support, and no horizontal overflow.
- Preserve the warm editorial design and no-shame voice. No neon, glass, gradients, hover lift, pills, badges, or shame-based streak language.
- Each page must be useful without JavaScript and must contain unique prose rather than query-swapped templates.

---

### Task 1: Define the guide contract

**Files:**
- Modify: `tests/site.test.mjs`

- [ ] Add `guideRoutes` with these exact routes and canonicals:
  - `guides/why-habit-trackers-fail/index.html` -> `https://habitbuilding.xyz/guides/why-habit-trackers-fail/`
  - `guides/habit-tracker-vs-habit-builder/index.html` -> `https://habitbuilding.xyz/guides/habit-tracker-vs-habit-builder/`
  - `guides/how-to-stop-doomscrolling/index.html` -> `https://habitbuilding.xyz/guides/how-to-stop-doomscrolling/`
  - `guides/two-minute-habit/index.html` -> `https://habitbuilding.xyz/guides/two-minute-habit/`
  - `guides/how-to-build-a-habit-on-iphone/index.html` -> `https://habitbuilding.xyz/guides/how-to-build-a-habit-on-iphone/`
- [ ] Add `assertGuidePage(spec)` to verify exact title, canonical, H1, one H1, update date, direct-answer section, methodology disclosure/link, three visible FAQs that exactly match `FAQPage`, `Article` and `BreadcrumbList` schema, expected sources, canonical Ascent App Store links, and absence of `Review`/`AggregateRating`.
- [ ] Add all five guides to public-page, App Store-link, stale-copy, local-link, and sitemap contracts.
- [ ] Add page-specific assertions for evidence caveats: no universal 21/66/70-day claim, no dopamine-addiction claim, two minutes is not a magic threshold, and Ascent ownership is visible.
- [ ] Run `node --test tests/site.test.mjs` and confirm RED because the pages do not exist.
- [ ] Commit the failing contract.

### Task 2: Publish the tracking and system-design guides

**Files:**
- Create: `guides/why-habit-trackers-fail/index.html`
- Create: `guides/habit-tracker-vs-habit-builder/index.html`

- [ ] Publish `Why Habit Trackers Fail (and What to Add) | HabitBuilding.xyz` with H1 `Why habit trackers fail even when you keep logging`.
- [ ] Answer directly: tracking supplies feedback, but may not supply a stable cue, specific action, environment, recovery rule, or adaptation. Explain that evidence for self-monitoring varies by behavior and study context.
- [ ] Source the habit/context claims to peer-reviewed reviews and context-stability research; source self-monitoring limits to meta-reviews.
- [ ] Publish `Habit Tracker vs Habit Builder: Which Do You Need?` with H1 `Habit tracker or habit builder? Choose by what is missing`.
- [ ] Explain that a tracker records behavior while a guided builder helps define, cue, shrink, and adapt it. Recommend a tracker when the behavior is already clear and a builder when the behavior or context is still being designed.
- [ ] Include honest Ascent fit and non-fit guidance, three FAQs, sources, related links, and App Store CTAs.
- [ ] Run focused and full tests; commit both pages.

### Task 3: Publish the interruption and fallback guides

**Files:**
- Create: `guides/how-to-stop-doomscrolling/index.html`
- Create: `guides/two-minute-habit/index.html`

- [ ] Publish `How to Stop Doomscrolling Without Relying on Willpower` with H1 `How to stop doomscrolling by changing the moment before it starts`.
- [ ] Give a five-part practical sequence: identify the trigger and destination app; add opening-time friction; prechoose a replacement; time-box necessary access; review and adjust.
- [ ] Cite the peer-reviewed one sec field experiment as evidence for opening-time friction while visibly noting author/company involvement and avoiding generalization beyond the study.
- [ ] Publish `The Two-Minute Habit: How to Make a Smaller Fallback` with H1 `Use a two-minute fallback when the full habit does not fit`.
- [ ] Explain that two minutes is a memorable design constraint, not a proven universal threshold. Show how to preserve the same cue and direction while reducing the action, and distinguish a fallback from lowering the long-term standard.
- [ ] Include honest Ascent fit and non-fit guidance, three FAQs, sources, related links, and App Store CTAs.
- [ ] Run focused and full tests; commit both pages.

### Task 4: Publish the iPhone implementation guide

**Files:**
- Create: `guides/how-to-build-a-habit-on-iphone/index.html`

- [ ] Publish `How to Build a Habit on iPhone Using Widgets and Screen Time` with H1 `Build an iPhone habit system around cues, not more notifications`.
- [ ] Give a practical setup: choose one observable action; attach it to an existing time/routine/place cue; put the next action in a widget; schedule Focus or Screen Time when appropriate; optionally use Shortcuts automation; record minimally and review weekly.
- [ ] Cite Apple documentation for widgets, scheduled Focus, Screen Time, and personal automation, and peer-reviewed habit research for stable-context repetition.
- [ ] Clearly distinguish notification silencing, Screen Time controls, and third-party blockers.
- [ ] Include three FAQs, sources, related links, honest Ascent limitations, and canonical App Store CTA.
- [ ] Run focused and full tests; commit the page.

### Task 5: Connect the authority graph and sitemap

**Files:**
- Modify: `index.html`
- Modify: `ascent/index.html`
- Modify: `science/index.html`
- Modify: `best/app-blockers-iphone/index.html`
- Modify: `best/habit-tracker-with-app-blocking/index.html`
- Modify: `compare/index.html`
- Modify: `sitemap.xml`
- Modify: `tests/site.test.mjs`

- [ ] Add a compact homepage `Habit guides` section linking all five pages with descriptive anchor text.
- [ ] Link the product, research, app-blocker, integrated-system, and comparison pages to the most relevant guides.
- [ ] Add all guide canonicals once to `sitemap.xml` with `lastmod` `2026-07-22`.
- [ ] Verify every local link resolves in both directions and the sitemap exactly equals the expected public URL set.
- [ ] Run `node --test tests/site.test.mjs`, `git diff --check`, and commit discovery changes.

### Task 6: Browser verification and release

- [ ] Serve the worktree locally and test all five guides at `1440 x 1000` and `390 x 844`.
- [ ] Verify title/H1, direct answer, disclosure, sources, three FAQs, CTA, 44px first focus target, no horizontal overflow, no missing resources, and no console errors.
- [ ] Visually inspect desktop and mobile screenshots for all five routes.
- [ ] Run the complete automated suite, `git diff --check`, and confirm the branch is clean.
- [ ] Review all changed public HTML for the exact Ascent name, canonical app URL, careful evidence language, and no stale duration copy.
- [ ] Merge the verified branch to `master`, rerun the suite on `master`, push `origin master`, and wait for Vercel production.
- [ ] Confirm production HTTP 200 and expected content for every new route, `/robots.txt`, `/sitemap.xml`, and the IndexNow key using normal and named crawler user agents.
- [ ] Submit the changed URLs to IndexNow after production is live.
- [ ] If Search Console ownership is still unavailable, report the single sitemap submission and priority URL-inspection list without claiming account-side actions occurred.

