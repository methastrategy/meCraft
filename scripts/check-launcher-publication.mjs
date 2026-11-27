import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const endpoint = 'https://mecrafts.vercel.app/updates/launcher/preview.json';
const permittedHosts = new Set(['mecrafts.vercel.app', 'github.com', 'release-assets.githubusercontent.com']);
const maximumInstallerSize = 512 * 1024 * 1024;

function permittedUrl(value) {
  const url = new URL(value);
  return url.protocol === 'https:' && !url.username && !url.password && permittedHosts.has(url.hostname);
}

async function download(url, limit, fetcher) {
  for (let redirects = 0; redirects <= 5; redirects++) {
    if (!permittedUrl(url)) throw new Error('Publication URL is not permitted');
    const response = await fetcher(url, { redirect: 'manual', signal: AbortSignal.timeout(120000) });
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get('location');
      if (!location || redirects === 5) throw new Error('Invalid publication redirect');
      url = new URL(location, url).href;
      continue;
    }
    if (!response.ok || !response.body) throw new Error(`Publication request failed: ${response.status}`);
    const length = response.headers.get('content-length');
    if (length !== null && (!/^\d+$/.test(length) || Number(length) > limit)) throw new Error('Publication response exceeds its size limit');
    const hash = createHash('sha256');
    let size = 0;
    for await (const chunk of response.body) {
      size += chunk.length;
      if (size > limit) throw new Error('Publication response exceeds its size limit');
      hash.update(chunk);
    }
    return { size, hash: hash.digest('hex') };
  }
  throw new Error('Too many redirects');
}

export async function checkPublication(manifestBytes, signatureBytes, fetcher = fetch) {
  const manifest = JSON.parse(manifestBytes.toString('utf8'));
  const artifact = manifest.platforms?.['windows-x86_64'];
  if (!artifact || !Number.isSafeInteger(artifact.size) || artifact.size < 1 || artifact.size > maximumInstallerSize || !/^[a-f0-9]{64}$/i.test(artifact.sha256)) {
    throw new Error('Invalid installer metadata');
  }
  if (new URL(artifact.url).pathname.split('/').at(-1)?.toLowerCase() !== 'mecraft-hub.msi') {
    throw new Error('Launcher release must use mecraft-hub.msi');
  }
  for (const [url, expected] of [[endpoint, manifestBytes], [`${endpoint}.sig`, signatureBytes]]) {
    const actual = await download(url, 64 * 1024, fetcher);
    if (actual.size !== expected.length || actual.hash !== createHash('sha256').update(expected).digest('hex')) throw new Error('Published manifest or signature does not match the verified local file');
  }
  const actual = await download(artifact.url, artifact.size, fetcher);
  if (actual.size !== artifact.size || actual.hash !== artifact.sha256.toLowerCase()) throw new Error('Published installer does not match the verified manifest');
}

async function main() {
  const manifestPath = process.argv[2];
  if (!manifestPath) throw new Error('Usage: node scripts/check-launcher-publication.mjs <signed-preview.json>');
  const repo = fileURLToPath(new URL('../', import.meta.url));
  const path = resolve(manifestPath);
  execFileSync('cargo', ['test', '--locked', '--manifest-path', 'apps/mecraft-launcher/src-tauri/Cargo.toml', '--lib', 'launcher_update::tests::checks_signed_manifest_and_rejects_tampering', '--', '--ignored'], {
    cwd: repo, env: { ...process.env, MECRAFT_TEST_MANIFEST: path }, stdio: 'inherit',
  });
  const [manifest, signature] = await Promise.all([readFile(path), readFile(`${path}.sig`)]);
  await checkPublication(manifest, signature);
  console.log('Published Launcher manifest, signature and installer match the verified files.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
