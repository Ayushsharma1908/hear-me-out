import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default async function authMiddleware(req, res, next) {
  console.log("🔐 JWT Auth Middleware Check:");
  console.log("   - URL:", req.originalUrl);
  console.log("   - Method:", req.method);

  try {
    // Get token from Authorization header: Bearer <token>
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("   ❌ No Authorization header or malformed");
      return res.status(401).json({
        error: "Unauthorized",
        message: "Missing or invalid Authorization header",
      });
    }

    const token = authHeader.split(" ")[1];
    console.log("   - Token received:", token?.slice(0, 10) + "...");

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("   ✅ JWT verified, payload:", decoded);

    // Optional: fetch full user from DB
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      console.log("   ❌ User not found in DB");
      return res.status(401).json({ error: "Unauthorized", message: "User not found" });
    }

    req.user = user; // Attach full user object
    console.log("   ✅ User attached to req.user:", { id: user._id, email: user.email });

    next();
  } catch (err) {
    console.log("   ❌ JWT verification or DB lookup failed:", err.message);
    return res.status(401).json({
      error: "Unauthorized",
      message: "Invalid or expired token",
    });
  }
}
