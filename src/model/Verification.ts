import { Schema, model, Document, Types, Date } from 'mongoose';

export enum categorieJeter {

    Compost = 'compost',
    Recyclage = 'recyclage',
    Poubelle = 'poubelle',
    Autre = 'Autre',

}



export interface IVerification extends Document {
    idDechet:Types.ObjectId;
    categorieJeter: categorieJeter;

}

const VerificationSchema = new Schema<IVerification>({
    idDechet: {type:Schema.Types.ObjectId,ref:'Dechet',required:true},
    categorieJeter: {
        type: String,
        enum: Object.values(categorieJeter),
        required: true,
    },
  

},
    { timestamps: true }
);

export default model<IVerification>('Verification', VerificationSchema);