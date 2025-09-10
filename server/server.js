import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import multer from "multer";
import FormData from "form-data";   // 👈 use this instead of global FormData

const app = express();
app.use(cors());
const upload = multer();

// ✅ Health check
app.get("/ping", (req, res) => {
  res.json({ status: "ok", message: "Node server is running 🚀" });
});

// Proxy endpoint for meme generation
app.post("/api/meme", upload.single("image"), async (req, res) => {
  try {
    const fd = new FormData();
    fd.append("image", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });
    fd.append("top_text", req.body.top_text || "");
    fd.append("bottom_text", req.body.bottom_text || "");

    const r = await fetch("http://python:8001/api/meme", {
      method: "POST",
      body: fd,
      headers: fd.getHeaders(), // 👈 required for form-data to set boundaries
    });

    if (!r.ok) throw new Error("Python service failed");

    res.setHeader("Content-Type", "image/png");
    r.body.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating meme");
  }
});

app.listen(8000, () => console.log("Server running on port 8000"));
