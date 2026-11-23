/**
 * @file ContextFilter.ts
 * Intelligent Contextual Rules Matrix for meDrop
 * Maps incoming file extensions to eligible radial conversion wedges
 */

import type { FileTypeCategory, RadialWedgeAction, DraggedFileInfo } from '../types/radial-types.js';

const IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'bmp', 'tiff', 'tif', 'heic', 'avif']);
const PDF_EXTENSIONS = new Set(['pdf']);
const VECTOR_EXTENSIONS = new Set(['svg', 'ai', 'eps']);
const DOCUMENT_EXTENSIONS = new Set(['md', 'txt', 'docx', 'doc', 'tex']);
const AUDIO_VIDEO_EXTENSIONS = new Set(['mp4', 'mov', 'webm', 'mkv', 'avi', 'wav', 'mp3', 'flac', 'ogg', 'm4a']);

export function resolveExtension(filename: string): string {
  const parts = filename.toLowerCase().split('.');
  return parts.length > 1 ? parts.pop()! : '';
}

export function resolveCategory(filename: string, mimeType?: string): FileTypeCategory {
  const ext = resolveExtension(filename);

  if (IMAGE_EXTENSIONS.has(ext) || mimeType?.startsWith('image/')) {
    return 'image';
  }
  if (PDF_EXTENSIONS.has(ext) || mimeType === 'application/pdf') {
    return 'pdf';
  }
  if (VECTOR_EXTENSIONS.has(ext) || mimeType === 'image/svg+xml') {
    return 'vector';
  }
  if (DOCUMENT_EXTENSIONS.has(ext) || mimeType?.startsWith('text/')) {
    return 'document';
  }
  if (AUDIO_VIDEO_EXTENSIONS.has(ext) || mimeType?.startsWith('video/') || mimeType?.startsWith('audio/')) {
    return 'audio_video';
  }

  return 'unknown';
}

