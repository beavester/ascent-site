# HabitBuilding discovery evidence runbook

This runbook closes the gap between a deployable indexing contract and proof that search and answer engines have discovered the live site. It is for the canonical production hostname only: `https://habitbuilding.xyz`.

## What the repository already proves

`npm test` verifies that every URL in `sitemap.xml` has a self-canonical tag and does not include an HTML `noindex` directive. The public `robots.txt` explicitly permits Googlebot, Bingbot, OAI-SearchBot, PerplexityBot, and Claude-SearchBot, and declares the sitemap. `indexnow.json` and `scripts/submit-indexnow.mjs` support carefully scoped URL submissions.

Those checks do not prove that Google, Bing, ChatGPT, or Perplexity has crawled, indexed, retrieved, or cited the page. Treat those as separate states.

## Run immediately after a production deployment

Run this against the live canonical site, after the deployment has completed:

```sh
npm run verify:live-discovery
```

It records the status, response size, content type, canonical, redirects, and `X-Robots-Tag` for every sitemap URL. It fails if a sitemap page is not a direct `200` HTML document with an exact self-canonical URL, or if it is marked `noindex` in HTML or response headers.

If a release changes one or more public canonical pages, submit just those URLs after the production deploy has passed the check:

```sh
node scripts/submit-indexnow.mjs / /ascent/ /habit-apps/
```

Do not submit preview URLs, redirect URLs, assets, or every page on every deployment. IndexNow is a notification, not an indexing guarantee.

## Search Console evidence

Use a Google Search Console **Domain property** and submit `https://habitbuilding.xyz/sitemap.xml`. Then inspect these URLs individually with both **Test Live URL** and the indexed URL result:

| URL | Main purpose |
| --- | --- |
| `https://habitbuilding.xyz/` | Product conversion page |
| `https://habitbuilding.xyz/ascent/` | Canonical product dossier |
| `https://habitbuilding.xyz/habit-apps/` | Maintained reference index |
| `https://habitbuilding.xyz/methodology/` | Editorial methodology |
| `https://habitbuilding.xyz/science/` | Research interpretation |

For each URL, save the check date and these fields in a shared record:

| URL | Live test fetch | Index state | User canonical | Google canonical | Last crawl | Robots/indexing state | Action taken |
| --- | --- | --- | --- | --- | --- | --- | --- |

If the live test passes but the page is not indexed, request indexing only after checking the selected canonical and the rendered text. Do not infer site-wide non-indexing from a `site:` search or a single answer-engine response.

## Bing and bot-access evidence

Add the canonical domain to Bing Webmaster Tools and submit the same sitemap. After a material production update, use the scoped IndexNow command above.

In Vercel, Cloudflare, or the active firewall/access-log provider, inspect requests for these user agents:

```text
Googlebot
Bingbot
OAI-SearchBot
ChatGPT-User
PerplexityBot
Perplexity-User
```

For each request, record URL, status, response size, and whether a challenge or block was served. A `200` response is not enough if it is a bot-check page instead of the HTML document. Any `403`, `429`, geo restriction, JavaScript challenge, or suspiciously small response should be fixed in the hosting/WAF account, then rechecked.

## GEO baseline log

Keep a dated, repeatable baseline outside the public site. Do not record user prompts or personal data from referrals.

| Date | Engine/model | Prompt family | First-party URL retrieved | HabitBuilding cited | Cited URL | Product facts absorbed correctly | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |

Use paraphrases from these families:

- Branded: `What is Ascent: Habit Builder & Focus?`
- Category: `Best iPhone habit app with app blocking`
- Problem: `How can I stop opening social media instead of working out?`
- Comparison: `Ascent vs one sec`
- Fit: `Habit app for someone who quits after missing a day`

Track citation and factual accuracy separately. A citation that gives the wrong plan limit, platform, or product model is not a success.

## Intentional crawler policy decision

The current `robots.txt` permits the search/retrieval crawlers named above. Its `User-agent: *` rule also does not separately restrict `GPTBot`. Whether to permit potential training crawls is a publisher policy decision, not an SEO default. Decide it explicitly with the owner before adding a `GPTBot` rule; a change should be reviewed for its product, legal, and visibility implications.

## What requires account access

The repository cannot prove or change Search Console index state, Bing index state, Vercel/Cloudflare firewall behavior, bot request logs, external citations, or App Store Connect metadata. Capture evidence from those services before declaring crawlability, indexing, or GEO citation work complete.
