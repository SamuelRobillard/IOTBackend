import { Schema, model, Document, Types, Date } from 'mongoose';





export interface INotification extends Document {
    categoriePoubelle : string;
    idAdmin : Types.ObjectId;
    isFull : boolean;
    notifIsSent : boolean;

}

const NotificationSchema = new Schema<INotification>({
    categoriePoubelle: {type:String,required:true},
    idAdmin: {type:Schema.Types.ObjectId,ref:'Admin',required:true},
    isFull: {type:Boolean,required:true},
    notifIsSent: {type:Boolean,required:true},
    
  

},
    { timestamps: true }
);

export default model<INotification>('Notification', NotificationSchema);

