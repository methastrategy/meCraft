import fs from 'node:fs';
import path from 'node:path';

const mainTsPath = path.resolve('apps/mecraft-launcher/src/main.ts');
let content = fs.readFileSync(mainTsPath, 'utf8');

// 1. Add selectedDetailApp and isDetailModalOpen to MeCraftsPortal class
const classPropTarget = `  public forceDesktopMode: boolean | null = null;
  public desktopView: 'workbench' | 'studios' | 'recents' | 'vault' = 'workbench';`;

const classPropReplacement = `  public forceDesktopMode: boolean | null = null;
  public desktopView: 'workbench' | 'studios' | 'recents' | 'vault' = 'workbench';
  private selectedDetailApp: ShowcaseApp | null = null;
  private isDetailModalOpen = false;`;

content = content.replace(classPropTarget, () => classPropReplacement);

// 2. Add renderStudioDetailModal() in render()
const renderTargetWeb = `        \${this.renderDownloadsModal()}
        \${this.renderUpdateModal()}
      \`;
    }`;

const renderReplacementWeb = `        \${this.renderDownloadsModal()}
        \${this.renderUpdateModal()}
        \${this.renderStudioDetailModal()}
      \`;
    }`;

content = content.replace(renderTargetWeb, () => renderReplacementWeb);

const renderTargetDesktop = `      <div class="workstation-container" id="workstation-container">
        \${this.renderSidebar()}
        <main class="ws-main-viewport" id="ws-main-viewport" role="main">
          \${this.renderDesktopView()}
        </main>
      </div>
      \${this.renderAuthModal()}
      \${this.renderUserProfileModal()}
      \${this.renderDownloadsModal()}
      \${this.renderUpdateModal()}`;

const renderReplacementDesktop = `      <div class="workstation-container" id="workstation-container">
        \${this.renderSidebar()}
        <main class="ws-main-viewport" id="ws-main-viewport" role="main">
          \${this.renderDesktopView()}
        </main>
      </div>
      \${this.renderAuthModal()}
      \${this.renderUserProfileModal()}
      \${this.renderDownloadsModal()}
      \${this.renderUpdateModal()}
      \${this.renderStudioDetailModal()}`;

content = content.replace(renderTargetDesktop, () => renderReplacementDesktop);

// 3. Update renderSidebar nav items
const sidebarTarget = `{ id: 'studios', icon: '📦', label: isTh ? 'สตูดิโอ (11)' : 'All Studios (11)', desc: isTh ? 'คลังโปรแกรม' : '11 Studios' },`;
const sidebarReplacement = `{ id: 'studios', icon: '📦', label: isTh ? \`สตูดิโอ (\${SHOWCASE_APPS.length})\` : \`All Studios (\${SHOWCASE_APPS.length})\`, desc: isTh ? 'คลังโปรแกรม' : \`\${SHOWCASE_APPS.length} Studios\` },`;
content = content.replace(sidebarTarget, () => sidebarReplacement);

