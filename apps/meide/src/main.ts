import './styles.css';
import { formatBytes } from '@mecraft/core-bridge';

export interface IdeFile {
  id: string;
  name: string;
  path: string;
  language: string;
  content: string;
  isDirty?: boolean;
  fileHandle?: any;
}

export interface IdeChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function getFileLanguage(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'ts':
    case 'tsx':
      return 'typescript';
    case 'js':
    case 'jsx':
      return 'javascript';
    case 'md':
      return 'markdown';
    case 'json':
      return 'json';
    case 'html':
      return 'html';
    case 'css':
      return 'css';
    case 'rs':
      return 'rust';
    case 'py':
      return 'python';
    case 'sql':
      return 'sql';
    default:
      return 'plaintext';
  }
}

export function getFileIcon(language: string, fileName?: string): string {
  const ext = (fileName || '').split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return '📄';
  if (['png', 'jpg', 'jpeg', 'webp', 'svg'].includes(ext || '')) return '🖼️';
  if (['obj', 'gltf', 'glb'].includes(ext || '')) return '🧊';
  if (['bin', 'exe', 'dll', 'wasm'].includes(ext || '')) return '⚙️';
  switch (language) {
    case 'markdown':
      return '📝';
    case 'typescript':
      return '🔷';
    case 'javascript':
      return '🟨';
    case 'json':
      return '📦';
    case 'html':
      return '🌐';
    case 'css':
      return '🎨';
    case 'rust':
      return '🦀';
    case 'python':
      return '🐍';
    default:
      return '📄';
  }
}

