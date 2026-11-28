import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { setupMockDom } from '../../../packages/studio-shell/tests/mock-dom.js';
import { WriterApp } from '../src/components/WriterApp.js';
import { exportHtmlToDocx } from '../src/engines/DocxEngine.js';

describe('meDoc Studio — WYSIWYG A4 Paper & Native DOCX Integration', () => {
  let originalDoc: any;
  let originalWin: any;
  let container: any;
  let currentApp: WriterApp | null = null;

  beforeEach(() => {
    originalDoc = (globalThis as any).document;
    originalWin = (globalThis as any).window;
    setupMockDom();
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

  it('renders authentic A4 paper viewport with ruler and contenteditable surface', () => {
    currentApp = new WriterApp(container);

    const paperCanvas = container.querySelector('#medoc-paper-canvas');
    expect(paperCanvas).not.toBeNull();

    const ruler = container.querySelector('#medoc-ruler-bar');
    expect(ruler).not.toBeNull();

    const paperSheet = container.querySelector('#medoc-paper-sheet');
    expect(paperSheet).not.toBeNull();
    expect(paperSheet?.getAttribute('data-margin') || paperSheet?.dataset?.margin).toBe('normal');
    expect(paperSheet?.getAttribute('data-orientation') || paperSheet?.dataset?.orientation).toBe('portrait');

    const paperPage = container.querySelector('#medoc-paper-page');
    expect(paperPage).not.toBeNull();
    expect(paperPage?.getAttribute('contenteditable')).toBe('true');
  });

  it('executes formatting commands on the paper page without raw markdown syntax', () => {
    currentApp = new WriterApp(container);
    const paperPage = container.querySelector('#medoc-paper-page') as HTMLElement;
    expect(paperPage).not.toBeNull();

    paperPage.innerHTML = '<p>ข้อความทดสอบสารบรรณ</p>';
    currentApp.execFormat('bold');
    currentApp.execFormat('justifyFull');

    expect(paperPage.innerHTML).toContain('ข้อความทดสอบสารบรรณ');
  });

  it('switches paper margins (normal, narrow, wide) and updates dataset attributes', () => {
    currentApp = new WriterApp(container);
    const paperSheet = container.querySelector('#medoc-paper-sheet') as HTMLElement;

    currentApp.setMargin('narrow');
    expect(paperSheet.getAttribute('data-margin') || paperSheet.dataset?.margin).toBe('narrow');

    currentApp.setMargin('wide');
    expect(paperSheet.getAttribute('data-margin') || paperSheet.dataset?.margin).toBe('wide');

    currentApp.setMargin('normal');
    expect(paperSheet.getAttribute('data-margin') || paperSheet.dataset?.margin).toBe('normal');
  });

  it('switches paper orientation (portrait, landscape) accurately', () => {
    currentApp = new WriterApp(container);
    const paperSheet = container.querySelector('#medoc-paper-sheet') as HTMLElement;

    currentApp.setOrientation('landscape');
    expect(paperSheet.getAttribute('data-orientation') || paperSheet.dataset?.orientation).toBe('landscape');

    currentApp.setOrientation('portrait');
    expect(paperSheet.getAttribute('data-orientation') || paperSheet.dataset?.orientation).toBe('portrait');
  });

  it('creates new DOCX document and saves content into Vault with docx format', () => {
    currentApp = new WriterApp(container);
    currentApp.createNewDocument();

    const activeDoc = currentApp.getActiveDocument();
    expect(activeDoc.name).toContain('.docx');
    expect(activeDoc.format).toBe('docx');

    const paperPage = container.querySelector('#medoc-paper-page') as HTMLElement;
    paperPage.innerHTML = '<h1>บันทึกข้อความราชการ</h1><p>เนื้อหาทดสอบระบบ OpenXML</p>';
    paperPage.dispatchEvent({ type: 'input', target: paperPage } as any);

    expect(activeDoc.content).toContain('บันทึกข้อความราชการ');
  });

  it('exports active document to native DOCX bytes via exportDocx', async () => {
    currentApp = new WriterApp(container);
    const paperPage = container.querySelector('#medoc-paper-page') as HTMLElement;
    paperPage.innerHTML = '<h1>รายงานการประชุม</h1><p>ทดสอบการส่งออกไฟล์ DOCX ภาษาไทย</p>';

    await currentApp.exportDocx();
    const vault = currentApp.getVaultManager();
    const bytes = await vault.exportDocxFile(currentApp.getActiveDocument(), paperPage.innerHTML);

    expect(bytes).toBeDefined();
    expect(bytes![0]).toBe(0x50);
    expect(bytes![1]).toBe(0x4b);
  });
});
