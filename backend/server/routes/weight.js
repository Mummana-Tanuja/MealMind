import express from "express";
import WeightLog from "../models/WeightLog.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// POST /api/weight/:userId
router.post("/:userId", requireAuth, async (req, res, next) => {
  try {
    const { date, weight, unit } = req.body;
    if (!date || weight == null) {
      return res.status(400).json({ error: "date and weight are required." });
    }

    const log = await WeightLog.findOneAndUpdate(
      { userId: req.params.userId, date },
      { userId: req.params.userId, date, weight, unit: unit || "kg" },
      { new: true, upsert: true }
    );
    res.json(log);
  } catch (err) {
    next(err);
  }
});

// GET /api/weight/:userId
router.get("/:userId", requireAuth, async (req, res, next) => {
  try {
    const logs = await WeightLog
      .find({ userId: req.params.userId })
      .sort({ date: 1 })
      .limit(90);
    res.json(logs);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/weight/:userId/:date
router.delete("/:userId/:date", requireAuth, async (req, res, next) => {
  try {
    const log = await WeightLog.findOneAndDelete({
      userId: req.params.userId,
      date: req.params.date,
    });
    if (!log) return res.status(404).json({ error: "Weight entry not found." });
    res.json({ message: "Weight entry deleted.", date: req.params.date });
  } catch (err) {
    next(err);
  }
});

export default router;
