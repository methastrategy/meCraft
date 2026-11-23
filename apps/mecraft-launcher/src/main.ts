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
}

const TRANSLATIONS: Record<'en' | 'th', PortalTranslations> = {
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
  },
};

const SUITE_DOWNLOAD_URL = 'https://github.com/methastrategy/meCraft/releases/download/v3.2.1/meCraft-Setup.exe';

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
    version: 'v3.2.1',
    exeName: 'mepdf.exe',
    exeSize: '~30.8 MB',
    downloadUrl: 'https://github.com/methastrategy/meCraft/releases/download/v3.2.1/mepdf.exe',
    suiteDownloadUrl: SUITE_DOWNLOAD_URL,
    accentColor: '#6366f1',
    glowColor: 'rgba(99,102,241,0.3)',
    icon: 'pdf',
    keywords: ['pdf', 'merge', 'split', 'compress', 'encrypt', 'ocr', 'aes', 'document'],
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
    version: 'v3.2.1',
    exeName: 'mephoto.exe',
    exeSize: '~22.7 MB',
    downloadUrl: 'https://github.com/methastrategy/meCraft/releases/download/v3.2.1/mephoto.exe',
    suiteDownloadUrl: SUITE_DOWNLOAD_URL,
    accentColor: '#06b6d4',
    glowColor: 'rgba(6,182,212,0.3)',
    icon: 'photo',
    keywords: ['photo', 'image', 'scanner', 'ocr', 'homography', 'perspective', 'color', 'restore'],
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
    version: 'v0.1.0',
    suiteDownloadUrl: SUITE_DOWNLOAD_URL,
    artcraftEquivalent: 'VectorCraft / Illustrator',
    accentColor: '#a855f7',
    glowColor: 'rgba(168,85,247,0.3)',
    icon: 'vector',
    keywords: ['vector', 'svg', 'bezier', 'illustration', 'path', 'node', 'icon', 'design'],
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
    version: 'v0.1.0',
    suiteDownloadUrl: SUITE_DOWNLOAD_URL,
    artcraftEquivalent: 'FilmCraft / Premiere Pro',
    accentColor: '#f59e0b',
    glowColor: 'rgba(245,158,11,0.3)',
    icon: 'film',
    keywords: ['video', 'film', 'timeline', 'edit', 'mp4', 'transition', 'cut', 'render'],
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
    version: 'v0.1.0',
    suiteDownloadUrl: SUITE_DOWNLOAD_URL,
    artcraftEquivalent: 'LightCraft / Lightroom',
    accentColor: '#10b981',
    glowColor: 'rgba(16,185,129,0.3)',
    icon: 'light',
    keywords: ['raw', 'lightroom', 'photo', 'color', 'grading', 'hdr', 'exposure', 'darkroom'],
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
    version: 'v0.1.0',
    suiteDownloadUrl: SUITE_DOWNLOAD_URL,
    artcraftEquivalent: 'EffectCraft / After Effects',
    accentColor: '#ec4899',
    glowColor: 'rgba(236,72,153,0.3)',
    icon: 'motion',
    keywords: ['motion', 'animation', 'keyframe', 'effects', 'vfx', 'typography', 'particle'],
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
    version: 'v0.1.0',
    suiteDownloadUrl: SUITE_DOWNLOAD_URL,
    artcraftEquivalent: 'DesignCraft / InDesign',
    accentColor: '#f97316',
    glowColor: 'rgba(249,115,22,0.3)',
    icon: 'design',
    keywords: ['layout', 'indesign', 'publish', 'magazine', 'print', 'cmyk', 'brochure', 'grid'],
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
    version: 'v0.1.0',
    suiteDownloadUrl: SUITE_DOWNLOAD_URL,
    artcraftEquivalent: 'SoundCraft / Audition',
    accentColor: '#84cc16',
    glowColor: 'rgba(132,204,22,0.3)',
    icon: 'audio',
    keywords: ['audio', 'sound', 'daw', 'podcast', 'noise', 'mastering', 'music', 'wav', 'mp3'],
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
    version: 'v0.1.0',
    suiteDownloadUrl: SUITE_DOWNLOAD_URL,
    artcraftEquivalent: 'WordCraft / Microsoft Word',
    accentColor: '#6366f1',
    glowColor: 'rgba(99,102,241,0.25)',
    icon: 'doc',
    keywords: ['markdown', 'word', 'document', 'latex', 'writing', 'typewriter', 'research', 'publish'],
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
    version: 'v0.1.0',
    suiteDownloadUrl: SUITE_DOWNLOAD_URL,
    artcraftEquivalent: '3DCraft / Blender',
    accentColor: '#06b6d4',
    glowColor: 'rgba(6,182,212,0.25)',
    icon: '3d',
    keywords: ['3d', 'blender', 'model', 'mesh', 'pbr', 'gltf', 'obj', 'spatial', 'scene'],
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

