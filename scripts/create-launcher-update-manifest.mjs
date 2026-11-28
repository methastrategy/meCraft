import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { access, readFile, stat, unlink, writeFile } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const [installer, signatureFile, downloadUrl, output, channel = 'stable'] = process.argv.slice(2);
if (!installer || !signatureFile || !downloadUrl || !output) {
  throw new Error('Usage: node scripts/create-launcher-update-manifest.mjs <installer> <signature> <https-url> <output>');
}
if (!['stable', 'preview'].includes(channel)) throw new Error('Update channel must be stable or preview');

const packageJson = JSON.parse(await readFile(new URL('../apps/mecraft-launcher/package.json', import.meta.url), 'utf8'));
const tauriConfig = JSON.parse(await readFile(new URL('../apps/mecraft-launcher/src-tauri/tauri.conf.json', import.meta.url), 'utf8'));
const version = packageJson.version;
if (!/^\d+\.\d+\.\d+$/.test(version) || version !== tauriConfig.version) {
  throw new Error('Launcher package and Tauri versions must match and use a stable semantic version');
}
const repo = fileURLToPath(new URL('../', import.meta.url));
const expectedInstaller = resolve(repo, 'apps/mecraft-launcher/src-tauri/target/release/bundle/msi', `meCraft_${version}_x64_en-US.msi`);
if (resolve(installer) !== expectedInstaller || resolve(signatureFile) !== `${expectedInstaller}.sig`) {
  throw new Error('Supply the matching installer and signature from the launcher build');
}
const url = new URL(downloadUrl);
if (url.protocol !== 'https:' || url.username || url.password || !['github.com', 'mecrafts.vercel.app'].includes(url.hostname)) {
  throw new Error('Installer URL must use an approved HTTPS host');
}
if (!['mecraft.exe', 'mecraft-hub.msi'].includes(basename(url.pathname).toLowerCase())) {
  throw new Error('Public Launcher update URL must use mecraft.exe');
}
const publisher = process.env.MECRAFT_SIGNING_THUMBPRINT?.toUpperCase();
if (!publisher || !/^[0-9A-F]{40}$/.test(publisher)) {
  throw new Error('MECRAFT_SIGNING_THUMBPRINT must identify the Windows signing certificate');
}
const powershell = resolve(process.env.SystemRoot, 'System32/WindowsPowerShell/v1.0/powershell.exe');
const modulePath = resolve(process.env.SystemRoot, 'System32/WindowsPowerShell/v1.0/Modules');
const checkPublisher = "$ErrorActionPreference='Stop'; $s=Get-AuthenticodeSignature -LiteralPath $env:MECRAFT_VERIFY_INSTALLER; if ($s.Status -ne 'Valid' -or $null -eq $s.SignerCertificate -or $s.SignerCertificate.Thumbprint -ne $env:MECRAFT_VERIFY_PUBLISHER) { exit 1 }";
execFileSync(powershell, ['-NoLogo', '-NoProfile', '-NonInteractive', '-Command', checkPublisher], {
  env: { ...process.env, PSModulePath: modulePath, MECRAFT_VERIFY_INSTALLER: expectedInstaller, MECRAFT_VERIFY_PUBLISHER: publisher },
  windowsHide: true,
  stdio: 'pipe',
});

const signature = (await readFile(signatureFile, 'utf8')).trim();
const decodedSignature = Buffer.from(signature, 'base64').toString('utf8');
const trustedComment = decodedSignature.split(/\r?\n/).find(line => line.startsWith('trusted comment: '));
if (!trustedComment?.split('\t').includes(`version:${version}`)) {
  throw new Error('Updater signature must contain the matching signed version');
}
execFileSync('cargo', [
  'test', '--locked', '--manifest-path', 'apps/mecraft-launcher/src-tauri/Cargo.toml',
  '--test', 'updater_artifact', '--', '--ignored',
], { cwd: repo, stdio: 'inherit' });
const size = (await stat(installer)).size;
if (size <= 0 || size > 512 * 1024 * 1024) throw new Error('Invalid installer size');
const sha256 = createHash('sha256').update(await readFile(installer)).digest('hex');
const manifest = {
  version,
  channel,
  notes: `meCraft ${version}`,
  pub_date: new Date().toISOString(),
  platforms: {
    'windows-x86_64': { url: downloadUrl, signature, size, sha256, publisher_thumbprint: publisher },
  },
};
try {
  await access(`${output}.sig`);
  throw new Error('Manifest signature already exists');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
await writeFile(output, JSON.stringify(manifest, null, 2) + '\n', { flag: 'wx' });
try {
  const signingEnvironment = { ...process.env };
  if (signingEnvironment.TAURI_SIGNING_PRIVATE_KEY && !signingEnvironment.TAURI_SIGNING_PRIVATE_KEY_PATH) {
    try {
      if ((await stat(signingEnvironment.TAURI_SIGNING_PRIVATE_KEY)).isFile()) {
        signingEnvironment.TAURI_SIGNING_PRIVATE_KEY_PATH = signingEnvironment.TAURI_SIGNING_PRIVATE_KEY;
        delete signingEnvironment.TAURI_SIGNING_PRIVATE_KEY;
      }
    } catch (error) {
      if (!['ENOENT', 'ENAMETOOLONG', 'EINVAL'].includes(error.code)) throw error;
    }
  }
  execFileSync(process.execPath, [
    resolve(repo, 'node_modules/@tauri-apps/cli/tauri.js'),
    'signer', 'sign', '--app-version', version, resolve(output),
  ], { cwd: repo, env: signingEnvironment, stdio: 'pipe' });
  execFileSync('cargo', [
    'test', '--locked', '--manifest-path', 'apps/mecraft-launcher/src-tauri/Cargo.toml',
    '--lib', 'launcher_update::tests::checks_signed_manifest_and_rejects_tampering', '--', '--ignored',
  ], { cwd: repo, env: { ...process.env, MECRAFT_TEST_MANIFEST: resolve(output) }, stdio: 'inherit' });
} catch (error) {
  await Promise.all([unlink(output).catch(() => {}), unlink(`${output}.sig`).catch(() => {})]);
  throw new Error('Could not sign and verify the update manifest', { cause: error });
}
console.log(`Created update manifest for meCraft ${version} (${size} bytes, SHA-256 ${sha256})`);
