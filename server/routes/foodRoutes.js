import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { analyzeFoodImage } from "../services/geminiService.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDirectory = path.join(__dirname, "..", "uploads", "meals");

fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDirectory),
  filename: (req, file, cb) => {
    const safeName = file.originalname
      .replace(/[^a-zA-Z0-9._-]/g, "-")
      .replace(/-+/g, "-");

    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 8 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed."));
    }

    cb(null, true);
  },
});

router.post("/food/upload", upload.single("mealPhoto"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a meal photo.",
      });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const imageUrl = `${baseUrl}/uploads/meals/${req.file.filename}`;

    let analysis = null;
    let analysisMessage = "Meal photo uploaded successfully.";

    try {
      analysis = await analyzeFoodImage(req.file.path, req.file.mimetype);
      analysisMessage = "Meal photo analyzed successfully.";
    } catch (analysisError) {
      console.error("Food analysis failed:", analysisError.message);
      analysisMessage =
        "Photo uploaded, but automatic nutrition detection was unavailable. You can enter the values manually.";
    }

    return res.status(201).json({
      success: true,
      message: analysisMessage,
      imageUrl,
      analysis,
    });
  } catch (error) {
    console.error("Food upload failed:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to upload meal photo.",
    });
  }
});

export default router;
