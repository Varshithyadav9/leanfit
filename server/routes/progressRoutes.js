import express from "express";

import {
  saveProgress,
  getProgress,
  getWeeklyProgress,
  getWeeklyReport,
} from "../controllers/progressController.js";

const router = express.Router();

router.post("/progress", saveProgress);

router.get("/progress/:email/:date", getProgress);

router.get("/progress/history/:email", getWeeklyProgress);

router.get("/progress/weekly-report/:email", getWeeklyReport);

export default router;