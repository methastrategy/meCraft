import { readFileSync } from 'node:fs';

const releases = JSON.parse(readFileSync(0, 'utf8'));
if (!Array.isArray(releases)) throw new Error('Expected a list of GitHub releases on standard input');

const packages = releases.flatMap(release => {
  const version = /^(?:medoc-)?v((?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*))$/.exec(release.tag_name)?.[1];
  if (!version || version.length > 24 || release.draft || release.prerelease) return [];
  const url = `https://github.com/methastrategy/meCraft/releases/download/${release.tag_name}/medoc.exe`;
  const asset = release.assets?.find(item => item.name === 'medoc.exe' && item.browser_download_url === url);
  const sha256 = /^sha256:([a-f0-9]{64})$/i.exec(asset?.digest ?? '')?.[1];
  if (!sha256 || !Number.isSafeInteger(asset.size) || asset.size < 1 || asset.size > 512 * 1024 * 1024) return [];
  return [{ appId: 'medoc', platform: 'windows-x64', version, releaseTag: release.tag_name,
    url, sizeBytes: asset.size, sha256 }];
});
if (!packages.length) throw new Error('No eligible published meDoc package with a SHA-256 digest');
process.stdout.write(JSON.stringify({ schemaVersion: 1, packages }, null, 2) + '\n');
