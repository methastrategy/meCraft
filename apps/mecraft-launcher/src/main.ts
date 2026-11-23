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
  type AppCatalogItem,
  type RecentProject,
  type DownloadProgress,
  type AuthSession,
  type SubscriptionTier,
} from '@mecraft/core-bridge';
import { supabase } from './supabase';

// ─────────────────────────────────────────────────────────────────────────────
// PORTAL INVARIANT: This file is the OFFICIAL SHOWCASE & DISCOVERY WEB PORTAL.
// NO embedded editors, NO canvas tools, NO PDF workers, NO iframes.
// Role: product presentation, feature discovery, search/filter, download links.
// ─────────────────────────────────────────────────────────────────────────────

export type AppStatus = 'active' | 'in-dev';
export type AppCategory = 'document' | 'photo' | 'vector' | 'video' | 'audio';

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
}

const PORTAL_I18N: Record<'en' | 'th', PortalTranslations> = {
  en: {
    brandTitle: 'meCrafts',
    brandSubtitle: 'Official Creative Suite',
    headerCta: 'Download Suite (.exe)',
    heroTitle: 'The Private-First Creative & Document Workstation Suite',
    heroSubtitle: '100% Client-Side Local Execution. Zero-Cloud Uploads. Native Windows Desktop Engine. 10 Purpose-Built Creative Tools — All Free, Forever.',
    heroBadge1: '100% In-Device Privacy',
    heroBadge2: 'Zero Telemetry',
    heroBadge3: 'Open-Source',
    heroBadge4: 'Native Windows Performance',
    heroCta1: 'Download meCraft Suite for Windows',
    heroCta2: 'Browse All 10 Programs ↓',
    searchPlaceholder: 'Search programs, features, file types…',
    filterAll: 'All (10)',
    filterDocument: 'Document',
    filterPhoto: 'Photo & Color',
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
    appsCount: '10 Apps',
    signInBtn: 'Sign In',
    signUpBtn: 'Create Account',
    authModalTitle: 'meCraft Studio Account',
    authModalSubtitle: 'Access Private Suite & Synchronize Entitlements',
    syncDesktopBtn: 'Sync to Desktop',
  },
  th: {
    brandTitle: 'meCrafts',
    brandSubtitle: 'ชุดโปรแกรมสร้างสรรค์ทางการ',
    headerCta: 'ดาวน์โหลด Suite (.exe)',
    heroTitle: 'ชุดโปรแกรมสร้างสรรค์และเอกสารที่ให้ความเป็นส่วนตัวก่อน',
    heroSubtitle: 'ประมวลผล 100% บนเครื่อง ไม่อัปโหลดไฟล์ไปที่ Cloud เครื่องยนต์ Windows Desktop จริง โปรแกรมสร้างสรรค์เฉพาะทาง 10 ตัว — ฟรีทั้งหมด ตลอดชีวิต',
    heroBadge1: 'ความเป็นส่วนตัว 100%',
    heroBadge2: 'ไม่มีการเก็บข้อมูล',
    heroBadge3: 'Open-Source',
    heroBadge4: 'ประสิทธิภาพ Windows จริง',
    heroCta1: 'ดาวน์โหลด meCraft Suite สำหรับ Windows',
    heroCta2: 'ดูโปรแกรมทั้ง 10 ตัว ↓',
    searchPlaceholder: 'ค้นหาโปรแกรม ฟีเจอร์ ประเภทไฟล์…',
    filterAll: 'ทั้งหมด (10)',
    filterDocument: 'เอกสาร',
    filterPhoto: 'ภาพและสี',
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
    appsCount: '10 โปรแกรม',
    signInBtn: 'เข้าสู่ระบบ',
    signUpBtn: 'สมัครสมาชิก',
    authModalTitle: 'บัญชี meCraft Studio',
    authModalSubtitle: 'เข้าใช้งานชุดโปรแกรมและเชื่อมต่อสิทธิ์การใช้งาน',
    syncDesktopBtn: 'เชื่อมต่อ Desktop',
  },
};

