import { Schema, model, Document, Types, Date } from 'mongoose';

export interface IAdmin extends Document {
  
  username: string;
  password:string;
 
}

const AdminSchema = new Schema<IAdmin> ({
    
    username: { type: String, required: true },
    password: { type: String, required: true },
    
  },
  { timestamps: true }
);

export default model<IAdmin>('Admin', AdminSchema);