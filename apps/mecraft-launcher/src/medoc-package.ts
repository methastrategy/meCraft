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

export async function fetchMeDocPackage(): Promise<MeDocPackage | null> {
  const response = await fetch('https://api.github.com/repos/methastrategy/meCraft/releases?per_page=100', {
    headers: { Accept: 'application/vnd.github+json' },
    signal: AbortSignal.timeout(6000),
  });
  if (!response.ok) throw new Error(`GitHub releases responded with ${response.status}`);
  const releases: unknown = await response.json();
  return Array.isArray(releases) ? selectMeDocPackage(releases) : null;
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
