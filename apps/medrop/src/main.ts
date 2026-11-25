/**
 * @file main.ts
 * Main Frontend Application Controller for meDrop
 */

import './styles/radial.css';
import { RadialDonut } from './components/RadialDonut.js';
import { resolveCategory, resolveExtension, resolveWedges } from './engines/ContextFilter.js';
import { ConversionEngine } from './engines/ConversionEngine.js';
import { StudioGateway } from './engines/StudioGateway.js';
import { SteamStartupSplash, DesktopGoogleAuthModal } from '@mecraft/studio-shell';
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

    const isTest = typeof process !== 'undefined' && Boolean(process.env?.VITEST || process.env?.NODE_ENV === 'test');
    if (!isTest) {
      this.runSteamStartupIfDesktop();
    }
  }

  public runSteamStartupIfDesktop(options?: { speedMs?: number; force?: boolean }): SteamStartupSplash | null {
    if (typeof window === 'undefined') return null;
    const isDesktop = Boolean(
      (window as any).__TAURI__ ||
      (window as any).__TAURI_INTERNALS__ ||
      (window.location && new URLSearchParams(window.location.search || '').get('mode') === 'desktop')
    );
    const skipSteam = Boolean(window.location && window.location.search && window.location.search.includes('skipSteam'));
    if (options?.force || (isDesktop && !skipSteam)) {
      const splash = new SteamStartupSplash({
        appName: 'meDrop Transfer',
        appId: 'medrop',
        currentVersion: '1.0.0',
        speedMs: options?.speedMs,
        force: options?.force,
      });
      splash.run();
      return splash;
    }
    return null;
  }

  public init(): void {
    const wedges = resolveWedges(this.activeFileInfo);
    this.donut = new RadialDonut(this.container, this.activeFileInfo, wedges, {
      onWedgeSelected: (action, fileInfo) => this.handleActionSelected(action, fileInfo),
    });

    // Top action controls for Steam Update & Google Auth
    const existingTopBar = document.getElementById('medrop-top-actions');
    if (!existingTopBar) {
      const topBar = document.createElement('div');
      topBar.id = 'medrop-top-actions';
      topBar.style.cssText = 'position:fixed;top:16px;right:16px;display:flex;gap:8px;z-index:9999;';
      topBar.innerHTML = `
        <button type="button" id="btn-medrop-update" title="Check for Updates (Steam Mode)" style="background:rgba(20,25,35,0.85);border:1px solid rgba(255,255,255,0.15);color:#fff;border-radius:999px;width:34px;height:34px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:14px;box-shadow:0 4px 12px rgba(0,0,0,0.3);">⚡</button>
        <button type="button" id="btn-medrop-auth" title="Google Account / Sync" style="background:rgba(20,25,35,0.85);border:1px solid rgba(255,255,255,0.15);color:#fff;border-radius:999px;width:34px;height:34px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:14px;box-shadow:0 4px 12px rgba(0,0,0,0.3);">👤</button>
      `;
      document.body.appendChild(topBar);

      topBar.querySelector('#btn-medrop-update')?.addEventListener('click', () => {
        this.runSteamStartupIfDesktop({ force: true });
      });
      topBar.querySelector('#btn-medrop-auth')?.addEventListener('click', () => {
        new DesktopGoogleAuthModal({
          appName: 'meDrop Transfer',
          onSuccess: () => {},
        }).open();
      });
    }
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
