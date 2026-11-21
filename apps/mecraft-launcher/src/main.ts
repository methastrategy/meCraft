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

export interface LauncherTranslations {
  brandTitle: string;
  brandTag: string;
  brandSubtitle: string;
  networkConnected: string;
  networkOffline: string;
  settingsBtn: string;
  langBtn: string;
  heroTitle: string;
  heroSubtitle: string;
  badgePrivacy: string;
  badgeDesktop: string;
  badgeOcr: string;
  badgeHomography: string;
  dropZoneTitle: string;
  dropZoneSubtitle: string;
  dropZoneBtn: string;
  dropZoneRouting: (app: string) => string;
  catalogTitle: string;
  catalogCount: (count: number) => string;
  filterAll: string;
  filterInstalled: string;
  filterDoc: string;
  filterGraphics: string;
  openWebStudio: string;
  launchDesktop: string;
  installDesktop: (size?: string) => string;
  installing: (percent: number) => string;
  comingSoon: string;
  inDevelopment: string;
  moreOptions: string;
  openFolder: string;
  checkUpdates: string;
  uninstall: string;
  recentProjectsTitle: string;
  recentCount: (count: number) => string;
  clearHistory: string;
  emptyRecents: string;
  settingsTitle: string;
  storageDirLabel: string;
  autoCheckLabel: string;
  hwAccelLabel: string;
  healthTitle: string;
  privacyGuaranteeTitle: string;
  privacyGuaranteeText: string;
  runtimeLabel: string;
  runtimeTauri: string;
  runtimeWeb: string;
  statusHealthy: string;
  statusDraft: string;
  doneBtn: string;
  copyPathBtn: string;
  copiedBtn: string;
  updateDialogTitle: (app: string) => string;
  launchErrorTitle: (app: string) => string;
  installErrorTitle: (app: string) => string;
  unsupportedFile: string;
  downloadModalTitle: (app: string) => string;
  downloadModalSubtitle: string;
  downloadDirectExeTitle: string;
  downloadDirectExeDesc: string;
  downloadSetupExeTitle: string;
  downloadSetupExeDesc: string;
  downloadMsiTitle: string;
  downloadMsiDesc: string;
  viewAllReleases: string;
}

