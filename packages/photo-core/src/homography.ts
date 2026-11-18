import { createImageData, type ImageDataLike } from './photo-processor';

export interface Point2D {
  x: number;
  y: number;
}

export interface QuadCorners {
  topLeft: Point2D;
  topRight: Point2D;
  bottomRight: Point2D;
  bottomLeft: Point2D;
}

/**
 * 3x3 Projective Homography Matrix represented in row-major order:
 * [
 *   h00, h01, h02,
 *   h10, h11, h12,
 *   h20, h21, h22
 * ]
 */
export type Matrix3x3 = [
  number, number, number,
  number, number, number,
  number, number, number
];

/**
 * Normalizes QuadCorners representation to an array of 4 Point2D ordered:
 * [Top-Left, Top-Right, Bottom-Right, Bottom-Left]
 */
export function quadToArray(quad: QuadCorners | Point2D[]): [Point2D, Point2D, Point2D, Point2D] {
  if (Array.isArray(quad)) {
    if (quad.length !== 4) {
      throw new Error(`Expected exactly 4 points for quad, received ${quad.length}`);
    }
    return [quad[0]!, quad[1]!, quad[2]!, quad[3]!];
  }
  return [quad.topLeft, quad.topRight, quad.bottomRight, quad.bottomLeft];
}

/**
 * Converts array of 4 points to QuadCorners object
 */
export function arrayToQuad(pts: [Point2D, Point2D, Point2D, Point2D]): QuadCorners {
  return {
    topLeft: pts[0],
    topRight: pts[1],
    bottomRight: pts[2],
    bottomLeft: pts[3],
  };
}

/**
 * Euclidean distance between two 2D points
 */
export function distance2D(p1: Point2D, p2: Point2D): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Solves standard 8x8 linear system using Gaussian Elimination with partial pivoting.
 */
function solveGaussian(A: number[][], b: number[]): number[] {
  const n = b.length;
  // Augment matrix
  const M: number[][] = new Array(n);
  for (let i = 0; i < n; i++) {
    M[i] = [...A[i]!, b[i]!];
  }

  for (let p = 0; p < n; p++) {
    // Find pivot row
    let maxRow = p;
    let maxVal = Math.abs(M[p]![p]!);
    for (let r = p + 1; r < n; r++) {
      const val = Math.abs(M[r]![p]!);
      if (val > maxVal) {
        maxVal = val;
        maxRow = r;
      }
    }

    if (maxVal < 1e-12) {
      throw new Error('Singular or degenerate matrix in homography calculation.');
    }

    // Swap pivot row
    if (maxRow !== p) {
      const tmp = M[p]!;
      M[p] = M[maxRow]!;
      M[maxRow] = tmp;
    }

    // Eliminate column
    const pivotVal = M[p]![p]!;
    for (let r = p + 1; r < n; r++) {
      const factor = M[r]![p]! / pivotVal;
      for (let c = p; c <= n; c++) {
        M[r]![c] = M[r]![c]! - factor * M[p]![c]!;
      }
    }
  }

  // Back substitution
  const x = new Array<number>(n);
  for (let i = n - 1; i >= 0; i--) {
    let sum = M[i]![n]!;
    for (let j = i + 1; j < n; j++) {
      sum -= M[i]![j]! * x[j]!;
    }
    x[i] = sum / M[i]![i]!;
  }

  return x;
}

/**
 * Computes the 3x3 projective transformation (Homography matrix H)
 * that maps source points `src` to destination points `dst`.
 *
 * Each point [x, y] in src is mapped such that:
 * [x', y', w']^T = H * [x, y, 1]^T
 * u = x' / w', v = y' / w'
 */
export function solveHomography(
  src: QuadCorners | Point2D[],
  dst: QuadCorners | Point2D[]
): Matrix3x3 {
  const s = quadToArray(src);
  const d = quadToArray(dst);

  // 8 equations for 8 unknowns (h00..h21, with h22 = 1)
  const A: number[][] = [];
  const b: number[] = [];

  for (let i = 0; i < 4; i++) {
    const sx = s[i]!.x;
    const sy = s[i]!.y;
    const dx = d[i]!.x;
    const dy = d[i]!.y;

    // x eq: sx*h00 + sy*h01 + h02 - dx*sx*h20 - dx*sy*h21 = dx
    A.push([sx, sy, 1, 0, 0, 0, -dx * sx, -dx * sy]);
    b.push(dx);

    // y eq: sx*h10 + sy*h11 + h12 - dy*sx*h20 - dy*sy*h21 = dy
    A.push([0, 0, 0, sx, sy, 1, -dy * sx, -dy * sy]);
    b.push(dy);
  }

  const h = solveGaussian(A, b);

  return [
    h[0]!, h[1]!, h[2]!,
    h[3]!, h[4]!, h[5]!,
    h[6]!, h[7]!, 1.0,
  ];
}

/**
 * Inverts a 3x3 matrix. Returns null if matrix is singular.
 */
