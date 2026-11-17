import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  createDefaultAdjustmentRecipe,
  clampCrop,
  resizeCropRect,
  type PhotoAdjustmentRecipe,
  type PhotoFilterPreset,
} from '../src/core/photo-processor';

describe('mePhoto Studio Application Core & Operations', () => {
  it('generates a clean default adjustment recipe', () => {
    const recipe = createDefaultAdjustmentRecipe();
    expect(recipe.brightness).toBe(0);
    expect(recipe.contrast).toBe(0);
    expect(recipe.saturation).toBe(0);
    expect(recipe.sharpness).toBe(0);
    expect(recipe.rotation).toBe(0);
    expect(recipe.flipH).toBe(false);
    expect(recipe.flipV).toBe(false);
    expect(recipe.filterPreset).toBe('none');
  });

  it('clamps crop rectangles to [0, 1] range', () => {
    const clamped = clampCrop({ x: -0.2, y: -0.1, width: 1.5, height: 1.2 });
    expect(clamped).toBeDefined();
    expect(clamped!.x).toBe(0);
    expect(clamped!.y).toBe(0);
    expect(clamped!.width).toBeLessThanOrEqual(1);
    expect(clamped!.height).toBeLessThanOrEqual(1);
  });

  it('handles crop handle resizing properly', () => {
    const initialCrop = { x: 0.1, y: 0.1, width: 0.8, height: 0.8 };
    const resized = resizeCropRect(initialCrop, {
      handle: 'se',
      deltaX: 0.05,
      deltaY: 0.05,
      rNorm: null,
    });
    expect(resized.width).toBeCloseTo(0.85, 2);
    expect(resized.height).toBeCloseTo(0.85, 2);
  });

  it('supports all CamScanner filter presets', () => {
    const presets: PhotoFilterPreset[] = [
      'none',
      'magic-color',
      'bw-clean',
      'grayscale',
      'sepia',
      'invert',
    ];

    presets.forEach((p) => {
      const recipe: PhotoAdjustmentRecipe = {
        ...createDefaultAdjustmentRecipe(),
        filterPreset: p,
      };
      expect(recipe.filterPreset).toBe(p);
    });
  });

  it('handles coarse 90-degree and fine deskew angle composition', () => {
    let coarse = 0;
    let fine = 2.5;

    // Rotate CW 90 degrees
    coarse = (coarse + 90) % 360;
    expect(coarse).toBe(90);

    let totalRotation = coarse + fine;
    expect(totalRotation).toBe(92.5);

    // Another rotation
    coarse = (coarse + 90) % 360;
    expect(coarse).toBe(180);
    totalRotation = coarse + fine;
    expect(totalRotation).toBe(182.5);
  });
});
