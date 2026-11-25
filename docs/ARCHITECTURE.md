# 🏗️ meCraft Ecosystem — Architecture Specification

> **Ecosystem Overview:** 100% Private, Zero-Cloud Document & Photo Engineering Ecosystem.  
> **Core Technologies:** Tauri v2 (Rust), Vite, TypeScript, Canvas API, Web Workers, and WebAssembly.

---

## 1. System Topology & Seams

```mermaid
flowchart TD
    subgraph UI_Layer["🎨 Design System Layer"]
        Tokens["@mecraft/ui-tokens\n• Linear Dark Studio Tokens (OKLCH Gamut)\n• Thai-Latin Mixed Typography Invariant\n• 44px Decoupled Touch Targets\n• 120fps Compositor-Only Motion Profile"]
    end

    subgraph Core_Layer["⚙️ Shared Core Engines"]
        Bridge["@mecraft/core-bridge\n• Universal IPC Client (Tauri Desktop vs Web Browser)\n• Universal ClipBus (BroadcastChannel + LocalStorage Capped Queue)\n• Ecosystem Catalog & Project History Engine"]
        PhotoCore["@mecraft/photo-core\n• 4-Point Homography Perspective Deskew\n• Adaptive Otsu Binarization (Scan Cleanup)\n• Magic Color Tone-Mapping & Unsharp Mask\n• Pure Client Topological OCR Engine"]
    end

    subgraph Application_Workspaces["🚀 Application Suite (15 Workspaces)"]
        Launcher["apps/mecraft-launcher (@mecraft/launcher v1.0)\n• Dual-Action App Routing (Web Studio + Desktop Launch)\n• MIME-Based File Drop Zone Auto-Router\n• Detached Native Process Spawning (Rust Windows API)"]
        meIDE["apps/meide (@mecraft/meide v1.0)\n• Standalone AI Web & Desktop IDE\n• Local File System API & Directory Workspace\n• In-Device RAM Copilot"]
        PDF["apps/mepdf (@mecraft/mepdf v1.0)\n• 3-Pane Studio Cockpit (Filmstrip, Canvas, 6-Tab Inspector)\n• Dual-Engine Smart Compression (Lossless & Scanned)\n• Client-Side AES-256 Encryption & Searchable OCR Injection"]
        Photo["apps/mephoto (@mecraft/mephoto v1.0)\n• Interactive 4-Pin Quad Perspective Canvas\n• CamScanner-Grade Image Enhancement Pipeline\n• Instant 1-Click Handoff to mePDF via ClipBus"]
        Doc["apps/medoc (@mecraft/medoc v1.0)\n• Thai Sarabun 16pt & Official Templates\n• ๑๒๓ Numeral Converter & Intl.Segmenter\n• KaTeX & Markdown Publishing"]
        Sheet["apps/mesheet (@mecraft/mesheet v1.0)\n• =BAHTTEXT Currency Engine\n• Tabular Grid & Financial Formulas"]
        Deck["apps/medeck (@mecraft/medeck v1.0)\n• Thai Typography Slide Deck Studio"]
        Vector["apps/mevector (@mecraft/mevector v1.0)\n• Bézier Path Operations & SVG/PDF Illustrator"]
        Studios["apps/me* (7 Creative Studios)\n• me3D, meAudio, meDesign, meFilm, meLight, meMotion, meDrop"]
    end

    Tokens --> Launcher
    Tokens --> meIDE
    Tokens --> PDF
    Tokens --> Photo
    Tokens --> Doc
    Tokens --> Sheet
    Tokens --> Deck
    Tokens --> Vector
    Tokens --> Studios

    Bridge --> Launcher
    Bridge --> meIDE
    Bridge <-->|Universal ClipBus Data| PDF
    Bridge <-->|Universal ClipBus Data| Photo
    Bridge --> Doc
    Bridge --> Sheet
    Bridge --> Deck

    PhotoCore --> Photo
    PhotoCore -->|In-App Photo Studio| PDF
```

---

## 2. Key Engineering Subsystems

### 2.1 Universal ClipBus (`@mecraft/core-bridge`)
- **Purpose:** Cross-application in-memory message and asset bus for instant handoffs (e.g. sending a deskewed receipt from mePhoto into an active mePDF document).
- **Mechanism:**
  1. **Live Tab Routing:** Uses native `BroadcastChannel('mecraft-clipbus')` for instant zero-latency pub/sub between browser tabs.
  2. **Cold-Start Buffer:** Persists the latest 3 items in `localStorage` under `mecraft:clipbus:<appId>` with automatic quota-overflow protection.
  3. **Message Deduplication:** Every payload carries a unique ID and timestamp (`clip_${Date.now()}_${random}`); consumers maintain a `processedClipBusIds` set to eliminate duplicate imports.

### 2.2 4-Point Homography & Bilinear Interpolation (`@mecraft/photo-core`)
- **Mathematical Model:** Calculates $3 \times 3$ perspective transformation matrix $H$ mapping arbitrary quad coordinates $(x_i, y_i)$ to standard rectangular bounds $(u_i, v_i)$.
- **Singular Protection:** Implements Gaussian elimination with singular-matrix detection. If all four corners become collinear or degenerate, the engine safely falls back to the unwarped source image without crashing the UI thread.
- **Sub-Pixel Sampling:** Bilinear interpolation samples surrounding pixel values with fractional weights to eliminate aliasing and jagged edges.

### 2.3 Dual-Engine PDF Compression (`apps/mepdf`)
1. **Lossless Vector Mode:**
   - Optimizes PDF stream dictionaries and recompresses embedded vector streams using Flate compression.
   - Retains 100% vector fidelity, font definitions, and `Ctrl+F` searchability.
2. **Scanned Document Mode:**
   - Downsamples raster images to configurable DPI targets (150 DPI / 72 DPI).
   - Re-encodes bitmaps using adaptive JPEG/WebP quality tiers with significant size reduction for mobile transmission.

### 2.4 Decoupled IndexedDB Storage (`apps/mepdf`)
- **Problem Solved:** Storing complete 50MB+ PDF documents in single state keys causes browser UI freezing (Jank) and crashes iOS Safari memory limits.
- **Decoupled Architecture:**
  - `documents` store: Holds raw immutable Uint8Array bytes once.
  - `workspace_state` store: Holds only lightweight page references, rotation angles, and layout indices ($\le 5\text{ KB}$ per save).
