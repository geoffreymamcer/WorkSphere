import { Router } from "express";
import { teamController } from "../controllers/team.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.post("/", teamController.create);
router.get("/", teamController.getAll);
router.post("/join", teamController.join);

router.get("/:teamId", teamController.getOne);
router.get("/:teamId/boards", teamController.getBoards);
router.get("/:teamId/members", teamController.getMembers);

router.post("/:teamId/invite-code", teamController.generateInvite);
router.get("/:teamId/invite-code", teamController.getInvite);

export default router;
