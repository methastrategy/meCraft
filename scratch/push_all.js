import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const rootDir = 'D:/METHA/Projects/meCraft-Project';
const srcDir = path.join(rootDir, 'apps/mecraft-launcher/dist');
const destDir = path.join(rootDir, 'meCrafts-website');

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '.git') continue;
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDir(srcDir, destDir);
console.log('Copied launcher dist to meCrafts-website.');

// Commit & push meCraft-Project
execSync('git add -A', { cwd: rootDir });
execSync('git commit -m "fix(portal): align appsCount to 11 and sync mePhoto sample file label"', { cwd: rootDir });
execSync('git push origin main', { cwd: rootDir });
console.log('Pushed meCraft-Project.');

// Commit & push meCrafts-website
execSync('git add -A', { cwd: destDir });
execSync('git commit -m "deploy: sync launcher portal bundle with 11 apps count alignment"', { cwd: destDir });
execSync('git push origin main', { cwd: destDir });
console.log('Pushed meCrafts-website.');
