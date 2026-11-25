import './styles/app.css';
import '@mecraft/studio-shell/styles.css';
import {
  createDefaultAdjustmentRecipe,
  renderRecipeToCanvas,
  performOcr,
  type PhotoAdjustmentRecipe,
  type PhotoFilterPreset,
  type QuadCorners,
} from '@mecraft/photo-core';
import {
  clipBus,
  createLauncherBridge,
  getAuthSession,
  onAuthSessionChange,
  type AuthSession,
} from '@mecraft/core-bridge';
import { StudioShell } from '@mecraft/studio-shell';
import { downloadBlob } from './utils/file-utils';
import type { PhotoDocumentItem, ViewportMode } from './core/types';

class MePhotoStudio {
  private shell!: StudioShell;
  private items: PhotoDocumentItem[] = [];
  private activeIndex = -1;
  private viewportMode: ViewportMode = 'processed';
  private zoom = 1.0;

  // 4-Point Homography Perspective State
  private isQuadEditing = false;
  private activeQuad: QuadCorners = {
    topLeft: { x: 0, y: 0 },
    topRight: { x: 1, y: 0 },
    bottomRight: { x: 1, y: 1 },
    bottomLeft: { x: 0, y: 1 },
  };
  private draggingPin: keyof QuadCorners | null = null;

  // Undo / Redo History
  private undoStack: PhotoAdjustmentRecipe[] = [];
  private redoStack: PhotoAdjustmentRecipe[] = [];

  // DOM Elements
  private appEl!: HTMLElement;
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private filmstripContainer!: HTMLElement;
  private perspectiveOverlay!: SVGSVGElement;
  private quadPolygon!: SVGPolygonElement;
  private pinTL!: SVGCircleElement;
  private pinTR!: SVGCircleElement;
  private pinBR!: SVGCircleElement;
  private pinBL!: SVGCircleElement;
  private currentSession: AuthSession | null = null;
  private processedClipBusIds = new Set<string>();

  constructor() {
    this.currentSession = getAuthSession();
    this.appEl = document.getElementById('app')!;
    this.initShell();
    this.initCanvasAndDOM();
    this.attachGlobalEvents();
    this.initClipBus();
    this.updateUserIndicator();

    onAuthSessionChange((session) => {
      this.currentSession = session;
      this.updateUserIndicator();
    });
  }

