import { Request, Response, NextFunction } from "express";
import { inviteService } from "../services/invite.service";
import { createInviteSchema } from "../validators/invite.schema";

export const inviteController = {
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedBody = createInviteSchema.parse(req.body);
      const userId = req.user!.userId;
      const { boardId } = req.params;

      const invite = await inviteService.createInvite(
        userId,
        boardId,
        parsedBody.email
      );
      // In real app, send email here using `invite.token`
      res.status(201).json({ message: "Invite created", token: invite.token });
    } catch (error) {
      next(error);
    }
  },

  accept: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const { token } = req.params;

      const result = await inviteService.acceptInvite(userId, token);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};
