# LLM Authority Hub Design

**Date:** 2026-07-22  
**Status:** Approved by user direction; ready for implementation planning  
**Site:** https://habitbuilding.xyz/

## Objective

Make HabitBuilding.xyz a reliable source that search engines and answer engines can cite when people ask about habit formation, iPhone habit apps, app blockers, and the relationship between positive habits and distraction control. Convert qualified readers by linking them to one unambiguous product entity: **Ascent: Habit Builder & Focus** at App Store ID `6756843194`.

The design optimizes for two outcomes at once:

1. **Editorial authority:** useful, evidence-led answers to broad habit and attention questions.
2. **Commercial usefulness:** sincere decision guides that help readers choose the right product, including products other than Ascent.

This work improves eligibility, discovery, comprehension, and citation usefulness. It does not promise rankings, ChatGPT placement, citations, traffic, or installs.

## Research and truth standard

Competitor coverage is **document-based editorial research**, not hands-on testing. Sources may include:

- official App Store listings;
- official product pages;
- official feature, pricing, privacy, and help documentation;
- peer-reviewed or government-hosted research for behavioral claims.

Every comparison or recommendation must:

- state the source-review date;
- link to the material sources used;
- distinguish a documented feature from an editorial judgment;
- name a real strength of each relevant competitor;
- identify when Ascent is not the best fit;
- avoid claims about personal testing, outcomes, market leadership, ratings, prices, or medical effects unless directly supported and current;
- disclose that Ascent is the publisher's own product wherever a page recommends it.

The methodology page will say plainly: "We review public product documentation and App Store listings. Unless a page explicitly says otherwise, these are editorial comparisons, not hands-on product tests."

## Strategy selected

### Authority-first hybrid

Publish a limited set of strong reference and decision pages rather than generating a page for every keyword variation. Pages own distinct questions and link to one another by reader need.

This approach was selected over:

- **Breadth-first publishing:** faster theoretical coverage, but high risk of repetitive, low-value pages and search-intent cannibalization.
- **An interactive app database in the first release:** potentially valuable later, but it needs ongoing structured data collection and recertification that the current static workflow does not yet support.

The information architecture must be capable of growing into a maintained app database after query and referral data show which filters are useful.

## Audience and intent model

The site serves four overlapping reader states:

| Reader state | Typical question | Best destination |
|---|---|---|
| Learning | Why do my habits keep failing? | Evidence-led guide |
| Diagnosing | Do I need a tracker, routine app, or blocker? | Decision framework |
| Comparing | Which iPhone habit app or blocker fits me? | Category or head-to-head comparison |
| Ready to act | Does Ascent connect habits and app blocking? | Canonical Ascent product page |

Pages should identify the reader's failure mode before recommending a tool. This prevents every answer from collapsing into "use Ascent."

## Information architecture

### Global navigation

Use five plain-language destinations:

- **Best apps** -> decision guides
- **Compare** -> the existing landscape and head-to-head library
- **Habit guides** -> educational articles
- **Research** -> behavioral evidence and citations
- **About our research** -> methodology and disclosure

The App Store action remains visually distinct and always links directly to the exact current listing.

### Homepage

The homepage remains the product-led editorial front door. It should not contain the full comparison library. Above and shortly below the fold it will:

1. explain Ascent's connected behavior loop;
2. offer three explicit paths: compare habit apps, choose an app blocker, and learn habit-building principles;
3. preview the site's strongest comparison or guide content;
4. disclose that HabitBuilding.xyz is published by the maker of Ascent;
5. link every Ascent product mention to `/ascent/` or the exact App Store listing, according to context.

### Canonical Ascent page

Create `/ascent/` as the canonical editorial product page for **Ascent: Habit Builder & Focus**.

It owns the exact product entity and contains:

- the exact name, App Store ID, canonical URL, and App Store URL;
- a direct explanation of the product's connected loop;
- documented feature sections;
- who it is for and who should choose a specialist product instead;
- screenshots or existing first-party imagery only when accurate;
- privacy and Screen Time clarification;
- FAQs mirrored in valid structured data;
- clear publisher identity and last-updated date.

