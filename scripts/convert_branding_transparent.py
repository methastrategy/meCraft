import os
import sys
import time
from PIL import Image
import rembg
import numpy as np

# Ensure Windows UTF-8 stdout
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

SOURCE_DIR = r'D:\Users\hotme\Downloads'
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))

TARGET_DIRS = [
    os.path.join(ROOT_DIR, 'public', 'branding'),
    os.path.join(ROOT_DIR, 'assets', 'icons'),
    os.path.join(ROOT_DIR, 'apps', 'mecraft-launcher', 'public', 'branding'),
]

def main():
    print('=====================================================')
    print('meCraft 12-Branding PNG Die-Cut Conversion Pipeline')
    print('=====================================================')
    
    # 1. Create target directories
    for d in TARGET_DIRS:
        os.makedirs(d, exist_ok=True)
        print(f'Ensured target directory: {d}')
        
    session = rembg.new_session('bria-rmbg')
    results = []
    
    total_start = time.time()
    
    for idx, (src_file, dst_name) in enumerate(IMAGE_MAPPING, start=1):
        src_path = os.path.join(SOURCE_DIR, src_file)
        if not os.path.exists(src_path):
            raise FileNotFoundError(f'Source image not found: {src_path}')
            
        print(f'[{idx:02d}/12] Processing {src_file} -> {dst_name}...')
        t0 = time.time()
        
        orig_img = Image.open(src_path)
        orig_size = orig_img.size
        
        # Apply rembg with BRIA RMBG 2.0 session
        rgba_img = rembg.remove(orig_img, session=session)
        if rgba_img.mode != 'RGBA':
            rgba_img = rgba_img.convert('RGBA')
            
        # Verify alpha channel stats
        alpha_channel = np.array(rgba_img.split()[3])
        trans_pct = (alpha_channel == 0).mean() * 100
        opaque_pct = (alpha_channel == 255).mean() * 100
        feather_pct = ((alpha_channel > 0) & (alpha_channel < 255)).mean() * 100
        
        # Save to all 3 destination directories
        saved_paths = []
        for d in TARGET_DIRS:
            dst_path = os.path.join(d, dst_name)
            rgba_img.save(dst_path, format='PNG', optimize=True)
            saved_paths.append(dst_path)
            
        elapsed = time.time() - t0
        print(f'       Done in {elapsed:.2f}s | Size: {orig_size} | Alpha: 0={trans_pct:.1f}%, 255={opaque_pct:.1f}%, feather={feather_pct:.1f}%')
        
        results.append({
            'source': src_file,
            'dest': dst_name,
            'size': orig_size,
            'time': elapsed,
            'trans_pct': trans_pct,
            'opaque_pct': opaque_pct,
            'feather_pct': feather_pct,
            'paths': saved_paths
        })
        
    total_elapsed = time.time() - total_start
    print('=====================================================')
    print(f'All 12 images converted successfully in {total_elapsed:.2f}s!')
    print('=====================================================')
    
    # 2. Comprehensive verification
    print('\nVerifying all target directories:')
    all_ok = True
    for d in TARGET_DIRS:
        print(f'\nDirectory: {d}')
        for _, dst_name in IMAGE_MAPPING:
            p = os.path.join(d, dst_name)
            if not os.path.exists(p):
                print(f'  [FAIL] Missing file: {dst_name}')
                all_ok = False
                continue
            fsize_kb = os.path.getsize(p) / 1024
            check_img = Image.open(p)
            mode = check_img.mode
            size = check_img.size
            has_alpha = ('A' in mode)
            status = 'OK' if (mode == 'RGBA' and size == (2752, 1536) and fsize_kb > 50) else 'FAIL'
            if status != 'OK':
                all_ok = False
            print(f'  [{status}] {dst_name:18} | Mode: {mode:4} | Size: {size} | FileSize: {fsize_kb:6.1f} KB')
            
    if all_ok:
        print('\n[SUCCESS] 100% Verification Passed for all 12 images across all 3 target directories.')
    else:
        print('\n[FAILURE] Verification encountered discrepancies!')
        sys.exit(1)

if __name__ == '__main__':
    main()
