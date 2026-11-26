"""
process_new_downloads.py
Processes all 7 newly downloaded 2K images from Google Flow:
1. meDrop app icon (Dragon_horse_leaping_through_wheel) -> 1024x1024 square & wide transparent PNG
2. Open Source seal badge -> transparent PNG
3. 3D Software packaging box -> transparent PNG
4. RAM chip privacy engine -> transparent PNG
5. 12 Guardians panoramic strip -> transparent PNG
6. GitHub Social Preview banner -> full-bleed 2752x1536 high-res banner
7. Website Hero Cyber Sanctuary -> full-bleed 2752x1536 high-res background art
Distributes to all relevant project locations:
- public/branding/ & public/assets/branding/
- assets/icons/ & assets/branding/
- apps/mecraft-launcher/public/branding/ & apps/mecraft-launcher/public/assets/branding/
- meCrafts-website/assets/branding/
"""

import os
import sys
import time
import numpy as np
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
WEBSITE_DIR = os.path.join(os.path.dirname(ROOT_DIR), 'mecrafts-website')
SOURCE_DIR = r'D:\Users\hotme\Downloads'

# Output directory groups
BRANDING_DIRS = [
    os.path.join(ROOT_DIR, 'public', 'branding'),
    os.path.join(ROOT_DIR, 'assets', 'icons'),
    os.path.join(ROOT_DIR, 'apps', 'mecraft-launcher', 'public', 'branding'),
    os.path.join(WEBSITE_DIR, 'assets', 'branding'),
]

BANNER_DIRS = [
    os.path.join(ROOT_DIR, 'public', 'assets', 'branding'),
    os.path.join(ROOT_DIR, 'assets', 'branding'),
    os.path.join(ROOT_DIR, 'apps', 'mecraft-launcher', 'public', 'assets', 'branding'),
    os.path.join(WEBSITE_DIR, 'assets', 'branding'),
]

def make_transparent_and_square(src_path, dst_base_name, make_square=True, padding_ratio=1.12):
    import rembg
    session = rembg.new_session('bria-rmbg')
    orig = Image.open(src_path).convert('RGB')
    rgba = rembg.remove(orig, session=session).convert('RGBA')

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

    square_img = None
    if make_square:
        rows = np.any(alpha > 15, axis=1)
        cols = np.any(alpha > 15, axis=0)
        if np.any(rows) and np.any(cols):
            rmin, rmax = np.where(rows)[0][[0, -1]]
            cmin, cmax = np.where(cols)[0][[0, -1]]
            cropped = full_clean_img.crop((cmin, rmin, cmax + 1, rmax + 1))
            cw, ch = cropped.size
            max_dim = max(cw, ch)
            canvas_dim = int(max_dim * padding_ratio)
            sq = Image.new('RGBA', (canvas_dim, canvas_dim), (0, 0, 0, 0))
            offset_x = (canvas_dim - cw) // 2
            offset_y = (canvas_dim - ch) // 2
            sq.paste(cropped, (offset_x, offset_y), cropped)
            square_img = sq.resize((1024, 1024), Image.Resampling.LANCZOS)
        else:
            square_img = full_clean_img.resize((1024, 1024), Image.Resampling.LANCZOS)

    return full_clean_img, square_img

