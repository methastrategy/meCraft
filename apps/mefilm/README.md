# meFilm Studio

> **Multi-Track Video Timeline Editing & Export**  
> *Category: MEDIA · Status: Stable v1.0.0 · Suite: meCraft*

---

## 📌 Overview
Multi-track non-linear video editor utilizing WebCodecs, hardware-accelerated decode, and timeline slicing.

- **Inspired By:** Adobe Premiere Pro / FilmCraft (storytold/filmcraft)
- **Supported File Formats:** `.mp4`, `.mov`, `.avi`, `.mkv`, `.webm`
- **Privacy Standard:** 100% In-Device RAM Privacy. All compute executes on local client resources with zero telemetry.
- **Distribution:** Available on Web (`/mefilm/`) and standalone Windows installer `meFilm_1.0.0_x64-setup.exe`.

---

## 🛠️ Architecture Seams
- **Core Engine:** TypeScript / Rust WebAssembly
- **Native Desktop Shell:** Tauri v2 Windows Shell
- **Windows File Association:** `%LOCALAPPDATA%\meCraft\apps\mefilm\mefilm.exe`
