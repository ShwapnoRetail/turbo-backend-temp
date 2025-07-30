//dotenv config
import dotenv from 'dotenv';
dotenv.config({
  path: ['.env']
});


import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;


declare module 'express' {
  interface Request {
    userId?: string;
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'No token provideddd' });
  if (!JWT_SECRET) return res.status(500).json({ message: 'JWT secret not configured' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as unknown as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};