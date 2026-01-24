import { Router } from "express";
import {
  createUser,
  getUsers,
  getUserById,
  deactivateUser,
} from "../controllers/user.Controller";
import { protect } from "../middleware/protect";
import { authorize } from "../middleware/authorize";

const router = Router();

router.use(protect);

router.post("/", authorize("SUPER_ADMIN", "GYM_MANAGER"), createUser);
router.get("/", authorize("SUPER_ADMIN", "GYM_MANAGER"), getUsers);
router.get("/:id", authorize("SUPER_ADMIN"), getUserById);
router.delete("/:id", authorize("SUPER_ADMIN"), deactivateUser);

export default router;