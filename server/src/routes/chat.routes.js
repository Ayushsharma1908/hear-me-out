import express from "express";
import { sendMessage } from "../controllers/chat.controller.js";
import Chat from "../models/Chat.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Send message
router.post("/", authMiddleware, sendMessage);

// Save full chat
router.post("/save", authMiddleware, async (req, res) => {
  console.log("User ID:", req.user._id);
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    console.log("=== SAVE CHAT REQUEST ===");
    console.log("User ID:", req.user._id);
    console.log("Request body:", JSON.stringify(req.body, null, 2));

    const { chatId, messages } = req.body;

    if (!messages || messages.length === 0) {
      console.log("ERROR: No messages provided");
      return res.status(400).json({ error: "No messages" });
    }

    let chat;

    // Extract title from first user message
    const firstUserMessage = messages.find((m) => m.role === "user");
    const chatTitle = firstUserMessage
      ? firstUserMessage.text.substring(0, 50) +
        (firstUserMessage.text.length > 50 ? "..." : "")
      : "New Chat";

    console.log("Chat title:", chatTitle);

    if (chatId) {
      console.log(`Updating existing chat: ${chatId}`);
      chat = await Chat.findOneAndUpdate(
        { _id: chatId, userId: req.user._id },
        {
          messages,
          title: chatTitle,
        },
        { new: true }
      );
      console.log("Updated chat:", chat ? "Success" : "Not found");
    } else {
      console.log("Creating NEW chat");
      chat = new Chat({
        userId: req.user._id,
        messages,
        title: chatTitle,
      });
      await chat.save();
      console.log("New chat created with ID:", chat._id);
    }

    res.json({ chat });
  } catch (err) {
    console.error("Save chat error:", err);
    res.status(500).json({ error: "Failed to save chat" });
  }
});

// Get recent chats
router.get("/recent", authMiddleware, async (req, res) => {
  try {
    console.log("=== FETCH RECENT CHATS ===");
    console.log("User ID:", req.user._id);
    console.log("Search query:", req.query.search);

    const { search } = req.query;

    let query = { userId: req.user._id };

    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { "messages.text": { $regex: search, $options: "i" } },
      ];
      console.log("Search filter applied:", query.$or);
    }

    console.log("MongoDB query:", JSON.stringify(query, null, 2));

    const chats = await Chat.find(query).sort({ updatedAt: -1 }).limit(20);

    console.log(`Found ${chats.length} chats`);

    // Ensure all chats have a title
    const chatsWithTitle = chats.map((chat) => {
      if (!chat.title || chat.title === "New Chat") {
        const firstUserMsg = chat.messages.find((m) => m.role === "user");
        chat.title = firstUserMsg
          ? firstUserMsg.text.substring(0, 50) +
            (firstUserMsg.text.length > 50 ? "..." : "")
          : "New Chat";
      }
      return chat;
    });

    const responseChats = chatsWithTitle.map((chat) => ({
      _id: chat._id, // ✅ frontend expects this
      title: chat.title,
      messageCount: chat.messages.length,
    }));

    console.log("Returning chats:", responseChats);

    res.json({ chats: responseChats });
  } catch (err) {
    console.error("Fetch recent chats error:", err);
    res.status(500).json({ error: "Failed to fetch recent chats" });
  }
});

// Get single chat by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    console.log("=== GET SINGLE CHAT ===");
    console.log("User ID:", req.user._id);
    console.log("Chat ID:", req.params.id);

    const chat = await Chat.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!chat) {
      console.log("Chat not found");
      return res.status(404).json({ error: "Chat not found" });
    }

    console.log("Chat found:", chat._id);
    res.json({ chat });
  } catch (err) {
    console.error("Fetch chat error:", err);
    res.status(500).json({ error: "Failed to fetch chat" });
  }
});

// Delete chat
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    console.log("=== DELETE CHAT ===");
    console.log("User ID:", req.user._id);
    console.log("Chat ID to delete:", req.params.id);

    const chat = await Chat.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!chat) {
      console.log("Chat not found for deletion");
      return res.status(404).json({ error: "Chat not found" });
    }

    console.log("Chat deleted successfully:", req.params.id);
    res.json({
      success: true,
      message: "Chat deleted successfully",
    });
  } catch (err) {
    console.error("Delete chat error:", err);
    res.status(500).json({ error: "Failed to delete chat" });
  }
});

export default router;