  private initShell(): void {
    this.shell = new StudioShell({
      appId: 'mephoto',
      appName: 'mePhoto',
      appTag: 'CamScanner Pro',
      version: '1.0.0',
      documentTitle: 'mePhoto Studio — CamScanner Pro Document Restoration & Photo Lab',
      menu: [
        {
          id: 'file',
          label: 'File',
          items: [
            { id: 'open', label: 'Open Images...', shortcut: 'Ctrl+O', action: () => this.triggerFileInput() },
            { id: 'add-scan', label: 'Add Scan...', action: () => this.triggerFileInput() },
            { id: 'sep1', divider: true, label: '' },
            { id: 'export-pdf', label: 'Export as PDF', shortcut: 'Ctrl+S', action: () => this.exportAllAsPdf() },
            { id: 'export-img', label: 'Export Image', action: () => this.exportActiveImage() },
            { id: 'sep2', divider: true, label: '' },
            { id: 'send-mepdf', label: 'Send to mePDF Workspace', action: () => this.sendToMePdf() },
          ],
        },
        {
          id: 'edit',
          label: 'Edit',
          items: [
            { id: 'undo', label: 'Undo', shortcut: 'Ctrl+Z', action: () => this.undo() },
            { id: 'redo', label: 'Redo', shortcut: 'Ctrl+Y', action: () => this.redo() },
            { id: 'sep1', divider: true, label: '' },
            { id: 'reset-recipe', label: 'Reset All Filters', action: () => this.resetFilters() },
          ],
        },
        {
          id: 'view',
          label: 'View',
          items: [
            { id: 'zoom-in', label: 'Zoom In', shortcut: 'Ctrl++', action: () => this.adjustZoom(0.1) },
            { id: 'zoom-out', label: 'Zoom Out', shortcut: 'Ctrl+-', action: () => this.adjustZoom(-0.1) },
            { id: 'zoom-100', label: 'Actual Size (100%)', shortcut: 'Ctrl+0', action: () => this.setZoom(1.0) },
            { id: 'sep1', divider: true, label: '' },
            { id: 'toggle-left', label: 'Toggle Scans Filmstrip', action: () => this.shell.getCockpit().toggleLeft() },
            { id: 'toggle-right', label: 'Toggle Inspector Panel', action: () => this.shell.getCockpit().toggleRight() },
          ],
        },
        {
          id: 'tools',
          label: 'Tools',
          items: [
            { id: 'deskew', label: '4-Point Homography Perspective Deskew', action: () => this.togglePerspectiveQuadEditor() },
            { id: 'ocr', label: 'Extract Text (Offline OCR)', action: () => this.extractTextOcr() },
            { id: 'sep1', divider: true, label: '' },
            { id: 'preset-magic', label: 'CamScanner Magic Color', action: () => this.applyFilterPreset('magic-color') },
            { id: 'preset-otsu', label: 'Crisp B&W (Otsu Thresholding)', action: () => this.applyFilterPreset('bw-clean') },
            { id: 'preset-gray', label: 'Grayscale Document', action: () => this.applyFilterPreset('grayscale') },
          ],
        },
        {
          id: 'help',
          label: 'Help',
          items: [
            { id: 'check-update', label: 'Check for Updates...', badge: 'NEW', action: () => this.shell.showUpdateModal() },
            { id: 'shortcuts', label: 'Keyboard Shortcuts', action: () => this.showShortcutsModal() },
            { id: 'about', label: 'About mePhoto Studio', action: () => this.showAboutModal() },
          ],
        },
      ],
      ribbon: [
        {
          id: 'file-actions',
          align: 'left',
          tools: [
            {
              id: 'btn-open-files',
              label: 'Open Images',
              icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>',
              action: () => this.triggerFileInput(),
            },
            {
              id: 'btn-export-pdf',
              label: 'Export PDF',
              icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>',
              action: () => this.exportAllAsPdf(),
            },
            {
              id: 'btn-export-image',
              label: 'Export Image',
              icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>',
              action: () => this.exportActiveImage(),
            },
            { id: 'sep-ribbon-1', type: 'separator' },
            {
              id: 'btn-undo',
              label: 'Undo',
              icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7v6h6"></path><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path></svg>',
              action: () => this.undo(),
            },
            {
              id: 'btn-redo',
              label: 'Redo',
              icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 7v6h-6"></path><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"></path></svg>',
              action: () => this.redo(),
            },
            { id: 'sep-ribbon-2', type: 'separator' },
            {
              id: 'btn-zoom-out',
              label: 'Zoom -',
              icon: '🔍-',
              action: () => this.adjustZoom(-0.1),
            },
            {
              id: 'btn-zoom-in',
              label: 'Zoom +',
              icon: '🔍+',
              action: () => this.adjustZoom(0.1),
            },
            {
              id: 'btn-rotate-cw',
              label: 'Rotate 90°',
              icon: '↻',
              action: () => this.rotateActiveCw(),
            },
            {
              id: 'btn-reset-recipe',
              label: 'Reset Filters',
              icon: '↺',
              action: () => this.resetFilters(),
            },
            { id: 'sep-ribbon-3', type: 'separator' },
            {
              id: 'btn-extract-text',
              label: 'Extract Text (OCR)',
              icon: '🔤',
              action: () => this.extractTextOcr(),
            },
            {
              id: 'btn-send-to-mepdf',
              label: 'Send to mePDF',
              icon: '✈️',
              action: () => this.sendToMePdf(),
            },
          ],
        },
      ],
      panes: {
        left: {
          title: 'Pages / Scans',
          initialWidth: 180,
          minWidth: 140,
          collapsible: true,
          content: `
            <div class="photo-filmstrip-pane" style="display: flex; flex-direction: column; height: 100%; gap: 10px; padding: 12px 8px; box-sizing: border-box;">
              <div class="filmstrip-thumb filmstrip-add" id="btn-add-more" style="flex-shrink: 0;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                <span>Add Scan</span>
              </div>
              <div id="filmstrip-items" style="display: flex; flex-direction: column; gap: 8px; overflow-y: auto; flex: 1;"></div>
            </div>
          `,
        },
        center: {
          content: `
            <div class="photo-canvas-area" style="position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; background: radial-gradient(circle at center, #11151f 0%, #08090d 100%);">
              <div class="viewport-canvas-container" id="canvas-container" style="flex: 1; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden;">
                <div class="dropzone-overlay" id="empty-dropzone">
                  <div style="width: 56px; height: 56px; border-radius: var(--radius-full); background: rgba(6, 182, 212, 0.1); display: flex; align-items: center; justify-content: center; color: var(--accent-cyan);">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>
                  </div>
                  <div>
                    <div style="font-size: 15px; font-weight: 600; margin-bottom: 4px;">Drop document scans or photos here</div>
                    <div style="font-size: 12px; color: var(--text-faint);">Supports PNG, JPG, WebP, TIFF & Camera captures</div>
                  </div>
                  <button class="btn-photo primary" id="btn-dropzone-select">Select Files</button>
                </div>
                
                <div class="canvas-stage-wrapper" id="canvas-stage-wrapper" style="position: relative; display: inline-block;">
                  <canvas id="photo-canvas" style="display: none;"></canvas>
                  <svg id="perspective-overlay" class="perspective-overlay" style="display: none; position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; overflow: visible;">
                    <polygon id="quad-polygon" points="" fill="rgba(6, 182, 212, 0.2)" stroke="#06b6d4" stroke-width="2" stroke-dasharray="4 2" />
                    <circle id="pin-tl" class="quad-pin" cx="0" cy="0" r="10" fill="#06b6d4" stroke="#ffffff" stroke-width="2.5" style="cursor: move; pointer-events: auto; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.6));" />
                    <circle id="pin-tr" class="quad-pin" cx="0" cy="0" r="10" fill="#06b6d4" stroke="#ffffff" stroke-width="2.5" style="cursor: move; pointer-events: auto; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.6));" />
                    <circle id="pin-br" class="quad-pin" cx="0" cy="0" r="10" fill="#06b6d4" stroke="#ffffff" stroke-width="2.5" style="cursor: move; pointer-events: auto; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.6));" />
                    <circle id="pin-bl" class="quad-pin" cx="0" cy="0" r="10" fill="#06b6d4" stroke="#ffffff" stroke-width="2.5" style="cursor: move; pointer-events: auto; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.6));" />
                  </svg>
                </div>
              </div>
            </div>
          `,
        },
        right: {
          title: 'Inspector & Adjustments',
          initialWidth: 320,
          minWidth: 260,
          collapsible: true,
          content: `
            <div class="photo-inspector-pane" style="display: flex; flex-direction: column; height: 100%; overflow-y: auto;">
              <div class="inspector-tabs">
                <button class="inspector-tab-btn active" data-tab="presets">Presets</button>
                <button class="inspector-tab-btn" data-tab="adjust">Adjustments</button>
                <button class="inspector-tab-btn" data-tab="geometry">Geometry</button>
              </div>

              <div class="inspector-body" id="tab-presets">
                <div class="control-group">
                  <label class="control-label">CamScanner Presets</label>
                  <div class="preset-grid">
                    <div class="preset-card active" data-preset="none">
                      <div class="preset-card-name">Original</div>
                      <div class="preset-card-desc">No filters</div>
                    </div>
                    <div class="preset-card" data-preset="magic-color">
                      <div class="preset-card-name">Magic Color</div>
                      <div class="preset-card-desc">Vibrant & crisp text</div>
                    </div>
                    <div class="preset-card" data-preset="bw-clean">
                      <div class="preset-card-name">Crisp B&W</div>
                      <div class="preset-card-desc">Otsu thresholding</div>
                    </div>
                    <div class="preset-card" data-preset="grayscale">
                      <div class="preset-card-name">Grayscale</div>
                      <div class="preset-card-desc">Even balanced tone</div>
                    </div>
                    <div class="preset-card" data-preset="sepia">
                      <div class="preset-card-name">Sepia</div>
                      <div class="preset-card-desc">Archive vintage</div>
                    </div>
                    <div class="preset-card" data-preset="invert">
                      <div class="preset-card-name">Invert</div>
                      <div class="preset-card-desc">Negative polarity</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="inspector-body" id="tab-adjust" style="display: none;">
                <div class="control-group">
                  <div class="control-label">
                    <span>Brightness</span>
                    <span class="control-value" id="val-brightness">0</span>
                  </div>
                  <input type="range" id="slider-brightness" min="-100" max="100" value="0" />
                </div>

                <div class="control-group">
                  <div class="control-label">
                    <span>Contrast</span>
                    <span class="control-value" id="val-contrast">0</span>
                  </div>
                  <input type="range" id="slider-contrast" min="-100" max="100" value="0" />
                </div>

                <div class="control-group">
                  <div class="control-label">
                    <span>Saturation</span>
                    <span class="control-value" id="val-saturation">0</span>
                  </div>
                  <input type="range" id="slider-saturation" min="-100" max="100" value="0" />
                </div>

                <div class="control-group">
                  <div class="control-label">
                    <span>Unsharp Mask (Sharpness)</span>
                    <span class="control-value" id="val-sharpness">0</span>
                  </div>
                  <input type="range" id="slider-sharpness" min="0" max="100" value="0" />
                </div>
              </div>

              <div class="inspector-body" id="tab-geometry" style="display: none;">
                <div class="control-group">
                  <div class="control-label">
                    <span>Deskew Fine Angle</span>
                    <span class="control-value" id="val-fine-angle">0.0°</span>
                  </div>
                  <input type="range" id="slider-fine-angle" min="-45" max="45" step="0.5" value="0" />
                </div>

                <div style="display: flex; gap: 8px; margin-top: 10px;">
                  <button class="btn-photo" id="btn-flip-h" style="flex: 1;">Flip Horiz</button>
                  <button class="btn-photo" id="btn-flip-v" style="flex: 1;">Flip Vert</button>
                </div>

                <div class="control-group" style="margin-top: 16px; border-top: 1px solid var(--border-subtle); padding-top: 14px;">
                  <div class="control-label" style="font-weight: 600; color: var(--accent-cyan); display: flex; align-items: center; justify-content: space-between;">
                    <span>4-Point Perspective Deskew</span>
                    <span class="photo-brand-badge">CamScanner</span>
                  </div>
                  <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 10px; line-height: 1.4;">
                    Drag the 4 corner pins on the document canvas to rectify quadrilateral perspective distortion.
                  </div>
                  <div style="display: flex; gap: 8px;">
                    <button class="btn-photo primary" id="btn-toggle-quad" style="flex: 1;">Edit Pins</button>
                    <button class="btn-photo" id="btn-reset-quad" style="flex: 1;">Reset Corners</button>
                  </div>
                  <button class="btn-photo" id="btn-apply-deskew" style="width: 100%; margin-top: 8px;" disabled>
                    Apply 4-Point Homography
                  </button>
                </div>
              </div>
            </div>
          `,
        },
      },
      statusBar: {
        showPrivacyBadge: true,
        items: [
          { id: 'status-msg', align: 'left', content: 'Ready — Drop document scans or photos here' },
          { id: 'status-info', align: 'center', content: 'No document loaded' },
        ],
      },
      update: {
        currentVersion: '1.0.0',
        latestVersion: '1.0.0',
        releaseDate: '2026-11-23',
        changelog: [
          'Unified Shared Studio Shell architecture with 3-Pane Cockpit',
          '4-point projective homography deskew with live draggable pins',
          'CamScanner-grade image filter presets & Otsu binarization',
          'High-speed offline OCR and instant ClipBus sync to mePDF',
          '100% In-Device RAM Privacy verification',
        ],
      },
    });

    this.shell.mount(this.appEl);

    // Append hidden file input
    const input = document.createElement('input');
    input.type = 'file';
    input.id = 'file-input';
    input.multiple = true;
    input.accept = 'image/*';
    input.style.display = 'none';
    this.appEl.appendChild(input);

    // Append OCR Result Modal
    const modalContainer = document.createElement('div');
    modalContainer.id = 'ocr-modal';
    modalContainer.style.cssText = 'display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(6px); z-index: 1000; align-items: center; justify-content: center;';
    modalContainer.innerHTML = `
      <div style="background: var(--surface-base); border: 1px solid var(--border-medium); border-radius: var(--radius-md); width: 540px; max-width: 90vw; padding: 20px; box-shadow: var(--shadow-lg); display: flex; flex-direction: column; gap: 14px;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 15px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--accent-cyan);"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            Extracted Text (Client-Side OCR)
          </div>
          <button class="btn-icon" id="btn-close-ocr">✕</button>
        </div>
        <div id="ocr-meta" style="font-size: 12px; color: var(--text-muted);"></div>
        <textarea id="ocr-text-result" style="width: 100%; height: 220px; background: var(--bg-app); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); color: var(--text-primary); font-family: var(--font-mono); font-size: 13px; padding: 10px; resize: vertical;" readonly></textarea>
        <div style="display: flex; justify-content: flex-end; gap: 8px;">
          <button class="btn-photo" id="btn-copy-ocr">Copy to Clipboard</button>
          <button class="btn-photo primary" id="btn-done-ocr">Done</button>
        </div>
      </div>
    `;
    this.appEl.appendChild(modalContainer);
  }

