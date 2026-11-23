import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      'mecraft/**',
      'mepdf/**',
      'mephoto/**',
      'melight/**',
      'mevector/**',
      'mefilm/**',
      'memotion/**',
      'medesign/**',
      'meaudio/**',
      'medoc/**',
      'me3d/**',
      'mesheet/**',
      'medeck/**',
    ],
  },
});
