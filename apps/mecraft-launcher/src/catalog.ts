import type { MeDocPackage } from './medoc-package';

export type CatalogPlatform = 'web' | 'windows' | 'ios' | 'android';
export type CatalogChannelType =
  | 'web-app'
  | 'windows-msi'
  | 'windows-exe'
  | 'app-store'
  | 'testflight'
  | 'google-play'
  | 'android-apk';
export type CatalogStatus = 'active' | 'preview' | 'in-dev';
export type CatalogCategory = 'document' | 'photo' | 'vector' | 'video' | 'audio' | 'utility';

export interface LocalizedText {
  en: string;
  th: string;
}

export interface CatalogChannel {
  platform: CatalogPlatform;
  type: CatalogChannelType;
  stability: 'stable' | 'preview';
  version: string;
  releaseTag?: string;
  arch?: 'x64' | 'arm64' | 'universal';
  url: string;
  sizeBytes?: number;
  sha256?: string;
  launcherManaged?: boolean;
}

export interface CatalogProduct {
  id: string;
  name: string;
  category: CatalogCategory;
  categoryLabel: LocalizedText;
  tagline: LocalizedText;
  description: LocalizedText;
  status: CatalogStatus;
  version: string;
  icon: string;
  image?: string;
  accentColor: string;
  glowColor: string;
  keywords: string[];
  specs?: { en: string[]; th: string[] };
  supportedFormats?: string[];
  channels: CatalogChannel[];
}

export interface CatalogV2 {
  schemaVersion: 2;
  generatedAt?: string;
  products: CatalogProduct[];
}

export interface CatalogFilter {
  query?: string;
  category?: CatalogCategory | 'all';
  platform?: CatalogPlatform | 'all';
  status?: CatalogStatus | 'all';
}

export interface CatalogFetchResult {
  catalog: CatalogV2 | null;
  fromCache: boolean;
  error?: string;
}

const VALID_CATEGORIES = new Set<string>(['document', 'photo', 'vector', 'video', 'audio', 'utility']);
const VALID_STATUSES = new Set<string>(['active', 'preview', 'in-dev']);
const VALID_PLATFORMS = new Set<string>(['web', 'windows', 'ios', 'android']);
const VALID_CHANNEL_TYPES = new Set<string>([
  'web-app',
  'windows-msi',
  'windows-exe',
  'app-store',
  'testflight',
  'google-play',
  'android-apk',
]);
const DIRECT_DOWNLOAD_TYPES = new Set<string>(['windows-msi', 'windows-exe', 'android-apk']);
const VALID_ARCHES = new Set<string>(['x64', 'arm64', 'universal']);
const MAX_PACKAGE_BYTES = 512 * 1024 * 1024;
const ID_REGEX = /^[a-z0-9][a-z0-9-]{1,31}$/;
const SHA256_REGEX = /^[a-f0-9]{64}$/i;

export const CATALOG_V2_CACHE_KEY = 'mecraft.catalog.v2';
export const DEFAULT_DESKTOP_CATALOG_V2_URL = 'https://mecrafts.vercel.app/catalog/v2.json';
export const DEFAULT_WEB_CATALOG_V2_URL = '/catalog/v2.json';

function isValidHttpsUrl(raw: unknown): raw is string {
  if (typeof raw !== 'string') return false;
  try {
    return new URL(raw).protocol === 'https:';
  } catch {
    return false;
  }
}

export function parseCatalogV2(input: unknown): CatalogV2 | null {
  if (!input || typeof input !== 'object') return null;
  const raw = input as Record<string, unknown>;
  if (raw.schemaVersion !== 2 || !Array.isArray(raw.products)) return null;

  const seenIds = new Set<string>();
  const products: CatalogProduct[] = [];

  for (const item of raw.products) {
    if (!item || typeof item !== 'object') return null;
    const p = item as Record<string, unknown>;
    if (typeof p.id !== 'string' || !ID_REGEX.test(p.id) || seenIds.has(p.id)) return null;
    seenIds.add(p.id);

    if (typeof p.name !== 'string' || !p.name.trim()) return null;
    if (typeof p.category !== 'string' || !VALID_CATEGORIES.has(p.category)) return null;
    if (typeof p.status !== 'string' || !VALID_STATUSES.has(p.status)) return null;
    if (!Array.isArray(p.channels)) return null;
    if (p.status === 'in-dev' && p.channels.length > 0) return null;

    const categoryLabel = p.categoryLabel as LocalizedText | undefined;
    const tagline = p.tagline as LocalizedText | undefined;
    const description = p.description as LocalizedText | undefined;
    if (
      !categoryLabel?.en || !categoryLabel?.th ||
      !tagline?.en || !tagline?.th ||
      !description?.en || !description?.th
    ) {
      return null;
    }

    const channels: CatalogChannel[] = [];
    for (const chRaw of p.channels) {
      if (!chRaw || typeof chRaw !== 'object') return null;
      const ch = chRaw as Record<string, unknown>;
      if (typeof ch.platform !== 'string' || !VALID_PLATFORMS.has(ch.platform)) return null;
      if (typeof ch.type !== 'string' || !VALID_CHANNEL_TYPES.has(ch.type)) return null;
      if (ch.stability !== 'stable' && ch.stability !== 'preview') return null;
      if (typeof ch.version !== 'string' || !ch.version.trim()) return null;
      if (!isValidHttpsUrl(ch.url)) return null;

      if (DIRECT_DOWNLOAD_TYPES.has(ch.type)) {
        if (typeof ch.arch !== 'string' || !VALID_ARCHES.has(ch.arch)) return null;
        if (typeof ch.sizeBytes !== 'number' || !Number.isSafeInteger(ch.sizeBytes) ||
            ch.sizeBytes < 1 || ch.sizeBytes > MAX_PACKAGE_BYTES) {
          return null;
        }
        if (typeof ch.sha256 !== 'string' || !SHA256_REGEX.test(ch.sha256)) return null;
      }

      channels.push(ch as unknown as CatalogChannel);
    }

    products.push({
      ...(p as unknown as CatalogProduct),
      channels,
    });
  }

  return {
    schemaVersion: 2,
    generatedAt: typeof raw.generatedAt === 'string' ? raw.generatedAt : undefined,
    products,
  };
}

