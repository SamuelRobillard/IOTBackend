
import fs from "fs";
import OpenAI from "openai";
import config from "../config/config";


const openai = new OpenAI({
    apiKey : config.openAiKey
}
    
);

// const imagePath = "path_to_your_image.jpg";
// const base64Image = fs.readFileSync(imagePath, "base64");

 export async function callHim(base64Image) {
 const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: [
        {
            role: "user",
            content: [
                { type: "input_text", text: "is it compost, garbage or recyclabe" },
                {
                    type: "input_image",
                    image_url: `data:image/jpeg;base64,${base64Image}`,
                },
            ],
        },
    ],
});

console.log(response.output_text);
return response.output_text
}
 
   
