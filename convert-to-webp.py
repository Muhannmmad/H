"""Run once on your computer inside the website folder:  python convert-to-webp.py
Creates a smaller .webp next to every .jpg/.jpeg/.png in img/ (originals stay untouched).
Needs:  pip install pillow
Afterwards you can point the <img src> in index.html to the .webp files (keep the .jpg for share previews)."""
import os
from PIL import Image
for root, _, files in os.walk('img'):
    for f in files:
        if f.lower().endswith(('.jpg', '.jpeg', '.png')):
            src = os.path.join(root, f); dst = os.path.splitext(src)[0] + '.webp'
            im = Image.open(src); im.save(dst, 'WEBP', quality=82, method=6)
            print(src, os.path.getsize(src) // 1024, 'KB ->', os.path.getsize(dst) // 1024, 'KB')
