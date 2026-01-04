// app.js - FIXED VERSION
import express from "express";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import passport from "./passport.js";
import chatRoutes from "./routes/chat.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.set("trust proxy", 1);

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://hear-me-out-red.vercel.app",
    ],
    credentials: true,
  })
);


app.use(express.json());

// Session + Passport - FIXED WITH MONGOSTORE
// app.js - session
app.use(
  session({
    name: process.env.NODE_ENV === "production" ? "__Secure-connect.sid" : "connect.sid",
    secret: process.env.SESSION_SECRET || "dev_secret_change_this",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
      ttl: 14 * 24 * 60 * 60,
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 14 * 24 * 60 * 60 * 1000,
      path: "/",
    },
  })
);





app.use(passport.initialize());
app.use(passport.session());

// Debug middleware to see what's happening
app.use((req, res, next) => {
  console.log("🔍 Request Info:");
  console.log("   - URL:", req.originalUrl);
  console.log("   - Session ID:", req.sessionID);
  console.log("   - isAuthenticated:", req.isAuthenticated ? req.isAuthenticated() : false);
  console.log("   - User:", req.user ? { id: req.user._id, email: req.user.email } : "No user");
  next();
});

// Routes
app.use("/api/chat", chatRoutes);
app.use("/auth", authRoutes);

// Debug route
// app.get("/api/debug/auth", (req, res) => {
//   res.json({
//     sessionID: req.sessionID,
//     isAuthenticated: req.isAuthenticated ? req.isAuthenticated() : false,
//     user: req.user ? { 
//       id: req.user._id, 
//       email: req.user.email,
//       name: req.user.name 
//     } : null,
//     hasSession: !!req.session,
//   });
// });
app.get("/api/debug/cookie", (req, res) => {
  res.json({
    cookies: req.cookies,
    sessionID: req.sessionID,
    user: req.user ? { id: req.user._id, email: req.user.email } : null,
  });
});



export default app;