import express from "express";
import { registerGym, getMyGym } from "../controllers/gym.controller";
import { protect } from "../middleware/protect";
import { authorize } from "../middleware/authorize";

const router = express.Router();

// Register gym (Owner + Gym)
router.post("/register", registerGym);

// Protected routes (Owner / Admin)
router.get("/my-gym", protect, authorize("GYM_OWNER", "SUPER_ADMIN"), getMyGym);

export default router;
