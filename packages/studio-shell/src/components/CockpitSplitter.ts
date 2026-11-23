/**
 * @file CockpitSplitter.ts
 * Draggable Splitter Divider with Collapse & Expand Controls
 */

export interface SplitterOptions {
  orientation: 'left' | 'right';
  targetPane: HTMLElement;
  initialWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  onResize?: (width: number) => void;
  onToggleCollapse?: (collapsed: boolean) => void;
}

export class CockpitSplitter {
  private element: HTMLElement;
  private options: SplitterOptions;
  private isDragging = false;
  private startX = 0;
  private startWidth = 0;

  constructor(options: SplitterOptions) {
    this.options = {
      initialWidth: 260,
      minWidth: 160,
      maxWidth: 520,
      ...options,
    };
    this.element = document.createElement('div');
    this.element.className = `cockpit-splitter splitter-${options.orientation}`;
    this.element.innerHTML = `
      <div class="splitter-line"></div>
      <button type="button" class="splitter-collapse-btn" title="Toggle Panel">
        ${options.orientation === 'left' ? '◀' : '▶'}
      </button>
    `;
    this.attachEvents();
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  private attachEvents(): void {
    const collapseBtn = this.element.querySelector('.splitter-collapse-btn');
    collapseBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      const pane = this.options.targetPane;
      const isCollapsed = pane.classList.toggle('collapsed');
      const arrow = this.options.orientation === 'left' 
        ? (isCollapsed ? '▶' : '◀') 
        : (isCollapsed ? '◀' : '▶');
      collapseBtn.textContent = arrow;
      if (this.options.onToggleCollapse) {
        this.options.onToggleCollapse(isCollapsed);
      }
    });

    this.element.addEventListener('mousedown', (e) => {
      if ((e.target as HTMLElement).closest('.splitter-collapse-btn')) return;
      this.isDragging = true;
      this.startX = e.clientX;
      this.startWidth = this.options.targetPane.getBoundingClientRect().width;
      document.body.classList.add('studio-resizing');
      e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const delta = this.options.orientation === 'left' ? e.clientX - this.startX : this.startX - e.clientX;
      let newWidth = this.startWidth + delta;
      newWidth = Math.max(this.options.minWidth || 160, Math.min(newWidth, this.options.maxWidth || 520));

      this.options.targetPane.style.width = `${newWidth}px`;
      if (this.options.onResize) {
        this.options.onResize(newWidth);
      }
    });

    window.addEventListener('mouseup', () => {
      if (this.isDragging) {
        this.isDragging = false;
        document.body.classList.remove('studio-resizing');
      }
    });
  }
}
