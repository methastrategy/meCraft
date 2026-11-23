/**
 * @file radial-types.ts
 * Core types and contracts for meDrop Zero-Window Radial File Converter
 */

export type FileTypeCategory =
  | 'image'
  | 'pdf'
  | 'vector'
  | 'document'
  | 'audio_video'
  | 'unknown';

export interface RadialWedgeAction {
  id: string;
  label: string;
  sublabel?: string;
  icon: string;
  targetFormat: string;
  accentColor: string;
  isStudioGateway?: boolean;
  studioAppId?: string;
  tooltipDesc?: string;
}

export interface DraggedFileInfo {
  name: string;
  extension: string;
  sizeBytes: number;
  mimeType: string;
  category: FileTypeCategory;
  file?: File;
  filePath?: string;
}

export interface RadialConversionResult {
  success: boolean;
  outputName: string;
  outputPath?: string;
  blob?: Blob;
  dataUrl?: string;
  error?: string;
  timeMs: number;
}
