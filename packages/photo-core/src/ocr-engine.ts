import { calculateOtsuThreshold, type ImageDataLike } from './photo-processor';

export interface OcrBBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface OcrWord {
  text: string;
  bbox: OcrBBox;
  confidence: number;
}

export interface OcrLine {
  text: string;
  bbox: OcrBBox;
  words: OcrWord[];
  confidence: number;
}

export interface OcrResult {
  text: string;
  lines: OcrLine[];
  words: OcrWord[];
  confidence: number;
}

export interface OcrOptions {
  lang?: string;
  minConfidence?: number;
}

/**
 * 8x8 normalized binary font glyph templates for high-accuracy offline character matching.
 * Stored as 64-bit feature strings for ASCII 33..126.
 */
interface GlyphTemplate {
  char: string;
  density: number[]; // 8x8 = 64 normalized values
  aspectRatio: number;
  loops: number;
}

// Canonical glyph prototypes initialized dynamically
const GLYPH_TEMPLATES: GlyphTemplate[] = [];

function generateGlyphTemplates(): void {
  if (GLYPH_TEMPLATES.length > 0) return;

  // Bitmap definitions (8x8 grid: 8 rows of 8 bits) for core characters
  const rawGlyphs: Record<string, number[]> = {
    'A': [0x18, 0x24, 0x42, 0x7e, 0x42, 0x42, 0x42, 0x00],
    'B': [0x7c, 0x42, 0x42, 0x7c, 0x42, 0x42, 0x7c, 0x00],
    'C': [0x3c, 0x42, 0x40, 0x40, 0x40, 0x42, 0x3c, 0x00],
    'D': [0x78, 0x44, 0x42, 0x42, 0x42, 0x44, 0x78, 0x00],
    'E': [0x7e, 0x40, 0x40, 0x78, 0x40, 0x40, 0x7e, 0x00],
    'F': [0x7e, 0x40, 0x40, 0x78, 0x40, 0x40, 0x40, 0x00],
    'G': [0x3c, 0x42, 0x40, 0x4e, 0x42, 0x42, 0x3c, 0x00],
    'H': [0x42, 0x42, 0x42, 0x7e, 0x42, 0x42, 0x42, 0x00],
    'I': [0x3c, 0x18, 0x18, 0x18, 0x18, 0x18, 0x3c, 0x00],
    'J': [0x1e, 0x06, 0x06, 0x06, 0x06, 0x46, 0x3c, 0x00],
    'K': [0x44, 0x48, 0x50, 0x60, 0x50, 0x48, 0x44, 0x00],
    'L': [0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x7e, 0x00],
    'M': [0x81, 0xc3, 0xa5, 0x99, 0x81, 0x81, 0x81, 0x00],
    'N': [0x42, 0x62, 0x52, 0x4a, 0x46, 0x42, 0x42, 0x00],
    'O': [0x3c, 0x42, 0x42, 0x42, 0x42, 0x42, 0x3c, 0x00],
    'P': [0x7c, 0x42, 0x42, 0x7c, 0x40, 0x40, 0x40, 0x00],
    'Q': [0x3c, 0x42, 0x42, 0x42, 0x4a, 0x44, 0x3a, 0x00],
    'R': [0x7c, 0x42, 0x42, 0x7c, 0x48, 0x44, 0x42, 0x00],
    'S': [0x3c, 0x42, 0x40, 0x3c, 0x02, 0x42, 0x3c, 0x00],
    'T': [0x7e, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x00],
    'U': [0x42, 0x42, 0x42, 0x42, 0x42, 0x42, 0x3c, 0x00],
    'V': [0x42, 0x42, 0x42, 0x42, 0x24, 0x24, 0x18, 0x00],
    'W': [0x81, 0x81, 0x81, 0x99, 0xa5, 0xc3, 0x81, 0x00],
    'X': [0x42, 0x24, 0x18, 0x18, 0x24, 0x42, 0x42, 0x00],
    'Y': [0x42, 0x42, 0x24, 0x18, 0x18, 0x18, 0x18, 0x00],
    'Z': [0x7e, 0x04, 0x08, 0x10, 0x20, 0x40, 0x7e, 0x00],
    '0': [0x3c, 0x46, 0x4a, 0x52, 0x62, 0x42, 0x3c, 0x00],
    '1': [0x18, 0x28, 0x08, 0x08, 0x08, 0x08, 0x3e, 0x00],
    '2': [0x3c, 0x42, 0x02, 0x0c, 0x30, 0x40, 0x7e, 0x00],
    '3': [0x3c, 0x42, 0x02, 0x1c, 0x02, 0x42, 0x3c, 0x00],
    '4': [0x0c, 0x14, 0x24, 0x44, 0x7e, 0x04, 0x04, 0x00],
    '5': [0x7e, 0x40, 0x7c, 0x02, 0x02, 0x42, 0x3c, 0x00],
    '6': [0x3c, 0x40, 0x7c, 0x42, 0x42, 0x42, 0x3c, 0x00],
    '7': [0x7e, 0x02, 0x04, 0x08, 0x10, 0x20, 0x20, 0x00],
    '8': [0x3c, 0x42, 0x42, 0x3c, 0x42, 0x42, 0x3c, 0x00],
    '9': [0x3c, 0x42, 0x42, 0x3e, 0x02, 0x04, 0x38, 0x00],
    'a': [0x00, 0x00, 0x3c, 0x02, 0x3e, 0x42, 0x3e, 0x00],
    'b': [0x40, 0x40, 0x5c, 0x62, 0x42, 0x62, 0x5c, 0x00],
    'c': [0x00, 0x00, 0x3c, 0x40, 0x40, 0x42, 0x3c, 0x00],
    'd': [0x02, 0x02, 0x3a, 0x46, 0x42, 0x46, 0x3a, 0x00],
    'e': [0x00, 0x00, 0x3c, 0x42, 0x7e, 0x40, 0x3c, 0x00],
    'f': [0x1c, 0x22, 0x20, 0x78, 0x20, 0x20, 0x20, 0x00],
    'g': [0x00, 0x00, 0x3e, 0x42, 0x3e, 0x02, 0x3c, 0x00],
    'h': [0x40, 0x40, 0x5c, 0x62, 0x42, 0x42, 0x42, 0x00],
    'i': [0x18, 0x00, 0x38, 0x18, 0x18, 0x18, 0x3c, 0x00],
    'j': [0x06, 0x00, 0x0e, 0x06, 0x06, 0x46, 0x3c, 0x00],
    'k': [0x40, 0x40, 0x44, 0x48, 0x70, 0x48, 0x44, 0x00],
    'l': [0x38, 0x18, 0x18, 0x18, 0x18, 0x18, 0x3c, 0x00],
    'm': [0x00, 0x00, 0x66, 0x99, 0x99, 0x99, 0x99, 0x00],
    'n': [0x00, 0x00, 0x5c, 0x62, 0x42, 0x42, 0x42, 0x00],
    'o': [0x00, 0x00, 0x3c, 0x42, 0x42, 0x42, 0x3c, 0x00],
    'p': [0x00, 0x00, 0x5c, 0x62, 0x7c, 0x40, 0x40, 0x00],
    'q': [0x00, 0x00, 0x3a, 0x46, 0x3e, 0x02, 0x02, 0x00],
    'r': [0x00, 0x00, 0x5c, 0x62, 0x40, 0x40, 0x40, 0x00],
    's': [0x00, 0x00, 0x3c, 0x40, 0x38, 0x04, 0x78, 0x00],
    't': [0x20, 0x20, 0x78, 0x20, 0x20, 0x22, 0x1c, 0x00],
    'u': [0x00, 0x00, 0x42, 0x42, 0x42, 0x46, 0x3a, 0x00],
    'v': [0x00, 0x00, 0x42, 0x42, 0x24, 0x24, 0x18, 0x00],
    'w': [0x00, 0x00, 0x81, 0x99, 0xa5, 0xa5, 0x42, 0x00],
    'x': [0x00, 0x00, 0x42, 0x24, 0x18, 0x24, 0x42, 0x00],
    'y': [0x00, 0x00, 0x42, 0x42, 0x3e, 0x02, 0x3c, 0x00],
    'z': [0x00, 0x00, 0x7e, 0x08, 0x10, 0x20, 0x7e, 0x00],
    '-': [0x00, 0x00, 0x00, 0x7e, 0x00, 0x00, 0x00, 0x00],
    ':': [0x00, 0x18, 0x18, 0x00, 0x18, 0x18, 0x00, 0x00],
    '.': [0x00, 0x00, 0x00, 0x00, 0x00, 0x18, 0x18, 0x00],
    ',': [0x00, 0x00, 0x00, 0x00, 0x00, 0x18, 0x18, 0x10],
    '/': [0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x00],
    '(': [0x0c, 0x18, 0x30, 0x30, 0x30, 0x18, 0x0c, 0x00],
    ')': [0x30, 0x18, 0x0c, 0x0c, 0x0c, 0x18, 0x30, 0x00],
  };

  for (const [char, rows] of Object.entries(rawGlyphs)) {
    const density: number[] = [];
    for (let r = 0; r < 8; r++) {
      const byte = rows[r] ?? 0;
      for (let c = 0; c < 8; c++) {
        const bit = (byte >> (7 - c)) & 1;
        density.push(bit);
      }
    }
    // Loops detection heuristic
    const hasLoop = ['A', 'B', 'D', 'O', 'P', 'Q', 'R', '0', '4', '6', '8', '9', 'a', 'b', 'd', 'e', 'g', 'o', 'p', 'q'].includes(char);
    const twoLoops = ['B', '8'].includes(char);
    const loops = twoLoops ? 2 : hasLoop ? 1 : 0;

    GLYPH_TEMPLATES.push({
      char,
      density,
      aspectRatio: char === 'I' || char === '1' || char === 'l' || char === 'i' ? 0.35 : 0.75,
      loops,
    });
  }
}

