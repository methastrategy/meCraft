import './styles/app.css';
import {
  createDefaultAdjustmentRecipe,
  renderRecipeToCanvas,
  performOcr,
  type PhotoAdjustmentRecipe,
  type PhotoFilterPreset,
  type QuadCorners,
  type Point2D,
} from '@mecraft/photo-core';
import { clipBus, createLauncherBridge } from '@mecraft/core-bridge';
import { downloadBlob } from './utils/file-utils';
import type { PhotoDocumentItem, ViewportMode } from './core/types';

class MePhotoStudio {
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
  private statusText!: HTMLElement;
  private perspectiveOverlay!: SVGSVGElement;
  private quadPolygon!: SVGPolygonElement;
  private pinTL!: SVGCircleElement;
  private pinTR!: SVGCircleElement;
  private pinBR!: SVGCircleElement;
  private pinBL!: SVGCircleElement;

  constructor() {
    this.appEl = document.getElementById('app')!;
    this.renderLayout();
    this.initCanvas();
    this.attachGlobalEvents();
  }

  private renderLayout() {
    this.appEl.innerHTML = `
      <header class="photo-header">
        <div class="photo-brand">
          <div class="photo-brand-logo">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
              <circle cx="12" cy="13" r="3"></circle>
            </svg>
          </div>
          <div class="photo-brand-title">
            mePhoto Studio
            <span class="photo-brand-badge">CamScanner Pro</span>
          </div>
        </div>

        <div class="photo-nav-actions">
          <input type="file" id="file-input" multiple accept="image/*" style="display: none;" />
          <button class="btn-photo" id="btn-open-files">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            Open Images
          </button>
          <button class="btn-photo" id="btn-extract-text" disabled title="Recognize and extract text from photo offline">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            Extract Text (OCR)
          </button>
          <button class="btn-photo" id="btn-send-to-mepdf" disabled title="Send current scan to mePDF workspace via ClipBus">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            Send to mePDF
          </button>
          <button class="btn-photo primary" id="btn-export-pdf" disabled>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            Export as PDF
          </button>
          <button class="btn-photo" id="btn-export-image" disabled>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Export Image
          </button>
        </div>
      </header>

      <div class="photo-workspace">
        <aside class="photo-filmstrip" id="photo-filmstrip">
          <div class="filmstrip-header">Pages / Scans</div>
          <div class="filmstrip-thumb filmstrip-add" id="btn-add-more">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            <span>Add Scan</span>
          </div>
          <div id="filmstrip-items" style="display: flex; flex-direction: column; gap: 8px;"></div>
        </aside>

        <main class="photo-canvas-area">
          <div class="canvas-toolbar">
            <button class="btn-icon" id="btn-undo" title="Undo (Ctrl+Z)" disabled>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7v6h6"></path><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path></svg>
            </button>
            <button class="btn-icon" id="btn-redo" title="Redo (Ctrl+Y)" disabled>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 7v6h-6"></path><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"></path></svg>
            </button>
            <div style="width: 1px; height: 16px; background: var(--border-subtle); margin: 0 4px;"></div>
            <button class="btn-icon" id="btn-zoom-out" title="Zoom Out">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
            <span id="zoom-label" style="font-size: 11px; font-family: var(--font-mono); min-width: 44px; text-align: center;">100%</span>
            <button class="btn-icon" id="btn-zoom-in" title="Zoom In">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
            <div style="width: 1px; height: 16px; background: var(--border-subtle); margin: 0 4px;"></div>
            <button class="btn-icon" id="btn-rotate-cw" title="Rotate 90°">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
            </button>
            <button class="btn-icon" id="btn-reset-recipe" title="Reset Filters">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><polyline points="3 3 3 8 8 8"></polyline></svg>
            </button>
          </div>

          <div class="viewport-canvas-container" id="canvas-container">
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
        </main>

        <aside class="photo-inspector">
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
        </aside>
      </div>

      <!-- OCR Result Modal -->
      <div id="ocr-modal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(6px); z-index: 100; align-items: center; justify-content: center;">
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
      </div>

      <footer class="photo-status-bar">
        <span id="status-left">Ready</span>
        <span id="status-right">mePhoto Studio v1.0.0</span>
      </footer>
    `;
  }

