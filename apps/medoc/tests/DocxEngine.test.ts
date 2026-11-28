import { describe, it, expect } from 'vitest';
import { exportHtmlToDocx, parseDocxToHtml } from '../src/engines/DocxEngine';
import fs from 'node:fs';
import path from 'node:path';

describe('meDoc Native OpenXML (.docx) Engine', () => {
  it('exports HTML with Thai text, headings, and formatting to valid DOCX bytes', async () => {
    const html = `
      <h1>บันทึกข้อความราชการ</h1>
      <p>ส่วนราชการ: สำนักวิจัยและพัฒนาระบบ <strong>กลุ่มงานสถาปัตยกรรมดิจิทัล</strong></p>
      <p>เรื่อง: รายงานผลการทดสอบระบบ <em>meDoc Studio</em> ภาษาไทย</p>
      <p>ทดสอบสระและวรรณยุกต์: กำลังใจ ผู้ใช้งาน วรรณยุกต์ สารบรรณ ๑๒๓๔๕</p>
    `;

    const bytes = await exportHtmlToDocx(html, { title: 'Test Document' });
    expect(bytes).toBeDefined();
    expect(bytes.length).toBeGreaterThan(1000);

    // Verify DOCX / PK Zip header: [0x50, 0x4B, 0x03, 0x04]
    expect(bytes[0]).toBe(0x50);
    expect(bytes[1]).toBe(0x4b);
    expect(bytes[2]).toBe(0x03);
    expect(bytes[3]).toBe(0x04);
  });

  it('performs roundtrip parsing: HTML -> DOCX -> HTML with Thai Unicode integrity', async () => {
    const originalHtml = `
      <h1>บันทึกข้อความ</h1>
      <p>ข้อความทดสอบ <strong>ตัวหนา</strong> และ <em>ตัวเอียง</em></p>
      <p>ภาษาไทยทดสอบสระและวรรณยุกต์ กำลังใจ ผู้ใช้งาน</p>
    `;

    const bytes = await exportHtmlToDocx(originalHtml);
    const parsedHtml = await parseDocxToHtml(bytes);

    expect(parsedHtml).toContain('บันทึกข้อความ');
    expect(parsedHtml).toContain('กำลังใจ');
    expect(parsedHtml).toContain('ผู้ใช้งาน');
    expect(parsedHtml).toContain('วรรณยุกต์');
    expect(parsedHtml).toContain('<strong>ตัวหนา</strong>');
    expect(parsedHtml).toContain('<em>ตัวเอียง</em>');
  });

  it('successfully parses real pre-generated fixture DOCX files', async () => {
    const fixturesDir = path.resolve(__dirname, 'fixtures');
    const memoDocxPath = path.join(fixturesDir, 'memo-thai.docx');
    expect(fs.existsSync(memoDocxPath)).toBe(true);

    const buf = fs.readFileSync(memoDocxPath);
    const html = await parseDocxToHtml(buf);

    expect(html).toContain('บันทึกข้อความ');
    expect(html).toContain('สำนักวิจัยและพัฒนาระบบ');
    expect(html).toContain('TH Sarabun New');
  });

  it('handles tables and renders them into HTML table structure', async () => {
    const htmlWithTable = `
      <h2>ตารางสรุปงบประมาณ</h2>
      <table>
        <tr><th>ลำดับ</th><th>รายการ</th><th>จำนวนเงิน</th></tr>
        <tr><td>๑</td><td>ระบบ meDoc Studio</td><td>๑,๒๕๐,๐๐๐ บาท</td></tr>
      </table>
    `;

    const bytes = await exportHtmlToDocx(htmlWithTable);
    const parsedHtml = await parseDocxToHtml(bytes);

    expect(parsedHtml).toContain('ตารางสรุปงบประมาณ');
    expect(parsedHtml).toContain('ระบบ meDoc Studio');
    expect(parsedHtml).toContain('๑,๒๕๐,๐๐๐ บาท');
  });
});
