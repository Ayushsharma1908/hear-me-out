import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";

// now safe to use process.env.OPENAI_API_KEY
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const generateAIResponse = async (messages) => {
  const lastUserMessage = messages[messages.length - 1].content;

  // TEMP: if API key is missing, return mock response
  if (!process.env.OPENAI_API_KEY) {
    return `🤖 AI received: "${lastUserMessage}"`;
  }

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: messages.map(m => ({
      role: m.role === "bot" ? "assistant" : m.role,
      content: m.text || m.content
    }))
  });

  return response.choices[0].message.content;
};
