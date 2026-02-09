import { Router } from "express";
import * as AuthController from "../controllers/auth.controller";
import { protect } from "../middleware/protect";

const router = Router();

router.post("/login", AuthController.login);
router.post("/signup", AuthController.signup);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);
router.get("/me", protect, AuthController.getMe);

export default router;