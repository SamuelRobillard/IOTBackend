import { categorieAnalyserDechet } from "./Dechet";
import { categorieJeter } from "./Verification";

export default class DTODechet {
    idDechet: string;
    categorieAnalyser:categorieAnalyserDechet;
    categorieJeter:categorieJeter;
    
    
   
   

    // Constructeur pour initialiser toutes les propriétés de la classe
    constructor(
    idDechet: string,
    categorieAnalyser:categorieAnalyserDechet,
    categorieJeter:categorieJeter,
    
       
       
    ) {
        this.idDechet = idDechet;
        this.categorieAnalyser = categorieAnalyser;
        this.categorieJeter  = categorieJeter;
       
    }
}