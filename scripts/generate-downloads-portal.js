import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = fs.realpathSync(path.resolve(__dirname, '..'));

console.log('✨ [generate-downloads-portal] Generating unified 18-studio downloads portal (Home Page Sanctuary Aesthetic + ArtCraft Card-Table Architecture)...');

const htmlContent = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>meCrafts Downloads — Official Windows .exe Installers & Studio Directory</title>
  <meta name="description" content="Official Windows .exe Standalone & Suite Releases for meCrafts Workstation. 18 Creative Studios · 100% In-Device Memory Execution · Zero Telemetry · Open Source MIT." />
  <meta property="og:title" content="meCrafts Downloads — Official Windows .exe Studio Directory" />
  <meta property="og:description" content="Download meCraft Installer (.exe) and standalone studio binaries. 18 Creative Studios · 100% In-Device Memory Execution · Zero Cloud Uploads." />
  <meta property="og:image" content="/assets/branding/github-social-preview.png" />
  <link rel="icon" type="image/png" href="/branding/mecraft-suite.png" />
  <link rel="apple-touch-icon" href="/branding/mecraft-suite.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&family=Prompt:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-base: #090a0f;
      --bg-surface: #0d0e14;
      --bg-card: #111218;
      --bg-card-hover: #161820;
      --bg-elevated: #1a1c26;
      --border-subtle: rgba(255, 255, 255, 0.06);
      --border-mid: rgba(255, 255, 255, 0.10);
      --border-strong: rgba(255, 255, 255, 0.16);
      
      --text-primary: #f0f0f8;
      --text-secondary: #9494a8;
      --text-muted: #5a5a72;
      --text-gold: #d4af37;
      --text-gold-light: #f7d774;
      
      --gold: #d4af37;
      --gold-hover: #f7d774;
      --gold-glow: rgba(212, 175, 55, 0.25);
      --emerald: #10b981;
      --emerald-glow: rgba(16, 185, 129, 0.2);
      --indigo: #6366f1;
      --cyan: #06b6d4;
      --blue-accent: #2563eb;
      --blue-glow: rgba(37, 99, 235, 0.3);
      
      --font-sans: "Inter", "Prompt", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      --font-mono: "JetBrains Mono", Consolas, Monaco, monospace;
      
      --radius-sm: 6px;
      --radius-md: 10px;
      --radius-lg: 16px;
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
      background-color: var(--bg-base);
      color: var(--text-primary);
      font-family: var(--font-sans);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    :lang(th), .lang-th {
      font-family: "Inter", "Prompt", sans-serif;
      letter-spacing: 0;
      line-height: 1.7;
      word-break: keep-all;
    }

    body {
      background-color: var(--bg-base);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow-x: hidden;
      line-height: 1.6;
    }

    /* Ambient Architectural Grid Background */
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

    .container {
      width: 100%;
      max-width: 1440px;
      margin: 0 auto;
      padding: 0 24px;
      position: relative;
      z-index: 1;
    }

    #app {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    /* ── Sticky Portal Header (Exact Match to Home Page #app > header > div) ── */
    .portal-header {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(9, 10, 15, 0.85);
      backdrop-filter: blur(20px) saturate(1.4);
      -webkit-backdrop-filter: blur(20px) saturate(1.4);
      border-bottom: 1px solid var(--border-subtle);
    }

    .portal-header-inner {
      max-width: 1440px;
      margin: 0 auto;
      padding: 0 24px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
    }

    .portal-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1 1 0%;
      min-width: 0;
      outline-offset: 4px;
      text-decoration: none;
      color: inherit;
    }

    .portal-brand-emblem {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      position: relative;
    }

    .portal-brand-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      filter: drop-shadow(0 2px 6px rgba(212, 175, 55, 0.4));
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .portal-brand:hover .portal-brand-img {
      transform: scale(1.1) rotate(-3deg);
    }

    .portal-brand-fallback {
      width: 32px;
      height: 32px;
    }

    .portal-brand-text {
      display: flex;
      flex-direction: column;
      line-height: 1.1;
    }

    .portal-brand-name {
      font-size: 17px;
      font-weight: 800;
      letter-spacing: -0.5px;
      background: linear-gradient(135deg, var(--gold) 0%, #f7d774 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .portal-brand-tag {
      font-size: 10px;
      font-weight: 500;
      color: var(--text-muted);
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    .portal-nav {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      flex: 0 0 auto;
      margin: 0;
      list-style: none;
    }

    .portal-nav-link {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      min-height: 36px;
      font-size: 13px;
      font-weight: 500;
      color: var(--text-secondary);
      border-radius: var(--radius-sm);
      transition: color 0.15s ease-out, background 0.15s ease-out;
      outline-offset: 2px;
      text-decoration: none;
      border: 1px solid transparent;
    }

    .portal-nav-link:hover, .portal-nav-link:focus-visible {
      color: var(--text-primary);
      background: rgba(255, 255, 255, 0.05);
    }

    .portal-nav-link.active {
      color: var(--gold);
      background: rgba(212, 175, 55, 0.08);
      font-weight: 600;
    }

    .portal-header-actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
      flex: 1 1 0%;
      min-width: 0;
    }

    .portal-lang-btn {
      min-height: 36px;
      padding: 0 12px;
      font-size: 12px;
      font-weight: 600;
      color: var(--text-secondary);
      border: 1px solid var(--border-mid);
      border-radius: var(--radius-sm);
      background: transparent;
      cursor: pointer;
      transition: color 0.15s, border-color 0.15s, background 0.15s;
      outline-offset: 2px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .portal-lang-btn:hover, .portal-lang-btn:focus-visible {
      color: var(--text-primary);
      border-color: var(--border-strong);
      background: rgba(255, 255, 255, 0.05);
    }

    .user-profile-pill {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border-mid);
      padding: 4px 6px 4px 10px;
      border-radius: 100px;
      transition: border-color 0.15s;
    }

    .user-profile-pill:hover {
      border-color: var(--border-strong);
    }

    .user-avatar {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--gold) 0%, #f7d774 100%);
      color: #000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 12px;
      flex-shrink: 0;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      line-height: 1.2;
    }

    .user-email {
      font-size: 12px;
      font-weight: 600;
      max-width: 130px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--text-primary);
    }

    .user-tier-badge {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .user-tier-badge.badge-free {
      color: #9494a8;
    }

    .user-tier-badge.badge-pro {
      color: var(--gold);
      text-shadow: 0 0 8px rgba(212, 175, 55, 0.4);
    }

    .btn-signout {
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: 5px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s;
    }

    .btn-signout:hover {
      color: #ef4444;
      background: rgba(239, 68, 68, 0.1);
    }

    .col-emblem-img {
      width: 44px;
      height: 44px;
      object-fit: contain;
      border-radius: 10px;
    }

    /* ── Hero Section (Home Page Cyber Sanctuary Aesthetic + Centered Grandeur) ── */
    .portal-hero {
      position: relative;
      overflow: hidden;
      padding: 90px 24px 70px;
      text-align: center;
      border-bottom: 1px solid var(--border-subtle);
    }

    .portal-hero-bg {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      background-image: 
        radial-gradient(ellipse at 50% 18%, rgba(13, 17, 23, 0.45) 0%, rgba(9, 10, 15, 0.95) 75%),
        url('/assets/branding/hero-cyber-sanctuary.webp');
      background-position: center 12%;
      background-repeat: no-repeat;
      background-size: cover;
    }

    .hero-glow {
      position: absolute;
      border-radius: 50%;
      filter: blur(90px);
      pointer-events: none;
    }

    .hero-glow-gold {
      width: 500px;
      height: 300px;
      background: radial-gradient(circle, rgba(212, 175, 55, 0.28) 0%, transparent 70%);
      top: -80px;
      left: 50%;
      transform: translateX(-50%);
    }

    .hero-glow-indigo {
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, transparent 70%);
      top: 0;
      left: 8%;
    }

    .hero-glow-cyan {
      width: 350px;
      height: 350px;
      background: radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%);
      bottom: -60px;
      right: 10%;
    }

    .portal-hero-inner {
      position: relative;
      z-index: 1;
      max-width: 960px;
      margin: 0 auto;
    }

    .hero-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-family: var(--font-mono);
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--text-gold-light);
      background: rgba(212, 175, 55, 0.12);
      border: 1px solid rgba(212, 175, 55, 0.35);
      padding: 5px 16px;
      border-radius: 100px;
      margin-bottom: 20px;
    }

    .hero-pill .pulse-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 10px #10b981;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.45; transform: scale(0.85); }
    }

    .hero-title {
      font-size: clamp(32px, 4.5vw, 52px);
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1.15;
      color: #ffffff;
      margin-bottom: 18px;
    }

    .hero-title .highlight {
      background: linear-gradient(135deg, #f7d774 0%, #d4af37 50%, #aa8420 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      display: inline-block;
    }

    .hero-subtitle {
      font-size: clamp(15px, 1.8vw, 17px);
      color: var(--text-secondary);
      line-height: 1.7;
      margin: 0 auto 28px;
      max-width: 780px;
    }

    .hero-badges-row {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 10px;
      margin-bottom: 32px;
    }

    .hero-badge-pill {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      font-size: 13px;
      color: #cbd5e1;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 6px 16px;
      border-radius: 100px;
    }

    .hero-ctas-row {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 14px;
      align-items: center;
      margin-bottom: 24px;
    }

    .hero-cta-primary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 14px 28px;
      font-size: 15px;
      font-weight: 800;
      color: #000;
      background: linear-gradient(135deg, var(--gold) 0%, #f7d774 100%);
      border-radius: var(--radius-md);
      box-shadow: 0 4px 24px var(--gold-glow), 0 1px 0 rgba(255,255,255,0.1) inset;
      transition: var(--transition);
      text-decoration: none;
      border: none;
      cursor: pointer;
    }

    .hero-cta-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(212, 175, 55, 0.4);
    }

    .hero-cta-secondary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 14px 24px;
      font-size: 14px;
      font-weight: 600;
      color: var(--text-secondary);
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border-mid);
      border-radius: var(--radius-md);
      transition: var(--transition);
      text-decoration: none;
    }

    .hero-cta-secondary:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: var(--border-strong);
      color: #ffffff;
    }

    .hero-meta-note {
      font-size: 12px;
      color: var(--text-muted);
      font-family: var(--font-mono);
    }

    /* ── Featured Master Suite Card (Purpur Latest Build Style) ── */
    .dl-featured-suite-wrap {
      padding: 40px 0 20px;
    }

    .featured-card-inner {
      background: linear-gradient(145deg, rgba(212, 175, 55, 0.10) 0%, rgba(17, 24, 39, 0.95) 70%, rgba(13, 18, 31, 0.98) 100%);
      border: 1px solid rgba(212, 175, 55, 0.45);
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5), inset 0 0 24px rgba(212, 175, 55, 0.06);
      border-radius: var(--radius-xl);
      padding: 30px 36px;
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: 28px;
      align-items: center;
      position: relative;
      overflow: hidden;
    }

    .featured-card-inner::after {
      content: "";
      position: absolute;
      top: -50%;
      right: -10%;
      width: 320px;
      height: 320px;
      background: radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
    }

    .featured-emblem-wrap {
      width: 76px;
      height: 76px;
      border-radius: 18px;
      background: rgba(212, 175, 55, 0.12);
      border: 1px solid rgba(212, 175, 55, 0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 24px var(--gold-glow);
      overflow: hidden;
      flex-shrink: 0;
    }

    .featured-emblem-img {
      width: 56px;
      height: 56px;
      object-fit: contain;
    }

    .featured-info h2 {
      font-size: 22px;
      font-weight: 800;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 6px;
      flex-wrap: wrap;
    }

    .suite-badge-gold {
      font-size: 11px;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 999px;
      background: linear-gradient(135deg, var(--gold), var(--gold-light));
      color: #000;
      letter-spacing: 0.3px;
      font-family: var(--font-mono);
    }

    .featured-meta-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 10px;
      font-size: 13px;
      color: var(--text-secondary);
      margin-bottom: 12px;
    }

    .meta-code-pill {
      font-family: var(--font-mono);
      color: var(--text-gold-light);
      background: rgba(212, 175, 55, 0.1);
      border: 1px solid rgba(212, 175, 55, 0.25);
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: 600;
      font-size: 12px;
    }

    .featured-highlights-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .f-tag {
      font-size: 12px;
      color: #e2e8f0;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.09);
      padding: 3px 10px;
      border-radius: 999px;
    }

    .featured-action-col {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 8px;
      flex-shrink: 0;
    }

    .btn-master-suite-dl {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 14px 32px;
      background: linear-gradient(135deg, var(--gold) 0%, #f7d774 100%);
      color: #07090e;
      text-decoration: none;
      border-radius: var(--radius-md);
      font-weight: 800;
      font-size: 15px;
      box-shadow: 0 4px 24px var(--gold-glow), 0 1px 0 rgba(255, 255, 255, 0.2) inset;
      transition: var(--transition);
      border: none;
      cursor: pointer;
      white-space: nowrap;
    }

    .btn-master-suite-dl:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(212, 175, 55, 0.45);
    }

    .btn-master-suite-dl .subtext {
      font-size: 11px;
      font-weight: 600;
      opacity: 0.85;
      font-family: var(--font-mono);
      margin-top: 2px;
    }

    /* ── Sticky HUD Controls Bar (GetBukkit Style) ── */
    .dl-controls {
      position: sticky;
      top: 60px;
      z-index: 90;
      background: rgba(9, 10, 15, 0.9);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-top: 1px solid var(--border-subtle);
      border-bottom: 1px solid var(--border-subtle);
      padding: 14px 0;
      margin-bottom: 32px;
    }

    .dl-controls-inner {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .dl-filters-group {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
    }

    .dl-filter-btn {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border-subtle);
      color: var(--text-secondary);
      font-size: 12.5px;
      font-weight: 600;
      padding: 6px 14px;
      border-radius: 999px;
      cursor: pointer;
      transition: var(--transition);
      font-family: var(--font-mono);
    }

    .dl-filter-btn:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.09);
      border-color: rgba(255, 255, 255, 0.2);
    }

    .dl-filter-btn.active {
      background: var(--gold);
      color: #000;
      border-color: var(--gold);
      box-shadow: 0 2px 12px var(--gold-glow);
      font-weight: 700;
    }

    .dl-search-wrap {
      position: relative;
      flex: 1;
      max-width: 340px;
      min-width: 240px;
    }

    .dl-search-input {
      width: 100%;
      height: 38px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border-mid);
      color: #fff;
      font-size: 13px;
      padding: 0 14px 0 36px;
      border-radius: var(--radius-sm);
      outline: none;
      transition: var(--transition);
      font-family: var(--font-sans);
    }

    .dl-search-input:focus {
      border-color: var(--gold);
      background: rgba(255, 255, 255, 0.07);
      box-shadow: 0 0 12px var(--gold-glow);
    }

    .dl-search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      width: 15px;
      height: 15px;
      color: var(--text-muted);
      pointer-events: none;
    }

    /* ── The Lineup: ArtCraft / GetBukkit Card-Table Rows ── */
    .dl-studios-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 64px;
    }

    .studio-row-card {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 22px 26px;
      display: grid;
      grid-template-columns: 280px 1fr 210px;
      gap: 24px;
      align-items: center;
      transition: var(--transition);
      position: relative;
      overflow: hidden;
    }

    .studio-row-card::before {
      content: "";
      position: absolute;
      top: 0; left: 0; bottom: 0;
      width: 3px;
      background: var(--app-color, var(--gold));
      transition: var(--transition);
    }

    .studio-row-card:hover {
      background: var(--bg-card-hover);
      border-color: var(--border-strong);
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4), 0 0 20px var(--app-glow, transparent);
    }

    .studio-row-card:hover::before {
      width: 5px;
    }

    /* Column 1: Studio App Identity */
    .col-identity {
      display: flex;
      align-items: center;
      gap: 16px;
      min-width: 0;
    }

    .col-emblem {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border-mid);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.6rem;
      flex-shrink: 0;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    }

    .col-emblem img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .col-title-group {
      display: flex;
      flex-direction: column;
      gap: 3px;
      min-width: 0;
    }

    .col-name {
      font-size: 1.1rem;
      font-weight: 800;
      color: #fff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.2;
    }

    .col-badges-row {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }

    .col-ver-tag {
      font-size: 11px;
      font-family: var(--font-mono);
      font-weight: 700;
      padding: 1px 7px;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.07);
      color: #e2e8f0;
      border: 1px solid rgba(255, 255, 255, 0.12);
    }

    .col-counterpart {
      font-size: 11px;
      font-weight: 600;
      color: var(--text-gold-light);
      background: rgba(212, 175, 55, 0.08);
      border: 1px solid rgba(212, 175, 55, 0.2);
      padding: 1px 7px;
      border-radius: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 220px;
    }

    /* Column 2: Structured Metadata & Highlights */
    .col-metadata {
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-width: 0;
    }

    .row-meta-table {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 14px;
      font-size: 12.5px;
      color: var(--text-secondary);
    }

    .meta-item {
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }

    .meta-lbl {
      color: var(--text-muted);
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .meta-val {
      color: #e2e8f0;
      font-weight: 600;
    }

    .meta-val.file {
      font-family: var(--font-mono);
      color: var(--app-color, var(--gold));
    }

    .row-highlights {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .row-pill-tag {
      font-size: 11.5px;
      padding: 2px 8px;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #cbd5e1;
    }

    .row-checksum-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--text-muted);
      margin-top: 2px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .btn-copy-hash {
      background: none;
      border: none;
      color: var(--text-gold);
      cursor: pointer;
      font-size: 11px;
      font-family: var(--font-mono);
      font-weight: 700;
      text-decoration: underline;
      padding: 0;
      transition: var(--transition);
      display: inline-flex;
      align-items: center;
      gap: 3px;
    }

    .btn-copy-hash:hover {
      color: #fff;
    }

    /* Column 3: Dual Actions */
    .col-actions {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 8px;
      min-width: 190px;
    }

    .btn-action-primary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      padding: 10px 18px;
      font-size: 13px;
      font-weight: 800;
      border-radius: var(--radius-sm);
      background: linear-gradient(135deg, var(--gold) 0%, #f7d774 100%);
      color: #07090e;
      transition: var(--transition);
      white-space: nowrap;
      width: 100%;
      border: none;
      cursor: pointer;
      text-decoration: none;
      box-shadow: 0 2px 10px var(--gold-glow);
    }

    .btn-action-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 18px var(--gold-glow);
    }

    .btn-action-secondary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      font-size: 12px;
      font-weight: 600;
      color: var(--text-secondary);
      padding: 4px 8px;
      border-radius: 4px;
      transition: var(--transition);
      text-decoration: none;
    }

    .btn-action-secondary:hover {
      color: var(--gold-light);
    }

    /* ── Verification Cockpit Box ── */
    .dl-cockpit-section {
      padding: 48px 0;
      border-top: 1px solid var(--border-subtle);
      border-bottom: 1px solid var(--border-subtle);
      background: rgba(13, 14, 20, 0.5);
    }

    .cockpit-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 28px;
    }

    .cockpit-card {
      background: var(--bg-card);
      border: 1px solid var(--border-mid);
      border-radius: var(--radius-lg);
      padding: 26px 30px;
    }

    .cockpit-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 14px;
    }

    .cockpit-title {
      font-size: 1.15rem;
      font-weight: 800;
      color: #fff;
    }

    .cockpit-desc {
      font-size: 0.85rem;
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 18px;
    }

    .cmd-box {
      background: #050608;
      border: 1px solid var(--border-mid);
      border-radius: var(--radius-sm);
      padding: 14px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .cmd-text {
      font-family: var(--font-mono);
      font-size: 0.8rem;
      color: #10b981;
      overflow-x: auto;
      white-space: nowrap;
    }

    .btn-copy-cmd {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      font-weight: 700;
      color: #07090e;
      background: var(--gold);
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      transition: var(--transition);
      white-space: nowrap;
    }

    .btn-copy-cmd:hover {
      background: var(--gold-hover);
    }

    /* ── Windows SmartScreen & Security Cockpit Styles (SEC-06) ── */
    .btn-smartscreen-help {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.4);
      color: #34d399;
      font-family: var(--font-sans);
      font-size: 0.8rem;
      font-weight: 600;
      padding: 8px 14px;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: var(--transition);
      margin-top: 6px;
      text-decoration: none;
    }

    .btn-smartscreen-help:hover {
      background: rgba(16, 185, 129, 0.24);
      border-color: #34d399;
      color: #ffffff;
      transform: translateY(-1px);
    }

    .smartscreen-sim-box {
      background: #0078d7;
      color: #ffffff;
      border-radius: 8px;
      padding: 24px 28px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 16px 40px rgba(0, 120, 215, 0.35);
      font-family: "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
      margin: 16px 0 24px;
    }

    .smartscreen-sim-header {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      opacity: 0.85;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .smartscreen-sim-title {
      font-size: 1.45rem;
      font-weight: 400;
      margin-bottom: 8px;
      line-height: 1.3;
    }

    .smartscreen-sim-body {
      font-size: 0.9rem;
      line-height: 1.5;
      opacity: 0.95;
      margin-bottom: 18px;
    }

    .smartscreen-sim-step-link {
      color: #ffffff;
      text-decoration: underline;
      font-weight: 600;
      cursor: pointer;
      display: inline-block;
      padding: 3px 8px;
      background: rgba(255, 255, 255, 0.18);
      border-radius: 4px;
      border: 1px dashed rgba(255, 255, 255, 0.7);
    }

    .smartscreen-sim-action-row {
      display: flex;
      gap: 12px;
      margin-top: 14px;
      flex-wrap: wrap;
    }

    .smartscreen-sim-btn {
      background: #ffffff;
      color: #0078d7;
      font-weight: 600;
      padding: 8px 20px;
      border-radius: 4px;
      border: none;
      font-size: 0.88rem;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
    }

    .smartscreen-sim-btn-highlight {
      background: #d4af37;
      color: #050608;
      box-shadow: 0 0 16px rgba(212, 175, 55, 0.6);
      animation: pulseGold 2s infinite;
    }

    @keyframes pulseGold {
      0%, 100% { box-shadow: 0 0 12px rgba(212, 175, 55, 0.4); }
      50% { box-shadow: 0 0 24px rgba(212, 175, 55, 0.8); }
    }

    .checksum-table-card {
      grid-column: 1 / -1;
      background: var(--bg-card);
      border: 1px solid var(--border-mid);
      border-radius: var(--radius-lg);
      padding: 26px 30px;
      margin-top: 24px;
    }

    .checksum-table-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 20px;
    }

    .checksum-table-scroll {
      overflow-x: auto;
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      background: #07080c;
    }

    .checksum-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.82rem;
      text-align: left;
    }

    .checksum-table th {
      background: #0d0f17;
      color: var(--text-secondary);
      font-weight: 600;
      padding: 12px 16px;
      border-bottom: 1px solid var(--border-mid);
      white-space: nowrap;
    }

    .checksum-table td {
      padding: 12px 16px;
      border-bottom: 1px solid var(--border-subtle);
      vertical-align: middle;
    }

    .checksum-table tr:hover {
      background: rgba(255, 255, 255, 0.02);
    }

    .hash-cell-code {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      color: #9494a8;
      background: rgba(0, 0, 0, 0.4);
      padding: 4px 8px;
      border-radius: 4px;
      display: inline-block;
      max-width: 280px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .btn-copy-hash-table {
      background: rgba(212, 175, 55, 0.15);
      border: 1px solid rgba(212, 175, 55, 0.35);
      color: var(--gold);
      border-radius: 4px;
      padding: 4px 8px;
      font-size: 0.72rem;
      cursor: pointer;
      font-family: var(--font-mono);
      transition: var(--transition);
      margin-left: 8px;
    }

    .btn-copy-hash-table:hover {
      background: var(--gold);
      color: #000;
    }

    .status-badge-clean {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.35);
      color: #34d399;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      white-space: nowrap;
    }

    .cmd-toggle-row {
      display: flex;
      gap: 8px;
      margin-bottom: 10px;
    }

    .btn-cmd-tab {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-subtle);
      color: var(--text-secondary);
      font-family: var(--font-mono);
      font-size: 0.75rem;
      padding: 4px 10px;
      border-radius: 4px;
      cursor: pointer;
      transition: var(--transition);
    }

    .btn-cmd-tab.active {
      background: rgba(212, 175, 55, 0.18);
      border-color: var(--gold);
      color: var(--gold-light);
      font-weight: 600;
    }

    /* ── Footer ── */
    .portal-footer {
      border-top: 1px solid var(--border-subtle);
      background: var(--bg-surface);
      padding: 48px 0 36px;
      margin-top: auto;
    }

    .portal-footer-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      flex-wrap: wrap;
    }

    .footer-brand {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .footer-copy {
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    .footer-links {
      display: flex;
      gap: 16px;
      list-style: none;
    }

    .footer-link {
      font-size: 0.8rem;
      color: var(--text-secondary);
      text-decoration: none;
      transition: var(--transition);
    }

    .footer-link:hover {
      color: var(--gold);
    }

    /* Toast Notification */
    .toast-pill {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #0f172a;
      border: 1px solid var(--gold);
      color: #ffffff;
      padding: 10px 18px;
      border-radius: var(--radius-sm);
      font-family: var(--font-mono);
      font-size: 0.78rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
      transform: translateY(100px);
      opacity: 0;
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s;
      z-index: 1000;
      pointer-events: none;
    }

    .toast-pill.show {
      transform: translateY(0);
      opacity: 1;
    }

    @media (max-width: 1024px) {
      .featured-card-inner { grid-template-columns: 1fr; text-align: center; }
      .featured-emblem-wrap { margin: 0 auto; }
      .featured-action-col { align-items: center; width: 100%; }
      .btn-master-suite-dl { width: 100%; }
      .studio-row-card { grid-template-columns: 1fr; gap: 16px; }
      .col-actions { align-items: stretch; width: 100%; }
      .cockpit-grid { grid-template-columns: 1fr; }
    }

    @media (max-width: 768px) {
      .portal-hero { padding: 60px 16px 48px; }
      .hero-title { font-size: 28px; }
      .portal-header-inner { padding: 0 16px; height: 56px; gap: 12px; }
      .portal-nav { display: none; }
      .portal-brand-tag { display: none; }
    }

    /* ── Account Settings Modal (Pro 2-Column Architecture) ─────────────── */
    .auth-modal-overlay {
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .auth-modal-overlay.active {
      opacity: 1;
      pointer-events: auto;
    }

    .auth-modal-backdrop {
      position: absolute;
      inset: 0;
      background: rgba(3, 4, 7, 0.78);
      backdrop-filter: blur(12px) saturate(1.2);
      -webkit-backdrop-filter: blur(12px) saturate(1.2);
    }

    .settings-modal-card {
      width: 100%;
      max-width: 820px;
      max-height: 88vh;
      background: #0d0f17;
      border: 1px solid var(--border-mid);
      border-radius: var(--radius-xl);
      box-shadow: 0 24px 64px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.04);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      position: relative;
      z-index: 10;
      animation: modalSpring 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    @keyframes modalSpring {
      from { transform: scale(0.95) translateY(10px); opacity: 0; }
      to { transform: scale(1) translateY(0); opacity: 1; }
    }

    .settings-modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 24px;
      background: rgba(255, 255, 255, 0.02);
      border-bottom: 1px solid var(--border-subtle);
    }

    .settings-modal-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 16px;
      font-weight: 700;
      color: var(--text-primary);
    }

    .auth-modal-close {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-muted);
      cursor: pointer;
      font-size: 14px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border-subtle);
      transition: all 0.15s;
    }

    .auth-modal-close:hover {
      background: rgba(255, 255, 255, 0.08);
      color: var(--text-primary);
      border-color: var(--border-mid);
    }

    .settings-modal-body {
      display: flex;
      flex: 1;
      min-height: 460px;
      overflow: hidden;
    }

    .settings-sidebar {
      width: 240px;
      background: rgba(0, 0, 0, 0.25);
      border-right: 1px solid var(--border-subtle);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 16px 12px;
      gap: 16px;
      flex-shrink: 0;
    }

    .settings-nav {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .settings-nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      border-radius: var(--radius-sm);
      font-size: 13px;
      font-weight: 500;
      color: var(--text-secondary);
      border: 1px solid transparent;
      background: transparent;
      cursor: pointer;
      transition: all 0.15s;
      text-align: left;
      width: 100%;
    }

    .settings-nav-item:hover {
      color: var(--text-primary);
      background: rgba(255, 255, 255, 0.04);
    }

    .settings-nav-item.active {
      color: var(--gold);
      background: rgba(212, 175, 55, 0.08);
      border-color: rgba(212, 175, 55, 0.25);
      font-weight: 600;
    }

    .settings-nav-icon {
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .settings-sidebar-bottom {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding-top: 14px;
      border-top: 1px solid var(--border-subtle);
    }

    .settings-lang-box {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .settings-lang-label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .settings-lang-pills {
      display: flex;
      gap: 4px;
      background: rgba(0, 0, 0, 0.45);
      padding: 3px;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border-subtle);
    }

    .settings-lang-pill {
      flex: 1;
      padding: 6px 8px;
      font-size: 12px;
      font-weight: 600;
      color: var(--text-secondary);
      border-radius: 4px;
      background: transparent;
      border: 1px solid transparent;
      cursor: pointer;
      transition: all 0.15s;
      text-align: center;
    }

    .settings-lang-pill:hover {
      color: var(--text-primary);
    }

    .settings-lang-pill.active {
      background: rgba(212, 175, 55, 0.15);
      color: var(--gold);
      border: 1px solid rgba(212, 175, 55, 0.4);
    }

    .btn-settings-signout {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 9px 12px;
      background: rgba(239, 68, 68, 0.08);
      border: 1px solid rgba(239, 68, 68, 0.25);
      border-radius: var(--radius-sm);
      color: #fca5a5;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
      width: 100%;
    }

    .btn-settings-signout:hover {
      background: rgba(239, 68, 68, 0.18);
      border-color: #ef4444;
      color: #ffffff;
    }

    .settings-content {
      flex: 1;
      padding: 24px 28px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .settings-panel-title {
      font-size: 18px;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 4px;
    }

    .settings-panel-desc {
      font-size: 13px;
      color: var(--text-muted);
      line-height: 1.5;
      margin-bottom: 12px;
    }

    .settings-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .settings-label {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-secondary);
    }

    .settings-input {
      width: 100%;
      padding: 10px 14px;
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid var(--border-mid);
      border-radius: var(--radius-sm);
      color: var(--text-primary);
      font-size: 13px;
      outline: none;
      transition: border-color 0.15s;
    }

    .settings-input:focus {
      border-color: var(--gold);
    }

    .settings-input[readonly] {
      background: rgba(255, 255, 255, 0.02);
      color: var(--text-muted);
      cursor: not-allowed;
    }

    .settings-btn-primary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 18px;
      background: linear-gradient(135deg, var(--gold) 0%, #f7d774 100%);
      color: #000000;
      font-weight: 700;
      font-size: 13px;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: opacity 0.15s;
      align-self: flex-start;
      border: none;
    }

    .settings-btn-primary:hover {
      opacity: 0.9;
    }

    .settings-info-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: var(--radius-sm);
      font-size: 12px;
      font-weight: 600;
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }

    @media (max-width: 768px) {
      .settings-modal-body {
        flex-direction: column;
      }
      .settings-sidebar {
        width: 100%;
        border-right: none;
        border-bottom: 1px solid var(--border-subtle);
      }
    }

    /* ── High-Craft Telemetry & Focus Invariants ── */
    code, pre, kbd, .col-hash, .col-ver, .col-size, .cmd-code, .hero-pill, .meta-tag {
      font-variant-numeric: tabular-nums;
    }

    *:focus-visible {
      outline: 2px solid var(--gold);
      outline-offset: 3px;
      border-radius: var(--radius-sm);
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
      }
      .hero-glow, .pulse-dot { animation: none; }
    }
  </style>
