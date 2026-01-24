import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (email: string, password: string) => {
    const user = await User.findOne({ email }).select("+password");

    if (!user || !user.isActive) {
        throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
    );

    user.lastLogin = new Date();
    await user.save();

    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            role: user.role,
            email: user.email,
        },
    };
};
