/**
 * @file TitleBar.ts
 * Native Windows 11 Title Bar Simulation & Desktop Frame Controller
 */

export interface TitleBarOptions {
  appName: string;
  appIcon?: string;
  appTag?: string;
  documentTitle?: string;
  isTauri?: boolean;
  showBackButton?: boolean;
  showUpdateBtn?: boolean;
  showAuthBtn?: boolean;
  onUpdate?: () => void;
  onAuth?: () => void;
  onBack?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
}

export class TitleBar {
  private element: HTMLElement;
  private options: TitleBarOptions;

  constructor(options: TitleBarOptions) {
    this.options = options;
    this.element = document.createElement('div');
    this.element.className = 'studio-titlebar';
    this.element.setAttribute('data-tauri-drag-region', 'true');
    this.render();
    this.attachEvents();
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public setDocumentTitle(title: string): void {
    this.options.documentTitle = title;
    const titleEl = this.element.querySelector('.titlebar-doc-name');
    if (titleEl) {
      titleEl.textContent = title ? `— [${title}]` : '';
    }
  }

  private render(): void {
    const { appName, appIcon, appTag, documentTitle, showBackButton, showUpdateBtn, showAuthBtn } = this.options;
    const backBtnHtml = showBackButton !== false
      ? `<button type="button" class="titlebar-btn-back" id="titlebar-btn-back" title="Back to IDE Workspace"><span class="titlebar-back-arrow">‹</span><span>IDE</span></button>`
      : '';
    const iconHtml = appIcon ? `<span class="titlebar-app-icon">${appIcon}</span>` : '🎨';
    const tagHtml = appTag ? `<span class="titlebar-app-tag">${appTag}</span>` : '<span class="titlebar-app-tag">STUDIO</span>';
    const docText = documentTitle ? `— [${documentTitle}]` : '';

    const updateBtnHtml = showUpdateBtn !== false
      ? `<button type="button" class="titlebar-btn titlebar-btn-action" id="titlebar-btn-update" title="Check for Updates (Steam Mode)">⚡</button>`
      : '';
    const authBtnHtml = showAuthBtn !== false
      ? `<button type="button" class="titlebar-btn titlebar-btn-action" id="titlebar-btn-auth" title="Google Account / Sync">👤</button>`
      : '';

    this.element.innerHTML = `
      <div class="titlebar-left" data-tauri-drag-region="true">
        ${backBtnHtml}
        ${iconHtml}
        <span class="titlebar-app-name">${appName}</span>
        ${tagHtml}
        <span class="titlebar-doc-name">${docText}</span>
        <span class="titlebar-native-pill">100% Native Desktop</span>
      </div>
      <div class="titlebar-controls">
        ${updateBtnHtml}
        ${authBtnHtml}
        <button type="button" class="titlebar-btn titlebar-btn-min" id="titlebar-btn-min" title="Minimize">─</button>
        <button type="button" class="titlebar-btn titlebar-btn-max" id="titlebar-btn-max" title="Maximize">□</button>
        <button type="button" class="titlebar-btn titlebar-btn-close" id="titlebar-btn-close" title="Close">✕</button>
      </div>
    `;
  }

  private attachEvents(): void {
    this.element.querySelector('#titlebar-btn-update')?.addEventListener('click', () => {
      if (this.options.onUpdate) this.options.onUpdate();
    });

    this.element.querySelector('#titlebar-btn-auth')?.addEventListener('click', () => {
      if (this.options.onAuth) this.options.onAuth();
    });
    this.element.querySelector('#titlebar-btn-back')?.addEventListener('click', () => {
      if (this.options.onBack) {
        this.options.onBack();
      } else if (typeof window !== 'undefined') {
        window.history.pushState({}, '', './');
        window.location.reload();
      }
    });

    this.element.querySelector('#titlebar-btn-min')?.addEventListener('click', () => {
      if (this.options.onMinimize) {
        this.options.onMinimize();
      } else if (this.options.isTauri) {
        import('@tauri-apps/api/window').then(({ getCurrentWindow }) => {
          getCurrentWindow().minimize();
        }).catch(() => {});
      }
    });

    this.element.querySelector('#titlebar-btn-max')?.addEventListener('click', () => {
      if (this.options.onMaximize) {
        this.options.onMaximize();
      } else if (this.options.isTauri) {
        import('@tauri-apps/api/window').then(({ getCurrentWindow }) => {
          getCurrentWindow().toggleMaximize();
        }).catch(() => {});
      }
    });

    this.element.querySelector('#titlebar-btn-close')?.addEventListener('click', () => {
      if (this.options.onClose) {
        this.options.onClose();
      } else if (this.options.isTauri) {
        import('@tauri-apps/api/window').then(({ getCurrentWindow }) => {
          getCurrentWindow().close();
        }).catch(() => {});
      }
    });
  }
}
