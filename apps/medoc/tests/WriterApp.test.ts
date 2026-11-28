import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { setupMockDom } from '../../../packages/studio-shell/tests/mock-dom.js';
import { WriterApp } from '../src/components/WriterApp.js';

describe('meDoc Studio — WriterApp Interface & Workflows', () => {
  let originalDoc: any;
  let originalWin: any;
  let container: any;
  let currentApp: WriterApp | null = null;

  beforeEach(() => {
    originalDoc = (globalThis as any).document;
    originalWin = (globalThis as any).window;
    setupMockDom();
    const mockElement = (globalThis as any).document.createElement('button');
    Object.getPrototypeOf(mockElement).focus = () => {};
    container = (globalThis as any).document.createElement('div');
    container.id = 'app';
    (globalThis as any).document.body.appendChild(container);
    currentApp = null;
  });

  afterEach(() => {
    if (currentApp) {
      currentApp.destroy();
      currentApp = null;
    }
    (globalThis as any).document = originalDoc;
    (globalThis as any).window = originalWin;
  });

  it('keeps a draft on cancelled or failed disk saves and reuses a confirmed path', async () => {
    const app = new WriterApp(container);
    currentApp = app;
    (globalThis as any).window.__TAURI_INTERNALS__ = {};
    const disk = vi.spyOn(app.getVaultManager(), 'saveToNativeDisk');
    const doc = app.getActiveDocument();
    const paper = container.querySelector('#medoc-paper-page');
    paper.innerHTML = '<p>เอกสารทดสอบ</p>';
    const status = container.querySelector('#status-save-state');
    disk.mockResolvedValueOnce({ status: 'cancelled' });
    await app.saveCurrentDocument();
    expect(doc.isDirty).toBe(true);
    expect(status.textContent).toBe('ยังไม่ได้บันทึก');
    disk.mockResolvedValueOnce({ status: 'failed' });
    await app.saveCurrentDocument();
    expect(doc.isDirty).toBe(true);
    expect(status.textContent).toBe('บันทึกไม่สำเร็จ');
    const path = 'draft.md';
    disk.mockResolvedValue({ status: 'saved', path });
    await app.saveCurrentDocument();
    expect(doc.isDirty).toBe(false);
    expect(status.textContent).toBe('บันทึกแล้ว');
    await app.saveCurrentDocument();
    expect(disk.mock.lastCall?.[2]).toBe(path);
    await app.saveCurrentDocument(true);
    expect(disk.mock.lastCall?.[2]).toBeUndefined();
  });

  it('mounts WriterApp and renders 5 Ribbon tabs, workspace, and status bar', () => {
    currentApp = new WriterApp(container);
    expect(currentApp).toBeDefined();

    const shell = container.querySelector('#medoc-shell');
    expect(shell).not.toBeNull();

    // Verify all 5 ribbon tabs exist
    const ribbonTabs = container.querySelectorAll('.medoc-ribbon-tab');
    expect(ribbonTabs.length).toBe(5);

    const tabNames = Array.from(ribbonTabs).map((t: any) => t.dataset?.tab || t.getAttribute?.('data-tab'));
    expect(tabNames).toContain('home');
    expect(tabNames).toContain('insert');
    expect(tabNames).toContain('layout');
    expect(tabNames).toContain('review');
    expect(tabNames).toContain('view');

    // Verify status bar elements exist
    expect(container.querySelector('#status-page-count')).not.toBeNull();
    expect(container.querySelector('#status-word-count')).not.toBeNull();
    expect(container.querySelector('#status-language')).not.toBeNull();
    expect(container.querySelector('#status-zoom')).not.toBeNull();
    expect(container.querySelector('#status-save-state')).not.toBeNull();
  });

  it('switches between ribbon tabs accurately', () => {
    currentApp = new WriterApp(container);
    const app = currentApp;
    
    app.setRibbonTab('insert');
    const insertTab = container.querySelector('[data-tab="insert"]');
    const insertPanel = container.querySelector('#panel-insert');
    expect(insertTab?.classList?.contains('active')).toBe(true);
    expect(insertPanel?.classList?.contains('active')).toBe(true);

    app.setRibbonTab('review');
    const reviewTab = container.querySelector('[data-tab="review"]');
    const reviewPanel = container.querySelector('#panel-review');
    expect(reviewTab?.classList?.contains('active')).toBe(true);
    expect(reviewPanel?.classList?.contains('active')).toBe(true);
  });

  it('inserts text and Markdown formatting at cursor via insertTextAtCursor', () => {
    currentApp = new WriterApp(container);
    const app = currentApp;
    const textarea = container.querySelector('#medoc-textarea') as HTMLTextAreaElement;
    expect(textarea).not.toBeNull();

    textarea.value = '';
    textarea.selectionStart = 0;
    textarea.selectionEnd = 0;

    app.insertTextAtCursor('**', '**', 'หนา');
    expect(textarea.value).toBe('**หนา**');

    textarea.value = '';
    textarea.selectionStart = 0;
    textarea.selectionEnd = 0;
    app.insertTextAtCursor('\n| หัวข้อ 1 | หัวข้อ 2 |\n|---|---|\n| ข้อมูล | ข้อมูล |\n');
    expect(textarea.value).toContain('| หัวข้อ 1 | หัวข้อ 2 |');
  });

  it('toggles Thai Sarabun mode with proper styling class', () => {
    currentApp = new WriterApp(container);
    const app = currentApp;
    const shell = container.querySelector('#medoc-shell');

    app.toggleSarabunMode(true);
    expect(shell?.classList?.contains('sarabun-mode')).toBe(true);

    app.toggleSarabunMode(false);
    expect(shell?.classList?.contains('sarabun-mode')).toBe(false);
  });

  it('adjusts zoom level and updates zoom display', () => {
    currentApp = new WriterApp(container);
    const app = currentApp;
    const zoomText = container.querySelector('#status-zoom');

    app.setZoom(1.25);
    expect(zoomText?.textContent).toBe('125%');

    app.setZoom(0.75);
    expect(zoomText?.textContent).toBe('75%');
  });

  it('opens and closes Start Hub modal with recent documents', () => {
    currentApp = new WriterApp(container);
    const app = currentApp;
    const modal = container.querySelector('#start-hub-modal');
    expect(modal).not.toBeNull();

    app.openStartHub();
    expect(modal?.hidden).toBe(false);

    const recentsList = container.querySelector('#hub-recents-list');
    expect(recentsList).not.toBeNull();

    app.closeStartHub();
    expect(modal?.hidden).toBe(true);
  });

  it('opens and closes Recovery Journal modal', () => {
    currentApp = new WriterApp(container);
    const app = currentApp;
    const modal = container.querySelector('#recovery-journal-modal');
    expect(modal).not.toBeNull();

    app.openRecoveryJournal();
    expect(modal?.hidden).toBe(false);

    app.closeRecoveryJournal();
    expect(modal?.hidden).toBe(true);
  });

  it('opens and closes Safe Import modal cleanly', () => {
    currentApp = new WriterApp(container);
    const app = currentApp;
    const modal = container.querySelector('#safe-import-modal');
    expect(modal).not.toBeNull();

    app.closeSafeImport();
    expect(modal?.hidden).toBe(true);
  });
});
