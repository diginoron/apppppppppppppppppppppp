import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { ThesisTopic, GeminiApiResponse } from "../types";

// Helper function to decode base64
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export const generateThesisTopics = async (
  keywords: string
): Promise<ThesisTopic[]> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY is not set. Please configure it in your environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelName = "gemini-2.5-flash"; // Using flash for general text tasks

  const systemInstruction = `شما یک دستیار هوش مصنوعی برای تولید ایده های پایان نامه هستید. بر اساس کلمات کلیدی ارائه شده، لطفاً سه موضوع منحصر به فرد و جذاب برای پایان نامه پیشنهاد دهید. هر موضوع باید دارای یک عنوان مختصر و یک توضیح کوتاه باشد. پاسخ را به صورت JSON با ساختار مشخص ارائه دهید.`;

  const prompt = `کلمات کلیدی: ${keywords}\n\nلطفاً سه موضوع پایان نامه را بر اساس این کلمات کلیدی پیشنهاد دهید.`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: { parts: [{ text: prompt }] },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: {
                    type: Type.STRING,
                    description: 'The title of the thesis topic.',
                  },
                  description: {
                    type: Type.STRING,
                    description: 'A brief description of the thesis topic.',
                  },
                },
                required: ["title", "description"],
                propertyOrdering: ["title", "description"],
              },
            },
          },
          required: ["topics"],
          propertyOrdering: ["topics"],
        },
      },
    });

    const jsonStr = response.text.trim();
    const data: GeminiApiResponse = JSON.parse(jsonStr);

    if (!data || !Array.isArray(data.topics) || data.topics.length === 0) {
      throw new Error("Invalid or empty response from Gemini API.");
    }
    return data.topics;
  } catch (error) {
    console.error("Error generating thesis topics:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate topics: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating topics.");
  }
};
