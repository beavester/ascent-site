# OAI and Search Content Expansion Design

**Date:** 2026-07-22

**Status:** Proposed for implementation
**Site:** https://habitbuilding.xyz/

## Objective

Make Ascent a useful, quotable source when someone asks ChatGPT or a search engine to compare iPhone habit apps, while keeping every comparison sincere and making the correct Ascent product and App Store destination unambiguous.

The work will improve query matching, not promise rankings. OpenAI publishes crawlability and accessibility guidance, but no keyword-ranking formula. Search performance must ultimately be judged from indexed pages, Search Console query data, and `utm_source=chatgpt.com` referrals.

## Context and constraints

- The site is static HTML deployed from the GitHub `master` branch to Vercel.
- `/compare/` is the canonical category hub and already compares 18 products using first-party sources.
- The exact Ascent product entity is `https://habitbuilding.xyz/#ascent-app` and Apple App Store ID `6756843194`.
- Every Ascent install link must use `https://apps.apple.com/us/app/ascent-habit-builder-focus/id6756843194`.
- Comparisons must name a competitor's genuine strength, Ascent's genuine limitation, and the situation in which the competitor is the better choice.
- No invented ratings, prices, performance claims, medical claims, or claims that one product works for everyone.
- No programmatic keyword swapping, doorway pages, hidden keyword blocks, `meta keywords`, or `llms.txt` dependency.
- The visual language remains the current warm, editorial Ascent system. No new card-heavy or promotional design language is introduced.

The OpenAI-specific requirements are based on the official publisher guidance at `https://help.openai.com/en/articles/12627856-publishers-and-developers-faq`: keep public pages crawlable by `OAI-SearchBot`, make content accessible, and measure referrals carrying `utm_source=chatgpt.com`. OpenAI does not publish a special keyword list or promise inclusion. Standard discovery work follows Google Search Central's sitemap and Search Console documentation rather than inventing an AI-only indexing mechanism.

## Approaches considered

### A. Focused hub plus seven hand-written comparisons — selected

Keep `/compare/` as the authoritative landscape page, strengthen its query language, and add seven distinct head-to-head pages for Fabulous, Tiimo, Routinery, Finch, Streaks, one sec, and Opal.

**Advantages:** Covers the highest-intent questions, creates clear citation targets, allows nuanced recommendations, and preserves a coherent information architecture.

**Trade-off:** Requires real editorial maintenance when competitor products change.

### B. One comparison hub only

Improve the existing `/compare/` title, H1, answer block, and FAQ without creating additional pages.

**Advantages:** Lowest maintenance burden and no risk of overlapping pages.

**Trade-off:** Weak match for direct queries such as “Ascent vs Streaks” and too little room for a fair decision framework.

### C. Large programmatic comparison library

Generate a page for every competitor and keyword combination from shared data.

**Advantages:** Broad theoretical query coverage.

**Trade-off:** High risk of thin, repetitive pages, feature drift, keyword cannibalization, and insincere comparison copy. This approach is explicitly rejected.

## Information architecture and keyword ownership

Each page owns one primary user question. Secondary phrases may appear naturally, but pages must not compete for the same main query.

| Route | Primary intent | Page promise |
|---|---|---|
| `/` | iPhone habit builder and app blocker | Explain the Ascent product and link to the exact app |
| `/compare/` | best habit tracker apps for iPhone | Compare the full iPhone habit-app landscape honestly |
| `/compare/ascent-vs-fabulous/` | Ascent vs Fabulous | Progressive coaching versus a focused goal-and-friction system |
| `/compare/ascent-vs-tiimo/` | Ascent vs Tiimo | Daily executive-function planning versus one 70-day habit goal |
| `/compare/ascent-vs-routinery/` | Ascent vs Routinery | Timed routine execution versus long-term goal development |
| `/compare/ascent-vs-finch/` | Ascent vs Finch | Self-care companionship versus a goal-centered behavior loop |
| `/compare/ascent-vs-streaks/` | Ascent vs Streaks | Apple-native habit tracking versus planning plus distraction friction |
| `/compare/ascent-vs-one-sec/` | Ascent vs one sec | Precise distraction interruption versus a broader replacement-habit system |
| `/compare/ascent-vs-opal/` | Ascent vs Opal | Deep focus and screen-time control versus habit building around one goal |

