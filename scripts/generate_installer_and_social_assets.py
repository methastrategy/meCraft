"""
generate_installer_and_social_assets.py
Generates:
1. apps/mecraft-launcher/src-tauri/icons/installer-sidebar.bmp (164 x 314 px, 24-bit RGB BMP)
   Featuring the Golden M Monogram emblem, luxury dark gradient, and crisp typography.
2. apps/mecraft-launcher/src-tauri/icons/installer-header.bmp (150 x 57 px, 24-bit RGB BMP)
   Featuring mini Golden M Monogram, luxury slate background, and crisp header title.
3. github-social-preview.png & .webp (2752 x 1536 px)
   Featuring the Cyber Sanctuary environment, glowing Golden M Monogram, and meCrafts branding.
Distributes to all monorepo branding directories.
"""

import os
import sys
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = r'd:\METHA\Projects\meCraft-Project'
MONOGRAM_PATH = os.path.join(ROOT_DIR, 'public', 'branding', 'mecraft-suite.png')
CYBER_SANCTUARY_PATH = r'D:\Users\hotme\Downloads\Cyber_sanctuary_with_floating_pa…_d7af2773_2K.jpg'

FONT_BOLD = r'C:\Windows\Fonts\segoeuib.ttf'
FONT_REGULAR = r'C:\Windows\Fonts\segoeui.ttf'

def get_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()

def draw_centered_text(draw, y, text, font, color, canvas_width):
    bbox = font.getbbox(text)
    text_width = bbox[2] - bbox[0]
    x = (canvas_width - text_width) // 2
    draw.text((x, y), text, font=font, fill=color)

def generate_installer_sidebar():
    print("[1/3] Generating NSIS installer-sidebar.bmp (164x314)...")
    width, height = 164, 314
    
    # 1. Base Gradient: Obsidian Slate to Deep Indigo
    canvas = Image.new('RGB', (width, height), (7, 10, 18))
    draw = ImageDraw.Draw(canvas)
    
    for y in range(height):
        t = y / height
        r = int(6 + t * 8)
        g = int(8 + t * 14)
        b = int(14 + t * 26)
        draw.line([(0, y), (width, y)], fill=(r, g, b))
        
    # 2. Ambient Glow behind Monogram (center at x=82, y=80)
    glow = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    cx, cy = 82, 80
    for r in range(70, 0, -5):
        alpha = int(45 * (1.0 - r / 70))
        # Subtle gold/amber core with cyan edge
        gold_mix = (230, 160, 30, alpha)
        glow_draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=gold_mix)
    glow = glow.filter(ImageFilter.GaussianBlur(8))
    canvas.paste(glow, (0, 0), glow)

    # 3. Paste Golden M Monogram (108x108)
    if os.path.exists(MONOGRAM_PATH):
        mono = Image.open(MONOGRAM_PATH).convert('RGBA')
        mono_resized = mono.resize((106, 106), Image.Resampling.LANCZOS)
        mx = (width - 106) // 2
        my = 26
        canvas.paste(mono_resized, (mx, my), mono_resized)

    # 4. Render Crisp Typography
    f_title = get_font(FONT_BOLD, 17)
    f_sub = get_font(FONT_BOLD, 11)
    f_item = get_font(FONT_BOLD, 9)
    f_tag = get_font(FONT_REGULAR, 8)

    draw_centered_text(draw, 142, "MECRAFT", f_title, (255, 255, 255), width)
    draw_centered_text(draw, 164, "SUITE V3.2", f_sub, (6, 182, 212), width)
    
    draw_centered_text(draw, 186, "100% PRIVATE", f_item, (203, 213, 225), width)
    draw_centered_text(draw, 202, "LOCAL CPU / GPU", f_tag, (148, 163, 184), width)
    draw_centered_text(draw, 216, "ZERO SERVER UPLOAD", f_tag, (100, 116, 139), width)

    # Cyan Accent Bar
    draw.line([(24, 236), (width - 24, 236)], fill=(6, 182, 212), width=1)

    # Feature Badges
    draw_centered_text(draw, 246, "PRIVATE DOCUMENT LAB", f_tag, (56, 189, 248), width)
    draw_centered_text(draw, 260, "OFFLINE AI STUDIO", f_tag, (251, 191, 36), width)
    draw_centered_text(draw, 274, "STANDALONE SUITE", f_tag, (148, 163, 184), width)

    out_path = os.path.join(ROOT_DIR, 'apps', 'mecraft-launcher', 'src-tauri', 'icons', 'installer-sidebar.bmp')
    canvas.save(out_path, format='BMP')
    print(f"      Saved {out_path} ({width}x{height})")
    return canvas

