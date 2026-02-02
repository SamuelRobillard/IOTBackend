import axios from "axios";
import fs from "fs";
import path from "path";
import config from "../config/config";
import { categorieAnalyser } from "../model/Statistique";

export class GoogleVision {
  
  public static async classifyImage(imageBase64: string): Promise<string> {
    const visionApiKey = config.googleVision; // Your Google Vision API key
    if (!visionApiKey) {
      throw new Error("Google Vision API key is not set.");
    }

    const googleVisionApiUrl = "https://vision.googleapis.com/v1/images:annotate";
    
    
   

    // Request body for Google Vision API (label detection)
    const requestBody = {
      requests: [
        {
          image: { content: imageBase64 }, // Image data in base64
          features: [{ type: "LABEL_DETECTION", maxResults: 5 }],
        },
      ],
    };

    try {
     
      const visionResponse = await axios.post(
        `${googleVisionApiUrl}?key=${visionApiKey}`,
        requestBody,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const labels = visionResponse.data.responses[0]?.labelAnnotations;
      if (!labels || labels.length === 0) {
        throw new Error("No labels detected in the image.");
      }

      
      const detectedLabels = labels.map((label: any) => label.description.toLowerCase());

      console.log("Detected Labels:", detectedLabels);

      


      // return only one classification
      const classification = GoogleVision.classifyBasedOnLabels(detectedLabels);

      console.log("Classification Result:", classification);
      return classification;
      
    } catch (error) {
      console.error("Error calling Google Vision API:", error);
      throw new Error("Failed to classify image.");
    }
  }

 
  public static classifyBasedOnLabels(detectedLabels: string[]): string {
    const categories = {
        garbage: ["plastic", "metal", "waste", "trash", "discarded", "container", "bottle", "junk"],
        compost: ["organic", "food", "fruit", "vegetable", "biodegradable", "compost", "leaf"],
        recyclable: ["paper", "cardboard", "glass", "can", "recyclable", "bottle", "plastic"],
      };
   
    for (const label of detectedLabels) {
      if (categories.garbage.includes(label)) {
        return "garbage";
      }
      if (categories.recyclable.includes(label)) {
        return "recyclabe";
      }
      if (categories.compost.includes(label)) {
        return "compost";
      }
    }
    return "unknown"; // If no matching label is found
  }

 
}
