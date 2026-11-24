/**
 * @file StudioShell.ts
 * Master Orchestrator Component for meCraft Creative & Document Studios
 */

import type { StudioShellConfig, ToastOptions, ModalOptions } from './types.js';
import { TitleBar } from './components/TitleBar.js';
import { MenuBar } from './components/MenuBar.js';
import { CommandRibbon } from './components/CommandRibbon.js';
import { Cockpit } from './components/Cockpit.js';
import { StatusBar } from './components/StatusBar.js';
import { UpdateBanner } from './components/UpdateBanner.js';
import { UpdateModal } from './components/UpdateModal.js';
import { ToastManager } from './components/ToastManager.js';
import { ModalManager } from './components/ModalManager.js';
import { checkSoftwareUpdate } from '@mecraft/core-bridge';

export class StudioShell {
  private config: StudioShellConfig;
  private containerEl: HTMLElement | null = null;
  private rootEl: HTMLElement;

  private titleBar?: TitleBar;
  private updateBanner?: UpdateBanner;
  private menuBar?: MenuBar;
  private commandRibbon?: CommandRibbon;
  private cockpit: Cockpit;
  private statusBar?: StatusBar;
  private updateModal?: UpdateModal;

  constructor(config: StudioShellConfig) {
    this.config = {
      theme: 'navy-black',
      ...config,
    };

    this.rootEl = document.createElement('div');
    this.rootEl.className = `studio-shell-root theme-${this.config.theme}`;
    this.rootEl.setAttribute('data-theme', this.config.theme || 'navy-black');
    this.rootEl.setAttribute('data-app-id', this.config.appId);

    // Initialize Cockpit
    this.cockpit = new Cockpit(this.config.panes);

    // Initialize Update Modal if config exists
    if (this.config.update) {
      this.updateModal = new UpdateModal(this.config.update);
    }

    this.buildShell();

    // Check for updates in the background without blocking UI
    this.checkForUpdates();
  }

  public getCockpit(): Cockpit {
    return this.cockpit;
  }

  public getStatusBar(): StatusBar | undefined {
    return this.statusBar;
  }

  public getCommandRibbon(): CommandRibbon | undefined {
    return this.commandRibbon;
  }

  public getUpdateModal(): UpdateModal | undefined {
    return this.updateModal;
  }

  public getTitleBar(): TitleBar | undefined {
    return this.titleBar;
  }

  public getMenuBar(): MenuBar | undefined {
    return this.menuBar;
  }

  public getModalManager(): typeof ModalManager {
    return ModalManager;
  }

  public getToastManager(): typeof ToastManager {
    return ToastManager;
  }

  public getRootElement(): HTMLElement {
    return this.rootEl;
  }

  public getCenterStage(): HTMLElement {
    return this.cockpit.getCenterStage();
  }

  public getLeftPane(): HTMLElement | null {
    return this.cockpit.getLeftPane();
  }

  public getRightPane(): HTMLElement | null {
    return this.cockpit.getRightPane();
  }

  public mount(target: string | HTMLElement): void {
    const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
    if (!el) {
      throw new Error(`[StudioShell] Target element '${target}' not found in DOM.`);
    }
    this.containerEl = el;
    this.containerEl.innerHTML = '';
    this.containerEl.appendChild(this.rootEl);
  }

  public setDocumentTitle(title: string): void {
    this.config.documentTitle = title;
    if (this.titleBar) {
      this.titleBar.setDocumentTitle(title);
    }
  }

  public setCenterContent(content: HTMLElement | string): void {
    this.cockpit.setCenterContent(content);
  }

  public setToolActive(toolId: string, active: boolean): void {
    this.commandRibbon?.setToolActive(toolId, active);
  }

  public setToolDisabled(toolId: string, disabled: boolean): void {
    this.commandRibbon?.setToolDisabled(toolId, disabled);
  }

