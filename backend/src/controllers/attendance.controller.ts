import { Request, Response } from "express";
import { Attendance } from "../models/Attendance";
import User from "../models/User";

export const markMemberAttendance = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;

        const today = new Date().toISOString().split("T")[0];

        const existing = await Attendance.findOne({
            user: userId,
            date: today,
        });

        if (existing) {
            return res.status(400).json({
                message: "Already checked in today",
            });
        }

        const attendance = await Attendance.create({
            user: userId,
            VisitorType: "MEMBER",
            checkInTime: today,
        });

        res.json({ success: true, data: attendance });
    } catch (err) {
        res.status(500).json({ message: "Error marking attendance" });
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
            checkInTime: today,
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

export const getMembers = async (req: Request, res: Response) => {
    try {
        const users = await User.find({ role: "MEMBER" }).populate("plan");

        res.json({ success: true, data: users });
    } catch (err) {
        res.status(500).json({ message: "Error fetching members" });
    }
};