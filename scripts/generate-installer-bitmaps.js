import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const iconsDir = path.join(rootDir, 'apps/mecraft-launcher/src-tauri/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

/**
 * Creates an uncompressed 24-bit Windows BMP Buffer from an RGB pixel generator.
 * @param {number} width 
 * @param {number} height 
 * @param {(x: number, y: number) => [number, number, number]} getPixel - returns [r, g, b] (0..255)
 * @returns {Buffer}
 */
function createBmp(width, height, getPixel) {
  const rowSize = Math.floor((width * 3 + 3) / 4) * 4;
  const padding = rowSize - width * 3;
  const pixelArraySize = rowSize * height;
  const fileSize = 54 + pixelArraySize;

  const buf = Buffer.alloc(fileSize);

  // 1. BITMAPFILEHEADER (14 bytes)
  buf.write('BM', 0);                          // signature
  buf.writeUInt32LE(fileSize, 2);              // total file size
  buf.writeUInt16LE(0, 6);                     // reserved 1
  buf.writeUInt16LE(0, 8);                     // reserved 2
  buf.writeUInt32LE(54, 10);                   // pixel data offset (14 + 40)

  // 2. BITMAPINFOHEADER (40 bytes)
  buf.writeUInt32LE(40, 14);                   // header size
  buf.writeInt32LE(width, 18);                 // width
  buf.writeInt32LE(height, 22);                // height (positive = bottom-to-top)
  buf.writeUInt16LE(1, 26);                    // color planes
  buf.writeUInt16LE(24, 28);                   // bits per pixel (24-bit RGB)
  buf.writeUInt32LE(0, 30);                    // BI_RGB (no compression)
  buf.writeUInt32LE(pixelArraySize, 34);       // image size
  buf.writeInt32LE(2835, 38);                  // horizontal resolution (72 DPI)
  buf.writeInt32LE(2835, 42);                  // vertical resolution (72 DPI)
  buf.writeUInt32LE(0, 46);                    // colors in color table
  buf.writeUInt32LE(0, 50);                    // important color count

  // 3. Pixel Array (Bottom to top)
  let offset = 54;
  for (let y = height - 1; y >= 0; y--) {
    for (let x = 0; x < width; x++) {
      const [r, g, b] = getPixel(x, y);
      buf.writeUInt8(Math.max(0, Math.min(255, Math.round(b))), offset++);
      buf.writeUInt8(Math.max(0, Math.min(255, Math.round(g))), offset++);
      buf.writeUInt8(Math.max(0, Math.min(255, Math.round(r))), offset++);
    }
    for (let p = 0; p < padding; p++) {
      buf.writeUInt8(0, offset++);
    }
  }

  return buf;
}

// 5x7 Basic Bitmap Font for crisp typographic details
const FONT_5X7 = {
  'M': [0x11, 0x1B, 0x15, 0x11, 0x11, 0x11, 0x11],
  'E': [0x1F, 0x10, 0x10, 0x1E, 0x10, 0x10, 0x1F],
  'C': [0x0E, 0x11, 0x10, 0x10, 0x10, 0x11, 0x0E],
  'R': [0x1E, 0x11, 0x11, 0x1E, 0x14, 0x12, 0x11],
  'A': [0x0E, 0x11, 0x11, 0x1F, 0x11, 0x11, 0x11],
  'F': [0x1F, 0x10, 0x10, 0x1E, 0x10, 0x10, 0x10],
  'T': [0x1F, 0x04, 0x04, 0x04, 0x04, 0x04, 0x04],
  'S': [0x0E, 0x11, 0x10, 0x0E, 0x01, 0x11, 0x0E],
  'U': [0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x0E],
  'I': [0x0E, 0x04, 0x04, 0x04, 0x04, 0x04, 0x0E],
  'D': [0x1C, 0x12, 0x11, 0x11, 0x11, 0x12, 0x1C],
  'O': [0x0E, 0x11, 0x11, 0x11, 0x11, 0x11, 0x0E],
  'P': [0x1E, 0x11, 0x11, 0x1E, 0x10, 0x10, 0x10],
  'V': [0x11, 0x11, 0x11, 0x11, 0x11, 0x0A, 0x04],
  'L': [0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x1F],
  'K': [0x11, 0x12, 0x14, 0x18, 0x14, 0x12, 0x11],
  'B': [0x1E, 0x11, 0x11, 0x1E, 0x11, 0x11, 0x1E],
  'X': [0x11, 0x11, 0x0A, 0x04, 0x0A, 0x11, 0x11],
  '0': [0x0E, 0x13, 0x15, 0x19, 0x11, 0x11, 0x0E],
  '1': [0x04, 0x0C, 0x04, 0x04, 0x04, 0x04, 0x0E],
  '2': [0x0E, 0x11, 0x01, 0x06, 0x08, 0x10, 0x1F],
  '3': [0x1F, 0x01, 0x02, 0x0C, 0x01, 0x11, 0x0E],
  '%': [0x19, 0x19, 0x02, 0x04, 0x08, 0x13, 0x13],
  '.': [0x00, 0x00, 0x00, 0x00, 0x00, 0x06, 0x06],
  '-': [0x00, 0x00, 0x00, 0x1F, 0x00, 0x00, 0x00],
  ' ': [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
};

function renderTextToCanvas(canvas, width, height, text, startX, startY, scale = 1, color = [255, 255, 255]) {
  const upper = text.toUpperCase();
  let curX = startX;
  for (let i = 0; i < upper.length; i++) {
    const char = upper[i];
    const bitmap = FONT_5X7[char] || FONT_5X7[' '];
    for (let r = 0; r < 7; r++) {
      const rowBits = bitmap[r];
      for (let c = 0; c < 5; c++) {
        if ((rowBits & (1 << (4 - c))) !== 0) {
          for (let sy = 0; sy < scale; sy++) {
            for (let sx = 0; sx < scale; sx++) {
              const px = curX + c * scale + sx;
              const py = startY + r * scale + sy;
              if (px >= 0 && px < width && py >= 0 && py < height) {
                const idx = (py * width + px) * 3;
                canvas[idx] = color[0];
                canvas[idx + 1] = color[1];
                canvas[idx + 2] = color[2];
              }
            }
          }
        }
      }
    }
    curX += (5 + 1) * scale;
  }
}

/**
 * 1. Generate Sidebar BMP (164 x 314 px)
 * Neue Klasse Luxury Dark aesthetic:
 * - Gradient: #06070a to #101426
 * - Glowing 3D Isometric Cube with glass edges
 * - Cyan & Electric Indigo aura
 * - meCraft Suite branding typography
 */
function generateSidebar() {
  const width = 164;
  const height = 314;
  const rgbBuffer = new Float32Array(width * height * 3);

  // Background Gradient & Ambient Glows
  const centerX = width / 2;
  const iconCenterY = 110;

  for (let y = 0; y < height; y++) {
    const t = y / height;
    // Base gradient from deep obsidian to subtle indigo slate
    let bgR = 6 + t * 10;
    let bgG = 7 + t * 13;
    let bgB = 10 + t * 24;

    for (let x = 0; x < width; x++) {
      // Ambient radial glow from center icon
      const dx = x - centerX;
      const dy = y - iconCenterY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const glow1 = Math.max(0, 1 - dist / 75); // Cyan glow
      const glow2 = Math.max(0, 1 - dist / 110); // Indigo aura

      let r = bgR + glow2 * 45 + glow1 * 10;
      let g = bgG + glow2 * 35 + glow1 * 60;
      let b = bgB + glow2 * 110 + glow1 * 90;

      // Subtle high-tech diagonal grid line
      if ((x + y) % 32 === 0 || (x - y) % 32 === 0) {
        r += 5;
        g += 7;
        b += 14;
      }

      // Vertical 1px hairline on right border
      if (x === width - 1) {
        r = 79;
        g = 95;
        b = 247;
      }

      const idx = (y * width + x) * 3;
      rgbBuffer[idx] = r;
      rgbBuffer[idx + 1] = g;
      rgbBuffer[idx + 2] = b;
    }
  }

  // Draw 3D Isometric Workstation Cube Emblem
  // Isometric projection: (ix, iy, iz)
  function drawIsoPolygon(p1, p2, p3, p4, color) {
    const minX = Math.floor(Math.min(p1.x, p2.x, p3.x, p4.x));
    const maxX = Math.ceil(Math.max(p1.x, p2.x, p3.x, p4.x));
    const minY = Math.floor(Math.min(p1.y, p2.y, p3.y, p4.y));
    const maxY = Math.ceil(Math.max(p1.y, p2.y, p3.y, p4.y));

    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        if (x < 0 || x >= width || y < 0 || y >= height) continue;
        // Point in polygon test for convex quad
        function sign(p1, p2, p3) {
          return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
        }
        const pt = { x, y };
        const b1 = sign(pt, p1, p2) < 0.0;
        const b2 = sign(pt, p2, p3) < 0.0;
        const b3 = sign(pt, p3, p4) < 0.0;
        const b4 = sign(pt, p4, p1) < 0.0;
        if ((b1 === b2) && (b2 === b3) && (b3 === b4)) {
          const idx = (y * width + x) * 3;
          rgbBuffer[idx] = color[0];
          rgbBuffer[idx + 1] = color[1];
          rgbBuffer[idx + 2] = color[2];
        }
      }
    }
  }

  const cx = centerX;
  const cy = iconCenterY;
  const sz = 32;

  // Top Face (Bright Laser Cyan / Electric Blue highlight)
  drawIsoPolygon(
    { x: cx, y: cy - sz },
    { x: cx + sz * 1.1, y: cy - sz * 0.4 },
    { x: cx, y: cy + sz * 0.2 },
    { x: cx - sz * 1.1, y: cy - sz * 0.4 },
    [30, 160, 240]
  );

  // Left Face (Electric Indigo)
  drawIsoPolygon(
    { x: cx - sz * 1.1, y: cy - sz * 0.4 },
    { x: cx, y: cy + sz * 0.2 },
    { x: cx, y: cy + sz * 1.4 },
    { x: cx - sz * 1.1, y: cy + sz * 0.8 },
    [79, 95, 247]
  );

  // Right Face (Deep Violet Obsidian)
  drawIsoPolygon(
    { x: cx, y: cy + sz * 0.2 },
    { x: cx + sz * 1.1, y: cy - sz * 0.4 },
    { x: cx + sz * 1.1, y: cy + sz * 0.8 },
    { x: cx, y: cy + sz * 1.4 },
    [40, 50, 160]
  );

  // Inner floating core
  drawIsoPolygon(
    { x: cx, y: cy - sz * 0.5 },
    { x: cx + sz * 0.55, y: cy - sz * 0.2 },
    { x: cx, y: cy + sz * 0.1 },
    { x: cx - sz * 0.55, y: cy - sz * 0.2 },
    [255, 255, 255]
  );

  // Convert to uint8 array for typography rendering
  const finalRgb = new Uint8Array(width * height * 3);
  for (let i = 0; i < finalRgb.length; i++) {
    finalRgb[i] = Math.max(0, Math.min(255, Math.round(rgbBuffer[i])));
  }

  // Render Typography
  renderTextToCanvas(finalRgb, width, height, 'MECRAFT', 28, 182, 2, [255, 255, 255]);
  renderTextToCanvas(finalRgb, width, height, 'SUITE V3.2', 38, 204, 1, [6, 182, 212]);
  renderTextToCanvas(finalRgb, width, height, '100% PRIVATE', 32, 224, 1, [148, 163, 184]);
  renderTextToCanvas(finalRgb, width, height, 'LOCAL CPU/GPU', 31, 238, 1, [100, 116, 139]);

  // Bottom Accent bar
  for (let x = 20; x < width - 20; x++) {
    for (let y = 258; y <= 259; y++) {
      const idx = (y * width + x) * 3;
      finalRgb[idx] = 79;
      finalRgb[idx + 1] = 95;
      finalRgb[idx + 2] = 247;
    }
  }

  renderTextToCanvas(finalRgb, width, height, 'ZERO SERVER UPLOAD', 18, 272, 1, [6, 182, 212]);

  return createBmp(width, height, (x, y) => {
    const idx = (y * width + x) * 3;
    return [finalRgb[idx], finalRgb[idx + 1], finalRgb[idx + 2]];
  });
}

