# Changelog — meCraft Suite

All notable changes to the meCraft ecosystem are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [3.2.1] — 2026-11-23
### Added
- **Luxury Dark NSIS Installer Branding**: Custom 24-bit Obsidian sidebar and header bitmaps replacing standard NSIS defaults.
- **Dual Install Mode**: Configured `installMode: "both"` allowing user to choose between Per-User (`AppData\Local`) and All-Users (`Program Files`).
- **Desktop Shortcut Lifecycle**: NSIS post-install script (`hooks.nsh`) creates a Desktop Shortcut automatically and cleans up on uninstall.
- **Pure Program Manager Hub**: Refocused meCraft Desktop Hub into a streamlined Application Store & Manager for downloading, installing, updating, and launching apps without editor clutter.


## [3.2.0] — 2026-11-23
### Added
- **Single Unified Windows Installer (`meCraft-Setup.exe`)**: All-in-one setup wizard with NSIS auto-launch hook (`hooks.nsh`) for zero-friction post-install execution.
- **Universal Drop Zone Hub**: Direct desktop file drag-and-drop on Launcher with MIME-based smart routing to mePDF Studio (`application/pdf`) and mePhoto Studio (`image/*`).
- **Dual-Action Launch Continuum**: Launcher application cards support both zero-install Web Studio opening and native Desktop app launching/installation within the same card.
- **Parallel Matrix CI/CD**: 3x parallel compilation matrix across Windows runners with app-specific tag triggering (`mepdf-v*`, `mephoto-v*`, `launcher-v*`).
- **Official 2K Luxury Thai 3D Branding**: Integrated high-resolution branding emblems and visual identity across Launcher, Web Portal, and documentation.

### Fixed
- **Windows Junction Drift**: Hardened post-relocation symlink resolution via clean npm workspace linking.
- **Inter-Process IPC Fallback**: Enhanced cross-environment messaging ensuring smooth fallback between Tauri native bridge and Web BroadcastChannel.

## [3.1.0] — 2026-11-18
### Added
- **Dual-Engine Smart Compression**: mePDF Studio compression featuring Lossless Vector Mode (preserves text searchability and vectors) and Scanned Raster Mode (JPEG/WebP compression with auto-downscaling).
- **Client-Side Invisible OCR Layer**: PDF text layer reconstruction embedding searchable OCR text into scanned documents completely on-device.
- **Document Security Engine**: Client-side 256-bit AES encryption with password protection (`userPassword` and `ownerPassword`) and metadata sanitization.
- **Universal ClipBus**: Cross-application memory bus in `@mecraft/core-bridge` enabling 1-click photo-to-PDF asset handoffs.
- **4-Point Homography & Deskew Engine**: Perspective correction engine in `@mecraft/photo-core` with singular-matrix protection and bilinear interpolation.
- **Adaptive Otsu Binarization**: Real-time adaptive thresholding separating document ink from shadows and crumpled paper textures.

### Changed
- Monorepo structure re-architecture into dedicated `apps/` workspaces (`mecraft-launcher`, `mepdf`, `mephoto`) and `packages/` (`core-bridge`, `photo-core`, `ui-tokens`).

## [1.0.0] — 2026-11-15
### Added
- **Initial Public Release**: Official release of meCraft Studio creative workstation for Desktop (Windows Tauri v2 / Rust) and Web (PWA / Vercel).
- **mePDF Studio Core**: Client-side PDF page merging, splitting, reordering, deleting, and rotating with multi-threaded Web Workers.
- **Multi-Format Export**: Client-side page rendering and export to high-resolution PNG and JPEG with customizable DPI scaling.
- **Linear Studio Dark Cockpit**: Utilitarian dark mode user interface with Thai-Latin typography calibration and keyboard shortcuts.
- **100% In-Browser Privacy Sandbox**: Guarantee of zero cloud upload, zero remote telemetry, and complete offline availability.

[Unreleased]: https://github.com/methastrategy/meCraft/compare/v3.2.1...HEAD
[3.2.1]: https://github.com/methastrategy/meCraft/compare/v3.2.0...v3.2.1
[3.2.0]: https://github.com/methastrategy/meCraft/compare/v3.1.0...v3.2.0
[3.1.0]: https://github.com/methastrategy/meCraft/compare/v1.0.0...v3.1.0
[1.0.0]: https://github.com/methastrategy/meCraft/releases/tag/v1.0.0
