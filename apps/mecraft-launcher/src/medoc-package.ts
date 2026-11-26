import { compareSemver } from '@mecraft/core-bridge';

export interface MeDocPackage {
  version: string;
  releaseTag: string;
  sha256: string;
  sizeBytes: number;
}

interface GitHubRelease {
  tag_name?: unknown;
  prerelease?: unknown;
  draft?: unknown;
  assets?: Array<{ name?: unknown; browser_download_url?: unknown; digest?: unknown; size?: unknown }>;
}

export function resolveMeDocPackage(release: GitHubRelease): MeDocPackage | null {
  const tag = release?.tag_name;
  if (typeof tag !== 'string' || release.prerelease !== false || release.draft !== false) return null;
  const match = /^(?:medoc-)?v((?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*))$/.exec(tag);
  const version = match?.[1];
  if (!version || version.length > 24 || !Array.isArray(release.assets)) return null;

  const url = `https://github.com/methastrategy/meCraft/releases/download/${tag}/medoc.exe`;
  const asset = release.assets.find(item => item?.name === 'medoc.exe' && item.browser_download_url === url);
  if (typeof asset?.digest !== 'string' || typeof asset.size !== 'number') return null;
  const digest = /^sha256:([a-f0-9]{64})$/i.exec(asset.digest);
  if (!digest || !Number.isSafeInteger(asset.size) ||
      asset.size < 1 || asset.size > 512 * 1024 * 1024) return null;

  return { version, releaseTag: tag, sha256: digest[1], sizeBytes: asset.size };
}

export function selectMeDocPackage(releases: GitHubRelease[]): MeDocPackage | null {
  return releases.reduce<MeDocPackage | null>((best, release) => {
    const candidate = resolveMeDocPackage(release);
    if (candidate && (!best || compareSemver(candidate.version, best.version) > 0)) return candidate;
    return best;
  }, null);
}

const CATALOG_CACHE = 'mecraft.catalog.v1';

export function parseMeDocCatalog(input: unknown): MeDocPackage | null {
  if (!input || typeof input !== 'object' || !('schemaVersion' in input) || input.schemaVersion !== 1 ||
      !('packages' in input) || !Array.isArray(input.packages)) return null;
  const releases: GitHubRelease[] = [];
  for (const item of input.packages) {
    if (item?.appId !== 'medoc' || item.platform !== 'windows-x64' ||
        typeof item.version !== 'string' ||
        (item.releaseTag !== `v${item.version}` && item.releaseTag !== `medoc-v${item.version}`)) continue;
    releases.push({
      tag_name: item.releaseTag, prerelease: false, draft: false,
      assets: [{ name: 'medoc.exe', browser_download_url: item.url, digest: `sha256:${item.sha256}`, size: item.sizeBytes }],
    });
  }
  return selectMeDocPackage(releases);
}

export async function fetchMeDocPackage(): Promise<MeDocPackage | null> {
  try {
    const response = await fetch('https://mecrafts.vercel.app/catalog/v1.json', {
      signal: AbortSignal.timeout(6000),
    });
    if (!response.ok) throw new Error('Package catalog unavailable');
    const catalog: unknown = await response.json();
    const candidate = parseMeDocCatalog(catalog);
    if (!candidate) throw new Error('Package catalog failed validation');
    try { localStorage.setItem(CATALOG_CACHE, JSON.stringify(catalog)); } catch { /* Storage is optional. */ }
    return candidate;
  } catch {
    try { return parseMeDocCatalog(JSON.parse(localStorage.getItem(CATALOG_CACHE) ?? 'null')); }
    catch { return null; }
  }
}

export function meDocPrimaryAction(
  installed: boolean,
  installedVersion: string | null | undefined,
  available: MeDocPackage | null,
): 'install' | 'open' | 'update' | 'retry' {
  if (!installed) return available ? 'install' : 'retry';
  if (available && (!installedVersion || compareSemver(available.version, installedVersion) > 0)) {
    return 'update';
  }
  return 'open';
}