/**
 * 2. Generate Header BMP (150 x 57 px)
 * Displays on License, Directory, and Progress installer pages:
 * - Obsidian Slate background
 * - meCraft branding mark
 * - Right aligned 3D Isometric Mini-Emblem
 * - Laser Cyan bottom hairline
 */
function generateHeader() {
  const width = 150;
  const height = 57;
  const rgb = new Uint8Array(width * height * 3);

  const iconCX = 126;
  const iconCY = 28;

  for (let y = 0; y < height; y++) {
    const t = y / height;
    const bgR = 10 + t * 8;
    const bgG = 12 + t * 9;
    const bgB = 18 + t * 14;

    for (let x = 0; x < width; x++) {
      const dx = x - iconCX;
      const dy = y - iconCY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const glow = Math.max(0, 1 - dist / 32);

      let r = bgR + glow * 30;
      let g = bgG + glow * 50;
      let b = bgB + glow * 90;

      // Bottom 1px Laser Cyan Hairline
      if (y === height - 1) {
        r = 6;
        g = 182;
        b = 212;
      }

      const idx = (y * width + x) * 3;
      rgb[idx] = Math.max(0, Math.min(255, Math.round(r)));
      rgb[idx + 1] = Math.max(0, Math.min(255, Math.round(g)));
      rgb[idx + 2] = Math.max(0, Math.min(255, Math.round(b)));
    }
  }

  // Draw Mini 3D Cube Emblem at right
  function drawIsoQuad(p1, p2, p3, p4, color) {
    const minX = Math.floor(Math.min(p1.x, p2.x, p3.x, p4.x));
    const maxX = Math.ceil(Math.max(p1.x, p2.x, p3.x, p4.x));
    const minY = Math.floor(Math.min(p1.y, p2.y, p3.y, p4.y));
    const maxY = Math.ceil(Math.max(p1.y, p2.y, p3.y, p4.y));

    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        if (x < 0 || x >= width || y < 0 || y >= height) continue;
        function sign(p1, p2, p3) {
          return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
        }
        const pt = { x, y };
        const b1 = sign(pt, p1, p2) < 0.0;
        const b2 = sign(pt, p2, p3) < 0.0;
        const b3 = sign(pt, p3, p4) < 0.0;
        const b4 = sign(pt, p4, p1) < 0.0;
        if ((b1 === b2) && (b2 === b3) && (b3 === b4)) {
          const idx = (y * width + x) * 3;
          rgb[idx] = color[0];
          rgb[idx + 1] = color[1];
          rgb[idx + 2] = color[2];
        }
      }
    }
  }

  const cx = iconCX;
  const cy = iconCY;
  const sz = 14;

  // Top
  drawIsoQuad(
    { x: cx, y: cy - sz },
    { x: cx + sz * 1.1, y: cy - sz * 0.4 },
    { x: cx, y: cy + sz * 0.2 },
    { x: cx - sz * 1.1, y: cy - sz * 0.4 },
    [30, 160, 240]
  );
  // Left
  drawIsoQuad(
    { x: cx - sz * 1.1, y: cy - sz * 0.4 },
    { x: cx, y: cy + sz * 0.2 },
    { x: cx, y: cy + sz * 1.4 },
    { x: cx - sz * 1.1, y: cy + sz * 0.8 },
    [79, 95, 247]
  );
  // Right
  drawIsoQuad(
    { x: cx, y: cy + sz * 0.2 },
    { x: cx + sz * 1.1, y: cy - sz * 0.4 },
    { x: cx + sz * 1.1, y: cy + sz * 0.8 },
    { x: cx, y: cy + sz * 1.4 },
    [40, 50, 160]
  );

  // Typography on Left
  renderTextToCanvas(rgb, width, height, 'MECRAFT', 14, 18, 2, [255, 255, 255]);
  renderTextToCanvas(rgb, width, height, 'STUDIO', 15, 36, 1, [6, 182, 212]);

  return createBmp(width, height, (x, y) => {
    const idx = (y * width + x) * 3;
    return [rgb[idx], rgb[idx + 1], rgb[idx + 2]];
  });
}

// Generate and write both files
const sidebarBmp = generateSidebar();
const sidebarPath = path.join(iconsDir, 'installer-sidebar.bmp');
fs.writeFileSync(sidebarPath, sidebarBmp);
console.log(`[generate-bitmaps] Generated: ${sidebarPath} (${sidebarBmp.length} bytes, 164x314)`);

const headerBmp = generateHeader();
const headerPath = path.join(iconsDir, 'installer-header.bmp');
fs.writeFileSync(headerPath, headerBmp);
console.log(`[generate-bitmaps] Generated: ${headerPath} (${headerBmp.length} bytes, 150x57)`);
