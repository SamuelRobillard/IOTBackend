import { Schema, model, Document, Types, Date } from 'mongoose';

export enum categorieAnalyserDechet {

    Compost = 'compost',
    Recyclage = 'recyclage',
    Poubelle = 'poubelle',
    Autre = 'autre',
    Erreur = 'erreur',
}



export interface IDechet extends Document {
    
    categorieAnalyser: categorieAnalyserDechet;

}

const DechetSchema = new Schema<IDechet> ({
 
    categorieAnalyser: {
        type:String,
        enum:Object.values(categorieAnalyserDechet),
        required:true,
    }
    
  },
  { timestamps: true }
);

export default model<IDechet>('Dechet', DechetSchema);