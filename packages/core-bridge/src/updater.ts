/**
 * @file updater.ts
 * Universal In-App Update Engine for meCraft Suite & Studios.
 * Communicates with GitHub Releases API with SemVer comparison, asset resolution,
 * offline caching, and automated update payload construction.
 */

export interface ReleaseAsset {
  name: string;
  sizeBytes: number;
  downloadUrl: string;
  contentType: string;
}

export interface SoftwareUpdateInfo {
  hasUpdate: boolean;
  currentVersion: string;
  latestVersion: string;
  releaseTitle: string;
  releaseTag: string;
  releaseDate: string;
  changelog: string[];
  htmlUrl: string;
  suiteAsset?: ReleaseAsset;
  appAsset?: ReleaseAsset;
  allAssets: ReleaseAsset[];
  checkedAt: number;
  isOffline?: boolean;
  error?: string;
}

export interface CheckUpdateOptions {
  currentVersion?: string;
  appId?: string; // 'mecraft-suite' | 'mepdf' | 'mephoto' | 'medrop' | 'medoc'
  repoOwner?: string; // default: 'methastrategy'
  repoName?: string;  // default: 'meCraft'
  force?: boolean;
}

const UPDATE_CACHE_KEY = 'mecraft_update_cache';
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Strips 'v' or leading noise and parses numeric semver tuple [major, minor, patch]
 */
export function parseSemver(versionStr: string): [number, number, number] {
  if (!versionStr) return [1, 0, 0];
  const cleaned = versionStr.replace(/^[vV]/, '').trim();
  const match = cleaned.match(/^(\d+)(?:\.(\d+))?(?:\.(\d+))?/);
  if (!match) return [1, 0, 0];

  const major = parseInt(match[1] || '0', 10);
  const minor = parseInt(match[2] || '0', 10);
  const patch = parseInt(match[3] || '0', 10);
  return [major, minor, patch];
}

/**
 * Compare two semver strings.
 * Returns 1 if v1 > v2, -1 if v1 < v2, 0 if equal.
 */
export function compareSemver(v1: string, v2: string): number {
  const [maj1, min1, pat1] = parseSemver(v1);
  const [maj2, min2, pat2] = parseSemver(v2);

  if (maj1 !== maj2) return maj1 > maj2 ? 1 : -1;
  if (min1 !== min2) return min1 > min2 ? 1 : -1;
  if (pat1 !== pat2) return pat1 > pat2 ? 1 : -1;
  return 0;
}

/**
 * Parse Markdown release body into concise changelog bullet points.
 */
export function extractChangelogItems(markdownBody: string | undefined): string[] {
  if (!markdownBody || !markdownBody.trim()) {
    return ['การปรับปรุงประสิทธิภาพและความเสถียรทั่วไป (General performance and stability updates)'];
  }

  const lines = markdownBody.split(/\r?\n/);
  const bullets: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('+ ')) {
      const item = trimmed.replace(/^[\*\-•\+]\s+/, '').trim();
      if (item && !item.toLowerCase().includes('full changelog') && !item.startsWith('http')) {
        bullets.push(item);
      }
    }
  }

  if (bullets.length === 0) {
    const nonHeaders = lines.map(l => l.trim()).filter(l => l && !l.startsWith('#') && !l.startsWith('http'));
    if (nonHeaders.length > 0) {
      bullets.push(...nonHeaders.slice(0, 5));
    } else {
      bullets.push('การปรับปรุงระบบและความปลอดภัยล่าสุด (Latest security and feature enhancements)');
    }
  }

  return bullets.slice(0, 6); // Max 6 prominent bullets
}

/**
 * Check for updates against GitHub Releases API with caching and error resilience.
 */
