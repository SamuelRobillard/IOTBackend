import { totalmem } from "os";
import Date,{IDate} from "../model/DateModel";
import { categorieAnalyser } from "../model/Statistique";
import { categorieJeter } from "../model/Verification";
import { StatistiqueService } from "./StatistiqueService";
import { VerificationService } from "./VerificationService";
export class CreateDataService {
    public static async UpdateStatistiqueOneCategorie(categorieJeter : categorieJeter)
    {
        const number = await VerificationService.getNumberByCategorie(categorieJeter)
        console.log(number)
        if(number){
           await StatistiqueService.createStatistique(categorieJeter, number, 0) 
        }
        
    }
    public static async updateAllRatio()

    {   
        const list = [categorieJeter.Poubelle, categorieJeter.Recyclage, categorieJeter.Compost, categorieJeter.Autre]
        const totalNumber = await VerificationService.getTotalNumber()
        console.log(totalNumber)
        
        for(let i = 0; i < list.length; i++){
            const categorie = list[i]
            console.log(categorie)
            if (categorie !== undefined) {
                const numberCategorie = await VerificationService.getNumberByCategorie(categorie)
                if(numberCategorie && totalNumber){
                    console.log("is Good")
                    const ratio = ((numberCategorie / totalNumber) * 100).toFixed(2)
                    console.log("asd" + ratio)
                    await StatistiqueService.updateRatio(categorie, Number(ratio)) 
            }
            }
            
            
        }
           
    }
}