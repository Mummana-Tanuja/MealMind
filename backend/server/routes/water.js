import express from "express";
import WaterLog from "../models/WaterLog.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// POST /api/water/:userId
router.post("/:userId", requireAuth, async (req, res, next) => {
  try {
    const { date, glasses, goal } = req.body;
    if (!date) return res.status(400).json({ error: "date is required." });

    const log = await WaterLog.findOneAndUpdate(
      { userId: req.params.userId, date },
      { userId: req.params.userId, date, glasses: glasses ?? 0, goal: goal ?? 8 },
      { new: true, upsert: true }
    );
    res.json(log);
  } catch (err) {
    next(err);
  }
});

// GET /api/water/:userId?date=YYYY-MM-DD
router.get("/:userId", requireAuth, async (req, res, next) => {
  try {
    const { date } = req.query;
    const query = { userId: req.params.userId };
    if (date) query.date = date;
    const logs = await WaterLog.find(query).sort({ date: -1 }).limit(30);
    res.json(logs);
  } catch (err) {
    next(err);
  }
});

export default router;
