import { Schema, model, Document, Types, Date } from 'mongoose';

export interface IAdmin extends Document {
  idAdmin: Number;
  username: string;
  password:string;
 
}

const AdminSchema = new Schema<IAdmin> ({
    idAdmin: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    
  },
  { timestamps: true }
);

export default model<IAdmin>('Admin', AdminSchema);