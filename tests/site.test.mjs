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
const expectedPublicUrls = [
  'https://habitbuilding.xyz/',
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
    'Getting your receptors back'
  ]) {
    assert.ok(!html.includes(phrase), `overstatement remains: ${phrase}`);
  }
  assert.match(html, /does not establish the same mechanism for ordinary phone use/i);
  assert.match(html, /not, by itself, proof/i);
  assert.doesNotMatch(html, /60[- ]day/i);
  assert.match(html, /70 days/i);
});

test('key pages contain no missing local href targets', () => {
  for (const page of [
    'index.html',
    'compare/index.html',
    'compare/ascent-vs-fabulous/index.html',
    'compare/ascent-vs-tiimo/index.html',
    'compare/ascent-vs-routinery/index.html',
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
  assert.equal(urls.length, 14);
  assert.equal(new Set(urls).size, urls.length);
  assert.deepEqual(new Set(urls), new Set(expectedPublicUrls));
  for (const slug of headToHeadSlugs) {
    const url = 'https://habitbuilding.xyz/compare/' + slug + '/';
    const matches = entries.filter((entry) => entry.loc === url);
    assert.equal(matches.length, 1, 'sitemap mismatch for ' + url);
    assert.equal(matches[0].lastmod, '2026-07-22', 'stale lastmod for ' + url);
  }
  for (const url of ['https://habitbuilding.xyz/', 'https://habitbuilding.xyz/compare/']) {
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
