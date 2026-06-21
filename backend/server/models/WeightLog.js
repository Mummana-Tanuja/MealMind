import mongoose from "mongoose";

const weightLogSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    date: { type: String, required: true },
    weight: { type: Number, required: true },
    unit: { type: String, default: "kg" },
  },
  { timestamps: true }
);

export default mongoose.model("WeightLog", weightLogSchema);
