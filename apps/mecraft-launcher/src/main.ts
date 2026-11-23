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
  navProducts: string;
  navDropzone: string;
  navPrivacy: string;
  navRoadmap: string;
  navSpecs: string;
  heroPill: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCtaLaunchPdf: string;
  heroCtaLaunchPhoto: string;
  heroCtaDownload: string;
  badgePrivacy: string;
  badgeDesktop: string;
  badgeOcr: string;
  badgeHomography: string;
  spotlightTabPdf: string;
  spotlightTabPhoto: string;
  spotlightTabCraft: string;
  dropZoneTitle: string;
  dropZoneSubtitle: string;
  dropZoneBtn: string;
  dropZoneRouting: (app: string) => string;
  dropZonePledge: string;
  showcasePdfEyebrow: string;
  showcasePdfTitle: string;
  showcasePdfSubtitle: string;
  pdfFeature1Title: string;
  pdfFeature1Desc: string;
  pdfFeature2Title: string;
  pdfFeature2Desc: string;
  pdfFeature3Title: string;
  pdfFeature3Desc: string;
  pdfFeature4Title: string;
  pdfFeature4Desc: string;
  showcasePhotoEyebrow: string;
  showcasePhotoTitle: string;
  showcasePhotoSubtitle: string;
  photoFeature1Title: string;
  photoFeature1Desc: string;
  photoFeature2Title: string;
  photoFeature2Desc: string;
  photoFeature3Title: string;
  photoFeature3Desc: string;
  photoFeature4Title: string;
  photoFeature4Desc: string;
  showcaseHubEyebrow: string;
  showcaseHubTitle: string;
  showcaseHubSubtitle: string;
  hubFeature1Title: string;
  hubFeature1Desc: string;
  hubFeature2Title: string;
  hubFeature2Desc: string;
  hubFeature3Title: string;
  hubFeature3Desc: string;
  hubFeature4Title: string;
  hubFeature4Desc: string;
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
  roadmapEyebrow: string;
  roadmapTitle: string;
  roadmapSubtitle: string;
  statusInDev: string;
  statusComingSoon: string;
  statusSister: string;
  privacyEyebrow: string;
  privacyTitle: string;
  privacySubtitle: string;
  privacyColMetric: string;
  privacyColCloud: string;
  privacyColMecraft: string;
  privacyRow1Metric: string;
  privacyRow1Cloud: string;
  privacyRow1Mecraft: string;
  privacyRow2Metric: string;
  privacyRow2Cloud: string;
  privacyRow2Mecraft: string;
  privacyRow3Metric: string;
  privacyRow3Cloud: string;
  privacyRow3Mecraft: string;
  privacyRow4Metric: string;
  privacyRow4Cloud: string;
  privacyRow4Mecraft: string;
  privacyRow5Metric: string;
  privacyRow5Cloud: string;
  privacyRow5Mecraft: string;
  specsEyebrow: string;
  specsTitle: string;
  specsSubtitle: string;
  specPwaTitle: string;
  specPwaDesc: string;
  specExeTitle: string;
  specExeDesc: string;
  specNsisTitle: string;
  specNsisDesc: string;
  specMsiTitle: string;
  specMsiDesc: string;
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
  footerBrandDesc: string;
  footerColProducts: string;
  footerColArch: string;
  footerColCommunity: string;
  footerRights: string;
}