export function invertMatrix3x3(m: Matrix3x3): Matrix3x3 | null {
  const [
    a, b, c,
    d, e, f,
    g, h, k
  ] = m;

  const A = e * k - f * h;
  const B = -(d * k - f * g);
  const C = d * h - e * g;

  const det = a * A + b * B + c * C;
  if (Math.abs(det) < 1e-14) {
    return null;
  }

  const invDet = 1.0 / det;

  const cleanZero = (val: number) => (Object.is(val, -0) || val === 0 ? 0 : val);

  return [
    cleanZero(A * invDet),
    cleanZero(-(b * k - c * h) * invDet),
    cleanZero((b * f - c * e) * invDet),

    cleanZero(B * invDet),
    cleanZero((a * k - c * g) * invDet),
    cleanZero(-(a * f - c * d) * invDet),

    cleanZero(C * invDet),
    cleanZero(-(a * h - b * g) * invDet),
    cleanZero((a * e - b * d) * invDet),
  ];
}

/**
 * Projects a 2D point through a 3x3 Homography Matrix.
 */
export function applyHomographyToPoint(m: Matrix3x3, pt: Point2D): Point2D {
  const x = pt.x;
  const y = pt.y;

  const w = m[6] * x + m[7] * y + m[8];
  const safeW = Math.abs(w) < 1e-12 ? 1e-12 : w;

  const px = (m[0] * x + m[1] * y + m[2]) / safeW;
  const py = (m[3] * x + m[4] * y + m[5]) / safeW;

  return { x: px, y: py };
}

/**
 * Determines whether a quadrilateral is specified in normalized [0, 1] coordinates
 * with tolerance for minor floating-point overshoot (e.g. 1.005) or boundary snapping.
 */
export function isQuadNormalized(
  quad: QuadCorners,
  imageWidth: number,
  imageHeight: number
): boolean {
  if (imageWidth <= 2 && imageHeight <= 2) return false;
  const maxVal = Math.max(
    Math.abs(quad.topLeft.x),
    Math.abs(quad.topRight.x),
    Math.abs(quad.bottomRight.x),
    Math.abs(quad.bottomLeft.x),
    Math.abs(quad.topLeft.y),
    Math.abs(quad.topRight.y),
    Math.abs(quad.bottomRight.y),
    Math.abs(quad.bottomLeft.y)
  );
  return maxVal <= 2.0;
}

/**
 * Checks if a quadrilateral matches standard rectangle identity (full image)
 */
export function isIdentityQuad(quad: QuadCorners, width: number, height: number): boolean {
  const norm = isQuadNormalized(quad, width, height);
  const scaleX = norm ? width : 1;
  const scaleY = norm ? height : 1;

  const eps = 1.0;
  return (
    Math.abs(quad.topLeft.x * scaleX - 0) < eps &&
    Math.abs(quad.topLeft.y * scaleY - 0) < eps &&
    Math.abs(quad.topRight.x * scaleX - (width - 1)) < eps &&
    Math.abs(quad.topRight.y * scaleY - 0) < eps &&
    Math.abs(quad.bottomRight.x * scaleX - (width - 1)) < eps &&
    Math.abs(quad.bottomRight.y * scaleY - (height - 1)) < eps &&
    Math.abs(quad.bottomLeft.x * scaleX - 0) < eps &&
    Math.abs(quad.bottomLeft.y * scaleY - (height - 1)) < eps
  );
}

/**
 * Automatically computes optimal rectangular dimensions (width x height)
 * for a quadrilateral document based on average edge lengths.
 */
export function computeOptimalQuadDimensions(
  quad: QuadCorners,
  imageWidth: number,
  imageHeight: number
): { width: number; height: number } {
  const isNorm = isQuadNormalized(quad, imageWidth, imageHeight);
  const scaleX = isNorm ? imageWidth : 1;
  const scaleY = isNorm ? imageHeight : 1;

  const p0: Point2D = { x: quad.topLeft.x * scaleX, y: quad.topLeft.y * scaleY };
  const p1: Point2D = { x: quad.topRight.x * scaleX, y: quad.topRight.y * scaleY };
  const p2: Point2D = { x: quad.bottomRight.x * scaleX, y: quad.bottomRight.y * scaleY };
  const p3: Point2D = { x: quad.bottomLeft.x * scaleX, y: quad.bottomLeft.y * scaleY };

  const topW = distance2D(p0, p1);
  const bottomW = distance2D(p3, p2);
  const leftH = distance2D(p0, p3);
  const rightH = distance2D(p1, p2);

  const avgW = Math.max(10, Math.round((topW + bottomW) / 2));
  const avgH = Math.max(10, Math.round((leftH + rightH) / 2));

  return { width: avgW, height: avgH };
}

/**
 * Warps an ImageDataLike source buffer using true 4-point perspective unwarping (Homography).
 * Implements inverse mapping with high-precision bilinear interpolation for CamScanner-grade output.
 */
