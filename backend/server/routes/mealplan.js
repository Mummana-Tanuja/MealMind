import express from "express";
import MealPlan from "../models/MealPlan.js";
import Profile from "../models/Profile.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

const TEMPLATES = {
  Vegetarian: [
    { name: "Poha",           calories: 250, protein: 6,  carbs: 45, fat: 5,  fibre: 3, description: "Light flattened rice with peanuts and spices" },
    { name: "Upma",           calories: 220, protein: 5,  carbs: 40, fat: 4,  fibre: 3, description: "Semolina cooked with vegetables" },
    { name: "Idli Sambar",    calories: 280, protein: 8,  carbs: 50, fat: 4,  fibre: 4, description: "Steamed rice cakes with lentil soup" },
    { name: "Besan Chilla",   calories: 200, protein: 10, carbs: 30, fat: 5,  fibre: 4, description: "Protein-rich chickpea flour pancake" },
    { name: "Oats Porridge",  calories: 180, protein: 7,  carbs: 32, fat: 4,  fibre: 5, description: "Creamy oats with fruits and nuts" },
    { name: "Paneer Paratha", calories: 320, protein: 12, carbs: 45, fat: 10, fibre: 3, description: "Whole wheat flatbread stuffed with cottage cheese" },
    { name: "Dal Khichdi",    calories: 320, protein: 12, carbs: 55, fat: 5,  fibre: 5, description: "Comforting rice and lentil one-pot meal" },
    { name: "Aloo Sabzi",     calories: 230, protein: 5,  carbs: 40, fat: 6,  fibre: 4, description: "Spiced potato curry with roti" },
    { name: "Rajma Rice",     calories: 380, protein: 14, carbs: 65, fat: 6,  fibre: 9, description: "Kidney bean curry over steamed rice" },
    { name: "Palak Paneer",   calories: 290, protein: 14, carbs: 20, fat: 14, fibre: 5, description: "Creamy spinach with cottage cheese" },
    { name: "Chole Bhature",  calories: 450, protein: 14, carbs: 70, fat: 15, fibre: 8, description: "Spiced chickpeas with fried bread" },
    { name: "Moong Dal",      calories: 200, protein: 13, carbs: 35, fat: 2,  fibre: 7, description: "Light and digestible green lentil soup" },
  ],
  "Non-Vegetarian": [
    { name: "Egg Omelette",      calories: 220, protein: 14, carbs: 5,  fat: 15, fibre: 1, description: "Fluffy eggs with vegetables and herbs" },
    { name: "Chicken Sandwich",  calories: 350, protein: 25, carbs: 40, fat: 8,  fibre: 3, description: "Grilled chicken in whole wheat bread" },
    { name: "Boiled Eggs Toast", calories: 200, protein: 14, carbs: 22, fat: 7,  fibre: 2, description: "Protein-packed breakfast staple" },
    { name: "Chicken Rice Bowl", calories: 450, protein: 35, carbs: 50, fat: 10, fibre: 3, description: "Grilled chicken over steamed brown rice" },
    { name: "Fish Curry",        calories: 380, protein: 30, carbs: 25, fat: 12, fibre: 2, description: "Coastal-style fish in aromatic spices" },
    { name: "Grilled Chicken",   calories: 300, protein: 40, carbs: 5,  fat: 8,  fibre: 1, description: "Herb-marinated grilled chicken breast" },
    { name: "Egg Bhurji",        calories: 200, protein: 15, carbs: 6,  fat: 12, fibre: 1, description: "Scrambled spiced eggs with onions and tomatoes" },
    { name: "Mutton Curry",      calories: 420, protein: 32, carbs: 15, fat: 22, fibre: 2, description: "Slow-cooked mutton in rich gravy" },
    { name: "Prawn Masala",      calories: 280, protein: 28, carbs: 12, fat: 10, fibre: 2, description: "Tangy spiced prawns with roti" },
    { name: "Chicken Biryani",   calories: 500, protein: 30, carbs: 60, fat: 14, fibre: 3, description: "Fragrant basmati rice with tender chicken" },
    { name: "Keema Paratha",     calories: 380, protein: 22, carbs: 42, fat: 14, fibre: 3, description: "Minced meat stuffed in whole wheat flatbread" },
    { name: "Egg Curry",         calories: 260, protein: 16, carbs: 18, fat: 12, fibre: 3, description: "Boiled eggs in onion-tomato gravy" },
  ],
  Vegan: [
    { name: "Fruit Bowl",       calories: 150, protein: 2,  carbs: 35, fat: 1,  fibre: 5,  description: "Seasonal fruits with seeds and nuts" },
    { name: "Tofu Scramble",    calories: 200, protein: 15, carbs: 8,  fat: 10, fibre: 3,  description: "Turmeric-spiced tofu with vegetables" },
    { name: "Smoothie Bowl",    calories: 250, protein: 5,  carbs: 45, fat: 5,  fibre: 6,  description: "Blended berries topped with granola" },
    { name: "Chickpea Curry",   calories: 350, protein: 15, carbs: 50, fat: 7,  fibre: 10, description: "Rich chickpea stew with coconut milk" },
    { name: "Veggie Wrap",      calories: 280, protein: 8,  carbs: 45, fat: 6,  fibre: 6,  description: "Roasted vegetables in a whole wheat wrap" },
    { name: "Lentil Soup",      calories: 200, protein: 12, carbs: 35, fat: 2,  fibre: 8,  description: "Warming red lentil soup with cumin" },
    { name: "Buddha Bowl",      calories: 400, protein: 16, carbs: 55, fat: 10, fibre: 9,  description: "Grains, roasted veggies, chickpeas and tahini" },
    { name: "Avocado Toast",    calories: 280, protein: 7,  carbs: 30, fat: 14, fibre: 8,  description: "Whole grain toast with avocado and seeds" },
    { name: "Peanut Noodles",   calories: 380, protein: 12, carbs: 55, fat: 12, fibre: 5,  description: "Noodles tossed in spiced peanut sauce" },
    { name: "Black Bean Tacos", calories: 320, protein: 14, carbs: 50, fat: 6,  fibre: 10, description: "Seasoned black beans in corn tortillas" },
    { name: "Veg Biryani",      calories: 360, protein: 9,  carbs: 65, fat: 8,  fibre: 6,  description: "Fragrant basmati rice with spiced vegetables" },
    { name: "Dal Tadka",        calories: 240, protein: 14, carbs: 38, fat: 4,  fibre: 8,  description: "Yellow lentils tempered with garlic and cumin" },
  ],
};

