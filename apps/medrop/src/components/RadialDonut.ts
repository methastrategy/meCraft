/**
 * @file RadialDonut.ts
 * Precision SVG Radial Donut Menu Component for meDrop
 */

import type { RadialWedgeAction, DraggedFileInfo } from '../types/radial-types.js';
import { formatBytes } from '../engines/ContextFilter.js';

export interface RadialDonutCallbacks {
  onWedgeSelected: (action: RadialWedgeAction, fileInfo: DraggedFileInfo) => void;
  onHoverChange?: (action: RadialWedgeAction | null) => void;
}

export class RadialDonut {
  private container: HTMLElement;
  private fileInfo: DraggedFileInfo;
  private wedges: RadialWedgeAction[];
  private callbacks: RadialDonutCallbacks;

  private svgEl!: SVGSVGElement;
  private centerHubEl!: HTMLElement;
  private tooltipEl!: HTMLElement;
  private progressCircle!: SVGCircleElement;
  private activeHoverIndex: number | null = null;

  // Geometry
  private readonly cx = 150;
  private readonly cy = 150;
  private readonly outerR = 142;
  private readonly innerR = 56;

  constructor(
    parent: HTMLElement,
    fileInfo: DraggedFileInfo,
    wedges: RadialWedgeAction[],
    callbacks: RadialDonutCallbacks
  ) {
    this.container = parent;
    this.fileInfo = fileInfo;
    this.wedges = wedges;
    this.callbacks = callbacks;
    this.render();
    this.attachEvents();
  }

  public render(): void {
    this.container.innerHTML = '';

    const rootWrapper = document.createElement('div');
    rootWrapper.className = 'radial-container';

    // 1. SVG Donut Mesh
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 300 300');
    svg.setAttribute('class', 'radial-svg');
    this.svgEl = svg;

    const N = this.wedges.length;
    const sliceAngle = (2 * Math.PI) / N;
    const gapAngle = N > 1 ? 0.04 : 0;

    this.wedges.forEach((wedge, i) => {
      const startAngle = i * sliceAngle + gapAngle / 2 - Math.PI / 2;
      const endAngle = (i + 1) * sliceAngle - gapAngle / 2 - Math.PI / 2;

      // Arc path
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const d = this.calculateDonutSlicePath(startAngle, endAngle);
      path.setAttribute('d', d);
      path.setAttribute('class', 'radial-wedge');
      path.setAttribute('data-wedge-index', String(i));
      path.setAttribute('data-wedge-id', wedge.id);
      path.style.setProperty('--wedge-glow', wedge.accentColor);

      svg.appendChild(path);

      // Label Group
      const midAngle = (startAngle + endAngle) / 2;
      const midR = (this.outerR + this.innerR) / 2;
      const lx = this.cx + midR * Math.cos(midAngle);
      const ly = this.cy + midR * Math.sin(midAngle);

      const labelGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      labelGroup.setAttribute('class', 'radial-label-group');

      // Icon
      const icon = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      icon.setAttribute('x', String(lx));
      icon.setAttribute('y', String(ly - 8));
      icon.setAttribute('class', 'radial-label-icon');
      icon.textContent = wedge.icon;
      labelGroup.appendChild(icon);

      // Main Label
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', String(lx));
      label.setAttribute('y', String(ly + 8));
      label.setAttribute('class', 'radial-label-text');
      label.textContent = wedge.label;
      labelGroup.appendChild(label);

      // Sublabel
      if (wedge.sublabel) {
        const sub = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        sub.setAttribute('x', String(lx));
        sub.setAttribute('y', String(ly + 19));
        sub.setAttribute('class', 'radial-label-sub');
        sub.textContent = wedge.sublabel;
        labelGroup.appendChild(sub);
      }

      svg.appendChild(labelGroup);
    });

    rootWrapper.appendChild(svg);

    // 2. Progress Ring Overlay
    const progressSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    progressSvg.setAttribute('class', 'progress-ring');
    progressSvg.setAttribute('viewBox', '0 0 108 108');
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('class', 'progress-ring-circle');
    circle.setAttribute('cx', '54');
    circle.setAttribute('cy', '54');
    circle.setAttribute('r', '50');
    progressSvg.appendChild(circle);
    this.progressCircle = circle;
    rootWrapper.appendChild(progressSvg);

    // 3. Center Hub
    const hub = document.createElement('div');
    hub.className = 'radial-center-hub';
    const ext = this.fileInfo.extension ? `.${this.fileInfo.extension}` : 'FILE';
    hub.innerHTML = `
      <span class="hub-ext-pill">${ext}</span>
      <span class="hub-filename" title="${this.fileInfo.name}">${this.fileInfo.name}</span>
      <span class="hub-filesize">${formatBytes(this.fileInfo.sizeBytes)}</span>
    `;
    this.centerHubEl = hub;
    rootWrapper.appendChild(hub);

    // 4. Floating Tooltip Strip
    const tooltip = document.createElement('div');
    tooltip.className = 'radial-tooltip-strip';
    tooltip.style.display = 'none';
    this.tooltipEl = tooltip;
    rootWrapper.appendChild(tooltip);

    this.container.appendChild(rootWrapper);
  }

