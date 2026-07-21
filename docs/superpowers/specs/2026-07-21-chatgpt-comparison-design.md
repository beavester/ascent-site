# Ascent comparison and ChatGPT discovery design

Date: 2026-07-21

## Objective

Create an honest, useful comparison resource that can earn citations and referral traffic when people ask ChatGPT and other search systems about habit trackers, guided-routine apps, gamified habit products, and attention blockers.

The site must not imply that it can read or collect another person's private ChatGPT queries. It may identify referral visits through the `utm_source=chatgpt.com` parameter that OpenAI adds to ChatGPT search links.

## Success criteria

- A public, static `/compare/` page gives a fair, current comparison of Ascent and the 18 named competitors.
- The homepage summarizes Ascent's position and links to the full guide without becoming substantially longer.
- Search crawlers can read the comparison, blog listing, headings, links, and update date without executing JavaScript.
- `OAI-SearchBot` is explicitly allowed and `/compare/` appears once in a valid sitemap.
- Existing contradictions, accessibility problems, delayed hero content, and the identified science-language problems are corrected.
- Google Analytics can distinguish ChatGPT referral visits without claiming access to private query text.
- Desktop and mobile layouts remain legible and consistent with the current warm, editorial design.

## Non-goals

- No promise or guarantee of placement in ChatGPT search.
- No collection, inference, or storage of private ChatGPT prompts.
- No fabricated rankings, test results, user counts, or competitor weaknesses.
- No attempt to publish seven thin competitor-specific pages in this release.
- No broad redesign of the existing Ascent visual identity.

## Information architecture

### Homepage

Keep the existing page architecture, but make these focused changes:

1. Fix the navigation CTA contrast so its text meets WCAG AA contrast.
2. Remove reveal animation from the above-the-fold hero and shorten below-fold reveal timing.
3. Use `70-day` consistently.
4. Add a compact trust line near the primary CTA using only verified claims:
   - free tier available;
   - iOS Screen Time inputs are optional;
   - Ascent does not sell personal data.
5. Replace the binary "typical habit apps vs Ascent" section with a preview titled around the actual competitive stack.
6. Show the five mechanisms users currently assemble from separate apps: guidance, tracking, friction, emotional attachment, and daily visibility.
7. State the product risk honestly: the system must feel like one behavior engine rather than feature soup.
8. Link to `/compare/` with descriptive text such as "Read the honest habit-app comparison."

### Comparison page

Create `/compare/index.html` as static HTML with this order:

1. **Hero:** "Ascent vs the habit-app landscape" with a concise promise: a practical comparison, not a victory lap.
2. **Methodology:** explain that products are compared by their strongest mechanism, primary limitation, and place in a behavior-change loop. Include an explicit "Last reviewed July 2026" date.
3. **At-a-glance landscape:** four linked categories with brief definitions.
4. **Traditional habit trackers:** Streaks, Habitify, Productive, Way of Life, Tangerine.
5. **Routine and guided-action apps:** Fabulous, Routinery, Structured, Tiimo, Coach.me.
6. **Gamified and emotionally engaging apps:** Finch, Habitica, (Not Boring) Habits, TaskHero.
7. **Attention and bad-habit interrupters:** one sec, ScreenZen, Opal, Jomo.
8. **Closest benchmark set:** Fabulous, Tiimo, Routinery, Finch, Streaks, one sec, and Opal.
9. **The competitive stack:** show the chain Ascent is attempting to own:
   `meaningful goal -> daily actions -> smaller fallback -> iOS visibility -> competing-behavior interruption -> reflection and adaptation`.
10. **Honest conclusion:** most competitors specialize in one or two links; specialization can be preferable for users who already know what they need. Ascent is for people who want those mechanisms coordinated around one goal.
11. **FAQ:** concise answers to natural comparison questions, including whether Ascent replaces a planner, an app blocker, or a habit tracker.
12. **CTA:** link to the App Store without interrupting the comparison with repeated sales prompts.

Each competitor entry will include:

