import { Request, Response } from "express";
import { Gym } from "../models/Gym";
import User from "../models/User";
import Member from "../models/Member";
import bcrypt from "bcryptjs";

/**
 * REGISTER GYM & OWNER
 */
export const registerGym = async (req: Request, res: Response) => {
    try {
        const {
            name,
            email,
            password,
            gymName,
            phone,
            address,
            city,
            state,
            zipCode,
            country
        } = req.body;

        // 1. check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(409).json({ success: false, message: "User with this email already exists" });
        }

        // 2. hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. create user (owner)
        const owner = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "GYM_OWNER",
        });

        // 4. create gym
        const gym = await Gym.create({
            name: gymName || name + "'s Gym",
            owner: owner._id,
            email,
            phone,
            address,
            city,
            state,
            zipCode,
            country
        });

        // 5. Link gym back to owner
        owner.gym = gym._id as any;
        await owner.save();

        res.status(201).json({
            success: true,
            message: "Gym registered successfully",
            owner: {
                id: owner._id,
                name: owner.name,
                email: owner.email,
                role: owner.role
            },
            gym: gym
        });
    } catch (error: any) {
        console.error("Gym Registration Error:", error);
        res.status(500).json({ success: false, message: error.message || "Error registering gym" });
    }
};

/**
 * GET GYM DETAILS
 */
export const getMyGym = async (req: any, res: Response) => {
    try {
        const gym = await Gym.findOne({ owner: req.user._id });
        if (!gym) {
            return res.status(404).json({ success: false, message: "Gym not found" });
        }

        // Count Members belonging to this gym
        const memberCount = await Member.countDocuments({ gym: gym._id });

        // Count Staff (all roles except MEMBER and GYM_OWNER)
        const staffCount = await User.countDocuments({ 
            gym: gym._id, 
            role: { $in: ["GYM_ADMIN", "GYM_MANAGER", "TRAINER", "RECEPTIONIST"] }
        });

        const gymObj = gym.toObject();

        res.json({ 
            success: true, 
            data: {
                ...gymObj,
                totalMembers: memberCount,
                totalStaff: staffCount
            } 
        });
    } catch (error) {
        console.error("Error fetching gym:", error);
        res.status(500).json({ success: false, message: "Error fetching gym" });
    }
};
