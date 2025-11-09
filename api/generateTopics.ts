import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import type { ThesisTopic, GeminiApiResponse } from "../types"; // Using type import for clarity
import type { VercelRequest, VercelResponse } from '@vercel/node';

// This function will run as a Vercel Serverless Function
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Ensure API_KEY is set in Vercel environment variables
  if (!process.env.API_KEY) {
    console.error("API_KEY is not set in Vercel environment variables.");
    return res.status(500).json({ error: 'Server configuration error: API Key is missing.' });
  }

  const { keywords } = req.body;

  if (!keywords || typeof keywords !== 'string' || keywords.trim().length === 0) {
    return res.status(400).json({ error: 'Keywords are required and must be a non-empty string.' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const modelName = "gemini-2.5-flash"; // Using flash for general text tasks

    const systemInstruction = `شما یک دستیار هوش مصنوعی برای تولید ایده های پایان نامه هستید. بر اساس کلمات کلیدی ارائه شده، لطفاً سه موضوع منحصر به فرد و جذاب برای پایان نامه پیشنهاد دهید. هر موضوع باید دارای یک عنوان مختصر و یک توضیح کوتاه باشد. پاسخ را به صورت JSON با ساختار مشخص ارائه دهید.`;

    const prompt = `کلمات کلیدی: ${keywords}\n\nلطفاً سه موضوع پایان نامه را بر اساس این کلمات کلیدی پیشنهاد دهید.`;

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
      console.error("Invalid or empty response from Gemini API:", jsonStr);
      return res.status(502).json({ error: "Failed to parse topics from Gemini API response." });
    }

    return res.status(200).json(data.topics);
  } catch (error: any) {
    console.error("Error generating thesis topics via API route:", error);
    return res.status(500).json({ error: `Failed to generate topics: ${error.message || 'An unknown error occurred.'}` });
  }
}
