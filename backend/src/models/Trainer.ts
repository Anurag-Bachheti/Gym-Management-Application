import mongoose from "mongoose";

const trainerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    specialization: [String],
    experience: Number,
});

export default mongoose.model("Trainer", trainerSchema);
