import bcrypt from "bcryptjs";
import User from "../models/User";

export const createSuperAdmin = async () => {
    const exists = await User.findOne({ role: "SUPER_ADMIN" });
    if (exists) return;

    const password = await bcrypt.hash("admin@123", 10);

    await User.create({
        name: "Super Admin",
        email: "admin@gym.com",
        password,
        role: "SUPER_ADMIN",
    });

    console.log("Super admin created");
};
