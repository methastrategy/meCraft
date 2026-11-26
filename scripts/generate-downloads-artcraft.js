import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const htmlContent = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>meCrafts Downloads — Official Windows .exe Installers & Studio Directory</title>
  <meta name="description" content="Official Windows .exe Standalone & Suite Releases for meCrafts Workstation. 100% In-Device Memory Execution · Zero Telemetry · Open Source MIT." />
  <meta property="og:title" content="meCrafts Downloads — Official Windows .exe Studio Directory" />
  <meta property="og:description" content="Download meCraft Installer (.exe) and standalone studio binaries. 100% In-Device Memory Execution · Zero Cloud Uploads." />
  <meta property="og:image" content="../assets/branding/github-social-preview.png" />
  <link rel="icon" type="image/png" href="../branding/mecraft-suite.png" />
  <link rel="apple-touch-icon" href="../branding/mecraft-suite.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #08090c;
      --bg-surface: #0f1116;
      --bg-surface-elevated: #15181f;
      --bg-sunken: #050608;
      --line: rgba(255, 255, 255, 0.08);
      --line-strong: rgba(255, 255, 255, 0.16);
      --line-subtle: rgba(255, 255, 255, 0.04);
      --ink: #f3f4f6;
      --ink-strong: #ffffff;
      --muted: #9ca3af;
      --faint: #6b7280;
      --gold: #d4af37;
      --gold-light: #f6d878;
      --gold-glow: rgba(212, 175, 55, 0.22);
      --emerald: #10b981;
      --emerald-glow: rgba(16, 185, 129, 0.2);
      --font-sans: 'Inter', 'IBM Plex Sans Thai', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      --font-mono: 'JetBrains Mono', Consolas, Monaco, monospace;
      --radius-sm: 4px;
      --radius-md: 8px;
      --radius-lg: 14px;
      --radius-xl: 20px;
      --transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html {
      scroll-behavior: smooth;
      background-color: var(--bg);
      color: var(--ink);
      font-family: var(--font-sans);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    body {
      background-color: var(--bg);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow-x: hidden;
      line-height: 1.5;
    }

    /* Architectural Drafting Grid Background */
    body::before {
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      background-image: 
        radial-gradient(circle at 50% 120px, rgba(212, 175, 55, 0.06), transparent 70%),
        linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
      background-size: 100% 100%, 48px 48px, 48px 48px;
      z-index: 0;
    }

    /* Container */
    .container {
      width: 100%;
      max-width: 1360px;
      margin: 0 auto;
      padding: 0 24px;
      position: relative;
      z-index: 1;
    }

    /* Sticky Global Navigation */
    .nav-bar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(8, 9, 12, 0.88);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--line);
    }

    .nav-inner {
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .brand-group {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      color: inherit;
    }

    .brand-logo-img {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      object-fit: cover;
      box-shadow: 0 0 16px var(--gold-glow);
    }

    .brand-name {
      font-size: 1.15rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .brand-name span {
      color: var(--gold);
    }

    .brand-badge {
      font-family: var(--font-mono);
      font-size: 0.68rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 3px 8px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--line);
      border-radius: var(--radius-sm);
      color: var(--muted);
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 8px;
      list-style: none;
    }

    .nav-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--muted);
      text-decoration: none;
      padding: 8px 14px;
      border-radius: var(--radius-sm);
      transition: var(--transition);
      border: 1px solid transparent;
    }

    .nav-link:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.04);
      border-color: var(--line);
    }

    .nav-link.back-portal {
      color: var(--gold);
      border-color: rgba(212, 175, 55, 0.25);
      background: rgba(212, 175, 55, 0.06);
    }

    .nav-link.back-portal:hover {
      background: rgba(212, 175, 55, 0.12);
      border-color: var(--gold);
      color: #ffffff;
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .btn-lang-toggle {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      font-weight: 600;
      padding: 6px 12px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--line);
      border-radius: var(--radius-sm);
      color: var(--ink);
      cursor: pointer;
      transition: var(--transition);
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .btn-lang-toggle:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: var(--line-strong);
      color: #ffffff;
    }

    /* Section 01: Hero & Studio Matrix */
    .hero-section {
      padding: 64px 0 48px;
      border-bottom: 1px solid var(--line);
      position: relative;
    }

    .hero-grid {
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      gap: 48px;
      align-items: center;
    }

    .hud-eyebrow {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--gold);
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
    }

    .hud-eyebrow::before {
      content: "";
      display: inline-block;
      width: 6px;
      height: 6px;
      background: var(--gold);
      box-shadow: 0 0 8px var(--gold);
      border-radius: 50%;
    }

    .hero-title {
      font-size: clamp(2.2rem, 4vw, 3.2rem);
      font-weight: 800;
      line-height: 1.12;
      letter-spacing: -0.03em;
      color: #ffffff;
      margin-bottom: 20px;
    }

    .hero-title .highlight {
      background: linear-gradient(135deg, #ffffff 30%, var(--gold) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-lead {
      font-size: 1.05rem;
      color: var(--muted);
      line-height: 1.6;
      margin-bottom: 28px;
      max-width: 580px;
    }

    .hero-badges-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 32px;
    }

    .hud-badge {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      color: var(--muted);
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--line);
      padding: 5px 10px;
      border-radius: var(--radius-sm);
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .hud-badge.gold {
      color: var(--gold-light);
      border-color: rgba(212, 175, 55, 0.3);
      background: rgba(212, 175, 55, 0.05);
    }

    .hero-cta-box {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 16px;
    }

    .btn-master-dl {
      display: inline-flex;
      flex-direction: column;
      justify-content: center;
      background: linear-gradient(135deg, var(--gold) 0%, #b89124 100%);
      color: #000000;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: var(--radius-md);
      font-weight: 700;
      font-size: 1.05rem;
      box-shadow: 0 4px 24px rgba(212, 175, 55, 0.3);
      transition: var(--transition);
      border: 1px solid #ffd875;
    }

    .btn-master-dl:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(212, 175, 55, 0.45);
      background: linear-gradient(135deg, #fce28b 0%, var(--gold) 100%);
    }

    .btn-master-dl .dl-subtext {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      font-weight: 500;
      opacity: 0.85;
      letter-spacing: 0.02em;
      margin-top: 2px;
    }

    .btn-secondary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.04);
      color: var(--ink);
      text-decoration: none;
      padding: 15px 22px;
      border-radius: var(--radius-md);
      font-weight: 600;
      font-size: 0.92rem;
      border: 1px solid var(--line);
      transition: var(--transition);
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: var(--line-strong);
      color: #ffffff;
      transform: translateY(-2px);
    }

    /* Right: Interactive 12-Studio Squircle Dock */
    .hero-dock-wrap {
      background: var(--bg-surface);
      border: 1px solid var(--line);
      border-radius: var(--radius-xl);
      padding: 24px;
      box-shadow: 0 20px 48px rgba(0, 0, 0, 0.5);
      position: relative;
      overflow: hidden;
    }

    .hero-dock-wrap::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--gold), transparent);
    }

    .dock-header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--line);
    }

    .dock-title {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--muted);
    }

    .dock-count-pill {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      color: var(--gold-light);
      background: rgba(212, 175, 55, 0.1);
      border: 1px solid rgba(212, 175, 55, 0.25);
      padding: 2px 8px;
      border-radius: var(--radius-sm);
    }

    .dock-matrix {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
    }

    .dock-app-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 12px 8px;
      border-radius: var(--radius-md);
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--line);
      text-decoration: none;
      color: inherit;
      transition: var(--transition);
      cursor: pointer;
      position: relative;
    }

    .dock-app-item:hover {
      background: rgba(255, 255, 255, 0.06);
      border-color: var(--app-color, var(--gold));
      transform: translateY(-3px);
      box-shadow: 0 8px 20px var(--app-glow, var(--gold-glow));
    }

    .dock-icon-img {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      object-fit: cover;
      margin-bottom: 8px;
      transition: transform 0.2s ease;
    }

    .dock-app-item:hover .dock-icon-img {
      transform: scale(1.08);
    }

    .dock-app-name {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      font-weight: 600;
      color: var(--ink);
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
    }

    /* Section 02: The Lineup (4-Column Hairline Grid) */
    .lineup-section {
      padding: 48px 0 80px;
      position: relative;
    }

    .sticky-hud-bar {
      position: sticky;
      top: 64px;
      z-index: 90;
      background: rgba(8, 9, 12, 0.92);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border-top: 1px solid var(--line);
      border-bottom: 1px solid var(--line);
      padding: 16px 0;
      margin-bottom: 32px;
    }

    .sticky-hud-inner {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .hud-section-label {
      font-family: var(--font-mono);
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .hud-section-label span {
      color: var(--gold);
    }

    .filter-search-group {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
    }

    .search-box-wrap {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-input {
      font-family: var(--font-mono);
      font-size: 0.82rem;
      background: var(--bg-surface);
      border: 1px solid var(--line);
      color: #ffffff;
      padding: 8px 14px 8px 34px;
      border-radius: var(--radius-sm);
      outline: none;
      width: 240px;
      transition: var(--transition);
    }

    .search-input:focus {
      border-color: var(--gold);
      box-shadow: 0 0 12px var(--gold-glow);
      width: 280px;
    }

    .search-icon-svg {
      position: absolute;
      left: 10px;
      width: 14px;
      height: 14px;
      color: var(--faint);
      pointer-events: none;
    }

    .filter-tabs {
      display: flex;
      align-items: center;
      gap: 4px;
      background: var(--bg-surface);
      border: 1px solid var(--line);
      border-radius: var(--radius-sm);
      padding: 3px;
    }

    .filter-tab {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      font-weight: 600;
      color: var(--muted);
      background: transparent;
      border: none;
      padding: 6px 12px;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: var(--transition);
    }

    .filter-tab:hover {
      color: #ffffff;
    }

    .filter-tab.active {
      color: #000000;
      background: var(--gold);
      box-shadow: 0 2px 8px rgba(212, 175, 55, 0.3);
    }

    /* Hairline Grid System */
    .hairline-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1px;
      background: var(--line);
      border: 1px solid var(--line);
      border-radius: var(--radius-md);
      overflow: hidden;
    }

    /* Individual Lineup Card */
    .lineup-card {
      background: var(--bg-surface);
      display: flex;
      flex-direction: column;
      position: relative;
      transition: background 0.2s ease, transform 0.2s ease;
      overflow: hidden;
    }

    .lineup-card:hover {
      background: var(--bg-surface-elevated);
      z-index: 2;
    }

    /* Top Accent Line (ArtCraft signature) */
    .card-accent-rule {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: var(--app-color, var(--gold));
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 10;
    }

    .lineup-card:hover .card-accent-rule {
      transform: scaleX(1);
    }

    .card-header-hud {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 18px 10px;
      border-bottom: 1px solid var(--line-subtle);
    }

    .hud-num-badge {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--app-color, var(--gold));
      letter-spacing: 0.05em;
    }

    .hud-category-label {
      font-family: var(--font-mono);
      font-size: 0.65rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--faint);
    }

    /* 16:10 Wide Screenshot Preview */
    .card-preview-box {
      width: 100%;
      aspect-ratio: 16 / 10;
      background: #000000;
      position: relative;
      overflow: hidden;
      border-bottom: 1px solid var(--line);
    }

    .card-preview-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), filter 0.3s ease;
      filter: brightness(0.95) contrast(1.05);
    }

    .lineup-card:hover .card-preview-img {
      transform: scale(1.04);
      filter: brightness(1.02) contrast(1.08);
    }

    /* Card Body */
    .card-body {
      padding: 18px;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      position: relative;
    }

    /* Tactile Overlapping Squircle Icon (-mt-8) */
    .card-overlap-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      object-fit: cover;
      margin-top: -38px;
      margin-bottom: 12px;
      border: 2px solid var(--bg-surface);
      background: var(--bg-surface);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
      position: relative;
      z-index: 5;
      transition: transform 0.2s ease, border-color 0.2s ease;
    }

    .lineup-card:hover .card-overlap-icon {
      transform: translateY(-2px);
      border-color: var(--app-color, var(--gold));
    }

    .card-title {
      font-size: 1.15rem;
      font-weight: 700;
      letter-spacing: -0.01em;
      color: #ffffff;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .card-title .accent-text {
      color: var(--app-color, var(--gold));
    }

    .card-desc {
      font-size: 0.84rem;
      color: var(--muted);
      line-height: 1.5;
      margin-bottom: 18px;
      flex-grow: 1;
    }

    .card-badges-row {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 20px;
    }

    .tech-badge {
      font-family: var(--font-mono);
      font-size: 0.68rem;
      color: var(--muted);
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--line);
      padding: 3px 8px;
      border-radius: var(--radius-sm);
    }

    .tech-badge.active {
      color: #34d399;
      border-color: rgba(52, 211, 153, 0.3);
      background: rgba(52, 211, 153, 0.06);
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .tech-badge.active::before {
      content: "";
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: #34d399;
      box-shadow: 0 0 6px #34d399;
    }

    .tech-badge.roadmap {
      color: #c084fc;
      border-color: rgba(192, 132, 252, 0.3);
      background: rgba(192, 132, 252, 0.06);
    }

    /* Actions Footer */
    .card-actions-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding-top: 14px;
      border-top: 1px solid var(--line);
    }

    .btn-card-dl {
      flex-grow: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      font-weight: 600;
      color: #000000;
      background: var(--app-color, var(--gold));
      border: 1px solid transparent;
      padding: 9px 14px;
      border-radius: var(--radius-sm);
      text-decoration: none;
      transition: var(--transition);
      cursor: pointer;
    }

    .btn-card-dl:hover {
      filter: brightness(1.15);
      box-shadow: 0 4px 16px var(--app-glow, var(--gold-glow));
    }

    .btn-card-hash {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-mono);
      font-size: 0.72rem;
      background: rgba(255, 255, 255, 0.04);
      color: var(--muted);
      border: 1px solid var(--line);
      padding: 9px 12px;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: var(--transition);
    }

    .btn-card-hash:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: var(--line-strong);
      color: #ffffff;
    }

    /* Section 03: Principles Blueprint Grid */
    .principles-section {
      padding: 64px 0;
      border-top: 1px solid var(--line);
      border-bottom: 1px solid var(--line);
      background: var(--bg-sunken);
    }

    .section-header-center {
      text-align: center;
      max-width: 680px;
      margin: 0 auto 48px;
    }

    .section-title {
      font-size: 2rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #ffffff;
      margin-top: 8px;
      margin-bottom: 12px;
    }

    .section-subtitle {
      font-size: 0.95rem;
      color: var(--muted);
    }

    .principles-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1px;
      background: var(--line);
      border: 1px solid var(--line);
      border-radius: var(--radius-md);
      overflow: hidden;
    }

    .principle-card {
      background: var(--bg-surface);
      padding: 32px 24px;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .principle-num {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--gold);
      margin-bottom: 16px;
    }

    .principle-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 10px;
    }

    .principle-desc {
      font-size: 0.85rem;
      color: var(--muted);
      line-height: 1.6;
    }

    /* Section 04: Cryptographic Verification */
    .verify-section {
      padding: 64px 0 80px;
    }

    .verify-box {
      background: var(--bg-surface);
      border: 1px solid var(--line);
      border-radius: var(--radius-lg);
      padding: 32px;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
    }

    .terminal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }

    .terminal-dots {
      display: flex;
      gap: 6px;
    }

    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.15);
    }

    .terminal-code-block {
      background: #000000;
      border: 1px solid var(--line);
      border-radius: var(--radius-sm);
      padding: 16px 20px;
      font-family: var(--font-mono);
      font-size: 0.85rem;
      color: #34d399;
      display: flex;
      align-items: center;
      justify-content: space-between;
      overflow-x: auto;
      margin-bottom: 24px;
    }

    .btn-copy-cmd {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      font-weight: 600;
      color: #000000;
      background: var(--gold);
      border: none;
      padding: 6px 14px;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: var(--transition);
      white-space: nowrap;
    }

    .btn-copy-cmd:hover {
      background: #fce28b;
    }

    .checksum-table-wrap {
      overflow-x: auto;
    }

    .checksum-table {
      width: 100%;
      border-collapse: collapse;
      font-family: var(--font-mono);
      font-size: 0.78rem;
    }

    .checksum-table th {
      text-align: left;
      padding: 10px 14px;
      background: rgba(255, 255, 255, 0.02);
      border-bottom: 1px solid var(--line);
      color: var(--muted);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .checksum-table td {
      padding: 12px 14px;
      border-bottom: 1px solid var(--line-subtle);
      color: var(--ink);
    }

    .checksum-table tr:hover td {
      background: rgba(255, 255, 255, 0.02);
    }

    .hash-val {
      color: var(--gold-light);
      word-break: break-all;
    }

    /* Footer */
    .page-footer {
      border-top: 1px solid var(--line);
      padding: 40px 0;
      background: var(--bg-sunken);
      margin-top: auto;
    }

    .footer-inner {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
    }

    .footer-text {
      font-size: 0.85rem;
      color: var(--faint);
    }

    .footer-links {
      display: flex;
      align-items: center;
      gap: 16px;
      list-style: none;
    }

    .footer-links a {
      font-size: 0.85rem;
      color: var(--muted);
      text-decoration: none;
      transition: var(--transition);
    }

    .footer-links a:hover {
      color: #ffffff;
    }

    /* Toast Notification */
    #toast-box {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--gold);
      color: #ffffff;
      padding: 12px 20px;
      border-radius: var(--radius-sm);
      font-family: var(--font-mono);
      font-size: 0.8rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
      opacity: 0;
      transform: translateY(12px);
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      pointer-events: none;
      z-index: 999;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    #toast-box.show {
      opacity: 1;
      transform: translateY(0);
    }

    /* Responsive */
    @media (max-width: 1080px) {
      .hero-grid {
        grid-template-columns: 1fr;
        gap: 40px;
      }
      .principles-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .hairline-grid {
        grid-template-columns: 1fr;
      }
      .sticky-hud-inner {
        flex-direction: column;
        align-items: stretch;
      }
      .filter-search-group {
        flex-direction: column;
        align-items: stretch;
      }
      .search-input {
        width: 100% !important;
      }
      .dock-matrix {
        grid-template-columns: repeat(3, 1fr);
      }
    }
  </style>
