import { describe, it, expect, beforeEach, vi } from 'vitest';
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
  SHOWCASE_APPS,
  MeCraftsPortal,
  renderMarkdownHtml,
  getFileLanguage,
  getFileIcon,
  getSpecializedStudioForFile,
  type IdeFile,
} from '../src/main';
import { ALL_STUDIOS } from '../src/studio-runner';

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

      // Verify Left Sidebar Nav Items (Studios, Recents, Vault)
      const navButtons = doc.querySelectorAll('.ws-nav-btn');
      expect(navButtons.length).toBe(3);

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
      expect(studioCards.length).toBe(SHOWCASE_APPS.length);

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

    it('detects studio routes cleanly from query parameter and pathname', async () => {
      const { detectStudioRoute } = await import('../src/studio-runner.js');
      // Null when no studio is requested
      expect(detectStudioRoute()).toBeNull();
    });

    it('mounts studio shell when studio route is mounted', async () => {
      const { mountStudio } = await import('../src/studio-runner.js');
      const { doc } = setupMockDom();
      const container = doc.createElement('div');
      doc.body.appendChild(container);

      mountStudio('mevector', container, 'th');
      expect(container.querySelector('.studio-global-nav')).not.toBeNull();
      expect(container.querySelector('.studio-quick-picker')).not.toBeNull();
    });

    it('escapes searchQuery in HTML input attributes to prevent attribute XSS', () => {
      const { doc } = setupMockDom();
      doc.body.innerHTML = '<div id="app"></div>';
      const portal = new MeCraftsPortal();
      (portal as any).searchQuery = '" onfocus="alert(1)" data-x="';

      portal.forceDesktopMode = false;
      (portal as any).render();
      const webInput = doc.getElementById('apps-search') as HTMLInputElement;
      expect(webInput.getAttribute('onfocus')).toBeNull();
      expect(webInput.getAttribute('value')).toBe('&quot; onfocus=&quot;alert(1)&quot; data-x=&quot;');

      portal.forceDesktopMode = true;
      portal.desktopView = 'studios';
      (portal as any).render();
      const wsInput = doc.getElementById('ws-studios-search-input') as HTMLInputElement;
      expect(wsInput.getAttribute('onfocus')).toBeNull();
      expect(wsInput.getAttribute('value')).toBe('&quot; onfocus=&quot;alert(1)&quot; data-x=&quot;');
    });

    it('keeps PORTAL_I18N studio counts synchronized with SHOWCASE_APPS.length', () => {
      const count = SHOWCASE_APPS.length;
      expect(count).toBe(18);
      expect(TRANSLATIONS.en.appsCount).toBe(`${count} Apps`);
      expect(TRANSLATIONS.en.filterAll).toBe(`All (${count})`);
      expect(TRANSLATIONS.th.appsCount).toBe(`${count} โปรแกรม`);
      expect(TRANSLATIONS.th.filterAll).toBe(`ทั้งหมด (${count})`);
    });
  });

  describe('meCraft AI IDE Workspace Architecture (VS Code / Windsurf Style)', () => {
    it('initializes IDE workspace with memory-safe default files', () => {
      const portal = new MeCraftsPortal();
      expect(portal.ideFiles.length).toBeGreaterThanOrEqual(4);
      expect(portal.activeIdeFileId).toBe('welcome-md');
      expect(portal.openIdeFileIds).toContain('welcome-md');
      expect(portal.openIdeFileIds).toContain('scratchpad-txt');

      const welcome = portal.ideFiles.find((f: IdeFile) => f.id === 'welcome-md');
      expect(welcome).toBeDefined();
      expect(welcome?.language).toBe('markdown');
      expect(welcome?.content).toContain('meCraft AI IDE Workstation');
    });

    it('renders full IDE Workspace layout when in default workstation view', () => {
      const { doc } = setupMockDom();
      doc.body.innerHTML = '<div id="app"></div>';
      const portal = new MeCraftsPortal();
      portal.forceDesktopMode = true;
      expect(portal.desktopView).toBe('studios'); // default is Suite Hub
      portal.desktopView = 'workbench'; // switch to in-app IDE
      (portal as any).render();

      // 1. Root Workspace Shell & Editor Root
      const ideRoot = doc.getElementById('ide-workspace-root');
      expect(ideRoot).not.toBeNull();
      expect(ideRoot?.classList.contains('ws-view-editor')).toBe(true);
      expect(ideRoot?.classList.contains('ws-view-workbench')).toBe(true);

      // 2. Left Explorer Pane
      const explorer = doc.querySelector('.ide-explorer-pane');
      expect(explorer).not.toBeNull();
      expect(doc.getElementById('ide-btn-new-file')).not.toBeNull();
      expect(doc.getElementById('ide-btn-open-file')).not.toBeNull();
      expect(doc.getElementById('ws-universal-dropzone')).not.toBeNull();

      // 3. Central Editor Container & Code Surface
      const editorArea = doc.querySelector('.ide-editor-container');
      expect(editorArea).not.toBeNull();
      const textarea = doc.getElementById('ide-editor-textarea') as HTMLTextAreaElement;
      expect(textarea).not.toBeNull();
      expect(textarea.textContent || (textarea as any).value).toContain('meCraft AI IDE Workstation');

      // 4. Integrated Terminal Panel
      const terminal = doc.getElementById('ide-bottom-panel');
      expect(terminal).not.toBeNull();
      expect(doc.getElementById('ide-terminal-input')).not.toBeNull();

      // 5. AI Copilot Dock
      const aiDock = doc.querySelector('.ide-ai-dock');
      expect(aiDock).not.toBeNull();
      expect(doc.getElementById('ide-ai-prompt-input')).not.toBeNull();
      expect(doc.getElementById('ide-btn-send-ai')).not.toBeNull();

      // 6. Bottom Status Bar
      const privacyBadge = doc.querySelector('.ide-sb-privacy');
      expect(privacyBadge).not.toBeNull();
      expect(privacyBadge?.textContent).toContain('100% In-Device Memory');
    });

    it('detects file languages and icons accurately', () => {
      expect(getFileLanguage('README.md')).toBe('markdown');
      expect(getFileLanguage('script.ts')).toBe('typescript');
      expect(getFileLanguage('component.tsx')).toBe('typescript');
      expect(getFileLanguage('config.json')).toBe('json');
      expect(getFileLanguage('solver.py')).toBe('python');
      expect(getFileLanguage('notes.txt')).toBe('plaintext');

      expect(getFileIcon('markdown', 'README.md')).toBe('📝');
      expect(getFileIcon('json', 'config.json')).toBe('⚙️');
      expect(getFileIcon('typescript', 'index.ts')).toBe('🔷');
      expect(getFileIcon('python', 'app.py')).toBe('🐍');
      expect(getFileIcon('plaintext', 'doc.pdf')).toBe('📄');
    });

    it('renders Markdown and KaTeX math blocks securely via renderMarkdownHtml', () => {
      const sampleMd = '# Header 1\n\n**Bold text** and `inline code`\n\n$$E = mc^2$$\n\n- [x] Done\n- [ ] Pending';
      const html = renderMarkdownHtml(sampleMd);

      expect(html).toContain('<h1 class="ide-md-h1">Header 1</h1>');
      expect(html).toContain('<strong>Bold text</strong>');
      expect(html).toContain('<code class="ide-inline-code">inline code</code>');
      expect(html).toContain('class="ide-math-block"');
      expect(html).toContain('E = mc^2');
      expect(html).toContain('ide-md-task checked');
    });

    it('executes in-memory terminal commands cleanly without network calls', () => {
      const portal = new MeCraftsPortal();
      
      // 1. help command
      (portal as any).executeTerminalCommand('help');
      expect(portal.ideTerminalHistory.some((l: string) => l.includes('Available commands'))).toBe(true);

      // 2. version command
      (portal as any).executeTerminalCommand('version');
      expect(portal.ideTerminalHistory.some((l: string) => l.includes('v1.0.1'))).toBe(true);

      // 3. stats command
      (portal as any).executeTerminalCommand('stats');
      expect(portal.ideTerminalHistory.some((l: string) => l.includes('100% In-Device RAM'))).toBe(true);

      // 4. studios command
      (portal as any).executeTerminalCommand('studios');
      expect(portal.ideTerminalHistory.some((l: string) => l.includes('Standalone Studios'))).toBe(true);

      // 5. clear command
      (portal as any).executeTerminalCommand('clear');
      expect(portal.ideTerminalHistory.length).toBe(0);
    });

    it('dispatches AI copilot in-memory explanations and security audits safely', () => {
      const portal = new MeCraftsPortal();
      const initialCount = portal.aiChatMessages.length;

      // Explain query
      (portal as any).handleAiPrompt('explain');
      expect(portal.aiChatMessages.length).toBe(initialCount + 2);
      const aiReply = portal.aiChatMessages[portal.aiChatMessages.length - 1];
      expect(aiReply.sender).toBe('ai');
      expect(aiReply.text).toContain('welcome.md');
      expect(aiReply.text).toContain('without cloud exposure');

      // Security audit query
      (portal as any).handleAiPrompt('audit security');
      const auditReply = portal.aiChatMessages[portal.aiChatMessages.length - 1];
      expect(auditReply.text).toContain('Local Security Audit');
      expect(auditReply.text).toContain('100% Client-Side RAM');
    });

    it('supports real folder opening and updates workspace hierarchy', async () => {
      const { doc } = setupMockDom();
      doc.body.innerHTML = '<div id="app"></div>';
      const portal = new MeCraftsPortal();
      portal.forceDesktopMode = true;
      portal.desktopView = 'workbench';

      const mockFolderFiles: IdeFile[] = [
        {
          id: 'f1',
          name: 'index.ts',
          path: '/my-project/index.ts',
          language: 'typescript',
          content: 'console.log("hello world");',
        },
        {
          id: 'f2',
          name: 'README.md',
          path: '/my-project/README.md',
          language: 'markdown',
          content: '# Demo Project',
        },
      ];

      const res = await portal.handleOpenFolder('my-project', mockFolderFiles);
      expect(res).toBe(true);
      expect(portal.openedFolderName).toBe('my-project');
      expect(portal.ideFiles.length).toBe(2);
      expect(portal.activeIdeFileId).toBe('f1');
      expect(portal.ideTerminalHistory.some(l => l.includes('Opened folder "my-project"'))).toBe(true);

      (portal as any).render();
      const folderHeader = doc.querySelector('.ide-pane-folder-title');
      expect(folderHeader).not.toBeNull();
      expect(folderHeader?.textContent).toContain('MY-PROJECT');
    });

    it('handles direct file save (Ctrl+S) clearing dirty state and writing to handle', async () => {
      const { doc } = setupMockDom();
      doc.body.innerHTML = '<div id="app"></div>';
      const portal = new MeCraftsPortal();
      portal.forceDesktopMode = true;

      let writtenData = '';
      let closed = false;
      const mockWritable = {
        write: async (data: string) => { writtenData = data; },
        close: async () => { closed = true; },
      };

      const active = portal.ideFiles.find(f => f.id === portal.activeIdeFileId)!;
      active.content = 'Updated content from user editing';
      active.isDirty = true;
      active.fileHandle = {
        createWritable: async () => mockWritable,
      };

      const saved = await portal.handleSaveActiveFile();
      expect(saved).toBe(true);
      expect(active.isDirty).toBe(false);
      expect(writtenData).toBe('Updated content from user editing');
      expect(closed).toBe(true);
      expect(portal.ideTerminalHistory.some(l => l.includes('Saved ' + active.name))).toBe(true);
    });

    it('provides specialized studio routing for explorer items and drop events', () => {
      expect(getSpecializedStudioForFile('invoice.pdf').id).toBe('mepdf');
      expect(getSpecializedStudioForFile('receipt.jpg').id).toBe('mephoto');
      expect(getSpecializedStudioForFile('icon.png').id).toBe('mephoto');
      expect(getSpecializedStudioForFile('scene.obj').id).toBe('me3d');
      expect(getSpecializedStudioForFile('model.gltf').id).toBe('me3d');
      expect(getSpecializedStudioForFile('firmware.bin').id).toBe('merea');
      expect(getSpecializedStudioForFile('module.wasm').id).toBe('merea');
      expect(getSpecializedStudioForFile('notes.md').id).toBe('medoc');
      expect(getSpecializedStudioForFile('budget.csv').id).toBe('mesheet');
      expect(getSpecializedStudioForFile('blueprint.dxf').id).toBe('mecad');
      expect(getSpecializedStudioForFile('podcast.mp3').id).toBe('meaudio');
      expect(getSpecializedStudioForFile('trailer.mp4').id).toBe('mefilm');
      expect(getSpecializedStudioForFile('pitch.deck').id).toBe('medeck');
      expect(getSpecializedStudioForFile('logo.svg').id).toBe('mevector');
    });

    it('handles explorer context menu lifecycle and actions', () => {
      const { doc } = setupMockDom();
      doc.body.innerHTML = '<div id="app"></div>';
      const portal = new MeCraftsPortal();
      portal.forceDesktopMode = true;

      // Open context menu
      portal.showContextMenu('scratchpad-txt', 120, 240);
      expect(portal.isContextMenuOpen).toBe(true);
      expect(portal.contextMenuTargetId).toBe('scratchpad-txt');
      expect(portal.contextMenuPos).toEqual({ x: 120, y: 240 });

      // Close context menu
      portal.closeContextMenu();
      expect(portal.isContextMenuOpen).toBe(false);
      expect(portal.contextMenuTargetId).toBeNull();
    });

    it('verifies 18 creative studios metadata parity, guardians, and exact order', () => {
      expect(SHOWCASE_APPS.length).toBe(18);
      expect(ALL_STUDIOS.length).toBe(18);

      const showcaseIds = SHOWCASE_APPS.map(a => a.id);
      const allStudioIds = ALL_STUDIOS.map(s => s.id);
      expect(showcaseIds).toEqual(allStudioIds);

      // Verify every studio has Thai and English Guardian Deities
      SHOWCASE_APPS.forEach(app => {
        expect(app.guardian).toBeDefined();
        expect(app.guardian?.th.length).toBeGreaterThan(0);
        expect(app.guardian?.en.length).toBeGreaterThan(0);
      });

      ALL_STUDIOS.forEach(studio => {
        expect(studio.guardian).toBeDefined();
        expect(studio.guardian.th.length).toBeGreaterThan(0);
        expect(studio.guardian.en.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Steam Startup Auto-Updater, Desktop Google Auth, and Web 6-Digit OTP Hub', () => {
    it('Step 1: executes Steam-style startup auto-updater sequence with progress telemetry', async () => {
      const { doc } = setupMockDom();
      doc.body.innerHTML = '<div id="app"></div>';
      const portal = new MeCraftsPortal();
      portal.forceDesktopMode = true;

      expect(portal.isSteamUpdating).toBe(false);

      // Trigger Steam update check with accelerated speed for tests (10ms per step)
      const updatePromise = portal.runSteamStartupUpdate({ speedMs: 10, force: true });
      expect(portal.isSteamUpdating).toBe(true);
      expect(portal.steamUpdateStep).toBe(1);
      expect(portal.steamUpdateLogs.length).toBeGreaterThanOrEqual(1);

      (portal as any).render();
      const overlay = doc.getElementById('steam-splash-overlay');
      expect(overlay).not.toBeNull();
      expect(doc.getElementById('steam-progress-bar')).not.toBeNull();
      expect(doc.getElementById('steam-log-terminal')).not.toBeNull();
      expect(doc.getElementById('btn-steam-skip')).not.toBeNull();

      // Await sequence completion
      await updatePromise;
      expect(portal.steamUpdateCompleted).toBe(true);
      expect(portal.steamUpdateProgress).toBe(100);
      expect(portal.isSteamUpdating).toBe(false);
    });

    it('Step 1.1: executes Steam silent auto-updater with progress telemetry when new version is detected', async () => {
      const { doc } = setupMockDom();
      doc.body.innerHTML = '<div id="app"></div>';
      const portal = new MeCraftsPortal();
      portal.forceDesktopMode = true;

      let applyCalled = false;
      (portal as any).bridge.applyLauncherUpdate = async (_url: string, onProgress?: any) => {
        applyCalled = true;
        if (onProgress) {
          onProgress({
            appId: 'mecraft-suite' as any,
            downloadedBytes: 90 * 1024 * 1024,
            totalBytes: 90 * 1024 * 1024,
            percent: 100,
            speedBps: 15 * 1024 * 1024,
          });
        }
        return { success: true };
      };

      // Mock updateInfo directly to trigger silent auto-update
      vi.spyOn(await import('@mecraft/core-bridge'), 'checkSoftwareUpdate').mockResolvedValueOnce({
        hasUpdate: true,
        currentVersion: '1.0.0',
        latestVersion: '1.1.0',
        releaseTag: 'v1.1.0',
        releaseTitle: 'meCraft v1.1.0',
        releaseDate: '2026-11-25',
        changelog: ['Steam silent auto-updater patch'],
        htmlUrl: 'https://example.com/releases/v1.1.0',
        suiteAsset: { name: 'meCraft-Setup.exe', downloadUrl: 'https://example.com/meCraft-Setup.exe', sizeBytes: 90000000, contentType: 'application/octet-stream' },
        allAssets: [],
        checkedAt: Date.now(),
      });

      await portal.runSteamStartupUpdate({ speedMs: 5, force: true });
      expect(applyCalled).toBe(true);
      expect(portal.steamUpdateCompleted).toBe(true);
      expect(portal.steamUpdateProgress).toBe(100);
      expect(portal.isSteamUpdating).toBe(false);
    });

    it('Step 1: supports skip button dismissing Steam updater overlay immediately', () => {
      const { doc } = setupMockDom();
      doc.body.innerHTML = '<div id="app"></div>';
      const portal = new MeCraftsPortal();
      portal.isSteamUpdating = true;
      portal.steamUpdateProgress = 45;
      portal.steamUpdateStatus = 'Downloading packages...';
      (portal as any).render();
      (portal as any).attachListeners();

      const skipBtn = doc.getElementById('btn-steam-skip');
      expect(skipBtn).not.toBeNull();
      skipBtn?.click();

      expect(portal.isSteamUpdating).toBe(false);
    });

    it('renders Steam Auth Gate with modern input wrappers, auth-input classes, and zero offline bypass', () => {
      const { doc } = setupMockDom();
      doc.body.innerHTML = '<div id="app"></div>';
      const portal = new MeCraftsPortal();
      portal.forceDesktopMode = true;
      portal.desktopStage = 'auth';

      // 1. Test Sign In mode
      portal.authTab = 'signin';
      const htmlSignIn = portal.renderSteamAuthGate();
      doc.body.innerHTML = htmlSignIn;

      const emailInput = doc.getElementById('modal-auth-email') as HTMLInputElement;
      const pwdInput = doc.getElementById('modal-auth-password') as HTMLInputElement;
      expect(emailInput).not.toBeNull();
      expect(pwdInput).not.toBeNull();
      expect(emailInput.classList.contains('auth-input')).toBe(true);
      expect(pwdInput.classList.contains('auth-input')).toBe(true);
      expect(doc.querySelectorAll('.input-wrapper').length).toBe(2);

      const toggleBtn = doc.getElementById('modal-btn-toggle-pwd');
      expect(toggleBtn).not.toBeNull();

      // Offline bypass MUST be completely removed
      expect(doc.getElementById('btn-steam-offline-continue')).toBeNull();
      expect(htmlSignIn).not.toContain('Continue in Offline Mode');
      expect(htmlSignIn).not.toContain('เข้าใช้งานแบบ Offline');

      // 2. Test Create Account mode
      portal.authTab = 'signup';
      const htmlSignUp = portal.renderSteamAuthGate();
      doc.body.innerHTML = htmlSignUp;

      const fullNameInput = doc.getElementById('modal-auth-fullname') as HTMLInputElement;
      expect(fullNameInput).not.toBeNull();
      expect(fullNameInput.classList.contains('auth-input')).toBe(true);
      expect(doc.querySelectorAll('.input-wrapper').length).toBe(3);
      expect(doc.getElementById('btn-steam-offline-continue')).toBeNull();
    });

    it('Step 2: renders unified authentic sign-in with Email, Password, Google, and Web Sync in Desktop Mode', () => {
      const { doc } = setupMockDom();
      doc.body.innerHTML = '<div id="app"></div>';
      const portal = new MeCraftsPortal();
      portal.forceDesktopMode = true;
      portal.isAuthModalOpen = true;
      (portal as any).render();

      // 1. Google Login Button exists
      const googleBtn = doc.getElementById('modal-btn-auth-google');
      expect(googleBtn).not.toBeNull();
      expect(googleBtn?.textContent).toContain('Google');

      // 2. Email and Password input forms exist for authentic login on Desktop
      expect(doc.getElementById('modal-auth-email')).not.toBeNull();
      expect(doc.getElementById('modal-auth-password')).not.toBeNull();
      expect(doc.getElementById('modal-btn-auth-submit')).not.toBeNull();

      // 3. Desktop Sync Code drawer toggle exists
      expect(doc.getElementById('btn-toggle-sync-import')).not.toBeNull();

      // 4. Verify no Demo Bypass button exists
      expect(doc.getElementById('modal-btn-auth-demo')).toBeNull();

      // 5. Trust Badges exist
      const trustPills = doc.querySelectorAll('.trust-badge-pill');
      expect(trustPills.length).toBeGreaterThanOrEqual(2);
    });

    it('Step 2: Desktop Google Login establishes authenticated session cleanly', async () => {
      const portal = new MeCraftsPortal();
      portal.forceDesktopMode = true;
      portal.isAuthModalOpen = true;

      await (portal as any).handleGoogleAuth();
      expect(portal.currentSession).not.toBeNull();
      expect(portal.currentSession?.user.email).toContain('google.creator');
      expect(portal.isAuthModalOpen).toBe(false);
    });

    it('Step 3: Web Portal mode renders full email form and transitions to 6-digit OTP on signup', () => {
      const { doc } = setupMockDom();
      doc.body.innerHTML = '<div id="app"></div>';
      const portal = new MeCraftsPortal();
      portal.forceDesktopMode = false; // Web mode
      portal.isAuthModalOpen = true;
      portal.authTab = 'signup';
      (portal as any).render();

      expect(doc.getElementById('modal-auth-email')).not.toBeNull();
      expect(doc.getElementById('modal-auth-password')).not.toBeNull();
      expect(doc.getElementById('modal-auth-fullname')).not.toBeNull();

      // Submit signup
      (portal as any).handleAuthSubmit('creator.elite@gmail.com', 'SuperSecretPass123', 'Elite Creator');
      expect(portal.authTab).toBe('otp');
      expect(portal.otpEmail).toBe('creator.elite@gmail.com');
      expect(portal.otpTimerSeconds).toBe(300);
      expect(portal.otpAttemptsRemaining).toBe(3);

      (portal as any).render();
      const otpRow = doc.getElementById('otp-inputs-row');
      expect(otpRow).not.toBeNull();
      for (let i = 0; i < 6; i++) {
        expect(doc.getElementById(`otp-box-${i}`)).not.toBeNull();
      }
    });

    it('Step 3: handles OTP digit auto-advancement and 6-digit paste event', () => {
      const { doc } = setupMockDom();
      doc.body.innerHTML = '<div id="app"></div>';
      const portal = new MeCraftsPortal();
      portal.forceDesktopMode = false;
      portal.isAuthModalOpen = true;
      portal.authTab = 'otp';
      (portal as any).render();

      // Test individual digit input
      portal.handleOtpDigitInput(0, '8');
      expect(portal.otpDigits[0]).toBe('8');

      // Test 6-digit paste
      portal.handleOtpPaste('882914');
      expect(portal.otpDigits).toEqual(['8', '8', '2', '9', '1', '4']);
    });

    it('Step 3: verifies valid OTP and activates Desktop Relay with deep link and sync token', async () => {
      const { doc } = setupMockDom();
      doc.body.innerHTML = '<div id="app"></div>';
      const portal = new MeCraftsPortal();
      portal.forceDesktopMode = false;
      portal.isAuthModalOpen = true;
      portal.authTab = 'otp';
      portal.otpEmail = 'verified.user@gmail.com';
      portal.otpGeneratedCode = '882914';
      portal.otpDigits = ['8', '8', '2', '9', '1', '4'];

      // Mock source=desktop in query
      delete (window as any).location;
      (window as any).location = new URL('https://mecrafts.vercel.app/auth?source=desktop');

      const verified = await portal.handleVerifyOtp();
      expect(verified).toBe(true);
      expect(portal.currentSession).not.toBeNull();
      expect(portal.currentSession?.user.email).toBe('verified.user@gmail.com');
      expect(portal.isDesktopRelayActive).toBe(true);
      expect(portal.desktopRelayToken.length).toBeGreaterThan(0);

      (portal as any).render();
      const deepLink = doc.getElementById('btn-open-desktop-app') as HTMLAnchorElement;
      expect(deepLink).not.toBeNull();
      expect(deepLink?.getAttribute('href') || (deepLink as any)?.href).toContain('mecraft://auth?token=');
      expect(doc.getElementById('btn-copy-relay-code')).not.toBeNull();
    });

    it('Step 3: enforces security rate limiting and locks out after 3 failed OTP attempts', async () => {
      const portal = new MeCraftsPortal();
      portal.forceDesktopMode = false;
      portal.authTab = 'otp';
      portal.otpGeneratedCode = '999999';
      portal.otpDigits = ['1', '1', '1', '1', '1', '1'];

      // Attempt 1
      let res = await portal.handleVerifyOtp();
      expect(res).toBe(false);
      expect(portal.otpAttemptsRemaining).toBe(2);

      // Attempt 2
      res = await portal.handleVerifyOtp();
      expect(res).toBe(false);
      expect(portal.otpAttemptsRemaining).toBe(1);

      // Attempt 3
      res = await portal.handleVerifyOtp();
      expect(res).toBe(false);
      expect(portal.otpAttemptsRemaining).toBe(0);
      expect(portal.otpLockedUntil).toBeGreaterThan(Date.now());
      expect(portal.authError.toLowerCase()).toMatch(/locked|ล็อก/);

      // Attempt 4 while locked
      res = await portal.handleVerifyOtp();
      expect(res).toBe(false);
    });
  });

});
