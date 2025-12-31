import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";
import { signupSchema, loginSchema } from "../validators/auth.schema";

export const authController = {
  signup: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedBody = signupSchema.parse(req.body);
      const result = await authService.signup(parsedBody);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1. Validate Input
      const parsedBody = loginSchema.parse(req.body);

      // 2. Call Service
      const result = await authService.login(parsedBody);

      // 3. Send Response
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
  getMe: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // req.user is populated by the authenticate middleware
      const userId = req.user!.userId;
      const user = await authService.getMe(userId);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },
};
