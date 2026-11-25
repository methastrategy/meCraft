# me3D Studio

> **Parametric 3D Modeling & CAD Engineering**  
> *Category: ENGINEERING · Status: Stable v1.0.0 · Suite: meCraft*

---

## 📌 Overview
Precision CAD and 3D object viewer with parametric geometry constraints, surface tessellation, and 3D printing STL/OBJ export.

- **Inspired By:** AutoCAD LT / CadCraft (storytold/cadcraft)
- **Supported File Formats:** `.dwg`, `.dxf`, `.obj`, `.stl`, `.step`
- **Privacy Standard:** 100% In-Device RAM Privacy. All compute executes on local client resources with zero telemetry.
- **Distribution:** Available on Web (`/me3d/`) and standalone Windows installer `me3D_1.0.0_x64-setup.exe`.

---

## 🛠️ Architecture Seams
- **Core Engine:** TypeScript / Rust WebAssembly
- **Native Desktop Shell:** Tauri v2 Windows Shell
- **Windows File Association:** `%LOCALAPPDATA%\meCraft\apps\me3d\me3d.exe`
