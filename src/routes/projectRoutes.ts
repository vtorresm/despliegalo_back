import { Router } from 'express';
import { body, param } from 'express-validator';
import { ProjectController } from '../controllers/ProjectController';
import { handleInputErrors } from '../middleware/validation';
import { TaskController } from '../controllers/TaskController';
import { validateProjectExists } from '../middleware/project';
import {
  validateTaskBelongsToProject,
  validateTaskExists,
} from '../middleware/task';

const router = Router();

router.post(
  '/',
  body('projectName')
    .notEmpty()
    .withMessage('El Nombre del Proyecto es Obligatorio'),
  body('clientName')
    .notEmpty()
    .withMessage('El Nombre del Cliente es Obligatorio'),
  body('description')
    .notEmpty()
    .withMessage('La Descripción del Proyecto es Obligatoria'),
  handleInputErrors,
  ProjectController.createProject
);

router.get('/', ProjectController.getAllProjects);

router.get(
  '/:id',
  param('id').isMongoId().withMessage('El ID del Proyecto no es válido'),
  handleInputErrors,
  ProjectController.getProjectById
);

router.put(
  '/:id',
  body('projectName')
    .notEmpty()
    .withMessage('El Nombre del Proyecto es Obligatorio'),
  body('clientName')
    .notEmpty()
    .withMessage('El Nombre del Cliente es Obligatorio'),
  body('description')
    .notEmpty()
    .withMessage('La Descripción del Proyecto es Obligatoria'),
  handleInputErrors,
  ProjectController.updateProject
);

router.delete(
  '/:id',
  param('id').isMongoId().withMessage('El ID del Proyecto no es válido'),
  handleInputErrors,
  ProjectController.deleteProject
);

// Routes for tasks
router.param('projectId', validateProjectExists);

router.post(
  '/:projectId/tasks',
  body('name').notEmpty().withMessage('El Nombre de la tarea es Obligatorio'),
  body('description')
    .notEmpty()
    .withMessage('La Descripción de la tarea es Obligatoria'),
  handleInputErrors,
  TaskController.createTask
);

router.get('/:projectId/tasks', TaskController.getProjectTasks);

router.param('taskId', validateTaskExists);
router.param('taskId', validateTaskBelongsToProject);
router.get(
  '/:projectId/tasks/:taskId',
  param('taskId').isMongoId().withMessage('El ID del Proyecto no es válido'),
  handleInputErrors,
  TaskController.getTaskById
);

router.put(
  '/:projectId/tasks/:taskId',
  param('taskId').isMongoId().withMessage('El ID del Proyecto no es válido'),
  body('name').notEmpty().withMessage('El Nombre de la tarea es Obligatorio'),
  body('description')
    .notEmpty()
    .withMessage('La Descripción de la tarea es Obligatoria'),
  handleInputErrors,
  TaskController.updateTask
);

router.delete(
  '/:projectId/tasks/:taskId',
  param('taskId').isMongoId().withMessage('El ID del Proyecto no es válido'),
  handleInputErrors,
  TaskController.deleteTask
);

router.post(
  '/:projectId/tasks/:taskId/status',
  param('taskId').isMongoId().withMessage('El ID de la tarea no es válido'),
  body('status').notEmpty().withMessage('El estado de la tarea es obligatorio'),
  handleInputErrors,
  TaskController.updateTaskStatus
);

export default router;
