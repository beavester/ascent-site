import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(join(root, path), 'utf8');
const canonicalAppStoreUrl = 'https://apps.apple.com/us/app/ascent-habit-builder-focus/id6756843194';
const headToHeadSlugs = [
  'ascent-vs-fabulous',
  'ascent-vs-tiimo',
  'ascent-vs-routinery',
  'ascent-vs-finch',
  'ascent-vs-streaks',
  'ascent-vs-one-sec',
  'ascent-vs-opal'
];
const authorityRoutes = [
  ['ascent/index.html', 'https://habitbuilding.xyz/ascent/'],
  ['methodology/index.html', 'https://habitbuilding.xyz/methodology/']
];
const decisionRoutes = [
  ['best/app-blockers-iphone/index.html', 'https://habitbuilding.xyz/best/app-blockers-iphone/'],
  ['best/habit-tracker-with-app-blocking/index.html', 'https://habitbuilding.xyz/best/habit-tracker-with-app-blocking/']
];
const guideRoutes = [
  ['guides/why-habit-trackers-fail/index.html', 'https://habitbuilding.xyz/guides/why-habit-trackers-fail/'],
  ['guides/habit-tracker-vs-habit-builder/index.html', 'https://habitbuilding.xyz/guides/habit-tracker-vs-habit-builder/'],
  ['guides/how-to-stop-doomscrolling/index.html', 'https://habitbuilding.xyz/guides/how-to-stop-doomscrolling/'],
  ['guides/two-minute-habit/index.html', 'https://habitbuilding.xyz/guides/two-minute-habit/'],
  ['guides/how-to-build-a-habit-on-iphone/index.html', 'https://habitbuilding.xyz/guides/how-to-build-a-habit-on-iphone/']
];
const expectedPublicUrls = [
  'https://habitbuilding.xyz/',
  ...authorityRoutes.map(([, canonical]) => canonical),
  ...decisionRoutes.map(([, canonical]) => canonical),
  ...guideRoutes.map(([, canonical]) => canonical),
  'https://habitbuilding.xyz/compare/',
  ...headToHeadSlugs.map((slug) => 'https://habitbuilding.xyz/compare/' + slug + '/'),
  'https://habitbuilding.xyz/science/',
  'https://habitbuilding.xyz/blog/',
  'https://habitbuilding.xyz/blog/youre-not-unmotivated/',
  'https://habitbuilding.xyz/privacy.html',
  'https://habitbuilding.xyz/terms.html'
];
const staleDurationPattern = /60[ \-\u2010\u2011\u2012\u2013\u2014\u2212]day/i;
const metadataProhibitedPattern = new RegExp('AI coach|' + staleDurationPattern.source + '|[£€]', 'i');
const parseSitemapEntries = (xml) => [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((match) => {
  const block = match[1];
  return {
    loc: block.match(/<loc>\s*([^<]+?)\s*<\/loc>/)?.[1],
    lastmod: block.match(/<lastmod>\s*([^<]+?)\s*<\/lastmod>/)?.[1]
  };
});

test('homepage uses one 70-day promise', () => {
  const html = read('index.html');
  assert.doesNotMatch(html, /60[- ]day/i);
  assert.match(html, /70[- ]day/i);
});

test('navigation CTA has an explicit accessible foreground', () => {
  const html = read('index.html');
  assert.match(html, /\.nav-links \.btn\.primary\s*\{[^}]*color:var\(--paper\)/s);
});

test('comparison navigation CTA overrides the navigation link color', () => {
  const html = read('compare/index.html');
  assert.match(html, /\.nav-links \.btn\s*\{[^}]*color:var\(--paper\)/s);
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

test('homepage declares the exact official Ascent app identity', () => {
  const html = read('index.html');
  assert.match(html, /<meta name="apple-itunes-app" content="app-id=6756843194, app-argument=https:\/\/habitbuilding\.xyz\/">/);
  assert.match(html, /"@id"\s*:\s*"https:\/\/habitbuilding\.xyz\/#ascent-app"/);
  assert.match(html, /"name"\s*:\s*"Ascent: Habit Builder & Focus"/);
  assert.match(html, /"propertyID"\s*:\s*"Apple App Store ID"/);
  assert.match(html, /"value"\s*:\s*"6756843194"/);
  assert.ok(html.includes(`"downloadUrl": "${canonicalAppStoreUrl}"`));
  assert.ok(html.includes(`"sameAs": ["${canonicalAppStoreUrl}"]`));
  assert.match(html, />Official App Store listing<\/a>/);
});

test('every Ascent install link uses Apple\'s canonical product URL', () => {
  const pages = [
    'index.html',
    'ascent/index.html',
    ...decisionRoutes.map(([page]) => page),
    ...guideRoutes.map(([page]) => page),
    'compare/index.html',
    'science/index.html',
    'blog/index.html',
    'blog/youre-not-unmotivated/index.html',
    'blog/_template/index.html'
  ];
  for (const page of pages) {
    const html = read(page);
    const urls = [...html.matchAll(/href="([^"]*id6756843194[^"]*)"/g)]
      .map((match) => match[1].replaceAll('&amp;', '&'));
    assert.ok(urls.length > 0, `${page} has no Ascent install link`);
    for (const url of urls) {
      assert.ok(url.startsWith(canonicalAppStoreUrl), `${page} uses a non-canonical Ascent URL: ${url}`);
    }
  }
});

const competitors = [
  'Streaks', 'Habitify', 'Productive', 'Way of Life', 'Tangerine',
  'Fabulous', 'Routinery', 'Structured', 'Tiimo', 'Coach.me',
  'Finch', 'Habitica', '(Not Boring) Habits', 'TaskHero',
  'one sec', 'ScreenZen', 'Opal', 'Jomo'
];

test('habit app data contains 19 sourced records with controlled capability values', () => {
  const apps = JSON.parse(read('data/habit-apps.json'));
  const expectedNames = ['Ascent: Habit Builder & Focus', ...competitors];
  const categories = new Set([
    'combined-system',
    'traditional-tracker',
    'guided-routine',
    'emotional-gamification',
    'attention-intervention'
  ]);
  const capabilityValues = new Set(['yes', 'limited', 'no', 'not-confirmed']);
  const pricingModels = new Set([
    'Free',
    'Paid download with optional subscription',
    'Free with premium upgrade',
    'Free with optional subscription',
    'Free tracker with paid coaching',
    'Free with optional subscription and in-app currency',
    'Free with optional subscription or lifetime purchase',
    'Free with in-app purchases',
    'Free, donation-supported'
  ]);

  assert.equal(apps.length, 19);
  assert.equal(new Set(apps.map(({ slug }) => slug)).size, 19);
  assert.equal(new Set(apps.map(({ name }) => name)).size, 19);
  assert.deepEqual(new Set(apps.map(({ name }) => name)), new Set(expectedNames));

  for (const app of apps) {
    assert.match(app.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(categories.has(app.category), `${app.name} has an invalid category`);
    assert.ok(app.primaryJob.length >= 30, `${app.name} needs a specific primary job`);
    assert.ok(app.bestFor.length >= 30, `${app.name} needs a specific best-for statement`);
    assert.ok(app.mainLimitation.length >= 30, `${app.name} needs a specific limitation`);
    assert.ok(Array.isArray(app.platforms) && app.platforms.includes('iPhone'));
    assert.ok(pricingModels.has(app.pricingModel), `${app.name} has an invalid pricing model`);
    assert.equal(app.verifiedDate, '2026-07-23');
    assert.equal(app.researchMode, 'document-based editorial research');
    assert.deepEqual(
      Object.keys(app.capabilities).sort(),
      ['appBlocking', 'appleWatch', 'emotionalMotivation', 'guidedRoutines', 'healthIntegration', 'tracking', 'widgets'].sort()
    );
    for (const [capability, value] of Object.entries(app.capabilities)) {
      assert.ok(capabilityValues.has(value), `${app.name} has invalid ${capability}: ${value}`);
    }
    assert.ok(Array.isArray(app.sources) && app.sources.length >= 1);
    for (const source of app.sources) {
      assert.ok(source.label.length >= 8);
      assert.match(source.url, /^https:\/\//);
    }
  }
});

test('habit app index renders every sourced app as static citation-ready content', () => {
  const page = 'habit-apps/index.html';
  const canonical = 'https://habitbuilding.xyz/habit-apps/';
  const apps = JSON.parse(read('data/habit-apps.json'));
  assert.ok(existsSync(join(root, page)), 'habit app index is missing');
  const html = read(page);
  assert.match(html, /<title>iOS Habit App Index: 19 Apps Compared by Features \| HabitBuilding\.xyz<\/title>/);
  assert.ok(html.includes('<link rel="canonical" href="' + canonical + '">'));
  assert.equal((html.match(/<h1\b/gi) || []).length, 1);
  assert.match(html, /<h1>iOS Habit App Index: 19 apps compared by documented features<\/h1>/);
  assert.match(html, /There is no universally best habit app/i);
  assert.match(html, /Document-based editorial research/i);
  assert.match(html, /Last verified July 23, 2026/i);
  assert.match(html, /HabitBuilding\.xyz is published by the maker of Ascent/i);
  assert.match(html, /Not confirmed means/i);
  assert.equal((html.match(/class="app-record"/g) || []).length, 19);

  for (const app of apps) {
    assert.ok(html.includes(`data-app-slug="${app.slug}"`), `missing static record for ${app.name}`);
    assert.ok(html.includes(`>${app.name.replaceAll('&', '&amp;')}<`), `missing visible name for ${app.name}`);
    for (const source of app.sources) assert.ok(html.includes(source.url.replaceAll('&', '&amp;')));
  }

  const itemList = parseJsonLd(html, page)
    .find((entry) => entry['@type'] === 'ItemList');
  assert.ok(itemList, 'habit app index needs ItemList JSON-LD');
  assert.deepEqual(
    itemList.itemListElement.map((item) => item.name),
    apps.map((app) => app.name)
  );
  for (const type of ['Article', 'BreadcrumbList', 'FAQPage', 'SoftwareApplication']) {
    assert.ok(parseJsonLd(html, page).some((entry) => entry['@type'] === type), `missing ${type}`);
  }
  assert.equal((html.match(/<details\b/g) || []).length, 3);
  assert.match(html, /href="\.\.\/methodology\/"/);
  assert.match(html, /href="\.\.\/compare\/"/);
  assert.match(html, /href="\.\.\/ascent\/"/);
});

test('habit app index filter is progressive, private, and accessible', () => {
  const html = read('habit-apps/index.html');
  const css = read('habit-apps/index.css');
  const js = read('habit-apps/index.js');
  assert.match(html, /<input[^>]+id="app-search"[^>]+aria-controls="app-ledger"/);
  assert.match(html, /<select[^>]+id="category-filter"[^>]+aria-controls="app-ledger"/);
  assert.match(html, /id="filter-status"[^>]+aria-live="polite"/);
  assert.match(html, /<button[^>]+id="reset-filters"[^>]*>Reset filters<\/button>/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /@media\s*\(max-width:\s*720px\)[\s\S]*\.capability-grid/);
  assert.match(css, /:focus-visible/);
  assert.match(js, /\.hidden\s*=/);
  assert.match(js, /resultCount/);
  assert.doesNotMatch(js, /gtag|fetch|XMLHttpRequest|sendBeacon|localStorage|sessionStorage/);
});

test('comparison page contains every named competitor and category', () => {
  assert.ok(existsSync(join(root, 'compare/index.html')), 'comparison page is missing');
  const html = read('compare/index.html');
  for (const name of competitors) assert.ok(html.includes(name), `missing ${name}`);
  for (const id of ['traditional-trackers', 'guided-action', 'gamified', 'attention-interrupters']) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
});

test('comparison page is a dated, canonical, structured article', () => {
  assert.ok(existsSync(join(root, 'compare/index.html')), 'comparison page is missing');
  const html = read('compare/index.html');
  assert.match(html, /<link rel="canonical" href="https:\/\/habitbuilding\.xyz\/compare\/">/);
  assert.match(html, /Last reviewed July 22, 2026/);
  assert.match(html, /"@type"\s*:\s*"Article"/);
  assert.match(html, /"headline"\s*:\s*"18 iPhone habit apps compared honestly"/);
  assert.match(html, /"@type"\s*:\s*"ItemList"/);
  assert.match(html, /"@type"\s*:\s*"SoftwareApplication"/);
  assert.match(html, /"@id"\s*:\s*"https:\/\/habitbuilding\.xyz\/#ascent-app"/);
  assert.ok(html.includes(`"downloadUrl": "${canonicalAppStoreUrl}"`));
});

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
  assert.match(html, /\.contents a\{[^}]*min-height:44px/);
});

test('hub answers which habit tracker also blocks distracting apps', () => {
  const html = read('compare/index.html');
  const question = 'Which iPhone habit tracker also blocks distracting apps?';
  assert.ok(html.split(question).length >= 3, 'question must appear visibly and in FAQ JSON-LD');
  assert.match(html, /one sec, Opal, Jomo, and ScreenZen/i);
});

test('comparison page names the closest seven and the full Ascent loop', () => {
  assert.ok(existsSync(join(root, 'compare/index.html')), 'comparison page is missing');
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

test('every sitemap HTML document declares its own canonical URL', () => {
  const xml = read('sitemap.xml');
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

  for (const canonical of urls) {
    const { pathname } = new URL(canonical);
    const page = pathname === '/'
      ? 'index.html'
      : pathname.endsWith('/')
        ? pathname.slice(1) + 'index.html'
        : pathname.slice(1);
    const html = read(page);
    assert.ok(
      html.includes('<link rel="canonical" href="' + canonical + '">'),
      page + ' needs a self-canonical URL',
    );
  }
});

test('blog post is present in static markup', () => {
  const html = read('blog/index.html');
  assert.match(html, /<div class="post-list"[\s\S]*href="youre-not-unmotivated\/"/);
  assert.match(html, /<h2>You.re Not Unmotivated\. You.re Desensitized\.<\/h2>/);
});

test('ChatGPT referral analytics records source and path only', () => {
  assert.ok(existsSync(join(root, 'analytics.js')), 'analytics file is missing');
  const js = read('analytics.js');
  assert.match(js, /chatgpt_referral/);
  assert.match(js, /landing_path/);
  assert.match(js, /traffic_source/);
  assert.doesNotMatch(js, /search_term|prompt_text|query_text/);
});

test('authority foundation pages are canonical static documents', () => {
  for (const [page, canonical] of authorityRoutes) {
    assert.ok(existsSync(join(root, page)), page + ' is missing');
    const html = read(page);
    assert.match(html, /<meta name="description" content="[^"]{100,170}">/);
    assert.ok(html.includes('<link rel="canonical" href="' + canonical + '">'));
    assert.equal((html.match(/<h1\b/gi) || []).length, 1, page + ' needs one H1');
    assert.match(html, /Updated July 22, 2026|Effective July 22, 2026/);
    parseJsonLd(html, page);
  }
});

test('methodology discloses ownership and document-based research', () => {
  const html = read('methodology/index.html');
  assert.match(html, /published by the maker of Ascent/i);
  assert.match(html, /public product documentation and App Store listings/i);
  assert.match(html, /not hands-on product tests/i);
  assert.match(html, /documented fact/i);
  assert.match(html, /editorial judgment/i);
  assert.match(html, /correction/i);
});

test('canonical Ascent page owns the exact product identity', () => {
  const html = read('ascent/index.html');
  assert.match(html, /<title>Ascent: Habit Builder &amp; Focus \| Official Guide<\/title>/);
  assert.match(html, /<h1>Ascent: Habit Builder &amp; Focus<\/h1>/);
  assert.match(html, /who should choose something else/i);
  assert.match(html, /Screen Time access is optional/i);
  const entities = parseJsonLd(html, 'ascent/index.html');
  const app = entities.find((item) => item['@id'] === 'https://habitbuilding.xyz/#ascent-app');
  assert.ok(app);
  assert.equal(app.name, 'Ascent: Habit Builder & Focus');
  assert.equal(app.downloadUrl, canonicalAppStoreUrl);
  assert.equal(app.identifier.value, '6756843194');
});

test('homepage routes readers to authority destinations and discloses ownership', () => {
  const html = read('index.html');
  for (const href of ['ascent/', 'compare/', 'methodology/']) {
    assert.ok(html.includes('href="' + href + '"'), 'homepage is missing ' + href);
  }
  assert.match(html, /HabitBuilding\.xyz is published by the maker of Ascent/i);
});

test('answer-engine referral analytics classifies known sources without query collection', () => {
  const js = read('analytics.js');
  assert.match(js, /answer_engine_referral/);
  for (const source of ['chatgpt', 'perplexity', 'claude', 'copilot', 'gemini']) {
    assert.match(js, new RegExp(source));
  }
  assert.match(js, /landing_path/);
  assert.match(js, /traffic_source/);
  assert.doesNotMatch(js, /search_term|prompt_text|query_text|URLSearchParams.*[?&]q=/s);
});

test('editorial click analytics records placement and destination class without content', () => {
  const js = read('analytics.js');
  assert.match(js, /app_store_cta_click/);
  assert.match(js, /editorial_path_click/);
  assert.match(js, /source_path/);
  assert.match(js, /placement/);
  assert.match(js, /destination_class/);
  assert.match(js, /addEventListener\(['"]click['"]/);
  assert.match(js, /id6756843194/);
  for (const destination of ['habit_app_index', 'comparison', 'decision_guide', 'behavior_guide', 'research', 'product']) {
    assert.match(js, new RegExp(destination));
  }
  assert.doesNotMatch(js, /search_term|prompt_text|query_text|filter_value|input_value|link_text|innerText|textContent/);
  assert.doesNotMatch(js, /localStorage|sessionStorage|sendBeacon|fetch|XMLHttpRequest/);
});

test('search and retrieval crawlers are explicitly allowed', () => {
  const robots = read('robots.txt');
  for (const bot of ['OAI-SearchBot', 'PerplexityBot', 'Claude-SearchBot']) {
    assert.match(robots, new RegExp('User-agent: ' + bot + '\\s+Allow: /'));
  }
  assert.match(robots, /Sitemap: https:\/\/habitbuilding\.xyz\/sitemap\.xml/);
});

test('IndexNow support contains a valid root key and safe submission utility', () => {
  const config = JSON.parse(read('indexnow.json'));
  assert.match(config.key, /^[A-Za-z0-9-]{8,128}$/);
  assert.equal(config.keyLocation, 'https://habitbuilding.xyz/' + config.key + '.txt');
  assert.equal(read(config.key + '.txt').trim(), config.key);
  const script = read('scripts/submit-indexnow.mjs');
  assert.match(script, /api\.indexnow\.org\/indexnow/);
  assert.match(script, /https:\/\/habitbuilding\.xyz\//);
  assert.match(script, /process\.argv\.slice\(2\)/);
});

test('secondary navigation points to the live homepage workflow section', () => {
  for (const page of ['science/index.html', 'blog/index.html']) {
    const html = read(page);
    assert.doesNotMatch(html, /href="\.\.\/#how"/, `${page} links to a missing section`);
    assert.match(html, /href="\.\.\/#workflow"/);
  }
});

test('science page avoids overconfident medical language', () => {
  const html = read('science/index.html');
  for (const phrase of [
    'the receivers are shot',
    'This is molecular proof',
    'That flatness is the treatment working',
    'Most people report noticeable sensitivity improvement within 2-4 weeks',
    'Getting your receptors back',
    'why willpower always loses',
    'The first two weeks are supposed to hurt',
    'Two minutes is enough',
    'the molecular biology backs it up',
    'a 2-minute practice session plus good sleep is neurologically superior',
    'Environment design beats discipline. Every time',
    "Your dorsolateral striatum doesn't care if you did 2 minutes or 20",
    'The habenula stays quiet',
    'dopamine crash',
    'specific neurological structure with a specific address',
    'around week two to three, the transfer begins'
  ]) {
    assert.ok(!html.includes(phrase), `overstatement remains: ${phrase}`);
  }
  assert.match(html, /does not establish the same mechanism for ordinary phone use/i);
  assert.match(html, /not, by itself, proof/i);
  assert.doesNotMatch(html, /60[- ]day/i);
  assert.match(html, /70 days/i);
  assert.match(html, /Habit formation timelines vary/i);
  assert.match(html, /Two minutes is a product design choice, not a scientifically established threshold/i);
  assert.match(html, /70 days is Ascent's program structure/i);
  assert.match(html, /https:\/\/pmc\.ncbi\.nlm\.nih\.gov\/articles\/PMC11641623\//);
  assert.match(html, /https:\/\/pmc\.ncbi\.nlm\.nih\.gov\/articles\/PMC9226889\//);
});

test('key pages contain no missing local href targets', () => {
  for (const page of [
    'index.html',
    'compare/index.html',
    'compare/ascent-vs-fabulous/index.html',
    'compare/ascent-vs-tiimo/index.html',
    'compare/ascent-vs-routinery/index.html',
    'ascent/index.html',
    'methodology/index.html',
    ...decisionRoutes.map(([page]) => page),
    ...guideRoutes.map(([page]) => page),
    'science/index.html',
    'blog/index.html'
  ]) {
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

function parseJsonLd(html, page) {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  assert.ok(blocks.length > 0, page + ' has no JSON-LD');
  return blocks.flatMap((match) => {
    const value = JSON.parse(match[1]);
    return Array.isArray(value) ? value : [value];
  });
}

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

function assertGuidePage(spec) {
  assert.ok(existsSync(join(root, spec.page)), spec.page + ' is missing');
  const html = read(spec.page);
  assert.ok(html.includes('<title>' + spec.title + '</title>'));
  assert.ok(html.includes('<link rel="canonical" href="' + spec.canonical + '">'));
  assert.ok(html.includes('<h1>' + spec.h1 + '</h1>'));
  assert.equal((html.match(/<h1\b/gi) || []).length, 1, spec.page + ' needs one H1');
  const description = html.match(/<meta name="description" content="([^"]+)">/)?.[1] ?? '';
  assert.ok(description.length >= 100 && description.length <= 170, spec.page + ' needs a 100-170 character description');
  const headings = [...html.matchAll(/<h([1-6])\b[^>]*>/gi)].map((match) => Number(match[1]));
  for (let index = 1; index < headings.length; index++) {
    assert.ok(headings[index] <= headings[index - 1] || headings[index] === headings[index - 1] + 1, spec.page + ' skips heading hierarchy');
  }
  assert.match(html, /Updated July 22, 2026/);
  assert.match(html, /<section class="answer-block"/);
  assert.match(html, /How we researched this/);
  assert.match(html, /document-based editorial research/i);
  assert.match(html, /published by the maker of Ascent/i);
  assert.match(html, /href="\.\.\/\.\.\/methodology\/"/);
  for (const source of spec.sources) {
    assert.ok(html.includes('href="' + source + '"'), spec.page + ' is missing source ' + source);
  }
  const appStoreUrls = [...html.matchAll(/href="([^"]*id6756843194[^"]*)"/g)]
    .map((match) => match[1].replaceAll('&amp;', '&'));
  assert.ok(appStoreUrls.length > 0, spec.page + ' has no Ascent install link');
  for (const url of appStoreUrls) {
    assert.ok(url.startsWith(canonicalAppStoreUrl), spec.page + ' uses a non-canonical Ascent URL: ' + url);
  }
  const entities = parseJsonLd(html, spec.page);
  const article = entities.find((item) => item['@type'] === 'Article');
  assert.ok(article, spec.page + ' is missing Article schema');
  assert.equal(article.dateModified, '2026-07-22');
  assert.equal(article.mainEntityOfPage, spec.canonical);
  assert.ok(entities.some((item) => item['@type'] === 'BreadcrumbList'));
  const faq = entities.find((item) => item['@type'] === 'FAQPage');
  assert.ok(faq, spec.page + ' is missing FAQPage schema');
  assert.equal(faq.mainEntity.length, 3, spec.page + ' needs three FAQ schema entries');
  const visibleFaqs = [...html.matchAll(/<details\b[^>]*>[\s\S]*?<summary>([^<]+)<\/summary>[\s\S]*?<p>([^<]+)<\/p>[\s\S]*?<\/details>/g)]
    .map((match) => ({ question: match[1].trim(), answer: match[2].trim() }));
  assert.equal(visibleFaqs.length, 3, spec.page + ' needs three visible FAQs');
  assert.deepEqual(visibleFaqs, faq.mainEntity.map((item) => ({
    question: item.name,
    answer: item.acceptedAnswer.text
  })), spec.page + ' visible FAQ copy must match schema');
  assert.ok(!entities.some((item) => ['Review', 'AggregateRating'].includes(item['@type'])));
}

function assertAuthorityIntentPage(spec) {
  assert.ok(existsSync(join(root, spec.page)), spec.page + ' is missing');
  const html = read(spec.page);
  assert.ok(html.includes('<title>' + spec.title + '</title>'));
  assert.ok(html.includes('<link rel="canonical" href="' + spec.canonical + '">'));
  assert.ok(html.includes('<h1>' + spec.h1 + '</h1>'));
  assert.equal((html.match(/<h1\b/gi) || []).length, 1, spec.page + ' needs one H1');
  assert.match(html, /Updated July 23, 2026/);
  assert.match(html, /document-based editorial research/i);
  assert.match(html, /published by the maker of Ascent/i);
  assert.match(html, /There is no universally best|There is no single best|not a universal/i);
  assert.match(html, /href="\.\.\/\.\.\/habit-apps\/"/);
  assert.match(html, /href="\.\.\/\.\.\/methodology\/"/);
  assert.match(html, /href="\.\.\/\.\.\/ascent\/"/);
  assert.match(html, /href="\.\.\/\.\.\/(?:best|guides)\//);
  assert.equal((html.match(/<details\b/g) || []).length, 3, spec.page + ' needs three FAQs');
  assert.ok((html.match(/<tr>/g) || []).length >= 5, spec.page + ' needs a useful comparison table');
  for (const name of spec.names) assert.match(html, new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
  for (const source of spec.sources) assert.ok(html.includes('href="' + source + '"'), spec.page + ' is missing ' + source);
  const entities = parseJsonLd(html, spec.page);
  for (const type of ['Article', 'BreadcrumbList', 'FAQPage', 'SoftwareApplication']) {
    assert.ok(entities.some((item) => item['@type'] === type), spec.page + ' is missing ' + type);
  }
  if (spec.kind === 'decision') assert.ok(entities.some((item) => item['@type'] === 'ItemList'));
  const article = entities.find((item) => item['@type'] === 'Article');
  assert.equal(article.dateModified, '2026-07-23');
  assert.equal(article.mainEntityOfPage, spec.canonical);
  const faq = entities.find((item) => item['@type'] === 'FAQPage');
  const visibleFaqs = [...html.matchAll(/<details\b[^>]*>[\s\S]*?<summary>([^<]+)<\/summary>[\s\S]*?<p>([^<]+)<\/p>[\s\S]*?<\/details>/g)]
    .map((match) => ({ question: match[1].trim(), answer: match[2].trim() }));
  assert.deepEqual(visibleFaqs, faq.mainEntity.map((item) => ({
    question: item.name,
    answer: item.acceptedAnswer.text
  })), spec.page + ' visible FAQ copy must match schema');
  assert.ok(!entities.some((item) => ['Review', 'AggregateRating'].includes(item['@type'])));
}

function contrastRatio(foreground, background) {
  const luminance = (hex) => {
    const channels = hex.match(/[0-9a-f]{2}/gi).map((value) => parseInt(value, 16) / 255);
    const linear = channels.map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
  };
  const first = luminance(foreground);
  const second = luminance(background);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

function assertHeadToHeadPage(spec) {
  const page = 'compare/' + spec.slug + '/index.html';
  assert.ok(existsSync(join(root, page)), page + ' is missing');
  const html = read(page);

  assert.ok(html.includes('<title>' + spec.title + '</title>'));
  if (spec.metaDescription) {
    const description = html.match(/<meta name="description" content="([^"]+)">/)?.[1];
    assert.equal(description, spec.metaDescription, page + ' has the wrong meta description');
    assert.ok(description.length >= 150 && description.length <= 165, page + ' meta description must be 150–165 characters');
  }
  assert.match(html, new RegExp('<link rel="canonical" href="https:\\/\\/habitbuilding\\.xyz\\/compare\\/' + spec.slug + '\\/">'));
  assert.ok(html.includes('<h1>' + spec.h1 + '</h1>'));
  const h1s = [...html.matchAll(/<h1\b[^>]*>[\s\S]*?<\/h1>/gi)];
  assert.equal(h1s.length, 1, page + ' must have exactly one H1');
  const headings = [...html.matchAll(/<h([1-6])\b[^>]*>/gi)].map((match) => Number(match[1]));
  for (let index = 1; index < headings.length; index++) {
    const previousLevel = headings[index - 1];
    const level = headings[index];
    assert.ok(level <= previousLevel || level === previousLevel + 1, page + ' skips heading hierarchy');
  }
  assert.match(html, new RegExp(spec.competitor, 'i'));
  assert.match(html, /<h2[^>]*>Short answer<\/h2>/);
  const shortAnswer = html.match(/<section class="short-answer"[\s\S]*?<p>([^<]+)<\/p>/)?.[1] ?? '';
  const shortAnswerWords = shortAnswer.trim().split(/\s+/).filter(Boolean).length;
  assert.ok(shortAnswerWords >= 120 && shortAnswerWords <= 180, page + ' short answer must be 120–180 words');
  const dimensions = [...html.matchAll(/<article class="dimension"[^>]*>[\s\S]*?<\/article>/g)]
    .map((match) => match[0]);
  assert.equal(dimensions.length, 5, page + ' needs five dimensions');
  for (const dimension of dimensions) {
    assert.doesNotMatch(dimension, /<\/strong>[^\s<]/, page + ' dimension label needs whitespace before body text');
  }
  assert.match(html, new RegExp('<h3>Choose ' + spec.competitor + ' if…</h3>'));
  assert.match(html, /<h3>Choose Ascent if…<\/h3>/);
  assert.match(html, /When Ascent is not the better choice/);
  assert.ok(html.includes('href="' + spec.source + '"'));
  const appStoreUrls = [...html.matchAll(/href="([^"]*id6756843194[^"]*)"/g)]
    .map((match) => match[1].replaceAll('&amp;', '&'));
  assert.ok(appStoreUrls.length > 0, page + ' has no Ascent install link');
  for (const url of appStoreUrls) {
    assert.ok(url.startsWith(canonicalAppStoreUrl), page + ' uses a non-canonical Ascent URL: ' + url);
  }
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
  const visibleFaqs = [...html.matchAll(/<details\b[^>]*>[\s\S]*?<summary>([^<]+)<\/summary>[\s\S]*?<p>([^<]+)<\/p>[\s\S]*?<\/details>/g)]
    .map((match) => ({
      question: match[1].trim(),
      answer: match[2].trim()
    }));
  assert.equal(visibleFaqs.length, 3, page + ' needs three visible FAQ details');
  const schemaFaqs = faq.mainEntity.map((item) => ({
    question: item.name,
    answer: item.acceptedAnswer.text
  }));
  assert.deepEqual(visibleFaqs, schemaFaqs, page + ' visible FAQ copy must match FAQPage schema in order');
  const ascent = entities.find((item) => item['@id'] === 'https://habitbuilding.xyz/#ascent-app');
  assert.ok(ascent, page + ' is missing the shared Ascent entity');
  assert.equal(ascent.name, 'Ascent: Habit Builder & Focus');
  assert.equal(ascent.alternateName, 'Ascent');
  assert.equal(ascent.applicationCategory, 'ProductivityApplication');
  assert.equal(ascent.operatingSystem, 'iOS 15.1 or later');
  assert.equal(ascent.url, 'https://habitbuilding.xyz/');
  assert.equal(ascent.downloadUrl, canonicalAppStoreUrl);
  assert.deepEqual(ascent.sameAs, [canonicalAppStoreUrl]);
  assert.equal(ascent.identifier.propertyID, 'Apple App Store ID');
  assert.equal(ascent.identifier.value, '6756843194');
  assert.equal(ascent.image, 'https://habitbuilding.xyz/img/icon.png');
  assert.equal(
    ascent.description,
    'An iPhone habit system that combines a 70-day action plan, home-screen visibility, two-minute fallback tasks, reflection, and optional app-blocking friction.'
  );
  const competitor = entities.find((item) => item['@type'] === 'SoftwareApplication' && item.name === spec.competitor);
  assert.ok(competitor, page + ' is missing the competitor SoftwareApplication entity');
  assert.equal(competitor.url, spec.entityUrl ?? spec.source);
  assert.equal(competitor['@id'], (spec.entityUrl ?? spec.source) + '#software-application');
  assert.deepEqual(article.about, [
    {'@id': 'https://habitbuilding.xyz/#ascent-app'},
    {'@id': competitor['@id']}
  ], page + ' Article.about must connect both application entities');
  assert.ok(!entities.some((item) => ['Review', 'AggregateRating'].includes(item['@type'])));

  assert.match(html, /<nav class="breadcrumbs wrap" aria-label="Breadcrumb">/);
  assert.doesNotMatch(html, /<div class="breadcrumbs wrap" aria-label="Breadcrumb">/);

  for (const question of spec.questions) {
    assert.ok(html.split(question).length >= 3, page + ' must mirror FAQ question: ' + question);
  }
}

test('head-to-head stylesheet is responsive and accessible', () => {
  const css = read('compare/head-to-head.css');
  assert.match(css, /a:focus-visible/);
  for (const selector of ['.brand', '.nav-links a', '.breadcrumbs a', '.faq-list summary', '.source-list a', '.related-list a', '.foot-links a']) {
    assert.match(css, new RegExp(selector.replace('.', '\\.') + '[^,{]*\\{[^}]*min-height:\\s*44px'), selector + ' needs a 44px target');
  }
  assert.match(css, /@media\s*\(max-width:\s*700px\)/);
  assert.doesNotMatch(css, /translateY|text-shadow|box-shadow:\s*0\s+0/);
  assert.match(css, /header\{[^}]*background:var\(--paper\)/);
  assert.doesNotMatch(css, /backdrop-filter/);
});

test('small muted text tokens meet WCAG AA contrast on paper surfaces', () => {
  for (const page of ['index.html', 'compare/index.html', 'compare/head-to-head.css']) {
    const source = read(page);
    const faint = source.match(/--ink-faint:\s*(#[0-9A-F]{6})/i)?.[1];
    const paper = source.match(/--paper:\s*(#[0-9A-F]{6})/i)?.[1];
    assert.ok(faint && paper, page + ' must define ink-faint and paper');
    assert.ok(contrastRatio(faint, paper) >= 4.5, page + ' ink-faint contrast is below 4.5:1');
  }
});

test('homepage and comparison hub use opaque surfaces without hover lift', () => {
  for (const page of ['index.html', 'compare/index.html']) {
    const html = read(page);
    assert.doesNotMatch(html, /backdrop-filter/i, page + ' uses a backdrop surface');
    assert.doesNotMatch(html, /background:\s*rgba\(255\s*,\s*255\s*,\s*255/i, page + ' uses a transparent white surface');
    assert.doesNotMatch(html, /:hover[^{}]*\{[^}]*translateY\(/i, page + ' uses hover lift');
    assert.doesNotMatch(html, /header\{[^}]*background:\s*rgba\(/i, page + ' uses a translucent header');
  }
});

test('homepage and hub interactive text has selector-specific 44px targets', () => {
  const contracts = [
    ['index.html', ['.brand', '.nav-links a', '.hero-trust a', '.foot-links a']],
    ['compare/index.html', ['.brand', '.nav-links a', '.app-entry h3 a', '.benchmark a', '.faq-list summary', '.foot-links a']]
  ];
  for (const [page, selectors] of contracts) {
    const source = read(page);
    for (const selector of selectors) {
      assert.match(
        source,
        new RegExp(selector.replaceAll('.', '\\.').replaceAll(' ', '\\s+') + '[^,{]*\\{[^}]*min-height:\\s*44px'),
        page + ' ' + selector + ' needs a 44px target'
      );
    }
  }
});

test('small accent text meets WCAG AA contrast on paper', () => {
  const contracts = [
    ['index.html', '--pine', ['.kicker']],
    ['index.html', '--ember', ['.loop-time']],
    ['compare/index.html', '--pine', ['.kicker', '.system-chain li::before']]
  ];
  for (const [page, token, selectors] of contracts) {
    const source = read(page);
    const color = source.match(new RegExp(token + ':\\s*(#[0-9A-F]{6})', 'i'))?.[1];
    const paper = source.match(/--paper:\s*(#[0-9A-F]{6})/i)?.[1];
    assert.ok(contrastRatio(color, paper) >= 4.5, page + ' ' + token + ' contrast is below 4.5:1');
    for (const selector of selectors) {
      assert.match(source, new RegExp(selector.replaceAll('.', '\\.').replaceAll(' ', '\\s+') + '[^{]*\\{[^}]*color:\\s*var\\(' + token + '\\)'), selector + ' must use ' + token);
    }
  }
});

test('head-to-head FAQ summaries retain a visible disclosure marker', () => {
  const css = read('compare/head-to-head.css');
  assert.match(css, /\.faq-list summary::after\{[^}]*content:\s*"\+"/);
  assert.match(css, /\.faq-list details\[open\] summary::after\{[^}]*content:\s*"[−-]"/);
});

test('head-to-head page helper enforces heading structure and canonical App Store links', () => {
  const suite = read('tests/site.test.mjs');
  assert.ok(suite.includes('const h1s = [...html.matchAll(/<h1\\b[^>]*>[\\s\\S]*?<\\/h1>/gi)];'));
  assert.ok(suite.includes("assert.equal(h1s.length, 1, page + ' must have exactly one H1');"));
  assert.ok(suite.includes('const headings = [...html.matchAll(/<h([1-6])\\b[^>]*>/gi)].map'));
  assert.ok(suite.includes('level <= previousLevel || level === previousLevel + 1'));
  assert.ok(suite.includes('const appStoreUrls = [...html.matchAll(/href="([^\"]*id6756843194[^\"]*)"/g)]'));
  assert.ok(suite.includes("replaceAll('&amp;', '&')"));
  assert.ok(suite.includes("page + ' has no Ascent install link'"));
});

test('homepage footer links wrap on narrow screens', () => {
  const html = read('index.html');
  assert.match(html, /\.foot-links\s*\{[^}]*flex-wrap:\s*wrap/s);
});

test('editorial stylesheet is accessible, responsive, and visually restrained', () => {
  const css = read('editorial.css');
  assert.match(css, /a:focus-visible/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /@media\s*\(max-width:\s*760px\)/);
  assert.match(css, /header[^{}]*\{[^}]*background:\s*var\(--paper\)/s);
  assert.doesNotMatch(css, /backdrop-filter|translateY|background-clip:\s*text|text-shadow/i);
  assert.doesNotMatch(css, /rgba\(255\s*,\s*255\s*,\s*255/i);
});

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

test('executive function habit app guide answers by support need', () => {
  assertAuthorityIntentPage({
    kind: 'decision',
    page: 'best/habit-apps-executive-function/index.html',
    canonical: 'https://habitbuilding.xyz/best/habit-apps-executive-function/',
    title: 'Best Habit Apps for Executive Function on iPhone (2026)',
    h1: 'The best habit app for executive function depends on the missing support',
    names: ['Tiimo', 'Structured', 'Routinery', 'Ascent'],
    sources: ['https://www.tiimoapp.com/', 'https://structured.app/', 'https://www.routinery.app/']
  });
});

test('morning routine app guide distinguishes planning from execution', () => {
  assertAuthorityIntentPage({
    kind: 'decision',
    page: 'best/morning-routine-apps-iphone/index.html',
    canonical: 'https://habitbuilding.xyz/best/morning-routine-apps-iphone/',
    title: 'Best Morning Routine Apps for iPhone (2026)',
    h1: 'Choose a morning routine app by where your morning breaks',
    names: ['Routinery', 'Fabulous', 'Structured', 'Ascent'],
    sources: ['https://www.routinery.app/', 'https://www.thefabulous.co/', 'https://structured.app/']
  });
});

test('guided routine app guide compares coaching timers and timelines', () => {
  assertAuthorityIntentPage({
    kind: 'decision',
    page: 'best/guided-routine-apps-iphone/index.html',
    canonical: 'https://habitbuilding.xyz/best/guided-routine-apps-iphone/',
    title: 'Best Guided Routine Apps for iPhone (2026)',
    h1: 'Guided routine apps solve three different jobs',
    names: ['Fabulous', 'Routinery', 'Tiimo', 'Structured', 'Ascent'],
    sources: ['https://www.thefabulous.co/', 'https://www.routinery.app/', 'https://www.tiimoapp.com/', 'https://structured.app/']
  });
});

test('gamified habit app guide compares emotional and reward loops', () => {
  assertAuthorityIntentPage({
    kind: 'decision',
    page: 'best/gamified-habit-apps/index.html',
    canonical: 'https://habitbuilding.xyz/best/gamified-habit-apps/',
    title: 'Best Gamified Habit Apps for iPhone (2026)',
    h1: 'The best gamified habit app depends on the reward loop you enjoy',
    names: ['Finch', 'Habitica', '(Not Boring) Habits', 'TaskHero'],
    sources: ['https://finchcare.com/', 'https://habitica.com/static/features?mobile-app=true', 'https://notbor.ing/product/habits', 'https://taskhero.app/']
  });
});

test('low motivation guide gives a small-action decision framework', () => {
  assertAuthorityIntentPage({
    kind: 'guide',
    page: 'guides/habit-app-for-low-motivation/index.html',
    canonical: 'https://habitbuilding.xyz/guides/habit-app-for-low-motivation/',
    title: 'How to Choose a Habit App When Motivation Is Low',
    h1: 'When motivation is low, choose the app that reduces the next action',
    names: ['Ascent', 'Routinery', 'Finch', 'one sec'],
    sources: [
      'https://pmc.ncbi.nlm.nih.gov/articles/PMC11641623/',
      'https://pmc.ncbi.nlm.nih.gov/articles/PMC9226889/',
      'https://pmc.ncbi.nlm.nih.gov/articles/PMC7571594/'
    ]
  });
});

test('streak guide separates measurement from habit formation', () => {
  assertAuthorityIntentPage({
    kind: 'guide',
    page: 'guides/do-streaks-build-habits/index.html',
    canonical: 'https://habitbuilding.xyz/guides/do-streaks-build-habits/',
    title: 'Do Streaks Build Habits? What Tracking Can and Cannot Do',
    h1: 'A streak is feedback, not the habit itself',
    names: ['Streaks', 'Habitify', 'Productive', 'Ascent'],
    sources: [
      'https://pmc.ncbi.nlm.nih.gov/articles/PMC4566897/',
      'https://pmc.ncbi.nlm.nih.gov/articles/PMC9226889/',
      'https://pmc.ncbi.nlm.nih.gov/articles/PMC7571594/'
    ]
  });
});

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

test('authority routes form a visible topic graph from the homepage and comparison hub', () => {
  const contracts = [
    ['index.html', [
      'href="habit-apps/"',
      'href="best/habit-apps-executive-function/"',
      'href="best/morning-routine-apps-iphone/"',
      'href="best/guided-routine-apps-iphone/"',
      'href="best/gamified-habit-apps/"',
      'href="guides/habit-app-for-low-motivation/"',
      'href="guides/do-streaks-build-habits/"'
    ]],
    ['compare/index.html', [
      'href="../habit-apps/"',
      'href="../best/habit-apps-executive-function/"',
      'href="../best/morning-routine-apps-iphone/"',
      'href="../best/guided-routine-apps-iphone/"',
      'href="../best/gamified-habit-apps/"',
      'href="../guides/habit-app-for-low-motivation/"',
      'href="../guides/do-streaks-build-habits/"'
    ]],
    ['science/index.html', [
      'href="../guides/habit-app-for-low-motivation/"',
      'href="../guides/do-streaks-build-habits/"'
    ]],
    ['methodology/index.html', ['href="../habit-apps/"']],
    ['best/app-blockers-iphone/index.html', ['href="../../habit-apps/"']]
  ];
  for (const [page, fragments] of contracts) {
    const html = read(page);
    for (const fragment of fragments) assert.ok(html.includes(fragment), page + ' is missing ' + fragment);
  }
});

test('app blocker guide exposes a concise static comparison table', () => {
  const html = read('best/app-blockers-iphone/index.html');
  assert.match(html, /<table class="comparison-table">/);
  for (const heading of ['Intervention moment', 'Control model', 'Positive habit support', 'Best fit']) {
    assert.match(html, new RegExp('<th[^>]*>' + heading + '</th>'));
  }
  for (const name of ['one sec', 'ScreenZen', 'Opal', 'Jomo']) {
    assert.match(html, new RegExp('<th scope="row">' + name + '</th>', 'i'));
  }
});

test('methodology explains index maintenance and unknown capability handling', () => {
  const html = read('methodology/index.html');
  assert.match(html, /maintained iOS habit app index/i);
  assert.match(html, /Not confirmed/i);
  assert.match(html, /verification date/i);
  assert.match(html, /feature claims can change/i);
});

test('why habit trackers fail guide satisfies the evidence contract', () => {
  assertGuidePage({
    page: 'guides/why-habit-trackers-fail/index.html',
    canonical: 'https://habitbuilding.xyz/guides/why-habit-trackers-fail/',
    title: 'Why Habit Trackers Fail (and What to Add) | HabitBuilding.xyz',
    h1: 'Why habit trackers fail even when you keep logging',
    sources: [
      'https://pmc.ncbi.nlm.nih.gov/articles/PMC4566897/',
      'https://pmc.ncbi.nlm.nih.gov/articles/PMC9226889/',
      'https://pmc.ncbi.nlm.nih.gov/articles/PMC6693254/',
      'https://pmc.ncbi.nlm.nih.gov/articles/PMC7571594/'
    ]
  });
  const html = read('guides/why-habit-trackers-fail/index.html');
  assert.match(html, /evidence.*varies|varies.*evidence/is);
  assert.doesNotMatch(html, /tracking never works/i);
});

test('habit tracker versus habit builder guide satisfies the evidence contract', () => {
  assertGuidePage({
    page: 'guides/habit-tracker-vs-habit-builder/index.html',
    canonical: 'https://habitbuilding.xyz/guides/habit-tracker-vs-habit-builder/',
    title: 'Habit Tracker vs Habit Builder: Which Do You Need?',
    h1: 'Habit tracker or habit builder? Choose by what is missing',
    sources: [
      'https://pmc.ncbi.nlm.nih.gov/articles/PMC4566897/',
      'https://pmc.ncbi.nlm.nih.gov/articles/PMC4147713/',
      'https://pmc.ncbi.nlm.nih.gov/articles/PMC7571594/'
    ]
  });
  const html = read('guides/habit-tracker-vs-habit-builder/index.html');
  assert.match(html, /tracker records/i);
  assert.match(html, /builder helps.*define.*cue.*shrink.*adapt/is);
});

test('doomscrolling guide satisfies the evidence contract', () => {
  assertGuidePage({
    page: 'guides/how-to-stop-doomscrolling/index.html',
    canonical: 'https://habitbuilding.xyz/guides/how-to-stop-doomscrolling/',
    title: 'How to Stop Doomscrolling Without Relying on Willpower',
    h1: 'How to stop doomscrolling by changing the moment before it starts',
    sources: [
      'https://pmc.ncbi.nlm.nih.gov/articles/PMC9974409/',
      'https://support.apple.com/en-sg/guide/iphone/iphb0c7313c9/ios'
    ]
  });
  const html = read('guides/how-to-stop-doomscrolling/index.html');
  assert.doesNotMatch(html, /dopamine addiction/i);
  assert.match(html, /company involvement|founder.*co-author/is);
  for (const phrase of ['Identify the trigger', 'Add friction', 'Choose a replacement', 'Time-box access', 'Review and adjust']) {
    assert.ok(html.includes(phrase), 'doomscrolling guide is missing ' + phrase);
  }
});

test('two-minute habit guide satisfies the evidence contract', () => {
  assertGuidePage({
    page: 'guides/two-minute-habit/index.html',
    canonical: 'https://habitbuilding.xyz/guides/two-minute-habit/',
    title: 'The Two-Minute Habit: How to Make a Smaller Fallback',
    h1: 'Use a two-minute fallback when the full habit does not fit',
    sources: [
      'https://pmc.ncbi.nlm.nih.gov/articles/PMC11641623/',
      'https://pmc.ncbi.nlm.nih.gov/articles/PMC3505409/'
    ]
  });
  const html = read('guides/two-minute-habit/index.html');
  assert.match(html, /not a magic threshold/i);
  assert.doesNotMatch(html, /habits take (?:21|66|70) days/i);
  assert.match(html, /70 days is Ascent's program design/i);
});

test('iPhone habit system guide satisfies the evidence contract', () => {
  assertGuidePage({
    page: 'guides/how-to-build-a-habit-on-iphone/index.html',
    canonical: 'https://habitbuilding.xyz/guides/how-to-build-a-habit-on-iphone/',
    title: 'How to Build a Habit on iPhone Using Widgets and Screen Time',
    h1: 'Build an iPhone habit system around cues, not more notifications',
    sources: [
      'https://support.apple.com/en-in/guide/iphone/-iphb8f1bf206/ios',
      'https://support.apple.com/en-gb/guide/iphone/iph5c3f5b77b/ios',
      'https://support.apple.com/en-sg/guide/iphone/iphb0c7313c9/ios',
      'https://support.apple.com/en-ie/guide/shortcuts/-apd690170742/ios',
      'https://pmc.ncbi.nlm.nih.gov/articles/PMC9226889/'
    ]
  });
  const html = read('guides/how-to-build-a-habit-on-iphone/index.html');
  for (const term of ['Widgets', 'Focus', 'Screen Time', 'Shortcuts']) assert.match(html, new RegExp(term));
  assert.match(html, /Focus silences or filters notifications/i);
  assert.match(html, /Screen Time limits or schedules app access/i);
});

test('guide content is connected to the authority graph', () => {
  const contracts = [
    ['index.html', [
      'href="guides/why-habit-trackers-fail/"',
      'href="guides/habit-tracker-vs-habit-builder/"',
      'href="guides/how-to-stop-doomscrolling/"',
      'href="guides/two-minute-habit/"',
      'href="guides/how-to-build-a-habit-on-iphone/"'
    ]],
    ['ascent/index.html', ['href="../guides/how-to-build-a-habit-on-iphone/"', 'href="../guides/habit-tracker-vs-habit-builder/"']],
    ['science/index.html', ['href="../guides/why-habit-trackers-fail/"', 'href="../guides/two-minute-habit/"']],
    ['best/app-blockers-iphone/index.html', ['href="../../guides/how-to-stop-doomscrolling/"']],
    ['best/habit-tracker-with-app-blocking/index.html', ['href="../../guides/habit-tracker-vs-habit-builder/"']],
    ['compare/index.html', ['href="../guides/habit-tracker-vs-habit-builder/"']]
  ];
  for (const [page, fragments] of contracts) {
    const html = read(page);
    for (const fragment of fragments) assert.ok(html.includes(fragment), page + ' is missing ' + fragment);
  }
});

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

test('Finch comparison satisfies the editorial contract', () => {
  assertHeadToHeadPage({
    slug: 'ascent-vs-finch',
    competitor: 'Finch',
    title: 'Ascent vs Finch (2026): Habit Goal or Self-Care Pet?',
    h1: 'Ascent vs Finch: focused habit or self-care companion?',
    source: 'https://help.finchcare.com/hc/en-us/articles/37935669335309-Our-Approach-to-Self-Care',
    entityUrl: 'https://finchcare.com/',
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
    entityUrl: 'https://streaksapp.com/',
    questions: [
      'Is Ascent or Streaks the better iPhone habit tracker?',
      'Does Streaks block distracting apps?',
      'Can Ascent and Streaks be used together?'
    ]
  });
});

test('one sec comparison satisfies the editorial contract', () => {
  assertHeadToHeadPage({
    slug: 'ascent-vs-one-sec',
    competitor: 'one sec',
    title: 'Ascent vs one sec (2026): Build Habits or Stop Scrolling?',
    h1: 'Ascent vs one sec: build the replacement or interrupt the reflex?',
    metaDescription: 'Compare Ascent and one sec for stopping doomscrolling: specialized app and browser interruptions, or a 70-day goal plan with daily actions and a fallback.',
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
    metaDescription: 'Compare Ascent and Opal: choose strict focus rules, app blocking and screen-time analytics, or a 70-day positive habit plan with a visible daily fallback.',
    source: 'https://opalapp.com/screentime',
    entityUrl: 'https://opalapp.com/',
    questions: [
      'Is Ascent or Opal the better app blocker?',
      'Does Opal help build positive habits?',
      'Can Ascent and Opal be used together?'
    ]
  });
});

test('sitemap discovers all comparison pages exactly once with current lastmod', () => {
  const entries = parseSitemapEntries(read('sitemap.xml'));
  const urls = entries.map((entry) => entry.loc);
  assert.equal(entries.length, expectedPublicUrls.length);
  assert.equal(urls.length, expectedPublicUrls.length);
  assert.equal(new Set(urls).size, urls.length);
  assert.deepEqual(new Set(urls), new Set(expectedPublicUrls));
  for (const slug of headToHeadSlugs) {
    const url = 'https://habitbuilding.xyz/compare/' + slug + '/';
    const matches = entries.filter((entry) => entry.loc === url);
    assert.equal(matches.length, 1, 'sitemap mismatch for ' + url);
    assert.equal(matches[0].lastmod, '2026-07-22', 'stale lastmod for ' + url);
  }
  for (const url of [
    'https://habitbuilding.xyz/',
    'https://habitbuilding.xyz/compare/',
    'https://habitbuilding.xyz/science/',
    ...guideRoutes.map(([, canonical]) => canonical)
  ]) {
    const matches = entries.filter((entry) => entry.loc === url);
    assert.equal(matches.length, 1, 'sitemap mismatch for ' + url);
    assert.equal(matches[0].lastmod, '2026-07-22', 'stale lastmod for ' + url);
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
    'ascent/index.html',
    'methodology/index.html',
    ...decisionRoutes.map(([page]) => page),
    ...guideRoutes.map(([page]) => page),
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
    assert.doesNotMatch(html, staleDurationPattern, page + ' contains stale duration');
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
  assert.doesNotMatch(copy, metadataProhibitedPattern);
});

test('sitemap discovery check accepts CRLF XML fixtures', () => {
  const xml = read('sitemap.xml');
  const crlfFixture = xml.replaceAll('\n', '\r\n');
  assert.deepEqual(parseSitemapEntries(crlfFixture), parseSitemapEntries(xml));
  assert.deepEqual(
    new Set(parseSitemapEntries(crlfFixture).map((entry) => entry.loc)),
    new Set(expectedPublicUrls)
  );
});

test('stale-copy guards catch typographic durations and real currency symbols', () => {
  for (const duration of ['60 day', '60-day', '60‐day', '60‑day', '60‒day', '60–day', '60—day', '60−day']) {
    assert.match(duration, staleDurationPattern, 'missing stale duration variant: ' + duration);
  }
  for (const currency of ['£', '€']) {
    assert.match(currency, metadataProhibitedPattern, 'missing prohibited currency: ' + currency);
  }
});
