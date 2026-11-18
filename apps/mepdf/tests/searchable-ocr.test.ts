import { describe, it, expect, vi, afterEach } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { injectSearchableTextLayer } from '../src/core/pdf-operations';
import * as pdfRenderer from '../src/core/pdf-renderer';

describe('Searchable PDF OCR Layer Injection', () => {
  const originalDoc = (globalThis as any).document;

  afterEach(() => {
    (globalThis as any).document = originalDoc;
    vi.restoreAllMocks();
  });

  async function createEmptyScannedPdf(): Promise<Uint8Array> {
    const doc = await PDFDocument.create();
    doc.addPage([595, 842]);
    return await doc.save();
  }

  it('runs on pure scanned PDF page without errors and returns valid PDF', async () => {
    const scanBytes = await createEmptyScannedPdf();

    let progressReported = false;
    const searchableBytes = await injectSearchableTextLayer(scanBytes, (info) => {
      if (info.percent > 0) progressReported = true;
    });

    expect(progressReported).toBe(true);
    expect(searchableBytes.byteLength).toBeGreaterThan(0);

    const reloaded = await PDFDocument.load(searchableBytes);
    expect(reloaded.getPageCount()).toBe(1);
  });

  it('injects invisible searchable text layer that pdfjs extracts from scanned PDF', async () => {
    const scanBytes = await createEmptyScannedPdf();

    // Prepare mock canvas with synthetic ink lines that OCR will recognize
    const width = 200;
    const height = 80;
    const imgData = {
      width,
      height,
      data: new Uint8ClampedArray(width * height * 4).fill(255),
    };

    // Draw dark word block
    for (let y = 20; y < 35; y++) {
      for (let x = 20; x < 60; x++) {
        const idx = (y * width + x) * 4;
        imgData.data[idx] = 0;
        imgData.data[idx + 1] = 0;
        imgData.data[idx + 2] = 0;
        imgData.data[idx + 3] = 255;
      }
    }

    const mockCanvas = {
      width,
      height,
      getContext: () => ({
        getImageData: () => imgData,
      }),
    };

    (globalThis as any).document = {
      createElement: () => mockCanvas,
    };

    vi.spyOn(pdfRenderer, 'renderPageToCanvas').mockResolvedValue(mockCanvas as any);

    const searchableBytes = await injectSearchableTextLayer(scanBytes);
    expect(searchableBytes.byteLength).toBeGreaterThan(0);

    // Verify extraction with pdfjs
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const loadingTask = pdfjs.getDocument({ data: searchableBytes });
    const pdf = await loadingTask.promise;
    const p1 = await pdf.getPage(1);
    const content = await p1.getTextContent();
    const extracted = content.items.map((item: any) => item.str).join(' ');

    expect(extracted.length).toBeGreaterThan(0);
  });
});
