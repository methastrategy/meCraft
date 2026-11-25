/**
 * @file Cockpit.ts
 * 3-Pane Cockpit Layout Manager (Left Drawer, Center Stage, Right Drawer)
 */

import type { PaneConfig, CenterPaneConfig } from '../types.js';
import { CockpitSplitter } from './CockpitSplitter.js';

export interface CockpitOptions {
  left?: PaneConfig;
  center: CenterPaneConfig;
  right?: PaneConfig;
}

export class Cockpit {
  private element: HTMLElement;
  private options: CockpitOptions;
  private leftPaneEl: HTMLElement | null = null;
  private centerPaneEl: HTMLElement;
  private rightPaneEl: HTMLElement | null = null;

  constructor(options: CockpitOptions) {
    this.options = options;
    this.element = document.createElement('div');
    this.element.className = 'studio-cockpit';
    this.centerPaneEl = document.createElement('div');
    this.centerPaneEl.className = 'cockpit-center-stage';
    this.render();
    this.attachDropZone();
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public getCenterStage(): HTMLElement {
    return this.centerPaneEl;
  }

  public getLeftPane(): HTMLElement | null {
    return this.leftPaneEl;
  }

  public getRightPane(): HTMLElement | null {
    return this.rightPaneEl;
  }

  public toggleLeft(): void {
    if (this.leftPaneEl) {
      this.leftPaneEl.classList.toggle('collapsed');
      if (this.options.left?.onCollapseChange) {
        this.options.left.onCollapseChange(this.leftPaneEl.classList.contains('collapsed'));
      }
    }
  }

  public toggleRight(): void {
    if (this.rightPaneEl) {
      this.rightPaneEl.classList.toggle('collapsed');
      if (this.options.right?.onCollapseChange) {
        this.options.right.onCollapseChange(this.rightPaneEl.classList.contains('collapsed'));
      }
    }
  }

  public setCenterContent(content: HTMLElement | string): void {
    if (typeof content === 'string') {
      this.centerPaneEl.innerHTML = content;
    } else {
      this.centerPaneEl.innerHTML = '';
      this.centerPaneEl.appendChild(content);
    }
  }

  private render(): void {
    this.element.innerHTML = '';

    // 1. Left Drawer (if configured)
    if (this.options.left) {
      this.leftPaneEl = this.buildPaneElement('left', this.options.left);
      this.element.appendChild(this.leftPaneEl);

      const splitter = new CockpitSplitter({
        orientation: 'left',
        targetPane: this.leftPaneEl,
        initialWidth: this.options.left.initialWidth || 260,
        minWidth: this.options.left.minWidth || 160,
        maxWidth: this.options.left.maxWidth || 520,
        onToggleCollapse: this.options.left.onCollapseChange,
      });
      this.element.appendChild(splitter.getElement());
    }

    // 2. Center Stage
    this.renderCenterStage();
    this.element.appendChild(this.centerPaneEl);

    // 3. Right Drawer (if configured)
    if (this.options.right) {
      this.rightPaneEl = this.buildPaneElement('right', this.options.right);

      const splitter = new CockpitSplitter({
        orientation: 'right',
        targetPane: this.rightPaneEl,
        initialWidth: this.options.right.initialWidth || 300,
        minWidth: this.options.right.minWidth || 200,
        maxWidth: this.options.right.maxWidth || 600,
        onToggleCollapse: this.options.right.onCollapseChange,
      });
      this.element.appendChild(splitter.getElement());
      this.element.appendChild(this.rightPaneEl);
    }
  }

  private buildPaneElement(side: 'left' | 'right', config: PaneConfig): HTMLElement {
    const pane = document.createElement('aside');
    pane.className = `cockpit-pane cockpit-pane-${side} ${config.collapsed ? 'collapsed' : ''}`;
    if (config.initialWidth) {
      pane.style.width = `${config.initialWidth}px`;
    }

    const header = document.createElement('div');
    header.className = 'pane-header';

    const iconHtml = config.icon ? `<span class="pane-icon">${config.icon}</span>` : '';
    header.innerHTML = `
      <div class="pane-header-title">
        ${iconHtml}
        <span>${config.title}</span>
      </div>
    `;

    // Tabs if specified
    if (config.tabs && config.tabs.length > 0) {
      const tabsEl = document.createElement('div');
      tabsEl.className = 'pane-tabs';
      for (const tab of config.tabs) {
        const isActive = (config.activeTabId || config.tabs[0]?.id || '') === tab.id;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `pane-tab-btn ${isActive ? 'active' : ''}`;
        btn.setAttribute('data-tab-id', tab.id);
        btn.innerHTML = `${tab.icon ? `<span class="tab-icon">${tab.icon}</span>` : ''}<span>${tab.label}</span>`;
        btn.addEventListener('click', () => {
          tabsEl.querySelectorAll('.pane-tab-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          if (config.onTabChange) config.onTabChange(tab.id);
        });
        tabsEl.appendChild(btn);
      }
      header.appendChild(tabsEl);
    }

    pane.appendChild(header);

    const body = document.createElement('div');
    body.className = 'pane-body';
    if (config.content) {
      if (typeof config.content === 'function') {
        const res = config.content();
        if (typeof res === 'string') body.innerHTML = res;
        else body.appendChild(res);
      } else if (typeof config.content === 'string') {
        body.innerHTML = config.content;
      } else {
        body.appendChild(config.content);
      }
    }
    pane.appendChild(body);

    return pane;
  }

  private renderCenterStage(): void {
    const { content, emptyPlaceholder } = this.options.center;
    if (content) {
      if (typeof content === 'function') {
        const res = content();
        if (typeof res === 'string') this.centerPaneEl.innerHTML = res;
        else {
          this.centerPaneEl.innerHTML = '';
          this.centerPaneEl.appendChild(res);
        }
      } else if (typeof content === 'string') {
        this.centerPaneEl.innerHTML = content;
      } else {
        this.centerPaneEl.innerHTML = '';
        this.centerPaneEl.appendChild(content);
      }
    } else if (emptyPlaceholder) {
      this.centerPaneEl.innerHTML = `
        <div class="cockpit-empty-state">
          <div class="empty-state-icon">${emptyPlaceholder.icon || '📂'}</div>
          <h2 class="empty-state-title">${emptyPlaceholder.title}</h2>
          <p class="empty-state-subtitle">${emptyPlaceholder.subtitle}</p>
          ${emptyPlaceholder.actionLabel ? `
            <button type="button" class="btn btn-primary btn-empty-action" id="btn-empty-action">
              ${emptyPlaceholder.actionLabel}
            </button>
          ` : ''}
        </div>
      `;
      if (emptyPlaceholder.onAction) {
        this.centerPaneEl.querySelector('#btn-empty-action')?.addEventListener('click', emptyPlaceholder.onAction);
      }
    }
  }

  private attachDropZone(): void {
    if (!this.options.center.onDropFiles) return;

    this.centerPaneEl.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.centerPaneEl.classList.add('drag-over');
    });

    this.centerPaneEl.addEventListener('dragleave', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.centerPaneEl.classList.remove('drag-over');
    });

    this.centerPaneEl.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.centerPaneEl.classList.remove('drag-over');
      if (e.dataTransfer && e.dataTransfer.files.length > 0) {
        const files = Array.from(e.dataTransfer.files);
        this.options.center.onDropFiles!(files);
      }
    });
  }
}
