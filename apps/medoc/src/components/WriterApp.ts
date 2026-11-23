/**
 * @file WriterApp.ts
 * meDoc Studio — Distraction-Free Writer UI Component
 * 100% In-Device RAM Privacy
 */

import { VaultManager, VaultDocument } from '../engines/VaultManager.js';
import { renderMarkdown, computeDocumentStats, DocumentStats } from '../engines/MarkdownEngine.js';
import { extractHeadings, TocItem } from '../engines/TocEngine.js';
import { exportMarkdownToPdf, downloadPdf } from '../engines/PdfExporter.js';

export class WriterApp {
  private container: HTMLElement;
  private vault: VaultManager;
  private activeDoc: VaultDocument;
  private viewMode: 'split' | 'editor' | 'preview' = 'split';
  private zenMode: boolean = false;
  private sidebarCollapsed: boolean = false;
  private sidebarTab: 'toc' | 'files' = 'toc';
  private renderDebounceTimer: any = null;

  // DOM Elements cache
  private shellEl!: HTMLElement;
  private titleInputEl!: HTMLInputElement;
  private textareaEl!: HTMLTextAreaElement;
  private gutterEl!: HTMLElement;
  private previewEl!: HTMLElement;
  private previewPaneEl!: HTMLElement;
  private editorPaneEl!: HTMLElement;
  private sidebarEl!: HTMLElement;
  private sidebarContentEl!: HTMLElement;
  private statusWordCountEl!: HTMLElement;
  private statusCharCountEl!: HTMLElement;
  private statusReadingTimeEl!: HTMLElement;
  private statusSaveStateEl!: HTMLElement;

  constructor(target: HTMLElement) {
    this.container = target;
    this.vault = new VaultManager();
    this.activeDoc = this.vault.getActiveDocument();

    if (typeof window !== 'undefined' && window.location) {
      const urlParams = new URLSearchParams(window.location.search);
      const viewParam = urlParams.get('view');
      if (viewParam === 'editor' || viewParam === 'preview' || viewParam === 'split') {
        this.viewMode = viewParam;
      }
      if (urlParams.get('zen') === 'true') {
        this.zenMode = true;
      }
      if (urlParams.get('tab') === 'files') {
        this.sidebarTab = 'files';
      }
    }

    this.mount();
    this.bindEvents();
    if (this.zenMode) {
      this.toggleZenMode(true);
    } else {
      this.setViewMode(this.viewMode);
    }
    this.triggerRender(true);

    if (typeof window !== 'undefined' && window.location) {
      const urlParams = new URLSearchParams(window.location.search);
      const scrollParam = urlParams.get('scroll');
      if (scrollParam) {
        setTimeout(() => {
          if (scrollParam === 'mermaid') {
            const el = this.previewPaneEl.querySelector('.mermaid-container');
            el?.scrollIntoView({ behavior: 'instant' as any });
          } else if (scrollParam === 'katex') {
            const el = this.previewPaneEl.querySelector('.medoc-math-display');
            el?.scrollIntoView({ behavior: 'instant' as any });
          }
        }, 120);
      }
    }
  }

