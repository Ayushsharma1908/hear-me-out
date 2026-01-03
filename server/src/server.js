import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import mongoose from "mongoose";
console.log("GROQ KEY:", process.env.GROQ_API_KEY?.slice(0, 6));

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
// console.log("Groq API key:", process.env.GROQ_API_KEY);
// console.log("GROQ KEY EXISTS?", !!process.env.GROQ_API_KEY);
// console.log("GROQ KEY VALUE:", process.env.GROQ_API_KEY);
