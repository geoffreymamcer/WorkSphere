import { Request, Response, NextFunction } from "express";
import { listService } from "../services/list.service";
import { createListSchema } from "../validators/list.schema";

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
};
