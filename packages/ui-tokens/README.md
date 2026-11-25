# @mecraft/ui-tokens

> **Neue Klasse Luxury Dark Studio Design Tokens & CSS Architecture**  
> *Category: SHARED PACKAGE · Status: Stable v1.0.0 · Suite: meCraft*

---

## 📌 Overview
`@mecraft/ui-tokens` provides the single source of truth for all CSS custom properties, color gamuts (OKLCH), typography hierarchies, and layout rules across meCraft.

### Hard Governance Invariants:
1. **Thai-Latin Mixed Typography:** Latin typefaces MUST precede Thai fonts (`'Plus Jakarta Sans', 'Inter', 'IBM Plex Sans Thai'`), with `letter-spacing: 0` for Thai, and `line-height >= 1.7` for prose.
2. **44px Decoupled Hit-Target:** All interactive bounding boxes maintain $\ge 44 \times 44\text{ px}$ touch targets.
3. **WCAG AAA Contrast:** Text contrast maintains minimum 7:1 ratio (up to 20.8:1 against deep obsidian `#06070a`).
4. **Compositor-Only Motion Profile:** 120ms spring cubic-bezier transitions on `transform` and `opacity` only.
