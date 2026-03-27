import { Router } from "express";
import { resumeSeed } from "../data/resumeSeed.js";
import { optionalAuth } from "../middleware/auth.js";
import { extractKeywords, optimizeResume } from "../services/keywordService.js";
import { getResumeForUser, saveResumeForUser } from "../services/resumeStoreService.js";
import { transformResumeForJob } from "../services/transformService.js";

const router = Router();

let resumeStore = structuredClone(resumeSeed);

router.use(optionalAuth);

router.get("/", async (req, res) => {
  if (req.user?.id) {
    const resume = await getResumeForUser(req.user.id);
    return res.json(resume);
  }

  return res.json(resumeStore);
});

router.put("/", async (req, res) => {
  resumeStore = req.body;

  if (req.user?.id) {
    const saved = await saveResumeForUser(req.user.id, req.body);
    return res.json(saved);
  }

  return res.json(resumeStore);
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
