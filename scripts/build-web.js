import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = fs.realpathSync(path.resolve(__dirname, '..'));

console.log('[build-web] Starting unified meCraft multi-app web build...');

// 0. Validate and build central catalog (v2.json + v1.json)
console.log('[build-web] Validating and building catalog/v2.json and catalog/v1.json...');
execSync('node scripts/build-catalog.js', { cwd: rootDir, stdio: 'inherit' });

// 1. Run workspace builds
console.log('[build-web] Building all workspaces with npm run build:all...');
execSync('npm run build:all', { cwd: rootDir, stdio: 'inherit' });

// 2. Prepare root dist directory
const distDir = path.join(rootDir, 'dist');
if (fs.existsSync(distDir)) {
  try {
    const entries = fs.readdirSync(distDir);
    for (const entry of entries) {
      try {
        fs.rmSync(path.join(distDir, entry), { recursive: true, force: true, maxRetries: 3, retryDelay: 200 });
      } catch {
        // Ignore files locked by active processes; will be overwritten
      }
    }
  } catch {
    // Directory access fallback
  }
} else {
  fs.mkdirSync(distDir, { recursive: true });
}

// Helper to copy directory recursively with Windows EBUSY retry
function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`[build-web] Warning: Source directory ${src} does not exist.`);
    return;
  }
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      let copied = false;
      for (let attempt = 0; attempt < 5; attempt++) {
        try {
          fs.copyFileSync(srcPath, destPath);
          copied = true;
          break;
        } catch (err) {
          if (attempt === 4) {
            console.warn(`[build-web] Non-fatal copy error for ${destPath}: ${err.message}`);
          } else {
            try {
              Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 150);
            } catch {
              // Ignore wait errors
            }
          }
        }
      }
    }
  }
}

// 3. Assemble distribution:
// Root (/) -> meCraft Launcher Web Portal
console.log('[build-web] Assembling root portal from apps/mecraft-launcher/dist...');
copyDir(path.join(rootDir, 'apps/mecraft-launcher/dist'), distDir);

// Subpath (/mepdf) -> mePDF Studio
console.log('[build-web] Assembling mePDF Studio into dist/mepdf...');
copyDir(path.join(rootDir, 'apps/mepdf/dist'), path.join(distDir, 'mepdf'));

// Subpath (/mephoto) -> mePhoto Studio
console.log('[build-web] Assembling mePhoto Studio into dist/mephoto...');
copyDir(path.join(rootDir, 'apps/mephoto/dist'), path.join(distDir, 'mephoto'));

// Subpath (/medrop) -> meDrop Radial Converter
console.log('[build-web] Assembling meDrop Radial Converter into dist/medrop...');
copyDir(path.join(rootDir, 'apps/medrop/dist'), path.join(distDir, 'medrop'));

// Subpath (/medocs) -> meDocs Studio (+ /medoc backward-compatible redirect)
console.log('[build-web] Assembling meDocs Studio into dist/medocs...');
copyDir(path.join(rootDir, 'apps/medocs/dist'), path.join(distDir, 'medocs'));
const legacyMedocDir = path.join(distDir, 'medoc');
fs.mkdirSync(legacyMedocDir, { recursive: true });
fs.writeFileSync(
  path.join(legacyMedocDir, 'index.html'),
  '<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=/medocs/"><title>meDocs — Redirecting</title><script>location.replace("/medocs/" + location.search + location.hash);</script>',
  'utf-8',
);

// Subpath (/meide) -> meIDE Studio
console.log('[build-web] Assembling meIDE Studio into dist/meide...');
copyDir(path.join(rootDir, 'apps/meide/dist'), path.join(distDir, 'meide'));

// Assemble 9 creative & document studios with standalone dist builds
const studioApps = [
  'me3d',
  'meaudio',
  'medeck',
  'medesign',
  'mefilm',
  'melight',
  'memotion',
  'mesheet',
  'mevector',
];

for (const studio of studioApps) {
  const appDist = path.join(rootDir, `apps/${studio}/dist`);
  if (fs.existsSync(appDist)) {
    console.log(`[build-web] Assembling standalone ${studio} Studio into dist/${studio}...`);
    copyDir(appDist, path.join(distDir, studio));
  }
}

