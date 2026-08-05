const site = 'https://habitbuilding.xyz';
const userAgent = 'AscentDiscoveryAudit/1.0 (+https://habitbuilding.xyz/methodology/)';

function sitemapUrls(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());
}

function noindexDirective(html, header) {
  return /\bnoindex\b/i.test(header || '')
    || /<meta\b[^>]*(?:name=["'](?:robots|googlebot)["'][^>]*content=["'][^"']*\bnoindex\b|content=["'][^"']*\bnoindex\b[^"']*["'][^>]*name=["'](?:robots|googlebot)["'])[^>]*>/i.test(html);
}

async function fetchRequired(url) {
  const response = await fetch(url, {
    redirect: 'manual',
    headers: { 'user-agent': userAgent }
  });
  const text = await response.text();
  return { response, text };
}

const robots = await fetchRequired(site + '/robots.txt');
const sitemap = await fetchRequired(site + '/sitemap.xml');
const failures = [];

if (robots.response.status !== 200) failures.push('robots.txt returned ' + robots.response.status);
if (!robots.text.includes('Sitemap: ' + site + '/sitemap.xml')) failures.push('robots.txt does not declare the canonical sitemap');
if (sitemap.response.status !== 200) failures.push('sitemap.xml returned ' + sitemap.response.status);

const urls = sitemapUrls(sitemap.text);
if (urls.length === 0) failures.push('sitemap.xml contains no URLs');
if (new Set(urls).size !== urls.length) failures.push('sitemap.xml contains duplicate URLs');

const results = [];
for (const url of urls) {
  const { response, text } = await fetchRequired(url);
  const canonical = text.match(/<link rel="canonical" href="([^"]+)">/i)?.[1] || null;
  const xRobotsTag = response.headers.get('x-robots-tag') || '';
  const result = {
    url,
    status: response.status,
    redirect: response.headers.get('location'),
    contentType: response.headers.get('content-type'),
    responseBytes: Buffer.byteLength(text),
    canonical,
    xRobotsTag: xRobotsTag || null
  };
  results.push(result);

  if (response.status !== 200) failures.push(url + ' returned ' + response.status);
  if (response.headers.get('location')) failures.push(url + ' returned a redirect instead of its canonical document');
  if (!response.headers.get('content-type')?.includes('text/html')) failures.push(url + ' did not return HTML');
  if (canonical !== url) failures.push(url + ' has canonical ' + (canonical || 'missing'));
  if (noindexDirective(text, xRobotsTag)) failures.push(url + ' is marked noindex');
}

console.log(JSON.stringify({
  auditedAt: new Date().toISOString(),
  site,
  sitemapUrls: urls.length,
  robots: { status: robots.response.status, responseBytes: Buffer.byteLength(robots.text) },
  sitemap: { status: sitemap.response.status, responseBytes: Buffer.byteLength(sitemap.text) },
  pages: results,
  failures
}, null, 2));

if (failures.length) process.exit(1);
