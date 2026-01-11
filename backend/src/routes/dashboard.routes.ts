import { Router } from "express";
import { dashboardController } from "../controllers/dashboard.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/stats", dashboardController.getStats);
router.get("/active-boards", dashboardController.getActiveBoards);
router.get("/recent-activity", dashboardController.getRecentActivity);

export default router;
