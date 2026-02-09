import { Request,Response } from "express";
import { DechetService } from "../services/DechetService";
import { combineAllDataForAllDechets} from "../services/CombinedDataDechetService";
import { StatistiqueService } from "../services/StatistiqueService";
export class FrontendDataController {

    public async getAllDechetsDTO(req: Request, res: Response): Promise<Response> {
      
      
      try {
        const idDechet = await  DechetService.getAllDechets();
        const dechetsList = await combineAllDataForAllDechets(idDechet);
        return res.status(200).json(dechetsList);
      } catch (error: unknown) {
        return res.status(400).json({ message: 'erreur lors de la récupération de la liste des déchets.'});
      }
    }
    public async getAllStats(req: Request, res: Response): Promise<Response> {
      
      
      try {
        
        const statsList = await StatistiqueService.getAllStats()
        return res.status(200).json(statsList);
      } catch (error: unknown) {
        return res.status(400).json({ message: 'erreur lors de la récupération de la liste des déchets.'});
      }
    }
  }
  
  