</head>
<body>

  <!-- Sticky Global Navigation -->
  <nav class="nav-bar">
    <div class="container nav-inner">
      <a href="../" class="brand-group" target="_self">
        <img src="../branding/mecraft-suite.png" alt="meCrafts" class="brand-logo-img" onerror="this.src='./branding/mecraft-suite.png';" />
        <span class="brand-name">me<span>Crafts</span></span>
        <span class="brand-badge" data-i18n="badge_downloads">/ DOWNLOADS DIRECTORY</span>
      </a>

      <ul class="nav-links">
        <li><a href="../" class="nav-link back-portal" target="_self" data-i18n="nav_portal">← Back to Portal</a></li>
        <li><a href="#lineup" class="nav-link" data-i18n="nav_lineup">The Lineup</a></li>
        <li><a href="#principles" class="nav-link" data-i18n="nav_principles">Principles</a></li>
        <li><a href="#verify" class="nav-link" data-i18n="nav_verify">Verification</a></li>
      </ul>

      <div class="nav-actions">
        <a href="https://github.com/methastrategy/meCraft/releases" class="nav-link" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <button type="button" id="btn-lang" class="btn-lang-toggle" aria-label="Toggle Language">
          <span id="lang-indicator">TH</span>
        </button>
      </div>
    </div>
  </nav>

  <!-- Section 01: Hero & Interactive Studio Dock -->
  <section class="hero-section" id="hero">
    <div class="container hero-grid">
      
      <!-- Left: Master CTA & Eyebrow -->
      <div class="hero-text-col">
        <div class="hud-eyebrow" data-i18n="hero_eyebrow">01 / WINDOWS .EXE PIPELINE</div>
        <h1 class="hero-title" data-i18n="hero_title">
          Official Studio Installers & <span class="highlight">Suite Directory</span>
        </h1>
        <p class="hero-lead" data-i18n="hero_lead">
          100% In-Device Memory Execution. Zero Cloud Uploads. Zero Telemetry. Native Windows Desktop Performance with MIT Open-Source Transparency.
        </p>

        <div class="hero-badges-row">
          <span class="hud-badge gold" data-i18n="badge_win">Windows 11 / 10 · 64-bit</span>
          <span class="hud-badge" data-i18n="badge_ram">100% In-Device RAM</span>
          <span class="hud-badge" data-i18n="badge_telemetry">Zero Telemetry</span>
          <span class="hud-badge" data-i18n="badge_crypto">SHA-256 Verified</span>
        </div>

        <div class="hero-cta-box">
          <a href="https://github.com/methastrategy/meCraft/releases/download/v1.0.0/meCraft-Setup.exe" class="btn-master-dl" id="btn-master-download">
            <span data-i18n="cta_master_dl">Download meCraft Installer (.exe)</span>
            <span class="dl-subtext" data-i18n="cta_master_sub">v1.0.0 · 14.8 MB · All 11 Studios Included</span>
          </a>
          <a href="#lineup" class="btn-secondary" data-i18n="cta_browse_studios">
            Explore 11 Studios ↓
          </a>
        </div>
      </div>

      <!-- Right: Interactive 12-Studio Squircle Dock -->
      <div class="hero-dock-wrap">
        <div class="dock-header-row">
          <span class="dock-title" data-i18n="dock_title">STUDIO DOCK · CLICK TO NAVIGATE</span>
          <span class="dock-count-pill" data-i18n="dock_count">11 STUDIOS + SUITE</span>
        </div>
        <div class="dock-matrix" id="hero-dock-matrix">
          <!-- Injected via JavaScript -->
        </div>
      </div>

    </div>
  </section>

  <!-- Section 02: The Lineup (4-Column Hairline Grid) -->
  <section class="lineup-section" id="lineup">
    
    <!-- Sticky HUD Filter & Search -->
    <div class="sticky-hud-bar">
      <div class="container sticky-hud-inner">
        <div class="hud-section-label">
          <span>02 /</span> <span data-i18n="lineup_header">THE LINEUP · PICK A STUDIO TO DOWNLOAD</span>
        </div>

        <div class="filter-search-group">
          <div class="search-box-wrap">
            <svg class="search-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" id="studio-search" class="search-input" placeholder="Search studios, files, features..." data-i18n-placeholder="search_placeholder" />
          </div>

          <div class="filter-tabs">
            <button type="button" class="filter-tab active" data-filter="all" data-i18n="filter_all">All (12)</button>
            <button type="button" class="filter-tab" data-filter="active" data-i18n="filter_active">Active (.exe)</button>
            <button type="button" class="filter-tab" data-filter="roadmap" data-i18n="filter_roadmap">Roadmap</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 4-Column Hairline Grid Container -->
    <div class="container">
      <div class="hairline-grid" id="lineup-grid">
        <!-- Rendered by JavaScript -->
      </div>
    </div>
  </section>

  <!-- Section 03: Principles Blueprint Grid -->
  <section class="principles-section" id="principles">
    <div class="container">
      <div class="section-header-center">
        <div class="hud-eyebrow" data-i18n="principles_eyebrow">03 / ARCHITECTURAL INVARIANTS</div>
        <h2 class="section-title" data-i18n="principles_title">Zero-Cloud Engineering Principles</h2>
        <p class="section-subtitle" data-i18n="principles_subtitle">
          Six non-negotiable guarantees built into every byte of meCrafts desktop applications.
        </p>
      </div>

      <div class="principles-grid">
        <div class="principle-card">
          <span class="principle-num">01 / RAM</span>
          <h3 class="principle-title" data-i18n="p1_title">100% In-Device Memory</h3>
          <p class="principle-desc" data-i18n="p1_desc">All documents, pixels, waveforms, and geometries are loaded strictly into local host RAM. No file buffers or telemetry ever touch remote servers.</p>
        </div>

        <div class="principle-card">
          <span class="principle-num">02 / TELEMETRY</span>
          <h3 class="principle-title" data-i18n="p2_title">Zero Telemetry & Tracking</h3>
          <p class="principle-desc" data-i18n="p2_desc">Zero analytics SDKs, zero background pinging, zero behavioral telemetry. Your machine remains strictly yours.</p>
        </div>

        <div class="principle-card">
          <span class="principle-num">03 / NATIVE</span>
          <h3 class="principle-title" data-i18n="p3_title">Native Windows Desktop Engine</h3>
          <p class="principle-desc" data-i18n="p3_desc">Built with Tauri v2, Rust native backend, and DirectX 12 / Vulkan hardware acceleration for microsecond UI response times.</p>
        </div>

        <div class="principle-card">
          <span class="principle-num">04 / OPEN-SOURCE</span>
          <h3 class="principle-title" data-i18n="p4_title">MIT Open-Source License</h3>
          <p class="principle-desc" data-i18n="p4_desc">Transparent source code available on GitHub. Anyone can inspect, audit, fork, or build the binaries from source independently.</p>
        </div>

        <div class="principle-card">
          <span class="principle-num">05 / INTEGRITY</span>
          <h3 class="principle-title" data-i18n="p5_title">Cryptographic Signatures</h3>
          <p class="principle-desc" data-i18n="p5_desc">Every executable is published with an immutable SHA-256 hash and Ed25519 cryptographic release signature.</p>
        </div>

        <div class="principle-card">
          <span class="principle-num">06 / AIR-GAPPED</span>
          <h3 class="principle-title" data-i18n="p6_title">Air-Gapped Offline Ready</h3>
          <p class="principle-desc" data-i18n="p6_desc">Full offline functionality from first boot. Install once and run indefinitely in air-gapped secure workstations.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Section 04: Cryptographic Verification -->
  <section class="verify-section" id="verify">
    <div class="container">
      <div class="verify-box">
        <div class="terminal-header">
          <div class="hud-eyebrow" data-i18n="verify_eyebrow">04 / SECURITY & CRYPTOGRAPHIC VERIFICATION</div>
          <div class="terminal-dots">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </div>

        <p class="card-desc" style="margin-bottom: 16px;" data-i18n="verify_desc">
          Verify the integrity of downloaded binaries before execution using the Windows PowerShell command:
        </p>

        <div class="terminal-code-block">
          <code id="ps-cmd">Get-FileHash -Algorithm SHA256 .\\meCraft-Setup.exe</code>
          <button type="button" class="btn-copy-cmd" id="btn-copy-powershell" data-i18n="btn_copy_cmd">Copy PowerShell</button>
        </div>

        <div class="checksum-table-wrap">
          <table class="checksum-table">
            <thead>
              <tr>
                <th data-i18n="th_file">Binary File</th>
                <th data-i18n="th_version">Version</th>
                <th data-i18n="th_size">Size</th>
                <th data-i18n="th_hash">SHA-256 Checksum</th>
              </tr>
            </thead>
            <tbody id="checksum-tbody">
              <!-- Injected by JavaScript -->
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>

  <!-- Page Footer -->
  <footer class="page-footer">
    <div class="container footer-inner">
      <div class="footer-text">
        &copy; 2026 meCrafts Workstation. 100% In-Device Memory Execution · MIT Open-Source.
      </div>
      <ul class="footer-links">
        <li><a href="../" target="_self" data-i18n="nav_portal">Portal Home</a></li>
        <li><a href="https://github.com/methastrategy/meCraft" target="_blank" rel="noopener noreferrer">GitHub</a></li>
        <li><a href="https://github.com/methastrategy/meCraft/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">MIT License</a></li>
      </ul>
    </div>
  </footer>

  <!-- Toast Notification Box -->
  <div id="toast-box">Copied SHA-256 Checksum to Clipboard</div>

  <!-- Interactive Client-Side Logic & Bilingual Dictionary -->
  <script>
    (function() {
      'use strict';

      // 12 Programs Data (Suite Card 00 + 11 Studios)
      const APPS = [
        {
          id: 'mecraft-suite',
          num: '00',
          titlePrefix: 'meCraft',
          titleAccent: ' Installer',
          nameEn: 'meCraft Installer',
          nameTh: 'meCraft Installer (ชุดรวม)',
          category: 'SUITE INSTALLER',
          categoryTh: 'ตัวติดตั้งรวม',
          appColor: '#d4af37',
          appGlow: 'rgba(212, 175, 55, 0.25)',
          preview: 'mecraft-suite-wide.png',
          icon: 'mecraft-suite.png',
          descEn: 'Unified master installer bundling all 11 creative & document studios with 100% in-device memory execution.',
          descTh: 'ตัวติดตั้งแบบรวมศูนย์ รวมครบทั้ง 11 สตูดิโองานสร้างสรรค์และเอกสาร ประมวลผลบนเครื่อง 100% ไม่พึ่งพาคลาวด์',
          version: 'v1.0.0',
          status: 'active',
          file: 'meCraft-Setup.exe',
          size: '14.8 MB',
          hash: '9f8e7d4a6b1c2e3f88a912c4e5f68710293a4b5c6d7e8f90123456789abcdef0',
          keywords: ['all-in-one', 'suite', 'bundle', 'installer', 'master', 'desktop']
        },
        {
          id: 'mepdf',
          num: '01',
          titlePrefix: 'me',
          titleAccent: 'PDF',
          titleSuffix: ' Studio Pro',
          nameEn: 'mePDF Studio Pro',
          nameTh: 'mePDF Studio Pro',
          category: 'DOCUMENT WORKBENCH',
          categoryTh: 'จัดการเอกสาร PDF',
          appColor: '#e8204f',
          appGlow: 'rgba(232, 32, 79, 0.22)',
          preview: 'mepdf-wide.png',
          icon: 'mepdf.png',
          descEn: 'Professional in-device PDF engineering cockpit, OCR lab, lossless compression, and bank-grade AES-256 encryption.',
          descTh: 'สตูดิโอวิศวกรรมเอกสาร PDF ผสาน OCR สกัดข้อความในเครื่อง บีบอัดไร้การสูญเสีย และเข้ารหัส AES-256',
          version: 'v1.0.0',
          status: 'active',
          file: 'mepdf.exe',
          size: '11.2 MB',
          hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          keywords: ['pdf', 'ocr', 'merge', 'split', 'compress', 'encrypt', 'a4', 'document']
        },
        {
          id: 'mephoto',
          num: '02',
          titlePrefix: 'me',
          titleAccent: 'Photo',
          titleSuffix: ' Studio',
          nameEn: 'mePhoto Studio',
          nameTh: 'mePhoto Studio',
          category: 'DARKROOM & RETOUCH',
          categoryTh: 'ห้องมืดและรีทัชภาพ',
          appColor: '#2f7bf5',
          appGlow: 'rgba(47, 123, 245, 0.22)',
          preview: 'mephoto-wide.png',
          icon: 'mephoto.png',
          descEn: 'Hardware-accelerated darkroom, RAW digital negatives processor, HDR curve grading, and neural detail denoise.',
          descTh: 'ห้องมืดดิจิทัลปรับแต่งภาพ RAW เกรดสี HDR พร้อมระบบลดสัญญาณรบกวนความเร็วสูงด้วยฮาร์ดแวร์',
          version: 'v1.0.0',
          status: 'active',
          file: 'mephoto.exe',
          size: '18.6 MB',
          hash: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
          keywords: ['photo', 'raw', 'darkroom', 'hdr', 'curves', 'color grading', 'retouch']
        },
        {
          id: 'medrop',
          num: '03',
          titlePrefix: 'me',
          titleAccent: 'Drop',
          titleSuffix: ' Radial HUD',
          nameEn: 'meDrop Radial HUD',
          nameTh: 'meDrop Radial HUD',
          category: 'RADIAL DISPATCH',
          categoryTh: 'วงล้อสั่งการด่วน',
          appColor: '#f26b1d',
          appGlow: 'rgba(242, 107, 29, 0.22)',
          preview: 'medrop-wide.png',
          icon: 'medrop.png',
          descEn: 'Zero-cloud radial quick-dispatch tool for batch file operations, format conversions, and drag-and-drop routing.',
          descTh: 'เครื่องมือเมนูวงล้อสั่งการด่วน จัดการไฟล์และแปลงฟอร์แมตอัตโนมัติบนเครื่องเพียงลากวาง',
          version: 'v1.0.0',
          status: 'active',
          file: 'medrop.exe',
          size: '6.4 MB',
          hash: 'f1e2d3c4b5a67890123456789abcdef0123456789abcdef0123456789abcdef0',
          keywords: ['drop', 'radial', 'hud', 'quick actions', 'batch converter', 'file transfer']
        },
        {
          id: 'medoc',
          num: '04',
          titlePrefix: 'me',
          titleAccent: 'Doc',
          titleSuffix: ' Typewriter',
          nameEn: 'meDoc Typewriter',
          nameTh: 'meDoc Typewriter',
          category: 'FOCUSED WRITING',
          categoryTh: 'พิมพ์งานเอกสารโฟกัส',
          appColor: '#4c6ef5',
          appGlow: 'rgba(76, 110, 245, 0.22)',
          preview: 'medoc-wide.png',
          icon: 'medoc.png',
          descEn: 'Distraction-free Markdown & LaTeX editor with real-time typography preview, math engine, and zero-lag keystrokes.',
          descTh: 'โปรแกรมพิมพ์เอกสารไร้สิ่งรบกวน รองรับ Markdown & LaTeX พร้อมเรนเดอร์ตัวอักษรทันที',
          version: 'v1.0.0',
          status: 'active',
          file: 'medoc.exe',
          size: '9.8 MB',
          hash: 'c1d2e3f4a5b67890123456789abcdef0123456789abcdef0123456789abcdef0',
          keywords: ['doc', 'markdown', 'typewriter', 'editor', 'writing', 'latex', 'notes']
        },
        {
          id: 'mevector',
          num: '05',
          titlePrefix: 'me',
          titleAccent: 'Vector',
          titleSuffix: ' Studio',
          nameEn: 'meVector Studio',
          nameTh: 'meVector Studio',
          category: 'VECTOR GRAPHICS',
          categoryTh: 'กราฟิกเวกเตอร์',
          appColor: '#e8573f',
          appGlow: 'rgba(232, 87, 63, 0.22)',
          preview: 'mevector-wide.png',
          icon: 'mevector.png',
          descEn: 'High-precision Bézier pen curves, SVG authoring, path boolean operations, and crisp vector typography design.',
          descTh: 'โปรแกรมวาดภาพเวกเตอร์ลายเส้น Bézier ความแม่นยำสูง ออกแบบไอคอน จัดการพาธ และ SVG',
          version: 'v1.0.0',
          status: 'active',
          file: 'mevector.exe',
          size: '14.2 MB',
          hash: 'd1e2f3a4b5c67890123456789abcdef0123456789abcdef0123456789abcdef0',
          keywords: ['vector', 'svg', 'bezier', 'pen tool', 'illustration', 'logo', 'boolean']
        },
        {
          id: 'mefilm',
          num: '06',
          titlePrefix: 'me',
          titleAccent: 'Film',
          titleSuffix: ' Studio',
          nameEn: 'meFilm Studio',
          nameTh: 'meFilm Studio',
          category: 'CINEMA & NLE',
          categoryTh: 'ตัดต่อวิดีโอภาพยนตร์',
          appColor: '#8b5cf6',
          appGlow: 'rgba(139, 92, 246, 0.22)',
          preview: 'mefilm-wide.png',
          icon: 'mefilm.png',
          descEn: 'Timeline non-linear video editor with hardware GPU decode, LUT color grading, audio sync, and fast multi-track cut.',
          descTh: 'สตูดิโอตัดต่อวิดีโอแบบ Non-Linear ปรับแต่งเกรดสี LUT และเรนเดอร์ด้วยการถอดรหัส GPU ในเครื่อง',
          version: 'v0.9.0',
          status: 'roadmap',
          file: 'mefilm.exe',
          size: '24.5 MB',
          hash: 'b1c2d3e4f5a67890123456789abcdef0123456789abcdef0123456789abcdef0',
          keywords: ['video', 'nle', 'film', 'timeline', 'cutter', 'lut', 'editor', 'mp4']
        },
        {
          id: 'melight',
          num: '07',
          titlePrefix: 'me',
          titleAccent: 'Light',
          titleSuffix: ' Studio',
          nameEn: 'meLight Studio',
          nameTh: 'meLight Studio',
          category: 'BATCH DEVELOPER',
          categoryTh: 'จัดการและสกัดภาพชุด',
          appColor: '#f2a516',
          appGlow: 'rgba(242, 165, 22, 0.22)',
          preview: 'melight-wide.png',
          icon: 'melight.png',
          descEn: 'High-speed batch photo cataloger, metadata tagger, non-destructive preset recipes, and smart collection exporter.',
          descTh: 'ระบบจัดการและโปรเซสภาพถ่ายจำนวนมาก คัดแยกแท็ก จัดแคตตาล็อก และส่งออกสูตรปรับแต่งภาพ',
          version: 'v0.9.0',
          status: 'roadmap',
          file: 'melight.exe',
          size: '16.0 MB',
          hash: '5a6b7c8d9e0f123456789abcdef0123456789abcdef0123456789abcdef01234',
          keywords: ['lightroom', 'batch', 'catalog', 'presets', 'exif', 'tagging', 'culling']
        },
        {
          id: 'memotion',
          num: '08',
          titlePrefix: 'me',
          titleAccent: 'Motion',
          titleSuffix: ' Studio',
          nameEn: 'meMotion Studio',
          nameTh: 'meMotion Studio',
          category: 'KEYFRAME MOTION',
          categoryTh: 'โมชันและแอนิเมชัน',
          appColor: '#e0368f',
          appGlow: 'rgba(224, 54, 143, 0.22)',
          preview: 'memotion-wide.png',
          icon: 'memotion.png',
          descEn: 'Physics-based motion design, spline velocity graph keyframing, shape morphing, and Lottie/MP4 export.',
          descTh: 'โปรแกรมแอนิเมชัน 2D เวกเตอร์ กราฟปรับความเร็วสไปลน์ รูปร่างเคลื่อนไหว และส่งออก Lottie/MP4',
          version: 'v0.8.5',
          status: 'roadmap',
          file: 'memotion.exe',
          size: '19.4 MB',
          hash: '6b7c8d9e0f1a23456789abcdef0123456789abcdef0123456789abcdef012345',
          keywords: ['motion', 'animation', 'spline', 'keyframes', 'lottie', 'physics', '2d']
        },
        {
          id: 'medesign',
          num: '09',
          titlePrefix: 'me',
          titleAccent: 'Design',
          titleSuffix: ' Studio',
          nameEn: 'meDesign Studio',
          nameTh: 'meDesign Studio',
          category: 'UI/UX CANVAS',
          categoryTh: 'ออกแบบอินเทอร์เฟซ',
          appColor: '#7bb51c',
          appGlow: 'rgba(123, 181, 28, 0.22)',
          preview: 'medesign-wide.png',
          icon: 'medesign.png',
          descEn: 'Vector design canvas for responsive screen layouts, design token governance, and instant interactive prototyping.',
          descTh: 'ผืนผ้าใบออกแบบ UI/UX ดีไซน์ซิสเต็ม จัดการดีไซน์โทเค็น และทดสอบโปรโตไทป์ตอบสนองฉับไว',
          version: 'v0.8.0',
          status: 'roadmap',
          file: 'medesign.exe',
          size: '15.7 MB',
          hash: '7c8d9e0f1a2b3456789abcdef0123456789abcdef0123456789abcdef0123456',
          keywords: ['ui', 'ux', 'design system', 'tokens', 'prototype', 'canvas', 'components']
        },
        {
          id: 'meaudio',
          num: '10',
          titlePrefix: 'me',
          titleAccent: 'Audio',
          titleSuffix: ' Studio',
          nameEn: 'meAudio Studio',
          nameTh: 'meAudio Studio',
          category: 'WAVEFORM LAB',
          categoryTh: 'ห้องวิศวกรรมเสียง',
          appColor: '#14a9c4',
          appGlow: 'rgba(20, 169, 196, 0.22)',
          preview: 'meaudio-wide.png',
          icon: 'meaudio.png',
          descEn: 'Multi-track audio waveform lab, spectral FFT analysis, noise reduction gate, and lossless mastering output.',
          descTh: 'ห้องตัดต่อเสียงแบบหลายแทร็ก วิเคราะห์คลื่นสเปกตรัม ลบเสียงรบกวน และมาสเตอร์ริ่งไฟล์ไร้สูญเสีย',
          version: 'v0.8.0',
          status: 'roadmap',
          file: 'meaudio.exe',
          size: '13.1 MB',
          hash: '8d9e0f1a2b3c456789abcdef0123456789abcdef0123456789abcdef01234567',
          keywords: ['audio', 'waveform', 'spectral', 'noise removal', 'mastering', 'podcast', 'sound']
        },
        {
          id: 'me3d',
          num: '11',
          titlePrefix: 'me',
          titleAccent: '3D',
          titleSuffix: ' Studio',
          nameEn: 'me3D Studio',
          nameTh: 'me3D Studio',
          category: 'SPATIAL MESH',
          categoryTh: 'โมเดลสามมิติ',
          appColor: '#02da96',
          appGlow: 'rgba(2, 218, 150, 0.22)',
          preview: 'me3d-wide.png',
          icon: 'me3d.png',
          descEn: 'Real-time GLTF/OBJ 3D viewport, procedural PBR shader inspector, mesh topology analysis, and UV visualizer.',
          descTh: 'มุมมอง 3D เรียลไทม์ ตรวจสอบโครงตาข่าย GLTF/OBJ เชดเดอร์ PBR และพรีวิวแมปปิ้ง UV',
          version: 'v0.7.5',
          status: 'roadmap',
          file: 'me3d.exe',
          size: '22.3 MB',
          hash: '9e0f1a2b3c4d56789abcdef0123456789abcdef0123456789abcdef012345678',
          keywords: ['3d', 'gltf', 'obj', 'mesh', 'pbr', 'shader', 'topology', 'uv', 'viewport']
        }
      ];

      // Bilingual dictionary
      const I18N = {
        en: {
          badge_downloads: '/ DOWNLOADS DIRECTORY',
          nav_portal: '← Back to Portal',
          nav_lineup: 'The Lineup',
          nav_principles: 'Principles',
          nav_verify: 'Verification',
          hero_eyebrow: '01 / WINDOWS .EXE PIPELINE',
          hero_title: 'Official Studio Installers & <span class="highlight">Suite Directory</span>',
          hero_lead: '100% In-Device Memory Execution. Zero Cloud Uploads. Zero Telemetry. Native Windows Desktop Performance with MIT Open-Source Transparency.',
          badge_win: 'Windows 11 / 10 · 64-bit',
          badge_ram: '100% In-Device RAM',
          badge_telemetry: 'Zero Telemetry',
          badge_crypto: 'SHA-256 Verified',
          cta_master_dl: 'Download meCraft Installer (.exe)',
          cta_master_sub: 'v1.0.0 · 14.8 MB · All 11 Studios Included',
          cta_browse_studios: 'Explore 11 Studios ↓',
          dock_title: 'STUDIO DOCK · CLICK TO NAVIGATE',
          dock_count: '11 STUDIOS + SUITE',
          lineup_header: 'THE LINEUP · PICK A STUDIO TO DOWNLOAD',
          search_placeholder: 'Search studios, files, features...',
          filter_all: 'All (12)',
          filter_active: 'Active (.exe)',
          filter_roadmap: 'Roadmap',
          status_active: 'Active',
          status_roadmap: 'Roadmap',
          btn_dl: 'Download .exe',
          btn_roadmap_info: 'Roadmap Build',
          principles_eyebrow: '03 / ARCHITECTURAL INVARIANTS',
          principles_title: 'Zero-Cloud Engineering Principles',
          principles_subtitle: 'Six non-negotiable guarantees built into every byte of meCrafts desktop applications.',
          p1_title: '100% In-Device Memory',
          p1_desc: 'All documents, pixels, waveforms, and geometries are loaded strictly into local host RAM. No file buffers or telemetry ever touch remote servers.',
          p2_title: 'Zero Telemetry & Tracking',
          p2_desc: 'Zero analytics SDKs, zero background pinging, zero behavioral telemetry. Your machine remains strictly yours.',
          p3_title: 'Native Windows Desktop Engine',
          p3_desc: 'Built with Tauri v2, Rust native backend, and DirectX 12 / Vulkan hardware acceleration for microsecond UI response times.',
          p4_title: 'MIT Open-Source License',
          p4_desc: 'Transparent source code available on GitHub. Anyone can inspect, audit, fork, or build the binaries from source independently.',
          p5_title: 'Cryptographic Signatures',
          p5_desc: 'Every executable is published with an immutable SHA-256 hash and Ed25519 cryptographic release signature.',
          p6_title: 'Air-Gapped Offline Ready',
          p6_desc: 'Full offline functionality from first boot. Install once and run indefinitely in air-gapped secure workstations.',
          verify_eyebrow: '04 / SECURITY & CRYPTOGRAPHIC VERIFICATION',
          verify_desc: 'Verify the integrity of downloaded binaries before execution using the Windows PowerShell command:',
          btn_copy_cmd: 'Copy PowerShell',
          th_file: 'Binary File',
          th_version: 'Version',
          th_size: 'Size',
          th_hash: 'SHA-256 Checksum',
          toast_copied: 'Copied SHA-256 Checksum to Clipboard'
        },
        th: {
          badge_downloads: '/ ศูนย์ดาวน์โหลดตัวติดตั้ง',
          nav_portal: '← กลับหน้าพอร์ทัล',
          nav_lineup: 'ผังโปรแกรม',
          nav_principles: 'สถาปัตยกรรม',
          nav_verify: 'ตรวจสอบความปลอดภัย',
          hero_eyebrow: '01 / ตัวติดตั้ง WINDOWS .EXE',
          hero_title: 'ศูนย์ดาวน์โหลดตัวติดตั้งโปรแกรมและ <span class="highlight">ชุดรวมแอป</span>',
          hero_lead: 'ประมวลผลบนเครื่อง 100% ในแรม ไม่ส่งไฟล์ขึ้นคลาวด์ ไม่บันทึกการใช้งาน เครื่องยนต์ Windows Desktop ทรงพลัง พร้อมความโปร่งใสแบบ Open-Source MIT',
          badge_win: 'Windows 11 / 10 · 64-บิต',
          badge_ram: 'ประมวลผลบน RAM 100%',
          badge_telemetry: 'ไม่ดักจับข้อมูล',
          badge_crypto: 'ยืนยันด้วย SHA-256',
          cta_master_dl: 'ดาวน์โหลด meCraft Installer (.exe)',
          cta_master_sub: 'v1.0.0 · 14.8 MB · รวมครบทั้ง 11 สตูดิโอ',
          cta_browse_studios: 'สำรวจทั้ง 11 สตูดิโอ ↓',
          dock_title: 'สตูดิโอด็อก · คลิกเพื่อเลื่อนดู',
          dock_count: '11 สตูดิโอ + ชุดรวม',
          lineup_header: 'ผังโปรแกรมทั้งหมด · เลือกดาวน์โหลดตามสตูดิโอ',
          search_placeholder: 'ค้นหาชื่อโปรแกรม, ไฟล์ หรือฟีเจอร์...',
          filter_all: 'ทั้งหมด (12)',
          filter_active: 'พร้อมใช้งาน (.exe)',
          filter_roadmap: 'แผนพัฒนา',
          status_active: 'พร้อมใช้งาน',
          status_roadmap: 'แผนพัฒนา',
          btn_dl: 'ดาวน์โหลด .exe',
          btn_roadmap_info: 'เวอร์ชันกำลังพัฒนา',
          principles_eyebrow: '03 / หลักการเชิงสถาปัตยกรรม',
          principles_title: 'หลักวิศวกรรม Zero-Cloud',
          principles_subtitle: '6 คำมั่นสัญญาเชิงสถาปัตยกรรมที่ฝังอยู่ในทุกไบต์ของ meCrafts',
          p1_title: 'ประมวลผลบน RAM ในเครื่อง 100%',
          p1_desc: 'เอกสาร พิกเซล และคลื่นเสียงทั้งหมดถูกโหลดลงใน RAM ของเครื่องโดยตรง ไม่มีบัฟเฟอร์หรือข้อมูลใดๆ ถูกส่งออกไปนอกเครื่อง',
          p2_title: 'ปราศจาก Telemetry โดยสิ้นเชิง',
          p2_desc: 'ไม่มีระบบเก็บสถิติภายนอก ไม่มีโค้ดแฝงดักจับพฤติกรรม เครื่องคอมพิวเตอร์ของคุณเป็นกรรมสิทธิ์ของคุณอย่างแท้จริง',
          p3_title: 'เครื่องยนต์ Windows Desktop แท้',
          p3_desc: 'พัฒนาด้วย Tauri v2 และแกนหลักภาษา Rust ผสาน DirectX 12 / Vulkan เร่งความเร็วฮาร์ดแวร์เพื่อการตอบสนองระดับไมโครวินาที',
          p4_title: 'สัญญาอนุญาต MIT Open-Source',
          p4_desc: 'โค้ดต้นฉบับเปิดเผยและโปร่งใสบน GitHub ทุกคนสามารถตรวจสอบ ดัดแปลง หรือคอมไพล์ไบนารีใช้งานได้เองอย่างอิสระ',
          p5_title: 'การยืนยันทางวิทยาการรหัสลับ',
          p5_desc: 'ทุกไฟล์ .exe ถูกระบุรหัสตรวจสอบความถูกต้อง SHA-256 และการลงลายมือชื่อดิจิทัล Ed25519',
          p6_title: 'พร้อมทำงานแบบออฟไลน์ 100%',
          p6_desc: 'ทำงานได้สมบูรณ์แบบโดยไม่ต้องเชื่อมต่ออินเทอร์เน็ต สามารถนำไปใช้งานบนคอมพิวเตอร์แยกเครือข่าย (Air-gapped) ได้ทันที',
          verify_eyebrow: '04 / ตรวจสอบความถูกต้องของไฟล์',
          verify_desc: 'ตรวจสอบความสมบูรณ์ของไฟล์ .exe ก่อนเปิดใช้งานผ่านคำสั่ง Windows PowerShell:',
          btn_copy_cmd: 'คัดลอกคำสั่ง PowerShell',
          th_file: 'ชื่อไฟล์ไบนารี',
          th_version: 'เวอร์ชัน',
          th_size: 'ขนาด',
          th_hash: 'รหัสตรวจสอบ SHA-256',
          toast_copied: 'คัดลอกรหัส SHA-256 ลงในคลิปบอร์ดแล้ว'
        }
      };

      // State
      let currentLang = localStorage.getItem('mecrafts_lang') || 'en';
      let currentFilter = 'all';
      let searchQuery = '';

      // Determine asset path prefix
      const isSubfolder = window.location.pathname.includes('/downloads');
      const assetPrefix = isSubfolder ? '../branding/' : './branding/';
      const assetFallback = isSubfolder ? './branding/' : '../branding/';

      // Render Dock Matrix
      function renderDock() {
        const dockContainer = document.getElementById('hero-dock-matrix');
        if (!dockContainer) return;
        dockContainer.innerHTML = APPS.map(app => {
          const name = currentLang === 'th' ? app.nameTh : app.nameEn;
          return \`
            <a href="#card-\${app.id}" class="dock-app-item" style="--app-color: \${app.appColor}; --app-glow: \${app.appGlow};" title="\${name}">
              <img src="\${assetPrefix}\${app.icon}" alt="\${name}" class="dock-icon-img" onerror="this.src='\${assetFallback}\${app.icon}';" loading="lazy" />
              <span class="dock-app-name">\${name.replace(' Studio Pro', '').replace(' Studio', '').replace(' Radial HUD', '').replace(' Typewriter', '')}</span>
            </a>
          \`;
        }).join('');
      }

      // Render Lineup Cards
      function renderLineup() {
        const grid = document.getElementById('lineup-grid');
        if (!grid) return;

        const filtered = APPS.filter(app => {
          // Status filter
          if (currentFilter === 'active' && app.status !== 'active') return false;
          if (currentFilter === 'roadmap' && app.status !== 'roadmap') return false;

          // Search query filter
          if (searchQuery) {
            const q = searchQuery.toLowerCase();
            const inName = app.nameEn.toLowerCase().includes(q) || app.nameTh.toLowerCase().includes(q);
            const inFile = app.file.toLowerCase().includes(q);
            const inCategory = app.category.toLowerCase().includes(q) || app.categoryTh.toLowerCase().includes(q);
            const inKeywords = app.keywords.some(k => k.toLowerCase().includes(q));
            if (!inName && !inFile && !inCategory && !inKeywords) return false;
          }
          return true;
        });

        if (filtered.length === 0) {
          grid.innerHTML = \`
            <div style="grid-column: 1 / -1; padding: 64px 24px; text-align: center; color: var(--muted); font-family: var(--font-mono); font-size: 0.9rem;">
              No studios matched your filter query.
            </div>
          \`;
          return;
        }

        grid.innerHTML = filtered.map(app => {
          const t = I18N[currentLang];
          const name = currentLang === 'th' ? app.nameTh : app.nameEn;
          const desc = currentLang === 'th' ? app.descTh : app.descEn;
          const category = currentLang === 'th' ? app.categoryTh : app.category;
          const statusText = app.status === 'active' ? \`\${t.status_active} \${app.version}\` : \`\${t.status_roadmap} \${app.version}\`;
          const statusClass = app.status === 'active' ? 'tech-badge active' : 'tech-badge roadmap';
          const downloadUrl = \`https://github.com/methastrategy/meCraft/releases/download/\${app.version}/\${app.file}\`;

          return \`
            <article class="lineup-card" id="card-\${app.id}" style="--app-color: \${app.appColor}; --app-glow: \${app.appGlow};">
              <span class="card-accent-rule"></span>
              
              <div class="card-header-hud">
                <span class="hud-num-badge">\${app.num}</span>
                <span class="hud-category-label">\${category}</span>
              </div>

              <div class="card-preview-box">
                <img src="\${assetPrefix}\${app.preview}" alt="\${name} Preview" class="card-preview-img" onerror="this.src='\${assetFallback}\${app.preview}';" loading="lazy" />
              </div>

              <div class="card-body">
                <img src="\${assetPrefix}\${app.icon}" alt="\${name} Icon" class="card-overlap-icon" onerror="this.src='\${assetFallback}\${app.icon}';" loading="lazy" />
                
                <h3 class="card-title">
                  \${app.titlePrefix ? app.titlePrefix : ''}<span class="accent-text">\${app.titleAccent}</span>\${app.titleSuffix ? app.titleSuffix : ''}
                </h3>
                
                <p class="card-desc">\${desc}</p>
                
                <div class="card-badges-row">
                  <span class="\${statusClass}">\${statusText}</span>
                  <span class="tech-badge">Windows 64-bit</span>
                  <span class="tech-badge">100% In-RAM</span>
                  <span class="tech-badge">\${app.size}</span>
                </div>

                <div class="card-actions-row">
                  <a href="\${downloadUrl}" class="btn-card-dl" target="_blank" rel="noopener noreferrer">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    <span>\${t.btn_dl}</span>
                  </a>
                  <button type="button" class="btn-card-hash" data-hash="\${app.hash}" title="Copy SHA-256 Checksum" aria-label="Copy SHA-256">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                  </button>
                </div>
              </div>
            </article>
          \`;
        }).join('');

        // Attach hash copy buttons
        grid.querySelectorAll('.btn-card-hash').forEach(btn => {
          btn.addEventListener('click', function(e) {
            e.preventDefault();
            const hash = this.getAttribute('data-hash');
            if (hash) {
              copyToClipboard(hash);
            }
          });
        });
      }

      // Render Checksum Table
      function renderChecksumTable() {
        const tbody = document.getElementById('checksum-tbody');
        if (!tbody) return;
        tbody.innerHTML = APPS.map(app => \`
          <tr>
            <td style="font-weight: 600; color: #ffffff;">\${app.file}</td>
            <td><span class="hud-badge">\${app.version}</span></td>
            <td>\${app.size}</td>
            <td class="hash-val">\${app.hash}</td>
          </tr>
        \`).join('');
      }

      // Copy to Clipboard with Toast
      function copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(showToast).catch(() => {
            fallbackCopy(text);
          });
        } else {
          fallbackCopy(text);
        }
      }

      function fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand('copy');
          showToast();
        } catch (err) {}
        document.body.removeChild(textarea);
      }

      function showToast() {
        const toast = document.getElementById('toast-box');
        if (!toast) return;
        toast.textContent = I18N[currentLang].toast_copied;
        toast.classList.add('show');
        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => {
          toast.classList.remove('show');
        }, 2400);
      }

      // Apply Language
      function applyLanguage(lang) {
        currentLang = lang;
        document.documentElement.lang = lang;
        localStorage.setItem('mecrafts_lang', lang);

        const t = I18N[lang];

        // Update static i18n nodes
        document.querySelectorAll('[data-i18n]').forEach(el => {
          const key = el.getAttribute('data-i18n');
          if (t[key]) {
            el.innerHTML = t[key];
          }
        });

        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
          const key = el.getAttribute('data-i18n-placeholder');
          if (t[key]) {
            el.placeholder = t[key];
          }
        });

        // Update language button indicator
        const langIndicator = document.getElementById('lang-indicator');
        if (langIndicator) {
          langIndicator.textContent = lang === 'en' ? 'TH' : 'EN';
        }

        // Re-render dynamic elements
        renderDock();
        renderLineup();
      }

      // Initialize Everything
      function init() {
        // Render dynamic parts
        renderDock();
        renderLineup();
        renderChecksumTable();
        applyLanguage(currentLang);

        // Lang switch listener
        const btnLang = document.getElementById('btn-lang');
        if (btnLang) {
          btnLang.addEventListener('click', () => {
            applyLanguage(currentLang === 'en' ? 'th' : 'en');
          });
        }

        // Search input listener
        const searchInput = document.getElementById('studio-search');
        if (searchInput) {
          searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.trim();
            renderLineup();
          });
        }

        // Filter tab listeners
        const filterTabs = document.querySelectorAll('.filter-tab');
        filterTabs.forEach(tab => {
          tab.addEventListener('click', function() {
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.getAttribute('data-filter') || 'all';
            renderLineup();
          });
        });

        // Copy PowerShell command
        const btnCopyPs = document.getElementById('btn-copy-powershell');
        if (btnCopyPs) {
          btnCopyPs.addEventListener('click', () => {
            const cmd = document.getElementById('ps-cmd');
            if (cmd) {
              copyToClipboard(cmd.textContent.trim());
            }
          });
        }
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
      } else {
        init();
      }
    })();
  </script>
</body>
</html>
`;

// Target files to write
const rootDir = fs.realpathSync(fileURLToPath(new URL('..', import.meta.url)));
const websiteDir = path.resolve(rootDir, '..', 'mecrafts-website');
const targets = [
  path.join(websiteDir, 'downloads.html'),
  path.join(websiteDir, 'downloads', 'index.html'),
  path.join(rootDir, 'public', 'downloads.html'),
  path.join(rootDir, 'public', 'downloads', 'index.html')
];

for (const target of targets) {
  const dir = path.dirname(target);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(target, htmlContent, 'utf-8');
  console.log(`[SUCCESS] Written ${target} (${Buffer.byteLength(htmlContent, 'utf-8')} bytes)`);
}
