import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";
import emailRoutes from "./routes/emailRoutes.js";
import importRoutes from "./routes/importRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import pdfRoutes from "./routes/pdfRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";

const app = express();
const PORT = env.port;

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "5mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api/import", importRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/email", emailRoutes);

connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Resume Builder API running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
  });
