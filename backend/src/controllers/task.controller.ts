import { Request, Response, NextFunction } from "express";
import { taskService } from "../services/task.service";
import { createTaskSchema, moveTaskSchema } from "../validators/task.schema";

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
};
