// passport.js
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import User from "./models/User.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, // from Google Cloud Console
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Google profile email
        const email = profile.emails[0].value;
        let user = await User.findOne({ email });

        if (!user) {
          // If new user, create
          user = await User.create({
            name: profile.displayName,
            email,
            avatar: profile.photos?.[0]?.value || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.displayName)}&background=000000&color=ffffff&size=128&bold=true`,
            password: null, // OAuth user, no password
          });
        }

        // Generate JWT
        const token = jwt.sign(
          { id: user._id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );

        // Pass user + token
        done(null, { user, token });
      } catch (err) {
        console.error("🚨 Google OAuth error:", err); 
        done(err, null);
      }
    }
  )
);

// Serialize/Deserialize not strictly needed for JWT
passport.serializeUser((data, done) => done(null, data));
passport.deserializeUser((data, done) => done(null, data));

export default passport;
