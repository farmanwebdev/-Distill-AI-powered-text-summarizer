import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import { summarizeText } from "./summarize.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));
app.use(express.json({ limit: "50kb" }));

// Rate limiting: 20 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please wait a few minutes before trying again." },
});
app.use("/api/", limiter);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Summarize endpoint
app.post("/api/summarize", async (req, res) => {
  try {
    const { text, style = "concise" } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Please provide text to summarize." });
    }

    const trimmed = text.trim();
    if (trimmed.length < 50) {
      return res.status(400).json({ error: "Text is too short. Please provide at least 50 characters." });
    }
    if (trimmed.length > 10000) {
      return res.status(400).json({ error: "Text is too long. Maximum 10,000 characters allowed." });
    }

    const validStyles = ["concise", "detailed", "bullets"];
    if (!validStyles.includes(style)) {
      return res.status(400).json({ error: "Invalid style. Choose from: concise, detailed, bullets." });
    }

    const result = await summarizeText(trimmed, style);
    res.json({ summary: result.summary, wordCount: result.wordCount, originalWordCount: result.originalWordCount });
  } catch (err) {
    console.error("Summarize error:", err.message);
    if (err.status === 429) {
      return res.status(429).json({ error: "AI service rate limit reached. Please try again shortly." });
    }
    res.status(500).json({ error: "Failed to generate summary. Please try again." });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found." });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn("⚠️  ANTHROPIC_API_KEY not set — using demo mode");
  }
});
