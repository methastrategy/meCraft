/**
 * @file setup-studio-tauri.js
 * Scaffolds standalone Tauri v2 desktop environment for the 9 creative/document studios
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const studios = [
  { id: 'me3d', name: 'me3D', title: 'me3D Studio — WebGL Polygon Modeling & PBR Spatial Staging Studio', port: 5181 },
  { id: 'meaudio', name: 'meAudio', title: 'meAudio Studio — Multi-Track Digital Audio Workstation & Noise Reducer', port: 5182 },
  { id: 'medeck', name: 'meDeck', title: 'meDeck Studio — High-Impact Interactive Presentation Studio', port: 5183 },
  { id: 'medesign', name: 'meDesign', title: 'meDesign Studio — UI/UX Prototyping & Curated Design Suite', port: 5184 },
  { id: 'mefilm', name: 'meFilm', title: 'meFilm Studio — Multi-Track Non-Linear Video Editor & Lossless Slicer', port: 5185 },
  { id: 'melight', name: 'meLight', title: 'meLight Studio — Pro RAW Color Grading & Darkroom Suite', port: 5186 },
  { id: 'memotion', name: 'meMotion', title: 'meMotion Studio — Motion Graphics & Keyframe Animation Studio', port: 5187 },
  { id: 'mesheet', name: 'meSheet', title: 'meSheet Studio — Reactive Financial Modeling & High-Volume Spreadsheet', port: 5188 },
  { id: 'mevector', name: 'meVector', title: 'meVector Studio — Precision Bézier Vector Illustration & SVG Studio', port: 5189 },
];

const sourceIconsDir = path.join(rootDir, 'apps', 'medoc', 'src-tauri', 'icons');

for (const s of studios) {
  const appDir = path.join(rootDir, 'apps', s.id);
  const srcDir = path.join(appDir, 'src');
  const tauriDir = path.join(appDir, 'src-tauri');
  const tauriSrcDir = path.join(tauriDir, 'src');
  const tauriIconsDir = path.join(tauriDir, 'icons');

  fs.mkdirSync(srcDir, { recursive: true });
  fs.mkdirSync(tauriSrcDir, { recursive: true });
  fs.mkdirSync(tauriIconsDir, { recursive: true });

  // 1. index.html
  const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${s.title}</title>
    <link rel="icon" type="image/png" href="./branding/${s.id}.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="./src/main.ts"></script>
  </body>
</html>
`;
  fs.writeFileSync(path.join(appDir, 'index.html'), indexHtml, 'utf-8');

  // 2. src/main.ts
  const mainTs = `import '@mecraft/studio-shell/styles.css';
import { createStudioShell } from './index.js';

const appEl = document.getElementById('app') || document.body;
createStudioShell(appEl);
`;
  fs.writeFileSync(path.join(srcDir, 'main.ts'), mainTs, 'utf-8');

  // 3. vite.config.ts
  const viteConfig = `import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@mecraft/core-bridge': fileURLToPath(new URL('../../packages/core-bridge/src/index.ts', import.meta.url)),
      '@mecraft/studio-shell/styles.css': fileURLToPath(new URL('../../packages/studio-shell/src/styles/shell.css', import.meta.url)),
      '@mecraft/studio-shell': fileURLToPath(new URL('../../packages/studio-shell/src/index.ts', import.meta.url)),
      '@mecraft/ui-tokens/theme-oled.css': fileURLToPath(new URL('../../packages/ui-tokens/theme-oled.css', import.meta.url)),
      '@mecraft/ui-tokens/tokens.css': fileURLToPath(new URL('../../packages/ui-tokens/tokens.css', import.meta.url)),
      '@mecraft/ui-tokens': fileURLToPath(new URL('../../packages/ui-tokens/src/index.ts', import.meta.url)),
    },
  },
  server: {
    port: ${s.port},
    strictPort: true,
  },
  build: {
    target: 'esnext',
    sourcemap: false,
    chunkSizeWarningLimit: 2000,
  },
});
`;
  fs.writeFileSync(path.join(appDir, 'vite.config.ts'), viteConfig, 'utf-8');

  // 4. package.json
  const pkgPath = path.join(appDir, 'package.json');
  let pkg = {};
  if (fs.existsSync(pkgPath)) {
    pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  }
  pkg.name = `@mecraft/${s.id}`;
  pkg.private = true;
  pkg.version = '1.0.0';
  pkg.type = 'module';
  pkg.main = './src/index.ts';
  pkg.types = './src/index.ts';
  pkg.scripts = {
    dev: 'vite',
    build: 'tsc && vite build',
    preview: 'vite preview',
    typecheck: 'tsc --noEmit',
    'desktop:dev': 'tauri dev',
    'desktop:build': 'tauri build',
    ...pkg.scripts,
  };
  pkg.dependencies = {
    '@mecraft/core-bridge': '*',
    '@mecraft/studio-shell': '*',
    '@mecraft/ui-tokens': '*',
    '@tauri-apps/api': '^2.12.5',
    '@tauri-apps/plugin-dialog': '^2.8.4',
    '@tauri-apps/plugin-fs': '^2.7.1',
    ...pkg.dependencies,
  };
  pkg.devDependencies = {
    '@tauri-apps/cli': '^2.12.5',
    '@types/node': '^26.6.5',
    typescript: '^5.7.3',
    vite: '^6.2.0',
    ...pkg.devDependencies,
  };
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf-8');

  // 5. src-tauri/Cargo.toml
  const cargoToml = `[package]
name = "${s.id}"
version = "1.0.0"
description = "${s.title}"
authors = ["Metha Triparpanchit"]
license = "MIT"
edition = "2024"
rust-version = "1.90"

[lib]
name = "${s.id}_lib"
crate-type = ["staticlib", "cdylib", "rlib"]

[build-dependencies]
tauri-build = { version = "2.7.5", features = [] }

[dependencies]
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
log = "0.4"
tauri = { version = "2.12.6", features = [] }
tauri-plugin-log = "2"
tauri-plugin-dialog = "2"
tauri-plugin-fs = "2"
`;
  fs.writeFileSync(path.join(tauriDir, 'Cargo.toml'), cargoToml, 'utf-8');

  // 6. src-tauri/build.rs
  const buildRs = `fn main() {
  tauri_build::build()
}
`;
  fs.writeFileSync(path.join(tauriDir, 'build.rs'), buildRs, 'utf-8');

  // 7. src-tauri/src/lib.rs
  const libRs = `#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_fs::init())
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while building application");
}
`;
  fs.writeFileSync(path.join(tauriSrcDir, 'lib.rs'), libRs, 'utf-8');

  // 8. src-tauri/src/main.rs
  const mainRs = `// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
  ${s.id}_lib::run();
}
`;
  fs.writeFileSync(path.join(tauriSrcDir, 'main.rs'), mainRs, 'utf-8');

  // 9. src-tauri/tauri.conf.json
  const tauriConf = {
    $schema: '../node_modules/@tauri-apps/cli/config.schema.json',
    productName: `${s.name} Studio`,
    version: '1.0.0',
    identifier: `com.mecraft.${s.id}`,
    build: {
      frontendDist: '../dist',
      devUrl: `http://localhost:${s.port}`,
      beforeDevCommand: 'npm run dev',
      beforeBuildCommand: 'npm run build',
    },
    app: {
      windows: [
        {
          title: s.title,
          width: 1280,
          height: 800,
          minWidth: 800,
          minHeight: 600,
          resizable: true,
          fullscreen: false,
          transparent: false,
          decorations: true,
          theme: 'Dark',
        },
      ],
      security: {
        csp: null,
      },
    },
    bundle: {
      active: true,
      targets: 'all',
      icon: [
        'icons/32x32.png',
        'icons/128x128.png',
        'icons/128x128@2x.png',
        'icons/icon.ico',
      ],
      windows: {
        nsis: {
          startMenuFolder: `${s.name} Studio`,
          installMode: 'both',
        },
      },
    },
  };
  fs.writeFileSync(path.join(tauriDir, 'tauri.conf.json'), JSON.stringify(tauriConf, null, 2), 'utf-8');

  // 10. Copy icons from medoc
  if (fs.existsSync(sourceIconsDir)) {
    const iconFiles = fs.readdirSync(sourceIconsDir);
    for (const file of iconFiles) {
      fs.copyFileSync(path.join(sourceIconsDir, file), path.join(tauriIconsDir, file));
    }
  }

  console.log(`[SUCCESS] Configured Tauri desktop for ${s.name} (${s.id})`);
}

console.log('All 9 studios configured with Tauri desktop environment successfully!');
