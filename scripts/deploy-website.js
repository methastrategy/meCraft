import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = fs.realpathSync(path.resolve(__dirname, '..'));
function resolveWebsiteDir(rootDir) {
  const candidates = [
    path.resolve(rootDir, '../mecrafts-website'),
    path.resolve(rootDir, '../meCrafts-website'),
    path.resolve(rootDir, 'meCrafts-website'),
    path.resolve(rootDir, 'mecrafts-website'),
    path.resolve(rootDir, '../../meCraft-HUB/mecrafts-website'),
    path.resolve(rootDir, '../meCraft-HUB/mecrafts-website'),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.existsSync(path.join(candidate, '.git'))) {
      return fs.realpathSync(candidate);
    }
  }
  return candidates[0];
}
const websiteDir = resolveWebsiteDir(rootDir);

console.log('🚀 [deploy:website] Starting optimized deployment pipeline to meCrafts-website...');

// 1. Verify destination website repository exists
if (!fs.existsSync(websiteDir)) {
  console.error(`❌ [deploy:website] Target folder ${websiteDir} does not exist.`);
  console.error('Please clone or initialize https://github.com/methastrategy/meCrafts-web first.');
  process.exit(1);
}

// 2. Build multi-app web distribution
console.log('📦 [deploy:website] Rebuilding production dist with npm run build:web...');
execSync('npm run build:web', { cwd: rootDir, stdio: 'inherit' });

const distDir = path.join(rootDir, 'dist');
if (!fs.existsSync(distDir)) {
  console.error('❌ [deploy:website] dist directory not found after build!');
  process.exit(1);
}

// 3. Clean obsolete and orphaned files in meCrafts-website before syncing
console.log('🧹 [deploy:website] Cleaning orphaned builds and redundant studio assets...');

// Clean orphaned JS/CSS in assets/
const distAssetsDir = path.join(distDir, 'assets');
const webAssetsDir = path.join(websiteDir, 'assets');
if (fs.existsSync(webAssetsDir) && fs.existsSync(distAssetsDir)) {
  const validDistAssets = new Set(fs.readdirSync(distAssetsDir));
  const currentWebAssets = fs.readdirSync(webAssetsDir);
  for (const file of currentWebAssets) {
    const fullPath = path.join(webAssetsDir, file);
    if (fs.statSync(fullPath).isFile() && !validDistAssets.has(file)) {
      console.log(`  - Removing orphaned asset: ${file}`);
      fs.unlinkSync(fullPath);
    }
  }
}

// Clean redundant copied assets and branding from 14 lightweight studio shells
const additionalStudios = [
  'mevector',
  'me3d',
  'meaudio',
  'medeck',
  'medesign',
  'mefilm',
  'melight',
  'memotion',
  'mesheet',
  'mecad',
  'metexture',
  'mematerial',
  'meani',
  'merea',
];

for (const studio of additionalStudios) {
  const studioAssets = path.join(websiteDir, studio, 'assets');
  if (fs.existsSync(studioAssets)) {
    console.log(`  - Pruning redundant studio asset folder: ${studio}/assets`);
    fs.rmSync(studioAssets, { recursive: true, force: true });
  }
  const studioBranding = path.join(websiteDir, studio, 'branding');
  if (fs.existsSync(studioBranding)) {
    console.log(`  - Pruning redundant studio branding folder: ${studio}/branding`);
    fs.rmSync(studioBranding, { recursive: true, force: true });
  }
}

// 4. Helper to copy recursively
function copyDir(src, dest) {
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

// 5. Synchronize dist -> meCrafts-website
console.log('🔄 [deploy:website] Syncing clean dist to meCrafts-website...');
copyDir(distDir, websiteDir);

// 6. Synchronize root vercel.json redirect rules to meCrafts-website/vercel.json
const rootVercelJson = path.join(rootDir, 'vercel.json');
const webVercelJson = path.join(websiteDir, 'vercel.json');
if (fs.existsSync(rootVercelJson)) {
  try {
    const rootConfig = JSON.parse(fs.readFileSync(rootVercelJson, 'utf-8'));
    const cleanConfig = {
      $schema: 'https://openapi.vercel.sh/vercel.json',
      cleanUrls: true,
      redirects: rootConfig.redirects || [],
      headers: rootConfig.headers || [],
    };
    fs.writeFileSync(webVercelJson, JSON.stringify(cleanConfig, null, 2) + '\n', 'utf-8');
    console.log('✅ [deploy:website] Synchronized 18 studio redirects to meCrafts-website/vercel.json');
  } catch (err) {
    console.warn(`⚠️ [deploy:website] Could not sync vercel.json: ${err.message}`);
  }
}

// 7. Commit and push to methastrategy/meCrafts-web
try {
  console.log('📤 [deploy:website] Committing and pushing changes to git remote...');
  execSync('git add -A', { cwd: websiteDir, stdio: 'inherit' });
  
  // Check if there are changes to commit
  const status = execSync('git status --porcelain', { cwd: websiteDir }).toString().trim();
  if (!status) {
    console.log('✨ [deploy:website] Working tree clean — no new changes to push.');
  } else {
    const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8'));
    const commitMsg = `deploy: sync 18-studio web portal v${pkg.version} with optimized asset pipeline (${new Date().toISOString().split('T')[0]})`;
    execSync(`git commit -m "${commitMsg}"`, { cwd: websiteDir, stdio: 'inherit' });
    execSync('git push origin main', { cwd: websiteDir, stdio: 'inherit' });
    console.log(`✅ [deploy:website] Successfully deployed to methastrategy/meCrafts-web!`);
  }
} catch (err) {
  console.error('⚠️ [deploy:website] Git push failed or was interrupted:', err.message);
  process.exit(1);
}