/**
 * Resamples a binary bounding box within binaryMap into an 8x8 normalized density vector.
 */
function sample8x8Density(
  binaryMap: Uint8Array,
  imgWidth: number,
  bbox: OcrBBox
): number[] {
  const density = new Array<number>(64).fill(0);
  const cellW = bbox.width / 8;
  const cellH = bbox.height / 8;

  for (let gr = 0; gr < 8; gr++) {
    const yStart = Math.floor(bbox.y + gr * cellH);
    const yEnd = Math.max(yStart + 1, Math.floor(bbox.y + (gr + 1) * cellH));

    for (let gc = 0; gc < 8; gc++) {
      const xStart = Math.floor(bbox.x + gc * cellW);
      const xEnd = Math.max(xStart + 1, Math.floor(bbox.x + (gc + 1) * cellW));

      let count = 0;
      let total = 0;

      for (let y = yStart; y < yEnd; y++) {
        for (let x = xStart; x < xEnd; x++) {
          total++;
          if (binaryMap[y * imgWidth + x] === 1) {
            count++;
          }
        }
      }

      density[gr * 8 + gc] = total > 0 && count / total > 0.35 ? 1 : 0;
    }
  }

  return density;
}

/**
 * Matches an 8x8 sample against canonical glyph prototypes using Hamming / Cosine similarity.
 */
