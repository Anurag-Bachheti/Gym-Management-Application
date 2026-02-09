import { Request, Response } from "express";
import * as AuthService from "../auth/auth.service";
import User from "../models/User";
import * as EmailService from "../services/email.service";
import bcrypt from "bcryptjs";

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const result = await AuthService.login(email, password);

        res.json({
            success: true,
            ...result,
        });
    } catch (error: any) {
        console.error("Login Error:", error.message);
        res.status(401).json({
            success: false,
            message: error.message || "Invalid credentials",
        });
    }
};

export const signup = async (req: Request, res: Response) => {
    const { name, email, password, plan } = req.body;

    const result = await AuthService.signup({ name, email, password, plan });

    res.status(201).json({
        success: true,
        message: "Signup successful",
        user: result,
    });
};

export const getMe = async (req: any, res: Response) => {
    try {
        const user = await AuthService.getUserById(req.user._id);
        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error: any) {
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await EmailService.sendOTP(email, otp);

    res.json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
    const { email, otp, password } = req.body;

    const user = await User.findOne({
        email,
        resetPasswordOTP: otp,
        resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
        return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // Update password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    user.mustChangePassword = false;
    await user.save();

    res.json({ success: true, message: "Password reset successful" });
};
