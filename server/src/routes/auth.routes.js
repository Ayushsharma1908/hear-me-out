import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// ------------------------
// Helper: Generate JWT
// ------------------------
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email }, // payload
    process.env.JWT_SECRET,
    { expiresIn: "7d" } // token valid for 7 days
  );
};

// ------------------------
// Helper: Default Avatar
// ------------------------
const generateDefaultAvatar = (name) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    initials
  )}&background=000000&color=ffffff&size=128&bold=true`;
};

// ------------------------
// Signup Route
// ------------------------
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const avatar = generateDefaultAvatar(name);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      avatar,
    });

    const token = generateToken(user);

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
      token,
      message: "Signup successful",
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error during signup" });
  }
});

// ------------------------
// Login Route
// ------------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = generateToken(user);

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
      token,
      message: "Login successful",
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

// ------------------------
// Get current user (from JWT)
// ------------------------
import authMiddleware from "../middleware/auth.js"; // your JWT middleware

router.get("/me", authMiddleware, (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
    },
  });
});

export default router;
