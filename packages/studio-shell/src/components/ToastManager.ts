/**
 * @file ToastManager.ts
 * Lightweight Non-Blocking Toast Notification System
 */

import type { ToastOptions } from '../types.js';

export class ToastManager {
  private static container: HTMLElement | null = null;

  public static show(message: string, options: ToastOptions = {}): void {
    const { type = 'info', durationMs = 3500 } = options;
    const container = this.getContainer();

    const toast = document.createElement('div');
    toast.className = `studio-toast toast-${type}`;
    const icon = type === 'success' ? '✓' : (type === 'error' ? '✕' : (type === 'warning' ? '⚠️' : 'ℹ️'));
    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-message">${message}</span>
      <button type="button" class="toast-close" aria-label="Dismiss">✕</button>
    `;

    toast.querySelector('.toast-close')?.addEventListener('click', () => {
      this.dismiss(toast);
    });

    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('visible'));

    if (durationMs > 0) {
      setTimeout(() => {
        this.dismiss(toast);
      }, durationMs);
    }
  }

  private static dismiss(toast: HTMLElement): void {
    toast.classList.remove('visible');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 250);
  }

  private static getContainer(): HTMLElement {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'studio-toast-container';
      document.body.appendChild(this.container);
    }
    return this.container;
  }
}
