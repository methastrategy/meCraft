/**
 * @file studio-runner.ts
 * Multi-Studio Web Router & In-Browser Studio Orchestrator
 * Supports rendering all 13 meCraft creative and document studios with dedicated URL routes
 */

import { StudioShell } from '@mecraft/studio-shell';
import '@mecraft/studio-shell/styles.css';

// Import studio shell factories
import { createStudioShell as createVectorShell, APP_METADATA as VECTOR_META } from '@mecraft/mevector';
import { createStudioShell as create3dShell, APP_METADATA as THREE_D_META } from '@mecraft/me3d';
import { createStudioShell as createAudioShell, APP_METADATA as AUDIO_META } from '@mecraft/meaudio';
import { createStudioShell as createDeckShell, APP_METADATA as DECK_META } from '@mecraft/medeck';
import { createStudioShell as createDesignShell, APP_METADATA as DESIGN_META } from '@mecraft/medesign';
import { createStudioShell as createFilmShell, APP_METADATA as FILM_META } from '@mecraft/mefilm';
import { createStudioShell as createLightShell, APP_METADATA as LIGHT_META } from '@mecraft/melight';
import { createStudioShell as createMotionShell, APP_METADATA as MOTION_META } from '@mecraft/memotion';
import { createStudioShell as createSheetShell, APP_METADATA as SHEET_META } from '@mecraft/mesheet';
import { createStudioShell as createDocShell, APP_METADATA as DOC_META } from '@mecraft/medocs';

export interface StudioInfo {
  id: string;
  name: string;
  tagline: { en: string; th: string };
  icon: string;
  category: string;
  accentColor: string;
  version: string;
  guardian: { th: string; en: string };
}

