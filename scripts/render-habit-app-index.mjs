import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  ascentIndexRecord,
  ascentOrganizationSchema,
  ascentSoftwareSchema,
  assertAscentProductFacts
} from './ascent-product-facts.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const product = assertAscentProductFacts();
const capabilityKeys = [
  ['tracking', 'Habit tracking'],
  ['guidedRoutines', 'Guided routines'],
  ['emotionalMotivation', 'Emotional motivation'],
  ['appBlocking', 'App blocking'],
  ['widgets', 'Widgets'],
  ['appleWatch', 'Apple Watch'],
  ['healthIntegration', 'Health integration']
];
const categoryLabels = {
  'combined-system': 'Combined behavior system',
  'traditional-tracker': 'Traditional tracker',
  'guided-routine': 'Guided routine or planner',
  'emotional-gamification': 'Emotionally engaging or gamified',
  'attention-intervention': 'Attention intervention'
};
const capabilityLabels = {
  yes: 'Yes',
  limited: 'Limited',
  no: 'No',
  'not-confirmed': 'Not confirmed'
};

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const jsonLd = (value) => JSON.stringify(value).replaceAll('</', '<\\/');

export function validateApps(apps) {
  if (!Array.isArray(apps) || apps.length !== 19) throw new Error('Expected exactly 19 app records');
  const slugs = new Set();
  for (const app of apps) {
    if (!app.slug || slugs.has(app.slug)) throw new Error(`Invalid or duplicate app slug: ${app.slug}`);
    if (!categoryLabels[app.category]) throw new Error(`Invalid category for ${app.name}`);
    if (!Array.isArray(app.sources) || app.sources.length === 0) throw new Error(`Missing sources for ${app.name}`);
    for (const [key] of capabilityKeys) {
      if (!capabilityLabels[app.capabilities?.[key]]) throw new Error(`Invalid ${key} for ${app.name}`);
    }
    slugs.add(app.slug);
  }
  return apps;
}

const renderCapability = ([key, label], app) => `
            <div class="capability" data-capability="${key}">
              <dt>${label}</dt>
              <dd data-value="${app.capabilities[key]}">${capabilityLabels[app.capabilities[key]]}</dd>
            </div>`;

const renderApp = (app, index) => {
  const sourceLinks = app.sources.map((source) =>
    `<li><a href="${escapeHtml(source.url)}">${escapeHtml(source.label)}</a></li>`
  ).join('');
  const search = [
    app.name,
    app.primaryJob,
    app.bestFor,
    categoryLabels[app.category]
  ].join(' ').toLowerCase();

  return `
      <article class="app-record" id="${app.slug}" data-app-slug="${app.slug}" data-category="${app.category}" data-app-blocking="${app.capabilities.appBlocking}" data-apple-watch="${app.capabilities.appleWatch}" data-widgets="${app.capabilities.widgets}" data-search="${escapeHtml(search)}">
        <div class="record-number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</div>
        <div class="record-main">
          <div class="record-heading">
            <div>
              <p class="record-category">${categoryLabels[app.category]}</p>
              <h2>${escapeHtml(app.name)}</h2>
            </div>
            <p class="pricing-model">${escapeHtml(app.pricingModel)}</p>
          </div>
          <p class="primary-job">${escapeHtml(app.primaryJob)}</p>
          <div class="fit-grid">
            <div><h3>Best for</h3><p>${escapeHtml(app.bestFor)}</p></div>
            <div><h3>Main limitation</h3><p>${escapeHtml(app.mainLimitation)}</p></div>
          </div>
          <div class="platform-line"><strong>Documented platforms:</strong> ${escapeHtml(app.platforms.join(', '))}</div>
          <dl class="capability-grid">${capabilityKeys.map((entry) => renderCapability(entry, app)).join('')}
          </dl>
          <div class="record-sources">
            <h3>First-party sources</h3>
            <ul>${sourceLinks}</ul>
          </div>
        </div>
      </article>`;
};

