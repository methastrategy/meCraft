# 🎨 meCraft Suite — Autonomous Creative & Document Workstation

> **100% Private, Zero-Server-Upload Document & Photo Engineering Ecosystem.**  
> Built with **Tauri v2 (Rust), Vite, TypeScript, Web Workers, Canvas API, and WebAssembly**.

[![Official Web Portal](https://img.shields.io/badge/Web%20Portal-mecrafts.vercel.app-6366f1?style=for-the-badge&logo=vercel&logoColor=white)](https://mecrafts.vercel.app)
[![GitHub Release](https://img.shields.io/badge/Release-v3.1.0-emerald?style=for-the-badge&logo=github)](https://github.com/methastrategy/meCraft/releases)
[![Tauri v2](https://img.shields.io/badge/Desktop-Tauri%20v2%20(Rust)-ea580c?style=for-the-badge&logo=tauri)](https://tauri.app/)
[![Client-Side Privacy](https://img.shields.io/badge/Privacy-100%25%20On--Device-blue?style=for-the-badge&logo=shield)](https://mecrafts.vercel.app)
[![Tests Passing](https://img.shields.io/badge/Tests-226%20Passing-brightgreen?style=for-the-badge&logo=vitest)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

---

### 🌐 Quick Access
- 🚀 **Official Web Portal (Zero-Install):** [https://mecrafts.vercel.app](https://mecrafts.vercel.app)
- 📄 **mePDF Web Studio:** [https://mecrafts.vercel.app/mepdf/](https://mecrafts.vercel.app/mepdf/)
- 🪄 **mePhoto Web Studio:** [https://mecrafts.vercel.app/mephoto/](https://mecrafts.vercel.app/mephoto/)
- 💾 **Download Desktop (.exe):** [GitHub Releases](https://github.com/methastrategy/meCraft/releases)

---

## 🌟 The meCraft Ecosystem

**meCraft** is a private-by-design desktop & web software suite that eliminates cloud dependency. All operations—from heavy multi-gigabyte PDF restructuring to sub-pixel document deskewing and OCR text layer injection—execute **100% inside your local CPU/GPU sandbox**. No servers, no subscriptions, no tracking, and zero byte leakage.

```mermaid
flowchart TD
    subgraph UI_Tokens["Design Architecture"]
        Tokens["@mecraft/ui-tokens\n(OLED Dark Theme, Thai-Latin Typography, CSS Tokens)"]
    end

    subgraph Core_Engines["High-Performance Core Packages"]
        Bridge["@mecraft/core-bridge\n(Universal IPC, Catalog, ClipBus, History)"]
        PhotoCore["@mecraft/photo-core\n(4-Point Homography, Otsu Binarizer, Filter Pipeline)"]
    end

    subgraph App_Suite["meCraft Application Suite"]
        Launcher["🚀 meCraft Launcher Hub\n(Desktop Window Manager & Web Portal)"]
        PDF["📄 mePDF Studio\n(Lossless Compression, AES-256, OCR, Merge/Split)"]
        Photo["🪄 mePhoto Studio\n(CamScanner-Grade Magic Color, Non-Destructive Deskew)"]
        Vector["📐 meVector (Coming Soon)\n(Bézier SVG/PDF Graphic Workbench)"]
        Doc["📝 meDoc (In Development)\n(Typewriter & Markdown Publication)"]
    end

    Tokens --> Launcher
    Tokens --> PDF
    Tokens --> Photo

    Bridge --> Launcher
    Bridge --> PDF
    Bridge --> Photo

    PhotoCore --> Photo
    PhotoCore --> PDF
```

---

## 📦 Application Suite Overview

| Application | Workspace | Description | Technology Stack | Deployment | Status |
|:---|:---|:---|:---|:---:|:---:|
| **🚀 meCraft Launcher Hub** | `apps/mecraft-launcher` | Unified command portal, native process spawner (`DETACHED_PROCESS`), universal drag-and-drop auto-routing, and bilingual Thai/EN cockpit. | Tauri v2, Rust, Vite, TypeScript | Web + Windows (.exe) | **Stable** (`v1.0.0`) |
| **📄 mePDF Studio** | `apps/mepdf` | Complete client-side PDF engineering: Merge, Split, Dual-Engine Smart Compression (Lossless & Scanned), 256-bit AES encryption, and searchable OCR injection. | PDF.js, pdf-lib, Web Workers | Web + Windows (.exe) | **Stable** (`v3.1.0`) |
| **🪄 mePhoto Studio** | `apps/mephoto` | CamScanner-grade document lab: 4-point homography perspective warp, adaptive Otsu binarization, Magic Color enhancement, and unsharp text sharpening. | Canvas API, `@mecraft/photo-core` | Web + Windows (.exe) | **Stable** (`v1.0.0`) |
| **📐 meVector** | `apps/mevector` | Precision Bézier vector illustrator, boolean path operations, and infinite-resolution SVG/PDF export. | Vector Canvas Engine | Planned | *Roadmap* |
| **📝 meDoc** | `apps/medoc` | Distraction-free typewriter, live LaTeX formula rendering, bilingual grammar engine, and academic publishing. | Typography Engine | In Development | *Roadmap* |

---

## 🥊 Competitive Advantage: Why meCraft?

| Capability | Adobe Acrobat Pro | CamScanner | Smallpdf / iLovePDF | **meCraft Suite** |
|:---|:---:|:---:|:---:|:---:|
| **Data Privacy** | ⚠️ Cloud Upload | ⚠️ Server Processed | ⚠️ Uploads to Remote Cloud | 🛡️ **100% Local / Zero Upload** |
| **Cost Model** | \$19.99–\$29.99/mo | \$5.99–\$9.99/mo | \$12/mo | 💎 **100% Free & Open Source (MIT)** |
| **Daily File Limits** | Unlimited (Paid) | Daily Cap (Free) | 2–3 tasks/day (Free) | ♾️ **Unlimited (Local CPU Bound)** |
| **Offline Execution** | Requires Sync | Mobile Cloud | Requires Internet | ⚡ **Full Offline (Desktop & PWA)** |
| **Smart Compression** | Basic | N/A | Server-Side | 🚀 **Dual-Engine (Lossless + Scanned)** |
| **Cross-Tool ClipBus** | Proprietary Cloud | Proprietary Cloud | None | ⚡ **Universal Instant In-Memory Bus** |
| **Native RAM Footprint**| ~800MB–1.5GB | Mobile Only | Browser Tab | 🪶 **~30MB Desktop (Tauri v2 / Rust)** |

---

## 🛠️ Shared Engineering Foundations

### 1. `@mecraft/core-bridge`
- **Universal Dual-Mode Bridge:** Detects Tauri desktop vs Web browser automatically. Supports native Rust subprocess spawning (`launch_app`) and zero-install Web tab routing.
- **Universal ClipBus (`clip-bus.ts`):** Cross-application in-memory message and asset bus (via `BroadcastChannel` with `localStorage` fallback) enabling seamless 1-click photo-to-PDF handoffs.
- **Universal Recent Projects:** Persistent document history across all applications with thumbnail preservation.

### 2. `@mecraft/photo-core`
- **4-Point Homography Perspective Warp:** Matrix calculation via Gaussian elimination with singular-matrix protection and sub-pixel bilinear interpolation.
- **Adaptive Otsu Binarization:** Auto-threshold document extraction separating crisp text ink from uneven paper backgrounds and receipt shadows.
- **Client-Side Invisible OCR Layer:** Generates invisible searchable text layers embedded on scanned PDFs with character bounding-box accuracy.

### 3. `@mecraft/ui-tokens`
- **OLED Dark Surface Design:** High-contrast `#06070a` OLED foundation with precision `#6366f1` (Indigo) and `#06b6d4` (Cyan) accents.
- **Thai-Latin Mixed Typography:** Latin typeface priority (`"Inter", "IBM Plex Sans Thai"`) eliminating diacritic clipping and maintaining optical vertical alignment.

---

## 💻 Building & Packaging

### Prerequisites
- **Node.js** `>= 20.x`
- **Rust Toolchain** `>= 1.78` (only required when building native Windows desktop binaries)

### 1. Quick Start
```bash
# Clone the repository
git clone https://github.com/methastrategy/meCraft.git
cd meCraft

# Install all workspace dependencies
npm install

# Run automated test suites (226 passing tests across 19 suites)
npm test

# Typecheck across all 6 workspaces (0 errors)
npm run typecheck
```

### 2. Local Development Servers
```bash
# meCraft Launcher Hub (Web mode)
npm run dev:launcher

# mePDF Studio (Web mode)
npm run dev:pdf

# mePhoto Studio (Web mode)
npm run dev:photo
```

### 3. Native Windows Desktop Development (Tauri v2)
```bash
# Launch Desktop Launcher with Rust hot-reload
npm run desktop:launcher

# Launch Desktop mePDF Studio
npm run desktop:pdf

# Launch Desktop mePhoto Studio
npm run desktop:photo
```

### 4. Production Web Build (Vercel Multi-App Portal)
```bash
# Assembles unified root dist/ (Launcher at /, mePDF at /mepdf/, mePhoto at /mephoto/)
npm run build:web
```

### 5. Packaging Windows Executables (.exe)
```bash
# Build native release binary for launcher
cd apps/mecraft-launcher
npm run desktop:build

# Build native release binary for mePDF Studio
cd ../mepdf
npm run desktop:build

# Build native release binary for mePhoto Studio
cd ../mephoto
npm run desktop:build
```
> Generated binaries are placed in `src-tauri/target/release/` inside each application directory.

---

## 🤖 Automated CI/CD & GitHub Releases

This repository includes a production-ready GitHub Actions workflow at [`.github/workflows/build-and-release.yml`](.github/workflows/build-and-release.yml).

To release official binaries for Windows:
1. Commit all code to `main`.
2. Tag the release:
   ```bash
   git tag v3.1.0
   git push origin v3.1.0
   ```
3. GitHub Actions automatically spins up a `windows-latest` runner, runs tests, builds Tauri `.exe` binaries for all 3 applications, compresses them into `.zip` packages, and publishes them to **GitHub Releases**:
   - `mecraft-launcher-windows-x64.zip`
   - `mepdf-windows-x64.zip`
   - `mephoto-windows-x64.zip`

---

## 📂 Repository Architecture

```text
meCraft/
├── apps/
│   ├── mecraft-launcher/     # Desktop Ecosystem Hub & Web Portal (Tauri v2 + Vite + TS)
│   ├── mepdf/                # Pure Client-Side PDF Engineering Studio
│   └── mephoto/              # CamScanner-Grade Document & Photo Studio
├── packages/
│   ├── core-bridge/          # Universal IPC, ClipBus, Catalog & History manager
│   ├── photo-core/           # 4-Point Homography, Otsu Binarizer & Searchable OCR
│   └── ui-tokens/            # Shared OLED Design Tokens & Thai-Latin Typography
├── scripts/
│   └── build-web.js          # Unified Multi-App Web Assembler for Vercel
├── public/                   # Static icons, favicons, and manifest assets
├── .github/
│   └── workflows/
│       └── build-and-release.yml # Automated Windows Native Packaging & GitHub Release CI
├── vercel.json               # Vercel Multi-App Rewrite & Header Configuration
├── vitest.workspace.ts       # Unified Vitest Workspace Configuration
├── package.json              # Monorepo Workspace Configuration
└── README.md                 # Official Suite Documentation
```

---

## 📄 License

meCraft Suite is open-source software licensed under the **MIT License**. See [LICENSE](LICENSE) for details.