  private calculateDonutSlicePath(startAngle: number, endAngle: number): string {
    const x1 = this.cx + this.outerR * Math.cos(startAngle);
    const y1 = this.cy + this.outerR * Math.sin(startAngle);

    const x2 = this.cx + this.outerR * Math.cos(endAngle);
    const y2 = this.cy + this.outerR * Math.sin(endAngle);

    const x3 = this.cx + this.innerR * Math.cos(endAngle);
    const y3 = this.cy + this.innerR * Math.sin(endAngle);

    const x4 = this.cx + this.innerR * Math.cos(startAngle);
    const y4 = this.cy + this.innerR * Math.sin(startAngle);

    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

    return `
      M ${x1.toFixed(2)} ${y1.toFixed(2)}
      A ${this.outerR} ${this.outerR} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}
      L ${x3.toFixed(2)} ${y3.toFixed(2)}
      A ${this.innerR} ${this.innerR} 0 ${largeArc} 0 ${x4.toFixed(2)} ${y4.toFixed(2)}
      Z
    `.trim();
  }

  private attachEvents(): void {
    // 1. Mouse movement tracking over the radial donut
    this.svgEl.addEventListener('mousemove', (e) => {
      const rect = this.svgEl.getBoundingClientRect();
      const mx = e.clientX - rect.left - this.cx;
      const my = e.clientY - rect.top - this.cy;

      const dist = Math.hypot(mx, my);
      if (dist >= this.innerR && dist <= this.outerR + 10) {
        // Calculate angle normalized to [0, 2*PI] with 12 o'clock offset
        let angle = Math.atan2(my, mx) + Math.PI / 2;
        if (angle < 0) angle += 2 * Math.PI;

        const sliceAngle = (2 * Math.PI) / this.wedges.length;
        const idx = Math.min(this.wedges.length - 1, Math.floor(angle / sliceAngle));
        this.setHoverWedge(idx);
      } else {
        this.setHoverWedge(null);
      }
    });

    this.svgEl.addEventListener('mouseleave', () => {
      this.setHoverWedge(null);
    });

    // 2. Click on slice
    this.svgEl.addEventListener('click', (e) => {
      const target = (e.target as Element).closest<SVGPathElement>('.radial-wedge');
      if (target) {
        const idxStr = target.getAttribute('data-wedge-index');
        if (idxStr !== null) {
          const idx = parseInt(idxStr, 10);
          this.triggerWedge(idx);
        }
      } else if (this.activeHoverIndex !== null) {
        this.triggerWedge(this.activeHoverIndex);
      }
    });

    // 3. Native drag and drop support
    this.container.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });

    this.container.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (this.activeHoverIndex !== null) {
        this.triggerWedge(this.activeHoverIndex);
      }
    });
  }

  public setHoverWedge(index: number | null): void {
    if (this.activeHoverIndex === index) return;
    this.activeHoverIndex = index;

    const paths = this.svgEl.querySelectorAll('.radial-wedge');
    paths.forEach((p, i) => {
      p.classList.toggle('active-hover', i === index);
    });

    if (index !== null && this.wedges[index]) {
      const wedge = this.wedges[index];
      this.tooltipEl.style.display = 'block';
      this.tooltipEl.textContent = `${wedge.label}: ${wedge.tooltipDesc || wedge.sublabel || ''}`;
      if (this.callbacks.onHoverChange) this.callbacks.onHoverChange(wedge);
    } else {
      this.tooltipEl.style.display = 'none';
      if (this.callbacks.onHoverChange) this.callbacks.onHoverChange(null);
    }
  }

  public triggerWedge(index: number): void {
    if (index < 0 || index >= this.wedges.length) return;
    const wedge = this.wedges[index];
    this.callbacks.onWedgeSelected(wedge, this.fileInfo);
  }

  public setProgress(percent: number): void {
    const circumference = 326;
    const offset = circumference - (percent / 100) * circumference;
    this.progressCircle.style.strokeDashoffset = String(offset);
  }

  public getElement(): HTMLElement {
    return this.container;
  }
}
