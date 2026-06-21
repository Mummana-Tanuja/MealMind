import express from "express";
import FoodLog from "../models/FoodLog.js";
import WaterLog from "../models/WaterLog.js";
import WeightLog from "../models/WeightLog.js";
import Profile from "../models/Profile.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

/**
 * Estimate daily calorie target using Mifflin-St Jeor BMR
 * Activity multiplier: 1.375 (light-moderate activity)
 * Goal adjustment: -300 kcal for weight loss, +300 for muscle gain
 */
function calcCalorieTarget(profile) {
  if (!profile) return 2200;
  const { weight, height, age, gender, goal } = profile;

  if (weight && height && age) {
    const w = Number(weight);
    const h = Number(height);
    const a = Number(age);
    if (w > 0 && h > 0 && a > 0) {
      const bmr =
        gender === "Female"
          ? 10 * w + 6.25 * h - 5 * a - 161
          : 10 * w + 6.25 * h - 5 * a + 5;

      const tdee = Math.round(bmr * 1.375);

      if (goal === "Weight Loss")  return Math.max(tdee - 300, 1200);
      if (goal === "Muscle Gain")  return tdee + 300;
      return tdee; // Maintenance / other
    }
  }

  // Fallback to simple targets
  if (goal === "Weight Loss") return 1800;
  if (goal === "Muscle Gain") return 2800;
  return 2200;
}

// GET /api/analytics/:userId
router.get("/:userId", requireAuth, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const profile = await Profile.findOne({ userId });

    // Last 7 days (today inclusive)
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split("T")[0]);
    }

    const [foodLogs, waterLogs, weightLogs] = await Promise.all([
      FoodLog.find({ userId, date: { $in: dates } }),
      WaterLog.find({ userId, date: { $in: dates } }),
      WeightLog.find({ userId }).sort({ date: 1 }).limit(30),
    ]);

    const caloriesByDay = dates.map((date) => {
      const dayLogs = foodLogs.filter((l) => l.date === date);
      return {
        date,
        calories: dayLogs.reduce((s, l) => s + (l.calories || 0), 0),
        protein:  dayLogs.reduce((s, l) => s + (l.protein  || 0), 0),
        carbs:    dayLogs.reduce((s, l) => s + (l.carbs    || 0), 0),
        fat:      dayLogs.reduce((s, l) => s + (l.fat      || 0), 0),
      };
    });

    const waterByDay = dates.map((date) => {
      const entry = waterLogs.find((l) => l.date === date);
      return { date, glasses: entry?.glasses || 0, goal: entry?.goal || 8 };
    });

    const avgCalories =
      caloriesByDay.reduce((s, d) => s + d.calories, 0) / caloriesByDay.length;

    const calorieTarget = calcCalorieTarget(profile);

    res.json({
      caloriesByDay,
      waterByDay,
      weightHistory: weightLogs,
      summary: {
        avgCalories:    Math.round(avgCalories),
        calorieTarget,
        goal:           profile?.goal           || "Not set",
        dietPreference: profile?.dietPreference  || "Not set",
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