  public updateStatus(id: string, content: string | HTMLElement): void {
    this.statusBar?.updateItem(id, content);
  }

  public async showUpdateModal(): Promise<void> {
    if (this.updateModal) {
      this.updateModal.open();
      return;
    }

    await this.checkForUpdates(true);
    if (this.updateModal) {
      (this.updateModal as UpdateModal).open();
    } else {
      this.toast('คุณกำลังใช้งานเวอร์ชันล่าสุดแล้ว (v' + (this.config.version || '1.0.0') + ')', { type: 'success' });
    }
  }

  public async checkForUpdates(force = false): Promise<void> {
    try {
      const updateInfo = await checkSoftwareUpdate({
        currentVersion: this.config.version || '1.0.0',
        appId: this.config.appId,
        force,
      });

      if (updateInfo.hasUpdate) {
        this.config.update = {
          currentVersion: updateInfo.currentVersion,
          latestVersion: updateInfo.latestVersion,
          releaseDate: updateInfo.releaseDate,
          changelog: updateInfo.changelog,
          downloadUrl: updateInfo.appAsset?.downloadUrl || updateInfo.suiteAsset?.downloadUrl,
          hasUpdate: true,
        };
        this.updateModal = new UpdateModal(this.config.update);
        if (!this.updateBanner) {
          this.updateBanner = new UpdateBanner({
            config: this.config.update,
            onOpenModal: () => this.showUpdateModal(),
          });
          if (this.titleBar && this.titleBar.getElement().nextSibling) {
            this.rootEl.insertBefore(this.updateBanner.getElement(), this.titleBar.getElement().nextSibling);
          } else {
            this.rootEl.appendChild(this.updateBanner.getElement());
          }
        }
      }
    } catch (err) {
      console.warn('[StudioShell] Failed to check for software updates:', err);
    }
  }

  public toast(message: string, options?: ToastOptions): void {
    ToastManager.show(message, options);
  }

  public modal(options: ModalOptions): { close: () => void; element: HTMLElement } {
    return ModalManager.open(options);
  }

  private buildShell(): void {
    // 1. Windows Native Title Bar
    this.titleBar = new TitleBar({
      appName: this.config.appName,
      appIcon: this.config.appIcon,
      appTag: this.config.appTag,
      documentTitle: this.config.documentTitle,
      isTauri: this.config.isTauri,
      showBackButton: this.config.showBackButton,
      onBack: this.config.onBack,
    });
    this.rootEl.appendChild(this.titleBar.getElement());

    // 2. In-App Update Banner (if update is available)
    if (this.config.update && (this.config.update.hasUpdate ?? true)) {
      this.updateBanner = new UpdateBanner({
        config: this.config.update,
        onOpenModal: () => this.showUpdateModal(),
      });
      this.rootEl.appendChild(this.updateBanner.getElement());
    }

    // 3. Acrobat-grade Menu Bar
    if (this.config.menu && this.config.menu.length > 0) {
      this.menuBar = new MenuBar({
        appName: this.config.appName,
        appTag: this.config.appTag,
        groups: this.config.menu,
        onCheckUpdates: () => this.showUpdateModal(),
      });
      this.rootEl.appendChild(this.menuBar.getElement());
    }

    // 4. Command Ribbon
    if (this.config.ribbon && this.config.ribbon.length > 0) {
      this.commandRibbon = new CommandRibbon({
        groups: this.config.ribbon,
      });
      this.rootEl.appendChild(this.commandRibbon.getElement());
    }

    // 5. 3-Pane Cockpit
    this.rootEl.appendChild(this.cockpit.getElement());

    // 6. Bottom Status Bar
    if (this.config.statusBar) {
      this.statusBar = new StatusBar({
        version: this.config.version,
        items: this.config.statusBar.items,
        showPrivacyBadge: this.config.statusBar.showPrivacyBadge ?? true,
      });
      this.rootEl.appendChild(this.statusBar.getElement());
    }
  }
}
