import mongoose from "mongoose";

const mealItemSchema = new mongoose.Schema({
  name: String,
  calories: Number,
  protein: Number,
  carbs: Number,
  fat: Number,
  fibre: Number,
});

const dayPlanSchema = new mongoose.Schema({
  day: String,
  breakfast: mealItemSchema,
  lunch: mealItemSchema,
  dinner: mealItemSchema,
  snack: mealItemSchema,
});

const mealPlanSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    weekPlan: [dayPlanSchema],
    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("MealPlan", mealPlanSchema);