// 4. Update renderWorkbenchView
const workbenchTarget = `  private renderWorkbenchView(): string {
    const isTh = this.lang === 'th';
    const primaryStudios = SHOWCASE_APPS.filter(a => ['mepdf', 'mephoto', 'medoc', 'medrop'].includes(a.id));

    return \`
    <div class="ws-view ws-view-workbench">
      <header class="ws-view-header">
        <div class="ws-view-eyebrow">NATIVE WINDOWS WORKSTATION · 100% IN-DEVICE RAM</div>
        <h1 class="ws-view-title">\${isTh ? 'ศูนย์กลางเครื่องมือสร้างสรรค์และเอกสาร' : 'Creative & Document Workstation'}</h1>
        <p class="ws-view-subtitle">\${isTh ? 'ลากไฟล์มาวางด้านล่างเพื่อเริ่มงานทันที หรือเลือกเปิดสตูดิโอที่ต้องการ' : 'Drop any file below for instant in-device processing or launch your studios.'}</p>
      </header>

      <!-- Universal Interactive Dropzone -->
      <section class="ws-dropzone-section">
        <div class="ws-dropzone" id="ws-universal-dropzone" role="region" aria-label="File dropzone">
          <input type="file" id="ws-file-input" style="display:none;" />
          <div class="ws-dropzone-icon" aria-hidden="true">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          <div class="ws-dropzone-text">
            <h3 class="ws-dropzone-title">\${this.t.dropzoneTitle}</h3>
            <p class="ws-dropzone-desc">\${this.t.dropzoneSubtitle}</p>
          </div>
          <button type="button" class="ws-dropzone-browse-btn" id="ws-btn-browse">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
            <span>\${this.t.dropzoneBrowse}</span>
          </button>
        </div>

        <!-- 4 Quick Action Seams -->
        <div class="ws-quick-actions">
          <button type="button" class="ws-quick-action-pill" data-quick-action="mepdf">
            <span>📄</span>
            <span>\${isTh ? 'รวมและจัดการไฟล์ PDF' : 'Merge & Edit PDF'}</span>
          </button>
          <button type="button" class="ws-quick-action-pill" data-quick-action="mepdf-compress">
            <span>🗜️</span>
            <span>\${isTh ? 'บีบอัดไฟล์เอกสาร' : 'Compress PDF'}</span>
          </button>
          <button type="button" class="ws-quick-action-pill" data-quick-action="mephoto">
            <span>✨</span>
            <span>\${isTh ? 'ปรับระนาบ & แต่งภาพ' : 'Deskew & Clean Photo'}</span>
          </button>
          <button type="button" class="ws-quick-action-pill" data-quick-action="medoc">
            <span>📝</span>
            <span>\${isTh ? 'เขียนเอกสาร Markdown' : 'New Document'}</span>
          </button>
        </div>
      </section>

      <!-- Primary Studios Launch Deck -->
      <section class="ws-deck-section">
        <div class="ws-section-header">
          <h2 class="ws-section-title">\${isTh ? 'สตูดิโอหลักพร้อมใช้งาน' : 'Primary Creative Studios'}</h2>
          <span class="ws-section-tag">\${isTh ? 'ทำงานออฟไลน์ 100%' : '100% Offline'}</span>
        </div>
        <div class="ws-studios-grid">
          \${primaryStudios.map(app => \`
            <div class="ws-studio-card" style="--accent:\${app.accentColor}; --glow:\${app.glowColor};">
              <div class="ws-studio-card-glow" aria-hidden="true"></div>
              <div class="ws-studio-card-header">
                <div class="ws-studio-icon" aria-hidden="true">\${getAppIcon(app.id, app.accentColor)}</div>
                <div class="ws-studio-meta">
                  <h3 class="ws-studio-name">\${app.name}</h3>
                  <span class="ws-studio-ver">\${app.version}</span>
                </div>
              </div>
              <p class="ws-studio-tagline">\${app.tagline[this.lang]}</p>
              <div class="ws-studio-specs">
                \${(app.specs?.[this.lang] || []).slice(0, 2).map(s => \`<span class="ws-spec-chip">✓ \${escapeHtml(s)}</span>\`).join('')}
              </div>
              <div class="ws-studio-card-footer">
                <button type="button" class="ws-btn-launch" data-launch-app="\${app.id}">
                  <span>\${isTh ? \`เปิด \${app.name}\` : \`Launch \${app.name}\`}</span>
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          \`).join('')}
        </div>
      </section>`;

