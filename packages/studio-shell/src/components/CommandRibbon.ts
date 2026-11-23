/**
 * @file CommandRibbon.ts
 * Top Action Command Ribbon & Contextual Toolbar
 */

import type { RibbonGroup, RibbonTool } from '../types.js';

export interface CommandRibbonOptions {
  groups: RibbonGroup[];
}

export class CommandRibbon {
  private element: HTMLElement;
  private options: CommandRibbonOptions;

  constructor(options: CommandRibbonOptions) {
    this.options = options;
    this.element = document.createElement('div');
    this.element.className = 'studio-ribbon';
    this.element.setAttribute('role', 'toolbar');
    this.render();
    this.attachEvents();
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public setToolActive(toolId: string, active: boolean): void {
    const btn = this.element.querySelector<HTMLButtonElement>(`[data-tool-id="${toolId}"]`);
    if (btn) {
      if (active) btn.classList.add('active');
      else btn.classList.remove('active');
    }
  }

  public setToolDisabled(toolId: string, disabled: boolean): void {
    const btn = this.element.querySelector<HTMLButtonElement>(`[data-tool-id="${toolId}"]`);
    if (btn) {
      btn.disabled = disabled;
    }
  }

  private render(): void {
    let html = '';
    for (const group of this.options.groups) {
      const alignClass = `ribbon-group-${group.align || 'left'}`;
      html += `<div class="ribbon-group ${alignClass}">`;
      for (const tool of group.tools) {
        html += this.renderTool(tool);
      }
      html += `</div>`;
    }
    this.element.innerHTML = html;
  }

  private renderTool(tool: RibbonTool): string {
    if (tool.type === 'separator') {
      return `<div class="ribbon-separator" role="separator"></div>`;
    }

    if (tool.customHtml) {
      return `<div class="ribbon-custom-tool" data-tool-id="${tool.id}">${tool.customHtml}</div>`;
    }

    if (tool.type === 'select' && tool.options) {
      const opts = tool.options.map(o => `<option value="${o.value}">${o.label}</option>`).join('');
      return `
        <div class="ribbon-select-wrapper" title="${tool.title || ''}">
          <select class="ribbon-select" data-tool-id="${tool.id}" ${tool.disabled ? 'disabled' : ''}>
            ${opts}
          </select>
        </div>
      `;
    }

    const iconHtml = tool.icon ? `<span class="ribbon-tool-icon">${tool.icon}</span>` : '';
    const labelHtml = tool.label ? `<span class="ribbon-tool-label">${tool.label}</span>` : '';
    const activeClass = tool.active ? 'active' : '';
    const disabled = tool.disabled ? 'disabled' : '';

    return `
      <button type="button" class="ribbon-btn ${activeClass}" data-tool-id="${tool.id}" title="${tool.title || ''}" ${disabled ? 'disabled' : ''}>
        ${iconHtml}
        ${labelHtml}
      </button>
    `;
  }

  private attachEvents(): void {
    this.element.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('.ribbon-btn');
      if (btn && !btn.disabled) {
        const toolId = btn.getAttribute('data-tool-id');
        const tool = this.findTool(toolId);
        if (tool && tool.action) {
          tool.action(e);
        }
      }
    });

    this.element.addEventListener('change', (e) => {
      const select = (e.target as HTMLElement).closest<HTMLSelectElement>('.ribbon-select');
      if (select) {
        const toolId = select.getAttribute('data-tool-id');
        const tool = this.findTool(toolId);
        if (tool && tool.onSelect) {
          tool.onSelect(select.value);
        }
      }
    });
  }

  private findTool(toolId: string | null): RibbonTool | undefined {
    if (!toolId) return undefined;
    for (const g of this.options.groups) {
      for (const t of g.tools) {
        if (t.id === toolId) return t;
      }
    }
    return undefined;
  }
}
