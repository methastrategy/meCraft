import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sanitizeRenderedHtml as sanitizeMedoc } from '../../../apps/medocs/src/engines/MarkdownEngine';
import { sanitizeRenderedHtml as sanitizeMeide, renderMarkdownHtml } from '../../../apps/meide/src/main';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = fs.realpathSync(path.resolve(__dirname, '../../..'));
const appsDir = path.join(rootDir, 'apps');

const APPS_15 = [
  'me3d',
  'meaudio',
  'mecraft-launcher',
  'medeck',
  'medesign',
  'medocs',
  'medrop',
  'mefilm',
  'meide',
  'melight',
  'memotion',
  'mepdf',
  'mephoto',
  'mesheet',
  'mevector',
];

describe('🛡️ meCraft Ecosystem Security Hardening Verification Suite', () => {
  describe('Step 1: Desktop Tauri CSP Invariant across All 15 Apps', () => {
    for (const app of APPS_15) {
      it(`enforces strict Content Security Policy in ${app}/src-tauri/tauri.conf.json`, () => {
        const confPath = path.join(appsDir, app, 'src-tauri', 'tauri.conf.json');
        expect(fs.existsSync(confPath)).toBe(true);

        const conf = JSON.parse(fs.readFileSync(confPath, 'utf8'));
        expect(conf.app).toBeDefined();
        expect(conf.app.security).toBeDefined();
        expect(conf.app.security.csp).toBeDefined();
        expect(typeof conf.app.security.csp).toBe('string');
        expect(conf.app.security.csp).toContain("default-src 'self'");
        expect(conf.app.security.csp).toContain("script-src 'self'");
        expect(conf.app.security.csp).not.toContain('*');
      });
    }
  });

  describe('Step 2: Filesystem ACL Hardening across All 15 Apps', () => {
    for (const app of APPS_15) {
      it(`restricts filesystem access in ${app}/src-tauri/capabilities/default.json to explicit sandboxed directories`, () => {
        const capPath = path.join(appsDir, app, 'src-tauri', 'capabilities', 'default.json');
        expect(fs.existsSync(capPath)).toBe(true);

        const cap = JSON.parse(fs.readFileSync(capPath, 'utf8'));
        expect(cap.identifier).toBe('default');
        expect(Array.isArray(cap.permissions)).toBe(true);

        // Find fs:allow-read-file and fs:allow-write-file
        const readFilePerm = cap.permissions.find(
          (p: any) => typeof p === 'object' && p.identifier === 'fs:allow-read-file'
        );
        const writeFilePerm = cap.permissions.find(
          (p: any) => typeof p === 'object' && p.identifier === 'fs:allow-write-file'
        );

        expect(readFilePerm).toBeDefined();
        expect(writeFilePerm).toBeDefined();

        // Must NOT contain bare wildcard '**'
        const readPaths = readFilePerm.allow.map((a: any) => a.path);
        const writePaths = writeFilePerm.allow.map((a: any) => a.path);

        expect(readPaths).not.toContain('**');
        expect(writePaths).not.toContain('**');

        // Must contain explicit directory variables
        expect(readPaths.some((p: string) => p.startsWith('$APPLOCALDATA'))).toBe(true);
        expect(readPaths.some((p: string) => p.startsWith('$DOCUMENT'))).toBe(true);
        expect(readPaths.some((p: string) => p.startsWith('$DOWNLOAD'))).toBe(true);
      });
    }
  });

  describe('Step 4: Stored XSS Neutralization in meDoc & meIDE', () => {
    const xssAttackVectors = [
      '<script>alert("xss")</script>',
      '<script src="https://attacker.com/evil.js"></script>',
      '<SCRIPT/XSS SRC="http://evil.com/xss.js"></SCRIPT>',
      '<iframe src="javascript:alert(1)"></iframe>',
      '<img src="x" onerror="evilFn()">',
      '<svg/onload="evilFn()">',
      '<a href="javascript:alert(\'pwned\')">Click me</a>',
      '<a href="  JAVASCRIPT:alert(1)">Click me</a>',
      '<a href="vbscript:msgbox(1)">Click me</a>',
      '<form action="javascript:steal()"><input type="submit"></form>',
      '<base href="http://evil.com/">',
      '<object data="data:text/html,<script>alert(1)</script>"></object>',
      '<a href="&#106;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;alert(1)">Entity XSS</a>',
      '<a href="jav&#x09;ascript:alert(1)">Tab Entity</a>',
      '<a href="javascript&colon;alert(1)">Colon Entity</a>',
      '<a href="data:text/html,<script>alert(1)</script>">Data Link</a>',
      '<scr<script></script>ipt>nestedAttack()</script>',
      '<style>body { background: url("javascript:alert(1)"); }</style>',
    ];

    it('neutralizes all XSS attack vectors in meDoc sanitizeRenderedHtml', () => {
      for (const vector of xssAttackVectors) {
        const clean = sanitizeMedoc(vector);
        expect(clean).not.toContain('<script');
        expect(clean).not.toContain('evil.js');
        expect(clean).not.toContain('<iframe');
        expect(clean).not.toContain('onerror=');
        expect(clean).not.toContain('onload=');
        expect(clean).not.toContain('javascript:');
        expect(clean).not.toContain('JAVASCRIPT:');
        expect(clean).not.toContain('vbscript:');
        expect(clean).not.toContain('<base');
        expect(clean).not.toContain('<object');
        expect(clean).not.toContain('<style');
        expect(clean).not.toContain('nestedAttack');
        expect(clean).not.toMatch(/href\s*=\s*["']?&#106;/i);
      }
    });

    it('neutralizes all XSS attack vectors in meIDE sanitizeRenderedHtml', () => {
      for (const vector of xssAttackVectors) {
        const clean = sanitizeMeide(vector);
        expect(clean).not.toContain('<script');
        expect(clean).not.toContain('evil.js');
        expect(clean).not.toContain('<iframe');
        expect(clean).not.toContain('onerror=');
        expect(clean).not.toContain('onload=');
        expect(clean).not.toContain('javascript:');
        expect(clean).not.toContain('JAVASCRIPT:');
        expect(clean).not.toContain('vbscript:');
        expect(clean).not.toContain('<base');
        expect(clean).not.toContain('<object');
        expect(clean).not.toContain('<style');
        expect(clean).not.toContain('nestedAttack');
        expect(clean).not.toMatch(/href\s*=\s*["']?&#106;/i);
      }
    });

    it('safely renders meIDE markdown preview without executing injected scripts or event handlers', () => {
      const maliciousMd = `# Document Title
Here is a test paragraph.

<script>stealEverything()</script>
<img src="bad.jpg" onerror="alert(document.domain)">
[Harmless Link](https://mecrafts.vercel.app)
[Evil Link](javascript:alert("XSS"))
`;
      const html = renderMarkdownHtml(maliciousMd);
      expect(html).toContain('Document Title');
      expect(html).toContain('https://mecrafts.vercel.app');
      expect(html).not.toContain('stealEverything()');
      expect(html).not.toContain('onerror=');
      expect(html).not.toContain('href="javascript:');
    });
  });

  describe('Step 5: Windows SmartScreen Trust & Antivirus Verification in Downloads Portal', () => {
    it('verifies SmartScreen modal, SHA-256 table, and VirusTotal clean links in public/downloads.html', () => {
      const downloadsPath = path.join(rootDir, 'public', 'downloads.html');
      expect(fs.existsSync(downloadsPath)).toBe(true);

      const html = fs.readFileSync(downloadsPath, 'utf8');

      // 1. Windows SmartScreen guide modal and trigger buttons
      expect(html).toContain('Windows SmartScreen');
      expect(html).toContain('smartscreen-modal-overlay');
      expect(html).toContain('btn-open-smartscreen');

      // 2. SHA-256 Checksums table
      expect(html).toContain('SHA-256');
      expect(html).toContain('th_col_hash');
      expect(html).toContain('cmd-sample');

      // 3. VirusTotal clean link and badge
      expect(html).toContain('virustotal.com');
      expect(html).toContain('0/72 Clean');
    });
  });
});
