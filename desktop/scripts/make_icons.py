"""Recreate the included original geometric application icons (optional Pillow)."""
from pathlib import Path
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parents[1] / 'build'
root.mkdir(exist_ok=True)
im = Image.new('RGBA', (1024, 1024), (0, 0, 0, 0))
d = ImageDraw.Draw(im)
d.rounded_rectangle((24, 24, 1000, 1000), radius=220, fill='#18344f')
d.polygon([(512, 155), (794, 262), (759, 590), (670, 724), (512, 855),
           (354, 724), (265, 590), (230, 262)], fill='#47bdc0')
d.polygon([(512, 235), (711, 310), (686, 564), (615, 672), (512, 759),
           (409, 672), (338, 564), (313, 310)], fill='#18344f')
d.ellipse((398, 379, 626, 607), outline='#f3f8ff', width=34)
d.line((574, 554, 651, 642), fill='#f3f8ff', width=38)
im.save(root / 'icon.png')
im.save(root / 'icon.ico', sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])
im.save(root / 'icon.icns')
