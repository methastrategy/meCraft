import os
import sys
import numpy as np
from PIL import Image
from scipy import ndimage

sys.stdout.reconfigure(encoding='utf-8')

def fit_background_plane(arr):
    h, w, _ = arr.shape
    samples = []
    coords = []
    for y in [2, 4, h-5, h-3]:
        for x in range(0, w, 40):
            samples.append(arr[y, x])
            coords.append([x, y, 1.0])
    for x in [2, 4, w-5, w-3]:
        for y in range(0, h, 40):
            samples.append(arr[y, x])
            coords.append([x, y, 1.0])
    coeffs, _, _, _ = np.linalg.lstsq(coords, samples, rcond=None)
    gx, gy = np.meshgrid(np.arange(w), np.arange(h))
    bg_plane = gx[:, :, None] * coeffs[0] + gy[:, :, None] * coeffs[1] + coeffs[2]
    return bg_plane

def cut_image(img_path, is_medoc=False):
    img = Image.open(img_path).convert('RGB')
    arr = np.array(img, dtype=float)
    h, w, _ = arr.shape

    # 1. Background plane
    bg_plane = fit_background_plane(arr)

    # 2. Perceptual diff from background
    diff = np.max(np.abs(arr - bg_plane), axis=2)

    # 3. Saturation & Gradient
    sat = arr.max(axis=2) - arr.min(axis=2)
    bright = arr.mean(axis=2)

    gx = ndimage.sobel(arr, axis=1)
    gy = ndimage.sobel(arr, axis=0)
    grad = np.sqrt(gx**2 + gy**2).max(axis=2)

    # 4. Background & Shadow criteria
    # Pure background: difference <= 14
    is_pure_bg = diff <= 14

    # Diffuse shadow on white wall/floor:
    # Bright (>135), very desaturated (sat < 14), low gradient (grad < 25), and not very dark (diff < 90)
    is_shadow = (arr > 135).all(axis=2) & (sat < 14) & (grad < 25) & (diff < 90)

    bg_seed = is_pure_bg | is_shadow

    # 5. Connected component flood-fill from the outer image borders
    labeled, n_features = ndimage.label(bg_seed)
    border_labels = set(np.unique(np.concatenate([labeled[0, :], labeled[-1, :], labeled[:, 0], labeled[:, -1]])))
    if 0 in border_labels:
        border_labels.remove(0)
    bg_mask = np.isin(labeled, list(border_labels))

    # For medoc: also include large interior ribbon loop (>20,000 px)
    if is_medoc:
        enc_labels = set(range(1, n_features + 1)) - border_labels
        for lbl in enc_labels:
            m = (labeled == lbl)
            if m.sum() > 20000 and diff[m].mean() < 16:
                bg_mask |= m

    # 6. Smooth anti-aliased edge with feathering
    # The true foreground mask is ~bg_mask
    fg_mask = ~bg_mask

    # Distance transform from background (positive inside foreground)
    dist_inside = ndimage.distance_transform_edt(fg_mask)
    # Distance transform from foreground (positive inside background)
    dist_outside = ndimage.distance_transform_edt(bg_mask)

    # Signed distance: positive inside object, negative in background
    signed_dist = dist_inside - dist_outside

    # Anti-aliasing transition band: width ~ 2.0 pixels [-1.0, 1.0]
    feather_radius = 1.2
    alpha = np.clip((signed_dist + feather_radius) / (2.0 * feather_radius), 0.0, 1.0)
    # Smoothstep
    alpha = alpha * alpha * (3.0 - 2.0 * alpha)

    # 7. Color decontamination (un-premultiplying white background)
    decontam = arr.copy()
    semi = (alpha > 0.02) & (alpha < 0.98)
    a = alpha[semi, None]
    bg_val = bg_plane[semi]
    decontam[semi] = np.clip((arr[semi] - (1.0 - a) * bg_val) / np.maximum(a, 0.1), 0.0, 255.0)

    rgba = np.dstack([decontam, alpha * 255.0]).astype(np.uint8)
    return Image.fromarray(rgba, 'RGBA')

download_dir = r'D:\Users\hotme\Downloads'
tests = [
    ('Demon_king_logo_emblem_16067157_2K.jpg', 'mecraft-suite', False),
    ('Hanuman_warrior_logo_icon_edd1277e_2K.jpg', 'memotion', False),
    ('Logo_emblem_with_crystal_lotus_242e505b_2K.jpg', 'medoc', True),
    ('Phra_Phirap_mask_logo_emblem_dafae785_2K.jpg', 'meaudio', False),
    ('Minimalist_architect_logo_emblem_cbf9b459_2K.jpg', 'me3d', False),
    ('Gold_Thai_armor_emblem_badge_649968b7_2K.jpg', 'privacy-seal', False),
]

os.makedirs(r'D:\METHA\Projects\meCraft-Project\thumb_inspect\v2', exist_ok=True)
for src, name, is_m in tests:
    print(f'Processing {name}...')
    res = cut_image(os.path.join(download_dir, src), is_medoc=is_m)
    
    # Save preview on pure black
    black_bg = Image.new('RGB', res.size, (10, 10, 14))
    black_bg.paste(res, mask=res.split()[3])
    w, h = res.size
    thumb_b = black_bg.resize((640, int(h * 640 / w)), Image.Resampling.LANCZOS)
    p = f'D:/METHA/Projects/meCraft-Project/thumb_inspect/v2/{name}_black.png'
    thumb_b.save(p)
    print(f'Saved {p}')

print('All v2 tests completed successfully!')
