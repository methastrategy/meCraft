# meMotion Studio

> **Motion Graphics, Keyframe Animation & VFX**  
> *Category: MEDIA · Status: Stable v1.0.0 · Suite: meCraft*

---

## 📌 Overview
Keyframe and graph-curve animation compositor with shader-based particle and visual effects processing.

- **Inspired By:** Adobe After Effects / EffectCraft (storytold/effectcraft)
- **Supported File Formats:** `.mevfx`, `.aep`
- **Privacy Standard:** 100% In-Device RAM Privacy. All compute executes on local client resources with zero telemetry.
- **Distribution:** Available on Web (`/memotion/`) and standalone Windows installer `meMotion_1.0.0_x64-setup.exe`.

---

## 🛠️ Architecture Seams
- **Core Engine:** TypeScript / Rust WebAssembly
- **Native Desktop Shell:** Tauri v2 Windows Shell
- **Windows File Association:** `%LOCALAPPDATA%\meCraft\apps\memotion\memotion.exe`
