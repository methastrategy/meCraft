# @mecraft/photo-core

> **High-Performance 4-Point Homography, Otsu Binarizer & Computer Vision Pipeline**  
> *Category: SHARED PACKAGE · Status: Stable v1.0.0 · Suite: meCraft*

---

## 📌 Overview
`@mecraft/photo-core` is the mathematical and image processing backbone powering document scanning, perspective correction, and photo enhancements across meCraft.

### Key Capabilities:
1. **4-Point Homography (`homography.ts`):**
   - Solves $3 \times 3$ perspective transformation matrix using Gaussian elimination with full singular matrix defense.
   - Sub-pixel bilinear interpolation for anti-aliased rectification.
2. **Adaptive Otsu Binarization:**
   - Computes local thresholding across document grids to strip shadows and creases.
3. **Magic Color & Tone-Mapping:**
   - Unsharp mask filtering, contrast stretching, and luminance curve normalization.
