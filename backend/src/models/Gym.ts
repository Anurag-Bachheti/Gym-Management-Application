import mongoose from "mongoose";

const gymSchema = new mongoose.Schema({
    name: { type: String, required: true },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    country: { type: String },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    website: { type: String },
    startedYear: { type: Number },
    logo: { type: String },
    description: { type: String },
    amenities: { type: [String] },
    membershipPlans: { type: [String] },
    totalEquipment: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    totalRating: { type: Number, default: 0 },
}, { timestamps: true });

export const Gym = mongoose.model("Gym", gymSchema);