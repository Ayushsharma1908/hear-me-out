import express from "express";
import { sendMessage } from "../controllers/chat.controller.js";
import Chat from "../models/Chat.js";
import authMiddleware from "../middleware/auth.js"; // JWT middleware

const router = express.Router();

// ------------------------
// Send message
// ------------------------
router.post("/", authMiddleware, sendMessage);

// ------------------------
// Save full chat
// ------------------------
router.post("/save", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    const { chatId, messages } = req.body;
    if (!messages || messages.length === 0) {
      return res.status(400).json({ error: "No messages provided" });
    }

    // Generate chat title from first user message
    const firstUserMessage = messages.find((m) => m.role === "user");
    const chatTitle = firstUserMessage
      ? firstUserMessage.text.substring(0, 50) +
        (firstUserMessage.text.length > 50 ? "..." : "")
      : "New Chat";

    let chat;

    if (chatId) {
      // Update existing chat
      chat = await Chat.findOneAndUpdate(
        { _id: chatId, userId },
        { messages, title: chatTitle },
        { new: true }
      );
    } else {
      // Create new chat
      chat = new Chat({ userId, messages, title: chatTitle });
      await chat.save();
    }

    res.json({ chat });
  } catch (err) {
    console.error("Save chat error:", err);
    res.status(500).json({ error: "Failed to save chat" });
  }
});

// ------------------------
// Get recent chats
// ------------------------
router.get("/recent", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const { search } = req.query;

    let query = { userId };
    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { "messages.text": { $regex: search, $options: "i" } },
      ];
    }

    const chats = await Chat.find(query).sort({ updatedAt: -1 }).limit(20);

    const responseChats = chats.map((chat) => {
      // Ensure chat has title
      if (!chat.title || chat.title === "New Chat") {
        const firstUserMsg = chat.messages.find((m) => m.role === "user");
        chat.title = firstUserMsg
          ? firstUserMsg.text.substring(0, 50) +
            (firstUserMsg.text.length > 50 ? "..." : "")
          : "New Chat";
      }

      return {
        _id: chat._id,
        title: chat.title,
        messageCount: chat.messages.length,
        lastMessage:
          chat.messages.length > 0
            ? chat.messages[chat.messages.length - 1].text
            : null,
      };
    });

    res.json({ chats: responseChats });
  } catch (err) {
    console.error("Fetch recent chats error:", err);
    res.status(500).json({ error: "Failed to fetch recent chats" });
  }
});

// ------------------------
// Get single chat by ID
// ------------------------
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const chat = await Chat.findOne({ _id: req.params.id, userId });

    if (!chat) return res.status(404).json({ error: "Chat not found" });

    res.json({ chat });
  } catch (err) {
    console.error("Fetch chat error:", err);
    res.status(500).json({ error: "Failed to fetch chat" });
  }
});

// ------------------------
// Delete chat
// ------------------------
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const chat = await Chat.findOneAndDelete({ _id: req.params.id, userId });

    if (!chat) return res.status(404).json({ error: "Chat not found" });

    res.json({ success: true, message: "Chat deleted successfully" });
  } catch (err) {
    console.error("Delete chat error:", err);
    res.status(500).json({ error: "Failed to delete chat" });
  }
});

export default router;
