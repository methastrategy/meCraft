import fs from 'node:fs';
import path from 'node:path';

const mainTsPath = path.resolve('apps/mecraft-launcher/src/main.ts');
let content = fs.readFileSync(mainTsPath, 'utf8');

// 1. Update ShowcaseApp interface if needed
if (!content.includes('industryCounterpart?: { en: string; th: string };')) {
  const interfaceTarget = `export interface ShowcaseApp {
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
}`;

  const interfaceReplacement = `export interface ShowcaseApp {
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
  industryCounterpart?: { en: string; th: string };
  accentColor: string;
  glowColor: string;
  icon: string;
  keywords: string[];
  specs?: { en: string[]; th: string[] };
  enginePill?: { en: string; th: string };
  supportedFormats?: string[];
  shortcuts?: Array<{ key: string; action: { en: string; th: string } }>;
}`;
  content = content.replace(interfaceTarget, () => interfaceReplacement);
}

// 2. Update PORTAL_I18N
const i18nTarget = `    heroSubtitle: '100% Client-Side Local Execution. Zero-Cloud Uploads. Native Windows Desktop Engine. 11 Purpose-Built Creative Tools & Utilities — All Free, Forever.',
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
    filterAudio: 'Audio & 3D',`;

const i18nReplacement = `    heroSubtitle: '100% Client-Side Local Execution. Zero-Cloud Uploads. Native Windows Desktop Engine. 17 Purpose-Built Creative Tools & Utilities — All Free, Forever.',
    heroBadge1: '100% In-Device Privacy',
    heroBadge2: 'Zero Telemetry',
    heroBadge3: 'Open-Source',
    heroBadge4: 'Native Windows Performance',
    heroCta1: 'Download meCraft Suite for Windows',
    heroCta2: 'Explore All 17 Studios ↓',
    searchPlaceholder: 'Search programs, features, file types…',
    filterAll: 'All (17)',
    filterDocument: 'Document (4)',
    filterPhoto: 'Photo & Color (2)',
    filterUtility: 'Utility & REA (2)',
    filterVector: 'Vector & CAD (3)',
    filterVideo: 'Video & Motion (3)',
    filterAudio: '3D & Sound (4)',`;

content = content.replace(i18nTarget, () => i18nReplacement);

const i18nTargetTh = `    heroSubtitle: 'ประมวลผล 100% บนเครื่อง ไม่อัปโหลดไฟล์ไปที่ Cloud เครื่องยนต์ Windows Desktop จริง โปรแกรมสร้างสรรค์และเครื่องมือเฉพาะทาง 11 ตัว — ฟรีทั้งหมด ตลอดชีวิต',
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
    filterAudio: 'เสียงและ 3D',`;

const i18nReplacementTh = `    heroSubtitle: 'ประมวลผล 100% บนเครื่อง ไม่อัปโหลดไฟล์ไปที่ Cloud เครื่องยนต์ Windows Desktop จริง โปรแกรมสร้างสรรค์และเครื่องมือเฉพาะทาง 17 ตัว — ฟรีทั้งหมด ตลอดชีวิต',
    heroBadge1: 'ความเป็นส่วนตัว 100%',
    heroBadge2: 'ไม่มีการเก็บข้อมูล',
    heroBadge3: 'Open-Source',
    heroBadge4: 'ประสิทธิภาพ Windows จริง',
    heroCta1: 'ดาวน์โหลด meCraft Suite สำหรับ Windows',
    heroCta2: 'ดูโปรแกรมทั้ง 17 ตัว ↓',
    searchPlaceholder: 'ค้นหาโปรแกรม ฟีเจอร์ ประเภทไฟล์…',
    filterAll: 'ทั้งหมด (17)',
    filterDocument: 'เอกสาร (4)',
    filterPhoto: 'ภาพและสี (2)',
    filterUtility: 'เครื่องมือและ REA (2)',
    filterVector: 'เวกเตอร์และ CAD (3)',
    filterVideo: 'วิดีโอและโมชัน (3)',
    filterAudio: '3D และเสียง (4)',`;

content = content.replace(i18nTargetTh, () => i18nReplacementTh);

content = content.replace(/appsCount: '11 Apps',/g, () => "appsCount: '17 Apps',");
content = content.replace(/appsCount: '11 โปรแกรม',/g, () => "appsCount: '17 โปรแกรม',");

