import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

function buildPrompt(userData) {
  return `
You are a professional Indian dietician and fitness coach working for LeanFit.

IMPORTANT RULES:
- Do NOT mention AI, Gemini, ChatGPT, automation, or generated content.
- Do NOT use greetings like "Namaste", "Dear", or "Ji".
- Do NOT write long paragraphs.
- Keep the tone professional, practical, and simple.
- Use affordable Indian food options.
- Every food alternative MUST include quantity.
- The content will be placed inside a PDF by LeanFit, so keep formatting clean.
- If any user detail is missing, use a sensible general recommendation.

USER DETAILS:
Name: ${userData.name || "Customer"}
Age: ${userData.age || "Not provided"}
Gender: ${userData.gender || "Not provided"}
Height: ${userData.height || "Not provided"} cm
Weight: ${userData.weight || "Not provided"} kg
Target Weight: ${userData.targetWeight || "Not provided"} kg
Goal: ${userData.goal || "General Fitness"}
Activity Level: ${userData.activityLevel || "Not provided"}
Experience Level: ${userData.experience || "Beginner"}
Location: ${userData.location || "India"}

FOOD PREFERENCES:
${JSON.stringify(userData.foods || {})}

HABITS:
Smoking: ${userData.smoking || "Not provided"}
Alcohol: ${userData.alcohol || "Not provided"}
Sleep: ${userData.sleep || "Not provided"}
Stress: ${userData.stress || "Not provided"}

CREATE CONTENT IN THIS EXACT STRUCTURE:

PERSON SNAPSHOT:
Write 2 short lines about the user.

GOAL STRATEGY:
Write 3 short practical lines explaining the strategy.

CALORIES:
Give one daily calorie target range.

MACROS:
Protein:
Carbs:
Fats:

DIET NOTES:
Give 4 short diet rules.

FOOD ALTERNATIVES:
Protein options with quantity:
Chicken:
Paneer:
Eggs:
Fish:
Soya chunks:
Chana:
Rajma:
Dal:

Carb options with quantity:
Rice:
Roti:
Oats:
Poha:
Upma:
Sweet potato:
Idli:

WORKOUT NOTES:
Give 4 short workout rules.

SUPPLEMENT USE:
Give simple supplement advice without forcing supplements.

LIFESTYLE TIPS:
Give 5 short tips.

MINDSET REMINDER:
Write 2 short lines.

FINAL REMINDER:
Write 1 short disclaimer line.
`;
}

function backupPlan(userData) {
  return `
PERSON SNAPSHOT:
You are working toward ${userData.goal || "better fitness"} with a practical Indian food-based approach.
This plan focuses on consistency, protein intake, training quality, sleep, and daily routine.

GOAL STRATEGY:
Follow a simple calorie-controlled plan based on your goal.
Choose affordable protein sources daily and avoid skipping meals.
Track progress weekly instead of changing the plan every day.

CALORIES:
2200–2500 kcal per day

MACROS:
Protein: 120–160g
Carbs: 220–300g
Fats: 55–75g

DIET NOTES:
Eat protein in every major meal.
Choose one main food or one alternative, not all together.
Drink 3–4 litres water daily.
Keep oil and fried foods limited.

FOOD ALTERNATIVES:
Protein options with quantity:
Chicken: 150g
Paneer: 150g
Eggs: 4 whole eggs
Fish: 150g
Soya chunks: 70g dry
Chana: 180g cooked
Rajma: 180g cooked
Dal: 250g cooked

Carb options with quantity:
Rice: 180g cooked
Roti: 3 medium
Oats: 70g
Poha: 180g cooked
Upma: 180g cooked
Sweet potato: 250g
Idli: 3 pieces

WORKOUT NOTES:
Train with proper form first.
Increase weight or reps slowly.
Walk 20–30 minutes on non-heavy days.
Sleep well for better recovery.

SUPPLEMENT USE:
Supplements are optional. Whole foods are enough for most users.

LIFESTYLE TIPS:
Sleep 7–8 hours daily.
Drink enough water.
Prepare simple meals in advance.
Track body weight once weekly.
Stay consistent for at least 30 days.

MINDSET REMINDER:
One missed meal or workout does not ruin progress.
Return to the plan from the next meal or next session.

FINAL REMINDER:
This is a general fitness guideline and not medical advice.
`;
}

export async function generateDietPlan(userData) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: buildPrompt(userData),
    });

    return response.text;
  } catch (error) {
    console.log("Gemini failed, using backup LeanFit plan:", error.message);
    return backupPlan(userData);
  }
}
function extractJsonObject(value = "") {
  const cleaned = String(value)
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error(`Gemini returned invalid meal data: ${cleaned.slice(0, 200)}`);
  }

  return JSON.parse(cleaned.slice(start, end + 1));
}

function numberOrZero(value) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? Math.max(0, Math.round(parsed)) : 0;
}

export async function analyzeFoodImage(imagePath, mimeType = "image/jpeg") {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing on the server.");
  }

  const fs = await import("fs/promises");
  const imageBuffer = await fs.readFile(imagePath);

  const prompt = `
Analyze the complete visible food serving in this image.

Return ONLY valid JSON:
{
  "mealName": "short food name",
  "quantity": "estimated visible serving, such as 1 plate (350 g)",
  "calories": 0,
  "protein": 0,
  "carbs": 0,
  "fat": 0,
  "confidence": 0
}

Rules:
- Values must represent the full visible serving, not per 100 g.
- Identify Indian dishes accurately when possible.
- Use whole-number nutrition estimates.
- confidence must be from 0 to 100.
- Return JSON only, without markdown or explanation.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              mimeType,
              data: imageBuffer.toString("base64"),
            },
          },
          { text: prompt },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      temperature: 0.1,
      maxOutputTokens: 500,
    },
  });

  const responseText =
    typeof response.text === "function" ? response.text() : response.text;

  if (!responseText) {
    throw new Error("Gemini returned an empty food-analysis response.");
  }

  const parsed = extractJsonObject(responseText);

  return {
    mealName: String(parsed.mealName || "Detected meal").trim(),
    quantity: String(parsed.quantity || "1 serving").trim(),
    calories: numberOrZero(parsed.calories),
    protein: numberOrZero(parsed.protein),
    carbs: numberOrZero(parsed.carbs),
    fat: numberOrZero(parsed.fat),
    confidence: Math.min(100, numberOrZero(parsed.confidence)),
  };
}
