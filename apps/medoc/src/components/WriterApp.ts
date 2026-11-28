/**
 * @file WriterApp.ts
 * meDoc Studio — Word-Class WYSIWYG A4 Document & Typography Component
 * 100% In-Device RAM Privacy & Native OpenXML (.docx) Flow
 */

import { VaultManager, VaultDocument, RecoverySnapshot } from '../engines/VaultManager.js';
import { renderMarkdown, computeDocumentStats, DocumentStats, escapeHtml } from '../engines/MarkdownEngine.js';
import { parseFrontMatter } from '../engines/FrontMatter.js';
import { extractHeadings, TocItem } from '../engines/TocEngine.js';
import { exportMarkdownToPdf, downloadPdf, printDocument, hasThaiOrNonWinAnsi } from '../engines/PdfExporter.js';
import { exportHtmlToDocx, parseDocxToHtml } from '../engines/DocxEngine.js';
import { SteamStartupSplash, DesktopGoogleAuthModal } from '@mecraft/studio-shell';
import { toggleThaiNumerals } from '@mecraft/core-bridge';

export class WriterApp {
  private container: HTMLElement;
  private vault: VaultManager;
  private activeDoc: VaultDocument;
  private viewMode: 'page' | 'split' | 'preview' = 'page';
  private zenMode: boolean = false;
  private sarabunMode: boolean = true;
  private sidebarCollapsed: boolean = false;
  private sidebarTab: 'files' | 'toc' = 'files';
  private activeRibbonTab: 'home' | 'insert' | 'layout' | 'review' | 'view' = 'home';
  private saveInProgress = false;
  private fitWidth = true;
  private paperResize?: ResizeObserver;
  private dialogTrigger: HTMLElement | null = null;
  private importFromHub = false;
  private zoomLevel: number = 1.0;
  private paperMargin: 'normal' | 'narrow' | 'wide' = 'normal';
  private paperOrientation: 'portrait' | 'landscape' = 'portrait';
  private renderDebounceTimer: any = null;
  private pendingImportFile: File | null = null;

  // DOM Elements cache
  private shellEl!: HTMLElement;
  private titleInputEl!: HTMLInputElement;
  private textareaEl!: HTMLTextAreaElement;
  private paperPageEl!: HTMLElement;
  private paperSheetEl!: HTMLElement;
  private gutterEl!: HTMLElement;
  private previewEl!: HTMLElement;
  private previewPaneEl!: HTMLElement;
  private editorPaneEl!: HTMLElement;
  private sidebarEl!: HTMLElement;
  private sidebarContentEl!: HTMLElement;

  // Status Bar Elements
  private statusPageCountEl!: HTMLElement;
  private statusWordCountEl!: HTMLElement;
  private statusCharCountEl!: HTMLElement;
  private statusReadingTimeEl!: HTMLElement;
  private statusLanguageEl!: HTMLElement;
  private statusZoomEl!: HTMLElement;
  private statusSaveStateEl!: HTMLElement;

  // Modals
  private startHubModalEl!: HTMLElement;
  private safeImportModalEl!: HTMLElement;
  private recoveryJournalModalEl!: HTMLElement;
  private fileInputEl!: HTMLInputElement;

  constructor(target: HTMLElement) {
    this.container = target;
    this.vault = new VaultManager();
    this.activeDoc = this.vault.getActiveDocument();

    if (typeof window !== 'undefined' && window.location) {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('mode') === 'split') {
        this.viewMode = 'split';
      } else if (urlParams.get('mode') === 'preview') {
        this.viewMode = 'preview';
      }
      if (urlParams.get('zen') === 'true') {
        this.zenMode = true;
      }
      if (urlParams.get('tab') === 'toc') this.sidebarTab = 'toc';
    }

    this.mount();
    this.bindEvents();
    const canvas = document.getElementById("medoc-paper-canvas");
    if (canvas && typeof ResizeObserver !== "undefined") {
      this.paperResize = new ResizeObserver(() => this.applyFitWidth());
      this.paperResize.observe(canvas);
    }

    if (this.zenMode) {
      this.toggleZenMode(true);
    } else {
      this.setViewMode(this.viewMode);
    }
    this.toggleSarabunMode(this.sarabunMode);
    this.loadDocumentToPaper(this.activeDoc);
    this.showDocumentStatus();