const workbenchReplacement = `  private renderWorkbenchView(): string {
    const isTh = this.lang === 'th';
    const primaryStudios = SHOWCASE_APPS.filter(a => ['mepdf', 'mephoto', 'medoc', 'medrop', 'mevector', 'me3d'].includes(a.id));

    return \`
    <div class="ws-view ws-view-workbench">
      <header class="ws-view-header">
        <div class="ws-view-eyebrow">NATIVE WINDOWS WORKSTATION · 100% IN-DEVICE RAM</div>
        <h1 class="ws-view-title">\${isTh ? 'ศูนย์กลางเครื่องมือสร้างสรรค์และเอกสาร' : 'Creative & Document Workstation'}</h1>
        <p class="ws-view-subtitle">\${isTh ? 'ลากไฟล์มาวางด้านล่างเพื่อเริ่มงานทันที หรือเลือกเปิดสตูดิโอที่ต้องการ' : 'Drop any file below for instant in-device processing or launch your studios.'}</p>
      </header>

      <!-- Universal Interactive Dropzone -->
      <section class="ws-dropzone-section">
        <div class="ws-dropzone" id="ws-universal-dropzone" role="region" aria-label="File dropzone">
          <input type="file" id="ws-file-input" style="display:none;" />
          <div class="ws-dropzone-icon" aria-hidden="true">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          <div class="ws-dropzone-text">
            <h3 class="ws-dropzone-title">\${this.t.dropzoneTitle}</h3>
            <p class="ws-dropzone-desc">\${this.t.dropzoneSubtitle}</p>
          </div>
          <button type="button" class="ws-dropzone-browse-btn" id="ws-btn-browse">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
            <span>\${this.t.dropzoneBrowse}</span>
          </button>
        </div>

        <!-- 6 Quick Action Seams -->
        <div class="ws-quick-actions">
          <button type="button" class="ws-quick-action-pill" data-quick-action="mepdf">
            <span>📄</span>
            <span>\${isTh ? 'รวมและจัดการไฟล์ PDF' : 'Merge & Edit PDF'}</span>
          </button>
          <button type="button" class="ws-quick-action-pill" data-quick-action="mepdf-compress">
            <span>🗜️</span>
            <span>\${isTh ? 'บีบอัดไฟล์เอกสาร' : 'Compress PDF'}</span>
          </button>
          <button type="button" class="ws-quick-action-pill" data-quick-action="mephoto">
            <span>✨</span>
            <span>\${isTh ? 'ปรับระนาบ & แต่งภาพ' : 'Deskew & Clean Photo'}</span>
          </button>
          <button type="button" class="ws-quick-action-pill" data-quick-action="medoc">
            <span>📝</span>
            <span>\${isTh ? 'เขียนเอกสาร Markdown' : 'New Document'}</span>
          </button>
          <button type="button" class="ws-quick-action-pill" data-quick-action="mevector">
            <span>✒️</span>
            <span>\${isTh ? 'วาดภาพเวกเตอร์' : 'Vector Illustration'}</span>
          </button>
          <button type="button" class="ws-quick-action-pill" data-quick-action="mefilm">
            <span>🎬</span>
            <span>\${isTh ? 'ตัดต่อวิดีโอ & ไทม์ไลน์' : 'Video & Motion Timeline'}</span>
          </button>
        </div>
      </section>

      <!-- Primary Studios Launch Deck -->
      <section class="ws-deck-section">
        <div class="ws-section-header">
          <h2 class="ws-section-title">\${isTh ? 'สตูดิโอหลักพร้อมใช้งาน' : 'Primary Creative Studios'}</h2>
          <span class="ws-section-tag">\${isTh ? 'ทำงานออฟไลน์ 100%' : '100% Offline'}</span>
        </div>
        <div class="ws-studios-grid">
          \${primaryStudios.map(app => \`
            <div class="ws-studio-card" style="--accent:\${app.accentColor}; --glow:\${app.glowColor};">
              <div class="ws-studio-card-glow" aria-hidden="true"></div>
              <div class="ws-studio-card-header">
                <div class="ws-studio-icon" aria-hidden="true">\${getAppIcon(app.id, app.accentColor)}</div>
                <div class="ws-studio-meta">
                  <h3 class="ws-studio-name">\${app.name}</h3>
                  <span class="ws-studio-ver">\${app.version}</span>
                </div>
              </div>
              \${app.industryCounterpart ? \`
                <div class="ws-counterpart-badge">
                  <span>✦ \${app.industryCounterpart[this.lang]}</span>
                </div>
              \` : ''}
              <p class="ws-studio-tagline">\${app.tagline[this.lang]}</p>
              <div class="ws-studio-specs">
                \${(app.specs?.[this.lang] || []).slice(0, 2).map(s => \`<span class="ws-spec-chip">✓ \${escapeHtml(s)}</span>\`).join('')}
              </div>
              <div class="ws-studio-card-footer">
                <button type="button" class="ws-btn-launch" data-launch-app="\${app.id}">
                  <span>\${isTh ? \`เปิด \${app.name}\` : \`Launch \${app.name}\`}</span>
                  <span aria-hidden="true">→</span>
                </button>
                <button type="button" class="ws-btn-web-pill" data-launch-web-studio="\${app.id}" title="\${isTh ? 'เปิดบนเว็บ' : 'Launch Web Studio'}">
                  <span>🚀</span>
                </button>
                <button type="button" class="ws-btn-detail-pill" data-open-detail-modal="\${app.id}" title="\${isTh ? 'ดูสเปกและคีย์ลัด' : 'View Specifications & Shortcuts'}">
                  <span>ℹ️</span>
                </button>
              </div>
            </div>
          \`).join('')}
        </div>
      </section>`;

