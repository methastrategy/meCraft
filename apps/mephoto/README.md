# @mecraft/mephoto — mePhoto Studio

> **CamScanner-Grade Document Restoration & Photo Lab**  
> *Category: CREATIVE · Status: Stable v1.0.0 · Suite: meCraft*

---

## 📌 Overview
mePhoto Studio provides precision document rectification, perspective deskewing, and intelligent tone-mapping directly in your local browser or desktop window.

- **4-Point Homography Perspective Warp:** Interactive draggable corner pins with real-time bilinear quadrilateral warping and singular-matrix crash protection.
- **Adaptive Otsu Binarization:** Eliminates harsh shadows and uneven page lighting, producing crisp black-and-white scan outputs.
- **Magic Color Tone-Mapping:** Enhances document legibility, contrast, and color vibrancy while suppressing page bleed-through.
- **Instant ClipBus Handoff:** 1-click transfer of restored documents directly into an active mePDF workspace.

---

## 🛠️ Tech Stack & Distribution
- **Core Engine:** TypeScript, `@mecraft/photo-core`, HTML5 Canvas API
- **Native Desktop Shell:** Tauri v2 Windows Shell
- **Distribution:** Web Studio (`/mephoto/`) and standalone Windows installer `mePhoto_1.0.0_x64-setup.exe`.
