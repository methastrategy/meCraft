import { formatBytes } from '@mecraft/core-bridge';
import {
  detectClientPlatform,
  getRecommendedChannel,
  type CatalogCategory,
  type CatalogChannel,
  type CatalogPlatform,
  type CatalogProduct,
  type CatalogStatus,
} from './catalog';

export interface LibraryViewOptions {
  lang: 'en' | 'th';
  isDesktop: boolean;
  query: string;
  category: CatalogCategory | 'all';
  platform: CatalogPlatform | 'all';
  status: CatalogStatus | 'all';
  installedOnly?: boolean;
  installedMap?: Record<string, { installed: boolean; version?: string | null; exePath?: string | null }>;
  catalogFromCache?: boolean;
  catalogError?: string | null;
}

function esc(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function statusLabel(status: CatalogStatus, lang: 'en' | 'th'): string {
  if (status === 'active') return lang === 'th' ? 'ใช้งานได้จริง' : 'Ready';
  if (status === 'preview') return lang === 'th' ? 'รุ่นทดลอง' : 'Preview';
  return lang === 'th' ? 'กำลังพัฒนา' : 'In Development';
}

export function platformLabel(platform: CatalogPlatform, lang: 'en' | 'th'): string {
  switch (platform) {
    case 'web':
      return lang === 'th' ? 'เว็บแอป' : 'Web App';
    case 'windows':
      return 'Windows';
    case 'ios':
      return 'iOS';
    case 'android':
      return 'Android';
  }
}

export function channelTypeLabel(ch: CatalogChannel, lang: 'en' | 'th'): string {
  switch (ch.type) {
    case 'web-app':
      return lang === 'th' ? 'เว็บแอป (PWA)' : 'Web App (PWA)';
    case 'windows-msi':
    case 'windows-exe':
      return 'Windows (.exe)';
    case 'app-store':
      return 'App Store';
    case 'testflight':
      return 'TestFlight';
    case 'google-play':
      return 'Google Play';
    case 'android-apk':
      return 'Android APK';
  }
}

export function renderSharedFilterControls(opts: LibraryViewOptions): string {
  const th = opts.lang === 'th';
  const categories: Array<{ key: CatalogCategory | 'all'; label: string }> = [
    { key: 'all', label: th ? 'ทุกหมวด' : 'All Categories' },
    { key: 'document', label: th ? 'เอกสาร' : 'Document' },
    { key: 'photo', label: th ? 'ภาพและสี' : 'Photo & Color' },
    { key: 'utility', label: th ? 'เครื่องมือ' : 'Utility' },
    { key: 'vector', label: th ? 'เวกเตอร์และ CAD' : 'Vector & CAD' },
    { key: 'video', label: th ? 'วิดีโอและโมชัน' : 'Video & Motion' },
    { key: 'audio', label: th ? '3D และเสียง' : '3D & Audio' },
  ];

  const platforms: Array<{ key: CatalogPlatform | 'all'; label: string }> = [
    { key: 'all', label: th ? 'ทุกแพลตฟอร์ม' : 'All Platforms' },
    { key: 'web', label: th ? 'เว็บ' : 'Web' },
    { key: 'windows', label: 'Windows' },
    { key: 'ios', label: 'iOS' },
    { key: 'android', label: 'Android' },
  ];

  const statuses: Array<{ key: CatalogStatus | 'all'; label: string }> = [
    { key: 'all', label: th ? 'ทุกสถานะ' : 'All Statuses' },
    { key: 'active', label: statusLabel('active', opts.lang) },
    { key: 'preview', label: statusLabel('preview', opts.lang) },
    { key: 'in-dev', label: statusLabel('in-dev', opts.lang) },
  ];

  return `
    <div class="shared-library-controls" data-shared-controls="true">
      <div class="shared-filter-row">
        <div class="shared-filter-group" role="group" aria-label="${th ? 'กรองตามหมวดหมู่' : 'Filter by category'}">
          ${categories.map(c => `
            <button
              type="button"
              class="shared-pill ${opts.category === c.key ? 'active' : ''}"
              data-lib-cat="${c.key}"
              aria-pressed="${opts.category === c.key}"
            >${esc(c.label)}</button>
          `).join('')}
        </div>
      </div>
      <div class="shared-filter-row shared-filter-row-secondary">
        <div class="shared-filter-group" role="group" aria-label="${th ? 'กรองตามแพลตฟอร์ม' : 'Filter by platform'}">
          ${platforms.map(p => `
            <button
              type="button"
              class="shared-pill ${opts.platform === p.key ? 'active' : ''}"
              data-lib-platform="${p.key}"
              aria-pressed="${opts.platform === p.key}"
            >${esc(p.label)}</button>
          `).join('')}
        </div>
        <div class="shared-filter-group" role="group" aria-label="${th ? 'กรองตามสถานะ' : 'Filter by status'}">
          ${statuses.map(s => `
            <button
              type="button"
              class="shared-pill ${opts.status === s.key ? 'active' : ''}"
              data-lib-status="${s.key}"
              aria-pressed="${opts.status === s.key}"
            >${esc(s.label)}</button>
          `).join('')}
          ${opts.isDesktop ? `
            <button
              type="button"
              class="shared-pill shared-pill-installed ${opts.installedOnly ? 'active' : ''}"
              data-lib-installed-only="true"
              aria-pressed="${Boolean(opts.installedOnly)}"
            >✓ ${th ? 'ติดตั้งแล้ว' : 'Installed'}</button>
          ` : ''}
        </div>
      </div>
      ${opts.catalogFromCache ? `
        <div class="shared-catalog-notice" role="status">
          <span>${th ? 'กำลังแสดงข้อมูลจากแคชล่าสุด (ออฟไลน์)' : 'Showing last verified offline catalog cache.'}</span>
          <button type="button" class="shared-retry-link" data-lib-retry="true">${th ? 'ลองโหลดใหม่' : 'Retry'}</button>
        </div>
      ` : ''}
      ${opts.catalogError && !opts.catalogFromCache ? `
        <div class="shared-catalog-notice is-warning" role="status">
          <span>${th ? 'ไม่สามารถโหลดแค็ตตาล็อกออนไลน์ได้ — แอปที่ติดตั้งไว้ยังเปิดใช้งานได้' : 'Could not reach online catalog — installed apps remain available offline.'}</span>
          <button type="button" class="shared-retry-link" data-lib-retry="true">${th ? 'ลองใหม่' : 'Retry'}</button>
        </div>
      ` : ''}
    </div>
  `;
}

export function renderCatalogProductCard(
  product: CatalogProduct,
  opts: {
    lang: 'en' | 'th';
    isDesktop: boolean;
    localStatus?: { installed: boolean; version?: string | null; exePath?: string | null };
  },
): string {
  const th = opts.lang === 'th';
  const platforms = Array.from(new Set(product.channels.map(c => c.platform)));
  const winChannel = product.channels.find(c => c.platform === 'windows');
  const installed = opts.localStatus?.installed === true;
  const isCoreApp = product.id === 'medocs' || product.id === 'medoc' || product.id === 'mecraft';
  const isReady = product.status === 'active';
  const shouldBlur = !isReady;
  const imgSrc = product.image || '/branding/mecraft-suite-wide.webp';

  return `
    <article class="shared-product-card status-${product.status} ${shouldBlur ? 'is-blurred-card' : ''}" data-product-id="${esc(product.id)}" data-open-product-detail="${esc(product.id)}" style="--app-accent: ${esc(product.accentColor)}">
      <div class="shared-card-media">
        <img src="${esc(imgSrc)}" alt="${esc(product.name)}" loading="lazy" onerror="this.style.display='none'" class="${shouldBlur ? 'is-blurred' : ''}" />
        ${shouldBlur ? `
          <div class="shared-blur-lock-overlay" aria-hidden="true">
            <span>🔒 ${th ? (product.status === 'in-dev' ? 'กำลังพัฒนา' : 'เร็วๆ นี้') : (product.status === 'in-dev' ? 'In Development' : 'Coming Soon')}</span>
          </div>
        ` : ''}
        <span class="shared-status-badge is-${product.status}">${esc(statusLabel(product.status, opts.lang))}</span>
      </div>
      <div class="shared-card-body">
        <div class="shared-card-meta">
          <span class="shared-cat-label">${esc(product.categoryLabel[opts.lang])}</span>
          <span class="shared-version-label">v${esc(product.version)}</span>
        </div>
        <h3 class="shared-card-title">${esc(product.name)}</h3>
        <p class="shared-card-tagline">${esc(product.tagline[opts.lang])}</p>
        <div class="shared-platform-chips" aria-label="${th ? 'แพลตฟอร์มที่รองรับ' : 'Supported platforms'}">
          ${platforms.length > 0
            ? platforms.map(p => `<span class="shared-platform-chip">${esc(platformLabel(p, opts.lang))}</span>`).join('')
            : `<span class="shared-platform-chip is-muted">${th ? 'ยังไม่มีช่องทางเผยแพร่' : 'No release channels yet'}</span>`}
          ${product.channels.some(c => c.type === 'web-app') ? `<span class="shared-pwa-chip">${th ? 'เพิ่มไปยังหน้าจอโฮม' : 'Add to Home Screen'}</span>` : ''}
        </div>
        ${opts.isDesktop && opts.localStatus ? `
          <div class="shared-local-status ${installed ? 'is-installed' : ''}">
            ${installed
              ? `${th ? 'ติดตั้งแล้ว' : 'Installed'}${opts.localStatus.version ? ` · v${esc(opts.localStatus.version)}` : ''}`
              : (th ? 'ยังไม่ได้ติดตั้งบนเครื่อง' : 'Not installed')}
          </div>
        ` : ''}
      </div>
      <div class="shared-card-actions ${!isCoreApp ? 'is-showcase-only' : ''}">
        ${!isCoreApp ? `
          <span class="shared-showcase-pill">
            ${shouldBlur ? (th ? '🔒 กำลังพัฒนา' : '🔒 In Development') : (th ? '📷 ภาพตัวอย่างโปรแกรม' : '📷 Studio Preview')}
          </span>
        ` : opts.isDesktop ? `
          <button type="button" class="shared-btn-secondary" data-open-product-detail="${esc(product.id)}">
            ${th ? 'รายละเอียด' : 'Details'}
          </button>
          ${installed && (product.id === 'medocs' || product.id === 'medoc') ? `
            <button type="button" class="shared-btn-primary" data-medoc-action="open">
              ${th ? 'เปิด meDocs' : 'Open meDocs'}
            </button>
          ` : (product.id === 'medocs' || product.id === 'medoc') && winChannel ? `
            <button type="button" class="shared-btn-primary" data-medoc-action="install">
              ${th ? 'ติดตั้ง' : 'Install'}
            </button>
          ` : ''}
        ` : `
          <a href="/apps/${esc(product.id)}/" class="shared-btn-secondary" data-product-link="${esc(product.id)}">
            ${th ? 'ดูรายละเอียด' : 'Details'}
          </a>
          ${winChannel && product.status !== 'in-dev' ? `
            <a href="${esc(product.id === 'mecraft' ? '/downloads/' : winChannel.url)}" class="shared-btn-primary">
              ${th ? 'ดาวน์โหลด' : 'Download'}
            </a>
          ` : ''}
        `}
      </div>
    </article>
  `;
}

export function renderProductDetailView(
  product: CatalogProduct,
  opts: {
    lang: 'en' | 'th';
    isDesktop: boolean;
    localStatus?: { installed: boolean; version?: string | null; exePath?: string | null };
    meDocAction?: 'install' | 'open' | 'update' | 'retry';
    meDocBusy?: boolean;
    meDocMessage?: string;
    meDocError?: boolean;
    meDocProgress?: number | null;
    shareCopied?: boolean;
  },
): string {
  const th = opts.lang === 'th';
  const clientPlatform = opts.isDesktop ? 'windows' : detectClientPlatform();
  const recommended = getRecommendedChannel(product, clientPlatform);
  const otherChannels = product.channels.filter(c => c !== recommended);
  const imgSrc = product.image || '/branding/mecraft-suite-wide.webp';
  const specs = product.specs?.[opts.lang] ?? [];
  const formats = product.supportedFormats ?? [];

  const renderChannelCard = (ch: CatalogChannel, isRecommended: boolean) => {
    const isDirect = ch.type === 'windows-msi' || ch.type === 'windows-exe' || ch.type === 'android-apk';
    const isWeb = ch.type === 'web-app';
    const downloadHref = product.id === 'mecraft' && ch.type === 'windows-msi' ? '/downloads/' : ch.url;

    return `
      <div class="detail-channel-card ${isRecommended ? 'is-recommended' : ''}">
        <div class="detail-channel-info">
          <div class="detail-channel-badges">
            ${isRecommended ? `<span class="channel-badge-rec">${th ? 'แนะนำสำหรับอุปกรณ์นี้' : 'Recommended for this device'}</span>` : ''}
            <span class="channel-badge-platform">${esc(platformLabel(ch.platform, opts.lang))}</span>
            <span class="channel-badge-type">${esc(channelTypeLabel(ch, opts.lang))}</span>
            ${ch.stability === 'preview' ? `<span class="channel-badge-preview">${th ? 'รุ่นทดลอง' : 'Preview'}</span>` : ''}
            ${isWeb ? `<span class="shared-pwa-chip">${th ? 'เพิ่มไปยังหน้าจอโฮม' : 'Add to Home Screen'}</span>` : ''}
          </div>
          <div class="detail-channel-meta">
            <span>${th ? 'รุ่น' : 'Version'} ${esc(ch.version)}</span>
            ${ch.arch ? `<span>· ${esc(ch.arch)}</span>` : ''}
            ${ch.sizeBytes ? `<span>· ${esc(formatBytes(ch.sizeBytes))}</span>` : ''}
          </div>
          ${isDirect && ch.sha256 ? `
            <div class="detail-channel-hash">
              <span>SHA-256:</span>
              <code>${esc(ch.sha256)}</code>
            </div>
          ` : ''}
        </div>
        <div class="detail-channel-actions">
          ${isWeb ? `
            ${opts.isDesktop ? `
              <span class="shared-pwa-chip">${th ? 'เว็บแอป' : 'Web App'}</span>
            ` : `
              <button type="button" class="shared-btn-secondary" data-open-homescreen-guide="true">${th ? 'เพิ่มไปยังหน้าจอโฮม' : 'Add to Home Screen'}</button>
            `}
          ` : opts.isDesktop && (product.id === 'medocs' || product.id === 'medoc') && ch.launcherManaged ? `
            <button type="button" class="shared-btn-primary" data-medoc-action="${opts.meDocAction ?? 'install'}" ${opts.meDocBusy ? 'disabled' : ''}>
              ${opts.meDocAction === 'open'
                ? (th ? 'เปิด meDocs' : 'Open meDocs')
                : opts.meDocAction === 'update'
                  ? (th ? 'อัปเดต meDocs' : 'Update meDocs')
                  : opts.meDocAction === 'retry'
                    ? (th ? 'ลองใหม่' : 'Retry')
                    : (th ? 'ติดตั้ง meDocs' : 'Install meDocs')}
            </button>
            ${opts.localStatus?.installed && opts.meDocAction === 'update' ? `
              <button type="button" class="shared-btn-secondary" data-medoc-action="open" ${opts.meDocBusy ? 'disabled' : ''}>
                ${th ? 'เปิด meDocs' : 'Open meDocs'}
              </button>
            ` : ''}
            ${opts.localStatus?.installed ? `
              <button type="button" class="shared-btn-secondary" data-medoc-action="uninstall" ${opts.meDocBusy ? 'disabled' : ''}>
                ${th ? 'ถอนการติดตั้ง' : 'Uninstall'}
              </button>
            ` : ''}
          ` : `
            <a href="${esc(downloadHref)}" class="shared-btn-primary" ${downloadHref.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''}>
              ${isDirect ? (th ? 'ดาวน์โหลด' : 'Download') : (th ? 'เปิดช่องทาง' : 'Open Channel')}
            </a>
          `}
        </div>
      </div>
    `;
  };

  return `
    <section class="shared-detail-page" aria-labelledby="detail-product-title">
      <div class="shared-detail-topbar">
        ${opts.isDesktop ? `
          <button type="button" class="shared-btn-secondary" data-close-product-detail="true">← ${th ? 'กลับคลังผลิตภัณฑ์' : 'Back to Library'}</button>
        ` : `
          <a href="/" class="shared-btn-secondary" data-back-to-library="true">← ${th ? 'กลับคลังผลิตภัณฑ์' : 'Back to Library'}</a>
          <button type="button" class="shared-btn-secondary" data-copy-share-url="${esc(product.id)}">
            ${opts.shareCopied ? (th ? '✓ คัดลอกลิงก์แล้ว' : '✓ Link copied') : (th ? '🔗 แชร์ลิงก์หน้านี้' : '🔗 Share Link')}
          </button>
        `}
      </div>

      <div class="shared-detail-hero">
        <div class="shared-detail-art">
          <img src="${esc(imgSrc)}" alt="${esc(product.name)}" onerror="this.style.display='none'" class="${product.status !== 'active' ? 'is-blurred' : ''}" />
          ${product.status !== 'active' ? `
            <div class="shared-blur-lock-overlay" aria-hidden="true">
              <span>🔒 ${th ? (product.status === 'in-dev' ? 'กำลังพัฒนา' : 'เร็วๆ นี้') : (product.status === 'in-dev' ? 'In Development' : 'Coming Soon')}</span>
            </div>
          ` : ''}
        </div>
        <div class="shared-detail-summary">
          <div class="shared-card-meta">
            <span class="shared-cat-label">${esc(product.categoryLabel[opts.lang])}</span>
            <span class="shared-status-badge is-${product.status}">${esc(statusLabel(product.status, opts.lang))}</span>
            <span class="shared-version-label">v${esc(product.version)}</span>
          </div>
          <h1 id="detail-product-title" class="shared-detail-title">${esc(product.name)}</h1>
          <p class="shared-detail-tagline">${esc(product.tagline[opts.lang])}</p>
          <p class="shared-detail-desc">${esc(product.description[opts.lang])}</p>
          <p class="shared-privacy-note">🔒 ${th ? 'ประมวลผลในเครื่อง 100% · เปิดดูและใช้งานหลักได้โดยไม่ต้องล็อกอิน' : '100% local privacy · No sign-in required to browse or use core tools.'}</p>
          ${opts.isDesktop && opts.localStatus ? `
            <div class="shared-local-box">
              <strong>${th ? 'สถานะบนเครื่องนี้:' : 'Local Status:'}</strong>
              <span>${opts.localStatus.installed
                ? `${th ? 'ติดตั้งแล้ว' : 'Installed'}${opts.localStatus.version ? ` · v${esc(opts.localStatus.version)}` : ''}`
                : (th ? 'ยังไม่ได้ติดตั้ง' : 'Not installed')}</span>
              ${opts.localStatus.exePath ? `<code class="shared-local-path">${esc(opts.localStatus.exePath)}</code>` : ''}
            </div>
          ` : ''}
        </div>
      </div>

      ${opts.meDocProgress !== null && opts.meDocProgress !== undefined ? `
        <div class="ws-managed-feedback"><progress max="100" value="${opts.meDocProgress}"></progress></div>
      ` : ''}
      ${opts.meDocMessage ? `
        <div class="ws-managed-message ${opts.meDocError ? 'is-error' : ''}" role="status">${esc(opts.meDocMessage)}</div>
      ` : ''}

      <div class="shared-detail-section">
        <h2>${th ? 'ช่องทางใช้งานและดาวน์โหลด' : 'Available Channels'}</h2>
        ${product.status === 'in-dev' || product.channels.length === 0 ? `
          <div class="shared-indev-notice" role="status">
            <strong>🚧 ${th ? 'กำลังพัฒนา (In Development)' : 'In Development'}</strong>
            <p>${th ? 'ผลิตภัณฑ์นี้ยังอยู่ในระหว่างการพัฒนา จึงยังไม่มีปุ่มติดตั้งหรือไฟล์ดาวน์โหลดในขณะนี้' : 'This product is still in development. No installer or download is available yet.'}</p>
          </div>
        ` : `
          <div class="detail-channels-list">
            ${recommended ? renderChannelCard(recommended, true) : ''}
            ${otherChannels.map(ch => renderChannelCard(ch, false)).join('')}
          </div>
        `}
      </div>

      ${specs.length > 0 ? `
        <div class="shared-detail-section">
          <h2>${th ? 'ความสามารถหลัก' : 'Key Capabilities'}</h2>
          <ul class="shared-specs-list">
            ${specs.map(s => `<li>✦ ${esc(s)}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      ${formats.length > 0 ? `
        <div class="shared-detail-section">
          <h2>${th ? 'รูปแบบไฟล์ที่รองรับ' : 'Supported Formats'}</h2>
          <div class="detail-formats-wrap">
            ${formats.map(f => `<span class="detail-format-pill">.${esc(f)}</span>`).join('')}
          </div>
        </div>
      ` : ''}
    </section>
  `;
}

export function renderHomeScreenGuideModal(isOpen: boolean, lang: 'en' | 'th'): string {
  if (!isOpen) return '';
  const th = lang === 'th';
  return `
    <div class="homescreen-modal-overlay" id="homescreen-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="homescreen-modal-title">
      <div class="homescreen-modal-backdrop" id="homescreen-modal-backdrop"></div>
      <div class="homescreen-modal-card">
        <div class="homescreen-modal-header">
          <h2 id="homescreen-modal-title">📲 ${th ? 'เพิ่ม meCrafts ไปยังหน้าจอโฮม' : 'Add meCrafts to Home Screen'}</h2>
          <button type="button" id="btn-close-homescreen-modal" aria-label="${th ? 'ปิด' : 'Close'}">✕</button>
        </div>
        <div class="homescreen-modal-body">
          <div class="homescreen-step-box">
            <h3>🍎 iPhone / iPad (Safari)</h3>
            <ol>
              <li>${th ? 'เปิดหน้านี้ใน Safari' : 'Open this page in Safari.'}</li>
              <li>${th ? 'แตะปุ่ม แชร์ (Share) ที่แถบด้านล่างหรือด้านบน' : 'Tap the Share button.'}</li>
              <li>${th ? 'เลือก "เพิ่มไปยังหน้าจอโฮม" (Add to Home Screen) แล้วกด เพิ่ม' : 'Select "Add to Home Screen" and tap Add.'}</li>
            </ol>
            <p class="homescreen-note">${th ? 'หมายเหตุ: เป็นการเพิ่มเว็บแอปบนหน้าจอโฮม ไม่ใช่การติดตั้งไฟล์ IPA' : 'Note: This adds the web app to your Home Screen; it does not install a native IPA.'}</p>
          </div>
          <div class="homescreen-step-box">
            <h3>🤖 Android (Chrome)</h3>
            <ol>
              <li>${th ? 'เปิดหน้านี้ใน Google Chrome' : 'Open this page in Google Chrome.'}</li>
              <li>${th ? 'แตะเมนู ⋮ มุมขวาบน' : 'Tap the ⋮ menu in the top-right corner.'}</li>
              <li>${th ? 'เลือก "เพิ่มลงในหน้าจอหลัก" (Add to home screen / Install app)' : 'Tap "Add to home screen" or "Install app".'}</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  `;
}