export function renderHabitAppIndex(rawApps) {
  const apps = rawApps.map((app) => ({ ...app, sources: [...app.sources] }));
  const ascentPosition = apps.findIndex((app) => app.slug === 'ascent');
  if (ascentPosition < 0) throw new Error('Missing Ascent product record');
  Object.assign(apps[ascentPosition], ascentIndexRecord(product));
  validateApps(apps);
  apps.sort((left, right) => left.name.localeCompare(right.name));
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'iOS Habit App Index',
    itemListOrder: 'https://schema.org/ItemListUnordered',
    numberOfItems: apps.length,
    itemListElement: apps.map((app, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: app.name,
      url: app.slug === 'ascent' ? 'https://habitbuilding.xyz/ascent/' : app.sources[0].url
    }))
  };
  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'iOS Habit App Index: 19 apps compared by documented features',
    description: 'A maintained, source-linked index of iPhone habit trackers, routine apps, gamified systems, and app blockers.',
    datePublished: '2026-07-23',
    dateModified: product.lastVerified,
    mainEntityOfPage: 'https://habitbuilding.xyz/habit-apps/',
    author: { '@id': 'https://habitbuilding.xyz/#ascent-publisher' },
    publisher: { '@id': 'https://habitbuilding.xyz/#ascent-publisher' }
  };
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://habitbuilding.xyz/' },
      { '@type': 'ListItem', position: 2, name: 'iOS Habit App Index', item: 'https://habitbuilding.xyz/habit-apps/' }
    ]
  };
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the difference between a habit tracker and a habit builder?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A tracker records whether a behavior happened. A habit builder adds help with defining, starting, shrinking, sequencing, or reviewing the behavior. Some products overlap, so the useful question is which mechanism is missing from your current system.'
        }
      },
      {
        '@type': 'Question',
        name: 'Which habit apps also block distracting iPhone apps?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ascent combines positive-habit guidance with optional Screen Time friction. one sec, ScreenZen, Opal, and Jomo specialize more deeply in app-opening intervention or blocking, but they are not full positive-habit systems.'
        }
      },
      {
        '@type': 'Question',
        name: 'Does Not confirmed mean an app lacks the feature?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. Not confirmed means the feature was not supported clearly enough by the first-party documents reviewed for this index. It prevents missing documentation from being presented as proof that a feature does not exist.'
        }
      }
    ]
  };
  const publisher = {
    '@context': 'https://schema.org',
    ...ascentOrganizationSchema(product)
  };
  const ascent = {
    '@context': 'https://schema.org',
    ...ascentSoftwareSchema(product)
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>iOS Habit App Index: 19 Apps Compared by Features | HabitBuilding.xyz</title>
<meta name="description" content="Compare 19 iPhone habit trackers, routine apps, gamified systems, and app blockers by documented features, best use, limitations, platforms, and pricing model.">
<link rel="canonical" href="https://habitbuilding.xyz/habit-apps/">
<meta property="og:title" content="iOS Habit App Index: 19 apps compared by documented features">
<meta property="og:description" content="A maintained, source-linked field guide to habit trackers, routine apps, gamified systems, and app blockers for iPhone.">
<meta property="og:image" content="https://habitbuilding.xyz/img/icon.png">
<meta property="og:url" content="https://habitbuilding.xyz/habit-apps/">
<meta property="og:type" content="article">
<meta name="twitter:card" content="summary">
<meta name="theme-color" content="#FAF7F2">
<link rel="icon" href="../img/icon.png">
<script async src="https://www.googletagmanager.com/gtag/js?id=G-MEDSTMYLJ3"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-MEDSTMYLJ3');</script>
<script defer src="../analytics.js"></script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&amp;family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&amp;display=swap" rel="stylesheet">
<link rel="stylesheet" href="../editorial.css">
<link rel="stylesheet" href="index.css">
<script type="application/ld+json">${jsonLd(article)}</script>
<script type="application/ld+json">${jsonLd(breadcrumb)}</script>
<script type="application/ld+json">${jsonLd(itemList)}</script>
<script type="application/ld+json">${jsonLd(faq)}</script>
<script type="application/ld+json">${jsonLd(publisher)}</script>
<script type="application/ld+json">${jsonLd(ascent)}</script>
<script defer src="index.js"></script>
</head>
<body>
<header class="site-header">
  <nav class="site-nav wrap" aria-label="Primary navigation">
    <a class="brand" href="../"><img src="../img/icon.png" alt="" width="32" height="32">Ascent</a>
    <div class="nav-links">
      <a href="./" aria-current="page">App index</a>
      <a href="../compare/">Compare</a>
      <a href="../science/">Research</a>
      <a href="../methodology/">Methodology</a>
      <a class="button" href="https://apps.apple.com/us/app/ascent-habit-builder-focus/id6756843194?utm_source=habitbuilding&amp;utm_medium=site&amp;utm_campaign=habit_app_index&amp;utm_content=nav">Get the App</a>
    </div>
  </nav>
</header>

<nav class="breadcrumbs wrap" aria-label="Breadcrumb">
  <ol><li><a href="../">Home</a></li><li aria-current="page">iOS Habit App Index</li></ol>
</nav>

<main>
  <section class="index-hero">
    <div class="wrap">
      <p class="kicker">Maintained reference · Document-based editorial research</p>
      <h1>iOS Habit App Index: 19 apps compared by documented features</h1>
      <p class="lede">There is no universally best habit app. The useful choice depends on whether you need a record, a routine guide, an emotional reward loop, an attention intervention, or several of those mechanisms connected together.</p>
      <p>Records are listed alphabetically, not ranked.</p>
      <p class="review-date"><time datetime="${product.lastVerified}">Last verified July 24, 2026</time></p>
    </div>
  </section>

  <section class="answer-block">
    <div class="wrap reading">
      <h2>The short answer</h2>
      <p>Choose a traditional tracker when the action is already clear. Choose a guided routine app when sequencing and initiation are the problem. Choose an emotionally engaging system when attachment or play makes tiny actions easier to revisit. Choose an app blocker when the moment of failure is opening another app.</p>
      <p>Ascent is the combined-system option in this index. HabitBuilding.xyz is published by the maker of Ascent, so that relationship is disclosed anywhere the product is recommended.</p>
    </div>
  </section>

  <section class="category-key" aria-labelledby="category-key-title">
    <div class="wrap">
      <h2 id="category-key-title">Start with the job, not the streak</h2>
      <div class="category-ledger">
        <a href="#traditional-trackers"><strong>Traditional tracker</strong><span>Record and review behavior</span></a>
        <a href="#guided-routines"><strong>Guided routine</strong><span>Plan or run a sequence</span></a>
        <a href="#emotional-systems"><strong>Emotional system</strong><span>Attach action to care or play</span></a>
        <a href="#attention-tools"><strong>Attention intervention</strong><span>Interrupt competing behavior</span></a>
        <a href="#ascent"><strong>Combined system</strong><span>Connect guidance and friction</span></a>
      </div>
    </div>
  </section>

  <section class="filter-panel" aria-labelledby="filter-title">
    <div class="wrap">
      <div class="filter-intro">
        <div><p class="kicker">Progressive filter</p><h2 id="filter-title">Narrow the reference</h2></div>
        <p>Every record remains in the HTML for readers and crawlers. These controls only change what is visible in your browser.</p>
      </div>
      <form id="app-filters">
        <label for="app-search">App name or need
          <input id="app-search" type="search" autocomplete="off" placeholder="Try “morning routine”" aria-controls="app-ledger">
        </label>
        <label for="category-filter">Category
          <select id="category-filter" aria-controls="app-ledger">
            <option value="">All categories</option>
            <option value="combined-system">Combined behavior system</option>
            <option value="traditional-tracker">Traditional tracker</option>
            <option value="guided-routine">Guided routine or planner</option>
            <option value="emotional-gamification">Emotionally engaging or gamified</option>
            <option value="attention-intervention">Attention intervention</option>
          </select>
        </label>
        <label class="check-control"><input id="blocking-filter" type="checkbox" aria-controls="app-ledger">Documented app blocking</label>
        <label class="check-control"><input id="watch-filter" type="checkbox" aria-controls="app-ledger">Documented Apple Watch app</label>
        <label class="check-control"><input id="widget-filter" type="checkbox" aria-controls="app-ledger">Documented widgets</label>
        <button id="reset-filters" type="reset">Reset filters</button>
      </form>
      <p id="filter-status" aria-live="polite">Showing all 19 apps.</p>
    </div>
  </section>

  <section class="app-index" aria-labelledby="app-index-title">
    <div class="wrap">
      <div class="ledger-heading">
        <div><p class="kicker">The full ledger</p><h2 id="app-index-title">Documented strengths, limits, and capabilities</h2></div>
        <p><strong>Not confirmed means</strong> the reviewed first-party documents did not support the field clearly enough. It does not prove the feature is absent.</p>
      </div>
      <div id="app-ledger">${apps.map(renderApp).join('')}
      </div>
    </div>
  </section>

  <section class="method-note">
    <div class="wrap reading">
      <h2>How this index was researched</h2>
      <p>We reviewed official App Store listings, product sites, help centers, and pricing pages. These are editorial comparisons, not hands-on product tests. Pricing is described as a model rather than a volatile amount. A documented feature does not prove a behavior-change outcome.</p>
      <p><a href="../methodology/">Read the complete methodology and correction policy</a>.</p>
    </div>
  </section>

  <section class="faq-section">
    <div class="wrap reading">
      <p class="kicker">Common questions</p>
      <h2>How to read the index</h2>
      <details><summary>What is the difference between a habit tracker and a habit builder?</summary><p>A tracker records whether a behavior happened. A habit builder adds help with defining, starting, shrinking, sequencing, or reviewing the behavior. Some products overlap, so the useful question is which mechanism is missing from your current system.</p></details>
      <details><summary>Which habit apps also block distracting iPhone apps?</summary><p>Ascent combines positive-habit guidance with optional Screen Time friction. one sec, ScreenZen, Opal, and Jomo specialize more deeply in app-opening intervention or blocking, but they are not full positive-habit systems.</p></details>
      <details><summary>Does Not confirmed mean an app lacks the feature?</summary><p>No. Not confirmed means the feature was not supported clearly enough by the first-party documents reviewed for this index. It prevents missing documentation from being presented as proof that a feature does not exist.</p></details>
    </div>
  </section>

  <section class="next-paths">
    <div class="wrap">
      <h2>Move from facts to a decision</h2>
      <div class="path-ledger">
        <a href="../compare/"><strong>Read the editorial comparison</strong><span>See which mechanisms fit different kinds of people.</span></a>
        <a href="../best/app-blockers-iphone/"><strong>Choose an iPhone app blocker</strong><span>Compare delay, session, schedule, and strictness approaches.</span></a>
        <a href="../best/habit-tracker-with-app-blocking/"><strong>Combine habits and blocking</strong><span>Understand when one connected system is useful.</span></a>
      </div>
    </div>
  </section>

  <section class="cta-band">
    <div class="wrap reading">
      <h2>When the missing piece is the whole loop</h2>
      <p>Ascent connects one goal, guided daily actions, a smaller fallback, iPhone visibility, reflection, and optional Screen Time friction. A specialist tracker, routine timer, or blocker remains the simpler choice when that is all you need.</p>
      <p class="disclosure"><strong>Publisher disclosure:</strong> HabitBuilding.xyz is published by the maker of Ascent.</p>
      <div class="cta-actions">
        <a class="button secondary" href="../ascent/">Read the canonical Ascent guide</a>
        <a class="button" href="https://apps.apple.com/us/app/ascent-habit-builder-focus/id6756843194?utm_source=habitbuilding&amp;utm_medium=site&amp;utm_campaign=habit_app_index&amp;utm_content=body">View Ascent on the App Store</a>
      </div>
    </div>
  </section>
</main>

<footer class="site-footer">
  <div class="footer-row wrap">
    <span>&copy; 2026 Ascent</span>
    <div class="footer-links"><a href="../">Home</a><a href="../compare/">Compare</a><a href="../methodology/">Methodology</a><a href="../privacy.html">Privacy</a></div>
  </div>
</footer>
</body>
</html>
`;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const apps = JSON.parse(readFileSync(resolve(root, 'data/habit-apps.json'), 'utf8'));
  writeFileSync(resolve(root, 'habit-apps/index.html'), renderHabitAppIndex(apps));
}
