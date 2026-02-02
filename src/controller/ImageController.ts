import { Request, Response } from "express";
import {callHim} from "../services/chatApi.js"
import { geminiPic } from "../services/geminiPhoto.js";

export class ImageController {


  public async uploadImage(req: Request, res: Response): Promise<Response> {
    
    
   
        if (!req.file) {
            return res.status(400).send({ message: 'No file uploaded.' });
          }
        
        
          const imageBase64 = req.file.buffer.toString('base64');
          const imageType = req.file.mimetype; 
          
          
         
        const answer = await geminiPic(imageBase64)
        console.log(answer)
        return  res.status(200).send(answer);
  

  


        }

}

