import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { setupMockDom } from './mock-dom.js';

// Import all 10 studio definitions
import { APP_METADATA as vectorMeta, createStudioShell as createVectorShell } from '../../../apps/mevector/src/index.js';
import { APP_METADATA as lightMeta, createStudioShell as createLightShell } from '../../../apps/melight/src/index.js';
import { APP_METADATA as filmMeta, createStudioShell as createFilmShell } from '../../../apps/mefilm/src/index.js';
import { APP_METADATA as docMeta, createStudioShell as createDocShell } from '../../../apps/medocs/src/index.js';
import { APP_METADATA as designMeta, createStudioShell as createDesignShell } from '../../../apps/medesign/src/index.js';
import { APP_METADATA as motionMeta, createStudioShell as createMotionShell } from '../../../apps/memotion/src/index.js';
import { APP_METADATA as audioMeta, createStudioShell as createAudioShell } from '../../../apps/meaudio/src/index.js';
import { APP_METADATA as d3Meta, createStudioShell as create3dShell } from '../../../apps/me3d/src/index.js';
import { APP_METADATA as sheetMeta, createStudioShell as createSheetShell } from '../../../apps/mesheet/src/index.js';
import { APP_METADATA as deckMeta, createStudioShell as createDeckShell } from '../../../apps/medeck/src/index.js';

describe('meCraft Creative Suite — 10 Scaffolded Studios Integration', () => {
  let originalDoc: any;
  let originalWin: any;

  beforeEach(() => {
    originalDoc = (globalThis as any).document;
    originalWin = (globalThis as any).window;
    setupMockDom();
  });

  afterEach(() => {
    (globalThis as any).document = originalDoc;
    (globalThis as any).window = originalWin;
  });

  const allStudios = [
    { meta: vectorMeta, factory: createVectorShell, expectedId: 'mevector', expectedCategory: 'CREATIVE' },
    { meta: lightMeta, factory: createLightShell, expectedId: 'melight', expectedCategory: 'PHOTO_COLOR' },
    { meta: filmMeta, factory: createFilmShell, expectedId: 'mefilm', expectedCategory: 'VIDEO_MOTION' },
    { meta: docMeta, factory: createDocShell, expectedId: 'medocs', expectedCategory: 'DOCUMENT' },
    { meta: designMeta, factory: createDesignShell, expectedId: 'medesign', expectedCategory: 'VECTOR_DESIGN' },
    { meta: motionMeta, factory: createMotionShell, expectedId: 'memotion', expectedCategory: 'VIDEO_MOTION' },
    { meta: audioMeta, factory: createAudioShell, expectedId: 'meaudio', expectedCategory: 'AUDIO_3D' },
    { meta: d3Meta, factory: create3dShell, expectedId: 'me3d', expectedCategory: 'AUDIO_3D' },
    { meta: sheetMeta, factory: createSheetShell, expectedId: 'mesheet', expectedCategory: 'DOCUMENT' },
    { meta: deckMeta, factory: createDeckShell, expectedId: 'medeck', expectedCategory: 'CREATIVE' },
  ];

  it('guarantees 100% metadata consistency (v1.0.0 & In-Device Privacy)', () => {
    for (const studio of allStudios) {
      expect(studio.meta.id).toBe(studio.expectedId);
      expect(studio.meta.version).toBe('1.0.0');
      expect(studio.meta.category).toBe(studio.expectedCategory);
      expect(studio.meta.status).toBe('production');
      expect(studio.meta.privacyInvariant).toContain('100% In-Device RAM Privacy');
      expect(studio.meta.supportedExtensions.length).toBeGreaterThan(0);
    }
  });

  it('instantiates and mounts StudioShell with 3-Pane Cockpit for every studio', () => {
    for (const studio of allStudios) {
      const container = document.createElement('div');
      container.id = `app-${studio.expectedId}`;
      document.body.appendChild(container);

      const shell = studio.factory(container);
      expect(shell).toBeDefined();

      const root = shell.getRootElement();
      expect(root).toBeDefined();
      expect(root.getAttribute('data-app-id')).toBe(studio.expectedId);

      // Verify Cockpit exists
      const cockpit = shell.getCockpit();
      expect(cockpit).toBeDefined();
      expect(cockpit.getCenterStage()).toBeDefined();
      expect(cockpit.getLeftPane()).toBeDefined();
      expect(cockpit.getRightPane()).toBeDefined();

      // Verify Status Bar has Privacy Shield
      const statusBar = shell.getStatusBar();
      expect(statusBar).toBeDefined();
      expect(statusBar?.getElement().innerHTML).toContain('100% In-Device Privacy');
    }
  });
});
