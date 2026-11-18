import { describe, it, expect } from 'vitest';
import { performOcr, performOcrAsync, extractTextFromImage } from '../src/ocr-engine';
import { createImageData } from '../src/photo-processor';

describe('Client-Side Offline OCR Engine', () => {
  it('returns empty result cleanly for tiny or empty images', () => {
    const emptyImg = createImageData(2, 2);
    const result = performOcr(emptyImg);
    expect(result.text).toBe('');
    expect(result.lines).toHaveLength(0);
    expect(result.words).toHaveLength(0);
  });

  it('detects text lines and segments words with accurate bounding boxes', () => {
    // Generate a synthetic test document: 100x60 white background
    const width = 100;
    const height = 60;
    const img = createImageData(width, height);

    // Fill white
    for (let i = 0; i < img.data.length; i += 4) {
      img.data[i] = 255;
      img.data[i + 1] = 255;
      img.data[i + 2] = 255;
      img.data[i + 3] = 255;
    }

    // Helper to draw a black rectangle
    const drawBlackRect = (rx: number, ry: number, rw: number, rh: number) => {
      for (let y = ry; y < ry + rh; y++) {
        for (let x = rx; x < rx + rw; x++) {
          const idx = (y * width + x) * 4;
          img.data[idx] = 0;
          img.data[idx + 1] = 0;
          img.data[idx + 2] = 0;
          img.data[idx + 3] = 255;
        }
      }
    };

    // Draw Line 1: Word 1 (x: 10..22), Word 2 (x: 35..50) at y: 15..27
    drawBlackRect(10, 15, 12, 12);
    drawBlackRect(35, 15, 15, 12);

    // Draw Line 2: Word 3 (x: 10..40) at y: 40..52
    drawBlackRect(10, 40, 30, 12);

    const result = performOcr(img);

    expect(result.lines.length).toBeGreaterThanOrEqual(2);
    expect(result.words.length).toBeGreaterThanOrEqual(3);

    // First line should contain 2 words with separation
    const line1 = result.lines[0]!;
    expect(line1.words.length).toBe(2);
    expect(line1.words[0]!.bbox.x).toBeLessThan(line1.words[1]!.bbox.x);

    // Check second line
    const line2 = result.lines[1]!;
    expect(line2.words.length).toBe(1);
    expect(line2.bbox.y).toBeGreaterThan(line1.bbox.y);
  });

  it('runs asynchronously and via extractTextFromImage helper', async () => {
    const img = createImageData(50, 30);
    // Fill white
    img.data.fill(255);
    // Draw mark
    for (let y = 10; y < 20; y++) {
      for (let x = 10; x < 20; x++) {
        const idx = (y * 50 + x) * 4;
        img.data[idx] = 0;
        img.data[idx + 1] = 0;
        img.data[idx + 2] = 0;
        img.data[idx + 3] = 255;
      }
    }

    const asyncRes = await performOcrAsync(img);
    expect(asyncRes).toBeDefined();
    expect(asyncRes.lines.length).toBe(1);

    const text = await extractTextFromImage(img);
    expect(typeof text).toBe('string');
  });

  it('correctly treats transparent background as non-ink paper', () => {
    // 50x30 image with transparent alpha (a = 0) everywhere
    const transparentImg = createImageData(50, 30);
    // All 0s (r=0, g=0, b=0, a=0)
    transparentImg.data.fill(0);

    const result = performOcr(transparentImg);
    // Should NOT classify transparent pixels as black ink!
    expect(result.lines).toHaveLength(0);
    expect(result.words).toHaveLength(0);
    expect(result.text).toBe('');
  });
});