Natural secondary phrases include “iPhone habit tracker,” “habit tracker with app blocker,” “app blocker and habit tracker,” “habit builder app for iPhone,” “Screen Time habit app,” and “app to stop doomscrolling and build habits.” They must appear only where the copy directly answers that intent.

## Homepage changes

### Metadata

- `<title>` becomes `Ascent: iPhone Habit Builder & App Blocker`.
- Meta and Open Graph descriptions state that Ascent combines a 70-day daily plan, home-screen visibility, two-minute fallback actions, reflection, and optional Screen Time app blocking.
- The canonical URL, smart app banner, exact `SoftwareApplication` name, stable `@id`, `sameAs`, and App Store ID remain unchanged.

### Visible copy

- H1 becomes `Build habits on iPhone. Block the apps that get in the way.`
- The supporting paragraph keeps the existing product mechanism and avoids calling Ascent the best app.
- The existing competitive preview remains on the homepage and links prominently to `/compare/`.
- The full 18-app guide and full head-to-head content remain off the homepage so product comprehension and conversion are not buried.

## Comparison hub changes

### Metadata and heading

- `<title>` becomes `Best Habit Tracker Apps for iPhone (2026): 18 Compared | Ascent`.
- H1 becomes `18 iPhone habit apps compared honestly`.
- The description continues to name trackers, routine apps, gamified tools, and app blockers.
- The URL and canonical stay `/compare/`; no redirect or duplicate keyword route is created.

### Direct answer section

Add a short “The short answer” section immediately after the methodology. It explains:

- There is no universally best habit app.
- Streaks is the cleaner pure tracker.
- Routinery is stronger for timed known routines.
- Finch is stronger for emotionally engaging self-care.
- one sec and Opal are stronger if distraction control is the entire need.
- Ascent is the relevant choice when someone wants one iPhone system to connect a meaningful goal, daily actions, visible cues, smaller fallback actions, reflection, and optional app-blocking friction.

This section is answer-first, quotable, and deliberately includes reasons not to choose Ascent.

### FAQ addition

Add the visible and JSON-LD question `Which iPhone habit tracker also blocks distracting apps?` The answer explains that Ascent combines positive-habit guidance with optional Screen Time friction, while one sec, Opal, Jomo, and ScreenZen may be better for users who only need specialized blocking.

### Head-to-head links

The seven-item closest-competitor list becomes an internal navigation list to the corresponding comparison pages. Link text uses the natural product pair, such as `Ascent vs Streaks`, rather than generic “learn more.”

## Head-to-head page contract

All seven pages share one restrained stylesheet at `/compare/head-to-head.css`, but every page contains original editorial copy.

Each page contains:

1. Breadcrumbs back to Home and the 18-app comparison.
2. A unique headline and lede naming the decision being made, followed by a visible `Updated July 22, 2026` date.
3. A 120–180 word “Short answer” that states the competitor's strongest use case, Ascent's strongest use case, and that neither is universally better.
4. A five-dimension comparison covering primary job, setup and planning, daily execution, distraction control, and progress or emotional feedback.
5. A “Choose [competitor] if…” section with three specific reasons.
6. A “Choose Ascent if…” section with three specific reasons.
7. A “Using both” note only when the products can reasonably complement one another.
8. Three visible FAQs mirrored exactly in `FAQPage` JSON-LD.
9. A “Sources reviewed” section linking only to current first-party product pages and the exact Ascent App Store listing.
10. Related links back to `/compare/` and two genuinely adjacent head-to-head pages.

### Structured data

Each page includes:

- `Article` with a unique headline, description, canonical URL, publication date, modification date, and `about` references.
- The shared Ascent `SoftwareApplication` entity using `https://habitbuilding.xyz/#ascent-app`.
- A second `SoftwareApplication` entity for the competitor only when its official canonical product URL is known.
- `FAQPage` matching visible questions and answers.
- No `Review`, `AggregateRating`, or unsupported pricing markup.

## Editorial truth rules by competitor

| Competitor | Must acknowledge | Ascent distinction to explain without exaggeration |
|---|---|---|
| Fabulous | Rich guided Journeys and progressive coaching | One focused 70-day goal plus optional distraction friction |
| Tiimo | Neuroinclusive daily planning and executive-function support | Narrower goal scope and replacement behavior tied to app blocking |
| Routinery | Timed, step-by-step execution of established routines | Developing one meaningful goal rather than only running a known sequence |
| Finch | Emotional attachment and approachable self-care | Goal-centered daily actions without making the companion the main product |
| Streaks | Polished Apple-native tracking and integrations | Planning, fallback actions, reflection, and optional app friction beyond logging |
| one sec | Precise intervention at the moment a distracting app opens | Positive replacement actions and a long-term habit curriculum beyond interruption |
| Opal | Deep blocking, focus sessions, analytics, and screen-time specialization | A broader habit system where blocking supports a chosen goal rather than being the product's main job |

