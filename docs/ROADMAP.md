# 🗺️ meCraft Suite — Master Roadmap & Engineering Milestones

> **Ecosystem Vision:** 100% Client-Side Private Document & Creative Engineering Suite.  
> **Repository Strategy:** Unified Monorepo (`npm workspaces` across `apps/*` and `packages/*`).

---

## 1. Application Ecosystem Milestones

| Application | Workspace | Status | Focus Areas | Target Release |
|:---|:---|:---:|:---|:---:|
| **🚀 meCraft Launcher Hub** | `apps/mecraft-launcher` | **Stable** (`v3.2.0`) | Universal Hub drop zone, native detached process spawning, dual-action routing, and bilingual Thai/EN cockpit. | Released |
| **📄 mePDF Studio** | `apps/mepdf` | **Stable** (`v3.2.0`) | 3-pane Studio Cockpit, Dual-Engine compression (Lossless & Scanned), 256-bit AES encryption, searchable OCR layer injection. | Released |
| **🪄 mePhoto Studio** | `apps/mephoto` | **Stable** (`v1.0.0`) | 4-point homography perspective deskew, Adaptive Otsu binarization, Magic Color, and 1-click ClipBus handoff to mePDF. | Released |
| **📐 meVector** | `apps/mevector` | *Roadmap* | Precision Bézier vector editor, node manipulation, boolean path operations, and infinite-resolution SVG/PDF export. | v4.0.0 |
| **📝 meDoc** | `apps/medoc` | *Roadmap* | Zen distraction-free typewriter, live LaTeX mathematical formula rendering, bilingual grammar analysis, and academic publishing. | v4.1.0 |

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