export function resolveWedges(info: DraggedFileInfo): RadialWedgeAction[] {
  switch (info.category) {
    case 'image':
      return [
        {
          id: 'img-to-pdf',
          label: 'To PDF',
          sublabel: 'Acrobat Ready',
          icon: '📑',
          targetFormat: 'pdf',
          accentColor: '#3b82f6',
          tooltipDesc: 'Package image into high-resolution single-page PDF document',
        },
        {
          id: 'img-to-webp',
          label: 'WebP',
          sublabel: '90% Smaller',
          icon: '⚡',
          targetFormat: 'webp',
          accentColor: '#06b6d4',
          tooltipDesc: 'Modern web image with ultra-low byte footprint',
        },
        {
          id: 'img-to-png',
          label: 'PNG',
          sublabel: 'Lossless',
          icon: '🖼️',
          targetFormat: 'png',
          accentColor: '#10b981',
          tooltipDesc: 'Zero compression loss with alpha transparency support',
        },
        {
          id: 'img-deskew',
          label: 'Deskew',
          sublabel: 'Auto Align',
          icon: '📐',
          targetFormat: 'deskew',
          accentColor: '#f59e0b',
          tooltipDesc: 'Rectify camera perspective distortion via 4-point homography',
        },
        {
          id: 'img-ocr',
          label: 'OCR Text',
          sublabel: 'Extract .txt',
          icon: '🔤',
          targetFormat: 'txt',
          accentColor: '#8b5cf6',
          tooltipDesc: 'Recognize Thai & Latin text client-side and save alongside source',
        },
        {
          id: 'gateway-mephoto',
          label: 'mePhoto',
          sublabel: 'Full Darkroom',
          icon: '🎨',
          targetFormat: 'studio',
          accentColor: '#ec4899',
          isStudioGateway: true,
          studioAppId: 'mephoto',
          tooltipDesc: 'Transfer scan into mePhoto Studio for professional retouching',
        },
      ];

    case 'pdf':
      return [
        {
          id: 'pdf-to-png',
          label: 'To Images',
          sublabel: 'Export Pages',
          icon: '🖼️',
          targetFormat: 'png',
          accentColor: '#10b981',
          tooltipDesc: 'Render and extract all PDF pages as crisp standalone PNGs',
        },
        {
          id: 'pdf-compress',
          label: 'Compress',
          sublabel: 'Lossless Deflate',
          icon: '🗜️',
          targetFormat: 'pdf',
          accentColor: '#3b82f6',
          tooltipDesc: 'Reduce PDF file size up to 90% while preserving text vectors',
        },
        {
          id: 'pdf-ocr',
          label: 'Searchable',
          sublabel: 'OCR Injection',
          icon: '🔍',
          targetFormat: 'pdf',
          accentColor: '#8b5cf6',
          tooltipDesc: 'Inject invisible OCR text layer for instant Ctrl+F searchability',
        },
        {
          id: 'pdf-split',
          label: 'Split',
          sublabel: 'Per-Page Files',
          icon: '✂️',
          targetFormat: 'pdf',
          accentColor: '#f59e0b',
          tooltipDesc: 'Slice multi-page PDF into discrete individual page files',
        },
        {
          id: 'gateway-mepdf',
          label: 'mePDF Pro',
          sublabel: 'Full Cockpit',
          icon: '📑',
          targetFormat: 'studio',
          accentColor: '#2563eb',
          isStudioGateway: true,
          studioAppId: 'mepdf',
          tooltipDesc: 'Open file inside mePDF Studio Pro Acrobat cockpit',
        },
      ];

    case 'vector':
      return [
        {
          id: 'vector-to-png',
          label: 'PNG 2x',
          sublabel: 'High-Res Raster',
          icon: '🖼️',
          targetFormat: 'png',
          accentColor: '#a855f7',
          tooltipDesc: 'Rasterize resolution-independent SVG into crisp PNG',
        },
        {
          id: 'vector-to-pdf',
          label: 'Vector PDF',
          sublabel: 'Crisp Vectors',
          icon: '📑',
          targetFormat: 'pdf',
          accentColor: '#3b82f6',
          tooltipDesc: 'Wrap SVG vector path curves into standard vector PDF',
        },
        {
          id: 'vector-minify',
          label: 'Minify SVG',
          sublabel: 'SVGO Clean',
          icon: '⚡',
          targetFormat: 'svg',
          accentColor: '#06b6d4',
          tooltipDesc: 'Strip redundant XML namespaces and compress coordinate paths',
        },
        {
          id: 'gateway-mevector',
          label: 'meVector',
          sublabel: 'Bézier Studio',
          icon: '✒️',
          targetFormat: 'studio',
          accentColor: '#9333ea',
          isStudioGateway: true,
          studioAppId: 'mevector',
          tooltipDesc: 'Launch vector artwork in meVector Illustrator studio',
        },
      ];

    case 'document':
      return [
        {
          id: 'doc-to-pdf',
          label: 'Clean PDF',
          sublabel: 'Typographic',
          icon: '📑',
          targetFormat: 'pdf',
          accentColor: '#3b82f6',
          tooltipDesc: 'Render Markdown or text into clean print-ready PDF',
        },
        {
          id: 'doc-to-html',
          label: 'HTML5',
          sublabel: 'Standalone Web',
          icon: '🌐',
          targetFormat: 'html',
          accentColor: '#10b981',
          tooltipDesc: 'Export document as single standalone styled HTML document',
        },
        {
          id: 'gateway-medoc',
          label: 'meDoc',
          sublabel: 'KaTeX Studio',
          icon: '📝',
          targetFormat: 'studio',
          accentColor: '#2563eb',
          isStudioGateway: true,
          studioAppId: 'medoc',
          tooltipDesc: 'Open document inside meDoc typographic studio',
        },
      ];

    case 'audio_video':
      return [
        {
          id: 'media-to-wav',
          label: 'To WAV',
          sublabel: '24-bit Lossless',
          icon: '🎵',
          targetFormat: 'wav',
          accentColor: '#10b981',
          tooltipDesc: 'Extract audio stream into uncompressed studio master WAV',
        },
        {
          id: 'media-to-mp3',
          label: 'To MP3',
          sublabel: 'Universal Audio',
          icon: '🎧',
          targetFormat: 'mp3',
          accentColor: '#06b6d4',
          tooltipDesc: 'Convert audio to compact high-compatibility MP3',
        },
        {
          id: 'gateway-mefilm',
          label: 'meFilm',
          sublabel: 'Timeline Editor',
          icon: '🎬',
          targetFormat: 'studio',
          accentColor: '#f59e0b',
          isStudioGateway: true,
          studioAppId: 'mefilm',
          tooltipDesc: 'Import media clip onto multi-track timeline in meFilm Studio',
        },
      ];

    default:
      return [
        {
          id: 'fallback-inspect',
          label: 'Inspect',
          sublabel: 'File Telemetry',
          icon: '🔍',
          targetFormat: 'info',
          accentColor: '#3b82f6',
          tooltipDesc: 'Inspect binary checksum and metadata locally',
        },
        {
          id: 'gateway-mepdf-fallback',
          label: 'mePDF Pro',
          sublabel: 'Try Document',
          icon: '📑',
          targetFormat: 'studio',
          accentColor: '#2563eb',
          isStudioGateway: true,
          studioAppId: 'mepdf',
          tooltipDesc: 'Attempt to open file as document in mePDF Studio',
        },
      ];
  }
}

export function formatBytes(bytes: number): string {
  if (bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}
