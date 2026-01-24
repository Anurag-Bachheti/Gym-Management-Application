import { Request, Response } from "express";
import Member from "../models/Member";

/**
 * CREATE MEMBER
 */
export const createMember = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, gender, dob, emergencyContact, user } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ message: "Name, email and phone are required" });
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
  const members = await Member.find().populate("user", "name email role");
  res.json(members);
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