// 3. Update SHOWCASE_APPS with 18 apps
const newShowcaseApps = `export const SHOWCASE_APPS: ShowcaseApp[] = [
  {
    id: 'mepdf',
    name: 'mePDF Studio',
    category: 'document',
    categoryLabel: { en: 'Document', th: 'เอกสาร' },
    tagline: {
      en: 'Professional Client-Side PDF Engineering & Document Cockpit',
      th: 'สตูดิโอวิศวกรรมเอกสาร PDF ค็อกพิทจัดการหน้า บีบอัด และฉีด OCR ในเครื่อง',
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
    artcraftEquivalent: 'storytold/pdfcraft',
    industryCounterpart: { en: 'Adobe Acrobat Pro Alternative', th: 'ทางเลือกแทน Adobe Acrobat Pro' },
    accentColor: '#d4af37',
    glowColor: 'rgba(212,175,55,0.3)',
    icon: 'pdf',
    keywords: ['pdf', 'merge', 'split', 'compress', 'encrypt', 'ocr', 'aes', 'document'],
    enginePill: { en: '100% In-Device RAM · Tauri v2 Native', th: 'ประมวลผลบน RAM 100% · Tauri v2 Native' },
    supportedFormats: ['PDF', 'TIFF', 'PNG', 'JPG', 'TXT'],
    shortcuts: [
      { key: 'Ctrl + O', action: { en: 'Open PDF', th: 'เปิดไฟล์ PDF' } },
      { key: 'Ctrl + S', action: { en: 'Save Document', th: 'บันทึกเอกสาร' } },
      { key: 'Ctrl + R', action: { en: 'Rotate Page 90°', th: 'หมุนหน้า 90 องศา' } },
      { key: 'Ctrl + Shift + C', action: { en: 'Compress PDF', th: 'บีบอัดไฟล์ PDF' } },
    ],
    specs: {
      en: [
        '4-Point Deskew & Local Otsu Binarization',
        'Lossless Deflate & Scanned PDF Compression',
        'Client-Side Searchable OCR Text Injection',
        'AES-256 Bank-Grade Encryption & Sanitization',
        'Visual Page Cockpit: Drag, Split, Merge',
      ],
      th: [
        'ปรับระนาบ 4-Point Deskew & ลบเงา Otsu ท้องถิ่น',
        'บีบอัดเอกสาร Lossless Deflate สูงสุด 90%',
        'ฝังข้อความ OCR ค้นหาคำได้ในเครื่อง 100%',
        'เข้ารหัสความปลอดภัยระดับธนาคาร AES-256',
        'จัดระเบียบหน้า ลากสลับ/แยก/รวมไฟล์อิสระ',
      ],
    },
  },
  {
    id: 'mephoto',
    name: 'mePhoto Studio',
    category: 'photo',
    categoryLabel: { en: 'Photo & Color', th: 'ภาพและสี' },
    tagline: {
      en: 'CamScanner-Grade Document Restoration & Perspective Photo Lab',
      th: 'ห้องปฏิบัติการตกแต่งภาพถ่าย กู้คืนเอกสาร และปรับระนาบมุมมอง',
    },
    description: {
      en: '4-point homography perspective deskew, adaptive local Otsu binarization shadow eradication, Magic Color document enhancement, and 16-bit RAW darkroom.',
      th: 'ปรับมุมมอง 4 จุด Homography, กำจัดเงาด้วย Otsu Binarization ท้องถิ่น, เพิ่มความสวยงามเอกสารด้วย Magic Color และ Darkroom ปรับ RAW 16-bit',
    },
    status: 'active',
    version: 'v1.0.0',
    exeName: 'mephoto.exe',
    exeSize: '~22.7 MB',
    downloadUrl: 'https://github.com/methastrategy/meCraft/releases/download/v1.0.0/mephoto.exe',
    suiteDownloadUrl: SUITE_DOWNLOAD_URL,
    artcraftEquivalent: 'storytold/photocraft',
    industryCounterpart: { en: 'Adobe Photoshop Alternative', th: 'ทางเลือกแทน Adobe Photoshop' },
    accentColor: '#10b981',
    glowColor: 'rgba(16,185,129,0.3)',
    icon: 'photo',
    keywords: ['photo', 'image', 'scanner', 'ocr', 'homography', 'perspective', 'color', 'restore', 'raw'],
    enginePill: { en: 'WebAssembly OpenCV · Hardware GPU', th: 'WebAssembly OpenCV · GPU เร่งความเร็ว' },
    supportedFormats: ['RAW', 'DNG', 'PSD', 'PNG', 'JPG', 'WEBP'],
    shortcuts: [
      { key: 'V', action: { en: 'Move / Selection Tool', th: 'เครื่องมือเลือกและย้าย' } },
      { key: 'C', action: { en: 'Perspective Crop', th: 'ตัดครอปปรับมุมมอง' } },
      { key: 'B', action: { en: 'Retouch Brush', th: 'แปรงตกแต่งภาพ' } },
      { key: 'Ctrl + J', action: { en: 'Duplicate Layer', th: 'คัดลอกเลเยอร์' } },
    ],
    specs: {
      en: [
        '4-Point Homography Perspective Correction',
        'Adaptive Local Otsu Shadow Eradication',
        'Magic Color Document Photo Enhancement',
        '16-Bit RAW / DNG Digital Darkroom',
        'Batch Multi-Document Scan Restoration',
      ],
      th: [
        'ดึงภาพถ่ายเอียงให้ตรงระนาบ 4-Point Homography',
        'กำจัดเงาดำบนกระดาษด้วย Adaptive Otsu',
        'เร่งความสดใสและคมชัดด้วย Magic Color',
        'ห้องมืดตกแต่งภาพ RAW 16-Bit ไม่สูญเสียคุณภาพ',
        'แต่งภาพและกู้เอกสารพร้อมกันแบบชุด',
      ],
    },
  },
  {
    id: 'medrop',
    name: 'meDrop Radial Converter',
    category: 'utility',
    categoryLabel: { en: 'Utility & REA', th: 'เครื่องมือและ REA' },
    tagline: {
      en: 'Zero-Window Radial Drag & Drop File Converter HUD',
      th: 'วงแหวนแปลงไฟล์เรเดียลรอบเคอร์เซอร์เมาส์ ลากวางแปลงทันทีใน RAM',
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
    artcraftEquivalent: 'storytold/craft-anything',
    industryCounterpart: { en: 'Zero-Window Radial Converter HUD', th: 'วงแหวนเรเดียลแปลงไฟล์ใน RAM ทันที' },
    accentColor: '#06b6d4',
    glowColor: 'rgba(6,182,212,0.3)',
    icon: 'drop',
    keywords: ['drop', 'convert', 'radial', 'donut', 'hud', 'converter', 'drag', 'zero-window', 'local-first'],
    enginePill: { en: 'Zero-Window HUD · Low-Latency Rust Hook', th: 'Zero-Window HUD · Rust Hook ความเร็วสูง' },
    supportedFormats: ['PDF', 'PNG', 'JPG', 'WEBP', 'SVG', 'MD', 'DOCX'],
    shortcuts: [
      { key: 'Ctrl + Drag', action: { en: 'Trigger Radial HUD', th: 'เปิดวงแหวนรอบเคอร์เซอร์' } },
      { key: 'Esc', action: { en: 'Dismiss HUD', th: 'ปิดวงแหวนทันที' } },
      { key: '1 - 8', action: { en: 'Quick Slice Select', th: 'เลือกช่องแปลงไฟล์ด่วน' } },
    ],
    specs: {
      en: [
        'Native Windows Low-Level Mouse & Keyboard Hook',
        'Dynamic SVG Radial Arc HUD with 120fps Spring Physics',
        'Client-Side RAM In-Place Conversion (No Cloud)',
        'Context-Aware Smart Format Filtering by Extension',
        'Cross-App Studio Gateway via ClipBus Memory Pipeline',
      ],
      th: [
        'Native Windows Low-Level Hook ดักจับเมาส์ความเร็วสูง',
        'วงแหวนเรขาคณิต SVG Donut แอนิเมชัน 120fps ลื่นไหล',
        'แปลงไฟล์ใน RAM บันทึกข้างไฟล์เดิม ไม่แตะ Cloud',
        'กรอง Format ปลายทางอัตโนมัติตามนามสกุลไฟล์',
        'ส่งต่อไฟล์เข้า mePDF / mePhoto ด้วย ClipBus Pipeline',
      ],
    },
  },
  {
    id: 'medoc',
    name: 'meDoc Studio',
    category: 'document',
    categoryLabel: { en: 'Document', th: 'เอกสาร' },
    tagline: {
      en: 'Distraction-Free Markdown Typewriter & KaTeX Studio',
      th: 'โปรแกรมพิมพ์งานไร้สิ่งรบกวน Markdown, สมการ KaTeX และผัง Mermaid สด',
    },
    description: {
      en: 'Distraction-free typography, split-view real-time Markdown, live KaTeX LaTeX equations, inline Mermaid diagrams, and instant zero-cloud PDF/DOCX generation.',
      th: 'ตัวพิมพ์ไร้สิ่งรบกวน, หน้าต่างแยกซ้าย-ขวาพิมพ์ Markdown และสมการ KaTeX สด, ไดอะแกรม Mermaid เวกเตอร์ และสร้างเอกสารสิ่งพิมพ์ PDF/DOCX ในเครื่อง 100%',
    },
    status: 'active',
    version: 'v1.0.0',
    exeName: 'meDoc.exe',
    exeSize: '~19.2 MB',
    downloadUrl: 'https://github.com/methastrategy/meCraft/releases/download/v1.0.0/meDoc.exe',
    suiteDownloadUrl: SUITE_DOWNLOAD_URL,
    artcraftEquivalent: 'storytold/wordcraft',
    industryCounterpart: { en: 'Microsoft Word / Typora Alternative', th: 'ทางเลือกแทน Typora และ Microsoft Word' },
    accentColor: '#0d9488',
    glowColor: 'rgba(13,148,136,0.3)',
    icon: 'doc',
    keywords: ['markdown', 'word', 'document', 'latex', 'writing', 'typewriter', 'katex', 'mermaid', 'pdf'],
    enginePill: { en: 'Client-Side Markdown · KaTeX Math · Mermaid', th: 'Markdown ในเครื่อง 100% · สมการ KaTeX · ไดอะแกรม Mermaid' },
    supportedFormats: ['MD', 'MARKDOWN', 'PDF', 'DOCX', 'TXT'],
    shortcuts: [
      { key: 'Ctrl + B', action: { en: 'Bold Text', th: 'ตัวหนา' } },
      { key: 'Ctrl + I', action: { en: 'Italic Text', th: 'ตัวเอียง' } },
      { key: 'Ctrl + K', action: { en: 'Insert Link', th: 'แทรกลิงก์' } },
      { key: 'Ctrl + Shift + M', action: { en: 'Insert Math Block', th: 'แทรกสมการคณิตศาสตร์' } },
    ],
    specs: {
      en: [
        'Split-View Real-Time Markdown & KaTeX Engine',
        'Inline Mermaid Vector Diagrams & Syntax Highlighting',
        'Distraction-Free Zen Fullscreen Focus Mode',
        'Client-Side Instant PDF Publishing via pdf-lib',
        'Local-First Vault & Dynamic Outline Heading Jump',
      ],
      th: [
        'หน้าต่างแยกซ้าย-ขวาพิมพ์ Markdown และ KaTeX สด',
        'เรนเดอร์ Mermaid ไดอะแกรมเวกเตอร์และเน้นสีโค้ด',
        'โหมด Zen ไร้สิ่งรบกวนเขียนงานสบายตาระดับสมาธิ',
        'สร้าง PDF สิ่งพิมพ์ในหน่วยความจำเครื่องผ่าน pdf-lib',
        'ระบบจัดเก็บไฟล์ในเครื่องและกระโดดตามหัวข้อ Outline',
      ],
    },
  },
  {
    id: 'mevector',
    name: 'meVector Studio',
    category: 'vector',
    categoryLabel: { en: 'Vector & CAD', th: 'เวกเตอร์และ CAD' },
    tagline: {
      en: 'Precision Bézier Vector Illustration & SVG Studio',
      th: 'สตูดิโอวาดภาพเวกเตอร์ Bézier ความแม่นยำสูง และส่งออก SVG/PDF สะอาด',
    },
    description: {
      en: 'Resolution-independent path editing, node manipulation, boolean vector geometry, and SVG/PDF icon workbench.',
      th: 'แก้ไขเส้นพาธอิสระจากความละเอียด, ดัดแปลง Node, ตรรกะเวกเตอร์ Boolean และ Workbench ไอคอน SVG/PDF',
    },
    status: 'active',
    version: 'v1.0.0',
    suiteDownloadUrl: SUITE_DOWNLOAD_URL,
    artcraftEquivalent: 'storytold/vectorcraft',
    industryCounterpart: { en: 'Adobe Illustrator Alternative', th: 'ทางเลือกแทน Adobe Illustrator' },
    accentColor: '#3b82f6',
    glowColor: 'rgba(59,130,246,0.3)',
    icon: 'vector',
    keywords: ['vector', 'svg', 'bezier', 'illustration', 'path', 'node', 'icon', 'design'],
    enginePill: { en: 'Precision Bézier Engine · SVG 2.0', th: 'เครื่องยนต์ Bézier ความแม่นยำสูง · SVG 2.0' },
    supportedFormats: ['SVG', 'AI', 'EPS', 'PDF', 'DXF'],
    shortcuts: [
      { key: 'V', action: { en: 'Selection Tool', th: 'เครื่องมือเลือกทั่วไป' } },
      { key: 'A', action: { en: 'Direct Selection Tool', th: 'เครื่องมือเลือกจุด Node' } },
      { key: 'P', action: { en: 'Bézier Pen Tool', th: 'ปากกาวาดเส้นพาธ' } },
      { key: 'Shift + M', action: { en: 'Shape Builder', th: 'สร้างรูปทรงตัดรวม' } },
    ],
    specs: {
      en: [
        'Resolution-Independent Bézier Splines',
        'Sub-Pixel Node & Tangent Manipulation',
        'Boolean Geometry (Unite, Minus, Intersect)',
        'Clean SVG 2.0 & Vector PDF Exporter',
        'Hardware-Accelerated Path Tessellation',
      ],
      th: [
        'วาดเส้น Bézier คมชัดทุกระดับความละเอียด',
        'ดัดแปลง Node ปรับแขนความโค้งแม่นยำ',
        'ตรรกะรูปทรง Boolean รวม/ตัด/เจาะรู',
        'ส่งออก SVG 2.0 และ PDF Vector ไม่แตก',
        'เรนเดอร์เส้นพาธด้วย GPU ความเร็วสูง',
      ],
    },
  },
  {
    id: 'me3d',
    name: 'me3D Studio',
    category: 'audio',
    categoryLabel: { en: '3D & Sound', th: '3D และเสียง' },
    tagline: {
      en: 'Spatial 3D Modeling, Scene Lighting & Geometry Workbench',
      th: 'ปั้นโมเดลโพลีกอน 3 มิติ, จัดวางวัสดุ PBR และแสงสตูดิโอ HDRI แบบเรียลไทม์',
    },
    description: {
      en: 'Polygon mesh modeling, PBR material staging, real-time spatial previews, and GLTF/OBJ asset export.',
      th: 'โมเดลตาข่าย Polygon, จัดวาง PBR Material, Preview เชิงพื้นที่แบบ Real-time และส่งออก GLTF/OBJ',
    },
    status: 'active',
    version: 'v1.0.0',
    suiteDownloadUrl: SUITE_DOWNLOAD_URL,
    artcraftEquivalent: 'storytold/3dcraft',
    industryCounterpart: { en: 'Blender 3D Alternative', th: 'ทางเลือกแทน Blender 3D' },
    accentColor: '#6366f1',
    glowColor: 'rgba(99,102,241,0.3)',
    icon: '3d',
    keywords: ['3d', 'blender', 'model', 'mesh', 'pbr', 'gltf', 'obj', 'spatial', 'scene'],
    enginePill: { en: 'WebGPU Spatial · PBR Material Lab', th: 'มิติพื้นที่ WebGPU · ห้องทดลอง PBR Material' },
    supportedFormats: ['GLTF', 'GLB', 'OBJ', 'STL', 'FBX', 'USDZ'],
    shortcuts: [
      { key: 'Tab', action: { en: 'Toggle Edit Mode', th: 'สลับโหมดปั้นโมเดล' } },
      { key: 'G', action: { en: 'Translate / Grab', th: 'ย้ายตำแหน่งวัตถุ' } },
      { key: 'R', action: { en: 'Rotate', th: 'หมุนวัตถุ' } },
      { key: 'S', action: { en: 'Scale', th: 'ย่อขยายขนาด' } },
    ],
    specs: {
      en: [
        'Subdivision Polygon Mesh Modeling Workbench',
        'PBR Metallic/Roughness Material Staging',
        'Real-Time HDRI Environmental Scene Lighting',
        'GLTF 2.0, OBJ & STL 3D Print Geometry Export',
        'Hardware WebGPU Spatial Viewport Gizmo',
      ],
      th: [
        'ปั้นโมเดลโพลีกอน Polygon Mesh ความแม่นยำสูง',
        'จัดวางพื้นผิววัสดุ PBR เสมือนจริง',
        'จำลองแสงสตูดิโอและแสง HDRI แบบเรียลไทม์',
        'ส่งออกไฟล์สำหรับ 3D Print และเกม (GLTF/OBJ/STL)',
        'Viewport 3 มิติเร่งความเร็วด้วย WebGPU',
      ],
    },
  },
  {
    id: 'mefilm',
    name: 'meFilm Studio',
    category: 'video',
    categoryLabel: { en: 'Video & Motion', th: 'วิดีโอและโมชัน' },
    tagline: {
      en: 'Multi-Track Timeline Video Editor & Lossless Slicer',
      th: 'ตัดต่อวิดีโอหลายเลเยอร์ Non-Linear, ใส่ Transition และเรนเดอร์ MP4 ด่วน',
    },
    description: {
      en: 'Non-linear multi-layer video cutting, transitions, hardware-accelerated MP4 rendering, and clip sequencing.',
      th: 'ตัดต่อวิดีโอ Non-linear หลายเลเยอร์, Transition, เรนเดอร์ MP4 เร่งด้วย Hardware และจัดลำดับ Clip',
    },
    status: 'active',
    version: 'v1.0.0',
    suiteDownloadUrl: SUITE_DOWNLOAD_URL,
    artcraftEquivalent: 'storytold/filmcraft',
    industryCounterpart: { en: 'Adobe Premiere Pro Alternative', th: 'ทางเลือกแทน Adobe Premiere Pro' },
    accentColor: '#ef4444',
    glowColor: 'rgba(239,68,68,0.3)',
    icon: 'film',
    keywords: ['video', 'film', 'timeline', 'edit', 'mp4', 'transition', 'cut', 'render'],
    enginePill: { en: 'Hardware NVENC / QuickSync MP4', th: 'ฮาร์ดแวร์เรนเดอร์ NVENC / QuickSync' },
    supportedFormats: ['MP4', 'MOV', 'WEBM', 'MKV', 'WAV', 'AAC'],
    shortcuts: [
      { key: 'C', action: { en: 'Razor / Cut Tool', th: 'เครื่องมือใบมีดตัดคลิป' } },
      { key: 'V', action: { en: 'Selection Tool', th: 'เครื่องมือเลือกคลิป' } },
      { key: 'Space', action: { en: 'Play / Pause Timeline', th: 'เล่น / หยุดไทม์ไลน์' } },
      { key: 'J / K / L', action: { en: 'Shuttle Playback', th: 'ย้อนหลัง / หยุด / กรอไปข้างหน้า' } },
    ],
    specs: {
      en: [
        'Multi-Track Non-Linear Timeline Slicer',
        'Lossless Keyframe Trimming Without Re-encode',
        'GPU Hardware-Accelerated 4K MP4 Export',
        'Multi-Layer Transitions & Color LUTs',
        'Multi-Audio Track Mixing & Waveforms',
      ],
      th: [
        'ตัดต่อวิดีโอหลายแทร็กบนไทม์ไลน์อิสระ',
        'ตัดซอยคลิปตาม Keyframe โดยไม่เสียคุณภาพ',
        'เรนเดอร์ 4K MP4 ด้วยฮาร์ดแวร์ GPU',
        'ใส่ทรานซิชันและเกรดสีภาพยนตร์ด้วย LUTs',
        'ซิงค์แทร็กเสียงหลายช่องสัญญาณ',
      ],
    },
  },
  {
    id: 'melight',
    name: 'meLight Studio',
    category: 'photo',
    categoryLabel: { en: 'Photo & Color', th: 'ภาพและสี' },
    tagline: {
      en: 'HDR Tone Mapping, Parametric Exposure & RAW Photo Grade Lab',
      th: 'ปรับแต่งภาพถ่าย RAW, ปรับแสง Parametric Exposure และ Tone Mapping HDR',
    },
    description: {
      en: 'High dynamic range tone-mapping, exposure calibration, parametric curves, and batch photography grading.',
      th: 'Tone-mapping HDR, ปรับ Exposure, Curves แบบ Parametric และ Grade ภาพถ่ายแบบ Batch',
    },
    status: 'active',
    version: 'v1.0.0',
    suiteDownloadUrl: SUITE_DOWNLOAD_URL,
    artcraftEquivalent: 'storytold/lightcraft',
    industryCounterpart: { en: 'Adobe Lightroom Alternative', th: 'ทางเลือกแทน Adobe Lightroom' },
    accentColor: '#eab308',
    glowColor: 'rgba(234,179,8,0.3)',
    icon: 'light',
    keywords: ['raw', 'lightroom', 'photo', 'color', 'grading', 'hdr', 'exposure', 'darkroom'],
    enginePill: { en: '16-Bit RAW Pipeline · Non-Destructive', th: 'ไพป์ไลน์ RAW 16-Bit · ปรับสีไม่ทำลายภาพ' },
    supportedFormats: ['RAW', 'CR2', 'NEF', 'ARW', 'DNG', 'TIFF'],
    shortcuts: [
      { key: 'D', action: { en: 'Develop Module', th: 'เข้าสู่โหมดแต่งภาพ' } },
      { key: 'G', action: { en: 'Grid Thumbnail View', th: 'ดูภาพรวมแบบตารางกริด' } },
      { key: 'Y', action: { en: 'Before / After View', th: 'เปรียบเทียบก่อนและหลัง' } },
      { key: 'Ctrl + Shift + C', action: { en: 'Copy Settings Recipe', th: 'คัดลอกสูตรการปรับแต่ง' } },
    ],
    specs: {
      en: [
        'High Dynamic Range (HDR) Tone-Mapping',
        'Parametric RGB Curves & Exposure Calibration',
        'Zero-Loss Demosaicing & Sensor Profiles',
        'HSL Selective Color Adjustment Wheels',
        'Instant Recipe Presets & Batch Grading',
      ],
      th: [
        'เกลี่ยแสงมืด/สว่างด้วย HDR Tone-Mapping',
        'ปรับ Parametric RGB Curves และแสงละเอียด',
        'ถอดรหัสเซนเซอร์ภาพ RAW 16-Bit ไร้ Noise',
        'วงล้อปรับสี HSL แยกรายเฉดสีอย่างแม่นยำ',
        'บันทึกสูตร Preset และคัดลอกโทนสีแบบชุด',
      ],
    },
  },
  {
    id: 'memotion',
    name: 'meMotion Studio',
    category: 'video',
    categoryLabel: { en: 'Video & Motion', th: 'วิดีโอและโมชัน' },
    tagline: {
      en: 'Keyframe Motion Graphics, Kinetic Typography & Particle VFX',
      th: 'แอนิเมชันกราฟิกเคลื่อนไหว Keyframe, ตัวอักษร Kinetic และเอฟเฟกต์อนุภาค',
    },
    description: {
      en: 'Timeline-based layer motion, kinetic typography, particle presets, and vector path animation.',
      th: 'โมชัน Layer บน Timeline, ตัวอักษรเคลื่อนไหว, Preset อนุภาค และแอนิเมชันเส้นพาธเวกเตอร์',
    },
    status: 'active',
    version: 'v1.0.0',
    suiteDownloadUrl: SUITE_DOWNLOAD_URL,
    artcraftEquivalent: 'storytold/effectcraft',
    industryCounterpart: { en: 'Adobe After Effects Alternative', th: 'ทางเลือกแทน Adobe After Effects' },
    accentColor: '#a855f7',
    glowColor: 'rgba(168,85,247,0.3)',
    icon: 'motion',
    keywords: ['motion', 'animation', 'keyframe', 'effects', 'vfx', 'typography', 'particle'],
    enginePill: { en: 'Kinetic Motion · 120fps Easing Graph', th: 'กราฟิกเคลื่อนไหว · กราฟ Easing 120fps' },
    supportedFormats: ['MP4', 'WEBM', 'LOTTIE', 'JSON', 'GIF', 'APNG'],
    shortcuts: [
      { key: 'U', action: { en: 'Show Keyframe Properties', th: 'แสดงคุณสมบัติที่มีคีย์เฟรม' } },
      { key: 'F9', action: { en: 'Easy Ease Keyframes', th: 'ปรับคีย์เฟรมให้สมูท' } },
      { key: 'P / S / R', action: { en: 'Position / Scale / Rotation', th: 'เปิดตำแหน่ง / ย่อขยาย / การหมุน' } },
      { key: 'Ctrl + D', action: { en: 'Duplicate Layer', th: 'คัดลอกเลเยอร์โมชัน' } },
    ],
    specs: {
      en: [
        'Timeline-Based Layer Keyframe Motion',
        'Kinetic Typography & Text Motion Presets',
        'Physics-Driven 2D Particle System',
        'Vector Path Morphing & Easing Graph Editor',
        'Alpha Channel Transparent Video Export',
      ],
      th: [
        'แอนิเมชันเลเยอร์บนไทม์ไลน์ด้วย Keyframe',
        'ตัวอักษรเคลื่อนไหว Kinetic Typography สำเร็จรูป',
        'เอฟเฟกต์อนุภาค Particle จำลองฟิสิกส์',
        'ดัดรูปทรงเวกเตอร์ Morphing พร้อมกราฟ Easing',
        'ส่งออกวิดีโอพื้นหลังโปร่งใส Alpha Channel',
      ],
    },
  },
  {
    id: 'medesign',
    name: 'meDesign Studio',
    category: 'vector',
    categoryLabel: { en: 'Vector & CAD', th: 'เวกเตอร์และ CAD' },
    tagline: {
      en: 'Desktop Publishing, Editorial Layout & Print Pre-flight',
      th: 'ออกแบบ UI/UX Prototyping, ระบบ Design System และจัดวางหน้ากระดาษสิ่งพิมพ์',
    },
    description: {
      en: 'Grid-based page layout for magazines, multi-page posters, brochures, and CMYK print PDF export.',
      th: 'จัดวางหน้าบนกริดสำหรับนิตยสาร, โปสเตอร์หลายหน้า, โบรชัวร์ และส่งออก PDF สี CMYK',
    },
    status: 'active',
    version: 'v1.0.0',
    suiteDownloadUrl: SUITE_DOWNLOAD_URL,
    artcraftEquivalent: 'storytold/designcraft',
    industryCounterpart: { en: 'Adobe InDesign Alternative', th: 'ทางเลือกแทน Adobe InDesign' },
    accentColor: '#f97316',
    glowColor: 'rgba(249,115,22,0.3)',
    icon: 'design',
    keywords: ['layout', 'indesign', 'publish', 'magazine', 'print', 'cmyk', 'brochure', 'grid'],
    enginePill: { en: 'Modular Grid · CMYK Print Pre-Flight', th: 'โมดูลาร์กริด · ตรวจสอบงานพิมพ์ CMYK' },
    supportedFormats: ['INDD', 'IDML', 'PDF/X', 'EPS', 'SVG'],
    shortcuts: [
      { key: 'T', action: { en: 'Type / Text Frame Tool', th: 'เครื่องมือสร้างกรอบข้อความ' } },
      { key: 'W', action: { en: 'Toggle Print Preview Mode', th: 'สลับโหมดพรีวิวงานพิมพ์' } },
      { key: 'Ctrl + D', action: { en: 'Place Image / Asset', th: 'วางภาพและกราฟิก' } },
      { key: 'Ctrl + B', action: { en: 'Text Frame Options', th: 'ตั้งค่าคอลัมน์ข้อความ' } },
    ],
    specs: {
      en: [
        '12-Column Modular Editorial Grid Engine',
        'CMYK FOGRA39 & Swatch Color Profiles',
        'Master Pages & Linked Flow Text Frames',
        'Print Bleed, Margins & Slug Management',
        'Standards-Compliant PDF/X-1a Publishing',
      ],
      th: [
        'จัดเลย์เอาต์สิ่งพิมพ์บน Modular Grid 12 คอลัมน์',
        'โปรไฟล์สีมาตรฐานงานพิมพ์ CMYK FOGRA39',
        'ระบบ Master Pages และเฟรมข้อความเชื่อมต่อกัน',
        'คุมระยะตัดตก Bleed และขอบกระดาษพิมพ์',
        'ส่งออกไฟล์งานพิมพ์มาตรฐานสากล PDF/X-1a',
      ],
    },
  },
  {
    id: 'meaudio',
    name: 'meAudio Studio',
    category: 'audio',
    categoryLabel: { en: '3D & Sound', th: '3D และเสียง' },
    tagline: {
      en: 'Speech Master, Spectral Denoise & Multi-Track Podcast Audio Studio',
      th: 'มาสเตอร์เสียงพูด, ตัดเสียงรบกวน Spectral และตัดต่อพอดแคสต์หลายไมค์',
    },
    description: {
      en: 'Voice track mastering, spectral noise reduction, podcast multi-mic editing, and lossy/lossless audio export.',
      th: 'Master เสียงพูด, ลด Noise แบบ Spectral, ตัดต่อ Podcast หลายไมค์ และส่งออกเสียงแบบ Lossy/Lossless',
    },
    status: 'active',
    version: 'v1.0.0',
    suiteDownloadUrl: SUITE_DOWNLOAD_URL,
    artcraftEquivalent: 'storytold/soundcraft',
    industryCounterpart: { en: 'Adobe Audition Alternative', th: 'ทางเลือกแทน Adobe Audition' },
    accentColor: '#ec4899',
    glowColor: 'rgba(236,72,153,0.3)',
    icon: 'audio',
    keywords: ['audio', 'sound', 'daw', 'podcast', 'noise', 'mastering', 'music', 'wav', 'mp3'],
    enginePill: { en: '32-Bit Float DSP · Spectral Noise AI', th: 'DSP 32-Bit Float · กำจัด Noise แบบสเปกตรัม' },
    supportedFormats: ['WAV', 'FLAC', 'MP3', 'AAC', 'OGG', 'AIFF'],
    shortcuts: [
      { key: 'Space', action: { en: 'Play / Stop Audio', th: 'เล่น / หยุดเสียง' } },
      { key: 'R', action: { en: 'Record Audio Track', th: 'บันทึกเสียงสด' } },
      { key: 'S', action: { en: 'Split Clip at Playhead', th: 'ตัดแยกคลิปเสียง' } },
      { key: 'M / S', action: { en: 'Mute / Solo Track', th: 'ปิดเสียง / ฟังเดี่ยว' } },
    ],
    specs: {
      en: [
        'Multi-Track Digital Audio Workstation Engine',
        'AI Spectral Noise Reduction & Hum Eradication',
        'Multi-Band Parametric EQ & Dynamics Comp',
        'Podcast Multi-Mic Auto-Leveling Cockpit',
        'Lossless 32-Bit Float WAV & FLAC Mastering',
      ],
      th: [
        'ห้องบันทึกและมิกซ์เสียงดิจิทัลหลายแทร็ก',
        'ลบเสียงฮัมและเสียงรบกวนด้วย Spectral De-Noise',
        'ปรับแต่งเสียงด้วย Parametric EQ และ Compressor',
        'บาลานซ์เสียงไมค์ Podcast หลายตัวอัตโนมัติ',
        'ส่งออกไฟล์เสียงคุณภาพสูง 32-Bit Float WAV/FLAC',
      ],
    },
  },
  {
    id: 'medeck',
    name: 'meDeck Studio',
    category: 'document',
    categoryLabel: { en: 'Document', th: 'เอกสาร' },
    tagline: {
      en: 'High-Impact Interactive Presentation & Keynote Slide Studio',
      th: 'สร้างสไลด์นำเสนอเชิงโต้ตอบ กราฟิกการนำเสนอ และส่งออก PDF/WebDeck',
    },
    description: {
      en: 'Apple Keynote-grade presentation canvas, DrawingML vector shapes, text warps, PPTX clean-room authoring, and web-ready deck exports.',
      th: 'ผืนผ้าใบนำเสนอระดับ Apple Keynote, รูปทรงเวกเตอร์ DrawingML, บิดข้อความ, สร้างไฟล์ PPTX ปราศจากคลาวด์ และส่งออก WebDeck ทันที',
    },
    status: 'active',
    version: 'v1.0.0',
    suiteDownloadUrl: SUITE_DOWNLOAD_URL,
    artcraftEquivalent: 'storytold/deckcraft',
    industryCounterpart: { en: 'Apple Keynote / PowerPoint Alternative', th: 'ทางเลือกแทน Apple Keynote และ PowerPoint' },
    accentColor: '#fb923c',
    glowColor: 'rgba(251,146,60,0.3)',
    icon: 'deck',
    keywords: ['deck', 'keynote', 'powerpoint', 'slide', 'presentation', 'pitch', 'pptx'],
    enginePill: { en: 'Keynote Vector Canvas · Standalone WebDeck', th: 'แคนวาสเวกเตอร์ระดับ Keynote · WebDeck ในตัว' },
    supportedFormats: ['PPTX', 'KEY', 'PDF', 'HTML5', 'PNG'],
    shortcuts: [
      { key: 'Ctrl + M', action: { en: 'New Slide', th: 'สร้างสไลด์ใหม่' } },
      { key: 'F5', action: { en: 'Start Presentation', th: 'เริ่มการนำเสนอเต็มจอ' } },
      { key: 'Ctrl + D', action: { en: 'Duplicate Shape / Slide', th: 'คัดลอกรูปทรงหรือสไลด์' } },
      { key: 'Ctrl + G', action: { en: 'Group Elements', th: 'จัดกลุ่มองค์ประกอบ' } },
    ],
    specs: {
      en: [
        'Apple Keynote-Grade Cinematic Slide Canvas',
        'DrawingML Clean-Room Vector Shapes & Text Warps',
        'Smart Guides & Fluid Physics Transitions',
        'Zero-Cloud PPTX & Standalone HTML WebDeck Export',
        'Dual-Monitor Presenter Display Cockpit',
      ],
      th: [
        'แคนวาสสไลด์นำเสนอคมชัดระดับภาพยนตร์',
        'รูปทรงเวกเตอร์ DrawingML และบิดข้อความอิสระ',
        'เส้นกะระยะอัจฉริยะและแอนิเมชันทรานซิชันฟิสิกส์',
        'ส่งออกไฟล์ PPTX และ HTML WebDeck ไร้คลาวด์',
        'หน้าจอผู้บรรยายสองจอแยกพร้อมบันทึกส่วนตัว',
      ],
    },
  },
  {
    id: 'mecad',
    name: 'meCAD Studio',
    category: 'vector',
    categoryLabel: { en: 'Vector & CAD', th: 'เวกเตอร์และ CAD' },
    tagline: {
      en: '2D Engineering CAD Drafting & Millimeter Precision Plotter',
      th: 'เขียนแบบวิศวกรรม 2D CAD ความแม่นยำสูงระดับมิลลิเมตร และจัดการ DXF',
    },
    description: {
      en: 'Clean-room DXF (R12 to 2018 ASCII/Binary), entity blocks, coordinate snapping, geometric constraints, and millimeter-accurate plotting.',
      th: 'อ่านและเขียนไฟล์ DXF ทุกเวอร์ชัน, บล็อกเอนทิตี, สแน็ปพิกัดแม่นยำ, ข้อกำหนดเรขาคณิต และพล็อตแบบแปลนความแม่นยำระดับมิลลิเมตร',
    },
    status: 'active',
    version: 'v1.0.0',
    suiteDownloadUrl: SUITE_DOWNLOAD_URL,
    artcraftEquivalent: 'storytold/cadcraft',
    industryCounterpart: { en: 'AutoCAD 2D Alternative', th: 'ทางเลือกแทน AutoCAD 2D' },
    accentColor: '#0ea5e9',
    glowColor: 'rgba(14,165,233,0.3)',
    icon: 'cad',
    keywords: ['cad', 'autocad', 'dxf', 'dwg', 'drafting', 'engineering', 'blueprint', 'survey'],
    enginePill: { en: 'Clean-Room DXF · Sub-Millimeter Snapping', th: 'เครื่องยนต์ DXF สะอาด · สแน็ปต่ำกว่ามิลลิเมตร' },
    supportedFormats: ['DXF', 'DWG', 'SVG', 'PDF', 'HPGL'],
    shortcuts: [
      { key: 'L', action: { en: 'Line Command', th: 'คำสั่งวาดเส้นตรง' } },
      { key: 'C', action: { en: 'Circle Command', th: 'คำสั่งวาดวงกลม' } },
      { key: 'F8', action: { en: 'Toggle Ortho Lock', th: 'ล็อกแกนฉาก 90 องศา' } },
      { key: 'Z + E', action: { en: 'Zoom Extents', th: 'ซูมขอบเขตแบบแปลนทั้งหมด' } },
    ],
    specs: {
      en: [
        'Clean-Room DXF Parsing (R12 to 2018 ASCII/Binary)',
        'Entity Blocks, Geometric Snapping & Ortho Locks',
        'Dimensioning, Tolerancing & Millimeter-Accurate Plotting',
        'Layer Management with TrueColor & Linetype Specs',
        'SVG and High-Res Vector PDF Plan Blueprints',
      ],
      th: [
        'อ่านและเขียน DXF มาตรฐานสากลทั้ง ASCII และ Binary',
        'บล็อกชิ้นงาน สแน็ปจุดสัมผัส และล็อกแกนออร์โท',
        'บอกขนาด กำหนดพิกัด และพล็อตแบบละเอียดระดับมิลลิเมตร',
        'จัดการเลเยอร์ สี TrueColor และรูปแบบเส้นประหลากหลาย',
        'แปลงแบบแปลนเป็น SVG และ PDF เวกเตอร์ความละเอียดสูง',
      ],
    },
  },
  {
    id: 'mesheet',
    name: 'meSheet Studio',
    category: 'document',
    categoryLabel: { en: 'Document', th: 'เอกสาร' },
    tagline: {
      en: 'Reactive Financial Modeling & High-Volume Spreadsheet Grid',
      th: 'ตารางคำนวณสเปรดชีตสูตรการเงินความเร็วสูง และประมวลผลข้อมูลใน RAM',
    },
    description: {
      en: 'Reactive spreadsheet formula engine, memory-mapped CSV/TSV/XLSX streaming, instant scrolling across 1,000,000+ rows in local device RAM.',
      th: 'เครื่องยนต์คำนวณสูตรสเปรดชีตแบบ Reactive, สตรีมไฟล์ CSV/TSV/XLSX ในหน่วยความจำ, เลื่อนหน้าจอ 1,000,000+ แถวลื่นไหลโดยไม่กระตุก',
    },
    status: 'active',
    version: 'v1.0.0',
    suiteDownloadUrl: SUITE_DOWNLOAD_URL,
    artcraftEquivalent: 'storytold/gridcraft',
    industryCounterpart: { en: 'Microsoft Excel Alternative', th: 'ทางเลือกแทน Microsoft Excel' },
    accentColor: '#14b8a6',
    glowColor: 'rgba(20,184,166,0.3)',
    icon: 'sheet',
    keywords: ['sheet', 'excel', 'spreadsheet', 'csv', 'formula', 'grid', 'table', 'finance'],
    enginePill: { en: 'Reactive Formula Engine · 1M+ Rows RAM', th: 'สูตร Reactive · รองรับ 1,000,000+ แถวใน RAM' },
    supportedFormats: ['XLSX', 'CSV', 'TSV', 'PARQUET', 'JSON'],
    shortcuts: [
      { key: 'F2', action: { en: 'Edit Active Cell', th: 'แก้ไขสูตรในช่องตาราง' } },
      { key: 'Ctrl + Arrow', action: { en: 'Jump to Boundary Edge', th: 'กระโดดไปยังขอบข้อมูล' } },
      { key: 'Alt + =', action: { en: 'AutoSum Formula', th: 'ใส่สูตรหาผลรวมอัตโนมัติ' } },
      { key: 'Ctrl + Shift + $', action: { en: 'Format Currency', th: 'จัดรูปแบบตัวเลขการเงิน' } },
    ],
    specs: {
      en: [
        'Reactive Formula Engine (SUM, VLOOKUP, XLOOKUP, IF)',
        'Virtualized Canvas Grid Scrolling (1,000,000+ Rows)',
        'Instant Memory-Mapped CSV & TSV Import/Export',
        'Financial Modeling, Charting & Data Validation',
        'Clean-Room XLSX Parsing with Zero Cloud Dependencies',
      ],
      th: [
        'สูตรคำนวณ Reactive รองรับ SUM, VLOOKUP, XLOOKUP, IF',
        'แสดงผลบน Canvas เสมือนจริงเลื่อนล้านแถวไม่หน่วง',
        'เปิดและส่งออก CSV/TSV ขนาดมหึมาทันทีใน RAM',
        'แบบจำลองการเงิน กราฟิก และการตรวจสอบความถูกต้อง',
        'อ่านเขียน XLSX ปราศจากโมดูลภายนอกและไม่ต่อเน็ต',
      ],
    },
  },
  {
    id: 'metexture',
    name: 'meTexture Studio',
    category: 'audio',
    categoryLabel: { en: '3D & Sound', th: '3D และเสียง' },
    tagline: {
      en: 'Direct 3D Mesh Brush Painter & UV Unwrapping Workbench',
      th: 'เพนต์ลวดลายบนผิวโมเดล 3D Mesh โดยตรง และกางระนาบ UV เกาะผิวโมเดล',
    },
    description: {
      en: 'Direct 3D mesh brush painting, UV unwrapping, DirectDraw Surface (DDS / BC1–BC5) block compression, and mipmap generators in device memory.',
      th: 'ระบายสีลงบนผิวโมเดล 3 มิติโดยตรง, คลี่พิกัด UV, บีบอัดพื้นผิว DirectDraw Surface (DDS BC1-BC5) และสร้าง Mipmap ในเครื่อง',
    },
    status: 'active',
    version: 'v1.0.0',
    suiteDownloadUrl: SUITE_DOWNLOAD_URL,
    artcraftEquivalent: 'storytold/texturecraft',
    industryCounterpart: { en: 'Substance 3D Painter Alternative', th: 'ทางเลือกแทน Substance 3D Painter' },
    accentColor: '#f43f5e',
    glowColor: 'rgba(244,63,94,0.3)',
    icon: 'texture',
    keywords: ['texture', 'painter', 'substance', '3d', 'brush', 'uv', 'pbr', 'dds'],
    enginePill: { en: 'Direct 3D Mesh Painting · DDS BC1-BC5', th: 'เพนต์บน 3D Mesh ตรง · บีบอัด DDS BC1-BC5' },
    supportedFormats: ['DDS', 'PNG', 'EXR', 'HDR', 'TIFF', 'OBJ'],
    shortcuts: [
      { key: '1 - 3', action: { en: 'Toggle 2D/3D View', th: 'สลับมุมมอง 2D / 3D / สองจอ' } },
      { key: 'B', action: { en: '3D Paint Brush Tool', th: 'แปรงเพนต์ผิวโมเดล' } },
      { key: 'E', action: { en: 'Texture Eraser', th: 'ยางลบเนื้อสีบนโมเดล' } },
      { key: 'Ctrl + U', action: { en: 'UV Island Inspector', th: 'เปิดเครื่องมือกางเกาะ UV' } },
    ],
    specs: {
      en: [
        'Direct 3D Mesh Brush Painting & Decal Stamping',
        'UV Island Unwrapping & Seam Stitching Workbench',
        'DirectDraw Surface (DDS / BC1-BC5) Block Compression',
        'Multi-Resolution Mipmap Synthesis in Device Memory',
        'PBR Texture Sets (BaseColor, Normal, Roughness, Metalness)',
      ],
      th: [
        'ระบายสีและประทับสติกเกอร์ลงบนผิวโมเดล 3D โดยตรง',
        'ระบบกางเกาะ UV และเย็บรอยต่อตะเข็บโมเดลอย่างแม่นยำ',
        'บีบอัดกราฟิก DDS (BC1-BC5) ประสิทธิภาพระดับการ์ดจอ',
        'สังเคราะห์ Mipmap หลายระดับความละเอียดในแรม',
        'ชุดเท็กซ์เจอร์ PBR ครบวงจร ทั้งสี ความเงา และความนูน',
      ],
    },
  },
  {
    id: 'mematerial',
    name: 'meMaterial Studio',
    category: 'audio',
    categoryLabel: { en: '3D & Sound', th: '3D และเสียง' },
    tagline: {
      en: 'Procedural Node-Based PBR Material & Shader Synthesizer',
      th: 'สังเคราะห์พื้นผิว PBR เสมือนจริงด้วยโหนดเชื่อมต่อ และเขียน WebGPU Shader',
    },
    description: {
      en: 'Node-based shader graph, real-time WGSL compilation, procedural noise synthesis, and metallic/roughness PBR staging.',
      th: 'กราฟโหนดสร้างพื้นผิวอัตโนมัติ, คอมไพล์ภาษา WGSL สด, สังเคราะห์ Noise ทางคณิตศาสตร์ และจัดวางแสงเงา PBR ในเครื่อง',
    },
    status: 'active',
    version: 'v1.0.0',
    suiteDownloadUrl: SUITE_DOWNLOAD_URL,
    artcraftEquivalent: 'storytold/materialcraft',
    industryCounterpart: { en: 'Substance Designer Alternative', th: 'ทางเลือกแทน Substance Designer' },
    accentColor: '#8b5cf6',
    glowColor: 'rgba(139,92,246,0.3)',
    icon: 'material',
    keywords: ['material', 'substance', 'designer', 'shader', 'node', 'procedural', 'wgsl', 'pbr'],
    enginePill: { en: 'Node-Based WGSL · Real-Time WebGPU Baking', th: 'โหนดกราฟ WGSL · อบพื้นผิว WebGPU สด' },
    supportedFormats: ['SBSAR', 'WGSL', 'EXR', 'PNG', 'TIFF'],
    shortcuts: [
      { key: 'Space', action: { en: 'Add Node Menu', th: 'ค้นหาและเพิ่มโหนด' } },
      { key: 'C', action: { en: 'Create Node Comment Frame', th: 'สร้างกรอบคอมเมนต์จัดหมวด' } },
      { key: '1 - 4', action: { en: 'Preview Node in Viewport', th: 'ดูผลลัพธ์ของโหนดในจอพรีวิว' } },
      { key: 'L', action: { en: 'Auto-Layout Nodes', th: 'จัดเรียงสายโหนดอัตโนมัติ' } },
    ],
    specs: {
      en: [
        'Node-Based Visual Shader Graph Architecture',
        'Procedural Noise Synthesis (Perlin, Simplex, Voronoi)',
        'Real-Time WebGPU WGSL Shader Compilation',
        'Non-Destructive Multi-Resolution Texture Baking',
        'Seamless 4K Tiling & Seamless Pattern Export',
      ],
      th: [
        'สถาปัตยกรรมกราฟโหนดเชื่อมต่อที่ยืดหยุ่นไม่ทำลายต้นฉบับ',
        'สังเคราะห์สัญญาณนอยส์ Perlin, Simplex, Voronoi อิสระ',
        'คอมไพล์โค้ด WebGPU WGSL แสดงผลแสงจริงในเสี้ยววินาที',
        'อบเท็กซ์เจอร์หลายระดับความละเอียดบันทึกในเครื่อง',
        'สร้างลวดลายไร้รอยต่อความละเอียดระดับ 4K พร้อมใช้งาน',
      ],
    },
  },
  {
    id: 'meani',
    name: 'meAni Studio',
    category: 'video',
    categoryLabel: { en: 'Video & Motion', th: 'วิดีโอและโมชัน' },
    tagline: {
      en: '2D Skeletal Animation, Inverse Kinematics & Sprite Rigging',
      th: 'แอนิเมชัน 2 มิติติดกระดูกโครงสร้าง สรีระจำลอง IK และทำ Sprite Sheet เกม',
    },
    description: {
      en: 'Frame-by-frame light table, onion skinning, skeletal bone rigging, curve interpolation, and sprite sheet / vector SVG export.',
      th: 'โต๊ะไฟสเก็ตช์ทีละเฟรม, หัวหอมพรีวิว Onion Skinning, ดัดกระดูกโครงสร้างตัวละคร 2 มิติ และส่งออก Sprite Sheet สู่เอนจินเกม',
    },
    status: 'active',
    version: 'v1.0.0',
    suiteDownloadUrl: SUITE_DOWNLOAD_URL,
    artcraftEquivalent: 'storytold/anicraft',
    industryCounterpart: { en: 'Spine 2D / Adobe Animate Alternative', th: 'ทางเลือกแทน Spine 2D และ Adobe Animate' },
    accentColor: '#d946ef',
    glowColor: 'rgba(217,70,239,0.3)',
    icon: 'ani',
    keywords: ['animation', 'spine', 'rigging', 'bones', 'ik', 'sprite', '2d', 'onion-skin'],
    enginePill: { en: '2D Skeletal Bones · Inverse Kinematics IK', th: 'โครงกระดูก 2D · ระบบสรีระจำลอง IK' },
    supportedFormats: ['JSON', 'ATLAS', 'PNG', 'SVG', 'GIF', 'WEBM'],
    shortcuts: [
      { key: 'B', action: { en: 'Create / Select Bone', th: 'สร้างและเลือกกระดูกโครงสร้าง' } },
      { key: 'K', action: { en: 'Insert Keyframe', th: 'แทรกคีย์เฟรมแอนิเมชัน' } },
      { key: 'O', action: { en: 'Toggle Onion Skinning', th: 'เปิดปิดภาพซ้อนเฟรมก่อนหน้า' } },
      { key: 'Space', action: { en: 'Play / Stop Animation', th: 'เล่น / หยุดแอนิเมชัน' } },
    ],
    specs: {
      en: [
        '2D Skeletal Bone Rigging & Inverse Kinematics (IK)',
        'Frame-by-Frame Light Table & Onion Skinning',
        'Dope Sheet & Bézier Motion Curve Editor',
        'Packed Texture Atlas & Sprite Sheet Generation',
        'Clean SVG & Game-Ready JSON Vector Animation Export',
      ],
      th: [
        'ติดกระดูกโครงสร้าง 2 มิติพร้อมจำลองการเคลื่อนไหว IK',
        'โต๊ะไฟวาดเฟรมต่อเฟรมและภาพซ้อนหัวหอม Onion Skin',
        'ตาราง Dope Sheet และดัดความเร็วด้วยเส้นโค้ง Bézier',
        'จัดเรียงภาพลง Atlas และ Sprite Sheet สำหรับเกม',
        'ส่งออก JSON และ SVG Vector นำไปใช้ใน Web/Unity/Godot',
      ],
    },
  },
  {
    id: 'merea',
    name: 'meREA Studio',
    category: 'utility',
    categoryLabel: { en: 'Utility & REA', th: 'เครื่องมือและ REA' },
    tagline: {
      en: 'Forensic Binary Reverse Engineering & Clean-Room Code Synthesis',
      th: 'แกะรอยระบบ ถอดรหัสไบนารี สถาปัตยกรรมย้อนรอย และสร้างโค้ดอัตโนมัติ',
    },
    description: {
      en: 'Universal REA toolkit with 320 CLI/MCP forensic tools, PE/COFF, ELF, Mach-O, WASM and AST disassembly, memory layout inspection, and clean-room code synthesis for autonomous AI agents.',
      th: 'ชุดเครื่องมือวิศวกรรมย้อนรอยครอบจักรวาล 320 คำสั่ง CLI/MCP, ถอดรหัสไฟล์ PE, ELF, Mach-O, WASM, วิเคราะห์โครงสร้างเมมโมรี่ และสร้างโค้ดสะอาดสำหรับ AI Agent',
    },
    status: 'active',
    version: 'v1.0.0',
    suiteDownloadUrl: SUITE_DOWNLOAD_URL,
    artcraftEquivalent: 'storytold/craft-anything',
    industryCounterpart: { en: 'Universal REA & Code Synthesis', th: 'ระบบแกะรอยและสร้างโค้ดสะอาดอัตโนมัติ' },
    accentColor: '#00f0ff',
    glowColor: 'rgba(0,240,255,0.3)',
    icon: 'rea',
    keywords: ['rea', 'reverse-engineering', 'binary', 'disassembly', 'decompilation', 'agent', 'mcp'],
    enginePill: { en: '320 MCP Tools · Cross-Reference Call Graph', th: '320 เครื่องมือ MCP · กราฟเชื่อมโยงสถาปัตยกรรม' },
    supportedFormats: ['EXE', 'DLL', 'ELF', 'WASM', 'SO', 'DYLIB', 'JSON'],
    shortcuts: [
      { key: 'X', action: { en: 'Find Cross References (XRefs)', th: 'ค้นหาจุดเรียกใช้งาน XRefs' } },
      { key: 'G', action: { en: 'Go to Virtual Address', th: 'กระโดดไปยังตำแหน่งแอดเดรส' } },
      { key: 'D', action: { en: 'Decompile Function', th: 'ถอดรหัสเป็นโค้ดเทียบเท่า' } },
      { key: 'F5', action: { en: 'Refresh Call Graph', th: 'รีเฟรชผังเรียกใช้ฟังก์ชัน' } },
    ],
    specs: {
      en: [
        '320 CLI/MCP Forensic Reverse Engineering Tools',
        'PE/COFF, ELF, Mach-O, WASM & AST Disassembly',
        'Cross-Reference (XRef) & Call-Graph Reconstruction',
        'Memory Layout Inspection & Clean-Room Code Synthesis',
        'Direct LLM Agent Integration via Model Context Protocol',
      ],
      th: [
        'เครื่องมือตรวจพิสูจน์วิศวกรรมย้อนรอย 320 รายการผ่าน MCP',
        'ถอดรหัสและวิเคราะห์โครงสร้าง PE, ELF, Mach-O และ WASM',
        'สร้างผังเชื่อมโยง Cross-Reference และกราฟเรียกฟังก์ชัน',
        'ตรวจสอบโครงสร้างเมมโมรี่และสังเคราะห์โค้ดสะอาดใหม่',
        'เชื่อมต่อตรงสู่โมเดลปัญญาประดิษฐ์ผ่าน Model Context Protocol',
      ],
    },
  },
];`;

const startIdx = content.indexOf('export const SHOWCASE_APPS: ShowcaseApp[] = [');
const endMarker = '\n// ─── App Icons & 3D Thai Mythology Emblems';
const endIdx = content.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
  console.error('Failed to locate SHOWCASE_APPS range', { startIdx, endIdx });
  process.exit(1);
}

content = content.slice(0, startIdx) + newShowcaseApps + '\n' + content.slice(endIdx);

fs.writeFileSync(mainTsPath, content, 'utf8');
console.log('Successfully updated SHOWCASE_APPS and i18n in main.ts!');
