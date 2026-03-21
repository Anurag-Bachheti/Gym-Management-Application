import express from "express";
import Member from "../models/Member";
import User from "../models/User";
import { Attendance } from "../models/Attendance";

/**
 * CREATE MEMBER
 */
export const createMember = async (req: any, res: any) => {
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
export const getMembers = async (req: any, res: any) => {
  try {
    const members = await Member.find().populate("user", "name email role").populate("plan", "name");
    const today = new Date().toISOString().split("T")[0];

    // Check attendance for today
    const attendanceRecords = await Attendance.find({ 
        date: today, 
        VisitorType: "MEMBER" 
    });
    
    // Member attendance uses Member._id as the ID in the 'user' field
    const presentMemberIds = attendanceRecords.map(a => a.user?.toString());

    // Get total attendance counts for all members
    const attendanceCounts = await Attendance.aggregate([
        { $match: { VisitorType: "MEMBER" } },
        { $group: { _id: "$user", count: { $sum: 1 } } }
    ]);

    const countMap: any = {};
    attendanceCounts.forEach(item => {
        countMap[item._id?.toString()] = item.count;
    });

    const data = members.map(m => {
        const memberObj = m.toObject();
        const memberId = m._id.toString();
        return {
            ...memberObj,
            // If plan is populated, we can show its name
            planName: (memberObj.plan as any)?.name || memberObj.plan, 
            attendanceToday: presentMemberIds.includes(memberId),
            totalAttendance: countMap[memberId] || 0
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
export const getMemberById = async (req: any, res: any) => {
  const member = await Member.findById(req.params.id)
    .populate("user", "name email role")
    .populate("plan", "name");

  if (!member) {
    return res.status(404).json({ message: "Member not found" });
  }

  const attendanceCount = await Attendance.countDocuments({
    user: member._id,
    VisitorType: "MEMBER"
  });

  const memberObj = member.toObject();
  res.json({
    ...memberObj,
    totalAttendance: attendanceCount
  });
};

/**
 * UPDATE MEMBER
 */
export const updateMember = async (req: any, res: any) => {
  try {
    const { name, email, phone, gender, dob, emergencyContact, plan } = req.body;
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    if (name) member.name = name;
    if (email) member.email = email;
    if (phone) member.phone = phone;
    if (gender) member.gender = gender;
    if (dob) member.dob = dob;
    if (emergencyContact) member.emergencyContact = emergencyContact;
    if (plan) member.plan = plan;

    await member.save();

    // If there's an associated user, update its name and email
    if (member.user) {
        const user = await User.findById(member.user);
        if (user) {
            if (name) user.name = name;
            if (email) user.email = email;
            await user.save();
        }
    }

    res.json(member);
  } catch (error: any) {
    console.error("Update member error:", error);
    res.status(500).json({ message: "Failed to update member" });
  }
};

export const deleteMember = async (req: any, res: any) => {
  const member = await Member.findById(req.params.id);

  if(!member){
    return res.status(404).json({ message : "Member not found" });
  }

  await member.deleteOne();

  res.json({ message: "Member permanently deleted" });
}
