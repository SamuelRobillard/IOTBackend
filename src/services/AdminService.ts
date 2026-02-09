

import bcrypt from "bcryptjs";
import { Types } from "mongoose";

import { error } from "console";
import Admin, { IAdmin } from "../model/Admin";

export class AdminService {
  public static async createAdmin(
   
    username : string,
    password : string,
    email : string
    
  ): Promise<any> {
    // Vérifier si l'email existe déjà
    const existingUser = await Admin.findOne({
      $or: [
        { username },
        { email }
      ]
    });
    if (existingUser) {
      return "username or email already exists"
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({
        username,
        password : hashedPassword, 
        email : email
      
    });

    
    await admin.save();

    
    return admin;
  }

 

  public static async getAllAdmin(): Promise<IAdmin[]> {
    try {
      const users = await Admin.find();

      return users;
    } catch (error) {
      throw new Error(
        "Erreur lors de la récupération des Admins: " + error
      );
    }
  }

 
}
