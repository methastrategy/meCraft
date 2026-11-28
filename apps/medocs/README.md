# meDocs Studio

> **Distraction-Free Rich Document, Markdown & Thai Sarabun Typesetting Studio**  
> *Category: DOCUMENT · Status: Stable v1.0.0 · Suite: meCraft · Repo: [`methastrategy/medocs`](https://github.com/methastrategy/medocs)*

---

## 📌 Overview
Clean, beautiful document editor with semantic styling, table generators, offline privacy, official Thai government templates, and docx synchronization.

- **Inspired By:** Microsoft Word / WordCraft (storytold/wordcraft)
- **Thai Sarabun 16pt Mode:** 1-click official Sarabun typography with `text-justify: inter-character; word-break: break-word` and line height 1.5.
- **Thai Government Templates:** 1-click loading of บันทึกข้อความ (Official Memo), หนังสือราชการภายนอก (Official Letter), and รายงานการประชุม (Meeting Minutes).
- **๑๒๓ Numeral Converter:** Instant bi-directional conversion between Arabic and Thai digits.
- **Intl.Segmenter Word Segmentation:** Accurate Thai-Latin word counting without external cloud dependencies.
- **Privacy Standard:** 100% In-Device RAM Privacy. All compute executes on local client resources with zero telemetry.
- **Distribution:** Available on Web (`/medocs/`) and standalone Windows installer `meDocs Studio_1.0.0_x64-setup.exe`.

---

## 🛠️ Architecture Seams
- **Core Engine:** TypeScript / Rust WebAssembly
- **Native Desktop Shell:** Tauri v2 Windows Shell
- **Windows File Association:** `%LOCALAPPDATA%\meCraft\apps\medocs\medocs.exe` (with legacy `medoc` alias support)
