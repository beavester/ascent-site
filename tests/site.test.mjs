import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(join(root, path), 'utf8');

test('homepage uses one 70-day promise', () => {
  const html = read('index.html');
  assert.doesNotMatch(html, /60[- ]day/i);
  assert.match(html, /70[- ]day/i);
});

test('navigation CTA has an explicit accessible foreground', () => {
  const html = read('index.html');
  assert.match(html, /\.nav-links \.btn\.primary\s*\{[^}]*color:var\(--paper\)/s);
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
  assert.match(html, /Last reviewed July 2026/);
  assert.match(html, /"@type"\s*:\s*"Article"/);
  assert.match(html, /"@type"\s*:\s*"ItemList"/);
  assert.match(html, /"@type"\s*:\s*"SoftwareApplication"/);
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
