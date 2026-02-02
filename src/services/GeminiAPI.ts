


import { GoogleGenAI } from "@google/genai";

import config from "../config/config";


export class GeminiAPi {
 



public static async callAPI(imageBase64 : string) {
    const key = config.geminiApiKey;
    if (!key) {
        throw new Error("L'API Key Gemini n'est pas définie dans les variables d'environnement.");
      }
  try {
    const ai = new GoogleGenAI({
        apiKey : key
    });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // Use a suitable model name
      contents: "describe the image in base 64 : "  + imageBase64,
    });
    
    console.log(response.text);
    return response.text
  } catch (error) {
    console.error("Error calling the Gemini API:", error);
  }
}
 
}
