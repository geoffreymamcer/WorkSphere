import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/me", userController.getMe);
router.put("/me", userController.updateMe);
router.post("/me/avatar", userController.uploadAvatar);

export default router;