export const ALL_STUDIOS: StudioInfo[] = [
  {
    id: 'mepdf',
    name: 'mePDF Studio',
    tagline: {
      en: 'Professional Client-Side PDF Engineering & Document Cockpit',
      th: 'วิศวกรรมเอกสาร PDF รวม/แยก/บีบอัด/ใส่รหัส และฉีด OCR ในเครื่อง',
    },
    icon: '📄',
    category: 'Document',
    accentColor: '#d4af37',
    version: 'v1.0.0',
    guardian: {
      th: 'ท้าวเวสสุวรรณ (Thao Vessuwan)',
      en: 'Thao Vessuwan — Guardian of Treasures & Diamond Mace',
    },
  },
  {
    id: 'mephoto',
    name: 'mePhoto Studio',
    tagline: {
      en: 'CamScanner-Grade Document Restoration & Perspective Photo Lab',
      th: 'แล็บภาพถ่ายและกู้คืนเอกสาร ปรับมุม 4 จุด Homography และลบเงา Otsu',
    },
    icon: '🖼️',
    category: 'Photo & Color',
    accentColor: '#10b981',
    version: 'v1.0.0',
    guardian: {
      th: 'พญานาค (Phraya Naga)',
      en: 'Phraya Naga — Emerald Serpent with Radiant Gem',
    },
  },
  {
    id: 'medrop',
    name: 'meDrop Radial Converter',
    tagline: {
      en: 'Zero-Window Radial Drag & Drop File Converter HUD',
      th: 'วงแหวนแปลงไฟล์เรเดียลรอบเมาส์ ลากวางไฟล์แปลงทันทีใน RAM',
    },
    icon: '🎯',
    category: 'Utility',
    accentColor: '#06b6d4',
    version: 'v1.0.0',
    guardian: {
      th: 'ม้านิลมังกร (Ma Nil Mangkon)',
      en: 'Ma Nil Mangkon — Swift Dragon-Horse & Radial Wheel',
    },
  },
  {
    id: 'medocs',
    name: 'meDocs Studio',
    tagline: {
      en: 'Distraction-Free Pro Writing, Real-Time Markdown & KaTeX Engine',
      th: 'โปรแกรมพิมพ์งานไร้สิ่งรบกวน Markdown, สมการ KaTeX และผัง Mermaid สด',
    },
    icon: '📝',
    category: 'Document',
    accentColor: '#0d9488',
    version: 'v1.0.0',
    guardian: {
      th: 'พระสุนทรีวาณี (Sunthari Vani)',
      en: 'Sunthari Vani — Goddess of Eloquence & Crystal Lotus',
    },
  },
  {
    id: 'mevector',
    name: 'meVector Studio',
    tagline: {
      en: 'Precision Bézier Vector Illustration & SVG Studio',
      th: 'วาดภาพประกอบเวกเตอร์ Bézier ความแม่นยำสูง และส่งออก SVG/PDF สะอาด',
    },
    icon: '✒️',
    category: 'Vector & Design',
    accentColor: '#3b82f6',
    version: 'v1.0.0',
    guardian: {
      th: 'พญาครุฑ (Phraya Garuda)',
      en: 'Phraya Garuda — King of Birds with Feather Splines',
    },
  },
  {
    id: 'me3d',
    name: 'me3D Studio',
    tagline: {
      en: 'WebGL Polygon Mesh Modeling & PBR Spatial Staging Studio',
      th: 'ปั้นโมเดลโพลีกอน 3 มิติ, จัดวางวัสดุ PBR และแสงสตูดิโอ HDRI แบบเรียลไทม์',
    },
    icon: '🧊',
    category: 'Audio & 3D',
    accentColor: '#6366f1',
    version: 'v1.0.0',
    guardian: {
      th: 'พระวิศวกรรม (Vishvakarman)',
      en: 'Vishvakarman — Celestial Architect & Builder of Worlds',
    },
  },
  {
    id: 'mefilm',
    name: 'meFilm Studio',
    tagline: {
      en: 'Non-Linear Multi-Layer Video Editor & Clip Arrangement Suite',
      th: 'ตัดต่อวิดีโอหลายเลเยอร์ Non-Linear, ใส่ Transition และเรนเดอร์ MP4 ด่วน',
    },
    icon: '🎬',
    category: 'Video & Motion',
    accentColor: '#ef4444',
    version: 'v1.0.0',
    guardian: {
      th: 'นางกินรี (Kinnari Maiden)',
      en: 'Kinnari Maiden — Celestial Creature with Golden Wings',
    },
  },
  {
    id: 'melight',
    name: 'meLight Studio',
    tagline: {
      en: 'HDR Tone Mapping, Parametric Exposure & RAW Photo Grade Lab',
      th: 'ปรับแต่งภาพถ่าย RAW, ปรับแสง Parametric Exposure และ Tone Mapping HDR',
    },
    icon: '☀️',
    category: 'Photo & Color',
    accentColor: '#eab308',
    version: 'v1.0.0',
    guardian: {
      th: 'นางสุพรรณมัจฉา (Suphannamatcha)',
      en: 'Suphannamatcha — Golden Mermaid with Iridescent Scales',
    },
  },
  {
    id: 'memotion',
    name: 'meMotion Studio',
    tagline: {
      en: 'Keyframe Motion Graphics, Kinetic Typography & Particle VFX',
      th: 'แอนิเมชันกราฟิกเคลื่อนไหว Keyframe, ตัวอักษร Kinetic และเอฟเฟกต์อนุภาค',
    },
    icon: '✨',
    category: 'Video & Motion',
    accentColor: '#a855f7',
    version: 'v1.0.0',
    guardian: {
      th: 'หนุมาน (Hanuman)',
      en: 'Hanuman — White Monkey God of Agile Motion',
    },
  },
  {
    id: 'medesign',
    name: 'meDesign Studio',
    tagline: {
      en: 'UI/UX Prototyping, Design Systems & Layout Grid Suite',
      th: 'ออกแบบ UI/UX Prototyping, ระบบ Design System และจัดวางหน้ากระดาษ',
    },
    icon: '📐',
    category: 'Vector & Design',
    accentColor: '#8b5cf6',
    version: 'v1.0.0',
    guardian: {
      th: 'ช้างเอราวัณ (Erawan Elephant)',
      en: 'Erawan Elephant — 3-Headed Divine Architect Elephant',
    },
  },
  {
    id: 'meaudio',
    name: 'meAudio Studio',
    tagline: {
      en: 'Speech Master, Spectral Denoise & Multi-Track Podcast Audio Studio',
      th: 'มาสเตอร์เสียงพูด, ตัดเสียงรบกวน Spectral และตัดต่อพอดแคสต์หลายไมค์',
    },
    icon: '🎙️',
    category: 'Audio & 3D',
    accentColor: '#ec4899',
    version: 'v1.0.0',
    guardian: {
      th: 'พระพิราพ (Phra Phirap)',
      en: 'Phra Phirap — Master Deity of Dramatic Arts & Sound',
    },
  },
  {
    id: 'medeck',
    name: 'meDeck Studio',
    tagline: {
      en: 'High-Impact Interactive Presentation & Keynote Slide Studio',
      th: 'สร้างสไลด์นำเสนอเชิงโต้ตอบ กราฟิกการนำเสนอ และส่งออก PDF/WebDeck',
    },
    icon: '📊',
    category: 'Creative',
    accentColor: '#f97316',
    version: 'v1.0.0',
    guardian: {
      th: 'พระพิฆเนศ (Ganesha)',
      en: 'Ganesha — Lord of Intellect, Wisdom & High-Impact Arts',
    },
  },
  {
    id: 'mecad',
    name: 'meCAD Studio',
    tagline: {
      en: '2D Engineering CAD Drafting & Millimeter Precision Plotter',
      th: 'เขียนแบบวิศวกรรม 2D CAD ความแม่นยำสูงระดับมิลลิเมตร และจัดการ DXF',
    },
    icon: '📐',
    category: 'Vector & CAD',
    accentColor: '#0ea5e9',
    version: 'v1.0.0',
    guardian: {
      th: 'พระพรหม (Phra Phrom)',
      en: 'Phra Phrom — Four-Faced Divine Creator & Universal Blueprint',
    },
  },
  {
    id: 'mesheet',
    name: 'meSheet Studio',
    tagline: {
      en: 'Reactive Financial Modeling & High-Volume Spreadsheet Grid',
      th: 'ตารางคำนวณสเปรดชีตสูตรการเงินความเร็วสูง และประมวลผลข้อมูลใน RAM',
    },
    icon: '📈',
    category: 'Document',
    accentColor: '#14b8a6',
    version: 'v1.0.0',
    guardian: {
      th: 'พระแม่โพสพ (Phra Mae Phosop)',
      en: 'Phra Mae Phosop — Goddess of Abundance & Financial Balance',
    },
  },
  {
    id: 'metexture',
    name: 'meTexture Studio',
    tagline: {
      en: 'Direct 3D Mesh Brush Painter & UV Unwrapping Workspace',
      th: 'เพนต์ลวดลายบนผิวโมเดล 3D Mesh โดยตรง และกางระนาบ UV เกาะผิวโมเดล',
    },
    icon: '🎨',
    category: '3D & Sound',
    accentColor: '#f43f5e',
    version: 'v1.0.0',
    guardian: {
      th: 'พาลี (Vali)',
      en: 'Vali — Emerald Simian Sovereign with Immeasurable Force',
    },
  },
  {
    id: 'mematerial',
    name: 'meMaterial Studio',
    tagline: {
      en: 'Procedural Node-Based PBR Material & Shader Synthesizer',
      th: 'สังเคราะห์พื้นผิว PBR เสมือนจริงด้วยโหนดเชื่อมต่อ และเขียน WebGPU Shader',
    },
    icon: '💎',
    category: '3D & Sound',
    accentColor: '#8b5cf6',
    version: 'v1.0.0',
    guardian: {
      th: 'สุครีพ (Sugriva)',
      en: 'Sugriva — Solar Simian King of Radiant Light & Refraction',
    },
  },
  {
    id: 'meani',
    name: 'meAni Studio',
    tagline: {
      en: '2D Skeletal Animation, Inverse Kinematics & Sprite Rigging',
      th: 'แอนิเมชัน 2 มิติติดกระดูกโครงสร้าง สรีระจำลอง IK และทำ Sprite Sheet เกม',
    },
    icon: '🏃',
    category: 'Video & Motion',
    accentColor: '#d946ef',
    version: 'v1.0.0',
    guardian: {
      th: 'องคต (Angada)',
      en: 'Angada — Peerless Messenger of Velocity & Sovereign Leap',
    },
  },
  {
    id: 'merea',
    name: 'meREA Studio',
    tagline: {
      en: 'Forensic Binary Reverse Engineering & Clean-Room Code Synthesis',
      th: 'แกะรอยระบบ ถอดรหัสไบนารี สถาปัตยกรรมย้อนรอย และสร้างโค้ดอัตโนมัติ',
    },
    icon: '⚡',
    category: 'Utility & REA',
    accentColor: '#00f0ff',
    version: 'v1.0.0',
    guardian: {
      th: 'มัยราพณ์ (Maiyarap)',
      en: 'Maiyarap — Lord of the Underworld & Occult Decryption',
    },
  },
];

