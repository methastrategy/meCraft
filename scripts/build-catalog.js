import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const VALID_CATEGORIES = new Set(['document', 'photo', 'vector', 'video', 'audio', 'utility']);
const VALID_STATUSES = new Set(['active', 'preview', 'in-dev']);
const VALID_PLATFORMS = new Set(['web', 'windows', 'ios', 'android']);
const VALID_CHANNEL_TYPES = new Set([
  'web-app',
  'windows-msi',
  'windows-exe',
  'app-store',
  'testflight',
  'google-play',
  'android-apk',
]);
const DIRECT_DOWNLOAD_TYPES = new Set(['windows-msi', 'windows-exe', 'android-apk']);
const VALID_ARCHES = new Set(['x64', 'arm64', 'universal']);
const VALID_STABILITIES = new Set(['stable', 'preview']);
const MAX_PACKAGE_BYTES = 512 * 1024 * 1024;
const ID_REGEX = /^[a-z0-9][a-z0-9-]{1,31}$/;
const SHA256_REGEX = /^[a-f0-9]{64}$/i;

export function validateCatalogRegistry(registry) {
  const errors = [];
  if (!registry || typeof registry !== 'object' || !Array.isArray(registry.products)) {
    return ['Registry must be an object with a products array'];
  }

  const seenIds = new Set();
  for (let i = 0; i < registry.products.length; i++) {
    const p = registry.products[i];
    const prefix = `products[${i}] (${p?.id ?? 'unknown'})`;

    if (!p || typeof p !== 'object') {
      errors.push(`${prefix}: product must be an object`);
      continue;
    }
    if (typeof p.id !== 'string' || !ID_REGEX.test(p.id)) {
      errors.push(`${prefix}: invalid id '${p.id}'`);
    } else if (seenIds.has(p.id)) {
      errors.push(`${prefix}: duplicate id '${p.id}'`);
    } else {
      seenIds.add(p.id);
    }

    if (typeof p.name !== 'string' || !p.name.trim()) {
      errors.push(`${prefix}: missing name`);
    }
    if (!VALID_CATEGORIES.has(p.category)) {
      errors.push(`${prefix}: invalid category '${p.category}'`);
    }
    if (!VALID_STATUSES.has(p.status)) {
      errors.push(`${prefix}: invalid status '${p.status}'`);
    }
    for (const field of ['categoryLabel', 'tagline', 'description']) {
      if (!p[field] || typeof p[field].en !== 'string' || !p[field].en.trim() ||
          typeof p[field].th !== 'string' || !p[field].th.trim()) {
        errors.push(`${prefix}: missing ${field}.{en,th}`);
      }
    }
    if (!Array.isArray(p.channels)) {
      errors.push(`${prefix}: channels must be an array`);
      continue;
    }
    if (p.status === 'in-dev' && p.channels.length > 0) {
      errors.push(`${prefix}: in-dev products must not expose install/launch channels`);
    }

    for (let j = 0; j < p.channels.length; j++) {
      const ch = p.channels[j];
      const chPrefix = `${prefix}.channels[${j}]`;
      if (!ch || typeof ch !== 'object') {
        errors.push(`${chPrefix}: channel must be an object`);
        continue;
      }
      if (!VALID_PLATFORMS.has(ch.platform)) {
        errors.push(`${chPrefix}: invalid platform '${ch.platform}'`);
      }
      if (!VALID_CHANNEL_TYPES.has(ch.type)) {
        errors.push(`${chPrefix}: invalid type '${ch.type}'`);
      }
      if (!VALID_STABILITIES.has(ch.stability)) {
        errors.push(`${chPrefix}: invalid stability '${ch.stability}'`);
      }
      if (typeof ch.version !== 'string' || !ch.version.trim()) {
        errors.push(`${chPrefix}: missing version`);
      }
      try {
        const parsedUrl = new URL(ch.url);
        if (parsedUrl.protocol !== 'https:') {
          errors.push(`${chPrefix}: url must use https:// ('${ch.url}')`);
        }
      } catch {
        errors.push(`${chPrefix}: invalid url '${ch.url}'`);
      }

      if (DIRECT_DOWNLOAD_TYPES.has(ch.type)) {
        if (!VALID_ARCHES.has(ch.arch)) {
          errors.push(`${chPrefix}: direct download requires valid arch ('${ch.arch}')`);
        }
        if (!Number.isSafeInteger(ch.sizeBytes) || ch.sizeBytes < 1 || ch.sizeBytes > MAX_PACKAGE_BYTES) {
          errors.push(`${chPrefix}: direct download requires valid sizeBytes (${ch.sizeBytes})`);
        }
        if (typeof ch.sha256 !== 'string' || !SHA256_REGEX.test(ch.sha256)) {
          errors.push(`${chPrefix}: direct download requires 64-char hex sha256`);
        }
      }
    }
  }

  return errors;
}

export function buildCatalogFiles({
  registryPath = path.join(rootDir, 'catalog', 'registry.json'),
  outDir = path.join(rootDir, 'public', 'catalog'),
} = {}) {
  const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
  const errors = validateCatalogRegistry(registry);
  if (errors.length > 0) {
    throw new Error(`Catalog validation failed:\n  - ${errors.join('\n  - ')}`);
  }

  const v2 = {
    schemaVersion: 2,
    generatedAt: new Date().toISOString(),
    products: registry.products,
  };

  // Preserve v1.json compatibility for legacy Launchers (medoc Windows package)
  const v1Packages = [];
  for (const product of registry.products) {
    if (product.id !== 'medoc') continue;
    for (const ch of product.channels) {
      if (ch.platform === 'windows' && ch.type === 'windows-exe' && ch.launcherManaged) {
        v1Packages.push({
          appId: product.id,
          platform: `windows-${ch.arch || 'x64'}`,
          version: ch.version,
          releaseTag: ch.releaseTag || `v${ch.version}`,
          url: ch.url,
          sizeBytes: ch.sizeBytes,
          sha256: ch.sha256,
        });
      }
    }
  }

  const v1 = {
    schemaVersion: 1,
    packages: v1Packages,
  };

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'v2.json'), JSON.stringify(v2, null, 2) + '\n', 'utf8');
  fs.writeFileSync(path.join(outDir, 'v1.json'), JSON.stringify(v1, null, 2) + '\n', 'utf8');

  return { v2, v1 };
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === __filename;
if (isDirectRun) {
  const { v2, v1 } = buildCatalogFiles();
  console.log(`[build-catalog] Generated public/catalog/v2.json (${v2.products.length} products) and v1.json (${v1.packages.length} packages).`);
}
