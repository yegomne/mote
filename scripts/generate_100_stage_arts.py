import sys
import os
import math
from PIL import Image, ImageEnhance, ImageFilter, ImageDraw, ImageFont

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

# Output directory
out_dir = 'dist/assets/stages'
os.makedirs(out_dir, exist_ok=True)

# Base images pool
base_paths = [
    'dist/assets/chapters/ch1.jpg',
    'dist/assets/chapters/ch2.jpg',
    'dist/assets/chapters/ch3.jpg',
    'dist/assets/chapters/ch4.jpg',
    'dist/assets/chapters/ch5.jpg',
    'dist/assets/cards/sun_blessing.jpg',
    'dist/assets/cards/element_awakening.jpg',
    'dist/assets/cards/fire_wrath.jpg',
    'dist/assets/cards/broken_time.jpg',
    'dist/assets/cards/cursed_seal.jpg',
    'dist/assets/cards/time_blessing.jpg'
]

# Verify existing
valid_bases = [p for p in base_paths if os.path.exists(p)]
if not valid_bases:
    print('No base images found!')
    sys.exit(1)

loaded_bases = [Image.open(p).convert('RGB') for p in valid_bases]

target_w, target_h = 960, 540

# Color moods for 100 stages (10 beats x 10 cycles)
MOODS = [
    (255, 215, 120),  # 1: Gold dawn
    (110, 226, 174),  # 2: Jade spirit
    (128, 215, 241),  # 3: Sapphire storm
    (255, 138, 137),  # 4: Ruby flame
    (200, 165, 255),  # 5: Amethyst mystic
    (255, 183, 129),  # 6: Amber glow
    (100, 240, 210),  # 7: Turquoise sea
    (240, 100, 80),   # 8: Crimson eclipse
    (180, 140, 255),  # 9: Astral starlight
    (255, 230, 160)   # 10: Pure solar gold
]

for stage in range(1, 101):
    ci = min(4, (stage - 1) // 20)
    local = (stage - 1) % 20 + 1
    beat = (stage - 1) % 10
    is_boss = (local == 20)
    is_bonus = (local % 10 == 5)
    
    # Base image selection
    if is_boss:
        base_img = loaded_bases[ci % len(loaded_bases)]
    elif is_bonus:
        base_img = loaded_bases[5 % len(loaded_bases)]
    elif beat in (1, 8):
        base_img = loaded_bases[(ci + 2) % len(loaded_bases)]
    elif beat in (3, 7):
        base_img = loaded_bases[(ci + 7) % len(loaded_bases)]
    else:
        base_img = loaded_bases[(ci + (local % 3)) % len(loaded_bases)]
    
    # Scale and crop to target_w, target_h with varying center offset
    bw, bh = base_img.size
    aspect = target_w / target_h
    base_aspect = bw / bh
    
    # Pan effect per stage
    pan_x = 0.5 + 0.15 * math.sin(stage * 0.45)
    pan_y = 0.5 + 0.12 * math.cos(stage * 0.35)
    
    if base_aspect > aspect:
        crop_h = bh
        crop_w = int(bh * aspect)
        max_x = bw - crop_w
        left = int(max_x * pan_x)
        top = 0
    else:
        crop_w = bw
        crop_h = int(bw / aspect)
        max_y = bh - crop_h
        left = 0
        top = int(max_y * pan_y)
        
    cropped = base_img.crop((left, top, left + crop_w, top + crop_h)).resize((target_w, target_h), Image.Resampling.LANCZOS)
    
    # Apply color atmosphere tint
    mood = MOODS[beat]
    tint_layer = Image.new('RGB', (target_w, target_h), mood)
    tint_alpha = 0.14 + 0.05 * math.sin(stage * 0.7)
    blended = Image.blend(cropped, tint_layer, tint_alpha)
    
    # Adjust contrast & brightness per chapter
    enhancer = ImageEnhance.Contrast(blended)
    contrasted = enhancer.enhance(1.08 + (ci * 0.04))
    
    enhancer_b = ImageEnhance.Brightness(contrasted)
    final_img = enhancer_b.enhance(0.96 + 0.05 * math.cos(stage))
    
    # Draw artistic vignette and stage badge
    draw = ImageDraw.Draw(final_img, 'RGBA')
    
    # Dark vignette border
    for ring in range(30):
        alpha = int((30 - ring) * 2.8)
        draw.rectangle([ring, ring, target_w - ring, target_h - ring], outline=(2, 12, 16, alpha), width=1)
    
    # Save
    out_path = os.path.join(out_dir, f'stage_{stage}.jpg')
    final_img.save(out_path, quality=88, optimize=True)

print(f'Successfully generated 100 stage art images in {out_dir}')
