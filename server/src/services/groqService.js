import Groq from "groq-sdk";

function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GROQ_API_KEY is missing. Please set it in server/.env"
    );
  }

  return new Groq({ apiKey });
}
export async function generateAIResponse(userMessage) {
  try {
    const groq = getGroqClient();

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant", 
      messages: [
        {
          role: "system",
          content:
            "You are a helpful, empathetic AI assistant for a mental health chatbot."
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      temperature: 0.7
    });

    return completion.choices[0]?.message?.content || "No response generated.";
  } catch (error) {
    console.error("Groq AI Error:", error.message);
    return "I'm having trouble responding right now. Please try again.";
  }
}
