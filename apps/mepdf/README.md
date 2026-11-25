# @mecraft/mepdf — mePDF Studio Pro

> **Private-First Client-Side PDF Engineering & Restoration Studio**  
> *Category: DOCUMENT · Status: Stable v1.0.0 · Suite: meCraft*

---

## 📌 Overview
mePDF Studio Pro is a high-performance, 100% client-side PDF workstation engineered to replace bloated cloud PDF converters. It processes multi-gigabyte documents entirely within local CPU/GPU memory without uploading a single byte to external servers.

- **3-Pane Cockpit:** Filmstrip thumbnail pane, high-DPI rendering canvas with smooth zoom/pan, and 6-tab feature inspector.
- **Dual-Engine Smart Compression:**
  - *Lossless Vector Mode:* Compresses PDF object streams while retaining 100% vector sharpness, font definitions, and `Ctrl+F` searchability.
  - *Scanned Raster Mode:* Downsamples high-resolution scanned bitmaps to target DPI tiers (150 DPI / 72 DPI) with WebP/JPEG adaptive quality.
- **AES-256 Encryption:** Military-grade password protection and permission encryption running completely in WebAssembly / Rust.
- **Searchable OCR Layer:** Injects invisible text layers over scanned documents to make scanned PDFs fully searchable.
- **Universal ClipBus Integration:** 1-click import of deskewed pages from mePhoto Studio.

---

## 🛠️ Tech Stack & Distribution
- **Core Engine:** TypeScript, `pdf-lib`, `pdfjs-dist`, Web Workers
- **Native Desktop Shell:** Tauri v2 Windows Shell
- **Distribution:** Available on Web (`/mepdf/`) and standalone Windows installer `mePDF_1.0.0_x64-setup.exe`.
