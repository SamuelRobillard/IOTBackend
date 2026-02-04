import { Types } from "mongoose";
import Dechet,{IDechet,categorieAnalyserDechet} from "../model/Dechet";
export class DechetService {
    public static async createDechet(
        categorieAnalyser:categorieAnalyserDechet,
     
    ): Promise<any> {
    
     
    

  
      const dechet = new Dechet({
          categorieAnalyser,
      });
  
      
      await dechet.save();
  
      
      return dechet;
    }


    public static async getAllDechets():Promise<any>{

       try {
        const dechets = await Dechet.find().select('_id');
        console.log(dechets);
        if(dechets != null){
            return dechets.map(e=> e._id);
        }
       } catch (error) {       
        console.log('Erreur lors de la récupération des déchets.')
       }

    }

}