  private initCanvasAndDOM() {
    this.canvas = document.getElementById('photo-canvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.filmstripContainer = document.getElementById('filmstrip-items')!;

    this.perspectiveOverlay = document.getElementById('perspective-overlay') as unknown as SVGSVGElement;
    this.quadPolygon = document.getElementById('quad-polygon') as unknown as SVGPolygonElement;
    this.pinTL = document.getElementById('pin-tl') as unknown as SVGCircleElement;
    this.pinTR = document.getElementById('pin-tr') as unknown as SVGCircleElement;
    this.pinBR = document.getElementById('pin-br') as unknown as SVGCircleElement;
    this.pinBL = document.getElementById('pin-bl') as unknown as SVGCircleElement;

    this.updateUndoRedoButtons();
    this.updateUI();
  }

  private triggerFileInput(): void {
    const fileInput = document.getElementById('file-input') as HTMLInputElement | null;
    fileInput?.click();
  }

  private attachGlobalEvents() {
    const fileInput = document.getElementById('file-input') as HTMLInputElement | null;
    document.getElementById('btn-add-more')?.addEventListener('click', () => this.triggerFileInput());
    document.getElementById('btn-dropzone-select')?.addEventListener('click', () => this.triggerFileInput());

    fileInput?.addEventListener('change', (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        this.loadFiles(Array.from(files));
      }
    });

    // Global keyboard shortcuts (Ctrl+Z, Ctrl+Y)
    window.addEventListener('keydown', (e) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          this.redo();
        } else {
          this.undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        this.redo();
      }
    });

    // OCR Modal buttons
    const ocrModal = document.getElementById('ocr-modal')!;
    const closeOcr = () => (ocrModal.style.display = 'none');
    document.getElementById('btn-close-ocr')?.addEventListener('click', closeOcr);
    document.getElementById('btn-done-ocr')?.addEventListener('click', closeOcr);
    document.getElementById('btn-copy-ocr')?.addEventListener('click', async () => {
      const txtArea = document.getElementById('ocr-text-result') as HTMLTextAreaElement;
      if (txtArea && txtArea.value) {
        try {
          await navigator.clipboard.writeText(txtArea.value);
        } catch {
          txtArea.select();
          document.execCommand('copy');
        }
        const btn = document.getElementById('btn-copy-ocr')!;
        btn.textContent = 'Copied!';
        setTimeout(() => (btn.textContent = 'Copy to Clipboard'), 2000);
      }
    });

    // Tab buttons
    document.querySelectorAll('.inspector-tab-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const tab = target.dataset.tab;
        document.querySelectorAll('.inspector-tab-btn').forEach((b) => b.classList.remove('active'));
        target.classList.add('active');

        ['presets', 'adjust', 'geometry'].forEach((t) => {
          const el = document.getElementById(`tab-${t}`);
          if (el) el.style.display = t === tab ? 'flex' : 'none';
        });
      });
    });

    // Preset cards
    document.querySelectorAll('.preset-card').forEach((card) => {
      card.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const preset = target.dataset.preset as PhotoFilterPreset;
        document.querySelectorAll('.preset-card').forEach((c) => c.classList.remove('active'));
        target.classList.add('active');
        this.applyFilterPreset(preset);
      });
    });

    // Slider undo lifecycle
    let preDragRecipe: PhotoAdjustmentRecipe | null = null;
    const onSliderStart = () => {
      if (this.activeIndex >= 0) {
        preDragRecipe = JSON.parse(JSON.stringify(this.items[this.activeIndex]!.recipe));
      }
    };
    const onSliderEnd = () => {
      if (this.activeIndex >= 0 && preDragRecipe) {
        const curRecipe = this.items[this.activeIndex]!.recipe;
        if (JSON.stringify(preDragRecipe) !== JSON.stringify(curRecipe)) {
          this.undoStack.push(preDragRecipe);
          if (this.undoStack.length > 30) this.undoStack.shift();
          this.redoStack = [];
          this.updateUndoRedoButtons();
        }
        preDragRecipe = null;
      }
    };

    // Sliders
    const bindSlider = (id: string, prop: keyof PhotoAdjustmentRecipe, labelId: string, suffix = '') => {
      const slider = document.getElementById(id) as HTMLInputElement;
      const label = document.getElementById(labelId);
      slider?.addEventListener('pointerdown', onSliderStart);
      slider?.addEventListener('input', () => {
        const val = parseFloat(slider.value);
        if (label) label.textContent = `${val}${suffix}`;
        this.updateActiveRecipe({ [prop]: val });
      });
      slider?.addEventListener('change', onSliderEnd);
    };

    bindSlider('slider-brightness', 'brightness', 'val-brightness');
    bindSlider('slider-contrast', 'contrast', 'val-contrast');
    bindSlider('slider-saturation', 'saturation', 'val-saturation');
    bindSlider('slider-sharpness', 'sharpness', 'val-sharpness');

    // Fine deskew
    const deskewSlider = document.getElementById('slider-fine-angle') as HTMLInputElement;
    deskewSlider?.addEventListener('pointerdown', onSliderStart);
    deskewSlider?.addEventListener('input', () => {
      const val = parseFloat(deskewSlider.value);
      const label = document.getElementById('val-fine-angle');
      if (label) label.textContent = `${val.toFixed(1)}°`;
      if (this.activeIndex >= 0) {
        this.items[this.activeIndex]!.fineAngle = val;
        this.items[this.activeIndex]!.recipe.rotation =
          this.items[this.activeIndex]!.coarseRotation + val;
        this.renderActiveItem();
      }
    });
    deskewSlider?.addEventListener('change', onSliderEnd);

    // Flip buttons
    document.getElementById('btn-flip-h')?.addEventListener('click', () => {
      if (this.activeIndex >= 0) {
        this.pushUndoState();
        const cur = this.items[this.activeIndex].recipe.flipH;
        this.updateActiveRecipe({ flipH: !cur });
      }
    });
    document.getElementById('btn-flip-v')?.addEventListener('click', () => {
      if (this.activeIndex >= 0) {
        this.pushUndoState();
        const cur = this.items[this.activeIndex].recipe.flipV;
        this.updateActiveRecipe({ flipV: !cur });
      }
    });

    // 4-Point Homography Perspective Controls
    document.getElementById('btn-toggle-quad')?.addEventListener('click', () => {
      this.togglePerspectiveQuadEditor();
    });
    document.getElementById('btn-reset-quad')?.addEventListener('click', () => {
      this.resetPerspectiveQuad();
    });
    document.getElementById('btn-apply-deskew')?.addEventListener('click', () => {
      this.applyPerspectiveHomographyDeskew();
    });

    // Pin dragging events
    this.attachPinDraggingEvents();

    // Drag and drop in canvas container
    const dropzone = document.getElementById('canvas-container');
    if (dropzone) {
      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer?.files?.length) {
          this.loadFiles(Array.from(e.dataTransfer.files));
        }
      });
    }
  }

  private attachPinDraggingEvents() {
    const bindPin = (el: SVGCircleElement | null, key: keyof QuadCorners) => {
      if (!el) return;
      el.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        this.draggingPin = key;
      });
    };

    bindPin(this.pinTL, 'topLeft');
    bindPin(this.pinTR, 'topRight');
    bindPin(this.pinBR, 'bottomRight');
    bindPin(this.pinBL, 'bottomLeft');

    window.addEventListener('mousemove', (e) => {
      if (!this.draggingPin || !this.isQuadEditing || this.activeIndex < 0) return;
      const rect = this.canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      let normX = (e.clientX - rect.left) / rect.width;
      let normY = (e.clientY - rect.top) / rect.height;

      // Snapping to boundaries
      if (normX < 0.02) normX = 0;
      if (normX > 0.98) normX = 1;
      if (normY < 0.02) normY = 0;
      if (normY > 0.98) normY = 1;

      normX = Math.max(0, Math.min(1, Number(normX.toFixed(4))));
      normY = Math.max(0, Math.min(1, Number(normY.toFixed(4))));

      this.activeQuad[this.draggingPin] = { x: normX, y: normY };
      this.updatePerspectiveOverlayVisuals();

      const btnApply = document.getElementById('btn-apply-deskew') as HTMLButtonElement | null;
      if (btnApply) btnApply.disabled = false;
    });

    window.addEventListener('mouseup', () => {
      this.draggingPin = null;
    });
  }

  private togglePerspectiveQuadEditor() {
    if (this.activeIndex < 0) return;
    this.isQuadEditing = !this.isQuadEditing;
    const btnToggle = document.getElementById('btn-toggle-quad') as HTMLButtonElement | null;
    const btnApply = document.getElementById('btn-apply-deskew') as HTMLButtonElement | null;

    if (this.isQuadEditing) {
      if (btnToggle) btnToggle.textContent = 'Close Pins';
      this.perspectiveOverlay.style.display = 'block';
      this.updatePerspectiveOverlayVisuals();
      if (btnApply) btnApply.disabled = false;
      this.shell.updateStatus('status-msg', 'Drag 4 pins to align corners with document quadrilateral.');
    } else {
      if (btnToggle) btnToggle.textContent = 'Edit Pins';
      this.perspectiveOverlay.style.display = 'none';
      this.shell.updateStatus('status-msg', 'Corners editing paused.');
    }
  }

  private resetPerspectiveQuad() {
    this.activeQuad = {
      topLeft: { x: 0, y: 0 },
      topRight: { x: 1, y: 0 },
      bottomRight: { x: 1, y: 1 },
      bottomLeft: { x: 0, y: 1 },
    };
    if (this.activeIndex >= 0) {
      this.pushUndoState();
      this.items[this.activeIndex].recipe.perspectiveQuad = undefined;
      this.renderActiveItem();
    }
    this.updatePerspectiveOverlayVisuals();
    this.shell.updateStatus('status-msg', 'Reset perspective corners to document boundary.');
  }

  private applyPerspectiveHomographyDeskew() {
    if (this.activeIndex < 0) return;
    this.pushUndoState();
    this.items[this.activeIndex].recipe.perspectiveQuad = {
      topLeft: { ...this.activeQuad.topLeft },
      topRight: { ...this.activeQuad.topRight },
      bottomRight: { ...this.activeQuad.bottomRight },
      bottomLeft: { ...this.activeQuad.bottomLeft },
    };

    this.isQuadEditing = false;
    this.perspectiveOverlay.style.display = 'none';
    const btnToggle = document.getElementById('btn-toggle-quad') as HTMLButtonElement | null;
    if (btnToggle) btnToggle.textContent = 'Edit Pins';
    const btnApply = document.getElementById('btn-apply-deskew') as HTMLButtonElement | null;
    if (btnApply) btnApply.disabled = true;

    this.renderActiveItem();
    this.shell.updateStatus('status-msg', 'Applied 4-point homography projective deskew!');
  }

  private updatePerspectiveOverlayVisuals() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    const pTL = { x: this.activeQuad.topLeft.x * w, y: this.activeQuad.topLeft.y * h };
    const pTR = { x: this.activeQuad.topRight.x * w, y: this.activeQuad.topRight.y * h };
    const pBR = { x: this.activeQuad.bottomRight.x * w, y: this.activeQuad.bottomRight.y * h };
    const pBL = { x: this.activeQuad.bottomLeft.x * w, y: this.activeQuad.bottomLeft.y * h };

    this.pinTL?.setAttribute('cx', String(pTL.x));
    this.pinTL?.setAttribute('cy', String(pTL.y));

    this.pinTR?.setAttribute('cx', String(pTR.x));
    this.pinTR?.setAttribute('cy', String(pTR.y));

    this.pinBR?.setAttribute('cx', String(pBR.x));
    this.pinBR?.setAttribute('cy', String(pBR.y));

    this.pinBL?.setAttribute('cx', String(pBL.x));
    this.pinBL?.setAttribute('cy', String(pBL.y));

    this.quadPolygon?.setAttribute(
      'points',
      `${pTL.x},${pTL.y} ${pTR.x},${pTR.y} ${pBR.x},${pBR.y} ${pBL.x},${pBL.y}`
    );
  }

  // --- Undo / Redo System ---
  private pushUndoState() {
    if (this.activeIndex < 0) return;
    const cur = JSON.parse(JSON.stringify(this.items[this.activeIndex]!.recipe));
    this.undoStack.push(cur);
    if (this.undoStack.length > 30) this.undoStack.shift();
    this.redoStack = [];
    this.updateUndoRedoButtons();
  }

  private syncInspectorToActiveRecipe() {
    if (this.activeIndex < 0) return;
    const item = this.items[this.activeIndex]!;
    const recipe = item.recipe;

    const setSlider = (id: string, labelId: string, val: number, suffix = '') => {
      const slider = document.getElementById(id) as HTMLInputElement | null;
      const label = document.getElementById(labelId);
      if (slider) slider.value = String(val);
      if (label) label.textContent = `${val}${suffix}`;
    };

    setSlider('slider-brightness', 'val-brightness', recipe.brightness);
    setSlider('slider-contrast', 'val-contrast', recipe.contrast);
    setSlider('slider-saturation', 'val-saturation', recipe.saturation);
    setSlider('slider-sharpness', 'val-sharpness', recipe.sharpness);

    // Sync fine angle and coarse rotation
    item.fineAngle = Number((recipe.rotation % 90).toFixed(1));
    item.coarseRotation = ((Math.round(recipe.rotation - item.fineAngle) % 360) + 360) % 360;
    setSlider('slider-fine-angle', 'val-fine-angle', item.fineAngle, '°');

    // Sync preset card active state
    document.querySelectorAll('.preset-card').forEach((card) => {
      const p = (card as HTMLElement).dataset.preset;
      if (p === recipe.filterPreset) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    // Sync perspective quad state
    if (recipe.perspectiveQuad) {
      this.activeQuad = {
        topLeft: { ...recipe.perspectiveQuad.topLeft },
        topRight: { ...recipe.perspectiveQuad.topRight },
        bottomRight: { ...recipe.perspectiveQuad.bottomRight },
        bottomLeft: { ...recipe.perspectiveQuad.bottomLeft },
      };
    } else {
      this.activeQuad = {
        topLeft: { x: 0, y: 0 },
        topRight: { x: 1, y: 0 },
        bottomRight: { x: 1, y: 1 },
        bottomLeft: { x: 0, y: 1 },
      };
    }

    if (this.isQuadEditing) {
      this.updatePerspectiveOverlayVisuals();
    }
  }

  public undo() {
    if (this.activeIndex < 0 || this.undoStack.length === 0) return;
    const current = JSON.parse(JSON.stringify(this.items[this.activeIndex]!.recipe));
    const previous = this.undoStack.pop()!;
    this.redoStack.push(current);
    this.items[this.activeIndex]!.recipe = previous;
    this.syncInspectorToActiveRecipe();
    this.renderActiveItem();
    this.updateUndoRedoButtons();
    this.shell.updateStatus('status-msg', 'Undo applied.');
  }

  public redo() {
    if (this.activeIndex < 0 || this.redoStack.length === 0) return;
    const current = JSON.parse(JSON.stringify(this.items[this.activeIndex]!.recipe));
    const next = this.redoStack.pop()!;
    this.undoStack.push(current);
    this.items[this.activeIndex]!.recipe = next;
    this.syncInspectorToActiveRecipe();
    this.renderActiveItem();
    this.updateUndoRedoButtons();
    this.shell.updateStatus('status-msg', 'Redo applied.');
  }

  private updateUndoRedoButtons() {
    this.shell.setToolDisabled('btn-undo', this.undoStack.length === 0);
    this.shell.setToolDisabled('btn-redo', this.redoStack.length === 0);
  }

  // --- Zoom & View Controls ---
  private adjustZoom(delta: number) {
    this.zoom = Math.max(0.2, Math.min(3.0, Number((this.zoom + delta).toFixed(2))));
    if (this.canvas) {
      this.canvas.style.transform = `scale(${this.zoom})`;
    }
    this.shell.updateStatus('status-msg', `Zoom: ${Math.round(this.zoom * 100)}%`);
  }

  private setZoom(val: number) {
    this.zoom = val;
    if (this.canvas) {
      this.canvas.style.transform = `scale(${this.zoom})`;
    }
    this.shell.updateStatus('status-msg', `Zoom: 100%`);
  }

  private rotateActiveCw() {
    if (this.activeIndex >= 0) {
      this.pushUndoState();
      const item = this.items[this.activeIndex];
      item.coarseRotation = (item.coarseRotation + 90) % 360;
      item.recipe.rotation = item.coarseRotation + item.fineAngle;
      this.renderActiveItem();
    }
  }

  private resetFilters() {
    if (this.activeIndex >= 0) {
      this.pushUndoState();
      this.items[this.activeIndex].recipe = createDefaultAdjustmentRecipe();
      this.items[this.activeIndex].coarseRotation = 0;
      this.items[this.activeIndex].fineAngle = 0;
      this.syncInspectorToActiveRecipe();
      this.renderActiveItem();
      this.shell.updateStatus('status-msg', 'Filters reset to default.');
    }
  }

  // --- OCR Extraction ---
  public async extractTextOcr() {
    if (this.activeIndex < 0) return;
    this.shell.updateStatus('status-msg', 'Running offline OCR recognition...');

    try {
      const imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      const res = performOcr(imgData);

      const modal = document.getElementById('ocr-modal')!;
      const meta = document.getElementById('ocr-meta')!;
      const txt = document.getElementById('ocr-text-result') as HTMLTextAreaElement;

      meta.textContent = `${res.lines.length} lines detected, ${res.words.length} words, Confidence: ${res.confidence}%`;
      txt.value = res.text || '[No text detected in this image]';
      modal.style.display = 'flex';

      this.shell.updateStatus('status-msg', `OCR complete: ${res.words.length} words detected.`);
    } catch (err: any) {
      console.error(err);
      this.shell.updateStatus('status-msg', `OCR error: ${err.message}`);
    }
  }

  // --- Inter-App Pipeline (ClipBus) ---
  public async sendToMePdf() {
    if (this.activeIndex < 0) return;
    const item = this.items[this.activeIndex];
    this.shell.updateStatus('status-msg', `Transferring "${item.name}" to mePDF...`);

    try {
      const dataUrl = this.canvas.toDataURL('image/jpeg', 0.95);

      await clipBus.sendAsync({
        sourceApp: 'mephoto',
        targetApp: 'mepdf',
        type: 'image-page',
        dataUrl,
        name: `mePhoto_${item.name}`,
      });

      const bridge = createLauncherBridge();
      await bridge.launchApp({ appId: 'mepdf' });

      this.shell.updateStatus('status-msg', `Scan "${item.name}" transferred to mePDF workspace!`);
    } catch (err: any) {
      console.error(err);
      this.shell.updateStatus('status-msg', `ClipBus transfer failed: ${err.message}`);
    }
  }

  public async loadFiles(files: File[]) {
    for (const file of files) {
      if (!file.type.startsWith('image/')) continue;
      const url = URL.createObjectURL(file);
      const img = new Image();
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.src = url;
      });

      const item: PhotoDocumentItem = {
        id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        name: file.name,
        originalBlob: file,
        originalWidth: img.naturalWidth,
        originalHeight: img.naturalHeight,
        thumbnailUrl: url,
        recipe: createDefaultAdjustmentRecipe(),
        coarseRotation: 0,
        fineAngle: 0,
        status: 'ready',
      };

      this.items.push(item);
    }

    if (this.items.length > 0 && this.activeIndex === -1) {
      this.selectIndex(0);
    }

    this.updateUI();
  }

  public async importFromDataUrl(dataUrl: string, name = 'mePhoto_Import.jpg'): Promise<void> {
    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], name, { type: blob.type || 'image/jpeg' });
      await this.loadFiles([file]);
    } catch (err) {
      console.error('[mePhoto] Failed to import from dataUrl:', err);
    }
  }

  private selectIndex(idx: number) {
    if (idx < 0 || idx >= this.items.length) return;
    this.activeIndex = idx;
    this.undoStack = [];
    this.redoStack = [];
    this.updateUndoRedoButtons();
    this.syncInspectorToActiveRecipe();
    this.renderActiveItem();
    this.updateUI();
  }

  public applyFilterPreset(preset: PhotoFilterPreset) {
    this.pushUndoState();
    this.updateActiveRecipe({ filterPreset: preset });
  }

  private updateActiveRecipe(patch: Partial<PhotoAdjustmentRecipe>) {
    if (this.activeIndex < 0) return;
    this.items[this.activeIndex].recipe = {
      ...this.items[this.activeIndex].recipe,
      ...patch,
    };
    this.renderActiveItem();
  }

  private async renderActiveItem() {
    if (this.activeIndex < 0) return;
    const item = this.items[this.activeIndex];
    this.shell.updateStatus('status-msg', `Processing ${item.name}...`);

    const img = new Image();
    await new Promise<void>((resolve) => {
      img.onload = () => resolve();
      img.src = item.thumbnailUrl;
    });

    const rendered = renderRecipeToCanvas(img, item.recipe);
    this.canvas.width = rendered.width;
    this.canvas.height = rendered.height;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(rendered, 0, 0);

    this.canvas.style.display = 'block';
    const dropzone = document.getElementById('empty-dropzone');
    if (dropzone) dropzone.style.display = 'none';

    if (this.isQuadEditing) {
      this.updatePerspectiveOverlayVisuals();
    }

    this.shell.updateStatus('status-msg', `${item.name} — Ready`);
    this.shell.updateStatus('status-info', `${item.name} · ${this.canvas.width} x ${this.canvas.height} px · RGB`);
  }

  private updateUI() {
    const hasItems = this.items.length > 0;
    this.shell.setToolDisabled('btn-export-pdf', !hasItems);
    this.shell.setToolDisabled('btn-export-image', !hasItems);
    this.shell.setToolDisabled('btn-extract-text', !hasItems);
    this.shell.setToolDisabled('btn-send-to-mepdf', !hasItems);

    // Render filmstrip
    if (this.filmstripContainer) {
      this.filmstripContainer.innerHTML = '';
      this.items.forEach((item, idx) => {
        const thumb = document.createElement('div');
        thumb.className = `filmstrip-thumb ${idx === this.activeIndex ? 'active' : ''}`;
        thumb.innerHTML = `<img src="${item.thumbnailUrl}" alt="${item.name}" />`;
        thumb.addEventListener('click', () => this.selectIndex(idx));
        this.filmstripContainer.appendChild(thumb);
      });
    }
  }

  public async exportActiveImage() {
    if (this.activeIndex < 0) return;
    const item = this.items[this.activeIndex];
    this.canvas.toBlob((blob) => {
      if (blob) {
        downloadBlob(blob, `mePhoto_${item.name}`);
      }
    }, 'image/png');
  }

  public async exportAllAsPdf() {
    if (this.items.length === 0) return;
    this.shell.updateStatus('status-msg', 'Generating multi-page PDF...');
    try {
      const { PDFDocument } = await import('pdf-lib');
      const pdfDoc = await PDFDocument.create();

      for (const item of this.items) {
        const img = new Image();
        await new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.src = item.thumbnailUrl;
        });

        const tempCanvas = renderRecipeToCanvas(img, item.recipe);
        const dataUrl = tempCanvas.toDataURL('image/jpeg', 0.92);
        const imageBytes = await fetch(dataUrl).then((res) => res.arrayBuffer());
        const embeddedImage = await pdfDoc.embedJpg(imageBytes);

        const page = pdfDoc.addPage([embeddedImage.width, embeddedImage.height]);
        page.drawImage(embeddedImage, {
          x: 0,
          y: 0,
          width: embeddedImage.width,
          height: embeddedImage.height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      downloadBlob(blob, `mePhoto_Document_${Date.now()}.pdf`);
      this.shell.updateStatus('status-msg', 'PDF Export Complete!');
    } catch (err: any) {
      console.error(err);
      this.shell.updateStatus('status-msg', `PDF Export Error: ${err.message}`);
    }
  }

  private initClipBus(): void {
    clipBus.subscribe((msg) => {
      if (msg.targetApp === 'mephoto' && msg.dataUrl) {
        if (msg.id && this.processedClipBusIds.has(msg.id)) return;
        if (msg.id) this.processedClipBusIds.add(msg.id);
        void this.importFromDataUrl(msg.dataUrl, msg.name || 'mePhoto_Import.jpg');
      }
    });

    void clipBus.consumePendingAsync('mephoto').then((pending) => {
      for (const p of pending) {
        if (p.dataUrl) {
          if (p.id && this.processedClipBusIds.has(p.id)) continue;
          if (p.id) this.processedClipBusIds.add(p.id);
          void this.importFromDataUrl(p.dataUrl, p.name || 'mePhoto_Import.jpg');
        }
      }
    });
  }

  private updateUserIndicator() {
    if (!this.currentSession) return;
    const email = this.currentSession.user.email;
    this.shell.updateStatus('status-info', `👤 ${email} · 100% In-Device Privacy`);
  }

  private showShortcutsModal() {
    this.shell.modal({
      title: 'mePhoto Studio — Keyboard Shortcuts',
      body: `
        <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.8;">
          <div><kbd style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px; font-family: var(--font-mono);">Ctrl + O</kbd> — Open Images</div>
          <div><kbd style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px; font-family: var(--font-mono);">Ctrl + S</kbd> — Export as Multi-Page PDF</div>
          <div><kbd style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px; font-family: var(--font-mono);">Ctrl + Z</kbd> — Undo Adjustments</div>
          <div><kbd style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px; font-family: var(--font-mono);">Ctrl + Y</kbd> — Redo Adjustments</div>
          <div><kbd style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px; font-family: var(--font-mono);">Ctrl + +</kbd> — Zoom In</div>
          <div><kbd style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px; font-family: var(--font-mono);">Ctrl + -</kbd> — Zoom Out</div>
          <div><kbd style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px; font-family: var(--font-mono);">Ctrl + 0</kbd> — Actual Size (100%)</div>
        </div>
      `,
    });
  }

  private showAboutModal() {
    this.shell.modal({
      title: 'About mePhoto Studio',
      body: `
        <div style="text-align: center; padding: 12px 0;">
          <div style="font-size: 18px; font-weight: 700; color: #06b6d4; margin-bottom: 6px;">mePhoto Studio v1.0.0</div>
          <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 16px;">CamScanner-Grade Document Restoration & Photo Lab</div>
          <div style="font-size: 12px; color: var(--text-faint); line-height: 1.6;">
            Powered by 4-Point Homography Perspective Rectification, Otsu Adaptive Binarization, and Offline Client-Side OCR.
            <br>Built upon the unified <strong>meCraft Shared Studio Shell</strong>.
            <br><span style="color: #10b981; font-weight: 600;">🛡️ 100% In-Device RAM Privacy Guaranteed.</span>
          </div>
        </div>
      `,
    });
  }

  public getShell(): StudioShell {
    return this.shell;
  }
}

// Bootstrap
if (typeof document !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    new MePhotoStudio();
  });
}

export { MePhotoStudio };
