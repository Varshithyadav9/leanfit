import fs from "fs";
import path from "path";
import express from "express";
import multer from "multer";

import { submitManualPayment } from "../controllers/paymentController.js";

const router = express.Router();
const uploadDirectory = path.resolve("uploads");

fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDirectory);
  },
  filename(req, file, cb) {
    const safeName = String(file.originalname || "payment")
      .replace(/[^a-zA-Z0-9._-]/g, "_");

    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter(req, file, cb) {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error("Only JPG, PNG and WEBP screenshots are allowed."));
      return;
    }

    cb(null, true);
  },
});

router.post(
  "/manual-payment/submit",
  upload.single("paymentScreenshot"),
  submitManualPayment
);

export default router;
