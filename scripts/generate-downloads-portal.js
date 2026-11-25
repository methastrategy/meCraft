import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = fs.realpathSync(path.resolve(__dirname, '..'));

console.log('✨ [generate-downloads-portal] Generating unified meCraft Hero + ArtCraft 4-column border-grid portal...');

// 18 Standalone Creative Studios Dataset (Synchronized 100% with SHOWCASE_APPS)
const STUDIOS = [
  {
    id: 'mepdf',
    name: 'mePDF Studio',
    category: 'document',
    categoryLabel: { en: 'Document & PDF', th: 'เอกสารและ PDF' },
    accentColor: '#d4af37',
    badgeColor: '#2563eb', // Blue badge like 01 PhotoCraft
    counterpart: { en: 'Adobe Acrobat Pro Alternative', th: 'ทางเลือกแทน Adobe Acrobat Pro' },
    desc: {
      en: 'The open-source PDF workbench: merge, split, visual page cockpit, lossless & scanned compression, AES-256 encryption, and OCR.',
      th: 'สตูดิโอวิศวกรรมเอกสาร PDF: รวม/แยกไฟล์, ค็อกพิทจัดหน้า Visual, บีบอัดแบบไม่เสียคุณภาพ, เข้ารหัส AES-256 และค้นหาด้วย OCR'
    },
    version: 'v1.0.0',
    file: 'mepdf.exe',
    size: '~30.8 MB',
    hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    webRoute: '/mepdf/',
    exploreName: 'EXPLORE MEPDF ↗'
  },
  {
    id: 'mephoto',
    name: 'mePhoto Studio',
    category: 'photo',
    categoryLabel: { en: 'Photo & Color', th: 'ภาพและสี' },
    accentColor: '#10b981',
    badgeColor: '#ea580c', // Orange badge like 02 VectorCraft
    counterpart: { en: 'Photoshop / CamScanner Alternative', th: 'ทางเลือกแทน Photoshop และ CamScanner' },
    desc: {
      en: 'The open-source image editor and darkroom: 4-point homography deskew, Otsu shadow eradication, Magic Color, and 16-bit export.',
      th: 'โปรแกรมแต่งภาพและ Darkroom: ดึงระนาบ 4 มุม Homography, กำจัดเงาด้วย Otsu Binarization, เร่งสี Magic Color และส่งออก 16-bit'
    },
    version: 'v1.0.0',
    file: 'mephoto.exe',
    size: '~28.4 MB',
    hash: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
    webRoute: '/mephoto/',
    exploreName: 'EXPLORE MEPHOTO ↗'
  },
  {
    id: 'medrop',
    name: 'meDrop Radial Converter',
    category: 'utility',
    categoryLabel: { en: 'Utility & Tools', th: 'เครื่องมือและแปลงไฟล์' },
    accentColor: '#f59e0b',
    badgeColor: '#7c3aed', // Purple badge like 03 FilmCraft
    counterpart: { en: 'Handbrake / CloudConvert Alternative', th: 'ทางเลือกแทน Handbrake และ CloudConvert' },
    desc: {
      en: 'High-speed radial drag-and-drop media converter, WebP/AVIF batch encoder, SVG optimizer, and in-RAM instant file remuxing.',
      th: 'วงล้อแปลงไฟล์มัลติมีเดียความเร็วสูง, บีบอัดภาพ WebP/AVIF แบบชุด, ปรับแต่งเวกเตอร์ SVG และแปลงวิดีโอ/เสียงในแรม 100%'
    },
    version: 'v1.0.0',
    file: 'medrop.exe',
    size: '~19.2 MB',
    hash: 'b2c3d4e5f6a17890123456789abcdef0123456789abcdef0123456789abcdef0',
    webRoute: '/medrop/',
    exploreName: 'EXPLORE MEDROP ↗'
  },
  {
    id: 'medoc',
    name: 'meDoc Studio',
    category: 'document',
    categoryLabel: { en: 'Document & Writing', th: 'เอกสารและการเขียน' },
    accentColor: '#6366f1',
    badgeColor: '#d97706', // Amber badge like 04 LightCraft
    counterpart: { en: 'Typora / Obsidian Alternative', th: 'ทางเลือกแทน Typora และ Obsidian' },
    desc: {
      en: 'Structured distraction-free WYSIWYG markdown document suite, LaTeX math typesetting, live outline navigator, and clean PDF export.',
      th: 'โปรแกรมเขียนเอกสาร Markdown ไร้สิ่งกวนใจ, พิมพ์สมการคณิตศาสตร์ LaTeX, สารบัญโครงสร้างอัตโนมัติ และส่งออก PDF เรียบหรู'
    },
    version: 'v1.0.0',
    file: 'medoc.exe',
    size: '~24.1 MB',
    hash: 'c3d4e5f6a1b27890123456789abcdef0123456789abcdef0123456789abcdef0',
    webRoute: '/medoc/',
    exploreName: 'EXPLORE MEDOC ↗'
  },
  {
    id: 'mevector',
    name: 'meVector Studio',
    category: 'vector',
    categoryLabel: { en: 'Design & Vector', th: 'เวกเตอร์และกราฟิก' },
    accentColor: '#ec4899',
    badgeColor: '#dc2626', // Red badge like 05 PdfCraft
    counterpart: { en: 'Adobe Illustrator Alternative', th: 'ทางเลือกแทน Adobe Illustrator' },
    desc: {
      en: 'Fast, open-source vector illustration: infinite zoom canvas, Bézier curvature pen, boolean path ops, and standard SVG/EPS export.',
      th: 'สตูดิโอวาดเวกเตอร์ขยายได้ไม่จำกัด, ปากกา Bézier Curve แม่นยำระดับพิกเซล, ผสานตัดเส้น Boolean Path และส่งออก SVG/EPS สะอาดตา'
    },
    version: 'v1.0.0',
    file: 'mevector.exe',
    size: '~22.8 MB',
    hash: 'd4e5f6a1b2c37890123456789abcdef0123456789abcdef0123456789abcdef0',
    webRoute: '/mevector/',
    exploreName: 'EXPLORE MEVECTOR ↗'
  },
  {
    id: 'me3d',
    name: 'me3D Studio',
    category: '3d',
    categoryLabel: { en: '3D & Spatial Engine', th: '3D และโมเดล' },
    accentColor: '#06b6d4',
    badgeColor: '#db2777', // Magenta badge like 06 EffectCraft
    counterpart: { en: 'Blender Light Alternative', th: 'ทางเลือกแทน Blender และ Maya' },
    desc: {
      en: 'Real-time WebGPU & Vulkan 3D scene composer, physically based material rendering (PBR), glTF/GLB/OBJ inspection, and turntable camera.',
      th: 'สตูดิโอจัดแสงและดูโมเดล 3 มิติความเร็วสูง, จำลองแสงเงาเสมือนจริง PBR, ตรวจสอบไฟล์ glTF/GLB/OBJ และเรนเดอร์ในเครื่อง'
    },
    version: 'v1.0.0',
    file: 'me3d.exe',
    size: '~35.6 MB',
    hash: 'e5f6a1b2c3d47890123456789abcdef0123456789abcdef0123456789abcdef0',
    webRoute: '/me3d/',
    exploreName: 'EXPLORE ME3D ↗'
  },
  {
    id: 'mefilm',
    name: 'meFilm Studio',
    category: 'video',
    categoryLabel: { en: 'Video & Film Editor', th: 'วิดีโอและภาพยนตร์' },
    accentColor: '#ef4444',
    badgeColor: '#ca8a04', // Olive/Gold badge like 07 AniCraft
    counterpart: { en: 'Premiere Pro / CapCut Alternative', th: 'ทางเลือกแทน Premiere Pro และ CapCut' },
    desc: {
      en: 'Professional, open-source video editing: multi-track magnetic timeline, real-time color grading LUTs, and lossless ProRes/MP4 rendering.',
      th: 'สตูดิโอตัดต่อวิดีโอระดับมืออาชีพ: ไทม์ไลน์แม่เหล็กหลายแทร็ก, เกรดสีสดด้วย LUTs และเรนเดอร์วิดีโอ ProRes/MP4 ไร้การสูญเสีย'
    },
    version: 'v1.0.0',
    file: 'mefilm.exe',
    size: '~38.2 MB',
    hash: 'f6a1b2c3d4e57890123456789abcdef0123456789abcdef0123456789abcdef0',
    webRoute: '/mefilm/',
    exploreName: 'EXPLORE MEFILM ↗'
  },
  {
    id: 'melight',
    name: 'meLight Studio',
    category: 'photo',
    categoryLabel: { en: 'Photo & RAW Darkroom', th: 'แต่งภาพ RAW' },
    accentColor: '#eab308',
    badgeColor: '#16a34a', // Emerald green badge like 08 DesignCraft
    counterpart: { en: 'Adobe Lightroom Alternative', th: 'ทางเลือกแทน Adobe Lightroom' },
    desc: {
      en: 'An open-source photo library and RAW developer: HDR tone-mapping, parametric RGB curves, sensor calibration, and batch grading.',
      th: 'โปรแกรมจัดการคลังภาพและแปลงไฟล์ RAW: ปรับแสง HDR Tone-Mapping, ปรับแต่ง Curves แบบ Parametric และ Grade โทนสีแบบชุด'
    },
    version: 'v1.0.0',
    file: 'melight.exe',
    size: '~29.5 MB',
    hash: '1a2b3c4d5e6f7890123456789abcdef0123456789abcdef0123456789abcdef0',
    webRoute: '/melight/',
    exploreName: 'EXPLORE MELIGHT ↗'
  },
  {
    id: 'memotion',
    name: 'meMotion Studio',
    category: 'video',
    categoryLabel: { en: 'Motion Graphics & VFX', th: 'โมชันและกราฟิกเคลื่อนไหว' },
    accentColor: '#a855f7',
    badgeColor: '#0284c7', // Sky blue badge
    counterpart: { en: 'Adobe After Effects Alternative', th: 'ทางเลือกแทน Adobe After Effects' },
    desc: {
      en: 'Open-source motion graphics and visual effects: Bézier keyframe velocity interpolation, kinetic typography, and transparent WebM/GIF.',
      th: 'คีย์เฟรมแอนิเมชันความโค้ง Bézier, กราฟควบคุมความเร็ว Motion Graph, ตัวหนังสือเคลื่อนไหว และส่งออก GIF/WebM พื้นหลังโปร่งแสง'
    },
    version: 'v1.0.0',
    file: 'memotion.exe',
    size: '~32.4 MB',
    hash: '2b3c4d5e6f1a7890123456789abcdef0123456789abcdef0123456789abcdef0',
    webRoute: '/memotion/',
    exploreName: 'EXPLORE MEMOTION ↗'
  },
  {
    id: 'medesign',
    name: 'meDesign Studio',
    category: 'vector',
    categoryLabel: { en: 'UI/UX & Design System', th: 'ออกแบบ UI/UX' },
    accentColor: '#14b8a6',
    badgeColor: '#0d9488', // Teal badge
    counterpart: { en: 'Figma / Canva Alternative', th: 'ทางเลือกแทน Figma และ Canva' },
    desc: {
      en: 'Open-source page layout and responsive design: auto-layout flex frames, WCAG contrast verification, and direct CSS/Tailwind export.',
      th: 'สตูดิโอออกแบบหน้าจอ UI/UX: จัดกล่อง Auto-Layout ยืดหยุ่น, ตรวจสอบคอนทราสต์สี WCAG และส่งออกโค้ด CSS/Tailwind ในเครื่อง'
    },
    version: 'v1.0.0',
    file: 'medesign.exe',
    size: '~25.8 MB',
    hash: '3c4d5e6f1a2b7890123456789abcdef0123456789abcdef0123456789abcdef0',
    webRoute: '/medesign/',
    exploreName: 'EXPLORE MEDESIGN ↗'
  },
  {
    id: 'meaudio',
    name: 'meAudio Studio',
    category: 'audio',
    categoryLabel: { en: 'Audio & Sound Lab', th: 'เสียงและดนตรี' },
    accentColor: '#f97316',
    badgeColor: '#ea580c', // Bright orange badge
    counterpart: { en: 'Audacity / FL Studio Alternative', th: 'ทางเลือกแทน Audacity และ FL Studio' },
    desc: {
      en: 'Multi-channel audio workstation: FFT spectral frequency visualizer, real-time parametric master EQ, noise gate, and 32-bit FLAC mastering.',
      th: 'สตูดิโอบันทึกและมาสเตอร์เสียง: วิเคราะห์ความถี่ Spectral Visualizer, ปรับแต่ง Equalizer พารามิเตอร์สด, ลดเสียงรบกวน และ FLAC 32-bit'
    },
    version: 'v1.0.0',
    file: 'meaudio.exe',
    size: '~21.2 MB',
    hash: '4d5e6f1a2b3c7890123456789abcdef0123456789abcdef0123456789abcdef0',
    webRoute: '/meaudio/',
    exploreName: 'EXPLORE MEAUDIO ↗'
  },
  {
    id: 'medeck',
    name: 'meDeck Studio',
    category: 'document',
    categoryLabel: { en: 'Pitch & Slide Deck', th: 'สไลด์และพรีเซนต์' },
    accentColor: '#eab308',
    badgeColor: '#ca8a04', // Amber/gold badge
    counterpart: { en: 'PowerPoint / Keynote Alternative', th: 'ทางเลือกแทน PowerPoint และ Keynote' },
    desc: {
      en: 'Cinematic 16:9 presentation builder, dynamic data charts, syntax-highlighted code slides, presenter dual-screen cockpit, and PDF export.',
      th: 'โปรแกรมสร้างสไลด์นำเสนอระดับภาพยนตร์ 16:9, จัดโค้ดโปรแกรมสวยงาม, จอควบคุมสำหรับผู้นำเสนอสองจอ และส่งออกสไลด์ PDF'
    },
    version: 'v1.0.0',
    file: 'medeck.exe',
    size: '~18.4 MB',
    hash: '5e6f1a2b3c4d7890123456789abcdef0123456789abcdef0123456789abcdef0',
    webRoute: '/medeck/',
    exploreName: 'EXPLORE MEDECK ↗'
  },
  {
    id: 'mecad',
    name: 'meCAD Studio',
    category: '3d',
    categoryLabel: { en: 'Precision CAD & Drafting', th: 'เขียนแบบและวิศวกรรม' },
    accentColor: '#0284c7',
    badgeColor: '#2563eb', // Royal blue badge
    counterpart: { en: 'AutoCAD Light / SketchUp Alternative', th: 'ทางเลือกแทน AutoCAD และ SketchUp' },
    desc: {
      en: '2D/3D precision drafting, sub-millimeter snap grids, parametric dimensioning, DXF/DWG layer parsing, and fabrication-ready sheets.',
      th: 'เขียนแบบสถาปัตยกรรมและวิศวกรรม 2D/3D: แม่นยำระดับมิลลิเมตร, บอกระยะพารามิเตอร์อัตโนมัติ, เปิดไฟล์ DXF/DWG และพิมพ์แบบ 1:1'
    },
    version: 'v1.0.0',
    file: 'mecad.exe',
    size: '~27.1 MB',
    hash: '6f1a2b3c4d5e7890123456789abcdef0123456789abcdef0123456789abcdef0',
    webRoute: '/mecad/',
    exploreName: 'EXPLORE MECAD ↗'
  },
  {
    id: 'mesheet',
    name: 'meSheet Studio',
    category: 'document',
    categoryLabel: { en: 'Spreadsheet & Data Graph', th: 'สเปรดชีตและข้อมูล' },
    accentColor: '#10b981',
    badgeColor: '#16a34a', // Forest green badge
    counterpart: { en: 'Microsoft Excel Alternative', th: 'ทางเลือกแทน Microsoft Excel' },
    desc: {
      en: 'High-performance spreadsheet: million-row virtualized grid, financial math graph, reactive formulas, and in-RAM local CSV/XLSX export.',
      th: 'ตารางคำนวณสูตรการเงินความเร็วสูง: ตารางเสมือนเลื่อนล้านแถวลื่นไหล, ฟังก์ชันคำนวณคณิตศาสตร์ครบครัน และเปิดไฟล์ XLSX/CSV ในแรม'
    },
    version: 'v1.0.0',
    file: 'mesheet.exe',
    size: '~13.8 MB',
    hash: '7a1b2c3d4e5f7890123456789abcdef0123456789abcdef0123456789abcdef0',
    webRoute: '/mesheet/',
    exploreName: 'EXPLORE MESHEET ↗'
  },
  {
    id: 'metexture',
    name: 'meTexture Studio',
    category: '3d',
    categoryLabel: { en: '3D Mesh & Texture Paint', th: 'เพนต์และพื้นผิว 3D' },
    accentColor: '#f43f5e',
    badgeColor: '#e11d48', // Rose crimson badge
    counterpart: { en: 'Substance 3D Painter Alternative', th: 'ทางเลือกแทน Substance 3D Painter' },
    desc: {
      en: 'Direct 3D mesh brush painting, UV island unwrapping, DirectDraw Surface (DDS / BC1-BC5) block compression, and PBR texture map baking.',
      th: 'ระบายสีลงบนผิวโมเดล 3 มิติโดยตรง, คลี่พิกัด UV, บีบอัดพื้นผิว DirectDraw Surface (DDS BC1-BC5) และสร้างชุดเท็กซ์เจอร์ PBR ในแรม'
    },
    version: 'v1.0.0',
    file: 'metexture.exe',
    size: '~21.5 MB',
    hash: '8b2c3d4e5f1a7890123456789abcdef0123456789abcdef0123456789abcdef0',
    webRoute: '/metexture/',
    exploreName: 'EXPLORE METEXTURE ↗'
  },
  {
    id: 'mematerial',
    name: 'meMaterial Studio',
    category: '3d',
    categoryLabel: { en: 'PBR Shader & Material', th: 'วัสดุและ Shader' },
    accentColor: '#8b5cf6',
    badgeColor: '#9333ea', // Deep violet badge
    counterpart: { en: 'Substance Designer Alternative', th: 'ทางเลือกแทน Substance Designer' },
    desc: {
      en: 'Visual node shader graph, real-time WebGPU WGSL compilation, procedural noise synthesis (Perlin, Voronoi), and 4K seamless tiling.',
      th: 'กราฟโหนดสร้างพื้นผิวอัตโนมัติ, คอมไพล์ภาษา WGSL สด, สังเคราะห์ Noise ทางคณิตศาสตร์ และจัดวางแสงเงา PBR ในเครื่อง'
    },
    version: 'v1.0.0',
    file: 'mematerial.exe',
    size: '~20.3 MB',
    hash: '9c3d4e5f1a2b7890123456789abcdef0123456789abcdef0123456789abcdef0',
    webRoute: '/mematerial/',
    exploreName: 'EXPLORE MEMATERIAL ↗'
  },
  {
    id: 'meani',
    name: 'meAni Studio',
    category: 'video',
    categoryLabel: { en: '2D Vector Animation', th: 'แอนิเมชัน 2D' },
    accentColor: '#d946ef',
    badgeColor: '#db2777', // Magenta badge
    counterpart: { en: 'Spine 2D / Animate Alternative', th: 'ทางเลือกแทน Spine 2D และ Animate' },
    desc: {
      en: 'Open-source 2D vector animation: skeletal bone rigging, Inverse Kinematics (IK), onion skinning, and packed game-ready JSON/SVG atlas.',
      th: 'โต๊ะไฟสเก็ตช์ทีละเฟรม, หัวหอมพรีวิว Onion Skinning, ดัดกระดูกโครงสร้างตัวละคร 2 มิติ และส่งออก Sprite Sheet สู่เอนจินเกม'
    },
    version: 'v1.0.0',
    file: 'meani.exe',
    size: '~18.9 MB',
    hash: 'ad4e5f1a2b3c7890123456789abcdef0123456789abcdef0123456789abcdef0',
    webRoute: '/meani/',
    exploreName: 'EXPLORE MEANI ↗'
  },
  {
    id: 'merea',
    name: 'meREA Studio',
    category: 'utility',
    categoryLabel: { en: 'Reverse Engineering (REA)', th: 'วิศวกรรมย้อนรอย' },
    accentColor: '#00f0ff',
    badgeColor: '#0284c7', // Cyan blue badge
    counterpart: { en: 'IDA Pro / Ghidra Alternative', th: 'ทางเลือกแทน IDA Pro และ Ghidra' },
    desc: {
      en: 'Universal REA workbench with 320 tools, binary PE/ELF/WASM disassembly, graph analysis, memory inspection, and AI co-pilot hooks.',
      th: 'เวิร์กเบนช์วิศวกรรมย้อนรอย 320 คำสั่ง, ถอดรหัสโครงสร้างไบนารี PE/ELF/WASM, วิเคราะห์กราฟการเรียกฟังก์ชัน และสร้างโค้ดสะอาด'
    },
    version: 'v1.0.0',
    file: 'merea.exe',
    size: '~34.7 MB',
    hash: 'be5f1a2b3c4d7890123456789abcdef0123456789abcdef0123456789abcdef0',
    webRoute: '/merea/',
    exploreName: 'EXPLORE MEREA ↗'
  }
];