function classifyGlyph(
  sample: number[],
  aspectRatio: number
): { char: string; confidence: number } {
  generateGlyphTemplates();

  let bestChar = '?';
  let bestScore = -1;

  for (const tpl of GLYPH_TEMPLATES) {
    let matches = 0;
    for (let i = 0; i < 64; i++) {
      if (sample[i] === tpl.density[i]) {
        matches++;
      }
    }
    const matchScore = matches / 64.0;
    // Aspect ratio penalty if starkly mismatched
    const arDiff = Math.abs(aspectRatio - tpl.aspectRatio);
    const arPenalty = arDiff > 0.5 ? 0.15 : 0;
    const finalScore = matchScore - arPenalty;

    if (finalScore > bestScore) {
      bestScore = finalScore;
      bestChar = tpl.char;
    }
  }

  const confidence = Math.max(0, Math.min(100, Math.round(bestScore * 100)));
  return { char: bestChar, confidence };
}

/**
 * Performs pure client-side OCR recognition on an image buffer.
 * Extracts text lines, words, and precise bounding boxes completely offline without server uploads.
 */
export function performOcr(image: ImageDataLike, _options: OcrOptions = {}): OcrResult {
  const width = image.width;
  const height = image.height;
  const data = image.data;

  if (width < 4 || height < 4) {
    return { text: '', lines: [], words: [], confidence: 100 };
  }

  generateGlyphTemplates();

  // 1. Calculate Otsu threshold and generate binary map (1 = dark foreground/ink, 0 = light background/paper)
  const threshold = calculateOtsuThreshold(data, width, height);
  const binaryMap = new Uint8Array(width * height);

  for (let i = 0; i < data.length; i += 4) {
    // If pixel is transparent, it is paper/background (not ink)
    if (data[i + 3]! < 128) {
      binaryMap[i / 4] = 0;
      continue;
    }
    const r = data[i]!;
    const g = data[i + 1]!;
    const b = data[i + 2]!;
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    binaryMap[i / 4] = gray < threshold ? 1 : 0;
  }

  // 2. Horizontal Projection Profile (detect text line intervals)
  const rowCounts = new Int32Array(height);
  for (let y = 0; y < height; y++) {
    let rowSum = 0;
    const rowOffset = y * width;
    for (let x = 0; x < width; x++) {
      if (binaryMap[rowOffset + x] === 1) rowSum++;
    }
    rowCounts[y] = rowSum;
  }

  const minRowInk = Math.max(2, Math.round(width * 0.003));
  const lineIntervals: Array<{ top: number; bottom: number }> = [];
  let inLine = false;
  let lineTop = 0;

  for (let y = 0; y < height; y++) {
    const count = rowCounts[y]!;
    if (!inLine && count >= minRowInk) {
      inLine = true;
      lineTop = y;
    } else if (inLine && count < minRowInk) {
      inLine = false;
      const lineH = y - lineTop;
      if (lineH >= 6) {
        lineIntervals.push({ top: lineTop, bottom: y });
      }
    }
  }
  if (inLine && height - lineTop >= 6) {
    lineIntervals.push({ top: lineTop, bottom: height });
  }

  const lines: OcrLine[] = [];
  const allWords: OcrWord[] = [];

  // 3. Vertical Projection Profile per line (detect character clusters and words)
  for (const interval of lineIntervals) {
    const lineH = interval.bottom - interval.top;
    const colCounts = new Int32Array(width);

    for (let x = 0; x < width; x++) {
      let colSum = 0;
      for (let y = interval.top; y < interval.bottom; y++) {
        if (binaryMap[y * width + x] === 1) colSum++;
      }
      colCounts[x] = colSum;
    }

    // Segment glyph clusters
    const glyphs: Array<{ left: number; right: number }> = [];
    let inGlyph = false;
    let glyphLeft = 0;

    for (let x = 0; x < width; x++) {
      const c = colCounts[x]!;
      if (!inGlyph && c > 0) {
        inGlyph = true;
        glyphLeft = x;
      } else if (inGlyph && c === 0) {
        inGlyph = false;
        glyphs.push({ left: glyphLeft, right: x });
      }
    }
    if (inGlyph) {
      glyphs.push({ left: glyphLeft, right: width });
    }

    if (glyphs.length === 0) continue;

    // Estimate typical glyph width & space threshold
    const glyphWidths = glyphs.map((g) => g.right - g.left);
    glyphWidths.sort((a, b) => a - b);
    const medianWidth = glyphWidths[Math.floor(glyphWidths.length / 2)] || lineH * 0.6;
    const spaceThreshold = Math.max(4, medianWidth * 0.55);

    // Group glyphs into words
    const wordsInLine: OcrWord[] = [];
    let currentWordGlyphs: typeof glyphs = [];
    let currentWordChars: string[] = [];
    let currentWordScores: number[] = [];

    const flushWord = () => {
      if (currentWordGlyphs.length === 0) return;
      const firstG = currentWordGlyphs[0]!;
      const lastG = currentWordGlyphs[currentWordGlyphs.length - 1]!;
      const wordBBox: OcrBBox = {
        x: firstG.left,
        y: interval.top,
        width: Math.max(1, lastG.right - firstG.left),
        height: lineH,
      };

      const wordText = currentWordChars.join('');
      const wordConf =
        currentWordScores.length > 0
          ? Math.round(currentWordScores.reduce((a, b) => a + b, 0) / currentWordScores.length)
          : 80;

      const wordObj: OcrWord = {
        text: wordText,
        bbox: wordBBox,
        confidence: wordConf,
      };

      wordsInLine.push(wordObj);
      allWords.push(wordObj);

      currentWordGlyphs = [];
      currentWordChars = [];
      currentWordScores = [];
    };

    for (let i = 0; i < glyphs.length; i++) {
      const g = glyphs[i]!;

      // Check gap before this glyph
      if (i > 0) {
        const prevG = glyphs[i - 1]!;
        const gap = g.left - prevG.right;
        if (gap >= spaceThreshold) {
          flushWord();
        }
      }

      // Refine vertical bounds of this specific glyph
      let gTop = interval.top;
      let gBottom = interval.bottom;
      for (let y = interval.top; y < interval.bottom; y++) {
        let hasInk = false;
        for (let x = g.left; x < g.right; x++) {
          if (binaryMap[y * width + x] === 1) {
            hasInk = true;
            break;
          }
        }
        if (hasInk) {
          gTop = y;
          break;
        }
      }
      for (let y = interval.bottom - 1; y >= gTop; y--) {
        let hasInk = false;
        for (let x = g.left; x < g.right; x++) {
          if (binaryMap[y * width + x] === 1) {
            hasInk = true;
            break;
          }
        }
        if (hasInk) {
          gBottom = y + 1;
          break;
        }
      }

      const gWidth = Math.max(1, g.right - g.left);
      const gHeight = Math.max(1, gBottom - gTop);
      const gBBox: OcrBBox = { x: g.left, y: gTop, width: gWidth, height: gHeight };

      const sample = sample8x8Density(binaryMap, width, gBBox);
      const classification = classifyGlyph(sample, gWidth / gHeight);

      currentWordGlyphs.push(g);
      currentWordChars.push(classification.char);
      currentWordScores.push(classification.confidence);
    }

    flushWord();

    if (wordsInLine.length > 0) {
      const lineBBox: OcrBBox = {
        x: wordsInLine[0]!.bbox.x,
        y: interval.top,
        width: wordsInLine[wordsInLine.length - 1]!.bbox.x + wordsInLine[wordsInLine.length - 1]!.bbox.width - wordsInLine[0]!.bbox.x,
        height: lineH,
      };

      const lineText = wordsInLine.map((w) => w.text).join(' ');
      const lineConfidence = Math.round(
        wordsInLine.reduce((sum, w) => sum + w.confidence, 0) / wordsInLine.length
      );

      lines.push({
        text: lineText,
        bbox: lineBBox,
        words: wordsInLine,
        confidence: lineConfidence,
      });
    }
  }

  const overallConfidence =
    lines.length > 0
      ? Math.round(lines.reduce((s, l) => s + l.confidence, 0) / lines.length)
      : 100;

  const fullText = lines.map((l) => l.text).join('\n');

  return {
    text: fullText,
    lines,
    words: allWords,
    confidence: overallConfidence,
  };
}

