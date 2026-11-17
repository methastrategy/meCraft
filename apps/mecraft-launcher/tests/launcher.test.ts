import { describe, it, expect, beforeEach } from 'vitest';
import {
  getDefaultCatalog,
  createLauncherBridge,
  clearAllStorage,
  formatBytes,
  formatSpeed,
} from '@mecraft/core-bridge';

describe('meCraft Launcher Core & Catalog Engine', () => {
  beforeEach(() => {
    clearAllStorage();
  });

  it('loads default apps catalog with proper branding and categories', () => {
    const catalog = getDefaultCatalog();
    expect(catalog.length).toBe(4);

    const pdfApp = catalog.find((a) => a.id === 'mepdf')!;
    expect(pdfApp.name).toBe('mePDF Studio');
    expect(pdfApp.category).toBe('document');
    expect(pdfApp.exeName).toBe('mepdf.exe');

    const photoApp = catalog.find((a) => a.id === 'mephoto')!;
    expect(photoApp.name).toBe('mePhoto Studio');
    expect(photoApp.category).toBe('graphics');
    expect(photoApp.exeName).toBe('mephoto.exe');
  });

  it('filters apps by category correctly', () => {
    const catalog = getDefaultCatalog();

    const docApps = catalog.filter((a) => a.category === 'document' || a.category === 'writing');
    expect(docApps.map((a) => a.id)).toEqual(['mepdf', 'medoc']);

    const graphicsApps = catalog.filter((a) => a.category === 'graphics');
    expect(graphicsApps.map((a) => a.id)).toEqual(['mephoto', 'mevector']);
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
});
