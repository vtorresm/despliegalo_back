import { Router } from 'express';
import { body, param } from 'express-validator';

import { AuthController } from '../controllers/AuthController';
import { TaskController } from '../controllers/TaskController';

import { handleInputErrors } from '../middleware/validation';
import { validateUserExists } from '../middleware/user';

const routerAuth = Router();

// Rutas para crear una cuenta de usuario
routerAuth.post('/create-account', [
  body('name').notEmpty().withMessage('El Nombre del Usuario es Obligatorio'),
  body('email').isEmail().withMessage('Email no válido'),
  body('password').isLength({ min: 8 }).withMessage('El password es muy corto, mínimo 8 caracteres'),
  body('password_confirmation').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Los Password no son iguales');
    }
    return true;
  }),
  handleInputErrors,
  AuthController.createAccount
]);

// Ruta para confirmar una cuenta de usuario
routerAuth.post('/confirm-account', [
  body('token').notEmpty().withMessage('El token no puede ir vacío'),
  handleInputErrors,
  AuthController.confirmAccount
]);

routerAuth.post('/login', [
  body('email')
    .isEmail().withMessage('Email no válido'),
  body('password').notEmpty().withMessage('El password no puede ir vacío'),
  handleInputErrors,
  AuthController.login
]);

// Ruta para obtener todos los usuarios
routerAuth.get('/', AuthController.getAllUsers);

// Ruta para obtener un usuario por su ID
routerAuth.get('/:id', [
  param('id').isMongoId().withMessage('El ID de usuario no es válido'),
  handleInputErrors,
  AuthController.getUserById
]);

// Ruta para actualizar un usuario
routerAuth.put('/:id', [
  param('id').isMongoId().withMessage('El ID de usuario no es válido'),
  body('name').notEmpty().withMessage('El Nombre del Usuario es Obligatorio'),
  body('email').notEmpty().withMessage('El Email es Obligatorio'),
  body('password').isLength({ min: 8 }).withMessage('El password es muy corto, mínimo 8 caracteres'),
  handleInputErrors,
  AuthController.updateUser
]);

// Ruta para eliminar un usuario
routerAuth.delete('/:id', [
  param('id').isMongoId().withMessage('El ID del Usuario no es válido'),
  handleInputErrors,
  AuthController.deleteUser
]);

export default routerAuth;
