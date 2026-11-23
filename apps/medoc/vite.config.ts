import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import fs from 'node:fs';

const rootPath = fs.realpathSync(fileURLToPath(new URL('.', import.meta.url)));

export default defineConfig({
  root: rootPath,
  base: './',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@mecraft/core-bridge': fileURLToPath(new URL('../../packages/core-bridge/src/index.ts', import.meta.url)),
      '@mecraft/studio-shell': fileURLToPath(new URL('../../packages/studio-shell/src/index.ts', import.meta.url)),
      '@mecraft/ui-tokens/theme-oled.css': fileURLToPath(new URL('../../packages/ui-tokens/theme-oled.css', import.meta.url)),
      '@mecraft/ui-tokens/tokens.css': fileURLToPath(new URL('../../packages/ui-tokens/tokens.css', import.meta.url)),
      '@mecraft/ui-tokens': fileURLToPath(new URL('../../packages/ui-tokens/src/index.ts', import.meta.url)),
    },
  },
  server: {
    port: 5177,
    strictPort: true,
  },
  build: {
    target: 'esnext',
    sourcemap: false,
    chunkSizeWarningLimit: 2000,
  },
});
