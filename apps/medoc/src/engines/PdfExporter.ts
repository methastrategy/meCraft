/**
 * @file PdfExporter.ts
 * meDoc Studio — Clean Client-Side PDF Generation Engine
 * Powered by pdf-lib · 100% In-Device RAM Privacy
 */

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export interface PdfExportOptions {
  title?: string;
  author?: string;
  pageSize?: 'A4' | 'Letter';
  margin?: number;
}

/**
 * Sanitizes text for standard PDF Type 1 fonts (WinAnsiEncoding)
 * Replaces characters outside standard Latin range with safe ASCII representations
 */
export function sanitizePdfText(text: string): string {
  return text
    // Replace smart quotes and dashes
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\u2026/g, '...')
    // Filter non-WinAnsi characters to prevent pdf-lib encoding exceptions
    .replace(/[^\x00-\xFF]/g, '?');
}

/**
 * Splits text into lines that fit within a maximum width
 */
export function wrapText(text: string, maxWidth: number, fontSize: number, font: any): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = font.widthOfTextAtSize(sanitizePdfText(testLine), fontSize);

    if (testWidth > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

/**
 * Generates an elegant PDF document from Markdown content
 */
export async function exportMarkdownToPdf(
  markdown: string,
  options: PdfExportOptions = {}
): Promise<Uint8Array> {
  const {
    title = 'Document',
    author = 'meDoc Author',
    pageSize = 'A4',
    margin = 50,
  } = options;

  // A4: 595.28 x 841.89 | Letter: 612 x 792
  const pageWidth = pageSize === 'A4' ? 595.28 : 612;
  const pageHeight = pageSize === 'A4' ? 841.89 : 792;
  const contentWidth = pageWidth - margin * 2;

  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle(title);
  pdfDoc.setAuthor(author);
  pdfDoc.setCreator('meDoc Studio (meCraft Suite)');

  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const courier = await pdfDoc.embedFont(StandardFonts.Courier);

  // Palette: Dark Teal Brand
  const colorTeal = rgb(13 / 255, 148 / 255, 136 / 255); // #0d9488
  const colorDarkText = rgb(30 / 255, 41 / 255, 59 / 255); // #1e293b
  const colorMuted = rgb(100 / 255, 116 / 255, 139 / 255); // #64748b
  const colorCodeBg = rgb(241 / 255, 245 / 255, 249 / 255); // #f1f5f9
  const colorLine = rgb(226 / 255, 232 / 255, 240 / 255); // #e2e8f0

  let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;

  function checkNewPage(neededSpace: number) {
    if (y - neededSpace < margin + 30) {
      currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
      y = pageHeight - margin;
    }
  }

  // Draw header accent line on page 1
  currentPage.drawRectangle({
    x: margin,
    y: y,
    width: contentWidth,
    height: 3,
    color: colorTeal,
  });
  y -= 20;

  const lines = markdown.split(/\r?\n/);
  let inCodeBlock = false;
  let codeBuffer: string[] = [];

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();

    // Fenced Code Block Handler
    if (trimmed.startsWith('```') || trimmed.startsWith('~~~')) {
      if (inCodeBlock) {
        // Close code block
        inCodeBlock = false;
        checkNewPage(codeBuffer.length * 14 + 16);
        const blockHeight = codeBuffer.length * 13 + 12;
        currentPage.drawRectangle({
          x: margin,
          y: y - blockHeight + 6,
          width: contentWidth,
          height: blockHeight,
          color: colorCodeBg,
          borderColor: colorLine,
          borderWidth: 1,
        });

        for (const cLine of codeBuffer) {
          currentPage.drawText(sanitizePdfText(cLine.slice(0, 90)), {
            x: margin + 10,
            y: y - 8,
            size: 9,
            font: courier,
            color: colorDarkText,
          });
          y -= 13;
        }
        y -= 14;
        codeBuffer = [];
      } else {
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(rawLine);
      continue;
    }

    // Empty lines
    if (!trimmed) {
      y -= 8;
      continue;
    }

    // Headings
    if (trimmed.startsWith('# ')) {
      checkNewPage(40);
      const text = trimmed.slice(2).trim();
      currentPage.drawText(sanitizePdfText(text), {
        x: margin,
        y: y,
        size: 20,
        font: helveticaBold,
        color: colorTeal,
      });
      y -= 26;
    } else if (trimmed.startsWith('## ')) {
      checkNewPage(32);
      const text = trimmed.slice(3).trim();
      currentPage.drawText(sanitizePdfText(text), {
        x: margin,
        y: y,
        size: 15,
        font: helveticaBold,
        color: colorDarkText,
      });
      y -= 20;
    } else if (trimmed.startsWith('### ')) {
      checkNewPage(26);
      const text = trimmed.slice(4).trim();
      currentPage.drawText(sanitizePdfText(text), {
        x: margin,
        y: y,
        size: 12,
        font: helveticaBold,
        color: colorDarkText,
      });
      y -= 18;
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      // Bullet list
      const text = trimmed.slice(2).trim();
      const wrapped = wrapText(text, contentWidth - 16, 10.5, helvetica);
      checkNewPage(wrapped.length * 14 + 4);

      currentPage.drawCircle({
        x: margin + 5,
        y: y + 3,
        size: 2.5,
        color: colorTeal,
      });

      for (let i = 0; i < wrapped.length; i++) {
        currentPage.drawText(sanitizePdfText(wrapped[i]), {
          x: margin + 16,
          y: y,
          size: 10.5,
          font: helvetica,
          color: colorDarkText,
        });
        y -= 14;
      }
    } else if (trimmed.startsWith('> ')) {
      // Blockquote
      const text = trimmed.slice(2).trim();
      const wrapped = wrapText(text, contentWidth - 16, 10, helvetica);
      checkNewPage(wrapped.length * 14 + 4);

      currentPage.drawLine({
        start: { x: margin + 2, y: y + 8 },
        end: { x: margin + 2, y: y - wrapped.length * 14 + 10 },
        thickness: 2,
        color: colorTeal,
      });

      for (const wLine of wrapped) {
        currentPage.drawText(sanitizePdfText(wLine), {
          x: margin + 14,
          y: y,
          size: 10,
          font: helvetica,
          color: colorMuted,
        });
        y -= 14;
      }
    } else {
      // Standard Paragraph
      const wrapped = wrapText(trimmed, contentWidth, 10.5, helvetica);
      checkNewPage(wrapped.length * 15 + 4);

      for (const wLine of wrapped) {
        currentPage.drawText(sanitizePdfText(wLine), {
          x: margin,
          y: y,
          size: 10.5,
          font: helvetica,
          color: colorDarkText,
        });
        y -= 15;
      }
      y -= 4;
    }
  }

  // Draw footer on all pages
  const totalPages = pdfDoc.getPageCount();
  for (let i = 0; i < totalPages; i++) {
    const page = pdfDoc.getPage(i);
    const footerText = sanitizePdfText(`meDoc Studio · Page ${i + 1} of ${totalPages} · 100% In-Device Privacy`);
    page.drawText(footerText, {
      x: margin,
      y: margin - 20,
      size: 8,
      font: helvetica,
      color: colorMuted,
    });
  }

  return await pdfDoc.save();
}

/**
 * Triggers browser download for generated PDF bytes
 */
export function downloadPdf(bytes: Uint8Array, filename: string = 'document.pdf'): void {
  if (typeof window === 'undefined' || !window.document) return;
  const blob = new Blob([bytes as any], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
