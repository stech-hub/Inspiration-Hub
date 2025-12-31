
import { GoogleGenAI, Type } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async generateMotivation(topic: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a powerful, high-energy motivational short speech (about 150 words) based on this topic: ${topic}. Focus on overcoming obstacles and the power of the human spirit. Also provide a short punchy title.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              speech: {
                type: Type.STRING,
                description: "The motivational speech content.",
              },
              title: {
                type: Type.STRING,
                description: "A punchy, inspirational title for the speech.",
              },
            },
            required: ["speech", "title"],
          },
        },
      });

      const jsonStr = response.text?.trim();
      if (jsonStr) {
        return JSON.parse(jsonStr);
      }
      throw new Error("Empty response from AI");
    } catch (error) {
      console.error("Error generating speech:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
