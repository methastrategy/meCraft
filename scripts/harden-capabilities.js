import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = fs.realpathSync(path.resolve(__dirname, '..'));
const appsDir = path.join(rootDir, 'apps');

const apps = [
  { id: 'me3d', name: 'me3D' },
  { id: 'meaudio', name: 'meAudio' },
  { id: 'mecraft-launcher', name: 'meCraft Launcher' },
  { id: 'medeck', name: 'meDeck' },
  { id: 'medesign', name: 'meDesign' },
  { id: 'medoc', name: 'meDoc' },
  { id: 'medrop', name: 'meDrop' },
  { id: 'mefilm', name: 'meFilm' },
  { id: 'meide', name: 'meIDE' },
  { id: 'melight', name: 'meLight' },
  { id: 'memotion', name: 'meMotion' },
  { id: 'mepdf', name: 'mePDF' },
  { id: 'mephoto', name: 'mePhoto' },
  { id: 'mesheet', name: 'meSheet' },
  { id: 'mevector', name: 'meVector' },
];

let count = 0;

for (const app of apps) {
  const capDir = path.join(appsDir, app.id, 'src-tauri', 'capabilities');
  if (!fs.existsSync(capDir)) {
    fs.mkdirSync(capDir, { recursive: true });
  }

  const defaultJsonPath = path.join(capDir, 'default.json');
  
  const allowedPaths = [
    { path: '$APPLOCALDATA/**' },
    { path: '$DOCUMENT/**' },
    { path: '$DOWNLOAD/**' },
    { path: '$DESKTOP/**' },
    { path: '$TEMP/**' },
  ];

  if (['mephoto', 'medesign', 'mevector'].includes(app.id)) {
    allowedPaths.push({ path: '$PICTURE/**' });
  }
  if (['meaudio'].includes(app.id)) {
    allowedPaths.push({ path: '$AUDIO/**' });
  }
  if (['mefilm', 'memotion'].includes(app.id)) {
    allowedPaths.push({ path: '$VIDEO/**' });
    allowedPaths.push({ path: '$PICTURE/**' });
  }

  const capConfig = {
    $schema: '../gen/schemas/desktop-schema.json',
    identifier: 'default',
    description: `Hardened filesystem and window capabilities for ${app.name}`,
    windows: ['main'],
    permissions: [
      'core:default',
      'core:window:default',
      'core:window:allow-minimize',
      'core:window:allow-toggle-maximize',
      'core:window:allow-close',
      'core:window:allow-start-dragging',
      'core:window:allow-set-size',
      'core:window:allow-center',
      'dialog:default',
      'dialog:allow-open',
      'dialog:allow-save',
      'fs:default',
      {
        identifier: 'fs:allow-read-file',
        allow: allowedPaths,
      },
      {
        identifier: 'fs:allow-write-file',
        allow: allowedPaths,
      },
      {
        identifier: 'fs:allow-exists',
        allow: allowedPaths,
      },
    ],
  };

  fs.writeFileSync(defaultJsonPath, JSON.stringify(capConfig, null, 2) + '\n', 'utf-8');
  console.log(`✅ [harden-capabilities] Configured hardened ACL for ${app.name} (${app.id})`);
  count++;
}

console.log(`✨ [harden-capabilities] Successfully hardened capabilities across all ${count} applications.`);
