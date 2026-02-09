import Statistique,{categorieAnalyser, IStatistique} from "../model/Statistique";
import { categorieJeter } from "../model/Verification";


export class StatistiqueService {
  public static async createStatistique(
    categorieJeter : categorieJeter,
    TotalNumber: number,
    ratio: number
): Promise<any> {
   
    const statistique = await Statistique.findOneAndUpdate(
        { categorieAnalyser: categorieJeter }, 
        { 
            TotalNumber,
            ratio
        },
        { 
            new: true,  
            upsert: true 
        }
    );

    return statistique;
}
public static async updateRatio(
  categorieJeter: categorieJeter,
  ratio: number
): Promise<any> {
 
  const statistique = await Statistique.findOneAndUpdate(
      { categorieAnalyser: categorieJeter },   
      { 
          ratio 
      },
      { 
          new: true,   
          upsert: false 
      }
  );

  return statistique;
}


public static async getAllStats(): Promise<any> {
 
  const statistique = await Statistique.find()

    return statistique

}

}
