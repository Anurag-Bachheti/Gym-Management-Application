import express from 'express';
import { createPlan, getPlans } from '../controllers/plan.Controller';
import { authorize } from '../middleware/authorize';
import { protect } from '../middleware/protect';

const router = express.Router();

// Create a new plan (Only Super Admin)
router.post('/', protect, authorize('SUPER_ADMIN'), createPlan);

// Get all plans (Accessible by Admin, Manager, and Receptionist)
router.get('/', protect, authorize('SUPER_ADMIN', 'GYM_MANAGER', 'RECEPTIONIST'), getPlans);

export default router;