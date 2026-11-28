"""
update_suite_monogram.py
Processes Golden_M_monogram_icon_39014b75_2K.jpg to replace meCraft Master Suite emblem:
1. Precision background removal using rembg (bria-rmbg)
2. Alpha defringing & un-multiplication against white background
3. Interior opacity clamping (alpha >= 240 -> 255)
4. Full wide 2752x1536 cutout -> mecraft-suite-wide.png / .webp
5. Centered 1024x1024 1:1 square icon -> mecraft-suite.png / .webp
6. Distribute across all branding and app directories
7. Regenerate Tauri multi-res icons in apps/mecraft-launcher/src-tauri/icons/
"""

import os
import sys
import time
import numpy as np
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
WEBSITE_DIR = os.path.join(os.path.dirname(ROOT_DIR), 'mecrafts-website')
SRC_IMAGE = r'D:\Users\hotme\Downloads\Golden_M_monogram_icon_39014b75_2K.jpg'

def process_suite_monogram():
    print(f"[1/4] Loading source image from {SRC_IMAGE}...")
    if not os.path.exists(SRC_IMAGE):
        raise FileNotFoundError(f"Source file not found: {SRC_IMAGE}")
        
    orig = Image.open(SRC_IMAGE).convert('RGB')
    print(f"      Source image size: {orig.size}, mode: {orig.mode}")

    print("[2/4] Removing background with bria-rmbg model...")
    import rembg
    session = rembg.new_session('bria-rmbg')
    rgba = rembg.remove(orig, session=session).convert('RGBA')

    print("[3/4] Performing color defringing and alpha correction...")
    arr = np.array(rgba, dtype=np.float32)
    rgb = arr[:, :, :3]
    alpha = arr[:, :, 3]

    # Solidify interior highlights
    alpha[alpha >= 240] = 255.0
    alpha[alpha < 10] = 0.0

    # Color de-fringing against white background
    feather_mask = (alpha > 0) & (alpha < 255)
    if np.any(feather_mask):
        a_norm = alpha[feather_mask, np.newaxis] / 255.0
        c_obs = rgb[feather_mask]
        c_clean = (c_obs - (1.0 - a_norm) * 255.0) / np.maximum(a_norm, 0.05)
        rgb[feather_mask] = np.clip(c_clean, 0.0, 255.0)

    clean_arr = np.dstack([rgb, alpha]).astype(np.uint8)
    full_clean_img = Image.fromarray(clean_arr, mode='RGBA')

    # Tight crop and center with 6% safe padding (canvas = max_dim * 1.12)
    rows = np.any(alpha > 15, axis=1)
    cols = np.any(alpha > 15, axis=0)
    if np.any(rows) and np.any(cols):
        rmin, rmax = np.where(rows)[0][[0, -1]]
        cmin, cmax = np.where(cols)[0][[0, -1]]
        cropped = full_clean_img.crop((cmin, rmin, cmax + 1, rmax + 1))
        cw, ch = cropped.size
        max_dim = max(cw, ch)
        canvas_dim = int(max_dim * 1.12)
        sq = Image.new('RGBA', (canvas_dim, canvas_dim), (0, 0, 0, 0))
        offset_x = (canvas_dim - cw) // 2
        offset_y = (canvas_dim - ch) // 2
        sq.paste(cropped, (offset_x, offset_y), cropped)
        square_img = sq.resize((1024, 1024), Image.Resampling.LANCZOS)
    else:
        square_img = full_clean_img.resize((1024, 1024), Image.Resampling.LANCZOS)

    print("      Successfully generated clean 2752x1536 wide and 1024x1024 square images.")
    return full_clean_img, square_img