def generate_installer_header():
    print("[2/3] Generating NSIS installer-header.bmp (150x57)...")
    width, height = 150, 57
    canvas = Image.new('RGB', (width, height), (9, 13, 22))
    draw = ImageDraw.Draw(canvas)

    for y in range(height):
        t = y / height
        r = int(8 + t * 6)
        g = int(11 + t * 9)
        b = int(18 + t * 16)
        draw.line([(0, y), (width, y)], fill=(r, g, b))

    # Left text
    f_head = get_font(FONT_BOLD, 12)
    f_desc = get_font(FONT_REGULAR, 8)
    draw.text((12, 12), "meCraft Suite", font=f_head, fill=(255, 255, 255))
    draw.text((12, 30), "Private Creative Lab", font=f_desc, fill=(148, 163, 184))

    # Right mini emblem
    if os.path.exists(MONOGRAM_PATH):
        mono = Image.open(MONOGRAM_PATH).convert('RGBA')
        mini = mono.resize((44, 44), Image.Resampling.LANCZOS)
        canvas.paste(mini, (100, 6), mini)

    # Bottom hairline in laser cyan
    draw.line([(0, height - 1), (width, height - 1)], fill=(6, 182, 212), width=1)

    out_path = os.path.join(ROOT_DIR, 'apps', 'mecraft-launcher', 'src-tauri', 'icons', 'installer-header.bmp')
    canvas.save(out_path, format='BMP')
    print(f"      Saved {out_path} ({width}x{height})")
    return canvas