// Subpaths for remaining future lightweight studio shells
const additionalStudios = [
  'mecad',
  'metexture',
  'mematerial',
  'meani',
  'merea',
];

const launcherHtmlPath = path.join(distDir, 'index.html');
const launcherHtml = fs.readFileSync(launcherHtmlPath, 'utf-8');
const rootPathedHtml = launcherHtml
  .replaceAll('src="./assets/', 'src="/assets/')
  .replaceAll('href="./assets/', 'href="/assets/')
  .replaceAll('href="./branding/', 'href="/branding/')
  .replaceAll('href="./manifest.webmanifest"', 'href="/manifest.webmanifest"')
  .replaceAll('content="./assets/', 'content="/assets/');

for (const studio of additionalStudios) {
  console.log(`[build-web] Assembling lightweight ${studio} shell into dist/${studio}...`);
  const studioDir = path.join(distDir, studio);
  fs.mkdirSync(studioDir, { recursive: true });
  fs.writeFileSync(path.join(studioDir, 'index.html'), rootPathedHtml, 'utf-8');
}

// Generate static /apps/<id>/index.html pages from catalog/v2.json for shareable product URLs
const catalogV2Path = path.join(rootDir, 'public', 'catalog', 'v2.json');
if (fs.existsSync(catalogV2Path)) {
  const catalogV2 = JSON.parse(fs.readFileSync(catalogV2Path, 'utf-8'));
  for (const product of catalogV2.products || []) {
    const appRouteDir = path.join(distDir, 'apps', product.id);
    fs.mkdirSync(appRouteDir, { recursive: true });
    const appHtml = rootPathedHtml.replace(
      '<title>meCrafts</title>',
      `<title>${product.name} — meCrafts</title>`,
    );
    fs.writeFileSync(path.join(appRouteDir, 'index.html'), appHtml, 'utf-8');
  }
  console.log(`[build-web] Generated ${(catalogV2.products || []).length} static /apps/<id>/ routes.`);
  const legacyAppMedocDir = path.join(distDir, 'apps', 'medoc');
  fs.mkdirSync(legacyAppMedocDir, { recursive: true });
  fs.writeFileSync(
    path.join(legacyAppMedocDir, 'index.html'),
    '<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=/apps/medocs/"><title>meDocs — Redirecting</title><script>location.replace("/apps/medocs/" + location.search + location.hash);</script>',
    'utf-8',
  );
}

// Generate unified 18-studio downloads portal with Home Page sanctuary aesthetic + ArtCraft card-table architecture
console.log('[build-web] Generating downloads portal HTML...');
execSync('node scripts/generate-downloads-portal.js', { cwd: rootDir, stdio: 'inherit' });

// Public assets if available
const publicDir = path.join(rootDir, 'public');
if (fs.existsSync(publicDir)) {
  console.log('[build-web] Copying root public assets to dist...');
  copyDir(publicDir, distDir);
}

console.log('[build-web] Multi-app dist assembled:');
console.log(`  - /           -> Launcher Web Hub (${fs.existsSync(path.join(distDir, 'index.html')) ? 'OK' : 'MISSING'})`);
console.log(`  - /auth/      -> Auth Relay (${fs.existsSync(path.join(distDir, 'auth/index.html')) ? 'OK' : 'MISSING'})`);
console.log(`  - /downloads/ -> Downloads Hub (${fs.existsSync(path.join(distDir, 'downloads/index.html')) ? 'OK' : 'MISSING'})`);
console.log(`  - /mepdf/     -> mePDF Studio (${fs.existsSync(path.join(distDir, 'mepdf/index.html')) ? 'OK' : 'MISSING'})`);
console.log(`  - /mephoto/ -> mePhoto Studio (${fs.existsSync(path.join(distDir, 'mephoto/index.html')) ? 'OK' : 'MISSING'})`);
console.log(`  - /medrop/  -> meDrop Radial Converter (${fs.existsSync(path.join(distDir, 'medrop/index.html')) ? 'OK' : 'MISSING'})`);
console.log(`  - /medocs/  -> meDocs Studio (${fs.existsSync(path.join(distDir, 'medocs/index.html')) ? 'OK' : 'MISSING'})`);
console.log('[build-web] Done! Ready for Vercel deployment.');
