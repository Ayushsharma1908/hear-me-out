import express from "express";
import passport from "../passport.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// Helper function to generate default avatar URL based on name
const generateDefaultAvatar = (name) => {
  // Get initials from name
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Use UI Avatars service to generate avatar
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    initials
  )}&background=000000&color=ffffff&size=128&bold=true`;
};

const FRONTEND_URL =
  process.env.NODE_ENV === "production"
    ? "https://hear-me-out-red.vercel.app"
    : "http://localhost:5173";

// Redirect user to Google for login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: `${FRONTEND_URL}/login` }),
  (req, res) => {
    // Successful login
    res.redirect(`${FRONTEND_URL}/home`); // redirect to frontend
  }
);

// Signup with email/password
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate default avatar for email/password users
    const defaultAvatar = generateDefaultAvatar(name);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      avatar: defaultAvatar, // Set default avatar
    });

    // Remove password from response
    const userObj = user.toObject();
    delete userObj.password;

    // Log user in (create session)
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ message: "Error creating session" });
      }
      res
        .status(201)
        .json({ user: userObj, message: "User created successfully" });
    });
  } catch (err) {
    console.error("Signup error:", err);
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }
    res.status(500).json({ message: "Server error during signup" });
  }
});

// Login with email/password
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if user has a password (might be Google OAuth only user)
    if (!user.password) {
      return res
        .status(401)
        .json({ message: "Please sign in with Google for this account" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Remove password from user object
    const userObj = user.toObject();
    delete userObj.password;

    // Log user in (create session)
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ message: "Error creating session" });
      }
      res.json({ user: userObj, message: "Login successful" });
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

// Get current user
router.get("/me", (req, res) => {
  if (req.user) {
    const userObj = req.user.toObject ? req.user.toObject() : req.user;
    delete userObj.password;
    res.json({ user: userObj });
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

// Logout
router.post("/logout", (req, res) => {
  const cookieName = process.env.NODE_ENV === "production" ? "__Secure-connect.sid" : "connect.sid";

  req.logout(() => {
    req.session.destroy(() => {
      res.clearCookie(cookieName, {
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });
      res.json({ message: "Logged out successfully" });
    });
  });
});



export default router;
