import mongoose from "mongoose";

export type UserRole =
    | "SUPER_ADMIN"
    | "GYM_OWNER"
    | "GYM_ADMIN"
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
                "GYM_OWNER",
                "GYM_ADMIN",
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

        mustChangePassword: {
            type: Boolean,
            default: false,
        },

        lastLogin: Date,

        resetPasswordOTP: String,
        resetPasswordExpires: Date,
        gym: { type: mongoose.Schema.Types.ObjectId, ref: "Gym", required: false },
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);