/**
 * Detect if current URL path or search query points to a specific studio
 */
export function detectStudioRoute(): string | null {
  if (typeof window === 'undefined' || !window.location) return null;

  // 1. Check Query Parameter (?studio=... or ?app=...)
  try {
    if (window.location.search) {
      const params = new URLSearchParams(window.location.search);
      const studioParam = params.get('studio') || params.get('app');
      if (studioParam && ALL_STUDIOS.some(s => s.id === studioParam.toLowerCase())) {
        return studioParam.toLowerCase();
      }
    }
  } catch {}

  // 2. Check URL Pathname (e.g. /mevector, /me3d/, /mepdf)
  try {
    if (typeof window.location.pathname === 'string') {
      const pathname = window.location.pathname.replace(/\/+$/, '').toLowerCase();
      const segments = pathname.split('/').filter(Boolean);
      const lastSegment = segments[segments.length - 1];

      if (lastSegment && ALL_STUDIOS.some(s => s.id === lastSegment)) {
        return lastSegment;
      }
    }
  } catch {}

  return null;
}

/**
 * Render Top Navigation Bar for any studio with quick studio switcher and back-to-workstation button
 */
function renderStudioHeader(currentStudio: StudioInfo, lang: 'en' | 'th'): string {
  const isTh = lang === 'th';
  return `
    <header class="studio-global-nav" style="--studio-accent: ${currentStudio.accentColor};">
      <div class="studio-nav-left">
        <a href="./" class="studio-back-btn" id="studio-btn-back-workstation" title="${isTh ? 'กลับไปยังโปรแกรมแก้ไข meCraft' : 'Back to meCraft IDE Workspace'}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          <span class="studio-back-emblem">⚡</span>
          <span class="studio-back-text"><strong>meCraft</strong> IDE Workspace</span>
        </a>
        <div class="studio-nav-divider"></div>
        <div class="studio-nav-current">
          <span class="studio-nav-icon">${currentStudio.icon}</span>
          <span class="studio-nav-title">${currentStudio.name}</span>
          <span class="studio-nav-ver">${currentStudio.version}</span>
          <span class="studio-nav-guardian" style="margin-left: 8px; font-size: 11px; color: #f7d774; background: rgba(212,175,55,0.12); border: 1px solid rgba(212,175,55,0.25); border-radius: 4px; padding: 2px 8px;">🛡️ ${currentStudio.guardian ? currentStudio.guardian[lang] : ''}</span>
        </div>
      </div>

      <div class="studio-nav-center">
        <label for="studio-quick-picker" class="studio-picker-label">${isTh ? '🎨 สลับสตูดิโอ:' : '🎨 Switch Studio:'}</label>
        <select id="studio-quick-picker" class="studio-quick-picker" aria-label="Switch Studio">
          ${ALL_STUDIOS.map(s => `
            <option value="${s.id}" ${s.id === currentStudio.id ? 'selected' : ''}>
              ${s.icon} ${s.name} (${s.category})
            </option>
          `).join('')}
        </select>
      </div>

      <div class="studio-nav-right"></div>
    </header>
  `;
}

