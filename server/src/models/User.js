import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String, // Hashed password for email/password auth
    avatar: String, // Google profile photo URL
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
