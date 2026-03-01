const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");

const geminiApiKey = defineSecret("GEMINI_API_KEY");

// ✅ 최신 모델명으로 업데이트 (2026.03.01 기준)
// gemini-3-pro-image-preview → 2026.03.09 이후 종료 예정
const ALLOWED_MODELS = [
  "gemini-2.5-flash-image",          // 안정적인 메인 모델
  "gemini-3.1-flash-image-preview",  // 최신 고속 모델 (Nano Banana 2)
  "gemini-3-pro-image-preview",      // 레거시 지원
];
exports.geminiProxy = onRequest(
  { region: "asia-northeast3", invoker: "public", cors: true, secrets: [geminiApiKey] },
  async (req, res) => {
    const GEMINI_API_KEY = geminiApiKey.value();
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