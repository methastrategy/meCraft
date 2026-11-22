/**
 * meCraft Design Tokens & Theme Constants (v2.5)
 */

export const THEME_COLORS = {
  bgOled: '#06070a',
  bgApp: '#090a0f',
  surfaceBase: 'oklch(0.14 0.008 265)',
  surfaceRaised: 'oklch(0.18 0.010 265)',
  surfaceCard: 'oklch(0.16 0.010 265)',
  surfaceOverlay: 'rgba(22, 25, 34, 0.86)',
  surfaceActive: 'oklch(0.23 0.012 265)',
  surfaceHover: 'oklch(0.20 0.010 265)',

  borderSubtle: 'rgba(255, 255, 255, 0.07)',
  borderMedium: 'rgba(255, 255, 255, 0.14)',
  borderActive: 'rgba(255, 255, 255, 0.28)',
  borderFocus: 'oklch(0.65 0.22 264)',

  primary: 'oklch(0.62 0.22 264)',
  primaryHover: 'oklch(0.68 0.22 264)',
  primaryActive: 'oklch(0.55 0.22 264)',
  primaryGlow: 'rgba(99, 102, 241, 0.28)',

  accentCyan: 'oklch(0.78 0.16 210)',
  accentOnPrimary: '#ffffff',
  accentViolet: 'oklch(0.65 0.22 290)',
  accentRose: 'oklch(0.65 0.22 15)',
  accentEmerald: 'oklch(0.75 0.16 150)',
  accentAmber: 'oklch(0.78 0.16 75)',

  danger: 'oklch(0.65 0.22 25)',
  dangerHover: 'oklch(0.70 0.22 25)',
  dangerBg: 'rgba(239, 68, 68, 0.15)',
  success: 'oklch(0.75 0.16 145)',
  successBg: 'rgba(16, 185, 129, 0.15)',
  warning: 'oklch(0.78 0.15 85)',
  warningBg: 'rgba(245, 158, 11, 0.15)',

  textPrimary: '#ffffff',
  textSecondary: 'oklch(0.86 0.005 265)',
  textMuted: 'oklch(0.72 0.006 265)',
  textFaint: 'oklch(0.55 0.010 265)',
  textInverse: '#090a0f',
} as const;

export const THEME_OLED_COLORS = {
  bgOled: '#000000',
  bgApp: '#050608',
  surfaceBase: '#0a0c10',
  surfaceRaised: '#10131a',
  surfaceCard: '#141822',
  surfaceActive: '#1c2230',
  surfaceHover: '#181d2a',
  borderSubtle: 'rgba(255, 255, 255, 0.06)',
  borderMedium: 'rgba(255, 255, 255, 0.12)',
} as const;

export const TYPOGRAPHY = {
  fontSans: "'Plus Jakarta Sans', 'Inter', 'IBM Plex Sans Thai', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontMono: "'JetBrains Mono', 'Fira Code', Menlo, monospace",
  lhUi: 1.35,
  lhProse: 1.70,
} as const;

export const RADII = {
  xs: '4px',
  sm: '6px',
  md: '10px',
  lg: '16px',
  xl: '24px',
  full: '9999px',
  outer: '12px',
  inner: 'max(0px, calc(12px - 1px - 4px))',
  cornerR: 'max(0px, calc(10px - 1px - 4px))',
} as const;

export const TRANSITIONS = {
  spring: 'cubic-bezier(0.16, 1, 0.3, 1)',
  fast: '120ms',
  normal: '220ms',
  slow: '350ms',
} as const;
