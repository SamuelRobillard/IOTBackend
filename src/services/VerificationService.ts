import { v } from "@faker-js/faker/dist/airline-DF6RqYmq";
import Verification,{IVerification,categorieJeter} from "../model/Verification";
import { count } from "console";

export class VerificationService {
    public static async createDechet(
        idDechet:string,
        categorieJeter:categorieJeter,
     
    ): Promise<any> {
    
      const existingVerification = await Verification.findOne({ idDechet:idDechet});
      if (existingVerification) {
        return "Vérification already exists."
      }
  
      

  
      const verification = new Verification({
          categorieJeter,
          idDechet,
      });
  
      
      await verification.save();
  
      
      return verification;
    }
    public static async getVerificationByDechetId(idDechet: string) {
      try {
          const verification = await Verification.findOne({ idDechet: idDechet });
          return verification;
      } catch (error) {
          console.error('Erreur lors de la recherche de la vérification du déchet:', error);
          return null;
      }
  }
  public static async getNumberByCategorie(categorieJeter : string) {
    try {
        const verification = await Verification.find({ categorieJeter : categorieJeter });
        return verification.length
    } catch (error) {
        console.error('Erreur lors de la recherche de la vérification du déchet:', error);
        return null;
    }
}
public static async getTotalNumber() {
  try {
      const verification = await Verification.find();
      return verification.length
  } catch (error) {
      console.error('Erreur lors de la recherche de la vérification du déchet:', error);
      return null;
  }
}
}
