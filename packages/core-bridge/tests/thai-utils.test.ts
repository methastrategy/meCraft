import { describe, it, expect } from 'vitest';
import {
  toThaiNumerals,
  toArabicNumerals,
  toggleThaiNumerals,
  toThaiBuddhistYear,
  formatThaiDate,
  toThaiBahtText,
  segmentThaiWords,
  countWordsThaiMixed,
} from '../src/thai-utils';

describe('meCraft Thai Localization Engine (@mecraft/core-bridge)', () => {
  it('converts Arabic numerals to Thai numerals accurately', () => {
    expect(toThaiNumerals(1234567890)).toBe('๑๒๓๔๕๖๗๘๙๐');
    expect(toThaiNumerals('ปี ค.ศ. 2026 ราคา 1,500.50 บาท')).toBe('ปี ค.ศ. ๒๐๒๖ ราคา ๑,๕๐๐.๕๐ บาท');
  });

  it('converts Thai numerals to Arabic numerals accurately', () => {
    expect(toArabicNumerals('๑๒๓๔๕๖๗๘๙๐')).toBe('1234567890');
    expect(toArabicNumerals('พ.ศ. ๒๕๖๙')).toBe('พ.ศ. 2569');
  });

  it('toggles Thai and Arabic numerals seamlessly based on dominant count', () => {
    expect(toggleThaiNumerals('ราคา 1,500 บาท')).toBe('ราคา ๑,๕๐๐ บาท');
    expect(toggleThaiNumerals('ราคา ๑,๕๐๐ บาท')).toBe('ราคา 1,500 บาท');
  });

  it('converts CE Gregorian year to BE Buddhist Era year', () => {
    expect(toThaiBuddhistYear(2026)).toBe(2569);
    const d = new Date(2026, 10, 25);
    expect(toThaiBuddhistYear(d)).toBe(2569);
  });

  it('formats Thai dates in official and abbreviated styles', () => {
    const d = new Date(2026, 10, 25); // Nov 25, 2026
    expect(formatThaiDate(d)).toBe('25 พฤศจิกายน 2569');
    expect(formatThaiDate(d, { monthStyle: 'short' })).toBe('25 พ.ย. 2569');
    expect(formatThaiDate(d, { thaiDigits: true })).toBe('๒๕ พฤศจิกายน ๒๕๖๙');
    expect(formatThaiDate(d, { buddhistEra: false })).toBe('25 พฤศจิกายน 2026');
  });

  it('converts numbers to Thai BahtText correctly', () => {
    expect(toThaiBahtText(0)).toBe('ศูนย์บาทถ้วน');
    expect(toThaiBahtText(100)).toBe('หนึ่งร้อยบาทถ้วน');
    expect(toThaiBahtText(101)).toBe('หนึ่งร้อยเอ็ดบาทถ้วน');
    expect(toThaiBahtText(21)).toBe('ยี่สิบเอ็ดบาทถ้วน');
    expect(toThaiBahtText(1250.50)).toBe('หนึ่งพันสองร้อยห้าสิบบาทห้าสิบสตางค์');
    expect(toThaiBahtText(1000000)).toBe('หนึ่งล้านบาทถ้วน');
    expect(toThaiBahtText(-50)).toBe('ลบห้าสิบบาทถ้วน');
  });

  it('segments Thai words accurately and counts mixed-script words', () => {
    const mixed = 'meCraft ระบบเอกสารภาษาไทย รองรับฟอนต์สารบรรณ';
    const words = segmentThaiWords(mixed);
    expect(words.length).toBeGreaterThan(3);
    expect(countWordsThaiMixed(mixed)).toBeGreaterThan(3);
    expect(countWordsThaiMixed('')).toBe(0);
  });
});
