import { GoogleGenAI } from "@google/genai";
import config from "../config/config";


 async function callGemini(base64ImageData) {
    const ai = new GoogleGenAI({
        apiKey : config.geminiApiKey
    });
  
    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64ImageData,
        },
      },
      { text: "L'image vient d'une caméra infrarouge. EN un mot est ce recyclage, poubelle, compost ou autre" }
    ],
    });

    return result.text
  }

   export async function callGeminiSafe(base64ImageData){
    const response = await callGemini(base64ImageData)
    if (typeof(response) === "string") {
      const keywords = ["recyclage", "poubelle", "compost", "autre"];
  
      const match = keywords.find(word =>
        response.toLowerCase().includes(word)
      );
  
      if (match) {
        return match; // return if one of the keywords match
      }
    }
    return "error"
  }
