import type { Request, Response } from 'express';
import Task from '../models/Task';

export class TaskController {
  // Helper method for handling errors
  private static handleError(res: Response, error: any) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ error: 'Hubo un error' });
  }

  static createTask = async (req: Request, res: Response) => {
    try {
      const task = new Task(req.body);
      task.project = req.project._id;
      req.project.tasks.push(task._id);
      await Promise.allSettled([task.save(), req.project.save()]);
      res.send('Tarea creada con éxito');
    } catch (error) {
      this.handleError(res, error);
    }
  };

  static getProjectTasks = async (req: Request, res: Response) => {
    try {
      const tasks = await Task.find({ project: req.project._id }).populate('project');
      res.json(tasks);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  static getTaskById = async (req: Request, res: Response) => {
    try {
      res.json(req.task);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  static updateTask = async (req: Request, res: Response) => {
    try {
      Object.assign(req.task, req.body); // More flexible and cleaner way to update properties
      await req.task.save();
      res.send('Tarea actualizada con éxito');
    } catch (error) {
      this.handleError(res, error);
    }
  };

  static deleteTask = async (req: Request, res: Response) => {
    try {
      req.project.tasks = req.project.tasks.filter(task => task.toString() !== req.task.id.toString());
      await Promise.allSettled([req.task.deleteOne(), req.project.save()]);
      res.send('Tarea eliminada con éxito');
    } catch (error) {
      this.handleError(res, error);
    }
  };

  static updateTaskStatus = async (req: Request, res: Response) => {
    try {
      req.task.status = req.body.status;
      await req.task.save();
      res.send('Estado de la tarea actualizado con éxito');
    } catch (error) {
      this.handleError(res, error);
    }
  };
}
