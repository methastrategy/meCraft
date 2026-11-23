# 🎨 meCraft Design System Specification (v3.2)

> **Design Engine:** ME-DESIGN Engine (`/medesign`)  
> **Aesthetic Profile:** Linear / Raycast Precision Utilitarian Cockpit (Direction A)  
> **Source of Truth:** `@mecraft/ui-tokens` (`packages/ui-tokens/tokens.css`)  
> **Compliance:** WCAG AAA Contrast (20.8:1), 44px Decoupled Hit-Target, Latin-First Typography

---

## 1. Aesthetic Profile & Design Tokens

- **Foundational Surfaces:** Deep Obsidian (`#06070a`), App Background (`#090a0f`), Raised Slate (`oklch(0.18 0.010 265)`).
- **Brand Accents:** Electric Indigo (`#4f5ff7` / `oklch(0.62 0.22 264)`) and Laser Cyan (`#06b6d4` / `oklch(0.78 0.16 210)`).
- **Perceptual Color Gamut:** Uniform OKLCH and OKLAB color interpolation across all gradients (`linear-gradient(in oklab ...)`).
- **Surface Physics:** 1px hairline borders (`rgba(255, 255, 255, 0.07)`), Doppelrand inner highlights (`inset 0 1px 0 rgba(255, 255, 255, 0.08)`), and tactile active press (`scale(0.985)`).
- **Motion Profile:** 120ms spring cubic-bezier (`cubic-bezier(0.16, 1, 0.3, 1)`) with forced motion reduction support (`@media (prefers-reduced-motion: reduce)`).

---

## 2. Hard Governance Invariants

| Invariant ID | Rule | Implementation Standard |
|:---|:---|:---|
| `MD001` | **Focus Ring Visibility** | `:focus-visible { outline: 2px solid var(--border-focus); outline-offset: 2px; }` on all interactive controls. |
| `MD002` | **Reduced Motion Gate** | `@media (prefers-reduced-motion: reduce)` resets duration to `0.01ms` and disables smooth scrolling. |
| `MD003` | **44px Decoupled Hit-Target** | Interactive bounding boxes must be $\ge 44 \times 44\text{ px}$ on coarse pointers and viewport widths $\le 900\text{ px}$. |
| `MD004` | **Accessible Auth (WCAG 2.2 §3.3.8)** | Zero paste-blocking (`onpaste="return false"` forbidden). All password inputs declare `autocomplete="current-password"` or `new-password`. |
| `MD005` | **Thai-Latin Mixed Typography** | Latin typefaces MUST precede Thai fonts (`'Plus Jakarta Sans', 'Inter', 'IBM Plex Sans Thai'`), `letter-spacing: 0` for Thai, `line-height >= 1.70` for prose. |

---

## 3. Component Architecture Across Apps

- **meCraft Launcher:** Hub and Command Palette, Drag-and-drop auto-routing zone, Dual-Action App Cards.
- **mePDF Studio:** 3-pane Studio Cockpit (Left Filmstrip, Center Canvas with high-DPI Pan/Zoom, Right 6-Tab Inspector).
- **mePhoto Studio:** Fullscreen CamScanner-grade canvas with 4-point draggable quad homography pins and live recipe adjustments.
