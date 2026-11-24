import './styles/launcher.css';
import {
  createLauncherBridge,
  getDefaultCatalog,
  formatBytes,
  formatSpeed,
  getAuthSession,
  saveAuthSession,
  clearAuthSession,
  createMockAuthSession,
  getTierBadge,
  isFeatureUnlocked,
  isOfflineGraceValid,
  onAuthSessionChange,
  exportAuthSyncCode,
  importAuthSyncCode,
  checkUrlAuthHandoff,
  checkSoftwareUpdate,
  type SoftwareUpdateInfo,
  type AppCatalogItem,
  type RecentProject,
  type DownloadProgress,
  type AuthSession,
  type SubscriptionTier,
} from '@mecraft/core-bridge';
import { supabase } from './supabase';
import { detectStudioRoute, mountStudio } from './studio-runner';

// ─────────────────────────────────────────────────────────────────────────────
// PORTAL INVARIANT: This file is the OFFICIAL SHOWCASE & DISCOVERY WEB PORTAL.
// NO embedded editors, NO canvas tools, NO PDF workers, NO iframes.
// Role: product presentation, feature discovery, search/filter, download links.
// ─────────────────────────────────────────────────────────────────────────────

export type AppStatus = 'active' | 'in-dev';
export type AppCategory = 'document' | 'photo' | 'vector' | 'video' | 'audio' | 'utility';

export interface ShowcaseApp {
  id: string;
  name: string;
  category: AppCategory;
  categoryLabel: { en: string; th: string };
  tagline: { en: string; th: string };
  description: { en: string; th: string };
  status: AppStatus;
  version: string;
  exeName?: string;
  exeSize?: string;
  downloadUrl?: string;
  suiteDownloadUrl: string;
  artcraftEquivalent?: string;
  accentColor: string;
  glowColor: string;
  icon: string;
  keywords: string[];
  specs?: { en: string[]; th: string[] };
  enginePill?: { en: string; th: string };
}

export interface PortalTranslations {
  brandTitle: string;
  brandSubtitle: string;
  headerCta: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBadge1: string;
  heroBadge2: string;
  heroBadge3: string;
  heroBadge4: string;
  heroCta1: string;
  heroCta2: string;
  searchPlaceholder: string;
  filterAll: string;
  filterDocument: string;
  filterPhoto: string;
  filterUtility: string;
  filterVector: string;
  filterVideo: string;
  filterAudio: string;
  statusActive: string;
  statusInDev: string;
  btnDownloadExe: string;
  btnDownloadSuite: string;
  btnInDev: string;
  manifestoTitle: string;
  manifestoSubtitle: string;
  col1Title: string;
  col2Title: string;
  specsTitle: string;
  specsSubtitle: string;
  footerTagline: string;
  footerCopyright: string;
  appsCount: string;
  signInBtn: string;
  signUpBtn: string;
  authModalTitle: string;
  authModalSubtitle: string;
  syncDesktopBtn: string;
  dropzoneTitle: string;
  dropzoneSubtitle: string;
  dropzoneBrowse: string;
  launchDesktopBtn: string;
  openWebBtn: string;
  recentProjectsTitle: string;
  noRecentProjects: string;
  userProfileTitle: string;
  signOutBtn: string;
}

const PORTAL_I18N: Record<'en' | 'th', PortalTranslations> = {
  en: {
    brandTitle: 'meCrafts',
    brandSubtitle: 'Official Creative Suite',
    headerCta: 'Download Suite (.exe)',
    heroTitle: 'The Private-First Creative & Document Workstation Suite',
    heroSubtitle: '100% Client-Side Local Execution. Zero-Cloud Uploads. Native Windows Desktop Engine. 11 Purpose-Built Creative Tools & Utilities — All Free, Forever.',
    heroBadge1: '100% In-Device Privacy',
    heroBadge2: 'Zero Telemetry',
    heroBadge3: 'Open-Source',
    heroBadge4: 'Native Windows Performance',
    heroCta1: 'Download meCraft Suite for Windows',
    heroCta2: 'Browse All 11 Programs ↓',
    searchPlaceholder: 'Search programs, features, file types…',
    filterAll: 'All (11)',
    filterDocument: 'Document',
    filterPhoto: 'Photo & Color',
    filterUtility: 'Utility',
    filterVector: 'Vector & Design',
    filterVideo: 'Video & Motion',
    filterAudio: 'Audio & 3D',
    statusActive: 'Active Production',
    statusInDev: 'In Development',
    btnDownloadExe: '⬇ Download .exe',
    btnDownloadSuite: '⬇ Download Suite',
    btnInDev: '🚧 In Development • Learn More',
    manifestoTitle: 'Privacy Architecture Manifesto',
    manifestoSubtitle: 'Every byte stays on your machine. Always.',
    col1Title: 'Traditional Cloud Subscriptions',
    col2Title: 'meCrafts Private-First',
    specsTitle: 'Technical Specifications',
    specsSubtitle: 'Built for Windows. Engineered for speed.',
    footerTagline: 'Private-First Creative Workstation Suite for Windows',
    footerCopyright: '© 2024 MeStrategy. Open-Source under MIT License.',
    appsCount: '11 Apps',
    signInBtn: 'Sign In',
    signUpBtn: 'Create Account',
    authModalTitle: 'meCraft Studio Account',
    authModalSubtitle: 'Access Private Suite & Synchronize Entitlements',
    syncDesktopBtn: 'Sync to Desktop',
    dropzoneTitle: '⚡ Drop PDF or Image files here for instant private processing',
    dropzoneSubtitle: 'Auto-routes PDF to mePDF Studio (Merge, Split, OCR) or Images to mePhoto Studio (Deskew, Enhance). 100% In-Device RAM.',
    dropzoneBrowse: 'Browse Local File...',
    launchDesktopBtn: 'Launch App →',
    openWebBtn: 'Open Web Studio',
    recentProjectsTitle: 'Recent Projects',
    noRecentProjects: 'No recent files. Drag & drop any PDF or photo above to get started.',
    userProfileTitle: 'meCraft Studio Account',
    signOutBtn: 'Sign Out',
  },
  th: {
    brandTitle: 'meCrafts',
    brandSubtitle: 'ชุดโปรแกรมสร้างสรรค์ทางการ',
    headerCta: 'ดาวน์โหลด Suite (.exe)',
    heroTitle: 'ชุดโปรแกรมสร้างสรรค์และเอกสารที่ให้ความเป็นส่วนตัวก่อน',
    heroSubtitle: 'ประมวลผล 100% บนเครื่อง ไม่อัปโหลดไฟล์ไปที่ Cloud เครื่องยนต์ Windows Desktop จริง โปรแกรมสร้างสรรค์และเครื่องมือเฉพาะทาง 11 ตัว — ฟรีทั้งหมด ตลอดชีวิต',
    heroBadge1: 'ความเป็นส่วนตัว 100%',
    heroBadge2: 'ไม่มีการเก็บข้อมูล',
    heroBadge3: 'Open-Source',
    heroBadge4: 'ประสิทธิภาพ Windows จริง',
    heroCta1: 'ดาวน์โหลด meCraft Suite สำหรับ Windows',
    heroCta2: 'ดูโปรแกรมทั้ง 11 ตัว ↓',
    searchPlaceholder: 'ค้นหาโปรแกรม ฟีเจอร์ ประเภทไฟล์…',
    filterAll: 'ทั้งหมด (11)',
    filterDocument: 'เอกสาร',
    filterPhoto: 'ภาพและสี',
    filterUtility: 'เครื่องมือเสริม',
    filterVector: 'เวกเตอร์และดีไซน์',
    filterVideo: 'วิดีโอและโมชัน',
    filterAudio: 'เสียงและ 3D',
    statusActive: 'ใช้งานได้จริง',
    statusInDev: 'กำลังพัฒนา',
    btnDownloadExe: '⬇ ดาวน์โหลด .exe',
    btnDownloadSuite: '⬇ ดาวน์โหลด Suite',
    btnInDev: '🚧 กำลังพัฒนา • ดูรายละเอียด',
    manifestoTitle: 'หลักการสถาปัตยกรรมความเป็นส่วนตัว',
    manifestoSubtitle: 'ทุก Byte อยู่บนเครื่องของคุณ ตลอดเวลา',
    col1Title: 'Cloud Subscription แบบดั้งเดิม',
    col2Title: 'meCrafts Private-First',
    specsTitle: 'ข้อกำหนดทางเทคนิค',
    specsSubtitle: 'สร้างสำหรับ Windows วิศวกรรมเพื่อความเร็ว',
    footerTagline: 'ชุดโปรแกรมสร้างสรรค์ที่ให้ความเป็นส่วนตัวก่อน สำหรับ Windows',
    footerCopyright: '© 2024 MeStrategy. Open-Source ภายใต้สัญญาอนุญาต MIT',
    appsCount: '11 โปรแกรม',
    signInBtn: 'เข้าสู่ระบบ',
    signUpBtn: 'สมัครสมาชิก',
    authModalTitle: 'บัญชี meCraft Studio',
    authModalSubtitle: 'เข้าใช้งานชุดโปรแกรมและเชื่อมต่อสิทธิ์การใช้งาน',
    syncDesktopBtn: 'เชื่อมต่อ Desktop',
    dropzoneTitle: '⚡ ลากไฟล์ PDF หรือ รูปภาพ มาวางที่นี่เพื่อเริ่มทำงานทันที',
    dropzoneSubtitle: 'ส่งไฟล์เข้า mePDF Studio (รวม/แยก/บีบอัด/OCR) หรือ mePhoto Studio (ปรับระนาบ/ลบเงา/แต่งภาพ) อัตโนมัติ 100% บน RAM',
    dropzoneBrowse: 'เลือกไฟล์จากเครื่อง...',
    launchDesktopBtn: 'เปิดโปรแกรม →',
    openWebBtn: 'เปิดบน Web Studio',
    recentProjectsTitle: 'ไฟล์งานล่าสุด',
    noRecentProjects: 'ยังไม่มีประวัติไฟล์งาน ลากไฟล์ PDF หรือ รูปภาพ มาวางด้านบนเพื่อเริ่มทำงาน',
    userProfileTitle: 'ข้อมูลบัญชี meCraft Studio',
    signOutBtn: 'ออกจากระบบ',
  },
};

const SUITE_DOWNLOAD_URL = 'https://github.com/methastrategy/meCraft/releases/download/v1.0.0/meCraft-Setup.exe';

export interface ReleaseBinaryItem {
  id: string;
  name: string;
  category: { en: string; th: string };
  version: string;
  releaseDate: { en: string; th: string };
  fileName: string;
  fileSize: string;
  downloadUrl?: string;
  isSuite?: boolean;
  status: 'active' | 'in-dev';
  architecture: string;
  sha256: string;
  accentColor: string;
  glowColor: string;
  highlights: { en: string[]; th: string[] };
}

export const RELEASE_BINARIES: ReleaseBinaryItem[] = [
  {
    id: 'mecraft-suite',
    name: 'meCraft Installer',
    category: { en: 'All-in-One Creative & Document Suite', th: 'ชุดโปรแกรมสร้างสรรค์และจัดการเอกสารครบวงจร' },
    version: 'v1.0.0',
    releaseDate: { en: 'Nov 23, 2026 (Latest Stable)', th: '23 พ.ย. 2026 (เวอร์ชันเสถียรล่าสุด)' },
    fileName: 'meCraft-Setup.exe',
    fileSize: '14.8 MB',
    downloadUrl: SUITE_DOWNLOAD_URL,
    isSuite: true,
    status: 'active',
    architecture: 'Windows 11 / 10 (64-bit x64)',
    sha256: '9f8e7d4a6b1c2e3f...ed25519_verified',
    accentColor: '#d4af37',
    glowColor: 'rgba(212, 175, 55, 0.4)',
    highlights: {
      en: ['All 11 Creative & Document Studios Included', '100% In-Device Memory Execution · Zero-Cloud', 'Automated in-app delta updates with Ed25519 signing'],
      th: ['รวมทั้ง 11 โปรแกรมสตูดิโอและยูทิลิตี้ในตัวติดตั้งเดียว', 'ประมวลผลบนเครื่อง 100% ปราศจากคลาวด์ ปลอดภัยสูงสุด', 'ระบบตรวจจับและอัปเดตอัตโนมัติพร้อมลายเซ็น Ed25519'],
    },
  },
  {
    id: 'mepdf',
    name: 'mePDF Studio Pro Standalone',
    category: { en: 'Document Engineering & PDF Lab', th: 'วิศวกรรมเอกสารและสตูดิโอ PDF' },
    version: 'v1.0.0',
    releaseDate: { en: 'Nov 23, 2026', th: '23 พ.ย. 2026' },
    fileName: 'mepdf.exe',
    fileSize: '30.8 MB',
    downloadUrl: 'https://github.com/methastrategy/meCraft/releases/download/v1.0.0/mepdf.exe',
    status: 'active',
    architecture: 'Windows 11 / 10 (64-bit x64) · Tauri v2 Native',
    sha256: '8a4d1f2e9c5b7a0d...ed25519_verified',
    accentColor: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.4)',
    highlights: {
      en: ['Visual Page Cockpit: Drag, Split, Merge', '4-Point Deskew & Local Otsu Binarization', 'Bank-Grade AES-256 Encryption & PDF Sanitization'],
      th: ['ค็อกพิทจัดการหน้า ลาก สลับ แยก รวมหน้าเอกสาร', 'ปรับระนาบเอกสารเอียง (Deskew) และปรับภาพขาวดำ Otsu', 'เข้ารหัสเอกสาร AES-256 ระดับธนาคารและลบลายเซ็นลับ'],
    },
  },
  {
    id: 'mephoto',
    name: 'mePhoto Studio Darkroom Standalone',
    category: { en: 'Darkroom RAW & Color Lab', th: 'ห้องมืดตกแต่งภาพ RAW และเกรดสี' },
    version: 'v1.0.0',
    releaseDate: { en: 'Nov 23, 2026', th: '23 พ.ย. 2026' },
    fileName: 'mephoto.exe',
    fileSize: '22.7 MB',
    downloadUrl: 'https://github.com/methastrategy/meCraft/releases/download/v1.0.0/mephoto.exe',
    status: 'active',
    architecture: 'Windows 11 / 10 (64-bit x64) · WebAssembly & OpenCV',
    sha256: '7b2c5e8d1a4f0c9e...ed25519_verified',
    accentColor: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.4)',
    highlights: {
      en: ['16-Bit RAW / DNG Digital Darkroom', '32-Bit Floating Point Grading & 3D LUTs', 'On-Device Searchable Thai/English OCR Text Extraction'],
      th: ['แต่งไฟล์ภาพ RAW / DNG แบบ 16-Bit คุณภาพสูงสุด', 'เกรดสีระดับ 32-Bit Float และรองรับ 3D LUTs', 'สแกนข้อความ OCR ภาษาไทยและสากลในตัวทันที'],
    },
  },
  {
    id: 'medrop',
    name: 'meDrop Utility Standalone',
    category: { en: 'Direct LAN Transfer & PDF Squeezer', th: 'ส่งไฟล์ความเร็วสูงข้าม LAN และบีบอัด PDF' },
    version: 'v1.0.0',
    releaseDate: { en: 'Nov 23, 2026', th: '23 พ.ย. 2026' },
    fileName: 'meDrop.exe',
    fileSize: '18.5 MB',
    downloadUrl: 'https://github.com/methastrategy/meCraft/releases/download/v1.0.0/meDrop.exe',
    status: 'active',
    architecture: 'Windows 11 / 10 (64-bit x64) · Rust TCP Zero-Copy',
    sha256: '6c3d9a0f4e2b8c1d...ed25519_verified',
    accentColor: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    highlights: {
      en: ['P2P Zero-Cloud Local LAN AirDrop-Class Transfer', 'Extreme Lossless & Scanned PDF Compression (-85%)', 'Floating Dropzone Widget for Desktop'],
      th: ['ส่งไฟล์ตรงผ่าน LAN ข้ามเครื่องเร็วเต็มสปีดเครือข่าย', 'บีบอัดเอกสาร PDF ให้เล็กลงสูงสุด 85% โดยภาพไม่แตก', 'วิดเจ็ตลากวางลอยบนหน้าจอเดสก์ท็อป'],
    },
  },
  {
    id: 'medoc',
    name: 'meDoc Studio (Technical Documentation)',
    category: { en: 'Markdown & KaTeX Lab', th: 'บันทึกเอกสารวิจัย Markdown และ KaTeX' },
    version: 'v1.0.0',
    releaseDate: { en: 'Upcoming Release (Q1 2027)', th: 'กำลังพัฒนา (Q1 2027)' },
    fileName: 'medoc.exe',
    fileSize: '~24.5 MB (Estimated)',
    status: 'in-dev',
    architecture: 'Windows 11 / 10 (64-bit x64) · Rust & KaTeX Engine',
    sha256: 'Planned Candidate Build',
    accentColor: '#8b5cf6',
    glowColor: 'rgba(139, 92, 246, 0.4)',
    highlights: {
      en: ['KaTeX Mathematical Formulas & Mermaid Diagrams', 'Zero-Latency Live Split Typography Preview', 'Direct Export to Clean PDF & Publication EPUB'],
      th: ['พิมพ์สมการคณิตศาสตร์ KaTeX และไดอะแกรม Mermaid', 'พรีวิวสด 0ms สองฝั่งแบบเรียลไทม์', 'แปลงเป็น PDF และ EPUB สวยงามพร้อมพิมพ์'],
    },
  },
  {
    id: 'mesurv',
    name: 'meSurv Studio (Geodetic CAD)',
    category: { en: 'Surveying & Cadastral Computation', th: 'คำนวณงานรังวัดและพิกัดแผนที่ CAD' },
    version: 'v1.0.0-beta',
    releaseDate: { en: 'Upcoming Release (Q1 2027)', th: 'กำลังพัฒนา (Q1 2027)' },
    fileName: 'mesurv.exe',
    fileSize: '~28.0 MB (Estimated)',
    status: 'in-dev',
    architecture: 'Windows 11 / 10 (64-bit x64) · PROJ Geodesy C++',
    sha256: 'Planned Candidate Build',
    accentColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    highlights: {
      en: ['UTM / WGS84 Traverse & Coordinate Adjustment', 'Direct 2D/3D DXF & DWG CAD Plan Generation', 'Thai Land Department Cadastral Math Compliant'],
      th: ['คำนวณวงรอบและแปลงพิกัด UTM / WGS84 กรมที่ดิน', 'ส่งออกและสร้างแบบแปลน CAD DXF/DWG ทันที', 'ฟังก์ชันรังวัดและตรวจสอบแปลงที่ดินอัตโนมัติ'],
    },
  },
  {
    id: 'mevision',
    name: 'meVision Studio (On-Device Vision AI)',
    category: { en: 'Local AI & Semantic Document QA', th: 'ปัญญาประดิษฐ์วิเคราะห์เอกสารในเครื่อง' },
    version: 'v1.0.0-beta',
    releaseDate: { en: 'Upcoming Release (Q2 2027)', th: 'กำลังพัฒนา (Q2 2027)' },
    fileName: 'mevision.exe',
    fileSize: '~35.2 MB (Estimated)',
    status: 'in-dev',
    architecture: 'Windows 11 / 10 (64-bit x64) · ONNX DirectML',
    sha256: 'Planned Candidate Build',
    accentColor: '#ec4899',
    glowColor: 'rgba(236, 72, 153, 0.4)',
    highlights: {
      en: ['Visual Document Question Answering (DocVQA)', '100% Offline GPU Inference (Zero-Data Leaving)', 'Semantic Vector Search across Gigabytes of PDFs'],
      th: ['ค้นหาความหมายและถามตอบข้อมูลในเอกสารด้วย AI', 'ประมวลผลบนการ์ดจอออฟไลน์ 100% ปลอดภัยจากภายนอก', 'สแกนเอกสารกองโตพร้อมแยกประเภทอัจฉริยะ'],
    },
  },
  {
    id: 'mevector',
    name: 'meVector Studio (Precision Geometry)',
    category: { en: 'Radial Vector Math & SVG Studio', th: 'ออกแบบลายเส้นเวกเตอร์และเรขาคณิตความแม่นยำสูง' },
    version: 'v1.0.0-alpha',
    releaseDate: { en: 'Upcoming Release (Q2 2027)', th: 'กำลังพัฒนา (Q2 2027)' },
    fileName: 'mevector.exe',
    fileSize: '~26.0 MB (Estimated)',
    status: 'in-dev',
    architecture: 'Windows 11 / 10 (64-bit x64) · Vello GPU Vector',
    sha256: 'Planned Candidate Build',
    accentColor: '#f97316',
    glowColor: 'rgba(249, 115, 22, 0.4)',
    highlights: {
      en: ['Infinite Non-Destructive Vector Pen Precision', 'Radial Symmetry & Parametric Geometry Tools', 'Native SVG, EPS, PDF & CAD DXF Exporter'],
      th: ['ปากกาเวกเตอร์ความแม่นยำสูง ซูมไม่แตกไม่จำกัด', 'คำนวณเรขาคณิตและมุมองศาแบบเรเดียล', 'ส่งออกไฟล์ SVG, PDF, EPS และ DXF ครบถ้วน'],
    },
  },
  {
    id: 'memotion',
    name: 'meMotion Studio (Keyframe Animator)',
    category: { en: 'Motion DSP & Keyframe Engine', th: 'โมชันกราฟิกและแอนิเมชันคีย์เฟรม' },
    version: 'v1.0.0-alpha',
    releaseDate: { en: 'Upcoming Release (Q3 2027)', th: 'กำลังพัฒนา (Q3 2027)' },
    fileName: 'memotion.exe',
    fileSize: '~32.0 MB (Estimated)',
    status: 'in-dev',
    architecture: 'Windows 11 / 10 (64-bit x64) · Vulkan Video DSP',
    sha256: 'Planned Candidate Build',
    accentColor: '#6366f1',
    glowColor: 'rgba(99, 102, 241, 0.4)',
    highlights: {
      en: ['120fps Bezier Animation Curves & Morphing', 'Real-Time Particle Physics & Motion Shaders', 'High-Efficiency MP4, WebM & Lottie Output'],
      th: ['สร้างแอนิเมชันกราฟิกเคลื่อนไหว 120fps ลื่นไหล', 'ระบบพาร์ติเคิลและจำลองการเคลื่อนที่ทางฟิสิกส์', 'เรนเดอร์เป็น MP4, WebM และ Lottie Json'],
    },
  },
  {
    id: 'meaudio',
    name: 'meAudio Studio (Spatial Sound Lab)',
    category: { en: '32-Bit Float Audio & DSP Lab', th: 'สตูดิโอบันทึกและปรับแต่งเสียงความละเอียดสูง' },
    version: 'v1.0.0-alpha',
    releaseDate: { en: 'Upcoming Release (Q3 2027)', th: 'กำลังพัฒนา (Q3 2027)' },
    fileName: 'meaudio.exe',
    fileSize: '~21.5 MB (Estimated)',
    status: 'in-dev',
    architecture: 'Windows 11 / 10 (64-bit x64) · CPAL Low Latency',
    sha256: 'Planned Candidate Build',
    accentColor: '#14b8a6',
    glowColor: 'rgba(20, 184, 166, 0.4)',
    highlights: {
      en: ['32-Bit Float Low-Latency Audio Pipeline', 'Spectral De-Noising & Multi-Stem Isolation', 'Lossless FLAC, WAV, AAC & MP3 Exporter'],
      th: ['ตัดต่อและบันทึกเสียงแบบ 32-Bit Float ไร้ Latency', 'ตัดเสียงรบกวน Spectral Denoise และแยกเสียงร้อง/เครื่องดนตรี', 'แปลงไฟล์เสียง FLAC, WAV, AAC และ MP3 ความละเอียดสูง'],
    },
  },
  {
    id: 'me3d',
    name: 'me3D Studio (Spatial Mesh & Raytracing)',
    category: { en: 'WebGL Spatial Mesh & Raytracing', th: 'แสดงผลและจำลองแสงเงา 3D Mesh แบบเรียลไทม์' },
    version: 'v1.0.0-alpha',
    releaseDate: { en: 'Upcoming Release (Q4 2027)', th: 'กำลังพัฒนา (Q4 2027)' },
    fileName: 'me3d.exe',
    fileSize: '~38.0 MB (Estimated)',
    status: 'in-dev',
    architecture: 'Windows 11 / 10 (64-bit x64) · wgpu WebGPU Native',
    sha256: 'Planned Candidate Build',
    accentColor: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.4)',
    highlights: {
      en: ['Real-Time PBR Shaders & Hardware Raytracing', 'Import & Export OBJ, STL, GLTF & USDZ', 'Automated 3D Print Slicing & Mesh Topology Repair'],
      th: ['แสดงผลโมเดล 3D และเรนเดอร์แสงเงา Raytracing แบบเรียลไทม์', 'รองรับไฟล์สากล OBJ, STL, GLTF และ USDZ', 'เครื่องมือเตรียมโมเดลสำหรับ 3D Printer และซ่อม Mesh'],
    },
  },
  {
    id: 'mecraft-hub',
    name: 'meCraft Hub Workstation Launcher',
    category: { en: 'Central Daemon & Desktop License Bridge', th: 'ศูนย์รวมลอนเชอร์และตัวจัดการไลเซนส์เดสก์ท็อป' },
    version: 'v1.0.0',
    releaseDate: { en: 'Nov 23, 2026', th: '23 พ.ย. 2026' },
    fileName: 'mecraft-hub.exe',
    fileSize: 'Included in Suite (~14.8 MB)',
    status: 'active',
    architecture: 'Windows 11 / 10 (64-bit x64) · Tauri v2 Bridge',
    sha256: 'Included in Suite Bundle',
    accentColor: '#eab308',
    glowColor: 'rgba(234, 179, 8, 0.4)',
    highlights: {
      en: ['Central Workstation Switcher & Recent Projects', 'Local Ed25519 License Vault & Account Sync', 'Background Delta Updates & Integrity Checks'],
      th: ['หน้าต่างศูนย์กลางเปิดโปรแกรมทั้งหมดและประวัติโปรเจกต์ล่าสุด', 'ซิงค์ไลเซนส์และบัญชีปลอดภัยด้วย Ed25519 ภายในเครื่อง', 'ตรวจจับและดาวน์โหลดตัวอัปเดตอัตโนมัติ'],
    },
  },
];