The homepage may retain `SoftwareApplication` structured data, but both pages must use the same stable product `@id`: `https://habitbuilding.xyz/#ascent-app`.

### Decision pages

The initial decision layer contains:

1. `/compare/` - existing broad iPhone habit-app landscape and closest competitors.
2. `/best/app-blockers-iphone/` - comparison by intervention type, strictness, scheduling needs, and whether positive-habit guidance is included.
3. `/best/habit-tracker-with-app-blocking/` - focused answer for readers who need both replacement behavior and distraction friction.

`/compare/` continues to own "best habit apps for iPhone." No duplicate `/best/habit-apps-iphone/` route is created.

The existing seven Ascent head-to-head pages remain, but internal links will route readers to them only when the products are genuinely adjacent.

### Educational guides

The initial educational layer contains:

1. `/guides/why-habit-trackers-fail/`
2. `/guides/habit-tracker-vs-habit-builder/`
3. `/guides/how-to-stop-doomscrolling/`
4. `/guides/two-minute-habit/`
5. `/guides/how-to-build-a-habit-on-iphone/`

These are cornerstone pages, not variations of the same article. Each owns one primary question, gives the direct answer early, uses descriptive headings, and links to relevant decision pages only after explaining the mechanism.

### Methodology

Create `/methodology/` with:

- research scope and source hierarchy;
- the distinction between documentation review and hands-on testing;
- evaluation dimensions;
- Ascent ownership disclosure;
- correction and update policy;
- how affiliate relationships would be disclosed (there are none unless later added);
- a contact or correction path already available to the site;
- a visible change log for material methodology revisions.

### Existing science and blog content

- `/science/` remains the research hub but is linked as supporting evidence, not positioned as medical advice.
- The existing blog must not become the template for new authority content until its encoding, tone-switching feature, and neuroscience claims are reviewed. New guides use the editorial field-guide system instead.
- The public navigation can label `/blog/` as "Journal" or omit it from the primary navigation until multiple reviewed articles exist; indexed pages remain accessible.

## Page content contract

Every new cornerstone page contains, where relevant:

1. one H1 that states the reader's real question;
2. a two-to-four sentence direct answer before background material;
3. a visible `Reviewed` or `Updated` date;
4. a short "How we researched this" disclosure;
5. definitions for ambiguous terms;
6. evidence or documented product facts with inline source links;
7. a decision framework based on reader needs or failure modes;
8. limitations and cases where another approach is better;
9. a concise answer-oriented FAQ when it adds information;
10. a sources section with descriptive link labels;
11. contextual internal links to one parent, one sibling, and one next-step page;
12. an Ascent disclosure before any commercial CTA.

Content must not use hidden keyword blocks, repetitive exact-match phrasing, invented quotations, fake author biographies, rankings without methodology, or FAQ questions that merely restate headings.

## Query ownership

| Route | Primary question or intent |
|---|---|
| `/` | What is Ascent and how does it combine habits with focus? |
| `/ascent/` | Is Ascent: Habit Builder & Focus right for me? |
| `/compare/` | What are the best habit apps for iPhone by use case? |
| `/best/app-blockers-iphone/` | Which iPhone app blocker fits my needs? |
| `/best/habit-tracker-with-app-blocking/` | Which habit tracker also blocks distracting apps? |
| `/guides/why-habit-trackers-fail/` | Why does recording a habit fail to change behavior? |
| `/guides/habit-tracker-vs-habit-builder/` | Do I need a tracker or a guided habit system? |
| `/guides/how-to-stop-doomscrolling/` | How can I interrupt scrolling and replace it with a useful action? |
| `/guides/two-minute-habit/` | How should I shrink a habit when motivation is low? |
| `/guides/how-to-build-a-habit-on-iphone/` | How can iPhone surfaces and Screen Time support a habit? |
| `/methodology/` | How does HabitBuilding.xyz research and compare apps? |

