import { Router } from "express";
import { resumeSeed } from "../data/resumeSeed.js";
import { extractKeywords, optimizeResume } from "../services/keywordService.js";
import { transformResumeForJob } from "../services/transformService.js";

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

router.post("/transform", async (req, res) => {
  const { jobDescription = "", resume = resumeStore } = req.body;

  if (!jobDescription.trim()) {
    return res.status(400).json({
      message: "Job description is required for AI transformation."
    });
  }

  const result = await transformResumeForJob(resume, jobDescription);
  return res.json(result);
});

export default router;
