import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware'; 
export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
   
    
    if (!req.user) {
    return res.status(401).json({ message: 'Utilisateur non authentifié' });
  }

 

  next();
};