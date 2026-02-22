const { onRequest } = require("firebase-functions/v2/https");

const GEMINI_API_KEY = "AIzaSyC4eZYNvgmbehxERihO1zPETnQLZZZ3hM8";
const ALLOWED_MODELS = ["gemini-2.5-flash-image", "gemini-3-pro-image-preview"];

exports.geminiProxy = onRequest(
  { region: "asia-northeast3", cors: false },
  async (req, res) => {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { model, contents, generationConfig } = req.body;

    if (!ALLOWED_MODELS.includes(model)) {
      return res.status(400).json({ error: "Invalid model" });
    }
    if (!contents) {
      return res.status(400).json({ error: "Missing contents" });
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents, generationConfig }),
        }
      );
      const data = await response.json();
      return res.status(response.status).json(data);
    } catch {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);
