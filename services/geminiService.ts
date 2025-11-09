// No longer importing GoogleGenAI or Type directly here
import { ThesisTopic, GeminiApiResponse } from "../types";

export const generateThesisTopics = async (
  keywords: string
): Promise<ThesisTopic[]> => {
  try {
    // Call the Vercel API Route instead of the Gemini API directly
    const response = await fetch('/api/generateTopics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ keywords }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const topics: ThesisTopic[] = await response.json();
    
    if (!Array.isArray(topics) || topics.length === 0) {
      throw new Error("Invalid or empty response from API route.");
    }

    return topics;
  } catch (error) {
    console.error("Error generating thesis topics:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate topics: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating topics.");
  }
};
