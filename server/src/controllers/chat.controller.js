// server/src/controllers/chat.controller.js
import { generateAIResponse } from "../services/groqService.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Message is required and must be a non-empty string" });
    }

    const reply = await generateAIResponse(message);

    res.json({ reply });
  } catch (error) {
    console.error("Chat controller error:", error);
    
    // Provide more specific error messages
    if (error.message.includes("GROQ_API_KEY")) {
      return res.status(500).json({ 
        error: "Server configuration error: API key not found. Please check your .env file." 
      });
    }
    
    res.status(500).json({ 
      error: error.message || "AI failed to respond",
      details: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};
