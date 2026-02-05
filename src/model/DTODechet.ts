import { categorieAnalyserDechet } from "./Dechet";
import { categorieJeter } from "./Verification";
import Date from "./DateModel";
export default class DTODechet {
    idDechet: string;
    categorieAnalyser:categorieAnalyserDechet;
    categorieJeter:categorieJeter;
    date:string;
    
    
   
   

    // Constructeur pour initialiser toutes les propriétés de la classe
    constructor(
    idDechet: string,
    categorieAnalyser:categorieAnalyserDechet,
    categorieJeter:categorieJeter,
    date:string
       
       
    ) {
        this.idDechet = idDechet;
        this.categorieAnalyser = categorieAnalyser;
        this.categorieJeter  = categorieJeter;
       this.date = date;
    }
}