import { GoogleGenAI } from "@google/genai";
import config from "../config/config";
export async function geminiPic(base64ImageData) {
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
      { text: "in one word is it compost, garbage, recyclabe or others" }
    ],
    });

    return result.text
  }