import { GoogleGenAI, Type } from "@google/genai";
import { WordEtymology } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getWordEtymology(word: string): Promise<WordEtymology> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Provide the etymology and migration path for the Afrikaans word: "${word}". 
    Focus on how it traveled from its roots (Dutch, Malay, Portuguese, indigenous languages, etc.) to modern Afrikaans.
    Include coordinates for each stage of its journey.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          word: { type: Type.STRING },
          definition: { type: Type.STRING },
          originPoint: {
            type: Type.OBJECT,
            properties: {
              language: { type: Type.STRING },
              period: { type: Type.STRING },
              meaning: { type: Type.STRING },
              location: { type: Type.STRING },
            },
            required: ["language", "period", "meaning", "location"],
          },
          historicalNarrative: { type: Type.STRING },
          migrationLog: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                location: { type: Type.STRING },
                countryCode: { type: Type.STRING, description: "ISO 3166-1 alpha-2" },
                coordinates: {
                  type: Type.ARRAY,
                  items: { type: Type.NUMBER },
                  description: "[longitude, latitude]",
                },
                language: { type: Type.STRING },
                period: { type: Type.STRING },
                description: { type: Type.STRING },
                word: { type: Type.STRING },
              },
              required: ["location", "countryCode", "coordinates", "language", "period", "description", "word"],
            },
          },
        },
        required: ["word", "definition", "originPoint", "historicalNarrative", "migrationLog"],
      },
    },
  });

  return JSON.parse(response.text);
}
