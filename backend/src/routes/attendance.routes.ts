import express from "express";
import {
    markMemberAttendance,
    deleteMemberAttendance,
    createWalkIn,
    getWalkIns,
} from "../controllers/attendance.controller";

import { isReceptionist } from "../middleware/authorize";
import { protect } from "../middleware/protect";

const router = express.Router();

router.use(protect);

// Member attendance (Accessible by Admin, Manager, Receptionist, AND Member)
router.post("/member", markMemberAttendance);
router.post("/member/undo", isReceptionist, deleteMemberAttendance);


// Walk-in
router.post("/walkin", isReceptionist, createWalkIn);
router.get("/walkin", isReceptionist, getWalkIns);

export default router;