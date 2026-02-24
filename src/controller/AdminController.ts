import { Request, Response } from "express";


import { AdminService } from "../services/AdminService";
import { IAdmin } from "../model/Admin";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ad } from "@faker-js/faker/dist/airline-DF6RqYmq";


export class AdminController {
  public async createAdmin(req: Request, res: Response): Promise<Response> {
    const { username, password, email} = req.body;
    
    try {
      const admin = await AdminService.createAdmin(
        username,
        password,
        email
      );
      return res.status(201).json(admin);
    } catch (error: unknown) {
      return res.status(400).json({ message: "probleme creation d'un admin " });
    }
  }

  


  public async login(req: Request, res: Response): Promise<void> {
    try{
    
    const admins: IAdmin[] = await AdminService.getAllAdmin();
    const admin = admins.find((admin) => admin.username === req.body.username);
    if (admin && (await bcrypt.compare(req.body.password, admin.password))) {
      const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";
      const accessToken = jwt.sign(
        {
          id: admin._id,
          username: admin.username,
          password: admin.password,
          email : admin.email
        
        },
        JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.json({ 
        accessToken,
        id: admin._id,
        username: admin.username,
        email: admin.email
      });
    } else {
      res.status(403).send("username ou mot de passe incorrect");
    }
    }
    catch(error){
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  }

  public async logout(req: Request, res: Response): Promise<Response> {
    try {
      // JWT is stateless, so logout is handled client-side by removing the token
      return res.status(200).json({ message: "Logged out successfully" });
    } catch (error: unknown) {
      return res.status(500).json({ message: "Erreur lors de la déconnexion" });
    }
  }


  public async getAllAdmin(req: Request, res: Response): Promise<Response> {
    
    
    try {
      const admins = await AdminService.getAllAdmin();
      return res.status(201).json(admins);
    } catch (error: unknown) {
      return res.status(400).json({ message: "probleme creation d'un admin " });
    }
  }
}

