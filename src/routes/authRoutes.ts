import { Router } from 'express';
import { body, param } from 'express-validator';
import { AuthController } from '../controllers/AuthController';
import { handleInputErrors } from '../middleware/validation';

const routerAuth = Router();

// Common validators
const userNameValidator = body('userName').notEmpty().withMessage('El Nombre del Usuario es Obligatorio');
const userEmailValidator = body('userEmail').isEmail().withMessage('Email no válido');
const userPasswordValidator = body('userPassword')
  .isLength({ min: 8 })
  .withMessage('El password es muy corto, minimo 8 caracteres');
const passwordConfirmationValidator = body('password_confirmation').custom((value, { req }) => {
  if (value !== req.body.userPassword) {
    throw new Error('Los Password no son iguales');
  }
  return true;
});
const userIdParamValidator = param('id').isMongoId().withMessage('El ID de usuario no es válido');

// Create account route
routerAuth.post(
  '/create-account',
  [userNameValidator, userEmailValidator, userPasswordValidator, passwordConfirmationValidator, handleInputErrors],
  AuthController.createAccount
);

// Get all users route
routerAuth.get('/', AuthController.getAllUsers);

// Get user by ID route
routerAuth.get('/:id', [userIdParamValidator, handleInputErrors], AuthController.getUserById);

// Update user route
routerAuth.put(
  '/:id',
  [userNameValidator, userEmailValidator.notEmpty().withMessage('El Email es Obligatorio'), userPasswordValidator, handleInputErrors],
  AuthController.updateUser
);

// Delete user route
routerAuth.delete('/:id', [userIdParamValidator, handleInputErrors], AuthController.deleteUser);

export default routerAuth;
