import { Router } from "express";
import {
  createMember,
  getMembers,
  getMemberById,
  updateMember,
  deleteMember,
} from "../controllers/member.controller";
import { protect } from "../middleware/protect";
import { authorize } from "../middleware/authorize";

const router = Router();

router.use(protect);

router.post("/", authorize("SUPER_ADMIN", "GYM_MANAGER", "RECEPTIONIST"), createMember);
router.get("/", authorize("SUPER_ADMIN", "GYM_MANAGER", "RECEPTIONIST"), getMembers);
router.get("/:id", authorize("SUPER_ADMIN", "GYM_MANAGER"), getMemberById);
router.put("/:id", authorize("SUPER_ADMIN", "GYM_MANAGER"), updateMember);
router.delete("/:id", authorize("SUPER_ADMIN"), deleteMember);

export default router;