def distribute_branding_assets(wide_img, square_img):
    print("[4/4] Distributing branding assets across all workspace locations...")
    
    # Locate all directories that currently contain mecraft-suite.png
    target_dirs = set()
    
    # Explicit core directories
    core_dirs = [
        os.path.join(ROOT_DIR, 'public', 'branding'),
        os.path.join(ROOT_DIR, 'public', 'assets', 'branding'),
        os.path.join(ROOT_DIR, 'assets', 'icons'),
        os.path.join(ROOT_DIR, 'assets', 'branding'),
        os.path.join(ROOT_DIR, 'apps', 'mecraft-launcher', 'public', 'branding'),
        os.path.join(ROOT_DIR, 'apps', 'mecraft-launcher', 'public', 'assets', 'branding'),
        os.path.join(ROOT_DIR, 'apps', 'medoc', 'public', 'branding'),
        os.path.join(ROOT_DIR, 'apps', 'medoc', 'public', 'assets', 'branding'),
        os.path.join(ROOT_DIR, 'apps', 'medrop', 'public', 'branding'),
        os.path.join(ROOT_DIR, 'apps', 'medrop', 'public', 'assets', 'branding'),
        os.path.join(ROOT_DIR, 'apps', 'mepdf', 'public', 'branding'),
        os.path.join(ROOT_DIR, 'apps', 'mepdf', 'public', 'assets', 'branding'),
        os.path.join(ROOT_DIR, 'apps', 'mephoto', 'public', 'branding'),
        os.path.join(ROOT_DIR, 'apps', 'mephoto', 'public', 'assets', 'branding'),
        os.path.join(WEBSITE_DIR, 'assets', 'branding'),
        os.path.join(WEBSITE_DIR, 'branding'),
    ]
    for d in core_dirs:
        target_dirs.add(d)

    # Scan for any other directory containing mecraft-suite.png
    for root, dirs, files in os.walk(ROOT_DIR):
        if '.git' in root or 'node_modules' in root:
            continue
        if 'mecraft-suite.png' in files:
            target_dirs.add(root)

    print(f"      Writing to {len(target_dirs)} directories...")
    for d in sorted(target_dirs):
        os.makedirs(d, exist_ok=True)
        sq_png = os.path.join(d, 'mecraft-suite.png')
        sq_webp = os.path.join(d, 'mecraft-suite.webp')
        wide_png = os.path.join(d, 'mecraft-suite-wide.png')
        wide_webp = os.path.join(d, 'mecraft-suite-wide.webp')

        square_img.save(sq_png, format='PNG', optimize=True)
        square_img.save(sq_webp, format='WEBP', quality=92, method=6)
        wide_img.save(wide_png, format='PNG', optimize=True)
        wide_img.save(wide_webp, format='WEBP', quality=92, method=6)

    print(f"      Saved all PNG and WebP assets to {len(target_dirs)} locations.")

def update_tauri_icons(square_img):
    print("      Updating Tauri desktop icons in apps/mecraft-launcher/src-tauri/icons/...")
    icons_dir = os.path.join(ROOT_DIR, 'apps', 'mecraft-launcher', 'src-tauri', 'icons')
    os.makedirs(icons_dir, exist_ok=True)

    # Multi-res icon.ico
    ico_path = os.path.join(icons_dir, 'icon.ico')
    ico_sizes = [(256, 256), (128, 128), (64, 64), (48, 48), (32, 32), (24, 24), (16, 16)]
    square_img.save(ico_path, format='ICO', sizes=ico_sizes)
    print(f"      Generated {ico_path} with sizes: {ico_sizes}")

    # Standard Tauri PNG sizes
    png_specs = {
        'icon.png': (512, 512),
        '128x128.png': (128, 128),
        '128x128@2x.png': (256, 256),
        '32x32.png': (32, 32),
        'Square30x30Logo.png': (30, 30),
        'Square44x44Logo.png': (44, 44),
        'Square71x71Logo.png': (71, 71),
        'Square89x89Logo.png': (89, 89),
        'Square107x107Logo.png': (107, 107),
        'Square142x142Logo.png': (142, 142),
        'Square150x150Logo.png': (150, 150),
        'Square284x284Logo.png': (284, 284),
        'Square310x310Logo.png': (310, 310),
        'StoreLogo.png': (50, 50),
    }

    for name, size in png_specs.items():
        out_path = os.path.join(icons_dir, name)
        resized = square_img.resize(size, Image.Resampling.LANCZOS)
        resized.save(out_path, format='PNG', optimize=True)
        print(f"      Saved {name} ({size[0]}x{size[1]})")

def main():
    t0 = time.time()
    print("=== meCraft Master Suite Emblem Upgrade (Golden M Monogram) ===")
    wide_img, square_img = process_suite_monogram()
    distribute_branding_assets(wide_img, square_img)
    update_tauri_icons(square_img)
    print(f"\n✨ All operations completed successfully in {time.time() - t0:.2f}s!")

if __name__ == '__main__':
    main()
