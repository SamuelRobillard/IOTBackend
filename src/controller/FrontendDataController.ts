import { Request,Response } from "express";
import { DechetService } from "../services/DechetService";
import { combineAllDataForAllDechets} from "../services/CombinedDataDechetService";
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
  }
  
  