/**
 * Creates custom Studio Shell for mePDF Studio
 */
function createPdfStudioShell(): StudioShell {
  return new StudioShell({
    appId: 'mepdf',
    appName: 'mePDF Studio',
    appTag: 'Acrobat Pro / Visual Cockpit',
    version: '1.0.0',
    documentTitle: 'mePDF Studio — Client-Side PDF Engineering & Document Cockpit',
    theme: 'luxury-dark',
    menu: [
      {
        id: 'file',
        label: 'File',
        items: [
          { id: 'open-pdf', label: 'Open PDF...', shortcut: 'Ctrl+O' },
          { id: 'save-pdf', label: 'Save PDF', shortcut: 'Ctrl+S' },
          { id: 'export-compressed', label: 'Export Compressed PDF' },
          { id: 'export-encrypted', label: 'Export AES-256 Encrypted PDF' },
        ],
      },
      {
        id: 'edit',
        label: 'Pages & Actions',
        items: [
          { id: 'merge', label: 'Merge Documents...' },
          { id: 'split', label: 'Split Page Ranges...' },
          { id: 'rotate', label: 'Rotate Clockwise 90°', shortcut: 'Ctrl+R' },
          { id: 'extract-ocr', label: 'Extract & Inject Searchable OCR' },
        ],
      },
      {
        id: 'security',
        label: 'Privacy & Security',
        items: [
          { id: 'verify-hash', label: 'Inspect SHA-256 Integrity' },
          { id: 'sanitize', label: 'Sanitize Metadata & Forms' },
        ],
      },
    ],
    ribbon: [
      {
        id: 'tools',
        tools: [
          { id: 'merge-tool', label: '📄 Merge PDF' },
          { id: 'compress-tool', label: '🗜️ Smart Compression' },
          { id: 'ocr-tool', label: '🔍 Searchable OCR' },
          { id: 'encrypt-tool', label: '🔒 AES-256 Encrypt' },
          { id: 'rotate-tool', label: '↻ Rotate Pages' },
          { id: 'split-tool', label: '✂️ Split Document' },
        ],
      },
    ],
    panes: {
      left: {
        title: 'Document Pages',
        initialWidth: 260,
        minWidth: 180,
        collapsible: true,
        content: `
          <div style="padding: 16px; font-size: 12px; color: #94a3b8; display: flex; flex-direction: column; gap: 12px;">
            <div style="font-weight: 600; color: #e2e8f0; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px;">
              📄 Page Thumbnails (Visual Cockpit)
            </div>
            <div style="border: 2px dashed rgba(212,175,55,0.3); border-radius: 8px; padding: 24px 12px; text-align: center; background: rgba(212,175,55,0.03);">
              <span style="font-size: 24px; display: block; margin-bottom: 8px;">📂</span>
              <strong style="color: #f8fafc; display: block;">Drop PDF to Inspect</strong>
              <span style="font-size: 11px; color: #64748b;">Supports Multi-Page Reordering</span>
            </div>
            <div style="background: rgba(15,23,42,0.6); padding: 10px; border-radius: 6px; font-size: 11px; border: 1px solid rgba(255,255,255,0.06);">
              <div style="color: #d4af37; font-weight: 600; margin-bottom: 4px;">⚡ Dual-Engine Compressor</div>
              <div>• Lossless Deflate Vector: Contracts</div>
              <div>• Scanned Downsampling: High-Volume</div>
            </div>
          </div>
        `,
      },
      center: {
        content: `
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; min-height: 480px; padding: 40px; text-align: center; background: radial-gradient(circle at 50% 30%, rgba(212,175,55,0.08) 0%, rgba(6,9,19,0.95) 70%);">
            <div style="width: 72px; height: 72px; border-radius: 18px; background: rgba(212,175,55,0.12); border: 1px solid rgba(212,175,55,0.3); display: flex; align-items: center; justify-content: center; font-size: 36px; margin-bottom: 20px; box-shadow: 0 12px 32px rgba(212,175,55,0.15);">
              📄
            </div>
            <h2 style="font-size: 22px; font-weight: 700; color: #f8fafc; margin: 0 0 8px 0;">mePDF Studio Document Workspace</h2>
            <p style="font-size: 14px; color: #94a3b8; max-width: 580px; line-height: 1.6; margin: 0 0 24px 0;">
              High-performance client-side document engineering with PDF-Lib and WebAssembly. 100% In-Device RAM isolation ensures absolute confidentiality.
            </p>
            <div style="display: flex; gap: 12px; flex-wrap: wrap; justify-content: center;">
              <button type="button" style="padding: 10px 20px; border-radius: 8px; background: linear-gradient(135deg, #d4af37, #b89628); color: #07090e; font-weight: 600; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; font-size: 13px;">
                <span>📂 Browse Local PDF</span>
              </button>
              <a href="./mepdf/" target="_blank" rel="noopener noreferrer" style="padding: 10px 20px; border-radius: 8px; background: rgba(255,255,255,0.06); color: #e2e8f0; font-weight: 500; border: 1px solid rgba(255,255,255,0.12); text-decoration: none; display: inline-flex; align-items: center; gap: 8px; font-size: 13px;">
                <span>🚀 Open Full Standalone PDF App</span>
              </a>
            </div>
          </div>
        `,
      },
      right: {
        title: 'Document Inspector',
        initialWidth: 260,
        minWidth: 180,
        collapsible: true,
        content: `
          <div style="padding: 16px; font-size: 11px; color: #94a3b8; display: flex; flex-direction: column; gap: 10px;">
            <div style="font-weight: 600; color: #e2e8f0; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px;">
              📊 Properties & Security
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>Engine:</span>
              <strong style="color: #f1f5f9;">PDF-Lib + WASM</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>Encryption:</span>
              <span style="color: #10b981;">AES-256 Ready</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>OCR Status:</span>
              <span style="color: #38bdf8;">Client-Side OCR</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>Cloud Telemetry:</span>
              <strong style="color: #10b981;">Zero (0 Bytes)</strong>
            </div>
          </div>
        `,
      },
    },
  });
}

