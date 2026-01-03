// middleware/auth.js - FIXED VERSION WITH DEBUG
export default function authMiddleware(req, res, next) {
  console.log("🔐 Auth Middleware Check:");
  console.log("   - URL:", req.originalUrl);
  console.log("   - Method:", req.method);
  console.log("   - Session ID:", req.sessionID);
  console.log("   - isAuthenticated exists:", !!req.isAuthenticated);
  console.log("   - isAuthenticated():", req.isAuthenticated ? req.isAuthenticated() : "N/A");
  console.log("   - req.user:", req.user ? { 
    _id: req.user._id, 
    email: req.user.email,
    name: req.user.name 
  } : "No user");
  
  // Check if user is authenticated
  if (req.isAuthenticated && req.isAuthenticated() && req.user) {
    console.log("   ✅ User authenticated, ID:", req.user._id);
    return next();
  }
  
  console.log("   ❌ User NOT authenticated - Blocking request");
  return res.status(401).json({ 
    error: "Unauthorized",
    message: "Please login first",
    debug: {
      hasIsAuthenticated: !!req.isAuthenticated,
      isAuthenticatedResult: req.isAuthenticated ? req.isAuthenticated() : undefined,
      hasUser: !!req.user,
      userId: req.user?._id
    }
  });
}