  private mount(): void {
    this.container.innerHTML = `
      <div class="medoc-shell" id="medoc-shell">
        <!-- Top Bar -->
        <header class="medoc-topbar" id="medoc-topbar">
          <div class="medoc-brand">
            <div class="medoc-logo-icon">D</div>
            <div class="medoc-brand-title">meDoc</div>
            <input type="text" class="medoc-doc-title-input" id="medoc-doc-title" value="${this.activeDoc.name}" spellcheck="false" />
          </div>

          <div class="medoc-topbar-actions">
            <!-- View Mode Switcher -->
            <div class="medoc-segmented">
              <button class="medoc-segmented-item ${this.viewMode === 'split' ? 'active' : ''}" data-view="split" title="Split View">Split</button>
              <button class="medoc-segmented-item ${this.viewMode === 'editor' ? 'active' : ''}" data-view="editor" title="Editor Only">Edit</button>
              <button class="medoc-segmented-item ${this.viewMode === 'preview' ? 'active' : ''}" data-view="preview" title="Preview Only">Preview</button>
            </div>

            <!-- Zen Mode -->
            <button class="medoc-btn" id="btn-zen" title="Zen Mode (Ctrl+Shift+Z)">
              <span>⊞</span> Zen
            </button>

            <!-- Export Actions -->
            <button class="medoc-btn medoc-btn-primary" id="btn-export-pdf" title="Export Clean PDF (pdf-lib)">
              <span>↓</span> PDF
            </button>
            <button class="medoc-btn" id="btn-export-md" title="Download .md file">
              <span>↓</span> .md
            </button>
            <button class="medoc-btn" id="btn-new-doc" title="New Document">
              <span>+</span> New
            </button>
            <button class="medoc-btn medoc-btn-icon" id="btn-toggle-sidebar" title="Toggle Sidebar (Ctrl+B)">
              <span>☰</span>
            </button>
          </div>
        </header>

        <!-- Main Workspace -->
        <div class="medoc-workspace">
          <!-- Left Sidebar -->
          <aside class="medoc-sidebar" id="medoc-sidebar">
            <div class="medoc-sidebar-header">
              <div style="display: flex; gap: 8px;">
                <span id="tab-toc" style="cursor: pointer; ${this.sidebarTab === 'toc' ? 'color: var(--medoc-accent-light); font-weight: bold;' : 'opacity: 0.6;'}">Outline</span>
                <span style="opacity: 0.3;">|</span>
                <span id="tab-files" style="cursor: pointer; ${this.sidebarTab === 'files' ? 'color: var(--medoc-accent-light); font-weight: bold;' : 'opacity: 0.6;'}">Documents</span>
              </div>
            </div>
            <div class="medoc-sidebar-content" id="medoc-sidebar-content">
              <!-- Rendered dynamically -->
            </div>
          </aside>

          <!-- Center Editor Pane -->
          <main class="medoc-editor-pane" id="medoc-editor-pane">
            <div class="medoc-gutter" id="medoc-gutter">1</div>
            <textarea class="medoc-textarea" id="medoc-textarea" spellcheck="false" placeholder="Start typing Markdown with KaTeX formulas ($...$, $$...$$) and Mermaid diagrams...">${this.activeDoc.content}</textarea>
          </main>

          <!-- Right Preview Pane -->
          <section class="medoc-preview-pane" id="medoc-preview-pane">
            <div class="medoc-preview-container" id="medoc-preview-container">
              <!-- Markdown HTML rendered dynamically -->
            </div>
          </section>
        </div>

        <!-- Status Bar -->
        <footer class="medoc-statusbar" id="medoc-statusbar">
          <div class="medoc-status-left">
            <span class="medoc-status-badge">100% In-Device RAM Privacy</span>
            <span id="status-word-count">0 words</span>
            <span id="status-char-count">0 chars</span>
            <span id="status-reading-time">~0 mins read</span>
          </div>
          <div class="medoc-status-right">
            <span id="status-save-state">Saved</span>
            <span>UTF-8 Markdown</span>
          </div>
        </footer>

        <!-- Zen Mode Exit Floating Pill -->
        <button class="medoc-zen-exit-pill" id="medoc-zen-exit" title="Exit Zen Mode (Esc)">
          ✕ Exit Zen Mode
        </button>
      </div>
    `;

    // Cache elements
    this.shellEl = document.getElementById('medoc-shell')!;
    this.titleInputEl = document.getElementById('medoc-doc-title') as HTMLInputElement;
    this.textareaEl = document.getElementById('medoc-textarea') as HTMLTextAreaElement;
    this.gutterEl = document.getElementById('medoc-gutter')!;
    this.previewEl = document.getElementById('medoc-preview-container')!;
    this.previewPaneEl = document.getElementById('medoc-preview-pane')!;
    this.editorPaneEl = document.getElementById('medoc-editor-pane')!;
    this.sidebarEl = document.getElementById('medoc-sidebar')!;
    this.sidebarContentEl = document.getElementById('medoc-sidebar-content')!;
    this.statusWordCountEl = document.getElementById('status-word-count')!;
    this.statusCharCountEl = document.getElementById('status-char-count')!;
    this.statusReadingTimeEl = document.getElementById('status-reading-time')!;
    this.statusSaveStateEl = document.getElementById('status-save-state')!;
  }

