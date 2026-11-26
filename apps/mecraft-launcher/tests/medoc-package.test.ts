import { describe, expect, it } from 'vitest';
import { meDocPrimaryAction, resolveMeDocPackage, selectMeDocPackage } from '../src/medoc-package';

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

describe('meDoc Library package', () => {
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
