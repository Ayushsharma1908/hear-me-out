// app.js - FIXED VERSION
import express from "express";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import passport from "./passport.js";
import chatRoutes from "./routes/chat.routes.js";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";

const app = express();

app.set("trust proxy", 1);

// CORS Configuration - FIXED
const allowedOrigins = [
  "http://localhost:5173",
  "https://hear-me-out-red.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) === -1) {
        // If you want to be less restrictive in development:
        if (process.env.NODE_ENV === 'development') {
          console.log(`Allowing origin in dev: ${origin}`);
          return callback(null, true);
        }
        
        const msg = `CORS blocked: ${origin} not in allowed origins`;
        console.error(msg);
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);

app.use(express.json());
app.use(cookieParser());

// Session + Passport - FIXED
const isProduction = true;
const isLocalhost = process.env.NODE_ENV === 'development';

app.use(
  session({
    name: "__Secure-connect.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 14 * 24 * 60 * 60,
    }),
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 14 * 24 * 60 * 60 * 1000,
    },
  })
);


app.use(passport.initialize());
app.use(passport.session());

// Debug middleware - Enhanced
app.use((req, res, next) => {
  console.log("🔍 Request Info:");
  console.log("   - URL:", req.originalUrl);
  console.log("   - Method:", req.method);
  console.log("   - Origin:", req.headers.origin);
  console.log("   - Host:", req.headers.host);
  console.log("   - Session ID:", req.sessionID);
  console.log("   - Cookies:", req.headers.cookie ? "Present" : "None");
  console.log("   - isAuthenticated:", req.isAuthenticated ? req.isAuthenticated() : false);
  console.log("   - User:", req.user ? { id: req.user._id, email: req.user.email } : "No user");
  next();
});

// Add cookie debugging route
app.get("/api/cookie-test", (req, res) => {
  res.cookie("test_cookie", "test_value", {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  });
  
  res.json({
    message: "Test cookie set",
    sessionId: req.sessionID,
    cookiesSent: req.headers.cookie,
    sessionCookieName: process.env.NODE_ENV === 'production' ? "__Secure-connect.sid" : "connect.sid",
  });
});

// Check session status
app.get("/api/session-status", (req, res) => {
  res.json({
    authenticated: req.isAuthenticated(),
    user: req.user ? {
      id: req.user._id,
      email: req.user.email,
      name: req.user.name
    } : null,
    sessionId: req.sessionID,
    cookies: req.cookies,
    sessionExists: !!req.session,
  });
});

// Test login endpoint (for debugging)
app.post("/api/test-login", (req, res) => {
  // This simulates a login without actual auth for testing
  req.session.testUser = { id: "test", email: "test@example.com" };
  req.session.save((err) => {
    if (err) {
      console.error("Session save error:", err);
      return res.status(500).json({ error: "Failed to save session" });
    }
    
    res.json({
      message: "Test session created",
      sessionId: req.sessionID,
      cookiesSet: true,
    });
  });
});

// Routes
app.use("/api/chat", chatRoutes);
app.use("/auth", authRoutes);

// Debug route for cookies
app.get("/api/debug/cookie", (req, res) => {
  res.json({
    cookies: req.cookies,
    sessionID: req.sessionID,
    user: req.user ? { id: req.user._id, email: req.user.email } : null,
    headers: {
      origin: req.headers.origin,
      host: req.headers.host,
      cookie: req.headers.cookie,
    },
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("🚨 Error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

export default app;