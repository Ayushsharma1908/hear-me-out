import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://hear-me-out-red.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"], // JWT sent in Authorization header
  })
);

// Routes
app.use("/api/chat", chatRoutes);
app.use("/auth", authRoutes);

app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("🚨 Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

export default app;
