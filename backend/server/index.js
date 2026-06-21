import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRoutes     from "./routes/auth.js";
import profileRoutes  from "./routes/profile.js";
import mealplanRoutes from "./routes/mealplan.js";
import foodRoutes     from "./routes/food.js";
import waterRoutes    from "./routes/water.js";
import weightRoutes   from "./routes/weight.js";
import shoppingRoutes from "./routes/shopping.js";
import analyticsRoutes from "./routes/analytics.js";
import recipesRoutes  from "./routes/recipes.js";

dotenv.config();

const app  = express();
const PORT = process.env.BACKEND_PORT || 8000;
const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("❌ MONGODB_URI is not set. Please add it to your environment secrets.");
  process.exit(1);
}

app.use(cors());
app.use(express.json());

// Request logger
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

app.get("/", (_req, res) => res.json({ status: "MealMind API running" }));

// Public routes (no JWT required)
app.use("/api/auth", authRoutes);

// Protected routes
app.use("/api/profile",   profileRoutes);
app.use("/api/mealplan",  mealplanRoutes);
app.use("/api/food",      foodRoutes);
app.use("/api/water",     waterRoutes);
app.use("/api/weight",    weightRoutes);
app.use("/api/shopping",  shoppingRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/recipes",  recipesRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found." });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error("🔥 Unhandled error:", err.message);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({ error: err.message || "Internal server error." });
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 MealMind API listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
