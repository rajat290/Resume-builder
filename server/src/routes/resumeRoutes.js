import { Router } from "express";
import { resumeSeed } from "../data/resumeSeed.js";
import { extractKeywords, optimizeResume } from "../services/keywordService.js";

const router = Router();

let resumeStore = structuredClone(resumeSeed);

router.get("/", (_req, res) => {
  res.json(resumeStore);
});

router.put("/", (req, res) => {
  resumeStore = req.body;
  res.json(resumeStore);
});

router.post("/analyze", (req, res) => {
  const { jobDescription = "", resume = resumeStore } = req.body;
  const keywords = extractKeywords(jobDescription);
  const optimizedResume = optimizeResume(resume, keywords);

  res.json({
    keywords,
    optimizedResume
  });
});

export default router;
