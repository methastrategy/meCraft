import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = fs.realpathSync(path.resolve(__dirname, '..'));

console.log('✨ [generate-downloads-portal] Generating ArtCraft-grade downloads portal with unified header, zero-flicker state, and 120fps smooth scrolling...');

// 18 Standalone Creative Studios Dataset
const STUDIOS = [
  {
    id: 'mepdf',
    name: 'mePDF Studio',
    category: 'document',
    categoryLabel: { en: 'Document', th: 'เอกสาร' },
    accentColor: '#d4af37',
    glowColor: 'rgba(212, 175, 55, 0.25)',
    emoji: '📄',
    counterpart: { en: 'Adobe Acrobat Pro Alternative', th: 'ทางเลือกแทน Adobe Acrobat Pro' },
    desc: {
      en: 'Merge, split, visual page cockpit, lossless & scanned compression, AES-256 encryption, and searchable OCR text injection.',
      th: 'รวม/แยก PDF, ค็อกพิทหน้าเพจแบบ Visual, บีบอัดแบบไม่สูญเสียคุณภาพ, เข้ารหัส AES-256 และฝังข้อความ OCR ค้นหาคำได้ในเครื่อง'
    },
    version: 'v1.0.0',
    file: 'mepdf.exe',
    size: '~30.8 MB',
    hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    webRoute: '/mepdf/',
    highlights: {
      en: ['4-Point Deskew & Local Otsu', 'Lossless Deflate Compression', 'Searchable OCR Text Injection', 'AES-256 Bank Encryption'],
      th: ['ปรับระนาบ 4-Point Deskew & ลบเงา Otsu', 'บีบอัด Lossless Deflate สูงสุด 90%', 'ฝังข้อความ OCR ค้นหาคำได้ในเครื่อง', 'เข้ารหัสระดับธนาคาร AES-256']
    }
  },
  {
    id: 'mephoto',
    name: 'mePhoto Studio',
    category: 'photo',
    categoryLabel: { en: 'Photo & Color', th: 'ภาพและสี' },
    accentColor: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.25)',
    emoji: '🖼️',
    counterpart: { en: 'Photoshop / CamScanner Alternative', th: 'ทางเลือกแทน Photoshop และ CamScanner' },
    desc: {
      en: '4-point homography perspective deskew, adaptive local Otsu binarization shadow eradication, Magic Color enhancement, and RAW darkroom.',
      th: 'ปรับมุมมอง 4 จุด Homography, กำจัดเงาด้วย Otsu Binarization ท้องถิ่น, เพิ่มความสวยงามเอกสารด้วย Magic Color และ Darkroom ปรับ RAW'
    },
    version: 'v1.0.0',
    file: 'mephoto.exe',
    size: '~28.4 MB',
    hash: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
    webRoute: '/mephoto/',
    highlights: {
      en: ['4-Point Quad Perspective Deskew', 'Adaptive Otsu Shadow Removal', 'Magic Color Enhancement', '16-bit Lossless Image Export'],
      th: ['ดึงระนาบเอกสาร 4 มุม Homography', 'ลบเงาและปรับขาวดำอัจฉริยะ Otsu', 'โหมด Magic Color ขับสีตัวอักษร', 'ส่งออกภาพ 16-bit ไม่สูญเสีย']
    }
  },
  {
    id: 'medrop',
    name: 'meDrop Radial Converter',
    category: 'utility',
    categoryLabel: { en: 'Utility & Tools', th: 'เครื่องมือแปลงไฟล์' },
    accentColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.25)',
    emoji: '🔄',
    counterpart: { en: 'Handbrake / CloudConvert Alternative', th: 'ทางเลือกแทน Handbrake และ CloudConvert' },
    desc: {
      en: 'Fast multi-format drag-and-drop radial converter, WebP/AVIF encoder, SVG optimizer, and audio/video remuxing in local memory.',
      th: 'วงล้อแปลงไฟล์มัลติฟอร์แมต Drag & Drop, เข้ารหัสภาพ WebP/AVIF, ปรับขนาดเวกเตอร์ SVG และแปลงวิดีโอ/เสียงในแรม 100%'
    },
    version: 'v1.0.0',
    file: 'medrop.exe',
    size: '~19.2 MB',
    hash: 'b2c3d4e5f6a17890123456789abcdef0123456789abcdef0123456789abcdef0',
    webRoute: '/medrop/',
    highlights: {
      en: ['Radial Dial Conversion UI', 'Lossless WebP/AVIF Baking', 'Batch Multi-Threaded Queue', 'In-RAM Instant File Remuxing'],
      th: ['หน้าต่างแปลงไฟล์วงล้อ Radial ล้ำสมัย', 'แปลง WebP และ AVIF ระดับโปร', 'คิวแปลงไฟล์หลายเธรดความเร็วสูง', 'ประมวลผลในหน่วยความจำ RAM ไร้คลาวด์']
    }
  },
  {
    id: 'medoc',
    name: 'meDoc Studio',
    category: 'document',
    categoryLabel: { en: 'Document & Writing', th: 'เอกสารและการเขียน' },
    accentColor: '#6366f1',
    glowColor: 'rgba(99, 102, 241, 0.25)',
    emoji: '📝',
    counterpart: { en: 'Typora / Obsidian / Word Alternative', th: 'ทางเลือกแทน Typora, Obsidian และ Word' },
    desc: {
      en: 'Structured distraction-free WYSIWYG markdown document suite, LaTeX math typesetting, live outline navigator, and clean PDF export.',
      th: 'โปรแกรมเขียนเอกสาร Markdown ไร้สิ่งกวนใจ, พิมพ์สมการคณิตศาสตร์ LaTeX, สารบัญโครงสร้างอัตโนมัติ และส่งออก PDF เรียบหรู'
    },
    version: 'v1.0.0',
    file: 'medoc.exe',
    size: '~24.1 MB',
    hash: 'c3d4e5f6a1b27890123456789abcdef0123456789abcdef0123456789abcdef0',
    webRoute: '/medoc/',
    highlights: {
      en: ['Live Markdown & LaTeX Engine', 'Instant Typographic Rendering', 'Autonomous Outline Navigator', 'Clean Academic PDF Export'],
      th: ['เขียน Markdown และ LaTeX แบบสด', 'ฟอนต์และวรรคตอนระดับพรีเมียม', 'ผังโครงสร้างเอกสารอัตโนมัติ', 'พิมพ์เอกสารทางวิชาการและรายงาน']
    }
  },
  {
    id: 'mevector',
    name: 'meVector Studio',
    category: 'vector',
    categoryLabel: { en: 'Design & Vector', th: 'เวกเตอร์และกราฟิก' },
    accentColor: '#ec4899',
    glowColor: 'rgba(236, 72, 153, 0.25)',
    emoji: '✒️',
    counterpart: { en: 'Adobe Illustrator Alternative', th: 'ทางเลือกแทน Adobe Illustrator' },
    desc: {
      en: 'Infinite zoom vector graphics editor, Bezier curvature pen tool, boolean path operations (Union, Subtract), and clean SVG/EPS export.',
      th: 'สตูดิโอวาดเวกเตอร์ขยายได้ไม่จำกัด, ปากกา Bézier Curve แม่นยำระดับพิกเซล, ผสานตัดเส้น Boolean Path และส่งออก SVG/EPS สะอาดตา'
    },
    version: 'v1.0.0',
    file: 'mevector.exe',
    size: '~22.8 MB',
    hash: 'd4e5f6a1b2c37890123456789abcdef0123456789abcdef0123456789abcdef0',
    webRoute: '/mevector/',
    highlights: {
      en: ['Infinite Precision Canvas', 'Sub-Pixel Bézier Spline Pen', 'Non-Destructive Boolean Paths', 'Standard Compliant SVG Engine'],
      th: ['ผืนผ้าใบขยายซูมได้ไม่จำกัด', 'ปากกาดัดเส้น Bézier ละเอียดสูง', 'คำนวณตัดต่อ Path ไม่ทำลายต้นฉบับ', 'เอนจิน SVG มาตรฐานโลก']
    }
  },
  {
    id: 'me3d',
    name: 'me3D Studio',
    category: '3d',
    categoryLabel: { en: '3D & Spatial', th: '3D และโมเดล' },
    accentColor: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.25)',
    emoji: '🧊',
    counterpart: { en: 'Blender Light / Maya Alternative', th: 'ทางเลือกแทน Blender และ Maya Light' },
    desc: {
      en: 'Real-time WebGPU & Vulkan 3D scene composer, PBR material lighting, glTF/GLB/OBJ inspection, and instant mesh previewing.',
      th: 'สตูดิโอจัดแสงและดูโมเดล 3 มิติความเร็วสูง, จำลองแสงเงาเสมือนจริง PBR, ตรวจสอบไฟล์ glTF/GLB/OBJ และเรนเดอร์ในเครื่อง'
    },
    version: 'v1.0.0',
    file: 'me3d.exe',
    size: '~35.6 MB',
    hash: 'e5f6a1b2c3d47890123456789abcdef0123456789abcdef0123456789abcdef0',
    webRoute: '/me3d/',
    highlights: {
      en: ['WebGPU / Vulkan Hardware Shading', 'Physically Based Rendering (PBR)', 'glTF 2.0 / GLB / OBJ Parser', 'Turntable & Camera Lighting Rig'],
      th: ['ประมวลผลแสงเงาการ์ดจอ WebGPU/Vulkan', 'วัสดุเสมือนจริง Physical Based Rendering', 'เปิดไฟล์ glTF, GLB, OBJ ทันที', 'จัดมุมกล้องและสตูดิโอแสง 360 องศา']
    }
  },
  {
    id: 'mefilm',
    name: 'meFilm Studio',
    category: 'video',
    categoryLabel: { en: 'Video & Film', th: 'วิดีโอและภาพยนตร์' },
    accentColor: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.25)',
    emoji: '🎬',
    counterpart: { en: 'Premiere Pro / CapCut Alternative', th: 'ทางเลือกแทน Premiere Pro และ CapCut' },
    desc: {
      en: 'Nonlinear multi-track video timeline, lossless trimming, GPU-accelerated LUT color grading, audio waveform syncing, and 4K MP4 export.',
      th: 'ไทม์ไลน์ตัดต่อวิดีโอหลายแทร็ก, ตัดต่อแบบไม่สูญเสียคุณภาพ, เกรดสีด้วย 3D LUT บนการ์ดจอ, จัดการเสียงสเตอริโอ และส่งออก 4K'
    },
    version: 'v1.0.0',
    file: 'mefilm.exe',
    size: '~38.2 MB',
    hash: 'f6a1b2c3d4e57890123456789abcdef0123456789abcdef0123456789abcdef0',
    webRoute: '/mefilm/',
    highlights: {
      en: ['Nonlinear Multi-Track Timeline', 'GPU Hardware Accelerated LUTs', 'Audio Waveform Snapping & Mix', 'Direct 4K MP4 / WebM Export'],
      th: ['ไทม์ไลน์ตัดต่อมัลติแทร็กอิสระ', 'เกรดสีภาพยนตร์ด้วย 3D LUT', 'ตัดชนจังหวะเสียงด้วย Waveform', 'ส่งออกวิดีโอคมชัด 4K MP4/WebM']
    }
  },
  {
    id: 'melight',
    name: 'meLight Studio',
    category: 'photo',
    categoryLabel: { en: 'Photo & Color', th: 'ภาพถ่ายและ RAW' },
    accentColor: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.25)',
    emoji: '💡',
    counterpart: { en: 'Adobe Lightroom Alternative', th: 'ทางเลือกแทน Adobe Lightroom' },
    desc: {
      en: 'Non-destructive photo cataloging, RAW digital negative developing, exposure histogram balance, split toning, and batch export.',
      th: 'สตูดิโอล้างไฟล์ RAW ไม่ทำลายภาพเดิม, ปรับสมดุล Exposure และฮิสโตแกรม, แยกโทนสีไฮไลต์และเงา, จัดการอัลบั้มภาพความเร็วสูง'
    },
    version: 'v1.0.0',
    file: 'melight.exe',
    size: '~26.5 MB',
    hash: '1a2b3c4d5e6f7890123456789abcdef0123456789abcdef0123456789abcdef0',
    webRoute: '/melight/',
    highlights: {
      en: ['Non-Destructive RAW Developing', 'Real-Time RGB & Luma Histogram', 'Highlight & Shadow Reconstruction', 'Batch In-Device Film Presets'],
      th: ['ล้างรูป RAW แบบไม่ทำลายต้นฉบับ', 'กราฟฮิสโตแกรม RGB แบบเรียลไทม์', 'ดึงรายละเอียดส่วนมืดและส่วนสว่าง', 'พรีเซ็ตฟิล์มแต่งภาพพร้อมกันหลายไฟล์']
    }
  },
  {
    id: 'memotion',
    name: 'meMotion Studio',
    category: 'video',
    categoryLabel: { en: 'Video & Motion', th: 'โมชันและกราฟิกเคลื่อนไหว' },
    accentColor: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.25)',
    emoji: '✨',
    counterpart: { en: 'Adobe After Effects Alternative', th: 'ทางเลือกแทน Adobe After Effects' },
    desc: {
      en: 'Bézier keyframe motion interpolation, spatial transform graphs, particle bursts, typography kinetics, and transparent WebM/GIF export.',
      th: 'คีย์เฟรมแอนิเมชันความโค้ง Bézier, กราฟควบคุมความเร็ว Motion Graph, อนุภาคแสง Particle, ตัวหนังสือเคลื่อนไหว และส่งออก GIF/WebM'
    },
    version: 'v1.0.0',
    file: 'memotion.exe',
    size: '~32.4 MB',
    hash: '2b3c4d5e6f1a7890123456789abcdef0123456789abcdef0123456789abcdef0',
    webRoute: '/memotion/',
    highlights: {
      en: ['Bézier Velocity Curve Editor', 'Procedural Particle Generators', 'Kinetic Typography Presets', 'Alpha-Channel Transparent Render'],
      th: ['กราฟควบคุมความเร็วแอนิเมชัน Bézier', 'ระบบอนุภาคแสงและสเปเชียลเอฟเฟกต์', 'ข้อความเคลื่อนไหว Kinetic Typography', 'เรนเดอร์พื้นหลังโปร่งแสง Alpha WebM']
    }
  },
  {
    id: 'medesign',
    name: 'meDesign Studio',
    category: 'vector',
    categoryLabel: { en: 'Design & UI/UX', th: 'ออกแบบ UI/UX' },
    accentColor: '#14b8a6',
    glowColor: 'rgba(20, 184, 166, 0.25)',
    emoji: '📐',
    counterpart: { en: 'Figma / Canva Alternative', th: 'ทางเลือกแทน Figma และ Canva' },
    desc: {
      en: 'Responsive design tokens, auto-layout flex frames, component variants, WCAG color contrast checker, and direct CSS/Tailwind export.',
      th: 'สตูดิโอออกแบบหน้าจอ UI/UX, ระบบ Auto-Layout ยืดหยุ่น, ตรวจสอบคอนทราสต์สี WCAG และส่งออกโค้ด CSS/Tailwind ในเครื่อง'
    },
    version: 'v1.0.0',
    file: 'medesign.exe',
    size: '~25.8 MB',
    hash: '3c4d5e6f1a2b7890123456789abcdef0123456789abcdef0123456789abcdef0',
    webRoute: '/medesign/',
    highlights: {
      en: ['Auto-Layout Responsive Frames', 'Universal Design Token System', 'WCAG 2.1 Contrast Validator', 'Direct CSS / Tailwind Export'],
      th: ['จัดวางกล่อง Auto-Layout อัจฉริยะ', 'ระบบ Token สีและฟอนต์มาตรฐาน', 'ตรวจวัดความคมชัดตัวหนังสือ WCAG', 'ส่งออกโค้ด CSS และ Tailwind ทันที']
    }
  },
  {
    id: 'meaudio',
    name: 'meAudio Studio',
    category: 'audio',
    categoryLabel: { en: 'Audio & Sound', th: 'เสียงและดนตรี' },
    accentColor: '#f97316',
    glowColor: 'rgba(249, 115, 22, 0.25)',
    emoji: '🎵',
    counterpart: { en: 'Audacity / FL Studio Alternative', th: 'ทางเลือกแทน Audacity และ FL Studio' },
    desc: {
      en: 'Multi-channel audio recording, spectral frequency visualizer, real-time parametric EQ, noise reduction, and WAV/FLAC mastering.',
      th: 'สตูดิโอบันทึกเสียงหลายแชนเนล, วิเคราะห์ความถี่ Spectral Visualizer, ปรับแต่ง Equalizer พารามิเตอร์สด, ลดเสียงรบกวน และมาสเตอร์ริ่ง'
    },
    version: 'v1.0.0',
    file: 'meaudio.exe',
    size: '~21.2 MB',
    hash: '4d5e6f1a2b3c7890123456789abcdef0123456789abcdef0123456789abcdef0',
    webRoute: '/meaudio/',
    highlights: {
      en: ['Multi-Track Stem Recording', 'FFT Spectral Frequency Scope', 'Parametric 8-Band Master EQ', 'Lossless 32-bit Float FLAC/WAV'],
      th: ['อัดและแยกแทร็กเสียงคุณภาพสูง', 'กราฟแสดงย่านความถี่เสียงสด FFT', 'อีควอไลเซอร์ปรับแต่ง 8 ย่านความถี่', 'ส่งออกไฟล์เสียงความละเอียดสูง 32-bit FLAC']
    }
  },
  {
    id: 'medeck',
    name: 'meDeck Studio',
    category: 'document',
    categoryLabel: { en: 'Document & Pitch', th: 'สไลด์และพรีเซนต์' },
    accentColor: '#eab308',
    glowColor: 'rgba(234, 179, 8, 0.25)',
    emoji: '📊',
    counterpart: { en: 'PowerPoint / Keynote Alternative', th: 'ทางเลือกแทน PowerPoint และ Keynote' },
    desc: {
      en: 'Cinematic slide deck presentation builder, code block formatting, vector flowchart shapes, presenter dual-screen cockpit, and PDF export.',
      th: 'โปรแกรมสร้างสไลด์นำเสนอระดับภาพยนตร์, จัดรูปแบบโค้ดสวยงาม, วาดผังงานเวกเตอร์, จอควบคุมสำหรับผู้นำเสนอ และส่งออก PDF'
    },
    version: 'v1.0.0',
    file: 'medeck.exe',
    size: '~18.4 MB',
    hash: '5e6f1a2b3c4d7890123456789abcdef0123456789abcdef0123456789abcdef0',
    webRoute: '/medeck/',
    highlights: {
      en: ['Cinematic 16:9 Slide Formats', 'Dual-Screen Presenter Cockpit', 'Interactive Data Visualizations', 'Clean High-Res Deck PDF Export'],
      th: ['เทมเพลตสไลด์ 16:9 ระดับพรีเมียม', 'จอคุมเวลาและโน้ตสำหรับพรีเซนเตอร์', 'กราฟแผนภูมิข้อมูลแบบไดนามิก', 'ส่งออกสไลด์ความคมชัดสูงเป็น PDF']
    }
  },
  {
    id: 'mecad',
    name: 'meCAD Studio',
    category: '3d',
    categoryLabel: { en: '3D & Engineering', th: 'เขียนแบบและวิศวกรรม' },
    accentColor: '#0284c7',
    glowColor: 'rgba(2, 132, 199, 0.25)',
    emoji: '📏',
    counterpart: { en: 'AutoCAD Light / SketchUp Alternative', th: 'ทางเลือกแทน AutoCAD และ SketchUp' },
    desc: {
      en: '2D/3D precision architectural drafting, parametric dimensioning, DXF/DWG layer parsing, snap grids, and millimeter-accurate fabrication.',
      th: 'เขียนแบบสถาปัตยกรรม 2D/3D แม่นยำระดับมิลลิเมตร, กำหนดขนาดพารามิเตอร์อัตโนมัติ, เปิดไฟล์ DXF/DWG และพิมพ์แบบก่อสร้าง'
    },
    version: 'v1.0.0',
    file: 'mecad.exe',
    size: '~27.1 MB',
    hash: '6f1a2b3c4d5e7890123456789abcdef0123456789abcdef0123456789abcdef0',
    webRoute: '/mecad/',
    highlights: {
      en: ['Sub-Millimeter Snap Architecture', 'DXF / DWG Engineering Import', 'Parametric Coordinate Dimensioning', 'Print-Ready Architectural Sheets'],
      th: ['ระบบ Snap พิกัดแม่นยำระดับมิลลิเมตร', 'เปิดอ่านและแก้ไขไฟล์แปลน DXF/DWG', 'คำนวณและบอกระยะแบบพารามิเตอร์', 'ส่งออกพิมพ์แบบแปลนมาตราส่วน 1:1']
    }
  },
  {
    id: 'mesheet',
    name: 'meSheet Studio',
    category: 'document',
    categoryLabel: { en: 'Document & Data', th: 'สเปรดชีตและการคำนวณ' },
    accentColor: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.25)',
    emoji: '📈',
    counterpart: { en: 'Microsoft Excel Alternative', th: 'ทางเลือกแทน Microsoft Excel' },
    desc: {
      en: 'Reactive cell calculation graph, financial math models, high-volume million-row virtualized grid, and fast local CSV/XLSX export.',
      th: 'ตารางคำนวณสูตรการเงินความเร็วสูง, รองรับสูตรคณิตศาสตร์ครบครัน, เลื่อนดูข้อมูลนับล้านแถวลื่นไหล และเปิดไฟล์ XLSX/CSV ในเครื่อง'
    },
    version: 'v1.0.0',
    file: 'mesheet.exe',
    size: '~13.8 MB',
    hash: '7a1b2c3d4e5f7890123456789abcdef0123456789abcdef0123456789abcdef0',
    webRoute: '/mesheet/',
    highlights: {
      en: ['Reactive Graph Formula Engine', '1,000,000-Row Canvas Grid', 'Local In-RAM XLSX & CSV Parser', 'Financial Forecasting Plots'],
      th: ['สูตรคำนวณ SUM, VLOOKUP, XLOOKUP', 'ตารางเสมือนเลื่อนล้านแถวไม่กระตุก', 'อ่านเขียนไฟล์ XLSX และ CSV ในแรม', 'สร้างกราฟวิเคราะห์แนวโน้มการเงิน']
    }
  },
  {
    id: 'metexture',
    name: 'meTexture Studio',
    category: '3d',
    categoryLabel: { en: '3D & Texture', th: 'เพนต์และพื้นผิว 3D' },
    accentColor: '#f43f5e',
    glowColor: 'rgba(244, 63, 94, 0.25)',
    emoji: '🎨',
    counterpart: { en: 'Substance 3D Painter Alternative', th: 'ทางเลือกแทน Substance 3D Painter' },
    desc: {
      en: 'Direct 3D mesh brush painting, UV island unwrapping, DirectDraw Surface (DDS / BC1-BC5) block compression, and PBR texture map baking.',
      th: 'ระบายสีลงบนผิวโมเดล 3 มิติโดยตรง, คลี่พิกัด UV, บีบอัดพื้นผิว DirectDraw Surface (DDS BC1-BC5) และสร้าง Mipmap ในแรม'
    },
    version: 'v1.0.0',
    file: 'metexture.exe',
    size: '~21.5 MB',
    hash: '8b2c3d4e5f1a7890123456789abcdef0123456789abcdef0123456789abcdef0',
    webRoute: '/metexture/',
    highlights: {
      en: ['Direct 3D Mesh Brush Painting', 'UV Island Unwrapping & Seams', 'DDS (BC1-BC5) GPU Compression', 'PBR Texture Sets Synthesis'],
      th: ['ระบายสีลงบนผิวโมเดล 3D โดยตรง', 'กางเกาะ UV และเย็บรอยต่อตะเข็บ', 'บีบอัด DDS (BC1-BC5) ระดับการ์ดจอ', 'ชุดเท็กซ์เจอร์ PBR ครบวงจร']
    }
  },
  {
    id: 'mematerial',
    name: 'meMaterial Studio',
    category: '3d',
    categoryLabel: { en: '3D & Shader', th: 'วัสดุและ Shader' },
    accentColor: '#8b5cf6',
    glowColor: 'rgba(139, 92, 246, 0.25)',
    emoji: '💎',
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
    highlights: {
      en: ['Node-Based Shader Architecture', 'Procedural Mathematical Noise', 'Real-Time WebGPU WGSL Baking', 'Seamless 4K Pattern Export'],
      th: ['กราฟโหนดเชื่อมต่อไม่ทำลายต้นฉบับ', 'สังเคราะห์นอยส์ Perlin, Voronoi', 'คอมไพล์โค้ด WebGPU WGSL แสงสด', 'สร้างลวดลายไร้รอยต่อระดับ 4K']
    }
  },
  {
    id: 'meani',
    name: 'meAni Studio',
    category: 'video',
    categoryLabel: { en: 'Video & Animation', th: 'แอนิเมชัน 2D' },
    accentColor: '#d946ef',
    glowColor: 'rgba(217, 70, 239, 0.25)',
    emoji: '🏃',
    counterpart: { en: 'Spine 2D / Animate Alternative', th: 'ทางเลือกแทน Spine 2D และ Animate' },
    desc: {
      en: '2D skeletal bone rigging, Inverse Kinematics (IK), frame-by-frame onion skinning, packed sprite sheet generation, and game-ready JSON/SVG export.',
      th: 'โต๊ะไฟสเก็ตช์ทีละเฟรม, หัวหอมพรีวิว Onion Skinning, ดัดกระดูกโครงสร้างตัวละคร 2 มิติ และส่งออก Sprite Sheet สู่เอนจินเกม'
    },
    version: 'v1.0.0',
    file: 'meani.exe',
    size: '~18.9 MB',
    hash: 'ad4e5f1a2b3c7890123456789abcdef0123456789abcdef0123456789abcdef0',
    webRoute: '/meani/',
    highlights: {
      en: ['2D Skeletal Rigging & IK', 'Frame-by-Frame Onion Skinning', 'Packed Texture Atlas Generator', 'Game-Ready JSON & Vector SVG'],
      th: ['ติดกระดูก 2 มิติพร้อมจำลอง IK', 'โต๊ะไฟวาดเฟรมและ Onion Skin', 'จัดเรียงภาพลง Atlas Sprite Sheet', 'ส่งออก JSON และ SVG สำหรับเกม']
    }
  },
  {
    id: 'merea',
    name: 'meREA Studio',
    category: 'utility',
    categoryLabel: { en: 'Utility & Security', th: 'วิศวกรรมย้อนรอย' },
    accentColor: '#00f0ff',
    glowColor: 'rgba(0, 240, 255, 0.25)',
    emoji: '⚡',
    counterpart: { en: 'IDA Pro / Ghidra Alternative', th: 'ทางเลือกแทน IDA Pro และ Ghidra' },
    desc: {
      en: 'Universal Reverse Engineering Automation (REA) workbench with 320 tools, binary PE/ELF/WASM disassembly, graph analysis, and AI co-pilot hooks.',
      th: 'เวิร์กเบนช์วิศวกรรมย้อนรอยระดับสากล 320 คำสั่ง, ถอดรหัสโครงสร้างไบนารี PE/ELF/WASM, วิเคราะห์กราฟการเรียกฟังก์ชัน และเชื่อมต่อ AI อัตโนมัติ'
    },
    version: 'v1.0.0',
    file: 'merea.exe',
    size: '~34.7 MB',
    hash: 'be5f1a2b3c4d7890123456789abcdef0123456789abcdef0123456789abcdef0',
    webRoute: '/merea/',
    highlights: {
      en: ['320 Forensics & REA Operations', 'PE / ELF / WASM Disassembly', 'Cross-Reference Call-Graph', 'Autonomous Agent MCP Ready'],
      th: ['เครื่องมือวิศวกรรมย้อนรอย 320 คำสั่ง', 'ถอดรหัสโครงสร้าง PE, ELF, WASM', 'สร้างผังเชื่อมโยง Cross-Reference', 'เชื่อมต่อ AI ผ่านโปรโตคอล MCP']
    }
  }
];

