import { Router } from "express";
import { taskController } from "../controllers/task.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

// Create task inside a list
router.post("/:listId/tasks", taskController.create);

export default router;
