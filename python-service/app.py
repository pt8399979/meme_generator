from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from PIL import Image, ImageDraw, ImageFont
import io
import os

app = FastAPI()

# 👇 CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for dev you can allow all; restrict later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/meme")
async def create_meme(
    image: UploadFile,
    top_text: str = Form(...),
    bottom_text: str = Form(...)
):
    # Open uploaded image
    img = Image.open(image.file).convert("RGB")

    # Load Impact font (case-sensitive in Linux!)
    font_path = os.path.join("fonts", "Impact.ttf")
    try:
        font = ImageFont.truetype(font_path, 40)
    except OSError:
        print("⚠️ Impact font missing or invalid, falling back to default.")
        font = ImageFont.load_default()

    # Draw text
    draw = ImageDraw.Draw(img)

    # Top text
    draw.text(
        (10, 10),
        top_text,
        font=font,
        fill="white",
        stroke_width=2,
        stroke_fill="black"
    )

    # Bottom text
    draw.text(
        (10, img.height - 60),
        bottom_text,
        font=font,
        fill="white",
        stroke_width=2,
        stroke_fill="black"
    )

    # Save to buffer
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)

    return StreamingResponse(buf, media_type="image/png")
