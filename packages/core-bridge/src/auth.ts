/**
 * @file auth.ts
 * @mecraft/core-bridge — Centralized Authentication, Entitlements & License Engine.
 * Supports Strict Hub SSO, 30-Day Offline Grace Period, and Feature-Tiered Subscription checks.
 */

export type SubscriptionTier =
  | 'free_member'
  | 'pro_monthly'
  | 'pro_yearly'
  | 'lifetime';

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  tier: SubscriptionTier;
  createdAt: string;
}

export interface AuthSession {
  user: UserProfile;
  accessToken: string;
  refreshToken?: string;
  expiresAt: number; // Unix timestamp in ms
  issuedAt: number;  // Unix timestamp in ms
  offlineGracePeriodDays: number; // default: 30 days
}

export type FeatureId =
  | 'app:all_launch'
  | 'feature:4k_render'
  | 'feature:ai_ocr_unlimited'
  | 'feature:ai_bg_removal'
  | 'feature:raw_color_curves'
  | 'feature:cloud_backup'
  | string;

export const AUTH_STORAGE_KEY = 'mecraft_auth_session_v3';
export const DEFAULT_OFFLINE_GRACE_DAYS = 30;

/**
 * Universal storage access (browser localStorage / node memory)
 */
const memoryStorage = new Map<string, string>();

function getStorageItem(key: string): string | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return memoryStorage.get(key) || null;
    }
  }
  return memoryStorage.get(key) || null;
}

function setStorageItem(key: string, value: string): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(key, value);
      return;
    } catch {
      memoryStorage.set(key, value);
      return;
    }
  }
  memoryStorage.set(key, value);
}

function removeStorageItem(key: string): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.removeItem(key);
      return;
    } catch {
      memoryStorage.delete(key);
      return;
    }
  }
  memoryStorage.delete(key);
}

// ─────────────────────────────────────────────────────────────────────────────
// Real-Time Cross-App & Cross-Tab Synchronization Bus
// ─────────────────────────────────────────────────────────────────────────────
export type AuthChangeListener = (session: AuthSession | null) => void;
const authChangeListeners = new Set<AuthChangeListener>();

let authBroadcastChannel: BroadcastChannel | null = null;
let isChannelInitialized = false;

function initAuthSyncChannel(): void {
  if (isChannelInitialized || typeof window === 'undefined') return;
  isChannelInitialized = true;

  if (typeof BroadcastChannel !== 'undefined') {
    try {
      authBroadcastChannel = new BroadcastChannel('mecraft_auth_sync');
      authBroadcastChannel.onmessage = (event) => {
        if (event.data && event.data.type === 'AUTH_STATE_CHANGED') {
          const newSession = event.data.session as AuthSession | null;
          notifyListeners(newSession, false);
        }
      };
    } catch {
      // safe fallback if BroadcastChannel is restricted
    }
  }

  // Cross-tab storage event
  window.addEventListener('storage', (e) => {
    if (e.key === AUTH_STORAGE_KEY) {
      const session = getAuthSession();
      notifyListeners(session, false);
    }
  });
}

function notifyListeners(session: AuthSession | null, broadcast = true): void {
  authChangeListeners.forEach((listener) => {
    try {
      listener(session);
    } catch (err) {
      console.warn('[core-bridge:auth] Error in authChangeListener:', err);
    }
  });

  if (broadcast) {
    if (authBroadcastChannel) {
      try {
        authBroadcastChannel.postMessage({
          type: 'AUTH_STATE_CHANGED',
          session,
          timestamp: Date.now(),
        });
      } catch {
        // Broadcast failed
      }
    }
    if (typeof window !== 'undefined') {
      try {
        window.dispatchEvent(new CustomEvent('mecraft:auth-change', { detail: session }));
      } catch {
        // CustomEvent failed
      }
    }
  }
}

/**
 * Subscribe to real-time authentication session changes across tabs & apps
 */
export function onAuthSessionChange(listener: AuthChangeListener): () => void {
  initAuthSyncChannel();
  authChangeListeners.add(listener);
  return () => {
    authChangeListeners.delete(listener);
  };
}

/**
 * Check if a session is currently within its 30-day offline grace period
 */
export function isOfflineGraceValid(session: AuthSession | null): boolean {
  if (!session) return false;
  const now = Date.now();
  const graceDurationMs = (session.offlineGracePeriodDays || DEFAULT_OFFLINE_GRACE_DAYS) * 24 * 60 * 60 * 1000;
  return now - session.issuedAt <= graceDurationMs;
}

/**
 * Check if a specific feature is unlocked for a given subscription tier
 * Rules:
 * - Pro/Lifetime tiers unlock 100% of features
 * - Free Member can launch all apps (Feature-Tiered Subscription model), but premium AI/4K features are locked
 */
export function isFeatureUnlocked(featureId: FeatureId, tier: SubscriptionTier): boolean {
  if (tier === 'pro_monthly' || tier === 'pro_yearly' || tier === 'lifetime') {
    return true;
  }

  // Feature-Tiered model: All registered members can launch all apps
  if (featureId === 'app:all_launch' || featureId.startsWith('app:')) {
    return true;
  }

  // Pro-only features for free members
  const proOnlyFeatures = new Set([
    'feature:4k_render',
    'feature:ai_ocr_unlimited',
    'feature:ai_bg_removal',
    'feature:raw_color_curves',
    'feature:cloud_backup',
  ]);

  if (proOnlyFeatures.has(featureId)) {
    return false;
  }

  return true;
}

/**
 * Get human-readable badge label and color for subscription tiers
 */
