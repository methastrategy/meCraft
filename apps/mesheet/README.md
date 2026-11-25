# meSheet Studio

> **High-Performance Grid, Financial Analytics & =BAHTTEXT() Studio**  
> *Category: DOCUMENT · Status: Stable v1.0.0 · Suite: meCraft*

---

## 📌 Overview
Blazing-fast calculation grid engine with formula parser, Thai Baht text conversion (`=BAHTTEXT()`), and financial distribution modeling.

- **Inspired By:** Microsoft Excel / GridCraft (storytold/gridcraft)
- **Thai Financial Functions:** Ribbon tools for `=BAHTTEXT()` and ๑๒๓ Thai numerals.
- **Supported File Formats:** `.xlsx`, `.xls`, `.csv`
- **Privacy Standard:** 100% In-Device RAM Privacy. All compute executes on local client resources with zero telemetry.
- **Distribution:** Available on Web (`/mesheet/`) and standalone Windows installer `meSheet Studio_1.0.0_x64-setup.exe`.

---

## 🛠️ Architecture Seams
- **Core Engine:** TypeScript / Rust WebAssembly
- **Native Desktop Shell:** Tauri v2 Windows Shell
- **Windows File Association:** `%LOCALAPPDATA%\meCraft\apps\mesheet\mesheet.exe`
