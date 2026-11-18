export * from './file-utils';
export * from './photo-processor';
export * from './photo-worker';
export * from './homography';
export * from './ocr-engine';

import * as PhotoProcessorModule from './photo-processor';
export const PhotoProcessor = PhotoProcessorModule;

import * as HomographyModule from './homography';
export const Homography = HomographyModule;

import * as OcrModule from './ocr-engine';
export const OcrEngine = OcrModule;

export const Otsu = {
  calculateThreshold: PhotoProcessorModule.calculateOtsuThreshold,
  apply: PhotoProcessorModule.applyOtsuBinarization,
};

export const MagicColor = {
  apply: PhotoProcessorModule.applyMagicColor,
};

export const UnsharpMask = {
  apply: PhotoProcessorModule.applyUnsharpMask,
};

export const PhotoWorkerClient = {
  processImageDataAsync: PhotoProcessorModule.processImageDataAsync,
};
