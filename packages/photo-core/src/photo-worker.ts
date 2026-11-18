import {
  processImageData,
  createImageData,
  type PhotoAdjustmentRecipe,
} from './photo-processor';
import {
  performOcr,
  type OcrResult,
  type OcrOptions,
} from './ocr-engine';

export interface PhotoWorkerRequestProcess {
  id: string;
  type: 'PROCESS_IMAGE_DATA';
  payload: {
    width: number;
    height: number;
    buffer: ArrayBuffer;
    recipe: PhotoAdjustmentRecipe;
  };
}

export interface PhotoWorkerRequestOcr {
  id: string;
  type: 'PERFORM_OCR';
  payload: {
    width: number;
    height: number;
    buffer: ArrayBuffer;
    options?: OcrOptions;
  };
}

export type PhotoWorkerRequest = PhotoWorkerRequestProcess | PhotoWorkerRequestOcr;

export interface PhotoWorkerResponseSuccess {
  id: string;
  type: 'SUCCESS';
  data: {
    width: number;
    height: number;
    buffer: ArrayBuffer;
  };
}

export interface PhotoWorkerResponseOcrSuccess {
  id: string;
  type: 'OCR_SUCCESS';
  data: OcrResult;
}

export interface PhotoWorkerResponseError {
  id: string;
  type: 'ERROR';
  error: string;
}

export type PhotoWorkerResponse =
  | PhotoWorkerResponseSuccess
  | PhotoWorkerResponseOcrSuccess
  | PhotoWorkerResponseError;

if (typeof self !== 'undefined' && 'addEventListener' in self) {
  self.addEventListener('message', (event: MessageEvent<PhotoWorkerRequest>) => {
    const { id, type, payload } = event.data;

    try {
      if (type === 'PROCESS_IMAGE_DATA') {
        const { width, height, buffer, recipe } = payload;
        const data = new Uint8ClampedArray(buffer);
        const img = createImageData(width, height, data);

        const processed = processImageData(img, recipe);

        // Ensure buffer is contiguous and safe for zero-copy transfer
        let transferBuf: ArrayBuffer;
        if (
          processed.data.byteOffset === 0 &&
          processed.data.byteLength === processed.data.buffer.byteLength
        ) {
          transferBuf = processed.data.buffer as ArrayBuffer;
        } else {
          transferBuf = processed.data.slice().buffer;
        }

        const response: PhotoWorkerResponseSuccess = {
          id,
          type: 'SUCCESS',
          data: {
            width: processed.width,
            height: processed.height,
            buffer: transferBuf,
          },
        };

        try {
          (self as unknown as Worker).postMessage(response, [transferBuf]);
        } catch {
          (self as unknown as Worker).postMessage(response);
        }
      } else if (type === 'PERFORM_OCR') {
        const { width, height, buffer, options } = payload;
        const data = new Uint8ClampedArray(buffer);
        const img = createImageData(width, height, data);

        const ocrResult = performOcr(img, options);

        const response: PhotoWorkerResponseOcrSuccess = {
          id,
          type: 'OCR_SUCCESS',
          data: ocrResult,
        };

        (self as unknown as Worker).postMessage(response);
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      const errorResponse: PhotoWorkerResponseError = {
        id,
        type: 'ERROR',
        error: errorMsg,
      };
      (self as unknown as Worker).postMessage(errorResponse);
    }
  });
}
