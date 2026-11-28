import { readFileSync } from 'node:fs';

const releases = JSON.parse(readFileSync(0, 'utf8'));
if (!Array.isArray(releases)) throw new Error('Expected a list of GitHub releases on standard input');

const packages = releases.flatMap(release => {
  const version = /^(?:medocs-|medoc-)?v((?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*))$/.exec(release.tag_name)?.[1];
  if (!version || version.length > 24 || release.draft || release.prerelease) return [];
  const allowedRepos = ['methastrategy/meCraft', 'methastrategy/medocs'];
  const asset = release.assets?.find(item =>
    (item.name === 'medocs.exe' || item.name === 'medoc.exe') &&
    allowedRepos.some(repo => item.browser_download_url === `https://github.com/${repo}/releases/download/${release.tag_name}/${item.name}`)
  );
  const sha256 = /^sha256:([a-f0-9]{64})$/i.exec(asset?.digest ?? '')?.[1];
  if (!sha256 || !Number.isSafeInteger(asset.size) || asset.size < 1 || asset.size > 512 * 1024 * 1024) return [];
  return [
    { appId: 'medocs', platform: 'windows-x64', version, releaseTag: release.tag_name, url: asset.browser_download_url, sizeBytes: asset.size, sha256 },
    { appId: 'medoc', platform: 'windows-x64', version, releaseTag: release.tag_name, url: asset.browser_download_url, sizeBytes: asset.size, sha256 },
  ];
});
if (!packages.length) throw new Error('No eligible published meDocs package with a SHA-256 digest');
process.stdout.write(JSON.stringify({ schemaVersion: 1, packages }, null, 2) + '\n');
