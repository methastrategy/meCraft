import type { PhotoAdjustmentRecipe, PhotoFilterPreset, CropRect, ProcessedPhotoResult } from '@mecraft/photo-core';

export type { PhotoAdjustmentRecipe, PhotoFilterPreset, CropRect, ProcessedPhotoResult };

export interface PhotoDocumentItem {
  id: string;
  name: string;
  originalBlob: Blob;
  originalWidth: number;
  originalHeight: number;
  thumbnailUrl: string;
  processedUrl?: string;
  recipe: PhotoAdjustmentRecipe;
  coarseRotation: number;
  fineAngle: number;
  status: 'idle' | 'processing' | 'ready';
}

export type ViewportMode = 'processed' | 'split' | 'side-by-side' | 'original';

export type AspectRatioPreset =
  | 'free'
  | '1:1'
  | 'a4-portrait'
  | 'a4-landscape'
  | '4:3'
  | '16:9'
  | 'passport';