  private initCanvas() {
    this.canvas = document.getElementById('photo-canvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.filmstripContainer = document.getElementById('filmstrip-items')!;
    this.statusText = document.getElementById('status-left')!;

    this.perspectiveOverlay = document.getElementById('perspective-overlay') as unknown as SVGSVGElement;
    this.quadPolygon = document.getElementById('quad-polygon') as unknown as SVGPolygonElement;
    this.pinTL = document.getElementById('pin-tl') as unknown as SVGCircleElement;
    this.pinTR = document.getElementById('pin-tr') as unknown as SVGCircleElement;
    this.pinBR = document.getElementById('pin-br') as unknown as SVGCircleElement;
    this.pinBL = document.getElementById('pin-bl') as unknown as SVGCircleElement;
  }

  private attachGlobalEvents() {
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    document.getElementById('btn-open-files')?.addEventListener('click', () => fileInput.click());
    document.getElementById('btn-add-more')?.addEventListener('click', () => fileInput.click());
    document.getElementById('btn-dropzone-select')?.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        this.loadFiles(Array.from(files));
      }
    });

    // Undo / Redo buttons
    document.getElementById('btn-undo')?.addEventListener('click', () => this.undo());
    document.getElementById('btn-redo')?.addEventListener('click', () => this.redo());

    // Keyboard Shortcuts (Ctrl+Z, Ctrl+Y)
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

    // Extract Text (OCR) button
    document.getElementById('btn-extract-text')?.addEventListener('click', () => {
      this.extractTextOcr();
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

    // Send to mePDF (ClipBus) button
    document.getElementById('btn-send-to-mepdf')?.addEventListener('click', () => {
      this.sendToMePdf();
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

    // Rotate CW
    document.getElementById('btn-rotate-cw')?.addEventListener('click', () => {
      if (this.activeIndex >= 0) {
        this.pushUndoState();
        const item = this.items[this.activeIndex];
        item.coarseRotation = (item.coarseRotation + 90) % 360;
        item.recipe.rotation = item.coarseRotation + item.fineAngle;
        this.renderActiveItem();
      }
    });

    // Reset recipe
    document.getElementById('btn-reset-recipe')?.addEventListener('click', () => {
      if (this.activeIndex >= 0) {
        this.pushUndoState();
        this.items[this.activeIndex].recipe = createDefaultAdjustmentRecipe();
        this.items[this.activeIndex].coarseRotation = 0;
        this.items[this.activeIndex].fineAngle = 0;
        this.renderActiveItem();
      }
    });

    // Export image
    document.getElementById('btn-export-image')?.addEventListener('click', () => {
      this.exportActiveImage();
    });

    // Export PDF
    document.getElementById('btn-export-pdf')?.addEventListener('click', () => {
      this.exportAllAsPdf();
    });

    // Drag and drop
    const dropzone = document.getElementById('canvas-container')!;
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

  private attachPinDraggingEvents() {
    const bindPin = (el: SVGCircleElement, key: keyof QuadCorners) => {
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

      const btnApply = document.getElementById('btn-apply-deskew') as HTMLButtonElement;
      if (btnApply) btnApply.disabled = false;
    });

    window.addEventListener('mouseup', () => {
      this.draggingPin = null;
    });
  }

  private togglePerspectiveQuadEditor() {
    if (this.activeIndex < 0) return;
    this.isQuadEditing = !this.isQuadEditing;
    const btnToggle = document.getElementById('btn-toggle-quad') as HTMLButtonElement;
    const btnApply = document.getElementById('btn-apply-deskew') as HTMLButtonElement;

    if (this.isQuadEditing) {
      if (btnToggle) btnToggle.textContent = 'Close Pins';
      this.perspectiveOverlay.style.display = 'block';
      this.updatePerspectiveOverlayVisuals();
      if (btnApply) btnApply.disabled = false;
      this.statusText.textContent = 'Drag 4 pins to align corners with document quadrilateral.';
    } else {
      if (btnToggle) btnToggle.textContent = 'Edit Pins';
      this.perspectiveOverlay.style.display = 'none';
      this.statusText.textContent = 'Corners editing paused.';
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
    this.statusText.textContent = 'Reset perspective corners to document boundary.';
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
    const btnToggle = document.getElementById('btn-toggle-quad') as HTMLButtonElement;
    if (btnToggle) btnToggle.textContent = 'Edit Pins';
    const btnApply = document.getElementById('btn-apply-deskew') as HTMLButtonElement;
    if (btnApply) btnApply.disabled = true;

    this.renderActiveItem();
    this.statusText.textContent = 'Applied 4-point homography projective deskew!';
  }

  private updatePerspectiveOverlayVisuals() {
    const rect = this.canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    const pTL = { x: this.activeQuad.topLeft.x * w, y: this.activeQuad.topLeft.y * h };
    const pTR = { x: this.activeQuad.topRight.x * w, y: this.activeQuad.topRight.y * h };
    const pBR = { x: this.activeQuad.bottomRight.x * w, y: this.activeQuad.bottomRight.y * h };
    const pBL = { x: this.activeQuad.bottomLeft.x * w, y: this.activeQuad.bottomLeft.y * h };

    this.pinTL.setAttribute('cx', String(pTL.x));
    this.pinTL.setAttribute('cy', String(pTL.y));

    this.pinTR.setAttribute('cx', String(pTR.x));
    this.pinTR.setAttribute('cy', String(pTR.y));

    this.pinBR.setAttribute('cx', String(pBR.x));
    this.pinBR.setAttribute('cy', String(pBR.y));

    this.pinBL.setAttribute('cx', String(pBL.x));
    this.pinBL.setAttribute('cy', String(pBL.y));

    this.quadPolygon.setAttribute(
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

  private undo() {
    if (this.activeIndex < 0 || this.undoStack.length === 0) return;
    const current = JSON.parse(JSON.stringify(this.items[this.activeIndex]!.recipe));
    const previous = this.undoStack.pop()!;
    this.redoStack.push(current);
    this.items[this.activeIndex]!.recipe = previous;
    this.syncInspectorToActiveRecipe();
    this.renderActiveItem();
    this.updateUndoRedoButtons();
    this.statusText.textContent = 'Undo applied.';
  }

  private redo() {
    if (this.activeIndex < 0 || this.redoStack.length === 0) return;
    const current = JSON.parse(JSON.stringify(this.items[this.activeIndex]!.recipe));
    const next = this.redoStack.pop()!;
    this.undoStack.push(current);
    this.items[this.activeIndex]!.recipe = next;
    this.syncInspectorToActiveRecipe();
    this.renderActiveItem();
    this.updateUndoRedoButtons();
    this.statusText.textContent = 'Redo applied.';
  }

  private updateUndoRedoButtons() {
    const btnUndo = document.getElementById('btn-undo') as HTMLButtonElement;
    const btnRedo = document.getElementById('btn-redo') as HTMLButtonElement;
    if (btnUndo) btnUndo.disabled = this.undoStack.length === 0;
    if (btnRedo) btnRedo.disabled = this.redoStack.length === 0;
  }

  // --- OCR Extraction ---
  private async extractTextOcr() {
    if (this.activeIndex < 0) return;
    this.statusText.textContent = 'Running offline OCR recognition...';

    try {
      const imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      const res = performOcr(imgData);

      const modal = document.getElementById('ocr-modal')!;
      const meta = document.getElementById('ocr-meta')!;
      const txt = document.getElementById('ocr-text-result') as HTMLTextAreaElement;

      meta.textContent = `${res.lines.length} lines detected, ${res.words.length} words, Confidence: ${res.confidence}%`;
      txt.value = res.text || '[No text detected in this image]';
      modal.style.display = 'flex';

      this.statusText.textContent = `OCR complete: ${res.words.length} words detected.`;
    } catch (err: any) {
      console.error(err);
      this.statusText.textContent = `OCR error: ${err.message}`;
    }
  }

  // --- Inter-App Pipeline (ClipBus) ---
  private async sendToMePdf() {
    if (this.activeIndex < 0) return;
    const item = this.items[this.activeIndex];
    this.statusText.textContent = `Transferring "${item.name}" to mePDF...`;

    try {
      const dataUrl = this.canvas.toDataURL('image/jpeg', 0.95);

      clipBus.send({
        sourceApp: 'mephoto',
        targetApp: 'mepdf',
        type: 'image-page',
        dataUrl,
        name: `mePhoto_${item.name}`,
      });

      const bridge = createLauncherBridge();
      await bridge.launchApp({ appId: 'mepdf' });

      this.statusText.textContent = `Scan "${item.name}" transferred to mePDF workspace!`;
    } catch (err: any) {
      console.error(err);
      this.statusText.textContent = `ClipBus transfer failed: ${err.message}`;
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

  private applyFilterPreset(preset: PhotoFilterPreset) {
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
    this.statusText.textContent = `Processing ${item.name}...`;

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

    this.statusText.textContent = `${item.name} (${this.canvas.width} x ${this.canvas.height}) - Ready`;
  }

  private updateUI() {
    const hasItems = this.items.length > 0;
    (document.getElementById('btn-export-pdf') as HTMLButtonElement).disabled = !hasItems;
    (document.getElementById('btn-export-image') as HTMLButtonElement).disabled = !hasItems;
    (document.getElementById('btn-extract-text') as HTMLButtonElement).disabled = !hasItems;
    (document.getElementById('btn-send-to-mepdf') as HTMLButtonElement).disabled = !hasItems;

    // Render filmstrip
    this.filmstripContainer.innerHTML = '';
    this.items.forEach((item, idx) => {
      const thumb = document.createElement('div');
      thumb.className = `filmstrip-thumb ${idx === this.activeIndex ? 'active' : ''}`;
      thumb.innerHTML = `<img src="${item.thumbnailUrl}" alt="${item.name}" />`;
      thumb.addEventListener('click', () => this.selectIndex(idx));
      this.filmstripContainer.appendChild(thumb);
    });
  }

  private async exportActiveImage() {
    if (this.activeIndex < 0) return;
    const item = this.items[this.activeIndex];
    this.canvas.toBlob((blob) => {
      if (blob) {
        downloadBlob(blob, `mePhoto_${item.name}`);
      }
    }, 'image/png');
  }

  private async exportAllAsPdf() {
    if (this.items.length === 0) return;
    this.statusText.textContent = 'Generating multi-page PDF...';
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
      this.statusText.textContent = 'PDF Export Complete!';
    } catch (err: any) {
      console.error(err);
      this.statusText.textContent = `PDF Export Error: ${err.message}`;
    }
  }
}

// Bootstrap
if (typeof document !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    new MePhotoStudio();
  });
}

export { MePhotoStudio };
