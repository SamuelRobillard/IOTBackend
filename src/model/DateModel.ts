import { Schema, model, Document, Types, Date } from 'mongoose';





export interface IDate extends Document {
    idDechet:Types.ObjectId;
    date: string;

}

const DateSchema = new Schema<IDate>({
    idDechet: {type:Schema.Types.ObjectId,ref:'Dechet',required:true},
    date: {type:String,required:true},
  

},
    { timestamps: true }
);

export default model<IDate>('Date', DateSchema);

