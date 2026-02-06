import { Router } from "express";
import { login, signup, getMe } from "../controllers/auth.controller";
import { protect } from "../middleware/protect";

const router = Router();

router.post("/login", login);
router.post("/signup", signup);
router.get("/me", protect, getMe);

export default router;