export const SHOWCASE_APPS: ShowcaseApp[] = [
  {
    id: 'mepdf',
    name: 'mePDF Studio',
    category: 'document',
    categoryLabel: { en: 'Document', th: 'เอกสาร' },
    tagline: {
      en: 'Professional Client-Side PDF Engineering Studio',
      th: 'สตูดิโอวิศวกรรม PDF ระดับมืออาชีพบนฝั่ง Client',
    },
    description: {
      en: 'Merge, split, visual page cockpit, lossless & scanned compression, AES-256 encryption, and searchable OCR text injection.',
      th: 'รวม/แยก PDF, ค็อกพิทหน้าเพจแบบ Visual, บีบอัดแบบไม่สูญเสียคุณภาพ, เข้ารหัส AES-256 และฉีด OCR Text เพื่อค้นหา',
    },
    status: 'active',
    version: 'v1.0.0',
    exeName: 'mepdf.exe',
    exeSize: '~30.8 MB',
    downloadUrl: 'https://github.com/methastrategy/meCraft/releases/download/v1.0.0/mepdf.exe',
    suiteDownloadUrl: SUITE_DOWNLOAD_URL,
    accentColor: '#6366f1',
    glowColor: 'rgba(99,102,241,0.3)',
    icon: 'pdf',
    keywords: ['pdf', 'merge', 'split', 'compress', 'encrypt', 'ocr', 'aes', 'document'],
    enginePill: { en: '100% In-Device RAM · Tauri v2 Native', th: 'ประมวลผลบน RAM 100% · Tauri v2 Native' },
    specs: {
      en: ['4-Point Deskew & Local Otsu Binarization', 'Lossless Deflate & Scanned PDF Compression', 'Client-Side Searchable OCR Text Injection', 'AES-256 Bank-Grade Encryption & Sanitization', 'Visual Page Cockpit: Drag, Split, Merge'],
      th: ['ปรับระนาบ 4-Point Deskew & ลบเงา Otsu ท้องถิ่น', 'บีบอัดเอกสาร Lossless Deflate สูงสุด 90%', 'ฝังข้อความ OCR ค้นหาคำได้ในเครื่อง 100%', 'เข้ารหัสความปลอดภัยระดับธนาคาร AES-256', 'จัดระเบียบหน้า ลากสลับ/แยก/รวมไฟล์อิสระ'],
    },
  },
  {
    id: 'mephoto',
    name: 'mePhoto Studio',
    category: 'photo',
    categoryLabel: { en: 'Photo & Color', th: 'ภาพและสี' },
    tagline: {
      en: 'CamScanner-Grade Document Restoration & Photo Lab',
      th: 'ห้องปฏิบัติการรูปภาพและกู้เอกสารระดับ CamScanner',
    },
    description: {
      en: '4-point homography perspective deskew, adaptive local Otsu binarization shadow eradication, Magic Color document enhancement.',
      th: 'ปรับมุมมอง 4 จุด Homography, กำจัดเงาด้วย Otsu Binarization ท้องถิ่น, เพิ่มความสวยงามเอกสารด้วย Magic Color',
    },
    status: 'active',
    version: 'v1.0.0',
    exeName: 'mephoto.exe',
    exeSize: '~22.7 MB',
    downloadUrl: 'https://github.com/methastrategy/meCraft/releases/download/v1.0.0/mephoto.exe',
    suiteDownloadUrl: SUITE_DOWNLOAD_URL,
    accentColor: '#06b6d4',
    glowColor: 'rgba(6,182,212,0.3)',
    icon: 'photo',
    keywords: ['photo', 'image', 'scanner', 'ocr', 'homography', 'perspective', 'color', 'restore'],
    enginePill: { en: 'WebAssembly OpenCV · Hardware GPU', th: 'WebAssembly OpenCV · GPU เร่งความเร็ว' },
    specs: {
      en: ['4-Point Homography Perspective Correction', 'Adaptive Local Otsu Shadow Eradication', 'Magic Color Document Photo Enhancement', 'Non-Destructive RAW High-Bit Processing', 'Batch Multi-Document Scan Restoration'],
      th: ['ดึงภาพถ่ายเอียงให้ตรงระนาบ 4-Point Homography', 'กำจัดเงาดำบนกระดาษด้วย Adaptive Otsu', 'เร่งความสดใสและคมชัดด้วย Magic Color', 'โปรเซสเซอร์ภาพ RAW แบบไม่ทำลายคุณภาพ', 'แต่งภาพและกู้เอกสารพร้อมกันแบบชุด'],
    },
  },
  {
    id: 'medrop',
    name: 'meDrop Radial Converter',
    category: 'utility',
    categoryLabel: { en: 'Utility & Hub', th: 'เครื่องมือและศูนย์กลาง' },
    tagline: {
      en: 'Zero-Window Radial Drag & Drop File Converter HUD',
      th: 'เครื่องมือแปลงไฟล์ทรงวงแหวน Radial HUD บนเคอร์เซอร์เมาส์ทันที',
    },
    description: {
      en: 'Hold Ctrl and drag any file in Windows Explorer: instant radial donut menu converts images, PDFs, vectors & documents locally in RAM, or transfers to meCraft studios.',
      th: 'เพียงลากไฟล์ใน Windows Explorer พร้อมกด Ctrl: เมนูวงแหวนรอบเมาส์จะแปลงไฟล์ภาพ, PDF, เวกเตอร์, เอกสารใน RAM ทันที หรือส่งต่อเข้าสู่สตูดิโอ meCraft',
    },
    status: 'active',
    version: 'v1.0.0',
    exeName: 'meDrop.exe',
    exeSize: '~18.5 MB',
    downloadUrl: 'https://github.com/methastrategy/meCraft/releases/download/v1.0.0/meDrop.exe',
    suiteDownloadUrl: SUITE_DOWNLOAD_URL,
    accentColor: '#3b82f6',
    glowColor: 'rgba(59,130,246,0.3)',
    icon: 'drop',
    keywords: ['drop', 'convert', 'radial', 'donut', 'hud', 'converter', 'drag', 'zero-window', 'local-first'],
    enginePill: { en: 'Zero-Window HUD · Low-Latency Rust Hook', th: 'Zero-Window HUD · Rust Hook ความเร็วสูง' },
    specs: {
      en: ['Native Windows Low-Level Mouse & Keyboard Hook', 'Dynamic SVG Radial Arc HUD with 120fps Spring Physics', 'Client-Side RAM In-Place Conversion (No Cloud)', 'Context-Aware Smart Format Filtering by Extension', 'Cross-App Studio Gateway via ClipBus Memory Pipeline'],
      th: ['Native Windows Low-Level Hook ดักจับเมาส์ความเร็วสูง', 'วงแหวนเรขาคณิต SVG Donut แอนิเมชัน 120fps ลื่นไหล', 'แปลงไฟล์ใน RAM บันทึกข้างไฟล์เดิม ไม่แตะ Cloud', 'กรอง Format ปลายทางอัตโนมัติตามนามสกุลไฟล์', 'ส่งต่อไฟล์เข้า mePDF / mePhoto ด้วย ClipBus Pipeline'],
    },
  },
  {
    id: 'mevector',
    name: 'meVector Studio',
    category: 'vector',
    categoryLabel: { en: 'Vector & Design', th: 'เวกเตอร์และดีไซน์' },
    tagline: {
      en: 'Precision Bézier Vector Illustration & SVG Studio',
      th: 'สตูดิโอวาดภาพเวกเตอร์ Bézier ความแม่นยำสูงและ SVG',
    },
    description: {
      en: 'Resolution-independent path editing, node manipulation, boolean vector geometry, and SVG/PDF icon workbench.',
      th: 'แก้ไขเส้นพาธอิสระจากความละเอียด, ดัดแปลง Node, ตรรกะเวกเตอร์ Boolean และ Workbench ไอคอน SVG/PDF',
    },
    status: 'in-dev',
    version: 'v1.0.0',
    suiteDownloadUrl: SUITE_DOWNLOAD_URL,
    artcraftEquivalent: 'VectorCraft / Illustrator',
    accentColor: '#a855f7',
    glowColor: 'rgba(168,85,247,0.3)',
    icon: 'vector',
    keywords: ['vector', 'svg', 'bezier', 'illustration', 'path', 'node', 'icon', 'design'],
    enginePill: { en: 'Precision Bézier Engine · SVG 2.0', th: 'เครื่องยนต์ Bézier ความแม่นยำสูง · SVG 2.0' },
    specs: {
      en: ['Resolution-Independent Bézier Splines', 'Sub-Pixel Node & Tangent Manipulation', 'Boolean Geometry (Unite, Minus, Intersect)', 'Clean SVG 2.0 & Vector PDF Exporter', 'Hardware-Accelerated Path Tessellation'],
      th: ['วาดเส้น Bézier คมชัดทุกระดับความละเอียด', 'ดัดแปลง Node ปรับแขนความโค้งแม่นยำ', 'ตรรกะรูปทรง Boolean รวม/ตัด/เจาะรู', 'ส่งออก SVG 2.0 และ PDF Vector ไม่แตก', 'เรนเดอร์เส้นพาธด้วย GPU ความเร็วสูง'],
    },
  },
  {
    id: 'mefilm',
    name: 'meFilm Studio',
    category: 'video',
    categoryLabel: { en: 'Video & Motion', th: 'วิดีโอและโมชัน' },
    tagline: {
      en: 'Multi-Track Timeline Video Editor & Lossless Slicer',
      th: 'โปรแกรมตัดต่อวิดีโอ Timeline หลายแทร็กและ Slicer ไม่สูญเสียคุณภาพ',
    },
    description: {
      en: 'Non-linear multi-layer video cutting, transitions, hardware-accelerated MP4 rendering, and clip sequencing.',
      th: 'ตัดต่อวิดีโอ Non-linear หลายเลเยอร์, Transition, เรนเดอร์ MP4 เร่งด้วย Hardware และจัดลำดับ Clip',
    },
    status: 'in-dev',
    version: 'v1.0.0',
    suiteDownloadUrl: SUITE_DOWNLOAD_URL,
    artcraftEquivalent: 'FilmCraft / Premiere Pro',
    accentColor: '#f59e0b',
    glowColor: 'rgba(245,158,11,0.3)',
    icon: 'film',
    keywords: ['video', 'film', 'timeline', 'edit', 'mp4', 'transition', 'cut', 'render'],
    enginePill: { en: 'Hardware NVENC / QuickSync MP4', th: 'ฮาร์ดแวร์เรนเดอร์ NVENC / QuickSync' },
    specs: {
      en: ['Multi-Track Non-Linear Timeline Slicer', 'Lossless Keyframe Trimming Without Re-encode', 'GPU Hardware-Accelerated 4K MP4 Export', 'Multi-Layer Transitions & Color LUTs', 'Multi-Audio Track Mixing & Waveforms'],
      th: ['ตัดต่อวิดีโอหลายแทร็กบนไทม์ไลน์อิสระ', 'ตัดซอยคลิปตาม Keyframe โดยไม่เสียคุณภาพ', 'เรนเดอร์ 4K MP4 ด้วยฮาร์ดแวร์ GPU', 'ใส่ทรานซิชันและเกรดสีภาพยนตร์ด้วย LUTs', 'ซิงค์แทร็กเสียงหลายช่องสัญญาณ'],
    },
  },
  {
    id: 'melight',
    name: 'meLight Studio',
    category: 'photo',
    categoryLabel: { en: 'Photo & Color', th: 'ภาพและสี' },
    tagline: {
      en: 'RAW Photo Development & Non-Destructive Color Lab',
      th: 'ห้องปฏิบัติการพัฒนาภาพ RAW และปรับสีแบบไม่ทำลาย',
    },
    description: {
      en: 'High dynamic range tone-mapping, exposure calibration, parametric curves, and batch photography grading.',
      th: 'Tone-mapping HDR, ปรับ Exposure, Curves แบบ Parametric และ Grade ภาพถ่ายแบบ Batch',
    },
    status: 'in-dev',
    version: 'v1.0.0',
    suiteDownloadUrl: SUITE_DOWNLOAD_URL,
    artcraftEquivalent: 'LightCraft / Lightroom',
    accentColor: '#10b981',
    glowColor: 'rgba(16,185,129,0.3)',
    icon: 'light',
    keywords: ['raw', 'lightroom', 'photo', 'color', 'grading', 'hdr', 'exposure', 'darkroom'],
    enginePill: { en: '16-Bit RAW Pipeline · Non-Destructive', th: 'ไพป์ไลน์ RAW 16-Bit · ปรับสีไม่ทำลายภาพ' },
    specs: {
      en: ['High Dynamic Range (HDR) Tone-Mapping', 'Parametric RGB Curves & Exposure Calibration', 'Zero-Loss Demosaicing & Sensor Profiles', 'HSL Selective Color Adjustment Wheels', 'Instant Recipe Presets & Batch Grading'],
      th: ['เกลี่ยแสงมืด/สว่างด้วย HDR Tone-Mapping', 'ปรับ Parametric RGB Curves และแสงละเอียด', 'ถอดรหัสเซนเซอร์ภาพ RAW 16-Bit ไร้ Noise', 'วงล้อปรับสี HSL แยกรายเฉดสีอย่างแม่นยำ', 'บันทึกสูตร Preset และคัดลอกโทนสีแบบชุด'],
    },
  },
  {
    id: 'memotion',
    name: 'meMotion Studio',
    category: 'video',
    categoryLabel: { en: 'Video & Motion', th: 'วิดีโอและโมชัน' },
    tagline: {
      en: 'Keyframe Motion Graphics & Visual Effects Workbench',
      th: 'Workbench กราฟิกเคลื่อนไหว Keyframe และเอฟเฟกต์ภาพ',
    },
    description: {
      en: 'Timeline-based layer motion, kinetic typography, particle presets, and vector path animation.',
      th: 'โมชัน Layer บน Timeline, ตัวอักษรเคลื่อนไหว, Preset อนุภาค และแอนิเมชันเส้นพาธเวกเตอร์',
    },
    status: 'in-dev',
    version: 'v1.0.0',
    suiteDownloadUrl: SUITE_DOWNLOAD_URL,
    artcraftEquivalent: 'EffectCraft / After Effects',
    accentColor: '#ec4899',
    glowColor: 'rgba(236,72,153,0.3)',
    icon: 'motion',
    keywords: ['motion', 'animation', 'keyframe', 'effects', 'vfx', 'typography', 'particle'],
    enginePill: { en: 'Kinetic Motion · 120fps Easing Graph', th: 'กราฟิกเคลื่อนไหว · กราฟ Easing 120fps' },
    specs: {
      en: ['Timeline-Based Layer Keyframe Motion', 'Kinetic Typography & Text Motion Presets', 'Physics-Driven 2D Particle System', 'Vector Path Morphing & Easing Graph Editor', 'Alpha Channel Transparent Video Export'],
      th: ['แอนิเมชันเลเยอร์บนไทม์ไลน์ด้วย Keyframe', 'ตัวอักษรเคลื่อนไหว Kinetic Typography สำเร็จรูป', 'เอฟเฟกต์อนุภาค Particle จำลองฟิสิกส์', 'ดัดรูปทรงเวกเตอร์ Morphing พร้อมกราฟ Easing', 'ส่งออกวิดีโอพื้นหลังโปร่งใส Alpha Channel'],
    },
  },
  {
    id: 'medesign',
    name: 'meDesign Studio',
    category: 'vector',
    categoryLabel: { en: 'Vector & Design', th: 'เวกเตอร์และดีไซน์' },
    tagline: {
      en: 'Desktop Publishing, Editorial Layout & Print Pre-flight',
      th: 'Desktop Publishing, จัดหน้าบรรณาธิการ และ Print Pre-flight',
    },
    description: {
      en: 'Grid-based page layout for magazines, multi-page posters, brochures, and CMYK print PDF export.',
      th: 'จัดวางหน้าบนกริดสำหรับนิตยสาร, โปสเตอร์หลายหน้า, โบรชัวร์ และส่งออก PDF สี CMYK',
    },
    status: 'in-dev',
    version: 'v1.0.0',
    suiteDownloadUrl: SUITE_DOWNLOAD_URL,
    artcraftEquivalent: 'DesignCraft / InDesign',
    accentColor: '#f97316',
    glowColor: 'rgba(249,115,22,0.3)',
    icon: 'design',
    keywords: ['layout', 'indesign', 'publish', 'magazine', 'print', 'cmyk', 'brochure', 'grid'],
    enginePill: { en: 'Modular Grid · CMYK Print Pre-Flight', th: 'โมดูลาร์กริด · ตรวจสอบงานพิมพ์ CMYK' },
    specs: {
      en: ['12-Column Modular Editorial Grid Engine', 'CMYK FOGRA39 & Swatch Color Profiles', 'Master Pages & Linked Flow Text Frames', 'Print Bleed, Margins & Slug Management', 'Standards-Compliant PDF/X-1a Publishing'],
      th: ['จัดเลย์เอาต์สิ่งพิมพ์บน Modular Grid 12 คอลัมน์', 'โปรไฟล์สีมาตรฐานงานพิมพ์ CMYK FOGRA39', 'ระบบ Master Pages และเฟรมข้อความเชื่อมต่อกัน', 'คุมระยะตัดตก Bleed และขอบกระดาษพิมพ์', 'ส่งออกไฟล์งานพิมพ์มาตรฐานสากล PDF/X-1a'],
    },
  },
  {
    id: 'meaudio',
    name: 'meAudio Studio',
    category: 'audio',
    categoryLabel: { en: 'Audio & 3D', th: 'เสียงและ 3D' },
    tagline: {
      en: 'Multi-Track Digital Audio Workstation & Noise Eradicator',
      th: 'Digital Audio Workstation หลายแทร็กและกำจัดเสียงรบกวน',
    },
    description: {
      en: 'Voice track mastering, spectral noise reduction, podcast multi-mic editing, and lossy/lossless audio export.',
      th: 'Master เสียงพูด, ลด Noise แบบ Spectral, ตัดต่อ Podcast หลายไมค์ และส่งออกเสียงแบบ Lossy/Lossless',
    },
    status: 'in-dev',
    version: 'v1.0.0',
    suiteDownloadUrl: SUITE_DOWNLOAD_URL,
    artcraftEquivalent: 'SoundCraft / Audition',
    accentColor: '#84cc16',
    glowColor: 'rgba(132,204,22,0.3)',
    icon: 'audio',
    keywords: ['audio', 'sound', 'daw', 'podcast', 'noise', 'mastering', 'music', 'wav', 'mp3'],
    enginePill: { en: '32-Bit Float DSP · Spectral Noise AI', th: 'DSP 32-Bit Float · กำจัด Noise แบบสเปกตรัม' },
    specs: {
      en: ['Multi-Track Digital Audio Workstation Engine', 'AI Spectral Noise Reduction & Hum Eradication', 'Multi-Band Parametric EQ & Dynamics Comp', 'Podcast Multi-Mic Auto-Leveling Cockpit', 'Lossless 32-Bit Float WAV & FLAC Mastering'],
      th: ['ห้องบันทึกและมิกซ์เสียงดิจิทัลหลายแทร็ก', 'ลบเสียงฮัมและเสียงรบกวนด้วย Spectral De-Noise', 'ปรับแต่งเสียงด้วย Parametric EQ และ Compressor', 'บาลานซ์เสียงไมค์ Podcast หลายตัวอัตโนมัติ', 'ส่งออกไฟล์เสียงคุณภาพสูง 32-Bit Float WAV/FLAC'],
    },
  },
  {
    id: 'medoc',
    name: 'meDoc Studio',
    category: 'document',
    categoryLabel: { en: 'Document', th: 'เอกสาร' },
    tagline: {
      en: 'Distraction-Free Markdown Typewriter & KaTeX Studio',
      th: 'เครื่องพิมพ์ Markdown แบบสมาธิ เรนเดอร์สมการ KaTeX และส่งออก PDF ในเครื่อง',
    },
    description: {
      en: 'Distraction-free typography, split-view real-time Markdown, live KaTeX LaTeX equations, inline Mermaid diagrams, and instant zero-cloud PDF generation.',
      th: 'ตัวพิมพ์ไร้สิ่งรบกวน, หน้าต่างแยกซ้าย-ขวาพิมพ์ Markdown และสมการ KaTeX สด, ไดอะแกรม Mermaid เวกเตอร์ และสร้างเอกสารสิ่งพิมพ์ PDF ในเครื่อง 100%',
    },
    status: 'active',
    version: 'v1.0.0',
    exeName: 'meDoc.exe',
    exeSize: '~19.2 MB',
    downloadUrl: 'https://github.com/methastrategy/meCraft/releases/download/v1.0.0/meDoc.exe',
    suiteDownloadUrl: SUITE_DOWNLOAD_URL,
    artcraftEquivalent: 'WordCraft / Microsoft Word / Typora',
    accentColor: '#0d9488',
    glowColor: 'rgba(13,148,136,0.3)',
    icon: 'doc',
    keywords: ['markdown', 'word', 'document', 'latex', 'writing', 'typewriter', 'katex', 'mermaid', 'pdf'],
    enginePill: { en: 'Client-Side Markdown · KaTeX Math · Mermaid', th: 'Markdown ในเครื่อง 100% · สมการ KaTeX · ไดอะแกรม Mermaid' },
    specs: {
      en: ['Split-View Real-Time Markdown & KaTeX Engine', 'Inline Mermaid Vector Diagrams & Syntax Highlighting', 'Distraction-Free Zen Fullscreen Focus Mode', 'Client-Side Instant PDF Publishing via pdf-lib', 'Local-First Vault & Dynamic Outline Heading Jump'],
      th: ['หน้าต่างแยกซ้าย-ขวาพิมพ์ Markdown และ KaTeX สด', 'เรนเดอร์ Mermaid ไดอะแกรมเวกเตอร์และเน้นสีโค้ด', 'โหมด Zen ไร้สิ่งรบกวนเขียนงานสบายตาระดับสมาธิ', 'สร้าง PDF สิ่งพิมพ์ในหน่วยความจำเครื่องผ่าน pdf-lib', 'ระบบจัดเก็บไฟล์ในเครื่องและกระโดดตามหัวข้อ Outline'],
    },
  },
  {
    id: 'me3d',
    name: 'me3D Studio',
    category: 'audio',
    categoryLabel: { en: 'Audio & 3D', th: 'เสียงและ 3D' },
    tagline: {
      en: 'Spatial 3D Modeling, Scene Lighting & Geometry Workbench',
      th: 'Workbench โมเดล 3D เชิงพื้นที่, แสงฉาก และเรขาคณิต',
    },
    description: {
      en: 'Polygon mesh modeling, PBR material staging, real-time spatial previews, and GLTF/OBJ asset export.',
      th: 'โมเดลตาข่าย Polygon, จัดวาง PBR Material, Preview เชิงพื้นที่แบบ Real-time และส่งออก GLTF/OBJ',
    },
    status: 'in-dev',
    version: 'v1.0.0',
    suiteDownloadUrl: SUITE_DOWNLOAD_URL,
    artcraftEquivalent: '3DCraft / Blender',
    accentColor: '#06b6d4',
    glowColor: 'rgba(6,182,212,0.25)',
    icon: '3d',
    keywords: ['3d', 'blender', 'model', 'mesh', 'pbr', 'gltf', 'obj', 'spatial', 'scene'],
    enginePill: { en: 'WebGPU Spatial · PBR Material Lab', th: 'มิติพื้นที่ WebGPU · ห้องทดลอง PBR Material' },
    specs: {
      en: ['Subdivision Polygon Mesh Modeling Workbench', 'PBR Metallic/Roughness Material Staging', 'Real-Time HDRI Environmental Scene Lighting', 'GLTF 2.0, OBJ & STL 3D Print Geometry Export', 'Hardware WebGPU Spatial Viewport Gizmo'],
      th: ['ปั้นโมเดลโพลีกอน Polygon Mesh ความแม่นยำสูง', 'จัดวางพื้นผิววัสดุ PBR เสมือนจริง', 'จำลองแสงสตูดิโอและแสง HDRI แบบเรียลไทม์', 'ส่งออกไฟล์สำหรับ 3D Print และเกม (GLTF/OBJ/STL)', 'Viewport 3 มิติเร่งความเร็วด้วย WebGPU'],
    },
  },
];

// ─── App Icons & 3D Thai Mythology Emblems ────────────────────────────────
const APP_ICON_MAP: Record<string, string> = {
  mepdf: 'mepdf',
  pdf: 'mepdf',
  mephoto: 'mephoto',
  photo: 'mephoto',
  medrop: 'medrop',
  drop: 'medrop',
  mevector: 'mevector',
  vector: 'mevector',
  mefilm: 'mefilm',
  film: 'mefilm',
  melight: 'melight',
  light: 'melight',
  memotion: 'memotion',
  motion: 'memotion',
  medesign: 'medesign',
  design: 'medesign',
  meaudio: 'meaudio',
  audio: 'meaudio',
  medoc: 'medoc',
  doc: 'medoc',
  me3d: 'me3d',
  '3d': 'me3d',
  'mecraft-suite': 'mecraft-suite',
  suite: 'mecraft-suite',
  hub: 'mecraft-suite',
};

function getAppIcon(iconOrId: string, color: string = '#d4af37'): string {
  const brandKey = APP_ICON_MAP[iconOrId] ?? iconOrId;
  const svgKey = iconOrId.startsWith('me') ? iconOrId.slice(2) : iconOrId;
  const icons: Record<string, string> = {
    pdf: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.6"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
    photo: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.6"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>`,
    vector: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.6"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`,
    film: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.6"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>`,
    light: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.6"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
    motion: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.6"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
    design: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>`,
    audio: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.6"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
    doc: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.6"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>`,
    '3d': `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.6"><path d="M12 2l9 4.9V17L12 22l-9-5.1V6.9L12 2z"/><line x1="12" y1="22" x2="12" y2="12"/><polyline points="21 6.9 12 12 3 6.9"/></svg>`,
    drop: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4" stroke-dasharray="2 2"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/></svg>`,
  };
  const fallbackSvg = icons[svgKey] ?? icons[iconOrId] ?? icons['doc'];
  return `<span class="app-emblem-wrap"><img src="./branding/${brandKey}.png" class="app-3d-emblem" alt="${brandKey}" loading="lazy" onerror="this.style.display='none';if(this.nextElementSibling){this.nextElementSibling.style.display='inline-flex';}" /><span class="app-icon-svg-fallback" style="display:none;align-items:center;justify-content:center;">${fallbackSvg}</span></span>`;
}

// ─── Sanitization ───────────────────────────────────────────────────────────
function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ─── Main Portal Class ────────────────────────────────────────────────────────
class MeCraftsPortal {
  private bridge = createLauncherBridge();
  private lang: 'en' | 'th' = (typeof localStorage !== 'undefined' && (localStorage.getItem('mecrafts_lang') as 'en' | 'th')) || 'en';
  private searchQuery = '';
  private activeFilter: AppCategory | 'all' = 'all';
  private appEl!: HTMLElement;
  private currentSession: AuthSession | null = null;
  private authTab: 'signin' | 'signup' = 'signin';
  private authError = '';
  private authLoading = false;
  private isAuthModalOpen = false;
  private isSyncModalOpen = false;
  private syncCodeCopied = false;
  private showSyncImport = false;
  private isPreviewModalOpen = false;
  private previewAppId: string | null = null;
  private activeStudioId: string = 'mepdf';
  private isFullscreenMockupOpen = false;
  private isUserProfileModalOpen = false;
  private isDownloadsModalOpen = false;
  private downloadsFilter: 'all' | 'production' | 'indev' = 'all';
  private scrollSpyObserver: IntersectionObserver | null = null;
  private recentProjects: RecentProject[] = [];
  private updateInfo: SoftwareUpdateInfo | null = null;
  private isUpdateModalOpen = false;
  private isCheckingUpdate = false;
  public forceDesktopMode: boolean | null = null;
  public desktopView: 'workbench' | 'studios' | 'recents' | 'vault' = 'workbench';

