import dotenv from "dotenv";
dotenv.config(); // 🔴 REQUIRED HERE

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!clientID || !clientSecret) {
  throw new Error("❌ Google OAuth env vars NOT loaded");
}

passport.use(
  new GoogleStrategy(
    {
      clientID,
      clientSecret,
      callbackURL: "http://localhost:5000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

export default passport;
