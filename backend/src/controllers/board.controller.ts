import { Request, Response, NextFunction } from "express";
import { boardService } from "../services/board.service";
import { createBoardSchema } from "../validators/board.schema";

export const boardController = {
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedBody = createBoardSchema.parse(req.body);
      const userId = req.user!.userId;
      const board = await boardService.createBoard(userId, parsedBody);
      res.status(201).json(board);
    } catch (error) {
      next(error);
    }
  },

  getOne: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const boardId = req.params.id;
      const board = await boardService.getBoard(userId, boardId);
      res.status(200).json(board);
    } catch (error) {
      next(error);
    }
  },
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const boards = await boardService.getUserBoards(userId);
      res.status(200).json(boards);
    } catch (error) {
      next(error);
    }
  },
};
