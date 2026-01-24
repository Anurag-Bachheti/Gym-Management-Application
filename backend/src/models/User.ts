import mongoose from "mongoose";

export type UserRole =
    | "SUPER_ADMIN"
    | "GYM_MANAGER"
    | "TRAINER"
    | "RECEPTIONIST"
    | "MEMBER";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },

        password: {
            type: String,
            required: true,
            select: false,
        },

        role: {
            type: String,
            enum: [
                "SUPER_ADMIN",
                "GYM_MANAGER",
                "TRAINER",
                "RECEPTIONIST",
                "MEMBER",
            ],
            required: true,
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        lastLogin: Date,
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);
