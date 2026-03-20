import express from "express";
import {
    markMemberAttendance,
    createWalkIn,
    getWalkIns,
} from "../controllers/attendance.controller";

import { isReceptionist } from "../middleware/authorize";

const router = express.Router();

// Member attendance
router.post("/member", isReceptionist, markMemberAttendance);

// Walk-in
router.post("/walkin", isReceptionist, createWalkIn);
router.get("/walkin", isReceptionist, getWalkIns);

export default router;