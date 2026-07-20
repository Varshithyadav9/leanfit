import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mealUploadDirectory = path.join(
  __dirname,
  "..",
  "uploads",
  "meals"
);

// Automatically create uploads/meals if it does not exist
fs.mkdirSync(mealUploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, mealUploadDirectory);
  },

  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const uniqueName = `meal-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${extension}`;

    callback(null, uniqueName);
  },
});

const allowedImageTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const fileFilter = (req, file, callback) => {
  if (!allowedImageTypes.includes(file.mimetype)) {
    return callback(
      new Error("Only JPG, JPEG, PNG and WEBP images are allowed.")
    );
  }

  callback(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

router.post("/food/upload", (req, res) => {
  upload.single("mealPhoto")(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "Meal photo must be smaller than 5 MB.",
        });
      }

      return res.status(400).json({
        success: false,
        message: error.message || "Image upload failed.",
      });
    }

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message || "Invalid image.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a meal photo.",
      });
    }

    const imageUrl = `${req.protocol}://${req.get(
      "host"
    )}/uploads/meals/${req.file.filename}`;

    return res.status(201).json({
      success: true,
      message: "Meal photo uploaded successfully.",
      imageUrl,
      filename: req.file.filename,
      mimeType: req.file.mimetype,
      size: req.file.size,
    });
  });
});

export default router;