import { describe, it, expect } from 'vitest';
import {
  exportMarkdownToPdf,
  sanitizePdfText,
  wrapText,
} from '../src/engines/PdfExporter.js';

describe('meDoc Studio — PdfExporter', () => {
  it('sanitizes non-WinAnsi and special characters to prevent encoding exceptions', () => {
    const raw = '“Smart quotes” and ‘single’ — em-dash and … ellipsis';
    const clean = sanitizePdfText(raw);
    expect(clean).toBe('"Smart quotes" and \'single\' - em-dash and ... ellipsis');
  });

  it('wraps long text across maximum width boundary', () => {
    const mockFont = {
      widthOfTextAtSize: (str: string) => str.length * 6,
    };
    const text = 'This is a long sentence meant to test wrapping logic.';
    const lines = wrapText(text, 100, 10, mockFont);
    expect(lines.length).toBeGreaterThan(1);
  });

  it('generates a valid, non-empty PDF binary buffer with standard header', async () => {
    const md = `---
title: Test Document
---

# meDoc PDF Export Test

This is a test paragraph verifying client-side zero-cloud PDF compilation.

## Features
- 100% In-Device Memory Execution
- Zero server uploads
- Multi-page wrapping

> Blockquote testing note.

\`\`\`typescript
const ready = true;
\`\`\`
`;

    const bytes = await exportMarkdownToPdf(md, {
      title: 'meDoc Test PDF',
      pageSize: 'A4',
    });

    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(bytes.byteLength).toBeGreaterThan(1000);

    // Validate PDF magic header: %PDF-
    const header = String.fromCharCode(...bytes.slice(0, 5));
    expect(header).toBe('%PDF-');
  });

  it('handles multi-page overflow cleanly by creating multiple pages', async () => {
    let longMd = '# Long Document\n\n';
    for (let i = 0; i < 70; i++) {
      longMd += `Paragraph ${i}: High-throughput typesetting test line for pagination.\n\n`;
    }

    const bytes = await exportMarkdownToPdf(longMd);
    expect(bytes.byteLength).toBeGreaterThan(3000);
  });
});
