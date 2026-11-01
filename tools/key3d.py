"""Cut the 3D pieces out of the chroma green art sheets.

Each sheet is a 3 x 2 grid of objects on flat green. For every cell: a soft
alpha from how green each pixel is, green spill removed from the edges, then
cropped to the object with a little room and saved as webp.

    python3 tools/key3d.py tools/art/sheet-a.png phone,laptop,earbuds,watch,tablet,gift site/assets/3d
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image


def key(img):
    a = np.asarray(img.convert('RGB')).astype(np.float32)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    k = g - np.maximum(r, b)                      # how much greener than the rest
    alpha = np.clip((90.0 - k) / (90.0 - 25.0), 0, 1)
    # remove the green cast on edges and reflections
    g2 = np.where(k > 0, np.maximum(r, b) + np.minimum(k, 0) * 0, g)
    g2 = np.minimum(g, np.maximum(r, b) + 4)
    out = np.dstack([r, g2, b, alpha * 255]).clip(0, 255).astype(np.uint8)
    return Image.fromarray(out, 'RGBA')


def main(sheet, names, outdir):
    names = names.split(',')
    im = Image.open(sheet)
    rgba = key(im)
    W, H = im.size
    out = Path(outdir)
    out.mkdir(parents=True, exist_ok=True)
    for i, name in enumerate(names):
        if not name:
            continue
        cx, cy = i % 3, i // 3
        box = (cx * W // 3, cy * H // 2, (cx + 1) * W // 3, (cy + 1) * H // 2)
        cell = rgba.crop(box)
        al = np.asarray(cell)[..., 3]
        # drop faint specks: keep rows/cols with real coverage
        ys, xs = np.where(al > 40)
        if len(xs) == 0:
            print('empty', name)
            continue
        pad = 6
        x0, x1 = max(xs.min() - pad, 0), min(xs.max() + pad, cell.width)
        y0, y1 = max(ys.min() - pad, 0), min(ys.max() + pad, cell.height)
        piece = cell.crop((x0, y0, x1, y1))
        piece.save(out / f'{name}.webp', 'WEBP', quality=90, method=6)
        print(name, piece.size)


if __name__ == '__main__':
    main(*sys.argv[1:4])
