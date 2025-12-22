import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "./passport.js";

import chatRoutes from "./routes/chat.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

// middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

// session + passport
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev_secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// routes
app.use("/api/chat", chatRoutes);
app.use("/auth", authRoutes);

export default app;
