"""
refine_branding_icons.py
Produces 100% clean, anti-aliased, de-fringed transparent PNGs:
1. Square 1:1 master icons (1024x1024) centered with 6% safe padding - ideal for app icons, web cards, launcher.
2. Full 16:9 widescreen transparent cutouts (2752x1536).
Saves to all required workspace directories.
"""

import os
import sys
import time
import numpy as np
from PIL import Image

# Ensure UTF-8 stdout on Windows
sys.stdout.reconfigure(encoding='utf-8')

IMAGE_MAPPING = [
    ('Demon_king_logo_emblem_16067157_2K.jpg', 'mecraft-suite.png'),
    ('Guardian_mask_and_mace_logo_dc648105_2K.jpg', 'mepdf.png'),
    ('Naga_serpent_wrapping_crystal_gem_7b9b865e_2K.jpg', 'mephoto.png'),
    ('Garuda_eagle_logo_emblem_ac376ddc_2K.jpg', 'mevector.png'),
    ('Minimalist_Thai_Kinnari_logo_emblem_95375f95_2K.jpg', 'mefilm.png'),
    ('Golden_mermaid_tail_logo_57ff4c4b_2K.jpg', 'melight.png'),
    ('Hanuman_warrior_logo_icon_edd1277e_2K.jpg', 'memotion.png'),
    ('Elephant_logo_emblem_on_white_70450e53_2K.jpg', 'medesign.png'),
    ('Phra_Phirap_mask_logo_emblem_dafae785_2K.jpg', 'meaudio.png'),
    ('Logo_emblem_with_crystal_lotus_242e505b_2K.jpg', 'medoc.png'),
    ('Minimalist_architect_logo_emblem_cbf9b459_2K.jpg', 'me3d.png'),
    ('Gold_Thai_armor_emblem_badge_649968b7_2K.jpg', 'privacy-seal.png'),
]

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
WEBSITE_DIR = os.path.join(os.path.dirname(ROOT_DIR), 'mecrafts-website')
SOURCE_DIR = r'D:\Users\hotme\Downloads'

TARGET_DIRS = [
    os.path.join(ROOT_DIR, 'public', 'branding'),
    os.path.join(ROOT_DIR, 'assets', 'icons'),
    os.path.join(ROOT_DIR, 'apps', 'mecraft-launcher', 'public', 'branding'),
    os.path.join(WEBSITE_DIR, 'assets', 'branding'),
]

def process_image(src_path, dst_name):
    # Check if rembg output already exists in public/branding
    cached_path = os.path.join(ROOT_DIR, 'public', 'branding', dst_name)
    if os.path.exists(cached_path):
        img = Image.open(cached_path).convert('RGBA')
    else:
        import rembg
        session = rembg.new_session('bria-rmbg')
        orig = Image.open(src_path)
        img = rembg.remove(orig, session=session).convert('RGBA')

    arr = np.array(img, dtype=np.float32)
    rgb = arr[:, :, :3]
    alpha = arr[:, :, 3]

    # 1. Solidify near-opaque interior: clamp alpha >= 240 to 255.0
    alpha[alpha >= 240] = 255.0
    
    # Clean up very faint background noise
    alpha[alpha < 10] = 0.0

    # 2. Color de-fringing (un-multiply against white background)
    # C_obs = a * C_fg + (1 - a) * 255
    # C_fg = (C_obs - (1 - a) * 255) / a
    feather_mask = (alpha > 0) & (alpha < 255)
    if np.any(feather_mask):
        a_norm = alpha[feather_mask, np.newaxis] / 255.0
        c_obs = rgb[feather_mask]
        c_clean = (c_obs - (1.0 - a_norm) * 255.0) / np.maximum(a_norm, 0.05)
        rgb[feather_mask] = np.clip(c_clean, 0.0, 255.0)

    # 3. Assemble cleaned 16:9 full image
    clean_arr = np.dstack([rgb, alpha]).astype(np.uint8)
    full_clean_img = Image.fromarray(clean_arr, mode='RGBA')

    # 4. Create perfectly centered 1:1 square icon (1024x1024)
    rows = np.any(alpha > 15, axis=1)
    cols = np.any(alpha > 15, axis=0)
    
    if np.any(rows) and np.any(cols):
        rmin, rmax = np.where(rows)[0][[0, -1]]
        cmin, cmax = np.where(cols)[0][[0, -1]]
        
        # Crop to tight bounding box
        cropped = full_clean_img.crop((cmin, rmin, cmax + 1, rmax + 1))
        cw, ch = cropped.size
        
        # Determine square canvas dimension with 6% margin
        max_dim = max(cw, ch)
        canvas_dim = int(max_dim * 1.12)  # 6% padding each side
        
        square_img = Image.new('RGBA', (canvas_dim, canvas_dim), (0, 0, 0, 0))
        offset_x = (canvas_dim - cw) // 2
        offset_y = (canvas_dim - ch) // 2
        square_img.paste(cropped, (offset_x, offset_y), cropped)
        
        # Resize to standard 1024x1024 high-DPI square icon
        square_1024 = square_img.resize((1024, 1024), Image.Resampling.LANCZOS)
    else:
        square_1024 = full_clean_img.resize((1024, 1024), Image.Resampling.LANCZOS)

    return full_clean_img, square_1024

def main():
    print('Starting high-precision transparent PNG refinement and square 1:1 icon generation...')
    for d in TARGET_DIRS:
        os.makedirs(d, exist_ok=True)
        print(f'Ensured target directory: {d}')

    t0 = time.time()
    for idx, (src_file, dst_name) in enumerate(IMAGE_MAPPING, start=1):
        src_path = os.path.join(SOURCE_DIR, src_file)
        print(f'[{idx:02d}/12] Processing {dst_name}...')
        
        full_img, square_img = process_image(src_path, dst_name)
        
        # Save square 1:1 icon as primary `{dst_name}` (e.g. `mepdf.png`)
        # and full 16:9 as `{dst_name_without_ext}-wide.png` (e.g. `mepdf-wide.png`)
        base_name, ext = os.path.splitext(dst_name)
        wide_name = f'{base_name}-wide{ext}'
        
        for d in TARGET_DIRS:
            square_path = os.path.join(d, dst_name)
            wide_path = os.path.join(d, wide_name)
            
            square_img.save(square_path, format='PNG', optimize=True)
            full_img.save(wide_path, format='PNG', optimize=True)
            
        print(f'       Saved {dst_name} (1024x1024 square) and {wide_name} (2752x1536 wide)')

    print(f'\nAll 12 branding assets successfully refined and saved in {time.time() - t0:.2f}s!')

if __name__ == '__main__':
    main()