- linked product name;
- "What it does best";
- "Main limitation";
- neutral language that distinguishes product focus from product quality.

Competitor claims must be verified against official product or App Store sources immediately before publication. When a limitation is an editorial judgment, it must be phrased as a fit trade-off rather than an objective defect.

## Visual design

Continue the current Fraunces and Instrument Sans pairing, cream paper background, muted blue accent, solid white surfaces, fine rules, and restrained shadows.

The comparison page will resemble an editorial field guide:

- a narrow reading column for introductory copy;
- category dividers with large ordinal numbers;
- compact comparison entries rather than a wide spreadsheet table;
- labels such as "Best at" and "Trade-off" for fast scanning;
- a single blue-highlighted Ascent chain near the conclusion;
- no competitor logos, badges, ranking medals, or artificial winner labels;
- no pills for ordinary content items;
- no hover-lift effects.

On small screens, every competitor entry becomes a single-column reading unit. The page must not require horizontal scrolling.

## Discoverability and machine readability

- Use static semantic HTML for all meaningful comparison and blog-index content.
- Give `/compare/` a unique title, description, canonical URL, Open Graph metadata, and visible review date.
- Use one `h1`, descriptive `h2` category headings, competitor `h3` headings, and stable fragment IDs.
- Add JSON-LD for `Article`, `ItemList`, and the Ascent `SoftwareApplication`; do not add review scores or ratings that the site cannot substantiate.
- Add `/compare/` to the sitemap exactly once.
- Remove duplicate sitemap URLs and entries for pages that do not exist.
- Add an explicit `User-agent: OAI-SearchBot` allow rule while preserving general crawling.
- Convert the blog index's JavaScript-generated post card to static HTML so text-only crawlers can discover it.
- Link the homepage, comparison page, science page, and blog in a coherent internal-link structure.

## Analytics

Retain the existing GA4 configuration. Add a small, privacy-preserving event when either condition is true:

- the landing URL contains `utm_source=chatgpt.com`; or
- the referrer host is `chatgpt.com`.

The event records the landing path and referral source only. It must not claim or attempt to record the user's ChatGPT query.

## Science-language corrections

Keep the science page and its citations, but change the four identified overstatements:

- replace "the receivers are shot" with cautious language about reduced responsiveness and the limits of extrapolation;
- replace "molecular proof" with a mechanistic explanation that does not claim proof of a product outcome;
- replace "that flatness is the treatment working" with a non-diagnostic description of possible adjustment;
- remove the unsupported "most people report 2-4 weeks" timeline and state that recovery or adjustment timelines vary and are not established for ordinary phone use.

The page should distinguish direct evidence, animal or substance-use evidence, and product-design inference. It must not present Ascent as medical treatment.

## Implementation boundaries

The site remains a dependency-free static site. New behavior uses only browser JavaScript already consistent with the project. No framework, package manager, CMS, database, or OpenAI API is added.

## Verification strategy

Add a dependency-free Node test using `node:test` that reads the static files and verifies:

- all 18 competitors and all four categories are present on `/compare/`;
- the closest seven competitors are named;
- comparison metadata, canonical URL, visible update date, and structured data exist;
- no `60-day` or `60 days` text remains;
- the low-contrast navigation CTA rule is corrected;
- above-the-fold hero copy is not hidden behind `.reveal`;
- `OAI-SearchBot` is allowed;
- the sitemap has no duplicate URLs, includes `/compare/`, and contains only repository-backed pages;
- the blog post link exists in static markup;
- the four overconfident science phrases are absent;
- ChatGPT referral analytics does not collect query text.

Then run:

1. the Node test;
2. a local static server;
3. desktop visual inspection;
4. iPhone-width visual inspection;
5. link and console-error checks on the homepage, comparison page, science page, and blog.

## Release plan

Implement on `codex/chatgpt-comparison`, verify locally, commit the production changes, push the branch, and open a pull request unless the user requests direct publication to `master`. The comparison page is designed so later releases can add seven substantive head-to-head pages without changing the homepage architecture.
