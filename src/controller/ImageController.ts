import { Request, Response } from "express";
import {callHim} from "../services/chatApi.js"
import { callGeminiSafe } from "../services/geminiPhoto.js";
import { fi } from "@faker-js/faker/.";

export class ImageController {


  public async uploadImage(req: Request, res: Response): Promise<Response> {
    
    
   
        if (!req.file) {
            return res.status(400).send({ message: 'No file uploaded.' });
          }
        const filetype = req.file.mimetype
        
        
        const parts = filetype.split("/")
        
        const extention = parts[parts.length - 1]
       
        if(extention !== "jpeg"){
          return res.status(400).send({ message: 'File must be jpeg' });
        }
          const imageBase64 = req.file.buffer.toString('base64');
          
          
          
         
        const answer = await callGeminiSafe(imageBase64)
        // console.log(answer)
        return  res.status(200).send(answer);
  

  


        }

}

