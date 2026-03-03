#!/usr/bin/env python3
"""
AquaBloom Asset Generator
Creates app icon, adaptive icon, and splash screen.
Run from the AquaBloom project root: python3 scripts/create_assets.py
"""

from PIL import Image, ImageDraw, ImageFont
import math
import os

# AquaBloom color palette
TEAL = (126, 200, 200)
LAVENDER = (196, 167, 215)
ROSE = (240, 166, 185)
BG_DARK = (13, 17, 23)
BG_MID = (21, 27, 38)
WHITE = (232, 234, 237)

ASSETS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "assets", "images")
os.makedirs(ASSETS_DIR, exist_ok=True)


def lerp_color(c1, c2, t):
    """Linear interpolate between two colors."""
    return tuple(int(c1[i] + (c2[i] - c1[i]) * t) for i in range(3))


def draw_gradient_bg(draw, width, height, c1, c2, c3=None):
    """Draw a vertical gradient background."""
    for y in range(height):
        t = y / height
        if c3:
            if t < 0.5:
                color = lerp_color(c1, c2, t * 2)
            else:
                color = lerp_color(c2, c3, (t - 0.5) * 2)
        else:
            color = lerp_color(c1, c2, t)
        draw.line([(0, y), (width, y)], fill=color)


def draw_water_drop(draw, cx, cy, size, fill_level=0.7, base_color=TEAL):
    """Draw a stylized water drop shape."""
    cx, cy, size = int(cx), int(cy), int(size)
    drop_w = int(size * 0.65)
    drop_h = int(size * 0.5)
    top_y = int(cy - size * 0.45)

    # Draw drop body (ellipse at bottom)
    body_top = int(cy - drop_h * 0.3)
    draw.ellipse(
        [int(cx - drop_w / 2), body_top, int(cx + drop_w / 2), int(cy + drop_h * 0.7)],
        fill=(*base_color, 40),
        outline=base_color,
        width=max(2, size // 60),
    )

    # Draw triangle/peak at top
    points = [
        (cx, top_y),
        (int(cx - drop_w * 0.25), int(body_top + drop_h * 0.15)),
        (int(cx + drop_w * 0.25), int(body_top + drop_h * 0.15)),
    ]
    draw.polygon(points, fill=(*base_color, 40), outline=base_color)

    # Fill level (water inside)
    if fill_level > 0:
        fill_top = int(cy + drop_h * 0.7 - (drop_h * 0.9 * fill_level))
        for y in range(fill_top, int(cy + drop_h * 0.7)):
            ry = drop_h * 0.5
            rx = drop_w / 2
            center_y = cy + drop_h * 0.2
            if abs(y - center_y) < ry:
                x_offset = rx * math.sqrt(1 - ((y - center_y) / ry) ** 2)
                alpha = int(90 * fill_level)
                draw.line(
                    [(int(cx - x_offset + 2), y), (int(cx + x_offset - 2), y)],
                    fill=(*base_color, alpha),
                )


def draw_orb(draw, cx, cy, radius, color, alpha=20):
    """Draw a soft glowing orb."""
    for r in range(int(radius), 0, -1):
        t = r / radius
        a = int(alpha * (1 - t))
        if a > 0:
            draw.ellipse(
                [cx - r, cy - r, cx + r, cy + r],
                fill=(*color, a),
            )


def draw_sparkle(draw, cx, cy, size, color=WHITE):
    """Draw a small 4-point sparkle."""
    # Vertical line
    draw.line([(cx, cy - size), (cx, cy + size)], fill=color, width=2)
    # Horizontal line
    draw.line([(cx - size, cy), (cx + size, cy)], fill=color, width=2)
    # Center dot
    draw.ellipse(
        [cx - 2, cy - 2, cx + 2, cy + 2],
        fill=color,
    )


def create_app_icon(size=1024):
    """Create the main app icon."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img, "RGBA")

    # Rounded rectangle background
    corner_radius = size // 5  # iOS-style rounding
    draw_gradient_bg(draw, size, size, BG_DARK, BG_MID, (26, 21, 37))

    # Decorative orbs
    draw_orb(draw, size * 0.75, size * 0.2, size * 0.25, TEAL, alpha=15)
    draw_orb(draw, size * 0.2, size * 0.8, size * 0.2, LAVENDER, alpha=12)
    draw_orb(draw, size * 0.85, size * 0.75, size * 0.15, ROSE, alpha=10)

    # Central water drop
    drop_size = size * 0.55
    draw_water_drop(draw, size // 2, size * 0.45, drop_size, fill_level=0.65, base_color=TEAL)

    # Sparkles around the drop
    draw_sparkle(draw, int(size * 0.72), int(size * 0.22), 12, TEAL)
    draw_sparkle(draw, int(size * 0.28), int(size * 0.35), 8, LAVENDER)
    draw_sparkle(draw, int(size * 0.75), int(size * 0.55), 10, ROSE)

    # App name at bottom
    try:
        font_large = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf", size // 10)
        font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-ExtraLight.ttf", size // 22)
    except OSError:
        font_large = ImageFont.load_default()
        font_small = ImageFont.load_default()

    # "AquaBloom" text
    text = "AquaBloom"
    bbox = draw.textbbox((0, 0), text, font=font_large)
    tw = bbox[2] - bbox[0]
    draw.text(
        ((size - tw) // 2, int(size * 0.73)),
        text,
        fill=TEAL,
        font=font_large,
    )

    # Tagline
    tag = "hydrate & glow"
    bbox2 = draw.textbbox((0, 0), tag, font=font_small)
    tw2 = bbox2[2] - bbox2[0]
    draw.text(
        ((size - tw2) // 2, int(size * 0.84)),
        tag,
        fill=(*LAVENDER, 180),
        font=font_small,
    )

    # Save as PNG (not rounded — iOS/Android handle rounding)
    output = os.path.join(ASSETS_DIR, "icon.png")
    # Flatten to RGB for App Store (no transparency)
    bg = Image.new("RGB", (size, size), BG_DARK)
    bg.paste(img, mask=img.split()[3])
    bg.save(output, "PNG")
    print(f"✅ Created app icon: {output}")
    return output


def create_adaptive_icon(size=1024):
    """Create Android adaptive icon (foreground layer with transparent padding)."""
    # Adaptive icons need ~66% safe zone in center
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img, "RGBA")

    # Background gradient
    draw_gradient_bg(draw, size, size, BG_DARK, BG_MID, (26, 21, 37))

    # Central water drop (smaller for safe zone)
    drop_size = size * 0.4
    draw_water_drop(draw, size // 2, size * 0.4, drop_size, fill_level=0.65, base_color=TEAL)

    # Sparkles
    draw_sparkle(draw, int(size * 0.67), int(size * 0.25), 10, TEAL)
    draw_sparkle(draw, int(size * 0.33), int(size * 0.32), 7, LAVENDER)

    # App name
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf", size // 12)
    except OSError:
        font = ImageFont.load_default()

    text = "AquaBloom"
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    draw.text(((size - tw) // 2, int(size * 0.65)), text, fill=TEAL, font=font)

    output = os.path.join(ASSETS_DIR, "adaptive-icon.png")
    bg = Image.new("RGB", (size, size), BG_DARK)
    bg.paste(img, mask=img.split()[3])
    bg.save(output, "PNG")
    print(f"✅ Created adaptive icon: {output}")
    return output


def create_splash_screen(width=1284, height=2778):
    """Create splash screen for app loading."""
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img, "RGBA")

    # Dark gradient background
    draw_gradient_bg(draw, width, height, BG_DARK, BG_MID, (26, 21, 37))

    # Large decorative orbs
    draw_orb(draw, int(width * 0.8), int(height * 0.15), 250, TEAL, alpha=12)
    draw_orb(draw, int(width * 0.15), int(height * 0.75), 200, LAVENDER, alpha=10)
    draw_orb(draw, int(width * 0.85), int(height * 0.6), 180, ROSE, alpha=8)

    # Central water drop (large)
    cx, cy = width // 2, int(height * 0.38)
    drop_size = min(width, height) * 0.28
    draw_water_drop(draw, cx, cy, drop_size, fill_level=0.6, base_color=TEAL)

    # Sparkles
    draw_sparkle(draw, int(width * 0.7), int(height * 0.28), 16, TEAL)
    draw_sparkle(draw, int(width * 0.25), int(height * 0.34), 12, LAVENDER)
    draw_sparkle(draw, int(width * 0.72), int(height * 0.48), 14, ROSE)
    draw_sparkle(draw, int(width * 0.3), int(height * 0.5), 10, TEAL)

    # App name
    try:
        font_title = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf", 80)
        font_tagline = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-ExtraLight.ttf", 32)
    except OSError:
        font_title = ImageFont.load_default()
        font_tagline = ImageFont.load_default()

    # "AquaBloom"
    text = "AquaBloom"
    bbox = draw.textbbox((0, 0), text, font=font_title)
    tw = bbox[2] - bbox[0]
    draw.text(
        ((width - tw) // 2, int(height * 0.56)),
        text,
        fill=TEAL,
        font=font_title,
    )

    # Tagline
    tag = "Your Daily Hydration Companion"
    bbox2 = draw.textbbox((0, 0), tag, font=font_tagline)
    tw2 = bbox2[2] - bbox2[0]
    draw.text(
        ((width - tw2) // 2, int(height * 0.62)),
        tag,
        fill=(*LAVENDER, 160),
        font=font_tagline,
    )

    # Bottom subtle text
    try:
        font_bottom = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-ExtraLight.ttf", 22)
    except OSError:
        font_bottom = ImageFont.load_default()

    bottom_text = "hydrate & glow"
    bbox3 = draw.textbbox((0, 0), bottom_text, font=font_bottom)
    tw3 = bbox3[2] - bbox3[0]
    draw.text(
        ((width - tw3) // 2, int(height * 0.88)),
        bottom_text,
        fill=(*ROSE, 120),
        font=font_bottom,
    )

    # Save
    output = os.path.join(ASSETS_DIR, "splash.png")
    bg = Image.new("RGB", (width, height), BG_DARK)
    bg.paste(img, mask=img.split()[3])
    bg.save(output, "PNG")
    print(f"✅ Created splash screen: {output}")
    return output


if __name__ == "__main__":
    print("🌸 AquaBloom Asset Generator\n")
    create_app_icon()
    create_adaptive_icon()
    create_splash_screen()
    print("\n✨ All assets created in assets/images/")
    print("   Tip: After downloading custom fonts, re-run to get better typography!")
