import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = fs.realpathSync(path.resolve(__dirname, '..'));
const websiteDir = fs.existsSync(path.resolve(rootDir, 'meCrafts-website/.git'))
  ? fs.realpathSync(path.resolve(rootDir, 'meCrafts-website'))
  : fs.realpathSync(path.resolve(rootDir, '../meCrafts-website'));

console.log('🚀 [deploy:website] Starting deployment pipeline to meCrafts-website...');

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

// 3. Helper to copy recursively
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

// 4. Synchronize dist -> meCrafts-website (preserving .git, vercel.json, README.md, .gitignore)
console.log('🔄 [deploy:website] Syncing dist to meCrafts-website...');
copyDir(distDir, websiteDir);

// 5. Commit and push to methastrategy/meCrafts-web
try {
  console.log('📤 [deploy:website] Committing and pushing changes to git remote...');
  execSync('git add -A', { cwd: websiteDir, stdio: 'inherit' });
  
  // Check if there are changes to commit
  const status = execSync('git status --porcelain', { cwd: websiteDir }).toString().trim();
  if (!status) {
    console.log('✨ [deploy:website] Working tree clean — no new changes to push.');
  } else {
    const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8'));
    const commitMsg = `deploy: sync web portal release v${pkg.version} (${new Date().toISOString().split('T')[0]})`;
    execSync(`git commit -m "${commitMsg}"`, { cwd: websiteDir, stdio: 'inherit' });
    execSync('git push origin main', { cwd: websiteDir, stdio: 'inherit' });
    console.log(`✅ [deploy:website] Successfully deployed to methastrategy/meCrafts-web!`);
  }
} catch (err) {
  console.error('⚠️ [deploy:website] Git push failed or was interrupted:', err.message);
  process.exit(1);
}
