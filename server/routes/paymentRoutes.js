import express from "express";
import multer from "multer";
import fs from "fs";

import { generatePlan } from "../controllers/paymentController.js";

const router = express.Router();

const uploadDir = "uploads";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post(
  "/generate-plan",
  upload.single("paymentScreenshot"),
  generatePlan
);

export default router;