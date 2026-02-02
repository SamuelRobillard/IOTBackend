


import { GoogleGenAI } from "@google/genai";


export class GeminiAPi {
 



public static async callAPI() {
  try {
    const ai = new GoogleGenAI({});
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // Use a suitable model name
      contents: "Explain how AI works in a few words",
    });
    
    console.log(response.text);
    return response.text
  } catch (error) {
    console.error("Error calling the Gemini API:", error);
  }
}
 
}
