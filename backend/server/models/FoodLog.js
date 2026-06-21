import mongoose from "mongoose";

const foodLogSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    date: { type: String, required: true },
    mealType: { type: String, enum: ["breakfast", "lunch", "dinner", "snack"], default: "snack" },
    name: { type: String, required: true },
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    fibre: { type: Number, default: 0 },
    quantity: { type: Number, default: 1 },
    unit: { type: String, default: "serving" },
  },
  { timestamps: true }
);

export default mongoose.model("FoodLog", foodLogSchema);
