# 🗺️ meCraft Suite — Master Roadmap & Engineering Milestones

> **Ecosystem Vision:** 100% Client-Side Private Document & Creative Engineering Suite.  
> **Repository Strategy:** Unified Monorepo (`npm workspaces` across `apps/*` and `packages/*`).

---

## 1. Application Ecosystem Milestones

| Application | Workspace | Status | Focus Areas | Target Release |
|:---|:---|:---:|:---|:---:|
| **🚀 meCraft Launcher Hub** | `apps/mecraft-launcher` | **Stable** (`v1.0.0`) | Universal Hub drop zone, native detached process spawning, dual-action routing, and bilingual Thai/EN cockpit. | Released ✅ |
| **💻 meIDE Studio** | `apps/meide` | **Stable** (`v1.0.0`) | Standalone AI Web/Desktop IDE, Monaco editor, File System API, and local Copilot integration. | Released ✅ |
| **📄 mePDF Studio** | `apps/mepdf` | **Stable** (`v1.0.0`) | 3-pane Studio Cockpit, Dual-Engine compression (Lossless & Scanned), 256-bit AES encryption, searchable OCR layer injection. | Released ✅ |
| **🪄 mePhoto Studio** | `apps/mephoto` | **Stable** (`v1.0.0`) | 4-point homography perspective deskew, Adaptive Otsu binarization, Magic Color, and 1-click ClipBus handoff to mePDF. | Released ✅ |
| **📝 meDoc Studio** | `apps/medoc` | **Stable** (`v1.0.0`) | Thai Sarabun 16pt mode, Official Memo/Letter/Meeting templates, ๑๒๓ numeral converter, and Intl.Segmenter word segmentation. | Released ✅ |
| **📊 meSheet Studio** | `apps/mesheet` | **Stable** (`v1.0.0`) | Spreadsheet canvas, ribbon tools, =BAHTTEXT() formula inspection, and Thai numeral formatting. | Released ✅ |
| **📽️ meDeck Studio** | `apps/medeck` | **Stable** (`v1.0.0`) | Presentation slide deck builder, Sarabun typography, ๑๒๓ slide counter, and high-fidelity HTML/PDF export. | Released ✅ |
| **🍩 meDrop Transfer** | `apps/medrop` | **Stable** (`v1.0.0`) | Radial drag-and-drop HUD converter, instant MIME routing, and ClipBus pipe. | Released ✅ |
| **📐 meVector** | `apps/mevector` | **Stable** (`v1.0.0`) | Precision Bézier vector editor, node manipulation, boolean path operations, and infinite-resolution SVG/PDF export. | Released ✅ |
| **🧊 me3D Studio** | `apps/me3d` | **Stable** (`v1.0.0`) | 3D object viewer, WebGL canvas, and geometry inspector. | Released ✅ |
| **🎵 meAudio Studio** | `apps/meaudio` | **Stable** (`v1.0.0`) | Audio spectrum analyzer, waveform preview, and local audio utilities. | Released ✅ |
| **📐 meDesign Studio** | `apps/medesign` | **Stable** (`v1.0.0`) | Vector UI/UX canvas, flex layout engine, and component exporter. | Released ✅ |
| **🎬 meFilm Studio** | `apps/mefilm` | **Stable** (`v1.0.0`) | Multi-track timeline, keyframe video trimmer, and lossless MP4 handoff. | Released ✅ |
| **💡 meLight Studio** | `apps/melight` | **Stable** (`v1.0.0`) | Non-destructive RAW photo color grader, exposure curves, and LUT presets. | Released ✅ |
| **🎞️ meMotion Studio** | `apps/memotion` | **Stable** (`v1.0.0`) | Animation compositor, easing curves, and sprite sheet generator. | Released ✅ |

---

## 2. Completed Phase Deliverables

### Phase 1: Foundation Hardening & Memory Ceiling (Verified ✅)
- Decoupled IndexedDB storage architecture ($\le 5\text{ KB}$ workspace state writes).
- LRU thumbnail cache capped at 120 pages to eliminate iOS Safari canvas memory crashes.
- Thai-Latin mixed typography stack (`'Plus Jakarta Sans', 'Inter', 'IBM Plex Sans Thai'`).

### Phase 2: High-Demand Pro Features (Verified ✅)
- Client-side 256-bit AES encryption and password protection.
- Custom watermark engine with rotation, opacity, and 9-point grid alignment.
- Automated page numbering engine with print-standard margins.
- Privacy-first PDF metadata sanitizer stripping author and tracking tags.

### Phase 3: Web Worker Offloading & Lossless Compression (Verified ✅)
- Dedicated PDF operations web worker pipeline preventing UI long tasks ($>50\text{ ms}$).
- Dual-Engine PDF compression preserving vector graphics and text searchability.

### Phase 4: Production Hardening, Distribution & Luxury Installer (Verified ✅)
- Single-installer architecture with NSIS hook for instant post-install execution.
- Luxury Dark Neue Klasse installer bitmaps (164x314 sidebar & 150x57 header).
- `installMode: "both"` enabling user choice between `AppData\Local` and `C:\Program Files`.
