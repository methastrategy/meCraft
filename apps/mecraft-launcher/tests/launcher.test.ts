import { describe, it, expect, beforeEach } from 'vitest';
import {
  getDefaultCatalog,
  createLauncherBridge,
  clearAllStorage,
  formatBytes,
  formatSpeed,
  type AppCatalogItem,
} from '@mecraft/core-bridge';

describe('meCraft Launcher Core & Catalog Engine', () => {
  beforeEach(() => {
    clearAllStorage();
  });

  it('loads default apps catalog with proper branding and categories', () => {
    const catalog = getDefaultCatalog();
    expect(catalog.length).toBe(4);

    const pdfApp = catalog.find((a: AppCatalogItem) => a.id === 'mepdf')!;
    expect(pdfApp.name).toBe('mePDF Studio');
    expect(pdfApp.category).toBe('document');
    expect(pdfApp.exeName).toBe('mepdf.exe');

    const photoApp = catalog.find((a: AppCatalogItem) => a.id === 'mephoto')!;
    expect(photoApp.name).toBe('mePhoto Studio');
    expect(photoApp.category).toBe('graphics');
    expect(photoApp.exeName).toBe('mephoto.exe');
  });

  it('filters apps by category correctly', () => {
    const catalog = getDefaultCatalog();

    const docApps = catalog.filter((a: AppCatalogItem) => a.category === 'document' || a.category === 'writing');
    expect(docApps.map((a: AppCatalogItem) => a.id)).toEqual(['mepdf', 'medoc']);

    const graphicsApps = catalog.filter((a: AppCatalogItem) => a.category === 'graphics');
    expect(graphicsApps.map((a: AppCatalogItem) => a.id)).toEqual(['mephoto', 'mevector']);
  });

  it('formats progress and download telemetry accurately', () => {
    const total = 50 * 1024 * 1024; // 50MB
    const downloaded = 25 * 1024 * 1024; // 25MB
    const percent = Math.round((downloaded / total) * 100);

    expect(percent).toBe(50);
    expect(formatBytes(downloaded)).toBe('25 MB');
    expect(formatBytes(total)).toBe('50 MB');
    expect(formatSpeed(1024 * 1024 * 4)).toBe('4 MB/s');
  });

  it('tracks installed app lifecycle through bridge', async () => {
    const bridge = createLauncherBridge();

    // 1. Initial state: not installed
    let status = await bridge.checkAppStatus('mepdf');
    expect(status.installed).toBe(false);

    // 2. Install app
    const installRes = await bridge.downloadAndInstallApp(
      'mepdf',
      'https://github.com/methastrategy/meCraft/releases/download/v3.1.0/mepdf-windows-x64.zip'
    );
    expect(installRes.success).toBe(true);

    // 3. Post-install check
    status = await bridge.checkAppStatus('mepdf');
    expect(status.installed).toBe(true);
    expect(status.version).toBe('3.1.0');

    // 4. Uninstall
    await bridge.uninstallApp('mepdf');
    status = await bridge.checkAppStatus('mepdf');
    expect(status.installed).toBe(false);
  });

  it('manages universal recent projects history across apps', async () => {
    const bridge = createLauncherBridge();

    await bridge.saveRecentProject({
      name: 'Contract_2026.pdf',
      path: 'C:\\Users\\User\\Documents\\Contract_2026.pdf',
      appId: 'mepdf',
      fileType: 'pdf',
      sizeBytes: 204800,
    });

    await bridge.saveRecentProject({
      name: 'Receipt_Scan.jpg',
      path: 'C:\\Users\\User\\Pictures\\Receipt_Scan.jpg',
      appId: 'mephoto',
      fileType: 'image/jpeg',
      sizeBytes: 512000,
    });

    const list = await bridge.getRecentProjects();
    expect(list.length).toBe(2);
    expect(list[0].name).toBe('Receipt_Scan.jpg'); // Most recent first
    expect(list[1].name).toBe('Contract_2026.pdf');
  });

  it('handles empty and cleared recent projects history', async () => {
    const bridge = createLauncherBridge();
    let list = await bridge.getRecentProjects();
    expect(list).toEqual([]);

    await bridge.saveRecentProject({
      name: 'Temp.pdf',
      path: 'C:\\Users\\User\\Documents\\Temp.pdf',
      appId: 'mepdf',
      fileType: 'pdf',
    });
    list = await bridge.getRecentProjects();
    expect(list.length).toBe(1);

    await bridge.clearRecentProjects();
    list = await bridge.getRecentProjects();
    expect(list).toEqual([]);
  });

  it('handles formatting edge cases gracefully', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(-100)).toBe('0 B');
    expect(formatSpeed(0)).toBe('0 KB/s');
    expect(formatSpeed(-50)).toBe('0 KB/s');
  });

  it('ensures all catalog apps have valid IDs satisfying structural validation rules', () => {
    const catalog = getDefaultCatalog();
    const validIds = new Set(['mepdf', 'mephoto', 'mevector', 'medoc']);
    const structuralRegex = /^[a-z0-9](?:[a-z0-9-]{0,30}[a-z0-9])?$/;
    catalog.forEach((app: AppCatalogItem) => {
      expect(validIds.has(app.id)).toBe(true);
      expect(app.name.length).toBeGreaterThan(0);
      expect(app.id.length).toBeGreaterThanOrEqual(2);
      expect(app.id.length).toBeLessThanOrEqual(32);
      expect(structuralRegex.test(app.id)).toBe(true);
      expect(app.id).not.toContain('--');
      expect(app.exeName).toMatch(/^[a-z]+\.exe$/);
    });
  });

  it('handles bridge launchApp and getAppDirectory APIs cleanly', async () => {
    const bridge = createLauncherBridge();

    const launchRes = await bridge.launchApp({
      appId: 'mepdf',
      filePath: 'C:\\Users\\User\\Documents\\sample.pdf',
    });
    expect(launchRes.success).toBe(true);

    const appDir = await bridge.getAppDirectory('mepdf');
    expect(appDir).toContain('mepdf');
  });

  it('tracks download progress increments accurately via bridge', async () => {
    const bridge = createLauncherBridge();
    const progressList: number[] = [];

    const installRes = await bridge.downloadAndInstallApp(
      'mephoto',
      'https://github.com/methastrategy/meCraft/releases/download/v1.0.0/mephoto-windows-x64.zip',
      (p) => {
        progressList.push(p.percent);
      }
    );

    expect(installRes.success).toBe(true);
    expect(installRes.installedPath).toContain('mephoto.exe');
    expect(progressList.length).toBeGreaterThan(0);
    expect(progressList[progressList.length - 1]).toBe(100);

    const status = await bridge.checkAppStatus('mephoto');
    expect(status.installed).toBe(true);
  });

  it('deduplicates recent projects when opened multiple times', async () => {
    const bridge = createLauncherBridge();

    await bridge.saveRecentProject({
      name: 'Duplicate_Doc.pdf',
      path: 'C:\\Users\\User\\Documents\\Duplicate_Doc.pdf',
      appId: 'mepdf',
      fileType: 'pdf',
    });

    await bridge.saveRecentProject({
      name: 'Duplicate_Doc.pdf',
      path: 'C:\\Users\\User\\Documents\\Duplicate_Doc.pdf',
      appId: 'mepdf',
      fileType: 'pdf',
    });

    const list = await bridge.getRecentProjects();
    expect(list.length).toBe(1);
    expect(list[0].name).toBe('Duplicate_Doc.pdf');
  });
});
