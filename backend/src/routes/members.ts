import { Router } from "express";
import {
  createMember,
  getMembers,
  getMemberById,
  updateMember,
  deleteMember,
  assignTrainer,
  removeTrainer,
} from "../controllers/member.controller";
import { protect } from "../middleware/protect";
import { authorize } from "../middleware/authorize";

const router = Router();

router.use(protect);

// ------------ Member CRUD
router.post("/", authorize("SUPER_ADMIN", "GYM_MANAGER", "RECEPTIONIST"), createMember);
router.get("/", authorize("SUPER_ADMIN", "GYM_MANAGER", "RECEPTIONIST"), getMembers);
router.get("/:id", authorize("SUPER_ADMIN", "GYM_MANAGER", "RECEPTIONIST"), getMemberById);
router.put("/:id", authorize("SUPER_ADMIN", "GYM_MANAGER", "RECEPTIONIST"), updateMember);
router.delete("/:id", authorize("SUPER_ADMIN"), deleteMember);

// -------------------- TRAINER ASSIGNMENT --------------------

// Assign trainer to member
router.patch("/:id/assign-trainer", authorize("SUPER_ADMIN", "GYM_MANAGER", "RECEPTIONIST"), assignTrainer);

// Remove trainer from member
router.patch("/:id/remove-trainer", authorize("SUPER_ADMIN", "GYM_MANAGER", "RECEPTIONIST"), removeTrainer);

export default router;
