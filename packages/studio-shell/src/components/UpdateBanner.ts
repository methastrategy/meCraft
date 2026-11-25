/**
 * @file UpdateBanner.ts
 * In-App One-Click Auto-Update Notification Banner (AGY-style)
 */

import type { UpdateConfig } from '../types.js';

export interface UpdateBannerOptions {
  config: UpdateConfig;
  onOpenModal: () => void;
  onDismiss?: () => void;
}

export class UpdateBanner {
  private element: HTMLElement;
  private options: UpdateBannerOptions;
  private isVisible = true;

  constructor(options: UpdateBannerOptions) {
    this.options = options;
    this.element = document.createElement('div');
    this.element.className = 'studio-update-banner';
    this.element.setAttribute('role', 'alert');
    this.render();
    this.attachEvents();
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public getVisible(): boolean {
    return this.isVisible;
  }

  public show(): void {
    this.isVisible = true;
    this.element.style.display = 'flex';
  }

  public hide(): void {
    this.isVisible = false;
    this.element.style.display = 'none';
  }

  private render(): void {
    const { latestVersion } = this.options.config;
    this.element.innerHTML = `
      <div class="update-banner-content">
        <span class="update-banner-badge">UPDATE</span>
        <span class="update-banner-text">
          🎉 มีการอัปเดตเวอร์ชันใหม่ <strong>v${latestVersion}</strong> พร้อมติดตั้งในคลิกเดียว
        </span>
      </div>
      <div class="update-banner-actions">
        <button type="button" class="btn-update-action" id="btn-banner-update">
          <span>⚡ อัปเดตทันที (Update Now)</span>
        </button>
        <button type="button" class="btn-update-dismiss" id="btn-banner-dismiss" title="ปิด">✕</button>
      </div>
    `;
  }

  private attachEvents(): void {
    this.element.querySelector('#btn-banner-update')?.addEventListener('click', () => {
      this.options.onOpenModal();
    });

    this.element.querySelector('#btn-banner-dismiss')?.addEventListener('click', () => {
      this.hide();
      if (this.options.onDismiss) this.options.onDismiss();
    });
  }
}