/**
 * Creates custom Studio Shell for mePhoto Studio
 */
function createPhotoStudioShell(): StudioShell {
  return new StudioShell({
    appId: 'mephoto',
    appName: 'mePhoto Studio',
    appTag: 'CamScanner Pro / Photo Lab',
    version: '1.0.0',
    documentTitle: 'mePhoto Studio — CamScanner-Grade Document Restoration & Photo Lab',
    theme: 'luxury-dark',
    menu: [
      {
        id: 'file',
        label: 'File',
        items: [
          { id: 'open-photo', label: 'Open Image...', shortcut: 'Ctrl+O' },
          { id: 'save-enhanced', label: 'Export Clean Image', shortcut: 'Ctrl+S' },
          { id: 'save-pdf', label: 'Save as PDF Document' },
        ],
      },
      {
        id: 'tools',
        label: 'Restoration Tools',
        items: [
          { id: 'homography', label: '4-Point Perspective Deskew' },
          { id: 'otsu', label: 'Adaptive Local Otsu Binarization' },
          { id: 'magic-color', label: 'CamScanner Magic Color Enhancement' },
          { id: 'shadow-erase', label: 'Shadow Eradication Filter' },
        ],
      },
    ],
    ribbon: [
      {
        id: 'filters',
        tools: [
          { id: 'deskew', label: '📐 4-Point Deskew' },
          { id: 'magic', label: '✨ Magic Color' },
          { id: 'binarize', label: '⚫ B&W Clean' },
          { id: 'shadow', label: '☀️ Erase Shadows' },
          { id: 'crop', label: '✂️ Precise Crop' },
        ],
      },
    ],
    panes: {
      left: {
        title: 'Filter Presets',
        initialWidth: 240,
        minWidth: 160,
        collapsible: true,
        content: `
          <div style="padding: 16px; font-size: 12px; color: #94a3b8; display: flex; flex-direction: column; gap: 10px;">
            <div style="font-weight: 600; color: #e2e8f0; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px;">
              🎨 CamScanner Presets
            </div>
            <button type="button" style="width: 100%; text-align: left; padding: 8px 12px; border-radius: 6px; background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); color: #10b981; font-size: 12px; cursor: pointer;">
              ✓ Magic Color (High Contrast)
            </button>
            <button type="button" style="width: 100%; text-align: left; padding: 8px 12px; border-radius: 6px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: #f1f5f9; font-size: 12px; cursor: pointer;">
              • B&W Document Otsu
            </button>
            <button type="button" style="width: 100%; text-align: left; padding: 8px 12px; border-radius: 6px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: #f1f5f9; font-size: 12px; cursor: pointer;">
              • Grayscale Clean
            </button>
          </div>
        `,
      },
      center: {
        content: `
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; min-height: 480px; padding: 40px; text-align: center; background: radial-gradient(circle at 50% 30%, rgba(16,185,129,0.08) 0%, rgba(6,9,19,0.95) 70%);">
            <div style="width: 72px; height: 72px; border-radius: 18px; background: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.3); display: flex; align-items: center; justify-content: center; font-size: 36px; margin-bottom: 20px; box-shadow: 0 12px 32px rgba(16,185,129,0.15);">
              🖼️
            </div>
            <h2 style="font-size: 22px; font-weight: 700; color: #f8fafc; margin: 0 0 8px 0;">mePhoto Studio Image Restoration Lab</h2>
            <p style="font-size: 14px; color: #94a3b8; max-width: 580px; line-height: 1.6; margin: 0 0 24px 0;">
              Hardware-accelerated image restoration with 4-point homography corner detection, adaptive shadow removal, and contrast enhancement.
            </p>
            <div style="display: flex; gap: 12px; flex-wrap: wrap; justify-content: center;">
              <button type="button" style="padding: 10px 20px; border-radius: 8px; background: linear-gradient(135deg, #10b981, #059669); color: #07090e; font-weight: 600; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; font-size: 13px;">
                <span>📂 Browse Local Image</span>
              </button>
              <a href="./mephoto/" target="_blank" rel="noopener noreferrer" style="padding: 10px 20px; border-radius: 8px; background: rgba(255,255,255,0.06); color: #e2e8f0; font-weight: 500; border: 1px solid rgba(255,255,255,0.12); text-decoration: none; display: inline-flex; align-items: center; gap: 8px; font-size: 13px;">
                <span>🚀 Open Full Standalone Photo App</span>
              </a>
            </div>
          </div>
        `,
      },
      right: {
        title: 'Perspective Matrix',
        initialWidth: 240,
        minWidth: 160,
        collapsible: true,
        content: `
          <div style="padding: 16px; font-size: 11px; color: #94a3b8; display: flex; flex-direction: column; gap: 10px;">
            <div style="font-weight: 600; color: #e2e8f0; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px;">
              📐 Corner Coordinates
            </div>
            <div>TL: (0, 0)</div>
            <div>TR: (1920, 0)</div>
            <div>BR: (1920, 1080)</div>
            <div>BL: (0, 1080)</div>
            <div style="margin-top: 12px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 8px; color: #10b981;">
              ✓ Homography Matrix Calculated
            </div>
          </div>
        `,
      },
    },
  });
}

