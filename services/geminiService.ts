
import { GoogleGenAI } from "@google/genai";

const getApiKey = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    // This is a placeholder for environments where the key is missing.
    // In a real deployed environment, this should be handled more gracefully,
    // potentially by disabling the feature or showing a specific error message.
    console.error("API_KEY environment variable not set.");
    return "MISSING_API_KEY";
  }
  return apiKey;
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

export const getHint = async (word: string): Promise<string> => {
  try {
    const prompt = `Give a short, one-sentence hint for the hangman word: "${word}". The hint should not contain the word itself. Keep it concise.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Error fetching hint from Gemini API:", error);
    return "Could not fetch a hint at this time. Please try again later.";
  }
};
