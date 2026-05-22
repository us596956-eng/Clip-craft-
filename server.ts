import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));

  // API Routes
  app.post("/api/analyze-video", async (req, res) => {
    try {
      const { filename, fileSize, hookType, duration } = req.body;
      
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is required");
      }
      
      const ai = new GoogleGenAI({ 
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });

      const prompt = `Act as an advanced AI video editor. I have a long-form video file named "${filename}" (${fileSize} bytes).
I want to create a short ${duration || '30-45s'} vertical clip with a "${hookType}" hook.
Since actual video upload might exceed browser limits, simulate the analysis process and generate a compelling, engaging 9:16 vertical short clip extraction.

Please provide a structured JSON response containing:
1. hookText: A compelling, catchy headline text based on "${hookType}" hook type (max 8 words).
2. viralityScore: A number from 1-100 indicating how viral this clip could be.
3. explanation: A brief explanation of why this segment was chosen.
4. words: An array of objects representing the transcribed words in the clip. Each object must have:
   - word: The transcribed word as a string.
   - startMs: Start timestamp in milliseconds.
   - endMs: End timestamp in milliseconds.
Make the clip around 15-30 seconds long total, with consecutive words forming a coherent, engaging speech or story suitable for TikTok/Reels.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              hookText: { type: Type.STRING },
              viralityScore: { type: Type.NUMBER },
              explanation: { type: Type.STRING },
              words: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    word: { type: Type.STRING },
                    startMs: { type: Type.NUMBER },
                    endMs: { type: Type.NUMBER },
                  },
                  required: ["word", "startMs", "endMs"]
                }
              }
            },
            required: ["hookText", "viralityScore", "explanation", "words"]
          }
        },
      });

      const result = JSON.parse(response.text || "{}");
      res.json(result);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message || "Failed to analyze video" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
