import './styles/app.css';
import {
  createDefaultAdjustmentRecipe,
  renderRecipeToCanvas,
  processPhoto,
  type PhotoAdjustmentRecipe,
  type PhotoFilterPreset,
} from './core/photo-processor';
import { downloadBlob } from './utils/file-utils';
import type { PhotoDocumentItem, ViewportMode } from './core/types';

class MePhotoStudio {
  private items: PhotoDocumentItem[] = [];
  private activeIndex = -1;
  private viewportMode: ViewportMode = 'processed';
  private zoom = 1.0;

  // DOM Elements
  private appEl!: HTMLElement;
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private filmstripContainer!: HTMLElement;
  private statusText!: HTMLElement;

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
            <canvas id="photo-canvas" style="display: none;"></canvas>
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
          </div>
        </aside>
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

    // Sliders
    const bindSlider = (id: string, prop: keyof PhotoAdjustmentRecipe, labelId: string, suffix = '') => {
      const slider = document.getElementById(id) as HTMLInputElement;
      const label = document.getElementById(labelId);
      slider?.addEventListener('input', () => {
        const val = parseFloat(slider.value);
        if (label) label.textContent = `${val}${suffix}`;
        this.updateActiveRecipe({ [prop]: val });
      });
    };

    bindSlider('slider-brightness', 'brightness', 'val-brightness');
    bindSlider('slider-contrast', 'contrast', 'val-contrast');
    bindSlider('slider-saturation', 'saturation', 'val-saturation');
    bindSlider('slider-sharpness', 'sharpness', 'val-sharpness');

    // Fine deskew
    const deskewSlider = document.getElementById('slider-fine-angle') as HTMLInputElement;
    deskewSlider?.addEventListener('input', () => {
      const val = parseFloat(deskewSlider.value);
      const label = document.getElementById('val-fine-angle');
      if (label) label.textContent = `${val.toFixed(1)}°`;
      if (this.activeIndex >= 0) {
        this.items[this.activeIndex].fineAngle = val;
        this.items[this.activeIndex].recipe.rotation =
          this.items[this.activeIndex].coarseRotation + val;
        this.renderActiveItem();
      }
    });

    // Rotate CW
    document.getElementById('btn-rotate-cw')?.addEventListener('click', () => {
      if (this.activeIndex >= 0) {
        const item = this.items[this.activeIndex];
        item.coarseRotation = (item.coarseRotation + 90) % 360;
        item.recipe.rotation = item.coarseRotation + item.fineAngle;
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
    this.renderActiveItem();
    this.updateUI();
  }

  private applyFilterPreset(preset: PhotoFilterPreset) {
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

    this.statusText.textContent = `${item.name} (${this.canvas.width} x ${this.canvas.height}) - Ready`;
  }

  private updateUI() {
    // Update buttons
    const hasItems = this.items.length > 0;
    (document.getElementById('btn-export-pdf') as HTMLButtonElement).disabled = !hasItems;
    (document.getElementById('btn-export-image') as HTMLButtonElement).disabled = !hasItems;

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
