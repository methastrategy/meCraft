# Changelog — meCraft Suite

All notable changes to the meCraft ecosystem are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0] — 2026-11-25
### Added
- **15 Standalone Windows Desktop Installers**: Built dedicated Tauri v2 Windows setup executables (`*_1.0.0_x64-setup.exe`) and portable binaries for all 15 suite applications in `dist-artifacts/` and `public/downloads.html`.
- **meIDE AI IDE Studio**: Standalone AI Web & Desktop IDE with Monaco editor, File System Access API, integrated terminal emulator, and local Copilot integration.
- **Thai Localization Engine (`@mecraft/core-bridge`)**: Native Thai numeral conversion (`toThaiNumerals`), Thai Baht text currency parser (`toThaiBahtText`), and mixed Thai-Latin word boundary segmentation (`segmentThaiWords` via `Intl.Segmenter`).
- **meDoc Thai Sarabun & Government Templates**: One-click official TH Sarabun 16pt typesetting, ๑๒๓ numeral converter, and 3 official Thai government templates (บันทึกข้อความ, หนังสือราชการภายนอก, รายงานการประชุม).
- **meSheet & meDeck Thai Upgrades**: Added `=BAHTTEXT()` live formula evaluator and ribbon controls in meSheet; added Thai Sarabun slide typography in meDeck.
- **Living Documentation Engine**: Added `scripts/verify-docs.js` and `npm run check:docs` to ensure documentation matches live code and passes CI/CD gates.

## [1.0.0] — 2026-11-23
### Added
- **Official v1.0 Initial Foundation Release**: Comprehensive launch of the meCraft Suite for Desktop (Windows Native Tauri v2 / Rust) and Web (PWA / Vercel).
- **mePDF Studio Pro (Navy Black Acrobat Cockpit)**: Complete client-side PDF engineering featuring Merge, Split, Page Reorganization, Lossless & Scanned Dual-Engine Compression, AES-256 Encryption, and Invisible Searchable OCR Injection.
- **mePhoto Studio (Darkroom Photo Lab)**: CamScanner-grade document restoration featuring 4-point homography perspective deskew, adaptive local Otsu binarization, Magic Color enhancement, and real-time RGB histogram.
- **meCraft Hub & Web Catalog**: Streamlined desktop application manager and web catalog with 100% true-to-life Native Windows UI preview modal.
- **In-App One-Click Auto-Update Engine**: Native self-updating system with background patch download and instant binary restart.
- **Universal ClipBus & Privacy Guarantee**: 100% Client-Side in-device RAM execution with zero server uploads, zero remote telemetry, and cross-app asset handoff.

[Unreleased]: https://github.com/methastrategy/meCraft/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/methastrategy/meCraft/releases/tag/v1.0.0