  private bindEvents(): void {
    // Document Title Change
    this.titleInputEl.addEventListener('change', () => {
      this.vault.renameDocument(this.activeDoc.id, this.titleInputEl.value.trim() || 'Untitled.md');
      this.renderSidebar();
    });

    // Textarea input
    this.textareaEl.addEventListener('input', () => {
      this.statusSaveStateEl.textContent = 'Modified ●';
      this.vault.updateDocumentContent(this.activeDoc.id, this.textareaEl.value);
      this.updateLineNumbers();
      this.triggerRender(false);
    });

    // Synchronize textarea scroll to line numbers gutter
    this.textareaEl.addEventListener('scroll', () => {
      this.gutterEl.scrollTop = this.textareaEl.scrollTop;
    });

    // Tab key support in textarea
    this.textareaEl.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = this.textareaEl.selectionStart;
        const end = this.textareaEl.selectionEnd;
        const val = this.textareaEl.value;
        this.textareaEl.value = val.substring(0, start) + '  ' + val.substring(end);
        this.textareaEl.selectionStart = this.textareaEl.selectionEnd = start + 2;
        this.textareaEl.dispatchEvent(new Event('input'));
      }
    });

    // Global Hotkeys
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        this.vault.markSaved(this.activeDoc.id);
        this.statusSaveStateEl.textContent = 'Saved';
      } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Z') {
        e.preventDefault();
        this.toggleZenMode();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        this.toggleSidebar();
      } else if (e.key === 'Escape' && this.zenMode) {
        this.toggleZenMode(false);
      }
    });

    // View Switcher Buttons
    const viewButtons = this.container.querySelectorAll<HTMLButtonElement>('.medoc-segmented-item');
    viewButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.view as 'split' | 'editor' | 'preview';
        this.setViewMode(mode);
        viewButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Zen Mode Buttons
    document.getElementById('btn-zen')?.addEventListener('click', () => this.toggleZenMode());
    document.getElementById('medoc-zen-exit')?.addEventListener('click', () => this.toggleZenMode(false));

    // Sidebar Toggle
    document.getElementById('btn-toggle-sidebar')?.addEventListener('click', () => this.toggleSidebar());

    // Sidebar Tabs
    document.getElementById('tab-toc')?.addEventListener('click', () => {
      this.sidebarTab = 'toc';
      this.renderSidebar();
    });
    document.getElementById('tab-files')?.addEventListener('click', () => {
      this.sidebarTab = 'files';
      this.renderSidebar();
    });

    // Action Buttons
    document.getElementById('btn-new-doc')?.addEventListener('click', () => {
      const doc = this.vault.createDocument('Untitled.md', '# Untitled\n\nStart writing...');
      this.switchDocument(doc);
    });

    document.getElementById('btn-export-md')?.addEventListener('click', () => {
      this.vault.exportMarkdownFile(this.activeDoc);
    });

    document.getElementById('btn-export-pdf')?.addEventListener('click', async () => {
      try {
        const bytes = await exportMarkdownToPdf(this.activeDoc.content, {
          title: this.activeDoc.name.replace(/\.md$/, ''),
        });
        downloadPdf(bytes, `${this.activeDoc.name.replace(/\.md$/, '')}.pdf`);
      } catch (err) {
        console.error('PDF export failed:', err);
      }
    });
  }

  public setViewMode(mode: 'split' | 'editor' | 'preview'): void {
    this.viewMode = mode;
    if (mode === 'split') {
      this.editorPaneEl.style.display = 'flex';
      this.previewPaneEl.style.display = 'block';
    } else if (mode === 'editor') {
      this.editorPaneEl.style.display = 'flex';
      this.previewPaneEl.style.display = 'none';
    } else if (mode === 'preview') {
      this.editorPaneEl.style.display = 'none';
      this.previewPaneEl.style.display = 'block';
    }
  }

  public toggleZenMode(forceState?: boolean): void {
    this.zenMode = forceState !== undefined ? forceState : !this.zenMode;
    if (this.zenMode) {
      this.shellEl.classList.add('zen-mode');
    } else {
      this.shellEl.classList.remove('zen-mode');
      this.setViewMode(this.viewMode);
    }
  }

  public toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    this.sidebarEl.classList.toggle('collapsed', this.sidebarCollapsed);
  }

  private updateLineNumbers(): void {
    const lines = this.textareaEl.value.split('\n').length;
    let numbers = '';
    for (let i = 1; i <= lines; i++) {
      numbers += `${i}\n`;
    }
    this.gutterEl.textContent = numbers;
  }

  private triggerRender(immediate: boolean = false): void {
    if (this.renderDebounceTimer) {
      clearTimeout(this.renderDebounceTimer);
    }

    if (immediate) {
      this.executeRender();
    } else {
      this.renderDebounceTimer = setTimeout(() => {
        this.executeRender();
      }, 40);
    }
  }

  private async executeRender(): Promise<void> {
    const content = this.textareaEl.value;

    // 1. Telemetry
    const stats = computeDocumentStats(content);
    this.statusWordCountEl.textContent = `${stats.words.toLocaleString()} words`;
    this.statusCharCountEl.textContent = `${stats.characters.toLocaleString()} chars`;
    this.statusReadingTimeEl.textContent = `~${stats.readingTimeMinutes} mins read`;

    // 2. Render Markdown & KaTeX
    const html = await renderMarkdown(content);
    this.previewEl.innerHTML = html;

    // 3. Render Mermaid if present
    const mermaidContainers = this.previewEl.querySelectorAll('.mermaid');
    if (mermaidContainers.length > 0 && typeof window !== 'undefined') {
      try {
        const { default: mermaid } = await import('mermaid');
        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          themeVariables: {
            primaryColor: '#0d9488',
            primaryBorderColor: '#14b8a6',
            lineColor: '#2dd4bf',
            fontFamily: 'Inter, sans-serif',
          },
        });
        await mermaid.run({ nodes: mermaidContainers as any });
      } catch {
        // Fallback gracefully if mermaid fails to parse or render in background
      }
    }

    // 4. Update Sidebar
    this.renderSidebar();
  }

  private renderSidebar(): void {
    const tabToc = document.getElementById('tab-toc');
    const tabFiles = document.getElementById('tab-files');
    if (tabToc) tabToc.style.color = this.sidebarTab === 'toc' ? 'var(--medoc-accent-light)' : 'var(--medoc-text-muted)';
    if (tabFiles) tabFiles.style.color = this.sidebarTab === 'files' ? 'var(--medoc-accent-light)' : 'var(--medoc-text-muted)';

    if (this.sidebarTab === 'toc') {
      const headings = extractHeadings(this.textareaEl.value);
      if (headings.length === 0) {
        this.sidebarContentEl.innerHTML = `<div style="padding: 16px; color: var(--medoc-text-sub); font-size: 11px;">No headings found.<br>Use # Heading to create outline.</div>`;
        return;
      }

      this.sidebarContentEl.innerHTML = headings.map(h => `
        <a class="medoc-toc-item level-${Math.min(3, h.level)}" data-line="${h.line}" data-slug="${h.id}">
          ${h.text}
        </a>
      `).join('');

      this.sidebarContentEl.querySelectorAll('.medoc-toc-item').forEach(item => {
        item.addEventListener('click', (e) => {
          e.preventDefault();
          const line = parseInt((item as HTMLElement).dataset.line || '1', 10);
          this.jumpToLine(line);
        });
      });
    } else {
      // Documents Vault view
      const docs = this.vault.getDocuments();
      this.sidebarContentEl.innerHTML = docs.map(doc => `
        <div class="medoc-doc-list-item ${doc.id === this.activeDoc.id ? 'active' : ''}" data-doc-id="${doc.id}">
          <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${doc.name}</span>
          ${docs.length > 1 ? `<span class="btn-del-doc" data-doc-id="${doc.id}" style="color: var(--medoc-danger); padding: 2px 6px; cursor: pointer;">✕</span>` : ''}
        </div>
      `).join('');

      this.sidebarContentEl.querySelectorAll('.medoc-doc-list-item').forEach(el => {
        el.addEventListener('click', (e) => {
          const target = e.target as HTMLElement;
          const docId = (el as HTMLElement).dataset.docId!;
          if (target.classList.contains('btn-del-doc')) {
            e.stopPropagation();
            this.vault.deleteDocument(docId);
            this.switchDocument(this.vault.getActiveDocument());
            return;
          }
          const selected = this.vault.selectDocument(docId);
          if (selected) {
            this.switchDocument(selected);
          }
        });
      });
    }
  }

  private switchDocument(doc: VaultDocument): void {
    this.activeDoc = doc;
    this.titleInputEl.value = doc.name;
    this.textareaEl.value = doc.content;
    this.statusSaveStateEl.textContent = 'Saved';
    this.updateLineNumbers();
    this.triggerRender(true);
  }

  private jumpToLine(lineNumber: number): void {
    const lines = this.textareaEl.value.split('\n');
    let charIndex = 0;
    for (let i = 0; i < Math.min(lineNumber - 1, lines.length); i++) {
      charIndex += lines[i].length + 1;
    }
    this.textareaEl.focus();
    this.textareaEl.setSelectionRange(charIndex, charIndex);

    // Scroll textarea to line
    const lineHeight = 24;
    this.textareaEl.scrollTop = (lineNumber - 1) * lineHeight;
  }
}
