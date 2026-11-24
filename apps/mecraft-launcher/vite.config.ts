import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@mecraft/core-bridge': fileURLToPath(new URL('../../packages/core-bridge/src/index.ts', import.meta.url)),
      '@mecraft/photo-core': fileURLToPath(new URL('../../packages/photo-core/src/index.ts', import.meta.url)),
      '@mecraft/studio-shell/styles.css': fileURLToPath(new URL('../../packages/studio-shell/src/styles/shell.css', import.meta.url)),
      '@mecraft/studio-shell/shell.css': fileURLToPath(new URL('../../packages/studio-shell/src/styles/shell.css', import.meta.url)),
      '@mecraft/studio-shell': fileURLToPath(new URL('../../packages/studio-shell/src/index.ts', import.meta.url)),
      '@mecraft/mevector': fileURLToPath(new URL('../../apps/mevector/src/index.ts', import.meta.url)),
      '@mecraft/me3d': fileURLToPath(new URL('../../apps/me3d/src/index.ts', import.meta.url)),
      '@mecraft/meaudio': fileURLToPath(new URL('../../apps/meaudio/src/index.ts', import.meta.url)),
      '@mecraft/medeck': fileURLToPath(new URL('../../apps/medeck/src/index.ts', import.meta.url)),
      '@mecraft/medesign': fileURLToPath(new URL('../../apps/medesign/src/index.ts', import.meta.url)),
      '@mecraft/mefilm': fileURLToPath(new URL('../../apps/mefilm/src/index.ts', import.meta.url)),
      '@mecraft/melight': fileURLToPath(new URL('../../apps/melight/src/index.ts', import.meta.url)),
      '@mecraft/memotion': fileURLToPath(new URL('../../apps/memotion/src/index.ts', import.meta.url)),
      '@mecraft/mesheet': fileURLToPath(new URL('../../apps/mesheet/src/index.ts', import.meta.url)),
      '@mecraft/medoc': fileURLToPath(new URL('../../apps/medoc/src/index.ts', import.meta.url)),
      '@mecraft/ui-tokens/theme-oled.css': fileURLToPath(new URL('../../packages/ui-tokens/theme-oled.css', import.meta.url)),
      '@mecraft/ui-tokens/tokens.css': fileURLToPath(new URL('../../packages/ui-tokens/tokens.css', import.meta.url)),
      '@mecraft/ui-tokens': fileURLToPath(new URL('../../packages/ui-tokens/src/index.ts', import.meta.url)),
    },
  },
  server: {
    port: 5175,
    strictPort: true,
  },
  build: {
    target: 'esnext',
    sourcemap: false,
    chunkSizeWarningLimit: 1500,
  },
});
