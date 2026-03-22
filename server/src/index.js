import cors from "cors";
import express from "express";
import resumeRoutes from "./routes/resumeRoutes.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/resume", resumeRoutes);

app.listen(PORT, () => {
  console.log(`Resume Builder API running on http://localhost:${PORT}`);
});