    if (typeof window !== 'undefined' && window.location) {
      const urlParams = new URLSearchParams(window.location.search);
      if (!urlParams.has('mode') && !urlParams.has('zen') && urlParams.get('hub') !== 'false') {
        this.openStartHub();
      }
    }
  }

  public getActiveDocument(): VaultDocument {
    return this.activeDoc;
  }

  public getVaultManager(): VaultManager {
    return this.vault;
  }

  private mount(): void {
    this.container.innerHTML = `
      <div class="medoc-shell" id="medoc-shell" data-view-mode="${this.viewMode}">
        <!-- Top App Header -->
        <header class="medoc-topbar" id="medoc-topbar">
          <div class="medoc-brand">
            <button type="button" class="medoc-btn" id="btn-toggle-sidebar" aria-controls="medoc-sidebar" aria-expanded="true" title="เปิด/ปิด แถบข้าง (Ctrl+B)">☰</button>
            <button type="button" class="medoc-btn" id="btn-start-hub" title="หน้าเริ่มต้น meDoc (Start Hub)">เริ่มต้น</button>
            <input type="text" class="medoc-doc-title-input" id="medoc-doc-title" aria-label="ชื่อเอกสาร" spellcheck="false" />
          </div>
          <div class="medoc-header-actions">
            <button type="button" class="medoc-btn" id="btn-top-save" title="บันทึกเอกสาร (Ctrl+S)">บันทึก</button>
            <details class="medoc-file-menu">
              <summary class="medoc-btn">ไฟล์</summary>
              <div class="medoc-file-actions">
                <button type="button" class="medoc-btn" id="btn-menu-open">เปิดไฟล์</button>
                <button type="button" class="medoc-btn" id="btn-menu-save-as">บันทึกเป็น…</button>
                <button type="button" class="medoc-btn" id="btn-top-export-docx">ส่งออก Word</button>
              </div>
            </details>
            <button type="button" class="medoc-btn medoc-btn-primary" id="btn-top-print" title="พิมพ์ / บันทึกเป็น PDF ภาษาไทย">พิมพ์ / PDF</button>
            <button type="button" class="medoc-btn" id="btn-new-doc" title="สร้างเอกสารใหม่">+ เอกสารใหม่</button>
          </div>
        </header>

        <!-- Modern Two-Tier Ribbon Toolbar -->
        <nav class="medoc-ribbon" aria-label="แถบเครื่องมือหลัก">
          <div class="medoc-ribbon-nav" role="tablist">
            <button type="button" class="medoc-ribbon-tab ${this.activeRibbonTab === 'home' ? 'active' : ''}" data-tab="home" role="tab" aria-selected="${this.activeRibbonTab === 'home'}">จัดรูปแบบ</button>
            <button type="button" class="medoc-ribbon-tab ${this.activeRibbonTab === 'insert' ? 'active' : ''}" data-tab="insert" role="tab" aria-selected="${this.activeRibbonTab === 'insert'}">แทรก</button>
            <button type="button" class="medoc-ribbon-tab ${this.activeRibbonTab === 'layout' ? 'active' : ''}" data-tab="layout" role="tab" aria-selected="${this.activeRibbonTab === 'layout'}">จัดหน้า</button>
            <button type="button" class="medoc-ribbon-tab ${this.activeRibbonTab === 'review' ? 'active' : ''}" data-tab="review" role="tab" aria-selected="${this.activeRibbonTab === 'review'}">ตรวจทาน</button>
            <button type="button" class="medoc-ribbon-tab ${this.activeRibbonTab === 'view' ? 'active' : ''}" data-tab="view" role="tab" aria-selected="${this.activeRibbonTab === 'view'}">มุมมอง</button>
          </div>

          <div class="medoc-ribbon-panels">
            <!-- Home Panel -->
            <div class="medoc-ribbon-panel ${this.activeRibbonTab === 'home' ? 'active' : ''}" id="panel-home" role="tabpanel">
              <!-- Font & Typography Group -->
              <div class="medoc-ribbon-group" >
                <div class="medoc-tool-stack">
                  <!-- Top Row: Font Family & Size -->
                  <div class="medoc-tool-row">
                    <select id="sel-font-family" class="medoc-select" style="width: 140px;" title="แบบอักษร (Font)">
                      <option value="TH Sarabun New" selected>TH Sarabun New</option>
                      <option value="Angsana New">Angsana New</option>
                      <option value="Cordia New">Cordia New</option>
                      <option value="Sarabun">Sarabun</option>
                      <option value="Inter">Inter (Sans)</option>
                      <option value="Times New Roman">Times New Roman</option>
                    </select>
                    <select id="sel-font-size" class="medoc-select" style="width: 70px;" title="ขนาดอักษร (Size)">
                      <option value="14">14 pt</option>
                      <option value="16" selected>16 pt (ราชการ)</option>
                      <option value="18">18 pt</option>
                      <option value="20">20 pt</option>
                      <option value="24">24 pt</option>
                      <option value="28">28 pt</option>
                    </select>
                    <button type="button" class="medoc-ribbon-btn-sm" id="btn-font-grow" title="ขยายขนาดอักษร">A▲</button>
                    <button type="button" class="medoc-ribbon-btn-sm" id="btn-font-shrink" title="ลดขนาดอักษร">A▼</button>
                  </div>
                  <!-- Bottom Row: Basic Formatting & Colors -->
                  <div class="medoc-tool-row">
                    <button type="button" class="medoc-ribbon-btn-sm" id="btn-fmt-bold" title="ตัวหนา (Ctrl+B)"><b>B</b></button>
                    <button type="button" class="medoc-ribbon-btn-sm" id="btn-fmt-italic" title="ตัวเอียง (Ctrl+I)"><i>I</i></button>
                    <button type="button" class="medoc-ribbon-btn-sm" id="btn-fmt-underline" title="ขีดเส้นใต้ (Ctrl+U)"><u>U</u></button>
                    <button type="button" class="medoc-ribbon-btn-sm" id="btn-fmt-strike" title="ขีดฆ่า"><del>S</del></button>
                    <button type="button" class="medoc-ribbon-btn-sm" id="btn-fmt-sub" title="ตัวห้อย">X₂</button>
                    <button type="button" class="medoc-ribbon-btn-sm" id="btn-fmt-sup" title="ตัวยก">X²</button>
                    <button type="button" class="medoc-ribbon-btn-sm" id="btn-fmt-h1" title="หัวข้อหลัก H1">H1</button>
                    <button type="button" class="medoc-ribbon-btn-sm" id="btn-fmt-h2" title="หัวข้อย่อย H2">H2</button>
                    <input type="color" id="picker-text-color" value="#111827" title="สีตัวอักษร" style="width: 24px; height: 22px; padding: 0; border: none; cursor: pointer;" />
                  </div>
                </div>
                <div class="medoc-ribbon-group-title">แบบอักษร</div>
              </div>

              <!-- Paragraph & Alignment Group -->
              <div class="medoc-ribbon-group">
                <div class="medoc-tool-stack">
                  <div class="medoc-tool-row">
                    <button type="button" class="medoc-ribbon-btn-sm" id="btn-align-left" title="จัดชิดซ้าย">⇤ ชิดซ้าย</button>
                    <button type="button" class="medoc-ribbon-btn-sm" id="btn-align-center" title="จัดกึ่งกลาง">≡ กลาง</button>
                    <button type="button" class="medoc-ribbon-btn-sm" id="btn-align-right" title="จัดชิดขวา">⇥ ชิดขวา</button>
                    <button type="button" class="medoc-ribbon-btn-sm" id="btn-align-justify" title="ชิดขอบสองข้าง (Justify)">⇿ สองข้าง</button>
                    <button type="button" class="medoc-ribbon-btn-sm" id="btn-align-thai" title="กระจายแบบไทย (Thai Distributed)">🇹🇭 กระจาย</button>
                  </div>
                  <div class="medoc-tool-row">
                    <button type="button" class="medoc-ribbon-btn-sm" id="btn-fmt-ul" title="รายการหัวข้อย่อย">• รายการ</button>
                    <button type="button" class="medoc-ribbon-btn-sm" id="btn-fmt-ol" title="รายการตัวเลข">๑. เลข</button>
                    <button type="button" class="medoc-ribbon-btn-sm" id="btn-indent-less" title="ลดระยะเยื้อง">⇠ เยื้องออก</button>
                    <button type="button" class="medoc-ribbon-btn-sm" id="btn-indent-more" title="เพิ่มระยะเยื้อง">⇢ เยื้องเข้า</button>
                    <select id="sel-line-spacing" class="medoc-select" style="width: 75px;" title="ระยะบรรทัด">
                      <option value="1.0">1.0</option>
                      <option value="1.15">1.15</option>
                      <option value="1.6" selected>1.6 (ไทย)</option>
                      <option value="2.0">2.0</option>
                    </select>
                  </div>
                </div>
                <div class="medoc-ribbon-group-title">ย่อหน้า & การจัดแนว</div>
              </div>

              <!-- Official Thai Templates Group -->
              <div class="medoc-ribbon-group">
                <div class="medoc-ribbon-group-items">
                  <button type="button" class="medoc-ribbon-btn" id="btn-tpl-memo">🏛️ บันทึกข้อความ</button>
                  <button type="button" class="medoc-ribbon-btn" id="btn-tpl-letter">✉️ หนังสือภายนอก</button>
                  <button type="button" class="medoc-ribbon-btn" id="btn-tpl-meeting">👥 รายงานประชุม</button>
                </div>
                <div class="medoc-ribbon-group-title">แม่แบบราชการ</div>
              </div>
            </div>

            <!-- Insert Panel -->
            <div class="medoc-ribbon-panel ${this.activeRibbonTab === 'insert' ? 'active' : ''}" id="panel-insert" role="tabpanel">
              <div class="medoc-ribbon-group">
                <div class="medoc-ribbon-group-items">
                  <button type="button" class="medoc-ribbon-btn" id="btn-ins-table">📊 ตาราง 3×3</button>
                  <button type="button" class="medoc-ribbon-btn" id="btn-ins-image">🖼️ รูปภาพ</button>
                  <button type="button" class="medoc-ribbon-btn" id="btn-ins-pagebreak">📄 ตัวแบ่งหน้า</button>
                  <button type="button" class="medoc-ribbon-btn" id="btn-ins-hr">― เส้นคั่นหน้า</button>
                </div>
                <div class="medoc-ribbon-group-title">ตาราง & หน้ากระดาษ</div>
              </div>

              <div class="medoc-ribbon-group">
                <div class="medoc-ribbon-group-items">
                  <button type="button" class="medoc-ribbon-btn" id="btn-ins-math">∑ สมการ KaTeX</button>
                  <button type="button" class="medoc-ribbon-btn" id="btn-ins-mermaid">🔀 แผนภาพ Mermaid</button>
                  <button type="button" class="medoc-ribbon-btn" id="btn-fmt-code">💻 บล็อกโค้ด</button>
                </div>
                <div class="medoc-ribbon-group-title">องค์ประกอบเทคนิค</div>
              </div>
            </div>

            <!-- Layout Panel -->
            <div class="medoc-ribbon-panel ${this.activeRibbonTab === 'layout' ? 'active' : ''}" id="panel-layout" role="tabpanel">
              <div class="medoc-ribbon-group">
                <div class="medoc-ribbon-group-items">
                  <button type="button" class="medoc-ribbon-btn ${this.paperMargin === 'normal' ? 'active' : ''}" id="btn-margin-normal">
                    📐 ปกติ (2.54 ซม.)
                  </button>
                  <button type="button" class="medoc-ribbon-btn ${this.paperMargin === 'narrow' ? 'active' : ''}" id="btn-margin-narrow">
                    📐 แคบ (1.27 ซม.)
                  </button>
                  <button type="button" class="medoc-ribbon-btn ${this.paperMargin === 'wide' ? 'active' : ''}" id="btn-margin-wide">
                    📐 กว้าง (3.81 ซม.)
                  </button>
                </div>
                <div class="medoc-ribbon-group-title">ระยะขอบกระดาษ</div>
              </div>

              <div class="medoc-ribbon-group">
                <div class="medoc-ribbon-group-items">
                  <button type="button" class="medoc-ribbon-btn ${this.paperOrientation === 'portrait' ? 'active' : ''}" id="btn-orient-portrait">
                    📄 แนวตั้ง
                  </button>
                  <button type="button" class="medoc-ribbon-btn ${this.paperOrientation === 'landscape' ? 'active' : ''}" id="btn-orient-landscape">
                    📃 แนวนอน
                  </button>
                  <button type="button" class="medoc-ribbon-btn active" id="btn-size-a4">
                    A4 (210×297 mm)
                  </button>
                </div>
                <div class="medoc-ribbon-group-title">การวางแนว & ขนาด</div>
              </div>

              <div class="medoc-ribbon-group">
                <div class="medoc-ribbon-group-items">
                  <button type="button" class="medoc-ribbon-btn ${this.viewMode === 'page' ? 'active' : ''}" data-view="page">
                    📄 หน้ากระดาษ A4
                  </button>
                  <button type="button" class="medoc-ribbon-btn ${this.viewMode === 'split' ? 'active' : ''}" data-view="split">
                    ◫ โหมดแยกโค้ด Markdown
                  </button>
                  <button type="button" class="medoc-ribbon-btn ${this.viewMode === 'preview' ? 'active' : ''}" data-view="preview">
                    👁️ ผลลัพธ์เต็มหน้า
                  </button>
                </div>
                <div class="medoc-ribbon-group-title">โหมดการแสดงผล</div>
              </div>
            </div>

            <!-- Review Panel -->
            <div class="medoc-ribbon-panel ${this.activeRibbonTab === 'review' ? 'active' : ''}" id="panel-review" role="tabpanel">
              <div class="medoc-ribbon-group">
                <div class="medoc-ribbon-group-items">
                  <button type="button" class="medoc-ribbon-btn" id="btn-ribbon-numerals" title="แปลงเลขอารบิก ⇄ เลขไทย (๐-๙)">
                    ๑๒๓ ⇄ 123
                  </button>
                  <button type="button" class="medoc-ribbon-btn" id="btn-ribbon-sarabun" title="สลับแบบอักษร TH Sarabun New 16pt">
                    🇹🇭 สารบรรณราชการ
                  </button>
                </div>
                <div class="medoc-ribbon-group-title">ภาษาไทย & งานสารบรรณ</div>
              </div>

              <div class="medoc-ribbon-group">
                <div class="medoc-ribbon-group-items">
                  <button type="button" class="medoc-ribbon-btn" id="btn-ribbon-recovery" title="เปิดคลังประวัติการกู้คืน">
                    🕒 ประวัติกู้คืน
                  </button>
                  <button type="button" class="medoc-ribbon-btn" id="btn-ribbon-backup" title="สำรองไฟล์เอกสารปัจจุบันทันที">
                    🛡️ สำรองเอกสาร (.bak)
                  </button>
                </div>
                <div class="medoc-ribbon-group-title">ความปลอดภัย & การกู้คืน</div>
              </div>
            </div>

            <!-- View Panel -->
            <div class="medoc-ribbon-panel ${this.activeRibbonTab === 'view' ? 'active' : ''}" id="panel-view" role="tabpanel">
              <div class="medoc-ribbon-group">
                <div class="medoc-ribbon-group-items">
                  <button type="button" class="medoc-ribbon-btn" id="btn-ribbon-zen" title="โหมดโฟกัสเต็มจอ (Ctrl+Shift+Z)">⊞ โหมดสมาธิ</button>
                  <button type="button" class="medoc-ribbon-btn" id="btn-ribbon-sidebar">📁 โครงร่าง & คลังไฟล์</button>
                </div>
                <div class="medoc-ribbon-group-title">สมาธิ & โครงสร้าง</div>
              </div>

              <div class="medoc-ribbon-group">
                <div class="medoc-ribbon-group-items">
                  <button type="button" class="medoc-ribbon-btn" id="btn-zoom-fit">พอดีความกว้าง</button>
                  <button type="button" class="medoc-ribbon-btn" id="btn-zoom-75">75%</button>
                  <button type="button" class="medoc-ribbon-btn active" id="btn-zoom-100">100%</button>
                  <button type="button" class="medoc-ribbon-btn" id="btn-zoom-125">125%</button>
                  <button type="button" class="medoc-ribbon-btn" id="btn-zoom-150">150%</button>
                </div>
                <div class="medoc-ribbon-group-title">ระดับการซูม</div>
              </div>

              <div class="medoc-ribbon-group">
                <div class="medoc-ribbon-group-items">
                  <button type="button" class="medoc-ribbon-btn" id="btn-export-docx">📄 บันทึกเป็น DOCX</button>
                  <button type="button" class="medoc-ribbon-btn" id="btn-export-md">📝 Markdown (.md)</button>
                  <button type="button" class="medoc-ribbon-btn" id="btn-export-print">🖨️ พิมพ์ / PDF ภาษาไทย</button>
                </div>
                <div class="medoc-ribbon-group-title">ส่งออกไฟล์</div>
              </div>
            </div>
          </div>
        </nav>

        <!-- Hidden File Input for Safe Import (DOCX, MD, TXT) -->
        <input type="file" id="medoc-hidden-file-input" accept=".docx,.md,.markdown,.txt" hidden />

        <!-- Main Workspace -->
        <div class="medoc-workspace">
          <!-- Left Sidebar -->
          <aside class="medoc-sidebar" id="medoc-sidebar">
            <div class="medoc-sidebar-header">
              <button type="button" id="tab-files">คลังเอกสาร</button>
              <button type="button" id="tab-toc">โครงร่างหัวข้อ</button>
            </div>
            <div class="medoc-sidebar-content" id="medoc-sidebar-content">
              <!-- Rendered dynamically -->
            </div>
          </aside>

          <!-- Center WYSIWYG A4 Paper Editor -->
          <main class="medoc-editor-pane" id="medoc-editor-pane">
            <div class="medoc-paper-canvas" id="medoc-paper-canvas">
              <!-- Top Ruler (Centimeter scale 0 to 21 cm) -->
              <div class="medoc-ruler-bar" id="medoc-ruler-bar" aria-hidden="true">
                <div class="medoc-ruler-scale">
                  <span class="ruler-tick ruler-tick-0">0</span>
                  <span class="ruler-tick ruler-tick-1">2.54</span>
                  <span class="ruler-tick ruler-tick-2">5</span>
                  <span class="ruler-tick ruler-tick-3">10</span>
                  <span class="ruler-tick ruler-tick-4">15</span>
                  <span class="ruler-tick ruler-tick-5">18.46</span>
                  <span class="ruler-tick ruler-tick-6">21</span>
                </div>
              </div>

              <!-- A4 Paper Viewport -->
              <div class="medoc-paper-viewport" id="medoc-paper-viewport">
                <div class="medoc-paper-sheet" id="medoc-paper-sheet" data-margin="${this.paperMargin}" data-orientation="${this.paperOrientation}">
                  <!-- Visual Page Header -->
                  <div class="medoc-paper-header" contenteditable="true" data-placeholder="ส่วนหัวกระดาษ (ดับเบิลคลิกเพื่อพิมพ์)"></div>

                  <!-- Main ContentEditable WYSIWYG Page Surface -->
                  <div class="medoc-paper-page" id="medoc-paper-page" contenteditable="true" spellcheck="false" role="textbox" aria-multiline="true" aria-label="เนื้อหาเอกสารหน้ากระดาษ A4"></div>

                  <!-- Visual Page Footer -->
                  <div class="medoc-paper-footer" contenteditable="true" data-placeholder="ส่วนท้ายกระดาษ (หมายเลขหน้า/ข้อความท้าย)"></div>
                </div>
              </div>
            </div>

            <!-- Fallback Markdown Split Area (Hidden in pure page mode) -->
            <div class="medoc-markdown-split-pane" id="medoc-markdown-split-pane" hidden>
              <div class="medoc-gutter" id="medoc-gutter">1</div>
              <textarea class="medoc-textarea" id="medoc-textarea" aria-label="Markdown source code" spellcheck="false" placeholder="โค้ด Markdown…"></textarea>
            </div>
          </main>

          <!-- Right Preview Pane (For split/preview mode) -->
          <section class="medoc-preview-pane" id="medoc-preview-pane" hidden>
            <div class="medoc-preview-container" id="medoc-preview-container">
              <!-- Rendered dynamically -->
            </div>
          </section>
        </div>

        <!-- Status Bar -->
        <footer class="medoc-statusbar" id="medoc-statusbar">
          <div class="medoc-status-left">
            <span class="medoc-status-item" id="status-page-count">กระดาษ A4</span>
            <span class="medoc-status-item" id="status-word-count">0 คำ</span>
            <span class="medoc-status-item" id="status-char-count">0 ตัวอักษร</span>
            <span class="medoc-status-item" id="status-reading-time">~0 นาที</span>
          </div>
          <div class="medoc-status-right">
            <span class="medoc-status-item" id="status-language">ไทย (TH)</span>
            <div class="medoc-zoom-control">
              <button type="button" class="medoc-zoom-btn" id="btn-zoom-out" title="ย่อ">-</button>
              <span id="status-zoom">100%</span>
              <button type="button" class="medoc-zoom-btn" id="btn-zoom-in" title="ขยาย">+</button>
            </div>
            <span class="medoc-status-item" id="status-save-state" role="status">ฉบับร่างในแอป</span>
          </div>
        </footer>

        <!-- Zen Mode Exit Pill -->
        <button class="medoc-zen-exit-pill" id="medoc-zen-exit" title="ออกจากโหมดสมาธิ (Esc)">
          ✕ ออกจากโหมดสมาธิ
        </button>

        <!-- Start Hub Modal -->
        <div class="medoc-modal-backdrop" id="start-hub-modal" hidden>
          <div class="medoc-modal-card" role="dialog" aria-modal="true" aria-labelledby="start-hub-title">
            <div class="medoc-modal-header">
              <h2 class="medoc-modal-title" id="start-hub-title">เริ่มต้นใช้งาน meDoc</h2>
              <button type="button" class="medoc-modal-close" aria-label="ปิดหน้าต่าง" id="btn-close-hub">✕</button>
            </div>
            <div class="medoc-modal-body">
              <p style="margin-bottom: 12px; font-size: 13px; color: var(--medoc-text-muted);">เลือกรูปแบบเอกสารที่ต้องการสร้าง หรือเปิดไฟล์เดิม (.docx, .md) จากเครื่องของคุณ:</p>
              <div class="medoc-hub-grid">
                <button type="button" class="medoc-hub-tile" id="hub-tile-blank">
                  <div class="medoc-hub-tile-icon">📄</div>
                  <div class="medoc-hub-tile-name">เอกสารเปล่า</div>
                </button>
                <button type="button" class="medoc-hub-tile" id="hub-tile-open">
                  <div class="medoc-hub-tile-icon">📂</div>
                  <div class="medoc-hub-tile-name">เปิดไฟล์ (DOCX/MD)</div>
                </button>
                <button type="button" class="medoc-hub-tile" id="hub-tile-memo">
                  <div class="medoc-hub-tile-icon">🏛️</div>
                  <div class="medoc-hub-tile-name">บันทึกข้อความ</div>
                </button>
                <button type="button" class="medoc-hub-tile" id="hub-tile-letter">
                  <div class="medoc-hub-tile-icon">✉️</div>
                  <div class="medoc-hub-tile-name">หนังสือภายนอก</div>
                </button>
                <button type="button" class="medoc-hub-tile" id="hub-tile-meeting">
                  <div class="medoc-hub-tile-icon">👥</div>
                  <div class="medoc-hub-tile-name">รายงานการประชุม</div>
                </button>
              </div>

              <button type="button" class="medoc-btn" id="hub-recovery" hidden>ตรวจฉบับกู้คืน</button>
              <h3 class="medoc-hub-heading">เอกสารล่าสุด</h3>
              <div class="medoc-recents-list" id="hub-recents-list">
                <!-- Populated dynamically -->
              </div>
            </div>
            <div class="medoc-modal-footer">
              <button type="button" class="medoc-btn" id="btn-hub-cancel">ปิดหน้าต่าง</button>
            </div>
          </div>
        </div>

        <!-- Safe Import Modal -->
        <div class="medoc-modal-backdrop" id="safe-import-modal" hidden>
          <div class="medoc-modal-card" role="dialog" aria-modal="true" aria-labelledby="safe-import-title">
            <div class="medoc-modal-header">
              <h2 class="medoc-modal-title" id="safe-import-title">ตรวจเอกสารก่อนนำเข้า</h2>
              <button type="button" class="medoc-modal-close" aria-label="ปิดหน้าต่าง" id="btn-close-import">✕</button>
            </div>
            <div class="medoc-modal-body">
              <div style="font-size: 13px; line-height: 1.6;">
                <div><strong>ชื่อไฟล์:</strong> <span id="import-file-name">-</span></div>
                <div><strong>ขนาด:</strong> <span id="import-file-size">-</span></div>
              </div>
              <p style="margin: 12px 0 4px; font-size: 12px; font-weight: 600; color: var(--medoc-text-sub);">ตัวอย่างเนื้อหาเอกสาร (Preview Snippet):</p>
              <div class="medoc-preview-box" id="import-file-preview"></div>
              <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; margin-top: 14px; cursor: pointer;">
                <input type="checkbox" id="chk-import-backup" checked />
                <span>สำรองเอกสารที่เปิดอยู่ก่อนทำการนำเข้า (Safe Document Backup)</span>
              </label>
            </div>
            <p id="import-format-warning" class="medoc-import-warning" hidden>meDoc รองรับ DOCX บางส่วน การบันทึกครั้งแรกจะสร้างสำเนา โปรดตรวจรูป ตาราง และการจัดหน้าก่อนส่งงาน</p>
            <div class="medoc-modal-footer">
              <button type="button" class="medoc-btn" id="btn-import-cancel">ยกเลิก</button>
              <button type="button" class="medoc-btn medoc-btn-primary" id="btn-import-confirm">ยืนยันนำเข้าเอกสาร</button>
            </div>
          </div>
        </div>

        <!-- Recovery Journal Modal -->
        <div class="medoc-modal-backdrop" id="recovery-journal-modal" hidden>
          <div class="medoc-modal-card" role="dialog" aria-modal="true" aria-labelledby="recovery-journal-title">
            <div class="medoc-modal-header">
              <h2 class="medoc-modal-title" id="recovery-journal-title">กู้คืนเอกสาร</h2>
              <button type="button" class="medoc-modal-close" aria-label="ปิดหน้าต่าง" id="btn-close-recovery">✕</button>
            </div>
            <div class="medoc-modal-body">
              <p style="font-size: 13px; color: var(--medoc-text-muted); margin-bottom: 12px;">
                ระบบบันทึกจุดสำรองอัตโนมัติ (Autosave Snapshots) และสำรองก่อนการนำเข้าข้อมูล คุณสามารถเลือกกู้คืนเอกสารที่ต้องการได้:
              </p>
              <div id="recovery-journal-list" style="display: flex; flex-direction: column; gap: 8px; max-height: 280px; overflow-y: auto;">
                <!-- Populated dynamically -->
              </div>
            </div>
            <div class="medoc-modal-footer">
              <button type="button" class="medoc-btn" id="btn-recovery-close">ปิด</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Cache elements
    this.shellEl = document.getElementById('medoc-shell')!;
    this.titleInputEl = document.getElementById('medoc-doc-title') as HTMLInputElement;
    this.textareaEl = document.getElementById('medoc-textarea') as HTMLTextAreaElement;
    this.paperPageEl = document.getElementById('medoc-paper-page')!;
    this.paperSheetEl = document.getElementById('medoc-paper-sheet')!;
    this.gutterEl = document.getElementById('medoc-gutter')!;
    this.previewEl = document.getElementById('medoc-preview-container')!;
    this.previewPaneEl = document.getElementById('medoc-preview-pane')!;
    this.editorPaneEl = document.getElementById('medoc-editor-pane')!;
    this.sidebarEl = document.getElementById('medoc-sidebar')!;
    this.sidebarContentEl = document.getElementById('medoc-sidebar-content')!;

    // Status bar
    this.statusPageCountEl = document.getElementById('status-page-count')!;
    this.statusWordCountEl = document.getElementById('status-word-count')!;
    this.statusCharCountEl = document.getElementById('status-char-count')!;
    this.statusReadingTimeEl = document.getElementById('status-reading-time')!;
    this.statusLanguageEl = document.getElementById('status-language')!;
    this.statusZoomEl = document.getElementById('status-zoom')!;
    this.statusSaveStateEl = document.getElementById('status-save-state')!;

    // Modals
    this.startHubModalEl = document.getElementById('start-hub-modal')!;
    this.safeImportModalEl = document.getElementById('safe-import-modal')!;
    this.recoveryJournalModalEl = document.getElementById('recovery-journal-modal')!;
    this.fileInputEl = document.getElementById('medoc-hidden-file-input') as HTMLInputElement;
  }

  private bindEvents(): void {
    // Title change
    this.titleInputEl.addEventListener('change', () => {
      this.vault.renameDocument(this.activeDoc.id, this.titleInputEl.value.trim() || 'Untitled.docx');
      this.renderSidebar();
    });

    // ContentEditable Paper Page Input
    this.paperPageEl.addEventListener('input', () => {
      this.statusSaveStateEl.textContent = 'กำลังแก้ไข ●';
      const content = this.paperPageEl.innerHTML;
      this.vault.updateDocumentContent(this.activeDoc.id, content);
      this.textareaEl.value = content;
      this.updateStatusTelemetry();
    });

    // Markdown Textarea Input (Split mode)
    this.textareaEl.addEventListener('input', () => {
      this.statusSaveStateEl.textContent = 'กำลังแก้ไข ●';
      this.paperPageEl.innerHTML = this.textareaEl.value;
      this.vault.updateDocumentContent(this.activeDoc.id, this.textareaEl.value);
      this.updateLineNumbers();
      this.updateStatusTelemetry();
    });

    // Global Hotkeys
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      const dialog = [this.startHubModalEl, this.safeImportModalEl, this.recoveryJournalModalEl]
        .find(el => !el.hidden);
      if (dialog && e.key !== 'Escape') {
        if (e.key === 'Tab') {
          const controls = [...dialog.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), [href]')];
          const first = controls[0];
          const last = controls.at(-1);
          if (first && last && (!dialog.contains(document.activeElement) ||
              document.activeElement === (e.shiftKey ? first : last))) {
            e.preventDefault();
            (e.shiftKey ? last : first).focus();
          }
        }
        return;
      }
      if (e.isComposing) return;
      const inEditor = e.target instanceof HTMLElement && this.paperSheetEl.contains(e.target);
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        this.saveCurrentDocument();
      } else if (inEditor && (e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        this.execFormat('bold');
      } else if (inEditor && (e.ctrlKey || e.metaKey) && e.key === 'i') {
        e.preventDefault();
        this.execFormat('italic');
      } else if (inEditor && (e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
        this.execFormat('underline');
      } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Z') {
        e.preventDefault();
        this.toggleZenMode();
      } else if (e.key === 'Escape') {
        if (!this.startHubModalEl.hidden) {
          this.closeStartHub();
        } else if (!this.safeImportModalEl.hidden) {
          this.closeSafeImport();
        } else if (!this.recoveryJournalModalEl.hidden) {
          this.closeRecoveryJournal();
        } else if (this.zenMode) {
          this.toggleZenMode(false);
        }
      }
    });

    // Ribbon Tabs Navigation
    const tabs = this.container.querySelectorAll<HTMLButtonElement>('.medoc-ribbon-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = (tab.dataset?.tab || tab.getAttribute?.('data-tab')) as 'home' | 'insert' | 'layout' | 'review' | 'view';
        if (targetTab) this.setRibbonTab(targetTab);
      });
    });

    // Top Bar Actions
    document.getElementById('btn-start-hub')?.addEventListener('click', () => this.openStartHub());
    document.getElementById('btn-menu-open')?.addEventListener('click', () => this.triggerFilePicker());
    document.getElementById('btn-menu-save-as')?.addEventListener('click', () => this.saveCurrentDocument(true));
    this.container.querySelector('.medoc-file-menu')?.addEventListener('click', event => {
      if ((event.target as HTMLElement).closest('button')) {
        this.container.querySelector<HTMLDetailsElement>('.medoc-file-menu')!.open = false;
      }
    });
    document.getElementById('btn-top-save')?.addEventListener('click', () => this.saveCurrentDocument());
    document.getElementById('btn-top-export-docx')?.addEventListener('click', () => this.exportDocx());
    document.getElementById('btn-top-print')?.addEventListener('click', () => printDocument());
    document.getElementById('btn-new-doc')?.addEventListener('click', () => this.createNewDocument());
    document.getElementById('btn-toggle-sidebar')?.addEventListener('click', () => this.toggleSidebar());

    // Home Ribbon Actions

    // Font Controls
    document.getElementById('sel-font-family')?.addEventListener('change', (e) => {
      const font = (e.target as HTMLSelectElement).value;
      this.execFormat('fontName', font);
    });
    document.getElementById('sel-font-size')?.addEventListener('change', (e) => {
      const size = (e.target as HTMLSelectElement).value;
      this.execFormat('fontSize', '7'); // 7 = largest standard size in execCommand, styled via CSS
      if (this.paperPageEl) {
        this.paperPageEl.style.fontSize = `${size}pt`;
      }
    });
    document.getElementById('btn-font-grow')?.addEventListener('click', () => {
      const current = parseInt(window.getComputedStyle(this.paperPageEl).fontSize, 10);
      this.paperPageEl.style.fontSize = `${current + 2}px`;
    });
    document.getElementById('btn-font-shrink')?.addEventListener('click', () => {
      const current = parseInt(window.getComputedStyle(this.paperPageEl).fontSize, 10);
      this.paperPageEl.style.fontSize = `${Math.max(10, current - 2)}px`;
    });

    // Text Formats
    document.getElementById('btn-fmt-bold')?.addEventListener('click', () => this.execFormat('bold'));
    document.getElementById('btn-fmt-italic')?.addEventListener('click', () => this.execFormat('italic'));
    document.getElementById('btn-fmt-underline')?.addEventListener('click', () => this.execFormat('underline'));
    document.getElementById('btn-fmt-strike')?.addEventListener('click', () => this.execFormat('strikeThrough'));
    document.getElementById('btn-fmt-sub')?.addEventListener('click', () => this.execFormat('subscript'));
    document.getElementById('btn-fmt-sup')?.addEventListener('click', () => this.execFormat('superscript'));
    document.getElementById('btn-fmt-h1')?.addEventListener('click', () => this.execFormat('formatBlock', '<h1>'));
    document.getElementById('btn-fmt-h2')?.addEventListener('click', () => this.execFormat('formatBlock', '<h2>'));
    document.getElementById('picker-text-color')?.addEventListener('change', (e) => {
      this.execFormat('foreColor', (e.target as HTMLInputElement).value);
    });

    // Alignment & Paragraphs
    document.getElementById('btn-align-left')?.addEventListener('click', () => this.execFormat('justifyLeft'));
    document.getElementById('btn-align-center')?.addEventListener('click', () => this.execFormat('justifyCenter'));
    document.getElementById('btn-align-right')?.addEventListener('click', () => this.execFormat('justifyRight'));
    document.getElementById('btn-align-justify')?.addEventListener('click', () => this.execFormat('justifyFull'));
    document.getElementById('btn-align-thai')?.addEventListener('click', () => {
      this.execFormat('justifyFull');
      if (this.paperPageEl) {
        this.paperPageEl.style.textAlign = 'justify';
        (this.paperPageEl.style as any).textJustify = 'inter-cluster';
      }
    });

    document.getElementById('btn-fmt-ul')?.addEventListener('click', () => this.execFormat('insertUnorderedList'));
    document.getElementById('btn-fmt-ol')?.addEventListener('click', () => this.execFormat('insertOrderedList'));
    document.getElementById('btn-indent-less')?.addEventListener('click', () => this.execFormat('outdent'));
    document.getElementById('btn-indent-more')?.addEventListener('click', () => this.execFormat('indent'));
    document.getElementById('sel-line-spacing')?.addEventListener('change', (e) => {
      const spacing = (e.target as HTMLSelectElement).value;
      if (this.paperPageEl) this.paperPageEl.style.lineHeight = spacing;
    });

    // Templates
    document.getElementById('btn-tpl-memo')?.addEventListener('click', () => this.loadTemplate('memo'));
    document.getElementById('btn-tpl-letter')?.addEventListener('click', () => this.loadTemplate('letter'));
    document.getElementById('btn-tpl-meeting')?.addEventListener('click', () => this.loadTemplate('meeting'));

    // Insert Panel Actions
    document.getElementById('btn-ins-table')?.addEventListener('click', () => {
      const tableHtml = `
        <table class="medoc-paper-table" style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <thead>
            <tr style="background: #f4f6fa;">
              <th style="border: 1px solid #d1d5db; padding: 8px;">ลำดับ</th>
              <th style="border: 1px solid #d1d5db; padding: 8px;">รายการ</th>
              <th style="border: 1px solid #d1d5db; padding: 8px;">จำนวน</th>
              <th style="border: 1px solid #d1d5db; padding: 8px;">หมายเหตุ</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid #d1d5db; padding: 8px; text-align: center;">๑</td>
              <td style="border: 1px solid #d1d5db; padding: 8px;">เอกสารราชการ meDoc</td>
              <td style="border: 1px solid #d1d5db; padding: 8px; text-align: right;">1 ชุด</td>
              <td style="border: 1px solid #d1d5db; padding: 8px;">เรียบร้อย</td>
            </tr>
            <tr>
              <td style="border: 1px solid #d1d5db; padding: 8px; text-align: center;">๒</td>
              <td style="border: 1px solid #d1d5db; padding: 8px;">รายงานประชุมคณะกรรมการ</td>
              <td style="border: 1px solid #d1d5db; padding: 8px; text-align: right;">1 ฉบับ</td>
              <td style="border: 1px solid #d1d5db; padding: 8px;">รอดำเนินการ</td>
            </tr>
          </tbody>
        </table>
        <p><br></p>
      `;
      this.insertHtmlAtSelection(tableHtml);
    });

    document.getElementById('btn-ins-image')?.addEventListener('click', () => {
      const url = prompt('ระบุ URL รูปภาพ:', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600');
      if (url) {
        this.insertHtmlAtSelection(`<img src="${escapeHtml(url)}" alt="รูปภาพแทรก" style="max-width: 100%; height: auto; border-radius: 4px; margin: 12px 0;" /><p><br></p>`);
      }
    });

    document.getElementById('btn-ins-pagebreak')?.addEventListener('click', () => {
      this.insertHtmlAtSelection('<div class="medoc-page-break" style="page-break-after: always; border-top: 2px dashed #9ca3af; margin: 24px 0; text-align: center; color: #6b7280; font-size: 11px;">[ตัวแบ่งหน้ากระดาษ A4]</div><p><br></p>');
    });

    document.getElementById('btn-ins-hr')?.addEventListener('click', () => {
      this.insertHtmlAtSelection('<hr style="border: none; border-top: 1px solid #d1d5db; margin: 16px 0;" /><p><br></p>');
    });

    document.getElementById('btn-ins-math')?.addEventListener('click', () => {
      this.insertHtmlAtSelection('<div class="medoc-math-display" style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 8px 14px; margin: 12px 0; border-radius: 6px;">$$E = mc^2$$</div><p><br></p>');
    });

    document.getElementById('btn-ins-mermaid')?.addEventListener('click', () => {
      this.insertHtmlAtSelection('<div class="mermaid" style="background: #f8fafc; padding: 12px; margin: 12px 0; border: 1px solid #e2e8f0; border-radius: 6px;">flowchart TD\n  A[เริ่มต้น] --> B[ประมวลผล]\n  B --> C[เสร็จสิ้น]</div><p><br></p>');
    });

    document.getElementById('btn-fmt-code')?.addEventListener('click', () => {
      this.insertHtmlAtSelection('<pre style="background: #1e293b; color: #f8fafc; padding: 12px; border-radius: 6px; font-family: monospace;"><code>// รหัสโปรแกรม\nconsole.log("meDoc Studio");</code></pre><p><br></p>');
    });

    // Layout Panel Actions
    document.getElementById('btn-margin-normal')?.addEventListener('click', () => this.setMargin('normal'));
    document.getElementById('btn-margin-narrow')?.addEventListener('click', () => this.setMargin('narrow'));
    document.getElementById('btn-margin-wide')?.addEventListener('click', () => this.setMargin('wide'));
    document.getElementById('btn-orient-portrait')?.addEventListener('click', () => this.setOrientation('portrait'));
    document.getElementById('btn-orient-landscape')?.addEventListener('click', () => this.setOrientation('landscape'));

    this.container.querySelectorAll<HTMLButtonElement>('[data-view]').forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = (btn.dataset?.view || btn.getAttribute?.('data-view')) as 'page' | 'split' | 'preview';
        if (mode) this.setViewMode(mode);
      });
    });

    // Review Panel Actions
    document.getElementById('btn-ribbon-numerals')?.addEventListener('click', () => {
      const current = this.paperPageEl.innerHTML;
      const converted = toggleThaiNumerals(current);
      this.paperPageEl.innerHTML = converted;
      this.vault.updateDocumentContent(this.activeDoc.id, converted);
      this.statusSaveStateEl.textContent = 'กำลังแก้ไข ●';
      this.updateStatusTelemetry();
    });
    document.getElementById('btn-ribbon-sarabun')?.addEventListener('click', () => this.toggleSarabunMode());
    document.getElementById('btn-ribbon-recovery')?.addEventListener('click', () => this.openRecoveryJournal());
    document.getElementById('btn-ribbon-backup')?.addEventListener('click', () => {
      const backup = this.vault.backupDocument(this.activeDoc.id);
      if (backup) {
        this.renderSidebar();
        alert(`สำรองเอกสารเรียบร้อยแล้ว: ${backup.name}`);
      }
    });

    // View Panel Actions
    document.getElementById('btn-ribbon-zen')?.addEventListener('click', () => this.toggleZenMode());
    document.getElementById('medoc-zen-exit')?.addEventListener('click', () => this.toggleZenMode(false));
    document.getElementById('btn-ribbon-sidebar')?.addEventListener('click', () => this.toggleSidebar());

    // Zoom Buttons
    document.getElementById('btn-zoom-fit')?.addEventListener('click', () => {
      this.fitWidth = true;
      this.applyFitWidth();
    });
    document.getElementById('btn-zoom-75')?.addEventListener('click', () => this.setZoom(0.75));
    document.getElementById('btn-zoom-100')?.addEventListener('click', () => this.setZoom(1.0));
    document.getElementById('btn-zoom-125')?.addEventListener('click', () => this.setZoom(1.25));
    document.getElementById('btn-zoom-150')?.addEventListener('click', () => this.setZoom(1.5));
    document.getElementById('btn-zoom-out')?.addEventListener('click', () => this.setZoom(this.zoomLevel - 0.1));
    document.getElementById('btn-zoom-in')?.addEventListener('click', () => this.setZoom(this.zoomLevel + 0.1));

    // Export Actions
    document.getElementById('btn-export-docx')?.addEventListener('click', () => this.exportDocx());
    document.getElementById('btn-export-md')?.addEventListener('click', () => {
      this.vault.exportMarkdownFile(this.activeDoc);
    });
    document.getElementById('btn-export-print')?.addEventListener('click', () => printDocument());

    // Sidebar Tabs
    document.getElementById('tab-toc')?.addEventListener('click', () => {
      this.sidebarTab = 'toc';
      this.renderSidebar();
    });
    document.getElementById('tab-files')?.addEventListener('click', () => {
      this.sidebarTab = 'files';
      this.renderSidebar();
    });

    // Start Hub Modals
    document.getElementById('hub-recovery')?.addEventListener('click', () => this.openRecoveryJournal());
    document.getElementById('btn-close-hub')?.addEventListener('click', () => this.closeStartHub());
    document.getElementById('btn-hub-cancel')?.addEventListener('click', () => this.closeStartHub());
    document.getElementById('hub-tile-blank')?.addEventListener('click', () => {
      this.closeStartHub();
      this.createNewDocument();
    });
    document.getElementById('hub-tile-memo')?.addEventListener('click', () => {
      this.closeStartHub();
      this.loadTemplate('memo');
    });
    document.getElementById('hub-tile-letter')?.addEventListener('click', () => {
      this.closeStartHub();
      this.loadTemplate('letter');
    });
    document.getElementById('hub-tile-meeting')?.addEventListener('click', () => {
      this.closeStartHub();
      this.loadTemplate('meeting');
    });
    document.getElementById('hub-tile-open')?.addEventListener('click', () => {
      this.triggerFilePicker();
    });

    // Safe Import File Selection
    this.fileInputEl.addEventListener('change', async () => {
      const files = this.fileInputEl.files;
      if (files && files.length > 0) {
        try {
          await this.handleFileSelected(files[0]);
        } catch {
          this.pendingImportFile = null;
          window.alert('เปิดเอกสารไม่สำเร็จ โปรดตรวจรูปแบบไฟล์แล้วลองอีกครั้ง');
        }
      }
      this.fileInputEl.value = '';
    });
    document.getElementById('btn-close-import')?.addEventListener('click', () => this.closeSafeImport());
    document.getElementById('btn-import-cancel')?.addEventListener('click', () => this.closeSafeImport());
    document.getElementById('btn-import-confirm')?.addEventListener('click', async () => {
      await this.executeSafeImport();
    });

    // Recovery Journal Modals
    document.getElementById('btn-close-recovery')?.addEventListener('click', () => this.closeRecoveryJournal());
    document.getElementById('btn-recovery-close')?.addEventListener('click', () => this.closeRecoveryJournal());
  }

  public execFormat(command: string, value: string = ''): void {
    if (typeof document === 'undefined') return;
    this.paperPageEl?.focus?.();
    try {
      document.execCommand(command, false, value);
    } catch {
      // Ignored
    }
    try {
      this.paperPageEl?.dispatchEvent?.(new Event('input'));
    } catch {}
  }

  public insertHtmlAtSelection(html: string): void {
    this.paperPageEl?.focus?.();
    if (typeof window !== 'undefined' && window.getSelection) {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        range.deleteContents();
        const el = document.createElement('div');
        el.innerHTML = html;
        const frag = document.createDocumentFragment();
        let node: ChildNode | null;
        let lastNode: ChildNode | null = null;
        while ((node = el.firstChild)) {
          lastNode = frag.appendChild(node);
        }
        range.insertNode(frag);
        if (lastNode) {
          range.setStartAfter(lastNode);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
        }
      } else {
        this.paperPageEl.innerHTML += html;
      }
    } else {
      this.paperPageEl.innerHTML += html;
    }
    try {
      this.paperPageEl?.dispatchEvent?.({ type: 'input', target: this.paperPageEl } as any);
    } catch {
      try {
        this.paperPageEl?.dispatchEvent?.(new Event('input'));
      } catch {}
    }
  }

  public insertTextAtCursor(prefix: string, suffix: string = '', placeholder: string = ''): void {
    if (this.textareaEl) {
      const start = this.textareaEl.selectionStart || 0;
      const end = this.textareaEl.selectionEnd || 0;
      const currentVal = this.textareaEl.value || '';
      const selectedText = currentVal.substring(start, end);
      const insertion = selectedText ? `${prefix}${selectedText}${suffix}` : `${prefix}${placeholder}${suffix}`;
      this.textareaEl.value = currentVal.substring(0, start) + insertion + currentVal.substring(end);
      this.textareaEl.selectionStart = this.textareaEl.selectionEnd = start + insertion.length;
      if (this.paperPageEl) {
        this.paperPageEl.innerHTML = this.textareaEl.value;
      }
      try {
        this.textareaEl.dispatchEvent({ type: 'input', target: this.textareaEl } as any);
      } catch {
        try {
          this.textareaEl.dispatchEvent(new Event('input'));
        } catch {}
      }
    } else {
      this.insertHtmlAtSelection(`${prefix}${placeholder}${suffix}`);
    }
  }

  public setRibbonTab(tabName: 'home' | 'insert' | 'layout' | 'review' | 'view'): void {
    this.activeRibbonTab = tabName;
    const tabs = this.container.querySelectorAll<HTMLButtonElement>('.medoc-ribbon-tab');
    tabs.forEach(tab => {
      const isSelected = (tab.dataset?.tab || tab.getAttribute?.('data-tab')) === tabName;
      tab.classList.toggle('active', isSelected);
      tab.setAttribute('aria-selected', String(isSelected));
    });

    const panels = this.container.querySelectorAll<HTMLElement>('.medoc-ribbon-panel');
    panels.forEach(panel => {
      panel.classList.toggle('active', panel.id === `panel-${tabName}`);
    });
  }

  public setMargin(margin: 'normal' | 'narrow' | 'wide'): void {
    this.paperMargin = margin;
    if (this.paperSheetEl) {
      this.paperSheetEl.setAttribute('data-margin', margin);
      if (this.paperSheetEl.dataset) this.paperSheetEl.dataset.margin = margin;
    }
    ['normal', 'narrow', 'wide'].forEach(m => {
      document.getElementById(`btn-margin-${m}`)?.classList.toggle('active', m === margin);
    });
  }

  public setOrientation(orientation: 'portrait' | 'landscape'): void {
    this.paperOrientation = orientation;
    if (this.paperSheetEl) {
      this.paperSheetEl.setAttribute('data-orientation', orientation);
      if (this.paperSheetEl.dataset) this.paperSheetEl.dataset.orientation = orientation;
    }
    this.applyFitWidth();
    document.getElementById('btn-orient-portrait')?.classList.toggle('active', orientation === 'portrait');
    document.getElementById('btn-orient-landscape')?.classList.toggle('active', orientation === 'landscape');
  }

  private applyFitWidth(): void {
    const width = document.getElementById('medoc-paper-canvas')?.clientWidth;
    if (!this.fitWidth || !width || this.viewMode !== 'page') return;
    this.applyZoom(Math.min(1, (width - 48) / (this.paperOrientation === 'landscape' ? 1123 : 794)));
  }

  public setZoom(level: number): void {
    this.fitWidth = false;
    this.applyZoom(level);
  }

  private applyZoom(level: number): void {
    this.zoomLevel = Math.max(0.5, Math.min(2.0, parseFloat(level.toFixed(2))));
    const percent = Math.round(this.zoomLevel * 100);
    this.statusZoomEl.textContent = this.fitWidth ? `พอดี · ${percent}%` : `${percent}%`;

    if (this.paperSheetEl) {
      this.paperSheetEl.style.zoom = String(this.zoomLevel);
      const ruler = this.container.querySelector<HTMLElement>('.medoc-ruler-scale');
      if (ruler) ruler.style.zoom = String(this.zoomLevel);
    }

    ['75', '100', '125', '150'].forEach(val => {
      document.getElementById(`btn-zoom-${val}`)?.classList.toggle('active', percent === parseInt(val, 10));
    });
  }

  public toggleSarabunMode(forceState?: boolean): void {
    this.sarabunMode = forceState !== undefined ? forceState : !this.sarabunMode;
    const btnSarabun = document.getElementById('btn-ribbon-sarabun');
    btnSarabun?.setAttribute('aria-pressed', String(this.sarabunMode));
    btnSarabun?.classList.toggle('active', this.sarabunMode);
    this.shellEl.classList.toggle('sarabun-mode', this.sarabunMode);
  }

  public setViewMode(mode: 'page' | 'split' | 'preview'): void {
    this.viewMode = mode;
    this.shellEl.setAttribute('data-view-mode', mode);
    this.container.querySelectorAll<HTMLButtonElement>('[data-view]').forEach(btn => {
      const selected = (btn.dataset?.view || btn.getAttribute?.('data-view')) === mode;
      btn.classList.toggle('active', selected);
      btn.setAttribute('aria-pressed', String(selected));
    });

    const splitPane = document.getElementById('medoc-markdown-split-pane');
    const paperCanvas = document.getElementById('medoc-paper-canvas');

    if (mode === 'page') {
      paperCanvas!.hidden = false;
      splitPane!.hidden = true;
      this.previewPaneEl.hidden = true;
    } else if (mode === 'split') {
      paperCanvas!.hidden = true;
      splitPane!.hidden = false;
      this.previewPaneEl.hidden = false;
      this.triggerRender(true);
    } else if (mode === 'preview') {
      paperCanvas!.hidden = true;
      splitPane!.hidden = true;
      this.previewPaneEl.hidden = false;
      this.triggerRender(true);
    }
  }

  public toggleZenMode(forceState?: boolean): void {
    this.zenMode = forceState !== undefined ? forceState : !this.zenMode;
    this.shellEl.classList.toggle('zen-mode', this.zenMode);
    if (!this.zenMode) {
      this.setViewMode(this.viewMode);
    }
  }

  public toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    this.sidebarEl.classList.toggle('collapsed', this.sidebarCollapsed);
    document.getElementById('btn-toggle-sidebar')?.setAttribute('aria-expanded', String(!this.sidebarCollapsed));
  }

  public createNewDocument(): void {
    const doc = this.vault.createDocument('Untitled.docx', '<h1>Untitled</h1><p>เริ่มพิมพ์เอกสารที่นี่…</p>');
    doc.format = 'docx';
    this.switchDocument(doc);
    this.setViewMode('page');
    this.paperPageEl?.focus?.();
  }

  public async exportDocx(): Promise<void> {
    const html = this.paperPageEl.innerHTML || this.activeDoc.content;
    const bytes = await this.vault.exportDocxFile(this.activeDoc, html);
    if (bytes) {
      this.statusSaveStateEl.textContent = 'บันทึก DOCX แล้ว';
    }
  }

  public async saveCurrentDocument(saveAs = false): Promise<void> {
    if (this.saveInProgress) return;
    const doc = this.activeDoc;
    const content = this.viewMode === 'split' ? this.textareaEl.value : this.paperPageEl.innerHTML;
    if (doc.content !== content) this.vault.updateDocumentContent(doc.id, content);
    if (!(window as any).__TAURI_INTERNALS__) {
      this.statusSaveStateEl.textContent = 'ฉบับร่างในแอป';
      return;
    }

    this.saveInProgress = true;
    this.statusSaveStateEl.textContent = 'กำลังบันทึก…';
    let status = 'บันทึกไม่สำเร็จ';
    try {
      const data = doc.format === 'docx' ? await exportHtmlToDocx(content, { title: doc.name }) : content;
      const fileName = doc.format === 'docx' && !doc.path && !doc.name.startsWith('Untitled') ? doc.name.replace(/\.docx$/i, ' - copy.docx') : doc.name;
      const result = await this.vault.saveToNativeDisk(fileName, data, saveAs ? undefined : doc.path);
      if (result.status === 'saved') {
        doc.path = result.path;
        if (doc.content === content) this.vault.markSaved(doc.id);
        else this.vault.persist();
        status = doc.isDirty ? 'มีการแก้ไข' : 'บันทึกแล้ว';
      } else if (result.status === 'cancelled') {
        status = doc.isDirty ? 'ยังไม่ได้บันทึก' : 'ยกเลิกการบันทึก';
      }
    } catch {
      status = 'บันทึกไม่สำเร็จ';
    } finally {
      this.saveInProgress = false;
      if (this.activeDoc.id === doc.id) this.statusSaveStateEl.textContent = status;
    }
  }

  public loadTemplate(type: 'memo' | 'letter' | 'meeting'): void {
    const doc = this.vault.createDocumentFromTemplate(type);
    // Convert markdown template to initial HTML
    const initialHtml = this.markdownToInitialHtml(doc.content);
    doc.content = initialHtml;
    doc.format = 'docx';
    doc.name = doc.name.replace(/\.md$/, '.docx');
    this.switchDocument(doc);
    this.toggleSarabunMode(true);
    this.setViewMode('page');
    this.paperPageEl?.focus?.();
  }

  public triggerFilePicker(): void {
    this.fileInputEl.click();
  }

  private async handleFileSelected(file: File): Promise<void> {
    this.pendingImportFile = file;
    const nameEl = document.getElementById('import-file-name');
    const sizeEl = document.getElementById('import-file-size');
    const prevEl = document.getElementById('import-file-preview');

    if (nameEl) nameEl.textContent = file.name;
    const warning = document.getElementById('import-format-warning');
    if (warning) warning.hidden = !file.name.toLowerCase().endsWith('.docx');
    if (sizeEl) sizeEl.textContent = `${(file.size / 1024).toFixed(1)} KB`;

    if (file.name.toLowerCase().endsWith('.docx')) {
      const buffer = await file.arrayBuffer();
      const parsedHtml = await parseDocxToHtml(buffer);
      if (prevEl) prevEl.innerHTML = parsedHtml.slice(0, 500) + '…';
    } else {
      const text = await file.text();
      if (prevEl) prevEl.textContent = text.slice(0, 500) + '…';
    }

    this.importFromHub = !this.startHubModalEl.hidden;
    this.closeStartHub();
    this.closeRecoveryJournal();
    this.showDialog(this.safeImportModalEl);
  }

  private async executeSafeImport(): Promise<void> {
    if (!this.pendingImportFile) return;
    const chkBackup = document.getElementById('chk-import-backup') as HTMLInputElement;
    if (chkBackup?.checked && this.activeDoc.content.trim()) {
      this.vault.backupDocument(this.activeDoc.id);
    }

    try {
      const importedDoc = await this.vault.importFile(this.pendingImportFile);
      this.switchDocument(importedDoc);
      this.importFromHub = false;
      this.closeSafeImport();
      this.paperPageEl.focus();
    } catch {
      const preview = document.getElementById('import-file-preview');
      if (preview) preview.textContent = 'เปิดเอกสารไม่สำเร็จ โปรดตรวจว่าไฟล์เปิดได้ในโปรแกรมเดิม';
    }
  }

  private showDialog(dialog: HTMLElement): void {
    this.dialogTrigger = document.activeElement as HTMLElement | null;
    dialog.hidden = false;
    dialog.querySelector<HTMLButtonElement>('.medoc-modal-close')?.focus?.();
  }

  private hideDialog(dialog: HTMLElement): void {
    if (dialog.hidden) return;
    dialog.hidden = true;
    this.dialogTrigger?.focus?.();
    this.dialogTrigger = null;
  }

  public closeSafeImport(): void {
    this.pendingImportFile = null;
    const returnToHub = this.importFromHub && !this.safeImportModalEl.hidden;
    this.importFromHub = false;
    this.hideDialog(this.safeImportModalEl);
    if (returnToHub) this.openStartHub();
  }

  public openStartHub(): void {
    const recovery = document.getElementById('hub-recovery');
    if (recovery) recovery.hidden = this.vault.getAllRecoverySnapshots().length === 0;
    const recentsList = document.getElementById('hub-recents-list');
    if (recentsList) {
      const recents = this.vault.getRecentDocuments(6);
      recentsList.innerHTML = recents.map(doc => `
        <div class="medoc-recent-item" data-doc-id="${escapeHtml(doc.id)}">
          <div style="min-width: 0; flex: 1;">
            <div class="medoc-recent-name">${escapeHtml(doc.name)}</div>
            <div class="medoc-recent-meta">${new Date(doc.lastModified).toLocaleString('th-TH')} · ${doc.format === 'docx' ? 'Word DOCX' : 'Markdown'}</div>
          </div>
          <button type="button" class="medoc-btn medoc-btn-sm" style="font-size: 11px; padding: 2px 8px;">เปิด</button>
        </div>
      `).join('');

      recentsList.querySelectorAll('.medoc-recent-item').forEach(item => {
        item.addEventListener('click', () => {
          const docId = (item as HTMLElement).dataset?.docId || item.getAttribute?.('data-doc-id') || '';
          if (!docId) return;
          const doc = this.vault.selectDocument(docId);
          if (doc) {
            this.switchDocument(doc);
            this.closeStartHub();
          }
        });
      });
    }

    this.closeSafeImport();
    this.closeRecoveryJournal();
    this.showDialog(this.startHubModalEl);
  }

  public closeStartHub(): void {
    this.hideDialog(this.startHubModalEl);
  }

  public openRecoveryJournal(): void {
    const listEl = document.getElementById('recovery-journal-list');
    if (listEl) {
      const snapshots = this.vault.getAllRecoverySnapshots();
      if (snapshots.length === 0) {
        listEl.innerHTML = '<p class="medoc-empty">ไม่พบประวัติการกู้คืนที่บันทึกไว้ในเครื่อง</p>';
      } else {
        listEl.innerHTML = snapshots.map(s => {
          const reasonLabel = s.reason === 'autosave' ? 'บันทึกอัตโนมัติ' : s.reason === 'pre-import' ? 'ก่อนนำเข้า' : 'สำรองด้วยตนเอง';
          const cleanText = s.content.replace(/<[^>]+>/g, ' ').slice(0, 100);
          return `
            <div class="medoc-recent-item" style="display: flex; justify-content: space-between; align-items: center; padding: 10px;">
              <div style="min-width: 0; flex: 1;">
                <div style="font-weight: 600; font-size: 13px;">${escapeHtml(s.name)} <span style="font-size: 11px; background: var(--medoc-accent-dim); color: var(--medoc-accent); padding: 1px 6px; border-radius: 4px;">${reasonLabel}</span></div>
                <div style="font-size: 11px; color: var(--medoc-text-muted);">${new Date(s.timestamp).toLocaleString('th-TH')}</div>
                <div style="font-size: 12px; color: var(--medoc-text-sub); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-top: 2px;">${escapeHtml(cleanText)}</div>
              </div>
              <button type="button" class="medoc-btn medoc-btn-restore" data-doc-id="${escapeHtml(s.docId)}" style="font-size: 12px; margin-left: 12px;">กู้คืน</button>
            </div>
          `;
        }).join('');

        listEl.querySelectorAll('.medoc-btn-restore').forEach(btn => {
          btn.addEventListener('click', () => {
            const docId = (btn as HTMLElement).dataset?.docId || btn.getAttribute?.('data-doc-id') || '';
            if (!docId) return;
            const restored = this.vault.restoreFromRecovery(docId);
            if (restored) {
              this.switchDocument(this.vault.getActiveDocument());
              this.closeRecoveryJournal();
            }
          });
        });
      }
    }

    this.closeSafeImport();
    this.closeStartHub();
    this.showDialog(this.recoveryJournalModalEl);
  }

  public closeRecoveryJournal(): void {
    this.hideDialog(this.recoveryJournalModalEl);
  }

  private loadDocumentToPaper(doc: VaultDocument): void {
    this.titleInputEl.value = doc.name;
    const isHtml = doc.content.trim().startsWith('<') || doc.format === 'docx';
    if (isHtml) {
      this.paperPageEl.innerHTML = doc.content;
      this.textareaEl.value = doc.content;
    } else {
      // Convert markdown to initial HTML for paper view
      const initialHtml = this.markdownToInitialHtml(doc.content);
      this.paperPageEl.innerHTML = initialHtml;
      this.textareaEl.value = doc.content;
    }
    this.updateStatusTelemetry();
    this.updateLineNumbers();
    this.renderSidebar();
  }

  private switchDocument(doc: VaultDocument): void {
    this.activeDoc = doc;
    this.loadDocumentToPaper(doc);
    this.showDocumentStatus();
  }

  private showDocumentStatus(): void {
    const doc = this.activeDoc;
    this.statusSaveStateEl.textContent = doc.isDirty ? 'มีการแก้ไข' : doc.path ? 'บันทึกแล้ว' : 'ฉบับร่างในแอป';
  }

  private markdownToInitialHtml(md: string): string {
    const lines = md.split('\n');
    const htmlParts: string[] = [];
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        htmlParts.push('<p><br></p>');
      } else if (trimmed.startsWith('# ')) {
        htmlParts.push(`<h1>${escapeHtml(trimmed.slice(2))}</h1>`);
      } else if (trimmed.startsWith('## ')) {
        htmlParts.push(`<h2>${escapeHtml(trimmed.slice(3))}</h2>`);
      } else if (trimmed.startsWith('### ')) {
        htmlParts.push(`<h3>${escapeHtml(trimmed.slice(4))}</h3>`);
      } else if (trimmed.startsWith('- ')) {
        htmlParts.push(`<ul><li>${escapeHtml(trimmed.slice(2))}</li></ul>`);
      } else {
        htmlParts.push(`<p>${escapeHtml(trimmed)}</p>`);
      }
    }
    return htmlParts.join('\n');
  }

  private updateStatusTelemetry(): void {
    const text = this.paperPageEl.textContent || '';
    const stats = computeDocumentStats(text);
    this.statusPageCountEl.textContent = "กระดาษ A4";
    this.statusWordCountEl.textContent = `${stats.words.toLocaleString()} คำ`;
    this.statusCharCountEl.textContent = `${stats.characters.toLocaleString()} ตัวอักษร`;
    this.statusReadingTimeEl.textContent = `~${stats.readingTimeMinutes} นาที`;
    this.statusLanguageEl.textContent = hasThaiOrNonWinAnsi(text) ? 'ไทย (TH)' : 'English (EN)';
  }

  private updateLineNumbers(): void {
    const lines = this.textareaEl.value.split('\n').length;
    let numbers = '';
    for (let i = 1; i <= lines; i++) {
      numbers += `${i}\n`;
    }
    this.gutterEl.textContent = numbers;
  }

  public destroy(): void {
    this.paperResize?.disconnect();
    if (this.renderDebounceTimer) {
      clearTimeout(this.renderDebounceTimer);
      this.renderDebounceTimer = null;
    }
  }

  private triggerRender(immediate: boolean = false): void {
    if (immediate) {
      this.executeRender();
    } else {
      if (this.renderDebounceTimer) clearTimeout(this.renderDebounceTimer);
      this.renderDebounceTimer = setTimeout(() => {
        this.executeRender();
      }, 40);
    }
  }

  private async executeRender(): Promise<void> {
    if (typeof document === 'undefined') return;
    const content = this.textareaEl.value;
    const html = await renderMarkdown(content);
    this.previewEl.innerHTML = html || '<p class="medoc-empty">การแสดงผลเอกสารจะปรากฏที่นี่</p>';
    this.renderSidebar();
  }

  private renderSidebar(): void {
    if (typeof document === 'undefined') return;
    const tabToc = document.getElementById('tab-toc');
    const tabFiles = document.getElementById('tab-files');
    tabToc?.setAttribute('aria-pressed', String(this.sidebarTab === 'toc'));
    tabFiles?.setAttribute('aria-pressed', String(this.sidebarTab === 'files'));

    if (this.sidebarTab === 'toc') {
      const headings: { line: number; level: number; text: string }[] = [];
      const hNodes = this.paperPageEl.querySelectorAll('h1, h2, h3');
      hNodes.forEach((h, idx) => {
        const level = parseInt(h.tagName.charAt(1), 10);
        headings.push({ line: idx + 1, level, text: h.textContent || '' });
      });

      if (headings.length === 0) {
        this.sidebarContentEl.innerHTML = '<p class="medoc-empty">เพิ่มหัวข้อด้วย H1, H2 เพื่อดูโครงสร้างเอกสาร</p>';
        return;
      }

      this.sidebarContentEl.innerHTML = headings.map(h => `
        <button type="button" class="medoc-toc-item level-${Math.min(3, h.level)}" data-line="${h.line}">${escapeHtml(h.text)}</button>
      `).join('');
    } else {
      const docs = this.vault.getDocuments();
      this.sidebarContentEl.innerHTML = docs.map(doc => `
        <div class="medoc-doc-list-item ${doc.id === this.activeDoc.id ? 'active' : ''}" data-doc-id="${escapeHtml(doc.id)}">
          <button type="button" class="medoc-doc-open" ${doc.id === this.activeDoc.id ? 'aria-current="true"' : ''}>${escapeHtml(doc.name)}</button>
          ${docs.length > 1 ? `<button type="button" class="btn-del-doc" aria-label="ลบ ${escapeHtml(doc.name)}">×</button>` : ''}
        </div>
      `).join('');

      this.sidebarContentEl.querySelectorAll('.medoc-doc-list-item').forEach(el => {
        el.addEventListener('click', (e) => {
          const target = e.target as HTMLElement;
          const docId = (el as HTMLElement).dataset?.docId || el.getAttribute?.('data-doc-id') || '';
          if (!docId) return;
          if (target.classList?.contains('btn-del-doc')) {
            e.stopPropagation();
            if (typeof window !== 'undefined' && typeof window.confirm === 'function' && !window.confirm('ยืนยันการลบเอกสารนี้จาก meDoc?')) return;
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
}
