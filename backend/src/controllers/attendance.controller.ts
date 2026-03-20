import { Request, Response } from "express";
import { Attendance } from "../models/Attendance";
import User from "../models/User";
import Member from "../models/Member";

export const markMemberAttendance = async (req: any, res: Response) => {
    try {
        const userId = req.body?.userId;

        // If the logged-in user is a MEMBER, they can only mark their OWN attendance
        // If they are staff (Staff check done at route level), they can mark for others via userId
        let targetUserId = userId;

        if (req.user.role === "MEMBER") {
            const memberProfile = await Member.findOne({ user: req.user._id });
            if (!memberProfile) {
                return res.status(404).json({
                    message: "Member profile not found. Please contact administration.",
                });
            }
            targetUserId = memberProfile._id;
        }

        if (!targetUserId) {
            return res.status(400).json({
                message: "Target User (Member) ID is required",
            });
        }

        const today = new Date().toISOString().split("T")[0];

        const existing = await Attendance.findOne({
            user: targetUserId,
            date: today,
        });

        if (existing) {
            return res.status(400).json({
                message: "Already checked in today",
            });
        }

        const attendance = await Attendance.create({
            user: targetUserId,
            VisitorType: "MEMBER",
            checkInTime: new Date(),
            date: today,
        });

        res.json({ success: true, data: attendance });
    } catch (err: any) {
        console.error("Attendance Error:", err);
        res.status(500).json({ message: err.message || "Error marking attendance" });
    }
};

export const createWalkIn = async (req: Request, res: Response) => {
    try {
        const { name, phone, amount } = req.body;

        const today = new Date().toISOString().split("T")[0];

        const walkin = await Attendance.create({
            name,
            phone,
            amount,
            VisitorType: "WALK_IN",
            checkInTime: new Date(),
            date: today,
        });

        res.json({ success: true, data: walkin });
    } catch (err) {
        res.status(500).json({ message: "Error creating walk-in" });
    }
};

export const getWalkIns = async (req: Request, res: Response) => {
    try {
        const data = await Attendance.find({
            VisitorType: "WALK_IN",
        }).sort({ createdAt: -1 });

        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ message: "Error fetching walk-ins" });
    }
};

export const deleteMemberAttendance = async (req: Request, res: Response) => {
    try {
        const userId = req.body?.userId;
        const today = new Date().toISOString().split("T")[0];

        const deleted = await Attendance.findOneAndDelete({
            user: userId,
            date: today,
            VisitorType: "MEMBER",
        });

        if (!deleted) {
            return res.status(404).json({ message: "No attendance record found for today" });
        }

        res.json({ success: true, message: "Attendance removed" });
    } catch (err) {
        res.status(500).json({ message: "Error undoing attendance" });
    }
};

export const getMembers = async (req: Request, res: Response) => {
    try {
        const users = await User.find({ role: "MEMBER" }).populate("plan");
        const today = new Date().toISOString().split("T")[0];

        // Check who is present today
        const attendanceRecords = await Attendance.find({
            date: today,
            VisitorType: "MEMBER"
        });

        const presentUserIds = attendanceRecords.map(a => a.user?.toString());

        const data = users.map(u => {
            const userObj = u.toObject();
            return {
                ...userObj,
                attendanceToday: presentUserIds.includes(u._id.toString())
            };
        });

        res.json({ success: true, data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching members" });
    }
};