content = content.replace(workbenchTarget, () => workbenchReplacement);

// 5. Update renderStudiosCatalogView
const catalogEyebrowTarget = `<div class="ws-view-eyebrow">ALL 11 STANDALONE CREATIVE STUDIOS</div>`;
const catalogEyebrowReplacement = `<div class="ws-view-eyebrow">ALL \${SHOWCASE_APPS.length} STANDALONE CREATIVE STUDIOS</div>`;
content = content.replace(catalogEyebrowTarget, () => catalogEyebrowReplacement);

const catalogCardTarget = `                  <span class="ws-status-badge \${isActive ? 'badge-active' : 'badge-indev'}">
                    \${isActive ? (isTh ? 'พร้อมใช้งาน' : 'Ready') : (isTh ? 'กำลังพัฒนา' : 'In Dev')}
                  </span>
                </div>
                <span class="ws-card-full-tagline">\${app.tagline[this.lang]}</span>
              </div>
            </div>
            <p class="ws-card-full-desc">\${app.description[this.lang]}</p>
            <div class="ws-card-full-specs">
              \${(app.specs?.[this.lang] || []).map(s => \`
                <span class="ws-spec-bullet">✓ \${escapeHtml(s)}</span>
              \`).join('')}
            </div>
            <div class="ws-card-full-footer">
              <span class="ws-engine-tag">\${app.enginePill?.[this.lang] || '100% In-Device RAM'}</span>
              <button type="button" class="ws-btn-launch" data-launch-app="\${app.id}" style="\${!isActive ? 'background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.18);' : ''}">
                <span>\${isActive ? (isTh ? \`เปิด \${app.name}\` : \`Launch \${app.name}\`) : (isTh ? \`เปิดพรีวิว \${app.name}\` : \`Preview \${app.name}\`)}</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>`;