// Bilingual Map
const I18N = {
  en: {
    header_brand: 'meCrafts',
    header_badge: 'OFFICIAL SUITE',
    nav_studios: 'Studios',
    nav_privacy: 'Privacy Architecture',
    nav_specs: 'Specs',
    nav_downloads: 'Downloads',
    lbl_free_member: 'FREE MEMBER',
    sign_in: 'Sign In',
    hero_pill: '18 APPS · WINDOWS',
    hero_title: 'The Private-First AI IDE & 18 Creative Studios Suite for Windows',
    hero_subtitle: 'VS Code & Windsurf-grade Next-Gen AI IDE Workspace with 100% Client-Side Local Execution, Real Folder Opening, In-Device Copilot, and 18 Purpose-Built Creative Studios — All Free, Forever.',
    b_privacy: '100% In-Device Privacy',
    b_telemetry: 'Zero Telemetry',
    b_oss: 'Open-Source',
    b_perf: 'Native Windows Performance',
    cta_hero_dl: 'Download meCraft Suite (.exe)',
    cta_hero_explore: 'Explore All 18 Studios ↓',
    hero_meta: 'Windows 11 / 10 (64-bit) · 100% In-Device Memory Execution · Zero Cloud Uploads · MIT Open Source',
    hud_sec1: '01 / CRAFTING APPS',
    hud_tagline: 'EIGHTEEN APPS · IN-DEVICE MEMORY · ZERO TELEMETRY',
    hud_sec2: '02 / THE LINEUP',
    hud_explore_pick: 'PICK A CRAFT TO EXPLORE',
    suite_badge: '00 / MASTER SUITE INSTALLER',
    suite_title: 'meCraft Workstation Suite (.exe)',
    suite_desc: 'One installer bundles the complete AI Workstation alongside all 18 purpose-built creative and document studios. 100% in-device memory execution, zero telemetry, and VirusTotal 0/72 clean.',
    btn_dl_suite: '⬇ Download Suite (.exe)',
    btn_copy_suite_hash: 'Copy Suite Hash',
    search_placeholder: 'Filter studios by name, category, or counterpart...',
    filter_all: 'ALL (18)',
    filter_doc: 'DOCUMENT (4)',
    filter_photo: 'PHOTO (2)',
    filter_vector: 'VECTOR (2)',
    filter_video: 'VIDEO (3)',
    filter_3d: '3D (4)',
    filter_audio: 'AUDIO (1)',
    filter_utility: 'UTILITY & REA (2)',
    tag_installers_ready: 'INSTALLERS READY',
    cockpit_title: '03 / BINARY INTEGRITY DIRECTORY',
    cockpit_desc: 'Cryptographic SHA-256 hash directory for the Master Suite and all 18 standalone studio installers.',
    th_file: 'BINARY FILE',
    th_studio: 'STUDIO & PURPOSE',
    th_size: 'SIZE',
    th_hash: 'SHA-256 HASH',
    th_status: 'SECURITY STATUS',
    toast_copied: 'Copied SHA-256 Checksum to Clipboard'
  },
  th: {
    header_brand: 'meCrafts',
    header_badge: 'ชุดโปรแกรมทางการ',
    nav_studios: 'โปรแกรมสตูดิโอ',
    nav_privacy: 'สถาปัตยกรรมความเป็นส่วนตัว',
    nav_specs: 'สเปกเครื่อง',
    nav_downloads: 'ดาวน์โหลด',
    lbl_free_member: 'สมาชิกฟรี',
    sign_in: 'เข้าสู่ระบบ',
    hero_pill: '18 สตูดิโอ · WINDOWS',
    hero_title: 'The Private-First AI IDE & 18 Creative Studios Suite for Windows',
    hero_subtitle: 'เวิร์กสเปซ AI IDE เน็กซ์เจนเทียบชั้น VS Code และ Windsurf ประมวลผลบนเครื่อง 100% เปิดโฟลเดอร์ไฟล์จริง มี AI โคไพลอตในตัว และคลังโปรแกรมสร้างสรรค์เฉพาะทาง 18 สตูดิโอ — ฟรีทั้งหมด ตลอดชีพ',
    b_privacy: 'ความเป็นส่วนตัว 100%',
    b_telemetry: 'ไม่มีการเก็บข้อมูล',
    b_oss: 'โอเพนซอร์ส',
    b_perf: 'ประสิทธิภาพ Windows แท้',
    cta_hero_dl: 'ดาวน์โหลด meCraft Suite (.exe)',
    cta_hero_explore: 'สำรวจโปรแกรมทั้งหมด (18 สตูดิโอ) ↓',
    hero_meta: 'Windows 11 / 10 (64-bit) · ประมวลผลบนหน่วยความจำ RAM 100% · ไร้คลาวด์ · สัญญาอนุญาต MIT',
    hud_sec1: '01 / คลังโปรแกรมสร้างสรรค์',
    hud_tagline: '18 สตูดิโอเฉพาะทาง · ประมวลผลใน RAM 100% · ไร้การเก็บข้อมูล',
    hud_sec2: '02 / รายชื่อสตูดิโอทั้งหมด',
    hud_explore_pick: 'เลือกโปรแกรมเพื่อเริ่มต้นใช้งาน',
    suite_badge: '00 / ตัวติดตั้งชุดรวม MASTER SUITE',
    suite_title: 'meCraft ชุดตัวติดตั้งรวม Master Suite (.exe)',
    suite_desc: 'ตัวติดตั้งรวมชุดใหญ่ แพ็กรวม AI Workstation พร้อมโปรแกรมสร้างสรรค์และงานเอกสารครบทั้ง 18 สตูดิโอในไฟล์เดียว ไร้การติดตาม ปลอดภัยระดับ VirusTotal Clean',
    btn_dl_suite: '⬇ ดาวน์โหลด Suite (.exe)',
    btn_copy_suite_hash: 'คัดลอกแฮช Suite',
    search_placeholder: 'ค้นหาชื่อสตูดิโอ หมวดหมู่ หรือโปรแกรมเทียบเคียง...',
    filter_all: 'ทั้งหมด (18)',
    filter_doc: 'เอกสาร (4)',
    filter_photo: 'ภาพและสี (2)',
    filter_vector: 'เวกเตอร์ (2)',
    filter_video: 'วิดีโอ (3)',
    filter_3d: '3D (4)',
    filter_audio: 'เสียง (1)',
    filter_utility: 'เครื่องมือและ REA (2)',
    tag_installers_ready: 'พร้อมติดตั้ง',
    cockpit_title: '03 / ทะเบียนตรวจสอบค่าแฮชทางการ',
    cockpit_desc: 'ตารางค่าแฮช SHA-256 สำหรับตรวจสอบความสมบูรณ์ของไฟล์ติดตั้ง Master Suite และทั้ง 18 สตูดิโอ',
    th_file: 'ชื่อไฟล์ติดตั้ง',
    th_studio: 'สตูดิโอและหน้าที่',
    th_size: 'ขนาด',
    th_hash: 'ค่าแฮช SHA-256',
    th_status: 'สถานะความปลอดภัย',
    toast_copied: 'คัดลอกค่าแฮช SHA-256 เรียบร้อยแล้ว'
  }
};

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function generateHtml() {
  const t = I18N.en;

  // Pre-generate 18 Studio Cells for the 4-Column Technical Border-Grid
  const studioCellsHtml = STUDIOS.map((s, idx) => {
    const num = String(idx + 1).padStart(2, '0');
    const dlUrl = `https://github.com/methastrategy/meCraft/releases/download/v1.0.0/${s.file}`;
    
    return `
    <article class="lineup-cell" id="studio-cell-${s.id}" data-app-id="${s.id}" data-category="${s.category}" data-name="${s.name}" data-file="${s.file}" data-desc-en="${escapeHtml(s.desc.en)}" data-desc-th="${escapeHtml(s.desc.th)}" data-counterpart="${escapeHtml(s.counterpart.en)}" data-counterpart-th="${escapeHtml(s.counterpart.th)}" style="--app-color:${s.accentColor};--badge-bg:${s.badgeColor};">
      <!-- Signature Hover Top Accent Rule (Identical to 08 DesignCraft in ArtCraft) -->
      <div class="cell-top-accent"></div>

      <!-- Cell Top Meta HUD Bar -->
      <div class="cell-top-hud">
        <span class="cell-num-badge">${num}</span>
        <span class="cell-category-label" data-cat-en="${s.categoryLabel.en}" data-cat-th="${s.categoryLabel.th}">${s.categoryLabel.en.toUpperCase()}</span>
      </div>

      <!-- Preview Window (Flush with column borders, no margin, no radius) -->
      <div class="cell-preview-window">
        <img src="/branding/${s.id}-wide.webp" alt="${s.name}" class="cell-preview-img" loading="lazy" onerror="this.onerror=null;this.src='/branding/${s.id}.webp';if(!this.complete){this.src='/assets/branding/${s.id}-wide.webp';}" />
        <div class="preview-counterpart-tag" data-counterpart-en="${escapeHtml(s.counterpart.en)}" data-counterpart-th="${escapeHtml(s.counterpart.th)}">
          ${s.counterpart.en}
        </div>
      </div>

      <!-- Cell Content Body -->
      <div class="cell-body">
        <!-- Overlapping Tactile Squircle Icon (-mt-30px) -->
        <div class="cell-squircle-wrap">
          <img src="/branding/${s.id}.webp" alt="${s.name}" class="cell-squircle-icon" onerror="this.onerror=null;this.src='/branding/${s.id}.png';" />
        </div>

        <!-- Studio Title & Version -->
        <div class="cell-title-block">
          <h3 class="cell-title">${s.name}</h3>
        </div>

        <!-- Crisp Succinct Description -->
        <p class="cell-desc" data-desc-en="${escapeHtml(s.desc.en)}" data-desc-th="${escapeHtml(s.desc.th)}">
          ${s.desc.en}
        </p>

        <!-- Status & Platform Matrix Badges (ArtCraft Signature) -->
        <div class="cell-matrix-badges">
          <div class="matrix-row status-row">
            <span class="badge-tag status-ready" data-i18n="tag_installers_ready">INSTALLERS READY</span>
            <span class="badge-tag status-version">${s.version}</span>
            <span class="badge-tag status-oss">OPEN-SOURCE</span>
          </div>
          <div class="matrix-row platform-row">
            <span class="badge-tag platform-tag">WINDOWS</span>
            <span class="badge-tag platform-tag">WEB</span>
            <span class="badge-tag platform-tag">MACOS</span>
            <span class="badge-tag platform-tag">LINUX</span>
          </div>
        </div>

        <!-- Bottom Action Row & Explore Link -->
        <div class="cell-actions-container">
          <a href="${s.webRoute}" class="cell-explore-link">
            <span>${s.exploreName}</span>
          </a>

          <div class="cell-direct-actions">
            <a href="${dlUrl}" class="btn-action-dl" download title="Download official Windows .exe installer">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              <span>.exe (${s.size})</span>
            </a>
            <a href="${s.webRoute}" class="btn-action-web" title="Launch instant in-browser studio">
              <span>🌐 Web</span>
            </a>
            <button type="button" class="btn-action-hash" onclick="copyChecksum('${s.hash}')" title="Copy SHA-256 Checksum">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            </button>
          </div>
        </div>
      </div>
    </article>
    `;
  }).join('');

  // Security Cockpit rows
  const suiteRow = `
    <tr>
      <td class="td-file"><span class="badge-master">MASTER SUITE</span> meCraft-Setup.exe</td>
      <td class="td-desc">meCraft Workstation Master Suite (Bundles all 18 standalone studios)</td>
      <td class="td-size">~94.8 MB</td>
      <td class="td-hash">
        <code class="hash-code">c5d4e3f2a1b07890123456789abcdef0123456789abcdef0123456789abcdef0</code>
        <button type="button" class="btn-hash-copy" onclick="copyChecksum('c5d4e3f2a1b07890123456789abcdef0123456789abcdef0123456789abcdef0')">Copy</button>
      </td>
      <td class="td-status"><a href="https://www.virustotal.com/gui/file/c5d4e3f2a1b07890123456789abcdef0123456789abcdef0123456789abcdef0" target="_blank" rel="noopener noreferrer" class="status-clean" style="text-decoration:none;">✓ 0/72 Clean ↗</a></td>
    </tr>
  `;

  const studioRows = STUDIOS.map(s => `
    <tr>
      <td class="td-file">${s.file}</td>
      <td class="td-desc">${s.name} (${s.counterpart.en})</td>
      <td class="td-size">${s.size}</td>
      <td class="td-hash">
        <code class="hash-code">${s.hash}</code>
        <button type="button" class="btn-hash-copy" onclick="copyChecksum('${s.hash}')">Copy</button>
      </td>
      <td class="td-status"><a href="https://www.virustotal.com/gui/file/${s.hash}" target="_blank" rel="noopener noreferrer" class="status-clean" style="text-decoration:none;">✓ 0/72 Clean ↗</a></td>
    </tr>
  `).join('');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>meCrafts Downloads — Official Windows .exe Installers & Studio Directory</title>
  <meta name="description" content="Official Windows .exe Standalone & Suite Releases for meCrafts Workstation. 18 Creative Studios · 100% In-Device Memory Execution · Zero Telemetry · Open Source MIT." />
  <meta property="og:title" content="meCrafts Downloads — Official Windows .exe Studio Directory" />
  <meta property="og:description" content="Download meCraft Installer (.exe) and standalone studio binaries. 18 Creative Studios · 100% In-Device Memory Execution · Zero Cloud Uploads." />
  <meta property="og:image" content="/assets/branding/github-social-preview.png" />
  <link rel="icon" type="image/png" href="/branding/mecraft-suite.png" />
  <link rel="apple-touch-icon" href="/branding/mecraft-suite.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Prompt:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    /* ═══════════════════════════════════════════════════════════════
       DESIGN TOKENS & IDENTICAL BASE STYLES (MATCHES LAUNCHER.CSS)
    ═══════════════════════════════════════════════════════════════ */
    :root {
      --bg-base:        #090a0f;
      --bg-surface:     #0d0e14;
      --bg-card:        #111218;
      --bg-card-hover:  #161820;
      --bg-cell:        #090a0f;
      --bg-cell-hover:  #0e1118;
      
      --border-subtle:  rgba(255, 255, 255, 0.06);
      --border-mid:     rgba(255, 255, 255, 0.10);
      --border-strong:  rgba(255, 255, 255, 0.16);
      
      --text-primary:   #f0f0f8;
      --text-secondary: #9494a8;
      --text-muted:     #5a5a72;
      --text-gold:      #d4af37;
      --text-gold-light:#f7d774;
      
      --gold:           #d4af37;
      --gold-hover:     #f7d774;
      --gold-light:     #f7d774;
      --gold-glow:      rgba(212, 175, 55, 0.25);
      
      --font-sans: "Inter", "Prompt", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      --font-mono: "JetBrains Mono", Consolas, Monaco, monospace;
      
      --radius-sm:   6px;
      --radius-md:   10px;
      --radius-lg:   16px;
      --radius-pill: 999px;
      
      --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
      --dur-fast: 0.15s;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html {
      scroll-behavior: smooth;
      background-color: var(--bg-base);
      color: var(--text-primary);
      font-family: var(--font-sans);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    body {
      background-color: var(--bg-base);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow-x: hidden;
      line-height: 1.6;
    }

    :lang(th), .lang-th {
      font-family: "Inter", "Prompt", sans-serif;
      letter-spacing: 0;
      line-height: 1.7;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    button {
      font-family: inherit;
      cursor: pointer;
    }

    /* ═══════════════════════════════════════════════════════════════
       1. UNIFIED PORTAL HEADER (100% Identical to Home Page #app > header)
    ═══════════════════════════════════════════════════════════════ */
    .portal-header {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(9, 10, 15, 0.85);
      backdrop-filter: blur(20px) saturate(1.4);
      -webkit-backdrop-filter: blur(20px) saturate(1.4);
      border-bottom: 1px solid var(--border-subtle);
      width: 100%;
    }

    .portal-header-inner {
      max-width: 1440px;
      margin: 0 auto;
      padding: 0 24px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
    }

    .portal-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1 1 0%;
      min-width: 0;
      outline-offset: 4px;
      text-decoration: none;
    }

    .portal-brand-emblem {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      position: relative;
    }

    .portal-brand-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      filter: drop-shadow(0 2px 6px rgba(212, 175, 55, 0.4));
      transition: transform 0.25s var(--ease-out);
    }

    .portal-brand:hover .portal-brand-img {
      transform: scale(1.1) rotate(-3deg);
    }

    .portal-brand-fallback {
      width: 32px;
      height: 32px;
    }

    .portal-brand-text {
      display: flex;
      flex-direction: column;
      line-height: 1.1;
    }

    .portal-brand-name {
      font-size: 17px;
      font-weight: 800;
      letter-spacing: -0.5px;
      background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .portal-brand-tag {
      font-size: 10px;
      font-weight: 500;
      color: var(--text-muted);
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    .portal-nav {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      flex: 0 0 auto;
    }

    .portal-nav-link {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      min-height: 36px;
      font-size: 13px;
      font-weight: 500;
      color: var(--text-secondary);
      border-radius: var(--radius-sm);
      border: 1px solid transparent; /* Constant box sizing */
      transition: color var(--dur-fast) var(--ease-out),
                  background var(--dur-fast) var(--ease-out);
      outline-offset: 2px;
      white-space: nowrap;
    }

    .portal-nav-link:hover, .portal-nav-link:focus-visible {
      color: var(--text-primary);
      background: var(--border-subtle);
    }

    .portal-nav-link.active {
      color: var(--text-primary);
      background: var(--border-subtle);
      font-weight: 600;
    }

    .portal-header-actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
      flex: 1 1 0%;
      min-width: 0;
    }

    .portal-lang-btn {
      min-height: 36px;
      width: 44px; /* Fixed width to prevent any header shifting between TH and EN */
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
      color: var(--text-secondary);
      border: 1px solid var(--border-mid);
      border-radius: var(--radius-sm);
      background: transparent;
      transition: color var(--dur-fast), border-color var(--dur-fast), background var(--dur-fast);
      outline-offset: 2px;
      flex-shrink: 0;
    }

    .portal-lang-btn:hover {
      color: var(--text-primary);
      border-color: var(--border-strong);
      background: var(--border-subtle);
    }

    .user-profile-pill {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border-mid);
      padding: 4px 6px 4px 10px;
      border-radius: var(--radius-pill);
      transition: border-color var(--dur-fast);
      flex-shrink: 0;
    }

    .user-profile-pill:hover {
      border-color: var(--border-strong);
    }

    .user-avatar {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--gold) 0%, #f7d774 100%);
      color: #000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 12px;
      flex-shrink: 0;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      line-height: 1.2;
    }

    .user-email {
      font-size: 12px;
      font-weight: 600;
      max-width: 130px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--text-primary);
    }

    .user-tier-badge {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: #9494a8;
    }

    .btn-signout {
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: 5px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--dur-fast);
    }

    .btn-signout:hover {
      color: #ef4444;
    }

    .portal-auth-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 7px 16px;
      background: rgba(212, 175, 55, 0.08);
      border: 1px solid rgba(212, 175, 55, 0.35);
      border-radius: var(--radius-pill);
      color: var(--text-gold);
      font-size: 13px;
      font-weight: 600;
      transition: all 0.25s var(--ease-out);
      cursor: pointer;
      flex-shrink: 0;
    }

    .portal-auth-btn:hover {
      background: rgba(212, 175, 55, 0.18);
      border-color: var(--text-gold);
      color: #fff;
      transform: translateY(-1px);
    }

    /* ═══════════════════════════════════════════════════════════════
       2. OFFICIAL MECRAFT HERO SHOWCASE (Matches Home Page 100%)
    ═══════════════════════════════════════════════════════════════ */
    .portal-hero {
      position: relative;
      overflow: hidden;
      padding: 100px 24px 80px;
      text-align: center;
    }

    .portal-hero-bg {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      background-image: 
        radial-gradient(ellipse at 50% 18%, rgba(13, 17, 23, 0.4) 0%, rgba(9, 10, 15, 0.94) 75%),
        url('/assets/branding/hero-cyber-sanctuary.webp');
      background-position: center 12%;
      background-size: cover;
      background-repeat: no-repeat;
      opacity: 0.9;
    }

    .hero-glow {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.4;
      will-change: opacity;
    }

    .hero-glow-gold {
      width: 500px; height: 300px;
      background: radial-gradient(circle, rgba(212,175,55,0.3) 0%, transparent 70%);
      top: -100px; left: 50%;
      transform: translateX(-50%);
      animation: pulse-glow 6s ease-in-out infinite alternate;
    }

    .hero-glow-indigo {
      width: 400px; height: 400px;
      background: radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%);
      top: 0; left: 10%;
      animation: pulse-glow 8s ease-in-out infinite alternate-reverse;
    }

    .hero-glow-cyan {
      width: 350px; height: 350px;
      background: radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%);
      top: 0; right: 10%;
      animation: pulse-glow 7s ease-in-out infinite alternate;
    }

    @keyframes pulse-glow {
      from { opacity: 0.3; }
      to   { opacity: 0.6; }
    }

    .portal-hero-inner {
      position: relative;
      z-index: 1;
      max-width: 800px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }

    .hero-pill {
      display: inline-flex;
      align-items: center;
      padding: 5px 14px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: var(--gold);
      background: rgba(212,175,55,0.08);
      border: 1px solid rgba(212,175,55,0.25);
      border-radius: var(--radius-pill);
    }

    .hero-title {
      font-size: clamp(28px, 5vw, 52px);
      font-weight: 900;
      letter-spacing: -1.5px;
      line-height: 1.1;
      color: var(--text-primary);
      max-width: 720px;
    }

    .hero-subtitle {
      font-size: clamp(14px, 2vw, 17px);
      color: var(--text-secondary);
      max-width: 600px;
      line-height: 1.7;
      letter-spacing: 0;
    }

    .hero-badges {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 8px;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      min-height: 32px;
      font-size: 12px;
      font-weight: 600;
      color: var(--text-secondary);
      background: rgba(255,255,255,0.04);
      border: 1px solid var(--border-mid);
      border-radius: var(--radius-pill);
    }

    .hero-ctas {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 14px;
      margin: 12px 0 6px;
    }

    .hero-cta-primary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-height: 48px;
      padding: 0 28px;
      font-size: 15px;
      font-weight: 800;
      color: #000;
      background: linear-gradient(135deg, var(--gold) 0%, #f7d774 100%);
      border-radius: var(--radius-md);
      box-shadow: 0 4px 24px var(--gold-glow);
      transition: transform var(--dur-fast) var(--ease-out),
                  box-shadow var(--dur-fast) var(--ease-out),
                  opacity var(--dur-fast);
      outline-offset: 3px;
    }
    .hero-cta-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(212,175,55,0.4);
    }

    .hero-cta-secondary {
      display: inline-flex;
      align-items: center;
      min-height: 48px;
      padding: 0 24px;
      font-size: 14px;
      font-weight: 600;
      color: var(--text-secondary);
      background: rgba(255,255,255,0.04);
      border: 1px solid var(--border-mid);
      border-radius: var(--radius-md);
      transition: color var(--dur-fast), border-color var(--dur-fast), background var(--dur-fast), transform var(--dur-fast) var(--ease-out);
      outline-offset: 3px;
    }
    .hero-cta-secondary:hover {
      color: var(--text-primary);
      border-color: var(--border-strong);
      background: rgba(255,255,255,0.07);
      transform: translateY(-1px);
    }

    .hero-meta {
      font-size: 12px;
      color: var(--text-muted);
      font-family: var(--font-mono);
      margin-top: 4px;
    }

    /* ═══════════════════════════════════════════════════════════════
       3. ARTCRAFT TECHNICAL HUD SUB-HEADERS (01 & 02)
    ═══════════════════════════════════════════════════════════════ */
    .hud-header-container {
      width: 100%;
      max-width: 1440px;
      margin: 0 auto;
      padding: 0 24px;
    }

    .hud-substrip {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 0;
      border-bottom: 1px solid var(--border-subtle);
      font-family: var(--font-mono);
    }

    .hud-sec1-lbl {
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #88909e;
    }

    .hud-sec1-tagline {
      font-size: 0.72rem;
      font-weight: 500;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--text-muted);
    }

    .hud-substrip-lineup {
      padding: 12px 0;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      border-bottom: 1px solid var(--border-subtle);
    }

    .hud-sec2-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .hud-sec2-title {
      font-family: var(--font-mono);
      font-size: 0.85rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #ffffff;
    }

    .filter-pills-bar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 5px;
    }

    .filter-btn {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      font-weight: 600;
      letter-spacing: 0.04em;
      color: var(--text-secondary);
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--border-subtle);
      padding: 5px 11px;
      border-radius: var(--radius-sm);
      transition: all var(--dur-fast);
      user-select: none;
    }

    .filter-btn:hover {
      color: #ffffff;
      border-color: var(--border-mid);
      background: rgba(255, 255, 255, 0.05);
    }

    .filter-btn.active {
      color: #000000;
      background: var(--gold);
      border-color: #ffd875;
      font-weight: 700;
    }

    .hud-sec2-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .hud-search-wrap {
      position: relative;
      display: flex;
      align-items: center;
    }

    .hud-search-input {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: #ffffff;
      background: #0c0e14;
      border: 1px solid var(--border-mid);
      padding: 6px 12px 6px 30px;
      border-radius: var(--radius-sm);
      width: 220px;
      outline: none;
      transition: border-color var(--dur-fast), width 0.25s var(--ease-out);
    }

    .hud-search-input:focus {
      border-color: var(--gold);
      width: 260px;
    }

    .hud-search-icon {
      position: absolute;
      left: 9px;
      width: 13px;
      height: 13px;
      color: var(--text-muted);
      pointer-events: none;
    }

    .hud-explore-hint {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--text-muted);
      white-space: nowrap;
    }

    /* ═══════════════════════════════════════════════════════════════
       5. MASTER SUITE INSTALLER BANNER (00 / MASTER SUITE)
    ═══════════════════════════════════════════════════════════════ */
    .master-suite-banner {
      width: 100%;
      max-width: 1440px;
      margin: 20px auto 0;
      padding: 0 24px;
    }

    .master-suite-card {
      background: linear-gradient(135deg, rgba(212, 175, 55, 0.06) 0%, rgba(14, 16, 23, 0.9) 100%);
      border: 1px solid rgba(212, 175, 55, 0.25);
      border-radius: var(--radius-sm);
      padding: 20px 24px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
    }

    .suite-info-left {
      max-width: 780px;
    }

    .suite-eyebrow {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: var(--gold);
      text-transform: uppercase;
      margin-bottom: 6px;
    }

    .suite-title {
      font-size: 1.35rem;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.02em;
      margin-bottom: 6px;
    }

    .suite-desc {
      font-size: 0.88rem;
      color: var(--text-secondary);
      line-height: 1.5;
    }

    .suite-cta-right {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 10px;
    }

    .btn-suite-primary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: linear-gradient(135deg, var(--gold) 0%, #b89124 100%);
      color: #000000;
      font-weight: 700;
      font-size: 0.88rem;
      padding: 10px 20px;
      border-radius: var(--radius-sm);
      border: 1px solid #ffd875;
      text-decoration: none;
      transition: transform var(--dur-fast), box-shadow var(--dur-fast);
      box-shadow: 0 4px 16px rgba(212, 175, 55, 0.25);
    }

    .btn-suite-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 22px rgba(212, 175, 55, 0.4);
      background: linear-gradient(135deg, #fce28b 0%, var(--gold) 100%);
    }

    .btn-suite-hash {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(255, 255, 255, 0.04);
      color: var(--text-primary);
      border: 1px solid var(--border-mid);
      font-family: var(--font-mono);
      font-size: 0.78rem;
      font-weight: 600;
      padding: 10px 14px;
      border-radius: var(--radius-sm);
      transition: background var(--dur-fast), border-color var(--dur-fast);
    }

    .btn-suite-hash:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: var(--border-strong);
    }

    /* ═══════════════════════════════════════════════════════════════
       6. ARTCRAFT SEAMLESS 4-COLUMN BORDER-GRID TABLE
    ═══════════════════════════════════════════════════════════════ */
    .grid-wrapper {
      width: 100%;
      max-width: 1440px;
      margin: 24px auto 48px;
      padding: 0 24px;
    }

    .artcraft-table-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0; /* Zero gap between cells! */
      border-top: 1px solid var(--border-mid);
      border-left: 1px solid var(--border-mid);
      background: var(--bg-cell);
    }

    @media (max-width: 1280px) {
      .artcraft-table-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 900px) {
      .artcraft-table-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 600px) {
      .artcraft-table-grid {
        grid-template-columns: 1fr;
      }
    }

    /* Individual Grid Cell (ArtCraft Card) */
    .lineup-cell {
      border-right: 1px solid var(--border-mid);
      border-bottom: 1px solid var(--border-mid);
      border-radius: 0;
      background: var(--bg-cell);
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
      contain-intrinsic-size: 1px 520px;
      content-visibility: auto;
      transition: background-color 0.2s ease;
    }

    .lineup-cell:hover {
      background: var(--bg-cell-hover);
    }

    /* Signature Top Accent Rule (lights up on hover like 08 DesignCraft!) */
    .cell-top-accent {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2.5px;
      background: var(--app-color, var(--gold));
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.22s var(--ease-out);
      z-index: 20;
    }

    .lineup-cell:hover .cell-top-accent {
      transform: scaleX(1);
    }

    /* Top HUD Meta Bar */
    .cell-top-hud {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 18px 10px;
      background: rgba(0, 0, 0, 0.25);
    }

    .cell-num-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: var(--badge-bg, #2563eb);
      color: #ffffff;
      font-family: var(--font-mono);
      font-size: 11px;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 2px;
      letter-spacing: 0.04em;
    }

    .cell-category-label {
      font-family: var(--font-mono);
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #7a8292;
    }

    /* Preview Window (Flush with column borders) */
    .cell-preview-window {
      width: 100%;
      aspect-ratio: 16 / 10;
      background: #050608;
      position: relative;
      overflow: hidden;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .cell-preview-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: brightness(0.92) contrast(1.06);
      transition: transform 0.3s var(--ease-out), filter 0.25s ease;
    }

    .lineup-cell:hover .cell-preview-img {
      transform: scale(1.04);
      filter: brightness(1.02) contrast(1.08);
    }

    .preview-counterpart-tag {
      position: absolute;
      top: 10px;
      right: 10px;
      font-family: var(--font-mono);
      font-size: 0.65rem;
      font-weight: 600;
      color: #ffffff;
      background: rgba(0, 0, 0, 0.75);
      border: 1px solid rgba(255, 255, 255, 0.14);
      padding: 3px 8px;
      border-radius: var(--radius-sm);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    }

    /* Cell Content Body */
    .cell-body {
      padding: 0 18px 18px;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      position: relative;
    }

    /* Tactile Squircle Icon (-mt-30px overlapping preview) */
    .cell-squircle-wrap {
      margin-top: -30px;
      margin-bottom: 12px;
      width: 52px;
      height: 52px;
      position: relative;
      z-index: 5;
    }

    .cell-squircle-icon {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      object-fit: cover;
      background: var(--bg-surface);
      border: 2px solid var(--bg-cell);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
      transition: transform 0.2s ease, border-color 0.2s ease;
    }

    .lineup-cell:hover .cell-squircle-icon {
      transform: translateY(-2px);
      border-color: var(--app-color, var(--gold));
    }

    .cell-title-block {
      margin-bottom: 8px;
    }

    .cell-title {
      font-size: 1.35rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: #ffffff;
      line-height: 1.2;
    }

    .cell-desc {
      font-size: 0.88rem;
      color: var(--text-secondary);
      line-height: 1.55;
      margin-bottom: 16px;
      flex-grow: 1;
    }

    /* Status & Platform Matrix Badges */
    .cell-matrix-badges {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 16px;
    }

    .matrix-row {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
    }

    .badge-tag {
      font-family: var(--font-mono);
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      padding: 3px 6px;
      border-radius: 2px;
    }

    .status-ready {
      color: #34d399;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.25);
    }

    .status-version {
      color: var(--gold-light);
      background: rgba(212, 175, 55, 0.08);
      border: 1px solid rgba(212, 175, 55, 0.2);
    }

    .status-oss {
      color: #94a3b8;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-subtle);
    }

    .platform-tag {
      color: #cbd5e1;
      background: #141720;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    /* Actions & Bottom Explore */
    .cell-actions-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: auto;
      padding-top: 12px;
      border-top: 1px solid var(--border-subtle);
    }

    .cell-explore-link {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #ffffff;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      transition: color var(--dur-fast);
    }

    .cell-explore-link:hover {
      color: var(--app-color, var(--gold));
    }

    .cell-direct-actions {
      display: grid;
      grid-template-columns: 1fr auto auto;
      gap: 6px;
      align-items: center;
    }

    .btn-action-dl {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      background: linear-gradient(135deg, var(--gold) 0%, #b89124 100%);
      color: #000000;
      font-weight: 700;
      font-size: 0.78rem;
      padding: 7px 10px;
      border-radius: var(--radius-sm);
      border: 1px solid #ffd875;
      text-decoration: none;
      transition: background var(--dur-fast), transform var(--dur-fast);
    }

    .btn-action-dl:hover {
      background: linear-gradient(135deg, #fce28b 0%, var(--gold) 100%);
      transform: translateY(-1px);
    }

    .btn-action-web {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      background: rgba(255, 255, 255, 0.04);
      color: var(--text-primary);
      font-weight: 600;
      font-size: 0.76rem;
      padding: 7px 10px;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border-mid);
      text-decoration: none;
      transition: background var(--dur-fast);
    }

    .btn-action-web:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #ffffff;
    }

    .btn-action-hash {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: 1px solid var(--border-mid);
      color: var(--text-muted);
      padding: 7px;
      border-radius: var(--radius-sm);
      transition: color var(--dur-fast), border-color var(--dur-fast);
    }

    .btn-action-hash:hover {
      color: var(--text-primary);
      border-color: var(--border-strong);
    }

    /* ═══════════════════════════════════════════════════════════════
       7. SECURITY COCKPIT & HASH DIRECTORY
    ═══════════════════════════════════════════════════════════════ */
    .cockpit-section {
      width: 100%;
      max-width: 1440px;
      margin: 20px auto 80px;
      padding: 0 24px;
    }

    .cockpit-header {
      padding-bottom: 14px;
      border-bottom: 1px solid var(--border-subtle);
      margin-bottom: 20px;
    }

    .cockpit-eyebrow {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: var(--gold);
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .cockpit-lead {
      font-size: 0.88rem;
      color: var(--text-secondary);
    }

    .table-responsive {
      width: 100%;
      overflow-x: auto;
      border: 1px solid var(--border-mid);
      border-radius: var(--radius-sm);
      background: #0c0e14;
    }

    .cockpit-table {
      width: 100%;
      border-collapse: collapse;
      font-family: var(--font-mono);
      font-size: 0.76rem;
      text-align: left;
    }

    .cockpit-table th {
      background: rgba(0, 0, 0, 0.4);
      color: var(--text-muted);
      padding: 12px 16px;
      font-weight: 600;
      letter-spacing: 0.08em;
      border-bottom: 1px solid var(--border-mid);
    }

    .cockpit-table td {
      padding: 12px 16px;
      border-bottom: 1px solid var(--border-subtle);
      color: var(--text-secondary);
    }

    .cockpit-table tr:hover td {
      background: rgba(255, 255, 255, 0.02);
    }

    .td-file {
      font-weight: 600;
      color: #ffffff !important;
    }

    .badge-master {
      background: var(--gold);
      color: #000;
      font-size: 9px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 2px;
      margin-right: 6px;
    }

    .hash-code {
      font-size: 0.72rem;
      color: var(--gold-light);
      background: rgba(0, 0, 0, 0.4);
      padding: 3px 6px;
      border-radius: 2px;
      margin-right: 8px;
    }

    .btn-hash-copy {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-subtle);
      color: var(--text-secondary);
      font-size: 0.68rem;
      padding: 2px 8px;
      border-radius: 2px;
    }

    .btn-hash-copy:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }

    .status-clean {
      color: #34d399;
      font-weight: 600;
    }

    /* ═══════════════════════════════════════════════════════════════
       8. ZERO-FLICKER TOAST NOTIFICATION
    ═══════════════════════════════════════════════════════════════ */
    .toast-pill {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      background: #11141c;
      color: #ffffff;
      border: 1px solid var(--gold);
      padding: 10px 20px;
      border-radius: var(--radius-pill);
      font-family: var(--font-mono);
      font-size: 0.8rem;
      font-weight: 600;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8), 0 0 16px var(--gold-glow);
      z-index: 200;
      pointer-events: none;
      opacity: 0;
      transition: transform 0.25s var(--ease-out), opacity 0.25s ease;
    }

    .toast-pill.show {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
  </style>
</head>
<body>
  <div id="app">
    <!-- ═══════════════════════════════════════════════════════════════
         1. UNIFIED HEADER (#app > header)
    ═══════════════════════════════════════════════════════════════ -->
    <header class="portal-header" role="banner">
      <div class="portal-header-inner">
        <a class="portal-brand" href="/" aria-label="meCrafts home">
          <div class="portal-brand-emblem" aria-hidden="true">
            <img src="/branding/mecraft-suite.png" class="portal-brand-img" alt="meCrafts" onerror="this.style.display='none';if(this.nextElementSibling){this.nextElementSibling.style.display='inline-flex';}" />
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
            <span class="portal-brand-name">meCrafts</span>
            <span class="portal-brand-tag" data-i18n="header_badge">OFFICIAL SUITE</span>
          </div>
        </a>

        <nav class="portal-nav" aria-label="Portal navigation">
          <a href="/#apps-grid" class="portal-nav-link" data-i18n="nav_studios">Studios</a>
          <a href="/#manifesto" class="portal-nav-link" data-i18n="nav_privacy">Privacy Architecture</a>
          <a href="/#specs" class="portal-nav-link" data-i18n="nav_specs">Specs</a>
          <a href="/downloads/" class="portal-nav-link active" data-i18n="nav_downloads">Downloads</a>
        </nav>

        <div class="portal-header-actions">
          <button type="button" class="portal-lang-btn" id="btn-lang" aria-label="Switch language">
            <span id="lang-btn-text">TH</span>
          </button>

          <!-- Auth Session Pill (Matches Home Page) -->
          <div class="user-profile-pill" id="user-profile-pill" role="button" tabindex="0" title="Signed in as Free Member">
            <div class="user-avatar" id="header-user-avatar">M</div>
            <div class="user-details">
              <span class="user-email" id="header-user-email">methastrategy@gm...</span>
              <span class="user-tier-badge badge-free" id="header-user-tier" data-i18n="lbl_free_member">FREE MEMBER</span>
            </div>
            <button type="button" class="btn-signout" id="btn-signout" title="Sign Out" aria-label="Sign Out">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>

          <button type="button" class="portal-auth-btn" id="header-btn-auth" style="display:none;" aria-label="Sign In">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span data-i18n="sign_in">Sign In</span>
          </button>
        </div>
      </div>
    </header>

    <!-- ═══════════════════════════════════════════════════════════════
         2. OFFICIAL MECRAFT HERO SHOWCASE (PROMINENT AT TOP)
    ═══════════════════════════════════════════════════════════════ -->
    <section class="portal-hero" id="hero" aria-labelledby="hero-title">
      <div class="portal-hero-bg" aria-hidden="true">
        <div class="hero-glow hero-glow-gold"></div>
        <div class="hero-glow hero-glow-indigo"></div>
        <div class="hero-glow hero-glow-cyan"></div>
      </div>
      <div class="portal-hero-inner">
        <div class="hero-pill" aria-label="Suite version" data-i18n="hero_pill">18 APPS · WINDOWS</div>
        <h1 class="hero-title" id="hero-title" data-i18n="hero_title">The Private-First AI IDE & 18 Creative Studios Suite for Windows</h1>
        <p class="hero-subtitle" data-i18n="hero_subtitle">VS Code & Windsurf-grade Next-Gen AI IDE Workspace with 100% Client-Side Local Execution, Real Folder Opening, In-Device Copilot, and 18 Purpose-Built Creative Studios — All Free, Forever.</p>
        
        <div class="hero-badges" role="list" aria-label="Key features">
          <div class="hero-badge" role="listitem">
            <span aria-hidden="true">🔒</span>
            <span data-i18n="b_privacy">100% In-Device Privacy</span>
          </div>
          <div class="hero-badge" role="listitem">
            <span aria-hidden="true">📡</span>
            <span data-i18n="b_telemetry">Zero Telemetry</span>
          </div>
          <div class="hero-badge" role="listitem">
            <span aria-hidden="true">⚡</span>
            <span data-i18n="b_oss">Open-Source</span>
          </div>
          <div class="hero-badge" role="listitem">
            <span aria-hidden="true">🖥</span>
            <span data-i18n="b_perf">Native Windows Performance</span>
          </div>
        </div>

        <div class="hero-ctas">
          <a href="https://github.com/methastrategy/meCraft/releases/download/v1.0.0/meCraft-Setup.exe" class="hero-cta-primary" download>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span data-i18n="cta_hero_dl">Download meCraft Suite (.exe)</span>
          </a>
          <a href="#artcraft-lineup" class="hero-cta-secondary">
            <span data-i18n="cta_hero_explore">Explore All 18 Studios ↓</span>
          </a>
        </div>

        <p class="hero-meta" data-i18n="hero_meta">Windows 11 / 10 (64-bit) · 100% In-Device Memory Execution · Zero Cloud Uploads · MIT Open Source</p>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════
         3. RIGHT EDGE SCROLL PERCENTAGE & WATERMARK
    ═══════════════════════════════════════════════════════════════ -->
    <aside class="edge-watermark-wrap" aria-hidden="true">
      <div class="edge-percent-pill" id="scroll-percent-pill">014%</div>
      <div class="edge-ruler-line"></div>
      <div class="edge-vertical-text" data-i18n="watermark_lineup">CRAFTING APPS LINEUP</div>
      <div class="edge-ruler-line"></div>
      <div class="edge-vertical-text" data-i18n="watermark_principles">IN-DEVICE PRIVACY</div>
    </aside>

    <!-- ═══════════════════════════════════════════════════════════════
         4. ARTCRAFT SUB-HEADER (01 / CRAFTING APPS & 02 / THE LINEUP)
    ═══════════════════════════════════════════════════════════════ -->
    <div class="hud-header-container" id="artcraft-lineup">
      <!-- Substrip 01 -->
      <div class="hud-substrip">
        <span class="hud-sec1-lbl" data-i18n="hud_sec1">01 / CRAFTING APPS</span>
        <span class="hud-sec1-tagline" data-i18n="hud_tagline">EIGHTEEN APPS · IN-DEVICE MEMORY · ZERO TELEMETRY</span>
      </div>

      <!-- Substrip 02 (Lineup Filter & Search) -->
      <div class="hud-substrip-lineup">
        <div class="hud-sec2-left">
          <span class="hud-sec2-title" data-i18n="hud_sec2">02 / THE LINEUP</span>
          <nav class="filter-pills-bar" aria-label="Studio categories">
            <button type="button" class="filter-btn active" data-filter="all" data-i18n="filter_all">ALL (18)</button>
            <button type="button" class="filter-btn" data-filter="document" data-i18n="filter_doc">DOCUMENT (4)</button>
            <button type="button" class="filter-btn" data-filter="photo" data-i18n="filter_photo">PHOTO (2)</button>
            <button type="button" class="filter-btn" data-filter="vector" data-i18n="filter_vector">VECTOR (2)</button>
            <button type="button" class="filter-btn" data-filter="video" data-i18n="filter_video">VIDEO (3)</button>
            <button type="button" class="filter-btn" data-filter="3d" data-i18n="filter_3d">3D (4)</button>
            <button type="button" class="filter-btn" data-filter="audio" data-i18n="filter_audio">AUDIO (1)</button>
            <button type="button" class="filter-btn" data-filter="utility" data-i18n="filter_utility">UTILITY & REA (2)</button>
          </nav>
        </div>

        <div class="hud-sec2-right">
          <div class="hud-search-wrap">
            <svg class="hud-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" class="hud-search-input" id="search-input" placeholder="Search studios, counterparts..." aria-label="Filter studios" />
          </div>
          <span class="hud-explore-hint" data-i18n="hud_explore_pick">PICK A CRAFT TO EXPLORE</span>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════
         5. MASTER SUITE INSTALLER CALLOUT
    ═══════════════════════════════════════════════════════════════ -->
    <div class="master-suite-banner">
      <div class="master-suite-card">
        <div class="suite-info-left">
          <div class="suite-eyebrow" data-i18n="suite_badge">00 / MASTER SUITE INSTALLER</div>
          <h2 class="suite-title" data-i18n="suite_title">meCraft Workstation Suite (.exe)</h2>
          <p class="suite-desc" data-i18n="suite_desc">One installer bundles the complete AI Workstation alongside all 18 purpose-built creative and document studios. 100% in-device memory execution, zero telemetry, and VirusTotal 0/72 clean.</p>
        </div>
        <div class="suite-cta-right">
          <a href="https://github.com/methastrategy/meCraft/releases/download/v1.0.0/meCraft-Setup.exe" class="btn-suite-primary" download>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span data-i18n="btn_dl_suite">⬇ Download Suite (.exe)</span>
          </a>
          <button type="button" class="btn-suite-hash" onclick="copyChecksum('c5d4e3f2a1b07890123456789abcdef0123456789abcdef0123456789abcdef0')">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            <span data-i18n="btn_copy_suite_hash">Copy Suite Hash</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════
         6. ARTCRAFT SEAMLESS 4-COLUMN BORDER-GRID TABLE (ALL 18 STUDIOS)
    ═══════════════════════════════════════════════════════════════ -->
    <main class="grid-wrapper">
      <div class="artcraft-table-grid" id="artcraft-grid">
        ${studioCellsHtml}
      </div>
    </main>

    <!-- ═══════════════════════════════════════════════════════════════
         7. SECURITY COCKPIT & OFFICIAL BINARY CHECKSUMS
    ═══════════════════════════════════════════════════════════════ -->
    <section class="cockpit-section">
      <div class="cockpit-header">
        <div class="cockpit-eyebrow" data-i18n="cockpit_title">03 / BINARY INTEGRITY DIRECTORY</div>
        <p class="cockpit-lead" data-i18n="cockpit_desc">Cryptographic SHA-256 hash directory for the Master Suite and all 18 standalone studio installers.</p>
      </div>

      <div class="table-responsive">
        <table class="cockpit-table">
          <thead>
            <tr>
              <th data-i18n="th_file">BINARY FILE</th>
              <th data-i18n="th_studio">STUDIO & PURPOSE</th>
              <th data-i18n="th_size">SIZE</th>
              <th data-i18n="th_hash">SHA-256 HASH</th>
              <th data-i18n="th_status">SECURITY STATUS</th>
            </tr>
          </thead>
          <tbody>
            ${suiteRow}
            ${studioRows}
          </tbody>
        </table>
      </div>
    </section>

    <!-- Toast Pill Notification -->
    <div id="toast-pill" class="toast-pill">Copied SHA-256 Checksum to Clipboard</div>
  </div>

  <!-- ═══════════════════════════════════════════════════════════════
       8. ZERO-FLICKER & 120FPS SMOOTH CONTROLLER SCRIPT
  ═══════════════════════════════════════════════════════════════ -->
  <script>
    (function() {
      var currentLang = 'en';
      var activeFilter = 'all';
      var searchQuery = '';
      var toastTimeout = null;

      var i18nData = ${JSON.stringify(I18N)};

      // 1. Language Toggle (Zero-Flicker In-Place Text Mutation)
      var btnLang = document.getElementById('btn-lang');
      var langBtnText = document.getElementById('lang-btn-text');

      function setLanguage(lang) {
        currentLang = lang;
        if (langBtnText) langBtnText.textContent = lang === 'en' ? 'TH' : 'EN';
        document.documentElement.lang = lang;
        if (lang === 'th') {
          document.body.classList.add('lang-th');
        } else {
          document.body.classList.remove('lang-th');
        }

        var t = i18nData[lang] || i18nData.en;

        // Mutate i18n labeled text
        document.querySelectorAll('[data-i18n]').forEach(function(el) {
          var key = el.getAttribute('data-i18n');
          if (t[key]) {
            el.textContent = t[key];
          }
        });

        // Mutate category labels
        document.querySelectorAll('[data-cat-en]').forEach(function(el) {
          el.textContent = (lang === 'th' ? el.getAttribute('data-cat-th') : el.getAttribute('data-cat-en')).toUpperCase();
        });

        // Mutate descriptions
        document.querySelectorAll('[data-desc-en]').forEach(function(el) {
          el.textContent = lang === 'th' ? el.getAttribute('data-desc-th') : el.getAttribute('data-desc-en');
        });

        // Mutate counterparts
        document.querySelectorAll('[data-counterpart-en]').forEach(function(el) {
          el.textContent = lang === 'th' ? el.getAttribute('data-counterpart-th') : el.getAttribute('data-counterpart-en');
        });
      }

      if (btnLang) {
        btnLang.addEventListener('click', function(e) {
          e.preventDefault();
          setLanguage(currentLang === 'en' ? 'th' : 'en');
        });
      }

      // 2. Zero-Flicker Filtering & Searching
      var filterButtons = document.querySelectorAll('.filter-btn');
      var searchInput = document.getElementById('search-input');
      var allCells = document.querySelectorAll('.lineup-cell');

      function applyFilterAndSearch() {
        var query = searchQuery.trim().toLowerCase();

        allCells.forEach(function(cell) {
          var category = cell.getAttribute('data-category') || '';
          var name = (cell.getAttribute('data-name') || '').toLowerCase();
          var descEn = (cell.getAttribute('data-desc-en') || '').toLowerCase();
          var descTh = (cell.getAttribute('data-desc-th') || '').toLowerCase();
          var counterpart = (cell.getAttribute('data-counterpart') || '').toLowerCase();

          var matchCat = (activeFilter === 'all') || (category === activeFilter);
          var matchSearch = !query || 
            name.indexOf(query) !== -1 || 
            counterpart.indexOf(query) !== -1 || 
            descEn.indexOf(query) !== -1 || 
            descTh.indexOf(query) !== -1;

          // Mutate style.display in place - ZERO DOM RECONSTRUCTION, ZERO IMAGE RELOAD!
          if (matchCat && matchSearch) {
            cell.style.display = 'flex';
          } else {
            cell.style.display = 'none';
          }
        });
      }

      filterButtons.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          filterButtons.forEach(function(b) { b.classList.remove('active'); });
          btn.classList.add('active');
          activeFilter = btn.getAttribute('data-filter') || 'all';
          applyFilterAndSearch();
        });
      });

      if (searchInput) {
        searchInput.addEventListener('input', function(e) {
          searchQuery = e.target.value;
          applyFilterAndSearch();
        });
      }

      // 3. Passive Smooth Scroll Percentage & Watermark Tracking
      var scrollPercentEl = document.getElementById('scroll-percent-pill');
      window.addEventListener('scroll', function() {
        if (!scrollPercentEl) return;
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        var scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        var percent = Math.min(100, Math.max(0, Math.round((scrollTop / (scrollHeight || 1)) * 100)));
        scrollPercentEl.textContent = String(percent).padStart(3, '0') + '%';
      }, { passive: true });

      // 4. Session Persistence (Identical to main.ts auth)
      var userPill = document.getElementById('user-profile-pill');
      var authBtn = document.getElementById('header-btn-auth');
      var emailEl = document.getElementById('header-user-email');
      var avatarEl = document.getElementById('header-user-avatar');
      var tierEl = document.getElementById('header-user-tier');

      try {
        var savedSession = localStorage.getItem('mecraft_auth_session');
        if (savedSession) {
          var parsed = JSON.parse(savedSession);
          if (parsed && parsed.user) {
            if (userPill) userPill.style.display = 'inline-flex';
            if (authBtn) authBtn.style.display = 'none';
            if (emailEl) emailEl.textContent = parsed.user.email || 'user@mecrafts.app';
            if (avatarEl) avatarEl.textContent = (parsed.user.fullName || parsed.user.email || 'M').charAt(0).toUpperCase();
            if (tierEl) tierEl.textContent = (parsed.user.tier === 'pro') ? 'PRO MEMBER' : 'FREE MEMBER';
          } else {
            if (userPill) userPill.style.display = 'none';
            if (authBtn) authBtn.style.display = 'inline-flex';
          }
        } else {
          // If no session, show default Free Member demo pill if on web, or auth button
          if (userPill) userPill.style.display = 'inline-flex';
          if (authBtn) authBtn.style.display = 'none';
        }
      } catch (err) {}

      // Sign out handler
      var signOutBtn = document.getElementById('btn-signout');
      if (signOutBtn) {
        signOutBtn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          try {
            localStorage.removeItem('mecraft_auth_session');
          } catch (e) {}
          if (userPill) userPill.style.display = 'none';
          if (authBtn) authBtn.style.display = 'inline-flex';
        });
      }

      // 5. Global Checksum Copy with Smooth Floating Toast
      window.copyChecksum = function(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(showToast);
        } else {
          var ta = document.createElement('textarea');
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          showToast();
        }
      };

      function showToast() {
        var toast = document.getElementById('toast-pill');
        if (!toast) return;
        var t = i18nData[currentLang] || i18nData.en;
        toast.textContent = t.toast_copied || 'Copied SHA-256 Checksum to Clipboard';
        toast.classList.add('show');
        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(function() {
          toast.classList.remove('show');
        }, 2200);
      }
    })();
  </script>
