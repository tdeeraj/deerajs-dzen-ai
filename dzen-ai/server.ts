import express from "express";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import db from "./server/db.ts";
import authRoutes from "./server/routes/auth.ts";
import moodRoutes from "./server/routes/mood.ts";
import plannerRoutes from "./server/routes/planner.ts";
import forumRoutes from "./server/routes/forum.ts";
import rewardRoutes from "./server/routes/rewards.ts";

dotenv.config();
console.log("API KEY:", process.env.GEMINI_API_KEY);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/mood", moodRoutes);
  app.use("/api/planner", plannerRoutes);
  app.use("/api/forum", forumRoutes);
  app.use("/api/rewards", rewardRoutes);

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
