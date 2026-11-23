import { describe, it, expect, beforeEach } from 'vitest';
import {
  saveAuthSession,
  getAuthSession,
  clearAuthSession,
  isOfflineGraceValid,
  isFeatureUnlocked,
  getTierBadge,
  createMockAuthSession,
  onAuthSessionChange,
  exportAuthSyncCode,
  importAuthSyncCode,
  DEFAULT_OFFLINE_GRACE_DAYS,
  type AuthSession
} from '../src/auth';

describe('meCraft Auth & Entitlements Engine (@mecraft/core-bridge)', () => {
  beforeEach(() => {
    clearAuthSession();
  });

  describe('30-Day Offline Grace Period', () => {
    it('validates a fresh session within grace period', () => {
      const session = createMockAuthSession('tester@mecraft.dev', 'free_member');
      expect(isOfflineGraceValid(session)).toBe(true);
    });

    it('rejects an expired session beyond 30 days', () => {
      const session = createMockAuthSession('tester@mecraft.dev', 'free_member');
      // Set issuedAt to 31 days in the past
      session.issuedAt = Date.now() - (31 * 24 * 60 * 60 * 1000);
      expect(isOfflineGraceValid(session)).toBe(false);
    });

    it('handles null session safely', () => {
      expect(isOfflineGraceValid(null)).toBe(false);
    });
  });

  describe('Feature-Tiered Subscription Checks', () => {
    it('allows all app launches for Free Member (Feature-Tiered rule)', () => {
      expect(isFeatureUnlocked('app:all_launch', 'free_member')).toBe(true);
      expect(isFeatureUnlocked('app:mepdf:basic', 'free_member')).toBe(true);
      expect(isFeatureUnlocked('app:melight:basic', 'free_member')).toBe(true);
      expect(isFeatureUnlocked('app:mefilm:basic', 'free_member')).toBe(true);
    });

    it('gates premium Pro features for Free Member', () => {
      expect(isFeatureUnlocked('feature:4k_render', 'free_member')).toBe(false);
      expect(isFeatureUnlocked('feature:ai_ocr_unlimited', 'free_member')).toBe(false);
      expect(isFeatureUnlocked('feature:ai_bg_removal', 'free_member')).toBe(false);
      expect(isFeatureUnlocked('feature:raw_color_curves', 'free_member')).toBe(false);
    });

    it('unlocks 100% of features for Pro and Lifetime subscribers', () => {
      const proTiers = ['pro_monthly', 'pro_yearly', 'lifetime'] as const;

      for (const tier of proTiers) {
        expect(isFeatureUnlocked('app:all_launch', tier)).toBe(true);
        expect(isFeatureUnlocked('feature:4k_render', tier)).toBe(true);
        expect(isFeatureUnlocked('feature:ai_ocr_unlimited', tier)).toBe(true);
        expect(isFeatureUnlocked('feature:ai_bg_removal', tier)).toBe(true);
        expect(isFeatureUnlocked('feature:raw_color_curves', tier)).toBe(true);
        expect(isFeatureUnlocked('feature:cloud_backup', tier)).toBe(true);
      }
    });
  });

  describe('Session Storage & Lifecycle', () => {
    it('saves and restores auth session accurately', () => {
      const mock = createMockAuthSession('designer@mecraft.dev', 'pro_monthly');
      saveAuthSession(mock);

      const restored = getAuthSession();
      expect(restored).not.toBeNull();
      expect(restored?.user.email).toBe('designer@mecraft.dev');
      expect(restored?.user.tier).toBe('pro_monthly');
    });

    it('clears session on sign out', () => {
      const mock = createMockAuthSession('artist@mecraft.dev', 'free_member');
      saveAuthSession(mock);
      expect(getAuthSession()).not.toBeNull();

      clearAuthSession();
      expect(getAuthSession()).toBeNull();
    });

    it('returns null when session has expired past 30-day grace', () => {
      const mock = createMockAuthSession('artist@mecraft.dev', 'free_member');
      mock.issuedAt = Date.now() - (35 * 24 * 60 * 60 * 1000);
      saveAuthSession(mock);

      expect(getAuthSession()).toBeNull();
    });
  });

  describe('Tier Badge Metadata', () => {
    it('returns correct label and styling flags for tiers', () => {
      const freeBadge = getTierBadge('free_member');
      expect(freeBadge.label).toBe('FREE MEMBER');
      expect(freeBadge.isPro).toBe(false);

      const proBadge = getTierBadge('pro_monthly');
      expect(proBadge.label).toBe('PRO CREATOR');
      expect(proBadge.isPro).toBe(true);

      const lifetimeBadge = getTierBadge('lifetime');
      expect(lifetimeBadge.label).toBe('LIFETIME PRO');
      expect(lifetimeBadge.isPro).toBe(true);
    });
  });

  describe('Real-Time Cross-App & Desktop Synchronization', () => {
    it('notifies listeners when session is saved or cleared', () => {
      const received: (AuthSession | null)[] = [];
      const unsubscribe = onAuthSessionChange((session) => {
        received.push(session);
      });

      const mock = createMockAuthSession('sync_user@mecraft.dev', 'pro_monthly');
      saveAuthSession(mock);
      expect(received.length).toBe(1);
      expect(received[0]?.user.email).toBe('sync_user@mecraft.dev');

      clearAuthSession();
      expect(received.length).toBe(2);
      expect(received[1]).toBeNull();

      unsubscribe();
      saveAuthSession(mock);
      // Listener should not receive after unsubscribe
      expect(received.length).toBe(2);
    });

    it('exports and imports portable sync codes accurately', () => {
      const original = createMockAuthSession('web_creator@mecraft.dev', 'lifetime');
      const syncCode = exportAuthSyncCode(original);
      expect(syncCode).toMatch(/^MC3\./);

      // Clear current session
      clearAuthSession();
      expect(getAuthSession()).toBeNull();

      // Import the code
      const restored = importAuthSyncCode(syncCode);
      expect(restored).not.toBeNull();
      expect(restored?.user.email).toBe('web_creator@mecraft.dev');
      expect(restored?.user.tier).toBe('lifetime');

      // Verify it was persisted to storage
      const inStorage = getAuthSession();
      expect(inStorage?.user.email).toBe('web_creator@mecraft.dev');
    });

    it('rejects invalid or corrupted sync codes gracefully', () => {
      expect(importAuthSyncCode('')).toBeNull();
      expect(importAuthSyncCode('MC3.invalid_base64_payload')).toBeNull();
      expect(importAuthSyncCode('not_a_code')).toBeNull();
    });
  });
});