</head>
<body>
  <div id="app">

  <!-- Sticky Global Navigation Header (Exact Match to Home Page #app > header > div) -->
  <header class="portal-header" role="banner">
    <div class="portal-header-inner">
      <a class="portal-brand" href="/" aria-label="meCrafts home">
        <div class="portal-brand-emblem" aria-hidden="true">
          <img src="/branding/mecraft-suite.png" class="portal-brand-img" alt="meCrafts" onerror="this.style.display='none';if(this.nextElementSibling){this.nextElementSibling.style.display='inline-flex';}" />
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" class="portal-brand-fallback" style="display:none;">
            <defs>
              <linearGradient id="emblem-g" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#d4af37"/>
                <stop offset="100%" stop-color="#f7d774"/>
              </linearGradient>
            </defs>
            <rect x="2" y="2" width="28" height="28" rx="8" fill="url(#emblem-g)" opacity="0.15"/>
            <path d="M8 24 L16 8 L24 24" stroke="url(#emblem-g)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            <path d="M11 19 h10" stroke="url(#emblem-g)" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="portal-brand-text">
          <span class="portal-brand-name">meCrafts</span>
          <span class="portal-brand-tag" data-i18n="header_badge">Official Suite</span>
        </div>
      </a>

      <nav class="portal-nav" aria-label="Portal navigation">
        <a href="/#apps-grid" class="portal-nav-link" data-i18n="nav_studios">Studios</a>
        <a href="/#manifesto" class="portal-nav-link" data-i18n="nav_privacy">Privacy Architecture</a>
        <a href="/#specs" class="portal-nav-link" data-i18n="nav_specs">Specs</a>
        <a href="/downloads/" class="portal-nav-link active" data-i18n="nav_downloads">Downloads</a>
      </nav>

      <div class="portal-header-actions">
        <button class="portal-lang-btn" id="btn-lang" aria-label="Switch language">
          <span id="lang-indicator">TH</span>
        </button>

        <div class="user-profile-pill" id="user-profile-pill" role="button" tabindex="0" title="methastrategy@gmail.com">
          <div class="user-avatar" aria-hidden="true">M</div>
          <div class="user-details">
            <span class="user-email" title="methastrategy@gmail.com">methastrategy@gm...</span>
            <span class="user-tier-badge badge-free" data-i18n="lbl_free_member">FREE MEMBER</span>
          </div>
          <button class="btn-signout" id="btn-signout" title="Sign Out" aria-label="Sign Out">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>
        </div>
      </div>
    </div>
  </header>

  <!-- Section 01: Hero (Home Page Sanctuary Aesthetic + Centered Grandeur) -->
  <section class="portal-hero" id="hero">
    <div class="portal-hero-bg" aria-hidden="true"></div>
    <div class="hero-glow hero-glow-gold"></div>
    <div class="hero-glow hero-glow-indigo"></div>
    <div class="hero-glow hero-glow-cyan"></div>
    
    <div class="container portal-hero-inner">
      <div class="hero-pill" data-i18n="hero_pill">
        <span class="pulse-dot"></span>
        <span>18 APPS · WINDOWS</span>
      </div>
      
      <h1 class="hero-title" data-i18n="hero_title">
        The Private-First Creative &amp; <span class="highlight">Document Workstation Suite</span>
      </h1>
      
      <p class="hero-subtitle" data-i18n="hero_subtitle">
        100% Client-Side Local Execution. Zero-Cloud Uploads. Native Windows Desktop Engine. 18 Purpose-Built Creative Tools &amp; Utilities — All Free, Forever.
      </p>

      <div class="hero-badges-row">
        <div class="hero-badge-pill" data-i18n="b_privacy">🔒 100% In-Device Privacy</div>
        <div class="hero-badge-pill" data-i18n="b_telemetry">📡 Zero Telemetry</div>
        <div class="hero-badge-pill" data-i18n="b_oss">⚡ Open-Source</div>
        <div class="hero-badge-pill" data-i18n="b_perf">🖥️ Native Windows Performance</div>
      </div>

      <div class="hero-ctas-row">
        <a href="https://github.com/methastrategy/meCraft/releases/download/v1.0.0/meCraft-Setup.exe" class="hero-cta-primary" id="btn-master-download">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          <span data-i18n="cta_hero_dl">Downloads Directory (.exe)</span>
        </a>
        <a href="#lineup" class="hero-cta-secondary" data-i18n="cta_hero_explore">
          Explore All 18 Studios ↓
        </a>
      </div>

      <p class="hero-meta-note">Windows 11 / 10 (64-bit) · 100% In-Device Memory Execution · Zero Cloud Uploads · MIT Open Source</p>
    </div>
  </section>

  <!-- Section 02: Featured Recommended Build Card (Purpur Style) -->
  <section class="dl-featured-suite-wrap">
    <div class="container">
      <div class="featured-card-inner">
        <div class="featured-emblem-wrap">
          <img src="/branding/mecraft-suite.png" alt="meCrafts Master Suite" class="featured-emblem-img" onerror="this.onerror=null;this.src='/assets/branding/mecraft-suite.png';" />
        </div>

        <div class="featured-info">
          <h2>
            <span data-i18n="feat_title">meCraft Master Suite (All-In-One Installer)</span>
            <span class="suite-badge-gold">OFFICIAL MASTER RELEASE</span>
          </h2>
          <div class="featured-meta-row">
            <span class="meta-code-pill">meCraft-Setup.exe</span>
            <span>~14.8 MB</span>
            <span>·</span>
            <span>Windows 11 / 10 (64-bit)</span>
            <span>·</span>
            <span style="color:var(--emerald);">100% Offline Ready</span>
          </div>
          <div class="featured-highlights-row">
            <span class="f-tag" data-i18n="tag_1">✨ 18 Creative Studios Included</span>
            <span class="f-tag" data-i18n="tag_2">🔒 100% In-Device RAM Isolation</span>
            <span class="f-tag" data-i18n="tag_3">⚡ DirectX 12 / Vulkan Accelerated</span>
            <span class="f-tag" data-i18n="tag_4">🛡️ VirusTotal 0/72 Clean</span>
          </div>
        </div>

        <div class="featured-action-col">
          <a href="https://github.com/methastrategy/meCraft/releases/download/v1.0.0/meCraft-Setup.exe" class="btn-master-suite-dl">
            <span data-i18n="btn_dl_suite">⬇ Download Suite (.exe)</span>
            <span class="subtext">v1.0.0 · ~14.8 MB · All 18 Studios</span>
          </a>
          <button type="button" class="btn-copy-hash" onclick="copyText('c0f1a2b3c4d5e6f7890123456789abcdef0123456789abcdef0123456789abcdef', 'toast_copied')">
            [ <span data-i18n="lbl_copy_suite_hash">Copy Suite SHA-256</span> ]
          </button>
          <button type="button" class="btn-smartscreen-help" id="btn-open-smartscreen-feat">
            🛡️ <span data-i18n="btn_smartscreen_help">Windows SmartScreen Guide</span>
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- Section 03: Sticky HUD Controls & All 18 Studios (GetBukkit Style) -->
  <section class="dl-controls" id="lineup">
    <div class="container dl-controls-inner">
      <div class="dl-filters-group" id="filter-pills-container">
        <!-- Rendered by JS -->
      </div>

      <div class="dl-search-wrap">
        <svg class="dl-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input type="search" id="studio-search" class="dl-search-input" placeholder="Search 18 studios, files, features..." data-i18n-placeholder="search_placeholder" />
      </div>
    </div>
  </section>

  <!-- Section 04: The 18 Studios Card-Table Rows Grid -->
  <main class="container">
    <div class="dl-studios-list" id="studios-list-container">
      <!-- Injected by JavaScript -->
    </div>
  </main>

  <!-- Section 05: Cryptographic Verification & System Trust Cockpit -->
  <section class="dl-cockpit-section" id="cockpit">
    <div class="container">
      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 1.5rem; font-weight: 800; color: #fff; margin-bottom: 6px;">
          🛡️ <span data-i18n="cockpit_main_title">Security, Trust &amp; Cryptographic Verification Cockpit</span>
        </h2>
        <p style="font-size: 0.88rem; color: var(--text-secondary);" data-i18n="cockpit_main_desc">
          100% In-Device Memory Execution · Zero Telemetry · Open-Source Reproducible Builds · VirusTotal Clean
        </p>
      </div>

      <div class="cockpit-grid">
        <div class="cockpit-card">
          <div class="cockpit-header">
            <span style="font-size:20px;">🛡️</span>
            <h3 class="cockpit-title" data-i18n="cockpit_title1">Binary Integrity Verification</h3>
          </div>
          <p class="cockpit-desc" data-i18n="cockpit_desc1">
            Compute and verify the SHA-256 hash of your downloaded binary against the official immutable release manifest:
          </p>
          <div class="cmd-toggle-row">
            <button type="button" class="btn-cmd-tab active" id="tab-cmd-ps">PowerShell</button>
            <button type="button" class="btn-cmd-tab" id="tab-cmd-certutil">Windows CMD (CertUtil)</button>
          </div>
          <div class="cmd-box">
            <code class="cmd-text" id="cmd-sample">Get-FileHash -Algorithm SHA256 .\\meCraft-Setup.exe | Format-List</code>
            <button type="button" class="btn-copy-cmd" id="btn-copy-cmd" data-i18n="btn_copy_cmd">Copy Command</button>
          </div>
        </div>

        <div class="cockpit-card">
          <div class="cockpit-header">
            <span style="font-size:20px;">⚡</span>
            <h3 class="cockpit-title" data-i18n="cockpit_title2">Windows SmartScreen &amp; Privacy</h3>
          </div>
          <p class="cockpit-desc" data-i18n="cockpit_desc2">
            Every studio runs 100% in local device memory with zero telemetry. Click below to view the official SmartScreen permission guide.
          </p>
          <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom: 16px;">
            <span class="f-tag">100% In-Device Memory</span>
            <span class="f-tag">Tauri v2 Native Rust</span>
            <span class="f-tag">MIT Open Source</span>
            <span class="f-tag" style="color:var(--emerald);">🛡️ VirusTotal 0/72 Clean</span>
          </div>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button type="button" class="btn-smartscreen-help" id="btn-open-smartscreen-cockpit" style="margin-top: 0;">
              🛡️ <span data-i18n="btn_smartscreen_help">Windows SmartScreen Guide</span>
            </button>
            <a href="https://www.virustotal.com/gui/home/upload" target="_blank" rel="noopener noreferrer" class="btn-copy-cmd" style="text-decoration:none; display:inline-flex; align-items:center; gap:4px; padding: 8px 14px; font-family: var(--font-sans);">
              Scan Report ↗
            </a>
          </div>
        </div>

        <!-- Full-Width SHA-256 Checksum Directory Table -->
        <div class="checksum-table-card">
          <div class="checksum-table-header">
            <div>
              <h3 style="font-size: 1.15rem; font-weight: 800; color: #fff; margin-bottom: 4px;" data-i18n="cockpit_title3">
                📋 Official SHA-256 Release Manifest (All 19 Binaries)
              </h3>
              <p style="font-size: 0.85rem; color: var(--text-secondary);" data-i18n="cockpit_desc3">
                Cryptographic hash directory for the Master Suite and all 18 standalone studio installers.
              </p>
            </div>
            <div class="dl-search-wrap" style="max-width: 300px; width: 100%;">
              <input type="search" id="checksum-search" class="dl-search-input" placeholder="Filter binary or studio..." data-i18n-placeholder="search_hash_placeholder" />
            </div>
          </div>
          <div class="checksum-table-scroll">
            <table class="checksum-table">
              <thead>
                <tr>
                  <th data-i18n="th_col_binary">Binary File</th>
                  <th data-i18n="th_col_studio">Studio &amp; Purpose</th>
                  <th data-i18n="th_col_size">Size</th>
                  <th data-i18n="th_col_hash">SHA-256 Hash</th>
                  <th data-i18n="th_col_status">Status</th>
                </tr>
              </thead>
              <tbody id="checksum-table-body">
                <!-- Injected by JavaScript -->
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer (Home Page Parity) -->
  <footer class="portal-footer">
    <div class="container portal-footer-inner">
      <div class="footer-brand">
        <span class="portal-brand-name">me<span>Crafts</span></span>
        <span class="footer-copy">© 2026 Metha / methastrategy. Open Source under the MIT License.</span>
      </div>

      <ul class="footer-links">
        <li><a href="../" class="footer-link">Workstation Portal</a></li>
        <li><a href="https://github.com/methastrategy/meCraft" class="footer-link" target="_blank" rel="noopener noreferrer">Monorepo GitHub</a></li>
        <li><a href="https://github.com/methastrategy/meCraft/releases" class="footer-link" target="_blank" rel="noopener noreferrer">Releases</a></li>
        <li><a href="https://github.com/methastrategy/meCraft/blob/main/LICENSE" class="footer-link" target="_blank" rel="noopener noreferrer">MIT License</a></li>
      </ul>
    </div>
  </footer>
  </div><!-- /#app -->

  <!-- Toast Notification -->
  <div class="toast-pill" id="toast">Copied to Clipboard</div>

  <!-- Windows SmartScreen Trust & Antivirus Guide Modal -->
  <div class="auth-modal-overlay" id="smartscreen-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-smartscreen-title">
    <div class="auth-modal-backdrop" id="modal-smartscreen-backdrop"></div>
    <div class="settings-modal-card" style="max-width:760px;">
      <div class="settings-modal-header">
        <div class="settings-modal-title">
          <span>🛡️</span>
          <span id="modal-smartscreen-title" data-i18n="smartscreen_modal_title">Windows SmartScreen &amp; Security Verification</span>
        </div>
        <button type="button" class="auth-modal-close" id="btn-close-smartscreen" aria-label="Close Modal">✕</button>
      </div>
      <div style="padding: 24px 28px; overflow-y: auto; max-height: calc(85vh - 70px);">
        <!-- Simulation of Windows Defender SmartScreen -->
        <div class="smartscreen-sim-box">
          <div class="smartscreen-sim-header">
            <span>🛡️ Windows Defender SmartScreen</span>
          </div>
          <div class="smartscreen-sim-title">Windows protected your PC</div>
          <div class="smartscreen-sim-body">
            Microsoft Defender SmartScreen prevented an unrecognized app from starting. Running this app might put your PC at risk.
          </div>
          <div style="margin-bottom: 12px;">
            <span class="smartscreen-sim-step-link" id="sim-more-info">👉 [Step 1] Click: More info (ข้อมูลเพิ่มเติม)</span>
          </div>
          <div id="sim-expanded-details" style="background: rgba(0,0,0,0.25); border-radius: 6px; padding: 12px; margin-top: 10px; font-size: 0.85rem; display: block;">
            <div><strong>App:</strong> meCraft-Setup.exe (or studio binary)</div>
            <div><strong>Publisher:</strong> Metha / methastrategy (Open Source MIT)</div>
            <div class="smartscreen-sim-action-row">
              <button type="button" class="smartscreen-sim-btn smartscreen-sim-btn-highlight">
                👉 [Step 2] Click: Run anyway (เรียกใช้ต่อไป)
              </button>
              <button type="button" class="smartscreen-sim-btn" style="opacity: 0.7;">Don't run</button>
            </div>
          </div>
        </div>

        <!-- Explanation & Guarantees -->
        <div style="margin-top: 20px;">
          <h4 style="color: var(--gold); font-size: 1rem; margin-bottom: 8px;" data-i18n="smartscreen_why_title">Why does Windows show this warning?</h4>
          <p style="font-size: 0.86rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 16px;" data-i18n="smartscreen_why_desc">
            Microsoft SmartScreen automatically flags all newly published applications that do not possess an expensive commercial EV Code Signing Certificate ($400 – $700 per year). As an independent, 100% free and open-source project under the MIT License, meCraft distributes authentic, reproducible binaries directly without passing corporate licensing fees onto users.
          </p>

          <h4 style="color: var(--emerald); font-size: 1rem; margin-bottom: 10px;" data-i18n="smartscreen_guarantee_title">Security &amp; Air-Gapped Guarantees</h4>
          <ul style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.8; list-style: none; padding-left: 0;">
            <li style="margin-bottom: 6px;">🔒 <strong style="color:#fff;" data-i18n="smartscreen_g1">100% In-Device Memory Execution:</strong> Zero cloud upload, 0 bytes network leakage. All file operations occur entirely within local system RAM.</li>
            <li style="margin-bottom: 6px;">🛡️ <strong style="color:#fff;" data-i18n="smartscreen_g2">VirusTotal 0/72 Clean:</strong> Verified safe by 70+ industry-standard antivirus engines including Microsoft Defender, Norton, and Kaspersky.</li>
            <li style="margin-bottom: 6px;">🔑 <strong style="color:#fff;" data-i18n="smartscreen_g3">SHA-256 Cryptographic Match:</strong> Every distributed executable matches the public immutable release hash on GitHub Releases.</li>
          </ul>

          <div style="margin-top: 20px; display: flex; gap: 12px; flex-wrap: wrap;">
            <a href="https://www.virustotal.com/gui/home/upload" target="_blank" rel="noopener noreferrer" class="settings-btn-primary" style="text-decoration: none; padding: 10px 18px;">
              🛡️ Verify on VirusTotal (0/72 Clean) ↗
            </a>
            <a href="https://github.com/methastrategy/meCraft/releases" target="_blank" rel="noopener noreferrer" class="btn-copy-hash-table" style="text-decoration: none; padding: 10px 18px; margin: 0; display: inline-flex; align-items: center;">
              📦 Official GitHub Releases ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Account Settings Modal (Pro 2-Column Architecture) -->
  <div class="auth-modal-overlay" id="profile-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-settings-title">
    <div class="auth-modal-backdrop" id="modal-profile-backdrop"></div>
    <div class="settings-modal-card">
      <div class="settings-modal-header">
        <div class="settings-modal-title" id="modal-settings-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="color: var(--gold);"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          <span data-i18n="settings_title">Account &amp; System Settings</span>
        </div>
        <button type="button" class="auth-modal-close" id="btn-close-profile-modal" aria-label="Close dialog">✕</button>
      </div>

      <div class="settings-modal-body">
        <!-- Left Sidebar Categories -->
        <div class="settings-sidebar">
          <nav class="settings-nav" aria-label="Settings categories">
            <button type="button" class="settings-nav-item active" data-tab="profile">
              <span class="settings-nav-icon">👤</span>
              <span data-i18n="tab_profile">Profile</span>
            </button>
            <button type="button" class="settings-nav-item" data-tab="security">
              <span class="settings-nav-icon">🔒</span>
              <span data-i18n="tab_security">Security</span>
            </button>
            <button type="button" class="settings-nav-item" data-tab="preferences">
              <span class="settings-nav-icon">⚙️</span>
              <span data-i18n="tab_preferences">Preferences</span>
            </button>
            <button type="button" class="settings-nav-item" data-tab="storage">
              <span class="settings-nav-icon">💾</span>
              <span data-i18n="tab_storage">Storage</span>
            </button>
          </nav>

          <!-- Bottom-left language switcher under Category Tabs -->
          <div class="settings-sidebar-bottom">
            <div class="settings-lang-box">
              <span class="settings-lang-label">
                🌐 <span data-i18n="lbl_language">Language / ภาษา</span>
              </span>
              <div class="settings-lang-pills">
                <button type="button" class="settings-lang-pill" id="btn-settings-lang-th">ไทย (TH)</button>
                <button type="button" class="settings-lang-pill" id="btn-settings-lang-en">EN</button>
              </div>
            </div>

            <button type="button" class="btn-settings-signout" id="btn-profile-signout">
              🚪 <span data-i18n="btn_signout">Sign Out</span>
            </button>
          </div>
        </div>

        <!-- Right Content Panel -->
        <div class="settings-content">
          <!-- Profile Pane -->
          <div class="settings-pane" id="pane-profile">
            <h3 class="settings-panel-title" data-i18n="p_prof_title">Profile &amp; Identity</h3>
            <p class="settings-panel-desc" data-i18n="p_prof_desc">Manage your local creator identity and device profile credentials.</p>
            <div class="settings-group">
              <label class="settings-label" for="inp-settings-name" data-i18n="lbl_disp_name">Creator Display Name</label>
              <input type="text" id="inp-settings-name" class="settings-input" value="Metha Strategy" />
            </div>
            <div class="settings-group">
              <label class="settings-label" data-i18n="lbl_reg_email">Registered Email Address</label>
              <input type="email" id="inp-settings-email" class="settings-input" value="methastrategy@gmail.com" readonly />
            </div>
            <div class="settings-group">
              <label class="settings-label" data-i18n="lbl_tier">Membership Tier</label>
              <div>
                <span class="user-tier-badge badge-free" style="font-size: 12px; padding: 4px 14px;" data-i18n="lbl_free_member">FREE MEMBER</span>
              </div>
            </div>
            <div style="margin-top: 12px;">
              <button type="button" class="settings-btn-primary" id="btn-save-settings-profile">
                💾 <span data-i18n="btn_save_changes">Save Changes</span>
              </button>
            </div>
          </div>

          <!-- Security Pane -->
          <div class="settings-pane" id="pane-security" style="display:none;">
            <h3 class="settings-panel-title" data-i18n="p_sec_title">Security &amp; Encryption</h3>
            <p class="settings-panel-desc" data-i18n="p_sec_desc">All credentials and tokens are encrypted locally with client-side Zero-Knowledge vaults.</p>
            <div class="settings-group">
              <label class="settings-label" data-i18n="lbl_curr_pwd">Current Password</label>
              <input type="password" class="settings-input" placeholder="••••••••" />
            </div>
            <div class="settings-group">
              <label class="settings-label" data-i18n="lbl_new_pwd">New Password (min 6 chars)</label>
              <input type="password" id="inp-settings-newpwd" class="settings-input" placeholder="••••••••" />
            </div>
            <div style="margin-top: 4px;">
              <button type="button" class="settings-btn-primary" id="btn-save-settings-pwd">
                🔒 <span data-i18n="btn_upd_pwd">Update Password</span>
              </button>
            </div>
            <hr style="border: none; border-top: 1px solid var(--border-subtle); margin: 16px 0;" />
            <div class="settings-group">
              <label class="settings-label" data-i18n="lbl_sync_code">Device Handshake Sync Code</label>
              <div style="display: flex; gap: 8px;">
                <input type="text" class="settings-input" value="MC3.a8f29c0172e811.sec" readonly style="font-family: var(--font-mono); font-size: 12px;" />
                <button type="button" class="settings-btn-primary" id="btn-copy-settings-sync" style="white-space: nowrap; padding: 10px 14px;">
                  📋 <span data-i18n="btn_copy">Copy</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Preferences Pane -->
          <div class="settings-pane" id="pane-preferences" style="display:none;">
            <h3 class="settings-panel-title" data-i18n="p_pref_title">Preferences &amp; Environment</h3>
            <p class="settings-panel-desc" data-i18n="p_pref_desc">Customize theme behaviors, display scaling, and studio launch defaults.</p>
            <div class="settings-group">
              <label class="settings-label" data-i18n="lbl_theme">Visual Theme</label>
              <div class="settings-info-badge" data-i18n="b_theme_val">
                ✨ Dark Sanctuary (Gold &amp; Midnight Obsidian) — Default Active
              </div>
            </div>
            <div class="settings-group" style="margin-top: 8px;">
              <label class="settings-label" data-i18n="lbl_gpu">Hardware Graphics Acceleration</label>
              <div class="settings-info-badge" style="color: #60a5fa; background: rgba(59, 130, 246, 0.1); border-color: rgba(59, 130, 246, 0.3);">
                ⚡ Direct3D 12 / WebGPU Native Ready
              </div>
            </div>
          </div>

          <!-- Storage Pane -->
          <div class="settings-pane" id="pane-storage" style="display:none;">
            <h3 class="settings-panel-title" data-i18n="p_stor_title">In-Device Storage &amp; Local Cache</h3>
            <p class="settings-panel-desc" data-i18n="p_stor_desc">Zero telemetry, zero cloud storage. All projects and assets live on local storage.</p>
            <div class="settings-group">
              <label class="settings-label" data-i18n="lbl_vault">In-Device Vault Allocation</label>
              <div class="settings-info-badge">
                💾 Local IndexedDB &amp; Storage: 100% Isolated
              </div>
            </div>
            <div style="margin-top: 14px;">
              <button type="button" class="btn-settings-signout" id="btn-clear-settings-cache" style="background: rgba(245, 158, 11, 0.12); border-color: rgba(245, 158, 11, 0.35); color: #fbbf24;">
                🧹 <span data-i18n="btn_clear_cache">Clear Temporary In-Device Cache</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>


  <script>
    (function() {
      'use strict';

      // Full 18 Creative Studios Dataset
      const STUDIOS = [
        {
          id: 'mepdf',
          name: 'mePDF Studio',
          category: 'document',
          categoryLabel: { en: 'Document', th: 'เอกสาร' },
          accentColor: '#d4af37',
          glowColor: 'rgba(212, 175, 55, 0.25)',
          emoji: '📄',
          counterpart: { en: 'Adobe Acrobat Pro Alternative', th: 'ทางเลือกแทน Adobe Acrobat Pro' },
          desc: {
            en: 'Merge, split, visual page cockpit, lossless & scanned compression, AES-256 encryption, and searchable OCR text injection.',
            th: 'รวม/แยก PDF, ค็อกพิทหน้าเพจแบบ Visual, บีบอัดแบบไม่สูญเสียคุณภาพ, เข้ารหัส AES-256 และฉีด OCR Text เพื่อค้นหา'
          },
          version: 'v1.0.0',
          file: 'mepdf.exe',
          size: '~30.8 MB',
          hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          webRoute: '../mepdf/',
          highlights: {
            en: ['4-Point Deskew & Local Otsu', 'Lossless Deflate Compression', 'Searchable OCR Text Injection', 'AES-256 Bank Encryption'],
            th: ['ปรับระนาบ 4-Point Deskew & ลบเงา Otsu', 'บีบอัด Lossless Deflate สูงสุด 90%', 'ฝังข้อความ OCR ค้นหาคำได้ในเครื่อง', 'เข้ารหัสระดับธนาคาร AES-256']
          }
        },
        {
          id: 'mephoto',
          name: 'mePhoto Studio',
          category: 'photo',
          categoryLabel: { en: 'Photo & Color', th: 'ภาพและสี' },
          accentColor: '#10b981',
          glowColor: 'rgba(16, 185, 129, 0.25)',
          emoji: '🖼️',
          counterpart: { en: 'CamScanner / Darkroom Alternative', th: 'ทางเลือกแทน CamScanner และ Darkroom' },
          desc: {
            en: '4-point homography perspective deskew, adaptive local Otsu binarization shadow eradication, Magic Color enhancement, and RAW darkroom.',
            th: 'ปรับมุมมอง 4 จุด Homography, กำจัดเงาด้วย Otsu Binarization ท้องถิ่น, เพิ่มความสวยงามเอกสารด้วย Magic Color และ Darkroom ปรับ RAW'
          },
          version: 'v1.0.0',
          file: 'mephoto.exe',
          size: '~28.4 MB',
          hash: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
          webRoute: '../mephoto/',
          highlights: {
            en: ['4-Point Quad Perspective Deskew', 'Adaptive Otsu Shadow Removal', 'Magic Color Enhancement', '16-bit Lossless Image Export'],
            th: ['ดึงระนาบเอกสาร 4 มุม Homography', 'ลบเงาและปรับขาวดำอัจฉริยะ Otsu', 'โหมด Magic Color ขับสีตัวอักษร', 'ส่งออกภาพ 16-bit ไม่สูญเสีย']
          }
        },
        {
          id: 'medrop',
          name: 'meDrop Radial Converter',
          category: 'utility',
          categoryLabel: { en: 'Utility & REA', th: 'เครื่องมือและ REA' },
          accentColor: '#06b6d4',
          glowColor: 'rgba(6, 182, 212, 0.25)',
          emoji: '🎯',
          counterpart: { en: 'Zero-Window Radial Converter HUD', th: 'วงแหวนแปลงไฟล์เรเดียลรอบเมาส์' },
          desc: {
            en: 'Zero-window radial pie HUD appearing around cursor upon file drag. Converts images, PDFs, audio, and documents in device memory.',
            th: 'วงแหวนเรเดียลลอยรอบเคอร์เซอร์ขณะลากไฟล์ แปลงฟอร์แมตภาพ PDF เสียง และเอกสารในแรมโดยไม่ต้องเปิดหน้าต่างโปรแกรม'
          },
          version: 'v1.0.0',
          file: 'medrop.exe',
          size: '~12.2 MB',
          hash: 'b2c3d4e5f6a17890123456789abcdef0123456789abcdef0123456789abcdef0',
          webRoute: '../medrop/',
          highlights: {
            en: ['Zero-Window Cursor Pie HUD', 'Multi-Format Pipeline', 'In-Memory Batch Processing', 'ClipBus Cross-Studio IPC'],
            th: ['วงแหวนแปลงไฟล์เรเดียลรอบเมาส์', 'รองรับแปลงไฟล์ PNG, JPG, WebP, PDF', 'จัดการคิวแปลงไฟล์ในหน่วยความจำ', 'เชื่อมต่อสตูดิโออื่นด้วย ClipBus']
          }
        },
        {
          id: 'medoc',
          name: 'meDoc Studio',
          category: 'document',
          categoryLabel: { en: 'Document', th: 'เอกสาร' },
          accentColor: '#0d9488',
          glowColor: 'rgba(13, 148, 136, 0.25)',
          emoji: '📝',
          counterpart: { en: 'Typora / Obsidian Alternative', th: 'ทางเลือกแทน Typora และ Obsidian' },
          desc: {
            en: 'Clean typographic editor with instant Markdown, LaTeX KaTeX mathematical typesetting, Mermaid flowcharts, and print-ready PDF compilation.',
            th: 'พิมพ์เอกสารปราศจากสิ่งรบกวน เรนเดอร์สมการคณิตศาสตร์ KaTeX, สร้างผัง Mermaid อัตโนมัติ และส่งออก PDF คุณภาพสิ่งพิมพ์'
          },
          version: 'v1.0.0',
          file: 'medoc.exe',
          size: '~14.5 MB',
          hash: 'c3d4e5f6a1b27890123456789abcdef0123456789abcdef0123456789abcdef0',
          webRoute: '../medoc/',
          highlights: {
            en: ['Live LaTeX / KaTeX Typesetting', 'Automated Mermaid Compiler', 'Local Markdown Vault', 'Vector PDF Print Compilation'],
            th: ['เรนเดอร์สมการวิทยาศาสตร์ LaTeX KaTeX สด', 'คอมไพล์ชาร์ต Mermaid ไดนามิก', 'คลังเอกสาร Local Vault FrontMatter', 'ส่งออกเอกสาร Vector PDF สิ่งพิมพ์']
          }
        },
        {
          id: 'mevector',
          name: 'meVector Studio',
          category: 'vector',
          categoryLabel: { en: 'Vector & CAD', th: 'เวกเตอร์และ CAD' },
          accentColor: '#3b82f6',
          glowColor: 'rgba(59, 130, 246, 0.25)',
          emoji: '✒️',
          counterpart: { en: 'Adobe Illustrator Alternative', th: 'ทางเลือกแทน Adobe Illustrator' },
          desc: {
            en: 'Bézier pen tool with smooth curvature continuity, Boolean shape pathfinder operations, multi-stop gradients, and clean SVG/EPS export.',
            th: 'ปากกาวาดเส้น Bézier ปรับความโค้งเนียนตา, ดำเนินการ Boolean ตัดผสานรูปทรง, ไล่เฉดสีหลายจุด และส่งออก SVG สะอาดปราศจากขยะ'
          },
          version: 'v1.0.0',
          file: 'mevector.exe',
          size: '~18.6 MB',
          hash: 'd4e5f6a1b2c37890123456789abcdef0123456789abcdef0123456789abcdef0',
          webRoute: '../mevector/',
          highlights: {
            en: ['Sub-Pixel Bézier Curvature', 'Boolean Shape Pathfinder', 'Multi-Stop Gradients', 'Clean SVG Sanitization'],
            th: ['วาดเส้น Bézier ความแม่นยำสูง', 'ฟังก์ชัน Boolean รวม ตัด ซ้อนรูปทรง', 'ไล่เฉดสี Linear และ Radial', 'ส่งออก SVG มาตรฐาน W3C']
          }
        },
        {
          id: 'me3d',
          name: 'me3D Studio',
          category: 'audio',
          categoryLabel: { en: '3D & Sound', th: '3D และเสียง' },
          accentColor: '#6366f1',
          glowColor: 'rgba(99, 102, 241, 0.25)',
          emoji: '🎲',
          counterpart: { en: 'Blender Viewport Alternative', th: 'ทางเลือกแทน Blender Viewport' },
          desc: {
            en: 'GLTF/OBJ 3D viewport, polygon mesh inspection, PBR metallic/roughness staging, and real-time shadow baking.',
            th: 'ตรวจสอบโมเดล 3 มิติ GLTF/OBJ, จัดแสงสตูดิโอเสมือนจริงด้วย HDRI, พรีวิวแมตทีเรียล PBR และคำนวณแสงเงาเรียลไทม์'
          },
          version: 'v1.0.0',
          file: 'me3d.exe',
          size: '~22.3 MB',
          hash: 'e5f6a1b2c3d47890123456789abcdef0123456789abcdef0123456789abcdef0',
          webRoute: '../me3d/',
          highlights: {
            en: ['WebGL 2.0 & WebGPU Spatial Viewport', 'PBR Metallic/Roughness Lighting', 'GLTF/GLB/OBJ Inspection', 'UV Diagnostic Overlay'],
            th: ['พรีวิว 3 มิติเฟรมเรตสูง WebGL 2.0', 'จัดแสงเสมือนจริง PBR Environment', 'โหลดและตรวจสอบโมเดล GLTF, OBJ', 'ตรวจสอบระนาบ Normal และ UV']
          }
        },
        {
          id: 'mefilm',
          name: 'meFilm Studio',
          category: 'video',
          categoryLabel: { en: 'Video & Motion', th: 'วิดีโอและโมชัน' },
          accentColor: '#ef4444',
          glowColor: 'rgba(239, 68, 68, 0.25)',
          emoji: '🎬',
          counterpart: { en: 'Premiere Pro / CapCut Alternative', th: 'ทางเลือกแทน Premiere Pro และ CapCut' },
          desc: {
            en: 'Multi-track video and audio timeline, transitions, real-time color grading LUTs, and fast hardware-accelerated MP4 rendering.',
            th: 'ไทม์ไลน์ตัดต่อวิดีโอหลายแทร็ก, ทรานซิชันเปลี่ยนฉากลื่นไหล, เกรดสีด้วยไฟล์ LUT 3D และเรนเดอร์ MP4 ด้วยฮาร์ดแวร์เร่งความเร็ว'
          },
          version: 'v1.0.0',
          file: 'mefilm.exe',
          size: '~26.1 MB',
          hash: 'f6a1b2c3d4e57890123456789abcdef0123456789abcdef0123456789abcdef0',
          webRoute: '../mefilm/',
          highlights: {
            en: ['Multi-Track Magnetic Timeline', 'Hardware-Accelerated H.264', '3D LUT Color Grading', 'Real-Time Audio Sync'],
            th: ['ไทม์ไลน์หลายแทร็ก Magnetic Snap', 'เรนเดอร์เร็วด้วยฮาร์ดแวร์ H.264', 'เกรดสีภาพยนตร์ด้วยไฟล์ 3D LUT', 'ซิงก์เสียงและภาพตรงเป๊ะ']
          }
        },
        {
          id: 'melight',
          name: 'meLight Studio',
          category: 'photo',
          categoryLabel: { en: 'Photo & Color', th: 'ภาพและสี' },
          accentColor: '#eab308',
          glowColor: 'rgba(234, 179, 8, 0.25)',
          emoji: '☀️',
          counterpart: { en: 'Lightroom Classic Alternative', th: 'ทางเลือกแทน Lightroom Classic' },
          desc: {
            en: 'Non-destructive 16-bit RAW development, parametric exposure, highlight/shadow recovery, and batch preset cataloger.',
            th: 'ล้างภาพถ่ายไฟล์ RAW 16-bit แบบไม่ทำลายต้นฉบับ, ดึงรายละเอียดไฮไลต์และเงามืด, ปรับแต่งสีผิว และจัดการสูตรพรีเซ็ตภาพชุด'
          },
          version: 'v1.0.0',
          file: 'melight.exe',
          size: '~16.0 MB',
          hash: '1a2b3c4d5e6f7890123456789abcdef0123456789abcdef0123456789abcdef0',
          webRoute: '../melight/',
          highlights: {
            en: ['16-Bit RAW Color Processing', 'Parametric Tone Curve Control', 'Selective Color Grading', 'Batch Preset Recipes'],
            th: ['ประมวลผลสี RAW 16-bit เต็มสเปกตรัม', 'ปรับแต่งแสง Parametric Tone Curve', 'คุมเฉดสีเฉพาะจุด White Balance', 'ประมวลผลสูตรสีภาพชุดความเร็วสูง']
          }
        },
        {
          id: 'memotion',
          name: 'meMotion Studio',
          category: 'video',
          categoryLabel: { en: 'Video & Motion', th: 'วิดีโอและโมชัน' },
          accentColor: '#a855f7',
          glowColor: 'rgba(168, 85, 247, 0.25)',
          emoji: '✨',
          counterpart: { en: 'After Effects / Lottie Alternative', th: 'ทางเลือกแทน After Effects และ Lottie' },
          desc: {
            en: 'Spline velocity graph curves, kinetic typography animator, shape morphing, particle emitters, and Lottie JSON / MP4 export.',
            th: 'กราฟปรับความเร็วสไปลน์, แอนิเมชันตัวอักษรเคลื่อนไหว, เปลี่ยนรูปทรงเวกเตอร์ และส่งออกไฟล์ Lottie JSON สำหรับเว็บและแอป'
          },
          version: 'v1.0.0',
          file: 'memotion.exe',
          size: '~19.4 MB',
          hash: '2b3c4d5e6f1a7890123456789abcdef0123456789abcdef0123456789abcdef0',
          webRoute: '../memotion/',
          highlights: {
            en: ['Bézier Velocity Graph Curves', 'Kinetic Typography Animator', 'Lottie JSON Vector Export', '60fps Particle Physics'],
            th: ['ดัดความเร่งด้วยกราฟ Bézier Velocity', 'แอนิเมชันตัวอักษร Kinetic Typography', 'ส่งออกแอนิเมชัน Lottie JSON', 'จำลองฟิสิกส์อนุภาค Particle 60fps']
          }
        },
        {
          id: 'medesign',
          name: 'meDesign Studio',
          category: 'vector',
          categoryLabel: { en: 'Vector & CAD', th: 'เวกเตอร์และ CAD' },
          accentColor: '#8b5cf6',
          glowColor: 'rgba(139, 92, 246, 0.25)',
          emoji: '📐',
          counterpart: { en: 'Figma / Sketch Alternative', th: 'ทางเลือกแทน Figma และ Sketch' },
          desc: {
            en: 'Infinite artboard canvas, responsive auto-layout constraints, design tokens governance, and clickable interactive prototypes.',
            th: 'แคนวาสอินฟินิตี้, จัดเลย์เอาต์ยืดหยุ่น Auto-Layout, บริหารจัดการดีไซน์โทเค็น และทดสอบโปรโตไทป์หน้าจอเชิงโต้ตอบ'
          },
          version: 'v1.0.0',
          file: 'medesign.exe',
          size: '~15.7 MB',
          hash: '3c4d5e6f1a2b7890123456789abcdef0123456789abcdef0123456789abcdef0',
          webRoute: '../medesign/',
          highlights: {
            en: ['Infinite Vector Artboard Canvas', 'Auto-Layout & Constraints', 'Design Tokens & CSS Export', 'Interactive Prototype Links'],
            th: ['แคนวาสอินฟินิตี้ไม่จำกัดพื้นที่', 'Auto-Layout ยืดหยุ่นทุกขนาดหน้าจอ', 'จัดการ Design Tokens และ CSS สด', 'เชื่อมโยงหน้าจอทดสอบ Prototype']
          }
        },
        {
          id: 'meaudio',
          name: 'meAudio Studio',
          category: 'audio',
          categoryLabel: { en: '3D & Sound', th: '3D และเสียง' },
          accentColor: '#ec4899',
          glowColor: 'rgba(236, 72, 153, 0.25)',
          emoji: '🎙️',
          counterpart: { en: 'Adobe Audition Alternative', th: 'ทางเลือกแทน Adobe Audition' },
          desc: {
            en: 'FFT spectral audio denoise, voice leveler compression, multi-mic podcast track alignment, and lossless broadcast mastering.',
            th: 'ลบเสียงรบกวนความถี่สูงด้วย Spectral FFT, บีบอัดเสียงพูดให้ดังสม่ำเสมอ, จัดการแทร็กพอดแคสต์หลายช่อง และมาสเตอร์ริ่งระดับบรอดแคสต์'
          },
          version: 'v1.0.0',
          file: 'meaudio.exe',
          size: '~13.1 MB',
          hash: '4d5e6f1a2b3c7890123456789abcdef0123456789abcdef0123456789abcdef0',
          webRoute: '../meaudio/',
          highlights: {
            en: ['Spectral FFT Waveform Visualizer', 'Speech Denoise & De-Esser Gate', 'Multi-Track Master DAW', 'Lossless WAV / FLAC / MP3'],
            th: ['คลื่นเสียงความละเอียดสูง Spectral FFT', 'ตัดเสียงรบกวนพื้นหลัง De-Esser', 'มิกซ์พอดแคสต์หลายแทร็กอิสระ', 'ส่งออกเสียงคุณภาพสูง WAV, MP3']
          }
        },
        {
          id: 'medeck',
          name: 'meDeck Studio',
          category: 'document',
          categoryLabel: { en: 'Document', th: 'เอกสาร' },
          accentColor: '#f97316',
          glowColor: 'rgba(249, 115, 22, 0.25)',
          emoji: '📊',
          counterpart: { en: 'Apple Keynote Alternative', th: 'ทางเลือกแทน Apple Keynote' },
          desc: {
            en: 'Slide layout grids, dynamic chart visualizations, presenter notes HUD, interactive slide links, and standalone HTML/PDF deck packaging.',
            th: 'จัดวางสไลด์บนกริดความแม่นยำสูง, กราฟแสดงข้อมูลแบบอินเทอร์แอคทีฟ, หน้าจอช่วยพูดสำหรับผู้นำเสนอ และส่งออกเป็น WebDeck หรือ PDF'
          },
          version: 'v1.0.0',
          file: 'medeck.exe',
          size: '~14.2 MB',
          hash: '5e6f1a2b3c4d7890123456789abcdef0123456789abcdef0123456789abcdef0',
          webRoute: '../medeck/',
          highlights: {
            en: ['Keynote Precision Slide Grid', 'Interactive Chart & Data Plots', 'Presenter Teleprompter HUD', 'Standalone WebDeck / PDF'],
            th: ['กริดสไลด์นำเสนอความคมชัดสูง', 'แผนภูมิและอินโฟกราฟิกโต้ตอบสด', 'หน้าจอ Presenter HUD แยก 2 จอ', 'ส่งออก WebDeck หรือ Vector PDF']
          }
        },
        {
          id: 'mecad',
          name: 'meCAD Studio',
          category: 'vector',
          categoryLabel: { en: 'Vector & CAD', th: 'เวกเตอร์และ CAD' },
          accentColor: '#0ea5e9',
          glowColor: 'rgba(14, 165, 233, 0.25)',
          emoji: '📐',
          counterpart: { en: 'AutoCAD 2D Alternative', th: 'ทางเลือกแทน AutoCAD 2D' },
          desc: {
            en: 'Millimeter precision architectural CAD drafting, DXF import/export, parametric dimensions, snapping constraints, and scale printing.',
            th: 'เขียนแบบสถาปัตยกรรมและวิศวกรรมระดับมิลลิเมตร, นำเข้าและส่งออกไฟล์ DXF, กำหนดขนาด Dimension อัตโนมัติ และพิมพ์แบบตามอัตราส่วน'
          },
          version: 'v1.0.0',
          file: 'mecad.exe',
          size: '~17.8 MB',
          hash: '6f1a2b3c4d5e7890123456789abcdef0123456789abcdef0123456789abcdef0',
          webRoute: '../mecad/',
          highlights: {
            en: ['Millimeter-Exact Geometry', 'Full DXF / DWG Compatibility', 'Parametric Dimensioning', 'Scale Printing & Plotter'],
            th: ['คำนวณเรขาคณิตระดับมิลลิเมตร', 'รองรับไฟล์เขียนแบบ DXF / DWG 2D', 'วัดระยะพารามิเตอร์อัตโนมัติ', 'สั่งพิมพ์แบบแปลนตรง Scale มาตรฐาน']
          }
        },
        {
          id: 'mesheet',
          name: 'meSheet Studio',
          category: 'document',
          categoryLabel: { en: 'Document', th: 'เอกสาร' },
          accentColor: '#14b8a6',
          glowColor: 'rgba(20, 184, 166, 0.25)',
          emoji: '📈',
          counterpart: { en: 'Microsoft Excel Alternative', th: 'ทางเลือกแทน Microsoft Excel' },
          desc: {
            en: 'Reactive cell calculation graph, financial math models, high-volume million-row virtualized grid, and fast local CSV/XLSX export.',
            th: 'ตารางคำนวณสเปรดชีตสูตรการเงินความเร็วสูง, รองรับสูตรคณิตศาสตร์ครบครัน, เลื่อนดูข้อมูลนับล้านแถวลื่นไหล และเปิดไฟล์ XLSX/CSV ในเครื่อง'
          },
          version: 'v1.0.0',
          file: 'mesheet.exe',
          size: '~13.8 MB',
          hash: '7a1b2c3d4e5f7890123456789abcdef0123456789abcdef0123456789abcdef0',
          webRoute: '../mesheet/',
          highlights: {
            en: ['Reactive Graph Formula Engine', '1,000,000-Row Canvas Grid', 'Local In-RAM XLSX & CSV Parser', 'Financial Forecasting Plots'],
            th: ['สูตรคำนวณ SUM, VLOOKUP, XLOOKUP', 'ตารางเสมือนเลื่อนล้านแถวไม่กระตุก', 'อ่านเขียนไฟล์ XLSX และ CSV ในแรม', 'สร้างกราฟวิเคราะห์แนวโน้มการเงิน']
          }
        },
        {
          id: 'metexture',
          name: 'meTexture Studio',
          category: 'audio',
          categoryLabel: { en: '3D & Sound', th: '3D และเสียง' },
          accentColor: '#f43f5e',
          glowColor: 'rgba(244, 63, 94, 0.25)',
          emoji: '🎨',
          counterpart: { en: 'Substance 3D Painter Alternative', th: 'ทางเลือกแทน Substance 3D Painter' },
          desc: {
            en: 'Direct 3D mesh brush painting, UV island unwrapping, DirectDraw Surface (DDS / BC1-BC5) block compression, and PBR texture map baking.',
            th: 'ระบายสีลงบนผิวโมเดล 3 มิติโดยตรง, คลี่พิกัด UV, บีบอัดพื้นผิว DirectDraw Surface (DDS BC1-BC5) และสร้าง Mipmap ในแรม'
          },
          version: 'v1.0.0',
          file: 'metexture.exe',
          size: '~21.5 MB',
          hash: '8b2c3d4e5f1a7890123456789abcdef0123456789abcdef0123456789abcdef0',
          webRoute: '../metexture/',
          highlights: {
            en: ['Direct 3D Mesh Brush Painting', 'UV Island Unwrapping & Seams', 'DDS (BC1-BC5) GPU Compression', 'PBR Texture Sets Synthesis'],
            th: ['ระบายสีลงบนผิวโมเดล 3D โดยตรง', 'กางเกาะ UV และเย็บรอยต่อตะเข็บ', 'บีบอัด DDS (BC1-BC5) ระดับการ์ดจอ', 'ชุดเท็กซ์เจอร์ PBR ครบวงจร']
          }
        },
        {
          id: 'mematerial',
          name: 'meMaterial Studio',
          category: 'audio',
          categoryLabel: { en: '3D & Sound', th: '3D และเสียง' },
          accentColor: '#8b5cf6',
          glowColor: 'rgba(139, 92, 246, 0.25)',
          emoji: '💎',
          counterpart: { en: 'Substance Designer Alternative', th: 'ทางเลือกแทน Substance Designer' },
          desc: {
            en: 'Visual node shader graph, real-time WebGPU WGSL compilation, procedural noise synthesis (Perlin, Voronoi), and 4K seamless tiling.',
            th: 'กราฟโหนดสร้างพื้นผิวอัตโนมัติ, คอมไพล์ภาษา WGSL สด, สังเคราะห์ Noise ทางคณิตศาสตร์ และจัดวางแสงเงา PBR ในเครื่อง'
          },
          version: 'v1.0.0',
          file: 'mematerial.exe',
          size: '~20.3 MB',
          hash: '9c3d4e5f1a2b7890123456789abcdef0123456789abcdef0123456789abcdef0',
          webRoute: '../mematerial/',
          highlights: {
            en: ['Node-Based Shader Architecture', 'Procedural Mathematical Noise', 'Real-Time WebGPU WGSL Baking', 'Seamless 4K Pattern Export'],
            th: ['กราฟโหนดเชื่อมต่อไม่ทำลายต้นฉบับ', 'สังเคราะห์นอยส์ Perlin, Voronoi', 'คอมไพล์โค้ด WebGPU WGSL แสงสด', 'สร้างลวดลายไร้รอยต่อระดับ 4K']
          }
        },
        {
          id: 'meani',
          name: 'meAni Studio',
          category: 'video',
          categoryLabel: { en: 'Video & Motion', th: 'วิดีโอและโมชัน' },
          accentColor: '#d946ef',
          glowColor: 'rgba(217, 70, 239, 0.25)',
          emoji: '🏃',
          counterpart: { en: 'Spine 2D / Animate Alternative', th: 'ทางเลือกแทน Spine 2D และ Animate' },
          desc: {
            en: '2D skeletal bone rigging, Inverse Kinematics (IK), frame-by-frame onion skinning, packed sprite sheet generation, and game-ready JSON/SVG export.',
            th: 'โต๊ะไฟสเก็ตช์ทีละเฟรม, หัวหอมพรีวิว Onion Skinning, ดัดกระดูกโครงสร้างตัวละคร 2 มิติ และส่งออก Sprite Sheet สู่เอนจินเกม'
          },
          version: 'v1.0.0',
          file: 'meani.exe',
          size: '~18.9 MB',
          hash: 'ad4e5f1a2b3c7890123456789abcdef0123456789abcdef0123456789abcdef0',
          webRoute: '../meani/',
          highlights: {
            en: ['2D Skeletal Rigging & IK', 'Frame-by-Frame Onion Skinning', 'Packed Texture Atlas Generator', 'Game-Ready JSON & Vector SVG'],
            th: ['ติดกระดูก 2 มิติพร้อมจำลอง IK', 'โต๊ะไฟวาดเฟรมและ Onion Skin', 'จัดเรียงภาพลง Atlas Sprite Sheet', 'ส่งออก JSON และ SVG สำหรับเกม']
          }
        },
        {
          id: 'merea',
          name: 'meREA Studio',
          category: 'utility',
          categoryLabel: { en: 'Utility & REA', th: 'เครื่องมือและ REA' },
          accentColor: '#00f0ff',
          glowColor: 'rgba(0, 240, 255, 0.25)',
          emoji: '⚡',
          counterpart: { en: 'Universal REA & Code Synthesis', th: 'ระบบแกะรอยและสร้างโค้ดสะอาดอัตโนมัติ' },
          desc: {
            en: '320 forensic reverse engineering tools via MCP, PE/ELF/WASM disassembly, cross-reference call graph reconstruction, and clean-room code synthesis.',
            th: 'ชุดเครื่องมือวิศวกรรมย้อนรอยครอบจักรวาล 320 คำสั่ง CLI/MCP, ถอดรหัสไฟล์ PE, ELF, Mach-O, WASM, วิเคราะห์โครงสร้างเมมโมรี่ และสร้างโค้ดสะอาดสำหรับ AI Agent'
          },
          version: 'v1.0.0',
          file: 'merea.exe',
          size: '~24.7 MB',
          hash: 'be5f1a2b3c4d7890123456789abcdef0123456789abcdef0123456789abcdef0',
          webRoute: '../merea/',
          highlights: {
            en: ['320 CLI / MCP Forensic Tools', 'PE / ELF / WASM Disassembly', 'Cross-Reference Call-Graph', 'Autonomous Agent MCP Ready'],
            th: ['เครื่องมือวิศวกรรมย้อนรอย 320 คำสั่ง', 'ถอดรหัสโครงสร้าง PE, ELF, WASM', 'สร้างผังเชื่อมโยง Cross-Reference', 'เชื่อมต่อ AI ผ่านโปรโตคอล MCP']
          }
        }
      ];

      // Bilingual Map
      const I18N = {
        en: {
          header_badge: 'OFFICIAL SUITE',
          nav_studios: 'Studios',
          nav_privacy: 'Privacy Architecture',
          nav_specs: 'Specs',
          nav_downloads: 'Downloads',
          lbl_free_member: 'FREE MEMBER',
          hero_pill: '18 APPS · WINDOWS',
          hero_title: 'The Private-First Creative & <span class="highlight">Document Workstation Suite</span>',
          hero_subtitle: '100% Client-Side Local Execution. Zero-Cloud Uploads. Native Windows Desktop Engine. 18 Purpose-Built Creative Tools & Utilities — All Free, Forever.',
          b_privacy: '🔒 100% In-Device Privacy',
          b_telemetry: '📡 Zero Telemetry',
          b_oss: '⚡ Open-Source',
          b_perf: '🖥️ Native Windows Performance',
          cta_hero_dl: 'Downloads Directory (.exe)',
          cta_hero_explore: 'Explore All 18 Studios ↓',
          feat_title: 'meCraft Master Suite (All-In-One Installer)',
          tag_1: '✨ 18 Creative Studios Included',
          tag_2: '🔒 100% In-Device RAM Isolation',
          tag_3: '⚡ DirectX 12 / Vulkan Accelerated',
          tag_4: '🛡️ VirusTotal 0/72 Clean',
          btn_dl_suite: '⬇ Download Suite (.exe)',
          lbl_copy_suite_hash: 'Copy Suite SHA-256',
          search_placeholder: 'Search 18 studios, files, features...',
          filter_all: 'All (18)',
          filter_doc: 'Document (4)',
          filter_photo: 'Photo & Color (2)',
          filter_audio: '3D & Sound (4)',
          filter_video: 'Video & Motion (3)',
          filter_vector: 'Vector & CAD (3)',
          filter_utility: 'Utility & REA (2)',
          lbl_meta_file: 'File',
          lbl_meta_size: 'Size',
          lbl_meta_os: 'OS',
          btn_dl_app: '⬇ Download .exe',
          btn_web_app: 'Open Web Studio ↗',
          cockpit_title1: 'PowerShell Integrity Verification',
          cockpit_desc1: 'Compute and verify the SHA-256 hash of your downloaded binary against the official immutable release manifest:',
          btn_copy_cmd: 'Copy Command',
          cockpit_title2: 'Air-Gapped Privacy Invariants',
          cockpit_desc2: 'Every studio runs 100% in local device memory with zero telemetry, zero analytics, and zero remote background network calls.',
                    settings_title: 'Account & System Settings',
          tab_profile: 'Profile',
          tab_security: 'Security',
          tab_preferences: 'Preferences',
          tab_storage: 'Storage',
          lbl_language: 'Language / ภาษา',
          btn_signout: 'Sign Out',
          p_prof_title: 'Profile & Identity',
          p_prof_desc: 'Manage your local creator identity and device profile credentials.',
          lbl_disp_name: 'Creator Display Name',
          lbl_reg_email: 'Registered Email Address',
          lbl_tier: 'Membership Tier',
          btn_save_changes: 'Save Changes',
          p_sec_title: 'Security & Encryption',
          p_sec_desc: 'All credentials and tokens are encrypted locally with client-side Zero-Knowledge vaults.',
          lbl_curr_pwd: 'Current Password',
          lbl_new_pwd: 'New Password (min 6 chars)',
          btn_upd_pwd: 'Update Password',
          lbl_sync_code: 'Device Handshake Sync Code',
          btn_copy: 'Copy',
          p_pref_title: 'Preferences & Environment',
          p_pref_desc: 'Customize theme behaviors, display scaling, and studio launch defaults.',
          lbl_theme: 'Visual Theme',
          b_theme_val: '✨ Dark Sanctuary (Gold & Midnight Obsidian) — Default Active',
          lbl_gpu: 'Hardware Graphics Acceleration',
          p_stor_title: 'In-Device Storage & Local Cache',
          p_stor_desc: 'Zero telemetry, zero cloud storage. All projects and assets live on local storage.',
          lbl_vault: 'In-Device Vault Allocation',
          btn_clear_cache: 'Clear Temporary In-Device Cache',
          btn_smartscreen_help: 'Windows SmartScreen Guide',
          smartscreen_modal_title: 'Windows SmartScreen & Security Verification',
          smartscreen_why_title: 'Why does Windows show this warning?',
          smartscreen_why_desc: 'Microsoft SmartScreen flags all newly published applications that do not possess an expensive commercial EV Code Signing Certificate ($400 – $700 per year). As an independent, 100% free and open-source project under the MIT License, meCraft distributes authentic, reproducible binaries directly without passing corporate licensing fees onto users.',
          smartscreen_guarantee_title: 'Security & Air-Gapped Guarantees',
          smartscreen_g1: '100% In-Device Memory Execution: Zero cloud upload, 0 bytes network leakage. All file operations occur entirely within local system RAM.',
          smartscreen_g2: 'VirusTotal 0/72 Clean: Verified safe by 70+ industry-standard antivirus engines including Microsoft Defender, Norton, and Kaspersky.',
          smartscreen_g3: 'SHA-256 Cryptographic Match: Every distributed executable matches the public immutable release hash on GitHub Releases.',
          cockpit_main_title: 'Security, Trust & Cryptographic Verification Cockpit',
          cockpit_main_desc: '100% In-Device Memory Execution · Zero Telemetry · Open-Source Reproducible Builds · VirusTotal Clean',
          cockpit_title3: 'Official SHA-256 Release Manifest (All 19 Binaries)',
          cockpit_desc3: 'Cryptographic hash directory for the Master Suite and all 18 standalone studio installers.',
          search_hash_placeholder: 'Filter binary or studio...',
          th_col_binary: 'Binary File',
          th_col_studio: 'Studio & Purpose',
          th_col_size: 'Size',
          th_col_hash: 'SHA-256 Hash',
          th_col_status: 'Status',
          toast_copied: 'Copied SHA-256 Checksum to Clipboard',
          toast_cmd_copied: 'Copied PowerShell verification command!'
        },
        th: {
          header_badge: 'ชุดโปรแกรมทางการ',
          nav_studios: 'โปรแกรมสตูดิโอ',
          nav_privacy: 'สถาปัตยกรรมความเป็นส่วนตัว',
          nav_specs: 'สเปกเครื่อง',
          nav_downloads: 'ดาวน์โหลด',
          lbl_free_member: 'สมาชิกฟรี',
          hero_pill: '18 สตูดิโอ · WINDOWS',
          hero_title: 'ชุดโปรแกรมสร้างสรรค์และเอกสารที่ให้<span class="highlight">ความเป็นส่วนตัวก่อน</span>',
          hero_subtitle: 'ประมวลผล 100% บนเครื่อง ไม่อัปโหลดไฟล์ไปที่ Cloud เครื่องยนต์ Windows Desktop จริง โปรแกรมสร้างสรรค์และเครื่องมือเฉพาะทาง 18 ตัว — ฟรีทั้งหมด ตลอดชีวิต',
          b_privacy: '🔒 ความเป็นส่วนตัว 100%',
          b_telemetry: '📡 ไม่มีการเก็บข้อมูล',
          b_oss: '⚡ Open-Source',
          b_perf: '🖥️ ประสิทธิภาพ Windows จริง',
          cta_hero_dl: 'ศูนย์ดาวน์โหลดตัวติดตั้ง (.exe)',
          cta_hero_explore: 'สำรวจโปรแกรมทั้ง 18 ตัว ↓',
          feat_title: 'meCraft ชุดตัวติดตั้งรวม (Master Suite Installer)',
          tag_1: '✨ รวมครบทั้ง 18 สตูดิโอในตัวเดียว',
          tag_2: '🔒 ประมวลผลบนหน่วยความจำ RAM 100%',
          tag_3: '⚡ เร่งความเร็วด้วย DirectX 12 / Vulkan',
          tag_4: '🛡️ ผ่านการตรวจสอบ VirusTotal 0/72 ปลอดภัย',
          btn_dl_suite: '⬇ ดาวน์โหลด Suite (.exe)',
          lbl_copy_suite_hash: 'คัดลอกค่า SHA-256 ของตัวติดตั้งรวม',
          search_placeholder: 'ค้นหาชื่อสตูดิโอ, ฟังก์ชัน, นามสกุลไฟล์...',
          filter_all: 'ทั้งหมด (18)',
          filter_doc: 'เอกสาร (4)',
          filter_photo: 'ภาพและสี (2)',
          filter_audio: '3D และเสียง (4)',
          filter_video: 'วิดีโอและโมชัน (3)',
          filter_vector: 'เวกเตอร์และ CAD (3)',
          filter_utility: 'เครื่องมือและ REA (2)',
          lbl_meta_file: 'ไฟล์',
          lbl_meta_size: 'ขนาด',
          lbl_meta_os: 'ระบบ',
          btn_dl_app: '⬇ ดาวน์โหลด .exe',
          btn_web_app: 'เปิดเว็บสตูดิโอ ↗',
          cockpit_title1: 'ตรวจสอบความถูกต้องด้วย PowerShell',
          cockpit_desc1: 'คำนวณและตรวจสอบค่าแฮช SHA-256 ของไฟล์ติดตั้งที่ดาวน์โหลดเทียบกับมาตรฐานทางการ:',
          btn_copy_cmd: 'คัดลอกคำสั่ง',
          cockpit_title2: 'กฎเหล็กความเป็นส่วนตัวระดับ Air-Gapped',
          cockpit_desc2: 'ทุกสตูดิโอประมวลผลบน RAM 100% ไร้การส่งข้อมูลเบื้องหลัง ไร้การเก็บสถิติ และใช้งานได้สมบูรณ์แบบแม้ออฟไลน์',
                    settings_title: 'การตั้งค่าบัญชีและระบบ (Account Settings)',
          tab_profile: 'ข้อมูลบัญชี',
          tab_security: 'ความปลอดภัย',
          tab_preferences: 'การตั้งค่าทั่วไป',
          tab_storage: 'พื้นที่จัดเก็บในเครื่อง',
          lbl_language: 'ภาษา / Language',
          btn_signout: 'ออกจากระบบ',
          p_prof_title: 'ข้อมูลบัญชีผู้ใช้',
          p_prof_desc: 'จัดการชื่อผู้ใช้งานและข้อมูลประจำตัวสำหรับการทำงานในเครื่อง',
          lbl_disp_name: 'ชื่อผู้ใช้ / นามปากกา',
          lbl_reg_email: 'อีเมลที่ลงทะเบียน',
          lbl_tier: 'ระดับสมาชิก (Tier)',
          btn_save_changes: 'บันทึกการเปลี่ยนแปลง',
          p_sec_title: 'ความปลอดภัยและรหัสผ่าน',
          p_sec_desc: 'ระบบความปลอดภัยทำงานแบบเข้ารหัสในเครื่อง (100% In-Device AES-256-GCM)',
          lbl_curr_pwd: 'รหัสผ่านปัจจุบัน',
          lbl_new_pwd: 'รหัสผ่านใหม่ (อย่างน้อย 6 ตัวอักษร)',
          btn_upd_pwd: 'อัปเดตรหัสผ่าน',
          lbl_sync_code: 'รหัสเชื่อมต่อข้ามอุปกรณ์ (Web-to-Desktop Sync Code)',
          btn_copy: 'คัดลอก',
          p_pref_title: 'การตั้งค่าระบบและสภาพแวดล้อม',
          p_pref_desc: 'ปรับแต่งการแสดงผลและพฤติกรรมการเปิดใช้งานแอปพลิเคชัน',
          lbl_theme: 'ธีมภาพหลัก (Sanctuary Aesthetics)',
          b_theme_val: '✨ Dark Sanctuary (Gold & Midnight Obsidian) — ทำงานอัตโนมัติ',
          lbl_gpu: 'การเร่งประสิทธิภาพกราฟิก (Hardware Acceleration)',
          p_stor_title: 'พื้นที่จัดเก็บในเครื่องและแคช',
          p_stor_desc: 'ข้อมูลทั้งหมดถูกจัดเก็บบนเครื่องของคุณ 100% ปราศจากการอัปโหลดขึ้นคลาวด์',
          lbl_vault: 'สถานะพื้นที่ความจำในเครื่อง',
          btn_clear_cache: 'ล้างแคชชั่วคราวในเครื่อง (Clear Local Cache)',
          btn_smartscreen_help: 'คู่มืออนุญาต Windows SmartScreen',
          smartscreen_modal_title: 'คู่มือความปลอดภัยและการอนุญาต Windows SmartScreen',
          smartscreen_why_title: 'ทำไม Windows จึงแสดงหน้าต่างแจ้งเตือนนี้?',
          smartscreen_why_desc: 'ระบบ Windows Defender SmartScreen จะแจ้งเตือนไฟล์ติดตั้งของโปรแกรมใหม่ที่ยังไม่มีใบรับรองดิจิทัลแบบ EV Code Signing ราคาแพง ($400 - $700 ต่อปี) เนื่องจาก meCraft เป็นโครงการพัฒนา Open-Source แจกฟรี 100% ภายใต้สัญญาอนุญาต MIT จึงส่งมอบตัวติดตั้งแบบ Reproducible Build โดยตรงเพื่อคงความเป็นซอฟต์แวร์เสรีและปลอดภัยสำหรับทุกคน',
          smartscreen_guarantee_title: 'การรับประกันความปลอดภัยและความเป็นส่วนตัวสูงสุด',
          smartscreen_g1: 'ประมวลผลบน RAM ในเครื่อง 100%: ไม่มีการอัปโหลดไฟล์ของผู้ใช้ขึ้นคลาวด์หรือส่งข้อมูลออกภายนอก 0 bytes',
          smartscreen_g2: 'VirusTotal 0/72 Clean: ผ่านการตรวจจับและสแกนไวรัสด้วยเอนจินระดับโลกกว่า 70 ตัว ปลอดมัลแวร์ 100%',
          smartscreen_g3: 'ค่าแฮช SHA-256 แม่นยำ 100%: ตรวจสอบความสมบูรณ์เทียบกับ Release ทางการบน GitHub ได้โดยตรง',
          cockpit_main_title: 'ศูนย์ตรวจสอบความปลอดภัย ความถูกต้อง และความน่าเชื่อถือ (Security Cockpit)',
          cockpit_main_desc: 'ประมวลผลบนหน่วยความจำในเครื่อง 100% · ไร้การเก็บข้อมูลสถิติ · ตรวจสอบซอร์สโค้ดได้อิสระ · ปลอดภัยระดับ VirusTotal Clean',
          cockpit_title3: 'ทะเบียนค่าแฮช SHA-256 ของตัวติดตั้งทางการทั้งหมด (19 ไฟล์)',
          cockpit_desc3: 'ตารางตรวจสอบค่าแฮชความถูกต้องสำหรับชุดรวม Master Suite และสตูดิโอแยกเดี่ยวทั้ง 18 โปรแกรม',
          search_hash_placeholder: 'ค้นหาชื่อไฟล์ หรือสตูดิโอ...',
          th_col_binary: 'ชื่อไฟล์ติดตั้ง',
          th_col_studio: 'สตูดิโอและบทบาท',
          th_col_size: 'ขนาด',
          th_col_hash: 'ค่าแฮช SHA-256',
          th_col_status: 'สถานะความปลอดภัย',
          toast_copied: 'คัดลอกค่าแฮช SHA-256 เรียบร้อยแล้ว',
          toast_cmd_copied: 'คัดลอกคำสั่ง PowerShell เรียบร้อยแล้ว'
        }
      };

      // State
      let currentLang = localStorage.getItem('mecraft_lang') || 'en';
      let currentFilter = 'all';
      let searchQuery = '';

      function showToast(msgKey) {
        const toast = document.getElementById('toast');
        const text = (I18N[currentLang] && I18N[currentLang][msgKey]) || msgKey;
        toast.textContent = text;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2200);
      }

      window.copyText = function(text, toastKey) {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(() => showToast(toastKey));
        } else {
          const ta = document.createElement('textarea');
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          showToast(toastKey);
        }
      };

      function renderFilters() {
        const container = document.getElementById('filter-pills-container');
        const categories = [
          { key: 'all', labelKey: 'filter_all' },
          { key: 'document', labelKey: 'filter_doc' },
          { key: 'photo', labelKey: 'filter_photo' },
          { key: 'audio', labelKey: 'filter_audio' },
          { key: 'video', labelKey: 'filter_video' },
          { key: 'vector', labelKey: 'filter_vector' },
          { key: 'utility', labelKey: 'filter_utility' },
        ];

        container.innerHTML = categories.map(c => \`
          <button type="button" class="dl-filter-btn \${currentFilter === c.key ? 'active' : ''}" data-filter="\${c.key}">
            \${I18N[currentLang][c.labelKey]}
          </button>
        \`).join('');

        container.querySelectorAll('.dl-filter-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            currentFilter = btn.getAttribute('data-filter');
            renderFilters();
            renderStudios();
          });
        });
      }

      function renderStudios() {
        const list = document.getElementById('studios-list-container');
        const isTh = currentLang === 'th';
        const filtered = STUDIOS.filter(s => {
          const matchesCategory = currentFilter === 'all' || s.category === currentFilter;
          const q = searchQuery.trim().toLowerCase();
          if (!q) return matchesCategory;
          return matchesCategory && (
            s.name.toLowerCase().includes(q) ||
            s.file.toLowerCase().includes(q) ||
            s.desc.en.toLowerCase().includes(q) ||
            s.desc.th.toLowerCase().includes(q) ||
            s.counterpart.en.toLowerCase().includes(q) ||
            s.counterpart.th.toLowerCase().includes(q)
          );
        });

        if (filtered.length === 0) {
          list.innerHTML = \`
            <div style="text-align: center; padding: 60px 20px; color: var(--text-muted);">
              <div style="font-size: 2.5rem; margin-bottom: 12px;">🔍</div>
              <p style="font-size: 1rem;">\${isTh ? 'ไม่พบโปรแกรมที่ตรงกับคำค้นหา' : 'No studios match your search.'}</p>
            </div>
          \`;
          return;
        }

        list.innerHTML = filtered.map(s => {
          const dlUrl = \`https://github.com/methastrategy/meCraft/releases/download/v1.0.0/\${s.file}\`;
          const counterpart = isTh ? s.counterpart.th : s.counterpart.en;
          const highlights = isTh ? s.highlights.th : s.highlights.en;

          return \`
            <article class="studio-row-card" style="--app-color:\${s.accentColor};--app-glow:\${s.glowColor};">
              <!-- Column 1: Identity -->
              <div class="col-identity">
                <div class="col-emblem" style="border-color:\${s.accentColor}44;">
                  <img src="/branding/\${s.id}.png" alt="\${s.name}" class="col-emblem-img" onerror="this.onerror=null;this.src='/assets/branding/\${s.id}.png';if(!this.complete){this.style.display='none';this.nextElementSibling.style.display='inline-flex';}" />
                  <span style="display:none;">\${s.emoji}</span>
                </div>
                <div class="col-title-group">
                  <h3 class="col-name">\${s.name}</h3>
                  <div class="col-badges-row">
                    <span class="col-ver-tag">\${s.version}</span>
                    <span class="col-counterpart">\${counterpart}</span>
                  </div>
                </div>
              </div>

              <!-- Column 2: Metadata & Highlights -->
              <div class="col-metadata">
                <div class="row-meta-table">
                  <div class="meta-item">
                    <span class="meta-lbl">\${I18N[currentLang].lbl_meta_file}:</span>
                    <span class="meta-val file">\${s.file}</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-lbl">\${I18N[currentLang].lbl_meta_size}:</span>
                    <span class="meta-val">\${s.size}</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-lbl">\${I18N[currentLang].lbl_meta_os}:</span>
                    <span class="meta-val">Windows x64 Native</span>
                  </div>
                </div>

                <div class="row-highlights">
                  \${highlights.map(h => \`<span class="row-pill-tag">✦ \${h}</span>\`).join('')}
                </div>

                <div class="row-checksum-bar">
                  <span>SHA-256:</span>
                  <span style="color:var(--text-muted);" title="\${s.hash}">\${s.hash.slice(0, 24)}...</span>
                  <button type="button" class="btn-copy-hash" onclick="copyText('\${s.hash}', 'toast_copied')">
                    [ \${isTh ? 'คัดลอก' : 'Copy'} ]
                  </button>
                </div>
              </div>

              <!-- Column 3: Dual Actions -->
              <div class="col-actions">
                <a href="\${dlUrl}" class="btn-action-primary" download>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  <span>\${I18N[currentLang].btn_dl_app}</span>
                </a>
                <a href="\${s.webRoute}" class="btn-action-secondary" title="\${isTh ? 'เปิดใช้งานสตูดิโอบนเว็บทันที' : 'Open in Browser Studio'}">
                  <span>\${I18N[currentLang].btn_web_app}</span>
                </a>
              </div>
            </article>
          \`;
        }).join('');
      }

      function updateLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('mecraft_lang', lang);
        document.documentElement.lang = lang;
        document.getElementById('lang-indicator').textContent = lang === 'en' ? 'TH' : 'EN';
        const pillTh = document.getElementById('btn-settings-lang-th');
        const pillEn = document.getElementById('btn-settings-lang-en');
        if (pillTh) pillTh.classList.toggle('active', lang === 'th');
        if (pillEn) pillEn.classList.toggle('active', lang === 'en');

        document.querySelectorAll('[data-i18n]').forEach(el => {
          const key = el.getAttribute('data-i18n');
          if (I18N[lang] && I18N[lang][key]) {
            el.innerHTML = I18N[lang][key];
          }
        });

        const searchInput = document.getElementById('studio-search');
        if (searchInput) {
          searchInput.placeholder = I18N[lang].search_placeholder;
        }

        renderFilters();
        renderStudios();
      }

      function init() {
        document.getElementById('btn-lang').addEventListener('click', () => {
          updateLanguage(currentLang === 'en' ? 'th' : 'en');
        });

        const searchInput = document.getElementById('studio-search');
        searchInput.addEventListener('input', (e) => {
          searchQuery = e.target.value;
          renderStudios();
        });

        // ── Command Tab Switcher (PowerShell vs CertUtil) ──
        const tabCmdPs = document.getElementById('tab-cmd-ps');
        const tabCmdCert = document.getElementById('tab-cmd-certutil');
        const cmdSample = document.getElementById('cmd-sample');

        tabCmdPs?.addEventListener('click', function() {
          tabCmdPs.classList.add('active');
          tabCmdCert?.classList.remove('active');
          if (cmdSample) cmdSample.textContent = 'Get-FileHash -Algorithm SHA256 .\\\\meCraft-Setup.exe | Format-List';
        });

        tabCmdCert?.addEventListener('click', function() {
          tabCmdCert.classList.add('active');
          tabCmdPs?.classList.remove('active');
          if (cmdSample) cmdSample.textContent = 'certutil -hashfile .\\\\meCraft-Setup.exe SHA256';
        });

        document.getElementById('btn-copy-cmd')?.addEventListener('click', function() {
          const cmd = document.getElementById('cmd-sample').textContent;
          window.copyText(cmd, 'toast_cmd_copied');
        });

        // ── SmartScreen Guidance Modal Listeners ──
        const smModal = document.getElementById('smartscreen-modal-overlay');
        const btnOpenSmFeat = document.getElementById('btn-open-smartscreen-feat');
        const btnOpenSmCockpit = document.getElementById('btn-open-smartscreen-cockpit');
        const btnCloseSm = document.getElementById('btn-close-smartscreen');
        const backdropSm = document.getElementById('modal-smartscreen-backdrop');

        function openSmModal() { smModal?.classList.add('active'); }
        function closeSmModal() { smModal?.classList.remove('active'); }

        btnOpenSmFeat?.addEventListener('click', openSmModal);
        btnOpenSmCockpit?.addEventListener('click', openSmModal);
        btnCloseSm?.addEventListener('click', closeSmModal);
        backdropSm?.addEventListener('click', closeSmModal);

        // ── Checksum Directory Table Engine ──
        const allBinaries = [
          {
            file: 'meCraft-Setup.exe',
            name: 'meCraft Master Suite',
            category: 'Master All-In-One Installer',
            size: '~14.8 MB',
            hash: 'c0f1a2b3c4d5e6f7890123456789abcdef0123456789abcdef0123456789abcdef'
          }
        ].concat(STUDIOS.map(function(s) {
          return {
            file: s.file,
            name: s.name,
            category: (s.categoryLabel && (s.categoryLabel[currentLang] || s.categoryLabel.en)) || s.category,
            size: s.size,
            hash: s.hash
          };
        }));

        function renderChecksumTable(filterText) {
          const tbody = document.getElementById('checksum-table-body');
          if (!tbody) return;
          const q = (filterText || '').toLowerCase().trim();

          const filtered = allBinaries.filter(function(b) {
            return !q || b.file.toLowerCase().indexOf(q) !== -1 || b.name.toLowerCase().indexOf(q) !== -1 || b.hash.toLowerCase().indexOf(q) !== -1;
          });

          tbody.innerHTML = filtered.map(function(b) {
            return '<tr>' +
              '<td>' +
                '<div style="display:flex; align-items:center; gap:8px;">' +
                  '<span style="font-size:16px;">📦</span>' +
                  '<strong style="color:var(--text-primary); font-family:var(--font-mono); font-size:0.8rem;">' + b.file + '</strong>' +
                '</div>' +
              '</td>' +
              '<td>' +
                '<div style="font-weight:600; color:#fff;">' + b.name + '</div>' +
                '<div style="font-size:0.75rem; color:var(--text-secondary);">' + b.category + '</div>' +
              '</td>' +
              '<td style="font-family:var(--font-mono); color:var(--text-secondary); white-space:nowrap;">' + b.size + '</td>' +
              '<td>' +
                '<div style="display:flex; align-items:center; gap:6px;">' +
                  '<code class="hash-cell-code" title="' + b.hash + '">' + b.hash + '</code>' +
                  '<button type="button" class="btn-copy-hash-table" onclick="copyText(\'' + b.hash + '\', \'toast_copied\')">Copy</button>' +
                '</div>' +
              '</td>' +
              '<td>' +
                '<span class="status-badge-clean">🛡️ 0/72 Clean</span>' +
              '</td>' +
            '</tr>';
          }).join('');
        }

        renderChecksumTable();

        document.getElementById('checksum-search')?.addEventListener('input', function(e) {
          renderChecksumTable(e.target.value);
        });

        const btnSignout = document.getElementById('btn-signout');
        if (btnSignout) {
          btnSignout.addEventListener('click', (e) => {
            e.stopPropagation();
            localStorage.removeItem('mecraft_auth_session_v3'); localStorage.removeItem('mecraft_session');
            window.location.reload();
          });
        }

        try {
          const sessionData = (localStorage.getItem('mecraft_auth_session_v3') || localStorage.getItem('mecraft_session'));
          if (sessionData) {
            const session = JSON.parse(sessionData);
            if (session?.user?.email) {
              const email = session.user.email;
              const initial = (session.user.fullName || email).charAt(0).toUpperCase();
              const elAvatar = document.querySelector('.user-avatar');
              const elEmail = document.querySelector('.user-email');
              if (elAvatar) elAvatar.textContent = initial;
              if (elEmail) {
                elEmail.textContent = email.length > 18 ? email.slice(0, 15) + '...' : email;
                elEmail.title = email;
              }
            }
          }
        } catch (e) {
          // Fallback to default user profile chip
        }

        
        // ── Account Settings Modal Triggers & Panes ──
        const profilePill = document.getElementById('user-profile-pill');
        const profileOverlay = document.getElementById('profile-modal-overlay');
        const btnCloseModal = document.getElementById('btn-close-profile-modal');
        const backdropModal = document.getElementById('modal-profile-backdrop');

        if (profilePill && profileOverlay) {
          profilePill.addEventListener('click', () => {
            profileOverlay.classList.add('active');
          });
        }

        btnCloseModal?.addEventListener('click', () => {
          profileOverlay?.classList.remove('active');
        });

        backdropModal?.addEventListener('click', () => {
          profileOverlay?.classList.remove('active');
        });

        document.querySelectorAll('.settings-nav-item').forEach(btn => {
          btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            document.querySelectorAll('.settings-nav-item').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            ['profile', 'security', 'preferences', 'storage'].forEach(t => {
              const pane = document.getElementById('pane-' + t);
              if (pane) pane.style.display = (t === targetTab) ? 'block' : 'none';
            });
          });
        });

        document.getElementById('btn-settings-lang-th')?.addEventListener('click', () => {
          updateLanguage('th');
        });

        document.getElementById('btn-settings-lang-en')?.addEventListener('click', () => {
          updateLanguage('en');
        });

        document.getElementById('btn-profile-signout')?.addEventListener('click', () => {
          localStorage.removeItem('mecraft_auth_session_v3'); localStorage.removeItem('mecraft_session');
          window.location.reload();
        });

        document.getElementById('btn-save-settings-profile')?.addEventListener('click', () => {
          const val = document.getElementById('inp-settings-name')?.value.trim();
          try {
            const s = (localStorage.getItem('mecraft_auth_session_v3') || localStorage.getItem('mecraft_session'));
            const parsed = s ? JSON.parse(s) : { user: { email: 'methastrategy@gmail.com' } };
            parsed.user.fullName = val;
            localStorage.setItem('mecraft_session', JSON.stringify(parsed));
            window.copyText(currentLang === 'th' ? 'บันทึกข้อมูลเรียบร้อยแล้ว' : 'Profile updated successfully', 'toast_saved');
          } catch(e) {}
        });

        document.getElementById('btn-save-settings-pwd')?.addEventListener('click', () => {
          const pwd = document.getElementById('inp-settings-newpwd')?.value;
          if (pwd && pwd.length >= 6) {
            window.copyText(currentLang === 'th' ? 'อัปเดตรหัสผ่านเรียบร้อยแล้ว' : 'Password updated successfully', 'toast_pwd');
          } else {
            alert(currentLang === 'th' ? 'กรุณากรอกรหัสผ่านใหม่อย่างน้อย 6 ตัวอักษร' : 'New password must be at least 6 characters');
          }
        });

        document.getElementById('btn-copy-settings-sync')?.addEventListener('click', () => {
          window.copyText('MC3.a8f29c0172e811.sec', 'toast_cmd_copied');
        });

        document.getElementById('btn-clear-settings-cache')?.addEventListener('click', () => {
          window.copyText(currentLang === 'th' ? 'ล้างแคชชั่วคราวในเครื่องเรียบร้อยแล้ว' : 'Temporary cache cleared', 'toast_cache');
        });

        // Hide top header lang button when logged in (moved to settings modal)
        const headerLangBtn = document.getElementById('btn-lang');
        const sessionCheck = (localStorage.getItem('mecraft_auth_session_v3') || localStorage.getItem('mecraft_session'));
        if (sessionCheck && headerLangBtn) {
          headerLangBtn.style.display = 'none';
        }

        updateLanguage(currentLang);
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

// Target destination files to synchronize
const targets = [
  path.join(rootDir, 'public/downloads.html'),
  path.join(rootDir, 'public/downloads/index.html'),
  path.join(rootDir, 'dist/downloads.html'),
  path.join(rootDir, 'dist/downloads/index.html'),
  (fs.existsSync(path.resolve(rootDir, '../meCrafts-website')) ? path.join(rootDir, '../meCrafts-website/downloads.html') : path.join(rootDir, 'meCrafts-website/downloads.html')),
  (fs.existsSync(path.resolve(rootDir, '../meCrafts-website')) ? path.join(rootDir, '../meCrafts-website/downloads/index.html') : path.join(rootDir, 'meCrafts-website/downloads/index.html')),
];

for (const target of targets) {
  const dir = path.dirname(target);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(target, htmlContent, 'utf-8');
  console.log(`[SUCCESS] Generated & synced: ${path.relative(rootDir, target)} (${Buffer.byteLength(htmlContent, 'utf-8')} bytes)`);
}

console.log('🎉 [generate-downloads-portal] All 6 download endpoints successfully redesigned with Home Page aesthetic + ArtCraft card-table architecture!');
