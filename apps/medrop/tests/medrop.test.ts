/**
 * @file medrop.test.ts
 * Unit Test Suite for meDrop Zero-Window Radial File Converter
 */

import { describe, it, expect, vi } from 'vitest';
import {
  resolveExtension,
  resolveCategory,
  resolveWedges,
  formatBytes,
} from '../src/engines/ContextFilter.js';
import { ConversionEngine } from '../src/engines/ConversionEngine.js';
import { StudioGateway } from '../src/engines/StudioGateway.js';
import { clipBus } from '@mecraft/core-bridge';
import type { DraggedFileInfo, RadialWedgeAction } from '../src/types/radial-types.js';

describe('meDrop — ContextFilter Engine', () => {
  it('correctly resolves file extensions with case insensitivity', () => {
    expect(resolveExtension('PHOTO_2026.JPG')).toBe('jpg');
    expect(resolveExtension('document.contract.v1.pdf')).toBe('pdf');
    expect(resolveExtension('vector_logo.SVG')).toBe('svg');
    expect(resolveExtension('README')).toBe('');
  });

  it('categorizes file types accurately based on extension and MIME', () => {
    expect(resolveCategory('scan.jpg')).toBe('image');
    expect(resolveCategory('photo.webp')).toBe('image');
    expect(resolveCategory('contract.pdf')).toBe('pdf');
    expect(resolveCategory('icon.svg')).toBe('vector');
    expect(resolveCategory('notes.md')).toBe('document');
    expect(resolveCategory('song.wav')).toBe('audio_video');
    expect(resolveCategory('movie.mp4')).toBe('audio_video');
    expect(resolveCategory('archive.unknown_xyz')).toBe('unknown');
  });

  it('generates context-specific radial wedges for image files (6 wedges)', () => {
    const info: DraggedFileInfo = {
      name: 'invoice_scan.jpg',
      extension: 'jpg',
      sizeBytes: 2048000,
      mimeType: 'image/jpeg',
      category: 'image',
    };

    const wedges = resolveWedges(info);
    expect(wedges.length).toBe(6);

    const ids = wedges.map((w) => w.id);
    expect(ids).toContain('img-to-pdf');
    expect(ids).toContain('img-to-webp');
    expect(ids).toContain('img-to-png');
    expect(ids).toContain('img-deskew');
    expect(ids).toContain('img-ocr');
    expect(ids).toContain('gateway-mephoto');

    const photoGateway = wedges.find((w) => w.id === 'gateway-mephoto');
    expect(photoGateway?.isStudioGateway).toBe(true);
    expect(photoGateway?.studioAppId).toBe('mephoto');
  });

  it('generates context-specific radial wedges for PDF files (5 wedges)', () => {
    const info: DraggedFileInfo = {
      name: 'Agreement_2026.pdf',
      extension: 'pdf',
      sizeBytes: 15000000,
      mimeType: 'application/pdf',
      category: 'pdf',
    };

    const wedges = resolveWedges(info);
    expect(wedges.length).toBe(5);

    const ids = wedges.map((w) => w.id);
    expect(ids).toContain('pdf-to-png');
    expect(ids).toContain('pdf-compress');
    expect(ids).toContain('pdf-ocr');
    expect(ids).toContain('pdf-split');
    expect(ids).toContain('gateway-mepdf');

    const pdfGateway = wedges.find((w) => w.id === 'gateway-mepdf');
    expect(pdfGateway?.isStudioGateway).toBe(true);
    expect(pdfGateway?.studioAppId).toBe('mepdf');
  });

  it('generates context-specific radial wedges for Vector files (4 wedges)', () => {
    const info: DraggedFileInfo = {
      name: 'crown_logo.svg',
      extension: 'svg',
      sizeBytes: 45000,
      mimeType: 'image/svg+xml',
      category: 'vector',
    };

    const wedges = resolveWedges(info);
    expect(wedges.length).toBe(4);

    const ids = wedges.map((w) => w.id);
    expect(ids).toContain('vector-to-png');
    expect(ids).toContain('vector-to-pdf');
    expect(ids).toContain('vector-minify');
    expect(ids).toContain('gateway-mevector');
  });

  it('formats byte metrics in human-readable strings', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(512)).toBe('512 B');
    expect(formatBytes(1024 * 50)).toBe('50.0 KB');
    expect(formatBytes(1024 * 1024 * 3.5)).toBe('3.5 MB');
    expect(formatBytes(1024 * 1024 * 1024 * 1.2)).toBe('1.2 GB');
  });
});

describe('meDrop — Conversion Engine & Studio Gateway', () => {
  it('converts plain text documents to standalone HTML5 documents', async () => {
    const sampleText = '# Title\n\nThis is a sample document for testing meDrop.';
    const file = new File([sampleText], 'document.txt', { type: 'text/plain' });

    const info: DraggedFileInfo = {
      name: 'document.txt',
      extension: 'txt',
      sizeBytes: file.size,
      mimeType: 'text/plain',
      category: 'document',
      file,
    };

    const action: RadialWedgeAction = {
      id: 'doc-to-html',
      label: 'HTML5',
      targetFormat: 'html',
      icon: '🌐',
      accentColor: '#10b981',
    };

    const progressTracker: number[] = [];
    const result = await ConversionEngine.executeAction(action, info, (pct) => {
      progressTracker.push(pct);
    });

    expect(result.success).toBe(true);
    expect(result.outputName).toBe('document_converted.html');
    expect(result.blob).toBeDefined();
    expect(progressTracker).toContain(100);

    const htmlContent = await result.blob!.text();
    expect(htmlContent).toContain('<!doctype html>');
    expect(htmlContent).toContain('document');
    expect(htmlContent).toContain(sampleText);
  });

  it('dispatches cross-app files via ClipBus to target meCraft studio', async () => {
    const listener = vi.fn();
    const unsub = clipBus.subscribe(listener);

    const testFile = new File(['mock content'], 'test_photo.jpg', { type: 'image/jpeg' });
    const info: DraggedFileInfo = {
      name: 'test_photo.jpg',
      extension: 'jpg',
      sizeBytes: testFile.size,
      mimeType: 'image/jpeg',
      category: 'image',
      file: testFile,
    };

    const action: RadialWedgeAction = {
      id: 'gateway-mephoto',
      label: 'mePhoto',
      icon: '🎨',
      targetFormat: 'studio',
      accentColor: '#ec4899',
      isStudioGateway: true,
      studioAppId: 'mephoto',
    };

    const dispatched = await StudioGateway.dispatchToStudio(action, info);
    expect(dispatched).toBe(true);
    expect(listener).toHaveBeenCalled();

    const payload = listener.mock.calls[0]![0];
    expect(payload.sourceApp).toBe('medrop');
    expect(payload.targetApp).toBe('mephoto');
    expect(payload.name).toBe('test_photo.jpg');

    unsub();
  });
});
