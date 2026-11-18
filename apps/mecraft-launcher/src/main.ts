import './styles/launcher.css';
import {
  createLauncherBridge,
  getDefaultCatalog,
  formatBytes,
  formatSpeed,
  type AppCatalogItem,
  type RecentProject,
  type DownloadProgress,
} from '@mecraft/core-bridge';

class MeCraftLauncher {
  private bridge = createLauncherBridge();
  private catalog: AppCatalogItem[] = getDefaultCatalog();
  private recentProjects: RecentProject[] = [];
  private activeFilter = 'all';
  private downloadingApps = new Map<string, DownloadProgress>();
  private activeMenuAppId: string | null = null;
  private currentLang: 'en' | 'th' = 'en';

  private appEl!: HTMLElement;

  constructor() {
    this.appEl = document.getElementById('app')!;
    this.init();
  }

  private async init() {
    this.renderSkeleton();
    await this.refreshStatuses();
    await this.loadRecentProjects();
    this.renderCatalog();
    this.renderRecentProjects();
    this.attachEventListeners();
  }

  private async refreshStatuses() {
    for (const app of this.catalog) {
      if (app.comingSoon || app.inDevelopment) continue;
      const status = await this.bridge.checkAppStatus(app.id);
      if (status.installed) {
        app.status = 'installed';
        app.installedPath = status.exePath;
        app.installedVersion = status.version;
      } else {
        app.status = 'not-installed';
      }
    }
  }

  private async loadRecentProjects() {
    this.recentProjects = await this.bridge.getRecentProjects();
  }

  private renderSkeleton() {
    this.appEl.innerHTML = `
      <header class="launcher-header">
        <div class="launcher-brand">
          <div class="launcher-logo">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
          </div>
          <div class="launcher-title-group">
            <div class="launcher-title">
              meCraft
              <span class="launcher-version-badge">Ecosystem Hub</span>
            </div>
            <div class="launcher-subtitle">The Creative & Document Workstation Ecosystem</div>
          </div>
        </div>

        <div class="launcher-nav-right">
          <div class="network-badge">
            <div class="network-dot"></div>
            <span>Cloud Connected</span>
          </div>
          <button class="btn-header" id="btn-toggle-lang" aria-label="Switch Language (Current: EN)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            <span id="lang-label">TH</span>
          </button>
          <button class="btn-header" id="btn-open-settings" aria-label="Open Settings">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            Settings
          </button>
        </div>
      </header>

      <main class="launcher-content">
        <section>
          <div class="section-header">
            <div class="section-title">
              Apps Catalog
              <span class="section-badge" id="catalog-count">4 Apps</span>
            </div>
          </div>

          <div class="filter-bar" role="tablist" aria-label="Applications filter">
            <button class="filter-tab active" role="tab" aria-selected="true" data-filter="all">All Apps</button>
            <button class="filter-tab" role="tab" aria-selected="false" data-filter="installed">Installed</button>
            <button class="filter-tab" role="tab" aria-selected="false" data-filter="document">Document Tools</button>
            <button class="filter-tab" role="tab" aria-selected="false" data-filter="graphics">Creative & Graphics</button>
          </div>

          <div class="apps-grid" id="apps-grid"></div>
        </section>

        <section>
          <div class="section-header">
            <div class="section-title">
              Universal Recent Projects
              <span class="section-badge" id="recent-count">0 Files</span>
            </div>
            <button class="btn-header" id="btn-clear-recents" aria-label="Clear Recent Projects" style="display: none;">Clear History</button>
          </div>
          <div id="recent-projects-list"></div>
        </section>
      </main>

      <div id="modal-container"></div>
    `;
  }

  private renderCatalog() {
    const grid = document.getElementById('apps-grid');
    if (!grid) return;

    const filtered = this.catalog.filter((app) => {
      if (this.activeFilter === 'installed') return app.status === 'installed';
      if (this.activeFilter === 'document') return app.category === 'document' || app.category === 'writing';
      if (this.activeFilter === 'graphics') return app.category === 'graphics';
      return true;
    });

    grid.innerHTML = filtered.map((app) => this.renderAppCard(app)).join('');
    this.attachCardEvents();
  }

