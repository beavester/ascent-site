import { readFileSync } from 'node:fs';

const site = 'https://habitbuilding.xyz/';
const config = JSON.parse(readFileSync(new URL('../indexnow.json', import.meta.url), 'utf8'));
const inputs = process.argv.slice(2);

if (inputs.length === 0) {
  console.error('Usage: node scripts/submit-indexnow.mjs /path/ [https://habitbuilding.xyz/other/]');
  process.exit(1);
}

const urlList = [...new Set(inputs.map((input) => new URL(input, site).href))];
for (const url of urlList) {
  if (new URL(url).origin !== new URL(site).origin) {
    console.error('Refusing non-canonical host: ' + url);
    process.exit(1);
  }
}

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: 'habitbuilding.xyz',
    key: config.key,
    keyLocation: config.keyLocation,
    urlList
  })
});

console.log(JSON.stringify({ status: response.status, submitted: urlList }, null, 2));
if (![200, 202].includes(response.status)) process.exit(1);
