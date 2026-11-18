import { describe, it, expect } from 'vitest';
import {
  solveHomography,
  invertMatrix3x3,
  applyHomographyToPoint,
  warpPerspective,
  computeOptimalQuadDimensions,
  distance2D,
  quadToArray,
  arrayToQuad,
  type QuadCorners,
  type Point2D,
  type Matrix3x3,
} from '../src/homography';
import { createImageData } from '../src/photo-processor';

describe('4-Point Homography Perspective Deskew Engine', () => {
  describe('solveHomography', () => {
    it('computes exact identity matrix for identical source and destination quadrilaterals', () => {
      const rect: QuadCorners = {
        topLeft: { x: 0, y: 0 },
        topRight: { x: 100, y: 0 },
        bottomRight: { x: 100, y: 100 },
        bottomLeft: { x: 0, y: 100 },
      };

      const H = solveHomography(rect, rect);

      // Should be identity: [1, 0, 0, 0, 1, 0, 0, 0, 1]
      expect(H[0]).toBeCloseTo(1, 4);
      expect(H[1]).toBeCloseTo(0, 4);
      expect(H[2]).toBeCloseTo(0, 4);
      expect(H[3]).toBeCloseTo(0, 4);
      expect(H[4]).toBeCloseTo(1, 4);
      expect(H[5]).toBeCloseTo(0, 4);
      expect(H[6]).toBeCloseTo(0, 4);
      expect(H[7]).toBeCloseTo(0, 4);
      expect(H[8]).toBeCloseTo(1, 4);
    });

    it('computes pure scaling matrix accurately', () => {
      const src: QuadCorners = {
        topLeft: { x: 0, y: 0 },
        topRight: { x: 10, y: 0 },
        bottomRight: { x: 10, y: 10 },
        bottomLeft: { x: 0, y: 10 },
      };
      const dst: QuadCorners = {
        topLeft: { x: 0, y: 0 },
        topRight: { x: 20, y: 0 },
        bottomRight: { x: 20, y: 20 },
        bottomLeft: { x: 0, y: 20 },
      };

      const H = solveHomography(src, dst);

      // Scale 2x
      expect(H[0]).toBeCloseTo(2, 4);
      expect(H[4]).toBeCloseTo(2, 4);
      expect(H[8]).toBeCloseTo(1, 4);

      const mappedCenter = applyHomographyToPoint(H, { x: 5, y: 5 });
      expect(mappedCenter.x).toBeCloseTo(10, 4);
      expect(mappedCenter.y).toBeCloseTo(10, 4);
    });

    it('accurately maps all 4 corners of an arbitrary perspective quadrilateral', () => {
      // Perspective trapezoid representing an angled document on a desk
      const src: QuadCorners = {
        topLeft: { x: 50, y: 20 },
        topRight: { x: 250, y: 35 },
        bottomRight: { x: 280, y: 210 },
        bottomLeft: { x: 30, y: 190 },
      };

      // Unwarped flat A4 document destination (300 x 200)
      const dst: QuadCorners = {
        topLeft: { x: 0, y: 0 },
        topRight: { x: 300, y: 0 },
        bottomRight: { x: 300, y: 200 },
        bottomLeft: { x: 0, y: 200 },
      };

      const H = solveHomography(src, dst);

      // Verify each source corner projects precisely to the corresponding destination corner
      const p0 = applyHomographyToPoint(H, src.topLeft);
      expect(p0.x).toBeCloseTo(dst.topLeft.x, 2);
      expect(p0.y).toBeCloseTo(dst.topLeft.y, 2);

      const p1 = applyHomographyToPoint(H, src.topRight);
      expect(p1.x).toBeCloseTo(dst.topRight.x, 2);
      expect(p1.y).toBeCloseTo(dst.topRight.y, 2);

      const p2 = applyHomographyToPoint(H, src.bottomRight);
      expect(p2.x).toBeCloseTo(dst.bottomRight.x, 2);
      expect(p2.y).toBeCloseTo(dst.bottomRight.y, 2);

      const p3 = applyHomographyToPoint(H, src.bottomLeft);
      expect(p3.x).toBeCloseTo(dst.bottomLeft.x, 2);
      expect(p3.y).toBeCloseTo(dst.bottomLeft.y, 2);
    });

    it('accepts array of 4 points and throws on invalid lengths', () => {
      const validPts: [Point2D, Point2D, Point2D, Point2D] = [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 0, y: 1 },
      ];
      expect(() => solveHomography(validPts, validPts)).not.toThrow();
      expect(() => solveHomography([validPts[0]] as any, validPts)).toThrow();
    });
  });

  describe('invertMatrix3x3', () => {
    it('inverts 3x3 identity matrix correctly', () => {
      const I: Matrix3x3 = [
        1, 0, 0,
        0, 1, 0,
        0, 0, 1,
      ];
      const inv = invertMatrix3x3(I);
      expect(inv).not.toBeNull();
      expect(inv).toEqual(I);
    });

    it('inverts arbitrary non-singular homography and validates M * M^-1 = I', () => {
      const src: QuadCorners = {
        topLeft: { x: 12, y: 15 },
        topRight: { x: 120, y: 25 },
        bottomRight: { x: 110, y: 95 },
        bottomLeft: { x: 18, y: 88 },
      };
      const dst: QuadCorners = {
        topLeft: { x: 0, y: 0 },
        topRight: { x: 100, y: 0 },
        bottomRight: { x: 100, y: 80 },
        bottomLeft: { x: 0, y: 80 },
      };

      const M = solveHomography(src, dst);
      const invM = invertMatrix3x3(M);
      expect(invM).not.toBeNull();

      // Multiply M and invM
      const product = new Array(9).fill(0);
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          let sum = 0;
          for (let k = 0; k < 3; k++) {
            sum += M[r * 3 + k]! * invM![k * 3 + c]!;
          }
          product[r * 3 + c] = sum;
        }
      }

      // Check product is close to identity
      expect(product[0]).toBeCloseTo(1, 3);
      expect(product[1]).toBeCloseTo(0, 3);
      expect(product[2]).toBeCloseTo(0, 3);
      expect(product[3]).toBeCloseTo(0, 3);
      expect(product[4]).toBeCloseTo(1, 3);
      expect(product[5]).toBeCloseTo(0, 3);
      expect(product[6]).toBeCloseTo(0, 3);
      expect(product[7]).toBeCloseTo(0, 3);
      expect(product[8]).toBeCloseTo(1, 3);
    });

    it('returns null for singular / zero determinant matrix', () => {
      const singular: Matrix3x3 = [
        0, 0, 0,
        0, 0, 0,
        0, 0, 0,
      ];
      expect(invertMatrix3x3(singular)).toBeNull();
    });
  });

  describe('computeOptimalQuadDimensions & distance2D', () => {
    it('calculates Euclidean distance accurately', () => {
      expect(distance2D({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
    });

    it('estimates rectangular dimensions from quad coordinates', () => {
      const quad: QuadCorners = {
        topLeft: { x: 0, y: 0 },
        topRight: { x: 200, y: 0 },
        bottomRight: { x: 200, y: 150 },
        bottomLeft: { x: 0, y: 150 },
      };
      const dims = computeOptimalQuadDimensions(quad, 300, 300);
      expect(dims.width).toBe(200);
      expect(dims.height).toBe(150);
    });

    it('handles normalized [0, 1] coordinates scaled to image dimensions', () => {
      const normQuad: QuadCorners = {
        topLeft: { x: 0.1, y: 0.1 },
        topRight: { x: 0.9, y: 0.1 },
        bottomRight: { x: 0.9, y: 0.8 },
        bottomLeft: { x: 0.1, y: 0.8 },
      };
      const dims = computeOptimalQuadDimensions(normQuad, 1000, 1000);
      expect(dims.width).toBeCloseTo(800, -1);
      expect(dims.height).toBeCloseTo(700, -1);
    });

    it('tolerates minor normalized float overshoot (e.g. 1.01) without collapsing into raw pixel size', () => {
      const overshootQuad: QuadCorners = {
        topLeft: { x: -0.01, y: 0 },
        topRight: { x: 1.01, y: 0 },
        bottomRight: { x: 1.01, y: 1.0 },
        bottomLeft: { x: -0.01, y: 1.0 },
      };
      const dims = computeOptimalQuadDimensions(overshootQuad, 1920, 1080);
      expect(dims.width).toBeGreaterThan(1500);
      expect(dims.height).toBeGreaterThan(1000);
    });
  });

  describe('warpPerspective', () => {
    it('unwarps a rectangular region with high fidelity', () => {
      // Create a 10x10 synthetic test image with a red pixel at (5, 5)
      const src = createImageData(10, 10);
      const idx = (5 * 10 + 5) * 4;
      src.data[idx] = 255; // R
      src.data[idx + 1] = 0; // G
      src.data[idx + 2] = 0; // B
      src.data[idx + 3] = 255; // A

      const quad: QuadCorners = {
        topLeft: { x: 0, y: 0 },
        topRight: { x: 9, y: 0 },
        bottomRight: { x: 9, y: 9 },
        bottomLeft: { x: 0, y: 9 },
      };

      const out = warpPerspective(src, quad, 10, 10);
      expect(out.width).toBe(10);
      expect(out.height).toBe(10);

      // Red pixel should be preserved at the center
      const outIdx = (5 * 10 + 5) * 4;
      expect(out.data[outIdx]).toBeGreaterThan(200);
    });

    it('gracefully handles degenerate or collinear quads without throwing or hanging', () => {
      const src = createImageData(10, 10);
      src.data.fill(128);

      // Degenerate collinear quad
      const collinearQuad: QuadCorners = {
        topLeft: { x: 0, y: 0 },
        topRight: { x: 0, y: 0 },
        bottomRight: { x: 0, y: 0 },
        bottomLeft: { x: 0, y: 0 },
      };

      expect(() => {
        const res = warpPerspective(src, collinearQuad);
        expect(res).toBeDefined();
        expect(res.width).toBe(10);
      }).not.toThrow();
    });

    it('fast-paths identity quad without degradation', () => {
      const src = createImageData(20, 20);
      src.data.fill(200);

      const identityQuad: QuadCorners = {
        topLeft: { x: 0, y: 0 },
        topRight: { x: 1, y: 0 },
        bottomRight: { x: 1, y: 1 },
        bottomLeft: { x: 0, y: 1 },
      };

      const out = warpPerspective(src, identityQuad, 20, 20);
      expect(out.width).toBe(20);
      expect(out.height).toBe(20);
      expect(out.data[0]).toBe(200);
    });

    it('fills regions outside perspective boundary with clean white', () => {
      const src = createImageData(20, 20);
      // Fill black
      for (let i = 0; i < src.data.length; i += 4) {
        src.data[i] = 0;
        src.data[i + 1] = 0;
        src.data[i + 2] = 0;
        src.data[i + 3] = 255;
      }

      // Small quad in center
      const quad: QuadCorners = {
        topLeft: { x: 5, y: 5 },
        topRight: { x: 15, y: 5 },
        bottomRight: { x: 15, y: 15 },
        bottomLeft: { x: 5, y: 15 },
      };

      const out = warpPerspective(src, quad, 30, 30);
      expect(out.width).toBe(30);
      expect(out.height).toBe(30);
    });
  });
});
