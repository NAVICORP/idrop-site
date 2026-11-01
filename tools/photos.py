"""Cut the licensed Unsplash product photos into the WebP files under site/assets/photos.

    python3 tools/photos.py <folder with the raw JPGs> site/assets/photos

The raw JPGs are not kept in the repo (see README for the sources).
"""
import sys
from PIL import Image, ImageEnhance, ImageFilter

RAW, OUT = sys.argv[1], sys.argv[2]

# name: crop box (fractions l, t, r, b), longest side, extra small width, vignette (cx, cy, rx, ry) or None, brightness
JOBS = {
    "hero-iphone-orange": ((0.0, 0.0, 1.0, 1.0), 2000, 1000, (0.58, 0.42, 0.42, 0.62), 1.0),
    "ecosystem":          ((0.0, 0.0, 1.0, 1.0), 2000, 1000, (0.50, 0.60, 0.56, 0.68), 1.16),
    "iphone-blue":        ((0.0, 0.0, 1.0, 1.0), 1600, None, None, 1.0),
    "watch":              ((0.0, 0.04, 1.0, 0.96), 1400, None, None, 1.0),
    "mac":                ((0.12, 0.0, 1.0, 1.0), 1600, None, None, 1.0),
    "ipad":               ((0.0, 0.0, 1.0, 1.0), 1600, None, None, 1.0),
    "airpods-blue":       ((0.0, 0.0, 1.0, 1.0), 1600, None, None, 1.0),
    "iphone-silver":      ((0.0, 0.0, 1.0, 1.0), 1600, None, None, 1.0),
    "iphone-white":       ((0.0, 0.10, 1.0, 0.90), 1400, None, None, 1.1),
}


def vignette(im, cx, cy, rx, ry):
    """Fade everything outside a soft ellipse to black, so the photo melts into a black band."""
    w, h = im.size
    mw, mh = 400, round(400 * h / w)
    mask = Image.new("L", (mw, mh), 0)
    px = mask.load()
    for y in range(mh):
        for x in range(mw):
            d = (((x / mw - cx) / rx) ** 2 + ((y / mh - cy) / ry) ** 2) ** 0.5
            t = min(max((d - 0.55) / 0.75, 0.0), 1.0)
            px[x, y] = round(255 * (1 - t * t * (3 - 2 * t)))
    mask = mask.filter(ImageFilter.GaussianBlur(6)).resize((w, h), Image.LANCZOS)
    return Image.composite(im, Image.new("RGB", (w, h)), mask)


for name, (box, longest, small, vig, tone) in JOBS.items():
    im = Image.open(f"{RAW}/{name}.jpg").convert("RGB")
    w, h = im.size
    l, t, r, b = box
    im = im.crop((round(l * w), round(t * h), round(r * w), round(b * h)))
    cw, ch = im.size
    s = longest / max(cw, ch)
    big = im.resize((round(cw * s), round(ch * s)), Image.LANCZOS)
    if tone != 1.0:
        big = ImageEnhance.Brightness(big).enhance(tone)
    if vig:
        big = vignette(big, *vig)
    big.save(f"{OUT}/{name}.webp", "WEBP", quality=82, method=6)
    print(name, big.size)
    if small:
        sm = big.resize((small, round(big.size[1] * small / big.size[0])), Image.LANCZOS)
        sm.save(f"{OUT}/{name}-{small}.webp", "WEBP", quality=78, method=6)
        print(name, "small", sm.size)