export const TRANSLATIONS: Record<'en' | 'th', LauncherTranslations> = {
  en: {
    brandTitle: 'meCraft',
    brandTag: 'Ecosystem Hub',
    brandSubtitle: 'The Creative & Document Workstation Ecosystem',
    networkConnected: '100% Private Local',
    networkOffline: 'Offline Sandbox',
    settingsBtn: 'Settings & Health',
    langBtn: 'TH',
    heroTitle: 'Creative & Document Workstation Studio',
    heroSubtitle: 'Pure Client-Side Private Processing • Zero-Cloud Upload • Native Windows Desktop + Offline PWA',
    badgePrivacy: '100% In-Browser Privacy',
    badgeDesktop: 'Offline PWA + Native Desktop',
    badgeOcr: 'Searchable Client OCR',
    badgeHomography: '4-Point Homography Deskew',
    dropZoneTitle: 'Drop any PDF or Image here to launch instantly in meCraft Studio',
    dropZoneSubtitle: 'Auto-routes PDF to mePDF Studio • Images to mePhoto Studio • 100% Private In-Browser Execution',
    dropZoneBtn: 'Browse Local File...',
    dropZoneRouting: (app) => `Routing to ${app}...`,
    catalogTitle: 'Apps Catalog',
    catalogCount: (count) => `${count} Apps`,
    filterAll: 'All Apps',
    filterInstalled: 'Installed',
    filterDoc: 'Document Tools',
    filterGraphics: 'Creative & Graphics',
    openWebStudio: 'Open Web Studio',
    launchDesktop: 'Launch Desktop (.exe)',
    installDesktop: (size) => `Install Desktop (.exe)${size ? ` (${size})` : ''}`,
    installing: (percent) => `Installing... ${percent}%`,
    comingSoon: 'Coming Soon • Notify Me',
    inDevelopment: 'In Development',
    moreOptions: 'More Options',
    openFolder: 'Open Install Folder',
    checkUpdates: 'Check for Updates',
    uninstall: 'Uninstall App',
    recentProjectsTitle: 'Universal Recent Projects',
    recentCount: (count) => `${count} Files`,
    clearHistory: 'Clear History',
    emptyRecents: 'No recent projects yet. Drop files above or open documents in mePDF / mePhoto to see them here.',
    settingsTitle: 'meCraft Ecosystem Health & Settings',
    storageDirLabel: 'Applications Storage Directory',
    autoCheckLabel: 'Automatically check for app updates upon launching meCraft Hub',
    hwAccelLabel: 'Hardware Acceleration (DirectX 12 / Vulkan / WebGL 2.0)',
    healthTitle: 'Ecosystem System Health Check',
    privacyGuaranteeTitle: 'Zero-Cloud & 100% Privacy Guarantee',
    privacyGuaranteeText: 'All documents, photos, homography rectification, and OCR text recognition execute entirely inside your local device sandbox. No documents, images, or telemetry are ever uploaded to any remote server.',
    runtimeLabel: 'Runtime Sandbox Environment',
    runtimeTauri: 'Native Windows Desktop Engine (Tauri v2)',
    runtimeWeb: 'Pure Client-Side Browser Sandbox (Offline PWA Ready)',
    statusHealthy: 'Ready • Fully Functional',
    statusDraft: 'Planned / Pipeline',
    doneBtn: 'Done',
    copyPathBtn: 'Copy Path',
    copiedBtn: 'Copied!',
    updateDialogTitle: (app) => `Update Check — ${app}`,
    launchErrorTitle: (app) => `Launch Error — ${app}`,
    installErrorTitle: (app) => `Installation Failed — ${app}`,
    unsupportedFile: 'Unsupported file type. Please drop a PDF document (.pdf) or image file (.png, .jpg, .jpeg, .webp).',
    downloadModalTitle: (app) => `Download ${app} for Windows`,
    downloadModalSubtitle: 'Direct official binary download • 100% Client-Side Private • Zero Cloud Leakage',
    downloadDirectExeTitle: 'Direct Standalone (.exe)',
    downloadDirectExeDesc: 'Portable single-file binary. Run immediately without any installer or admin rights.',
    downloadSetupExeTitle: 'Setup Wizard (.exe)',
    downloadSetupExeDesc: 'NSIS installer with Start Menu shortcuts, desktop icon, and system file associations.',
    downloadMsiTitle: 'Windows Installer (.msi)',
    downloadMsiDesc: 'Official MSI package for system administrators and Windows Installer management.',
    viewAllReleases: 'View All GitHub Releases & Checksums',
  },
  th: {
    brandTitle: 'meCraft',
    brandTag: 'ศูนย์กลางโปรแกรม',
    brandSubtitle: 'ระบบรวมเครื่องมือเอกสารและงานสร้างสรรค์ระดับโปร',
    networkConnected: 'ประมวลผลในเครื่อง 100%',
    networkOffline: 'ออฟไลน์ แซนด์บ็อกซ์',
    settingsBtn: 'การตั้งค่าและสถานะระบบ',
    langBtn: 'EN',
    heroTitle: 'สตูดิโอสร้างสรรค์และจัดการเอกสารระดับโปร',
    heroSubtitle: 'ประมวลผลส่วนตัวในเครื่อง 100% • ปลอดภัยไม่ส่งไฟล์ขึ้นคลาวด์ • ใช้งานได้ทั้งเว็บออฟไลน์และโปรแกรมติดตั้ง Windows',
    badgePrivacy: 'ความเป็นส่วนตัวในเครื่อง 100%',
    badgeDesktop: 'PWA ออฟไลน์ + Windows .exe',
    badgeOcr: 'OCR แทรกข้อความค้นหาได้',
    badgeHomography: 'ปรับมุมเอียงด้วย Homography 4 จุด',
    dropZoneTitle: 'ลากไฟล์ PDF หรือรูปภาพมาวางที่นี่ เพื่อเปิดใช้งานทันทีใน meCraft Studio',
    dropZoneSubtitle: 'เปิดไฟล์ PDF ใน mePDF Studio อัตโนมัติ • รูปภาพเปิดใน mePhoto Studio • ปลอดภัยในเครื่อง ไม่ส่งออกภายนอก',
    dropZoneBtn: 'เลือกไฟล์จากเครื่อง...',
    dropZoneRouting: (app) => `กำลังเปิดใน ${app}...`,
    catalogTitle: 'รายการโปรแกรมทั้งหมด',
    catalogCount: (count) => `${count} โปรแกรม`,
    filterAll: 'ทั้งหมด',
    filterInstalled: 'ติดตั้งแล้ว',
    filterDoc: 'จัดการเอกสาร',
    filterGraphics: 'กราฟิกและภาพถ่าย',
    openWebStudio: 'เปิด Web Studio',
    launchDesktop: 'เปิดแอป Desktop (.exe)',
    installDesktop: (size) => `ติดตั้ง Desktop (.exe)${size ? ` (${size})` : ''}`,
    installing: (percent) => `กำลังติดตั้ง... ${percent}%`,
    comingSoon: 'เร็วๆ นี้ • แจ้งเตือนเมื่อพร้อม',
    inDevelopment: 'กำลังอยู่ระหว่างพัฒนา',
    moreOptions: 'ตัวเลือกเพิ่มเติม',
    openFolder: 'เปิดโฟลเดอร์ติดตั้ง',
    checkUpdates: 'ตรวจสอบอัปเดต',
    uninstall: 'ถอนการติดตั้ง',
    recentProjectsTitle: 'ประวัติไฟล์และโปรเจกต์ล่าสุด',
    recentCount: (count) => `${count} ไฟล์`,
    clearHistory: 'ล้างประวัติ',
    emptyRecents: 'ยังไม่มีประวัติไฟล์ ลากไฟล์มาวางด้านบน หรือเปิดไฟล์ใน mePDF / mePhoto เพื่อแสดงที่นี่',
    settingsTitle: 'การตั้งค่าและตรวจสอบสถานะ meCraft',
    storageDirLabel: 'ไดเรกทอรีจัดเก็บโปรแกรมบนเครื่อง',
    autoCheckLabel: 'ตรวจสอบอัปเดตอัตโนมัติเมื่อเปิด meCraft Hub',
    hwAccelLabel: 'การเร่งความเร็วด้วยฮาร์ดแวร์ (DirectX 12 / Vulkan / WebGL 2.0)',
    healthTitle: 'การตรวจสอบสถานะระบบและความพร้อมของโปรแกรม',
    privacyGuaranteeTitle: 'การรับประกันความปลอดภัยข้อมูลและไม่ใช้คลาวด์',
    privacyGuaranteeText: 'เอกสาร รูปภาพ การปรับมุมมองเอกสาร และการรู้จำข้อความ OCR ทั้งหมด ทำงานบนเครื่องของคุณโดยตรง ไม่มีการส่งข้อมูล เอกสาร หรือการบันทึก telemetry ไปยังเซิร์ฟเวอร์ใดๆ ทั้งสิ้น',
    runtimeLabel: 'สภาวะแวดล้อมที่กำลังรัน',
    runtimeTauri: 'โปรแกรมติดตั้งเนทีฟ Windows (Tauri v2)',
    runtimeWeb: 'เว็บเบราว์เซอร์แซนด์บ็อกซ์ (พร้อมทำงานออฟไลน์ PWA)',
    statusHealthy: 'พร้อมใช้งาน • สมบูรณ์ 100%',
    statusDraft: 'ตามแผนงาน / กำลังพัฒนา',
    doneBtn: 'เสร็จสิ้น',
    copyPathBtn: 'คัดลอกโฟลเดอร์',
    copiedBtn: 'คัดลอกแล้ว!',
    updateDialogTitle: (app) => `ตรวจสอบอัปเดต — ${app}`,
    launchErrorTitle: (app) => `เกิดข้อผิดพลาดในการเปิด — ${app}`,
    installErrorTitle: (app) => `การติดตั้งไม่สำเร็จ — ${app}`,
    unsupportedFile: 'รูปแบบไฟล์ไม่รองรับ กรุณาลากไฟล์ PDF (.pdf) หรือไฟล์รูปภาพ (.png, .jpg, .jpeg, .webp)',
    downloadModalTitle: (app) => `ดาวน์โหลด ${app} สำหรับ Windows`,
    downloadModalSubtitle: 'ดาวน์โหลดไฟล์โปรแกรมแท้โดยตรง • ทำงานในเครื่อง 100% • ปลอดภัยไม่ส่งข้อมูลออกภายนอก',
    downloadDirectExeTitle: 'โปรแกรมพกพา (.exe แบบพร้อมใช้)',
    downloadDirectExeDesc: 'ไฟล์เดียวจบ ดับเบิ้ลคลิกเปิดใช้งานได้ทันที ไม่ต้องมีหน้าต่างติดตั้ง ไม่ต้องขอสิทธิ์ Admin',
    downloadSetupExeTitle: 'ตัวช่วยติดตั้ง (.exe Setup)',
    downloadSetupExeDesc: 'ติดตั้งลงเครื่องแบบมาตรฐาน พร้อมสร้างไอคอนหน้าจอ เมนูเริ่ม และผูกไฟล์กับระบบ',
    downloadMsiTitle: 'แพ็กเกจติดตั้ง (.msi Installer)',
    downloadMsiDesc: 'ไฟล์ MSI สำหรับการติดตั้งระดับระบบ Windows และการจัดการในองค์กร',
    viewAllReleases: 'ดูรายการไฟล์และประวัติการปล่อยเวอร์ชันบน GitHub',
  },
};

