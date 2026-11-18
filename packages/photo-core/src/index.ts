export * from './file-utils';
export * from './photo-processor';
export * from './photo-worker';

import * as PhotoProcessorModule from './photo-processor';
export const PhotoProcessor = PhotoProcessorModule;

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
