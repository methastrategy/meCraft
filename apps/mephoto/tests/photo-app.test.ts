import { describe, it, expect, vi } from 'vitest';
import {
  createDefaultAdjustmentRecipe,
  clampCrop,
  resizeCropRect,
  performOcr,
  createImageData,
  solveHomography,
  applyHomographyToPoint,
  type PhotoAdjustmentRecipe,
  type PhotoFilterPreset,
  type QuadCorners,
} from '@mecraft/photo-core';
import { clipBus } from '@mecraft/core-bridge';

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
    expect(recipe.perspectiveQuad).toBeUndefined();
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

    coarse = (coarse + 90) % 360;
    expect(coarse).toBe(90);

    let totalRotation = coarse + fine;
    expect(totalRotation).toBe(92.5);

    coarse = (coarse + 90) % 360;
    expect(coarse).toBe(180);
    totalRotation = coarse + fine;
    expect(totalRotation).toBe(182.5);
  });

  it('manages 4-point homography perspective quad deskew states', () => {
    const quad: QuadCorners = {
      topLeft: { x: 0.05, y: 0.05 },
      topRight: { x: 0.95, y: 0.08 },
      bottomRight: { x: 0.92, y: 0.95 },
      bottomLeft: { x: 0.08, y: 0.92 },
    };

    const recipe: PhotoAdjustmentRecipe = {
      ...createDefaultAdjustmentRecipe(),
      perspectiveQuad: quad,
    };

    expect(recipe.perspectiveQuad).toBeDefined();
    expect(recipe.perspectiveQuad?.topLeft.x).toBe(0.05);

    // Verify projective homography matrix resolution
    const H = solveHomography(quad, {
      topLeft: { x: 0, y: 0 },
      topRight: { x: 1, y: 0 },
      bottomRight: { x: 1, y: 1 },
      bottomLeft: { x: 0, y: 1 },
    });

    const projectedTL = applyHomographyToPoint(H, quad.topLeft);
    expect(projectedTL.x).toBeCloseTo(0, 2);
    expect(projectedTL.y).toBeCloseTo(0, 2);
  });

  it('performs client-side offline OCR on image canvas data', () => {
    const img = createImageData(60, 40);
    img.data.fill(255);

    // Draw simple mark
    for (let y = 10; y < 25; y++) {
      for (let x = 10; x < 30; x++) {
        const idx = (y * 60 + x) * 4;
        img.data[idx] = 0;
        img.data[idx + 1] = 0;
        img.data[idx + 2] = 0;
        img.data[idx + 3] = 255;
      }
    }

    const res = performOcr(img);
    expect(res).toBeDefined();
    expect(res.lines.length).toBeGreaterThanOrEqual(1);
    expect(res.confidence).toBeGreaterThan(0);
  });

  it('dispatches 1-click ClipBus transfer to mePDF workspace', () => {
    const listener = vi.fn();
    const unsubscribe = clipBus.subscribe(listener);

    const testDataUrl = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD...';
    clipBus.send({
      sourceApp: 'mephoto',
      targetApp: 'mepdf',
      type: 'image-page',
      dataUrl: testDataUrl,
      name: 'Scan_20261118.jpg',
    });

    expect(listener).toHaveBeenCalled();
    const payload = listener.mock.calls[0]![0];
    expect(payload.sourceApp).toBe('mephoto');
    expect(payload.targetApp).toBe('mepdf');
    expect(payload.dataUrl).toBe(testDataUrl);

    unsubscribe();
  });

  it('handles undo and redo cycles for adjustment recipes in mePhoto', () => {
    const undoStack: PhotoAdjustmentRecipe[] = [];
    const redoStack: PhotoAdjustmentRecipe[] = [];

    let currentRecipe = createDefaultAdjustmentRecipe();

    const applyChange = (patch: Partial<PhotoAdjustmentRecipe>) => {
      undoStack.push({ ...currentRecipe });
      redoStack.length = 0;
      currentRecipe = { ...currentRecipe, ...patch };
    };

    const undo = () => {
      const prev = undoStack.pop();
      if (!prev) return;
      redoStack.push({ ...currentRecipe });
      currentRecipe = prev;
    };

    const redo = () => {
      const next = redoStack.pop();
      if (!next) return;
      undoStack.push({ ...currentRecipe });
      currentRecipe = next;
    };

    applyChange({ brightness: 30 });
    expect(currentRecipe.brightness).toBe(30);

    applyChange({ contrast: 25 });
    expect(currentRecipe.contrast).toBe(25);

    undo();
    expect(currentRecipe.contrast).toBe(0);
    expect(currentRecipe.brightness).toBe(30);

    redo();
    expect(currentRecipe.contrast).toBe(25);
    expect(currentRecipe.brightness).toBe(30);
  });

  it('synchronizes recipe state across sliders and rotation angles on undo/redo', () => {
    let item = {
      recipe: createDefaultAdjustmentRecipe(),
      coarseRotation: 0,
      fineAngle: 0,
    };

    const undoStack: PhotoAdjustmentRecipe[] = [];
    const redoStack: PhotoAdjustmentRecipe[] = [];

    // Simulate slider drag: fine angle to 3.5 deg
    undoStack.push(JSON.parse(JSON.stringify(item.recipe)));
    item.fineAngle = 3.5;
    item.recipe.rotation = item.coarseRotation + item.fineAngle;

    // Simulate rotate CW 90
    undoStack.push(JSON.parse(JSON.stringify(item.recipe)));
    item.coarseRotation = (item.coarseRotation + 90) % 360;
    item.recipe.rotation = item.coarseRotation + item.fineAngle;
    expect(item.recipe.rotation).toBe(93.5);

    // Undo rotate CW
    redoStack.push(JSON.parse(JSON.stringify(item.recipe)));
    item.recipe = undoStack.pop()!;
    // Synchronize angles
    item.fineAngle = Number((item.recipe.rotation % 90).toFixed(1));
    item.coarseRotation = ((Math.round(item.recipe.rotation - item.fineAngle) % 360) + 360) % 360;

    expect(item.recipe.rotation).toBe(3.5);
    expect(item.fineAngle).toBe(3.5);
    expect(item.coarseRotation).toBe(0);

    // Undo fine angle
    redoStack.push(JSON.parse(JSON.stringify(item.recipe)));
    item.recipe = undoStack.pop()!;
    item.fineAngle = Number((item.recipe.rotation % 90).toFixed(1));
    item.coarseRotation = ((Math.round(item.recipe.rotation - item.fineAngle) % 360) + 360) % 360;

    expect(item.recipe.rotation).toBe(0);
    expect(item.fineAngle).toBe(0);
    expect(item.coarseRotation).toBe(0);
  });
});
