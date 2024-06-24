import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User';

export class AuthController {
  private static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  private static async findUserById(id: string) {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    return user;
  }

  static createAccount = async (req: Request, res: Response) => {
    try {
      const user = new User(req.body);
      user.userPassword = await this.hashPassword(req.body.userPassword);
      await user.save();
      res.send('Cuenta creada correctamente, revisa tu email para confirmarla');
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' });
    }
  };

  static getAllUsers = async (req: Request, res: Response) => {
    try {
      const users = await User.find({});
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' });
    }
  };

  static getUserById = async (req: Request, res: Response) => {
    try {
      const user = await this.findUserById(req.params.id);
      res.json(user);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  };

  static updateUser = async (req: Request, res: Response) => {
    try {
      const user = await this.findUserById(req.params.id);
      Object.assign(user, req.body);
      if (req.body.userPassword) {
        user.userPassword = await this.hashPassword(req.body.userPassword);
      }
      await user.save();
      res.send('Usuario actualizado correctamente!');
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  };

  static deleteUser = async (req: Request, res: Response) => {
    try {
      await User.deleteOne({ _id: req.params.id });
      res.send('Usuario eliminado correctamente!');
    } catch (error) {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  };
}