const catalogCardReplacement = `                  <span class="ws-status-badge \${isActive ? 'badge-active' : 'badge-indev'}">
                    \${isActive ? (isTh ? 'พร้อมใช้งาน' : 'Ready') : (isTh ? 'กำลังพัฒนา' : 'In Dev')}
                  </span>
                </div>
                \${app.industryCounterpart ? \`
                  <div class="ws-counterpart-badge" style="margin-top: 2px;">
                    <span>✦ \${app.industryCounterpart[this.lang]}</span>
                  </div>
                \` : ''}
                <span class="ws-card-full-tagline">\${app.tagline[this.lang]}</span>
              </div>
            </div>
            <p class="ws-card-full-desc">\${app.description[this.lang]}</p>
            <div class="ws-card-full-specs">
              \${(app.specs?.[this.lang] || []).map(s => \`
                <span class="ws-spec-bullet">✓ \${escapeHtml(s)}</span>
              \`).join('')}
            </div>
            <div class="ws-card-full-footer">
              <span class="ws-engine-tag">\${app.enginePill?.[this.lang] || '100% In-Device RAM'}</span>
              <div style="display: flex; gap: 8px;">
                <button type="button" class="ws-btn-launch" data-launch-app="\${app.id}" style="\${!isActive ? 'background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.18);' : ''}">
                  <span>\${isActive ? (isTh ? \`เปิด \${app.name}\` : \`Launch \${app.name}\`) : (isTh ? \`เปิดพรีวิว \${app.name}\` : \`Preview \${app.name}\`)}</span>
                  <span aria-hidden="true">→</span>
                </button>
                <button type="button" class="ws-btn-web-pill" data-launch-web-studio="\${app.id}" title="\${isTh ? 'เปิดบนเว็บ' : 'Launch Web Studio'}">
                  <span>🚀</span>
                </button>
                <button type="button" class="ws-btn-detail-pill" data-open-detail-modal="\${app.id}" title="\${isTh ? 'ดูสเปกและคีย์ลัด' : 'View Specifications & Shortcuts'}">
                  <span>ℹ️</span>
                </button>
              </div>
            </div>`;

content = content.replace(catalogCardTarget, () => catalogCardReplacement);

// 6. Update renderAppsGrid titles
content = content.replace(
  `<div class="section-eyebrow" aria-hidden="true">11 CREATIVE WORKSTATIONS &amp; UTILITIES</div>`,
  () => `<div class="section-eyebrow" aria-hidden="true">\${SHOWCASE_APPS.length} CREATIVE WORKSTATIONS &amp; UTILITIES</div>`
);
content = content.replace(
  `<!-- 3. All 11 Programs Ecosystem Overview Grid -->`,
  () => `<!-- 3. All Studios Ecosystem Overview Grid -->`
);
content = content.replace(
  `\${this.lang === 'th' ? 'สำรวจทั้ง 11 โปรแกรมในเครือ meCrafts' : 'Explore All 11 meCrafts Workstations & Utilities'}`,
  () => `\${this.lang === 'th' ? \`สำรวจทั้ง \${SHOWCASE_APPS.length} โปรแกรมในเครือ meCrafts\` : \`Explore All \${SHOWCASE_APPS.length} meCrafts Workstations & Utilities\`}`
);

// 7. Update renderEcosystemCard
const ecoCardTarget = `  private renderEcosystemCard(app: ShowcaseApp, isActive: boolean): string {
    const isAppActive = app.status === 'active';
    const catLabel = app.categoryLabel[this.lang];
    const tagline = app.tagline[this.lang];

    return \`
    <div
      class="ecosystem-card \${isActive ? 'card-active' : ''} \${isAppActive ? 'card-status-active' : 'card-status-indev'}"
      data-studio-jump="\${app.id}"
      role="button"
      tabindex="0"
      aria-label="Inspect \${app.name}"
      style="--card-accent: \${app.accentColor}; --card-glow: \${app.glowColor};"
    >
      <div class="eco-card-top">
        <div class="eco-card-emblem" aria-hidden="true">\${getAppIcon(app.id, app.accentColor)}</div>
        <div class="eco-card-meta">
          <span class="eco-cat-tag" style="color: \${app.accentColor};">\${catLabel}</span>
          <span class="eco-status-pill \${isAppActive ? 'status-active' : 'status-indev'}">
            <span class="status-dot" aria-hidden="true"></span>
            \${isAppActive ? this.t.statusActive : this.t.statusInDev}
          </span>
        </div>
      </div>
      <div class="eco-card-body">
        <h4 class="eco-card-name">\${app.name}</h4>
        <p class="eco-card-tagline">\${tagline}</p>
      </div>
      <div class="eco-card-footer">
        <span class="eco-version">\${app.version}</span>
        <span class="eco-jump-hint">\${isActive ? (this.lang === 'th' ? '● กำลังดูในค็อกพิท' : '● In Cockpit') : (this.lang === 'th' ? 'สลับดูหน้าต่างนี้ →' : 'Inspect UI →')}</span>
      </div>
    </div>\`;
  }`;

