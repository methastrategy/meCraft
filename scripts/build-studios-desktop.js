/**
 * @file build-studios-desktop.js
 * Builds release native desktop bundles (.exe and NSIS setup) for all remaining studios
 */

import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const remainingStudios = [
  'meaudio',
  'medeck',
  'medesign',
  'mefilm',
  'melight',
  'memotion',
  'mesheet',
  'mevector',
];

console.log(`[build-studios-desktop] Starting desktop release builds for ${remainingStudios.length} studios...`);

for (let i = 0; i < remainingStudios.length; i++) {
  const s = remainingStudios[i];
  console.log(`\n============================================================`);
  console.log(`[${i + 1}/${remainingStudios.length}] Building desktop release for ${s}...`);
  console.log(`============================================================`);
  const start = Date.now();
  try {
    execSync(`npm run desktop:build --workspace=@mecraft/${s}`, {
      cwd: rootDir,
      stdio: 'inherit',
    });
    const elapsedSec = ((Date.now() - start) / 1000).toFixed(1);
    console.log(`[SUCCESS] Built ${s} in ${elapsedSec}s`);
  } catch (err) {
    console.error(`[ERROR] Failed to build ${s}:`, err.message);
    process.exit(1);
  }
}

console.log('\n[build-studios-desktop] All studio desktop builds completed successfully!');
