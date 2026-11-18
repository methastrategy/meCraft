/**
 * Safely converts an HTMLCanvasElement to a Blob with fallback to toDataURL.
 */
export async function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType = 'image/png',
  quality?: number
): Promise<Blob> {
  if (typeof canvas.toBlob === 'function') {
    try {
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), mimeType, quality);
      });
      if (blob) return blob;
    } catch {
      // Fall through to toDataURL fallback
    }
  }

  // Universal fallback using toDataURL
  const dataUrl = canvas.toDataURL(mimeType, quality);
  const commaIdx = dataUrl.indexOf(',');
  const binStr = atob(commaIdx >= 0 ? dataUrl.slice(commaIdx + 1) : dataUrl);
  const len = binStr.length;
  const arr = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    arr[i] = binStr.charCodeAt(i);
  }
  return new Blob([arr], { type: mimeType });
}
