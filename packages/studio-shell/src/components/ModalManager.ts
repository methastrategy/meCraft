/**
 * @file ModalManager.ts
 * Universal Modal Dialog Stack Manager
 */

import type { ModalOptions } from '../types.js';

export class ModalManager {
  public static open(options: ModalOptions): { close: () => void; element: HTMLElement } {
    const { title, body, footer, size = 'md', closable = true, onClose } = options;

    const overlay = document.createElement('div');
    overlay.className = `studio-modal-overlay modal-${size}`;

    const backdrop = document.createElement('div');
    backdrop.className = 'studio-modal-backdrop';

    const dialog = document.createElement('div');
    dialog.className = 'studio-modal-dialog';
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');

    const header = document.createElement('div');
    header.className = 'modal-header';
    header.innerHTML = `
      <h2 class="modal-title">${title}</h2>
      ${closable ? `<button type="button" class="modal-close-btn" aria-label="Close">✕</button>` : ''}
    `;

    const bodyEl = document.createElement('div');
    bodyEl.className = 'modal-body';
    if (typeof body === 'string') {
      bodyEl.innerHTML = body;
    } else {
      bodyEl.appendChild(body);
    }

    dialog.appendChild(header);
    dialog.appendChild(bodyEl);

    if (footer) {
      const footerEl = document.createElement('div');
      footerEl.className = 'modal-footer';
      if (typeof footer === 'string') {
        footerEl.innerHTML = footer;
      } else {
        footerEl.appendChild(footer);
      }
      dialog.appendChild(footerEl);
    }

    overlay.appendChild(backdrop);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    requestAnimationFrame(() => overlay.classList.add('active'));

    const close = () => {
      overlay.classList.remove('active');
      setTimeout(() => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
        if (onClose) onClose();
      }, 200);
    };

    if (closable) {
      header.querySelector('.modal-close-btn')?.addEventListener('click', close);
      backdrop.addEventListener('click', close);
    }

    return { close, element: overlay };
  }
}
