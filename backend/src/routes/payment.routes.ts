import { Router } from "express";
import { createCheckoutSession, verifyPayment, cancelSubscription } from "../controllers/payment.controller";
import { protect } from "../middleware/protect";
import { authorize } from "../middleware/authorize";

const router = Router();

router.use(protect);

router.post("/create-checkout-session", authorize("MEMBER"), createCheckoutSession);
router.post("/verify", authorize("MEMBER"), verifyPayment);
router.post("/cancel-subscription", authorize("MEMBER"), cancelSubscription);

export default router;
