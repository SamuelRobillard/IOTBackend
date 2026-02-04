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
}