import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Token manquant' });
  }

  const token = authHeader.split(' ')[1];
if (!token) {
  return res.status(401).json({ message: 'Token manquant' });
}

  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // ✅ On attache les infos du token à la requête
    
    next();
  } catch (error) {
    res.status(403).json({ message: 'Token invalide ou expiré' });
  }
};
