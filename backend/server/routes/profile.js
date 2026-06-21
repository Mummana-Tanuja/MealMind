import express from "express";
import Profile from "../models/Profile.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// GET /api/profile/:userId
router.get("/:userId", requireAuth, async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId });
    if (!profile) return res.status(404).json({ error: "Profile not found." });
    res.json(profile);
  } catch (err) {
    next(err);
  }
});

// PUT /api/profile/:userId
router.put("/:userId", requireAuth, async (req, res, next) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { userId: req.params.userId },
      { ...req.body, userId: req.params.userId },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(profile);
  } catch (err) {
    next(err);
  }
});

export default router;
