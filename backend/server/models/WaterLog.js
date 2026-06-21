import mongoose from "mongoose";

const waterLogSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    date: { type: String, required: true },
    glasses: { type: Number, default: 0 },
    goal: { type: Number, default: 8 },
  },
  { timestamps: true }
);

export default mongoose.model("WaterLog", waterLogSchema);
