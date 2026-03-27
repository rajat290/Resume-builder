import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { sendResumeEmail } from "../services/emailService.js";

const router = Router();

router.post("/share", requireAuth, async (req, res) => {
  const { to, resumeName = "resume", link = "" } = req.body;

  if (!to) {
    return res.status(400).json({ message: "Recipient email is required." });
  }

  try {
    await sendResumeEmail({
      to,
      subject: `${req.user.name} shared a resume with you`,
      text: `${req.user.name} shared ${resumeName}.\n${link}`,
      html: `<p>${req.user.name} shared <strong>${resumeName}</strong>.</p><p><a href="${link}">${link}</a></p>`
    });

    return res.json({ sent: true });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Could not send email." });
  }
});

export default router;
