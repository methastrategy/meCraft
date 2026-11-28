import { createHash, randomUUID } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const version = process.argv[2];
if (!/^\d+\.\d+\.\d+$/.test(version ?? '')) throw new Error('Supply the private MSI Preview version');
const repo = fileURLToPath(new URL('../', import.meta.url));
const installer = resolve(repo, 'apps/mecraft-launcher/src-tauri/target/release/bundle/msi', `meCraft MSI Preview_${version}_x64_en-US.msi`);
const feed = resolve(process.env.LOCALAPPDATA, 'meCraft-dev/msi-preview-feed');
const cli = resolve(repo, 'node_modules/@tauri-apps/cli/tauri.js');
if (!process.env.TAURI_SIGNING_PRIVATE_KEY_PATH && !process.env.TAURI_SIGNING_PRIVATE_KEY) throw new Error('Configure the private Preview updater signing key');
const environment = { ...process.env, MECRAFT_TEST_INSTALLER: installer, MECRAFT_TEST_VERSION: version };
execFileSync(process.execPath, [cli, 'signer', 'sign', '--app-version', version, installer], { cwd: repo, env: environment, stdio: 'pipe' });
execFileSync('cargo', ['test', '--locked', '--manifest-path', 'apps/mecraft-launcher/src-tauri/Cargo.toml', '--test', 'updater_artifact', '--', '--ignored'], { cwd: repo, env: environment, stdio: 'inherit' });
const bytes = await readFile(installer);
const signature = (await readFile(`${installer}.sig`, 'utf8')).trim();
await mkdir(feed, { recursive: true });
await copyFile(installer, resolve(feed, basename(installer)));
const manifest = { version, channel: 'preview', notes: `Private MSI update test ${version}`, pub_date: new Date().toISOString(), platforms: { 'windows-x86_64': {
  url: `http://127.0.0.1:18978/${encodeURIComponent(basename(installer))}`, signature,
  size: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex'), publisher_thumbprint: '0'.repeat(40),
} } };
// Stage and verify both files before replacing the files served to the local Preview.
const staged = resolve(feed, `preview-${version}-${randomUUID()}.json`);
await writeFile(staged, JSON.stringify(manifest, null, 2) + '\n', { flag: 'wx' });
execFileSync(process.execPath, [cli, 'signer', 'sign', '--app-version', version, staged], { cwd: repo, env: environment, stdio: 'pipe' });
execFileSync('cargo', ['test', '--locked', '--manifest-path', 'apps/mecraft-launcher/src-tauri/Cargo.toml', '--lib', 'launcher_update::tests::checks_signed_manifest_and_rejects_tampering', '--', '--ignored'], { cwd: repo, env: { ...environment, MECRAFT_TEST_MANIFEST: staged }, stdio: 'inherit' });
await copyFile(`${staged}.sig`, resolve(feed, 'preview.json.sig'));
await copyFile(staged, resolve(feed, 'preview.json'));
console.log(`Private local MSI feed prepared for ${version}. This does not publish a release.`);
