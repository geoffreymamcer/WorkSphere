import { Router } from "express";
import { inviteController } from "../controllers/invite.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.post("/:token/accept", inviteController.accept);

export default router;
