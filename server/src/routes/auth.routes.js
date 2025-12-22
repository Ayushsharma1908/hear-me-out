import express from "express";
import passport from "../passport.js";

const router = express.Router();

// Redirect user to Google for login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google callback
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        // Successful login
        res.redirect("http://localhost:5173/home"); // redirect to frontend
    }
);

export default router;
