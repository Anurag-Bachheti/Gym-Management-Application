import express from "express";
import {
    markMemberAttendance,
    createWalkIn,
    getWalkIns,
} from "../controllers/attendance.controller";

import { isReceptionist } from "../middleware/authorize";
import { protect } from "../middleware/protect";

const router = express.Router();

router.use(protect);

// Member attendance
router.post("/member", isReceptionist, markMemberAttendance);

// Walk-in
router.post("/walkin", isReceptionist, createWalkIn);
router.get("/walkin", isReceptionist, getWalkIns);

export default router;