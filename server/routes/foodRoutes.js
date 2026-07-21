import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";
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
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed."));
    }

    cb(null, true);
  },
});

async function prepareGeminiImage(file) {
  const supportedMimeTypes = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/heic",
    "image/heif",
  ]);

  if (supportedMimeTypes.has(file.mimetype)) {
    return {
      analysisPath: file.path,
      analysisMimeType: file.mimetype,
      convertedPath: null,
    };
  }

  const convertedPath = `${file.path}.jpg`;

  await sharp(file.path)
    .rotate()
    .jpeg({ quality: 88 })
    .toFile(convertedPath);

  return {
    analysisPath: convertedPath,
    analysisMimeType: "image/jpeg",
    convertedPath,
  };
}

router.post("/food/upload", upload.single("mealPhoto"), async (req, res) => {
  let convertedPath = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a meal photo.",
      });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const imageUrl = `${baseUrl}/uploads/meals/${req.file.filename}`;

    const preparedImage = await prepareGeminiImage(req.file);
    convertedPath = preparedImage.convertedPath;

    const analysis = await analyzeFoodImage(
      preparedImage.analysisPath,
      preparedImage.analysisMimeType
    );

    return res.status(201).json({
      success: true,
      message: "Meal photo analyzed successfully.",
      imageUrl,
      analysis,
    });
  } catch (error) {
    console.error("Food analysis failed:", error);

    const status = Number(error?.status) === 503 ? 503 : 500;

    return res.status(status).json({
      success: false,
      message:
        error.message ||
        "Food analysis is temporarily unavailable. Please try again shortly.",
    });
  } finally {
    if (convertedPath) {
      fs.promises.unlink(convertedPath).catch(() => {});
    }
  }
});

export default router;
