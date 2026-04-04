import { GoogleGenAI } from "@google/genai";

async function generateLogo() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-flash-image-preview',
    contents: {
      parts: [
        {
          text: 'A futuristic 3D brain logo, glowing neon blue and soft purple accents, smooth glassmorphism texture, floating in a dark blue atmospheric background, subtle light reflections, minimal and clean design, AI-inspired digital lines and circuits integrated into the brain, soft glow, cinematic lighting, high detail, modern tech branding style, centered composition, 3D render, ultra realistic, 4k, no text, no watermark',
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
        imageSize: "1K"
      }
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return part.inlineData.data;
    }
  }
}

export { generateLogo };