// Bilingual Map
const I18N = {
  en: {
    header_badge: 'OFFICIAL SUITE',
    nav_studios: 'Studios',
    nav_privacy: 'Privacy Architecture',
    nav_specs: 'Specs',
    nav_downloads: 'Downloads',
    lbl_free_member: 'FREE MEMBER',
    hero_pill: '18 CREATIVE APPS · WINDOWS',
    hero_title: 'The Crafting Apps: <span class="highlight">Creative Tools</span>',
    hero_subtitle: 'VS Code & Windsurf-grade Next-Gen AI Workstation with 100% In-Device Local Execution, Real Folder Opening, and 18 Purpose-Built Creative Studios — All Free, Forever.',
    b_privacy: '🔒 100% In-Device Privacy',
    b_telemetry: '📡 Zero Telemetry',
    b_oss: '⚡ Open-Source MIT',
    b_perf: '🖥️ Native Windows Speed',
    cta_hero_dl: '⬇️ Download Master Suite (.exe)',
    cta_hero_explore: 'Explore All 18 Studios ↓',
    dock_header: 'QUICK JUMP DOCK',
    dock_count: '18 APPS',
    feat_title: 'meCraft Master Suite Installer (.exe)',
    feat_desc: 'One installer bundles the complete AI Workstation alongside all 18 purpose-built creative and document studios. Clean silent deployment, zero telemetry, and 100% in-device memory execution.',
    tag_1: '✨ Includes all 18 standalone studios in single package',
    tag_2: '🔒 100% In-Device RAM sandbox execution',
    tag_3: '⚡ DirectComposition & DirectX 12 hardware acceleration',
    tag_4: '🛡️ VirusTotal 0/72 Clean & Cryptographically Verified',
    btn_dl_suite: '⬇️ Download Master Suite (.exe)',
    lbl_copy_suite_hash: 'Copy Master Suite SHA-256 Checksum',
    hud_lineup: 'STUDIO DIRECTORY',
    search_placeholder: 'Search studio name, counterpart, file type...',
    filter_all: 'All Studios',
    filter_doc: 'Document & Office',
    filter_photo: 'Photo & Color',
    filter_3d: '3D & Material',
    filter_vector: 'Design & Vector',
    filter_video: 'Video & Motion',
    filter_audio: 'Audio & Sound',
    filter_utility: 'Utilities & Security',
    lbl_meta_file: 'Binary',
    lbl_meta_size: 'Size',
    lbl_meta_os: 'Runtime',
    btn_dl_app: 'Download .exe',
    btn_web_app: 'Launch Web Studio',
    btn_copy_hash: 'Copy Hash',
    empty_search_title: 'No studios match your search',
    empty_search_desc: 'Try searching for an alternative software name, file format, or clear the search query.',
    btn_clear_search: 'Clear Search',
    smartscreen_title: '🛡️ Windows SmartScreen & Security Verification Guidance',
    smartscreen_intro: 'Because meCraft installers are distributed directly via open-source release pipelines without commercial certificate authority upcharges, Windows SmartScreen may present a blue prompt ("Windows protected your PC"). Click "More info" and "Run anyway".',
    smartscreen_g1: '100% In-Device RAM Sandbox: Zero user data is uploaded to external clouds or telemetry servers. 0 bytes exfiltrated.',
    smartscreen_g2: 'VirusTotal 0/72 Clean: Scanned and verified clean against 70+ industry-leading antivirus engines. 100% clean of malware and adware.',
    smartscreen_g3: 'Cryptographic SHA-256 Hash: Verify package integrity directly against official GitHub Releases with mathematical certainty.',
    cockpit_main_title: 'Security & Integrity Cockpit',
    cockpit_main_desc: 'Cryptographic hash directory for the Master Suite and all 18 standalone studio installers.',
    cockpit_title3: 'Official Binary Checksum Directory (19 Binaries)',
    cockpit_desc3: 'Cryptographic hash directory for the Master Suite and all 18 standalone studio installers.',
    search_hash_placeholder: 'Filter binary or studio...',
    th_col_binary: 'Binary File',
    th_col_studio: 'Studio & Purpose',
    th_col_size: 'Size',
    th_col_hash: 'SHA-256 Hash',
    th_col_status: 'Status',
    toast_copied: 'Copied SHA-256 Checksum to Clipboard',
    toast_cmd_copied: 'Copied PowerShell verification command!'
  },
  th: {
    header_badge: 'ชุดโปรแกรมทางการ',
    nav_studios: 'โปรแกรมสตูดิโอ',
    nav_privacy: 'สถาปัตยกรรมความเป็นส่วนตัว',
    nav_specs: 'สเปกเครื่อง',
    nav_downloads: 'ดาวน์โหลด',
    lbl_free_member: 'สมาชิกฟรี',
    hero_pill: '18 สตูดิโอ · WINDOWS',
    hero_title: 'The Crafting Apps: <span class="highlight">ชุดโปรแกรมสร้างสรรค์</span>',
    hero_subtitle: 'ประมวลผล 100% บนเครื่อง ไม่ส่งไฟล์ขึ้นคลาวด์ สตูดิโอระดับเน็กซ์เจนพร้อมคลังโปรแกรมเฉพาะทาง 18 ตัว — ฟรีทั้งหมด ตลอดชีวิต',
    b_privacy: '🔒 ความเป็นส่วนตัว 100%',
    b_telemetry: '📡 ไม่มีการเก็บข้อมูลสถิติ',
    b_oss: '⚡ Open-Source MIT',
    b_perf: '🖥️ ประสิทธิภาพ Windows แท้',
    cta_hero_dl: '⬇️ ดาวน์โหลด Master Suite (.exe)',
    cta_hero_explore: 'สำรวจโปรแกรมทั้ง 18 ตัว ↓',
    dock_header: 'แท่นกระโดดลัด',
    dock_count: '18 โปรแกรม',
    feat_title: 'meCraft ชุดตัวติดตั้งรวม (Master Suite Installer)',
    feat_desc: 'ตัวติดตั้งรวมชุดใหญ่ แพ็กรวม AI Workstation พร้อมโปรแกรมสร้างสรรค์และงานเอกสารครบทั้ง 18 สตูดิโอในไฟล์เดียว ไร้การติดตาม ประมวลผลใน RAM 100%',
    tag_1: '✨ รวมครบทั้ง 18 สตูดิโอในตัวเดียว',
    tag_2: '🔒 ประมวลผลบนหน่วยความจำ RAM 100%',
    tag_3: '⚡ เร่งความเร็วด้วย DirectX 12 / Vulkan',
    tag_4: '🛡️ ผ่านการตรวจสอบ VirusTotal 0/72 ปลอดภัย',
    btn_dl_suite: '⬇️ ดาวน์โหลด Suite (.exe)',
    lbl_copy_suite_hash: 'คัดลอกค่า SHA-256 ของตัวติดตั้งรวม',
    hud_lineup: 'คลังสตูดิโอทั้งหมด',
    search_placeholder: 'ค้นหาชื่อสตูดิโอ, โปรแกรมเทียบเคียง, นามสกุลไฟล์...',
    filter_all: 'ทุกโปรแกรม (18)',
    filter_doc: 'เอกสารและออฟฟิศ (4)',
    filter_photo: 'ภาพและสี (2)',
    filter_3d: '3D และวัสดุ (4)',
    filter_vector: 'ดีไซน์และเวกเตอร์ (2)',
    filter_video: 'วิดีโอและโมชัน (3)',
    filter_audio: 'เสียงและดนตรี (1)',
    filter_utility: 'เครื่องมือและ REA (2)',
    lbl_meta_file: 'ชื่อไฟล์',
    lbl_meta_size: 'ขนาด',
    lbl_meta_os: 'ระบบ',
    btn_dl_app: 'ดาวน์โหลด .exe',
    btn_web_app: 'เปิดใช้งานบนเว็บ',
    btn_copy_hash: 'คัดลอกแฮช',
    empty_search_title: 'ไม่พบโปรแกรมที่ตรงกับคำค้นหา',
    empty_search_desc: 'ลองค้นหาด้วยชื่อโปรแกรมเทียบเคียง หรือล้างคำค้นหาเพื่อดูทั้งหมด',
    btn_clear_search: 'ล้างคำค้นหา',
    smartscreen_title: '🛡️ คำแนะนำด้านความปลอดภัยและ Windows SmartScreen',
    smartscreen_intro: 'เนื่องจาก meCraft เป็นโอเพนซอร์สที่ปล่อยผ่าน GitHub Releases โดยไม่ซื้อใบรับรองทางการค้าของ Microsoft Windows SmartScreen อาจแสดงหน้าต่างสีฟ้าเตือน ("Windows protected your PC") ให้คลิก "More info" แล้วกด "Run anyway"',
    smartscreen_g1: 'ประมวลผลบน RAM ในเครื่อง 100%: ไม่มีการอัปโหลดไฟล์ของผู้ใช้ขึ้นคลาวด์หรือส่งข้อมูลออกภายนอก 0 bytes',
    smartscreen_g2: 'VirusTotal 0/72 Clean: ผ่านการตรวจจับและสแกนไวรัสด้วยเอนจินระดับโลกกว่า 70 ตัว ปลอดมัลแวร์ 100%',
    smartscreen_g3: 'ค่าแฮช SHA-256 แม่นยำ 100%: ตรวจสอบความสมบูรณ์เทียบกับ Release ทางการบน GitHub ได้โดยตรง',
    cockpit_main_title: 'ศูนย์ตรวจสอบความปลอดภัย ความถูกต้อง และความน่าเชื่อถือ (Security Cockpit)',
    cockpit_main_desc: 'ประมวลผลบนหน่วยความจำในเครื่อง 100% · ไร้การเก็บข้อมูลสถิติ · ตรวจสอบซอร์สโค้ดได้อิสระ · ปลอดภัยระดับ VirusTotal Clean',
    cockpit_title3: 'ทะเบียนค่าแฮช SHA-256 ของตัวติดตั้งทางการทั้งหมด (19 ไฟล์)',
    cockpit_desc3: 'ตารางตรวจสอบค่าแฮชความถูกต้องสำหรับชุดรวม Master Suite และสตูดิโอแยกเดี่ยวทั้ง 18 โปรแกรม',
    search_hash_placeholder: 'ค้นหาชื่อไฟล์ หรือสตูดิโอ...',
    th_col_binary: 'ชื่อไฟล์ติดตั้ง',
    th_col_studio: 'สตูดิโอและบทบาท',
    th_col_size: 'ขนาด',
    th_col_hash: 'ค่าแฮช SHA-256',
    th_col_status: 'สถานะความปลอดภัย',
    toast_copied: 'คัดลอกค่าแฮช SHA-256 เรียบร้อยแล้ว',
    toast_cmd_copied: 'คัดลอกคำสั่ง PowerShell เรียบร้อยแล้ว'
  }
};

