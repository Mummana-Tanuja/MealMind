import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { JWT_SECRET } from "../middleware/auth.js";

const router = express.Router();

function issueToken(user) {
  return jwt.sign(
    { userId: user._id.toString(), email: user.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// POST /api/auth/register
router.post("/register", async (req, res, next) => {
  try {
    const { email, password, displayName } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters." });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) return res.status(409).json({ error: "Email already registered." });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: email.toLowerCase().trim(),
      password: hashed,
      displayName: displayName?.trim() || email.split("@")[0],
    });

    const token = issueToken(user);
    res.status(201).json({
      token,
      userId: user._id,
      email: user.email,
      displayName: user.displayName,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(404).json({ error: "No account found with this email." });

    // Try bcrypt first, fall back to plain-text comparison for legacy accounts
    let valid = await bcrypt.compare(password, user.password).catch(() => false);
    if (!valid && user.password === password) {
      // Legacy plain-text — upgrade to bcrypt
      valid = true;
      user.password = await bcrypt.hash(password, 10);
      await user.save();
    }

    if (!valid) return res.status(401).json({ error: "Incorrect password." });

    const token = issueToken(user);
    res.json({
      token,
      userId: user._id,
      email: user.email,
      displayName: user.displayName,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
