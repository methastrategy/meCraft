import { describe, it, expect, beforeEach } from 'vitest';
import {
  formatBytes,
  formatSpeed,
  getDefaultCatalog,
  createLauncherBridge,
  clearAllStorage,
} from '../src/index';

describe('@mecraft/core-bridge', () => {
  beforeEach(() => {
    clearAllStorage();
  });

  describe('Utility Formatters', () => {
    it('formats bytes correctly across units', () => {
      expect(formatBytes(0)).toBe('0 B');
      expect(formatBytes(512)).toBe('512 B');
      expect(formatBytes(1024)).toBe('1 KB');
      expect(formatBytes(1024 * 1024 * 4.5)).toBe('4.5 MB');
      expect(formatBytes(1024 * 1024 * 1024 * 2.1)).toBe('2.1 GB');
    });

    it('formats speed in bytes per second', () => {
      expect(formatSpeed(0)).toBe('0 KB/s');
      expect(formatSpeed(1024 * 1024 * 5)).toBe('5 MB/s');
    });
  });

  describe('Default Catalog', () => {
    it('returns four ecosystem apps with valid structure', () => {
      const catalog = getDefaultCatalog();
      expect(catalog.length).toBe(4);
      expect(catalog.map((c) => c.id)).toEqual(['mepdf', 'mephoto', 'mevector', 'medoc']);

      const pdfApp = catalog.find((c) => c.id === 'mepdf')!;
      expect(pdfApp.name).toBe('mePDF Studio');
      expect(pdfApp.exeName).toBe('mepdf.exe');
      expect(pdfApp.tags).toContain('PDF');

      const photoApp = catalog.find((c) => c.id === 'mephoto')!;
      expect(photoApp.name).toBe('mePhoto Studio');
      expect(photoApp.exeName).toBe('mephoto.exe');
      expect(photoApp.tags).toContain('Magic Color');

      const vectorApp = catalog.find((c) => c.id === 'mevector')!;
      expect(vectorApp.comingSoon).toBe(true);

      const docApp = catalog.find((c) => c.id === 'medoc')!;
      expect(docApp.inDevelopment).toBe(true);
    });
  });

  describe('LauncherBridge Universal Client (Web Mode Fallback)', () => {
    it('detects isTauri environment correctly', () => {
      const bridge = createLauncherBridge();
      expect(bridge.isTauri()).toBe(false);
    });

    it('checks status of uninstalled app', async () => {
      const bridge = createLauncherBridge();
      const status = await bridge.checkAppStatus('mepdf');
      expect(status.installed).toBe(false);
      expect(status.appId).toBe('mepdf');
    });

    it('simulates download and installation on web fallback', async () => {
      const bridge = createLauncherBridge();
      const progressList: number[] = [];

      const result = await bridge.downloadAndInstallApp(
        'mepdf',
        'https://github.com/methastrategy/meCraft/releases/download/v1.0.0/mepdf-windows-x64.zip',
        (p) => {
          progressList.push(p.percent);
        }
      );

      expect(result.success).toBe(true);
      expect(result.installedPath).toContain('mepdf.exe');
      expect(progressList.length).toBeGreaterThan(0);
      expect(progressList[progressList.length - 1]).toBe(100);

      const statusAfter = await bridge.checkAppStatus('mepdf');
      expect(statusAfter.installed).toBe(true);
      expect(statusAfter.version).toBe('1.0.0');
    });

    it('handles app uninstall', async () => {
      const bridge = createLauncherBridge();
      await bridge.downloadAndInstallApp('mepdf', 'mock-url');
      let status = await bridge.checkAppStatus('mepdf');
      expect(status.installed).toBe(true);

      await bridge.uninstallApp('mepdf');
      status = await bridge.checkAppStatus('mepdf');
      expect(status.installed).toBe(false);
    });

    it('manages universal recent projects', async () => {
      const bridge = createLauncherBridge();
      const initial = await bridge.getRecentProjects();
      expect(initial).toEqual([]);

      const saved = await bridge.saveRecentProject({
        name: 'Report_Q4.pdf',
        path: 'C:\\Docs\\Report_Q4.pdf',
        appId: 'mepdf',
        fileType: 'pdf',
        sizeBytes: 1048576,
      });

      expect(saved.id).toBeDefined();
      expect(saved.name).toBe('Report_Q4.pdf');

      const list = await bridge.getRecentProjects();
      expect(list.length).toBe(1);
      expect(list[0].path).toBe('C:\\Docs\\Report_Q4.pdf');

      await bridge.clearRecentProjects();
      const empty = await bridge.getRecentProjects();
      expect(empty).toEqual([]);
    });

    it('simulates launchApp without errors', async () => {
      const bridge = createLauncherBridge();
      const res = await bridge.launchApp({
        appId: 'mepdf',
        filePath: 'C:\\Docs\\Test.pdf',
      });
      expect(res.success).toBe(true);
    });

    it('simulates applyLauncherUpdate with progress streaming', async () => {
      const bridge = createLauncherBridge();
      const progressList: number[] = [];
      const res = await bridge.applyLauncherUpdate(
        'https://example.com/meCraft-Setup.exe',
        (p) => {
          progressList.push(p.percent);
        }
      );
      expect(res.success).toBe(true);
      expect(progressList.length).toBeGreaterThan(0);
      expect(progressList[progressList.length - 1]).toBe(100);
    });
  });
});
