import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('meDoc Reusable Test Fixtures & Packaging Verification Suite', () => {
  const fixturesDir = path.resolve(__dirname, 'fixtures');

  const fixtureNames = [
    'memo-thai',
    'letter-thai',
    'meeting-thai',
    'multipage-table',
    'mixed-thai-en-nums',
    'medoc-starter',
  ];

  it('contains all 6 required fixture markdown files with valid Thai & technical content', () => {
    for (const name of fixtureNames) {
      const mdPath = path.join(fixturesDir, `${name}.md`);
      expect(fs.existsSync(mdPath)).toBe(true);
      const content = fs.readFileSync(mdPath, 'utf8');
      expect(content.length).toBeGreaterThan(100);
    }
  });

  it('validates official memo contains Thai government memo headers & Thai numerals', () => {
    const memo = fs.readFileSync(path.join(fixturesDir, 'memo-thai.md'), 'utf8');
    expect(memo).toContain('บันทึกข้อความ');
    expect(memo).toContain('ส่วนราชการ:');
    expect(memo).toContain('๒๕๖๙');
    expect(memo).toContain('TH Sarabun New');
  });

  it('validates external letter fixture contains standard Thai administrative format', () => {
    const letter = fs.readFileSync(path.join(fixturesDir, 'letter-thai.md'), 'utf8');
    expect(letter).toContain('หนังสือภายนอก');
    expect(letter).toContain('ระเบียบสำนักนายกรัฐมนตรีว่าด้วยงานสารบรรณ');
    expect(letter).toContain('๑๐๐% In-Device RAM Privacy');
  });

  it('validates multipage table contains structured data and BAHTTEXT currency notes', () => {
    const table = fs.readFileSync(path.join(fixturesDir, 'multipage-table.md'), 'utf8');
    expect(table).toContain('BAHTTEXT');
    expect(table).toContain('หนึ่งล้านสองแสนห้าหมื่นบาทถ้วน');
    expect(table).toContain('| ๑ | `medoc` | meDoc Studio |');
  });

  it('verifies generated DOCX round-trip binaries exist and have valid ZIP/DOCX signatures', () => {
    for (const name of fixtureNames) {
      const docxPath = path.join(fixturesDir, `${name}.docx`);
      const roundtripPath = path.join(fixturesDir, `${name}-roundtrip.docx`);

      expect(fs.existsSync(docxPath)).toBe(true);
      expect(fs.existsSync(roundtripPath)).toBe(true);

      const buf1 = fs.readFileSync(docxPath);
      const buf2 = fs.readFileSync(roundtripPath);

      // DOCX standard PK zip header: [0x50, 0x4B, 0x03, 0x04]
      expect(buf1[0]).toBe(0x50);
      expect(buf1[1]).toBe(0x4b);
      expect(buf2[0]).toBe(0x50);
      expect(buf2[1]).toBe(0x4b);
    }
  });

  it('verifies rendered page 1 PNGs exist with valid PNG magic headers', () => {
    const renderDir = path.join(fixturesDir, 'rendered');
    for (const name of fixtureNames) {
      const pngPath = path.join(renderDir, `${name}-p1.png`);
      expect(fs.existsSync(pngPath)).toBe(true);

      const buf = fs.readFileSync(pngPath);
      // PNG header: \x89PNG\r\n\x1a\n -> [0x89, 0x50, 0x4E, 0x47]
      expect(buf[0]).toBe(0x89);
      expect(buf[1]).toBe(0x50);
      expect(buf[2]).toBe(0x4e);
      expect(buf[3]).toBe(0x47);
    }
  });
});
