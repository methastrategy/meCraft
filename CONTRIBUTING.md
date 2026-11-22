# Contributing to meCraft

Thank you for your interest in contributing to **meCraft**! We welcome contributions to improve our 100% client-side, private-by-design document and photo engineering suite.

---

## 🔒 Non-Negotiable Invariants

Before contributing, please review our core engineering invariants:

1. **100% In-Browser / Client-Side Privacy (Zero Server Upload):**
   All file processing (PDF parsing, compression, rendering, encryption, OCR, image deskew, binarization) MUST execute entirely on the user's device (CPU/GPU sandbox, Web Workers, Canvas, WebAssembly). Never introduce remote server processing, cloud uploads, or external analytics transmitting document bytes or user data.

2. **Monorepo Architecture (Stay Monorepo):**
   meCraft is maintained as a unified monorepo. Shared packages reside in `packages/*` and applications reside in `apps/*`. Cross-package dependencies are resolved through npm workspaces (`npm install`).

3. **Strict Quality Gates:**
   - **Unit & Integration Tests:** 100% test pass rate required (`npm test`, all 226+ tests must pass). Never relax, skip, or weaken existing test assertions.
   - **TypeScript Typecheck:** 0 errors across all workspaces (`npm run typecheck`).
   - **Clean Builds:** `npm run build` must succeed without warnings or errors.

4. **Typography & Design Tokens:**
   - Latin fonts MUST come BEFORE Thai fonts in font stacks (`'Plus Jakarta Sans', 'Inter', 'IBM Plex Sans Thai'`) to eliminate diacritic clipping and maintain optical vertical alignment.
   - Design tokens must be imported from `@mecraft/ui-tokens` as the single source of truth.

---

## 🚀 Quick Setup

### Prerequisites
- **Node.js** `>= 20.x`
- **npm** `>= 10.x`
- **Rust Toolchain** `>= 1.78` (optional, only needed when compiling native Windows desktop binaries via Tauri)

### Installation
```bash
# Clone the repository
git clone https://github.com/methastrategy/meCraft.git
cd meCraft

# Install and link all workspace packages
npm install

# Verify your environment
npm test            # 226 tests must pass
npm run typecheck   # 0 errors required
```

### Running Applications Locally
```bash
# meCraft Launcher Hub (Web mode)
npm run dev:launcher

# mePDF Studio (Web mode)
npm run dev:pdf

# mePhoto Studio (Web mode)
npm run dev:photo
```

---

## 🌿 Branching & Workflow Strategy

- **`main`**: Production branch. Must always be deployable and passing all tests.
- **`feature/<feature-name>`**: New features and capabilities.
- **`fix/<issue-name>`**: Bug fixes and patches.
- **`refactor/<scope>`**: Code refactoring with zero functional regression.

### Commit Conventions
Follow the [Conventional Commits](https://www.conventionalcommits.org/) format:
- `feat(scope): ...` — New features
- `fix(scope): ...` — Bug fixes
- `refactor(scope): ...` — Code improvements without behavior changes
- `docs(scope): ...` — Documentation updates
- `test(scope): ...` — Adding or updating tests
- `chore(scope): ...` — Maintenance and dependencies

---

## 🧪 Verification & Testing Checklist

Before opening a Pull Request, run the full verification gate locally:

```bash
# 1. Run automated test suites (226 tests across 19 suites)
npm test

# 2. Typecheck across all 6 workspaces
npm run typecheck

# 3. Build multi-app web bundle
npm run build
```

---

## 📁 Repository Structure

```text
meCraft/
├── apps/
│   ├── mecraft-launcher/     # Desktop Ecosystem Hub & Web Portal (Tauri v2 + Vite + TS)
│   ├── mepdf/                # Pure Client-Side PDF Engineering Studio
│   └── mephoto/              # Document & Photo Engineering Lab
├── packages/
│   ├── core-bridge/          # Universal IPC, ClipBus & Catalog Engine
│   ├── photo-core/           # 4-Point Homography, Otsu Binarizer & OCR
│   └── ui-tokens/            # Shared Design Tokens (OKLCH) & Typography
├── scripts/
│   └── build-web.js          # Unified Multi-App Web Assembler for Vercel
├── .github/
│   ├── ISSUE_TEMPLATE/       # Bug report & feature request forms
│   ├── workflows/            # GitHub Actions CI/CD workflows
│   └── PULL_REQUEST_TEMPLATE.md
├── CHANGELOG.md              # Keep a Changelog release history
├── CONTRIBUTING.md           # This contributor guide
└── README.md                 # Suite overview and documentation
```

---

## 💬 Community & Support

- Report bugs or propose features using the [GitHub Issues](https://github.com/methastrategy/meCraft/issues) templates.
- Pull Requests should adhere to the [Pull Request Template](.github/PULL_REQUEST_TEMPLATE.md).
