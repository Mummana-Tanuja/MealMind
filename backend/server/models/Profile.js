import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    fullName: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    age: { type: Number },
    gender: { type: String, default: "" },
    height: { type: Number },
    weight: { type: Number },
    targetWeight: { type: Number },
    goal: { type: String, default: "" },
    activityLevel: { type: String, default: "" },
    dietPreference: { type: String, default: "" },
    waterGoal: { type: Number, default: 2 },
    budget: { type: Number },
    mealFrequency: { type: String, default: "3" },
    allergies: [{ type: String }],
    deficiencies: [{ type: String }],
    foodDislikes: { type: String, default: "" },
    otherAllergy: { type: String, default: "" },
    otherDeficiency: { type: String, default: "" },
    profileImage: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);