const ecoCardReplacement = `  private renderEcosystemCard(app: ShowcaseApp, isActive: boolean): string {
    const isAppActive = app.status === 'active';
    const catLabel = app.categoryLabel[this.lang];
    const tagline = app.tagline[this.lang];

    return \`
    <div
      class="ecosystem-card \${isActive ? 'card-active' : ''} \${isAppActive ? 'card-status-active' : 'card-status-indev'}"
      data-studio-jump="\${app.id}"
      role="region"
      aria-label="\${app.name}"
      style="--card-accent: \${app.accentColor}; --card-glow: \${app.glowColor};"
    >
      <div class="eco-card-top">
        <div class="eco-card-emblem" aria-hidden="true">\${getAppIcon(app.id, app.accentColor)}</div>
        <div class="eco-card-meta">
          <span class="eco-cat-tag" style="color: \${app.accentColor};">\${catLabel}</span>
          <span class="eco-status-pill \${isAppActive ? 'status-active' : 'status-indev'}">
            <span class="status-dot" aria-hidden="true"></span>
            \${isAppActive ? this.t.statusActive : this.t.statusInDev}
          </span>
        </div>
      </div>
      <div class="eco-card-body">
        <div class="eco-card-title-row">
          <h4 class="eco-card-name">\${app.name}</h4>
          <span class="eco-version">\${app.version}</span>
        </div>
        \${app.industryCounterpart ? \`
          <div class="eco-counterpart-chip" title="Alternative to \${app.industryCounterpart.en}">
            <span>✦ \${app.industryCounterpart[this.lang]}</span>
          </div>
        \` : ''}
        <p class="eco-card-tagline">\${tagline}</p>

        <!-- 3 Key Specs Bullets -->
        <div class="eco-specs-preview">
          \${(app.specs?.[this.lang] || []).slice(0, 3).map(s => \`
            <div class="eco-spec-item">
              <span class="eco-spec-check">✓</span>
              <span class="eco-spec-text">\${escapeHtml(s)}</span>
            </div>
          \`).join('')}
        </div>
      </div>

      <!-- High-Impact Dual Action Buttons matching getartcraft.com -->
      <div class="eco-card-actions">
        <button type="button" class="eco-btn-web" data-launch-web-studio="\${app.id}" title="\${this.lang === 'th' ? \`เปิด \${app.name} บนเบราว์เซอร์\` : \`Launch \${app.name} in Web Browser\`}">
          <span>🚀 \${this.lang === 'th' ? 'เปิดบนเว็บ' : 'Open Web'}</span>
        </button>
        <a href="\${app.downloadUrl || SUITE_DOWNLOAD_URL}" class="eco-btn-dl" \${app.downloadUrl ? \`download="\${app.exeName || (app.name + '.exe')}"\` : 'target="_blank"'} title="\${this.lang === 'th' ? \`ดาวน์โหลด \${app.exeName || (app.name + '.exe')}\` : \`Download \${app.exeName || (app.name + '.exe')}\`}">
          <span>⬇️ .exe</span>
        </a>
        <button type="button" class="eco-btn-detail" data-open-detail-modal="\${app.id}" title="\${this.lang === 'th' ? 'ดูสเปกและคีย์ลัด' : 'View Specifications & Shortcuts'}">
          <span>ℹ️</span>
        </button>
      </div>
    </div>\`;
  }

  private renderStudioDetailModal(): string {
    if (!this.isDetailModalOpen || !this.selectedDetailApp) return '';
    const app = this.selectedDetailApp;
    const isTh = this.lang === 'th';
    const isActive = app.status === 'active';

    return \`
    <div class="studio-detail-modal-backdrop" id="modal-studio-detail-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-detail-title">
      <div class="studio-detail-modal-container" style="--detail-accent: \${app.accentColor}; --detail-glow: \${app.glowColor};">
        <div class="studio-detail-modal-header">
          <div class="detail-header-left">
            <div class="detail-modal-emblem" aria-hidden="true">\${getAppIcon(app.id, app.accentColor)}</div>
            <div class="detail-modal-titles">
              <div class="detail-modal-name-row">
                <h3 class="detail-modal-title" id="modal-detail-title">\${app.name}</h3>
                <span class="detail-modal-version">\${app.version}</span>
                <span class="detail-modal-status \${isActive ? 'status-active' : 'status-indev'}">
                  \${isActive ? (isTh ? 'พร้อมใช้งาน' : 'Active') : (isTh ? 'กำลังพัฒนา' : 'In Dev')}
                </span>
              </div>
              \${app.industryCounterpart ? \`
                <div class="detail-modal-counterpart">
                  <span>✦ \${app.industryCounterpart[this.lang]}</span>
                </div>
              \` : ''}
            </div>
          </div>
          <button type="button" class="studio-detail-modal-close" id="btn-close-detail-modal" aria-label="Close modal">✕</button>
        </div>

        <div class="studio-detail-modal-body">
          <div class="detail-section">
            <h4 class="detail-section-heading">\${isTh ? 'คำอธิบายสตูดิโอ' : 'Studio Overview'}</h4>
            <p class="detail-description">\${app.description[this.lang]}</p>
          </div>

          <div class="detail-section">
            <div class="detail-privacy-banner">
              <span class="privacy-banner-icon">🛡️</span>
              <div class="privacy-banner-text">
                <strong>\${isTh ? 'ประมวลผลบนหน่วยความจำ RAM ภายในเครื่อง 100%' : '100% Client-Side In-Device RAM Isolation'}</strong>
                <span>\${isTh ? 'ไม่มีการส่งข้อมูลหรืออัปโหลดไฟล์ไปยังเซิร์ฟเวอร์ภายนอก ไฟล์ทั้งหมดประมวลผลและจัดเก็บในเครื่องของคุณ' : 'Zero telemetry, zero cloud uploads. All memory buffers and files remain isolated within your local device.'}</span>
              </div>
            </div>
          </div>

          <div class="detail-section">
            <h4 class="detail-section-heading">\${isTh ? 'ขีดความสามารถทางวิศวกรรมและสเปกเด่น' : 'Key Engineering Specifications'}</h4>
            <div class="detail-specs-grid">
              \${(app.specs?.[this.lang] || []).map(s => \`
                <div class="detail-spec-item">
                  <span class="detail-spec-icon">✓</span>
                  <span>\${escapeHtml(s)}</span>
                </div>
              \`).join('')}
            </div>
          </div>

          \${app.supportedFormats && app.supportedFormats.length > 0 ? \`
            <div class="detail-section">
              <h4 class="detail-section-heading">\${isTh ? 'นามสกุลและรูปแบบไฟล์ที่รองรับ' : 'Supported File Formats'}</h4>
              <div class="detail-formats-wrap">
                \${app.supportedFormats.map(f => \`<span class="detail-format-pill">.\${f}</span>\`).join('')}
              </div>
            </div>
          \` : ''}

          \${app.shortcuts && app.shortcuts.length > 0 ? \`
            <div class="detail-section">
              <h4 class="detail-section-heading">\${isTh ? 'ปุ่มลัดแป้นพิมพ์ระดับโปร (Muscle-Memory Shortcuts)' : 'Muscle-Memory Keyboard Shortcuts'}</h4>
              <div class="detail-shortcuts-table">
                \${app.shortcuts.map(sc => \`
                  <div class="detail-shortcut-row">
                    <kbd class="detail-kbd">\${sc.key}</kbd>
                    <span class="detail-action">\${sc.action[this.lang]}</span>
                  </div>
                \`).join('')}
              </div>
            </div>
          \` : ''}
        </div>

        <div class="studio-detail-modal-footer">
          <div class="detail-footer-actions">
            <button type="button" class="btn-detail-launch-web" data-launch-web-studio="\${app.id}">
              <span>🚀 \${isTh ? \`เปิด \${app.name} บนเบราว์เซอร์\` : \`Open \${app.name} in Browser\`}</span>
            </button>
            <a href="\${app.downloadUrl || SUITE_DOWNLOAD_URL}" class="btn-detail-download" \${app.downloadUrl ? \`download="\${app.exeName || (app.name + '.exe')}"\` : 'target="_blank"'}>
              <span>⬇️ \${isTh ? \`ดาวน์โหลด .exe (\${app.exeSize || 'Installer'})\` : \`Download .exe (\${app.exeSize || 'Installer'})\`}</span>
            </a>
          </div>
        </div>
      </div>
    </div>\`;
  }`;

