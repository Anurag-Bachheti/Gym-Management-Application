import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // member may NOT have login
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, lowercase: true, trim: true},
        phone: String,
        gender: String,
        dob: Date,
        emergencyContact: String,
        joinedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);
memberSchema.index({ email: 1 }, { unique: true });

export default mongoose.model("Member", memberSchema);
