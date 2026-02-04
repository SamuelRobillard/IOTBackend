import Dechet, { categorieAnalyserDechet } from "../model/Dechet";
import { DateService } from "./DateService";
import { VerificationService } from "./VerificationService";
import { categorieJeter } from "../model/Verification";
import { DechetService } from "./DechetService";
import DTODechet from "../model/DTODechet";
const createCombinedDocuments = async (
    categorieAnalyser: categorieAnalyserDechet,
      categorieJeter: categorieJeter,
    date: string,
 
 
) => {
    try {
        console.log('création de la combinaison')
        // Vérification des paramètres requis
        if (!categorieAnalyser ||   !date || !categorieJeter) {
            throw new Error('Certains paramètres nécessaires sont manquants.');
        }


        const dechet =  await DechetService.createDechet(categorieAnalyser)
        

        console.log(`Déchet créé avec succès, ID: ${dechet}`); 

        const idDechet = dechet._id as string 

        if(!idDechet){
            console.log('erreur lors de la création du déchet');
            return null
        }

        const dateDechet = await DateService.createDate(idDechet, date);
        if (!dateDechet) {
            throw new Error("Erreur lors de la création de la date");
        }

   
     
        const verification = await VerificationService.createDechet(idDechet, categorieJeter);
        if (!verification) {
            throw new Error('Erreur lors de la création de la vérification du déchet');
        }

        return {
       
            idDechet: idDechet, 
            date,
            categorieAnalyser,
            
            categorieJeter,
            
         
        };

    } catch (error) {
       
        console.error('Erreur lors de la création des documents:', error);
       
    }


    


};     

export const combineAllDataForOneDechetByHisId = async (idDechet: string): Promise<DTODechet | null> => {
    try {
        console.log(`Recherche du déchet avec l'ID: ${idDechet}`);


        const dechet = await Dechet.findById(idDechet);

    
        if (!dechet) {
            console.log('Déchet non trouvé');
            return null;
        }

        const verification = await VerificationService.getVerificationByDechetId(idDechet);

        console.log('trouvé vérification')
        if (!verification) {
            console.log('Vérification pour ce déchet non trouvée');
            return null;
        }

        const dtoDechet = new DTODechet(
            dechet._id as string,  
            dechet.categorieAnalyser,  
            verification.categorieJeter  
        );

        console.log('dto crée',dtoDechet)
        return dtoDechet;
        
    } catch (error) {
        console.error('Erreur lors de la recherche du déchet:', error);
        return null;
    }
};


export default createCombinedDocuments;



