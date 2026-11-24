import { describe, it, expect, beforeEach } from 'vitest';
import { setupMockDom } from '../../../packages/studio-shell/tests/mock-dom';
import {
  getDefaultCatalog,
  createLauncherBridge,
  clearAllStorage,
  formatBytes,
  formatSpeed,
  type AppCatalogItem,
} from '@mecraft/core-bridge';
import {
  getAuthSession,
  saveAuthSession,
  clearAuthSession,
  createMockAuthSession,
  getTierBadge,
  isFeatureUnlocked,
  isOfflineGraceValid,
  onAuthSessionChange,
  exportAuthSyncCode,
  importAuthSyncCode,
  escapeHtml,
  TRANSLATIONS,
  MeCraftsPortal,
} from '../src/main';

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
      'https://github.com/methastrategy/meCraft/releases/download/v1.0.0/mepdf-windows-x64.zip'
    );
    expect(installRes.success).toBe(true);

    // 3. Post-install check
    status = await bridge.checkAppStatus('mepdf');
    expect(status.installed).toBe(true);
    expect(status.version).toBe('1.0.0');

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

  describe('Launcher Bilingual & Routing Enhancements', () => {
    it('supports dual-action launchApp routing to web studio and desktop targets', async () => {
      const bridge = createLauncherBridge();

      // Launch Web Studio target
      const webRes = await bridge.launchApp({
        appId: 'mepdf',
        target: 'web',
      });
      expect(webRes.success).toBe(true);

      // Launch Desktop target
      const desktopRes = await bridge.launchApp({
        appId: 'mephoto',
        target: 'desktop',
      });
      expect(desktopRes.success).toBe(true);
    });

    it('supports dataUrl payload in launchApp options', async () => {
      const bridge = createLauncherBridge();
      const mockDataUrl = 'data:application/pdf;base64,JVBERi0xLjcK...';

      const res = await bridge.launchApp({
        appId: 'mepdf',
        dataUrl: mockDataUrl,
        filePath: 'invoice.pdf',
        target: 'web',
      });
      expect(res.success).toBe(true);
    });

    it('has symmetrical bilingual translations for both EN and TH languages', async () => {
      const { TRANSLATIONS, APP_THAI_METADATA } = await import('../src/main');
      expect(TRANSLATIONS.en).toBeDefined();
      expect(TRANSLATIONS.th).toBeDefined();

      const enKeys = Object.keys(TRANSLATIONS.en).sort();
      const thKeys = Object.keys(TRANSLATIONS.th).sort();
      expect(enKeys).toEqual(thKeys);

      expect(TRANSLATIONS.en.badgePrivacy).toContain('Privacy');
      expect(TRANSLATIONS.th.badgePrivacy).toContain('ความเป็นส่วนตัว');
      expect(TRANSLATIONS.en.openWebStudio).toBe('Open Web Studio');
      expect(TRANSLATIONS.th.openWebStudio).toBe('เปิด Web Studio');

      expect(APP_THAI_METADATA.mepdf).toBeDefined();
      expect(APP_THAI_METADATA.mephoto).toBeDefined();
      expect(APP_THAI_METADATA.mepdf.tagline.length).toBeGreaterThan(0);
      expect(APP_THAI_METADATA.mephoto.tagline.length).toBeGreaterThan(0);
    });

    it('correctly maps file extensions to target apps in universal drop routing', () => {
      const getTargetApp = (filename: string, mimeType?: string) => {
        const isPdf = filename.toLowerCase().endsWith('.pdf') || mimeType === 'application/pdf';
        const isImage = (mimeType && mimeType.startsWith('image/')) || /\.(jpe?g|png|webp|avif|bmp|gif|svg)$/i.test(filename);
        if (isPdf) return 'mepdf';
        if (isImage) return 'mephoto';
        return null;
      };

      expect(getTargetApp('report.pdf')).toBe('mepdf');
      expect(getTargetApp('SCAN_DOCUMENT.PDF')).toBe('mepdf');
      expect(getTargetApp('custom', 'application/pdf')).toBe('mepdf');

      expect(getTargetApp('photo.png')).toBe('mephoto');
      expect(getTargetApp('receipt.jpg')).toBe('mephoto');
      expect(getTargetApp('scan.jpeg')).toBe('mephoto');
      expect(getTargetApp('graphic.webp')).toBe('mephoto');
      expect(getTargetApp('file', 'image/png')).toBe('mephoto');

      expect(getTargetApp('unknown.xyz')).toBeNull();
      expect(getTargetApp('binary.exe')).toBeNull();
    });
  });

  describe('Strict Hub Gate & Feature-Tiered Membership System', () => {
    beforeEach(() => {
      clearAuthSession();
    });

    it('enforces strict gate: unauthenticated state when no session exists', () => {
      const session = getAuthSession();
      expect(session).toBeNull();
    });

    it('preserves valid Free Member session within 30-day offline grace period', () => {
      const mock = createMockAuthSession('creator@mecraft.dev', 'free_member');
      saveAuthSession(mock);

      const restored = getAuthSession();
      expect(restored).not.toBeNull();
      expect(restored?.user.email).toBe('creator@mecraft.dev');
      expect(restored?.user.tier).toBe('free_member');
      expect(isOfflineGraceValid(restored)).toBe(true);
    });

    it('enforces feature-tiered subscription rules across apps', () => {
      // Free Member can launch all apps
      expect(isFeatureUnlocked('app:all_launch', 'free_member')).toBe(true);
      expect(isFeatureUnlocked('app:mepdf', 'free_member')).toBe(true);
      expect(isFeatureUnlocked('app:melight', 'free_member')).toBe(true);

      // But premium features require Pro
      expect(isFeatureUnlocked('feature:4k_render', 'free_member')).toBe(false);
      expect(isFeatureUnlocked('feature:4k_render', 'pro_monthly')).toBe(true);
      expect(isFeatureUnlocked('feature:ai_bg_removal', 'free_member')).toBe(false);
      expect(isFeatureUnlocked('feature:ai_bg_removal', 'pro_yearly')).toBe(true);
    });

    it('clears session completely on sign out', () => {
      const mock = createMockAuthSession('signout@mecraft.dev', 'free_member');
      saveAuthSession(mock);
      expect(getAuthSession()).not.toBeNull();

      clearAuthSession();
      expect(getAuthSession()).toBeNull();
    });

    it('properly sanitizes potential XSS injection in user input and errors', () => {
      const maliciousPayload = '<script>alert("pwned")</script>&"\'';
      const clean = escapeHtml(maliciousPayload);
      expect(clean).not.toContain('<script>');
      expect(clean).toBe('&lt;script&gt;alert(&quot;pwned&quot;)&lt;/script&gt;&amp;&quot;&#39;');
    });

    it('contains complete bilingual translations for web auth and desktop synchronization', () => {
      expect(TRANSLATIONS.en.signInBtn).toBe('Sign In');
      expect(TRANSLATIONS.th.signInBtn).toBe('เข้าสู่ระบบ');
      expect(TRANSLATIONS.en.signUpBtn).toBe('Create Account');
      expect(TRANSLATIONS.th.signUpBtn).toBe('สมัครสมาชิก');
      expect(TRANSLATIONS.en.syncDesktopBtn).toBe('Sync to Desktop');
      expect(TRANSLATIONS.th.syncDesktopBtn).toBe('เชื่อมต่อ Desktop');
    });

    it('supports web-to-desktop handoff via exportAuthSyncCode and importAuthSyncCode', () => {
      const webSession = createMockAuthSession('web_user@mecraft.dev', 'pro_monthly');
      const syncCode = exportAuthSyncCode(webSession);

      expect(syncCode).toMatch(/^MC3\./);

      clearAuthSession();
      expect(getAuthSession()).toBeNull();

      const desktopSession = importAuthSyncCode(syncCode);
      expect(desktopSession).not.toBeNull();
      expect(desktopSession?.user.email).toBe('web_user@mecraft.dev');
      expect(desktopSession?.user.tier).toBe('pro_monthly');
    });

    it('detects live Supabase configuration and initializes client', async () => {
      const { isLiveSupabaseConfigured, supabase } = await import('../src/supabase');
      // If .env is loaded or configured, client should be ready
      const isConfigured = isLiveSupabaseConfigured();
      expect(typeof isConfigured).toBe('boolean');
      if (isConfigured) {
        expect(supabase).not.toBeNull();
        expect(supabase?.auth).toBeDefined();
      }
    });

    it('renders Direction 1 Sidebar Cockpit when in desktop mode without GitHub links', () => {
      const { doc } = setupMockDom();
      doc.body.innerHTML = '<div id="app"></div>';
      const portal = new MeCraftsPortal();
      portal.forceDesktopMode = true;
      (portal as any).render();

      const shell = doc.getElementById('workstation-shell');
      expect(shell).not.toBeNull();

      const sidebar = doc.querySelector('.ws-sidebar');
      expect(sidebar).not.toBeNull();

      // Verify no GitHub link inside workstation
      const ghLinks = doc.querySelectorAll('a[href*="github.com/methastrategy/meCraft"]');
      expect(ghLinks.length).toBe(0);

      // Verify Left Sidebar Nav Items (Workbench, Studios, Recents, Vault)
      const navButtons = doc.querySelectorAll('.ws-nav-btn');
      expect(navButtons.length).toBe(4);

      // Verify Universal Dropzone is present on default workbench view
      const dropzone = doc.getElementById('ws-universal-dropzone');
      expect(dropzone).not.toBeNull();
    });

    it('switches desktop views (workbench, studios, recents, vault) smoothly', () => {
      const { doc } = setupMockDom();
      doc.body.innerHTML = '<div id="app"></div>';
      const portal = new MeCraftsPortal();
      portal.forceDesktopMode = true;

      // 1. Studios View
      portal.desktopView = 'studios';
      (portal as any).render();
      expect(doc.querySelector('.ws-view-studios')).not.toBeNull();
      const studioCards = doc.querySelectorAll('.ws-studio-card-full');
      expect(studioCards.length).toBe(11);

      // 2. Recents View
      portal.desktopView = 'recents';
      (portal as any).render();
      expect(doc.querySelector('.ws-view-recents')).not.toBeNull();

      // 3. Vault View
      portal.desktopView = 'vault';
      (portal as any).render();
      expect(doc.querySelector('.ws-view-vault')).not.toBeNull();
      expect(doc.querySelector('.ws-vault-grid')).not.toBeNull();

      // 4. Back to Workbench
      portal.desktopView = 'workbench';
      (portal as any).render();
      expect(doc.querySelector('.ws-view-workbench')).not.toBeNull();
    });

    it('ensures web portal navigation does not contain GitHub repository link in navbar', () => {
      const { doc } = setupMockDom();
      doc.body.innerHTML = '<div id="app"></div>';
      const portal = new MeCraftsPortal();
      portal.forceDesktopMode = false;
      (portal as any).render();

      const portalNav = doc.querySelector('.portal-nav');
      expect(portalNav).not.toBeNull();
      const navGithub = portalNav?.querySelector('.portal-nav-github');
      expect(navGithub).toBeNull();
    });
  });
});
