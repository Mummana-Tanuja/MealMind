import express from "express";
import { RECIPES } from "../data/recipes.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// GET /api/recipes — optional query: category, diet, mood, search
router.get("/", requireAuth, (req, res) => {
  const { category, diet, mood, search } = req.query;
  let results = [...RECIPES];

  if (category)  results = results.filter((r) => r.category === category);
  if (diet)      results = results.filter((r) => r.diet.includes(diet));
  if (mood)      results = results.filter((r) => r.mood.includes(mood));
  if (search)    results = results.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.description.toLowerCase().includes(search.toLowerCase()) ||
    r.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  res.json(results);
});

// GET /api/recipes/:id
router.get("/:id", requireAuth, (req, res) => {
  const recipe = RECIPES.find((r) => r.id === req.params.id);
  if (!recipe) return res.status(404).json({ error: "Recipe not found." });
  res.json(recipe);
});

export default router;
