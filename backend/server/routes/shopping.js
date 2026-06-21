import express from "express";
import ShoppingList from "../models/ShoppingList.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

const DEFAULT_ITEMS = [
  { name: "Milk",    quantity: "1",   unit: "L",     category: "Dairy",      checked: false, estimatedCost: 60 },
  { name: "Eggs",    quantity: "12",  unit: "pcs",   category: "Protein",    checked: false, estimatedCost: 90 },
  { name: "Rice",    quantity: "1",   unit: "kg",    category: "Grains",     checked: false, estimatedCost: 80 },
  { name: "Dal",     quantity: "500", unit: "g",     category: "Protein",    checked: false, estimatedCost: 70 },
  { name: "Spinach", quantity: "1",   unit: "bunch", category: "Vegetables", checked: false, estimatedCost: 30 },
];

// GET /api/shopping/:userId
router.get("/:userId", requireAuth, async (req, res, next) => {
  try {
    let list = await ShoppingList.findOne({ userId: req.params.userId });
    if (!list) {
      list = await ShoppingList.create({ userId: req.params.userId, items: DEFAULT_ITEMS });
    }
    res.json(list);
  } catch (err) {
    next(err);
  }
});

// PUT /api/shopping/:userId
router.put("/:userId", requireAuth, async (req, res, next) => {
  try {
    const list = await ShoppingList.findOneAndUpdate(
      { userId: req.params.userId },
      { userId: req.params.userId, items: req.body.items },
      { new: true, upsert: true }
    );
    res.json(list);
  } catch (err) {
    next(err);
  }
});

export default router;