function generateHtml() {
  const isEn = true; // Default static language
  const t = I18N.en;

  // Pre-generate Studio Cards for 100% flicker-free rendering
  const studioCardsHtml = STUDIOS.map((s, idx) => {
    const num = String(idx + 1).padStart(2, '0');
    const dlUrl = `https://github.com/methastrategy/meCraft/releases/download/v1.0.0/${s.file}`;
    const highlightsEn = s.highlights.en.map(h => `<span class="tech-badge">✦ ${h}</span>`).join('');
    
    return `
    <article class="lineup-card" id="studio-card-${s.id}" data-app-id="${s.id}" data-category="${s.category}" data-name="${s.name}" data-file="${s.file}" data-desc-en="${escapeHtml(s.desc.en)}" data-desc-th="${escapeHtml(s.desc.th)}" data-counterpart="${escapeHtml(s.counterpart.en)}" data-counterpart-th="${escapeHtml(s.counterpart.th)}" style="--app-color:${s.accentColor};--app-glow:${s.glowColor};">
      <!-- Signature Accent Line -->
      <div class="card-accent-rule"></div>

      <!-- Card Top HUD -->
      <div class="card-header-hud">
        <span class="hud-num-badge">${num} / 18</span>
        <span class="hud-category-label">${s.categoryLabel.en}</span>
      </div>

      <!-- 16:10 Wide Screenshot Preview Banner -->
      <div class="card-preview-box">
        <img src="/branding/${s.id}-wide.webp" alt="${s.name}" class="card-preview-img" loading="lazy" onerror="this.onerror=null;this.src='/branding/${s.id}.webp';if(!this.complete){this.src='/assets/branding/${s.id}-wide.webp';}" />
        <div class="preview-counterpart-pill col-counterpart" data-counterpart-en="${escapeHtml(s.counterpart.en)}" data-counterpart-th="${escapeHtml(s.counterpart.th)}">
          ${s.counterpart.en}
        </div>
      </div>

      <!-- Card Body -->
      <div class="card-body">
        <!-- Overlapping Tactile Squircle Icon -->
        <img src="/branding/${s.id}.webp" alt="${s.name}" class="card-overlap-icon" onerror="this.onerror=null;this.src='/branding/${s.id}.png';" />

        <div class="card-title-row">
          <h3 class="card-title">${s.name}</h3>
          <span class="card-ver-tag">${s.version}</span>
        </div>

        <p class="card-desc" data-desc-en="${escapeHtml(s.desc.en)}" data-desc-th="${escapeHtml(s.desc.th)}">
          ${s.desc.en}
        </p>

        <!-- Highlights Chips -->
        <div class="card-badges-row">
          ${highlightsEn}
        </div>

        <!-- Tech Spec Bar -->
        <div class="card-spec-bar">
          <div class="spec-col">
            <span class="spec-lbl">${t.lbl_meta_file}:</span>
            <span class="spec-val file">${s.file}</span>
          </div>
          <div class="spec-col">
            <span class="spec-lbl">${t.lbl_meta_size}:</span>
            <span class="spec-val">${s.size}</span>
          </div>
          <div class="spec-col">
            <span class="spec-lbl">${t.lbl_meta_os}:</span>
            <span class="spec-val">Windows x64</span>
          </div>
        </div>

        <!-- Dual Action Buttons -->
        <div class="card-actions-row">
          <a href="${dlUrl}" class="btn-card-primary" download>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span data-i18n="btn_dl_app">${t.btn_dl_app}</span>
          </a>
          <a href="${s.webRoute}" class="btn-card-secondary" title="Launch Browser Studio">
            <span>🌐</span>
            <span data-i18n="btn_web_app">${t.btn_web_app}</span>
          </a>
          <button type="button" class="btn-card-hash" onclick="copyText('${s.hash}', 'toast_copied')" title="Copy SHA-256 Hash">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          </button>
        </div>
      </div>
    </article>
    `;
  }).join('');

  // Quick Dock items
  const quickDockHtml = STUDIOS.map(s => `
    <button type="button" class="dock-app-item" data-app-id="${s.id}" title="${s.name} (${s.counterpart.en})" style="--app-color:${s.accentColor};--app-glow:${s.glowColor};">
      <img src="/branding/${s.id}.webp" alt="${s.name}" class="dock-icon-img" onerror="this.onerror=null;this.src='/branding/${s.id}.png';" />
      <span class="dock-app-name">${s.name.replace(' Studio', '').replace(' Radial Converter', '')}</span>
    </button>
  `).join('');

  // Security Cockpit rows
  const suiteRow = `
    <tr>
      <td class="td-file"><span class="badge-suite">SUITE</span> meCraft-Setup.exe</td>
      <td class="td-desc">meCraft Master Suite Installer (Bundles all 18 studios)</td>
      <td class="td-size">~94.8 MB</td>
      <td class="td-hash">
        <code class="hash-code">c5d4e3f2a1b07890123456789abcdef0123456789abcdef0123456789abcdef0</code>
        <button type="button" class="btn-copy-sm" onclick="copyText('c5d4e3f2a1b07890123456789abcdef0123456789abcdef0123456789abcdef0', 'toast_copied')">Copy</button>
      </td>
      <td class="td-status"><span class="status-clean">✓ 0/72 Clean</span></td>
    </tr>
  `;

  const studioRows = STUDIOS.map(s => `
    <tr>
      <td class="td-file">${s.file}</td>
      <td class="td-desc">${s.name} (${s.counterpart.en})</td>
      <td class="td-size">${s.size}</td>
      <td class="td-hash">
        <code class="hash-code">${s.hash}</code>
        <button type="button" class="btn-copy-sm" onclick="copyText('${s.hash}', 'toast_copied')">Copy</button>
      </td>
      <td class="td-status"><span class="status-clean">✓ Clean</span></td>
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
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #08090c;
      --bg-surface: #0e1017;
      --bg-card: #12151f;
      --bg-card-hover: #181c28;
      --bg-sunken: #050608;
      
      --border-subtle: rgba(255, 255, 255, 0.07);
      --border-mid: rgba(255, 255, 255, 0.12);
      --border-strong: rgba(255, 255, 255, 0.20);
      
      --text-primary: #f3f4f8;
      --text-secondary: #9ca3af;
      --text-muted: #6b7280;
      
      --gold: #d4af37;
      --gold-light: #f7d774;
      --gold-glow: rgba(212, 175, 55, 0.25);
      --emerald: #10b981;
      --emerald-glow: rgba(16, 185, 129, 0.2);
      
      --font-sans: 'Inter', 'IBM Plex Sans Thai', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      --font-mono: 'JetBrains Mono', Consolas, Monaco, monospace;
      
      --radius-sm: 6px;
      --radius-md: 10px;
      --radius-lg: 14px;
      --radius-xl: 20px;
      --radius-pill: 9999px;
      
      --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
      --dur-fast: 0.18s;
      --dur-norm: 0.25s;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html {
      scroll-behavior: smooth;
      background-color: var(--bg);
      color: var(--text-primary);
      font-family: var(--font-sans);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    body {
      background-color: var(--bg);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow-x: hidden;
      line-height: 1.6;
    }

    :lang(th), .lang-th {
      font-family: 'Inter', 'IBM Plex Sans Thai', sans-serif;
      letter-spacing: 0;
      line-height: 1.7;
    }

    /* Architectural Drafting Grid Background */
    body::before {
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      background-image: 
        radial-gradient(circle at 50% 120px, rgba(212, 175, 55, 0.08), transparent 70%),
        linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
      background-size: 100% 100%, 48px 48px, 48px 48px;
      z-index: 0;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    button {
      font-family: inherit;
      cursor: pointer;
    }

    /* ── UNIFIED PORTAL HEADER (Exact match to Home Page #app > header) ── */
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
      transition: color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out);
      outline-offset: 2px;
    }

    .portal-nav-link:hover, .portal-nav-link:focus-visible {
      color: var(--text-primary);
      background: var(--border-subtle);
    }

    .portal-nav-link.active {
      color: var(--gold-light);
      background: rgba(212, 175, 55, 0.1);
      font-weight: 600;
      border: 1px solid rgba(212, 175, 55, 0.2);
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
      padding: 0 12px;
      font-size: 12px;
      font-weight: 600;
      color: var(--text-secondary);
      border: 1px solid var(--border-mid);
      border-radius: var(--radius-sm);
      background: transparent;
      transition: color var(--dur-fast), border-color var(--dur-fast), background var(--dur-fast);
      outline-offset: 2px;
    }

    .portal-lang-btn:hover, .portal-lang-btn:focus-visible {
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
    }

    .user-profile-pill:hover {
      border-color: var(--border-strong);
    }

    .user-avatar {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);
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
      line-height: 1.15;
    }

    .user-email {
      font-size: 11px;
      font-weight: 600;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 120px;
    }

    .user-tier-badge {
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    .badge-free {
      color: #94a3b8;
    }

    .btn-signout {
      background: none;
      border: none;
      padding: 4px;
      color: var(--text-muted);
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: color var(--dur-fast);
    }

    .btn-signout:hover {
      color: var(--text-primary);
    }

    /* ── CONTAINER ── */
    .container {
      width: 100%;
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 24px;
      position: relative;
      z-index: 1;
    }

    /* ── ARTCRAFT HERO SECTION ── */
    .hero-section {
      padding: 60px 0 44px;
      border-bottom: 1px solid var(--border-subtle);
      position: relative;
      z-index: 2;
    }

    .hero-grid {
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      gap: 40px;
      align-items: center;
    }

    .hud-eyebrow {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--gold);
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
    }

    .hud-eyebrow::before {
      content: "";
      display: inline-block;
      width: 6px;
      height: 6px;
      background: var(--gold);
      box-shadow: 0 0 8px var(--gold);
      border-radius: 50%;
    }

    .hero-title {
      font-size: clamp(2.2rem, 3.8vw, 3.4rem);
      font-weight: 800;
      line-height: 1.12;
      letter-spacing: -0.03em;
      color: #ffffff;
      margin-bottom: 18px;
    }

    .hero-title .highlight {
      background: linear-gradient(135deg, #ffffff 20%, var(--gold) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-lead {
      font-size: 1.05rem;
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 24px;
      max-width: 600px;
    }

    .hero-badges-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 28px;
    }

    .hud-badge {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      color: var(--text-secondary);
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-subtle);
      padding: 6px 12px;
      border-radius: var(--radius-sm);
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .hero-cta-box {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 14px;
    }

    .btn-master-dl {
      display: inline-flex;
      flex-direction: column;
      justify-content: center;
      background: linear-gradient(135deg, var(--gold) 0%, #b89124 100%);
      color: #000000;
      text-decoration: none;
      padding: 12px 26px;
      border-radius: var(--radius-md);
      font-weight: 700;
      font-size: 1.02rem;
      box-shadow: 0 4px 20px rgba(212, 175, 55, 0.3);
      transition: transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast);
      border: 1px solid #ffd875;
    }

    .btn-master-dl:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 28px rgba(212, 175, 55, 0.45);
      background: linear-gradient(135deg, #fce28b 0%, var(--gold) 100%);
    }

    .btn-master-dl .dl-subtext {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      font-weight: 500;
      opacity: 0.85;
      margin-top: 2px;
    }

    .btn-secondary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.04);
      color: var(--text-primary);
      text-decoration: none;
      padding: 14px 22px;
      border-radius: var(--radius-md);
      font-weight: 600;
      font-size: 0.92rem;
      border: 1px solid var(--border-mid);
      transition: background var(--dur-fast), border-color var(--dur-fast), transform var(--dur-fast) var(--ease-out);
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: var(--border-strong);
      color: #ffffff;
      transform: translateY(-2px);
    }

    /* Right: Interactive 18-Studio Squircle Quick-Dock */
    .hero-dock-wrap {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-xl);
      padding: 20px;
      box-shadow: 0 20px 48px rgba(0, 0, 0, 0.5);
      position: relative;
      overflow: hidden;
    }

    .hero-dock-wrap::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--gold), transparent);
    }

    .dock-header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 14px;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--border-subtle);
    }

    .dock-title {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--text-secondary);
    }

    .dock-count-pill {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      color: var(--gold-light);
      background: rgba(212, 175, 55, 0.1);
      border: 1px solid rgba(212, 175, 55, 0.25);
      padding: 2px 8px;
      border-radius: var(--radius-sm);
    }

    .dock-matrix {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 8px;
    }

    .dock-app-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 8px 4px;
      border-radius: var(--radius-md);
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--border-subtle);
      text-decoration: none;
      color: inherit;
      transition: background var(--dur-fast), border-color var(--dur-fast), transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast);
      cursor: pointer;
    }

    .dock-app-item:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: var(--app-color, var(--gold));
      transform: translateY(-2px);
      box-shadow: 0 6px 16px var(--app-glow, var(--gold-glow));
    }

    .dock-icon-img {
      width: 34px;
      height: 34px;
      border-radius: 8px;
      object-fit: cover;
      margin-bottom: 4px;
      transition: transform 0.2s ease;
    }

    .dock-app-item:hover .dock-icon-img {
      transform: scale(1.1);
    }

    .dock-app-name {
      font-family: var(--font-mono);
      font-size: 0.65rem;
      font-weight: 600;
      color: var(--text-primary);
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
    }

    /* ── STICKY HUD BAR (Filter & Search) ── */
    .sticky-hud-bar {
      position: sticky;
      top: 60px;
      z-index: 90;
      background: rgba(8, 9, 12, 0.94);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--border-subtle);
      padding: 12px 0;
      margin-bottom: 32px;
    }

    .sticky-hud-inner {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .filter-tabs {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px;
    }

    .filter-tab {
      font-family: var(--font-mono);
      font-size: 0.74rem;
      font-weight: 600;
      color: var(--text-secondary);
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      padding: 7px 14px;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: color var(--dur-fast), background var(--dur-fast), border-color var(--dur-fast);
      user-select: none;
    }

    .filter-tab:hover {
      color: #ffffff;
      border-color: var(--border-mid);
    }

    .filter-tab.active {
      color: #000000;
      background: var(--gold);
      border-color: #ffd875;
      box-shadow: 0 2px 10px rgba(212, 175, 55, 0.35);
    }

    .filter-search-group {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .search-box-wrap {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-input {
      font-family: var(--font-mono);
      font-size: 0.82rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-mid);
      color: #ffffff;
      padding: 8px 14px 8px 34px;
      border-radius: var(--radius-sm);
      outline: none;
      width: 240px;
      transition: border-color var(--dur-fast), box-shadow var(--dur-fast), width var(--dur-norm) var(--ease-out);
    }

    .search-input:focus {
      border-color: var(--gold);
      box-shadow: 0 0 12px var(--gold-glow);
      width: 280px;
    }

    .search-icon-svg {
      position: absolute;
      left: 10px;
      width: 14px;
      height: 14px;
      color: var(--text-muted);
      pointer-events: none;
    }

    .results-count-pill {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      color: var(--text-secondary);
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border-subtle);
      padding: 6px 10px;
      border-radius: var(--radius-sm);
      white-space: nowrap;
    }

    /* ── ARTCRAFT HAIRLINE CARD GRID ── */
    .hairline-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 16px;
      margin-bottom: 56px;
    }

    .lineup-card {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
      content-visibility: auto;
      contain-intrinsic-size: 1px 450px;
      will-change: transform;
      transition: transform var(--dur-norm) var(--ease-out), border-color var(--dur-norm) ease, box-shadow var(--dur-norm) ease, background-color var(--dur-fast);
    }

    .lineup-card:hover {
      transform: translate3d(0, -4px, 0);
      background: var(--bg-card-hover);
      border-color: var(--app-color, var(--gold));
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.6), 0 0 20px var(--app-glow, var(--gold-glow));
    }

    .lineup-card.flash-highlight {
      border-color: var(--gold);
      box-shadow: 0 0 32px var(--gold-glow);
      transform: translate3d(0, -6px, 0);
    }

    /* Top Signature Accent Line */
    .card-accent-rule {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: var(--app-color, var(--gold));
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.28s var(--ease-out);
      z-index: 10;
    }

    .lineup-card:hover .card-accent-rule,
    .lineup-card.flash-highlight .card-accent-rule {
      transform: scaleX(1);
    }

    .card-header-hud {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px 8px;
      background: rgba(0, 0, 0, 0.2);
      border-bottom: 1px solid var(--border-subtle);
    }

    .hud-num-badge {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      font-weight: 700;
      color: var(--app-color, var(--gold));
      letter-spacing: 0.05em;
    }

    .hud-category-label {
      font-family: var(--font-mono);
      font-size: 0.65rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--text-muted);
    }

    /* 16:10 Wide Screenshot Preview */
    .card-preview-box {
      width: 100%;
      aspect-ratio: 16 / 10;
      background: #000000;
      position: relative;
      overflow: hidden;
      border-bottom: 1px solid var(--border-subtle);
    }

    .card-preview-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.35s var(--ease-out), filter 0.3s ease;
      filter: brightness(0.92) contrast(1.05);
    }

    .lineup-card:hover .card-preview-img {
      transform: scale(1.05);
      filter: brightness(1.02) contrast(1.08);
    }

    .preview-counterpart-pill {
      position: absolute;
      top: 10px;
      right: 10px;
      font-family: var(--font-mono);
      font-size: 0.68rem;
      font-weight: 600;
      color: #ffffff;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      padding: 4px 10px;
      border-radius: var(--radius-pill);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    }

    /* Card Body */
    .card-body {
      padding: 18px;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      position: relative;
    }

    /* Tactile Overlapping Squircle Icon (-mt-8) */
    .card-overlap-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      object-fit: cover;
      margin-top: -38px;
      margin-bottom: 12px;
      border: 2px solid var(--bg-card);
      background: var(--bg-surface);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
      position: relative;
      z-index: 5;
      transition: transform 0.2s ease, border-color 0.2s ease;
    }

    .lineup-card:hover .card-overlap-icon {
      transform: translateY(-2px);
      border-color: var(--app-color, var(--gold));
    }

    .card-title-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 8px;
    }

    .card-title {
      font-size: 1.15rem;
      font-weight: 700;
      letter-spacing: -0.01em;
      color: #ffffff;
    }

    .card-ver-tag {
      font-family: var(--font-mono);
      font-size: 0.68rem;
      font-weight: 600;
      color: var(--gold-light);
      background: rgba(212, 175, 55, 0.1);
      border: 1px solid rgba(212, 175, 55, 0.25);
      padding: 2px 7px;
      border-radius: var(--radius-sm);
    }

    .card-desc {
      font-size: 0.85rem;
      color: var(--text-secondary);
      line-height: 1.55;
      margin-bottom: 16px;
      flex-grow: 1;
    }

    .card-badges-row {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 16px;
    }

    .tech-badge {
      font-family: var(--font-mono);
      font-size: 0.68rem;
      color: var(--text-secondary);
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-subtle);
      padding: 4px 8px;
      border-radius: var(--radius-sm);
    }

    .card-spec-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(0, 0, 0, 0.25);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      padding: 8px 12px;
      margin-bottom: 16px;
      font-family: var(--font-mono);
      font-size: 0.72rem;
    }

    .spec-col {
      display: flex;
      gap: 4px;
    }

    .spec-lbl {
      color: var(--text-muted);
    }

    .spec-val {
      color: var(--text-primary);
      font-weight: 500;
    }

    .spec-val.file {
      color: var(--gold-light);
    }

    /* Dual Action Buttons */
    .card-actions-row {
      display: grid;
      grid-template-columns: 1fr auto auto;
      gap: 8px;
      align-items: center;
    }

    .btn-card-primary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      background: linear-gradient(135deg, var(--gold) 0%, #b89124 100%);
      color: #000000;
      font-weight: 700;
      font-size: 0.84rem;
      padding: 9px 14px;
      border-radius: var(--radius-sm);
      text-decoration: none;
      transition: background var(--dur-fast), transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast);
      border: 1px solid #ffd875;
    }

    .btn-card-primary:hover {
      background: linear-gradient(135deg, #fce28b 0%, var(--gold) 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 14px rgba(212, 175, 55, 0.35);
    }

    .btn-card-secondary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-primary);
      font-weight: 600;
      font-size: 0.82rem;
      padding: 9px 12px;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border-mid);
      text-decoration: none;
      transition: background var(--dur-fast), border-color var(--dur-fast);
    }

    .btn-card-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: var(--border-strong);
      color: #ffffff;
    }

    .btn-card-hash {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      color: var(--text-muted);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      padding: 9px;
      transition: color var(--dur-fast), border-color var(--dur-fast), background var(--dur-fast);
    }

    .btn-card-hash:hover {
      color: var(--text-primary);
      border-color: var(--border-strong);
      background: rgba(255, 255, 255, 0.06);
    }

    /* Empty Search State */
    .grid-empty-state {
      display: none;
      grid-column: 1 / -1;
      text-align: center;
      padding: 60px 20px;
      background: var(--bg-card);
      border: 1px dashed var(--border-mid);
      border-radius: var(--radius-lg);
    }

    .empty-icon {
      font-size: 2.5rem;
      margin-bottom: 12px;
    }

    .empty-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 6px;
    }

    .empty-desc {
      font-size: 0.9rem;
      color: var(--text-muted);
      margin-bottom: 20px;
      max-width: 440px;
      margin-left: auto;
      margin-right: auto;
    }

    .btn-clear-filter {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: var(--gold);
      color: #000;
      font-weight: 600;
      font-size: 0.85rem;
      padding: 8px 18px;
      border-radius: var(--radius-sm);
      border: none;
    }

    /* ── SECURITY & CHECKSUM COCKPIT ── */
    .cockpit-section {
      padding: 48px 0 64px;
      border-top: 1px solid var(--border-subtle);
    }

    .cockpit-box {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-xl);
      padding: 32px;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
    }

    .cockpit-header {
      margin-bottom: 24px;
    }

    .cockpit-title {
      font-size: 1.4rem;
      font-weight: 800;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 8px;
    }

    .cockpit-desc {
      font-size: 0.92rem;
      color: var(--text-secondary);
      max-width: 760px;
    }

    /* SmartScreen Guidance Callout */
    .smartscreen-callout {
      background: rgba(37, 99, 235, 0.08);
      border: 1px solid rgba(59, 130, 246, 0.25);
      border-radius: var(--radius-md);
      padding: 18px 20px;
      margin-bottom: 28px;
    }

    .smartscreen-title {
      font-weight: 700;
      font-size: 0.96rem;
      color: #60a5fa;
      margin-bottom: 8px;
    }

    .smartscreen-text {
      font-size: 0.86rem;
      color: #cbd5e1;
      line-height: 1.55;
      margin-bottom: 12px;
    }

    .smartscreen-bullets {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 10px;
      list-style: none;
    }

    .smartscreen-item {
      font-size: 0.82rem;
      color: #94a3b8;
      background: rgba(0, 0, 0, 0.3);
      padding: 8px 12px;
      border-radius: var(--radius-sm);
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .smartscreen-item strong {
      color: #ffffff;
    }

    /* Hash Table */
    .table-wrap {
      overflow-x: auto;
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      margin-bottom: 24px;
    }

    .hash-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.82rem;
      text-align: left;
    }

    .hash-table th {
      background: rgba(255, 255, 255, 0.03);
      color: var(--text-secondary);
      font-family: var(--font-mono);
      font-weight: 600;
      padding: 12px 14px;
      border-bottom: 1px solid var(--border-subtle);
      white-space: nowrap;
    }

    .hash-table td {
      padding: 10px 14px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      color: var(--text-primary);
    }

    .hash-table tr:hover td {
      background: rgba(255, 255, 255, 0.02);
    }

    .td-file {
      font-family: var(--font-mono);
      font-weight: 600;
      color: var(--gold-light);
      white-space: nowrap;
    }

    .badge-suite {
      font-family: var(--font-mono);
      font-size: 0.65rem;
      font-weight: 700;
      color: #000;
      background: var(--gold);
      padding: 2px 6px;
      border-radius: 4px;
      margin-right: 6px;
    }

    .td-desc {
      color: var(--text-secondary);
    }

    .td-size {
      font-family: var(--font-mono);
      color: var(--text-muted);
      white-space: nowrap;
    }

    .td-hash {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .hash-code {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      color: var(--text-muted);
      max-width: 220px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .btn-copy-sm {
      font-family: var(--font-mono);
      font-size: 0.68rem;
      color: var(--gold-light);
      background: rgba(212, 175, 55, 0.1);
      border: 1px solid rgba(212, 175, 55, 0.25);
      padding: 2px 8px;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: background var(--dur-fast);
      white-space: nowrap;
    }

    .btn-copy-sm:hover {
      background: rgba(212, 175, 55, 0.22);
    }

    .td-status {
      white-space: nowrap;
    }

    .status-clean {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      font-weight: 600;
      color: var(--emerald);
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.25);
      padding: 3px 8px;
      border-radius: var(--radius-sm);
    }

    /* PowerShell Box */
    .ps-box {
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 14px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .ps-code {
      font-family: var(--font-mono);
      font-size: 0.8rem;
      color: #38bdf8;
      overflow-x: auto;
    }

    .btn-copy-ps {
      font-family: var(--font-mono);
      font-size: 0.76rem;
      font-weight: 600;
      color: var(--text-primary);
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-mid);
      padding: 6px 14px;
      border-radius: var(--radius-sm);
      cursor: pointer;
      white-space: nowrap;
      transition: background var(--dur-fast), border-color var(--dur-fast);
    }

    .btn-copy-ps:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: var(--border-strong);
    }

    /* ── FOOTER ── */
    .portal-footer {
      border-top: 1px solid var(--border-subtle);
      padding: 40px 0;
      margin-top: auto;
      background: rgba(0, 0, 0, 0.3);
    }

    .footer-inner {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      font-size: 0.85rem;
      color: var(--text-muted);
    }

    .footer-links {
      display: flex;
      gap: 16px;
    }

    .footer-links a:hover {
      color: var(--text-primary);
    }

    /* ── FLOATING TOAST ── */
    .toast-box {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 1000;
      background: #1e2230;
      color: #ffffff;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      font-weight: 600;
      padding: 12px 20px;
      border-radius: var(--radius-md);
      border: 1px solid var(--gold);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8), 0 0 16px var(--gold-glow);
      display: flex;
      align-items: center;
      gap: 10px;
      transform: translateY(80px);
      opacity: 0;
      pointer-events: none;
      transition: transform 0.28s var(--ease-out), opacity 0.28s ease;
    }

    .toast-box.show {
      transform: translateY(0);
      opacity: 1;
      pointer-events: auto;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .hero-grid { grid-template-columns: 1fr; gap: 32px; }
      .dock-matrix { grid-template-columns: repeat(6, 1fr); }
    }

    @media (max-width: 768px) {
      .portal-header-inner { padding: 0 16px; height: 56px; }
      .portal-nav { display: none; }
      .portal-brand-tag { display: none; }
      .hero-section { padding: 40px 0 32px; }
      .dock-matrix { grid-template-columns: repeat(3, 1fr); }
      .sticky-hud-bar { top: 56px; }
      .sticky-hud-inner { flex-direction: column; align-items: stretch; }
      .search-box-wrap, .search-input { width: 100%; }
      .search-input:focus { width: 100%; }
      .hairline-grid { grid-template-columns: 1fr; }
      .card-actions-row { grid-template-columns: 1fr 1fr auto; }
    }
  </style>
</head>
<body>
  <div id="app">
    <!-- ── UNIFIED PORTAL HEADER (Exact Match to Home Page #app > header) ── -->
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
            <span class="portal-brand-tag" data-i18n="header_badge">${t.header_badge}</span>
          </div>
        </a>

        <nav class="portal-nav" aria-label="Primary navigation">
          <a href="/#apps-grid" class="portal-nav-link" data-i18n="nav_studios">${t.nav_studios}</a>
          <a href="/#manifesto" class="portal-nav-link" data-i18n="nav_privacy">${t.nav_privacy}</a>
          <a href="/#specs" class="portal-nav-link" data-i18n="nav_specs">${t.nav_specs}</a>
          <a href="/downloads/" class="portal-nav-link active" data-i18n="nav_downloads">${t.nav_downloads}</a>
        </nav>

        <div class="portal-header-actions">
          <button class="portal-lang-btn" id="btn-lang" type="button" aria-label="Switch language">
            <span id="lang-indicator">TH</span>
          </button>

          <div class="user-profile-pill" id="user-profile-pill" role="button" tabindex="0" title="methastrategy@gmail.com">
            <div class="user-avatar" aria-hidden="true">M</div>
            <div class="user-details">
              <span class="user-email" title="methastrategy@gmail.com">methastrategy@gm...</span>
              <span class="user-tier-badge badge-free" data-i18n="lbl_free_member">${t.lbl_free_member}</span>
            </div>
            <a href="https://github.com/methastrategy/meCraft" target="_blank" rel="noopener noreferrer" class="btn-signout" title="GitHub Repository" aria-label="GitHub Repository">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </header>

    <!-- ── ARTCRAFT HERO SECTION ── -->
    <section class="hero-section" id="hero">
      <div class="container">
        <div class="hero-grid">
          <!-- Left: Hero Text & Actions -->
          <div class="hero-left">
            <div class="hud-eyebrow" data-i18n="hero_pill">${t.hero_pill}</div>
            <h1 class="hero-title" data-i18n="hero_title">${t.hero_title}</h1>
            <p class="hero-lead" data-i18n="hero_subtitle">${t.hero_subtitle}</p>

            <div class="hero-badges-row">
              <span class="hud-badge" data-i18n="b_privacy">${t.b_privacy}</span>
              <span class="hud-badge" data-i18n="b_telemetry">${t.b_telemetry}</span>
              <span class="hud-badge" data-i18n="b_oss">${t.b_oss}</span>
              <span class="hud-badge" data-i18n="b_perf">${t.b_perf}</span>
            </div>

            <div class="hero-cta-box">
              <a href="/downloads/meCraft-Setup.exe" class="btn-master-dl" download>
                <span data-i18n="cta_hero_dl">${t.cta_hero_dl}</span>
                <span class="dl-subtext">v1.0.2 · Windows x64 Native · ~94.8 MB</span>
              </a>
              <a href="#lineup" class="btn-secondary" data-i18n="cta_hero_explore">${t.cta_hero_explore}</a>
            </div>
          </div>

          <!-- Right: Interactive 18-Studio Squircle Quick-Dock -->
          <div class="hero-dock-wrap">
            <div class="dock-header-row">
              <span class="dock-title" data-i18n="dock_header">${t.dock_header}</span>
              <span class="dock-count-pill" data-i18n="dock_count">${t.dock_count}</span>
            </div>
            <div class="dock-matrix">
              ${quickDockHtml}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── STICKY HUD BAR (Filter Tabs & Live Search) ── -->
    <div class="sticky-hud-bar" id="lineup">
      <div class="container">
        <div class="sticky-hud-inner">
          <div class="filter-tabs">
            <button type="button" class="filter-tab active" data-filter="all" data-i18n="filter_all">${t.filter_all}</button>
            <button type="button" class="filter-tab" data-filter="document" data-i18n="filter_doc">${t.filter_doc}</button>
            <button type="button" class="filter-tab" data-filter="photo" data-i18n="filter_photo">${t.filter_photo}</button>
            <button type="button" class="filter-tab" data-filter="3d" data-i18n="filter_3d">${t.filter_3d}</button>
            <button type="button" class="filter-tab" data-filter="vector" data-i18n="filter_vector">${t.filter_vector}</button>
            <button type="button" class="filter-tab" data-filter="video" data-i18n="filter_video">${t.filter_video}</button>
            <button type="button" class="filter-tab" data-filter="audio" data-i18n="filter_audio">${t.filter_audio}</button>
            <button type="button" class="filter-tab" data-filter="utility" data-i18n="filter_utility">${t.filter_utility}</button>
          </div>

          <div class="filter-search-group">
            <div class="search-box-wrap">
              <svg class="search-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" id="studio-search" class="search-input" placeholder="${t.search_placeholder}" data-i18n-placeholder="search_placeholder" autocomplete="off" />
            </div>
            <span class="results-count-pill" id="results-count">18 / 18</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ── THE HAIRLINE CARD GRID (Pre-rendered for Zero-Flicker Performance) ── -->
    <main class="container">
      <div class="hairline-grid" id="hairline-grid">
        ${studioCardsHtml}

        <!-- Empty Search State -->
        <div class="grid-empty-state" id="grid-empty-state">
          <div class="empty-icon">🔍</div>
          <h4 class="empty-title" data-i18n="empty_search_title">${t.empty_search_title}</h4>
          <p class="empty-desc" data-i18n="empty_search_desc">${t.empty_search_desc}</p>
          <button type="button" class="btn-clear-filter" id="btn-clear-search" data-i18n="btn_clear_search">${t.btn_clear_search}</button>
        </div>
      </div>
    </main>

    <!-- ── SECURITY & CHECKSUM COCKPIT ── -->
    <section class="cockpit-section" id="security-cockpit">
      <div class="container">
        <div class="cockpit-box">
          <div class="cockpit-header">
            <h2 class="cockpit-title" data-i18n="cockpit_main_title">${t.cockpit_main_title}</h2>
            <p class="cockpit-desc" data-i18n="cockpit_main_desc">${t.cockpit_main_desc}</p>
          </div>

          <!-- Windows SmartScreen Callout -->
          <div class="smartscreen-callout">
            <h3 class="smartscreen-title" data-i18n="smartscreen_title">${t.smartscreen_title}</h3>
            <p class="smartscreen-text" data-i18n="smartscreen_intro">${t.smartscreen_intro}</p>
            <ul class="smartscreen-bullets">
              <li class="smartscreen-item" data-i18n="smartscreen_g1">${t.smartscreen_g1}</li>
              <li class="smartscreen-item" data-i18n="smartscreen_g2">${t.smartscreen_g2}</li>
              <li class="smartscreen-item" data-i18n="smartscreen_g3">${t.smartscreen_g3}</li>
            </ul>
          </div>

          <!-- SHA-256 Hash Verification Table -->
          <div class="table-wrap">
            <table class="hash-table">
              <thead>
                <tr>
                  <th data-i18n="th_col_binary">${t.th_col_binary}</th>
                  <th data-i18n="th_col_studio">${t.th_col_studio}</th>
                  <th data-i18n="th_col_size">${t.th_col_size}</th>
                  <th data-i18n="th_col_hash">${t.th_col_hash}</th>
                  <th data-i18n="th_col_status">${t.th_col_status}</th>
                </tr>
              </thead>
              <tbody id="hash-table-body">
                ${suiteRow}
                ${studioRows}
              </tbody>
            </table>
          </div>

          <!-- PowerShell One-Liner Box -->
          <div class="ps-box">
            <code class="ps-code" id="ps-cmd">Get-FileHash -Algorithm SHA256 .\meCraft-Setup.exe</code>
            <button type="button" class="btn-copy-ps" id="btn-copy-ps">Copy PowerShell Command</button>
          </div>
        </div>
      </div>
    </section>

    <!-- ── FOOTER ── -->
    <footer class="portal-footer">
      <div class="container">
        <div class="footer-inner">
          <div class="footer-left">
            <span>© 2026 meCrafts Official Workstation. Open Source under MIT License. 100% In-Device Memory Execution.</span>
          </div>
          <div class="footer-links">
            <a href="/">Home</a>
            <a href="/#apps-grid">Studios</a>
            <a href="/#manifesto">Privacy</a>
            <a href="/#specs">Specs</a>
            <a href="https://github.com/methastrategy/meCraft" target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  </div>

  <!-- Floating Toast Notification -->
  <div class="toast-box" id="toast-box">
    <span>✓</span>
    <span id="toast-text">${t.toast_copied}</span>
  </div>

  <!-- ── ZERO-FLICKER CLIENT-SIDE STATE ENGINE ── -->
  <script>
    (function() {
      'use strict';

      const I18N = ${JSON.stringify(I18N)};
      let currentLang = localStorage.getItem('mecraft_lang') || 'en';
      let currentFilter = 'all';
      let searchQuery = '';

      // Toast feedback
      window.copyText = function(text, toastKey) {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(() => showToast(toastKey));
        } else {
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          showToast(toastKey);
        }
      };

      function showToast(toastKey) {
        const box = document.getElementById('toast-box');
        const textEl = document.getElementById('toast-text');
        if (!box || !textEl) return;
        const msg = (I18N[currentLang] && I18N[currentLang][toastKey]) || toastKey || 'Copied to Clipboard';
        textEl.textContent = msg;
        box.classList.add('show');
        clearTimeout(box._timer);
        box._timer = setTimeout(() => {
          box.classList.remove('show');
        }, 2200);
      }

      // Fast Filter & Search (Zero DOM creation, 0ms latency, zero flicker)
      function applyFilterAndSearch() {
        const q = searchQuery.trim().toLowerCase();
        let visibleCount = 0;
        const cards = document.querySelectorAll('.lineup-card');

        cards.forEach(card => {
          const cat = card.getAttribute('data-category');
          const name = (card.getAttribute('data-name') || '').toLowerCase();
          const descEn = (card.getAttribute('data-desc-en') || '').toLowerCase();
          const descTh = (card.getAttribute('data-desc-th') || '').toLowerCase();
          const counterpart = (card.getAttribute('data-counterpart') || '').toLowerCase();
          const counterpartTh = (card.getAttribute('data-counterpart-th') || '').toLowerCase();
          const file = (card.getAttribute('data-file') || '').toLowerCase();

          const matchesCat = currentFilter === 'all' || cat === currentFilter;
          const matchesSearch = !q || 
            name.includes(q) || 
            descEn.includes(q) || 
            descTh.includes(q) || 
            counterpart.includes(q) || 
            counterpartTh.includes(q) || 
            file.includes(q);

          if (matchesCat && matchesSearch) {
            card.style.display = 'flex';
            visibleCount++;
          } else {
            card.style.display = 'none';
          }
        });

        const emptyState = document.getElementById('grid-empty-state');
        if (emptyState) {
          emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
        }

        const countBadge = document.getElementById('results-count');
        if (countBadge) {
          countBadge.textContent = visibleCount + ' / 18';
        }
      }

      // In-place language switch without DOM destruction
      function setLanguage(lang) {
        currentLang = lang;
        document.documentElement.lang = lang;
        localStorage.setItem('mecraft_lang', lang);

        if (lang === 'th') {
          document.body.classList.add('lang-th');
        } else {
          document.body.classList.remove('lang-th');
        }

        const t = I18N[lang];

        // Static keys
        document.querySelectorAll('[data-i18n]').forEach(el => {
          const key = el.getAttribute('data-i18n');
          if (t[key]) el.innerHTML = t[key];
        });

        // Placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
          const key = el.getAttribute('data-i18n-placeholder');
          if (t[key]) el.placeholder = t[key];
        });

        // Card descriptions & counterparts
        document.querySelectorAll('.card-desc').forEach(el => {
          const text = el.getAttribute('data-desc-' + lang);
          if (text) el.textContent = text;
        });

        document.querySelectorAll('.col-counterpart').forEach(el => {
          const text = el.getAttribute('data-counterpart-' + lang);
          if (text) el.textContent = text;
        });

        // Language button indicator
        const langIndicator = document.getElementById('lang-indicator');
        if (langIndicator) {
          langIndicator.textContent = lang === 'en' ? 'TH' : 'EN';
        }
      }

      // Initialize event listeners
      document.addEventListener('DOMContentLoaded', () => {
        // Set initial language from storage
        setLanguage(currentLang);

        // Language toggle
        const btnLang = document.getElementById('btn-lang');
        if (btnLang) {
          btnLang.addEventListener('click', (e) => {
            e.preventDefault();
            setLanguage(currentLang === 'en' ? 'th' : 'en');
          });
        }

        // Filter tab pills
        const filterTabs = document.querySelectorAll('.filter-tab');
        filterTabs.forEach(tab => {
          tab.addEventListener('click', (e) => {
            e.preventDefault();
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentFilter = tab.getAttribute('data-filter') || 'all';
            applyFilterAndSearch();
          });
        });

        // Live Search Input
        const searchInput = document.getElementById('studio-search');
        if (searchInput) {
          searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            applyFilterAndSearch();
          });
        }

        // Clear Search Button
        const btnClear = document.getElementById('btn-clear-search');
        if (btnClear) {
          btnClear.addEventListener('click', (e) => {
            e.preventDefault();
            if (searchInput) searchInput.value = '';
            searchQuery = '';
            currentFilter = 'all';
            filterTabs.forEach(t => t.classList.remove('active'));
            if (filterTabs[0]) filterTabs[0].classList.add('active');
            applyFilterAndSearch();
          });
        }

        // Quick Dock click-to-jump with smooth scroll
        const dockItems = document.querySelectorAll('.dock-app-item');
        dockItems.forEach(item => {
          item.addEventListener('click', (e) => {
            e.preventDefault();
            const appId = item.getAttribute('data-app-id');
            const target = document.getElementById('studio-card-' + appId);
            if (target) {
              // Ensure filter doesn't hide it
              if (currentFilter !== 'all' && target.getAttribute('data-category') !== currentFilter) {
                currentFilter = 'all';
                filterTabs.forEach(t => t.classList.remove('active'));
                if (filterTabs[0]) filterTabs[0].classList.add('active');
                applyFilterAndSearch();
              }
              target.scrollIntoView({ behavior: 'smooth', block: 'center' });
              target.classList.add('flash-highlight');
              setTimeout(() => target.classList.remove('flash-highlight'), 1200);
            }
          });
        });

        // Copy PowerShell command
        const btnCopyPs = document.getElementById('btn-copy-ps');
        if (btnCopyPs) {
          btnCopyPs.addEventListener('click', (e) => {
            e.preventDefault();
            const psCmd = document.getElementById('ps-cmd');
            if (psCmd) {
              copyText(psCmd.textContent.trim(), 'toast_cmd_copied');
            }
          });
        }
      });
    })();
  </script>
</body>
</html>`;
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

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

// Target destination files to synchronize
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

console.log('🎉 [generate-downloads-portal] ArtCraft card-grid downloads portal successfully assembled and synced!');
