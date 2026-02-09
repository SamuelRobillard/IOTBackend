import { Schema, model, Document, Types, Date } from 'mongoose';
import { categorieJeter } from './Verification';

export enum categorieAnalyser {

    Compost = 'compost',
    Recyclage = 'recyclage',
    Poubelle = 'poubelle',
    Autre = 'autre',
    Erreur = 'erreur',
}



export interface IStatistique extends Document {
    categorieAnalyser: categorieJeter;
    ratio: Number;
    TotalNumber: Number;
}

const StatistiqueSchema = new Schema<IStatistique>({
    categorieAnalyser: {
        type: String,
        enum: Object.values(categorieAnalyser),
        required: true,
    },
    ratio: { type: Number, required: true },

    TotalNumber: { type: Number, required: true },

},
    { timestamps: true }
);

export default model<IStatistique>('Statistique', StatistiqueSchema);