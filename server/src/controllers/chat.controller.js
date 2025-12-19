// server/src/controllers/chat.controller.js
import { generateAIResponse } from "../services/geminiService.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    const reply = await generateAIResponse(message);

    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI failed to respond" });
  }
};