/**
 * Creates custom Studio Shell for meDrop Studio
 */
function createDropStudioShell(): StudioShell {
  return new StudioShell({
    appId: 'medrop',
    appName: 'meDrop Radial Converter',
    appTag: 'Zero-Window HUD / Converter',
    version: '1.0.0',
    documentTitle: 'meDrop Radial Converter — Zero-Window Drag & Drop File Converter HUD',
    theme: 'luxury-dark',
    menu: [
      {
        id: 'file',
        label: 'Conversion Hub',
        items: [
          { id: 'sample', label: 'Load Sample File' },
          { id: 'settings', label: 'Configure Radial Actions...' },
        ],
      },
    ],
    ribbon: [
      {
        id: 'actions',
        tools: [
          { id: 'convert-pdf', label: '📄 To PDF' },
          { id: 'convert-jpg', label: '🖼️ To JPG/PNG' },
          { id: 'convert-webp', label: '⚡ To WebP' },
          { id: 'ocr-txt', label: '🔍 Extract Text' },
        ],
      },
    ],
    panes: {
      center: {
        content: `
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; min-height: 520px; padding: 40px; text-align: center; background: radial-gradient(circle at 50% 50%, rgba(6,182,212,0.12) 0%, rgba(6,9,19,0.98) 70%);">
            <div style="width: 140px; height: 140px; border-radius: 50%; border: 2px dashed rgba(6,182,212,0.5); display: flex; flex-direction: column; align-items: center; justify-content: center; margin-bottom: 24px; background: rgba(6,182,212,0.05); animation: pulse 2s infinite ease-in-out;">
              <span style="font-size: 38px;">🎯</span>
              <span style="font-size: 11px; color: #06b6d4; font-weight: 600; margin-top: 4px;">DROP ZONE</span>
            </div>
            <h2 style="font-size: 22px; font-weight: 700; color: #f8fafc; margin: 0 0 8px 0;">meDrop Radial File Converter HUD</h2>
            <p style="font-size: 14px; color: #94a3b8; max-width: 580px; line-height: 1.6; margin: 0 0 24px 0;">
              In Windows native desktop, hold Ctrl while dragging any file in File Explorer to summon the dynamic 8-wedge radial converter wheel directly around your cursor.
            </p>
            <div style="display: flex; gap: 12px; flex-wrap: wrap; justify-content: center;">
              <a href="./medrop/" target="_blank" rel="noopener noreferrer" style="padding: 10px 20px; border-radius: 8px; background: linear-gradient(135deg, #06b6d4, #0891b2); color: #07090e; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; font-size: 13px;">
                <span>🚀 Launch Standalone meDrop HUD</span>
              </a>
            </div>
          </div>
        `,
      },
    },
  });
}

