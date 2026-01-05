import { Router } from "express";
import { taskController } from "../controllers/task.controller";
import { listController } from "../controllers/list.controller"; // Import
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

// List Operations
router.patch("/:listId", listController.update); // Update Title
router.patch("/:listId/move", listController.move); // Move/Reorder

// Task Operations inside Lists
router.post("/:listId/tasks", taskController.create);

export default router;
