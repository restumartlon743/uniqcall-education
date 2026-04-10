"""
Process 3D avatar assets:
1. Split multi-view sheets (2816x1536) into individual rotation views (front, 3/4, side)
2. Remove backgrounds using rembg
3. Save organized files to apps/web/public/avatars/
"""

import os
import sys
from pathlib import Path
from PIL import Image
from rembg import remove

# Paths
ASSETS_DIR = Path(r"C:\Users\Rest\Documents\Development\uniqcall2\assets\3D_avatar_assets")
OUTPUT_DIR = Path(r"C:\Users\Rest\Documents\Development\uniqcall2\apps\web\public\avatars")

# Ensure output directories exist
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Archetype mapping: display name -> code
ARCHETYPE_MAP = {
    "The Thinker (Sang Pemikir)": "thinker",
    "The Engineer (Sang Teknokrat)": "engineer",
    "The Guardian (Sang Penjaga)": "guardian",
    "The Strategist (Sang Perencana)": "strategist",
    "The Creator (Sang Pencipta)": "creator",
    "The Shaper (Sang Arsitek)": "shaper",
    "The Storyteller (Sang Juru Bicara)": "storyteller",
    "The Performer (Sang Penghibur)": "performer",
    "The Healer (Sang Penyembuh)": "healer",
    "The Diplomat (Sang Diplomat)": "diplomat",
    "The Explorer (Sang Penjelajah)": "explorer",
    "The Mentor (Sang Pembimbing)": "mentor",
    "The Visionary (Sang Visioner)": "visionary",
}

# View labels for the 3 rotation splits
VIEWS = ["front", "three-quarter", "side"]


def split_views(img: Image.Image) -> list[Image.Image]:
    """Split a 2816x1536 multi-view sheet into 3 equal character views."""
    w, h = img.size
    view_width = w // 3
    views = []
    for i in range(3):
        left = i * view_width
        right = left + view_width
        crop = img.crop((left, 0, right, h))
        views.append(crop)
    return views


def remove_background(img: Image.Image) -> Image.Image:
    """Remove background using rembg AI model."""
    import io
    # Convert to bytes for rembg
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    result_bytes = remove(buf.read())
    result_img = Image.open(io.BytesIO(result_bytes)).convert("RGBA")
    return result_img


def trim_transparent(img: Image.Image, padding: int = 20) -> Image.Image:
    """Trim transparent pixels, keeping some padding."""
    bbox = img.getbbox()
    if bbox is None:
        return img
    left, top, right, bottom = bbox
    # Add padding but stay within bounds
    w, h = img.size
    left = max(0, left - padding)
    top = max(0, top - padding)
    right = min(w, right + padding)
    bottom = min(h, bottom + padding)
    return img.crop((left, top, right, bottom))


def resize_to_standard(img: Image.Image, max_height: int = 512) -> Image.Image:
    """Resize maintaining aspect ratio to a standard height."""
    w, h = img.size
    if h <= max_height:
        return img
    ratio = max_height / h
    new_w = int(w * ratio)
    return img.resize((new_w, max_height), Image.LANCZOS)


def parse_filename(filename: str) -> tuple[str, str] | None:
    """Parse filename like 'The Creator (Sang Pencipta) Female.png' -> (archetype_code, gender)."""
    name = filename.replace(".png", "").strip()

    # Determine gender
    gender = None
    if name.lower().endswith("female"):
        gender = "female"
        name = name[:-6].strip()
    elif name.lower().endswith("male"):
        gender = "male"
        name = name[:-4].strip()

    if gender is None:
        print(f"  WARNING: Could not determine gender from: {filename}")
        return None

    # Find archetype code
    code = ARCHETYPE_MAP.get(name)
    if code is None:
        print(f"  WARNING: Unknown archetype: {name}")
        return None

    return code, gender


def main():
    print("=" * 60)
    print("Uniqcall Avatar Processor")
    print("=" * 60)
    print(f"Source: {ASSETS_DIR}")
    print(f"Output: {OUTPUT_DIR}")
    print()

    files = sorted([f for f in os.listdir(ASSETS_DIR) if f.endswith(".png")])
    print(f"Found {len(files)} avatar sheets to process\n")

    processed = 0
    errors = 0

    for idx, filename in enumerate(files, 1):
        print(f"[{idx}/{len(files)}] {filename}")

        parsed = parse_filename(filename)
        if parsed is None:
            errors += 1
            continue

        code, gender = parsed
        filepath = ASSETS_DIR / filename

        try:
            img = Image.open(filepath).convert("RGBA")
            print(f"  Archetype: {code}, Gender: {gender}, Size: {img.size}")

            # Split into 3 views
            views = split_views(img)

            for view_idx, (view_img, view_name) in enumerate(zip(views, VIEWS)):
                # Remove background
                print(f"  Processing {view_name} view...", end=" ", flush=True)
                no_bg = remove_background(view_img)

                # Trim transparent space
                trimmed = trim_transparent(no_bg, padding=10)

                # Resize to standard height
                final = resize_to_standard(trimmed, max_height=512)

                # Save
                out_name = f"{code}-{gender}-{view_name}.png"
                out_path = OUTPUT_DIR / out_name
                final.save(out_path, "PNG", optimize=True)
                print(f"saved ({final.size[0]}x{final.size[1]})")

            # Also save the front view as the default avatar
            default_name = f"{code}-{gender}.png"
            default_src = OUTPUT_DIR / f"{code}-{gender}-front.png"
            default_dst = OUTPUT_DIR / default_name
            if default_src.exists():
                import shutil
                shutil.copy2(default_src, default_dst)
                print(f"  Default: {default_name}")

            processed += 1
            print()

        except Exception as e:
            print(f"  ERROR: {e}")
            errors += 1
            continue

    # Summary
    print("=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"Processed: {processed}/{len(files)} files")
    print(f"Errors: {errors}")
    print(f"Output files: {len(list(OUTPUT_DIR.glob('*.png')))}")
    print(f"Output directory: {OUTPUT_DIR}")

    # List all generated files
    print("\nGenerated files:")
    for f in sorted(OUTPUT_DIR.glob("*.png")):
        sz = f.stat().st_size
        print(f"  {f.name} ({sz // 1024}KB)")


if __name__ == "__main__":
    main()