  private renderAppCard(app: AppCatalogItem): string {
    const downloading = this.downloadingApps.get(app.id);

    return `
      <div class="app-card" data-app-id="${app.id}">
        <div class="app-card-glow" style="background: ${app.color};"></div>
        
        <div class="app-card-top">
          <div class="app-card-icon" style="background: linear-gradient(135deg, ${app.color}, rgba(255,255,255,0.1));">
            ${this.getAppIconSvg(app.icon)}
          </div>
          <div class="app-card-headings">
            <div class="app-card-name">
              <span>${app.name}</span>
              <span class="app-card-version">v${app.version}</span>
            </div>
            <div class="app-card-tagline">${app.tagline}</div>
          </div>
        </div>

        <div class="app-card-desc">${app.description}</div>

        <div class="app-card-tags">
          ${app.tags.map((t: string) => `<span class="app-tag">${t}</span>`).join('')}
        </div>

        <div class="app-card-action">
          ${this.renderCardAction(app, downloading)}
        </div>
      </div>
    `;
  }

  private renderCardAction(app: AppCatalogItem, downloading?: DownloadProgress): string {
    if (downloading) {
      const mbDownloaded = (downloading.downloadedBytes / (1024 * 1024)).toFixed(1);
      const mbTotal = (downloading.totalBytes / (1024 * 1024)).toFixed(1);
      const speedStr = downloading.speedFormatted || formatSpeed(downloading.speedBps);

      return `
        <div class="download-progress-box">
          <div class="download-progress-header">
            <span>Installing... ${downloading.percent}%</span>
            <span>${mbDownloaded} MB / ${mbTotal} MB (${speedStr})</span>
          </div>
          <div class="download-progress-track">
            <div class="download-progress-fill" style="width: ${downloading.percent}%;"></div>
          </div>
        </div>
      `;
    }

    if (app.comingSoon) {
      return `
        <button class="btn-action disabled" disabled>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          Coming Soon • Notify Me
        </button>
      `;
    }

    if (app.inDevelopment) {
      return `
        <button class="btn-action disabled" disabled>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
          In Development
        </button>
      `;
    }

    if (app.status === 'installed') {
      const isMenuOpen = this.activeMenuAppId === app.id;
      return `
        <button class="btn-action launch" data-action="launch" data-app-id="${app.id}" aria-label="Launch ${app.name}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          Launch
        </button>
        <button class="btn-more" data-action="more" data-app-id="${app.id}" title="More Options" aria-label="More options for ${app.name}" aria-haspopup="menu" aria-expanded="${isMenuOpen}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
        </button>
        ${
          isMenuOpen
            ? `
          <div class="context-menu" role="menu" aria-label="${app.name} options" data-menu-id="${app.id}">
            <button class="context-menu-item" role="menuitem" data-menu-action="open-folder" data-app-id="${app.id}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
              Open Install Folder
            </button>
            <button class="context-menu-item" role="menuitem" data-menu-action="check-updates" data-app-id="${app.id}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6"></path><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
              Check for Updates
            </button>
            <div style="height: 1px; background: var(--border-subtle); margin: 4px 0;"></div>
            <button class="context-menu-item danger" role="menuitem" data-menu-action="uninstall" data-app-id="${app.id}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              Uninstall App
            </button>
          </div>
        `
            : ''
        }
      `;
    }

    return `
      <button class="btn-action install" data-action="install" data-app-id="${app.id}" aria-label="Install ${app.name} (${app.sizeFormatted || 'v' + app.version})">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        Install (${app.sizeFormatted || 'v' + app.version})
      </button>
    `;
  }

