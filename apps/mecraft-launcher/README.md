# @mecraft/launcher — meCraft Launcher & Hub

> **The Executive Suite Manager, App Store & Radial Launchpad for Windows & Web**  
> *Category: HUB & SUITE MANAGER · Status: Stable v1.0.0 · Suite: meCraft*

---

## 📌 Overview
meCraft Launcher is the central desktop command center and web portal for the entire meCraft ecosystem. It manages the discovery, execution, update, and asset routing across all 15 specialized creative and document studios.

- **Universal App Launcher:** Launches local standalone applications as detached native processes on Windows via Tauri Rust APIs.
- **MIME Drag & Drop Auto-Router:** Automatically analyzes dropped files (`.pdf`, `.png`, `.docx`, `.xlsx`, 3D objects, audio) and routes them into the appropriate studio.
- **Dual-Mode Access:** Runs as a native desktop program manager with system tray integration, or as a zero-install Web Hub on `https://mecrafts.vercel.app`.
- **100% In-Device Privacy:** All state, preferences, and file operations remain on the local machine with zero telemetry.

---

## 🛠️ Tech Stack & Architecture
- **Framework:** TypeScript, Vite, Web Components
- **Native Desktop Shell:** Tauri v2 (Rust `std::process::Command` detached spawner)
- **Shared Packages:** `@mecraft/core-bridge`, `@mecraft/studio-shell`, `@mecraft/ui-tokens`
- **Windows executable:** `mecraft.exe` เป็นชื่อไฟล์แจก meCraft ชื่อเดียวสำหรับ Windows 10/11 64-bit โดยตรง ไม่ต้องมีหลายไฟล์หรือแยกระหว่าง MSI/EXE ให้สับสน
