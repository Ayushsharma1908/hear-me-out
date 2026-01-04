// passport.js - FIXED VERSION
import dotenv from "dotenv";
dotenv.config();

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "./models/User.js";

const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!clientID || !clientSecret) {
  throw new Error("❌ Google OAuth env vars NOT loaded");
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://hear-me-out-oa3q.onrender.com/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const photo = profile.photos?.[0]?.value;

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email,
            avatar: photo,
          });
        }

        console.log("✅ Google OAuth success - User ID:", user._id);
        return done(null, user);
      } catch (err) {
        console.error("❌ Google OAuth error:", err);
        return done(err, null);
      }
    }
  )
);

// FIXED: Serialize only the user ID
passport.serializeUser((user, done) => {
  console.log("📦 Serialize user - ID:", user._id);
  done(null, user._id);
});

// FIXED: Deserialize by fetching user from database
passport.deserializeUser(async (id, done) => {
  try {
    console.log("📦 Deserialize user - ID:", id);
    const user = await User.findById(id);
    if (!user) {
      console.log("❌ User not found during deserialize");
      return done(null, false);
    }
    console.log("✅ User deserialized:", user.email);
    done(null, user);
  } catch (err) {
    console.error("❌ Deserialize error:", err);
    done(err, null);
  }
});

export default passport;