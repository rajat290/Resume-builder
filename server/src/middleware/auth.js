import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";

async function resolveUserFromHeader(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.slice("Bearer ".length);
  const payload = jwt.verify(token, env.jwtSecret);
  const user = await User.findById(payload.userId).lean();
  return user ? { ...user, id: String(user._id) } : null;
}

export async function optionalAuth(req, _res, next) {
  try {
    req.user = await resolveUserFromHeader(req);
  } catch (_error) {
    req.user = null;
  }
  next();
}

export async function requireAuth(req, res, next) {
  try {
    const user = await resolveUserFromHeader(req);
    if (!user) {
      return res.status(401).json({ message: "Authentication required." });
    }

    req.user = user;
    return next();
  } catch (_error) {
    return res.status(401).json({ message: "Invalid or expired session." });
  }
}
