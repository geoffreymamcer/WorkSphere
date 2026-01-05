import { Request, Response, NextFunction } from "express";
import { taskService } from "../services/task.service";
import {
  createTaskSchema,
  moveTaskSchema,
  updateTaskSchema,
  assignTaskSchema, // Import
} from "../validators/task.schema";

export const taskController = {
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedBody = createTaskSchema.parse(req.body);
      const userId = req.user!.userId;
      const { listId } = req.params;
      const task = await taskService.createTask(
        userId,
        listId,
        parsedBody.title
      );
      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  },

  move: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedBody = moveTaskSchema.parse(req.body);
      const userId = req.user!.userId;
      const { taskId } = req.params;
      const task = await taskService.moveTask(
        userId,
        taskId,
        parsedBody.columnId,
        parsedBody.order
      );
      res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedBody = updateTaskSchema.parse(req.body);
      const userId = req.user!.userId;
      const { taskId } = req.params;
      const task = await taskService.updateTask(userId, taskId, parsedBody);
      res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  },

  getMyTasks: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const tasks = await taskService.getMyTasks(userId);
      res.status(200).json(tasks);
    } catch (error) {
      next(error);
    }
  },

  // NEW HANDLER
  assign: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedBody = assignTaskSchema.parse(req.body);
      const userId = req.user!.userId;
      const { taskId } = req.params;
      const task = await taskService.assignTask(
        userId,
        taskId,
        parsedBody.userId
      );
      res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  },
};
