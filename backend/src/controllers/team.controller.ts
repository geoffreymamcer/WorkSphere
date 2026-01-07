import { Request, Response, NextFunction } from "express";
import { teamService } from "../services/team.service";
import { createTeamSchema, joinTeamSchema } from "../validators/team.schema";

export const teamController = {
  getMembers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const { teamId } = req.params;
      const members = await teamService.getTeamMembers(userId, teamId);
      res.status(200).json(members);
    } catch (error) {
      next(error);
    }
  },
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedBody = createTeamSchema.parse(req.body);
      const userId = req.user!.userId;
      const team = await teamService.createTeam(
        userId,
        parsedBody.name,
        parsedBody.description
      );
      res.status(201).json(team);
    } catch (error) {
      next(error);
    }
  },

  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const teams = await teamService.getUserTeams(userId);
      res.status(200).json(teams);
    } catch (error) {
      next(error);
    }
  },

  getOne: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const { teamId } = req.params;
      const team = await teamService.getTeam(userId, teamId);
      res.status(200).json(team);
    } catch (error) {
      next(error);
    }
  },

  getBoards: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const { teamId } = req.params;
      const boards = await teamService.getTeamBoards(userId, teamId);
      res.status(200).json(boards);
    } catch (error) {
      next(error);
    }
  },
  generateInvite: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const { teamId } = req.params;
      const invite = await teamService.generateInviteCode(userId, teamId);
      res.status(201).json(invite);
    } catch (error) {
      next(error);
    }
  },

  // NEW
  getInvite: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const { teamId } = req.params;
      const invite = await teamService.getInviteCode(userId, teamId);
      res.status(200).json(invite);
    } catch (error) {
      next(error);
    }
  },

  // NEW
  join: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedBody = joinTeamSchema.parse(req.body);
      const userId = req.user!.userId;
      const result = await teamService.joinTeamByCode(userId, parsedBody.code);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};
