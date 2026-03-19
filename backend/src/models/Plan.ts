import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            default: "",
        },
        durationInMonths: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        features: [
            {
                type: String,
            },
        ],
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export const Plan = mongoose.model("Plan", planSchema);