export async function checkSoftwareUpdate(options: CheckUpdateOptions = {}): Promise<SoftwareUpdateInfo> {
  const currentVersion = options.currentVersion || '1.0.0';
  const repoOwner = options.repoOwner || 'methastrategy';
  const repoName = options.repoName || 'meCraft';
  const appId = options.appId || 'mecraft-suite';
  const cacheKey = `${UPDATE_CACHE_KEY}_${appId}`;

  // 1. Check local cache if not forced
  if (!options.force && typeof localStorage !== 'undefined') {
    try {
      const cachedStr = localStorage.getItem(cacheKey);
      if (cachedStr) {
        const cached: SoftwareUpdateInfo = JSON.parse(cachedStr);
        if (Date.now() - cached.checkedAt < CACHE_TTL_MS) {
          cached.hasUpdate = compareSemver(cached.latestVersion, currentVersion) > 0;
          return cached;
        }
      }
    } catch {
      // Ignore cache parse failures
    }
  }

  const endpoint = `https://api.github.com/repos/${repoOwner}/${repoName}/releases/latest`;

  try {
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timeoutId = controller ? setTimeout(() => controller.abort(), 6000) : null;

    const response = await fetch(endpoint, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
      signal: controller ? controller.signal : undefined,
    });

    if (timeoutId) clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`GitHub API returned status ${response.status}`);
    }

    const data = await response.json();
    const rawTag: string = data.tag_name || 'v1.0.0';
    const latestVersion = rawTag.replace(/^[vV]/, '');
    const releaseTitle = data.name || rawTag;
    const releaseDate = (data.published_at ? data.published_at.split('T')[0] : '') || new Date().toISOString().split('T')[0] || '2026-11-24';
    const changelog = extractChangelogItems(data.body);
    const htmlUrl = data.html_url || `https://github.com/${repoOwner}/${repoName}/releases`;

    const allAssets: ReleaseAsset[] = Array.isArray(data.assets)
      ? data.assets.map((a: any) => ({
          name: a.name,
          sizeBytes: a.size || 0,
          downloadUrl: a.browser_download_url,
          contentType: a.content_type || 'application/octet-stream',
        }))
      : [];

    // Find Suite Master Installer
    const suiteAsset = allAssets.find(a => 
      a.name.toLowerCase().includes('mecraft-setup') ||
      a.name.toLowerCase().includes('setup.exe')
    ) || allAssets.find(a => a.name.toLowerCase().endsWith('.exe'));

    // Find Target Sub-App Asset
    let appAsset: ReleaseAsset | undefined;
    if (appId && appId !== 'mecraft-suite') {
      const cleanAppId = appId.toLowerCase().replace(/^me/, '');
      appAsset = allAssets.find(a => {
        const n = a.name.toLowerCase();
        return n.includes(cleanAppId) || n.includes(appId.toLowerCase());
      });
    }

    const hasUpdate = compareSemver(latestVersion, currentVersion) > 0;

    const result: SoftwareUpdateInfo = {
      hasUpdate,
      currentVersion,
      latestVersion,
      releaseTitle,
      releaseTag: rawTag,
      releaseDate,
      changelog,
      htmlUrl,
      suiteAsset,
      appAsset: appAsset || suiteAsset,
      allAssets,
      checkedAt: Date.now(),
    };

    // Store in cache
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(cacheKey, JSON.stringify(result));
      } catch {
        // LocalStorage quota or access error
      }
    }

    return result;
  } catch (err: any) {
    const fallbackInfo: SoftwareUpdateInfo = {
      hasUpdate: false,
      currentVersion,
      latestVersion: currentVersion,
      releaseTitle: `meCraft v${currentVersion}`,
      releaseTag: `v${currentVersion}`,
      releaseDate: new Date().toISOString().split('T')[0] || '2026-11-24',
      changelog: ['Offline or network check unavailable'],
      htmlUrl: `https://github.com/${repoOwner}/${repoName}/releases`,
      allAssets: [],
      checkedAt: Date.now(),
      isOffline: true,
      error: err?.message || 'Network check failed',
    };
    return fallbackInfo;
  }
}