export const APP_THAI_METADATA: Record<string, { tagline: string; description: string }> = {
  mepdf: {
    tagline: 'สตูดิโอวิศวกรรมเอกสาร PDF ในเบราว์เซอร์ 100%',
    description: 'จัดการเอกสาร รวมไฟล์ แยกหน้า บีบอัดแบบ Lossless/Scanned รหัสผ่าน AES-256 และระบบ OCR ออฟไลน์ค้นหาข้อความได้ทันที',
  },
  mephoto: {
    tagline: 'สตูดิโอปรับแต่งภาพและแก้เอกสารสแกนระดับ CamScanner',
    description: 'ลบเงาดำพื้นหลัง (Adaptive Otsu B&W), โหมดสี Magic Color, ลับคม Unsharp Mask, ปรับระนาบ 4-Point Homography และส่งออกหลายฟอร์แมต',
  },
  mevector: {
    tagline: 'เครื่องมือวาดภาพเวกเตอร์ ตัดต่อพาธ SVG และกราฟิก PDF',
    description: 'ตัดต่อเส้นพาธ Bézier เวกเตอร์ความแม่นยำสูง ดัดแปลงจุด Node และส่งออกเวกเตอร์ความละเอียดสูงคมชัดทุกขนาด',
  },
  medoc: {
    tagline: 'โปรแกรมพิมพ์งานสมาธิสูง พิมพ์สูตรคณิตศาสตร์และ Markdown',
    description: 'จัดหน้าแบบ Zen ไร้สิ่งรบกวน แสดงสูตรสมการ LaTeX แบบเรียลไทม์ ตรวจไวยากรณ์ออฟไลน์สองภาษา และส่งออกสิ่งพิมพ์ได้ทันที',
  },
};

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

  private get t(): LauncherTranslations {
    return TRANSLATIONS[this.currentLang];
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
    const t = this.t;

    this.appEl.innerHTML = `
      <header class="launcher-header">
        <div class="launcher-brand">
          <div class="launcher-logo" style="overflow: hidden; border-radius: var(--radius-sm); position: relative;">
            <img src="./assets/branding/mecraft-hub-emblem.jpg" alt="meCraft" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'" />
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
          </div>
          <div class="launcher-title-group">
            <div class="launcher-title">
              <span id="header-brand-title">${t.brandTitle}</span>
              <span class="launcher-version-badge" id="header-brand-badge">${t.brandTag}</span>
            </div>
            <div class="launcher-subtitle" id="header-brand-subtitle">${t.brandSubtitle}</div>
          </div>
        </div>

        <div class="launcher-nav-right">
          <div class="network-badge">
            <div class="network-dot"></div>
            <span id="header-network-label">${t.networkConnected}</span>
          </div>
          <button class="btn-header" id="btn-toggle-lang" aria-label="Switch Language (Current: ${this.currentLang.toUpperCase()})">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            <span id="lang-label">${t.langBtn}</span>
          </button>
          <button class="btn-header" id="btn-open-settings" aria-label="Open Settings & Health">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            <span id="btn-settings-label">${t.settingsBtn}</span>
          </button>
        </div>
      </header>

      <main class="launcher-content">
        <!-- Interactive Hero Banner -->
        <section class="launcher-hero">
          <div class="hero-content">
            <div class="hero-header-row">
              <div class="hero-pill">
                <span class="hero-pill-dot"></span>
                <span>meCraft Ecosystem Hub</span>
              </div>
            </div>
            <h1 class="hero-title" id="hero-title">${t.heroTitle}</h1>
            <p class="hero-subtitle" id="hero-subtitle">${t.heroSubtitle}</p>
            <div class="hero-badges" id="hero-badges">
              <div class="hero-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                <span>${t.badgePrivacy}</span>
              </div>
              <div class="hero-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                <span>${t.badgeDesktop}</span>
              </div>
              <div class="hero-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                <span>${t.badgeOcr}</span>
              </div>
              <div class="hero-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                <span>${t.badgeHomography}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Universal Drop Zone -->
        <section class="hub-drop-section">
          <div class="hub-dropzone" id="hub-dropzone" role="region" aria-label="Universal Drop Zone">
            <input type="file" id="hub-file-input" accept=".pdf,image/png,image/jpeg,image/webp,image/jpg,image/bmp,image/svg+xml" style="display: none;" />
            <div class="hub-dropzone-inner">
              <div class="hub-dropzone-icons">
                <div class="drop-icon-chip pdf">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  <span>PDF</span>
                </div>
                <div class="drop-icon-chip connector">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </div>
                <div class="drop-icon-chip photo">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>
                  <span>PHOTO</span>
                </div>
              </div>

              <div class="hub-dropzone-text">
                <div class="hub-dropzone-title" id="dropzone-title">${t.dropZoneTitle}</div>
                <div class="hub-dropzone-subtitle" id="dropzone-subtitle">${t.dropZoneSubtitle}</div>
              </div>

              <button class="btn-hub-browse" id="btn-browse-hub">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                <span id="btn-browse-hub-text">${t.dropZoneBtn}</span>
              </button>
            </div>
          </div>
        </section>

        <!-- Apps Catalog -->
        <section>
          <div class="section-header">
            <div class="section-title">
              <span id="catalog-section-title">${t.catalogTitle}</span>
              <span class="section-badge" id="catalog-count">${t.catalogCount(this.catalog.length)}</span>
            </div>
          </div>

          <div class="filter-bar" role="tablist" aria-label="Applications filter">
            <button class="filter-tab active" role="tab" aria-selected="true" data-filter="all" id="filter-all">${t.filterAll}</button>
            <button class="filter-tab" role="tab" aria-selected="false" data-filter="installed" id="filter-installed">${t.filterInstalled}</button>
            <button class="filter-tab" role="tab" aria-selected="false" data-filter="document" id="filter-doc">${t.filterDoc}</button>
            <button class="filter-tab" role="tab" aria-selected="false" data-filter="graphics" id="filter-graphics">${t.filterGraphics}</button>
          </div>

          <div class="apps-grid" id="apps-grid"></div>
        </section>

        <!-- Universal Recent Projects -->
        <section>
          <div class="section-header">
            <div class="section-title">
              <span id="recents-section-title">${t.recentProjectsTitle}</span>
              <span class="section-badge" id="recent-count">${t.recentCount(this.recentProjects.length)}</span>
            </div>
            <button class="btn-header" id="btn-clear-recents" aria-label="Clear Recent Projects" style="display: none;">${t.clearHistory}</button>
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

    // Bilingual metadata resolution
    const thaiMeta = APP_THAI_METADATA[app.id];
    const tagline = (this.currentLang === 'th' && thaiMeta?.tagline) || app.tagline;
    const description = (this.currentLang === 'th' && thaiMeta?.description) || app.description;

    return `
      <div class="app-card" data-app-id="${app.id}">
        <div class="app-card-glow" style="background: ${app.color};"></div>
        
        <div class="app-card-top">
          <div class="app-card-icon" style="background: linear-gradient(135deg, ${app.color}, rgba(255,255,255,0.1)); overflow: hidden; position: relative;">
            <img src="./assets/branding/${app.id}-studio-emblem.jpg" alt="${app.name}" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'" />
            ${this.getAppIconSvg(app.icon)}
          </div>
          <div class="app-card-headings">
            <div class="app-card-name">
              <span>${app.name}</span>
              <span class="app-card-version">v${app.version}</span>
            </div>
            <div class="app-card-tagline">${tagline}</div>
          </div>
        </div>

        <div class="app-card-desc">${description}</div>

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
    const t = this.t;

    if (downloading) {
      const mbDownloaded = (downloading.downloadedBytes / (1024 * 1024)).toFixed(1);
      const mbTotal = (downloading.totalBytes / (1024 * 1024)).toFixed(1);
      const speedStr = downloading.speedFormatted || formatSpeed(downloading.speedBps);

      return `
        <div class="download-progress-box">
          <div class="download-progress-header">
            <span>${t.installing(downloading.percent)}</span>
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
          ${t.comingSoon}
        </button>
      `;
    }

    if (app.inDevelopment) {
      return `
        <button class="btn-action disabled" disabled>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
          ${t.inDevelopment}
        </button>
      `;
    }

    // Dual-Action Launch for ready apps (mePDF, mePhoto)
    const isMenuOpen = this.activeMenuAppId === app.id;

    return `
      <div class="card-action-dual">
        <button class="btn-action btn-action-web" data-action="open-web" data-app-id="${app.id}" title="100% In-Browser Private Execution • 0 Install Required" aria-label="${t.openWebStudio} for ${app.name}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
          <span>${t.openWebStudio}</span>
        </button>

        ${
          app.status === 'installed'
            ? `
          <div class="desktop-action-group">
            <button class="btn-action btn-action-desktop launch" data-action="launch" data-app-id="${app.id}" aria-label="${t.launchDesktop} for ${app.name}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              <span>${t.launchDesktop}</span>
            </button>
            <button class="btn-more" data-action="more" data-app-id="${app.id}" title="${t.moreOptions}" aria-label="${t.moreOptions} for ${app.name}" aria-haspopup="menu" aria-expanded="${isMenuOpen}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
            </button>
            ${
              isMenuOpen
                ? `
              <div class="context-menu" role="menu" aria-label="${app.name} options" data-menu-id="${app.id}">
                <button class="context-menu-item" role="menuitem" data-menu-action="open-folder" data-app-id="${app.id}">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                  ${t.openFolder}
                </button>
                <button class="context-menu-item" role="menuitem" data-menu-action="check-updates" data-app-id="${app.id}">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6"></path><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
                  ${t.checkUpdates}
                </button>
                <div style="height: 1px; background: var(--border-subtle); margin: 4px 0;"></div>
                <button class="context-menu-item danger" role="menuitem" data-menu-action="uninstall" data-app-id="${app.id}">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  ${t.uninstall}
                </button>
              </div>
            `
                : ''
            }
          </div>
        `
            : `
          <button class="btn-action btn-action-desktop install" data-action="install" data-app-id="${app.id}" aria-label="${t.installDesktop(app.sizeFormatted || 'v' + app.version)} for ${app.name}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            <span>${t.installDesktop(app.sizeFormatted || 'v' + app.version)}</span>
          </button>
        `
        }
      </div>
    `;
  }

  private renderRecentProjects() {
    const t = this.t;
    const container = document.getElementById('recent-projects-list');
    const badge = document.getElementById('recent-count');
    const clearBtn = document.getElementById('btn-clear-recents');
    if (!container) return;

    if (badge) badge.textContent = t.recentCount(this.recentProjects.length);
    if (clearBtn) clearBtn.style.display = this.recentProjects.length > 0 ? 'flex' : 'none';

    if (this.recentProjects.length === 0) {
      container.innerHTML = `
        <div class="empty-recents">
          ${t.emptyRecents}
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
          this.bridge.launchApp({ appId, filePath: path, target: 'web' });
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
    // Open Web Studio button
    document.querySelectorAll('[data-action="open-web"]').forEach((btn: Element) => {
      btn.addEventListener('click', (e: Event) => {
        const appId = (e.currentTarget as HTMLElement).dataset.appId;
        if (appId) this.handleLaunchWeb(appId);
      });
    });

    // Install Desktop button
    document.querySelectorAll('[data-action="install"]').forEach((btn: Element) => {
      btn.addEventListener('click', (e: Event) => {
        const appId = (e.currentTarget as HTMLElement).dataset.appId;
        if (appId) this.handleInstall(appId);
      });
    });

    // Launch Desktop button
    document.querySelectorAll('[data-action="launch"]').forEach((btn: Element) => {
      btn.addEventListener('click', (e: Event) => {
        const appId = (e.currentTarget as HTMLElement).dataset.appId;
        if (appId) this.handleLaunchDesktop(appId);
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
          this.showNoticeModal(this.t.updateDialogTitle(appId.toUpperCase()), msg);
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
      this.applyLanguage();
    });

    // Universal Drop Zone Drag & Drop
    const dropzone = document.getElementById('hub-dropzone');
    const fileInput = document.getElementById('hub-file-input') as HTMLInputElement | null;
    const browseBtn = document.getElementById('btn-browse-hub');

    if (dropzone) {
      ['dragenter', 'dragover'].forEach((eventName) => {
        dropzone.addEventListener(eventName, (e: Event) => {
          e.preventDefault();
          e.stopPropagation();
          dropzone.classList.add('drag-active');
        });
      });

      ['dragleave', 'dragend', 'drop'].forEach((eventName) => {
        dropzone.addEventListener(eventName, (e: Event) => {
          e.preventDefault();
          e.stopPropagation();
          dropzone.classList.remove('drag-active');
        });
      });

      dropzone.addEventListener('drop', (e: DragEvent) => {
        const files = e.dataTransfer?.files;
        if (files && files.length > 0) {
          const file = files[0];
          if (file) {
            void this.handleDroppedFile(file);
          }
        }
      });

      dropzone.addEventListener('click', (e: MouseEvent) => {
        if (e.target !== browseBtn && !browseBtn?.contains(e.target as Node)) {
          fileInput?.click();
        }
      });
    }

    if (browseBtn && fileInput) {
      browseBtn.addEventListener('click', (e: MouseEvent) => {
        e.stopPropagation();
        fileInput.click();
      });
    }

    if (fileInput) {
      fileInput.addEventListener('change', () => {
        const file = fileInput.files?.[0];
        if (file) {
          void this.handleDroppedFile(file);
        }
        fileInput.value = '';
      });
    }

    // Dismiss context menu on global click
    document.addEventListener('click', () => {
      if (this.activeMenuAppId) {
        this.activeMenuAppId = null;
        this.renderCatalog();
      }
    });
  }

  private applyLanguage() {
    const t = this.t;
    document.documentElement.lang = this.currentLang;
    if (this.currentLang === 'th') {
      this.appEl.classList.add('lang-th');
    } else {
      this.appEl.classList.remove('lang-th');
    }

    // Update Header
    const brandTitle = document.getElementById('header-brand-title');
    if (brandTitle) brandTitle.textContent = t.brandTitle;
    const brandBadge = document.getElementById('header-brand-badge');
    if (brandBadge) brandBadge.textContent = t.brandTag;
    const brandSubtitle = document.getElementById('header-brand-subtitle');
    if (brandSubtitle) brandSubtitle.textContent = t.brandSubtitle;
    const networkLabel = document.getElementById('header-network-label');
    if (networkLabel) networkLabel.textContent = t.networkConnected;
    const langLabel = document.getElementById('lang-label');
    if (langLabel) langLabel.textContent = t.langBtn;
    const settingsLabel = document.getElementById('btn-settings-label');
    if (settingsLabel) settingsLabel.textContent = t.settingsBtn;

    // Update Hero
    const heroTitle = document.getElementById('hero-title');
    if (heroTitle) heroTitle.textContent = t.heroTitle;
    const heroSubtitle = document.getElementById('hero-subtitle');
    if (heroSubtitle) heroSubtitle.textContent = t.heroSubtitle;

    const heroBadges = document.getElementById('hero-badges');
    if (heroBadges) {
      heroBadges.innerHTML = `
        <div class="hero-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          <span>${t.badgePrivacy}</span>
        </div>
        <div class="hero-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
          <span>${t.badgeDesktop}</span>
        </div>
        <div class="hero-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
          <span>${t.badgeOcr}</span>
        </div>
        <div class="hero-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
          <span>${t.badgeHomography}</span>
        </div>
      `;
    }

    // Update Drop Zone
    const dropzoneTitle = document.getElementById('dropzone-title');
    if (dropzoneTitle) dropzoneTitle.textContent = t.dropZoneTitle;
    const dropzoneSubtitle = document.getElementById('dropzone-subtitle');
    if (dropzoneSubtitle) dropzoneSubtitle.textContent = t.dropZoneSubtitle;
    const browseHubText = document.getElementById('btn-browse-hub-text');
    if (browseHubText) browseHubText.textContent = t.dropZoneBtn;

    // Update Catalog Section
    const catalogTitle = document.getElementById('catalog-section-title');
    if (catalogTitle) catalogTitle.textContent = t.catalogTitle;
    const catalogCount = document.getElementById('catalog-count');
    if (catalogCount) catalogCount.textContent = t.catalogCount(this.catalog.length);

    // Update Filter Tabs
    const fAll = document.getElementById('filter-all');
    if (fAll) fAll.textContent = t.filterAll;
    const fInstalled = document.getElementById('filter-installed');
    if (fInstalled) fInstalled.textContent = t.filterInstalled;
    const fDoc = document.getElementById('filter-doc');
    if (fDoc) fDoc.textContent = t.filterDoc;
    const fGraphics = document.getElementById('filter-graphics');
    if (fGraphics) fGraphics.textContent = t.filterGraphics;

    // Update Recents Section
    const recentsTitle = document.getElementById('recents-section-title');
    if (recentsTitle) recentsTitle.textContent = t.recentProjectsTitle;
    const clearRecentsBtn = document.getElementById('btn-clear-recents');
    if (clearRecentsBtn) clearRecentsBtn.textContent = t.clearHistory;

    // Re-render dynamic list areas
    this.renderCatalog();
    this.renderRecentProjects();
  }

  public async handleDroppedFile(file: File): Promise<void> {
    const isPdf = file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf';
    const isImage =
      file.type.startsWith('image/') ||
      /\.(jpe?g|png|webp|avif|bmp|gif|svg)$/i.test(file.name);

    if (!isPdf && !isImage) {
      this.showNoticeModal('Unsupported File', this.t.unsupportedFile, true);
      return;
    }

    const targetApp = isPdf ? 'mepdf' : 'mephoto';
    const fileType = isPdf ? 'pdf' : file.type || 'image/jpeg';

    // Read as Data URL for seamless cross-tab passing
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;

      // 1. Save to Universal Recent Projects
      await this.bridge.saveRecentProject({
        name: file.name,
        path: (file as any).path || file.name,
        appId: targetApp,
        fileType,
        sizeBytes: file.size,
      });

      await this.loadRecentProjects();
      this.renderRecentProjects();

      // 2. Launch target app with filePath and dataUrl
      await this.bridge.launchApp({
        appId: targetApp,
        filePath: (file as any).path || file.name,
        dataUrl,
        target: 'web',
      });
    };

    reader.readAsDataURL(file);
  }

  private async handleLaunchWeb(appId: string) {
    await this.bridge.launchApp({ appId, target: 'web' });
  }

  private async handleLaunchDesktop(appId: string) {
    const res = await this.bridge.launchApp({ appId, target: 'desktop' });
    if (!res.success) {
      this.showNoticeModal(
        this.t.launchErrorTitle(appId.toUpperCase()),
        res.error || 'Could not launch native desktop binary. You can also click "Open Web Studio" for instant 0-install in-browser execution.',
        true
      );
    }
  }

  private async handleInstall(appId: string) {
    const app = this.catalog.find((a: AppCatalogItem) => a.id === appId);
    if (!app) return;

    const directExeUrl = `https://github.com/methastrategy/meCraft/releases/download/v${app.version}/${app.exeName}`;
    const setupExeUrl = `https://github.com/methastrategy/meCraft/releases/download/v${app.version}/${app.id}-setup.exe`;
    const msiUrl = `https://github.com/methastrategy/meCraft/releases/download/v${app.version}/${app.id}.msi`;

    // On Web Browser: trigger immediate direct .exe download and show download options modal
    if (!this.bridge.isTauri) {
      if (typeof document !== 'undefined') {
        const a = document.createElement('a');
        a.href = directExeUrl;
        a.download = app.exeName;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }

      this.showDownloadModal(app, directExeUrl, setupExeUrl, msiUrl);
      return;
    }

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
      this.showNoticeModal(this.t.installErrorTitle(appId.toUpperCase()), result.error || 'Unknown error during installation', true);
      this.renderCatalog();
    }
  }

  private showDownloadModal(app: AppCatalogItem, directExeUrl: string, setupExeUrl: string, msiUrl: string) {
    const container = document.getElementById('modal-container');
    if (!container) return;
    const t = this.t;

    container.innerHTML = `
      <div class="modal-overlay" id="download-overlay">
        <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="download-dialog-title" style="max-width: 540px;">
          <div class="modal-header">
            <div>
              <div class="modal-title" id="download-dialog-title" style="display: flex; align-items: center; gap: 8px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${app.color}" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                <span>${t.downloadModalTitle(app.name)}</span>
              </div>
              <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">${t.downloadModalSubtitle}</div>
            </div>
            <button class="btn-more" id="btn-close-download-modal" aria-label="Close dialog">✕</button>
          </div>
          <div class="modal-body" style="display: flex; flex-direction: column; gap: 12px; padding: 18px;">
            <!-- Option 1: Direct Standalone .exe -->
            <a href="${directExeUrl}" download="${app.exeName}" class="download-option-card recommended" style="text-decoration: none; display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; background: var(--surface-raised); border: 1px solid rgba(99, 102, 241, 0.4); border-radius: var(--radius-md); transition: all var(--duration-fast); cursor: pointer;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 36px; height: 36px; border-radius: var(--radius-sm); background: rgba(99, 102, 241, 0.2); display: flex; align-items: center; justify-content: center; color: var(--primary);">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                </div>
                <div>
                  <div style="font-weight: 600; font-size: 13.5px; color: var(--text-primary); display: flex; align-items: center; gap: 6px;">
                    ${t.downloadDirectExeTitle}
                    <span style="font-size: 10px; background: var(--primary); color: white; padding: 1px 6px; border-radius: 4px; font-weight: 700;">.EXE</span>
                  </div>
                  <div style="font-size: 11.5px; color: var(--text-muted); margin-top: 2px;">${t.downloadDirectExeDesc}</div>
                </div>
              </div>
              <span class="btn-action btn-action-web" style="width: auto; height: 32px; padding: 0 14px; font-size: 12px; flex-shrink: 0;">Download</span>
            </a>

            <!-- Option 2: Setup Wizard .exe -->
            <a href="${setupExeUrl}" download="${app.id}-setup.exe" class="download-option-card" style="text-decoration: none; display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; background: var(--surface-base); border: 1px solid var(--border-medium); border-radius: var(--radius-md); transition: all var(--duration-fast); cursor: pointer;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 36px; height: 36px; border-radius: var(--radius-sm); background: rgba(16, 185, 129, 0.2); display: flex; align-items: center; justify-content: center; color: var(--success);">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                </div>
                <div>
                  <div style="font-weight: 600; font-size: 13.5px; color: var(--text-primary); display: flex; align-items: center; gap: 6px;">
                    ${t.downloadSetupExeTitle}
                    <span style="font-size: 10px; background: var(--success); color: white; padding: 1px 6px; border-radius: 4px; font-weight: 700;">SETUP</span>
                  </div>
                  <div style="font-size: 11.5px; color: var(--text-muted); margin-top: 2px;">${t.downloadSetupExeDesc}</div>
                </div>
              </div>
              <span class="btn-action" style="width: auto; height: 32px; padding: 0 14px; font-size: 12px; background: var(--surface-hover); color: var(--text-primary); border: 1px solid var(--border-medium); flex-shrink: 0;">Download</span>
            </a>

            <!-- Option 3: MSI Installer -->
            <a href="${msiUrl}" download="${app.id}.msi" class="download-option-card" style="text-decoration: none; display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; background: var(--surface-base); border: 1px solid var(--border-medium); border-radius: var(--radius-md); transition: all var(--duration-fast); cursor: pointer;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 36px; height: 36px; border-radius: var(--radius-sm); background: rgba(6, 182, 212, 0.2); display: flex; align-items: center; justify-content: center; color: var(--accent-cyan);">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                </div>
                <div>
                  <div style="font-weight: 600; font-size: 13.5px; color: var(--text-primary); display: flex; align-items: center; gap: 6px;">
                    ${t.downloadMsiTitle}
                    <span style="font-size: 10px; background: var(--accent-cyan); color: #042f2e; padding: 1px 6px; border-radius: 4px; font-weight: 700;">.MSI</span>
                  </div>
                  <div style="font-size: 11.5px; color: var(--text-muted); margin-top: 2px;">${t.downloadMsiDesc}</div>
                </div>
              </div>
              <span class="btn-action" style="width: auto; height: 32px; padding: 0 14px; font-size: 12px; background: var(--surface-hover); color: var(--text-primary); border: 1px solid var(--border-medium); flex-shrink: 0;">Download</span>
            </a>
          </div>
          <div class="modal-footer" style="display: flex; justify-content: space-between; align-items: center; padding: 12px 18px; border-top: 1px solid var(--border-subtle);">
            <a href="https://github.com/methastrategy/meCraft/releases/tag/v${app.version}" target="_blank" rel="noopener noreferrer" style="font-size: 12px; color: var(--primary); text-decoration: none; display: flex; align-items: center; gap: 4px;">
              <span>${t.viewAllReleases}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            </a>
            <button class="btn-action btn-action-desktop" id="btn-close-download-done" style="width: auto; padding: 0 16px;">${t.doneBtn}</button>
          </div>
        </div>
      </div>
    `;

    const close = () => { container.innerHTML = ''; };
    document.getElementById('btn-close-download-modal')?.addEventListener('click', close);
    document.getElementById('btn-close-download-done')?.addEventListener('click', close);
    document.getElementById('download-overlay')?.addEventListener('click', (e) => {
      if (e.target === document.getElementById('download-overlay')) close();
    });
  }

  private showNoticeModal(title: string, message: string, isError = false) {
    const container = document.getElementById('modal-container');
    if (!container) return;
    container.innerHTML = `
      <div class="modal-overlay" id="notice-overlay">
        <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="notice-dialog-title" style="max-width: 440px;">
          <div class="modal-header">
            <div class="modal-title" id="notice-dialog-title">${title}</div>
            <button class="btn-more" id="btn-close-notice-modal" aria-label="Close dialog">✕</button>
          </div>
          <div class="modal-body selectable" style="padding: 16px 0; color: ${isError ? '#ef4444' : 'var(--text-primary)'};">
            ${message}
          </div>
          <div class="modal-footer">
            <button class="btn-header primary" id="btn-notice-done" aria-label="Acknowledge and close">${this.t.doneBtn}</button>
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
    const t = this.t;
    const container = document.getElementById('modal-container');
    if (!container) return;
    container.innerHTML = `
      <div class="modal-overlay" id="folder-overlay">
        <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="folder-dialog-title" style="max-width: 480px;">
          <div class="modal-header">
            <div class="modal-title" id="folder-dialog-title">${appId.toUpperCase()} ${t.openFolder}</div>
            <button class="btn-more" id="btn-close-folder-modal" aria-label="Close dialog">✕</button>
          </div>
          <div class="modal-body" style="padding: 16px 0;">
            <p style="margin: 0 0 8px 0; font-size: 13px; color: var(--text-secondary);">${t.storageDirLabel}:</p>
            <input type="text" readonly value="${directory}" class="selectable" id="folder-path-input" style="width: 100%; padding: 8px 12px; background: var(--surface-base); border: 1px solid var(--border-medium); border-radius: var(--radius-sm); color: var(--text-primary); font-family: var(--font-mono); font-size: 12px;" />
          </div>
          <div class="modal-footer" style="display: flex; justify-content: flex-end; gap: 8px;">
            <button class="btn-header" id="btn-copy-folder" aria-label="${t.copyPathBtn}">${t.copyPathBtn}</button>
            <button class="btn-header primary" id="btn-folder-done" aria-label="${t.doneBtn}">${t.doneBtn}</button>
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
      if (copyBtn) copyBtn.textContent = t.copiedBtn;
    });
    document.getElementById('folder-overlay')?.addEventListener('click', (ev: MouseEvent) => {
      if (ev.target === ev.currentTarget) closeFolder();
    });
  }

  private showSettingsModal() {
    const t = this.t;
    const container = document.getElementById('modal-container')!;
    container.innerHTML = `
      <div class="modal-overlay" id="settings-overlay">
        <div class="modal-dialog settings-modal" role="dialog" aria-modal="true" aria-labelledby="settings-dialog-title">
          <div class="modal-header">
            <div class="modal-title-group">
              <div class="modal-title" id="settings-dialog-title">${t.settingsTitle}</div>
              <div class="modal-subtitle">meCraft Hub v3.1.0 • Ecosystem Status & Privacy Diagnostics</div>
            </div>
            <button class="btn-more" id="btn-close-modal" aria-label="Close settings dialog">✕</button>
          </div>

          <div class="modal-body settings-body">
            <!-- Section 1: System Health Check -->
            <div class="settings-section">
              <div class="settings-section-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                <span>${t.healthTitle}</span>
              </div>

              <div class="health-grid">
                <div class="health-card active">
                  <div class="health-card-top">
                    <span class="health-dot ready"></span>
                    <span class="health-app-name">mePDF Studio</span>
                    <span class="health-badge ready">v3.1.0 Ready</span>
                  </div>
                  <div class="health-desc">Client-Side PDF Engine • AES-256 Crypto • Searchable OCR Layer Injection</div>
                </div>

                <div class="health-card active">
                  <div class="health-card-top">
                    <span class="health-dot ready"></span>
                    <span class="health-app-name">mePhoto Studio</span>
                    <span class="health-badge ready">v1.0.0 Ready</span>
                  </div>
                  <div class="health-desc">4-Point Homography Deskew • Adaptive Otsu B&W • Magic Color • ClipBus Relay</div>
                </div>

                <div class="health-card draft">
                  <div class="health-card-top">
                    <span class="health-dot draft"></span>
                    <span class="health-app-name">meVector</span>
                    <span class="health-badge draft">v0.1.0 Pipeline</span>
                  </div>
                  <div class="health-desc">Bézier Curve Engine • SVG Vector Workbench • Node Pen Operations</div>
                </div>

                <div class="health-card draft">
                  <div class="health-card-top">
                    <span class="health-dot draft"></span>
                    <span class="health-app-name">meDoc</span>
                    <span class="health-badge draft">v0.1.0 Pipeline</span>
                  </div>
                  <div class="health-desc">Distraction-Free Zen Typewriter • Markdown LaTeX Math Preview</div>
                </div>
              </div>

              <div class="health-runtime-box">
                <span class="runtime-tag">${t.runtimeLabel}:</span>
                <strong>${this.bridge.isTauri() ? t.runtimeTauri : t.runtimeWeb}</strong>
              </div>
            </div>

            <!-- Section 2: Privacy Guarantee -->
            <div class="settings-section privacy-box">
              <div class="privacy-box-header">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                <span>${t.privacyGuaranteeTitle}</span>
              </div>
              <p class="privacy-box-desc">${t.privacyGuaranteeText}</p>
            </div>

            <!-- Section 3: Storage & Preferences -->
            <div class="settings-section">
              <div>
                <label style="display: block; font-weight: 600; margin-bottom: 6px;">${t.storageDirLabel}</label>
                <input type="text" readonly value="%LOCALAPPDATA%\\meCraft\\apps\\" class="selectable" style="width: 100%; padding: 8px 12px; background: var(--surface-base); border: 1px solid var(--border-medium); border-radius: var(--radius-sm); color: var(--text-primary); font-family: var(--font-mono); font-size: 12px;" />
              </div>
              <div style="margin-top: 10px;">
                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                  <input type="checkbox" checked />
                  <span>${t.autoCheckLabel}</span>
                </label>
              </div>
              <div style="margin-top: 6px;">
                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                  <input type="checkbox" checked />
                  <span>${t.hwAccelLabel}</span>
                </label>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-header primary" id="btn-modal-done" aria-label="Save settings and close">${t.doneBtn}</button>
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
