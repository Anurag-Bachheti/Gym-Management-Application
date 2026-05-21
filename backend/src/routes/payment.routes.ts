import { Router } from "express";
import { createCheckoutSession, verifyPayment } from "../controllers/payment.controller";
import { protect } from "../middleware/protect";
import { authorize } from "../middleware/authorize";

const router = Router();

router.use(protect);

router.post("/create-checkout-session", authorize("MEMBER"), createCheckoutSession);
router.post("/verify", authorize("MEMBER"), verifyPayment);

export default router;
