# meAudio

> **Multi-Track Digital Audio Workstation & Mastering**  
> *Category: MEDIA · Status: Draft / In-Development · Suite: meCraft*

---

## 📌 Overview
Digital audio editor with spectral waveform view, parametric EQ, dynamic compression, and multi-track mixing.

- **Inspired By:** Adobe Audition / SoundCraft (storytold/soundcraft)
- **Supported File Formats:** `.mp3`, `.wav`, `.flac`, `.aac`, `.ogg`
- **Privacy Standard:** 100% In-Device RAM Privacy. All compute executes on local client resources with zero telemetry.
- **Distribution:** Downloaded, installed, and launched exclusively via **meCraft Launcher** (`meCraft.exe`).

---

## 🛠️ Architecture Seams
- **Core Engine:** TypeScript / Rust WebAssembly
- **Native Desktop Shell:** Tauri v2 Windows Shell
- **Windows File Association:** `%LOCALAPPDATA%\meCraft\apps\meaudio\meaudio.exe`
