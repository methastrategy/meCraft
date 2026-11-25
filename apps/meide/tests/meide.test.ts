import { describe, it, expect } from 'vitest';
import { setupMockDom } from '../../../packages/studio-shell/tests/mock-dom';
import {
  MeIDEApp,
  getFileLanguage,
  getFileIcon,
  renderMarkdownHtml,
  escapeHtml,
  type IdeFile,
} from '../src/main';

describe('meIDE Standalone AI IDE Engine Suite', () => {
  it('detects programming languages and icons with high fidelity', () => {
    expect(getFileLanguage('app.ts')).toBe('typescript');
    expect(getFileLanguage('component.tsx')).toBe('typescript');
    expect(getFileLanguage('index.js')).toBe('javascript');
    expect(getFileLanguage('README.md')).toBe('markdown');
    expect(getFileLanguage('config.json')).toBe('json');
    expect(getFileLanguage('main.rs')).toBe('rust');
    expect(getFileLanguage('script.py')).toBe('python');
    expect(getFileLanguage('data.txt')).toBe('plaintext');

    expect(getFileIcon('typescript', 'app.ts')).toBe('🔷');
    expect(getFileIcon('markdown', 'README.md')).toBe('📝');
    expect(getFileIcon('json', 'config.json')).toBe('📦');
    expect(getFileIcon('rust', 'main.rs')).toBe('🦀');
    expect(getFileIcon('python', 'script.py')).toBe('🐍');
    expect(getFileIcon('plaintext', 'doc.pdf')).toBe('📄');
    expect(getFileIcon('plaintext', 'photo.png')).toBe('🖼️');
  });

  it('renders mathematical equations and Markdown correctly', () => {
    const raw = '# Hello\n$$\\int_0^1 x dx = \\frac{1}{2}$$\nHere is $E=mc^2$ inline.';
    const html = renderMarkdownHtml(raw);
    expect(html).toContain('<h1');
    expect(html).toContain('ide-math-block');
    expect(html).toContain('ide-math-inline');
  });

  it('initializes default workspace files and memory execution state', () => {
    const { doc } = setupMockDom();
    doc.body.innerHTML = '<div id="app"></div>';
    const app = new MeIDEApp();
    app.mount(doc.getElementById('app')!);

    expect(app.ideFiles.length).toBeGreaterThanOrEqual(4);
    expect(app.ideFiles.some(f => f.name === 'welcome.md')).toBe(true);
    expect(app.ideFiles.some(f => f.name === 'scratchpad.ts')).toBe(true);
    expect(app.ideFiles.some(f => f.name === 'settings.json')).toBe(true);

    const titlebar = doc.querySelector('.meide-titlebar');
    expect(titlebar).not.toBeNull();
    expect(titlebar?.textContent).toContain('meIDE');
  });

  it('handles multi-tab switching, closing, and new file creation', () => {
    const { doc } = setupMockDom();
    doc.body.innerHTML = '<div id="app"></div>';
    const app = new MeIDEApp();
    app.mount(doc.getElementById('app')!);

    // New file
    const initCount = app.ideFiles.length;
    app.handleNewFile();
    expect(app.ideFiles.length).toBe(initCount + 1);
    expect(app.activeIdeFileId).toContain('file_');

    // Switch tab
    app.switchTab('scratchpad-ts');
    expect(app.activeIdeFileId).toBe('scratchpad-ts');

    // Close tab
    app.closeTab('scratchpad-ts');
    expect(app.openIdeFileIds.includes('scratchpad-ts')).toBe(false);
  });

  it('executes built-in terminal CLI commands', () => {
    const { doc } = setupMockDom();
    doc.body.innerHTML = '<div id="app"></div>';
    const app = new MeIDEApp();
    app.mount(doc.getElementById('app')!);

    app.handleTerminalCommand('help');
    expect(app.terminalHistory.some(l => l.includes('Available commands:'))).toBe(true);

    app.handleTerminalCommand('stats');
    expect(app.terminalHistory.some(l => l.includes('100% In-Device Memory Execution'))).toBe(true);

    app.handleTerminalCommand('echo test-message');
    expect(app.terminalHistory.some(l => l.includes('test-message'))).toBe(true);

    app.handleTerminalCommand('clear');
    expect(app.terminalHistory.length).toBe(0);
  });

  it('processes in-device RAM AI copilot prompts and audits', () => {
    const { doc } = setupMockDom();
    doc.body.innerHTML = '<div id="app"></div>';
    const app = new MeIDEApp();
    app.mount(doc.getElementById('app')!);

    app.handleAiPrompt('audit security');
    const lastMsg = app.aiMessages[app.aiMessages.length - 1];
    expect(lastMsg.text).toContain('Local Security Audit');
    expect(lastMsg.text).toContain('100% Client-Side RAM');

    app.handleAiPrompt('explain');
    const explainMsg = app.aiMessages[app.aiMessages.length - 1];
    expect(explainMsg.text).toContain('Analysis of');
  });

  it('supports real folder opening and updates workspace hierarchy', async () => {
    const { doc } = setupMockDom();
    doc.body.innerHTML = '<div id="app"></div>';
    const app = new MeIDEApp();
    app.mount(doc.getElementById('app')!);

    const mockFolderFiles: IdeFile[] = [
      {
        id: 'f1',
        name: 'index.ts',
        path: '/my-project/index.ts',
        language: 'typescript',
        content: 'console.log("hello");',
      },
      {
        id: 'f2',
        name: 'style.css',
        path: '/my-project/style.css',
        language: 'css',
        content: 'body { color: red; }',
      },
    ];

    const res = await app.handleOpenFolder('my-project', mockFolderFiles);
    expect(res).toBe(true);
    expect(app.openedFolderName).toBe('my-project');
    expect(app.ideFiles.length).toBe(2);
    expect(app.activeIdeFileId).toBe('f1');
    expect(app.terminalHistory.some(l => l.includes('Opened folder "my-project"'))).toBe(true);
  });

  it('handles direct file save (Ctrl+S) and dirty state clearing', async () => {
    const { doc } = setupMockDom();
    doc.body.innerHTML = '<div id="app"></div>';
    const app = new MeIDEApp();
    app.mount(doc.getElementById('app')!);

    let writtenData = '';
    const mockWritable = {
      write: async (data: string) => { writtenData = data; },
      close: async () => {},
    };

    const active = app.ideFiles.find(f => f.id === app.activeIdeFileId)!;
    active.content = 'New edited content';
    active.isDirty = true;
    active.fileHandle = {
      createWritable: async () => mockWritable,
    };

    const saved = await app.handleSaveActiveFile();
    expect(saved).toBe(true);
    expect(active.isDirty).toBe(false);
    expect(writtenData).toBe('New edited content');
    expect(app.terminalHistory.some(l => l.includes('Saved ' + active.name))).toBe(true);
  });

  it('handles context menu lifecycle and actions', () => {
    const { doc } = setupMockDom();
    doc.body.innerHTML = '<div id="app"></div>';
    const app = new MeIDEApp();
    app.mount(doc.getElementById('app')!);

    app.showContextMenu('welcome-md', 100, 200);
    expect(app.isContextMenuOpen).toBe(true);
    expect(app.contextMenuTargetId).toBe('welcome-md');
    expect(app.contextMenuPos).toEqual({ x: 100, y: 200 });

    app.closeContextMenu();
    expect(app.isContextMenuOpen).toBe(false);
    expect(app.contextMenuTargetId).toBeNull();
  });

  it('manages Steam-style startup auto-updater lifecycle', async () => {
    const { doc } = setupMockDom();
    doc.body.innerHTML = '<div id="app"></div>';
    const app = new MeIDEApp();
    app.mount(doc.getElementById('app')!);

    const splash = app.runSteamStartupUpdate({ speedMs: 5, force: true });
    expect(app.isSteamUpdating).toBe(true);
    expect(doc.body.innerHTML).toContain('meCraft Steam-Class Engine');
    expect(doc.body.innerHTML).toContain('Updating meIDE');

    // Manually dismiss
    splash.dismiss();
    expect(app.isSteamUpdating).toBe(false);
  });

  it('renders and manages desktop Google-only auth modal and sync import drawer', () => {
    const { doc } = setupMockDom();
    doc.body.innerHTML = '<div id="app"></div>';
    const app = new MeIDEApp();
    app.mount(doc.getElementById('app')!);

    app.isAuthModalOpen = true;
    app.renderDesktopGoogleAuthModal();

    expect(doc.body.innerHTML).toContain('modal-btn-auth-google');
    expect(doc.body.innerHTML).toContain('modal-link-web-signup');
    expect(doc.body.innerHTML).toContain('btn-toggle-sync-import');

    // Test toggle sync drawer
    app.toggleSyncDrawer();
    expect(app.showSyncImport).toBe(true);

    // Test Google auth execution
    app.handleGoogleAuth();
    expect(app.currentSession).not.toBeNull();
    expect(app.currentSession?.user.email).toBe('developer@mecraft.dev');
    expect(app.isAuthModalOpen).toBe(false);
  });
});
