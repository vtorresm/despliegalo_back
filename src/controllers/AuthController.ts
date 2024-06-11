import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User';

export class AuthController {
  static createAccount= async (req: Request, res: Response) => {
    const { userPassword } = req.body;
    const user = new User(req.body);

    try {
      const salt = await bcrypt.genSalt(10);
      user.userPassword = await bcrypt.hash(userPassword, salt);
      await user.save();
      res.send('Cuenta creado correctamente, revisa tu email para confirmarla');
    } catch (error) {
      res.status(500).json({error:'Hubo un error'})
    }
  };

  static getAllUsers = async (req: Request, res: Response) => {
    try {
      const users = await User.find({});
      res.json(users);
    } catch (error) {
      console.log(error);
    }
  };

  static getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const user = await User.findById(id).populate('tasks');

      if (!user) {
        const error = new Error('Usuario no encontrado');
        return res.status(404).json({ error: error.message });
      }
      res.json(user);
    } catch (error) {
      console.log(error);
    }
  };

  static updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const user = await User.findById(id);

      if (!user) {
        const error = new Error('Usuario no encontrado');
        return res.status(404).json({ error: error.message });
      }

      user.userName = req.body.userName;
      user.userEmail = req.body.userEmail;
      user.userPassword = req.body.usePassword;
      await user.save();
      res.send('Usuario actualizado correctamente!');
    } catch (error) {
      console.log(error);
    }
  };

  static deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const user = await User.findById(id);

      if (!user) {
        const error = new Error('Usuario no encontrado');
        return res.status(404).json({ error: error.message });
      }

      await user.deleteOne();

      res.send('Usuario eliminado correctamente!');
    } catch (error) {
      console.log(error);
    }
  };
}