const SNACKS = [
  { name: "Apple",          calories: 95,  protein: 0, carbs: 25, fat: 0,  fibre: 4, description: "Fresh seasonal apple" },
  { name: "Banana",         calories: 105, protein: 1, carbs: 27, fat: 0,  fibre: 3, description: "Energy-boosting banana" },
  { name: "Mixed Nuts",     calories: 180, protein: 5, carbs: 8,  fat: 16, fibre: 2, description: "Almonds, walnuts and cashews" },
  { name: "Yogurt",         calories: 150, protein: 8, carbs: 20, fat: 4,  fibre: 0, description: "Probiotic-rich plain yogurt" },
  { name: "Roasted Chana",  calories: 120, protein: 8, carbs: 18, fat: 2,  fibre: 5, description: "Crunchy spiced roasted chickpeas" },
  { name: "Rice Cakes",     calories: 80,  protein: 2, carbs: 18, fat: 0,  fibre: 1, description: "Light whole grain rice cakes" },
  { name: "Hummus & Veg",   calories: 140, protein: 5, carbs: 16, fat: 6,  fibre: 5, description: "Creamy hummus with carrot and cucumber" },
  { name: "Dark Chocolate", calories: 170, protein: 2, carbs: 20, fat: 10, fibre: 3, description: "2–3 squares of 70%+ dark chocolate" },
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function pickUnique(arr, count) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, arr.length));
}

// POST /api/mealplan/generate/:userId
router.post("/generate/:userId", requireAuth, async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId });
    const diet = profile?.dietPreference || "Vegetarian";
    const meals = TEMPLATES[diet] || TEMPLATES.Vegetarian;

    const weekPlan = DAYS.map((day) => {
      // Pick 3 unique meals for breakfast/lunch/dinner, plus a random snack
      const [breakfast, lunch, dinner] = pickUnique(meals, 3);
      const snack = SNACKS[Math.floor(Math.random() * SNACKS.length)];
      return { day, breakfast, lunch, dinner, snack };
    });

    const mealPlan = await MealPlan.findOneAndUpdate(
      { userId: req.params.userId },
      { userId: req.params.userId, weekPlan, generatedAt: new Date() },
      { new: true, upsert: true }
    );
    res.json(mealPlan);
  } catch (err) {
    next(err);
  }
});

// GET /api/mealplan/:userId
router.get("/:userId", requireAuth, async (req, res, next) => {
  try {
    const mealPlan = await MealPlan.findOne({ userId: req.params.userId });
    if (!mealPlan) {
      return res.status(404).json({ error: "No meal plan found. Please generate one." });
    }
    res.json(mealPlan);
  } catch (err) {
    next(err);
  }
});

export default router;
