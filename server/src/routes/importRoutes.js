import { Router } from "express";
import multer from "multer";
import mammoth from "mammoth";
import pdf from "pdf-parse/lib/pdf-parse.js";
import { parseResumeText } from "../services/importService.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/text", (req, res) => {
  const { text = "" } = req.body;
  const parsedResume = parseResumeText(text);
  res.json({ parsedResume });
});

router.post("/file", upload.single("resume"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Resume file is required." });
  }

  try {
    let extractedText = "";
    const fileName = req.file.originalname.toLowerCase();

    if (fileName.endsWith(".txt")) {
      extractedText = req.file.buffer.toString("utf-8");
    } else if (fileName.endsWith(".docx")) {
      const result = await mammoth.extractRawText({ buffer: req.file.buffer });
      extractedText = result.value;
    } else if (fileName.endsWith(".pdf")) {
      const result = await pdf(req.file.buffer);
      extractedText = result.text;
    } else {
      return res.status(400).json({
        message: "Supported formats are .txt, .docx, and .pdf."
      });
    }

    const parsedResume = parseResumeText(extractedText);
    return res.json({ parsedResume, extractedText });
  } catch (error) {
    return res.status(500).json({
      message: "Could not read the uploaded file.",
      details: error.message
    });
  }
});

export default router;
