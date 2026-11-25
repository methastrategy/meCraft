import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = fs.realpathSync(path.resolve(__dirname, '..'));

const appsDir = path.join(rootDir, 'apps');
const apps = fs.readdirSync(appsDir).filter(name => fs.statSync(path.join(appsDir, name)).isDirectory());

const cspValue = "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' data: blob: https://api.github.com https://raw.githubusercontent.com;";

let updatedCount = 0;

for (const app of apps) {
  const tauriConfPath = path.join(appsDir, app, 'src-tauri', 'tauri.conf.json');
  if (fs.existsSync(tauriConfPath)) {
    const raw = fs.readFileSync(tauriConfPath, 'utf-8');
    const json = JSON.parse(raw);
    if (!json.app) json.app = {};
    if (!json.app.security) json.app.security = {};
    json.app.security.csp = cspValue;
    fs.writeFileSync(tauriConfPath, JSON.stringify(json, null, 2) + '\n', 'utf-8');
    console.log(`✅ [harden-csp] Applied CSP to ${app}`);
    updatedCount++;
  }
}

console.log(`✨ [harden-csp] Successfully hardened CSP in ${updatedCount} applications.`);
