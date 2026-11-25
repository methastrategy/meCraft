/**
 * @file thai-utils.ts
 * meCraft Core Bridge — Advanced Thai Localization & Typography Engine
 * Provides Thai Numeral Conversion, BahtText, Buddhist Era Dates, and Word Segmentation
 * 100% In-Device Memory Privacy
 */

export const THAI_DIGITS = ['๐', '๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘', '๙'];
export const ARABIC_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

const THAI_MONTHS_FULL = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

const THAI_MONTHS_SHORT = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
];

const THAI_NUM_WORDS = ['', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
const THAI_DIGIT_UNITS = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน'];

/**
 * Converts Arabic digits (0-9) to Thai numerals (๐-๙)
 */
export function toThaiNumerals(input: string | number): string {
  const str = String(input);
  return str.replace(/[0-9]/g, (digit) => THAI_DIGITS[Number(digit)] || digit);
}

/**
 * Converts Thai numerals (๐-๙) to Arabic digits (0-9)
 */
export function toArabicNumerals(input: string): string {
  return input.replace(/[๐-๙]/g, (digit) => {
    const idx = THAI_DIGITS.indexOf(digit);
    return idx !== -1 ? String(idx) : digit;
  });
}

/**
 * Toggles digits between Arabic and Thai numerals based on dominant count
 */
export function toggleThaiNumerals(input: string): string {
  const thaiCount = (input.match(/[๐-๙]/g) || []).length;
  const arabicCount = (input.match(/[0-9]/g) || []).length;
  if (thaiCount > arabicCount) {
    return toArabicNumerals(input);
  }
  return toThaiNumerals(input);
}

/**
 * Converts a Gregorian year (CE) or Date into Thai Buddhist Era year (BE)
 */
export function toThaiBuddhistYear(yearOrDate: number | Date = new Date()): number {
  const year = typeof yearOrDate === 'number' ? yearOrDate : yearOrDate.getFullYear();
  return year + 543;
}

export interface ThaiDateOptions {
  buddhistEra?: boolean;
  monthStyle?: 'short' | 'long';
  thaiDigits?: boolean;
}

/**
 * Formats a Date into standard Thai format (e.g. 25 พฤศจิกายน 2569)
 */
export function formatThaiDate(date: Date = new Date(), options: ThaiDateOptions = {}): string {
  const {
    buddhistEra = true,
    monthStyle = 'long',
    thaiDigits = false,
  } = options;

  const day = date.getDate();
  const monthIdx = date.getMonth();
  const year = buddhistEra ? toThaiBuddhistYear(date) : date.getFullYear();

  const monthName = monthStyle === 'short'
    ? THAI_MONTHS_SHORT[monthIdx]
    : THAI_MONTHS_FULL[monthIdx];

  const formatted = `${day} ${monthName} ${year}`;
  return thaiDigits ? toThaiNumerals(formatted) : formatted;
}

/**
 * Converts currency amount into Thai Baht text (BAHTTEXT)
 * Example: 1250.50 -> หนึ่งพันสองร้อยห้าสิบบาทห้าสิบสตางค์
 */
export function toThaiBahtText(amount: number): string {
  if (isNaN(amount) || !isFinite(amount)) return 'ศูนย์บาทถ้วน';
  if (amount === 0) return 'ศูนย์บาทถ้วน';

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  // Round to 2 decimal places
  const parts = absAmount.toFixed(2).split('.');
  const integerPart = parts[0] || '0';
  const decimalPart = parts[1] || '00';

  function convertGroup(numStr: string, isLeadingGroup = false): string {
    let output = '';
    const len = numStr.length;

    for (let i = 0; i < len; i++) {
      const digit = Number(numStr[i]);
      const pos = len - i - 1;

      if (digit === 0) continue;

      if (pos === 1 && digit === 1) {
        output += 'สิบ';
      } else if (pos === 1 && digit === 2) {
        output += 'ยี่สิบ';
      } else if (pos === 0 && digit === 1) {
        const hasPrecedingNonZero = numStr.slice(0, -1).split('').some(c => c !== '0');
        if (hasPrecedingNonZero || !isLeadingGroup) {
          output += 'เอ็ด';
        } else {
          output += 'หนึ่ง';
        }
      } else {
        output += (THAI_NUM_WORDS[digit] || '') + (THAI_DIGIT_UNITS[pos] || '');
      }
    }
    return output;
  }

  function convertFullInteger(numStr: string): string {
    if (Number(numStr) === 0) return '';
    let result = '';
    let remaining = numStr;
    let groupIndex = 0;

    while (remaining.length > 6) {
      const chunk = remaining.slice(-6);
      remaining = remaining.slice(0, -6);
      const isLeading = false;
      const groupText = convertGroup(chunk, isLeading);
      if (groupText) {
        result = groupText + result;
      }
      result = 'ล้าน' + result;
      groupIndex++;
    }

    const isLeading = groupIndex === 0 || remaining !== '0';
    result = convertGroup(remaining, isLeading) + result;
    return result;
  }

  let bahtText = '';
  const intWords = convertFullInteger(integerPart);
  if (intWords) {
    bahtText += intWords + 'บาท';
  }

  const satangNum = Number(decimalPart);
  if (satangNum === 0) {
    bahtText += 'ถ้วน';
  } else {
    bahtText += convertGroup(decimalPart) + 'สตางค์';
  }

  return (isNegative ? 'ลบ' : '') + bahtText;
}

/**
 * Segments words using Intl.Segmenter with graceful character-fallback
 */
export function segmentThaiWords(text: string): string[] {
  if (!text) return [];
  if (typeof Intl !== 'undefined' && (Intl as any).Segmenter) {
    try {
      const segmenter = new (Intl as any).Segmenter(['th', 'en'], { granularity: 'word' });
      const segments: string[] = [];
      for (const seg of segmenter.segment(text)) {
        if (seg.isWordLike) {
          segments.push(seg.segment);
        }
      }
      return segments;
    } catch {
      // fallback
    }
  }
  return text.split(/\s+/).filter(w => w.length > 0);
}

/**
 * Accurately counts words for mixed Thai-Latin text
 */
export function countWordsThaiMixed(text: string): number {
  if (!text || text.trim() === '') return 0;
  return segmentThaiWords(text).length;
}
