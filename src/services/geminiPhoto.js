import { GoogleGenAI } from "@google/genai";
import config from "../config/config";

 const ai = new GoogleGenAI({
        apiKey : config.geminiApiKey
    });
 async function callGemini(base64ImageData) {
   
  
    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64ImageData,
        },
      },
{
  text: `
L’image provient d’une caméra infrarouge et peut être très rouge.
Ignore complètement la dominante rouge.

Tu analyses un déchet.

Choisis UNE SEULE catégorie :

- recyclage
- poubelle
- compost
- autre

Règles :
- emballages, plastique, métal, papier, carton, canettes, bouteilles → recyclage
- nourriture, restes alimentaires, matières organiques → compost
- déchets ordinaires non recyclables → poubelle
- piles, batteries, électronique, ampoules, produits dangereux ou objets impossibles à identifier → autre

IMPORTANT :
- Réponds avec UN SEUL mot
- En minuscule
- Sans phrase
- Sans ponctuation
- Sans explication
- ne réponds jamais autre si tu peux identifier des trois autres catégories
`
}
    ],
      config: {
    temperature: 0,
    topP: 0,
    topK: 1,
  }
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
