import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  ascentAppId,
  ascentOrganizationSchema,
  ascentProduct,
  ascentSoftwareSchema,
  ascentWebsiteSchema,
  assertAscentProductFacts
} from './ascent-product-facts.mjs';

const root = resolve(new URL('..', import.meta.url).pathname);
const product = assertAscentProductFacts();
const json = (value) => JSON.stringify(value).replaceAll('<', '\\u003c');
const esc = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

function replaceMarker(path, marker, content) {
  const destination = resolve(root, path);
  const source = readFileSync(destination, 'utf8');
  const expression = new RegExp(`<!-- ${marker}:START -->[\\s\\S]*?<!-- ${marker}:END -->`, 'g');
  const matches = source.match(expression) || [];
  if (matches.length !== 1) throw new Error(`${path} must contain exactly one ${marker} marker`);
  const next = source.replace(expression, `<!-- ${marker}:START -->\n${content}\n<!-- ${marker}:END -->`);
  writeFileSync(destination, next, 'utf8');
}

const homeSchemas = {
  '@context': 'https://schema.org',
  '@graph': [
    ascentOrganizationSchema(product),
    ascentWebsiteSchema(product),
    {
      '@type': 'WebPage',
      '@id': 'https://habitbuilding.xyz/#webpage',
      url: product.identity.website,
      name: `${product.identity.shortName}: iPhone Habit Builder & App Blocker`,
      isPartOf: { '@id': 'https://habitbuilding.xyz/#website' },
      about: { '@id': ascentAppId }
    },
    ascentSoftwareSchema(product)
  ]
};

const productSchemas = {
  '@context': 'https://schema.org',
  '@graph': [
    ascentOrganizationSchema(product),
    ascentSoftwareSchema(product),
    {
      '@type': 'Article',
      '@id': 'https://habitbuilding.xyz/ascent/#article',
      headline: `${product.identity.name} official guide`,
      dateModified: product.lastVerified,
      mainEntityOfPage: product.identity.canonicalProductPage,
      author: { '@id': 'https://habitbuilding.xyz/#ascent-publisher' },
      publisher: { '@id': 'https://habitbuilding.xyz/#ascent-publisher' },
      about: { '@id': ascentAppId }
    }
  ]
};

const comparisonSchemas = {
  '@context': 'https://schema.org',
  '@graph': [
    ascentOrganizationSchema(product),
    ascentSoftwareSchema(product)
  ]
};

const methodologySchemas = {
  '@context': 'https://schema.org',
  '@graph': [
    ascentOrganizationSchema(product),
    ascentWebsiteSchema(product)
  ]
};

const planCards = product.plans.map((plan) => `
        <article>
          <h3>${esc(plan.name)}</h3>
          <p><strong>${esc(plan.priceModel)}</strong><br>${esc(plan.habitLimit)} · ${esc(plan.curriculumAccess)}</p>
        </article>`).join('');

const productFactsHtml = `<section id="plans-and-availability">
    <div class="wrap reading prose">
      <h2>Plans and availability</h2>
      <p>Ascent is a free iPhone app with optional auto-renewing subscriptions. It is documented for ${esc(product.availability.platforms.join(', '))} and requires ${esc(product.availability.minimumOperatingSystem)}.</p>
      <div class="split">${planCards}
      </div>
      <p>Subscription prices vary by region and are shown in the app before purchase. ${esc(product.productModel.screenTime)}</p>
      <p>${esc(product.productModel.ai)}</p>
      <p class="review-date">Product facts verified ${esc(product.lastVerified)} against the <a href="${esc(product.identity.appStoreUrl)}">Apple App Store listing</a> and current product configuration. <a href="../data/ascent-product.json">View the versioned product facts record</a>.</p>
    </div>
  </section>`;

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is Ascent free?',
      acceptedAnswer: { '@type': 'Answer', text: 'Ascent is free to download. The Standard tier supports up to 3 habits and basic features. Optional auto-renewing subscriptions add higher habit limits and additional features; prices vary by region and are shown in the app before purchase.' }
    },
    {
      '@type': 'Question',
      name: 'How many goals and habits does Ascent support?',
      acceptedAnswer: { '@type': 'Answer', text: product.productModel.goalModel + ' The public plan limits are up to 3 habits on Standard, up to 15 on Subscriber, and unlimited on Architect.' }
    },
    {
      '@type': 'Question',
      name: 'Does Ascent require Screen Time access?',
      acceptedAnswer: { '@type': 'Answer', text: product.productModel.screenTime }
    },
    {
      '@type': 'Question',
      name: 'Does Ascent use AI?',
      acceptedAnswer: { '@type': 'Answer', text: product.productModel.ai }
    },
    {
      '@type': 'Question',
      name: 'What devices does Ascent support?',
      acceptedAnswer: { '@type': 'Answer', text: `Ascent is documented for ${product.availability.platforms.join(', ')} and requires ${product.availability.minimumOperatingSystem}.` }
    }
  ]
};

replaceMarker('index.html', 'ASCENT_HOME_ENTITY', `<script type="application/ld+json">${json(homeSchemas)}</script>`);
replaceMarker('ascent/index.html', 'ASCENT_PRODUCT_ENTITY', `<script type="application/ld+json">${json(productSchemas)}</script>`);
replaceMarker('ascent/index.html', 'ASCENT_PRODUCT_FACTS', productFactsHtml);
replaceMarker('ascent/index.html', 'ASCENT_PRODUCT_FAQ', `<script type="application/ld+json">${json(faqSchema)}</script>`);
replaceMarker('compare/index.html', 'ASCENT_COMPARISON_ENTITY', `<script type="application/ld+json">${json(comparisonSchemas)}</script>`);
replaceMarker('methodology/index.html', 'ASCENT_METHODOLOGY_ENTITY', `<script type="application/ld+json">${json(methodologySchemas)}</script>`);

console.log(`Rendered version ${ascentProduct.schemaVersion} product facts into the homepage and canonical Ascent guide.`);
