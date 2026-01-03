import Groq from "groq-sdk";

function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("GROQ_API_KEY is missing. Please set it in server/.env");
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
          content: `
You are a helpful AI assistant.

ALWAYS format responses in a clear, structured way using Markdown.

Follow this structure whenever applicable:
- Start with a short **definition**
- Use **headings**
- Use **bullet points or numbered lists**
- Keep paragraphs short
- Avoid long unbroken text
- End with a brief **summary or follow-up question** if helpful

Never return a single long paragraph.
`,
        },

        {
          role: "user",
          content: userMessage,
        },
      ],
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || "No response generated.";
  } catch (error) {
    console.error("Groq AI Error:", error.message);
    return "I'm having trouble responding right now. Please try again.";
  }
}
