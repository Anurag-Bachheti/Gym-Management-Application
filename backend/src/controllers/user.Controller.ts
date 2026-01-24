import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";

/**
 * CREATE USER (staff / member login)
 * SUPER_ADMIN, GYM_MANAGER
 */
export const createUser = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields required" });
  }

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(409).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  res.status(201).json({
    message: "User created",
    user: {
      id: user._id,
      name: user.name,
      role: user.role,
      email: user.email,
    },
  });
};

/**
 * GET USERS
 * SUPER_ADMIN, GYM_MANAGER
 */
export const getUsers = async (req: Request, res: Response) => {
  const { role } = req.query;

  const filter: any = {};
  if (role) filter.role = role;

  const users = await User.find(filter).select("-password");

  res.json(users);
};

/**
 * GET USER BY ID
 */
export const getUserById = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
};

/**
 * SOFT DELETE USER
 */
export const deactivateUser = async (req: Request, res: Response) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  res.json({ message: "User deactivated" });
};
