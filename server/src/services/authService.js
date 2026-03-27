import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { env } from "../config/env.js";
import { User } from "../models/User.js";

const googleClient = new OAuth2Client(env.googleClientId);

export async function signInWithGoogle(credential) {
  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: env.googleClientId
  });

  const payload = ticket.getPayload();
  if (!payload?.email) {
    throw new Error("Google account email not found.");
  }

  const user = await User.findOneAndUpdate(
    { email: payload.email },
    {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name || payload.email.split("@")[0],
      picture: payload.picture || "",
      provider: "google"
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    }
  );

  const token = jwt.sign(
    {
      userId: String(user._id),
      email: user.email,
      name: user.name
    },
    env.jwtSecret,
    { expiresIn: "7d" }
  );

  return {
    token,
    user: {
      id: String(user._id),
      email: user.email,
      name: user.name,
      picture: user.picture,
      provider: "google",
      mode: "authenticated"
    }
  };
}
