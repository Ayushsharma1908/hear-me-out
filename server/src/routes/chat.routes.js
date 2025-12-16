import express from "express";
import { sendMessage } from "../controllers/chat.controller.js";

const router = express.Router();

// POST /api/chat
router.post("/", sendMessage);

export default router;