export function readCachedCatalogV2(): CatalogV2 | null {
  try {
    const raw = localStorage.getItem(CATALOG_V2_CACHE_KEY);
    if (!raw) return null;
    return parseCatalogV2(JSON.parse(raw));
  } catch {
    return null;
  }
}

export async function fetchCatalogV2(feedUrl: string): Promise<CatalogFetchResult> {
  try {
    const response = await fetch(feedUrl, {
      signal: AbortSignal.timeout(6000),
    });
    if (!response.ok) {
      throw new Error(`Catalog HTTP ${response.status}`);
    }
    const raw: unknown = await response.json();
    const parsed = parseCatalogV2(raw);
    if (!parsed) {
      throw new Error('Catalog v2 failed schema validation');
    }
    try {
      localStorage.setItem(CATALOG_V2_CACHE_KEY, JSON.stringify(parsed));
    } catch {
      /* Storage is optional. */
    }
    return { catalog: parsed, fromCache: false };
  } catch (err) {
    const cached = readCachedCatalogV2();
    const message = err instanceof Error ? err.message : 'Catalog unavailable';
    if (cached) {
      return { catalog: cached, fromCache: true, error: message };
    }
    return { catalog: null, fromCache: false, error: message };
  }
}

export function filterCatalogProducts(products: CatalogProduct[], filter: CatalogFilter): CatalogProduct[] {
  const q = (filter.query ?? '').trim().toLowerCase();
  const category = filter.category ?? 'all';
  const platform = filter.platform ?? 'all';
  const status = filter.status ?? 'all';

  return products.filter(product => {
    if (category !== 'all' && product.category !== category) return false;
    if (status !== 'all' && product.status !== status) return false;
    if (platform !== 'all' && !product.channels.some(ch => ch.platform === platform)) return false;

    if (!q) return true;
    return (
      product.id.toLowerCase().includes(q) ||
      product.name.toLowerCase().includes(q) ||
      product.tagline.en.toLowerCase().includes(q) ||
      product.tagline.th.toLowerCase().includes(q) ||
      product.description.en.toLowerCase().includes(q) ||
      product.description.th.toLowerCase().includes(q) ||
      product.keywords.some(k => k.toLowerCase().includes(q))
    );
  });
}

export function detectClientPlatform(userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : ''): CatalogPlatform {
  const ua = userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return 'ios';
  if (/android/.test(ua)) return 'android';
  if (/windows|win32|win64/.test(ua)) return 'windows';
  return 'web';
}

export function getRecommendedChannel(
  product: CatalogProduct,
  clientPlatform: CatalogPlatform,
): CatalogChannel | null {
  if (product.channels.length === 0) return null;
  const stableMatch = product.channels.find(ch => ch.platform === clientPlatform && ch.stability === 'stable');
  if (stableMatch) return stableMatch;
  const anyPlatformMatch = product.channels.find(ch => ch.platform === clientPlatform);
  if (anyPlatformMatch) return anyPlatformMatch;
  const webFallback = product.channels.find(ch => ch.platform === 'web' && ch.stability === 'stable');
  return webFallback ?? product.channels.find(ch => ch.platform === 'web') ?? product.channels[0];
}

export function getMeDocPackageFromCatalogV2(catalog: CatalogV2 | null): MeDocPackage | null {
  if (!catalog) return null;
  const medocs = catalog.products.find(p => p.id === 'medocs' || p.id === 'medoc');
  if (!medocs) return null;
  const win = medocs.channels.find(
    ch => ch.platform === 'windows' && ch.type === 'windows-exe' && ch.launcherManaged && ch.stability === 'stable',
  );
  if (!win || !win.sha256 || !win.sizeBytes) return null;
  const releaseTag = win.releaseTag || `v${win.version}`;
  const allowedUrls = [
    `https://github.com/methastrategy/meCraft/releases/download/${releaseTag}/medocs.exe`,
    `https://github.com/methastrategy/meCraft/releases/download/${releaseTag}/medoc.exe`,
    `https://github.com/methastrategy/medocs/releases/download/${releaseTag}/medocs.exe`,
  ];
  if (!allowedUrls.includes(win.url)) return null;
  return {
    version: win.version,
    releaseTag,
    sha256: win.sha256,
    sizeBytes: win.sizeBytes,
  };
}

export function parseProductRoute(pathname: string): string | null {
  if (typeof pathname !== 'string') return null;
  const match = /^\/apps\/([a-z0-9][a-z0-9-]{1,31})\/?$/i.exec(pathname.trim());
  if (!match) return null;
  const id = match[1].toLowerCase();
  return id === 'medoc' ? 'medocs' : id;
}
