import { Router } from "express";
import { taskController } from "../controllers/task.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/my", taskController.getMyTasks);
router.patch("/:taskId/move", taskController.move);
router.patch("/:taskId/assign", taskController.assign);
router.patch("/:taskId", taskController.update);

export default router;
