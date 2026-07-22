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
