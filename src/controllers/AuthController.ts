import { Request, Response } from 'express';
import User from '../models/User';
import Token from '../models/Token';
import { checkPassword, hashPassword } from '../utils/auth';
import { generateToken } from '../utils/token';
import { AuthEmail } from '../emails/AuthEmail';

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // Check if user already exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(409).json({ error: 'El Usuario ya esta registrado' });
      }

      // Create a new user
      const user = new User(req.body);
      // Hash the password
      user.password = await hashPassword(password);

      // Generate a token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;

      // Send confirmation email
      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      // Save user and token in parallel
      await Promise.allSettled([user.save(), token.save()]);

      res.send('Cuenta creada, revisa tu email para confirmarla');
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' });
    }
  };

  static confirmAccount = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      const tokenExists = await Token.findOne({ token });

      if (!tokenExists) {
        return res.status(404).json({ error: 'Token no válido' });
      }

      const user = await User.findById(tokenExists.user);
      user.confirmed = true;

      // Delete the token and save the user in parallel
      await Promise.allSettled([user.save(), tokenExists.deleteOne()]);
      res.send('Cuenta confirmada correctamente');
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' });
    }
  };

  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      if (!user.confirmed) {
        const token = new Token();
        token.user = user.id;
        token.token = generateToken();
        await token.save();

        // Send confirmation email
        AuthEmail.sendConfirmationEmail({
          email: user.email,
          name: user.name,
          token: token.token,
        });

        return res.status(401).json({
          error:
            'La cuenta no ha sido confirmada, hemos enviado un e-mail de confirmación',
        });
      }

      // Revisar password
      const isPasswordCorrect = await checkPassword(password, user.password);
      if (!isPasswordCorrect) {
        const error = new Error('Password Incorrecto');
        return res.status(401).json({ error: error.message });
      }

      res.send('Autenticado...');
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' });
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
        return res.status(404).json({ error: 'Usuario no encontrado' });
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
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      user.name = req.body.name;
      user.email = req.body.email;
      user.password = req.body.password;
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
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      await user.deleteOne();

      res.send('Usuario eliminado correctamente!');
    } catch (error) {
      console.log(error);
    }
  };
}
