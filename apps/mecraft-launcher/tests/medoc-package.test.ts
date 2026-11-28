import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchMeDocPackage, meDocPrimaryAction, parseMeDocCatalog, resolveMeDocPackage, selectMeDocPackage } from '../src/medoc-package';

const digest = 'a'.repeat(64);
const asset = {
  name: 'medoc.exe',
  size: 100,
  digest: `sha256:${digest}`,
  browser_download_url: 'https://github.com/methastrategy/meCraft/releases/download/v1.0.4/medoc.exe',
};
const release = {
  tag_name: 'v1.0.4', prerelease: false, draft: false, assets: [asset],
};
const catalog = { schemaVersion: 1, packages: [{
  appId: 'medoc', platform: 'windows-x64', version: '1.0.4', releaseTag: 'v1.0.4',
  url: asset.browser_download_url, sha256: digest, sizeBytes: 100,
}] };

afterEach(() => vi.unstubAllGlobals());

describe('meDoc Library package', () => {
  it('rejects the wrong platform and a release tag that does not match the version', () => {
    for (const change of [{ platform: 'other' }, { version: '1.0.5' }]) {
      expect(parseMeDocCatalog({ ...catalog, packages: [{ ...catalog.packages[0], ...change }] })).toBeNull();
    }
  });

  it('uses the last verified catalog if the website becomes unavailable', async () => {
    const items = new Map<string, string>();
    vi.stubGlobal('localStorage', { setItem: (key: string, value: string) => items.set(key, value), getItem: (key: string) => items.get(key) });
    const fetchCatalog = vi.fn().mockResolvedValueOnce(new Response(JSON.stringify(catalog))).mockRejectedValue(new Error('offline'));
    vi.stubGlobal('fetch', fetchCatalog);
    const online = await fetchMeDocPackage();
    expect(fetchCatalog.mock.calls[0][0]).toBe('https://mecrafts.vercel.app/catalog/v1.json');
    expect(online?.version).toBe('1.0.4');
    expect(await fetchMeDocPackage()).toEqual(online);
  });
  it('uses the verified meDoc executable for the matching release', () => {
    expect(resolveMeDocPackage(release)).toEqual({ version: '1.0.4', releaseTag: 'v1.0.4', sha256: digest, sizeBytes: 100 });
  });

  it.each([
    { name: 'meCraft-Setup.exe' },
    { digest: undefined },
    { digest: 'sha256:123' },
    { size: 0 },
    { browser_download_url: 'https://example.com/medoc.exe' },
  ])('rejects unsafe or unrelated assets (%j)', change => {
    expect(resolveMeDocPackage({ ...release, assets: [{ ...asset, ...change }] })).toBeNull();
  });

  it('finds the newest eligible meDoc package despite a newer Launcher release', () => {
    const medoc = {
      ...release,
      tag_name: 'medoc-v1.0.5',
      assets: [{ ...asset, browser_download_url: asset.browser_download_url.replace('v1.0.4', 'medoc-v1.0.5') }],
    };
    expect(selectMeDocPackage([
      { ...release, tag_name: 'launcher-v1.0.6', assets: [] },
      { ...medoc, prerelease: true },
      release,
    ])?.version).toBe('1.0.4');
    expect(selectMeDocPackage([release, medoc])?.releaseTag).toBe('medoc-v1.0.5');
  });

  it('also resolves meDocs release tag and medocs.exe from methastrategy/medocs', () => {
    const medocsRelease = {
      tag_name: 'medocs-v1.0.5',
      prerelease: false,
      draft: false,
      assets: [{
        name: 'medocs.exe',
        size: 120,
        digest: `sha256:${digest}`,
        browser_download_url: 'https://github.com/methastrategy/medocs/releases/download/medocs-v1.0.5/medocs.exe',
      }],
    };
    expect(resolveMeDocPackage(medocsRelease)).toEqual({ version: '1.0.5', releaseTag: 'medocs-v1.0.5', sha256: digest, sizeBytes: 120 });
    expect(parseMeDocCatalog({
      schemaVersion: 1,
      packages: [{
        appId: 'medocs',
        platform: 'windows-x64',
        version: '1.0.5',
        releaseTag: 'medocs-v1.0.5',
        url: 'https://github.com/methastrategy/medocs/releases/download/medocs-v1.0.5/medocs.exe',
        sha256: digest,
        sizeBytes: 120,
      }],
    })?.version).toBe('1.0.5');
  });

  it('offers installation, upgrade, or offline launch without downgrading', () => {
    const available = resolveMeDocPackage(release);
    expect(meDocPrimaryAction(false, null, available)).toBe('install');
    expect(meDocPrimaryAction(false, null, null)).toBe('retry');
    expect(meDocPrimaryAction(true, null, available)).toBe('update');
    expect(meDocPrimaryAction(true, '1.0.3', available)).toBe('update');
    expect(meDocPrimaryAction(true, '1.0.4', available)).toBe('open');
    expect(meDocPrimaryAction(true, '1.0.5', available)).toBe('open');
    expect(meDocPrimaryAction(true, '1.0.3', null)).toBe('open');
  });
});
