import { Request,Response } from "express";
import { DechetService } from "../services/DechetService";
import createCombinedDocuments, { combineAllDataForAllDechets} from "../services/CombinedDataDechetService";
import { StatistiqueService } from "../services/StatistiqueService";
import { categorieJeter } from "../model/Verification";
export class IOTController {

    public async verificationJeter(req: Request, res: Response): Promise<Response> {
        const { categorieJeter } = req.params;
        const { categorieAnalyser} = req.body;
      try {
        if(categorieAnalyser && categorieJeter){
           const createDechet = await createCombinedDocuments(categorieAnalyser, categorieJeter as categorieJeter)
            return res.status(201).json(createDechet); 
        }
        return res.status(400).json({ message: 'erreur creation du dechet.'});
      } catch (error: unknown) {
        return res.status(400).json({ message: 'erreur lors de la récupération de la liste des déchets.'});
      }
    }
   
  }
  
  