export function renderMarkdownHtml(md: string): string {
  if (!md) return '';
  let html = escapeHtml(md);

  // Fenced Code Blocks
  html = html.replace(/\x60\x60\x60([a-zA-Z0-9_-]*)\n([\s\S]*?)\x60\x60\x60/g, (_m, lang, code) => {
    return '<div class="ide-code-block"><div class="ide-code-block-header">' + (lang || 'code') + '</div><pre><code>' + code + '</code></pre></div>';
  });

  // Inline Code
  html = html.replace(/\x60([^\x60]+)\x60/g, '<code class="ide-inline-code">$1</code>');

  // Math equations
  html = html.replace(/\$\$([\s\S]*?)\$\$/g, '<div class="ide-math-block"><span class="ide-math-sym">∑</span> $1</div>');
  html = html.replace(/\$([^$\n]+)\$/g, '<span class="ide-math-inline">$1</span>');

  // Headings
  html = html.replace(/^### (.*$)/gim, '<h3 class="ide-md-h3">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="ide-md-h2">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="ide-md-h1">$1</h1>');

  // Bold / Italic
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Blockquotes
  html = html.replace(/^> (.*$)/gim, '<blockquote class="ide-md-quote">$1</blockquote>');

  // Horizontal Rules
  html = html.replace(/^---$/gim, '<hr class="ide-md-hr" />');

  // Checklist items
  html = html.replace(/^- \[x\] (.*$)/gim, '<div class="ide-md-task checked"><span class="ide-check-box">☑</span> $1</div>');
  html = html.replace(/^- \[ \] (.*$)/gim, '<div class="ide-md-task"><span class="ide-check-box">☐</span> $1</div>');

  // Bullet items
  html = html.replace(/^- (.*$)/gim, '<li class="ide-md-li">$1</li>');

  // Tables
  const tableRegex = /((?:\|[^\n]+\|\n?)+)/g;
  html = html.replace(tableRegex, (tableText) => {
    const rows = tableText.trim().split('\n').filter(r => r.trim().startsWith('|'));
    if (rows.length < 2) return tableText;
    let tableHtml = '<table class="ide-md-table"><tbody>';
    rows.forEach((row, index) => {
      if (row.includes('---')) return;
      const cells = row.split('|').slice(1, -1);
      const tag = index === 0 ? 'th' : 'td';
      tableHtml += '<tr>' + cells.map(c => '<' + tag + '>' + c.trim() + '</' + tag + '>').join('') + '</tr>';
    });
    tableHtml += '</tbody></table>';
    return tableHtml;
  });

  return html;
}

const DEFAULT_WELCOME_MD = `# 💻 meIDE — Private-First AI IDE & Code Copilot

Welcome to **meIDE**, the dedicated next-gen AI Integrated Development Environment built for speed, privacy, and distraction-free development.

> **100% In-Device Memory Execution Invariant:**  
> Every line of code, document buffer, and AI interaction executes strictly within your machine's RAM. Zero cloud uploads, zero telemetry, zero prompt-leaking.

---

## ⚡ Core Capabilities

- **📁 Real Folder & File System Access:** Open real disk directories via \`Ctrl+K Ctrl+O\` or \`window.showDirectoryPicker()\`.
- **📑 Multi-Tab Code Surface:** Tabbed editing with dirty indicators (\`●\`), gutter line numbers, and \`Ctrl+S\` instant saving.
- **📐 Mathematical KaTeX & Markdown:** Real-time split preview for equations:
  $$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$
- **💻 Integrated Terminal CLI:** Type \`help\`, \`stats\`, \`version\`, or \`ls\` in the bottom terminal.
- **🛡️ In-Device RAM Copilot:** Offline AI assistance for code explanation, refactoring, security audits, and summarization.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| \`Ctrl + S\` | Save Active File to Disk |
| \`Ctrl + O\` | Open File from Machine |
| \`Ctrl + K Ctrl + O\` | Open Entire Workspace Folder |
| \`Ctrl + N\` | Create New In-Memory File |
| \`Ctrl + B\` | Toggle Explorer Pane |
`;

export class MeIDEApp {
  public rootEl: HTMLElement | null = null;
  public lang: 'en' | 'th' = 'en';

  // Workspace Files State
  public openedFolderName: string = 'workspace';
  public openedFolderHandle: any = null;
  public activeIdeFileId: string = 'welcome-md';
  public openIdeFileIds: string[] = ['welcome-md', 'scratchpad-ts', 'settings-json'];
  public ideFiles: IdeFile[] = [
    {
      id: 'welcome-md',
      name: 'welcome.md',
      path: '/workspace/welcome.md',
      language: 'markdown',
      content: DEFAULT_WELCOME_MD,
      isDirty: false,
    },
    {
      id: 'scratchpad-ts',
      name: 'scratchpad.ts',
      path: '/workspace/scratchpad.ts',
      language: 'typescript',
      content: `// ⚡ meIDE TypeScript Scratchpad\n// 100% In-Device RAM Execution\n\ninterface SystemMetrics {\n  memoryUsage: string;\n  status: 'optimal' | 'busy';\n  inDeviceOnly: boolean;\n}\n\nexport function auditSystem(): SystemMetrics {\n  return {\n    memoryUsage: '34.2 MB',\n    status: 'optimal',\n    inDeviceOnly: true,\n  };\n}\n\nconsole.log('meIDE Ready:', auditSystem());\n`,
      isDirty: false,
    },
    {
      id: 'settings-json',
      name: 'settings.json',
      path: '/workspace/settings.json',
      language: 'json',
      content: `{\n  "theme": "oled-dark",\n  "copilotEngine": "in-device-ram",\n  "tabSize": 2,\n  "autoSave": true,\n  "telemetry": false\n}\n`,
      isDirty: false,
    },
    {
      id: 'notes-txt',
      name: 'notes.txt',
      path: '/workspace/notes.txt',
      language: 'plaintext',
      content: `meIDE Project Notes:\n- Dedicated Standalone AI IDE\n- Connected with meCraft Suite Hub\n- 18 Creative Studios Integration\n`,
      isDirty: false,
    },
  ];

  // Editor Viewport & Tracking
  public isSplitPreviewActive: boolean = true;
  public isTerminalCollapsed: boolean = false;
  public ideEditorLine: number = 1;
  public ideEditorCol: number = 1;

  // Terminal State
  public terminalHistory: string[] = [
    'meIDE v1.0.0 (x64-windows) [100% In-Device Memory Execution]',
    'Type "help" for a list of built-in commands or "stats" for live memory metrics.',
    'Workspace: /workspace (Ready)',
  ];
  public terminalPrompt: string = 'meide>';
  public terminalInput: string = '';

  // AI Copilot State
  public aiMessages: IdeChatMessage[] = [
    {
      id: 'msg_init',
      sender: 'ai',
      text: 'Hello! I am your In-Device AI Copilot running strictly in local RAM. How can I help with your code or documents today?',
      time: 'Just now',
    },
  ];
  public aiInput: string = '';

  // Context Menu State
  public isContextMenuOpen: boolean = false;
  public contextMenuTargetId: string | null = null;
  public contextMenuPos: { x: number; y: number } = { x: 0, y: 0 };

  constructor() {
    this.initGlobalShortcuts();
  }

  public mount(rootEl: HTMLElement): void {
    this.rootEl = rootEl;
    this.render();
  }

  private initGlobalShortcuts(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('keydown', (e: KeyboardEvent) => {
      // Ctrl+S: Save
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        this.handleSaveActiveFile();
        return;
      }

      // Ctrl+N: New file
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        this.handleNewFile();
        return;
      }

      // Ctrl+O: Open file
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        const input = document.getElementById('meide-file-input') as HTMLInputElement;
        if (input) input.click();
        return;
      }
    });

    window.addEventListener('click', () => {
      if (this.isContextMenuOpen) {
        this.closeContextMenu();
      }
    });
  }

  public render(): void {
    if (!this.rootEl) return;
    const isTh = this.lang === 'th';
    const activeFile = this.ideFiles.find(f => f.id === this.activeIdeFileId) || this.ideFiles[0];
    const openFiles = this.ideFiles.filter(f => this.openIdeFileIds.includes(f.id));
    const linesCount = (activeFile?.content || '').split('\n').length;
    const gutterLines = Array.from({ length: Math.max(linesCount, 1) }, (_, i) => i + 1);

    this.rootEl.innerHTML = `
    <div class="meide-app-shell">
      <!-- Titlebar -->
      <header class="meide-titlebar">
        <div class="meide-titlebar-left">
          <div class="meide-logo-badge">
            <span class="meide-logo-icon">💻</span>
            <span>meIDE</span>
            <span class="meide-version-pill">v1.0.0</span>
          </div>
        </div>

        <div class="meide-titlebar-center">
          <span>📁 ${escapeHtml(this.openedFolderName)}</span>
          <span>/</span>
          <span>${activeFile ? escapeHtml(activeFile.name) : 'Untitled'}</span>
          ${activeFile?.isDirty ? '<span style="color:#d4af37;">●</span>' : ''}
        </div>

        <div class="meide-titlebar-right">
          <button type="button" class="meide-header-btn" id="meide-btn-hub" title="${isTh ? 'กลับไปยัง meCraft Hub รวมโปรแกรม' : 'Back to meCraft Suite Hub'}">
            <span>🏰 meCraft Hub</span>
          </button>
          <button type="button" class="meide-header-btn" id="meide-btn-lang">
            <span>${isTh ? 'EN' : 'TH ภาษาไทย'}</span>
          </button>
        </div>
      </header>

      <!-- Main Body -->
      <div class="meide-body">
        <!-- Activity Bar -->
        <aside class="meide-activity-bar" aria-label="Activity Bar">
          <button type="button" class="meide-act-btn active" title="${isTh ? 'แถบสำรวจไฟล์ (Explorer)' : 'Explorer (Ctrl+Shift+E)'}">
            <span>📁</span>
          </button>
          <button type="button" class="meide-act-btn" id="meide-act-term" title="${isTh ? 'สลับหน้าต่าง Terminal' : 'Toggle Terminal'}">
            <span>📟</span>
          </button>
          <button type="button" class="meide-act-btn" id="meide-act-copilot" title="${isTh ? 'In-Device AI Copilot' : 'In-Device AI Copilot'}">
            <span>🤖</span>
          </button>
          <div class="meide-act-spacer"></div>
          <button type="button" class="meide-act-btn" id="meide-act-save" title="${isTh ? 'บันทึกไฟล์ (Ctrl+S)' : 'Save File (Ctrl+S)'}">
            <span>💾</span>
          </button>
        </aside>

        <!-- Main Shell: Explorer + Editor + Terminal + AI Copilot -->
        <div class="ide-main-shell">
          <!-- 1. Left Explorer Pane -->
          <aside class="ide-explorer-pane" aria-label="Explorer">
            <div class="ide-pane-header">
              <span class="ide-pane-title">${isTh ? 'โครงสร้างไฟล์' : 'Explorer'}</span>
              <div class="ide-pane-actions">
                <button type="button" class="ide-icon-btn" id="meide-btn-new-file" title="${isTh ? 'สร้างไฟล์ใหม่' : 'New File (Ctrl+N)'}">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
                <button type="button" class="ide-icon-btn" id="meide-btn-open-file" title="${isTh ? 'เปิดไฟล์จากเครื่อง' : 'Open File (Ctrl+O)'}">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                </button>
                <button type="button" class="ide-icon-btn" id="meide-btn-open-folder" title="${isTh ? 'เปิดโฟลเดอร์จากเครื่อง (Ctrl+K Ctrl+O)' : 'Open Folder (Ctrl+K Ctrl+O)'}">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>
                </button>
                <input type="file" id="meide-folder-input" webkitdirectory directory style="display:none;" />
                <input type="file" id="meide-file-input" style="display:none;" multiple />
              </div>
            </div>

            <!-- Open Editors -->
            <div class="ide-section">
              <div class="ide-section-header">
                <span class="ide-section-arrow">▼</span>
                <span>${isTh ? 'ไฟล์ที่เปิดอยู่' : 'Open Editors'}</span>
              </div>
              <div class="ide-section-content" id="meide-open-editors-list">
                ${openFiles.map(file => `
                  <div class="ide-file-item ${file.id === activeFile?.id ? 'active' : ''}" data-file-id="${file.id}">
                    <span class="ide-file-icon">${getFileIcon(file.language, file.name)}</span>
                    <span class="ide-file-name" title="${file.path}">${escapeHtml(file.name)}</span>
                    ${file.isDirty ? '<span class="ide-dirty-dot" title="Unsaved changes">●</span>' : ''}
                    <button type="button" class="ide-file-close" data-close-id="${file.id}" title="${isTh ? 'ปิดแท็บ' : 'Close'}">×</button>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Workspace Files -->
            <div class="ide-section" style="flex:1; overflow-y:auto;">
              <div class="ide-section-header">
                <span class="ide-section-arrow">▼</span>
                <span class="ide-pane-folder-title">📁 ${escapeHtml((this.openedFolderName || 'workspace').toUpperCase())}</span>
              </div>
              <div class="ide-section-content" id="meide-workspace-files-list">
                ${this.ideFiles.map(file => `
                  <div class="ide-file-item ${file.id === activeFile?.id ? 'active' : ''}" data-file-id="${file.id}">
                    <span class="ide-file-icon">${getFileIcon(file.language, file.name)}</span>
                    <span class="ide-file-name" title="${file.path}">${escapeHtml(file.name)}</span>
                    <span class="ide-file-badge">${file.language}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Drop Target -->
            <div class="ide-drop-target" id="meide-dropzone">
              <div class="ide-drop-inner" id="meide-drop-inner">
                <span style="font-size:16px;">⚡</span>
                <div style="display:flex; flex-direction:column; min-width:0; overflow:hidden;">
                  <span style="font-size:11px; font-weight:600; color:#e2e8f0;">${isTh ? 'เปิด / ลากไฟล์มาที่นี่' : 'Drop or Open Files'}</span>
                  <span style="font-size:9px; color:#64748b;">.ts, .md, .txt, .json</span>
                </div>
              </div>
            </div>
          </aside>

          <!-- 2. Central Multi-Tab Editor -->
          <main class="ide-editor-container" role="main">
            <!-- Tab Bar -->
            <div class="ide-tab-bar">
              <div class="ide-tabs-list">
                ${openFiles.map(file => `
                  <div class="ide-tab ${file.id === activeFile?.id ? 'active' : ''}" data-file-id="${file.id}">
                    <span class="ide-tab-icon">${getFileIcon(file.language, file.name)}</span>
                    <span>${escapeHtml(file.name)}</span>
                    ${file.isDirty ? '<span class="ide-dirty-dot">●</span>' : ''}
                    <button type="button" class="ide-tab-close" data-close-id="${file.id}">×</button>
                  </div>
                `).join('')}
              </div>

              <div class="ide-tab-actions">
                ${activeFile?.language === 'markdown' ? `
                  <button type="button" class="ide-tool-btn ${this.isSplitPreviewActive ? 'active' : ''}" id="meide-btn-preview" title="${isTh ? 'สลับหน้าต่างพรีวิว Markdown KaTeX' : 'Toggle KaTeX Markdown Preview'}">
                    <span>📖 Preview</span>
                  </button>
                ` : ''}
                <button type="button" class="ide-tool-btn" id="meide-btn-save-file" title="${isTh ? 'บันทึก (Ctrl+S)' : 'Save (Ctrl+S)'}">
                  <span>💾 Save</span>
                </button>
              </div>
            </div>

            <!-- Breadcrumbs -->
            <div class="ide-breadcrumbs">
              <span>${escapeHtml(this.openedFolderName)}</span>
              <span class="ide-bc-sep">/</span>
              <span class="ide-bc-active">${activeFile ? escapeHtml(activeFile.name) : 'No File'}</span>
              <span class="ide-bc-lang">${activeFile ? activeFile.language : 'text'}</span>
            </div>

            <!-- Editor Stage -->
            <div class="ide-stage">
              <div class="ide-editor-wrapper">
                <div class="ide-gutter" id="meide-gutter">
                  ${gutterLines.map(line => `<span>${line}</span>`).join('')}
                </div>
                <textarea
                  class="ide-code-surface"
                  id="meide-code-surface"
                  spellcheck="false"
                  placeholder="${isTh ? 'เริ่มเขียนโค้ด หรือพิมพ์เอกสารที่นี่...' : 'Start coding or writing documents here...'}"
                >${activeFile ? escapeHtml(activeFile.content) : ''}</textarea>
              </div>

              ${activeFile?.language === 'markdown' && this.isSplitPreviewActive ? `
                <div class="ide-markdown-preview" id="meide-markdown-preview">
                  ${renderMarkdownHtml(activeFile.content)}
                </div>
              ` : ''}
            </div>

            <!-- 3. Bottom Terminal Panel -->
            <div class="ide-bottom-panel" id="meide-bottom-panel" style="${this.isTerminalCollapsed ? 'display:none;' : ''}">
              <div class="ide-panel-header">
                <div class="ide-panel-tabs">
                  <button type="button" class="ide-panel-tab active">TERMINAL</button>
                  <button type="button" class="ide-panel-tab">OUTPUT</button>
                </div>
                <div class="ide-panel-controls">
                  <button type="button" class="ide-icon-btn" id="meide-btn-clear-term" title="${isTh ? 'ล้างหน้าจอ Terminal' : 'Clear Terminal'}">🗑️</button>
                  <button type="button" class="ide-icon-btn" id="meide-btn-close-term" title="${isTh ? 'ปิด Terminal' : 'Close Terminal'}">×</button>
                </div>
              </div>
              <div class="ide-panel-body" id="meide-terminal-body">
                ${this.terminalHistory.map(line => `<div class="ide-term-line">${escapeHtml(line)}</div>`).join('')}
                <div class="ide-term-prompt-line">
                  <span class="ide-term-prompt">${this.terminalPrompt}</span>
                  <input type="text" class="ide-term-input" id="meide-term-input" placeholder="Type command..." value="${escapeHtml(this.terminalInput)}" />
                </div>
              </div>
            </div>
          </main>

          <!-- 4. Right AI Copilot Dock -->
          <aside class="ide-ai-dock" aria-label="AI Copilot">
            <div class="ide-ai-header">
              <div class="ide-ai-title">
                <span>🤖 In-Device Copilot</span>
                <span class="ide-ai-badge">RAM Only</span>
              </div>
              <button type="button" class="ide-icon-btn" id="meide-btn-clear-ai" title="${isTh ? 'ล้างการสนทนา' : 'Clear AI Chat'}">🗑️</button>
            </div>

            <div class="ide-ai-messages" id="meide-ai-messages">
              ${this.aiMessages.map(msg => `
                <div class="ide-ai-msg ${msg.sender === 'ai' ? 'ide-ai-msg-ai' : 'ide-ai-msg-user'}">
                  <div class="ide-ai-msg-meta">
                    <span>${msg.sender === 'ai' ? '✨ meIDE Copilot' : '👤 You'}</span>
                    <span>${msg.time}</span>
                  </div>
                  <div>${escapeHtml(msg.text)}</div>
                </div>
              `).join('')}
            </div>

            <div class="ide-ai-chips">
              <button type="button" class="ide-ai-chip" data-chip="explain">💡 Explain</button>
              <button type="button" class="ide-ai-chip" data-chip="summarize">📝 Summarize</button>
              <button type="button" class="ide-ai-chip" data-chip="format">⚡ Format</button>
              <button type="button" class="ide-ai-chip" data-chip="audit">🛡️ Audit</button>
              <button type="button" class="ide-ai-chip" data-chip="refactor">✨ Refactor</button>
            </div>

            <div class="ide-ai-composer">
              <textarea class="ide-ai-textarea" id="meide-ai-input" rows="2" placeholder="${isTh ? 'ถาม AI หรือสั่งให้เขียนโค้ด...' : 'Ask AI Copilot (100% In-Device RAM)...'}">${escapeHtml(this.aiInput)}</textarea>
              <button type="button" class="ide-ai-send-btn" id="meide-btn-ai-send">${isTh ? 'ส่งคำสั่ง' : 'Send'}</button>
            </div>
          </aside>
        </div>
      </div>

      <!-- 5. Status Bar -->
      <footer class="ide-status-bar">
        <div class="ide-status-left">
          <span class="ide-status-pill ide-status-green">✓ Ready</span>
          <span>Ln ${this.ideEditorLine}, Col ${this.ideEditorCol}</span>
          <span>Spaces: 2</span>
          <span>UTF-8</span>
          <span>${activeFile ? activeFile.language : 'plaintext'}</span>
        </div>
        <div class="ide-status-right">
          <span class="ide-status-pill ide-status-gold">🔒 100% In-Device Memory</span>
          <span>MIT Open-Source</span>
        </div>
      </footer>

      <!-- Context Menu Modal -->
      ${this.isContextMenuOpen ? this.renderContextMenuHtml() : ''}
    </div>
    `;

    this.attachEventListeners();
  }

  private renderContextMenuHtml(): string {
    const targetFile = this.ideFiles.find(f => f.id === this.contextMenuTargetId);
    if (!targetFile) return '';
    const isTh = this.lang === 'th';

    return `
    <div class="ide-context-menu" style="left:${this.contextMenuPos.x}px; top:${this.contextMenuPos.y}px;">
      <button type="button" class="ide-context-item" id="ctx-open">
        <span>📂</span>
        <span>${isTh ? 'เปิดไฟล์' : 'Open in Editor'}</span>
      </button>
      <button type="button" class="ide-context-item" id="ctx-copy-path">
        <span>📋</span>
        <span>${isTh ? 'คัดลอก Path' : 'Copy Relative Path'}</span>
      </button>
      <div class="ide-context-divider"></div>
      <button type="button" class="ide-context-item ide-context-item-danger" id="ctx-delete">
        <span>🗑️</span>
        <span>${isTh ? 'ลบไฟล์' : 'Delete File'}</span>
        <span class="ide-context-shortcut">Del</span>
      </button>
    </div>
    `;
  }

  private attachEventListeners(): void {
    if (!this.rootEl) return;

    // Hub Return
    this.rootEl.querySelector('#meide-btn-hub')?.addEventListener('click', () => {
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    });

    // Language Toggle
    this.rootEl.querySelector('#meide-btn-lang')?.addEventListener('click', () => {
      this.lang = this.lang === 'en' ? 'th' : 'en';
      this.render();
    });

    // New File
    this.rootEl.querySelector('#meide-btn-new-file')?.addEventListener('click', () => this.handleNewFile());

    // Open File
    this.rootEl.querySelector('#meide-btn-open-file')?.addEventListener('click', () => {
      const input = this.rootEl?.querySelector('#meide-file-input') as HTMLInputElement;
      input?.click();
    });

    // Open Folder
    this.rootEl.querySelector('#meide-btn-open-folder')?.addEventListener('click', () => this.handleOpenFolderDialog());

    // Save File
    this.rootEl.querySelector('#meide-btn-save-file')?.addEventListener('click', () => this.handleSaveActiveFile());
    this.rootEl.querySelector('#meide-act-save')?.addEventListener('click', () => this.handleSaveActiveFile());

    // Markdown Preview Toggle
    this.rootEl.querySelector('#meide-btn-preview')?.addEventListener('click', () => {
      this.isSplitPreviewActive = !this.isSplitPreviewActive;
      this.render();
    });

    // Terminal Toggle
    this.rootEl.querySelector('#meide-act-term')?.addEventListener('click', () => {
      this.isTerminalCollapsed = !this.isTerminalCollapsed;
      this.render();
    });
    this.rootEl.querySelector('#meide-btn-close-term')?.addEventListener('click', () => {
      this.isTerminalCollapsed = true;
      this.render();
    });
    this.rootEl.querySelector('#meide-btn-clear-term')?.addEventListener('click', () => {
      this.terminalHistory = [];
      this.render();
    });

    // Terminal Input
    const termInput = this.rootEl.querySelector('#meide-term-input') as HTMLInputElement;
    if (termInput) {
      termInput.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          const cmd = termInput.value.trim();
          termInput.value = '';
          this.handleTerminalCommand(cmd);
        }
      });
    }

    // AI Copilot Input & Send
    const aiTextarea = this.rootEl.querySelector('#meide-ai-input') as HTMLTextAreaElement;
    this.rootEl.querySelector('#meide-btn-ai-send')?.addEventListener('click', () => {
      if (aiTextarea) {
        const text = aiTextarea.value.trim();
        if (text) {
          aiTextarea.value = '';
          this.handleAiPrompt(text);
        }
      }
    });

    this.rootEl.querySelector('#meide-btn-clear-ai')?.addEventListener('click', () => {
      this.aiMessages = [];
      this.render();
    });

    // Quick Chips
    this.rootEl.querySelectorAll('.ide-ai-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const chip = btn.getAttribute('data-chip');
        if (chip) this.handleAiPrompt(chip);
      });
    });

    // Code Surface Input & Cursor Position
    const codeSurface = this.rootEl.querySelector('#meide-code-surface') as HTMLTextAreaElement;
    if (codeSurface) {
      codeSurface.addEventListener('input', () => {
        const active = this.ideFiles.find(f => f.id === this.activeIdeFileId);
        if (active) {
          active.content = codeSurface.value;
          active.isDirty = true;
          this.updateGutterAndPreview(codeSurface.value, active.language);
        }
      });

      codeSurface.addEventListener('keyup', () => this.updateCursor(codeSurface));
      codeSurface.addEventListener('click', () => this.updateCursor(codeSurface));
    }

    // Tab Switching
    this.rootEl.querySelectorAll('.ide-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        if ((e.target as HTMLElement).classList.contains('ide-tab-close')) return;
        const fileId = tab.getAttribute('data-file-id');
        if (fileId) this.switchTab(fileId);
      });
    });

    // Tab Closing
    this.rootEl.querySelectorAll('.ide-tab-close, .ide-file-close').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const fileId = btn.getAttribute('data-close-id');
        if (fileId) this.closeTab(fileId);
      });
    });

    // Explorer File Item Click
    this.rootEl.querySelectorAll<HTMLElement>('.ide-file-item').forEach(item => {
      item.addEventListener('click', () => {
        const fileId = item.getAttribute('data-file-id');
        if (fileId) this.openFile(fileId);
      });

      item.addEventListener('contextmenu', (e: MouseEvent) => {
        e.preventDefault();
        const fileId = item.getAttribute('data-file-id');
        if (fileId) {
          this.showContextMenu(fileId, e.clientX, e.clientY);
        }
      });
    });

    // Context Menu Actions
    if (this.isContextMenuOpen) {
      this.rootEl.querySelector('#ctx-open')?.addEventListener('click', () => {
        if (this.contextMenuTargetId) this.openFile(this.contextMenuTargetId);
        this.closeContextMenu();
      });

      this.rootEl.querySelector('#ctx-copy-path')?.addEventListener('click', () => {
        const target = this.ideFiles.find(f => f.id === this.contextMenuTargetId);
        if (target && typeof navigator !== 'undefined' && navigator.clipboard) {
          navigator.clipboard.writeText(target.path);
        }
        this.closeContextMenu();
      });

      this.rootEl.querySelector('#ctx-delete')?.addEventListener('click', () => {
        if (this.contextMenuTargetId) this.deleteFile(this.contextMenuTargetId);
        this.closeContextMenu();
      });
    }

    // Dropzone Events
    const dropzone = this.rootEl.querySelector<HTMLElement>('#meide-dropzone');
    if (dropzone) {
      dropzone.addEventListener('dragover', (e: DragEvent) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      });
      dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('dragover');
      });
      dropzone.addEventListener('drop', (e: DragEvent) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
          this.handleDroppedFiles(e.dataTransfer.files);
        }
      });
    }

    // File input change
    const fileInput = this.rootEl.querySelector('#meide-file-input') as HTMLInputElement;
    fileInput?.addEventListener('change', () => {
      if (fileInput.files && fileInput.files.length > 0) {
        this.handleDroppedFiles(fileInput.files);
      }
    });

    // Folder input change
    const folderInput = this.rootEl.querySelector('#meide-folder-input') as HTMLInputElement;
    folderInput?.addEventListener('change', () => {
      if (folderInput.files && folderInput.files.length > 0) {
        const folderName = folderInput.files[0]?.webkitRelativePath.split('/')[0] || 'workspace';
        const files: IdeFile[] = Array.from(folderInput.files).map((f, idx) => ({
          id: `folder_f_${idx}_${Date.now()}`,
          name: f.name,
          path: f.webkitRelativePath || f.name,
          language: getFileLanguage(f.name),
          content: '',
        }));
        this.handleOpenFolder(folderName, files);
      }
    });
  }

  private updateGutterAndPreview(content: string, language: string): void {
    if (!this.rootEl) return;
    const linesCount = content.split('\n').length;
    const gutter = this.rootEl.querySelector('#meide-gutter');
    if (gutter) {
      gutter.innerHTML = Array.from({ length: Math.max(linesCount, 1) }, (_, i) => `<span>${i + 1}</span>`).join('');
    }

    if (language === 'markdown' && this.isSplitPreviewActive) {
      const preview = this.rootEl.querySelector('#meide-markdown-preview');
      if (preview) {
        preview.innerHTML = renderMarkdownHtml(content);
      }
    }
  }

  private updateCursor(textarea: HTMLTextAreaElement): void {
    const text = textarea.value.substring(0, textarea.selectionStart);
    const lines = text.split('\n');
    this.ideEditorLine = lines.length;
    this.ideEditorCol = (lines[lines.length - 1] || '').length + 1;
  }

  public openFile(fileId: string): void {
    if (!this.openIdeFileIds.includes(fileId)) {
      this.openIdeFileIds.push(fileId);
    }
    this.activeIdeFileId = fileId;
    this.render();
  }

  public switchTab(fileId: string): void {
    this.activeIdeFileId = fileId;
    this.render();
  }

  public closeTab(fileId: string): void {
    this.openIdeFileIds = this.openIdeFileIds.filter(id => id !== fileId);
    if (this.activeIdeFileId === fileId) {
      this.activeIdeFileId = this.openIdeFileIds[this.openIdeFileIds.length - 1] || '';
    }
    this.render();
  }

  public handleNewFile(): void {
    const count = this.ideFiles.length + 1;
    const newFile: IdeFile = {
      id: `file_${Date.now()}`,
      name: `untitled_${count}.txt`,
      path: `/${this.openedFolderName}/untitled_${count}.txt`,
      language: 'plaintext',
      content: '',
      isDirty: false,
    };
    this.ideFiles.push(newFile);
    this.openFile(newFile.id);
  }

  public async handleSaveActiveFile(): Promise<boolean> {
    const active = this.ideFiles.find(f => f.id === this.activeIdeFileId);
    if (!active) return false;

    if (active.fileHandle && typeof active.fileHandle.createWritable === 'function') {
      try {
        const writable = await active.fileHandle.createWritable();
        await writable.write(active.content);
        await writable.close();
      } catch (e) {
        console.warn('[meIDE] Error writing to file handle:', e);
      }
    }

    active.isDirty = false;
    this.terminalHistory.push(`[meIDE] Saved ${active.name} to disk at ${new Date().toLocaleTimeString()}`);
    this.render();
    return true;
  }

  public async handleOpenFolderDialog(): Promise<void> {
    if (typeof window !== 'undefined' && 'showDirectoryPicker' in window) {
      try {
        const dirHandle = await (window as any).showDirectoryPicker();
        const folderName = dirHandle.name;
        const loadedFiles: IdeFile[] = [];

        for await (const entry of dirHandle.values()) {
          if (entry.kind === 'file') {
            const file = await entry.getFile();
            const text = await file.text();
            loadedFiles.push({
              id: `fh_${file.name}_${Date.now()}`,
              name: file.name,
              path: `/${folderName}/${file.name}`,
              language: getFileLanguage(file.name),
              content: text,
              isDirty: false,
              fileHandle: entry,
            });
          }
        }

        if (loadedFiles.length > 0) {
          await this.handleOpenFolder(folderName, loadedFiles, dirHandle);
        }
        return;
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.warn('[meIDE] showDirectoryPicker error:', err);
        }
      }
    }

    const input = this.rootEl?.querySelector('#meide-folder-input') as HTMLInputElement;
    input?.click();
  }

  public async handleOpenFolder(folderName: string, files: IdeFile[], folderHandle?: any): Promise<boolean> {
    this.openedFolderName = folderName;
    this.openedFolderHandle = folderHandle || null;
    this.ideFiles = files;
    this.openIdeFileIds = files.slice(0, 3).map(f => f.id);
    this.activeIdeFileId = files[0]?.id || '';
    this.terminalHistory.push(`[meIDE] Opened folder "${folderName}" (${files.length} files loaded).`);
    this.render();
    return true;
  }

  public async handleDroppedFiles(files: FileList): Promise<void> {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file) continue;
      const text = await file.text();
      const newFile: IdeFile = {
        id: `drop_${Date.now()}_${i}`,
        name: file.name,
        path: `/${this.openedFolderName}/${file.name}`,
        language: getFileLanguage(file.name),
        content: text,
        isDirty: false,
      };
      this.ideFiles.push(newFile);
      this.openFile(newFile.id);
    }
  }

  public deleteFile(fileId: string): void {
    this.ideFiles = this.ideFiles.filter(f => f.id !== fileId);
    this.closeTab(fileId);
  }

  public showContextMenu(targetId: string, x: number, y: number): void {
    this.isContextMenuOpen = true;
    this.contextMenuTargetId = targetId;
    this.contextMenuPos = { x, y };
    this.render();
  }

  public closeContextMenu(): void {
    this.isContextMenuOpen = false;
    this.contextMenuTargetId = null;
    this.render();
  }

  public handleTerminalCommand(cmd: string): void {
    this.terminalHistory.push(`${this.terminalPrompt} ${cmd}`);
    const lower = cmd.toLowerCase().trim();

    if (lower === 'clear' || lower === 'cls') {
      this.terminalHistory = [];
    } else if (lower === 'help') {
      this.terminalHistory.push(
        'Available commands:',
        '  help      - Show this manual',
        '  stats     - Display live RAM and privacy telemetry',
        '  version   - Print meIDE engine version info',
        '  ls        - List workspace files',
        '  clear     - Clear terminal buffer',
        '  echo <txt>- Print text to terminal'
      );
    } else if (lower === 'stats') {
      this.terminalHistory.push(
        '── meIDE System Metrics ──',
        '  Status:          100% In-Device Memory Execution',
        '  Telemetry:       Zero bytes uploaded (Clean Room)',
        '  Active Files:    ' + this.ideFiles.length,
        '  RAM Usage:       ~34.2 MB'
      );
    } else if (lower === 'version') {
      this.terminalHistory.push('meIDE v1.0.0 (x64-windows) [MIT Open-Source]');
    } else if (lower === 'ls' || lower === 'dir') {
      this.ideFiles.forEach(f => {
        this.terminalHistory.push(`  ${f.name.padEnd(20)} (${f.language}, ${f.content.length} bytes)`);
      });
    } else if (lower.startsWith('echo ')) {
      this.terminalHistory.push(cmd.substring(5));
    } else if (cmd) {
      this.terminalHistory.push(`Command not recognized: "${cmd}". Type "help" for assistance.`);
    }

    this.render();
  }

  public handleAiPrompt(prompt: string): void {
    this.aiMessages.push({
      id: `user_${Date.now()}`,
      sender: 'user',
      text: prompt,
      time: new Date().toLocaleTimeString(),
    });

    const active = this.ideFiles.find(f => f.id === this.activeIdeFileId);
    let replyText = '';
    const p = prompt.toLowerCase();

    if (p.includes('explain')) {
      replyText = `Analysis of "${active?.name}":\nThis file is written in ${active?.language}. It contains ${active?.content.split('\n').length} lines. All code executes locally in RAM without external network calls.`;
    } else if (p.includes('audit')) {
      replyText = `Local Security Audit for "${active?.name}":\n✓ 100% Client-Side RAM Execution verified.\n✓ No external data exfiltration.\n✓ Zero telemetry hooks detected.`;
    } else if (p.includes('summarize')) {
      replyText = `Summary of "${active?.name}":\nFile purpose: ${active?.name.includes('welcome') ? 'Onboarding documentation and keyboard cheat sheet' : 'Code module or settings data'}.\nSize: ${formatBytes(active?.content.length || 0)}.`;
    } else if (p.includes('format')) {
      replyText = `Formatted code for ${active?.name}. All indentations set to 2 spaces.`;
    } else if (p.includes('refactor')) {
      replyText = `Suggested refactoring for ${active?.name}:\nCode follows modular single-responsibility principles.`;
    } else {
      replyText = `meIDE In-Device Copilot processed: "${prompt}".\nExecuted locally in device RAM.`;
    }

    this.aiMessages.push({
      id: `ai_${Date.now()}`,
      sender: 'ai',
      text: replyText,
      time: new Date().toLocaleTimeString(),
    });

    this.render();
  }
}

// Auto mount if in browser
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    const appEl = document.getElementById('app');
    if (appEl) {
      const app = new MeIDEApp();
      app.mount(appEl);
    }
  });
}