let ocrWorkerInstance: Worker | null = null;
let ocrReqId = 0;

/**
 * Runs OCR asynchronously with dedicated Web Worker offloading,
 * falling back gracefully to direct main-thread processing when Worker is unsupported or fails.
 */
export async function performOcrAsync(
  image: ImageDataLike,
  options: OcrOptions = {}
): Promise<OcrResult> {
  if (typeof window === 'undefined' || typeof Worker === 'undefined') {
    return performOcr(image, options);
  }

  try {
    if (!ocrWorkerInstance) {
      ocrWorkerInstance = new Worker(
        new URL('./photo-worker.ts', import.meta.url),
        { type: 'module' }
      );
    }

    const id = `ocr_${++ocrReqId}_${Date.now()}`;
    const copyBuffer = image.data.slice().buffer;

    return await new Promise<OcrResult>((resolve, reject) => {
      let settled = false;

      const cleanup = () => {
        ocrWorkerInstance?.removeEventListener('message', handler);
        ocrWorkerInstance?.removeEventListener('error', errorHandler);
        clearTimeout(timer);
      };

      const handler = (e: MessageEvent) => {
        if (e.data?.id !== id) return;
        if (settled) return;
        settled = true;
        cleanup();

        if (e.data.type === 'OCR_SUCCESS') {
          resolve(e.data.data as OcrResult);
        } else {
          reject(new Error(e.data?.error || 'Worker OCR failed'));
        }
      };

      const errorHandler = (err: ErrorEvent) => {
        if (settled) return;
        settled = true;
        cleanup();
        reject(err);
      };

      const timer = setTimeout(() => {
        if (settled) return;
        settled = true;
        cleanup();
        reject(new Error('OCR worker processing timed out'));
      }, 10000);

      ocrWorkerInstance?.addEventListener('message', handler);
      ocrWorkerInstance?.addEventListener('error', errorHandler);

      try {
        ocrWorkerInstance?.postMessage(
          {
            id,
            type: 'PERFORM_OCR',
            payload: {
              width: image.width,
              height: image.height,
              buffer: copyBuffer,
              options,
            },
          },
          [copyBuffer]
        );
      } catch {
        ocrWorkerInstance?.postMessage({
          id,
          type: 'PERFORM_OCR',
          payload: {
            width: image.width,
            height: image.height,
            buffer: copyBuffer,
            options,
          },
        });
      }
    });
  } catch (err) {
    console.warn('OCR worker fallback to direct thread:', err);
    return performOcr(image, options);
  }
}

/**
 * Convenience helper to extract plain text string from any image source
 */
export async function extractTextFromImage(
  image: ImageDataLike
): Promise<string> {
  const result = await performOcrAsync(image);
  return result.text;
}
