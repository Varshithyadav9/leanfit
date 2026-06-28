import express from "express";

import {
  saveProgress,
  getProgress,
  getWeeklyProgress,
} from "../controllers/progressController.js";

const router = express.Router();

router.post("/progress", saveProgress);

router.get("/progress/:email/:date", getProgress);

router.get("/progress/history/:email", getWeeklyProgress);

export default router;