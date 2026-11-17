/**
 * meCraft Design Tokens & Theme Constants
 */

export const THEME_COLORS = {
  bgOled: '#050608',
  bgApp: '#08090d',
  surfaceBase: '#0e1117',
  surfaceRaised: '#141822',
  surfaceCard: '#181d2a',
  surfaceOverlay: 'rgba(16, 20, 30, 0.88)',
  surfaceActive: '#21283a',
  surfaceHover: '#1c2232',

  borderSubtle: 'rgba(255, 255, 255, 0.08)',
  borderMedium: 'rgba(255, 255, 255, 0.15)',
  borderActive: 'rgba(255, 255, 255, 0.28)',
  borderFocus: '#6366f1',

  primary: '#6366f1',
  primaryHover: '#4f46e5',
  primaryActive: '#4338ca',
  primaryGlow: 'rgba(99, 102, 241, 0.28)',

  accentCyan: '#06b6d4',
  accentViolet: '#8b5cf6',
  accentRose: '#f43f5e',
  accentEmerald: '#10b981',
  accentAmber: '#f59e0b',

  danger: '#ef4444',
  success: '#10b981',
  warning: '#f59e0b',

  textPrimary: '#ffffff',
  textSecondary: '#cbd5e1',
  textMuted: '#94a3b8',
  textFaint: '#64748b',
} as const;

export const TYPOGRAPHY = {
  fontSans: "'Inter', 'IBM Plex Sans Thai', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
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
} as const;

export const TRANSITIONS = {
  spring: 'cubic-bezier(0.16, 1, 0.3, 1)',
  fast: '120ms',
  normal: '220ms',
  slow: '350ms',
} as const;