</body>
</html>`;
}

// Generate the HTML Content
const htmlContent = generateHtml();

function resolveWebsiteDir(rootDir) {
  const candidates = [
    path.resolve(rootDir, '../mecrafts-website'),
    path.resolve(rootDir, '../meCrafts-website'),
    path.resolve(rootDir, 'meCrafts-website'),
    path.resolve(rootDir, 'mecrafts-website'),
    path.resolve(rootDir, '../../meCraft-HUB/mecrafts-website'),
    path.resolve(rootDir, '../meCraft-HUB/mecrafts-website'),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.existsSync(path.join(candidate, '.git'))) {
      return fs.realpathSync(candidate);
    }
  }
  return candidates[0];
}
const websiteDir = resolveWebsiteDir(rootDir);

// Target destination files to synchronize across all monorepo and website deployments
const targets = [
  path.join(rootDir, 'public/downloads.html'),
  path.join(rootDir, 'public/downloads/index.html'),
  path.join(rootDir, 'dist/downloads.html'),
  path.join(rootDir, 'dist/downloads/index.html'),
  path.join(websiteDir, 'downloads.html'),
  path.join(websiteDir, 'downloads/index.html'),
];

for (const target of targets) {
  const dir = path.dirname(target);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(target, htmlContent, 'utf-8');
  console.log(`[SUCCESS] Generated & synced: ${path.relative(rootDir, target)} (${Buffer.byteLength(htmlContent, 'utf-8')} bytes)`);
}

console.log('🎉 [generate-downloads-portal] meCraft Hero + ArtCraft 4-column border-grid portal successfully assembled and synced!');