Each article must also say plainly when Ascent is not the useful choice.

## App Store metadata alignment

The repository cannot publish App Store Connect metadata by itself. Create `docs/app-store-metadata-2026-07.md` containing a proposed, internally consistent listing:

- Name: `Ascent: Habit Builder & Focus`
- Subtitle: `Block apps. Build habits.`
- Description aligned with the website's current 70-day plan, widgets, two-minute fallback, reflection, motivation battery, and optional Screen Time friction.
- No AI coach language, unsupported tier limits, or stale prices.
- Developer website: `https://habitbuilding.xyz/`
- Comparison guide: `https://habitbuilding.xyz/compare/` for marketing/support use where App Store Connect permits it.

Publishing that copy requires an authenticated App Store Connect account and remains an explicit post-code action.

## Discovery and indexing

- Add all seven comparison URLs to the root sitemap with `lastmod` `2026-07-22`, monthly change frequency, and a priority below the hub.
- Update homepage and comparison `lastmod` values to `2026-07-22`.
- Keep the sitemap declaration in `robots.txt` and the explicit `OAI-SearchBot` allow rule.
- After deployment, request indexing for `/`, `/compare/`, and the seven new pages through an already-verified Google Search Console property.
- Submit `https://habitbuilding.xyz/sitemap.xml` in Search Console. If no authenticated verified property is available, report that account boundary rather than attempting ownership changes.
- Do not add Bing submission to this implementation. It is outside the focused Google and ChatGPT discovery scope.

## Analytics and measurement

The existing privacy-limited `chatgpt_referral` event remains unchanged. It records only landing path and traffic source.

Evaluate after enough data exists, using:

- ChatGPT referral sessions and landing paths.
- Search Console impressions and clicks by page and query.
- Index coverage for every comparison URL.
- App Store click-throughs from each page's tagged CTA.
- Queries that show a page ranking for the wrong intent, which indicate cannibalization.

No ranking claim is made before data exists. A first useful review window is 28 days after indexing, with editorial accuracy reviewed quarterly.

## Accessibility and visual behavior

- All pages remain readable without JavaScript.
- Semantic headings follow one H1 per page and no skipped hierarchy.
- Navigation, breadcrumbs, tables or comparison grids, details elements, and CTAs have descriptive labels and keyboard-visible focus.
- Comparison dimensions collapse to a single-column reading order below 700 px without horizontal overflow.
- Touch targets remain at least 44 px.
- Warm opaque surfaces, restrained blue accents, Fraunces display type, and Instrument Sans body type remain consistent with the site.
- No hover lift, neon styling, badges, scoring meters, or shame-based language is added.

## Test strategy

Automated tests will fail before implementation and then verify:

- Homepage title and H1 own the iPhone habit-builder/app-blocker query.
- Comparison title and H1 own the best-iPhone-habit-app comparison query.
- The direct-answer FAQ is present in visible HTML and structured data.
- All seven routes exist, have unique title, description, H1, canonical URL, and primary intent.
- Each page names both products, contains “Choose” guidance, links first-party sources, and includes a frank Ascent limitation.
- Each page references the exact shared Ascent entity and canonical App Store URL.
- The hub links to all seven pages, and every comparison links back to the hub.
- The sitemap contains every public page exactly once.
- Local links resolve and JSON-LD parses.
- No 60-day Ascent promise or outdated App Store slug returns.

Browser verification covers the homepage, hub, and all seven pages at 1440×1000 and 390×844, checking page content, overflow, missing resources, console errors, focus behavior, and CTA contrast.

## Success criteria

- Nine live target pages (`/`, the hub, and seven head-to-head pages) return HTTP 200.
- `OAI-SearchBot` can fetch the homepage, hub, robots file, and every head-to-head route.
- Every install path resolves directly to App Store ID `6756843194` without an obsolete slug redirect.
- The site makes an honest recommendation on every comparison page.
- Search Console can discover every canonical URL through the root sitemap.
- The deployed copy contains no factual mismatch between the homepage, comparison pages, structured data, and prepared App Store metadata.