export function getTierBadge(tier: SubscriptionTier): { label: string; color: string; isPro: boolean } {
  switch (tier) {
    case 'lifetime':
      return { label: 'LIFETIME PRO', color: '#ffd700', isPro: true };
    case 'pro_yearly':
      return { label: 'PRO YEARLY', color: '#d4af37', isPro: true };
    case 'pro_monthly':
      return { label: 'PRO CREATOR', color: '#d4af37', isPro: true };
    case 'free_member':
    default:
      return { label: 'FREE MEMBER', color: '#a0a5b5', isPro: false };
  }
}

/**
 * Save auth session to universal storage and broadcast to all listening tabs/apps
 */
export function saveAuthSession(session: AuthSession): void {
  try {
    setStorageItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    notifyListeners(session, true);
  } catch (err) {
    console.warn('[core-bridge:auth] Failed to persist auth session:', err);
  }
}

/**
 * Load auth session from storage, validating offline grace
 */
export function getAuthSession(): AuthSession | null {
  try {
    const raw = getStorageItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const session: AuthSession = JSON.parse(raw);
    if (!session || !session.user) return null;

    // Check if offline grace period is still valid
    if (!isOfflineGraceValid(session)) {
      console.warn('[core-bridge:auth] Auth session expired past 30-day offline grace period');
      return null;
    }

    return session;
  } catch (err) {
    console.warn('[core-bridge:auth] Failed to parse auth session:', err);
    return null;
  }
}

/**
 * Clear auth session (Sign Out) and notify all listening tabs/apps
 */
export function clearAuthSession(): void {
  try {
    removeStorageItem(AUTH_STORAGE_KEY);
    notifyListeners(null, true);
  } catch (err) {
    console.warn('[core-bridge:auth] Failed to clear auth session:', err);
  }
}

/**
 * Helper to generate a mock auth session for testing, dev mode, or offline demonstration
 */
export function createMockAuthSession(
  email = 'creator@mecraft.dev',
  tier: SubscriptionTier = 'free_member'
): AuthSession {
  const now = Date.now();
  return {
    user: {
      id: `usr_${Math.random().toString(36).substring(2, 9)}`,
      email,
      fullName: email.split('@')[0],
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
      tier,
      createdAt: new Date().toISOString(),
    },
    accessToken: `mock_jwt_${Math.random().toString(36).substring(2)}`,
    issuedAt: now,
    expiresAt: now + 30 * 24 * 60 * 60 * 1000,
    offlineGracePeriodDays: DEFAULT_OFFLINE_GRACE_DAYS,
  };
}

/**
 * Export an auth session as a portable Base64 sync code.
 * Used to synchronize web signin with desktop launcher or other devices.
 */
export function exportAuthSyncCode(session?: AuthSession | null): string {
  const targetSession = session || getAuthSession();
  if (!targetSession) return '';
  try {
    const payload = JSON.stringify({
      v: 3,
      u: targetSession.user,
      tok: targetSession.accessToken,
      rtok: targetSession.refreshToken,
      iat: targetSession.issuedAt,
      exp: targetSession.expiresAt,
    });
    if (typeof Buffer !== 'undefined') {
      return `MC3.${Buffer.from(payload, 'utf-8').toString('base64')}`;
    } else if (typeof btoa !== 'undefined') {
      return `MC3.${btoa(encodeURIComponent(payload))}`;
    }
    return '';
  } catch (err) {
    console.warn('[core-bridge:auth] Failed to export sync code:', err);
    return '';
  }
}

/**
 * Import and activate an auth session from a Base64 sync code.
 */
export function importAuthSyncCode(code: string): AuthSession | null {
  if (!code || typeof code !== 'string') return null;
  const cleanCode = code.trim();
  const rawBase64 = cleanCode.startsWith('MC3.') ? cleanCode.slice(4) : cleanCode;

  try {
    let jsonStr = '';
    if (typeof Buffer !== 'undefined') {
      jsonStr = Buffer.from(rawBase64, 'base64').toString('utf-8');
    } else if (typeof atob !== 'undefined') {
      try {
        jsonStr = decodeURIComponent(atob(rawBase64));
      } catch {
        jsonStr = atob(rawBase64);
      }
    }

    const data = JSON.parse(jsonStr);
    if (!data || !data.u || !data.u.email) return null;

    const session: AuthSession = {
      user: data.u,
      accessToken: data.tok || `synced_jwt_${Date.now()}`,
      refreshToken: data.rtok,
      issuedAt: data.iat || Date.now(),
      expiresAt: data.exp || (Date.now() + 30 * 24 * 60 * 60 * 1000),
      offlineGracePeriodDays: DEFAULT_OFFLINE_GRACE_DAYS,
    };

    if (!isOfflineGraceValid(session)) {
      console.warn('[core-bridge:auth] Imported sync code has expired past 30-day grace period');
      return null;
    }

    saveAuthSession(session);
    return session;
  } catch (err) {
    console.warn('[core-bridge:auth] Failed to import auth sync code:', err);
    return null;
  }
}

/**
 * Checks URL search params or hash for `mecraft_token` or `sync_code`
 * to seamlessly auto-sign-in from deep link or web redirect.
 */
export function checkUrlAuthHandoff(): AuthSession | null {
  if (typeof window === 'undefined' || !window.location) return null;

  try {
    const url = new URL(window.location.href);
    const token = url.searchParams.get('mecraft_token') || url.searchParams.get('sync_code');
    if (token) {
      const session = importAuthSyncCode(token);
      if (session) {
        url.searchParams.delete('mecraft_token');
        url.searchParams.delete('sync_code');
        window.history.replaceState({}, document.title, url.toString());
        return session;
      }
    }
  } catch {
    // safe
  }
  return null;
}