def main():
    print('Starting processing of 7 new meCraft branding & web assets...')
    for d in BRANDING_DIRS + BANNER_DIRS:
        os.makedirs(d, exist_ok=True)

    t0 = time.time()

    # 1. meDrop App Icon
    print('\n[1/7] Processing meDrop (Ma Nil Mangkon)...')
    medrop_src = os.path.join(SOURCE_DIR, 'Dragon_horse_leaping_through_wheel_9fa976da_2K.jpg')
    medrop_full, medrop_square = make_transparent_and_square(medrop_src, 'medrop')
    for d in BRANDING_DIRS:
        medrop_square.save(os.path.join(d, 'medrop.png'), format='PNG', optimize=True)
        medrop_full.save(os.path.join(d, 'medrop-wide.png'), format='PNG', optimize=True)
    print('       Saved medrop.png (1024x1024) and medrop-wide.png (2752x1536)')

    # 2. Open Source Diamond Seal
    print('\n[2/7] Processing Open Source Seal Badge...')
    seal_src = os.path.join(SOURCE_DIR, 'Gold_seal_badge_with_lotus_e3ca1106_2K.jpg')
    seal_full, seal_square = make_transparent_and_square(seal_src, 'open-source-seal')
    for d in BRANDING_DIRS + BANNER_DIRS:
        seal_square.save(os.path.join(d, 'open-source-seal.png'), format='PNG', optimize=True)
        seal_full.save(os.path.join(d, 'open-source-seal-wide.png'), format='PNG', optimize=True)
    print('       Saved open-source-seal.png (1024x1024) and wide version')

    # 3. 3D Software Packaging Box
    print('\n[3/7] Processing 3D Software Packaging Box...')
    box_src = os.path.join(SOURCE_DIR, 'Software_retail_packaging_box_mo…_bb6275d4_2K.jpg')
    box_full, box_square = make_transparent_and_square(box_src, 'suite-installer-box')
    for d in BRANDING_DIRS + BANNER_DIRS:
        box_square.save(os.path.join(d, 'suite-installer-box.png'), format='PNG', optimize=True)
        box_full.save(os.path.join(d, 'suite-installer-box-wide.png'), format='PNG', optimize=True)
    print('       Saved suite-installer-box.png (1024x1024) and wide version')

    # 4. In-Device RAM Privacy Engine
    print('\n[4/7] Processing 100% In-Device RAM Privacy Engine...')
    ram_src = os.path.join(SOURCE_DIR, 'RAM_chip_in_armor_cage_3d66ba8b_2K.jpg')
    ram_full, ram_square = make_transparent_and_square(ram_src, 'in-device-engine')
    for d in BRANDING_DIRS + BANNER_DIRS:
        ram_square.save(os.path.join(d, 'in-device-engine.png'), format='PNG', optimize=True)
        ram_full.save(os.path.join(d, 'in-device-engine-wide.png'), format='PNG', optimize=True)
    print('       Saved in-device-engine.png (1024x1024) and wide version')

    # 5. 12 Guardians Panoramic Strip
    print('\n[5/7] Processing 12 Guardians Panoramic Line-up Strip...')
    pano_src = os.path.join(SOURCE_DIR, 'Thai_mythology_character_emblems…_0e62bacb_2K.jpg')
    pano_full, _ = make_transparent_and_square(pano_src, 'guardians-panorama', make_square=False)
    for d in BANNER_DIRS:
        pano_full.save(os.path.join(d, 'guardians-panorama.png'), format='PNG', optimize=True)
    print('       Saved guardians-panorama.png (2752x1536 transparent strip)')

    # 6. GitHub Social Preview & Repo Header Banner
    print('\n[6/7] Processing GitHub Social Preview & Repo Header...')
    gh_src = os.path.join(SOURCE_DIR, 'Golden_emblem_with_mythological_…_35c86f07_2K.jpg')
    gh_img = Image.open(gh_src).convert('RGB')
    for d in BANNER_DIRS:
        gh_img.save(os.path.join(d, 'github-social-preview.png'), format='PNG', optimize=True)
        gh_img.save(os.path.join(d, 'github-social-preview.jpg'), format='JPEG', quality=95)
        gh_img.save(os.path.join(d, 'mecraft-hero-banner.jpg'), format='JPEG', quality=95)
    print('       Saved github-social-preview.png/jpg and mecraft-hero-banner.jpg')

    # 7. Website Hero Cyber Sanctuary Key Art
    print('\n[7/7] Processing Website Hero Cyber Sanctuary...')
    hero_src = os.path.join(SOURCE_DIR, 'Cyber_sanctuary_with_floating_pa…_d7af2773_2K.jpg')
    hero_img = Image.open(hero_src).convert('RGB')
    for d in BANNER_DIRS:
        hero_img.save(os.path.join(d, 'hero-cyber-sanctuary.png'), format='PNG', optimize=True)
        hero_img.save(os.path.join(d, 'hero-cyber-sanctuary.jpg'), format='JPEG', quality=95)
    print('       Saved hero-cyber-sanctuary.png/jpg (2752x1536)')

    print(f'\nAll 7 new branding & web visual assets successfully processed in {time.time() - t0:.2f}s!')

if __name__ == '__main__':
    main()
