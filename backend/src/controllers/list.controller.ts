import { Request, Response, NextFunction } from "express";
import { listService } from "../services/list.service";
import {
  createListSchema,
  updateListSchema,
  moveListSchema,
} from "../validators/list.schema";

export const listController = {
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedBody = createListSchema.parse(req.body);
      const userId = req.user!.userId;
      const { boardId } = req.params;
      const list = await listService.createList(
        userId,
        boardId,
        parsedBody.name
      );
      res.status(201).json(list);
    } catch (error) {
      next(error);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedBody = updateListSchema.parse(req.body);
      const userId = req.user!.userId;
      const { listId } = req.params;
      const list = await listService.updateList(
        userId,
        listId,
        parsedBody.name
      );
      res.status(200).json(list);
    } catch (error) {
      next(error);
    }
  },

  move: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedBody = moveListSchema.parse(req.body);
      const userId = req.user!.userId;
      const { listId } = req.params;
      const list = await listService.moveList(
        userId,
        listId,
        parsedBody.newOrder
      );
      res.status(200).json(list);
    } catch (error) {
      next(error);
    }
  },
};
