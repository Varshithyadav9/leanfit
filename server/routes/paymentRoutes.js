import express from "express";
import multer from "multer";

import { submitManualPayment } from "../controllers/paymentController.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
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
