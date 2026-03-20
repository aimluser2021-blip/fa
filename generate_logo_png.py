from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parent
OUT = ROOT / "HMF Chemical Enterprises logo design.png"


def load_font(name: str, size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        Path("C:/Windows/Fonts") / name,
        Path("C:/Windows/Fonts/arial.ttf"),
    ]
    for path in candidates:
        if path.exists():
            return ImageFont.truetype(str(path), size=size)
    return ImageFont.load_default()


def draw_star(draw: ImageDraw.ImageDraw, center: tuple[int, int], size: int, color: str) -> None:
    x, y = center
    points = [
        (x, y - size),
        (x + size * 0.28, y - size * 0.28),
        (x + size, y),
        (x + size * 0.28, y + size * 0.28),
        (x, y + size),
        (x - size * 0.28, y + size * 0.28),
        (x - size, y),
        (x - size * 0.28, y - size * 0.28),
    ]
    draw.polygon(points, fill=color)


img = Image.new("RGBA", (900, 700), "white")
draw = ImageDraw.Draw(img)

# Blue swooshes
draw.pieslice((85, 120, 805, 560), start=194, end=350, fill="#1488E3")
draw.pieslice((115, 165, 770, 530), start=196, end=344, fill="white")
draw.pieslice((135, 185, 742, 500), start=199, end=339, fill="#2BC1F6")
draw.pieslice((160, 210, 718, 478), start=202, end=336, fill="#0E68C8")

# Green bottom swoosh
draw.pieslice((175, 290, 805, 645), start=18, end=163, fill="#35B200")
draw.pieslice((195, 318, 775, 615), start=21, end=160, fill="#0D7B21")
draw.pieslice((220, 340, 740, 595), start=25, end=153, fill="#8BD400")
draw.pieslice((240, 356, 718, 575), start=28, end=149, fill="#0E7A1C")

# Main blue badge
badge = [(168, 260), (705, 210), (678, 416), (202, 422)]
draw.polygon(badge, fill="#134AA8")
draw.line(badge + [badge[0]], fill="#0A2F75", width=10)
draw.polygon([(180, 270), (690, 225), (675, 270), (210, 305)], fill="#1CA3EC")

# HMF text with shadow and highlight
font_hmf = load_font("arialbd.ttf", 170)
font_hmf_outline = load_font("arialbd.ttf", 170)
hmf_pos = (185, 230)
for dx, dy in [(8, 8), (7, 7), (6, 6)]:
    draw.text((hmf_pos[0] + dx, hmf_pos[1] + dy), "HMF", font=font_hmf_outline, fill="#1A56B0", stroke_width=12, stroke_fill="#1A56B0")
draw.text(hmf_pos, "HMF", font=font_hmf, fill="white", stroke_width=10, stroke_fill="#0D4FA8")
draw.text((hmf_pos[0] + 8, hmf_pos[1] + 52), "HMF", font=font_hmf, fill="#D7EEFF")

# Green ribbon
ribbon = [(220, 425), (760, 425), (705, 520), (192, 520)]
draw.polygon(ribbon, fill="#0A8B25")
draw.line(ribbon + [ribbon[0]], fill="white", width=7)
draw.arc((180, 438, 700, 540), start=192, end=344, fill="white", width=7)

# Ribbon text
font_sub = load_font("arialbi.ttf", 72)
draw.text((236, 438), "Chemical Enterprises", font=font_sub, fill="white", stroke_width=2, stroke_fill="white")

# Bubbles
for box, outline in [
    ((92, 456, 170, 534), 5),
    ((138, 448, 190, 500), 5),
    ((104, 418, 138, 452), 4),
    ((148, 408, 172, 432), 4),
]:
    draw.ellipse(box, fill="#58D3FF", outline="#1A7BC1", width=outline)

for box in [
    (106, 470, 126, 490),
    (148, 461, 161, 474),
    (114, 425, 122, 433),
]:
    draw.ellipse(box, fill=(255, 255, 255, 220))

# Sparkles
draw_star(draw, (252, 178), 26, "#36C9FF")
draw_star(draw, (621, 168), 34, "#1B94E7")
draw_star(draw, (213, 220), 18, "#0E5FC8")

img.save(OUT)
print(OUT)