def generate_social_preview():
    print("[3/3] Generating 2752x1536 GitHub Social Preview banner...")
    width, height = 2752, 1536

    # 1. Base Layer: Cyber Sanctuary or Dark Luxury Gradient
    if os.path.exists(CYBER_SANCTUARY_PATH):
        base = Image.open(CYBER_SANCTUARY_PATH).convert('RGBA').resize((width, height), Image.Resampling.LANCZOS)
    else:
        base = Image.new('RGBA', (width, height), (10, 14, 26, 255))

    # 2. Luxury Dark Vignette Overlay to highlight center content
    vignette = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    v_draw = ImageDraw.Draw(vignette)
    
    # Bottom scrim gradient for text legibility
    for y in range(height):
        t = y / height
        # Stronger dark vignette at bottom and edges
        alpha = int(120 + 110 * (t ** 1.8))
        v_draw.line([(0, y), (width, y)], fill=(6, 8, 15, alpha))
    base = Image.alpha_composite(base, vignette)

    # 3. Ambient Bloom behind Golden M Monogram (center x=1376, y=520)
    cx, cy = width // 2, 510
    bloom = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    b_draw = ImageDraw.Draw(bloom)
    for r in range(480, 0, -20):
        t = 1.0 - r / 480
        alpha = int(55 * (t ** 2))
        b_draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(245, 158, 11, alpha))
    for r in range(320, 0, -20):
        t = 1.0 - r / 320
        alpha = int(35 * (t ** 2))
        b_draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(6, 182, 212, alpha))
    bloom = bloom.filter(ImageFilter.GaussianBlur(16))
    base = Image.alpha_composite(base, bloom)

    # 4. Composite Golden M Monogram (740x740)
    if os.path.exists(MONOGRAM_PATH):
        mono = Image.open(MONOGRAM_PATH).convert('RGBA')
        mono_large = mono.resize((740, 740), Image.Resampling.LANCZOS)
        mx = (width - 740) // 2
        my = 140
        base.paste(mono_large, (mx, my), mono_large)

    # 5. Render Crisp Headline & Badges
    text_canvas = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    t_draw = ImageDraw.Draw(text_canvas)

    f_hero = get_font(FONT_BOLD, 96)
    f_sub = get_font(FONT_BOLD, 38)
    f_badge = get_font(FONT_BOLD, 26)

    # Title with subtle shadow
    bbox_hero = f_hero.getbbox("meCrafts")
    hero_w = bbox_hero[2] - bbox_hero[0]
    hx = (width - hero_w) // 2
    hy = 910
    t_draw.text((hx + 3, hy + 3), "meCrafts", font=f_hero, fill=(0, 0, 0, 200))
    t_draw.text((hx, hy), "meCrafts", font=f_hero, fill=(255, 255, 255, 255))

    # Subhead
    sub_text = "Private-First Creative & Document Workstation Suite"
    bbox_sub = f_sub.getbbox(sub_text)
    sub_w = bbox_sub[2] - bbox_sub[0]
    sx = (width - sub_w) // 2
    sy = 1030
    t_draw.text((sx + 2, sy + 2), sub_text, font=f_sub, fill=(0, 0, 0, 160))
    t_draw.text((sx, sy), sub_text, font=f_sub, fill=(56, 189, 248, 255))

    # Capsule Badges at y=1130
    badges = [
        ("100% IN-BROWSER & LOCAL DESKTOP", (251, 191, 36)),
        ("ZERO CLOUD ARCHITECTURE", (6, 182, 212)),
        ("OPEN SOURCE & VERIFIED", (168, 85, 247))
    ]
    
    badge_widths = []
    for b_text, _ in badges:
        bb = f_badge.getbbox(b_text)
        badge_widths.append(bb[2] - bb[0] + 52)

    total_badges_w = sum(badge_widths) + (len(badges) - 1) * 24
    curr_bx = (width - total_badges_w) // 2
    by = 1130

    for i, (b_text, b_color) in enumerate(badges):
        bw = badge_widths[i]
        bh = 54
        # Pill background
        pill_rect = [curr_bx, by, curr_bx + bw, by + bh]
        t_draw.rounded_rectangle(pill_rect, radius=27, fill=(15, 23, 42, 200), outline=b_color, width=2)
        
        # Pill text
        bb = f_badge.getbbox(b_text)
        tx = curr_bx + (bw - (bb[2] - bb[0])) // 2
        ty = by + (bh - (bb[3] - bb[1])) // 2 - 3
        t_draw.text((tx, ty), b_text, font=f_badge, fill=b_color)
        curr_bx += bw + 24

    final_img = Image.alpha_composite(base, text_canvas).convert('RGB')

    # Distribute to all branding directories
    banner_dirs = set()
    core_banner_dirs = [
        os.path.join(ROOT_DIR, 'public', 'assets', 'branding'),
        os.path.join(ROOT_DIR, 'assets', 'branding'),
        os.path.join(ROOT_DIR, 'apps', 'mecraft-launcher', 'public', 'assets', 'branding'),
        os.path.join(ROOT_DIR, 'apps', 'medoc', 'public', 'assets', 'branding'),
        os.path.join(ROOT_DIR, 'apps', 'medrop', 'public', 'assets', 'branding'),
        os.path.join(ROOT_DIR, 'apps', 'mepdf', 'public', 'assets', 'branding'),
        os.path.join(ROOT_DIR, 'apps', 'mephoto', 'public', 'assets', 'branding'),
        os.path.join(ROOT_DIR, 'meCrafts-website', 'assets', 'branding'),
    ]
    for d in core_banner_dirs:
        banner_dirs.add(d)

    for root, dirs, files in os.walk(ROOT_DIR):
        if any(x in root for x in ['.git', 'node_modules']):
            continue
        if 'github-social-preview.png' in files or 'github-social-preview.webp' in files:
            banner_dirs.add(root)

    print(f"      Distributing social preview to {len(banner_dirs)} directories...")
    # Save once to temp location, then fast copy to all target directories
    print(f"      Encoding master images once...")
    temp_dir = os.path.join(ROOT_DIR, 'public', 'assets', 'branding')
    os.makedirs(temp_dir, exist_ok=True)
    
    master_png = os.path.join(temp_dir, 'github-social-preview.png')
    master_webp = os.path.join(temp_dir, 'github-social-preview.webp')
    master_jpg = os.path.join(temp_dir, 'github-social-preview.jpg')
    master_banner = os.path.join(temp_dir, 'mecraft-hero-banner.jpg')

    final_img.save(master_png, format='PNG', optimize=False)
    final_img.save(master_webp, format='WEBP', quality=90, method=3)
    final_img.save(master_jpg, format='JPEG', quality=92)
    final_img.save(master_banner, format='JPEG', quality=92)
    print("      Master images encoded successfully. Fast copying to all directories...")

    import shutil
    for d in sorted(banner_dirs):
        os.makedirs(d, exist_ok=True)
        if d != temp_dir:
            shutil.copyfile(master_png, os.path.join(d, 'github-social-preview.png'))
            shutil.copyfile(master_webp, os.path.join(d, 'github-social-preview.webp'))
            shutil.copyfile(master_jpg, os.path.join(d, 'github-social-preview.jpg'))
            shutil.copyfile(master_banner, os.path.join(d, 'mecraft-hero-banner.jpg'))

    print(f"      Saved github-social-preview.png/.webp/.jpg in {len(banner_dirs)} locations.")
    return final_img

def main():
    print("=== Generating Installer Bitmaps & GitHub Social Preview (Golden M) ===")
    generate_installer_sidebar()
    generate_installer_header()
    generate_social_preview()
    print("✨ All assets generated and distributed successfully!")

if __name__ == '__main__':
    main()