/**
 * Generic Studio Shell Factory for specialized studios
 */
function createGenericStudioShell(info: StudioInfo): StudioShell {
  return new StudioShell({
    appId: info.id,
    appName: info.name,
    appTag: info.category,
    version: info.version,
    documentTitle: `${info.name} — ${info.tagline.en}`,
    theme: 'luxury-dark',
    menu: [
      {
        id: 'file',
        label: 'File',
        items: [
          { id: 'new', label: 'New Project', shortcut: 'Ctrl+N' },
          { id: 'open', label: 'Open File...', shortcut: 'Ctrl+O' },
          { id: 'save', label: 'Save', shortcut: 'Ctrl+S' },
          { id: 'export', label: 'Export Asset...' },
        ],
      },
      {
        id: 'edit',
        label: 'Edit',
        items: [
          { id: 'undo', label: 'Undo', shortcut: 'Ctrl+Z' },
          { id: 'redo', label: 'Redo', shortcut: 'Ctrl+Y' },
          { id: 'preferences', label: 'Preferences' },
        ],
      },
      {
        id: 'view',
        label: 'View',
        items: [
          { id: 'zoom-in', label: 'Zoom In', shortcut: 'Ctrl++' },
          { id: 'zoom-out', label: 'Zoom Out', shortcut: 'Ctrl+-' },
          { id: 'reset-view', label: 'Reset View', shortcut: 'Ctrl+0' },
        ],
      },
    ],
    ribbon: [
      {
        id: 'tools',
        tools: [
          { id: 'select', label: '👆 Select' },
          { id: 'draw', label: '✏️ Tool Canvas' },
          { id: 'inspect', label: '🔍 Inspector' },
          { id: 'export-btn', label: '⬇ Export' },
        ],
      },
    ],
    panes: {
      left: {
        title: `${info.name} Navigator`,
        initialWidth: 260,
        minWidth: 180,
        collapsible: true,
        content: `
          <div style="padding: 16px; font-size: 12px; color: #94a3b8; display: flex; flex-direction: column; gap: 12px;">
            <div style="font-weight: 600; color: #e2e8f0; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px;">
              ${info.icon} ${info.name} Assets
            </div>
            <div style="border: 2px dashed ${info.accentColor}50; border-radius: 8px; padding: 24px 12px; text-align: center; background: ${info.accentColor}08;">
              <span style="font-size: 24px; display: block; margin-bottom: 8px;">${info.icon}</span>
              <strong style="color: #f8fafc; display: block;">Drop Files Here</strong>
              <span style="font-size: 11px; color: #64748b;">100% In-Device RAM Isolation</span>
            </div>
          </div>
        `,
      },
      center: {
        content: `
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; min-height: 480px; padding: 40px; text-align: center; background: radial-gradient(circle at 50% 30%, ${info.accentColor}15 0%, rgba(6,9,19,0.95) 70%);">
            <div style="width: 72px; height: 72px; border-radius: 18px; background: ${info.accentColor}20; border: 1px solid ${info.accentColor}50; display: flex; align-items: center; justify-content: center; font-size: 36px; margin-bottom: 20px; box-shadow: 0 12px 32px ${info.accentColor}25;">
              ${info.icon}
            </div>
            <h2 style="font-size: 22px; font-weight: 700; color: #f8fafc; margin: 0 0 8px 0;">${info.name} Studio Workspace</h2>
            <p style="font-size: 14px; color: #94a3b8; max-width: 580px; line-height: 1.6; margin: 0 0 24px 0;">
              ${info.tagline.en}. Powered by local client-side WebAssembly & WebGPU. Zero telemetry.
            </p>
            <div style="display: flex; gap: 12px; flex-wrap: wrap; justify-content: center;">
              <button type="button" style="padding: 10px 20px; border-radius: 8px; background: ${info.accentColor}; color: #07090e; font-weight: 700; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; font-size: 13px;">
                <span>✨ New Project</span>
              </button>
              <a href="./${info.id}/" target="_blank" rel="noopener noreferrer" style="padding: 10px 20px; border-radius: 8px; background: rgba(255,255,255,0.06); color: #e2e8f0; font-weight: 500; border: 1px solid rgba(255,255,255,0.12); text-decoration: none; display: inline-flex; align-items: center; gap: 8px; font-size: 13px;">
                <span>🚀 Open Standalone View</span>
              </a>
            </div>
          </div>
        `,
      },
      right: {
        title: 'Properties & Telemetry',
        initialWidth: 260,
        minWidth: 180,
        collapsible: true,
        content: `
          <div style="padding: 16px; font-size: 11px; color: #94a3b8; display: flex; flex-direction: column; gap: 10px;">
            <div style="font-weight: 600; color: #e2e8f0; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px;">
              📊 Engine Status
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>Architecture:</span>
              <strong style="color: #f1f5f9;">WASM + WebGPU</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>Device Memory:</span>
              <span style="color: #10b981;">100% In-Device RAM</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>Network Upload:</span>
              <strong style="color: #10b981;">0 Bytes (Zero-Cloud)</strong>
            </div>
          </div>
        `,
      },
    },
  });
}

