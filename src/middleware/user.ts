import type { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/User';

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}

export async function validateUserExists(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      const error = new Error('Usuario no encontrado');
      return res.status(404).json({ error: error.message });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Hubo un error' });
  }
}
