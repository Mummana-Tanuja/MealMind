import express from "express";
import FoodLog from "../models/FoodLog.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// POST /api/food/log
router.post("/log", requireAuth, async (req, res, next) => {
  try {
    const { name, calories, mealType, date } = req.body;
    if (!name || calories == null) {
      return res.status(400).json({ error: "Food name and calories are required." });
    }
    if (!date) {
      return res.status(400).json({ error: "date (YYYY-MM-DD) is required." });
    }

    const log = await FoodLog.create({
      ...req.body,
      userId: req.body.userId || req.user.userId,
    });
    res.status(201).json(log);
  } catch (err) {
    next(err);
  }
});

// GET /api/food/history/:userId?date=YYYY-MM-DD
router.get("/history/:userId", requireAuth, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { date } = req.query;
    const query = { userId };
    if (date) query.date = date;

    const logs = await FoodLog.find(query).sort({ createdAt: 1 });

    const totals = logs.reduce(
      (acc, log) => {
        acc.calories += log.calories || 0;
        acc.protein  += log.protein  || 0;
        acc.carbs    += log.carbs    || 0;
        acc.fat      += log.fat      || 0;
        acc.fibre    += log.fibre    || 0;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0, fibre: 0 }
    );

    res.json({ logs, totals });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/food/log/:logId
router.delete("/log/:logId", requireAuth, async (req, res, next) => {
  try {
    const log = await FoodLog.findByIdAndDelete(req.params.logId);
    if (!log) return res.status(404).json({ error: "Log entry not found." });
    res.json({ message: "Food log deleted.", id: req.params.logId });
  } catch (err) {
    next(err);
  }
});

export default router;