/**
 * Mounts any specified studio into the given container element
 */
export function mountStudio(studioId: string, container: HTMLElement, lang: 'en' | 'th' = 'en'): void {
  const targetStudio = ALL_STUDIOS.find(s => s.id === studioId) || ALL_STUDIOS[0];
  container.innerHTML = '';

  // 1. Create Top Studio Navigation Header
  const headerWrapper = document.createElement('div');
  headerWrapper.className = 'studio-header-wrap';
  headerWrapper.innerHTML = renderStudioHeader(targetStudio, lang);
  container.appendChild(headerWrapper);

  // 2. Create Studio Workspace Shell Target
  const workspaceContainer = document.createElement('div');
  workspaceContainer.id = 'studio-workspace-root';
  workspaceContainer.className = 'studio-workspace-container';
  container.appendChild(workspaceContainer);

  // 3. Instantiate and Mount the appropriate studio shell
  let shell: StudioShell;

  switch (targetStudio.id) {
    case 'mepdf':
      shell = createPdfStudioShell();
      break;
    case 'mephoto':
      shell = createPhotoStudioShell();
      break;
    case 'medrop':
      shell = createDropStudioShell();
      break;
    case 'medocs':
    case 'medoc':
      shell = createDocShell();
      break;
    case 'mevector':
      shell = createVectorShell();
      break;
    case 'me3d':
      shell = create3dShell();
      break;
    case 'meaudio':
      shell = createAudioShell();
      break;
    case 'medeck':
      shell = createDeckShell();
      break;
    case 'medesign':
      shell = createDesignShell();
      break;
    case 'mefilm':
      shell = createFilmShell();
      break;
    case 'melight':
      shell = createLightShell();
      break;
    case 'memotion':
      shell = createMotionShell();
      break;
    case 'mesheet':
      shell = createSheetShell();
      break;
    case 'mecad':
    case 'metexture':
    case 'mematerial':
    case 'meani':
    case 'merea':
      shell = createGenericStudioShell(targetStudio);
      break;
    default:
      shell = createGenericStudioShell(targetStudio);
      break;
  }

  shell.mount(workspaceContainer);

  // 4. Attach event listeners
  document.getElementById('studio-quick-picker')?.addEventListener('change', (e) => {
    const selected = (e.target as HTMLSelectElement).value;
    if (selected) {
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.pathname = `/${selected}/`;
        url.searchParams.delete('studio');
        url.searchParams.delete('app');
        window.history.pushState({}, '', url.toString());
      }
      mountStudio(selected, container, lang);
    }
  });

  document.getElementById('studio-btn-back-workstation')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', './');
      window.location.reload();
    }
  });
}