export function warpPerspective(
  src: ImageDataLike,
  quad: QuadCorners,
  outputWidth?: number,
  outputHeight?: number
): ImageDataLike {
  const srcW = src.width;
  const srcH = src.height;

  // Short-circuit for identity quad if output size is unconstrained or matches source
  if (isIdentityQuad(quad, srcW, srcH)) {
    const targetW = outputWidth ? Math.round(outputWidth) : srcW;
    const targetH = outputHeight ? Math.round(outputHeight) : srcH;
    if (targetW === srcW && targetH === srcH) {
      const copy = createImageData(srcW, srcH);
      copy.data.set(src.data);
      return copy;
    }
  }

  const isNorm = isQuadNormalized(quad, srcW, srcH);
  const scaleX = isNorm ? srcW : 1;
  const scaleY = isNorm ? srcH : 1;

  const srcPts: [Point2D, Point2D, Point2D, Point2D] = [
    { x: quad.topLeft.x * scaleX, y: quad.topLeft.y * scaleY },
    { x: quad.topRight.x * scaleX, y: quad.topRight.y * scaleY },
    { x: quad.bottomRight.x * scaleX, y: quad.bottomRight.y * scaleY },
    { x: quad.bottomLeft.x * scaleX, y: quad.bottomLeft.y * scaleY },
  ];

  const { width: autoW, height: autoH } = computeOptimalQuadDimensions(quad, srcW, srcH);
  const outW = Math.max(1, Math.round(outputWidth ?? autoW));
  const outH = Math.max(1, Math.round(outputHeight ?? autoH));

  const dstPts: [Point2D, Point2D, Point2D, Point2D] = [
    { x: 0, y: 0 },
    { x: outW - 1, y: 0 },
    { x: outW - 1, y: outH - 1 },
    { x: 0, y: outH - 1 },
  ];

  // Map destination coordinates (u, v) back to source (x, y) to sample without holes
  let H_dst2src: Matrix3x3;
  try {
    H_dst2src = solveHomography(dstPts, srcPts);
  } catch (err) {
    console.warn('[warpPerspective] Degenerate homography matrix, returning source:', err);
    const copy = createImageData(srcW, srcH);
    copy.data.set(src.data);
    return copy;
  }

  const out = createImageData(outW, outH);
  const srcData = src.data;
  const outData = out.data;

  const h00 = H_dst2src[0];
  const h01 = H_dst2src[1];
  const h02 = H_dst2src[2];
  const h10 = H_dst2src[3];
  const h11 = H_dst2src[4];
  const h12 = H_dst2src[5];
  const h20 = H_dst2src[6];
  const h21 = H_dst2src[7];
  const h22 = H_dst2src[8];

  for (let v = 0; v < outH; v++) {
    const rowOffset = v * outW * 4;

    for (let u = 0; u < outW; u++) {
      const w = h20 * u + h21 * v + h22;
      const safeW = Math.abs(w) < 1e-12 ? 1e-12 : w;

      const sx = (h00 * u + h01 * v + h02) / safeW;
      const sy = (h10 * u + h11 * v + h12) / safeW;

      const dstIdx = rowOffset + (u * 4);

      // Clamp coordinates to image boundaries with boundary preservation
      if (sx < -0.5 || sx > srcW - 0.5 || sy < -0.5 || sy > srcH - 0.5) {
        // Outside bounds: Clean white backdrop
        outData[dstIdx] = 255;
        outData[dstIdx + 1] = 255;
        outData[dstIdx + 2] = 255;
        outData[dstIdx + 3] = 255;
        continue;
      }

      const clampedX = Math.max(0, Math.min(srcW - 1, sx));
      const clampedY = Math.max(0, Math.min(srcH - 1, sy));

      const x0 = Math.floor(clampedX);
      const y0 = Math.floor(clampedY);
      const x1 = Math.min(x0 + 1, srcW - 1);
      const y1 = Math.min(y0 + 1, srcH - 1);

      const dx = clampedX - x0;
      const dy = clampedY - y0;

      const idx00 = (y0 * srcW + x0) * 4;
      const idx10 = (y0 * srcW + x1) * 4;
      const idx01 = (y1 * srcW + x0) * 4;
      const idx11 = (y1 * srcW + x1) * 4;

      const w00 = (1 - dx) * (1 - dy);
      const w10 = dx * (1 - dy);
      const w01 = (1 - dx) * dy;
      const w11 = dx * dy;

      outData[dstIdx] = Math.round(
        w00 * srcData[idx00]! +
        w10 * srcData[idx10]! +
        w01 * srcData[idx01]! +
        w11 * srcData[idx11]!
      );
      outData[dstIdx + 1] = Math.round(
        w00 * srcData[idx00 + 1]! +
        w10 * srcData[idx10 + 1]! +
        w01 * srcData[idx01 + 1]! +
        w11 * srcData[idx11 + 1]!
      );
      outData[dstIdx + 2] = Math.round(
        w00 * srcData[idx00 + 2]! +
        w10 * srcData[idx10 + 2]! +
        w01 * srcData[idx01 + 2]! +
        w11 * srcData[idx11 + 2]!
      );
      outData[dstIdx + 3] = Math.round(
        w00 * srcData[idx00 + 3]! +
        w10 * srcData[idx10 + 3]! +
        w01 * srcData[idx01 + 3]! +
        w11 * srcData[idx11 + 3]!
      );
    }
  }

  return out;
}
