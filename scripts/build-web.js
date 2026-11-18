import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('[build-web] Starting unified meCraft multi-app web build...');

// 1. Run workspace builds
console.log('[build-web] Building all workspaces with npm run build:all...');
execSync('npm run build:all', { cwd: rootDir, stdio: 'inherit' });

// 2. Prepare root dist directory
const distDir = path.join(rootDir, 'dist');
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Helper to copy directory recursively
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
      fs.copyFileSync(srcPath, destPath);
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

// Public assets if available
const publicDir = path.join(rootDir, 'public');
if (fs.existsSync(publicDir)) {
  console.log('[build-web] Copying root public assets...');
  copyDir(publicDir, distDir);
}

console.log('[build-web] Multi-app dist assembled:');
console.log(`  - /         -> Launcher Web Hub (${fs.existsSync(path.join(distDir, 'index.html')) ? 'OK' : 'MISSING'})`);
console.log(`  - /mepdf/   -> mePDF Studio (${fs.existsSync(path.join(distDir, 'mepdf/index.html')) ? 'OK' : 'MISSING'})`);
console.log(`  - /mephoto/ -> mePhoto Studio (${fs.existsSync(path.join(distDir, 'mephoto/index.html')) ? 'OK' : 'MISSING'})`);
console.log('[build-web] Done! Ready for Vercel deployment.');
