import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { signInWithGoogle } from "../services/authService.js";

const router = Router();

router.post("/google", async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ message: "Google credential is required." });
  }

  try {
    const result = await signInWithGoogle(credential);
    return res.json(result);
  } catch (error) {
    return res.status(401).json({ message: error.message || "Google sign-in failed." });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  return res.json({ user: req.user });
});

export default router;