export const TRANSLATIONS: Record<'en' | 'th', LauncherTranslations> = {
  en: {
    brandTitle: 'meCrafts',
    brandTag: 'Official Suite',
    brandSubtitle: 'The Creative & Document Workstation Ecosystem',
    networkConnected: '100% Private Local',
    networkOffline: 'Offline Sandbox',
    settingsBtn: 'Settings & Health',
    langBtn: 'TH',
    navProducts: 'Products',
    navDropzone: 'Drop Hub',
    navPrivacy: 'Privacy Architecture',
    navRoadmap: 'Future Pipeline',
    navSpecs: 'Specs & Downloads',
    heroPill: 'v3.2.1 • 100% Client-Side In-Browser & Native Desktop Workstation Suite',
    heroTitle: 'The Private-First Creative & Document Workstation Suite',
    heroSubtitle: 'Professional-grade client-side PDF engineering, CamScanner-grade document lab, and non-destructive image enhancement. Zero telemetry. Zero file uploads. 100% private in-browser WebAssembly & native Windows performance.',
    heroCtaLaunchPdf: 'Launch mePDF Studio',
    heroCtaLaunchPhoto: 'Launch mePhoto Studio',
    heroCtaDownload: 'Download for Windows',
    badgePrivacy: '100% In-Browser Privacy',
    badgeDesktop: 'Offline PWA + Native Desktop',
    badgeOcr: 'Searchable Client OCR',
    badgeHomography: '4-Point Homography Deskew',
    spotlightTabPdf: 'mePDF Studio',
    spotlightTabPhoto: 'mePhoto Studio',
    spotlightTabCraft: 'meCraft Workstation',
    dropZoneTitle: 'Drop any PDF or Image here to test zero-cloud routing live',
    dropZoneSubtitle: 'Auto-routes PDF to mePDF Studio • Images to mePhoto Studio • 100% Private In-Browser Execution',
    dropZoneBtn: 'Browse Local File...',
    dropZoneRouting: (app) => `Routing to ${app}...`,
    dropZonePledge: 'Zero-Cloud Guarantee: Files are processed directly in browser RAM via Web Workers. 0 bytes ever leave your device.',
    showcasePdfEyebrow: 'DOCUMENT COCKPIT',
    showcasePdfTitle: 'mePDF Studio — Client-Side PDF Engineering',
    showcasePdfSubtitle: 'High-performance document workbench with client-side merge, split, dual-engine compression, military AES-256 encryption, and searchable OCR text injection.',
    pdfFeature1Title: 'Dual-Engine Smart Compression',
    pdfFeature1Desc: 'Choose between lossless vector optimization for contracts or scanned downsampling for high-volume archiving.',
    pdfFeature2Title: 'Military-Grade AES-256 Security',
    pdfFeature2Desc: 'In-browser password protection and permissions lockdown. Your documents and keys never touch a remote server.',
    pdfFeature3Title: 'Visual Page Cockpit',
    pdfFeature3Desc: 'Drag-and-drop page reordering, 90°/180° rotation, page extraction, splitting, and multi-file merging in real time.',
    pdfFeature4Title: 'Searchable Offline OCR',
    pdfFeature4Desc: 'Client-side Tesseract OCR engine generates an invisible, searchable text layer directly into scanned PDFs.',
    showcasePhotoEyebrow: 'COMPUTER VISION LAB',
    showcasePhotoTitle: 'mePhoto Studio — Document & Photo Lab',
    showcasePhotoSubtitle: 'CamScanner-grade document restoration and non-destructive image enhancement with sub-pixel 4-point homography and adaptive binarization.',
    photoFeature1Title: '4-Point Homography Deskew',
    photoFeature1Desc: 'Perspective rectification matrix corrects angled photos taken on mobile devices into perfectly flat, rectangular scans.',
    photoFeature2Title: 'Adaptive Local Otsu Binarization',
    photoFeature2Desc: 'Advanced thresholding removes harsh shadows, wrinkles, and background ink bleeds for crystal-clear document printouts.',
    photoFeature3Title: 'Magic Color Document Filter',
    photoFeature3Desc: 'Enhances official ink stamps, logos, and signatures with vivid clarity while keeping paper backgrounds pure white.',
    photoFeature4Title: 'Non-Destructive Multi-Format Export',
    photoFeature4Desc: 'Hardware-accelerated Canvas & WebGL shaders export to high-DPI PNG, JPEG, WebP, and multi-page PDF files.',
    showcaseHubEyebrow: 'ECOSYSTEM ORCHESTRATOR',
    showcaseHubTitle: 'meCraft Hub — Universal Workstation Launcher',
    showcaseHubSubtitle: 'The central orchestration center connecting all meCraft tools with inter-process ClipBus communication, automatic file routing, and universal history.',
    hubFeature1Title: 'MIME-Based Auto Routing',
    hubFeature1Desc: 'Drag any supported file into the launcher, and it automatically launches the correct workstation studio in milliseconds.',
    hubFeature2Title: 'Cross-App ClipBus Relay',
    hubFeature2Desc: 'Seamlessly pass processed documents from mePhoto directly into mePDF without manual export or re-importing.',
    hubFeature3Title: 'Universal Recent Projects',
    hubFeature3Desc: 'Persistent local storage registry tracks your recent files across all tools without ever storing file contents in the cloud.',
    hubFeature4Title: 'Zero-Install Web PWA + Native Desktop',
    hubFeature4Desc: 'Run with zero installation directly on the web, or install the native Windows app for maximum multi-threading performance.',
    catalogTitle: 'Apps Catalog',
    catalogCount: (count) => `${count} Apps`,
    filterAll: 'All Apps',
    filterInstalled: 'Installed',
    filterDoc: 'Document Tools',
    filterGraphics: 'Creative & Graphics',
    openWebStudio: 'Open Web Studio',
    launchDesktop: 'Launch Application',
    installDesktop: (size) => `Install into meCraft${size ? ` (${size})` : ''}`,
    installing: (percent) => `Installing... ${percent}%`,
    comingSoon: 'Coming Soon • Notify Me',
    inDevelopment: 'In Development',
    moreOptions: 'More Options',
    openFolder: 'Open Install Folder',
    checkUpdates: 'Check for Updates',
    uninstall: 'Uninstall App',
    roadmapEyebrow: 'EXPANDING UNIVERSE',
    roadmapTitle: 'Future Ecosystem Roadmap',
    roadmapSubtitle: 'meCrafts is continuously expanding with purpose-built creative and engineering workstations designed for focus, speed, and privacy.',
    statusInDev: 'In Development',
    statusComingSoon: 'Coming Soon',
    statusSister: 'Ecosystem Suite',
    privacyEyebrow: 'SECURITY ARCHITECTURE',
    privacyTitle: 'Why 100% In-Browser Privacy Matters',
    privacySubtitle: 'Traditional cloud PDF tools upload your sensitive financial statements, contracts, and IDs to unknown servers. meCrafts runs 100% inside your device sandbox.',
    privacyColMetric: 'Security Architecture Dimension',
    privacyColCloud: 'Traditional Cloud SaaS (Smallpdf / Adobe / ILovePDF)',
    privacyColMecraft: 'meCrafts Zero-Cloud Sandbox',
    privacyRow1Metric: 'File Data Ingress',
    privacyRow1Cloud: '100% of bytes uploaded to external cloud servers',
    privacyRow1Mecraft: '0 bytes transferred — 100% processed in local browser RAM',
    privacyRow2Metric: 'Processing Execution',
    privacyRow2Cloud: 'Remote server queue (bound by network bandwidth)',
    privacyRow2Mecraft: 'Local multi-threaded WebAssembly & Web Workers',
    privacyRow3Metric: 'Document Confidentiality',
    privacyRow3Cloud: 'High third-party data leak & server breach risk',
    privacyRow3Mecraft: 'Zero-trust sandbox — no remote persistence possible',
    privacyRow4Metric: 'Offline Availability',
    privacyRow4Cloud: 'Complete failure when internet drops or disconnects',
    privacyRow4Mecraft: 'Works 100% offline (Service Worker PWA & Windows Desktop)',
    privacyRow5Metric: 'Telemetry & Tracking',
    privacyRow5Cloud: 'Aggressive user telemetry, session replay, and analytics',
    privacyRow5Mecraft: 'Zero telemetry, zero behavioral tracking, zero cookies',
    specsEyebrow: 'CROSS-PLATFORM DEPLOYMENT',
    specsTitle: 'Run Everywhere • Choose Your Runtime',
    specsSubtitle: 'Deploy meCrafts across browser environments or install as native Windows applications with zero compromises.',
    specPwaTitle: 'Web Browser Edition (PWA)',
    specPwaDesc: 'Zero installation required. Instant access on Chrome, Edge, Safari, and Firefox with offline Service Worker support.',
    specExeTitle: 'Windows Portable (.exe)',
    specExeDesc: 'Self-contained single executable. Carry on a USB drive or run directly on any Windows workstation without administrator rights.',
    specNsisTitle: 'Windows Installer (Setup.exe)',
    specNsisDesc: 'Full desktop integration with Start Menu shortcuts, desktop icons, and Windows shell file association for PDF and images.',
    specMsiTitle: 'Enterprise Installer (.msi)',
    specMsiDesc: 'Silent automated deployment package built for IT administrators and enterprise system management policies.',
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
    downloadModalTitle: (app) => `Download meCraft Suite for Windows`,
    downloadModalSubtitle: 'Single unified installer • 100% Client-Side Private • Zero Cloud Leakage',
    downloadDirectExeTitle: 'meCraft-Setup.exe (Official Installer)',
    downloadDirectExeDesc: 'Single installer for the entire suite. Once installed, manage and launch mePDF and mePhoto directly inside the Hub.',
    downloadSetupExeTitle: 'Setup Wizard (.exe)',
    downloadSetupExeDesc: 'NSIS installer with Start Menu shortcuts, desktop icon, and system file associations.',
    downloadMsiTitle: 'Windows Installer (.msi)',
    downloadMsiDesc: 'Official MSI package for system administrators and Windows Installer management.',
    viewAllReleases: 'View All GitHub Releases & Checksums',
    footerBrandDesc: 'The modern private-first creative and document workstation suite. Engineered for speed, mathematical precision, and zero-compromise confidentiality.',
    footerColProducts: 'Products & Studios',
    footerColArch: 'Architecture & Security',
    footerColCommunity: 'Open Source & Legal',
    footerRights: 'Licensed under the MIT License. Copyright (c) 2026 Metha / methastrategy.',
  },
  th: {
    brandTitle: 'meCrafts',
    brandTag: 'ศูนย์กลางโปรแกรม',
    brandSubtitle: 'ระบบรวมเครื่องมือเอกสารและงานสร้างสรรค์ระดับโปร',
    networkConnected: 'ประมวลผลในเครื่อง 100%',
    networkOffline: 'ออฟไลน์ แซนด์บ็อกซ์',
    settingsBtn: 'การตั้งค่าและสถานะระบบ',
    langBtn: 'EN',
    navProducts: 'ผลิตภัณฑ์',
    navDropzone: 'วางไฟล์เปิดทันที',
    navPrivacy: 'สถาปัตยกรรมความปลอดภัย',
    navRoadmap: 'แผนงานในอนาคต',
    navSpecs: 'สเปกและดาวน์โหลด',
    heroPill: 'เวอร์ชัน 3.2.1 • สตูดิโอเอกสารและกราฟิก ประมวลผลในเครื่อง 100% ไร้คลาวด์',
    heroTitle: 'ชุดสตูดิโอจัดการเอกสารและภาพถ่าย ประมวลผลในเครื่อง 100% ไร้คลาวด์',
    heroSubtitle: 'รวมสตูดิโอวิศวกรรมเอกสาร PDF ระดับโปร, ห้องแล็บสแกนเอกสารด้วย Homography 4 จุด และแต่งภาพโดยไม่สูญเสียความละเอียด ปลอดภัยในเครื่อง 100% ไม่ส่งข้อมูลออกภายนอก',
    heroCtaLaunchPdf: 'เปิดใช้งาน mePDF Studio',
    heroCtaLaunchPhoto: 'เปิดใช้งาน mePhoto Studio',
    heroCtaDownload: 'ดาวน์โหลดสำหรับ Windows',
    badgePrivacy: 'ความเป็นส่วนตัวในเครื่อง 100%',
    badgeDesktop: 'PWA ออฟไลน์ + Windows .exe',
    badgeOcr: 'OCR แทรกข้อความค้นหาได้',
    badgeHomography: 'ปรับมุมเอียงด้วย Homography 4 จุด',
    spotlightTabPdf: 'mePDF Studio',
    spotlightTabPhoto: 'mePhoto Studio',
    spotlightTabCraft: 'meCraft Workstation',
    dropZoneTitle: 'ลากไฟล์ PDF หรือรูปภาพมาวางที่นี่ เพื่อทดสอบการประมวลผลในเครื่องสดๆ',
    dropZoneSubtitle: 'เปิดไฟล์ PDF ใน mePDF Studio อัตโนมัติ • รูปภาพเปิดใน mePhoto Studio • ปลอดภัยในเครื่อง ไม่ส่งออกภายนอก',
    dropZoneBtn: 'เลือกไฟล์จากเครื่อง...',
    dropZoneRouting: (app) => `กำลังเปิดใน ${app}...`,
    dropZonePledge: 'คำรับประกัน Zero-Cloud: ไฟล์ทั้งหมดประมวลผลในหน่วยความจำ RAM ของเบราว์เซอร์ผ่าน Web Workers ไม่เคยส่งข้อมูลออกสู่ภายนอกแม้แต่ไบต์เดียว',
    showcasePdfEyebrow: 'ค็อกพิทเอกสารระดับโปร',
    showcasePdfTitle: 'mePDF Studio — วิศวกรรมเอกสาร PDF ในเบราว์เซอร์',
    showcasePdfSubtitle: 'สตูดิโอจัดการ PDF ความเร็วสูง รวมไฟล์ แยกหน้า บีบอัดเอกสารสองโหมด เข้ารหัสผ่าน AES-256 มาตรฐานทหาร และระบบ OCR ข้อความในตัว',
    pdfFeature1Title: 'ระบบบีบอัดอัจฉริยะ Dual-Engine',
    pdfFeature1Desc: 'เลือกได้ระหว่างบีบอัดแบบ Lossless สำหรับเอกสารสัญญา หรือลดขนาดภาพสแกนสำหรับงานจัดเก็บเอกสารปริมาณมาก',
    pdfFeature2Title: 'ความปลอดภัยสูงสุด AES-256',
    pdfFeature2Desc: 'ตั้งรหัสผ่านและล็อกสิทธิ์การพิมพ์ คัดลอก แก้ไข ในเบราว์เซอร์โดยตรง รหัสผ่านและไฟล์ไม่เคยถูกส่งไปเซิร์ฟเวอร์',
    pdfFeature3Title: 'ค็อกพิทจัดเรียงหน้าแบบเห็นภาพ',
    pdfFeature3Desc: 'ลากสลับหน้า หมุนเอกสาร 90°/180° คัดแยกหน้า และรวมเอกสารหลายฉบับพร้อมกันแบบเรียลไทม์',
    pdfFeature4Title: 'OCR ออฟไลน์ค้นหาข้อความได้',
    pdfFeature4Desc: 'รู้จำตัวอักษรและแทรกเลเยอร์ข้อความโปร่งแสงลงใน PDF สแกน ทำให้ค้นหาและคัดลอกข้อความได้ทันที',
    showcasePhotoEyebrow: 'ห้องแล็บคอมพิวเตอร์วิทัศน์',
    showcasePhotoTitle: 'mePhoto Studio — แล็บสแกนเอกสารและปรับแต่งภาพ',
    showcasePhotoSubtitle: 'สตูดิโอแก้เอกสารสแกนระดับ CamScanner ดึงภาพเอียงให้แบนราบด้วย Homography 4 จุด และปรับสมดุลขาวดำตัดเงาแบบ Adaptive',
    photoFeature1Title: 'ดึงระนาบด้วย Homography 4 จุด',
    photoFeature1Desc: 'เมทริกซ์ปรับทัศนมิติแบบ Sub-pixel เปลี่ยนภาพถ่ายเอกสารมุมเอียงบนมือถือให้กลายเป็นเอกสารสแกนแนวราบสมบูรณ์',
    photoFeature2Title: 'Adaptive Local Otsu Binarization',
    photoFeature2Desc: 'อัลกอริทึมตัดเงาดำ รอยยับ และหมึกซึมด้านหลังเอกสาร แปลงเป็นขาวดำคมชัดระดับเอกสารราชการ',
    photoFeature3Title: 'ฟิลเตอร์สีเอกสาร Magic Color',
    photoFeature3Desc: 'คงความสดของตราประทับ ลายเซ็น และโลโก้สีอย่างคมชัด พร้อมฟอกพื้นกระดาษขาวสะอาดตา',
    photoFeature4Title: 'ส่งออกไฟล์แบบ Non-Destructive',
    photoFeature4Desc: 'ประมวลผลด้วยเชเดอร์ WebGL ความเร็วสูง ส่งออกภาพ High-DPI PNG, JPEG, WebP และรวมเป็นไฟล์ PDF หลายหน้า',
    showcaseHubEyebrow: 'ศูนย์กลางโปรแกรม',
    showcaseHubTitle: 'meCraft Hub — โปรแกรมเปิดใช้งานและส่งต่องาน',
    showcaseHubSubtitle: 'ศูนย์กลางเชื่อมโยงเครื่องมือทุกตัวในตระกูล meCraft พร้อมระบบสื่อสาร ClipBus ส่งผ่านไฟล์และจดจำประวัติงานอัตโนมัติ',
    hubFeature1Title: 'ตรวจสอบชนิดไฟล์และส่งต่ออัตโนมัติ',
    hubFeature1Desc: 'เพียงลากไฟล์เข้ามา ระบบจะตรวจสอบประเภทไฟล์และเรียกเปิดสตูดิโอที่ถูกต้องทันทีในเสี้ยววินาที',
    hubFeature2Title: 'ส่งต่องานข้ามแอพผ่าน ClipBus',
    hubFeature2Desc: 'ส่งเอกสารที่แต่งเสร็จจาก mePhoto ไปรวมเล่มใน mePDF ได้ทันทีโดยไม่ต้องบันทึกและเปิดซ้ำ',
    hubFeature3Title: 'ประวัติโปรเจกต์ล่าสุดในเครื่อง',
    hubFeature3Desc: 'บันทึกประวัติไฟล์ที่เคยใช้งานไว้ในเครื่องของคุณ ปลอดภัย ไม่มีการส่งประวัติไปยังเซิร์ฟเวอร์ภายนอก',
    hubFeature4Title: 'ใช้งานได้ทั้งเว็บ PWA และ Windows',
    hubFeature4Desc: 'เปิดใช้งานบนเว็บได้ทันทีโดยไม่ต้องติดตั้ง หรือติดตั้งโปรแกรม Windows เนทีฟเพื่อการทำงานแบบมัลติเธรดเต็มประสิทธิภาพ',
    catalogTitle: 'รายการโปรแกรมทั้งหมด',
    catalogCount: (count) => `${count} โปรแกรม`,
    filterAll: 'ทั้งหมด',
    filterInstalled: 'ติดตั้งแล้ว',
    filterDoc: 'จัดการเอกสาร',
    filterGraphics: 'กราฟิกและภาพถ่าย',
    openWebStudio: 'เปิด Web Studio',
    launchDesktop: 'เปิดใช้งานโปรแกรม',
    installDesktop: (size) => `ติดตั้งลงใน meCraft${size ? ` (${size})` : ''}`,
    installing: (percent) => `กำลังติดตั้ง... ${percent}%`,
    comingSoon: 'เร็วๆ นี้ • แจ้งเตือนเมื่อพร้อม',
    inDevelopment: 'กำลังอยู่ระหว่างพัฒนา',
    moreOptions: 'ตัวเลือกเพิ่มเติม',
    openFolder: 'เปิดโฟลเดอร์ติดตั้ง',
    checkUpdates: 'ตรวจสอบอัปเดต',
    uninstall: 'ถอนการติดตั้ง',
    roadmapEyebrow: 'ระบบนิเวศและแผนงาน',
    roadmapTitle: 'ผลิตภัณฑ์และโปรแกรมในอนาคต',
    roadmapSubtitle: 'meCrafts กำลังพัฒนาเครื่องมือเฉพาะทางสำหรับงานสร้างสรรค์ วิศวกรรม และการวิเคราะห์ข้อมูลอย่างต่อเนื่อง',
    statusInDev: 'กำลังพัฒนา',
    statusComingSoon: 'เร็วๆ นี้',
    statusSister: 'ผลิตภัณฑ์ในเครือ',
    privacyEyebrow: 'ความโปร่งใสทางสถาปัตยกรรม',
    privacyTitle: 'ทำไมความเป็นส่วนตัวในเครื่อง 100% จึงสำคัญ',
    privacySubtitle: 'เว็บแปลงไฟล์ PDF ทั่วไปจะอัปโหลดเอกสารธนาคาร สัญญา และบัตรประชาชนของคุณขึ้นเซิร์ฟเวอร์ภายนอก แต่ meCrafts ประมวลผลในเครื่องของคุณ 100%',
    privacyColMetric: 'มิติความปลอดภัยของข้อมูล',
    privacyColCloud: 'เว็บแปลงไฟล์ Cloud SaaS ทั่วไป',
    privacyColMecraft: 'แซนด์บ็อกซ์ Zero-Cloud ของ meCrafts',
    privacyRow1Metric: 'การส่งผ่านไฟล์ข้อมูล',
    privacyRow1Cloud: 'อัปโหลดข้อมูลไฟล์ 100% ไปยังเซิร์ฟเวอร์ภายนอก',
    privacyRow1Mecraft: '0 ไบต์ — ข้อมูลทั้งหมดประมวลผลในหน่วยความจำ RAM ของเครื่อง',
    privacyRow2Metric: 'สถาปัตยกรรมการรัน',
    privacyRow2Cloud: 'คิวเซิร์ฟเวอร์ภายนอก (ขึ้นอยู่กับความเร็วเน็ตและคิวผู้ใช้)',
    privacyRow2Mecraft: 'ประมวลผลด้วย WebAssembly และ Web Workers ในเครื่องคุณโดยตรง',
    privacyRow3Metric: 'การรักษาความลับเอกสาร',
    privacyRow3Cloud: 'มีความเสี่ยงต่อการรั่วไหลหรือการละเมิดข้อมูลบนเซิร์ฟเวอร์',
    privacyRow3Mecraft: 'ปลอดภัยระดับ Zero-Trust ไม่มีใครเข้าถึงเอกสารของคุณได้',
    privacyRow4Metric: 'ความพร้อมใช้ออฟไลน์',
    privacyRow4Cloud: 'ใช้งานไม่ได้ทันทีเมื่อเน็ตหลุดหรือไม่มีสัญญาณ',
    privacyRow4Mecraft: 'ทำงานออฟไลน์ได้ 100% ทั้งแบบ PWA และโปรแกรม Windows',
    privacyRow5Metric: 'การติดตามและ Telemetry',
    privacyRow5Cloud: 'มีการบันทึกพฤติกรรม สถิติ และ Telemetry ของผู้ใช้',
    privacyRow5Mecraft: 'ไม่มีการติดตามข้อมูล ไม่เก็บประวัติพฤติกรรม ไม่ใช้คุกกี้',
    specsEyebrow: 'รูปแบบการติดตั้งและใช้งาน',
    specsTitle: 'ใช้งานได้ทุกที่ • เลือกสภาวะแวดล้อมของคุณ',
    specsSubtitle: 'เปิดใช้งาน meCrafts ได้ทั้งบนเว็บเบราว์เซอร์ทันที หรือติดตั้งลงบน Windows เพื่อประสิทธิภาพสูงสุด',
    specPwaTitle: 'เว็บเบราว์เซอร์ PWA (ไม่ต้องติดตั้ง)',
    specPwaDesc: 'เปิดใช้งานได้ทันทีบน Chrome, Edge, Safari และ Firefox พร้อมระบบแคชออฟไลน์ในตัว',
    specExeTitle: 'โปรแกรมพกพา Windows Portable (.exe)',
    specExeDesc: 'ไฟล์เดียวจบ พกพาใส่แฟลชไดรฟ์เปิดใช้งานได้ทุกเครื่องโดยไม่ต้องมีสิทธิ์ผู้ดูแลระบบ',
    specNsisTitle: 'ตัวช่วยติดตั้งมาตรฐาน (Setup.exe)',
    specNsisDesc: 'ติดตั้งลงเครื่องพร้อมผูกไฟล์กับ Windows เมนูเริ่ม ไอคอนหน้าจอ และคลิกขวาเปิดไฟล์ได้ทันที',
    specMsiTitle: 'แพ็กเกจติดตั้งองค์กร (.msi)',
    specMsiDesc: 'ไฟล์ MSI สำหรับการติดตั้งอัตโนมัติในระดับระบบและการจัดการเครื่องลูกข่ายในองค์กร',
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
    downloadModalTitle: (app) => `ดาวน์โหลดชุดโปรแกรม meCraft สำหรับ Windows`,
    downloadModalSubtitle: 'ตัวติดตั้งหนึ่งเดียว • ทำงานในเครื่อง 100% • ปลอดภัยไม่ส่งข้อมูลออกภายนอก',
    downloadDirectExeTitle: 'meCraft-Setup.exe (ตัวช่วยติดตั้งอย่างเป็นทางการ)',
    downloadDirectExeDesc: 'ติดตั้งตัวเดียวจบ สามารถติดตั้งและเปิดใช้งานโปรแกรมทั้งชุด (mePDF, mePhoto) ได้จากภายใน meCraft ได้ทันที',
    downloadSetupExeTitle: 'ตัวช่วยติดตั้ง (.exe Setup)',
    downloadSetupExeDesc: 'ติดตั้งลงเครื่องแบบมาตรฐาน พร้อมสร้างไอคอนหน้าจอ เมนูเริ่ม และผูกไฟล์กับระบบ',
    downloadMsiTitle: 'แพ็กเกจติดตั้ง (.msi Installer)',
    downloadMsiDesc: 'ไฟล์ MSI สำหรับการติดตั้งระดับระบบ Windows และการจัดการในองค์กร',
    viewAllReleases: 'ดูรายการไฟล์และประวัติการปล่อยเวอร์ชันบน GitHub',
    footerBrandDesc: 'ชุดเครื่องมือสตูดิโอจัดการเอกสารและภาพถ่ายส่วนตัว ประมวลผลในเครื่อง 100% ด้วยความเร็ว ความแม่นยำ และความลับสูงสุด',
    footerColProducts: 'รายการโปรแกรมและสตูดิโอ',
    footerColArch: 'สถาปัตยกรรมและความปลอดภัย',
    footerColCommunity: 'โอเพนซอร์สและลิขสิทธิ์',
    footerRights: 'ได้รับอนุญาตภายใต้สัญญาอนุญาต MIT License. ลิขสิทธิ์ (c) 2026 Metha / methastrategy.',
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

export interface RoadmapItem {
  id: string;
  name: string;
  category: string;
  taglineEn: string;
  taglineTh: string;
  descEn: string;
  descTh: string;
  status: 'in-dev' | 'coming-soon' | 'sister-suite';
  image: string;
  tags: string[];
}

export const ROADMAP_ITEMS: RoadmapItem[] = [
  {
    id: 'mevector',
    name: 'meVector',
    category: 'Graphics & Vector',
    taglineEn: 'Bézier Vector Illustration & SVG/PDF Graphic Workbench',
    taglineTh: 'เครื่องมือวาดภาพเวกเตอร์ ตัดต่อพาธ SVG และกราฟิก PDF',
    descEn: 'Precision Bézier vector curve editing, node pen operations, path boolean geometry, and ultra-crisp resolution-independent graphic export.',
    descTh: 'ตัดต่อเส้นพาธ Bézier เวกเตอร์ความแม่นยำสูง ดัดแปลงจุด Node ตรรกะพาธ และส่งออกเวกเตอร์ความละเอียดสูงคมชัดทุกขนาด',
    status: 'in-dev',
    image: './assets/branding/mecraft-hero-banner.jpg',
    tags: ['Vector', 'Bezier', 'SVG', 'Node Pen'],
  },
  {
    id: 'medoc',
    name: 'meDoc',
    category: 'Writing & Document',
    taglineEn: 'Distraction-Free Zen Typewriter & LaTeX Math Suite',
    taglineTh: 'โปรแกรมพิมพ์งานสมาธิสูง พิมพ์สูตรคณิตศาสตร์และ Markdown',
    descEn: 'Zen distraction-free typography, live LaTeX mathematical formula rendering, offline bilingual grammar assistance, and instant publication export.',
    descTh: 'จัดหน้าแบบ Zen ไร้สิ่งรบกวน แสดงสูตรสมการ LaTeX แบบเรียลไทม์ ตรวจไวยากรณ์ออฟไลน์สองภาษา และส่งออกสิ่งพิมพ์ได้ทันที',
    status: 'in-dev',
    image: './assets/branding/mecraft-hub-emblem.jpg',
    tags: ['Markdown', 'LaTeX', 'Typography', 'Focus'],
  },
  {
    id: 'mesurv',
    name: 'meSurv',
    category: 'Engineering & Survey',
    taglineEn: 'Professional Panoramic Land Surveying & Traverse Suite',
    taglineTh: 'วิศวกรรมสำรวจรังวัดแผนที่ คำนวณวงรอบและโครงข่ายพิกัด',
    descEn: 'High-precision coordinate geometry, total station traverse calculation, Bowditch network adjustment, and geodetic coordinate transformations.',
    descTh: 'คำนวณวงรอบรังวัด ปรับแก้ความคลาดเคลื่อน Bowditch แปลงพิกัดแผนที่ภูมิศาสตร์ และวิเคราะห์ข้อมูลสำรวจภาคสนาม',
    status: 'sister-suite',
    image: './hero_mesurv_panoramic.jpg',
    tags: ['Surveying', 'Traverse', 'Bowditch', 'GNSS'],
  },
  {
    id: 'meboard',
    name: 'meBoard',
    category: 'Quant & Finance',
    taglineEn: 'Quantitative Market Cockpit & Multi-Agent Intelligence',
    taglineTh: 'ค็อกพิทวิเคราะห์ตลาดการเงินเชิงปริมาณและระบบประเมินสัญญา',
    descEn: 'Real-time multi-asset technical telemetry, algorithmic backtest forensics, quantitative risk gating, and multi-agent consensus debates.',
    descTh: 'วิเคราะห์ตลาดการเงิน หุ้น คริปโต ด้วยการวิเคราะห์เชิงปริมาณ รันแบบจำลองย้อนหลัง และตรวจสอบความเสี่ยงอย่างเป็นระบบ',
    status: 'sister-suite',
    image: './hero_meboard_trading.jpg',
    tags: ['Quant', 'Backtest', 'Risk Gating', 'Trading'],
  },
  {
    id: 'huayork',
    name: 'huayork',
    category: 'Analytics & Math',
    taglineEn: 'Statistical Probability & Historical Pattern Analytics',
    taglineTh: 'เครื่องมือสถิติวิเคราะห์ความน่าจะเป็นและโครงสร้างตัวเลข',
    descEn: 'Bayesian frequency distribution modeling, combinatorial probability analysis, and algorithmic pattern clustering over historical archives.',
    descTh: 'วิเคราะห์การแจกแจงความถี่ตามสถิติเบย์เซียน การจัดหมู่ทางคณิตศาสตร์ และตรวจหารูปแบบตัวเลขในอดีตอย่างเป็นวิทยาศาสตร์',
    status: 'sister-suite',
    image: './hero_huayork_lottery.jpg',
    tags: ['Probability', 'Statistics', 'Bayesian', 'Analytics'],
  },
  {
    id: 'megamehub',
    name: 'meGameHub',
    category: 'Interactive & Games',
    taglineEn: 'WebAssembly Retro Arcade & Interactive Physics Simulator',
    taglineTh: 'ศูนย์รวมเกมอาร์เคดและระบบจำลองฟิสิกส์บนเบราว์เซอร์',
    descEn: 'Ultra-low-latency 60fps retro gaming engine running 100% in-browser with zero install via WebAssembly and Canvas hardware shaders.',
    descTh: 'สตูดิโอเกมอาร์เคดและแบบจำลองฟิสิกส์ เรนเดอร์ 60fps ลื่นไหลในเบราว์เซอร์ด้วย WebAssembly และ Canvas Hardware Shaders',
    status: 'sister-suite',
    image: './hero_megamehub_arcade.jpg',
    tags: ['WASM', '60 FPS', 'Arcade', 'Physics'],
  },
];

class MeCraftLauncher {
  private bridge = createLauncherBridge();
  private catalog: AppCatalogItem[] = getDefaultCatalog();
  private recentProjects: RecentProject[] = [];
  private activeFilter = 'all';
  private activeHeroTab: 'mepdf' | 'mephoto' | 'mecraft' = 'mepdf';
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
      <!-- Sticky Navigation Bar -->
      <header class="launcher-header">
        <div class="launcher-brand">
          <div class="launcher-logo" style="overflow: hidden; border-radius: var(--radius-sm); position: relative;">
            <img src="./assets/branding/mecraft-hub-emblem.jpg" alt="meCrafts" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'" />
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

        <nav class="launcher-nav-center" aria-label="Portal Navigation">
          <a class="portal-nav-link" href="#showcase-products" id="nav-products">${t.navProducts}</a>
          <a class="portal-nav-link" href="#hub-dropzone" id="nav-dropzone">${t.navDropzone}</a>
          <a class="portal-nav-link" href="#privacy-architecture" id="nav-privacy">${t.navPrivacy}</a>
          <a class="portal-nav-link" href="#future-ecosystem" id="nav-roadmap">${t.navRoadmap}</a>
          <a class="portal-nav-link" href="#spec-matrix" id="nav-specs">${t.navSpecs}</a>
        </nav>

        <div class="launcher-nav-right">
          <a href="https://github.com/methastrategy/meCraft/releases/download/v3.2.1/meCraft-Setup.exe" class="btn-action primary-gold" download="meCraft-Setup.exe" id="header-btn-download-mecraft" style="height: 36px; padding: 0 16px; font-size: 13px; text-decoration: none; display: flex; align-items: center; gap: 8px; font-weight: 700; white-space: nowrap;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            <span id="nav-download-label">${this.currentLang === 'th' ? 'ดาวน์โหลด meCraft (.exe)' : 'Download meCraft (.exe)'}</span>
          </a>
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

      <!-- Main Portal Content -->
      <main class="launcher-content">
        <!-- 1. Hero Showcase Section -->
        <section class="launcher-hero">
          <div class="hero-content">
            <div class="hero-header-row">
              <div class="hero-pill">
                <span class="hero-pill-dot"></span>
                <span id="hero-pill-text">${t.heroPill}</span>
              </div>
            </div>
            <h1 class="hero-title" id="hero-title">${t.heroTitle}</h1>
            <p class="hero-subtitle" id="hero-subtitle">${t.heroSubtitle}</p>

            <div class="spotlight-actions-row" style="margin-bottom: 24px; align-items: center; gap: 12px;">
              <a href="https://github.com/methastrategy/meCraft/releases/download/v3.2.1/meCraft-Setup.exe" download="meCraft-Setup.exe" class="btn-action primary-gold" id="hero-btn-download-direct" style="min-height: 48px; padding: 0 24px; font-weight: 800; font-size: 15px; text-decoration: none; display: inline-flex; align-items: center; gap: 10px; box-shadow: 0 4px 20px rgba(212, 175, 55, 0.45);">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                <span id="hero-btn-download-label">${this.currentLang === 'th' ? 'ดาวน์โหลด meCraft สำหรับ Windows (.exe)' : 'Download meCraft for Windows (.exe)'}</span>
              </a>

              <button class="btn-action" data-action="open-web" data-app-id="mepdf" style="min-height: 48px; padding: 0 20px; font-weight: 700; background: rgba(99, 102, 241, 0.15); border: 1px solid rgba(99, 102, 241, 0.4); color: #818cf8;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                <span id="hero-btn-mepdf">${t.heroCtaLaunchPdf}</span>
              </button>

              <button class="btn-action" data-action="open-web" data-app-id="mephoto" style="min-height: 48px; padding: 0 20px; font-weight: 700; background: rgba(6, 182, 212, 0.15); border: 1px solid rgba(6, 182, 212, 0.4); color: var(--accent-cyan);">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>
                <span id="hero-btn-mephoto">${t.heroCtaLaunchPhoto}</span>
              </button>

              <a href="https://github.com/methastrategy/meCraft/releases/download/v3.2.1/meCraft-Portable.exe" download="meCraft-Portable.exe" class="btn-header" style="min-height: 48px; padding: 0 16px; font-size: 13px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px;">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                <span>${this.currentLang === 'th' ? 'รุ่นพกพา (Portable .exe)' : 'Portable (.exe)'}</span>
              </a>
            </div>

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

            <!-- Interactive Spotlight Showcase Box -->
            <div class="hero-spotlight-wrapper">
              <div class="hero-preview-tabs" role="tablist">
                <button class="hero-tab-btn active" data-tab="mepdf" id="tab-spotlight-pdf">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                  <span>${t.spotlightTabPdf}</span>
                </button>
                <button class="hero-tab-btn" data-tab="mephoto" id="tab-spotlight-photo">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>
                  <span>${t.spotlightTabPhoto}</span>
                </button>
                <button class="hero-tab-btn" data-tab="mecraft" id="tab-spotlight-craft">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
                  <span>${t.spotlightTabCraft}</span>
                </button>
              </div>

              <div class="hero-spotlight-box">
                <div class="hero-spotlight-window-header">
                  <div class="window-dots">
                    <span class="window-dot close"></span>
                    <span class="window-dot min"></span>
                    <span class="window-dot max"></span>
                  </div>
                  <div class="window-title-address" id="spotlight-address-bar">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    <span>https://mecrafts.vercel.app/mepdf/</span>
                  </div>
                </div>

                <div class="hero-spotlight-display" id="hero-spotlight-display">
                  <div class="spotlight-media-container">
                    <img src="./hero_mepdf_studio.jpg" alt="mePDF Studio" class="spotlight-img" id="spotlight-preview-img" onerror="this.src='./assets/branding/mecraft-hero-banner.jpg'" />
                  </div>
                  <div class="spotlight-info-panel">
                    <div class="spotlight-badge-title">
                      <div class="spotlight-app-name" id="spotlight-name">mePDF Studio</div>
                      <span class="section-eyebrow" id="spotlight-eyebrow">DOCUMENT COCKPIT</span>
                    </div>
                    <div class="spotlight-app-tagline" id="spotlight-tagline">${t.showcasePdfSubtitle}</div>
                    <div class="spotlight-app-desc" id="spotlight-desc">${t.pdfFeature1Desc}</div>
                    <div class="spotlight-feature-bullets" id="spotlight-bullets">
                      <div class="spotlight-bullet-item">
                        <svg class="spotlight-bullet-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span>${t.pdfFeature1Title}</span>
                      </div>
                      <div class="spotlight-bullet-item">
                        <svg class="spotlight-bullet-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span>${t.pdfFeature2Title}</span>
                      </div>
                      <div class="spotlight-bullet-item">
                        <svg class="spotlight-bullet-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span>${t.pdfFeature4Title}</span>
                      </div>
                    </div>
                    <div class="spotlight-actions-row">
                      <button class="btn-action primary-gold" id="spotlight-btn-open" data-action="open-web" data-app-id="mepdf">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                        <span id="spotlight-btn-text">${t.openWebStudio}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 2. Universal Drop Zone (Try It Live) -->
        <section class="hub-drop-section" id="hub-dropzone-section">
          <div class="hub-dropzone" id="hub-dropzone" role="region" aria-label="Universal Drop Zone">
            <input type="file" id="hub-file-input" accept=".pdf,image/png,image/jpeg,image/webp,image/jpg,image/bmp,image/svg+xml" style="display: none;" />
            <div class="hub-dropzone-inner">
              <div class="hub-dropzone-icons">
                <div class="drop-icon-chip pdf">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
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
                <div style="font-size: 11px; color: var(--accent-emerald); font-family: var(--font-mono); margin-top: 4px;" id="dropzone-pledge">${t.dropZonePledge}</div>
              </div>

              <button class="btn-hub-browse" id="btn-browse-hub">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                <span id="btn-browse-hub-text">${t.dropZoneBtn}</span>
              </button>
            </div>
          </div>
        </section>

        <!-- 3. Core Products Showcase (mePDF, mePhoto, meCraft) -->
        <section class="showcase-section" id="showcase-products">
          <div class="section-eyebrow-row">
            <span class="section-eyebrow">${t.showcasePdfEyebrow}</span>
            <span class="section-eyebrow cyan">${t.showcasePhotoEyebrow}</span>
          </div>

          <div class="section-header-block">
            <h2 class="section-headline">${this.currentLang === 'th' ? 'ผลิตภัณฑ์หลักในตระกูล meCrafts' : 'Flagship Ecosystem Products'}</h2>
            <p class="section-description">${this.currentLang === 'th' ? 'ออกแบบทางวิศวกรรมเพื่อมอบประสบการณ์การทำงานระดับโปร ปลอดภัย ไม่ส่งไฟล์ขึ้นคลาวด์' : 'Precision engineering built for zero-cloud document processing, image forensics, and creative workflow.'}</p>
          </div>

          <!-- Featured meCraft Desktop Suite Download Banner -->
          <div class="mecraft-hub-featured-box" style="background: linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(18, 24, 38, 0.95) 100%); border: 1px solid rgba(212, 175, 55, 0.35); border-radius: var(--radius-lg); padding: 32px; display: grid; grid-template-columns: 1fr auto; gap: 24px; align-items: center; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5); margin-bottom: 24px;">
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <span class="section-eyebrow amber">OFFICIAL WINDOWS SUITE</span>
                <span class="bento-metric-pill" style="color: var(--gold-hover);">v3.2.1 Production</span>
              </div>
              <h3 style="font-size: 24px; font-weight: 800; color: #ffffff; margin: 0;">meCraft Workstation — Desktop Hub</h3>
              <p style="font-size: 14px; color: var(--text-secondary); line-height: 1.6; margin: 0; max-width: 720px;">
                ${this.currentLang === 'th' 
                  ? 'โปรแกรมเดสก์ท็อปรวมศูนย์เครื่องมือทั้งหมดของ meCraft ติดตั้งเพียงไฟล์เดียวจบ ได้ทั้ง mePDF Studio, mePhoto Studio พร้อมระบบลากวางไฟล์อัตโนมัติ และประมวลผลออฟไลน์ในเครื่อง 100% ไม่ส่งข้อมูลออกนอกเครื่อง' 
                  : 'The complete offline desktop workstation suite for Windows. Install once to get mePDF Studio, mePhoto Studio, automatic file routing, and 100% client-side privacy.'}
              </p>
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px; min-width: 250px;">
              <a href="https://github.com/methastrategy/meCraft/releases/download/v3.2.1/meCraft-Setup.exe" download="meCraft-Setup.exe" class="btn-action primary-gold" style="min-height: 46px; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 10px; font-weight: 800; font-size: 14px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                <span>${this.currentLang === 'th' ? 'ดาวน์โหลดตัวติดตั้ง (14.8 MB)' : 'Download Setup.exe (14.8 MB)'}</span>
              </a>
              <a href="https://github.com/methastrategy/meCraft/releases/download/v3.2.1/meCraft-Portable.exe" download="meCraft-Portable.exe" class="btn-header" style="min-height: 40px; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 13px;">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                <span>${this.currentLang === 'th' ? 'รุ่นพกพา Portable.exe (25.4 MB)' : 'Download Portable (25.4 MB)'}</span>
              </a>
            </div>
          </div>

          <!-- mePDF Bento Showcase -->
          <div class="bento-showcase-grid">
            <div class="bento-card">
              <div class="bento-card-header">
                <div class="bento-icon-wrapper">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                </div>
                <span class="bento-metric-pill">Dual Engine</span>
              </div>
              <h3 class="bento-card-title">${t.pdfFeature1Title}</h3>
              <p class="bento-card-desc">${t.pdfFeature1Desc}</p>
            </div>

            <div class="bento-card">
              <div class="bento-card-header">
                <div class="bento-icon-wrapper">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </div>
                <span class="bento-metric-pill">AES-256</span>
              </div>
              <h3 class="bento-card-title">${t.pdfFeature2Title}</h3>
              <p class="bento-card-desc">${t.pdfFeature2Desc}</p>
            </div>

            <div class="bento-card">
              <div class="bento-card-header">
                <div class="bento-icon-wrapper">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                </div>
                <span class="bento-metric-pill">Offline OCR</span>
              </div>
              <h3 class="bento-card-title">${t.pdfFeature4Title}</h3>
              <p class="bento-card-desc">${t.pdfFeature4Desc}</p>
            </div>
          </div>

          <!-- mePhoto Bento Showcase -->
          <div class="bento-showcase-grid" style="margin-top: 10px;">
            <div class="bento-card">
              <div class="bento-card-header">
                <div class="bento-icon-wrapper cyan">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                </div>
                <span class="bento-metric-pill">Homography</span>
              </div>
              <h3 class="bento-card-title">${t.photoFeature1Title}</h3>
              <p class="bento-card-desc">${t.photoFeature1Desc}</p>
            </div>

            <div class="bento-card">
              <div class="bento-card-header">
                <div class="bento-icon-wrapper cyan">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a10 10 0 0 0 0 20z"></path></svg>
                </div>
                <span class="bento-metric-pill">Otsu B&W</span>
              </div>
              <h3 class="bento-card-title">${t.photoFeature2Title}</h3>
              <p class="bento-card-desc">${t.photoFeature2Desc}</p>
            </div>

            <div class="bento-card">
              <div class="bento-card-header">
                <div class="bento-icon-wrapper cyan">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path></svg>
                </div>
                <span class="bento-metric-pill">Magic Color</span>
              </div>
              <h3 class="bento-card-title">${t.photoFeature3Title}</h3>
              <p class="bento-card-desc">${t.photoFeature3Desc}</p>
            </div>
          </div>
        </section>

        <!-- 4. Interactive Apps Catalog Grid -->
        <section class="showcase-section" id="apps-catalog-section">
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

        <!-- 5. Future Ecosystem & Roadmap ("และอื่นๆในภายหลัง") -->
        <section class="showcase-section" id="future-ecosystem">
          <div class="section-eyebrow-row">
            <span class="section-eyebrow emerald">${t.roadmapEyebrow}</span>
          </div>

          <div class="section-header-block">
            <h2 class="section-headline">${t.roadmapTitle}</h2>
            <p class="section-description">${t.roadmapSubtitle}</p>
          </div>

          <div class="roadmap-grid" id="roadmap-grid">
            ${ROADMAP_ITEMS.map((item) => {
              const statusClass = item.status === 'in-dev' ? 'in-dev' : item.status === 'coming-soon' ? 'coming-soon' : 'active-sister';
              const statusLabel = item.status === 'in-dev' ? t.statusInDev : item.status === 'coming-soon' ? t.statusComingSoon : t.statusSister;
              const tagline = this.currentLang === 'th' ? item.taglineTh : item.taglineEn;
              const desc = this.currentLang === 'th' ? item.descTh : item.descEn;

              return `
                <div class="roadmap-card">
                  <div class="roadmap-banner-wrapper">
                    <img src="${item.image}" alt="${item.name}" class="roadmap-banner-img" onerror="this.src='./assets/branding/mecraft-hero-banner.jpg'" />
                    <span class="roadmap-status-chip ${statusClass}">${statusLabel}</span>
                  </div>
                  <div class="roadmap-body">
                    <div class="roadmap-app-header">
                      <span class="roadmap-app-title">${item.name}</span>
                      <span class="roadmap-app-category">${item.category}</span>
                    </div>
                    <div class="roadmap-app-tagline">${tagline}</div>
                    <div class="roadmap-app-desc">${desc}</div>
                    <div class="roadmap-tags">
                      ${item.tags.map((tag) => `<span class="app-tag">${tag}</span>`).join('')}
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </section>

        <!-- 6. Zero-Cloud Privacy Architecture Breakdown -->
        <section class="showcase-section" id="privacy-architecture">
          <div class="section-eyebrow-row">
            <span class="section-eyebrow amber">${t.privacyEyebrow}</span>
          </div>

          <div class="section-header-block">
            <h2 class="section-headline">${t.privacyTitle}</h2>
            <p class="section-description">${t.privacySubtitle}</p>
          </div>

          <div class="privacy-table-container">
            <table class="privacy-table">
              <thead>
                <tr>
                  <th style="width: 25%;">${t.privacyColMetric}</th>
                  <th style="width: 37.5%;">${t.privacyColCloud}</th>
                  <th style="width: 37.5%;">${t.privacyColMecraft}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="cell-metric-title">${t.privacyRow1Metric}</td>
                  <td><div class="cell-saas-risk"><span>✕</span><span>${t.privacyRow1Cloud}</span></div></td>
                  <td><div class="cell-mecraft-winner"><span>✓</span><span>${t.privacyRow1Mecraft}</span></div></td>
                </tr>
                <tr>
                  <td class="cell-metric-title">${t.privacyRow2Metric}</td>
                  <td><div class="cell-saas-risk"><span>✕</span><span>${t.privacyRow2Cloud}</span></div></td>
                  <td><div class="cell-mecraft-winner"><span>✓</span><span>${t.privacyRow2Mecraft}</span></div></td>
                </tr>
                <tr>
                  <td class="cell-metric-title">${t.privacyRow3Metric}</td>
                  <td><div class="cell-saas-risk"><span>✕</span><span>${t.privacyRow3Cloud}</span></div></td>
                  <td><div class="cell-mecraft-winner"><span>✓</span><span>${t.privacyRow3Mecraft}</span></div></td>
                </tr>
                <tr>
                  <td class="cell-metric-title">${t.privacyRow4Metric}</td>
                  <td><div class="cell-saas-risk"><span>✕</span><span>${t.privacyRow4Cloud}</span></div></td>
                  <td><div class="cell-mecraft-winner"><span>✓</span><span>${t.privacyRow4Mecraft}</span></div></td>
                </tr>
                <tr>
                  <td class="cell-metric-title">${t.privacyRow5Metric}</td>
                  <td><div class="cell-saas-risk"><span>✕</span><span>${t.privacyRow5Cloud}</span></div></td>
                  <td><div class="cell-mecraft-winner"><span>✓</span><span>${t.privacyRow5Mecraft}</span></div></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- 7. Cross-Platform Specifications & Downloads Matrix -->
        <section class="showcase-section" id="spec-matrix">
          <div class="section-eyebrow-row">
            <span class="section-eyebrow">${t.specsEyebrow}</span>
          </div>

          <div class="section-header-block">
            <h2 class="section-headline">${t.specsTitle}</h2>
            <p class="section-description">${t.specsSubtitle}</p>
          </div>

          <div class="spec-matrix-grid">
            <div class="spec-card">
              <span class="spec-card-badge">WEB / PWA</span>
              <h3 class="spec-card-title">${t.specPwaTitle}</h3>
              <p class="spec-card-desc">${t.specPwaDesc}</p>
              <div class="spec-feature-list">
                <span class="spec-feature-item">✓ Zero Install</span>
                <span class="spec-feature-item">✓ Offline Service Worker</span>
                <span class="spec-feature-item">✓ Chromium / Safari / Firefox</span>
              </div>
              <a href="#hub-dropzone" class="btn-action" style="margin-top: 14px; text-decoration: none; text-align: center; font-size: 13px;">${this.currentLang === 'th' ? 'เปิดใช้งานบนเว็บ' : 'Launch Web Studio'}</a>
            </div>

            <div class="spec-card">
              <span class="spec-card-badge">PORTABLE</span>
              <h3 class="spec-card-title">${t.specExeTitle}</h3>
              <p class="spec-card-desc">${t.specExeDesc}</p>
              <div class="spec-feature-list">
                <span class="spec-feature-item">✓ Single Executable</span>
                <span class="spec-feature-item">✓ No Admin Rights</span>
                <span class="spec-feature-item">✓ USB Flash Drive Ready</span>
              </div>
              <a href="https://github.com/methastrategy/meCraft/releases/download/v3.2.1/meCraft-Portable.exe" download="meCraft-Portable.exe" class="btn-action" style="background: rgba(255,255,255,0.08); margin-top: 14px; text-decoration: none; text-align: center; font-size: 13px; font-weight: 600;">⬇️ ${this.currentLang === 'th' ? 'ดาวน์โหลด Portable (.exe)' : 'Download Portable (.exe)'}</a>
            </div>

            <div class="spec-card" style="border-color: rgba(212, 175, 55, 0.4); background: linear-gradient(180deg, rgba(212, 175, 55, 0.05) 0%, var(--surface-card) 100%);">
              <span class="spec-card-badge" style="color: var(--gold-hover);">RECOMMENDED INSTALLER</span>
              <h3 class="spec-card-title">${t.specNsisTitle}</h3>
              <p class="spec-card-desc">${t.specNsisDesc}</p>
              <div class="spec-feature-list">
                <span class="spec-feature-item">✓ Desktop & Start Menu</span>
                <span class="spec-feature-item">✓ File Associations</span>
                <span class="spec-feature-item">✓ Clean Uninstaller</span>
              </div>
              <a href="https://github.com/methastrategy/meCraft/releases/download/v3.2.1/meCraft-Setup.exe" download="meCraft-Setup.exe" class="btn-action primary-gold" style="margin-top: 14px; text-decoration: none; text-align: center; font-size: 13px; font-weight: 800;">⬇️ ${this.currentLang === 'th' ? 'ดาวน์โหลด Setup.exe' : 'Download Setup.exe'}</a>
            </div>

            <div class="spec-card">
              <span class="spec-card-badge">ENTERPRISE</span>
              <h3 class="spec-card-title">${t.specMsiTitle}</h3>
              <p class="spec-card-desc">${t.specMsiDesc}</p>
              <div class="spec-feature-list">
                <span class="spec-feature-item">✓ Active Directory GPO</span>
                <span class="spec-feature-item">✓ Silent Deploy msiexec /qn</span>
                <span class="spec-feature-item">✓ IT Policy Management</span>
              </div>
              <a href="https://github.com/methastrategy/meCraft/releases/tag/v3.2.1" target="_blank" rel="noopener noreferrer" class="btn-header" style="margin-top: 14px; text-decoration: none; text-align: center; font-size: 13px;">${this.currentLang === 'th' ? 'ดู Releases บน GitHub' : 'View GitHub Releases'}</a>
            </div>
          </div>
        </section>

        <!-- 8. Universal Recent Projects -->
        <section class="showcase-section" id="recents-section">
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

      <!-- Global Portal Footer -->
      <footer class="portal-footer">
        <div class="footer-top-grid">
          <div class="footer-brand-col">
            <div class="footer-brand-title">
              <div class="launcher-logo" style="width: 28px; height: 28px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <span>meCrafts</span>
            </div>
            <p class="footer-brand-desc">${t.footerBrandDesc}</p>
          </div>

          <div>
            <div class="footer-col-title">${t.footerColProducts}</div>
            <ul class="footer-links-list">
              <li><a class="footer-link" href="#showcase-products">mePDF Studio</a></li>
              <li><a class="footer-link" href="#showcase-products">mePhoto Studio</a></li>
              <li><a class="footer-link" href="#showcase-products">meCraft Hub</a></li>
              <li><a class="footer-link" href="#future-ecosystem">meVector</a></li>
              <li><a class="footer-link" href="#future-ecosystem">meDoc</a></li>
            </ul>
          </div>

          <div>
            <div class="footer-col-title">${t.footerColArch}</div>
            <ul class="footer-links-list">
              <li><a class="footer-link" href="#privacy-architecture">100% In-Browser Privacy</a></li>
              <li><a class="footer-link" href="#privacy-architecture">WebAssembly & Workers</a></li>
              <li><a class="footer-link" href="#privacy-architecture">AES-256 Encryption</a></li>
              <li><a class="footer-link" href="#spec-matrix">Cross-Platform Matrix</a></li>
            </ul>
          </div>

          <div>
            <div class="footer-col-title">${t.footerColCommunity}</div>
            <ul class="footer-links-list">
              <li><a class="footer-link" href="https://github.com/methastrategy/meCraft/releases/download/v3.2.1/meCraft-Setup.exe" download="meCraft-Setup.exe" style="color: var(--gold-hover); font-weight: 600;">⬇️ Download meCraft-Setup.exe</a></li>
              <li><a class="footer-link" href="https://github.com/methastrategy/meCraft/releases/download/v3.2.1/meCraft-Portable.exe" download="meCraft-Portable.exe">⬇️ Download Portable (.exe)</a></li>
              <li><a class="footer-link" href="https://github.com/methastrategy/meCraft/releases" target="_blank" rel="noopener noreferrer">All GitHub Releases</a></li>
              <li><a class="footer-link" href="https://github.com/methastrategy/meCraft" target="_blank" rel="noopener noreferrer">GitHub Monorepo</a></li>
              <li><a class="footer-link" href="https://mecrafts.vercel.app">Vercel Web Portal</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom-row">
          <span>${t.footerRights}</span>
          <span style="font-family: var(--font-mono); font-size: 11px;">Built with WebAssembly • Canvas 2D • Tauri v2 • Vite</span>
        </div>
      </footer>

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
    const isDesktop = this.bridge.isTauri();

    if (isDesktop) {
      if (app.status === 'installed') {
        return `
          <div class="desktop-action-group full-width">
            <button class="btn-action btn-action-desktop launch primary-gold" data-action="launch" data-app-id="${app.id}" aria-label="${t.launchDesktop} for ${app.name}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
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
                <button class="context-menu-item" role="menuitem" data-menu-action="open-web-fallback" data-app-id="${app.id}">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                  ${t.openWebStudio}
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
        `;
      }

      return `
        <button class="btn-action btn-action-desktop install primary-emerald full-width" data-action="install" data-app-id="${app.id}" aria-label="${t.installDesktop(app.sizeFormatted || 'v' + app.version)} for ${app.name}">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          <span>${t.installDesktop(app.sizeFormatted || 'v' + app.version)}</span>
        </button>
      `;
    }

    // Web Browser Mode: Dual-Action Launch for ready apps
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
        } else if (action === 'open-web-fallback' && appId) {
          this.handleLaunchWeb(appId);
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

  private switchHeroTab(tab: 'mepdf' | 'mephoto' | 'mecraft') {
    this.activeHeroTab = tab;
    const t = this.t;

    // Update active tab buttons
    document.querySelectorAll('.hero-tab-btn').forEach((btn) => {
      const match = btn.getAttribute('data-tab') === tab;
      btn.classList.toggle('active', match);
    });

    const addressBar = document.getElementById('spotlight-address-bar');
    const previewImg = document.getElementById('spotlight-preview-img') as HTMLImageElement | null;
    const appName = document.getElementById('spotlight-name');
    const eyebrow = document.getElementById('spotlight-eyebrow');
    const tagline = document.getElementById('spotlight-tagline');
    const desc = document.getElementById('spotlight-desc');
    const bullets = document.getElementById('spotlight-bullets');
    const actionBtn = document.getElementById('spotlight-btn-open');

    if (tab === 'mepdf') {
      if (addressBar) addressBar.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg><span>https://mecrafts.vercel.app/mepdf/</span>`;
      if (previewImg) previewImg.src = './hero_mepdf_studio.jpg';
      if (appName) appName.textContent = 'mePDF Studio';
      if (eyebrow) { eyebrow.className = 'section-eyebrow'; eyebrow.textContent = t.showcasePdfEyebrow; }
      if (tagline) tagline.textContent = t.showcasePdfSubtitle;
      if (desc) desc.textContent = t.pdfFeature1Desc;
      if (bullets) {
        bullets.innerHTML = `
          <div class="spotlight-bullet-item"><svg class="spotlight-bullet-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg><span>${t.pdfFeature1Title}</span></div>
          <div class="spotlight-bullet-item"><svg class="spotlight-bullet-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg><span>${t.pdfFeature2Title}</span></div>
          <div class="spotlight-bullet-item"><svg class="spotlight-bullet-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg><span>${t.pdfFeature4Title}</span></div>
        `;
      }
      if (actionBtn) {
        actionBtn.setAttribute('data-app-id', 'mepdf');
      }
    } else if (tab === 'mephoto') {
      if (addressBar) addressBar.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg><span>https://mecrafts.vercel.app/mephoto/</span>`;
      if (previewImg) previewImg.src = './assets/branding/mephoto-studio-emblem.jpg';
      if (appName) appName.textContent = 'mePhoto Studio';
      if (eyebrow) { eyebrow.className = 'section-eyebrow cyan'; eyebrow.textContent = t.showcasePhotoEyebrow; }
      if (tagline) tagline.textContent = t.showcasePhotoSubtitle;
      if (desc) desc.textContent = t.photoFeature1Desc;
      if (bullets) {
        bullets.innerHTML = `
          <div class="spotlight-bullet-item"><svg class="spotlight-bullet-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg><span>${t.photoFeature1Title}</span></div>
          <div class="spotlight-bullet-item"><svg class="spotlight-bullet-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg><span>${t.photoFeature2Title}</span></div>
          <div class="spotlight-bullet-item"><svg class="spotlight-bullet-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg><span>${t.photoFeature3Title}</span></div>
        `;
      }
      if (actionBtn) {
        actionBtn.setAttribute('data-app-id', 'mephoto');
      }
    } else {
      if (addressBar) addressBar.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg><span>https://mecrafts.vercel.app/</span>`;
      if (previewImg) previewImg.src = './assets/branding/mecraft-hero-banner.jpg';
      if (appName) appName.textContent = 'meCraft Hub';
      if (eyebrow) { eyebrow.className = 'section-eyebrow emerald'; eyebrow.textContent = t.showcaseHubEyebrow; }
      if (tagline) tagline.textContent = t.showcaseHubSubtitle;
      if (desc) desc.textContent = t.hubFeature1Desc;
      if (bullets) {
        bullets.innerHTML = `
          <div class="spotlight-bullet-item"><svg class="spotlight-bullet-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg><span>${t.hubFeature1Title}</span></div>
          <div class="spotlight-bullet-item"><svg class="spotlight-bullet-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg><span>${t.hubFeature2Title}</span></div>
          <div class="spotlight-bullet-item"><svg class="spotlight-bullet-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg><span>${t.hubFeature4Title}</span></div>
        `;
      }
      if (actionBtn) {
        actionBtn.setAttribute('data-app-id', 'mepdf');
      }
    }
  }

  private attachEventListeners() {
    // Hero preview tabs
    document.querySelectorAll('.hero-tab-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const tab = (e.currentTarget as HTMLElement).getAttribute('data-tab') as 'mepdf' | 'mephoto' | 'mecraft';
        if (tab) this.switchHeroTab(tab);
      });
    });

    // Hero download button
    document.getElementById('hero-btn-download')?.addEventListener('click', () => {
      const app = this.catalog.find((a) => a.id === 'mepdf') || this.catalog[0];
      const installerUrl = `https://github.com/methastrategy/meCraft/releases/download/v3.2.1/meCraft-Setup.exe`;
      this.showWebDownloadModal(app, installerUrl);
    });

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
    this.renderSkeleton();
    this.renderCatalog();
    this.renderRecentProjects();
    this.switchHeroTab(this.activeHeroTab);
    this.attachEventListeners();
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

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;

      await this.bridge.saveRecentProject({
        name: file.name,
        path: (file as any).path || file.name,
        appId: targetApp,
        fileType,
        sizeBytes: file.size,
      });

      await this.loadRecentProjects();
      this.renderRecentProjects();

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

    if (!this.bridge.isTauri()) {
      const installerUrl = `https://github.com/methastrategy/meCraft/releases/download/v3.2.1/meCraft-Setup.exe`;
      if (typeof document !== 'undefined') {
        const a = document.createElement('a');
        a.href = installerUrl;
        a.download = 'meCraft-Setup.exe';
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }

      this.showWebDownloadModal(app, installerUrl);
      return;
    }

    const releaseUrl = `https://github.com/methastrategy/meCraft/releases/download/v${app.version}/${app.releaseAssetPattern}`;

    this.downloadingApps.set(appId, {
      appId,
      downloadedBytes: 0,
      totalBytes: 45 * 1024 * 1024,
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

  private showWebDownloadModal(app: AppCatalogItem, installerUrl: string) {
    const container = document.getElementById('modal-container');
    if (!container) return;
    const t = this.t;

    container.innerHTML = `
      <div class="modal-overlay" id="download-overlay">
        <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="download-dialog-title" style="max-width: 500px;">
          <div class="modal-header">
            <div>
              <div class="modal-title" id="download-dialog-title" style="display: flex; align-items: center; gap: 8px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                <span>${t.downloadModalTitle(app.name)}</span>
              </div>
              <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">${t.downloadModalSubtitle}</div>
            </div>
            <button class="btn-more" id="btn-close-download-modal" aria-label="Close dialog">✕</button>
          </div>
          <div class="modal-body" style="display: flex; flex-direction: column; gap: 14px; padding: 18px 20px;">
            <div class="single-installer-box">
              <div class="installer-badge-row">
                <span class="installer-chip gold">Windows Official</span>
                <span class="installer-chip">Single Installer</span>
              </div>
              <div class="installer-title">meCraft-Setup.exe</div>
              <div class="installer-desc">
                ${
                  this.currentLang === 'th'
                    ? 'ตัวช่วยติดตั้งหนึ่งเดียวสำหรับชุดโปรแกรม meCraft เมื่อติดตั้งแล้วสามารถเปิดใช้งานและติดตั้งเครื่องมือทั้งหมด (mePDF Studio, mePhoto Studio) ได้จากภายในโปรแกรมได้ทันที ไม่ต้องโหลดแยกให้สับสน'
                    : 'The single unified installer for the entire meCraft Suite. Once installed, launch and install all ecosystem tools (mePDF Studio, mePhoto Studio) directly inside the desktop hub.'
                }
              </div>
              <a href="${installerUrl}" download="meCraft-Setup.exe" class="btn-action btn-installer-download">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                <span>${this.currentLang === 'th' ? 'ดาวน์โหลด meCraft-Setup.exe' : 'Download meCraft-Setup.exe'}</span>
              </a>
            </div>
          </div>
          <div class="modal-footer" style="display: flex; justify-content: space-between; align-items: center; padding: 12px 18px; border-top: 1px solid var(--border-subtle);">
            <a href="https://github.com/methastrategy/meCraft/releases/tag/v3.2.1" target="_blank" rel="noopener noreferrer" style="font-size: 12px; color: var(--primary); text-decoration: none; display: flex; align-items: center; gap: 4px;">
              <span>${t.viewAllReleases}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            </a>
            <button class="btn-header" id="btn-close-download-done" style="padding: 0 16px;">${t.doneBtn}</button>
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
              <div class="modal-subtitle">meCrafts Official Portal v3.2.1 • Ecosystem Health & Privacy Diagnostics</div>
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
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>`;
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
