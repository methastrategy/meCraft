import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = fs.realpathSync(path.resolve(__dirname, '..'));

console.log('🔍 [verify-docs] Running meCraft living documentation audit & deep content inspection...');

const readmePath = path.join(rootDir, 'README.md');
const roadmapPath = path.join(rootDir, 'docs/ROADMAP.md');
const archPath = path.join(rootDir, 'docs/ARCHITECTURE.md');
const meCraftsArchPath = path.join(rootDir, 'docs/meCrafts-architecture.md');
const changelogPath = path.join(rootDir, 'CHANGELOG.md');
const contributingPath = path.join(rootDir, 'CONTRIBUTING.md');
const appsDir = path.join(rootDir, 'apps');
const packagesDir = path.join(rootDir, 'packages');

let hasWarnings = false;

// 1. Verify all apps in apps/ are referenced in docs and have README.md
if (fs.existsSync(appsDir)) {
  const apps = fs.readdirSync(appsDir).filter(name => fs.statSync(path.join(appsDir, name)).isDirectory());
  const roadmapContent = fs.readFileSync(roadmapPath, 'utf-8');
  const readmeContent = fs.readFileSync(readmePath, 'utf-8');

  console.log(`📦 Found ${apps.length} applications in apps/: ${apps.join(', ')}`);

  for (const app of apps) {
    if (!roadmapContent.includes(app) && !roadmapContent.includes(app.replace(/^me/, ''))) {
      console.warn(`⚠️ Warning: App '${app}' is missing from docs/ROADMAP.md`);
      hasWarnings = true;
    }
    const appReadme = path.join(appsDir, app, 'README.md');
    if (!fs.existsSync(appReadme)) {
      console.warn(`⚠️ Warning: App '${app}' is missing its README.md`);
      hasWarnings = true;
    } else {
      // Content-level inspection of each app's README
      const content = fs.readFileSync(appReadme, 'utf-8');
      if (content.includes('Draft / In-Development')) {
        console.warn(`⚠️ Warning: App '${app}' README contains stale 'Draft / In-Development' status.`);
        hasWarnings = true;
      }
      if (content.includes('launched exclusively via meCraft Launcher')) {
        console.warn(`⚠️ Warning: App '${app}' README contains stale single-distribution restriction.`);
        hasWarnings = true;
      }
    }
  }

  // 2. Check test badge format
  const testBadgeMatch = readmeContent.match(/Tests-(\d+)\%2B%20Passing/);
  if (testBadgeMatch) {
    console.log(`✅ README.md Test Badge verified: ${testBadgeMatch[1]}+ passing`);
  } else {
    console.warn(`⚠️ Warning: Test badge in README.md could not be parsed.`);
    hasWarnings = true;
  }
}

// 3. Verify packages have README.md
if (fs.existsSync(packagesDir)) {
  const pkgs = fs.readdirSync(packagesDir).filter(name => fs.statSync(path.join(packagesDir, name)).isDirectory());
  console.log(`📦 Found ${pkgs.length} packages in packages/: ${pkgs.join(', ')}`);

  for (const pkg of pkgs) {
    const pkgReadme = path.join(packagesDir, pkg, 'README.md');
    if (!fs.existsSync(pkgReadme)) {
      console.warn(`⚠️ Warning: Package '${pkg}' is missing its README.md`);
      hasWarnings = true;
    }
  }
}

// 4. Verify core blueprint files exist and inspect their contents
const coreDocs = [
  readmePath,
  roadmapPath,
  archPath,
  meCraftsArchPath,
  changelogPath,
  contributingPath
];

for (const doc of coreDocs) {
  if (fs.existsSync(doc)) {
    const content = fs.readFileSync(doc, 'utf-8');
    // Check for stale test numbers like 226 tests
    if (content.includes('226 tests') || content.includes('347+ tests')) {
      console.warn(`⚠️ Warning: Stale test count found in ${path.relative(rootDir, doc)}`);
      hasWarnings = true;
    }
    console.log(`✅ Verified core doc content: ${path.relative(rootDir, doc)}`);
  } else {
    console.warn(`⚠️ Warning: Missing core doc: ${path.relative(rootDir, doc)}`);
    hasWarnings = true;
  }
}

if (!hasWarnings) {
  console.log('✨ [verify-docs] 100% Deep living documentation integrity passed with 0 warnings!');
} else {
  console.log('⚠️ [verify-docs] Audit finished with warnings above.');
}
