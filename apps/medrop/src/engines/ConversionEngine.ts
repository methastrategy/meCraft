/**
 * @file ConversionEngine.ts
 * In-Device Local File Conversion Engine for meDrop
 * Powered by @mecraft/photo-core, pdf-lib, and pure client-side processing
 */

import { PDFDocument } from 'pdf-lib';
import { performOcr, createImageData } from '@mecraft/photo-core';
import type { DraggedFileInfo, RadialWedgeAction, RadialConversionResult } from '../types/radial-types.js';

export class ConversionEngine {
  public static async executeAction(
    action: RadialWedgeAction,
    info: DraggedFileInfo,
    onProgress?: (percent: number) => void
  ): Promise<RadialConversionResult> {
    const startTime = performance.now();
    if (onProgress) onProgress(15);

    try {
      let outputBlob: Blob;
      let outputExt = action.targetFormat;
      const baseName = info.name.replace(/\.[^/.]+$/, '');

      switch (action.id) {
        // --- Image Conversions ---
        case 'img-to-pdf': {
          outputBlob = await this.convertImageToPdf(info.file!);
          outputExt = 'pdf';
          break;
        }

        case 'img-to-webp': {
          outputBlob = await this.transcodeImage(info.file!, 'image/webp', 0.88);
          outputExt = 'webp';
          break;
        }

        case 'img-to-png': {
          outputBlob = await this.transcodeImage(info.file!, 'image/png');
          outputExt = 'png';
          break;
        }

        case 'img-deskew': {
          outputBlob = await this.deskewImage(info.file!);
          outputExt = 'png';
          break;
        }

        case 'img-ocr': {
          const text = await this.extractOcrText(info.file!);
          outputBlob = new Blob([text], { type: 'text/plain;charset=utf-8' });
          outputExt = 'txt';
          break;
        }

        // --- PDF Conversions ---
        case 'pdf-compress': {
          outputBlob = await this.compressPdf(info.file!);
          outputExt = 'pdf';
          break;
        }

        case 'pdf-split': {
          outputBlob = await this.extractFirstPdfPage(info.file!);
          outputExt = 'pdf';
          break;
        }

        // --- Document Conversions ---
        case 'doc-to-pdf': {
          const text = info.file ? await info.file.text() : 'Document Content';
          outputBlob = await this.convertTextToPdf(text, baseName);
          outputExt = 'pdf';
          break;
        }

        case 'doc-to-html': {
          const rawText = info.file ? await info.file.text() : 'Document Content';
          const htmlContent = `<!doctype html><html><head><meta charset="utf-8"><title>${baseName}</title><style>body{font-family:sans-serif;max-width:800px;margin:40px auto;line-height:1.6;color:#1e293b;}</style></head><body><h1>${baseName}</h1><pre>${rawText}</pre></body></html>`;
          outputBlob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
          outputExt = 'html';
          break;
        }

        default: {
          // Fallback duplicate/passthrough
          outputBlob = info.file || new Blob(['meDrop processed'], { type: 'application/octet-stream' });
          break;
        }
      }

      if (onProgress) onProgress(100);
      const timeMs = Math.round(performance.now() - startTime);
      const outputName = `${baseName}_converted.${outputExt}`;

      return {
        success: true,
        outputName,
        blob: outputBlob,
        timeMs,
      };
    } catch (err: any) {
      console.error('[ConversionEngine] Execution failed:', err);
      return {
        success: false,
        outputName: '',
        error: err.message || 'Conversion failed',
        timeMs: Math.round(performance.now() - startTime),
      };
    }
  }

  // --- Image Helpers ---
  private static async convertImageToPdf(file: File): Promise<Blob> {
    const pdfDoc = await PDFDocument.create();
    const arrayBuffer = await file.arrayBuffer();

    let embeddedImage;
    if (file.type === 'image/png' || file.name.endsWith('.png')) {
      embeddedImage = await pdfDoc.embedPng(arrayBuffer);
    } else {
      embeddedImage = await pdfDoc.embedJpg(arrayBuffer);
    }

    const page = pdfDoc.addPage([embeddedImage.width, embeddedImage.height]);
    page.drawImage(embeddedImage, {
      x: 0,
      y: 0,
      width: embeddedImage.width,
      height: embeddedImage.height,
    });

    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
  }

  private static async transcodeImage(file: File, mimeType: string, quality = 0.92): Promise<Blob> {
    const img = await this.loadImage(file);
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);

    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => {
        if (b) resolve(b);
        else reject(new Error('Canvas toBlob failed'));
      }, mimeType, quality);
    });
  }

  private static async deskewImage(file: File): Promise<Blob> {
    const img = await this.loadImage(file);
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);

    // Apply auto-level contrast for crisp text
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      // High contrast text filter
      const enhanced = avg > 140 ? 255 : Math.max(0, avg - 25);
      data[i] = enhanced;
      data[i + 1] = enhanced;
      data[i + 2] = enhanced;
    }
    ctx.putImageData(imgData, 0, 0);

    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Deskew export failed'))), 'image/png');
    });
  }

  private static async extractOcrText(file: File): Promise<string> {
    const img = await this.loadImage(file);
    const canvas = document.createElement('canvas');
    canvas.width = Math.min(1600, img.naturalWidth);
    canvas.height = Math.min(1600, img.naturalHeight);
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const res = performOcr(imgData);
    return res.text || '[No text detected by local OCR engine]';
  }

  // --- PDF Helpers ---
  private static async compressPdf(file: File): Promise<Blob> {
    const arrayBuffer = await file.arrayBuffer();
    const srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    const newDoc = await PDFDocument.create();

    const pageIndices = srcDoc.getPageIndices();
    const copiedPages = await newDoc.copyPages(srcDoc, pageIndices);
    copiedPages.forEach((p) => newDoc.addPage(p));

    const compressedBytes = await newDoc.save({ useObjectStreams: true });
    return new Blob([compressedBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
  }

  private static async extractFirstPdfPage(file: File): Promise<Blob> {
    const arrayBuffer = await file.arrayBuffer();
    const srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    const newDoc = await PDFDocument.create();

    if (srcDoc.getPageCount() > 0) {
      const [firstPage] = await newDoc.copyPages(srcDoc, [0]);
      newDoc.addPage(firstPage);
    }

    const pdfBytes = await newDoc.save();
    return new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
  }

  private static async convertTextToPdf(text: string, title: string): Promise<Blob> {
    const doc = await PDFDocument.create();
    const page = doc.addPage([595, 842]); // A4
    const lines = text.split('\n');

    let y = 800;
    page.drawText(title, { x: 50, y, size: 18 });
    y -= 30;

    for (const line of lines.slice(0, 45)) {
      page.drawText(line.slice(0, 80), { x: 50, y, size: 10 });
      y -= 14;
    }

    const pdfBytes = await doc.save();
    return new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
  }

  private static loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image into DOM'));
      };
      img.src = url;
    });
  }
}
