import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file from the server directory (one level up from src)
dotenv.config({ path: join(__dirname, "..", ".env") });

import app from "./app.js";
import mongoose from "mongoose";

const PORT = process.env.PORT || 5000;

// Validate required environment variables
if (!process.env.GROQ_API_KEY) {
  console.warn("⚠️  WARNING: GROQ_API_KEY is not set in .env file");
}
if (!process.env.MONGO_URI) {
  console.warn("⚠️  WARNING: MONGO_URI is not set in .env file");
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch(err => console.error(err));
