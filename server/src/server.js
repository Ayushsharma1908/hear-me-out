import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import mongoose from "mongoose";
console.log("GEMINI KEY:", process.env.GEMINI_API_KEY?.slice(0, 5));

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch(err => console.error(err));
console.log("OpenAI API key:", process.env.OPENAI_API_KEY);
