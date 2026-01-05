import { Router } from "express";
import { boardController } from "../controllers/board.controller";
import { listController } from "../controllers/list.controller";
import { inviteController } from "../controllers/invite.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.post("/", boardController.create);
router.get("/", boardController.getAll);
router.get("/:id", boardController.getOne);

router.get("/:boardId/members", boardController.getMembers);

router.post("/:boardId/lists", listController.create);
router.post("/:boardId/invite", inviteController.create);

export default router;
