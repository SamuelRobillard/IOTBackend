import Statistique,{categorieAnalyser, IStatistique} from "../model/Statistique";


export class StatistiqueService {
    public static async createStatistique(
        categorieAnalyser:categorieAnalyser,
        TotalNumber:Number,
        ratio:Number,
     
    ): Promise<any> {
    
      const existingStatistique = await Statistique.findOne({ categorieAnalyser });
      if (existingStatistique) {
        return "Statistic already exists"
      }
  
      

  
      const statistique = new Statistique({
          categorieAnalyser,
          TotalNumber,
          ratio
        
      });
  
      
      await statistique.save();
  
      
      return statistique;
    }
}