Secondary phrases may appear naturally where directly answered. The site will not publish a separate page for every synonym, audience, or year.

## Internal-link system

The content graph follows reader movement rather than a flat directory:

```text
Educational guide
  -> relevant decision framework
    -> category comparison
      -> head-to-head comparison or canonical Ascent page
        -> exact App Store listing
```

Every page also links upward to its hub and sideways to no more than three genuinely relevant pages. Link text names the destination question or product pair; generic "learn more" links are avoided.

The homepage, `/compare/`, `/science/`, `/methodology/`, `/ascent/`, and both `/best/` pages form the core crawl network and must not depend on JavaScript for discovery.

## Visual and interaction design

Continue Ascent's warm editorial system:

- cream or light paper background;
- solid white or warm opaque content surfaces;
- muted blue and earth-tone accents;
- Fraunces for editorial display type and Instrument Sans for interface/body copy;
- typography, rules, numbering, and spacing as primary hierarchy;
- restrained conventional shadows only where needed;
- 44px minimum interactive targets and visible keyboard focus;
- responsive single-column reading order without horizontal table scrolling;
- reduced-motion support.

The new sections should resemble a carefully edited field guide, not a SaaS card grid. Avoid score gauges, ranking medals, competitor logos, neon treatments, gradient title text, hover lifts, content pills, and shame-based language.

## Structured data and entity consistency

Structured data must match visible page content. Use only supported types that describe the actual page:

- `SoftwareApplication` for the Ascent entity;
- `Article` for substantive guides and comparisons;
- `BreadcrumbList` for hierarchical pages;
- `ItemList` for genuine visible comparison lists;
- `FAQPage` only when the same questions and answers are visible.

Do not add fabricated `Review`, `AggregateRating`, offer, price, medical, or author credentials.

All Ascent entities and CTAs use:

- Name: `Ascent: Habit Builder & Focus`
- Product `@id`: `https://habitbuilding.xyz/#ascent-app`
- App Store: `https://apps.apple.com/us/app/ascent-habit-builder-focus/id6756843194`

The canonical `/ascent/` page is linked from product mentions so answer engines have a stable explanatory destination before or alongside the App Store destination.

## Crawler discovery and indexing

### Robots policy

Keep general crawling allowed and add explicit search/retrieval crawler groups for:

- `OAI-SearchBot`;
- `PerplexityBot`;
- `Claude-SearchBot`;
- optionally the documented user-directed retrieval agents where an explicit allow is useful.

Training crawlers are not required for answer-engine discovery and will not be enabled merely as an SEO tactic. The sitemap declaration remains absolute.

### Sitemap and freshness

- Add every canonical public page exactly once.
- Use `lastmod` only for material content changes.
- Do not claim daily or weekly change frequencies for static pages.
- Validate that every sitemap route maps to a repository-backed page returning `200` after deployment.

### IndexNow

Add an IndexNow key file at the site root plus a small, documented submission script or manual command that sends only changed canonical URLs after deployment. A successful submission reports discovery, not guaranteed indexing.

### Google and Bing account actions

After deployment:

1. verify the URL-prefix or domain property in Google Search Console;
2. submit the sitemap and request indexing for the homepage, `/ascent/`, `/compare/`, the two decision pages, `/methodology/`, and the five guides;
3. verify/import the property in Bing Webmaster Tools;
4. submit the sitemap and confirm IndexNow key validation;
5. review Google's Search performance and Bing AI Performance after data accumulates.

Authentication, DNS, and account ownership are user-controlled boundaries. The repository will contain any required verification placeholder only after the actual token is available; no token will be invented.

### AI-specific files

Do not treat `llms.txt` as a ranking mechanism. It is outside the critical path because major search guidance does not require it. If later added for convenience, it must be a maintained summary of canonical resources and never replace crawlable HTML, sitemaps, or internal links.

## Analytics and success measurement