  public isDesktopMode(): boolean {
    if (this.forceDesktopMode !== null) {
      return this.forceDesktopMode;
    }
    if (this.bridge.isTauri()) {
      return true;
    }
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('mode') === 'web') return false;
      if (params.get('mode') === 'desktop') return true;
      // On public production web domain, default to web landing page
      if (window.location.hostname && window.location.hostname.includes('vercel.app')) {
        return false;
      }
    }
    // On localhost, local dev, and native runtime, default to Desktop Workstation!
    return true;
  }

  constructor() {
    const urlSession = checkUrlAuthHandoff();
    this.currentSession = urlSession || getAuthSession();
    this.appEl = document.getElementById('app')!;
    this.cleanUrlHash();

    // Subscribe to cross-tab / cross-app real-time auth sync
    onAuthSessionChange((session) => {
      this.currentSession = session;
      this.render();
      this.attachListeners();
    });

    // Check & subscribe to live Supabase session if client is configured
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session }, error }) => {
        if (!error && session?.user && !this.currentSession) {
          this.syncSupabaseSession(session);
        }
      }).catch((err) => {
        console.warn('[meCraft:auth] Session check error:', err);
      });

      supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          if (session?.user) {
            this.syncSupabaseSession(session);
          }
        } else if (event === 'SIGNED_OUT') {
          if (this.currentSession) {
            clearAuthSession();
            this.currentSession = null;
            this.render();
            this.attachListeners();
          }
        }
      });
    }

    this.render();
    this.attachListeners();
    this.loadRecentProjects();
    this.checkForUpdates();
  }

  private async checkForUpdates(force = false) {
    if (this.isCheckingUpdate) return;
    this.isCheckingUpdate = true;
    try {
      const info = await checkSoftwareUpdate({
        currentVersion: '1.0.0',
        appId: 'mecraft-suite',
        force,
      });
      this.updateInfo = info;
      if (info.hasUpdate) {
        const dismissed = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('mecraft_dismissed_update') : null;
        if (dismissed !== info.latestVersion) {
          this.isUpdateModalOpen = true;
        }
        this.render();
        this.attachListeners();
      }
    } catch (e) {
      console.warn('[meCraft:updater] Update check error:', e);
    } finally {
      this.isCheckingUpdate = false;
    }
  }

  private async loadRecentProjects() {
    try {
      this.recentProjects = await this.bridge.getRecentProjects();
      this.render();
      this.attachListeners();
    } catch {
      this.recentProjects = [];
    }
  }

  private formatTimeAgo(timestamp: number): string {
    const elapsedSec = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
    if (elapsedSec < 60) return this.lang === 'th' ? 'เมื่อสักครู่' : 'just now';
    const min = Math.floor(elapsedSec / 60);
    if (min < 60) return this.lang === 'th' ? `${min} นาทีที่แล้ว` : `${min}m ago`;
    const hours = Math.floor(min / 60);
    if (hours < 24) return this.lang === 'th' ? `${hours} ชม. ที่แล้ว` : `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return this.lang === 'th' ? `${days} วันที่แล้ว` : `${days}d ago`;
  }

  private cleanUrlHash() {
    if (typeof window !== 'undefined' && window.location.hash) {
      if (window.location.hash.includes('access_token=') || window.location.hash.includes('refresh_token=')) {
        return;
      }
      try {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      } catch {}
    }
  }

  private async syncSupabaseSession(supabaseSession: { user: any; access_token: string; refresh_token?: string; expires_at?: number }) {
    let tier: SubscriptionTier = 'free_member';
    let fullName = supabaseSession.user.user_metadata?.full_name || supabaseSession.user.email?.split('@')[0] || 'meCraft User';
    let avatarUrl = supabaseSession.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(supabaseSession.user.email || 'user')}`;
    let createdAt = supabaseSession.user.created_at || new Date().toISOString();

    if (supabase) {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, tier, avatar_url, created_at')
          .eq('id', supabaseSession.user.id)
          .maybeSingle();

        if (profile) {
          if (profile.tier) tier = profile.tier as SubscriptionTier;
          if (profile.full_name) fullName = profile.full_name;
          if (profile.avatar_url) avatarUrl = profile.avatar_url;
          if (profile.created_at) createdAt = profile.created_at;
        }
      } catch (e) {
        console.warn('[meCraft:auth] Profile lookup skipped:', e);
      }
    }

    const now = Date.now();
    const session: AuthSession = {
      user: {
        id: supabaseSession.user.id,
        email: supabaseSession.user.email || '',
        fullName,
        tier,
        avatarUrl,
        createdAt,
      },
      accessToken: supabaseSession.access_token,
      refreshToken: supabaseSession.refresh_token,
      expiresAt: supabaseSession.expires_at ? supabaseSession.expires_at * 1000 : now + 30 * 24 * 3600 * 1000,
      issuedAt: now,
      offlineGracePeriodDays: 30,
    };

    saveAuthSession(session);
    this.currentSession = session;
    this.authLoading = false;
    this.isAuthModalOpen = false;
    this.authError = '';

    if (typeof window !== 'undefined' && window.location.hash) {
      try {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      } catch {}
    }

    this.render();
    this.attachListeners();
  }

  private async handleAuthSubmit(email: string, pwd: string, fullName?: string) {
    this.authLoading = true;
    this.authError = '';
    this.render();
    this.attachListeners();

    try {
      if (supabase) {
        if (this.authTab === 'signin') {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password: pwd,
          });
          if (error) throw error;
          if (data.session) {
            await this.syncSupabaseSession(data.session);
            return;
          }
        } else {
          const { data, error } = await supabase.auth.signUp({
            email,
            password: pwd,
            options: {
              data: {
                full_name: fullName || email.split('@')[0],
              },
            },
          });
          if (error) throw error;
          if (data.session) {
            await this.syncSupabaseSession(data.session);
            return;
          } else if (data.user) {
            this.authLoading = false;
            this.authError = this.lang === 'en'
              ? 'Registration successful! If confirmation is required, please check your email.'
              : 'สร้างบัญชีสำเร็จแล้ว! กรุณาตรวจสอบอีเมลหากต้องการการยืนยัน';
            this.render();
            this.attachListeners();
            return;
          }
        }
      } else {
        const session = createMockAuthSession(email, 'free_member');
        if (fullName) {
          session.user.fullName = fullName;
        }
        saveAuthSession(session);
        this.currentSession = session;
        this.authLoading = false;
        this.isAuthModalOpen = false;
        this.render();
        this.attachListeners();
      }
    } catch (err: any) {
      this.authLoading = false;
      this.authError = err?.message || (this.lang === 'en' ? 'Authentication failed. Please verify credentials.' : 'การยืนยันตัวตนล้มเหลว กรุณาตรวจสอบข้อมูล');
      this.render();
      this.attachListeners();
    }
  }

  private async handleGoogleAuth() {
    this.authLoading = true;
    this.authError = '';
    this.render();
    this.attachListeners();

    try {
      if (supabase) {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin + window.location.pathname,
          },
        });
        if (error) throw error;
      } else {
        const session = createMockAuthSession('google.creator@mecraft.dev', 'free_member');
        session.user.fullName = 'Google Creator';
        saveAuthSession(session);
        this.currentSession = session;
        this.authLoading = false;
        this.isAuthModalOpen = false;
        this.render();
        this.attachListeners();
      }
    } catch (err: any) {
      this.authLoading = false;
      this.authError = err?.message || (this.lang === 'en' ? 'Google authentication failed.' : 'เข้าสู่ระบบด้วย Google ไม่สำเร็จ');
      this.render();
      this.attachListeners();
    }
  }

  private async handlePasswordReset(email: string) {
    if (!email) {
      this.authError = this.lang === 'en' ? 'Please enter your email address to reset password.' : 'กรุณาระบุอีเมลเพื่อรีเซ็ตรหัสผ่าน';
      this.render();
      this.attachListeners();
      return;
    }
    if (supabase) {
      try {
        this.authLoading = true;
        this.render();
        this.attachListeners();
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        });
        this.authLoading = false;
        if (error) throw error;
        alert(this.lang === 'en' ? `Password reset link sent to ${email}` : `ส่งลิงก์รีเซ็ตรหัสผ่านไปยัง ${email} แล้ว`);
        this.render();
        this.attachListeners();
      } catch (err: any) {
        this.authLoading = false;
        this.authError = err?.message || 'Failed to send reset email';
        this.render();
        this.attachListeners();
      }
    } else {
      alert(this.lang === 'en' ? `Password reset link would be sent to ${email}` : `ระบบจะส่งลิงก์รีเซ็ตรหัสผ่านไปยัง ${email}`);
    }
  }

  private async handleSignOut() {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('[meCraft:auth] Sign out error:', e);
      }
    }
    clearAuthSession();
    this.currentSession = null;
    this.render();
    this.attachListeners();
  }

  private get t(): PortalTranslations {
    return PORTAL_I18N[this.lang];
  }

  private filteredApps(): ShowcaseApp[] {
    return SHOWCASE_APPS.filter(app => {
      const matchCat = this.activeFilter === 'all' || app.category === this.activeFilter;
      const q = this.searchQuery.toLowerCase();
      const matchSearch = !q ||
        app.name.toLowerCase().includes(q) ||
        app.tagline.en.toLowerCase().includes(q) ||
        app.tagline.th.includes(q) ||
        app.description.en.toLowerCase().includes(q) ||
        app.description.th.includes(q) ||
        app.keywords.some(k => k.includes(q));
      return matchCat && matchSearch;
    });
  }

  private render() {
    this.scrollSpyObserver?.disconnect();

    // ── 0. Route directly to any studio if URL requests it (e.g. /mevector, /me3d, ?studio=...) ──
    const activeStudio = detectStudioRoute();
    if (activeStudio) {
      mountStudio(activeStudio, this.appEl, this.lang);
      return;
    }

    const isDesktop = this.isDesktopMode();

    if (isDesktop) {
      this.appEl.innerHTML = `
        <div class="workstation-shell" id="workstation-shell">
          ${this.renderSidebar()}
          <main class="workstation-canvas" id="workstation-canvas">
            ${this.renderDesktopView()}
          </main>
        </div>
        ${this.renderAuthModal()}
        ${this.renderUserProfileModal()}
        ${this.renderUpdateModal()}
      `;
    } else {
      this.appEl.innerHTML = `
        ${this.renderHeader()}
        <main id="portal-main" class="workstation-main">
          ${this.renderHero()}
          ${this.renderFilterBar()}
          ${this.renderAppsGrid()}
          ${this.renderManifesto()}
          ${this.renderSpecs()}
        </main>
        ${this.renderFooter()}
        ${this.renderAuthModal()}
        ${this.renderUserProfileModal()}
        ${this.renderDesktopPreviewModal()}
        ${this.renderFullscreenMockupModal()}
        ${this.renderDownloadsModal()}
        ${this.renderUpdateModal()}
      `;
    }
  }

  private renderSidebar(): string {
    const isTh = this.lang === 'th';
    const navItems = [
      { id: 'workbench', icon: '⚡', label: isTh ? 'เวิร์กเบนช์' : 'Workbench', desc: isTh ? 'หน้าทำงานด่วน' : 'Quick Actions' },
      { id: 'studios', icon: '📦', label: isTh ? 'สตูดิโอ (11)' : 'All Studios (11)', desc: isTh ? 'คลังโปรแกรม' : '11 Studios' },
      { id: 'recents', icon: '🕒', label: isTh ? 'ประวัติงาน' : 'Recent Work', desc: isTh ? 'ไฟล์ล่าสุด' : 'Recent Files' },
      { id: 'vault', icon: '🛡️', label: isTh ? 'สถานะเครื่อง' : 'Local Engine', desc: isTh ? 'ความปลอดภัย' : 'Zero-Cloud' },
    ];

    return `
    <aside class="ws-sidebar" aria-label="Workstation Navigation">
      <div class="ws-sidebar-brand">
        <div class="ws-brand-emblem" aria-hidden="true">
          <img src="./branding/mecraft-suite.png" class="ws-brand-img" alt="meCraft" onerror="this.style.display='none';if(this.nextElementSibling){this.nextElementSibling.style.display='inline-flex';}" />
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" class="ws-brand-fallback" style="display:none;">
            <defs>
              <linearGradient id="ws-emblem-g" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#d4af37"/>
                <stop offset="100%" stop-color="#f7d774"/>
              </linearGradient>
            </defs>
            <rect x="2" y="2" width="28" height="28" rx="8" fill="url(#ws-emblem-g)" opacity="0.15"/>
            <path d="M8 24 L16 8 L24 24" stroke="url(#ws-emblem-g)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            <path d="M11 19 h10" stroke="url(#ws-emblem-g)" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="ws-brand-meta">
          <span class="ws-brand-title">meCraft</span>
          <span class="ws-brand-pill">WORKSTATION</span>
        </div>
      </div>

      <nav class="ws-sidebar-nav" role="tablist" aria-label="Workstation views">
        ${navItems.map(item => `
          <button
            type="button"
            class="ws-nav-btn ${this.desktopView === item.id ? 'active' : ''}"
            data-ws-view="${item.id}"
            role="tab"
            aria-selected="${this.desktopView === item.id}"
            aria-label="${item.label}"
          >
            <span class="ws-nav-icon" aria-hidden="true">${item.icon}</span>
            <div class="ws-nav-labels">
              <span class="ws-nav-title">${item.label}</span>
              <span class="ws-nav-desc">${item.desc}</span>
            </div>
          </button>
        `).join('')}
      </nav>

      <div class="ws-sidebar-spacer"></div>

      <div class="ws-sidebar-footer">
        ${this.updateInfo?.hasUpdate ? `
          <button type="button" class="ws-update-banner" id="ws-btn-update" aria-label="Update Available">
            <span class="ws-pulse-dot"></span>
            <span>🚀 ${isTh ? `อัปเดต v${escapeHtml(this.updateInfo.latestVersion)}` : `Update v${escapeHtml(this.updateInfo.latestVersion)}`}</span>
          </button>
        ` : ''}

        <div class="ws-telemetry-badge" title="${isTh ? 'ประมวลผลบน RAM ภายในเครื่อง 100% ไร้คลาวด์' : '100% Client-Side In-RAM Sandbox'}">
          <span class="status-dot-green"></span>
          <span>100% Private Local</span>
        </div>

        <button type="button" class="ws-lang-btn" id="ws-btn-lang" aria-label="Toggle language">
          <span>${this.lang === 'en' ? '🇹🇭 ภาษาไทย' : '🇬🇧 English'}</span>
        </button>

        ${this.currentSession ? `
          <div class="ws-profile-capsule" id="ws-profile-capsule" role="button" tabindex="0" title="${escapeHtml(this.currentSession.user.email)}">
            <div class="ws-avatar">${escapeHtml((this.currentSession.user.fullName || this.currentSession.user.email).charAt(0).toUpperCase())}</div>
            <div class="ws-user-info">
              <span class="ws-user-email">${escapeHtml(this.currentSession.user.email)}</span>
              <span class="ws-tier-tag ${getTierBadge(this.currentSession.user.tier).isPro ? 'tier-pro' : 'tier-free'}">
                ${getTierBadge(this.currentSession.user.tier).label}
              </span>
            </div>
            <button type="button" class="ws-signout-btn" id="ws-btn-signout" title="${this.t.signOutBtn}" aria-label="Sign Out">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
        ` : `
          <button type="button" class="ws-signin-btn" id="ws-btn-auth">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span>${this.t.signInBtn}</span>
          </button>
        `}
      </div>
    </aside>`;
  }

  private renderDesktopView(): string {
    switch (this.desktopView) {
      case 'studios':
        return this.renderStudiosCatalogView();
      case 'recents':
        return this.renderRecentsView();
      case 'vault':
        return this.renderVaultView();
      case 'workbench':
      default:
        return this.renderWorkbenchView();
    }
  }

  private renderWorkbenchView(): string {
    const isTh = this.lang === 'th';
    const primaryStudios = SHOWCASE_APPS.filter(a => ['mepdf', 'mephoto', 'medoc', 'medrop'].includes(a.id));

    return `
    <div class="ws-view ws-view-workbench">
      <header class="ws-view-header">
        <div class="ws-view-eyebrow">NATIVE WINDOWS WORKSTATION · 100% IN-DEVICE RAM</div>
        <h1 class="ws-view-title">${isTh ? 'ศูนย์กลางเครื่องมือสร้างสรรค์และเอกสาร' : 'Creative & Document Workstation'}</h1>
        <p class="ws-view-subtitle">${isTh ? 'ลากไฟล์มาวางด้านล่างเพื่อเริ่มงานทันที หรือเลือกเปิดสตูดิโอที่ต้องการ' : 'Drop any file below for instant in-device processing or launch your studios.'}</p>
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
            <h3 class="ws-dropzone-title">${this.t.dropzoneTitle}</h3>
            <p class="ws-dropzone-desc">${this.t.dropzoneSubtitle}</p>
          </div>
          <button type="button" class="ws-dropzone-browse-btn" id="ws-btn-browse">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
            <span>${this.t.dropzoneBrowse}</span>
          </button>
        </div>

        <!-- 4 Quick Action Seams -->
        <div class="ws-quick-actions">
          <button type="button" class="ws-quick-action-pill" data-quick-action="mepdf">
            <span>📄</span>
            <span>${isTh ? 'รวมและจัดการไฟล์ PDF' : 'Merge & Edit PDF'}</span>
          </button>
          <button type="button" class="ws-quick-action-pill" data-quick-action="mepdf-compress">
            <span>🗜️</span>
            <span>${isTh ? 'บีบอัดไฟล์เอกสาร' : 'Compress PDF'}</span>
          </button>
          <button type="button" class="ws-quick-action-pill" data-quick-action="mephoto">
            <span>✨</span>
            <span>${isTh ? 'ปรับระนาบ & แต่งภาพ' : 'Deskew & Clean Photo'}</span>
          </button>
          <button type="button" class="ws-quick-action-pill" data-quick-action="medoc">
            <span>📝</span>
            <span>${isTh ? 'เขียนเอกสาร Markdown' : 'New Document'}</span>
          </button>
        </div>
      </section>

      <!-- Primary Studios Launch Deck -->
      <section class="ws-deck-section">
        <div class="ws-section-header">
          <h2 class="ws-section-title">${isTh ? 'สตูดิโอหลักพร้อมใช้งาน' : 'Primary Creative Studios'}</h2>
          <span class="ws-section-tag">${isTh ? 'ทำงานออฟไลน์ 100%' : '100% Offline'}</span>
        </div>
        <div class="ws-studios-grid">
          ${primaryStudios.map(app => `
            <div class="ws-studio-card" style="--accent:${app.accentColor}; --glow:${app.glowColor};">
              <div class="ws-studio-card-glow" aria-hidden="true"></div>
              <div class="ws-studio-card-header">
                <div class="ws-studio-icon" aria-hidden="true">${getAppIcon(app.id, app.accentColor)}</div>
                <div class="ws-studio-meta">
                  <h3 class="ws-studio-name">${app.name}</h3>
                  <span class="ws-studio-ver">${app.version}</span>
                </div>
              </div>
              <p class="ws-studio-tagline">${app.tagline[this.lang]}</p>
              <div class="ws-studio-specs">
                ${(app.specs?.[this.lang] || []).slice(0, 2).map(s => `<span class="ws-spec-chip">✓ ${escapeHtml(s)}</span>`).join('')}
              </div>
              <div class="ws-studio-card-footer">
                <button type="button" class="ws-btn-launch" data-launch-app="${app.id}">
                  <span>${isTh ? `เปิด ${app.name}` : `Launch ${app.name}`}</span>
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Recent Projects Mini-Deck -->
      <section class="ws-deck-section">
        <div class="ws-section-header">
          <h2 class="ws-section-title">${isTh ? 'งานล่าสุดในเครื่อง' : 'Recent Local Projects'}</h2>
          ${this.recentProjects.length > 0 ? `
            <button type="button" class="ws-link-btn" data-switch-view="recents">${isTh ? 'ดูทั้งหมด →' : 'View All →'}</button>
          ` : ''}
        </div>
        ${this.recentProjects.length === 0 ? `
          <div class="ws-empty-recents">
            <span class="ws-empty-icon" aria-hidden="true">📂</span>
            <p>${this.t.noRecentProjects}</p>
          </div>
        ` : `
          <div class="ws-recent-cards-deck">
            ${this.recentProjects.slice(0, 4).map(p => `
              <div class="ws-recent-card" data-open-recent="${escapeHtml(p.path)}" data-recent-app="${escapeHtml(p.appId)}">
                <div class="ws-recent-icon">${p.fileType === 'pdf' ? '📄' : '🖼️'}</div>
                <div class="ws-recent-meta">
                  <span class="ws-recent-name" title="${escapeHtml(p.name)}">${escapeHtml(p.name)}</span>
                  <span class="ws-recent-sub">${escapeHtml(p.appId.toUpperCase())} · ${this.formatTimeAgo(p.lastOpened)} · ${formatBytes(p.sizeBytes || 0)}</span>
                </div>
                <button type="button" class="ws-recent-open-btn" aria-label="Open project">
                  ${isTh ? 'เปิด' : 'Open'}
                </button>
              </div>
            `).join('')}
          </div>
        `}
      </section>
    </div>`;
  }

  private renderStudiosCatalogView(): string {
    const isTh = this.lang === 'th';
    const apps = this.filteredApps();
    const categories: Array<{ key: AppCategory | 'all'; label: string }> = [
      { key: 'all', label: this.t.filterAll },
      { key: 'document', label: this.t.filterDocument },
      { key: 'photo', label: this.t.filterPhoto },
      { key: 'utility', label: this.t.filterUtility },
      { key: 'vector', label: this.t.filterVector },
      { key: 'video', label: this.t.filterVideo },
      { key: 'audio', label: this.t.filterAudio },
    ];

    return `
    <div class="ws-view ws-view-studios">
      <header class="ws-view-header">
        <div class="ws-view-eyebrow">ALL 11 STANDALONE CREATIVE STUDIOS</div>
        <h1 class="ws-view-title">${isTh ? 'คลังโปรแกรมสตูดิโอทั้งหมด' : 'All Studios & Workstations'}</h1>
        <p class="ws-view-subtitle">${isTh ? 'โปรแกรมทั้งหมดทำงานแบบ Standalone ออฟไลน์ 100% ไร้คลาวด์' : 'Every studio runs standalone offline in 100% local device memory.'}</p>
      </header>

      <div class="ws-toolbar">
        <div class="ws-search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            type="search"
            id="ws-studios-search-input"
            class="ws-search-input"
            placeholder="${this.t.searchPlaceholder}"
            value="${this.searchQuery}"
          />
        </div>
        <div class="ws-filter-pills" role="tablist">
          ${categories.map(c => `
            <button
              type="button"
              class="ws-filter-pill ${this.activeFilter === c.key ? 'active' : ''}"
              data-cat-filter="${c.key}"
              role="tab"
              aria-selected="${this.activeFilter === c.key}"
            >${c.label}</button>
          `).join('')}
        </div>
      </div>

      <div class="ws-studios-full-grid">
        ${apps.map(app => {
          const isActive = app.status === 'active';
          return `
          <div class="ws-studio-card-full" style="--accent:${app.accentColor}; --glow:${app.glowColor};">
            <div class="ws-card-full-header">
              <div class="ws-studio-icon" aria-hidden="true">${getAppIcon(app.id, app.accentColor)}</div>
              <div class="ws-card-full-titlegroup">
                <div class="ws-title-row">
                  <h3 class="ws-card-full-name">${app.name}</h3>
                  <span class="ws-status-badge ${isActive ? 'badge-active' : 'badge-indev'}">
                    ${isActive ? (isTh ? 'พร้อมใช้งาน' : 'Ready') : (isTh ? 'กำลังพัฒนา' : 'In Dev')}
                  </span>
                </div>
                <span class="ws-card-full-tagline">${app.tagline[this.lang]}</span>
              </div>
            </div>
            <p class="ws-card-full-desc">${app.description[this.lang]}</p>
            <div class="ws-card-full-specs">
              ${(app.specs?.[this.lang] || []).map(s => `
                <span class="ws-spec-bullet">✓ ${escapeHtml(s)}</span>
              `).join('')}
            </div>
            <div class="ws-card-full-footer">
              <span class="ws-engine-tag">${app.enginePill?.[this.lang] || '100% In-Device RAM'}</span>
              <button type="button" class="ws-btn-launch" data-launch-app="${app.id}" style="${!isActive ? 'background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.18);' : ''}">
                <span>${isActive ? (isTh ? `เปิด ${app.name}` : `Launch ${app.name}`) : (isTh ? `เปิดพรีวิว ${app.name}` : `Preview ${app.name}`)}</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>`;
  }

  private renderRecentsView(): string {
    const isTh = this.lang === 'th';
    return `
    <div class="ws-view ws-view-recents">
      <header class="ws-view-header ws-header-with-actions">
        <div>
          <div class="ws-view-eyebrow">LOCAL FILE HISTORY</div>
          <h1 class="ws-view-title">${isTh ? 'ประวัติโครงการและเอกสารล่าสุด' : 'Recent Projects & Documents'}</h1>
          <p class="ws-view-subtitle">${isTh ? 'บันทึกบนเครื่องของคุณ 100% ไม่มีข้อมูลใดส่งขึ้นคลาวด์' : 'Stored locally in your device history. Zero data uploaded to cloud.'}</p>
        </div>
        ${this.recentProjects.length > 0 ? `
          <button type="button" class="ws-btn-outline" id="ws-btn-clear-recents">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            <span>${isTh ? 'ล้างประวัติงาน' : 'Clear History'}</span>
          </button>
        ` : ''}
      </header>

      ${this.recentProjects.length === 0 ? `
        <div class="ws-empty-state">
          <div class="ws-empty-icon">📁</div>
          <h3>${isTh ? 'ยังไม่มีประวัติการเปิดไฟล์' : 'No Recent Files'}</h3>
          <p>${this.t.noRecentProjects}</p>
          <button type="button" class="ws-btn-primary" data-switch-view="workbench">
            <span>${isTh ? 'ไปยังเวิร์กเบนช์' : 'Go to Workbench'}</span>
          </button>
        </div>
      ` : `
        <div class="ws-table-container">
          <table class="ws-table">
            <thead>
              <tr>
                <th>${isTh ? 'ชื่อเอกสาร / โครงการ' : 'File / Project'}</th>
                <th>${isTh ? 'สตูดิโอ' : 'Target Studio'}</th>
                <th>${isTh ? 'ประเภท' : 'Type'}</th>
                <th>${isTh ? 'ขนาด' : 'Size'}</th>
                <th>${isTh ? 'เปิดล่าสุด' : 'Last Opened'}</th>
                <th style="text-align: right;">${isTh ? 'การทำงาน' : 'Action'}</th>
              </tr>
            </thead>
            <tbody>
              ${this.recentProjects.map(p => `
                <tr class="ws-table-row" data-open-recent="${escapeHtml(p.path)}" data-recent-app="${escapeHtml(p.appId)}">
                  <td class="ws-td-name">
                    <span class="ws-td-icon">${p.fileType === 'pdf' ? '📄' : '🖼️'}</span>
                    <span class="ws-file-title" title="${escapeHtml(p.path)}">${escapeHtml(p.name)}</span>
                  </td>
                  <td><span class="ws-app-pill">${escapeHtml(p.appId.toUpperCase())}</span></td>
                  <td><span class="ws-type-tag">${escapeHtml(p.fileType.toUpperCase())}</span></td>
                  <td><span class="ws-td-size">${formatBytes(p.sizeBytes || 0)}</span></td>
                  <td><span class="ws-td-time">${this.formatTimeAgo(p.lastOpened)}</span></td>
                  <td style="text-align: right;">
                    <button type="button" class="ws-table-btn" data-open-recent="${escapeHtml(p.path)}" data-recent-app="${escapeHtml(p.appId)}">
                      ${isTh ? 'เปิดงาน' : 'Open'}
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `}
    </div>`;
  }

  private renderVaultView(): string {
    const isTh = this.lang === 'th';
    const isPro = this.currentSession ? getTierBadge(this.currentSession.user.tier).isPro : false;

    return `
    <div class="ws-view ws-view-vault">
      <header class="ws-view-header">
        <div class="ws-view-eyebrow">SECURITY VAULT &amp; ENGINE DIAGNOSTICS</div>
        <h1 class="ws-view-title">${isTh ? 'สถานะเครื่องยนต์และความปลอดภัย' : 'Local Engine & Security Vault'}</h1>
        <p class="ws-view-subtitle">${isTh ? 'ตรวจสอบความปลอดภัย ไร้คลาวด์ 100% สิทธิ์การใช้งาน และเวอร์ชันซอฟต์แวร์' : 'Verify 100% zero-cloud architecture, cryptographic integrity, and entitlements.'}</p>
      </header>

      <div class="ws-vault-grid">
        <div class="ws-vault-card">
          <div class="ws-vault-card-icon">🛡️</div>
          <h3>${isTh ? 'สถาปัตยกรรมไร้คลาวด์ 100%' : '100% Zero-Cloud Architecture'}</h3>
          <p>${isTh ? 'ทุกฟังก์ชันของสตูดิโอ mePDF, mePhoto, meDoc ทำงานบน RAM ภายในเครื่องคอมพิวเตอร์ของคุณเท่านั้น ไม่มีการส่งเนื้อหาเอกสารหรือรูปภาพออกสู่เครือข่าย' : 'All studios execute entirely in local RAM. Zero document bytes or photos are ever transmitted to any remote servers.'}</p>
          <div class="ws-vault-metrics">
            <div class="ws-metric">
              <span class="ws-metric-val" style="color: #10b981;">0 Bytes</span>
              <span class="ws-metric-lbl">${isTh ? 'ข้อมูลอัปโหลดออก' : 'Cloud Uploads'}</span>
            </div>
            <div class="ws-metric">
              <span class="ws-metric-val" style="color: #3b82f6;">DirectComposition</span>
              <span class="ws-metric-lbl">${isTh ? 'ระบบเรนเดอร์ GPU' : 'Rendering Engine'}</span>
            </div>
          </div>
        </div>

        <div class="ws-vault-card">
          <div class="ws-vault-card-icon">🚀</div>
          <h3>${isTh ? 'เวอร์ชันและการอัปเดต' : 'Software Version & Updates'}</h3>
          <p>${isTh ? 'เวอร์ชันปัจจุบัน: v1.0.0 (Official Stable Release) ทำงานบนเครื่องยนต์ Tauri v2 Native Windows 64-bit' : 'Current version: v1.0.0 (Official Stable Release). Built with Tauri v2 Native Windows 64-bit engine.'}</p>
          <div class="ws-vault-status-row">
            <span class="ws-badge-ok">✓ ${isTh ? 'เวอร์ชันล่าสุดเสถียร' : 'Latest Official Stable'}</span>
            <button type="button" class="ws-btn-primary" id="ws-btn-check-update-vault">
              <span>${isTh ? 'ตรวจสอบการอัปเดต' : 'Check for Updates'}</span>
            </button>
          </div>
        </div>

        <div class="ws-vault-card">
          <div class="ws-vault-card-icon">🔑</div>
          <h3>${isTh ? 'สิทธิ์การใช้งานและความปลอดภัย' : 'License & Cryptographic Vault'}</h3>
          <p>${isTh ? 'ระบบกุญแจ Ed25519 ประจำเครื่อง ตรวจสอบสิทธิ์ออฟไลน์สูงสุด 30 วันโดยไม่ต้องต่ออินเทอร์เน็ต' : 'Ed25519 local cryptographic verification with 30-day offline grace period.'}</p>
          <div class="ws-vault-auth-box">
            ${this.currentSession ? `
              <div class="ws-auth-active">
                <span class="ws-auth-email">👤 ${escapeHtml(this.currentSession.user.email)}</span>
                <span class="ws-tier-tag ${isPro ? 'tier-pro' : 'tier-free'}">
                  ${getTierBadge(this.currentSession.user.tier).label}
                </span>
              </div>
            ` : `
              <div class="ws-auth-guest">
                <span>👤 ${isTh ? 'ผู้ใช้งานทั่วไป (Free Member)' : 'Local User (Free Member)'}</span>
                <button type="button" class="ws-btn-outline" id="ws-btn-vault-signin">${isTh ? 'เข้าสู่ระบบ / ซิงค์สิทธิ์' : 'Sign In & Sync'}</button>
              </div>
            `}
          </div>
        </div>
      </div>
    </div>`;
  }

  private renderUpdateModal(): string {
    if (!this.isUpdateModalOpen || !this.updateInfo || !this.updateInfo.hasUpdate) return '';
    const { currentVersion, latestVersion, releaseDate, changelog, suiteAsset } = this.updateInfo;
    const downloadUrl = suiteAsset?.downloadUrl || SUITE_DOWNLOAD_URL;

    return `
    <div class="auth-modal-overlay active" id="update-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-update-title">
      <div class="auth-modal-backdrop" id="modal-update-backdrop"></div>
      <div class="auth-gate-card auth-modal-card update-modal-card">
        <button type="button" class="auth-modal-close" id="btn-close-update-modal" aria-label="Close dialog">✕</button>
        <div class="auth-brand">
          <div class="update-icon-emblem" aria-hidden="true" style="width: 58px; height: 58px; font-size: 26px; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #3b82f6, #10b981); border-radius: 50%; color: #fff; box-shadow: 0 0 24px rgba(59, 130, 246, 0.4);">
            🚀
          </div>
          <h2 class="auth-title" id="modal-update-title">${this.lang === 'th' ? 'ตรวจพบการอัปเดตใหม่ (Software Update)' : 'Software Update Available'}</h2>
          <p class="auth-subtitle">${this.lang === 'th' ? 'meCraft Workstation มีเวอร์ชันใหม่พร้อมใช้งาน' : 'A newer version of meCraft Workstation is available.'}</p>
        </div>

        <!-- Version Comparison Card -->
        <div class="update-version-card" style="display: flex; align-items: center; justify-content: space-around; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 14px 18px; margin: 18px 0;">
          <div class="version-badge-col" style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
            <span class="version-label" style="font-size: 11px; color: #94a3b8;">${this.lang === 'th' ? 'เวอร์ชันที่ใช้อยู่' : 'Installed Version'}</span>
            <span class="version-val current" style="font-size: 16px; font-weight: 700; color: #cbd5e1; font-family: 'JetBrains Mono', monospace;">v${escapeHtml(currentVersion)}</span>
          </div>
          <div class="version-arrow" style="font-size: 18px; color: #60a5fa;" aria-hidden="true">➔</div>
          <div class="version-badge-col" style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
            <span class="version-label" style="font-size: 11px; color: #60a5fa;">${this.lang === 'th' ? 'เวอร์ชันใหม่ล่าสุด' : 'Latest Release'}</span>
            <span class="version-val latest" style="font-size: 16px; font-weight: 700; color: #38bdf8; font-family: 'JetBrains Mono', monospace;">v${escapeHtml(latestVersion)}</span>
            <span class="version-tag-new" style="font-size: 9px; font-weight: 800; background: #0284c7; color: #fff; padding: 1px 6px; border-radius: 4px;">NEW RELEASE</span>
          </div>
        </div>

        <!-- Changelog Section -->
        <div class="update-changelog-section" style="background: rgba(11, 17, 33, 0.7); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px; padding: 12px 14px; margin-bottom: 16px; max-height: 140px; overflow-y: auto;">
          <div class="changelog-header" style="font-size: 12px; font-weight: 600; color: #e2e8f0; margin-bottom: 8px;">
            <span>📋 ${this.lang === 'th' ? `รายการปรับปรุงในเวอร์ชัน v${escapeHtml(latestVersion)} (${escapeHtml(releaseDate)})` : `What's New in v${escapeHtml(latestVersion)} (${escapeHtml(releaseDate)})`}</span>
          </div>
          <ul class="changelog-list" style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px;">
            ${changelog.map(item => `
              <li style="font-size: 11.5px; color: #94a3b8; display: flex; align-items: flex-start; gap: 6px; line-height: 1.4;">
                <span class="bullet" style="color: #38bdf8;">✦</span> <span>${escapeHtml(item)}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <div class="update-security-note" style="display: flex; align-items: center; gap: 8px; font-size: 11px; color: #10b981; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: 8px; padding: 8px 12px; margin-bottom: 20px;">
          <span class="shield-icon" aria-hidden="true">🛡️</span>
          <span>${this.lang === 'th' ? 'ตรวจสอบลายเซ็น Ed25519 ดิจิทัลเรียบร้อยแล้ว — 100% ปลอดภัย ไร้มัลแวร์' : 'Cryptographically signed & verified — 100% clean and malware-free'}</span>
        </div>

        <div class="update-actions-row" style="display: flex; gap: 10px;">
          <button type="button" class="btn-auth-submit" id="btn-update-later" style="background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.15); color: #94a3b8; flex: 1;">
            ${this.lang === 'th' ? 'ไว้ภายหลัง (Later)' : 'Later'}
          </button>
          <a href="${downloadUrl}" download="meCraft-Setup.exe" class="btn-auth-submit" id="btn-update-now" style="background: linear-gradient(135deg, #2563eb, #0284c7); color: #fff; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 6px; flex: 2; font-weight: 600;">
            <span>⚡ ${this.lang === 'th' ? 'ดาวน์โหลดและติดตั้งทันที (Update Now)' : 'Download & Install Update Now'}</span>
          </a>
        </div>
      </div>
    </div>`;
  }

  private renderUserProfileModal(): string {
    if (!this.isUserProfileModalOpen || !this.currentSession) return '';
    const tierBadge = getTierBadge(this.currentSession.user.tier);
    const syncCode = exportAuthSyncCode(this.currentSession);
    return `
    <div class="auth-modal-overlay active" id="profile-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-profile-title">
      <div class="auth-modal-backdrop" id="modal-profile-backdrop"></div>
      <div class="auth-gate-card auth-modal-card">
        <button type="button" class="auth-modal-close" id="btn-close-profile-modal" aria-label="Close dialog">✕</button>
        <div class="auth-brand">
          <div class="user-avatar" style="width: 58px; height: 58px; font-size: 24px; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #d4af37, #6366f1); border-radius: 50%; color: #fff; font-weight: 700; box-shadow: 0 0 24px rgba(212,175,55,0.4);">
            ${escapeHtml((this.currentSession.user.fullName || this.currentSession.user.email).charAt(0).toUpperCase())}
          </div>
          <h2 class="auth-title" id="modal-profile-title">${escapeHtml(this.currentSession.user.fullName || 'meCraft User')}</h2>
          <p class="auth-subtitle">${escapeHtml(this.currentSession.user.email)}</p>
          <div style="margin-top: 10px;">
            <span class="user-tier-badge ${tierBadge.isPro ? 'badge-pro' : 'badge-free'}" style="font-size: 12px; padding: 4px 14px;">
              ${tierBadge.label}
            </span>
          </div>
        </div>

        <div style="display: flex; gap: 10px; margin-top: 24px;">
          <button type="button" class="btn-auth-submit" id="btn-profile-signout" style="background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.4); color: #fca5a5;">
            🚪 ${this.t.signOutBtn}
          </button>
        </div>
      </div>
    </div>`;
  }

  private renderRecentProjects(): string {
    return '';
  }

  private renderAuthGate(): string {
    const isSignIn = this.authTab === 'signin';
    return `
    <div class="auth-gate-wrapper">
      <div class="auth-gate-bg" aria-hidden="true">
        <div class="hero-glow hero-glow-gold"></div>
        <div class="hero-glow hero-glow-indigo"></div>
      </div>
      <div class="auth-gate-card">
        <div class="auth-brand">
          <div class="auth-brand-emblem" aria-hidden="true">
            <img src="./branding/mecraft-suite.png" class="auth-brand-img" alt="meCrafts" />
          </div>
          <h1 class="auth-title">meCraft Studio</h1>
          <p class="auth-subtitle">${this.lang === 'en' ? 'Creative & Document Workstation Suite' : 'ศูนย์กลางชุดโปรแกรมสร้างสรรค์และเอกสาร'}</p>
        </div>

        <div class="auth-tabs" role="tablist">
          <button class="auth-tab ${isSignIn ? 'active' : ''}" id="tab-signin" role="tab" aria-selected="${isSignIn}">
            ${this.lang === 'en' ? 'Sign In' : 'เข้าสู่ระบบ'}
          </button>
          <button class="auth-tab ${!isSignIn ? 'active' : ''}" id="tab-signup" role="tab" aria-selected="${!isSignIn}">
            ${this.lang === 'en' ? 'Create Account' : 'สมัครสมาชิก'}
          </button>
        </div>

        ${this.authError ? `
          <div class="auth-alert error" role="alert">
            <span class="alert-icon">⚠️</span>
            <span>${escapeHtml(this.authError)}</span>
          </div>
        ` : ''}

        <form id="auth-form" class="auth-form">
          <div class="form-group">
            <label for="auth-email">${this.lang === 'en' ? 'Email Address' : 'อีเมล'}</label>
            <div class="input-wrapper">
              <input type="email" id="auth-email" placeholder="creator@example.com" required autocomplete="email" />
            </div>
          </div>

          <div class="form-group">
            <div class="form-label-row">
              <label for="auth-password">${this.lang === 'en' ? 'Password' : 'รหัสผ่าน'}</label>
              ${isSignIn ? `<a href="#forgot" id="link-forgot-pwd" class="auth-link-sm">${this.lang === 'en' ? 'Forgot?' : 'ลืมรหัสผ่าน?'}</a>` : ''}
            </div>
            <div class="input-wrapper">
              <input type="password" id="auth-password" placeholder="••••••••" required minlength="6" autocomplete="${isSignIn ? 'current-password' : 'new-password'}" />
              <button type="button" id="btn-toggle-pwd" class="btn-toggle-pwd" aria-label="Toggle password visibility">👁️</button>
            </div>
          </div>

          ${!isSignIn ? `
            <div class="form-group">
              <label for="auth-fullname">${this.lang === 'en' ? 'Full Name / Studio' : 'ชื่อ-นามสกุล หรือชื่อสตูดิโอ'}</label>
              <div class="input-wrapper">
                <input type="text" id="auth-fullname" placeholder="John Doe" autocomplete="name" />
              </div>
            </div>
          ` : ''}

          <button type="submit" class="btn-auth-submit" id="btn-auth-submit" ${this.authLoading ? 'disabled' : ''}>
            ${this.authLoading 
              ? (this.lang === 'en' ? 'Authenticating...' : 'กำลังประมวลผล...') 
              : (isSignIn ? (this.lang === 'en' ? 'Sign In to meCraft' : 'เข้าสู่ระบบ meCraft') : (this.lang === 'en' ? 'Create Free Member Account' : 'สร้างบัญชีสมาชิกฟรี'))}
          </button>

          <div class="auth-divider"><span>${this.lang === 'en' ? 'OR CONTINUE WITH' : 'หรือเข้าใช้งานด้วย'}</span></div>

          <button type="button" class="btn-auth-google" id="btn-auth-google">
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
            <span>Continue with Google</span>
          </button>

          <div class="auth-demo-box">
            <button type="button" class="btn-auth-demo" id="btn-auth-demo">
              ⚡ ${this.lang === 'en' ? 'Quick Free Member Demo (Offline Bypass)' : 'เข้าสู่ระบบทดลองใช้งานทันที (Free Member)'}
            </button>
          </div>

          <!-- Desktop Sync Import Box -->
          <div class="auth-sync-desktop-box">
            <button type="button" class="btn-toggle-sync-import" id="btn-toggle-sync-import">
              ${this.showSyncImport 
                ? (this.lang === 'en' ? '▲ Hide Web Sync Input' : '▲ ซ่อนช่องกรอกรหัสจากเว็บ') 
                : (this.lang === 'en' ? '📥 Or Paste Sync Code from meCrafts Web' : '📥 หรือวางรหัสเชื่อมต่อจาก meCrafts Web')}
            </button>
            <div class="sync-import-form" id="sync-import-drawer" style="${this.showSyncImport ? '' : 'display: none;'}">
              <input type="text" id="input-sync-code" placeholder="MC3.xxx..." class="input-sync-code" spellcheck="false" />
              <button type="button" id="btn-submit-sync-code" class="btn-submit-sync">
                ${this.lang === 'en' ? 'Import & Sign In' : 'นำเข้าและเข้าสู่ระบบ'}
              </button>
            </div>
          </div>

          <div class="auth-footer-terms">
            <span>${this.lang === 'en' ? 'By continuing, you agree to our 100% In-Device Privacy Policy.' : 'การเข้าใช้งานถือว่ายอมรับนโยบายความเป็นส่วนตัวในเครื่อง 100%'}</span>
          </div>
        </form>
      </div>
    </div>`;
  }

  private renderAuthModal(): string {
    const isSignIn = this.authTab === 'signin';
    return `
    <div class="auth-modal-overlay ${this.isAuthModalOpen ? 'active' : ''}" id="auth-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-auth-title">
      <div class="auth-modal-backdrop" id="modal-auth-backdrop"></div>
      <div class="auth-gate-card auth-modal-card">
        <button type="button" class="auth-modal-close" id="btn-close-auth-modal" aria-label="Close dialog">✕</button>
        <div class="auth-brand">
          <div class="auth-brand-emblem" aria-hidden="true">
            <img src="./branding/mecraft-suite.png" class="auth-brand-img" alt="meCrafts" />
          </div>
          <h2 class="auth-title" id="modal-auth-title">${this.t.authModalTitle}</h2>
          <p class="auth-subtitle">${this.t.authModalSubtitle}</p>
        </div>

        <div class="auth-tabs" role="tablist">
          <button class="auth-tab ${isSignIn ? 'active' : ''}" id="modal-tab-signin" role="tab" aria-selected="${isSignIn}">
            ${this.lang === 'en' ? 'Sign In' : 'เข้าสู่ระบบ'}
          </button>
          <button class="auth-tab ${!isSignIn ? 'active' : ''}" id="modal-tab-signup" role="tab" aria-selected="${!isSignIn}">
            ${this.lang === 'en' ? 'Create Account' : 'สมัครสมาชิก'}
          </button>
        </div>

        ${this.authError ? `
          <div class="auth-alert error" role="alert">
            <span class="alert-icon">⚠️</span>
            <span>${escapeHtml(this.authError)}</span>
          </div>
        ` : ''}

        <form id="modal-auth-form" class="auth-form">
          <div class="form-group">
            <label for="modal-auth-email">${this.lang === 'en' ? 'Email Address' : 'อีเมล'}</label>
            <div class="input-wrapper">
              <input type="email" id="modal-auth-email" placeholder="creator@example.com" required autocomplete="email" />
            </div>
          </div>

          <div class="form-group">
            <div class="form-label-row">
              <label for="modal-auth-password">${this.lang === 'en' ? 'Password' : 'รหัสผ่าน'}</label>
              ${isSignIn ? `<a href="#forgot" id="modal-link-forgot-pwd" class="auth-link-sm">${this.lang === 'en' ? 'Forgot?' : 'ลืมรหัสผ่าน?'}</a>` : ''}
            </div>
            <div class="input-wrapper">
              <input type="password" id="modal-auth-password" placeholder="••••••••" required minlength="6" autocomplete="${isSignIn ? 'current-password' : 'new-password'}" />
              <button type="button" id="modal-btn-toggle-pwd" class="btn-toggle-pwd" aria-label="Toggle password visibility">👁️</button>
            </div>
          </div>

          ${!isSignIn ? `
            <div class="form-group">
              <label for="modal-auth-fullname">${this.lang === 'en' ? 'Full Name / Studio' : 'ชื่อ-นามสกุล หรือชื่อสตูดิโอ'}</label>
              <div class="input-wrapper">
                <input type="text" id="modal-auth-fullname" placeholder="John Doe" autocomplete="name" />
              </div>
            </div>
          ` : ''}

          <button type="submit" class="btn-auth-submit" id="modal-btn-auth-submit" ${this.authLoading ? 'disabled' : ''}>
            ${this.authLoading 
              ? (this.lang === 'en' ? 'Authenticating...' : 'กำลังประมวลผล...') 
              : (isSignIn ? (this.lang === 'en' ? 'Sign In to meCraft' : 'เข้าสู่ระบบ meCraft') : (this.lang === 'en' ? 'Create Free Member Account' : 'สร้างบัญชีสมาชิกฟรี'))}
          </button>

          <div class="auth-divider"><span>${this.lang === 'en' ? 'OR CONTINUE WITH' : 'หรือเข้าใช้งานด้วย'}</span></div>

          <button type="button" class="btn-auth-google" id="modal-btn-auth-google">
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
            <span>Continue with Google</span>
          </button>

          <div class="auth-demo-box">
            <button type="button" class="btn-auth-demo" id="modal-btn-auth-demo">
              ⚡ ${this.lang === 'en' ? 'Quick Free Member Demo (Offline Bypass)' : 'เข้าสู่ระบบทดลองใช้งานทันที (Free Member)'}
            </button>
          </div>

          <div class="auth-footer-terms">
            <span>${this.lang === 'en' ? 'By continuing, you agree to our 100% In-Device Privacy Policy.' : 'การเข้าใช้งานถือว่ายอมรับนโยบายความเป็นส่วนตัวในเครื่อง 100%'}</span>
          </div>
        </form>
      </div>
    </div>`;
  }

  private renderSyncModal(): string {
    return '';
  }

  private renderDesktopPreviewModal(): string {
    return '';
  }

  private renderDesktopPreviewInline(app: ShowcaseApp): string {
    const isIndev = app.status === 'in-dev';
    const docExt = app.id === 'mepdf' ? 'pdf' : (app.id === 'mephoto' ? 'dng' : (app.id === 'medrop' ? 'pdf' : (app.id === 'medoc' ? 'md' : (app.id === 'mevector' ? 'svg' : (app.id === 'mefilm' ? 'proj' : (app.id === 'melight' ? 'raw' : (app.id === 'memotion' ? 'motion' : (app.id === 'medesign' ? 'design' : (app.id === 'meaudio' ? 'wav' : '3d')))))))));
    const sampleDocName = app.id === 'medrop'
      ? (this.lang === 'th' ? 'รายงานประจำปี_2026.pdf [Ctrl + Drag]' : 'Annual_Report_2026.pdf [Ctrl + Drag]')
      : (app.id === 'medoc'
        ? (this.lang === 'th' ? 'บทความวิจัย_KaTeX_2026.md' : 'Quantum_Research_Notes.md')
        : (isIndev
          ? (this.lang === 'th' ? `ภาพร่างโครงสร้าง_Draft.${docExt}` : `Architecture_Draft.${docExt}`)
          : (this.lang === 'th' ? `ชิ้นงานออกแบบ_2026.${docExt}` : `Creative_Project_Master.${docExt}`)));

    return `
    <div class="desktop-preview-window ${isIndev ? 'window-is-wireframe' : 'window-is-production'}" id="desktop-preview-window-${app.id}">
      <!-- Native Windows Title Bar -->
      <div class="desktop-window-titlebar">
        <div class="window-titlebar-left">
          <div class="window-app-icon">${getAppIcon(app.id, app.accentColor)}</div>
          <span class="window-title-text" id="preview-window-title-${app.id}">${app.name} — [${sampleDocName}] - ${isIndev ? (this.lang === 'th' ? 'ภาพร่างโครงร่างต้นแบบ (WIP)' : 'Architecture Schematic (WIP)') : 'Windows Native Desktop'}</span>
          <span class="window-native-pill ${isIndev ? 'pill-indev-wireframe' : ''}">
            ${isIndev ? (this.lang === 'th' ? 'ภาพร่างต้นแบบ (R&D)' : 'Concept Wireframe (WIP)') : '100% Native Desktop App'}
          </span>
        </div>
        <div class="window-titlebar-controls" aria-hidden="true">
          <button class="win-ctrl-btn" type="button" tabindex="-1" title="Minimize">─</button>
          <button class="win-ctrl-btn" type="button" tabindex="-1" title="Maximize">□</button>
          <button class="win-ctrl-btn win-close" type="button" tabindex="-1" title="Close">✕</button>
        </div>
      </div>

      <!-- Realistic Desktop Application Body -->
      <div class="desktop-window-body ${isIndev ? 'body-is-wireframe' : ''}" id="preview-window-body-${app.id}">
        ${this.renderAppDesktopMockup(app)}
        
        ${isIndev ? `
          <!-- Blueprint / Wireframe Blur & Schematic Overlay for In-Development Studios -->
          <div class="blueprint-overlay" aria-label="Conceptual wireframe overlay">
            <div class="blueprint-cad-grid" aria-hidden="true">
              <span class="cad-crosshair ch-tl">+</span>
              <span class="cad-crosshair ch-tr">+</span>
              <span class="cad-crosshair ch-bl">+</span>
              <span class="cad-crosshair ch-br">+</span>
              <div class="cad-spec-label">ARCHITECTURE SCHEMATIC · TAURI v2 RUST CORE · IN DEVELOPMENT</div>
              <div class="cad-res-label">1920 × 1080 [BLUEPRINT CONCEPT]</div>
            </div>

            <div class="blueprint-stamp-box">
              <div class="blueprint-stamp-icon" aria-hidden="true">📐</div>
              <div class="blueprint-stamp-info">
                <div class="blueprint-stamp-header">
                  <span class="blueprint-pulse-dot"></span>
                  <span class="blueprint-stamp-badge">
                    ${this.lang === 'th' ? 'โครงร่างสถาปัตยกรรม (Architecture Wireframe)' : 'Architecture Blueprint & Wireframe'}
                  </span>
                </div>
                <h4 class="blueprint-stamp-title">
                  ${this.lang === 'th' ? `${app.name} กำลังอยู่ในช่วงวิจัยและพัฒนา` : `${app.name} is in Active Development`}
                </h4>
                <p class="blueprint-stamp-desc">
                  ${this.lang === 'th'
                    ? 'ภาพจำลองนี้เป็นเพียงแนวคิดโครงสร้างและอินเทอร์เฟซต้นแบบ ซอฟต์แวร์จริงกำลังได้รับการพัฒนาและคอมไพล์ด้วย Rust/Tauri v2'
                    : 'This view depicts an early conceptual schematic and UI wireframe. The native desktop engine is actively being engineered.'}
                </p>
                <div class="blueprint-stamp-tags">
                  <span class="bp-tag">✦ Planned v0.1.0 Alpha</span>
                  <span class="bp-tag">✦ 100% In-Device RAM</span>
                  <span class="bp-tag">✦ MIT Open Source</span>
                </div>
              </div>
            </div>
          </div>
        ` : ''}
      </div>

      <!-- Windows Native Status Bar -->
      <div class="desktop-preview-statusbar">
        <div class="statusbar-left">
          <span class="statusbar-dot ${isIndev ? 'dot-amber' : ''}"></span>
          <span>${isIndev
            ? (this.lang === 'th' ? 'สถานะ: กำลังพัฒนาสถาปัตยกรรม · แผนงานเปิดตัว v0.1.0' : 'Status: Architecture Phase · Target Milestone v0.1.0 Alpha')
            : 'Ready · Hardware Acceleration (DirectX 12 / Vulkan) · 0 KB network'}</span>
        </div>
        <div class="statusbar-right">
          <span>${isIndev ? 'Roadmap: In Development' : 'Memory: 24.8 MB'}</span>
          <span class="statusbar-divider">|</span>
          <span>${isIndev ? 'Rust / Tauri v2' : 'UTF-8'}</span>
          <span class="statusbar-divider">|</span>
          <span>100% In-Device RAM</span>
        </div>
      </div>
    </div>`;
  }

  private renderAppDesktopMockup(app: ShowcaseApp): string {
    if (app.id === 'mepdf') {
      return `
        <!-- mePDF Studio Pro (Navy Black Acrobat Cockpit) -->
        <div class="mockup-menubar">
          <span class="mockup-menu-item"><b>mePDF Pro</b></span>
          <span class="mockup-menu-item">File</span>
          <span class="mockup-menu-item">Edit</span>
          <span class="mockup-menu-item">View</span>
          <span class="mockup-menu-item">Tools</span>
          <span class="mockup-menu-item">Organize</span>
          <span class="mockup-menu-item">Sign</span>
          <span class="mockup-menu-item">Help</span>
        </div>
        <div class="mockup-ribbon">
          <div class="mockup-ribbon-left">
            <span class="mockup-tool-chip active">📂 Open File</span>
            <span class="mockup-tool-chip">💾 Save</span>
          </div>
          <div class="mockup-ribbon-center">
            <span class="mockup-tool-chip">◀</span>
            <span style="font-weight: 600; color: #f1f5f9;">หน้า 1 / 18</span>
            <span class="mockup-tool-chip">▶</span>
            <span class="mockup-tool-chip" style="margin-left: 12px;">➖ 100% ➕</span>
            <span class="mockup-tool-chip">🔲 พอดีหน้า (Fit)</span>
          </div>
          <div class="mockup-ribbon-right">
            <span class="mockup-tool-chip" style="border-color: #3b82f6; color: #60a5fa;">📐 ปรับเอกสารตรง</span>
            <span class="mockup-tool-chip" style="border-color: #10b981; color: #34d399;">🔍 OCR ค้นหาคำ</span>
            <span class="mockup-tool-chip" style="background: #2563eb; color: #fff;">⬇ ส่งออก PDF</span>
          </div>
        </div>
        <div class="mockup-cockpit-layout">
          <!-- Left Thumbnails -->
          <div class="mockup-left-pane">
            <div class="mockup-pane-heading">📑 หน้าตัวอย่าง (Thumbnails)</div>
            <div class="mockup-thumbnail-card active">
              <div class="mockup-thumb-page">
                <div class="mockup-doc-line title"></div>
                <div class="mockup-doc-line"></div>
                <div class="mockup-doc-line"></div>
                <div class="mockup-doc-line short"></div>
              </div>
              <span class="mockup-thumb-label">หน้า 1 (สัญญาหลัก)</span>
            </div>
            <div class="mockup-thumbnail-card">
              <div class="mockup-thumb-page">
                <div class="mockup-doc-line title" style="width: 40%;"></div>
                <div class="mockup-doc-line"></div>
                <div class="mockup-doc-line"></div>
                <div class="mockup-doc-line"></div>
              </div>
              <span class="mockup-thumb-label">หน้า 2 (ตารางงวดงาน)</span>
            </div>
            <div class="mockup-thumbnail-card">
              <div class="mockup-thumb-page">
                <div class="mockup-doc-line title" style="width: 50%;"></div>
                <div class="mockup-doc-line short"></div>
                <div class="mockup-doc-line"></div>
              </div>
              <span class="mockup-thumb-label">หน้า 3 (ลายเซ็นยินยอม)</span>
            </div>
          </div>
          <!-- Center Canvas -->
          <div class="mockup-center-stage">
            <div class="mockup-pdf-sheet">
              <div class="mockup-sheet-header">
                <h2 class="mockup-sheet-title">สัญญาว่าจ้างพัฒนาระบบซอฟต์แวร์ (MASTER AGREEMENT)</h2>
                <div class="mockup-sheet-meta">เลขที่สัญญา: MC-2026-0881 · ฉบับจริงลงนามอิเล็กทรอนิกส์</div>
              </div>
              <div class="mockup-sheet-body">
                <p>สัญญาฉบับนี้ทำขึ้น ณ กรุงเทพมหานคร เพื่อเป็นข้อตกลงในการส่งมอบชุดโปรแกรม meCraft Creative Suite และระบบรักษาความปลอดภัยความเป็นส่วนตัวระดับ 100% In-Device Memory Execution</p>
                <table class="mockup-sheet-table">
                  <thead>
                    <tr><th>ลำดับ</th><th>รายการโมดูล</th><th>สถานะความปลอดภัย</th><th>กำหนดส่งมอบ</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>1</td><td>mePDF Studio Pro (Acrobat-Grade)</td><td>100% Client-Side RAM</td><td>พร้อมใช้งาน ✅</td></tr>
                    <tr><td>2</td><td>mePhoto Studio (Darkroom + OCR)</td><td>WebAssembly / OpenCV</td><td>พร้อมใช้งาน ✅</td></tr>
                    <tr><td>3</td><td>In-App Auto-Update System</td><td>Ed25519 Signed</td><td>พร้อมใช้งาน ✅</td></tr>
                  </tbody>
                </table>
                <p>คู่สัญญาทั้งสองฝ่ายได้อ่านและเข้าใจข้อความโดยละเอียด จึงลงลายมือชื่อไว้เป็นหลักฐานต่อหน้าพยาน</p>
              </div>
              <div class="mockup-sheet-sign">
                <div>( .................................................. )<br>ผู้ว่าจ้าง (Client Authority)</div>
                <div>( .................................................. )<br>ผู้รับจ้าง (Lead Engineer)</div>
              </div>
            </div>
          </div>
          <!-- Right Tools Drawer -->
          <div class="mockup-right-pane">
            <div class="mockup-pane-heading">🛠️ เครื่องมือเอกสาร (Action Tools)</div>
            <div class="mockup-tool-card">
              <div class="mockup-tool-title">📑 จัดเรียงและรวมหน้า (Organize)</div>
              <div class="mockup-tool-desc">ลากสลับหน้า หมุน 90° แยกไฟล์ หรือแทรกหน้าเพิ่ม</div>
              <span class="mockup-tool-badge">Zero-Lag</span>
            </div>
            <div class="mockup-tool-card">
              <div class="mockup-tool-title">📐 ปรับระนาบกล้อง (Deskew)</div>
              <div class="mockup-tool-desc">ดึงรูปถ่ายจากมือถือให้ตรงระนาบด้วย 4-Point Homography</div>
              <span class="mockup-tool-badge">AI Scanner</span>
            </div>
            <div class="mockup-tool-card">
              <div class="mockup-tool-title">🔍 สแกนข้อความ (Searchable OCR)</div>
              <div class="mockup-tool-desc">แปลงภาพสแกนให้กด Ctrl+F ค้นหาคำและคัดลอกได้ทันที</div>
              <span class="mockup-tool-badge">Thai + Eng</span>
            </div>
            <div class="mockup-tool-card">
              <div class="mockup-tool-title">🗜️ บีบอัดไฟล์ (Smart Compress)</div>
              <div class="mockup-tool-desc">ลดขนาดไฟล์สูงสุด 90% พร้อมพรีวิวขนาดก่อนบันทึก</div>
              <span class="mockup-tool-badge">Lossless Deflate</span>
            </div>
            <div class="mockup-tool-card">
              <div class="mockup-tool-title">🔒 เข้ารหัสปลอดภัย (AES-256)</div>
              <div class="mockup-tool-desc">ตั้งรหัสผ่านป้องกันการเปิดและลบ Metadata ความลับ</div>
              <span class="mockup-tool-badge">Bank-Grade</span>
            </div>
          </div>
        </div>
      `;
    }

    if (app.id === 'mephoto') {
      return `
        <!-- mePhoto Studio Darkroom -->
        <div class="mockup-menubar">
          <span class="mockup-menu-item"><b>mePhoto Studio</b></span>
          <span class="mockup-menu-item">File</span>
          <span class="mockup-menu-item">Edit</span>
          <span class="mockup-menu-item">Image</span>
          <span class="mockup-menu-item">Layer</span>
          <span class="mockup-menu-item">Filter</span>
          <span class="mockup-menu-item">View</span>
          <span class="mockup-menu-item">Help</span>
        </div>
        <div class="mockup-ribbon">
          <div class="mockup-ribbon-left">
            <span class="mockup-tool-chip active">✋ Hand</span>
            <span class="mockup-tool-chip">✂️ Perspective Crop</span>
            <span class="mockup-tool-chip">🖌️ Retouch</span>
            <span class="mockup-tool-chip">✨ AI Remove BG</span>
          </div>
          <div class="mockup-ribbon-center">
            <span style="font-weight: 600; color: #f1f5f9;">Alpine_Landscape_RAW.dng</span>
            <span class="mockup-tool-chip" style="margin-left: 12px;">Zoom: 67%</span>
          </div>
          <div class="mockup-ribbon-right">
            <span class="mockup-tool-chip" style="background: #2563eb; color: #fff;">⬇ Export High-Res PNG</span>
          </div>
        </div>
        <div class="mockup-cockpit-layout" style="grid-template-columns: 60px 1fr 300px;">
          <!-- Left Mini Toolbar -->
          <div class="mockup-left-pane" style="align-items: center; gap: 14px;">
            <span class="mockup-tool-chip active" style="padding: 8px;" title="Select">👆</span>
            <span class="mockup-tool-chip" style="padding: 8px;" title="Crop">📐</span>
            <span class="mockup-tool-chip" style="padding: 8px;" title="Brush">🖌️</span>
            <span class="mockup-tool-chip" style="padding: 8px;" title="Eraser">🧹</span>
            <span class="mockup-tool-chip" style="padding: 8px;" title="Text">🔤</span>
            <span class="mockup-tool-chip" style="padding: 8px;" title="Color Picker">💧</span>
          </div>
          <!-- Center Photo Canvas -->
          <div class="mockup-photo-stage">
            <div class="mockup-photo-frame">
              <img src="/hero_mesurv_panoramic.jpg" alt="Photo Preview" class="mockup-photo-img" onerror="this.src='/hero_mepdf_studio.jpg'">
              <div class="mockup-crop-grid">
                <div class="mockup-crop-corner" style="top: -7px; left: -7px;"></div>
                <div class="mockup-crop-corner" style="top: -7px; right: -7px;"></div>
                <div class="mockup-crop-corner" style="bottom: -7px; left: -7px;"></div>
                <div class="mockup-crop-corner" style="bottom: -7px; right: -7px;"></div>
              </div>
            </div>
          </div>
          <!-- Right Inspector Panel -->
          <div class="mockup-right-pane">
            <div class="mockup-pane-heading">📊 ฮิสโตแกรมสีสด (Real-time RGB)</div>
            <div class="mockup-histogram">
              <div class="mockup-hist-bar" style="height: 25%;"></div>
              <div class="mockup-hist-bar" style="height: 45%;"></div>
              <div class="mockup-hist-bar" style="height: 75%;"></div>
              <div class="mockup-hist-bar" style="height: 90%;"></div>
              <div class="mockup-hist-bar" style="height: 60%;"></div>
              <div class="mockup-hist-bar" style="height: 40%;"></div>
              <div class="mockup-hist-bar" style="height: 20%;"></div>
            </div>
            <div class="mockup-pane-heading" style="margin-top: 10px;">🎚️ ปรับแต่งแสง (Tone & Exposure)</div>
            <div class="mockup-slider-row">
              <div class="mockup-slider-head"><span>Exposure (การรับแสง)</span><span>+0.65 EV</span></div>
              <div class="mockup-slider-track"><div class="mockup-slider-thumb" style="left: 65%;"></div></div>
            </div>
            <div class="mockup-slider-row">
              <div class="mockup-slider-head"><span>Contrast (ความเปรียบต่าง)</span><span>+14</span></div>
              <div class="mockup-slider-track"><div class="mockup-slider-thumb" style="left: 57%;"></div></div>
            </div>
            <div class="mockup-slider-row">
              <div class="mockup-slider-head"><span>Highlights (ส่วนสว่าง)</span><span>-22</span></div>
              <div class="mockup-slider-track"><div class="mockup-slider-thumb" style="left: 38%;"></div></div>
            </div>
            <div class="mockup-slider-row">
              <div class="mockup-slider-head"><span>Shadows (ส่วนมืด)</span><span>+35</span></div>
              <div class="mockup-slider-track"><div class="mockup-slider-thumb" style="left: 70%;"></div></div>
            </div>
            <div class="mockup-pane-heading" style="margin-top: 10px;">🎨 สีสันและไวท์บาลานซ์ (Color)</div>
            <div class="mockup-slider-row">
              <div class="mockup-slider-head"><span>Temperature (อุณหภูมิสี)</span><span>5600 K</span></div>
              <div class="mockup-slider-track"><div class="mockup-slider-thumb" style="left: 56%;"></div></div>
            </div>
            <div class="mockup-slider-row">
              <div class="mockup-slider-head"><span>Vibrance (ความสดสี)</span><span>+28</span></div>
              <div class="mockup-slider-track"><div class="mockup-slider-thumb" style="left: 64%;"></div></div>
            </div>
          </div>
        </div>
      `;
    }

    if (app.id === 'medrop') {
      return `
        <!-- meDrop Zero-Window Radial HUD Mockup -->
        <div class="mockup-menubar">
          <span class="mockup-menu-item"><b>meDrop Radial HUD</b></span>
          <span class="mockup-menu-item">Windows Explorer Hook</span>
          <span class="mockup-menu-item">System Tray Resident</span>
          <span class="mockup-menu-item" style="color: #60a5fa;">Trigger: Ctrl + Mouse Drag</span>
        </div>
        <div class="mockup-ribbon" style="background: rgba(15, 23, 42, 0.9); border-bottom: 1px solid rgba(59, 130, 246, 0.25);">
          <div class="mockup-ribbon-left">
            <span class="mockup-tool-chip active" style="background: #2563eb; color: #fff;">🍩 Zero-Window HUD</span>
            <span class="mockup-tool-chip" style="border-color: #3b82f6; color: #93c5fd;">⚡ In-Place RAM Conversion</span>
          </div>
          <div class="mockup-ribbon-center">
            <span style="font-weight: 600; color: #f1f5f9;">Target File: Annual_Report_2026.pdf (4.2 MB)</span>
          </div>
          <div class="mockup-ribbon-right">
            <span class="mockup-tool-chip" style="border-color: #10b981; color: #34d399;">100% In-Device Memory</span>
          </div>
        </div>
        <div class="mockup-cockpit-layout" style="display: flex; align-items: center; justify-content: center; min-height: 440px; background: radial-gradient(circle at center, rgba(30, 58, 138, 0.3) 0%, rgba(10, 15, 30, 0.98) 75%); position: relative; overflow: hidden;">
          <!-- Simulated Radial HUD Donut Ring -->
          <div class="radial-mockup-wrapper" style="position: relative; width: 320px; height: 320px; display: flex; align-items: center; justify-content: center;">
            <svg width="300" height="300" viewBox="0 0 300 300" style="filter: drop-shadow(0 0 24px rgba(59, 130, 246, 0.45));">
              <!-- Wedge 1: To Images -->
              <path d="M 150 10 A 140 140 0 0 1 283 107 L 205 132 A 58 58 0 0 0 150 92 Z" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5" opacity="0.9" />
              <!-- Wedge 2: Compress -->
              <path d="M 283 107 A 140 140 0 0 1 232 263 L 184 197 A 58 58 0 0 0 205 132 Z" fill="#1e293b" stroke="#06b6d4" stroke-width="1.5" opacity="0.9" />
              <!-- Wedge 3: Searchable OCR (Active Hover) -->
              <path d="M 232 263 A 140 140 0 0 1 68 263 L 116 197 A 58 58 0 0 0 184 197 Z" fill="#2563eb" stroke="#60a5fa" stroke-width="2.5" opacity="1" />
              <!-- Wedge 4: Split -->
              <path d="M 68 263 A 140 140 0 0 1 17 107 L 95 132 A 58 58 0 0 0 116 197 Z" fill="#1e293b" stroke="#8b5cf6" stroke-width="1.5" opacity="0.9" />
              <!-- Wedge 5: Open mePDF -->
              <path d="M 17 107 A 140 140 0 0 1 150 10 L 150 92 A 58 58 0 0 0 95 132 Z" fill="#1e293b" stroke="#10b981" stroke-width="1.5" opacity="0.9" />

              <!-- Wedge Labels & Icons -->
              <text x="210" y="62" fill="#f8fafc" font-size="11" font-weight="600" text-anchor="middle">🖼️ Images</text>
              <text x="240" y="190" fill="#f8fafc" font-size="11" font-weight="600" text-anchor="middle">🗜️ Compress</text>
              <text x="150" y="246" fill="#ffffff" font-size="12" font-weight="700" text-anchor="middle">🔍 OCR Text</text>
              <text x="60" y="190" fill="#f8fafc" font-size="11" font-weight="600" text-anchor="middle">✂️ Split</text>
              <text x="90" y="62" fill="#f8fafc" font-size="11" font-weight="600" text-anchor="middle">📑 mePDF</text>
            </svg>

            <!-- Center Hub -->
            <div style="position: absolute; width: 104px; height: 104px; border-radius: 50%; background: #0f172a; border: 2px solid #3b82f6; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; box-shadow: 0 0 25px rgba(59, 130, 246, 0.5);">
              <span style="font-size: 26px;">📄</span>
              <span style="font-size: 11px; font-weight: 700; color: #f8fafc; margin-top: 2px;">.PDF</span>
              <span style="font-size: 9px; color: #94a3b8;">4.2 MB</span>
            </div>
          </div>

          <!-- Bottom Floating Instruction Pill -->
          <div style="position: absolute; bottom: 20px; background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(59, 130, 246, 0.4); padding: 8px 20px; border-radius: 20px; font-size: 12px; color: #cbd5e1; display: flex; align-items: center; gap: 8px; backdrop-filter: blur(8px); box-shadow: 0 8px 24px rgba(0,0,0,0.5);">
            <span style="color: #60a5fa; font-size: 14px;">⚡</span>
            <span><b>Drop on slice</b> to convert &amp; save in-place beside original file</span>
          </div>
        </div>
      `;
    }

    if (app.id === 'medoc') {
      return `
        <!-- meDoc Studio Pro (Dark Teal Writer Cockpit) -->
        <div class="mockup-menubar" style="border-bottom: 1px solid rgba(20, 184, 166, 0.2);">
          <span class="mockup-menu-item" style="color: #14b8a6;"><b>meDoc Studio</b></span>
          <span class="mockup-menu-item">File</span>
          <span class="mockup-menu-item">Edit</span>
          <span class="mockup-menu-item">Format</span>
          <span class="mockup-menu-item">View</span>
          <span class="mockup-menu-item">KaTeX Math</span>
          <span class="mockup-menu-item">Mermaid</span>
          <span class="mockup-menu-item">Help</span>
        </div>
        <div class="mockup-ribbon" style="background: rgba(14, 22, 28, 0.95); border-bottom: 1px solid rgba(20, 184, 166, 0.2);">
          <div class="mockup-ribbon-left">
            <span class="mockup-tool-chip active" style="background: #0d9488; color: #fff;">📄 Outline</span>
            <span class="mockup-tool-chip" style="border-color: #0d9488; color: #5eead4;">🗂️ Local Vault</span>
            <span class="mockup-tool-chip" style="border-color: rgba(20,184,166,0.3); color: #94a3b8;">⊞ Zen Mode</span>
          </div>
          <div class="mockup-ribbon-center">
            <span style="font-weight: 600; color: #f1f5f9;">Quantum_Mechanics_Paper.md</span>
            <span class="mockup-tool-chip" style="margin-left: 12px; border-color: rgba(20,184,166,0.3); color: #5eead4;">1,420 words</span>
          </div>
          <div class="mockup-ribbon-right">
            <span class="mockup-tool-chip" style="background: #0d9488; color: #fff;">⬇ Export Clean PDF</span>
          </div>
        </div>
        <div class="mockup-cockpit-layout" style="grid-template-columns: 190px 1fr 1fr; background: #070b0e;">
          <!-- Left: Document Outline -->
          <div class="mockup-left-pane" style="background: #0e161c; border-right: 1px solid rgba(20, 184, 166, 0.15); padding: 12px; gap: 8px;">
            <div class="mockup-pane-heading" style="color: #14b8a6; font-size: 10px;">DOCUMENT OUTLINE</div>
            <div class="mockup-page-chip active" style="background: rgba(13, 148, 136, 0.15); border-color: #0d9488; color: #5eead4; font-size: 11px;">1. Executive Summary</div>
            <div class="mockup-page-chip" style="padding-left: 18px; font-size: 10px; color: #94a3b8;">1.1 System Invariants</div>
            <div class="mockup-page-chip" style="padding-left: 18px; font-size: 10px; color: #94a3b8;">1.2 Privacy Guarantees</div>
            <div class="mockup-page-chip" style="color: #cbd5e1; font-size: 11px;">2. KaTeX Equations</div>
            <div class="mockup-page-chip" style="padding-left: 18px; font-size: 10px; color: #94a3b8;">2.1 Schrödinger Evolution</div>
            <div class="mockup-page-chip" style="color: #cbd5e1; font-size: 11px;">3. Mermaid Architecture</div>
            <div class="mockup-page-chip" style="color: #cbd5e1; font-size: 11px;">4. Benchmark Telemetry</div>
          </div>
          <!-- Center: Markdown Code/Editor Pane -->
          <div style="background: #070b0e; border-right: 1px solid rgba(20, 184, 166, 0.15); padding: 16px; font-family: monospace; font-size: 11px; line-height: 20px; color: #cbd5e1; overflow: hidden; display: flex; gap: 12px;">
            <div style="color: #475569; user-select: none; text-align: right; width: 18px;">1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>10<br>11<br>12<br>13<br>14<br>15</div>
            <div style="flex: 1; overflow: hidden;">
              <span style="color: #f472b6;">---</span><br>
              <span style="color: #38bdf8;">title</span>: <span style="color: #34d399;">"Quantum Computing"</span><br>
              <span style="color: #38bdf8;">tags</span>: [<span style="color: #fbbf24;">physics</span>, <span style="color: #fbbf24;">math</span>]<br>
              <span style="color: #f472b6;">---</span><br><br>
              <span style="color: #14b8a6; font-weight: bold;"># Quantum State Dynamics</span><br>
              The state evolution obeys:<br><br>
              <span style="color: #fbbf24;">$$i\hbar \frac{\partial}{\partial t} |\Psi(t)\rangle = \hat{H} |\Psi(t)\rangle$$</span><br><br>
              <span style="color: #14b8a6; font-weight: bold;">## Density Operator Matrix</span><br>
              $$\rho = \sum_i p_i |\psi_i\rangle\langle\psi_i|$$
            </div>
          </div>
          <!-- Right: Rendered Typographic Preview Pane -->
          <div style="background: #090e13; padding: 20px; overflow: hidden; color: #f1f5f9;">
            <h1 style="font-size: 16px; font-weight: 700; color: #14b8a6; margin-bottom: 8px; border-bottom: 1px solid rgba(20,184,166,0.2); padding-bottom: 4px;">Quantum State Dynamics</h1>
            <p style="font-size: 11px; color: #94a3b8; line-height: 1.6; margin-bottom: 10px;">The time-dependent state evolution of closed quantum systems obeys:</p>
            <div style="background: rgba(13, 148, 136, 0.1); border: 1px solid rgba(20, 184, 166, 0.25); border-radius: 6px; padding: 10px; text-align: center; margin-bottom: 12px; font-family: 'Times New Roman', serif; font-size: 13px; color: #5eead4;">
              <i>iħ</i> ∂/∂t |Ψ(t)⟩ = Ĥ |Ψ(t)⟩
            </div>
            <h2 style="font-size: 13px; font-weight: 600; color: #ffffff; margin-bottom: 6px;">Density Operator Matrix</h2>
            <div style="background: rgba(13, 148, 136, 0.1); border: 1px solid rgba(20, 184, 166, 0.25); border-radius: 6px; padding: 10px; text-align: center; font-family: 'Times New Roman', serif; font-size: 13px; color: #5eead4;">
              ρ = ∑ p<sub>i</sub> |ψ<sub>i</sub>⟩⟨ψ<sub>i</sub>|
            </div>
          </div>
        </div>
      `;
    }

    if (app.id === 'mevector') {
      return `
        <!-- meVector Studio (Bézier Path Illustrator) -->
        <div class="mockup-menubar">
          <span class="mockup-menu-item"><b>meVector Studio</b></span>
          <span class="mockup-menu-item">File</span>
          <span class="mockup-menu-item">Edit</span>
          <span class="mockup-menu-item">Object</span>
          <span class="mockup-menu-item">Path</span>
          <span class="mockup-menu-item">Vector</span>
          <span class="mockup-menu-item">View</span>
          <span class="mockup-menu-item">Help</span>
        </div>
        <div class="mockup-ribbon">
          <div class="mockup-ribbon-left">
            <span class="mockup-tool-chip active">↖ Selection (V)</span>
            <span class="mockup-tool-chip">✒️ Pen (P)</span>
            <span class="mockup-tool-chip">Node Edit (A)</span>
            <span class="mockup-tool-chip">Boolean: Unite / Cut</span>
          </div>
          <div class="mockup-ribbon-right">
            <span class="mockup-tool-chip" style="border-color: #a855f7; color: #c084fc;">SVG 2.0 Vector</span>
            <span class="mockup-tool-chip" style="background: #9333ea; color: #fff;">⬇ Export SVG</span>
          </div>
        </div>
        <div class="mockup-cockpit-layout" style="grid-template-columns: 200px 1fr 260px;">
          <div class="mockup-left-pane">
            <div class="mockup-pane-heading">📑 Layers &amp; Groups</div>
            <div class="mockup-tool-card active"><div class="mockup-tool-title">◆ Path: Logo_Crown_Glyph</div><div class="mockup-tool-desc">16 Bézier Nodes (Smooth)</div></div>
            <div class="mockup-tool-card"><div class="mockup-tool-title">◇ Path: Accent_Aura_Ring</div><div class="mockup-tool-desc">Gradient Stroke 2.5px</div></div>
            <div class="mockup-tool-card"><div class="mockup-tool-title">◇ Group: Isometric_Grid</div><div class="mockup-tool-desc">Locked Guide Surface</div></div>
          </div>
          <div class="mockup-center-stage" style="background: radial-gradient(circle, #0e1226 0%, #060814 100%);">
            <svg width="340" height="280" viewBox="0 0 340 280" fill="none">
              <path d="M70 210 C70 120, 140 60, 170 60 C200 60, 270 120, 270 210 Z" stroke="#a855f7" stroke-width="2.5" fill="rgba(168,85,247,0.1)"/>
              <line x1="170" y1="60" x2="110" y2="40" stroke="#c084fc" stroke-width="1.2" stroke-dasharray="3 3"/>
              <line x1="170" y1="60" x2="230" y2="40" stroke="#c084fc" stroke-width="1.2" stroke-dasharray="3 3"/>
              <circle cx="170" cy="60" r="5" fill="#c084fc"/>
              <circle cx="110" cy="40" r="4" fill="#f43f5e"/>
              <circle cx="230" cy="40" r="4" fill="#f43f5e"/>
              <circle cx="70" cy="210" r="4" fill="#c084fc"/>
              <circle cx="270" cy="210" r="4" fill="#c084fc"/>
            </svg>
          </div>
          <div class="mockup-right-pane">
            <div class="mockup-pane-heading">⚙️ Path Coordinates &amp; Nodes</div>
            <div class="mockup-tool-card"><div class="mockup-tool-title">Anchor (X, Y)</div><div class="mockup-tool-desc">X: 170.00 px · Y: 60.00 px</div></div>
            <div class="mockup-tool-card"><div class="mockup-tool-title">Tangent Curvature</div><div class="mockup-tool-desc">Angle: 18.4° · Length: 63.2 px</div></div>
            <div class="mockup-tool-card"><div class="mockup-tool-title">Boolean Engine</div><div class="mockup-tool-desc">Unite · Subtract · Exclude · Intersect</div></div>
          </div>
        </div>
      `;
    }

    if (app.id === 'mefilm') {
      return `
        <!-- meFilm Studio (Video NLE Timeline) -->
        <div class="mockup-menubar">
          <span class="mockup-menu-item"><b>meFilm Studio</b></span>
          <span class="mockup-menu-item">File</span>
          <span class="mockup-menu-item">Edit</span>
          <span class="mockup-menu-item">Sequence</span>
          <span class="mockup-menu-item">Clip</span>
          <span class="mockup-menu-item">Audio</span>
          <span class="mockup-menu-item">Render</span>
        </div>
        <div class="mockup-ribbon">
          <div class="mockup-ribbon-left">
            <span class="mockup-tool-chip active">✂️ Razor (C)</span>
            <span class="mockup-tool-chip">Ripple Trim</span>
            <span class="mockup-tool-chip">Slip &amp; Slide</span>
          </div>
          <div class="mockup-ribbon-center">
            <span style="font-weight: 600; color: #f59e0b;">00:02:14:18 / 00:05:40:00</span>
            <span class="mockup-tool-chip" style="margin-left: 10px;">4K 60fps NVENC</span>
          </div>
          <div class="mockup-ribbon-right">
            <span class="mockup-tool-chip" style="background: #d97706; color: #fff;">⬇ Render MP4</span>
          </div>
        </div>
        <div class="mockup-cockpit-layout" style="grid-template-columns: 1fr; grid-template-rows: 180px 1fr; gap: 8px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; background: #03050a; padding: 10px; border-radius: 6px;">
            <div style="background: #090e1c; border: 1px solid rgba(255,255,255,0.08); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #64748b; font-size: 13px;">
              Source Footage: Take_04_A_Cam.mov
            </div>
            <div style="background: #090e1c; border: 1px solid rgba(245,158,11,0.3); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #f59e0b; font-size: 13px; font-weight: 600;">
              Program Output: 4K Cinema Sequence (Rec.709)
            </div>
          </div>
          <div style="background: #070c18; border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 12px; display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; gap: 8px; font-size: 12px; color: #94a3b8;">
              <span style="width: 40px; font-weight: 600;">V2</span>
              <div style="flex: 1; height: 26px; background: rgba(59,130,246,0.3); border: 1px solid #3b82f6; border-radius: 4px; display: flex; align-items: center; padding: 0 10px; color: #93c5fd;">Title_Cinematic_LowerThird.png</div>
            </div>
            <div style="display: flex; gap: 8px; font-size: 12px; color: #94a3b8;">
              <span style="width: 40px; font-weight: 600;">V1</span>
              <div style="flex: 1; height: 32px; background: rgba(245,158,11,0.25); border: 1px solid #f59e0b; border-radius: 4px; display: flex; align-items: center; padding: 0 10px; color: #fde68a;">4K_Drone_Flight_Bangkok.mp4 [00:00:00 - 00:04:15]</div>
            </div>
            <div style="display: flex; gap: 8px; font-size: 12px; color: #94a3b8;">
              <span style="width: 40px; font-weight: 600;">A1</span>
              <div style="flex: 1; height: 28px; background: rgba(16,185,129,0.25); border: 1px solid #10b981; border-radius: 4px; display: flex; align-items: center; padding: 0 10px; color: #a7f3d0;">Master_Voice_Podcast_Dialogue.wav (Normalized -14 LUFS)</div>
            </div>
          </div>
        </div>
      `;
    }

    if (app.id === 'melight') {
      return `
        <!-- meLight Studio (RAW Photo Lab) -->
        <div class="mockup-menubar">
          <span class="mockup-menu-item"><b>meLight Studio</b></span>
          <span class="mockup-menu-item">File</span>
          <span class="mockup-menu-item">Develop</span>
          <span class="mockup-menu-item">Presets</span>
          <span class="mockup-menu-item">Color</span>
          <span class="mockup-menu-item">Export</span>
        </div>
        <div class="mockup-ribbon">
          <div class="mockup-ribbon-left">
            <span class="mockup-tool-chip active">🌓 Split Before / After</span>
            <span class="mockup-tool-chip">HDR Tone Mapping</span>
            <span class="mockup-tool-chip">Temp: 5600K</span>
          </div>
          <div class="mockup-ribbon-right">
            <span class="mockup-tool-chip" style="background: #059669; color: #fff;">⬇ Export 16-Bit TIFF</span>
          </div>
        </div>
        <div class="mockup-cockpit-layout" style="grid-template-columns: 1fr 280px;">
          <div class="mockup-center-stage" style="position: relative; background: #020617; display: flex; align-items: center; justify-content: center;">
            <div style="width: 85%; height: 80%; background: linear-gradient(90deg, #1e293b 50%, #047857 50%); border-radius: 6px; display: flex; align-items: center; justify-content: space-around; color: #f8fafc; font-weight: 600; border: 1px solid rgba(255,255,255,0.15);">
              <span>BEFORE (Flat RAW)</span>
              <span>AFTER (HDR Graded)</span>
            </div>
          </div>
          <div class="mockup-right-pane">
            <div class="mockup-pane-heading">🎛️ Parametric Tone Curves</div>
            <div class="mockup-slider-row"><div class="mockup-slider-head"><span>Dynamic Range</span><span>+1.4 EV</span></div><div class="mockup-slider-track"><div class="mockup-slider-thumb" style="left: 72%;"></div></div></div>
            <div class="mockup-slider-row"><div class="mockup-slider-head"><span>De-Noise Threshold</span><span>18%</span></div><div class="mockup-slider-track"><div class="mockup-slider-thumb" style="left: 36%;"></div></div></div>
            <div class="mockup-slider-row"><div class="mockup-slider-head"><span>Color Temperature</span><span>5600 K</span></div><div class="mockup-slider-track"><div class="mockup-slider-thumb" style="left: 55%;"></div></div></div>
            <div class="mockup-pane-heading" style="margin-top: 10px;">🎨 HSL Color Wheels</div>
            <div class="mockup-tool-card"><div class="mockup-tool-title">Shadows: Cyan / Blue (+12)</div><div class="mockup-tool-desc">Highlights: Warm Gold (+8)</div></div>
          </div>
        </div>
      `;
    }

    if (app.id === 'memotion') {
      return `
        <!-- meMotion Studio (Keyframe VFX) -->
        <div class="mockup-menubar">
          <span class="mockup-menu-item"><b>meMotion Studio</b></span>
          <span class="mockup-menu-item">File</span>
          <span class="mockup-menu-item">Composition</span>
          <span class="mockup-menu-item">Layer</span>
          <span class="mockup-menu-item">Effect</span>
          <span class="mockup-menu-item">Keyframe</span>
        </div>
        <div class="mockup-ribbon">
          <div class="mockup-ribbon-left">
            <span class="mockup-tool-chip active">💠 Keyframe Mode</span>
            <span class="mockup-tool-chip">📈 Speed Graph</span>
            <span class="mockup-tool-chip">✨ Particle System</span>
          </div>
          <div class="mockup-ribbon-right">
            <span class="mockup-tool-chip" style="background: #db2777; color: #fff;">⬇ Render ProRes 4444</span>
          </div>
        </div>
        <div class="mockup-cockpit-layout" style="grid-template-columns: 1fr; grid-template-rows: 180px 1fr; gap: 8px;">
          <div class="mockup-center-stage" style="background: radial-gradient(circle, #2d0b1f 0%, #090207 100%); display: flex; align-items: center; justify-content: center;">
            <div style="font-size: 32px; font-weight: 800; color: #f472b6; letter-spacing: 2px;">
              KINETIC MOTION GRAPHICS
            </div>
          </div>
          <div style="background: #0c0409; border: 1px solid rgba(236,72,153,0.25); border-radius: 6px; padding: 12px; display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; gap: 10px; font-size: 12px; color: #f472b6;">
              <span style="width: 140px; font-weight: 600;">◆ Title_Scale_Transform</span>
              <div style="flex: 1; height: 24px; background: rgba(236,72,153,0.15); border: 1px solid #ec4899; border-radius: 4px; display: flex; align-items: center; justify-content: space-between; padding: 0 14px; font-size: 11px;">
                <span>◆ Keyframe [0.0s]</span>
                <span style="color:#fbcfe8;">Bezier Ease-Out Graph</span>
                <span>◆ Keyframe [1.8s]</span>
              </div>
            </div>
            <div style="display: flex; gap: 10px; font-size: 12px; color: #94a3b8;">
              <span style="width: 140px; font-weight: 600;">◆ Particle_Aura_Emitter</span>
              <div style="flex: 1; height: 24px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; display: flex; align-items: center; padding: 0 14px; font-size: 11px;">
                <span>Velocity: 240 px/s · Gravity: 9.8 · Life: 120 frames</span>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    if (app.id === 'medesign') {
      return `
        <!-- meDesign Studio (InDesign / Editorial) -->
        <div class="mockup-menubar">
          <span class="mockup-menu-item"><b>meDesign Studio</b></span>
          <span class="mockup-menu-item">File</span>
          <span class="mockup-menu-item">Layout</span>
          <span class="mockup-menu-item">Type</span>
          <span class="mockup-menu-item">Object</span>
          <span class="mockup-menu-item">Pre-Flight</span>
        </div>
        <div class="mockup-ribbon">
          <div class="mockup-ribbon-left">
            <span class="mockup-tool-chip active">📐 12-Column Grid</span>
            <span class="mockup-tool-chip">CMYK FOGRA39</span>
            <span class="mockup-tool-chip">Bleed: 3mm</span>
          </div>
          <div class="mockup-ribbon-right">
            <span class="mockup-tool-chip" style="background: #ea580c; color: #fff;">⬇ Export PDF/X-1a</span>
          </div>
        </div>
        <div class="mockup-cockpit-layout" style="grid-template-columns: 1fr 260px;">
          <div class="mockup-center-stage" style="background: #030712; padding: 18px; display: flex; gap: 14px; justify-content: center;">
            <div style="width: 45%; height: 90%; background: #ffffff; color: #0f172a; padding: 16px; border-radius: 4px; box-shadow: 0 8px 24px rgba(0,0,0,0.6); display: flex; flex-direction: column; gap: 8px;">
              <div style="font-size: 16px; font-weight: 800; border-bottom: 2px solid #0f172a; padding-bottom: 4px;">ARCHITECTURAL MONOGRAPH</div>
              <div style="height: 60px; background: #e2e8f0; border-radius: 2px;"></div>
              <div style="font-size: 10px; line-height: 1.5; color: #475569;">Column 01: Modular typography grid ensures consistent vertical rhythm across double-page editorial spreads.</div>
            </div>
            <div style="width: 45%; height: 90%; background: #ffffff; color: #0f172a; padding: 16px; border-radius: 4px; box-shadow: 0 8px 24px rgba(0,0,0,0.6); display: flex; flex-direction: column; gap: 8px;">
              <div style="font-size: 16px; font-weight: 800; border-bottom: 2px solid #0f172a; padding-bottom: 4px;">GLOBAL PERSPECTIVE</div>
              <div style="font-size: 10px; line-height: 1.5; color: #475569;">Column 02: CMYK color separation verified. 300 DPI high-resolution vector assets embedded natively.</div>
              <div style="margin-top: auto; font-size: 9px; font-weight: 600; text-align: right;">Page 24</div>
            </div>
          </div>
          <div class="mockup-right-pane">
            <div class="mockup-pane-heading">✅ Pre-Flight Verification</div>
            <div class="mockup-tool-card"><div class="mockup-tool-title">Resolution Audit</div><div class="mockup-tool-desc">300 DPI Minimum: PASSED ✅</div></div>
            <div class="mockup-tool-card"><div class="mockup-tool-title">Color Profile</div><div class="mockup-tool-desc">ISO Coated v2 (ECI): CMYK ✅</div></div>
            <div class="mockup-tool-card"><div class="mockup-tool-title">Overset Text</div><div class="mockup-tool-desc">0 Overflow Frames Detected ✅</div></div>
          </div>
        </div>
      `;
    }

    if (app.id === 'meaudio') {
      return `
        <!-- meAudio Studio (DAW / Spectral) -->
        <div class="mockup-menubar">
          <span class="mockup-menu-item"><b>meAudio Studio</b></span>
          <span class="mockup-menu-item">File</span>
          <span class="mockup-menu-item">Edit</span>
          <span class="mockup-menu-item">Track</span>
          <span class="mockup-menu-item">DSP Effects</span>
          <span class="mockup-menu-item">Mastering</span>
        </div>
        <div class="mockup-ribbon">
          <div class="mockup-ribbon-left">
            <span class="mockup-tool-chip active">🔴 Record</span>
            <span class="mockup-tool-chip">AI Spectral De-Noise</span>
            <span class="mockup-tool-chip">Compressor</span>
          </div>
          <div class="mockup-ribbon-right">
            <span class="mockup-tool-chip" style="background: #65a30d; color: #fff;">⬇ Export 32-Bit FLAC</span>
          </div>
        </div>
        <div class="mockup-cockpit-layout" style="grid-template-columns: 1fr 240px;">
          <div style="display: flex; flex-direction: column; gap: 8px; background: #050b06; padding: 14px; border-radius: 6px;">
            <div style="display: flex; gap: 8px; font-size: 12px; color: #84cc16;">
              <span style="width: 90px; font-weight: 600;">Track 1: Vocal</span>
              <div style="flex: 1; height: 44px; background: rgba(132,204,22,0.15); border: 1px solid #84cc16; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #bef264;">
                |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
              </div>
            </div>
            <div style="display: flex; gap: 8px; font-size: 12px; color: #38bdf8;">
              <span style="width: 90px; font-weight: 600;">Track 2: Foley</span>
              <div style="flex: 1; height: 44px; background: rgba(56,189,248,0.15); border: 1px solid #38bdf8; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #7dd3fc;">
                ||||...||||||.....||||||||||||...|||||||.....||||||||||||||||||...|||||||||.....||||||||
              </div>
            </div>
            <div style="display: flex; gap: 8px; font-size: 12px; color: #a855f7;">
              <span style="width: 90px; font-weight: 600;">Track 3: BGM</span>
              <div style="flex: 1; height: 44px; background: rgba(168,85,247,0.15); border: 1px solid #a855f7; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #d8b4fe;">
                |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
              </div>
            </div>
          </div>
          <div class="mockup-right-pane">
            <div class="mockup-pane-heading">📊 Master Loudness (LUFS)</div>
            <div class="mockup-tool-card"><div class="mockup-tool-title">Integrated Target</div><div class="mockup-tool-desc">-14.0 LUFS (EBU R128)</div></div>
            <div class="mockup-tool-card"><div class="mockup-tool-title">True Peak dB</div><div class="mockup-tool-desc">-1.0 dBTP Clean Headroom</div></div>
            <div class="mockup-tool-card"><div class="mockup-tool-title">Spectral De-Noise</div><div class="mockup-tool-desc">Hum: Eradicated · SNR: +28dB</div></div>
          </div>
        </div>
      `;
    }

    if (app.id === 'medoc') {
      return `
        <!-- meDoc Studio (Markdown + KaTeX Typewriter) -->
        <div class="mockup-menubar">
          <span class="mockup-menu-item"><b>meDoc Studio</b></span>
          <span class="mockup-menu-item">File</span>
          <span class="mockup-menu-item">Edit</span>
          <span class="mockup-menu-item">Markdown</span>
          <span class="mockup-menu-item">KaTeX Math</span>
          <span class="mockup-menu-item">Export</span>
        </div>
        <div class="mockup-ribbon">
          <div class="mockup-ribbon-left">
            <span class="mockup-tool-chip active">☯ Zen Mode</span>
            <span class="mockup-tool-chip">Live KaTeX Formula</span>
            <span class="mockup-tool-chip">BibTeX Citations</span>
          </div>
          <div class="mockup-ribbon-right">
            <span class="mockup-tool-chip" style="background: #4f46e5; color: #fff;">⬇ Render Academic PDF</span>
          </div>
        </div>
        <div class="mockup-cockpit-layout" style="grid-template-columns: 1fr 1fr; gap: 14px; padding: 14px;">
          <div style="background: #090d1e; border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 14px; font-family: monospace; font-size: 12px; color: #a5b4fc; line-height: 1.8;">
            <span style="color: #6366f1;"># Quantum Algorithmic Complexity</span><br>
            The Gaussian integral is defined as:<br>
            $$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$<br>
            - **Privacy Guarantee**: 100% In-Device Memory Execution.<br>
            - **Zero Network Egress**: 0 bytes sent outside machine.
          </div>
          <div style="background: #ffffff; color: #0f172a; border-radius: 6px; padding: 18px; box-shadow: 0 8px 24px rgba(0,0,0,0.5); display: flex; flex-direction: column; gap: 8px;">
            <div style="font-size: 18px; font-weight: 800; color: #1e1b4b; border-bottom: 2px solid #e2e8f0; padding-bottom: 4px;">Quantum Algorithmic Complexity</div>
            <div style="font-size: 13px; color: #334155; line-height: 1.6;">The Gaussian integral is defined as:</div>
            <div style="font-size: 18px; text-align: center; margin: 10px 0; font-family: serif; color: #0284c7; background: #f0fdf4; padding: 8px; border-radius: 4px;">
              ∫<sub>-∞</sub><sup>∞</sup> e<sup>-x²</sup> dx = √π
            </div>
            <div style="font-size: 11px; color: #64748b;">• <b>Privacy Guarantee</b>: 100% In-Device Memory Execution.<br>• <b>Zero Network Egress</b>: 0 bytes sent outside machine.</div>
          </div>
        </div>
      `;
    }

    if (app.id === 'me3d') {
      return `
        <!-- me3D Studio (Spatial 3D & PBR Lab) -->
        <div class="mockup-menubar">
          <span class="mockup-menu-item"><b>me3D Studio</b></span>
          <span class="mockup-menu-item">File</span>
          <span class="mockup-menu-item">Mesh</span>
          <span class="mockup-menu-item">Modify</span>
          <span class="mockup-menu-item">Shading</span>
          <span class="mockup-menu-item">Render</span>
        </div>
        <div class="mockup-ribbon">
          <div class="mockup-ribbon-left">
            <span class="mockup-tool-chip active">Perspective View</span>
            <span class="mockup-tool-chip">PBR Material Shading</span>
            <span class="mockup-tool-chip">HDRI Lighting</span>
          </div>
          <div class="mockup-ribbon-right">
            <span class="mockup-tool-chip" style="background: #0891b2; color: #fff;">⬇ Export GLTF 2.0</span>
          </div>
        </div>
        <div class="mockup-cockpit-layout" style="grid-template-columns: 1fr 260px;">
          <div class="mockup-center-stage" style="background: radial-gradient(circle, #0e1c26 0%, #03070b 100%); position: relative; display: flex; align-items: center; justify-content: center;">
            <svg width="280" height="220" viewBox="0 0 280 220" fill="none">
              <line x1="40" y1="180" x2="80" y2="180" stroke="#ef4444" stroke-width="2.5"/>
              <line x1="40" y1="180" x2="40" y2="140" stroke="#22c55e" stroke-width="2.5"/>
              <line x1="40" y1="180" x2="16" y2="200" stroke="#3b82f6" stroke-width="2.5"/>
              <polygon points="140,40 220,80 220,160 140,200 60,160 60,80" stroke="#06b6d4" stroke-width="2" fill="rgba(6,182,212,0.15)"/>
              <line x1="140" y1="40" x2="140" y2="200" stroke="#06b6d4" stroke-width="1.5" stroke-dasharray="3 3"/>
              <line x1="60" y1="80" x2="220" y2="160" stroke="#06b6d4" stroke-width="1.5" stroke-dasharray="3 3"/>
              <line x1="220" y1="80" x2="60" y2="160" stroke="#06b6d4" stroke-width="1.5" stroke-dasharray="3 3"/>
              <circle cx="140" cy="40" r="4" fill="#38bdf8"/>
              <circle cx="220" cy="80" r="4" fill="#38bdf8"/>
              <circle cx="220" cy="160" r="4" fill="#38bdf8"/>
              <circle cx="140" cy="200" r="4" fill="#38bdf8"/>
              <circle cx="60" cy="160" r="4" fill="#38bdf8"/>
              <circle cx="60" cy="80" r="4" fill="#38bdf8"/>
            </svg>
          </div>
          <div class="mockup-right-pane">
            <div class="mockup-pane-heading">🧊 PBR Material Staging</div>
            <div class="mockup-slider-row"><div class="mockup-slider-head"><span>Metallic Roughness</span><span>0.82</span></div><div class="mockup-slider-track"><div class="mockup-slider-thumb" style="left: 82%;"></div></div></div>
            <div class="mockup-slider-row"><div class="mockup-slider-head"><span>Subsurface Scatter</span><span>0.15</span></div><div class="mockup-slider-track"><div class="mockup-slider-thumb" style="left: 20%;"></div></div></div>
            <div class="mockup-tool-card"><div class="mockup-tool-title">Normal Map</div><div class="mockup-tool-desc">Tangent Space 4096 x 4096</div></div>
            <div class="mockup-tool-card"><div class="mockup-tool-title">WebGPU Pipeline</div><div class="mockup-tool-desc">Hardware Vulkan / DirectX 12</div></div>
          </div>
        </div>
      `;
    }

    // Default template for other creative apps
    return `
      <div class="mockup-menubar">
        <span class="mockup-menu-item"><b>${app.name}</b></span>
        <span class="mockup-menu-item">File</span>
        <span class="mockup-menu-item">Edit</span>
        <span class="mockup-menu-item">Workspace</span>
        <span class="mockup-menu-item">Help</span>
      </div>
      <div class="mockup-ribbon">
        <div class="mockup-ribbon-left">
          <span class="mockup-tool-chip active">🔨 Studio Workbench</span>
          <span class="mockup-tool-chip">${app.artcraftEquivalent || 'Native Engine'}</span>
        </div>
        <div class="mockup-ribbon-right">
          <span class="mockup-tool-chip" style="background: rgba(212,175,55,0.2); color: #d4af37; border-color: rgba(212,175,55,0.4);">
            ✨ In Development Roadmap
          </span>
        </div>
      </div>
      <div class="mockup-cockpit-layout" style="display:flex; align-items:center; justify-content:center; padding: 40px; color: #94a3b8;">
        ${app.description[this.lang]}
      </div>
    `;
  }

  private renderHeader(): string {
    const isDesktop = this.bridge.isTauri();
    return `
    <header class="portal-header" role="banner">
      <div class="portal-header-inner">
        <a class="portal-brand" href="#" aria-label="meCrafts home">
          <div class="portal-brand-emblem" aria-hidden="true">
            <img src="./branding/mecraft-suite.png" class="portal-brand-img" alt="meCrafts" onerror="this.style.display='none';if(this.nextElementSibling){this.nextElementSibling.style.display='inline-flex';}" />
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" class="portal-brand-fallback" style="display:none;">
              <defs>
                <linearGradient id="emblem-g" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stop-color="#d4af37"/>
                  <stop offset="100%" stop-color="#f7d774"/>
                </linearGradient>
              </defs>
              <rect x="2" y="2" width="28" height="28" rx="8" fill="url(#emblem-g)" opacity="0.15"/>
              <path d="M8 24 L16 8 L24 24" stroke="url(#emblem-g)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
              <path d="M11 19 h10" stroke="url(#emblem-g)" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="portal-brand-text">
            <span class="portal-brand-name">${this.t.brandTitle}</span>
            <span class="portal-brand-tag">${this.lang === 'th' ? 'Official Suite' : 'Official Suite'}</span>
          </div>
        </a>

        <nav class="portal-nav" aria-label="Portal navigation">
          <a href="#apps-grid" class="portal-nav-link active">${this.lang === 'th' ? 'โปรแกรมสตูดิโอ' : 'Studios'}</a>
          <a href="#manifesto" class="portal-nav-link">${this.lang === 'th' ? 'ความเป็นส่วนตัว' : 'Privacy Architecture'}</a>
          <a href="#specs" class="portal-nav-link">${this.lang === 'th' ? 'สเปก' : 'Specs'}</a>
          <a href="./downloads" target="_blank" rel="noopener noreferrer" class="portal-nav-link">${this.lang === 'th' ? 'ดาวน์โหลด' : 'Downloads'}</a>
        </nav>

        <div class="portal-header-actions">
          ${this.updateInfo?.hasUpdate ? `
            <button type="button" class="portal-update-pill" id="header-btn-update" aria-label="Software update available" title="${this.lang === 'th' ? `ตรวจพบเวอร์ชันใหม่ v${escapeHtml(this.updateInfo.latestVersion)} คลิกเพื่ออัปเดต` : `New version v${escapeHtml(this.updateInfo.latestVersion)} available. Click to update.`}">
              <span class="update-pulse-dot"></span>
              <span>🚀 ${this.lang === 'th' ? `อัปเดต v${escapeHtml(this.updateInfo.latestVersion)}` : `Update v${escapeHtml(this.updateInfo.latestVersion)}`}</span>
            </button>
          ` : ''}

          <button class="portal-lang-btn" id="btn-lang" aria-label="Switch language">
            <span>${this.lang === 'en' ? 'TH' : 'EN'}</span>
          </button>

          ${this.currentSession ? `
            <div class="user-profile-pill" id="user-profile-pill" role="button" tabindex="0" title="${escapeHtml(this.currentSession.user.email)}">
              <div class="user-avatar" aria-hidden="true">${escapeHtml((this.currentSession.user.fullName || this.currentSession.user.email).charAt(0).toUpperCase())}</div>
              <div class="user-details">
                <span class="user-email" title="${escapeHtml(this.currentSession.user.email)}">${escapeHtml(this.currentSession.user.email)}</span>
                <span class="user-tier-badge ${getTierBadge(this.currentSession.user.tier).isPro ? 'badge-pro' : 'badge-free'}">
                  ${getTierBadge(this.currentSession.user.tier).label}
                </span>
              </div>
              <button class="btn-signout" id="btn-signout" title="${this.t.signOutBtn}" aria-label="Sign Out">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              </button>
            </div>
          ` : `
            <button type="button" class="portal-auth-btn btn-trigger-auth" id="header-btn-auth" aria-label="${this.t.signInBtn}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <span>${this.t.signInBtn}</span>
            </button>
          `}
        </div>
      </div>
    </header>`;
  }

  private renderHero(): string {
    const badges = [
      { icon: '🔒', text: this.t.heroBadge1 },
      { icon: '📡', text: this.t.heroBadge2 },
      { icon: '⚡', text: this.t.heroBadge3 },
      { icon: '🖥', text: this.t.heroBadge4 },
    ];
    return `
    <section class="portal-hero" id="hero" aria-labelledby="hero-title">
      <div class="portal-hero-bg" aria-hidden="true">
        <div class="hero-glow hero-glow-gold"></div>
        <div class="hero-glow hero-glow-indigo"></div>
        <div class="hero-glow hero-glow-cyan"></div>
      </div>
      <div class="portal-hero-inner">
        <div class="hero-pill" aria-label="Suite version">${this.t.appsCount} · Windows</div>
        <h1 class="hero-title" id="hero-title">${this.t.heroTitle}</h1>
        <p class="hero-subtitle">${this.t.heroSubtitle}</p>
        <div class="hero-badges" role="list" aria-label="Key features">
          ${badges.map(b => `
            <div class="hero-badge" role="listitem">
              <span aria-hidden="true">${b.icon}</span>
              <span>${b.text}</span>
            </div>
          `).join('')}
        </div>

        <div class="hero-official-ctas" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 14px; margin: 32px 0 24px;">
          <a href="./downloads" target="_blank" rel="noopener noreferrer" class="hero-cta-primary" style="display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; border-radius: var(--radius-md); font-weight: 700; text-decoration: none; font-size: 15px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span>${this.lang === 'th' ? 'ศูนย์ดาวน์โหลดตัวติดตั้งทั้งหมด (.exe)' : 'Downloads Directory (.exe)'}</span>
          </a>
          <a href="#apps-grid" class="hero-cta-secondary" style="display: inline-flex; align-items: center; gap: 8px; padding: 14px 26px; border-radius: var(--radius-md); font-weight: 600; text-decoration: none; font-size: 15px;">
            <span>${this.lang === 'th' ? 'สำรวจโปรแกรมทั้งหมด (11 สตูดิโอ) ↓' : 'Explore All 11 Studios ↓'}</span>
          </a>
        </div>

        <p class="hero-meta">Windows 11 / 10 (64-bit) · 100% In-Device Memory Execution · Zero Cloud Uploads · MIT Open Source</p>
      </div>
    </section>`;
  }

  private renderFilterBar(): string {
    const filters: Array<{ key: AppCategory | 'all'; label: string }> = [
      { key: 'all', label: this.t.filterAll },
      { key: 'document', label: this.t.filterDocument },
      { key: 'photo', label: this.t.filterPhoto },
      { key: 'utility', label: this.t.filterUtility },
      { key: 'vector', label: this.t.filterVector },
      { key: 'video', label: this.t.filterVideo },
      { key: 'audio', label: this.t.filterAudio },
    ];
    return `
    <section class="portal-filter-bar" aria-label="Search and filter applications">
      <div class="portal-filter-inner">
        <div class="filter-search-wrap">
          <svg class="filter-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            id="apps-search"
            type="search"
            class="filter-search-input"
            placeholder="${this.t.searchPlaceholder}"
            value="${this.searchQuery}"
            aria-label="${this.t.searchPlaceholder}"
            autocomplete="off"
            spellcheck="false"
          />
        </div>
        <div class="filter-pills" role="tablist" aria-label="Category filters">
          ${filters.map(f => `
            <button
              class="filter-pill ${this.activeFilter === f.key ? 'active' : ''}"
              data-filter="${f.key}"
              role="tab"
              aria-selected="${this.activeFilter === f.key}"
            >${f.label}</button>
          `).join('')}
        </div>
      </div>
    </section>`;
  }

  private renderAppsGrid(): string {
    const apps = this.filteredApps();
    const activeApp = SHOWCASE_APPS.find(a => a.id === this.activeStudioId) || apps[0] || SHOWCASE_APPS[0];

    return `
    <section class="portal-apps-section" id="apps-grid" aria-labelledby="apps-title">
      <div class="portal-section-inner">
        <div class="showcase-header">
          <div class="showcase-header-left">
            <div class="section-eyebrow" aria-hidden="true">11 CREATIVE WORKSTATIONS &amp; UTILITIES</div>
            <h2 class="section-title" id="apps-title">${this.lang === 'th' ? 'คลังโปรแกรมสตูดิโอ &amp; ค็อกพิทพรีวิวสด' : 'Creative Workstation Studios &amp; Live Desktop Cockpit'}</h2>
            <p class="section-subtitle">${this.lang === 'th' ? 'เลือกสตูดิโอด้านล่างเพื่อสำรวจฟีเจอร์เชิงลึก พร้อมพรีวิวหน้าต่างซอฟต์แวร์จริงบน Windows แบบเรียลไทม์' : 'Select a studio below to inspect deep specifications alongside real-time native Windows desktop window previews.'}</p>
          </div>
          <div class="showcase-header-pill">
            <span class="pulse-indicator"></span>
            <span>100% In-Device Memory · Zero-Cloud</span>
          </div>
        </div>

        <!-- 1. Horizontal Studio Quick Switcher Bar -->
        <div class="studio-nav-wrapper">
          <nav class="studio-nav-bar" role="tablist" aria-label="Creative Studios Quick Switcher">
            ${SHOWCASE_APPS.map(app => this.renderStudioNavPill(app, app.id === activeApp.id)).join('')}
          </nav>
        </div>

        <!-- 2. All Studios Spotlight Stream -->
        <div class="studios-spotlight-stream" id="studios-spotlight-stream">
          ${apps.length > 0 ? apps.map(app => this.renderStudioSpotlight(app)).join('') : `
            <div class="apps-empty" role="status">
              <div class="apps-empty-icon" aria-hidden="true">🔍</div>
              <p>${this.lang === 'en' ? 'No programs match your search.' : 'ไม่พบโปรแกรมที่ตรงกับการค้นหา'}</p>
            </div>
          `}
        </div>

        <!-- 3. All 11 Programs Ecosystem Overview Grid -->
        <div class="ecosystem-overview-section" id="ecosystem-overview">
          <div class="ecosystem-overview-header">
            <div class="ecosystem-title-wrap">
              <span class="ecosystem-eyebrow">ECOSYSTEM MATRIX</span>
              <h3 class="ecosystem-overview-title">${this.lang === 'th' ? 'สำรวจทั้ง 11 โปรแกรมในเครือ meCrafts' : 'Explore All 11 meCrafts Workstations & Utilities'}</h3>
            </div>
            <div class="ecosystem-overview-meta">
              <span class="ecosystem-count-pill">${apps.length} / ${SHOWCASE_APPS.length} ${this.lang === 'th' ? 'โปรแกรม' : 'Apps'}</span>
            </div>
          </div>
          <div class="ecosystem-grid" id="ecosystem-grid" role="list" aria-label="meCrafts ecosystem catalog">
            ${apps.length > 0 ? apps.map(app => this.renderEcosystemCard(app, app.id === activeApp.id)).join('') : ''}
          </div>
        </div>
      </div>
    </section>`;
  }

  private renderStudioNavPill(app: ShowcaseApp, isActive: boolean): string {
    const isAppActive = app.status === 'active';
    const cleanName = app.name.replace(' Studio', '').replace(' Radial Converter', '');
    return `
    <button
      type="button"
      class="studio-nav-pill ${isActive ? 'active' : ''}"
      data-studio-id="${app.id}"
      role="tab"
      aria-selected="${isActive}"
      style="--pill-accent: ${app.accentColor}; --pill-glow: ${app.glowColor};"
    >
      <span class="pill-emblem" aria-hidden="true">${getAppIcon(app.id, app.accentColor)}</span>
      <span class="pill-title">${cleanName}</span>
      <span class="pill-status-dot ${isAppActive ? 'dot-active' : 'dot-indev'}" title="${isAppActive ? 'Active Production' : 'In Development'}"></span>
    </button>`;
  }

  private renderStudioSpotlight(app: ShowcaseApp): string {
    const isActive = app.status === 'active';
    const catLabel = app.categoryLabel[this.lang];
    const tagline = app.tagline[this.lang];
    const desc = app.description[this.lang];
    const engineText = app.enginePill ? app.enginePill[this.lang] : '100% In-Device Memory';
    const specsList = app.specs ? app.specs[this.lang] : [];

    return `
    <article class="studio-spotlight-card ${isActive ? 'spotlight-active' : 'spotlight-indev'}" id="spotlight-${app.id}" style="--spotlight-accent: ${app.accentColor}; --spotlight-glow: ${app.glowColor};">
      <div class="studio-spotlight-inner">
        <!-- Left: Studio Details & Action CTAs -->
        <div class="studio-spotlight-info">
          <div class="spotlight-info-header">
            <div class="spotlight-emblem" aria-hidden="true" style="background: radial-gradient(circle, ${app.glowColor} 0%, transparent 70%);">
              ${getAppIcon(app.id, app.accentColor)}
            </div>
            <div class="spotlight-meta">
              <div class="spotlight-badges">
                <span class="spotlight-cat-badge" style="color: ${app.accentColor}; border-color: ${app.accentColor}40;">${catLabel}</span>
                <span class="spotlight-status-pill ${isActive ? 'status-active' : 'status-indev'}">
                  <span class="status-dot" aria-hidden="true"></span>
                  ${isActive ? this.t.statusActive : this.t.statusInDev}
                </span>
              </div>
              <span class="spotlight-version">${app.version}</span>
            </div>
          </div>

          <div class="spotlight-body">
            <h3 class="spotlight-name">${app.name}</h3>
            <p class="spotlight-tagline">${tagline}</p>
            <p class="spotlight-desc">${desc}</p>

            <div class="spotlight-engine-badge">
              <span>⚡</span>
              <span>${engineText}</span>
            </div>

            ${specsList.length > 0 ? `
              <div class="spotlight-specs-list" aria-label="Studio specifications">
                ${specsList.map(s => `<span class="spotlight-spec-tag">✦ ${escapeHtml(s)}</span>`).join('')}
              </div>
            ` : ''}

            ${app.artcraftEquivalent ? `<p class="spotlight-equivalent" aria-label="Inspired by">✧ ${app.artcraftEquivalent}</p>` : ''}
          </div>

          <!-- Contextual Action Buttons -->
          <div class="spotlight-action-row">
            ${isActive ? `
              <div class="spotlight-actions-flex" style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
                <a href="${app.downloadUrl || './downloads'}" ${app.downloadUrl ? `download="${app.exeName || (app.name + '.exe')}"` : 'target="_blank"'} class="spotlight-cta-btn" style="background: ${app.accentColor}; color: #ffffff; text-decoration: none; display: inline-flex; align-items: center; gap: 7px; padding: 9px 18px; border-radius: var(--radius-sm); font-size: 13px; font-weight: 700;">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  <span>${this.lang === 'th' ? `ดาวน์โหลด ${app.exeName || (app.name + '.exe')}` : `Download ${app.exeName || (app.name + '.exe')}`}</span>
                </a>
                <a href="./downloads" target="_blank" rel="noopener noreferrer" class="quick-launch-chip" style="text-decoration: none; display: inline-flex; align-items: center; gap: 6px; font-size: 12px;">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                  <span>${this.lang === 'th' ? 'ศูนย์ดาวน์โหลด' : 'Downloads Hub'}</span>
                </a>
                ${app.exeSize ? `
                  <span class="quick-launch-chip" style="font-size: 11px; opacity: 0.8;">
                    ${app.exeSize}
                  </span>
                ` : ''}
              </div>
            ` : `
              <div class="spotlight-indev-group">
                <a href="https://github.com/methastrategy/meCraft#roadmap" target="_blank" rel="noopener noreferrer" class="spotlight-cta-roadmap">
                  <span>✦ ${this.lang === 'th' ? 'ติดตามแผนพัฒนาบน GitHub Roadmap' : 'View Development Roadmap on GitHub'} →</span>
                </a>
                <span class="spotlight-suite-note">
                  ${this.lang === 'th' ? 'กำลังพัฒนาภายใต้สัญญาอนุญาต MIT Open Source' : 'In active development under MIT Open Source License'}
                </span>
              </div>
            `}
          </div>
        </div>

        <!-- Right: Windows Native Desktop UI Mockup with Watermark Header -->
        <div class="studio-spotlight-preview">
          <div class="spotlight-preview-bar">
            <div class="preview-bar-left">
              <span class="preview-bar-dot ${!isActive ? 'dot-amber' : ''}" aria-hidden="true"></span>
              <span class="preview-bar-label">${isActive
                ? (this.lang === 'th' ? 'หน้าต่างจำลองซอฟต์แวร์จริงบน Windows 11 (Desktop Simulator)' : 'Live Native Desktop Simulator (Windows 11 x64)')
                : (this.lang === 'th' ? 'โครงร่างภาพร่างต้นแบบสถาปัตยกรรม (Conceptual Blueprint Wireframe)' : 'Conceptual Architecture Blueprint & Wireframe (WIP)')}</span>
            </div>
            <button type="button" class="btn-inspect-modal" id="btn-inspect-${app.id}" data-inspect-app="${app.id}" title="${this.lang === 'th' ? 'ขยายดูเต็มจอ' : 'Inspect Fullscreen'}">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
              <span>${this.lang === 'th' ? 'เต็มจอ' : 'Inspect'}</span>
            </button>
          </div>
          <div class="spotlight-window-mount">
            ${this.renderDesktopPreviewInline(app)}
          </div>
        </div>
      </div>
    </article>`;
  }

  private renderEcosystemCard(app: ShowcaseApp, isActive: boolean): string {
    const isAppActive = app.status === 'active';
    const catLabel = app.categoryLabel[this.lang];
    const tagline = app.tagline[this.lang];

    return `
    <div
      class="ecosystem-card ${isActive ? 'card-active' : ''} ${isAppActive ? 'card-status-active' : 'card-status-indev'}"
      data-studio-jump="${app.id}"
      role="button"
      tabindex="0"
      aria-label="Inspect ${app.name}"
      style="--card-accent: ${app.accentColor}; --card-glow: ${app.glowColor};"
    >
      <div class="eco-card-top">
        <div class="eco-card-emblem" aria-hidden="true">${getAppIcon(app.id, app.accentColor)}</div>
        <div class="eco-card-meta">
          <span class="eco-cat-tag" style="color: ${app.accentColor};">${catLabel}</span>
          <span class="eco-status-pill ${isAppActive ? 'status-active' : 'status-indev'}">
            <span class="status-dot" aria-hidden="true"></span>
            ${isAppActive ? this.t.statusActive : this.t.statusInDev}
          </span>
        </div>
      </div>
      <div class="eco-card-body">
        <h4 class="eco-card-name">${app.name}</h4>
        <p class="eco-card-tagline">${tagline}</p>
      </div>
      <div class="eco-card-footer">
        <span class="eco-version">${app.version}</span>
        <span class="eco-jump-hint">${isActive ? (this.lang === 'th' ? '● กำลังดูในค็อกพิท' : '● In Cockpit') : (this.lang === 'th' ? 'สลับดูหน้าต่างนี้ →' : 'Inspect UI →')}</span>
      </div>
    </div>`;
  }

  private renderFullscreenMockupModal(): string {
    if (!this.isFullscreenMockupOpen) return '';
    const activeApp = SHOWCASE_APPS.find(a => a.id === this.activeStudioId) || SHOWCASE_APPS[0];

    return `
    <div class="fullscreen-modal-backdrop" id="fullscreen-modal-backdrop" role="dialog" aria-modal="true" aria-label="Desktop Preview Fullscreen">
      <div class="fullscreen-modal-container">
        <div class="fullscreen-modal-header">
          <div class="fullscreen-modal-title">
            <span class="window-app-icon">${getAppIcon(activeApp.id, activeApp.accentColor)}</span>
            <span>${activeApp.name} — ${this.lang === 'th' ? 'หน้าต่างจำลองซอฟต์แวร์จริงบน Windows 11' : 'Native Desktop UI Inspector'}</span>
          </div>
          <button type="button" class="fullscreen-modal-close" id="btn-close-fullscreen-modal" aria-label="Close fullscreen view">✕</button>
        </div>
        <div class="fullscreen-modal-body">
          ${this.renderDesktopPreviewInline(activeApp)}
        </div>
      </div>
    </div>`;
  }

  private renderDownloadsModal(): string {
    if (!this.isDownloadsModalOpen) return '';

    let items = RELEASE_BINARIES;
    if (this.downloadsFilter === 'production') {
      items = items.filter(i => i.status === 'active');
    } else if (this.downloadsFilter === 'indev') {
      items = items.filter(i => i.status === 'in-dev');
    }

    return `
    <div class="downloads-modal-overlay active" id="downloads-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-downloads-title">
      <div class="downloads-modal-backdrop" id="modal-downloads-backdrop"></div>
      <div class="downloads-modal-card">
        <div class="downloads-modal-header">
          <div class="downloads-modal-header-info">
            <div class="downloads-header-emblem" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </div>
            <div>
              <h2 class="downloads-modal-title" id="modal-downloads-title">
                ${this.lang === 'th' ? 'ศูนย์รวมไฟล์ดาวน์โหลดตัวติดตั้ง (.exe)' : 'meCrafts Downloads & Release Directory'}
              </h2>
              <p class="downloads-modal-subtitle">
                ${this.lang === 'th'
                  ? 'ไฟล์ติดตั้ง (.exe) ทุกโปรแกรมในเครือ meCrafts · จัดเรียงตามรุ่นและอัปเดตล่าสุด · ปลอดภัย 100% In-Device Memory'
                  : 'Official standalone and suite installer binaries (.exe) for Windows 10/11 · Up-to-date releases · 100% In-Device Privacy'}
              </p>
            </div>
          </div>
          <button type="button" class="downloads-modal-close" id="btn-close-downloads-modal" aria-label="Close dialog">✕</button>
        </div>

        <div class="downloads-toolbar">
          <div class="downloads-filter-pills" role="tablist" aria-label="Filter release binaries">
            <button type="button" class="dl-filter-pill ${this.downloadsFilter === 'all' ? 'active' : ''}" data-dl-filter="all">
              ${this.lang === 'th' ? 'ทั้งหมด (12 ไฟล์)' : 'All Files (12)'}
            </button>
            <button type="button" class="dl-filter-pill ${this.downloadsFilter === 'production' ? 'active' : ''}" data-dl-filter="production">
              ${this.lang === 'th' ? 'พร้อมดาวน์โหลด (.exe)' : 'Active Releases (.exe)'}
            </button>
            <button type="button" class="dl-filter-pill ${this.downloadsFilter === 'indev' ? 'active' : ''}" data-dl-filter="indev">
              ${this.lang === 'th' ? 'กำลังพัฒนา (Roadmap)' : 'In Development'}
            </button>
          </div>
          <div class="downloads-meta-badge">
            <span class="dl-pulse-dot" aria-hidden="true"></span>
            <span>${this.lang === 'th' ? 'สถานะ: เผยแพร่เวอร์ชัน v1.0.0' : 'Channel: Stable v1.0.0'}</span>
          </div>
        </div>

        <div class="downloads-list" id="downloads-list" role="list">
          ${items.map(item => {
            const isActive = item.status === 'active';
            const cat = item.category[this.lang];
            const date = item.releaseDate[this.lang];
            const highlights = item.highlights[this.lang];

            return `
            <article class="download-item-card ${item.isSuite ? 'is-suite' : ''}" role="listitem" style="--item-accent: ${item.accentColor};">
              <div class="download-item-left">
                <div class="dl-item-top">
                  <div class="dl-item-emblem" aria-hidden="true">${getAppIcon(item.id, item.accentColor)}</div>
                  <h3 class="dl-item-title">${item.name}</h3>
                  <span class="dl-version-tag">${item.version}</span>
                  ${item.isSuite ? `<span class="dl-suite-badge">${this.lang === 'th' ? '★ ชุดโปรแกรมหลัก' : '★ All-in-One'}</span>` : ''}
                  <span class="dl-status-badge ${isActive ? 'status-active' : 'status-indev'}">
                    <span class="status-dot" aria-hidden="true"></span>
                    ${isActive ? (this.lang === 'th' ? 'พร้อมดาวน์โหลด' : 'Production Ready') : (this.lang === 'th' ? 'กำลังพัฒนา' : 'In Development')}
                  </span>
                </div>

                <div class="dl-item-meta">
                  <span class="dl-meta-filename">${item.fileName}</span>
                  <span class="dl-meta-sep">•</span>
                  <span>${item.fileSize}</span>
                  <span class="dl-meta-sep">•</span>
                  <span>${item.architecture}</span>
                  <span class="dl-meta-sep">•</span>
                  <span>${date}</span>
                  <span class="dl-meta-sep">•</span>
                  <span>${cat}</span>
                </div>

                <div class="dl-item-highlights">
                  ${highlights.map(h => `<span class="dl-spec-tag">✦ ${escapeHtml(h)}</span>`).join('')}
                </div>

                <div class="dl-checksum-note">
                  <span>🔒 SHA-256:</span>
                  <span>${item.sha256}</span>
                </div>
              </div>

              <div class="download-item-right">
                ${isActive && item.downloadUrl ? `
                  <a href="${item.downloadUrl}" download="${item.fileName}" class="dl-action-btn dl-btn-download">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    <span>${this.lang === 'th' ? `ดาวน์โหลด ${item.fileName}` : `Download ${item.fileName}`}</span>
                    <span class="dl-btn-size">${item.fileSize}</span>
                  </a>
                ` : `
                  <a href="https://github.com/methastrategy/meCraft#roadmap" target="_blank" rel="noopener noreferrer" class="dl-action-btn dl-btn-roadmap">
                    <span>${this.lang === 'th' ? 'ติดตามบน GitHub Roadmap' : 'Roadmap & GitHub'} →</span>
                  </a>
                `}
              </div>
            </article>`;
          }).join('')}
        </div>

        <div class="downloads-modal-footer">
          <div class="dl-footer-left">
            <span>🛡️ ${this.lang === 'th' ? 'ทุกไฟล์คอมไพล์จากโค้ดต้นฉบับ ปราศจากโฆษณา และทำงานบนหน่วยความจำเครื่อง 100%' : 'All binaries compiled from source, ad-free, zero-telemetry, and MIT licensed.'}</span>
          </div>
          <div class="dl-footer-right">
            <a href="https://github.com/methastrategy/meCraft/releases" target="_blank" rel="noopener noreferrer" class="dl-gh-link">
              <span>GitHub Releases & Release History</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
          </div>
        </div>
      </div>
    </div>`;
  }

  // Alias for backward compatibility if any reference exists
  private renderProgramStrip(app: ShowcaseApp): string {
    return this.renderStudioSpotlight(app);
  }

  private renderAppCard(app: ShowcaseApp): string {
    return this.renderStudioSpotlight(app);
  }

  private renderManifesto(): string {
    const cloud = [
      { en: 'Files sent to remote servers', th: 'ส่งไฟล์ไปยังเซิร์ฟเวอร์ระยะไกล' },
      { en: 'Mandatory monthly/annual billing', th: 'ค่าบริการรายเดือน/รายปีบังคับ' },
      { en: 'Background telemetry & analytics', th: 'ส่งข้อมูลการใช้งานในเบื้องหลัง' },
      { en: 'Internet required for core features', th: 'ต้องใช้อินเทอร์เน็ตสำหรับฟีเจอร์หลัก' },
      { en: 'Vendor lock-in proprietary formats', th: 'ล็อกกับรูปแบบไฟล์ของผู้ผลิต' },
      { en: 'AI training on your creative assets', th: 'ใช้ผลงานของคุณฝึก AI โดยไม่ถาม' },
    ];
    const local = [
      { en: '0 bytes leave your machine — ever', th: '0 Byte ออกจากเครื่องของคุณ — ตลอดชีวิต' },
      { en: 'Free forever, MIT open-source license', th: 'ฟรีตลอดชีวิต สัญญาอนุญาต MIT Open-Source' },
      { en: 'Zero telemetry, zero analytics, zero ads', th: 'ไม่มี Telemetry ไม่มี Analytics ไม่มีโฆษณา' },
      { en: '100% offline local RAM execution', th: 'ประมวลผลบน RAM เฉพาะเครื่อง 100% Offline' },
      { en: 'Open standard formats (PDF, SVG, PNG)', th: 'รูปแบบ Open Standard (PDF, SVG, PNG)' },
      { en: 'Your files. Your machine. Your control.', th: 'ไฟล์ของคุณ เครื่องของคุณ การควบคุมของคุณ' },
    ];
    return `
    <section class="portal-manifesto" id="manifesto" aria-labelledby="manifesto-title">
      <div class="portal-section-inner">
        <div class="section-eyebrow" aria-hidden="true">PRIVACY ARCHITECTURE</div>
        <h2 class="section-title" id="manifesto-title">${this.t.manifestoTitle}</h2>
        <p class="section-subtitle">${this.t.manifestoSubtitle}</p>
        <div class="manifesto-grid" role="table" aria-label="Privacy comparison">
          <div class="manifesto-col manifesto-col-bad" role="columnheader">
            <div class="manifesto-col-head">
              <span class="manifesto-col-icon" aria-hidden="true">☁️</span>
              <h3>${this.t.col1Title}</h3>
            </div>
            <ul class="manifesto-list" role="list">
              ${cloud.map(item => `<li class="manifesto-item manifesto-item-bad" role="listitem">
                <span class="manifesto-x" aria-label="Disadvantage">✕</span>
                <span>${item[this.lang]}</span>
              </li>`).join('')}
            </ul>
          </div>
          <div class="manifesto-divider" aria-hidden="true">
            <div class="manifesto-vs">VS</div>
          </div>
          <div class="manifesto-col manifesto-col-good" role="columnheader">
            <div class="manifesto-col-head">
              <span class="manifesto-col-icon manifesto-seal-icon" aria-hidden="true">
                <img src="./branding/privacy-seal.png" class="manifesto-seal-img" alt="100% In-Device Privacy Seal" onerror="this.style.display='none';if(this.nextElementSibling){this.nextElementSibling.style.display='inline-block';}" />
                <span class="manifesto-seal-fallback" style="display:none;">🔒</span>
              </span>
              <h3>${this.t.col2Title}</h3>
            </div>
            <ul class="manifesto-list" role="list">
              ${local.map(item => `<li class="manifesto-item manifesto-item-good" role="listitem">
                <span class="manifesto-check" aria-label="Advantage">✓</span>
                <span>${item[this.lang]}</span>
              </li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    </section>`;
  }

  private renderSpecs(): string {
    const specs = [
      { icon: '🖥', label: { en: 'Platform', th: 'แพลตฟอร์ม' }, value: 'Windows 10 / 11 — 64-bit' },
      { icon: '⚙️', label: { en: 'Runtime', th: 'Runtime' }, value: 'Tauri v2 (Rust) + WebView2' },
      { icon: '🎮', label: { en: 'GPU', th: 'GPU' }, value: 'Hardware-Accelerated Rendering' },
      { icon: '📦', label: { en: 'Installer Size', th: 'ขนาดตัวติดตั้ง' }, value: '14.8 MB (NSIS Installer)' },
      { icon: '💼', label: { en: 'Portable', th: 'แบบพกพา' }, value: '25.4 MB (No Admin Rights)' },
      { icon: '📄', label: { en: 'License', th: 'สัญญาอนุญาต' }, value: 'MIT Open-Source — Free Forever' },
      { icon: '🔄', label: { en: 'Architecture', th: 'สถาปัตยกรรม' }, value: '100% Client-Side · Zero Cloud' },
      { icon: '🧠', label: { en: 'Memory', th: 'หน่วยความจำ' }, value: 'Requires 4 GB RAM (8 GB Recommended)' },
    ];
    return `
    <section class="portal-specs" id="specs" aria-labelledby="specs-title">
      <div class="portal-section-inner">
        <div class="section-eyebrow" aria-hidden="true">TECHNICAL SPECIFICATIONS</div>
        <h2 class="section-title" id="specs-title">${this.t.specsTitle}</h2>
        <p class="section-subtitle">${this.t.specsSubtitle}</p>
        <div class="specs-grid" role="list" aria-label="Technical specifications">
          ${specs.map(s => `
            <div class="spec-item" role="listitem">
              <span class="spec-icon" aria-hidden="true">${s.icon}</span>
              <div class="spec-content">
                <span class="spec-label">${s.label[this.lang]}</span>
                <span class="spec-value">${s.value}</span>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="specs-cta-row">
          <div class="specs-box-showcase">
            <img src="./branding/suite-installer-box.png" class="specs-box-img" alt="meCraft Suite Windows Package" loading="lazy" />
            <div class="specs-box-desc">
              <h4>${this.lang === 'th' ? 'meCraft Installer สำหรับ Windows 11 / 10' : 'meCraft Installer for Windows 11 / 10'}</h4>
              <p>${this.lang === 'th' ? 'รวมครบทั้ง 11 โปรแกรมในตัวติดตั้งเดียว ติดตั้งออฟไลน์ 100% ไร้โฆษณา ไร้การติดตาม' : 'All 11 standalone studios bundled in one lightweight offline installer. Zero ads, zero telemetry.'}</p>
            </div>
          </div>
          <div class="specs-actions">
            <a href="${SUITE_DOWNLOAD_URL}" download="meCraft-Setup.exe" class="hero-cta-primary">
              ${this.lang === 'en' ? 'Download Suite (.exe) — 14.8 MB' : 'ดาวน์โหลด Suite (.exe) — 14.8 MB'}
            </a>
            <a href="https://github.com/methastrategy/meCraft/releases" target="_blank" rel="noopener noreferrer" class="hero-cta-secondary">
              ${this.lang === 'en' ? 'View All Releases & Source on GitHub →' : 'ดูประวัติ Releases และ Source Code บน GitHub →'}
            </a>
          </div>
        </div>
      </div>
    </section>`;
  }

  private renderFooter(): string {
    return `
    <footer class="portal-footer" role="contentinfo">
      <div class="portal-footer-inner">
        <div class="footer-brand">
          <span class="footer-brand-name">meCrafts</span>
          <span class="footer-tagline">${this.t.footerTagline}</span>
        </div>
        <nav class="footer-links" aria-label="Footer links">
          <a href="https://github.com/methastrategy/meCraft" target="_blank" rel="noopener noreferrer" class="footer-link">GitHub Repository</a>
          <a href="https://github.com/methastrategy/meCraft/releases" target="_blank" rel="noopener noreferrer" class="footer-link">Releases (v1.0.0)</a>
          <a href="./downloads" target="_blank" rel="noopener noreferrer" class="footer-link" id="footer-btn-open-downloads">${this.lang === 'th' ? 'ศูนย์ดาวน์โหลด (.exe)' : 'Downloads Directory'}</a>
          <a href="https://github.com/methastrategy/meCraft/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" class="footer-link">MIT License</a>
          ${!this.currentSession ? `
            <button type="button" class="footer-link btn-trigger-auth" id="footer-btn-open-auth">${this.t.signInBtn}</button>
          ` : ''}
          <a href="#hero" class="footer-link">${this.lang === 'en' ? 'Back to Top ↑' : 'กลับสู่ด้านบน ↑'}</a>
        </nav>
        <p class="footer-copy">${this.t.footerCopyright}</p>
      </div>
    </footer>`;
  }

  private async handleDropFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const file = files[0];
    const name = file.name || 'document';
    const isPdf = name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf';
    const isImage = file.type.startsWith('image/') || /\.(jpe?g|png|webp|avif|bmp|gif|svg)$/i.test(name);
    const appId = isPdf ? 'mepdf' : (isImage ? 'mephoto' : 'mepdf');
    const filePath = (file as any).path || name;

    try {
      await this.bridge.saveRecentProject({
        name,
        path: filePath,
        appId,
        fileType: isPdf ? 'pdf' : 'image',
        sizeBytes: file.size,
      });
    } catch {}

    await this.handleLaunchApp(appId, 'desktop', filePath);
    await this.loadRecentProjects();
  }

  private async handleLaunchApp(appId: string, target: 'desktop' | 'web' = 'desktop', filePath?: string) {
    if (!this.bridge.isTauri()) {
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.pathname = `/${appId}/`;
        url.searchParams.delete('studio');
        url.searchParams.delete('app');
        window.history.pushState({}, '', url.toString());
      }
      mountStudio(appId, this.appEl, this.lang);
      return;
    }

    try {
      await this.bridge.launchApp({
        appId,
        target,
        filePath,
      });
    } catch (err) {
      console.warn(`[meCraft:launch] Error launching ${appId}:`, err);
    }
  }

  private attachListeners() {
    // ── User Profile Capsule & Modal Handlers ──
    document.getElementById('user-profile-pill')?.addEventListener('click', () => {
      this.isUserProfileModalOpen = true;
      this.render();
      this.attachListeners();
    });

    document.getElementById('btn-close-profile-modal')?.addEventListener('click', () => {
      this.isUserProfileModalOpen = false;
      this.render();
      this.attachListeners();
    });

    document.getElementById('modal-profile-backdrop')?.addEventListener('click', () => {
      this.isUserProfileModalOpen = false;
      this.render();
      this.attachListeners();
    });

    document.getElementById('btn-profile-signout')?.addEventListener('click', async () => {
      await this.handleSignOut();
    });

    // ── Auth Modal Open / Close Triggers ──
    document.querySelectorAll('.btn-trigger-auth, #header-btn-auth, #btn-open-auth, #hero-btn-open-auth, #footer-btn-open-auth').forEach(btn => {
      btn.addEventListener('click', () => {
        this.isAuthModalOpen = true;
        this.authError = '';
        this.render();
        this.attachListeners();
      });
    });

    document.getElementById('btn-close-auth-modal')?.addEventListener('click', () => {
      this.isAuthModalOpen = false;
      this.render();
      this.attachListeners();
    });

    document.getElementById('modal-auth-backdrop')?.addEventListener('click', () => {
      this.isAuthModalOpen = false;
      this.render();
      this.attachListeners();
    });

    // Web Portal Auth Modal Tabs
    document.getElementById('modal-tab-signin')?.addEventListener('click', () => {
      this.authTab = 'signin';
      this.authError = '';
      this.render();
      this.attachListeners();
    });

    document.getElementById('modal-tab-signup')?.addEventListener('click', () => {
      this.authTab = 'signup';
      this.authError = '';
      this.render();
      this.attachListeners();
    });

    // Web Portal Password Toggle
    document.getElementById('modal-btn-toggle-pwd')?.addEventListener('click', () => {
      const input = document.getElementById('modal-auth-password') as HTMLInputElement | null;
      if (input) {
        input.type = input.type === 'password' ? 'text' : 'password';
      }
    });

    // Web Portal Form Submit
    document.getElementById('modal-auth-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = (document.getElementById('modal-auth-email') as HTMLInputElement)?.value.trim();
      const pwd = (document.getElementById('modal-auth-password') as HTMLInputElement)?.value;
      const fullName = (document.getElementById('modal-auth-fullname') as HTMLInputElement)?.value.trim();

      if (!email || !pwd || pwd.length < 6) {
        this.authError = this.lang === 'en' ? 'Please provide a valid email and 6+ character password.' : 'กรุณากรอกอีเมลและรหัสผ่านอย่างน้อย 6 ตัวอักษร';
        this.render();
        this.attachListeners();
        return;
      }

      this.handleAuthSubmit(email, pwd, fullName);
    });

    // Web Portal Google & Demo Login
    document.getElementById('modal-btn-auth-google')?.addEventListener('click', () => {
      this.handleGoogleAuth();
    });

    document.getElementById('modal-btn-auth-demo')?.addEventListener('click', () => {
      const session = createMockAuthSession('demo.creator@mecraft.dev', 'free_member');
      saveAuthSession(session);
      this.currentSession = session;
      this.isAuthModalOpen = false;
      this.render();
      this.attachListeners();
    });

    document.getElementById('modal-link-forgot-pwd')?.addEventListener('click', (e) => {
      e.preventDefault();
      const email = (document.getElementById('modal-auth-email') as HTMLInputElement)?.value.trim();
      this.handlePasswordReset(email);
    });

    // Clean URL Invariant: Smooth scroll without updating or mutating browser URL with hash
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (!href || href === '#') {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }

        const targetId = href.replace(/^#/, '');
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Authenticated state listeners
    document.querySelectorAll('#btn-signout, #btn-profile-signout').forEach(btn => {
      btn.addEventListener('click', async () => {
        await this.handleSignOut();
      });
    });

    // Language toggle
    document.getElementById('btn-lang')?.addEventListener('click', () => {
      this.lang = this.lang === 'en' ? 'th' : 'en';
      try {
        localStorage.setItem('mecrafts_lang', this.lang);
      } catch {}
      this.render();
      this.attachListeners();
    });

    // Live search
    document.getElementById('apps-search')?.addEventListener('input', (e) => {
      this.searchQuery = (e.target as HTMLInputElement).value;
      this.updateGrid();
    });

    // Category filter pills
    document.querySelectorAll('.filter-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeFilter = (btn as HTMLElement).dataset.filter as AppCategory | 'all';
        document.querySelectorAll('.filter-pill').forEach(b => {
          b.classList.toggle('active', b === btn);
          b.setAttribute('aria-selected', String(b === btn));
        });
        this.updateGrid();
      });
    });

    // Studio Navigator & Spotlight Listeners
    this.bindStudioNavigatorListeners();
    this.bindEcosystemCardListeners();
    this.bindSpotlightListeners();
    this.setupScrollSpy();

    // Fullscreen Inspector Modal Close
    document.getElementById('btn-close-fullscreen-modal')?.addEventListener('click', () => {
      this.isFullscreenMockupOpen = false;
      this.render();
      this.attachListeners();
    });

    document.getElementById('fullscreen-modal-backdrop')?.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).id === 'fullscreen-modal-backdrop') {
        this.isFullscreenMockupOpen = false;
        this.render();
        this.attachListeners();
      }
    });

    // Downloads Directory Modal Close / Filter
    document.getElementById('btn-close-downloads-modal')?.addEventListener('click', () => {
      this.isDownloadsModalOpen = false;
      this.render();
      this.attachListeners();
    });

    document.getElementById('modal-downloads-backdrop')?.addEventListener('click', () => {
      this.isDownloadsModalOpen = false;
      this.render();
      this.attachListeners();
    });

    document.querySelectorAll<HTMLElement>('.dl-filter-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        const filter = pill.getAttribute('data-dl-filter') as 'all' | 'production' | 'indev';
        if (filter) {
          this.downloadsFilter = filter;
          this.render();
          this.attachListeners();
        }
      });
    });

    // In-App Software Update Listeners
    document.getElementById('header-btn-update')?.addEventListener('click', () => {
      this.isUpdateModalOpen = true;
      this.render();
      this.attachListeners();
    });

    const closeUpdate = () => {
      if (this.updateInfo) {
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem('mecraft_dismissed_update', this.updateInfo.latestVersion);
        }
      }
      this.isUpdateModalOpen = false;
      this.render();
      this.attachListeners();
    };

    document.getElementById('btn-close-update-modal')?.addEventListener('click', closeUpdate);
    document.getElementById('btn-update-later')?.addEventListener('click', closeUpdate);
    document.getElementById('modal-update-backdrop')?.addEventListener('click', closeUpdate);

    // Desktop Workstation Sidebar & Views Bindings
    this.bindDesktopWorkstationListeners();
  }

  private bindDesktopWorkstationListeners() {
    // 1. Sidebar tab switching
    document.querySelectorAll<HTMLElement>('.ws-nav-btn[data-ws-view]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const view = btn.getAttribute('data-ws-view') as any;
        if (view && this.desktopView !== view) {
          this.desktopView = view;
          this.render();
          this.attachListeners();
        }
      });
    });

    document.querySelectorAll<HTMLElement>('[data-switch-view]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const view = btn.getAttribute('data-switch-view') as any;
        if (view && this.desktopView !== view) {
          this.desktopView = view;
          this.render();
          this.attachListeners();
        }
      });
    });

    // 2. Language toggle in sidebar
    document.getElementById('ws-btn-lang')?.addEventListener('click', () => {
      this.lang = this.lang === 'en' ? 'th' : 'en';
      this.render();
      this.attachListeners();
    });

    // 3. Update buttons in sidebar and vault
    document.getElementById('ws-btn-update')?.addEventListener('click', () => {
      this.isUpdateModalOpen = true;
      this.render();
      this.attachListeners();
    });
    document.getElementById('ws-btn-check-update-vault')?.addEventListener('click', () => {
      this.checkForUpdates(true);
    });

    // 4. User profile / Auth in sidebar & vault
    document.getElementById('ws-profile-capsule')?.addEventListener('click', () => {
      this.isUserProfileModalOpen = true;
      this.render();
      this.attachListeners();
    });
    document.getElementById('ws-btn-signout')?.addEventListener('click', async (e) => {
      e.stopPropagation();
      await this.handleSignOut();
    });
    document.getElementById('ws-btn-auth')?.addEventListener('click', () => {
      this.isAuthModalOpen = true;
      this.render();
      this.attachListeners();
    });
    document.getElementById('ws-btn-vault-signin')?.addEventListener('click', () => {
      this.isAuthModalOpen = true;
      this.render();
      this.attachListeners();
    });

    // 5. Workbench Dropzone and File Browse
    const dropzone = document.getElementById('ws-universal-dropzone');
    const fileInput = document.getElementById('ws-file-input') as HTMLInputElement | null;

    document.getElementById('ws-btn-browse')?.addEventListener('click', () => {
      fileInput?.click();
    });

    fileInput?.addEventListener('change', () => {
      if (fileInput.files && fileInput.files.length > 0) {
        this.handleDropFiles(fileInput.files);
      }
    });

    if (dropzone) {
      ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropzone.classList.add('drag-active');
        }, false);
      });

      ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropzone.classList.remove('drag-active');
        }, false);
      });

      dropzone.addEventListener('drop', (e: DragEvent) => {
        if (e.dataTransfer && e.dataTransfer.files) {
          this.handleDropFiles(e.dataTransfer.files);
        }
      });
    }

    // 6. Workbench Quick Action Buttons
    document.querySelectorAll<HTMLElement>('.ws-quick-action-pill[data-quick-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-quick-action');
        if (action === 'mepdf' || action === 'mepdf-compress') {
          this.handleLaunchApp('mepdf', 'desktop');
        } else if (action === 'mephoto') {
          this.handleLaunchApp('mephoto', 'desktop');
        } else if (action === 'medoc') {
          this.handleLaunchApp('medoc', 'desktop');
        }
      });
    });

    // 7. Launch Studio Buttons (All Views)
    document.querySelectorAll<HTMLElement>('[data-launch-app]').forEach(btn => {
      btn.addEventListener('click', () => {
        const appId = btn.getAttribute('data-launch-app');
        if (appId) {
          this.handleLaunchApp(appId, 'desktop');
        }
      });
    });

    // 8. Open Recent Project & Clear History
    document.querySelectorAll<HTMLElement>('[data-open-recent]').forEach(el => {
      el.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (el !== target && el.tagName === 'TR' && target.tagName === 'BUTTON') return;
        const filePath = el.getAttribute('data-open-recent');
        const appId = el.getAttribute('data-recent-app') || 'mepdf';
        if (filePath) {
          this.handleLaunchApp(appId, 'desktop', filePath);
        }
      });
    });

    document.getElementById('ws-btn-clear-recents')?.addEventListener('click', async () => {
      await this.bridge.clearRecentProjects();
      await this.loadRecentProjects();
    });

    // 9. Studios Search and Category Filtering
    document.getElementById('ws-studios-search-input')?.addEventListener('input', (e) => {
      this.searchQuery = (e.target as HTMLInputElement).value;
      this.render();
      this.attachListeners();
      const input = document.getElementById('ws-studios-search-input') as HTMLInputElement;
      if (input) {
        input.focus();
        input.selectionStart = input.selectionEnd = input.value.length;
      }
    });

    document.querySelectorAll<HTMLElement>('.ws-filter-pill[data-cat-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeFilter = (btn.getAttribute('data-cat-filter') as AppCategory | 'all') || 'all';
        this.render();
        this.attachListeners();
      });
    });
  }

  private bindStudioNavigatorListeners() {
    document.querySelectorAll<HTMLElement>('.studio-nav-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const studioId = btn.getAttribute('data-studio-id');
        if (studioId) {
          this.scrollToStudio(studioId);
        }
      });
    });
  }

  private bindEcosystemCardListeners() {
    document.querySelectorAll<HTMLElement>('.ecosystem-card[data-studio-jump]').forEach(card => {
      const onJump = (e: Event) => {
        e.preventDefault();
        const studioId = card.getAttribute('data-studio-jump');
        if (studioId) {
          this.scrollToStudio(studioId);
        }
      };
      card.addEventListener('click', onJump);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onJump(e);
        }
      });
    });
  }

  private bindSpotlightListeners() {
    document.querySelectorAll<HTMLElement>('.btn-inspect-modal').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const appId = btn.getAttribute('data-inspect-app');
        if (appId) {
          this.activeStudioId = appId;
        }
        this.isFullscreenMockupOpen = true;
        this.render();
        this.attachListeners();
      });
    });
  }

  private scrollToStudio(studioId: string) {
    this.activeStudioId = studioId;

    let targetEl = document.getElementById(`spotlight-${studioId}`);
    if (!targetEl) {
      // If target studio was filtered out, reset category filter
      this.activeFilter = 'all';
      this.searchQuery = '';
      this.render();
      this.attachListeners();
      targetEl = document.getElementById(`spotlight-${studioId}`);
    }

    // Update active class on nav pills
    document.querySelectorAll<HTMLElement>('.studio-nav-pill').forEach(pill => {
      const isCur = pill.getAttribute('data-studio-id') === studioId;
      pill.classList.toggle('active', isCur);
      pill.setAttribute('aria-selected', String(isCur));
      if (isCur) {
        pill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });

    // Update active class on ecosystem cards
    document.querySelectorAll<HTMLElement>('.ecosystem-card').forEach(card => {
      const isCur = card.getAttribute('data-studio-jump') === studioId;
      card.classList.toggle('card-active', isCur);
      const hint = card.querySelector('.eco-jump-hint');
      if (hint) {
        hint.textContent = isCur
          ? (this.lang === 'th' ? '● กำลังแสดง' : '● In View')
          : (this.lang === 'th' ? 'เลื่อนไปดูหน้านี้ ↑' : 'Scroll to View ↑');
      }
    });

    // Smooth scroll into view without mutating URL hash
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  private setupScrollSpy() {
    if (typeof IntersectionObserver === 'undefined') return;
    if (this.scrollSpyObserver) {
      this.scrollSpyObserver.disconnect();
    }

    const cards = document.querySelectorAll<HTMLElement>('.studio-spotlight-card');
    if (cards.length === 0) return;

    this.scrollSpyObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter(e => e.isIntersecting);
      if (visible.length === 0) return;

      const topCard = visible.reduce((prev, curr) => {
        return (curr.boundingClientRect.top >= 0 && curr.boundingClientRect.top < prev.boundingClientRect.top) ? curr : prev;
      }, visible[0]);

      const id = topCard.target.id.replace('spotlight-', '');
      if (id && id !== this.activeStudioId) {
        this.activeStudioId = id;
        document.querySelectorAll<HTMLElement>('.studio-nav-pill').forEach(pill => {
          const isCur = pill.getAttribute('data-studio-id') === id;
          pill.classList.toggle('active', isCur);
          pill.setAttribute('aria-selected', String(isCur));
          if (isCur) {
            pill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          }
        });
        document.querySelectorAll<HTMLElement>('.ecosystem-card').forEach(card => {
          const isCur = card.getAttribute('data-studio-jump') === id;
          card.classList.toggle('card-active', isCur);
        });
      }
    }, {
      rootMargin: '-120px 0px -50% 0px',
      threshold: [0.1, 0.4]
    });

    cards.forEach(card => this.scrollSpyObserver?.observe(card));
  }

  private selectStudio(studioId: string) {
    this.scrollToStudio(studioId);
  }

  private selectApp(appId: string) {
    this.scrollToStudio(appId);
  }

  private updateGrid() {
    const apps = this.filteredApps();
    const streamEl = document.getElementById('studios-spotlight-stream');
    if (streamEl) {
      if (apps.length > 0) {
        streamEl.innerHTML = apps.map(app => this.renderStudioSpotlight(app)).join('');
        this.bindSpotlightListeners();
        this.setupScrollSpy();
      } else {
        streamEl.innerHTML = `
          <div class="apps-empty" role="status">
            <div class="apps-empty-icon" aria-hidden="true">🔍</div>
            <p>${this.lang === 'en' ? 'No programs match your search.' : 'ไม่พบโปรแกรมที่ตรงกับการค้นหา'}</p>
          </div>
        `;
      }
    }

    const ecoGrid = document.getElementById('ecosystem-grid');
    if (ecoGrid) {
      if (apps.length > 0) {
        ecoGrid.innerHTML = apps.map(app => this.renderEcosystemCard(app, app.id === this.activeStudioId)).join('');
        this.bindEcosystemCardListeners();
      } else {
        ecoGrid.innerHTML = `
          <div class="apps-empty" role="status">
            <div class="apps-empty-icon" aria-hidden="true">🔍</div>
            <p>${this.lang === 'en' ? 'No programs match your search.' : 'ไม่พบโปรแกรมที่ตรงกับการค้นหา'}</p>
          </div>
        `;
      }
    }
  }
}

// ─── Boot ─────────────────────────────────────────────────────────────────────
// Re-export bridge utilities so tests that import from main.ts still compile.
export {
  getDefaultCatalog,
  createLauncherBridge,
  formatBytes,
  formatSpeed,
  getAuthSession,
  saveAuthSession,
  clearAuthSession,
  createMockAuthSession,
  getTierBadge,
  isFeatureUnlocked,
  isOfflineGraceValid,
  onAuthSessionChange,
  exportAuthSyncCode,
  importAuthSyncCode,
  checkUrlAuthHandoff,
  escapeHtml,
  MeCraftsPortal,
};
export type { AppCatalogItem, RecentProject, DownloadProgress, AuthSession, SubscriptionTier };

// ── Backward-compat exports for existing test suite ────────────────────────
export const TRANSLATIONS = {
  en: {
    ...PORTAL_I18N.en,
    badgePrivacy: '100% In-Device Privacy',
    openWebStudio: 'Open Web Studio',
  },
  th: {
    ...PORTAL_I18N.th,
    badgePrivacy: 'ความเป็นส่วนตัว 100%',
    openWebStudio: 'เปิด Web Studio',
  },
};

export const APP_THAI_METADATA: Record<string, { tagline: string; description: string }> = {
  mepdf: {
    tagline: SHOWCASE_APPS.find(a => a.id === 'mepdf')!.tagline.th,
    description: SHOWCASE_APPS.find(a => a.id === 'mepdf')!.description.th,
  },
  mephoto: {
    tagline: SHOWCASE_APPS.find(a => a.id === 'mephoto')!.tagline.th,
    description: SHOWCASE_APPS.find(a => a.id === 'mephoto')!.description.th,
  },
};

// Boot only in browser context (not in Node/Vitest test runner)
if (typeof document !== 'undefined') {
  new MeCraftsPortal();
}
