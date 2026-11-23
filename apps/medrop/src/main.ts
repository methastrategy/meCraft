/**
 * @file main.ts
 * Main Frontend Application Controller for meDrop
 */

import './styles/radial.css';
import { RadialDonut } from './components/RadialDonut.js';
import { resolveCategory, resolveExtension, resolveWedges } from './engines/ContextFilter.js';
import { ConversionEngine } from './engines/ConversionEngine.js';
import { StudioGateway } from './engines/StudioGateway.js';
import type { DraggedFileInfo, RadialWedgeAction } from './types/radial-types.js';

export class MeDropApp {
  private container: HTMLElement;
  private donut: RadialDonut | null = null;
  private activeFileInfo: DraggedFileInfo;

  constructor(containerId = 'medrop-app') {
    this.container = document.getElementById(containerId) || document.body;

    // Default sample state before first file drag
    this.activeFileInfo = {
      name: 'Sample_Document.jpg',
      extension: 'jpg',
      sizeBytes: 1024 * 1024 * 2.4, // 2.4 MB
      mimeType: 'image/jpeg',
      category: 'image',
    };

    this.init();
    this.attachDropListeners();
  }

  public init(): void {
    const wedges = resolveWedges(this.activeFileInfo);
    this.donut = new RadialDonut(this.container, this.activeFileInfo, wedges, {
      onWedgeSelected: (action, fileInfo) => this.handleActionSelected(action, fileInfo),
    });
  }

  public setFile(file: File, filePath?: string): void {
    const ext = resolveExtension(file.name);
    const category = resolveCategory(file.name, file.type);

    this.activeFileInfo = {
      name: file.name,
      extension: ext,
      sizeBytes: file.size,
      mimeType: file.type,
      category,
      file,
      filePath,
    };

    const wedges = resolveWedges(this.activeFileInfo);
    this.donut = new RadialDonut(this.container, this.activeFileInfo, wedges, {
      onWedgeSelected: (action, fileInfo) => this.handleActionSelected(action, fileInfo),
    });
  }

  public async handleActionSelected(action: RadialWedgeAction, info: DraggedFileInfo): Promise<void> {
    if (action.isStudioGateway) {
      await StudioGateway.dispatchToStudio(action, info);
      return;
    }

    if (this.donut) {
      this.donut.setProgress(30);
    }

    const result = await ConversionEngine.executeAction(action, info, (pct) => {
      if (this.donut) this.donut.setProgress(pct);
    });

    if (result.success && result.blob) {
      this.downloadOutput(result.blob, result.outputName);
    }
  }

  private downloadOutput(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  private attachDropListeners(): void {
    window.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });

    window.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.dataTransfer && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        this.setFile(file);
      }
    });
  }

  public getDonut(): RadialDonut | null {
    return this.donut;
  }

  public getActiveFileInfo(): DraggedFileInfo {
    return this.activeFileInfo;
  }
}

// Bootstrap
if (typeof document !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    new MeDropApp();
  });
}
