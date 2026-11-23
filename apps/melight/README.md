# meLight Studio

> **Professional RAW Photo Development & Color Grading**  
> *Category: CREATIVE · Status: Draft / In-Development · Suite: meCraft*

---

## 📌 Overview
Non-destructive RAW photo development, color grading curves, and batch cataloging with 100% in-memory client privacy.

- **Inspired By:** Adobe Lightroom / LightCraft (storytold/lightcraft)
- **Supported File Formats:** `.raw`, `.cr2`, `.nef`, `.arw`, `.dng`
- **Privacy Standard:** 100% In-Device RAM Privacy. All compute executes on local client resources with zero telemetry.
- **Distribution:** Downloaded, installed, and launched exclusively via **meCraft Launcher** (`meCraft.exe`).

---

## 🛠️ Architecture Seams
- **Core Engine:** TypeScript / Rust WebAssembly
- **Native Desktop Shell:** Tauri v2 Windows Shell
- **Windows File Association:** `%LOCALAPPDATA%\meCraft\apps\melight\melight.exe`