Generalize the existing privacy-limited referral event into an `answer_engine_referral` event with:

- `source`: `chatgpt`, `perplexity`, `claude`, `copilot`, `gemini`, or `other_answer_engine`;
- landing path;
- optional campaign source when explicitly present in the URL.

Never attempt to infer or store a user's private prompt.

Track two separate funnels:

### Authority indicators

- indexed canonical pages;
- Search Console impressions, clicks, and queries;
- Bing AI citations, cited pages, and grounding queries;
- answer-engine referral sessions and landing pages;
- growth in non-branded queries that match page intent.

### Commercial indicators

- App Store CTA clicks by source page and CTA position;
- paths from educational content to decision pages;
- paths from decision pages to `/ascent/`;
- App Store conversion data where Apple makes it available.

The first meaningful editorial review occurs after 28 days of verified indexing. Product facts and source links are recertified at least quarterly or after a known material competitor change.

## Error handling and maintenance

- If a competitor source is unavailable or ambiguous, omit the claim rather than infer it.
- If a product feature changes, mark the relevant page for review and update its visible date only after substantive edits.
- Broken external sources should be replaced with an equivalent first-party source or the affected claim removed.
- A page with insufficient distinct value should be consolidated into its parent instead of padded.
- A route that is intentionally retired must redirect to the closest useful canonical page and be removed from the sitemap.
- Analytics failures must never block navigation, content, or App Store CTAs.
- IndexNow submission failures are reported and retryable; they do not affect deployment success.

## Implementation phases

### Phase 1: authority foundation

- `/methodology/`
- `/ascent/`
- generalized answer-engine analytics
- crawler policy
- sitemap validation
- IndexNow support
- homepage discovery paths and ownership disclosure

### Phase 2: high-intent decision content

- `/best/app-blockers-iphone/`
- `/best/habit-tracker-with-app-blocking/`
- corresponding comparison-hub and homepage links

### Phase 3: educational cornerstone content

- the five `/guides/` pages
- research hub and science-page cross-links
- guide index or navigation treatment if needed for coherent discovery

All phases may ship in one release after verification, but tests should preserve the boundaries so incomplete content cannot silently appear in the sitemap.

## Verification strategy

Automated checks will cover:

- every canonical route exists and appears exactly once in the sitemap;
- canonical, title, description, H1, visible update date, and structured data are unique and valid;
- the methodology disclosure appears on every decision page;
- all Ascent entities use the exact current name, stable `@id`, App Store URL, and ID;
- no unsupported ratings, stale App Store slug, `60-day` promise, hidden keywords, `meta keywords`, or private-query collection appears;
- source sections use valid `https` links and decision pages include first-party competitor sources;
- homepage and hub links form the intended crawl network;
- robots rules allow the named search/retrieval crawlers and declare the sitemap;
- IndexNow key format and local key-file location are valid;
- answer-engine analytics classifies known sources without collecting query text;
- local internal links resolve and JSON-LD parses.

Browser verification will cover the homepage and every new template at desktop and iPhone widths, including:

- readable hierarchy and no horizontal overflow;
- keyboard navigation and visible focus;
- 44px targets;
- reduced-motion behavior;
- contrast and CTA clarity;
- no missing assets or console errors;
- correct App Store destinations.

Production verification will confirm HTTP `200` for canonical pages, `robots.txt`, `sitemap.xml`, the IndexNow key file, and representative crawler user agents.

## Completion criteria

- The homepage clearly routes learning, comparison, and blocker intent.
- The site contains one stable, complete Ascent product page linked to the correct App Store listing.
- Two high-intent decision pages and five distinct educational guides are live, sourced, and internally linked.
- The research methodology and Ascent ownership are conspicuous.
- All named search/retrieval crawlers can access public content.
- Sitemap, structured data, internal links, analytics, and IndexNow pass automated checks.
- Google and Bing verification instructions are ready, with any account-dependent actions clearly handed off.
- The release contains no promise of placement, traffic, citations, or behavior-change outcomes.
