import Dechet, { categorieAnalyserDechet, IDechet } from "../model/Dechet";
import { DateService } from "./DateService";
import { VerificationService } from "./VerificationService";
import { categorieJeter } from "../model/Verification";
import { DechetService } from "./DechetService";
import DateModel from "../model/DateModel";
import DTODechet from "../model/DTODechet";
import { StatistiqueService } from "./StatistiqueService";
import { CreateDataService } from "./CreateDataService";

const createCombinedDocuments = async (
    categorieAnalyser: categorieAnalyserDechet,
    categorieJeter: categorieJeter,
    
) => {
    try {
        console.log('création de la combinaison')
        if (!categorieAnalyser  || !categorieJeter) {
            throw new Error('Certains paramètres nécessaires sont manquants.');
        }

        const dechet =  await DechetService.createDechet(categorieAnalyser)
        


        const idDechet = dechet._id as string 

        if(!idDechet){
            return null
        }


        const currentDate = new Date();
        const dateFormatted = currentDate.toLocaleString('fr-FR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false // Use 24-hour format
        });
        const dateDechet = await DateService.createDate(idDechet, dateFormatted);
        if (!dateDechet) {
            throw new Error("Erreur lors de la création de la date");
        }

        const verification = await VerificationService.createDechet(idDechet, categorieJeter);
        if (!verification) {
            throw new Error('Erreur lors de la création de la vérification du déchet');
        }

        await CreateDataService.UpdateStatistiqueOneCategorie(categorieJeter)
        await CreateDataService.updateAllRatio()
        return {
       
            idDechet: idDechet, 
            dateFormatted,
            categorieAnalyser,
            categorieJeter,
         
        };

    } catch (error) {
       
        console.error('Erreur lors de la création des documents:', error);
       
    }

};     
export const combineAllDataForOneDechetByHisId = async (idDechet: string): Promise<DTODechet | null> => {
    try {



        const dechet = await Dechet.findById(idDechet);

    
        if (!dechet) {
            console.log('Déchet non trouvé');
            return null;
        }

        const verification = await VerificationService.getVerificationByDechetId(idDechet);

        if (!verification) {
            console.log('Vérification pour ce déchet non trouvée');
            return null;
        }

        const dateRecord =  await DateModel.findOne({idDechet});



        if(!dateRecord){
            console.log('L\'enregistrement de la date pour ce déchet n\'a pas été trouvée.')

            return null;
        }

        const dtoDechet = new DTODechet(
            dechet._id as string,  
            dechet.categorieAnalyser,  
            verification.categorieJeter,
            dateRecord.date,
            
        );

        return dtoDechet;
        
    } catch (error) {
        console.error('Erreur lors de la recherche du déchet:', error);
        return null;
    }
};


export const combineAllDataForAllDechets = async (allIDDechets :string[]): Promise<any| null> => {
    try {


                
        if(allIDDechets !== null){

        
            const result = await Promise.all(allIDDechets.map(async (e: string) => await combineAllDataForOneDechetByHisId(e)))
            console.log(result);
            if(result !== null){
                return result;
            }
        }

        return  null;
        
        

        
    } catch (error) {
        console.error('Erreur lors de la recherche du déchet:', error);
        return null;
    }
};



export default createCombinedDocuments;



