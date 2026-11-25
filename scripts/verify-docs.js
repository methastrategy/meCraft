import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = fs.realpathSync(path.resolve(__dirname, '..'));

console.log('🔍 [verify-docs] Running meCraft living documentation audit...');

const readmePath = path.join(rootDir, 'README.md');
const roadmapPath = path.join(rootDir, 'docs/ROADMAP.md');
const archPath = path.join(rootDir, 'docs/ARCHITECTURE.md');
const appsDir = path.join(rootDir, 'apps');

let hasErrors = false;

// 1. Verify all apps in apps/ are referenced in docs
if (fs.existsSync(appsDir)) {
  const apps = fs.readdirSync(appsDir).filter(name => fs.statSync(path.join(appsDir, name)).isDirectory());
  const roadmapContent = fs.readFileSync(roadmapPath, 'utf-8');
  const readmeContent = fs.readFileSync(readmePath, 'utf-8');

  console.log(`📦 Found ${apps.length} applications in apps/: ${apps.join(', ')}`);

  for (const app of apps) {
    if (!roadmapContent.includes(app) && !roadmapContent.includes(app.replace(/^me/, ''))) {
      console.warn(`⚠️ Warning: App '${app}' is missing from docs/ROADMAP.md`);
    }
  }

  // 2. Check test badge format
  const testBadgeMatch = readmeContent.match(/Tests-(\d+)\%2B%20Passing/);
  if (testBadgeMatch) {
    console.log(`✅ README.md Test Badge verified: ${testBadgeMatch[1]}+ passing`);
  } else {
    console.warn(`⚠️ Warning: Test badge in README.md could not be parsed.`);
  }
}

console.log('✨ [verify-docs] Living documentation audit complete.');
