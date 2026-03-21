import { Router } from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deactivateUser,
  deleteUser,
} from "../controllers/user.Controller";
import { protect } from "../middleware/protect";
import { authorize } from "../middleware/authorize";

const router = Router();

router.use(protect);

router.post("/", authorize("SUPER_ADMIN", "GYM_MANAGER", "RECEPTIONIST"), createUser);
router.get("/", authorize("SUPER_ADMIN", "GYM_MANAGER", "RECEPTIONIST"), getUsers);
router.get("/:id", authorize("SUPER_ADMIN"), getUserById);
router.put("/:id", authorize("SUPER_ADMIN", "GYM_MANAGER"), updateUser);
router.patch("/:id", authorize("SUPER_ADMIN"), deactivateUser);
router.delete("/:id", authorize("SUPER_ADMIN"), deleteUser);

export default router;