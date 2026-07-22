import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(join(root, path), 'utf8');
const canonicalAppStoreUrl = 'https://apps.apple.com/us/app/ascent-habit-builder-focus/id6756843194';

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

function assertHeadToHeadPage(spec) {
  const page = 'compare/' + spec.slug + '/index.html';
  assert.ok(existsSync(join(root, page)), page + ' is missing');
  const html = read(page);

  assert.ok(html.includes('<title>' + spec.title + '</title>'));
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
  assert.equal((html.match(/data-dimension="/g) || []).length, 5, page + ' needs five dimensions');
  assert.match(html, new RegExp('Choose ' + spec.competitor + ' if'));
  assert.match(html, /Choose Ascent if/);
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
  for (const item of faq.mainEntity) {
    assert.ok(html.includes(item.name), page + ' is missing visible FAQ question');
    assert.ok(html.includes(item.acceptedAnswer.text), page + ' is missing visible FAQ answer');
  }
  const ascent = entities.find((item) => item['@id'] === 'https://habitbuilding.xyz/#ascent-app');
  assert.ok(ascent, page + ' is missing the shared Ascent entity');
  assert.equal(ascent.downloadUrl, canonicalAppStoreUrl);
  assert.deepEqual(ascent.sameAs, [canonicalAppStoreUrl]);
  assert.equal(ascent.identifier.value, '6756843194');
  assert.ok(entities.some((item) => item['@type'] === 'SoftwareApplication' && item.name === spec.competitor));
  assert.ok(!entities.some((item) => ['Review', 'AggregateRating'].includes(item['@type'])));

  for (const question of spec.questions) {
    assert.ok(html.split(question).length >= 3, page + ' must mirror FAQ question: ' + question);
  }
}

test('head-to-head stylesheet is responsive and accessible', () => {
  const css = read('compare/head-to-head.css');
  assert.match(css, /a:focus-visible/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /@media\s*\(max-width:\s*700px\)/);
  assert.doesNotMatch(css, /translateY|text-shadow|box-shadow:\s*0\s+0/);
  assert.match(css, /header\{[^}]*background:var\(--paper\)/);
  assert.doesNotMatch(css, /backdrop-filter/);
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
