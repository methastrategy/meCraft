import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  parseSemver,
  compareSemver,
  extractChangelogItems,
  checkSoftwareUpdate,
} from '../src/updater';

describe('meCraft Universal Update Engine (@mecraft/core-bridge)', () => {
  describe('parseSemver', () => {
    it('parses standard semver strings with and without v prefix', () => {
      expect(parseSemver('1.0.0')).toEqual([1, 0, 0]);
      expect(parseSemver('v1.0.0')).toEqual([1, 0, 0]);
      expect(parseSemver('v1.2.3')).toEqual([1, 2, 3]);
      expect(parseSemver('3.2.1-beta')).toEqual([3, 2, 1]);
      expect(parseSemver('2.1')).toEqual([2, 1, 0]);
      expect(parseSemver('')).toEqual([1, 0, 0]);
    });
  });

  describe('compareSemver', () => {
    it('accurately identifies newer, older, and identical versions', () => {
      expect(compareSemver('1.0.1', '1.0.0')).toBe(1);
      expect(compareSemver('1.1.0', '1.0.9')).toBe(1);
      expect(compareSemver('2.0.0', '1.9.9')).toBe(1);
      expect(compareSemver('1.0.0', '1.0.1')).toBe(-1);
      expect(compareSemver('1.0.0', '1.0.0')).toBe(0);
      expect(compareSemver('v1.0.0', '1.0.0')).toBe(0);
    });
  });

  describe('extractChangelogItems', () => {
    it('extracts bullet points from markdown release notes', () => {
      const markdown = `
# Release Notes
* Fixed installer duplicate window launch
* Added SSO Sign In & Profile Modal
* Added Universal File Dropzone
- Enhanced OCR text layer injection
- Added 11-app matrix switcher
      `;
      const bullets = extractChangelogItems(markdown);
      expect(bullets.length).toBe(5);
      expect(bullets[0]).toBe('Fixed installer duplicate window launch');
      expect(bullets[1]).toBe('Added SSO Sign In & Profile Modal');
      expect(bullets[3]).toBe('Enhanced OCR text layer injection');
    });

    it('returns fallback text for empty markdown bodies', () => {
      const bullets = extractChangelogItems('');
      expect(bullets.length).toBeGreaterThan(0);
      expect(bullets[0]).toContain('ทั่วไป');
    });
  });

  describe('checkSoftwareUpdate API Integration', () => {
    beforeEach(() => {
      vi.restoreAllMocks();
      if (typeof localStorage !== 'undefined') {
        localStorage.clear();
      }
    });

    it('detects available updates when latest remote tag is newer than current', async () => {
      const mockRelease = {
        tag_name: 'v1.0.1',
        name: 'meCraft Suite v1.0.1',
        published_at: '2026-11-24T12:00:00Z',
        body: '* Fix installer hook\n* In-app update modal',
        html_url: 'https://github.com/methastrategy/meCraft/releases/tag/v1.0.1',
        assets: [
          {
            name: 'mecraft.exe',
            size: 107500000,
            browser_download_url: 'https://github.com/methastrategy/meCraft/releases/download/v1.0.1/mecraft.exe',
            content_type: 'application/x-msdownload',
          },
          {
            name: 'mepdf.exe',
            size: 32000000,
            browser_download_url: 'https://github.com/methastrategy/meCraft/releases/download/v1.0.1/mepdf.exe',
            content_type: 'application/x-msdownload',
          },
        ],
      };

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockRelease,
      });

      const update = await checkSoftwareUpdate({
        currentVersion: '1.0.0',
        force: true,
      });

      expect(update.hasUpdate).toBe(true);
      expect(update.latestVersion).toBe('1.0.1');
      expect(update.releaseTag).toBe('v1.0.1');
      expect(update.suiteAsset?.name).toBe('mecraft.exe');
      expect(update.changelog.length).toBe(2);
      expect(update.changelog[0]).toBe('Fix installer hook');
    });

    it('does not offer an unrecognized or legacy release if mecraft.exe is missing', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          tag_name: 'v1.0.11',
          assets: [{
            name: 'other-package.zip',
            browser_download_url: 'https://github.com/methastrategy/meCraft/releases/download/v1.0.11/other-package.zip',
          }],
        }),
      });
      const update = await checkSoftwareUpdate({ currentVersion: '1.0.10', force: true });
      expect(update.suiteAsset).toBeUndefined();
      expect(update.hasUpdate).toBe(false);
    });

    it('gracefully handles offline or network errors without crashing', async () => {
      globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network Offline'));

      const update = await checkSoftwareUpdate({
        currentVersion: '1.0.0',
        force: true,
      });

      expect(update.hasUpdate).toBe(false);
      expect(update.isOffline).toBe(true);
      expect(update.latestVersion).toBe('1.0.0');
    });
  });
});
