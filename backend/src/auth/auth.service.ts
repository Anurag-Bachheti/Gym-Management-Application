import User from "../models/User";
import Member from "../models/Member";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (email: string, password: string) => {
    const user = await User.findOne({ email }).select("+password");

    if (!user || user.isActive === false) {
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

export const signup = async (userData: any) => {
    const { name, email, password, plan } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error("User already exists with this email");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "MEMBER",
    });

    // Create Member
    await Member.create({
        user: user._id,
        name,
        email,
        // we can add plan logic here if Member model supported it, 
        // for now just creating the basic member record
    });

    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
};

export const getUserById = async (userId: string) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    return user;
};
