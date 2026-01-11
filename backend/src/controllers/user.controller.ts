import { Request, Response, NextFunction } from "express";
import { userService } from "../services/user.service";
import { updateProfileSchema } from "../validators/user.schema";

export const userController = {
  getMe: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const profile = await userService.getProfile(userId);
      res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  },

  updateMe: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const parsedBody = updateProfileSchema.parse(req.body);
      const updatedUser = await userService.updateProfile(userId, parsedBody);

      // Return sanitized user
      res.status(200).json({
        id: updatedUser.id,
        name: updatedUser.name,
        jobTitle: updatedUser.jobTitle,
        avatarUrl: updatedUser.avatarUrl,
      });
    } catch (error) {
      next(error);
    }
  },

  // Simplified Avatar Upload (Expects a URL or base64 in body for this demo)
  // In a real app, use 'multer' middleware to handle multipart/form-data
  uploadAvatar: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      // For demo purposes, we accept a URL directly.
      // Real impl requires S3 upload logic here.
      const { avatarUrl } = req.body;

      const updatedUser = await userService.updateAvatar(userId, avatarUrl);
      res.status(200).json({ avatarUrl: updatedUser.avatarUrl });
    } catch (error) {
      next(error);
    }
  },
};
