import { Request, Response } from "express";
import Member from "../models/Member";
import { Attendance } from "../models/Attendance";
import { request } from "http";

/**
 * CREATE MEMBER
 */
export const createMember = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, gender, dob, emergencyContact, user, plan } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ message: "Name, email and phone are required" });
    }
 
    if (!plan) {
      return res.status(400).json({ message: "Plan is required" });
    }

    // Optional: normalize email even more
    const normalizedEmail = email.toLowerCase().trim();

    const member = await Member.create({
      name,
      email: normalizedEmail,
      phone,
      gender,
      dob,
      emergencyContact,
      user,
      plan,
    });

    return res.status(201).json(member);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Member with this email already exists",
        field: "email",
      });
    }

    console.error("Create member error:", error);
    return res.status(500).json({ message: "Failed to create member" });
  }
};

/**
 * GET ALL MEMBERS
 */
export const getMembers = async (req: Request, res: Response) => {
  try {
    const members = await Member.find().populate("user", "name email role");
    const today = new Date().toISOString().split("T")[0];

    // Check attendance for today
    const attendanceRecords = await Attendance.find({ 
        date: today, 
        VisitorType: "MEMBER" 
    });
    
    // Member attendance uses Member._id as the ID in the 'user' field
    const presentMemberIds = attendanceRecords.map(a => a.user?.toString());

    const data = members.map(m => {
        const memberObj = m.toObject();
        return {
            ...memberObj,
            attendanceToday: presentMemberIds.includes(m._id.toString())
        };
    });

    res.json(data);
  } catch (error) {
    console.error("Fetch members with attendance error:", error);
    res.status(500).json({ message: "Failed to fetch members" });
  }
};


/**
 * GET MEMBER BY ID
 */
export const getMemberById = async (req: Request, res: Response) => {
  const member = await Member.findById(req.params.id).populate(
    "user",
    "name email role"
  );

  if (!member) {
    return res.status(404).json({ message: "Member not found" });
  }

  res.json(member);
};

/**
 * UPDATE MEMBER
 */
export const updateMember = async (req: Request, res: Response) => {
  const member = await Member.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(member);
};

export const deleteMember = async (req: Request, res: Response) => {
  const member = await Member.findById(req.params.id);

  if(!member){
    return res.status(404).json({ message : "Member not found" });
  }

  await member.deleteOne();

  res.json({ message: "Member permanently deleted" });
}
