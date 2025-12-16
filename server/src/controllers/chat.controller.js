import Chat from "../models/Chat.js";
import { generateAIResponse } from "../services/openaiService.js";

export const sendMessage = async (req, res) => {
  try {
    const { message, chatId } = req.body;

    if (!message) return res.status(400).json({ error: "Message is required" });

    let chat;

    if (chatId) {
      chat = await Chat.findById(chatId);
      if (!chat) return res.status(404).json({ error: "Chat not found" });
    } else {
      chat = await Chat.create({ messages: [] });
    }

    chat.messages.push({ role: "user", content: message });

    const aiReply = await generateAIResponse(chat.messages);

    chat.messages.push({ role: "assistant", content: aiReply });
    await chat.save();

    res.status(200).json({
      chatId: chat._id,
      reply: aiReply
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
