/**
 * @file MenuBar.ts
 * Acrobat-Grade Studio Menu Bar with Dropdown Submenus & Keyboard Shortcuts
 */

import type { MenuGroup, MenuItem } from '../types.js';

export interface MenuBarOptions {
  appName: string;
  appTag?: string;
  groups: MenuGroup[];
  onCheckUpdates?: () => void;
  onAbout?: () => void;
}

export class MenuBar {
  private element: HTMLElement;
  private options: MenuBarOptions;
  private activeMenuId: string | null = null;
  private shortcutMap: Map<string, () => void> = new Map();

  constructor(options: MenuBarOptions) {
    this.options = options;
    this.element = document.createElement('nav');
    this.element.className = 'studio-menubar';
    this.element.setAttribute('role', 'menubar');
    this.element.setAttribute('aria-label', `${options.appName} Menu`);
    this.buildShortcutMap();
    this.render();
    this.attachEvents();
    this.attachGlobalShortcuts();
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  private buildShortcutMap(): void {
    const scanItems = (items: MenuItem[]) => {
      for (const item of items) {
        if (item.shortcut && item.action) {
          const key = this.normalizeShortcut(item.shortcut);
          this.shortcutMap.set(key, item.action);
        }
        if (item.subItems) {
          scanItems(item.subItems);
        }
      }
    };
    for (const group of this.options.groups) {
      scanItems(group.items);
    }
  }

  private normalizeShortcut(shortcut: string): string {
    return shortcut.toLowerCase().replace(/\s+/g, '').replace('ctrl', 'ctrl');
  }

  private render(): void {
    const { appName, appTag, groups } = this.options;
    const tag = appTag || 'PRO';

    let html = `
      <div class="menubar-brand">
        <span class="menubar-brand-name">${appName}</span>
        <span class="menubar-brand-badge">${tag}</span>
      </div>
      <div class="menubar-items" role="none">
    `;

    for (const group of groups) {
      const isOpen = this.activeMenuId === group.id;
      html += `
        <div class="menubar-item-wrapper ${isOpen ? 'open' : ''}" data-menu-id="${group.id}">
          <button type="button" class="menubar-btn ${isOpen ? 'active' : ''}" role="menuitem" aria-haspopup="true" aria-expanded="${isOpen}">
            ${group.label}
          </button>
          ${isOpen ? this.renderDropdown(group) : ''}
        </div>
      `;
    }

    html += `</div>`;
    this.element.innerHTML = html;
  }

  private renderDropdown(group: MenuGroup): string {
    let html = `<div class="menubar-dropdown" role="menu" aria-label="${group.label} submenu">`;

    for (const item of group.items) {
      if (item.divider) {
        html += `<div class="menubar-divider" role="separator"></div>`;
        continue;
      }

      const disabled = item.disabled ? 'disabled' : '';
      const badge = item.badge ? `<span class="menubar-item-badge">${item.badge}</span>` : '';
      const shortcut = item.shortcut ? `<span class="menubar-item-shortcut">${item.shortcut}</span>` : '';

      html += `
        <button type="button" class="menubar-dropdown-item ${disabled}" data-item-id="${item.id}" role="menuitem" ${disabled ? 'disabled' : ''}>
          <span class="menubar-item-label">${item.label}</span>
          ${badge}
          ${shortcut}
        </button>
      `;
    }

    html += `</div>`;
    return html;
  }

  private attachEvents(): void {
    this.element.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const btn = target.closest<HTMLButtonElement>('.menubar-btn');
      if (btn) {
        e.stopPropagation();
        const wrapper = btn.closest<HTMLElement>('.menubar-item-wrapper');
        const menuId = wrapper?.getAttribute('data-menu-id');
        if (menuId) {
          this.activeMenuId = this.activeMenuId === menuId ? null : menuId;
          this.render();
          return;
        }
      }

      const itemBtn = target.closest<HTMLButtonElement>('.menubar-dropdown-item');
      if (itemBtn && !itemBtn.disabled) {
        e.stopPropagation();
        const itemId = itemBtn.getAttribute('data-item-id');
        this.executeItemAction(itemId);
        this.activeMenuId = null;
        this.render();
      }
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (this.activeMenuId && !this.element.contains(e.target as Node)) {
        this.activeMenuId = null;
        this.render();
      }
    });

    // Hover navigation across menus when one is open
    this.element.addEventListener('mouseover', (e) => {
      if (!this.activeMenuId) return;
      const target = e.target as HTMLElement;
      const wrapper = target.closest<HTMLElement>('.menubar-item-wrapper');
      const menuId = wrapper?.getAttribute('data-menu-id');
      if (menuId && menuId !== this.activeMenuId) {
        this.activeMenuId = menuId;
        this.render();
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeMenuId) {
        this.activeMenuId = null;
        this.render();
      }
    });
  }

  private executeItemAction(itemId: string | null): void {
    if (!itemId) return;
    for (const group of this.options.groups) {
      for (const item of group.items) {
        if (item.id === itemId && item.action) {
          item.action();
          return;
        }
      }
    }
  }

  private attachGlobalShortcuts(): void {
    window.addEventListener('keydown', (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      const keyCombo = `ctrl+${e.key.toLowerCase()}`;
      const action = this.shortcutMap.get(keyCombo);
      if (action) {
        e.preventDefault();
        action();
      }
    });
  }
}
