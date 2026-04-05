import { Router } from "express";
import { createResumePdf } from "../services/pdfService.js";

const router = Router();

router.post("/resume", async (req, res) => {
  const { html = "", styles = "", fileName = "resume" } = req.body || {};

  if (!html.trim()) {
    return res.status(400).json({ message: "Resume HTML is required for PDF export." });
  }

  try {
    const pdf = await createResumePdf({
      html,
      styles,
      title: fileName
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}.pdf"`);
    return res.send(pdf);
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Could not generate PDF."
    });
  }
});

export default router;