  private renderRecentProjects() {
    const container = document.getElementById('recent-projects-list');
    const badge = document.getElementById('recent-count');
    const clearBtn = document.getElementById('btn-clear-recents');
    if (!container) return;

    if (badge) badge.textContent = `${this.recentProjects.length} Files`;
    if (clearBtn) clearBtn.style.display = this.recentProjects.length > 0 ? 'flex' : 'none';

    if (this.recentProjects.length === 0) {
      container.innerHTML = `
        <div class="empty-recents">
          No recent projects yet. Open documents in mePDF or mePhoto to see them here.
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="recent-projects-list">
        ${this.recentProjects
          .map(
            (p: RecentProject) => `
          <div class="recent-project-card" role="button" tabindex="0" aria-label="Open ${p.name} with ${p.appId.toUpperCase()}" data-recent-id="${p.id}" data-app-id="${p.appId}" data-path="${p.path}">
            <div class="recent-project-icon">
              ${p.appId === 'mepdf' ? this.getAppIconSvg('FileText') : this.getAppIconSvg('Camera')}
            </div>
            <div class="recent-project-info">
              <div class="recent-project-name" title="${p.name} (${p.path})">${p.name}</div>
              <div class="recent-project-meta">
                <span>${p.appId.toUpperCase()}</span>
                <span>•</span>
                <span>${p.sizeBytes ? formatBytes(p.sizeBytes) : 'Document'}</span>
                <span>•</span>
                <span>${new Date(p.lastOpened).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        `
          )
          .join('')}
      </div>
    `;

    container.querySelectorAll('.recent-project-card').forEach((card: Element) => {
      const launch = () => {
        const appId = card.getAttribute('data-app-id');
        const path = card.getAttribute('data-path');
        if (appId && path) {
          this.bridge.launchApp({ appId, filePath: path });
        }
      };
      card.addEventListener('click', launch);
      card.addEventListener('keydown', (e: Event) => {
        const keyEvent = e as KeyboardEvent;
        if (keyEvent.key === 'Enter' || keyEvent.key === ' ') {
          keyEvent.preventDefault();
          launch();
        }
      });
    });
  }

  private attachCardEvents() {
    // Install button
    document.querySelectorAll('[data-action="install"]').forEach((btn: Element) => {
      btn.addEventListener('click', (e: Event) => {
        const appId = (e.currentTarget as HTMLElement).dataset.appId;
        if (appId) this.handleInstall(appId);
      });
    });

    // Launch button
    document.querySelectorAll('[data-action="launch"]').forEach((btn: Element) => {
      btn.addEventListener('click', (e: Event) => {
        const appId = (e.currentTarget as HTMLElement).dataset.appId;
        if (appId) this.handleLaunch(appId);
      });
    });

    // More [...] button
    document.querySelectorAll('[data-action="more"]').forEach((btn: Element) => {
      btn.addEventListener('click', (e: Event) => {
        e.stopPropagation();
        const appId = (e.currentTarget as HTMLElement).dataset.appId;
        this.activeMenuAppId = this.activeMenuAppId === appId ? null : appId || null;
        this.renderCatalog();
      });
    });

    // Context menu actions
    document.querySelectorAll('[data-menu-action]').forEach((item: Element) => {
      item.addEventListener('click', async (e: Event) => {
        e.stopPropagation();
        const target = e.currentTarget as HTMLElement;
        const action = target.dataset.menuAction;
        const appId = target.dataset.appId;
        this.activeMenuAppId = null;

        if (action === 'uninstall' && appId) {
          await this.bridge.uninstallApp(appId);
          await this.refreshStatuses();
          this.renderCatalog();
        } else if (action === 'open-folder' && appId) {
          const dir = await this.bridge.getAppDirectory(appId);
          this.showFolderModal(appId, dir);
        } else if (action === 'check-updates' && appId) {
          const status = await this.bridge.checkAppStatus(appId);
          const app = this.catalog.find((a: AppCatalogItem) => a.id === appId);
          const catalogVersion = app?.version ?? 'unknown';
          const installedVersion = status.version ?? catalogVersion;
          const msg = `${appId.toUpperCase()} — Installed: v${installedVersion} (Latest Catalog Release: v${catalogVersion})`;
          this.showNoticeModal(`Update Check — ${appId.toUpperCase()}`, msg);
        }
      });
    });
  }

  private attachEventListeners() {
    // Filter tabs
    document.querySelectorAll('.filter-tab').forEach((tab: Element) => {
      tab.addEventListener('click', (e: Event) => {
        const target = e.currentTarget as HTMLElement;
        this.activeFilter = target.dataset.filter || 'all';
        document.querySelectorAll('.filter-tab').forEach((t: Element) => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        target.classList.add('active');
        target.setAttribute('aria-selected', 'true');
        this.renderCatalog();
      });
    });

    // Clear Recents
    document.getElementById('btn-clear-recents')?.addEventListener('click', async () => {
      await this.bridge.clearRecentProjects();
      await this.loadRecentProjects();
      this.renderRecentProjects();
    });

    // Settings Modal
    document.getElementById('btn-open-settings')?.addEventListener('click', () => {
      this.showSettingsModal();
    });

    // Language toggle
    document.getElementById('btn-toggle-lang')?.addEventListener('click', () => {
      this.currentLang = this.currentLang === 'en' ? 'th' : 'en';
      const label = document.getElementById('lang-label');
      if (label) label.textContent = this.currentLang === 'en' ? 'TH' : 'EN';
      const toggleBtn = document.getElementById('btn-toggle-lang');
      if (toggleBtn) {
        toggleBtn.setAttribute('aria-label', `Switch Language (Current: ${this.currentLang.toUpperCase()})`);
      }
    });

    // Dismiss context menu on global click
    document.addEventListener('click', () => {
      if (this.activeMenuAppId) {
        this.activeMenuAppId = null;
        this.renderCatalog();
      }
    });
  }

  private async handleInstall(appId: string) {
    const app = this.catalog.find((a: AppCatalogItem) => a.id === appId);
    if (!app) return;

    const releaseUrl = `https://github.com/methastrategy/meCraft/releases/download/v${app.version}/${app.releaseAssetPattern}`;

    this.downloadingApps.set(appId, {
      appId,
      downloadedBytes: 0,
      totalBytes: 50 * 1024 * 1024,
      percent: 0,
      speedBps: 0,
    });
    this.renderCatalog();

    const result = await this.bridge.downloadAndInstallApp(appId, releaseUrl, (progress: DownloadProgress) => {
      this.downloadingApps.set(appId, progress);
      this.renderCatalog();
    });

    this.downloadingApps.delete(appId);

    if (result.success) {
      await this.refreshStatuses();
      this.renderCatalog();
    } else {
      this.showNoticeModal(`Installation Failed — ${appId.toUpperCase()}`, result.error || 'Unknown error during installation', true);
      this.renderCatalog();
    }
  }

  private async handleLaunch(appId: string) {
    const res = await this.bridge.launchApp({ appId });
    if (!res.success) {
      this.showNoticeModal(`Launch Error — ${appId.toUpperCase()}`, res.error || 'Could not launch application binary', true);
    }
  }

  private showNoticeModal(title: string, message: string, isError = false) {
    const container = document.getElementById('modal-container');
    if (!container) return;
    container.innerHTML = `
      <div class="modal-overlay" id="notice-overlay">
        <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="notice-dialog-title" style="max-width: 420px;">
          <div class="modal-header">
            <div class="modal-title" id="notice-dialog-title">${title}</div>
            <button class="btn-more" id="btn-close-notice-modal" aria-label="Close dialog">✕</button>
          </div>
          <div class="modal-body selectable" style="padding: 16px 0; color: ${isError ? '#ef4444' : 'var(--text-primary)'};">
            ${message}
          </div>
          <div class="modal-footer">
            <button class="btn-header" id="btn-notice-done" aria-label="Acknowledge and close">OK</button>
          </div>
        </div>
      </div>
    `;
    const closeNotice = () => { container.innerHTML = ''; };
    document.getElementById('btn-close-notice-modal')?.addEventListener('click', closeNotice);
    document.getElementById('btn-notice-done')?.addEventListener('click', closeNotice);
    document.getElementById('notice-overlay')?.addEventListener('click', (ev: MouseEvent) => {
      if (ev.target === ev.currentTarget) closeNotice();
    });
  }

  private showFolderModal(appId: string, directory: string) {
    const container = document.getElementById('modal-container');
    if (!container) return;
    container.innerHTML = `
      <div class="modal-overlay" id="folder-overlay">
        <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="folder-dialog-title" style="max-width: 480px;">
          <div class="modal-header">
            <div class="modal-title" id="folder-dialog-title">${appId.toUpperCase()} Install Directory</div>
            <button class="btn-more" id="btn-close-folder-modal" aria-label="Close dialog">✕</button>
          </div>
          <div class="modal-body" style="padding: 16px 0;">
            <p style="margin: 0 0 8px 0; font-size: 13px; color: var(--text-secondary);">Installation and binary location:</p>
            <input type="text" readonly value="${directory}" class="selectable" id="folder-path-input" style="width: 100%; padding: 8px 12px; background: var(--surface-base); border: 1px solid var(--border-medium); border-radius: var(--radius-sm); color: var(--text-primary); font-family: var(--font-mono); font-size: 12px;" />
          </div>
          <div class="modal-footer" style="display: flex; justify-content: flex-end; gap: 8px;">
            <button class="btn-header" id="btn-copy-folder" aria-label="Copy folder path to clipboard">Copy Path</button>
            <button class="btn-header" id="btn-folder-done" aria-label="Close dialog">Done</button>
          </div>
        </div>
      </div>
    `;
    const closeFolder = () => { container.innerHTML = ''; };
    document.getElementById('btn-close-folder-modal')?.addEventListener('click', closeFolder);
    document.getElementById('btn-folder-done')?.addEventListener('click', closeFolder);
    document.getElementById('btn-copy-folder')?.addEventListener('click', () => {
      navigator.clipboard?.writeText(directory);
      const copyBtn = document.getElementById('btn-copy-folder');
      if (copyBtn) copyBtn.textContent = 'Copied!';
    });
    document.getElementById('folder-overlay')?.addEventListener('click', (ev: MouseEvent) => {
      if (ev.target === ev.currentTarget) closeFolder();
    });
  }

  private showSettingsModal() {
    const container = document.getElementById('modal-container')!;
    container.innerHTML = `
      <div class="modal-overlay" id="settings-overlay">
        <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="settings-dialog-title">
          <div class="modal-header">
            <div class="modal-title" id="settings-dialog-title">meCraft Launcher Settings</div>
            <button class="btn-more" id="btn-close-modal" aria-label="Close settings dialog">✕</button>
          </div>
          <div class="modal-body">
            <div>
              <label style="display: block; font-weight: 600; margin-bottom: 6px;">Applications Storage Directory</label>
              <input type="text" readonly value="%LOCALAPPDATA%\\meCraft\\apps\\" class="selectable" style="width: 100%; padding: 8px 12px; background: var(--surface-base); border: 1px solid var(--border-medium); border-radius: var(--radius-sm); color: var(--text-primary); font-family: var(--font-mono); font-size: 12px;" />
            </div>
            <div>
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                <input type="checkbox" checked />
                <span>Automatically check for app updates upon launching meCraft Hub</span>
              </label>
            </div>
            <div>
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                <input type="checkbox" checked />
                <span>Hardware Acceleration (Vulkan / DirectX 12)</span>
              </label>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-header" id="btn-modal-done" aria-label="Save settings and close">Done</button>
          </div>
        </div>
      </div>
    `;

    const close = () => {
      container.innerHTML = '';
    };

    document.getElementById('btn-close-modal')?.addEventListener('click', close);
    document.getElementById('btn-modal-done')?.addEventListener('click', close);
    document.getElementById('settings-overlay')?.addEventListener('click', (e: MouseEvent) => {
      if (e.target === e.currentTarget) close();
    });
  }

  private getAppIconSvg(icon: string): string {
    switch (icon) {
      case 'FileText':
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`;
      case 'Camera':
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>`;
      case 'PenTool':
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg>`;
      case 'BookOpen':
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>`;
      default:
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle></svg>`;
    }
  }
}

// Bootstrap
if (typeof document !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    new MeCraftLauncher();
  });
}

export { MeCraftLauncher };