const SUITE_DOWNLOAD_URL = 'https://github.com/methastrategy/meCraft/releases/download/v1.0.0/meCraft-Setup.exe';

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
      en: 'Zen Focus Markdown Typewriter & Research Suite',
      th: 'เครื่องพิมพ์ Markdown แบบ Zen Focus และชุดการวิจัย',
    },
    description: {
      en: 'Distraction-free typography, live KaTeX LaTeX equation rendering, and publication document generation.',
      th: 'ตัวพิมพ์ไร้สิ่งรบกวน, เรนเดอร์สมการ LaTeX KaTeX แบบ Live และสร้างเอกสารสิ่งพิมพ์',
    },
    status: 'in-dev',
    version: 'v1.0.0',
    suiteDownloadUrl: SUITE_DOWNLOAD_URL,
    artcraftEquivalent: 'WordCraft / Microsoft Word',
    accentColor: '#6366f1',
    glowColor: 'rgba(99,102,241,0.25)',
    icon: 'doc',
    keywords: ['markdown', 'word', 'document', 'latex', 'writing', 'typewriter', 'research', 'publish'],
    enginePill: { en: 'Zen Typewriter · Live KaTeX Math', th: 'Zen พิมพ์สมาธิ · แสดงสมการ KaTeX สด' },
    specs: {
      en: ['Distraction-Free Zen Markdown Typewriter', 'Real-Time KaTeX LaTeX Mathematical Rendering', 'Academic Footnotes, Citations & References', 'One-Click Publication-Grade PDF Generator', 'Live Outline Tree for Long-Form Manuscripts'],
      th: ['พื้นที่เขียนงานสไตล์ Zen สบายตา ไร้สิ่งรบกวน', 'เรนเดอร์สูตรคณิตศาสตร์ KaTeX LaTeX แบบสด', 'ระบบแทรกเชิงอรรถและเอกสารอ้างอิงทางวิชาการ', 'แปลงบทความเป็น PDF จัดหน้าสวยงามในคลิกเดียว', 'โครงสร้าง Outline นำทางเอกสารขนาดยาว'],
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

// ─── SVG Icons ───────────────────────────────────────────────────────────────
function getAppIcon(icon: string, color: string): string {
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
  };
  return icons[icon] ?? icons['doc'];
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
  private lang: 'en' | 'th' = 'en';
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
    // In Tauri desktop environment, enforce member auth gate.
    // On the public showcase web portal, allow immediate access to discovery & downloads.
    if (this.bridge.isTauri() && !this.currentSession) {
      this.appEl.innerHTML = this.renderAuthGate();
      return;
    }

    this.appEl.innerHTML = `
      ${this.renderHeader()}
      <main id="portal-main">
        ${this.renderHero()}
        ${this.renderFilterBar()}
        ${this.renderAppsGrid()}
        ${this.renderManifesto()}
        ${this.renderSpecs()}
      </main>
      ${this.renderFooter()}
      ${this.renderAuthModal()}
      ${this.renderSyncModal()}
      ${this.renderDesktopPreviewModal()}
    `;
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
            <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
              <defs>
                <linearGradient id="auth-emblem-g" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stop-color="#d4af37"/>
                  <stop offset="100%" stop-color="#f7d774"/>
                </linearGradient>
              </defs>
              <rect x="2" y="2" width="28" height="28" rx="8" fill="url(#auth-emblem-g)" opacity="0.15"/>
              <path d="M8 24 L16 8 L24 24" stroke="url(#auth-emblem-g)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
              <path d="M11 19 h10" stroke="url(#auth-emblem-g)" stroke-width="2" stroke-linecap="round"/>
            </svg>
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
            <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
              <defs>
                <linearGradient id="modal-auth-emblem-g" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stop-color="#d4af37"/>
                  <stop offset="100%" stop-color="#f7d774"/>
                </linearGradient>
              </defs>
              <rect x="2" y="2" width="28" height="28" rx="8" fill="url(#modal-auth-emblem-g)" opacity="0.15"/>
              <path d="M8 24 L16 8 L24 24" stroke="url(#modal-auth-emblem-g)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
              <path d="M11 19 h10" stroke="url(#modal-auth-emblem-g)" stroke-width="2" stroke-linecap="round"/>
            </svg>
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
    const syncCode = this.currentSession ? exportAuthSyncCode(this.currentSession) : '';
    return `
    <div class="auth-modal-overlay ${this.isSyncModalOpen ? 'active' : ''}" id="sync-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-sync-title">
      <div class="auth-modal-backdrop" id="modal-sync-backdrop"></div>
      <div class="auth-gate-card auth-modal-card">
        <button type="button" class="auth-modal-close" id="btn-close-sync-modal" aria-label="Close dialog">✕</button>
        <div class="auth-brand">
          <div class="auth-brand-emblem" aria-hidden="true" style="font-size:28px;">🔄</div>
          <h2 class="auth-title" id="modal-sync-title">${this.lang === 'en' ? 'Sync with Desktop Launcher' : 'เชื่อมต่อบัญชีกับ Desktop'}</h2>
          <p class="auth-subtitle">${this.lang === 'en' ? 'One-Click Handshake for Native Windows Desktop Launcher' : 'เชื่อมต่อบัญชีเข้ากับโปรแกรม meCraft บน Windows ทันที'}</p>
        </div>

        <div class="sync-code-section">
          <label for="display-sync-code" class="sync-code-label">${this.lang === 'en' ? 'Your Instant Handshake Code:' : 'รหัสเชื่อมต่อด่วนของคุณ:'}</label>
          <div class="sync-code-box">
            <textarea readonly id="display-sync-code" class="sync-code-textarea" spellcheck="false">${escapeHtml(syncCode)}</textarea>
            <button type="button" id="btn-copy-sync-code" class="btn-copy-code">
              ${this.syncCodeCopied ? (this.lang === 'en' ? '✓ Copied to Clipboard!' : '✓ คัดลอกสำเร็จแล้ว!') : (this.lang === 'en' ? '📋 Copy Sync Code' : '📋 คัดลอกรหัสเชื่อมต่อ')}
            </button>
          </div>
          <p class="sync-hint">${this.lang === 'en' ? 'Open meCraft Suite on your Windows PC, click "Paste Sync Code" on the login screen, and paste this code to sign in instantly.' : 'เปิดโปรแกรม meCraft บน Windows กดปุ่ม "วางรหัสเชื่อมต่อจาก meCrafts Web" เพื่อเข้าใช้งานได้ทันที'}</p>
        </div>
      </div>
    </div>`;
  }

  private renderDesktopPreviewModal(): string {
    return '';
  }

  private renderDesktopPreviewInline(app: ShowcaseApp): string {
    const docExt = app.id === 'mepdf' ? 'pdf' : (app.id === 'mephoto' ? 'dng' : (app.id === 'mevector' ? 'svg' : (app.id === 'mefilm' ? 'proj' : (app.id === 'melight' ? 'raw' : (app.id === 'memotion' ? 'motion' : (app.id === 'medesign' ? 'design' : (app.id === 'meaudio' ? 'wav' : (app.id === 'medoc' ? 'doc' : '3d'))))))));
    const sampleDocName = this.lang === 'th' ? `ชิ้นงานออกแบบ_2026.${docExt}` : `Creative_Project_Master.${docExt}`;

    return `
    <div class="desktop-preview-window" id="desktop-preview-window-${app.id}">
      <!-- Native Windows Title Bar -->
      <div class="desktop-window-titlebar">
        <div class="window-titlebar-left">
          <div class="window-app-icon">${getAppIcon(app.icon, app.accentColor)}</div>
          <span class="window-title-text" id="preview-window-title-${app.id}">${app.name} — [${sampleDocName}] - Windows Native Desktop</span>
          <span class="window-native-pill">100% Native Desktop App</span>
        </div>
        <div class="window-titlebar-controls" aria-hidden="true">
          <button class="win-ctrl-btn" type="button" tabindex="-1" title="Minimize">─</button>
          <button class="win-ctrl-btn" type="button" tabindex="-1" title="Maximize">□</button>
          <button class="win-ctrl-btn win-close" type="button" tabindex="-1" title="Close">✕</button>
        </div>
      </div>

      <!-- Realistic Desktop Application Body -->
      <div class="desktop-window-body" id="preview-window-body-${app.id}">
        ${this.renderAppDesktopMockup(app)}
      </div>

      <!-- Windows Native Status Bar (Clean, Zero Download Buttons) -->
      <div class="desktop-preview-statusbar">
        <div class="statusbar-left">
          <span class="statusbar-dot"></span>
          <span>Ready · Hardware Acceleration (DirectX 12 / Vulkan) · 0 KB network</span>
        </div>
        <div class="statusbar-right">
          <span>Memory: 24.8 MB</span>
          <span class="statusbar-divider">|</span>
          <span>UTF-8</span>
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
    return `
    <header class="portal-header" role="banner">
      <div class="portal-header-inner">
        <a class="portal-brand" href="#" aria-label="meCrafts home">
          <div class="portal-brand-emblem" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
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
            <span class="portal-brand-tag">${this.t.brandSubtitle}</span>
          </div>
        </a>

        <nav class="portal-nav" aria-label="Portal navigation">
          <a href="#apps-grid" class="portal-nav-link">Apps</a>
          <a href="#manifesto" class="portal-nav-link">Privacy</a>
          <a href="#specs" class="portal-nav-link">Specs</a>
          ${!this.currentSession ? `
            <button type="button" class="portal-nav-link portal-nav-auth btn-trigger-auth" id="btn-open-auth" aria-label="${this.t.signInBtn}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <span>${this.t.signInBtn}</span>
            </button>
          ` : ''}
          <a href="https://github.com/methastrategy/meCraft" target="_blank" rel="noopener noreferrer" class="portal-nav-link portal-nav-github" aria-label="GitHub Repository">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.63-5.373-12-12-12z"/></svg>
            GitHub
          </a>
        </nav>

        <div class="portal-header-actions">
          ${this.currentSession ? `
            <div class="user-profile-pill" id="user-profile-pill">
              <div class="user-avatar" aria-hidden="true">${escapeHtml((this.currentSession.user.fullName || this.currentSession.user.email).charAt(0).toUpperCase())}</div>
              <div class="user-details">
                <span class="user-email" title="${escapeHtml(this.currentSession.user.email)}">${escapeHtml(this.currentSession.user.email)}</span>
                <span class="user-tier-badge ${getTierBadge(this.currentSession.user.tier).isPro ? 'badge-pro' : 'badge-free'}">
                  ${getTierBadge(this.currentSession.user.tier).label}
                </span>
              </div>
              <button class="btn-signout" id="btn-signout" title="${this.lang === 'en' ? 'Sign Out' : 'ออกจากระบบ'}" aria-label="Sign Out">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              </button>
            </div>
          ` : ''}
          <button class="portal-lang-btn" id="btn-lang" aria-label="Switch language">
            ${this.lang === 'en' ? '🇹🇭 TH' : '🇬🇧 EN'}
          </button>
          <a href="${SUITE_DOWNLOAD_URL}" download="meCraft-Setup.exe" class="portal-cta-btn portal-cta-btn-sm" id="header-cta" title="${this.lang === 'th' ? 'ดาวน์โหลดตัวติดตั้ง meCraft Suite สำหรับ Windows (14.8 MB)' : 'Download meCraft Suite Installer for Windows (14.8 MB)'}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span>${this.lang === 'th' ? 'ดาวน์โหลด .exe' : 'Download .exe'}</span>
          </a>
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
        <div class="hero-pill" aria-label="Suite version">${this.t.appsCount} · v1.0.0 · Windows</div>
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
        <div class="hero-ctas">
          <a href="#apps-grid" class="hero-cta-primary" id="hero-cta-explore">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            <span>${this.lang === 'th' ? 'สำรวจ 10 สตูดิโอ & ดูพรีวิวสด' : 'Explore All 10 Studios & Live Preview'}</span>
          </a>
          <div class="hero-topright-hint">
            <span class="hero-hint-arrow" aria-hidden="true">↗</span>
            <span>${this.lang === 'th' ? 'ดาวน์โหลดตัวติดตั้งสำหรับ Windows ได้ที่มุมขวาบน' : 'Download Windows installer anytime from top-right corner'}</span>
          </div>
        </div>
        ${!this.currentSession ? `
          <div class="hero-member-bar">
            <span class="hero-member-label">${this.lang === 'en' ? 'Already have an account or desktop license?' : 'มีบัญชีสมาชิกหรือไลเซนส์เดสก์ท็อปแล้ว?'}</span>
            <button type="button" class="hero-member-link btn-trigger-auth" id="hero-btn-open-auth">
              <span>${this.t.signInBtn}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        ` : ''}
        <p class="hero-meta">Windows 10/11 64-bit · 100% In-Device Privacy · Zero Cloud Uploads · MIT License</p>
      </div>
    </section>`;
  }

  private renderFilterBar(): string {
    const filters: Array<{ key: AppCategory | 'all'; label: string }> = [
      { key: 'all', label: this.t.filterAll },
      { key: 'document', label: this.t.filterDocument },
      { key: 'photo', label: this.t.filterPhoto },
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

    return `
    <section class="portal-apps-section" id="apps-grid" aria-labelledby="apps-title">
      <div class="portal-section-inner">
        <div class="showcase-header">
          <div class="showcase-header-left">
            <div class="section-eyebrow" aria-hidden="true">10 CREATIVE &amp; DOCUMENT WORKSTATIONS</div>
            <h2 class="section-title" id="apps-title">${this.lang === 'th' ? 'คลังโปรแกรมสตูดิโอ &amp; พรีวิวแยกรายโปรแกรม' : 'Creative Workstation Studios &amp; Dedicated UI Previews'}</h2>
            <p class="section-subtitle">${this.lang === 'th' ? 'แสดงข้อมูลฟีเจอร์และสเปกโปรแกรมด้านซ้าย พร้อมหน้าต่างซอฟต์แวร์จริงบน Windows ด้านขวาแยกตามแต่ละโปรแกรม' : 'Explore detailed specifications on the left, with real-time native Windows desktop window previews on the right for each studio.'}</p>
          </div>
          <div class="showcase-header-pill">
            <span class="pulse-indicator"></span>
            <span>100% In-Device Memory · Zero-Cloud</span>
          </div>
        </div>

        <div class="showcase-strips-list" id="showcase-strips-list" role="list" aria-label="meCrafts application catalog">
          ${apps.length > 0 ? apps.map(app => this.renderProgramStrip(app)).join('') : `
            <div class="apps-empty" role="status">
              <div class="apps-empty-icon" aria-hidden="true">🔍</div>
              <p>${this.lang === 'en' ? 'No programs match your search.' : 'ไม่พบโปรแกรมที่ตรงกับการค้นหา'}</p>
            </div>
          `}
        </div>
      </div>
    </section>`;
  }

  private renderProgramStrip(app: ShowcaseApp): string {
    const isActive = app.status === 'active';
    const catLabel = app.categoryLabel[this.lang];
    const tagline = app.tagline[this.lang];
    const desc = app.description[this.lang];
    const engineText = app.enginePill ? app.enginePill[this.lang] : '100% In-Device Memory';
    const specsList = app.specs ? app.specs[this.lang] : [];

    return `
    <article class="program-strip ${isActive ? 'strip-active' : 'strip-indev'}" id="program-${app.id}" role="listitem" style="--strip-accent: ${app.accentColor}; --strip-glow: ${app.glowColor};">
      <div class="program-strip-inner">
        <!-- Left Column: Details & Technical Specifications -->
        <div class="program-strip-info">
          <div class="strip-info-header">
            <div class="strip-emblem" aria-hidden="true" style="background: radial-gradient(circle, ${app.glowColor} 0%, transparent 70%);">
              ${getAppIcon(app.icon, app.accentColor)}
            </div>
            <div class="strip-meta">
              <div class="strip-badges">
                <span class="strip-cat-badge" style="color: ${app.accentColor}; border-color: ${app.accentColor}40;">${catLabel}</span>
                <span class="strip-status-pill ${isActive ? 'status-active' : 'status-indev'}">
                  <span class="status-dot" aria-hidden="true"></span>
                  ${isActive ? this.t.statusActive : this.t.statusInDev}
                </span>
              </div>
              <span class="strip-version">${app.version}</span>
            </div>
          </div>

          <div class="strip-body">
            <h3 class="strip-name">${app.name}</h3>
            <p class="strip-tagline">${tagline}</p>
            <p class="strip-desc">${desc}</p>
            
            <div class="strip-engine-badge">
              <span>⚡</span>
              <span>${engineText}</span>
            </div>

            ${specsList.length > 0 ? `
              <div class="strip-specs-list" aria-label="Program specifications">
                ${specsList.map(s => `<span class="strip-spec-tag">✦ ${escapeHtml(s)}</span>`).join('')}
              </div>
            ` : ''}

            ${app.artcraftEquivalent ? `<p class="strip-equivalent" aria-label="Inspired by">✧ ${app.artcraftEquivalent}</p>` : ''}
          </div>
        </div>

        <!-- Right Column: True Live Desktop Window Mockup for this app -->
        <div class="program-strip-preview">
          ${this.renderDesktopPreviewInline(app)}
        </div>
      </div>
    </article>`;
  }

  // Alias for backward compatibility if any reference exists
  private renderAppCard(app: ShowcaseApp): string {
    return this.renderProgramStrip(app);
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
              <span class="manifesto-col-icon" aria-hidden="true">🔒</span>
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
          <a href="https://github.com/methastrategy/meCraft/releases" target="_blank" rel="noopener noreferrer" class="hero-cta-secondary">
            ${this.lang === 'en' ? 'View All Releases & Source on GitHub →' : 'ดูประวัติ Releases และ Source Code บน GitHub →'}
          </a>
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

  private attachListeners() {
    // If in desktop and unauthenticated, handle auth portal events
    if (this.bridge.isTauri() && !this.currentSession) {
      document.getElementById('tab-signin')?.addEventListener('click', () => {
        this.authTab = 'signin';
        this.authError = '';
        this.render();
        this.attachListeners();
      });

      document.getElementById('tab-signup')?.addEventListener('click', () => {
        this.authTab = 'signup';
        this.authError = '';
        this.render();
        this.attachListeners();
      });

      document.getElementById('btn-toggle-pwd')?.addEventListener('click', () => {
        const input = document.getElementById('auth-password') as HTMLInputElement | null;
        if (input) {
          input.type = input.type === 'password' ? 'text' : 'password';
        }
      });

      document.getElementById('auth-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = (document.getElementById('auth-email') as HTMLInputElement)?.value.trim();
        const pwd = (document.getElementById('auth-password') as HTMLInputElement)?.value;
        const fullName = (document.getElementById('auth-fullname') as HTMLInputElement)?.value.trim();

        if (!email || !pwd || pwd.length < 6) {
          this.authError = this.lang === 'en' ? 'Please provide a valid email and 6+ character password.' : 'กรุณากรอกอีเมลและรหัสผ่านอย่างน้อย 6 ตัวอักษร';
          this.render();
          this.attachListeners();
          return;
        }

        this.handleAuthSubmit(email, pwd, fullName);
      });

      document.getElementById('btn-auth-google')?.addEventListener('click', () => {
        this.handleGoogleAuth();
      });

      document.getElementById('btn-auth-demo')?.addEventListener('click', () => {
        const session = createMockAuthSession('demo.creator@mecraft.dev', 'free_member');
        saveAuthSession(session);
        this.currentSession = session;
        this.render();
        this.attachListeners();
      });

      document.getElementById('link-forgot-pwd')?.addEventListener('click', (e) => {
        e.preventDefault();
        const email = (document.getElementById('auth-email') as HTMLInputElement)?.value.trim();
        this.handlePasswordReset(email);
      });

      // Desktop Web Sync Import Drawer
      document.getElementById('btn-toggle-sync-import')?.addEventListener('click', () => {
        this.showSyncImport = !this.showSyncImport;
        const drawer = document.getElementById('sync-import-drawer');
        if (drawer) {
          drawer.style.display = this.showSyncImport ? 'flex' : 'none';
        }
      });

      document.getElementById('btn-submit-sync-code')?.addEventListener('click', () => {
        const code = (document.getElementById('input-sync-code') as HTMLInputElement)?.value.trim();
        if (!code) {
          this.authError = this.lang === 'en' ? 'Please paste a valid sync code.' : 'กรุณากรอกรหัสเชื่อมต่อ';
          this.render();
          this.attachListeners();
          return;
        }
        const session = importAuthSyncCode(code);
        if (session) {
          this.currentSession = session;
          this.render();
          this.attachListeners();
        } else {
          this.authError = this.lang === 'en' ? 'Invalid or expired sync code from meCrafts Web.' : 'รหัสเชื่อมต่อไม่ถูกต้องหรือหมดอายุแล้ว';
          this.render();
          this.attachListeners();
        }
      });

      return;
    }

    // Web Portal Auth Modal Open / Close
    document.querySelectorAll('.btn-trigger-auth, #btn-open-auth, #hero-btn-open-auth, #footer-btn-open-auth').forEach(btn => {
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

    // Sync to Desktop Modal Open / Close / Copy
    document.getElementById('btn-open-sync')?.addEventListener('click', () => {
      this.isSyncModalOpen = true;
      this.syncCodeCopied = false;
      this.render();
      this.attachListeners();
    });

    document.getElementById('btn-close-sync-modal')?.addEventListener('click', () => {
      this.isSyncModalOpen = false;
      this.render();
      this.attachListeners();
    });

    document.getElementById('modal-sync-backdrop')?.addEventListener('click', () => {
      this.isSyncModalOpen = false;
      this.render();
      this.attachListeners();
    });

    document.getElementById('btn-copy-sync-code')?.addEventListener('click', () => {
      const textarea = document.getElementById('display-sync-code') as HTMLTextAreaElement | null;
      if (textarea) {
        textarea.select();
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
          navigator.clipboard.writeText(textarea.value).then(() => {
            this.syncCodeCopied = true;
            const btn = document.getElementById('btn-copy-sync-code');
            if (btn) btn.textContent = this.lang === 'en' ? '✓ Copied to Clipboard!' : '✓ คัดลอกสำเร็จแล้ว!';
          }).catch(() => {
            // fallback
            document.execCommand('copy');
            this.syncCodeCopied = true;
            const btn = document.getElementById('btn-copy-sync-code');
            if (btn) btn.textContent = this.lang === 'en' ? '✓ Copied to Clipboard!' : '✓ คัดลอกสำเร็จแล้ว!';
          });
        }
      }
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
    document.getElementById('btn-signout')?.addEventListener('click', async () => {
      await this.handleSignOut();
    });

    // Language toggle
    document.getElementById('btn-lang')?.addEventListener('click', () => {
      this.lang = this.lang === 'en' ? 'th' : 'en';
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

    // Desktop App UI Preview Selection listeners
    this.bindCardSelection();
  }

  private bindCardSelection() {
    // Each program strip now displays its own dedicated desktop UI preview inline.
  }

  private selectApp(_appId: string) {
    // Deprecated: previews are shown inline inside each program strip.
  }

  private updateGrid() {
    const list = document.getElementById('showcase-strips-list');
    if (!list) return;
    const apps = this.filteredApps();

    list.innerHTML = apps.length > 0
      ? apps.map(app => this.renderProgramStrip(app)).join('')
      : `<div class="apps-empty" role="status">
           <div class="apps-empty-icon" aria-hidden="true">🔍</div>
           <p>${this.lang === 'en' ? 'No programs match your search.' : 'ไม่พบโปรแกรมที่ตรงกับการค้นหา'}</p>
         </div>`;
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
