import { Request, Response } from "express";


import { AdminService } from "../services/AdminService";
import { IAdmin } from "../model/Admin";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export class AdminController {
  public async createAdmin(req: Request, res: Response): Promise<Response> {
    const { username, password} = req.body;
    
    try {
      const admin = await AdminService.createAdmin(
        username,
        password,

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
        
        },
        JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.json({ accessToken });
    } else {
      res.status(403).send("username ou mot de passe incorrect");
    }
    }
    catch(error){
      res.status(500).json({ message: "Erreur interne du serveur" });
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

