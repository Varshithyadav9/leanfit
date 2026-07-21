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

router.get("/food/barcode/:barcode", async (req, res) => {
  try {
    const barcode = String(req.params.barcode || "").replace(/\D/g, "");

    if (barcode.length < 8 || barcode.length > 14) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid barcode.",
      });
    }

    const response = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`
    );

    if (!response.ok) {
      throw new Error("Barcode service is unavailable.");
    }

    const data = await response.json();
    const product = data.product;

    if (data.status !== 1 || !product) {
      return res.status(404).json({
        success: false,
        message: "Product not found. You can enter the nutrition details manually.",
      });
    }

    const nutrients = product.nutriments || {};
    const servingSize = product.serving_size || product.quantity || "1 serving";

    const firstNumber = (...values) => {
      for (const value of values) {
        const number = Number(value);
        if (Number.isFinite(number)) return Math.round(number * 10) / 10;
      }
      return 0;
    };

    const normalizedProduct = {
      barcode,
      mealName:
        product.product_name ||
        product.product_name_en ||
        product.generic_name ||
        "Packaged food",
      quantity: servingSize,
      calories: firstNumber(
        nutrients["energy-kcal_serving"],
        nutrients["energy-kcal_100g"]
      ),
      protein: firstNumber(nutrients.proteins_serving, nutrients.proteins_100g),
      carbs: firstNumber(
        nutrients.carbohydrates_serving,
        nutrients.carbohydrates_100g
      ),
      fat: firstNumber(nutrients.fat_serving, nutrients.fat_100g),
      imageUrl:
        product.image_front_url ||
        product.image_url ||
        product.image_front_small_url ||
        "",
      brand: Array.isArray(product.brands_tags)
        ? product.brands_tags[0] || ""
        : product.brands || "",
    };

    return res.json({
      success: true,
      product: normalizedProduct,
    });
  } catch (error) {
    console.error("Barcode lookup failed:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to look up this barcode right now.",
    });
  }
});

export default router;
