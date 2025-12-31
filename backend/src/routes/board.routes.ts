import { Router } from "express";
import { boardController } from "../controllers/board.controller";
import { listController } from "../controllers/list.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.post("/", boardController.create);
router.get("/:id", boardController.getOne);
router.get("/", boardController.getAll);

router.post("/:boardId/lists", listController.create);

export default router;
