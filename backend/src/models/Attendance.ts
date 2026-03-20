import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        // Walk in fields
        name: String,
        phone: String,

        VisitorType: {
            type: String,
            enum: ["Member", "WALK_IN"],
            required: true,
        },

        checkInTime: {
            type: Date,
            default: Date.now,
        },

        amount: Number, // for walk-in payment
        paymentStatus: {
            type: String,
            enum: ["PAID", "UNPAID"],
            default: "PAID",
        },
    },
    { timestamps: true }
);

export const Attendance = mongoose.model("Attendance", attendanceSchema);