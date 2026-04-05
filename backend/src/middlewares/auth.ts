import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface SupabaseUser {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: SupabaseUser;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization header' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as SupabaseUser;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
