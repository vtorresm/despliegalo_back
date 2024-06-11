import { Router } from 'express';
import { body, param } from 'express-validator';
import { AuthController } from '../controllers/AuthController';
import { handleInputErrors } from '../middleware/validation';
import { TaskController } from '../controllers/TaskController';
import { validateUserExists } from '../middleware/user';

const routerAuth = Router();

routerAuth.post(
  '/create-account',
  body('userName')
    .notEmpty()
    .withMessage('El Nombre del Usuario es Obligatorio'),
  body('userEmail').isEmail().withMessage('Email no válido'),
  body('userPassword')
    .isLength({ min: 8 })
    .withMessage('El password es muy corto, minimo 8 caracteres'),
  body('password_confirmation').custom((value, { req }) => {
    if (value !== req.body.userPassword) {
      throw new Error('Los Password no son iguales');
    }
    return true;
  }),
  handleInputErrors,
  AuthController.createAccount
);

routerAuth.get('/', AuthController.getAllUsers);

routerAuth.get(
  '/:id',
  param('id').isMongoId().withMessage('El ID de usuario no es válido'),
  handleInputErrors,
  AuthController.getUserById
);

routerAuth.put(
  '/:id',
  body('userName')
    .notEmpty()
    .withMessage('El Nombre del Usuario es Obligatorio'),
  body('userEmail').notEmpty().withMessage('El Email  es Obligatorio'),
  body('userPassword')
    .isLength({ min: 8 })
    .withMessage('El password es muy corto, minimo 8 caracteres'),
  handleInputErrors,
  AuthController.updateUser
);

routerAuth.delete(
  '/:id',
  param('id').isMongoId().withMessage('El ID del Usuario no es válido'),
  handleInputErrors,
  AuthController.deleteUser
);

export default routerAuth;
