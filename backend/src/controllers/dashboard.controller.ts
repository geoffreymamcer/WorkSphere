import { Request, Response, NextFunction } from "express";
import { dashboardService } from "../services/dashboard.service";
import { activityService } from "../services/activity.service";

export const dashboardController = {
  getActiveBoards: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const boards = await dashboardService.getActiveBoards(userId);
      res.status(200).json(boards);
    } catch (error) {
      next(error);
    }
  },

  getRecentActivity: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user!.userId;
      const activity = await activityService.getRecentActivity(userId);
      res.status(200).json(activity);
    } catch (error) {
      next(error);
    }
  },
  getStats: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const stats = await dashboardService.getStats(userId);
      res.status(200).json(stats);
    } catch (error) {
      next(error);
    }
  },
};