content = content.replace(ecoCardTarget, () => ecoCardReplacement);

// 8. Add listeners in attachListeners()
const listenersTarget = `    // Studio Navigator & Spotlight Listeners
    this.bindStudioNavigatorListeners();
    this.bindEcosystemCardListeners();
    this.bindSpotlightListeners();
    this.setupScrollSpy();`;

const listenersReplacement = `    // Studio Navigator & Spotlight Listeners
    this.bindStudioNavigatorListeners();
    this.bindEcosystemCardListeners();
    this.bindSpotlightListeners();
    this.setupScrollSpy();

    // Studio Detail Drawer Modal Listeners
    document.querySelectorAll<HTMLElement>('[data-open-detail-modal]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const appId = btn.getAttribute('data-open-detail-modal');
        const app = SHOWCASE_APPS.find(a => a.id === appId);
        if (app) {
          this.selectedDetailApp = app;
          this.isDetailModalOpen = true;
          this.render();
          this.attachListeners();
        }
      });
    });

    const closeDetailModal = () => {
      this.isDetailModalOpen = false;
      this.selectedDetailApp = null;
      this.render();
      this.attachListeners();
    };

    document.getElementById('btn-close-detail-modal')?.addEventListener('click', closeDetailModal);
    document.getElementById('modal-studio-detail-backdrop')?.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).id === 'modal-studio-detail-backdrop') {
        closeDetailModal();
      }
    });

    // Launch Web Studio Listeners
    document.querySelectorAll<HTMLElement>('[data-launch-web-studio]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const appId = btn.getAttribute('data-launch-web-studio');
        if (appId) {
          this.handleLaunchApp(appId, 'web');
        }
      });
    });`;

content = content.replace(listenersTarget, () => listenersReplacement);

// 9. Update quick action listeners to include vector and film
const quickActionTarget = `        if (action === 'mepdf' || action === 'mepdf-compress') {
          this.handleLaunchApp('mepdf', 'desktop');
        } else if (action === 'mephoto') {
          this.handleLaunchApp('mephoto', 'desktop');
        } else if (action === 'medoc') {
          this.handleLaunchApp('medoc', 'desktop');
        }`;

const quickActionReplacement = `        if (action === 'mepdf' || action === 'mepdf-compress') {
          this.handleLaunchApp('mepdf', 'desktop');
        } else if (action === 'mephoto') {
          this.handleLaunchApp('mephoto', 'desktop');
        } else if (action === 'medoc') {
          this.handleLaunchApp('medoc', 'desktop');
        } else if (action === 'mevector') {
          this.handleLaunchApp('mevector', 'desktop');
        } else if (action === 'mefilm') {
          this.handleLaunchApp('mefilm', 'desktop');
        }`;

content = content.replace(quickActionTarget, () => quickActionReplacement);

fs.writeFileSync(mainTsPath, content, 'utf8');
console.log('Successfully updated main.ts with new views and modal drawer!');
