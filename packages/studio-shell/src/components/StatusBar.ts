/**
 * @file StatusBar.ts
 * Studio Bottom Status Bar with Offline Privacy Badge & Telemetry
 */

import type { StatusBarItem } from '../types.js';

export interface StatusBarOptions {
  version: string;
  items?: StatusBarItem[];
  showPrivacyBadge?: boolean;
}

export class StatusBar {
  private element: HTMLElement;
  private options: StatusBarOptions;

  constructor(options: StatusBarOptions) {
    this.options = {
      showPrivacyBadge: true,
      ...options,
    };
    this.element = document.createElement('footer');
    this.element.className = 'studio-statusbar';
    this.element.setAttribute('role', 'contentinfo');
    this.render();
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public updateItem(id: string, content: string | HTMLElement): void {
    const el = this.element.querySelector(`[data-status-id="${id}"]`);
    if (el) {
      if (typeof content === 'string') el.innerHTML = content;
      else {
        el.innerHTML = '';
        el.appendChild(content);
      }
    }
  }

  private render(): void {
    const items = this.options.items || [];
    const leftItems = items.filter(i => (i.align || 'left') === 'left');
    const centerItems = items.filter(i => i.align === 'center');
    const rightItems = items.filter(i => i.align === 'right');

    this.element.innerHTML = `
      <div class="statusbar-section statusbar-left">
        ${this.renderItems(leftItems)}
      </div>
      <div class="statusbar-section statusbar-center">
        ${this.renderItems(centerItems)}
      </div>
      <div class="statusbar-section statusbar-right">
        ${this.renderItems(rightItems)}
        ${this.options.showPrivacyBadge ? `
          <div class="statusbar-privacy-badge" title="Zero cloud uploads, 100% client-side memory safety">
            <span class="privacy-dot"></span>
            <span>100% In-Device Privacy</span>
          </div>
        ` : ''}
        <span class="statusbar-version">v${this.options.version}</span>
      </div>
    `;

    // Attach click handlers
    items.forEach(item => {
      if (item.onClick) {
        this.element.querySelector(`[data-status-id="${item.id}"]`)?.addEventListener('click', item.onClick);
      }
    });
  }

  private renderItems(items: StatusBarItem[]): string {
    return items.map(i => {
      const isClickable = i.onClick ? 'clickable' : '';
      const text = typeof i.content === 'string' ? i.content : '';
      return `<div class="statusbar-item ${isClickable}" data-status-id="${i.id}" title="${i.title || ''}">${text}</div>`;
    }).join('');
  }
}
