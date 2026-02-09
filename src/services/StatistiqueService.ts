import Statistique,{categorieAnalyser, IStatistique} from "../model/Statistique";


export class StatistiqueService {
    public static async createStatistique(
        categorieAnalyserStat:categorieAnalyser,
        TotalNumber:Number,
        ratio:Number,
     
    ): Promise<any> {
    
      const existingStatistique = await Statistique.findOne({ categorieAnalyser: categorieAnalyserStat });
      if (existingStatistique) {
        return "Statistic already exists"
      }
  
      

  
      const statistique = new Statistique({
          categorieAnalyser: categorieAnalyserStat,
          TotalNumber,
          ratio
        
      });
  
      
      await statistique.save();
  
      
      return statistique;
    }
}