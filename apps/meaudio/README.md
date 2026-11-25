# meAudio Studio

> **Multi-Track Digital Audio Workstation & Mastering**  
> *Category: MEDIA · Status: Stable v1.0.0 · Suite: meCraft*

---

## 📌 Overview
Digital audio editor with spectral waveform view, parametric EQ, dynamic compression, and multi-track mixing.

- **Inspired By:** Adobe Audition / SoundCraft (storytold/soundcraft)
- **Supported File Formats:** `.mp3`, `.wav`, `.flac`, `.aac`, `.ogg`
- **Privacy Standard:** 100% In-Device RAM Privacy. All compute executes on local client resources with zero telemetry.
- **Distribution:** Available on Web (`/meaudio/`) and standalone Windows installer `meAudio_1.0.0_x64-setup.exe`.

---

## 🛠️ Architecture Seams
- **Core Engine:** TypeScript / Rust WebAssembly
- **Native Desktop Shell:** Tauri v2 Windows Shell
- **Windows File Association:** `%LOCALAPPDATA%\meCraft\apps\meaudio\meaudio.exe`
