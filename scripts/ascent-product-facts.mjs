import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const ascentProduct = JSON.parse(readFileSync(resolve(root, 'data/ascent-product.json'), 'utf8'));

const required = (value, label) => {
  if (!value) throw new Error(`Missing required Ascent product fact: ${label}`);
  return value;
};

export function assertAscentProductFacts(product = ascentProduct) {
  required(product.schemaVersion, 'schemaVersion');
  required(product.lastVerified, 'lastVerified');
  required(product.identity?.name, 'identity.name');
  required(product.identity?.shortName, 'identity.shortName');
  required(product.identity?.developer, 'identity.developer');
  required(product.identity?.appStoreUrl, 'identity.appStoreUrl');
  required(product.identity?.appStoreId, 'identity.appStoreId');
  required(product.productModel?.programLengthDays, 'productModel.programLengthDays');
  if (!Array.isArray(product.availability?.platforms) || product.availability.platforms.length === 0) {
    throw new Error('Ascent product facts need at least one documented platform');
  }
  if (!Array.isArray(product.plans) || product.plans.length < 1) {
    throw new Error('Ascent product facts need at least one plan');
  }
  return product;
}

assertAscentProductFacts();

export const ascentPublisherId = 'https://habitbuilding.xyz/#ascent-publisher';
export const ascentAppId = 'https://habitbuilding.xyz/#ascent-app';

export function ascentOrganizationSchema(product = ascentProduct) {
  return {
    '@type': 'Organization',
    '@id': ascentPublisherId,
    name: product.identity.publisher,
    url: product.identity.website,
    logo: 'https://habitbuilding.xyz/img/icon.png',
    founder: {
      '@type': 'Person',
      name: product.identity.developer,
      sameAs: [product.identity.appleDeveloperUrl]
    },
    sameAs: [product.identity.appStoreUrl]
  };
}

export function ascentWebsiteSchema(product = ascentProduct) {
  return {
    '@type': 'WebSite',
    '@id': 'https://habitbuilding.xyz/#website',
    name: product.identity.shortName,
    alternateName: 'HabitBuilding.xyz',
    url: product.identity.website,
    publisher: { '@id': ascentPublisherId }
  };
}

export function ascentSoftwareSchema(product = ascentProduct) {
  return {
    '@type': 'SoftwareApplication',
    '@id': ascentAppId,
    name: product.identity.name,
    alternateName: product.identity.shortName,
    applicationCategory: 'ProductivityApplication',
    operatingSystem: product.availability.minimumOperatingSystem,
    url: product.identity.canonicalProductPage,
    downloadUrl: product.identity.appStoreUrl,
    sameAs: [product.identity.appStoreUrl],
    identifier: {
      '@type': 'PropertyValue',
      propertyID: 'Apple App Store ID',
      value: product.identity.appStoreId
    },
    image: 'https://habitbuilding.xyz/img/icon.png',
    description: product.productModel.summary,
    applicationSubCategory: 'Habit building and attention management',
    offers: {
      '@type': 'Offer',
      price: 0,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    },
    author: { '@id': ascentPublisherId }
  };
}

export function ascentIndexRecord(product = ascentProduct) {
  return {
    name: product.identity.name,
    platforms: product.availability.platforms,
    pricingModel: 'Free with optional subscription',
    primaryJob: 'Connect one meaningful goal and several supporting habits to guided daily actions, smaller fallback actions, iPhone visibility, reflection, and optional app-blocking friction.',
    bestFor: 'People who want positive-habit guidance and distraction control to operate as one connected iPhone workflow.',
    mainLimitation: 'It is broader than a pure tracker or blocker, and a specialist app is simpler when only one narrow mechanism is needed.',
    sources: [
      { label: 'Official Ascent App Store listing', url: product.identity.appStoreUrl },
      { label: 'Canonical Ascent product guide', url: product.identity.canonicalProductPage },
      { label: 'Versioned product facts record', url: 'https://habitbuilding.xyz/data/ascent-product.json' }
    ],
    verifiedDate: product.lastVerified
  };
}