// ─── Main Portal Class ────────────────────────────────────────────────────────
class MeCraftsPortal {
  private lang: 'en' | 'th' = 'en';
  private searchQuery = '';
  private activeFilter: AppCategory | 'all' = 'all';
  private appEl!: HTMLElement;

  constructor() {
    this.appEl = document.getElementById('app')!;
    this.render();
    this.attachListeners();
  }

  private get t(): PortalTranslations {
    return TRANSLATIONS[this.lang];
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
          <a href="https://github.com/methastrategy/meCraft" target="_blank" rel="noopener noreferrer" class="portal-nav-link portal-nav-github" aria-label="GitHub Repository">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.63-5.373-12-12-12z"/></svg>
            GitHub
          </a>
        </nav>

        <div class="portal-header-actions">
          <button class="portal-lang-btn" id="btn-lang" aria-label="Switch language">
            ${this.lang === 'en' ? '🇹🇭 TH' : '🇬🇧 EN'}
          </button>
          <a href="${SUITE_DOWNLOAD_URL}" download="meCraft-Setup.exe" class="portal-cta-btn" id="header-cta">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            ${this.t.headerCta}
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
        <div class="hero-pill" aria-label="Suite version">${this.t.appsCount} · v3.2.1 · Windows</div>
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
          <a href="${SUITE_DOWNLOAD_URL}" download="meCraft-Setup.exe" class="hero-cta-primary" id="hero-cta-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            ${this.t.heroCta1}
          </a>
          <a href="#apps-grid" class="hero-cta-secondary">
            ${this.t.heroCta2}
          </a>
        </div>
        <p class="hero-meta">meCraft-Setup.exe · 14.8 MB · Windows 10/11 64-bit · MIT License</p>
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
        <div class="apps-grid" role="list" aria-label="meCrafts application catalog">
          ${apps.length > 0 ? apps.map(app => this.renderAppCard(app)).join('') : `
            <div class="apps-empty" role="status">
              <div class="apps-empty-icon" aria-hidden="true">🔍</div>
              <p>${this.lang === 'en' ? 'No programs match your search.' : 'ไม่พบโปรแกรมที่ตรงกับการค้นหา'}</p>
            </div>
          `}
        </div>
      </div>
    </section>`;
  }

  private renderAppCard(app: ShowcaseApp): string {
    const isActive = app.status === 'active';
    const catLabel = app.categoryLabel[this.lang];
    const tagline = app.tagline[this.lang];
    const desc = app.description[this.lang];
    return `
    <article class="app-card ${isActive ? 'app-card-active' : 'app-card-indev'}" role="listitem" style="--card-accent: ${app.accentColor}; --card-glow: ${app.glowColor};">
      <div class="app-card-header">
        <div class="app-card-emblem" aria-hidden="true" style="background: radial-gradient(circle, ${app.glowColor} 0%, transparent 70%);">
          ${getAppIcon(app.icon, app.accentColor)}
        </div>
        <div class="app-card-meta">
          <div class="app-card-badges">
            <span class="app-category-badge" style="color: ${app.accentColor}; border-color: ${app.accentColor}40;">${catLabel}</span>
            <span class="app-status-pill ${isActive ? 'status-active' : 'status-indev'}" aria-label="Status: ${isActive ? this.t.statusActive : this.t.statusInDev}">
              <span class="status-dot" aria-hidden="true"></span>
              ${isActive ? this.t.statusActive : this.t.statusInDev}
            </span>
          </div>
          <span class="app-version">${app.version}</span>
        </div>
      </div>

      <div class="app-card-body">
        <h3 class="app-name">${app.name}</h3>
        <p class="app-tagline">${tagline}</p>
        <p class="app-desc">${desc}</p>
        ${app.artcraftEquivalent ? `<p class="app-equivalent" aria-label="Inspired by">✦ ${app.artcraftEquivalent}</p>` : ''}
      </div>

      <div class="app-card-footer">
        ${isActive ? `
          <a href="${app.downloadUrl}" download="${app.exeName}" class="app-btn app-btn-primary" aria-label="Download ${app.name} ${app.exeName}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            ${this.t.btnDownloadExe}
            ${app.exeSize ? `<span class="app-btn-size">${app.exeSize}</span>` : ''}
          </a>
          <a href="${SUITE_DOWNLOAD_URL}" download="meCraft-Setup.exe" class="app-btn app-btn-secondary" aria-label="Download full meCraft Suite">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            ${this.t.btnDownloadSuite}
          </a>
        ` : `
          <a href="${SUITE_DOWNLOAD_URL}" download="meCraft-Setup.exe" class="app-btn app-btn-indev" aria-label="Download meCraft to get notified when ${app.name} launches">
            ${this.t.btnInDev}
          </a>
        `}
      </div>
    </article>`;
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
          <a href="${SUITE_DOWNLOAD_URL}" download="meCraft-Setup.exe" class="hero-cta-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            ${this.t.heroCta1}
          </a>
          <a href="https://github.com/methastrategy/meCraft/releases" target="_blank" rel="noopener noreferrer" class="hero-cta-secondary">
            ${this.lang === 'en' ? 'View All Releases on GitHub →' : 'ดู Releases ทั้งหมดบน GitHub →'}
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
          <a href="https://github.com/methastrategy/meCraft/releases" target="_blank" rel="noopener noreferrer" class="footer-link">Releases (v3.2.1)</a>
          <a href="https://github.com/methastrategy/meCraft/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" class="footer-link">MIT License</a>
          <a href="${SUITE_DOWNLOAD_URL}" download="meCraft-Setup.exe" class="footer-link footer-link-gold">⬇ Download meCraft-Setup.exe</a>
        </nav>
        <p class="footer-copy">${this.t.footerCopyright}</p>
      </div>
    </footer>`;
  }

  private attachListeners() {
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
  }

  private updateGrid() {
    const section = document.getElementById('apps-grid');
    if (!section) return;
    const grid = section.querySelector('.apps-grid');
    if (!grid) return;
    const apps = this.filteredApps();
    grid.innerHTML = apps.length > 0
      ? apps.map(app => this.renderAppCard(app)).join('')
      : `<div class="apps-empty" role="status">
           <div class="apps-empty-icon">🔍</div>
           <p>${this.lang === 'en' ? 'No programs match your search.' : 'ไม่พบโปรแกรมที่ตรงกับการค้นหา'}</p>
         </div>`;
  }
}

// ─── Boot ─────────────────────────────────────────────────────────────────────
// Re-export bridge utilities so tests that import from main.ts still compile.
export { getDefaultCatalog, createLauncherBridge, formatBytes, formatSpeed };
export type { AppCatalogItem, RecentProject, DownloadProgress };

new MeCraftsPortal();
