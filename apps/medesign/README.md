# meDesign Studio

> **Desktop Publishing, Grid Layouts & Typography**  
> *Category: CREATIVE · Status: Stable v1.0.0 · Suite: meCraft*

---

## 📌 Overview
Multi-page editorial layout engine with master pages, linked text frames, grid guides, and prepress PDF output.

- **Inspired By:** Adobe InDesign / DesignCraft (storytold/designcraft)
- **Supported File Formats:** `.indd`, `.idml`, `.sla`
- **Privacy Standard:** 100% In-Device RAM Privacy. All compute executes on local client resources with zero telemetry.
- **Distribution:** Available on Web (`/medesign/`) and standalone Windows installer `meDesign_1.0.0_x64-setup.exe`.

---

## 🛠️ Architecture Seams
- **Core Engine:** TypeScript / Rust WebAssembly
- **Native Desktop Shell:** Tauri v2 Windows Shell
- **Windows File Association:** `%LOCALAPPDATA%\meCraft\apps\medesign\medesign.exe`
