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


const MODEL_CANDIDATES = [
  "gemini-3.5-flash",
  "gemini-2.5-flash-lite",
];

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function getErrorStatus(error) {
  return (
    error?.status ||
    error?.code ||
    error?.response?.status ||
    error?.error?.code ||
    0
  );
}

function isRetryableGeminiError(error) {
  const status = Number(getErrorStatus(error));
  const message = String(error?.message || error || "").toLowerCase();

  return (
    status === 429 ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504 ||
    message.includes("high demand") ||
    message.includes("overloaded") ||
    message.includes("unavailable") ||
    message.includes("resource exhausted") ||
    message.includes("temporarily")
  );
}

function cleanGeminiError(error) {
  const status = Number(getErrorStatus(error));
  const raw = String(error?.message || error || "");

  if (status === 429) {
    return "Food analysis is temporarily busy. Please try again shortly.";
  }

  if ([500, 502, 503, 504].includes(status) || /high demand|overloaded|unavailable/i.test(raw)) {
    return "Food analysis is temporarily busy. Please try again shortly.";
  }

  if (/api key|permission|unauthorized|forbidden/i.test(raw)) {
    return "Food analysis service is not configured correctly.";
  }

  return "Food analysis could not be completed right now.";
}

async function generateWithRetry(requestFactory, options = {}) {
  const {
    attempts = 3,
    baseDelayMs = 1200,
  } = options;

  let lastError = null;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await requestFactory();
    } catch (error) {
      lastError = error;

      if (!isRetryableGeminiError(error) || attempt === attempts) {
        throw error;
      }

      const delay = baseDelayMs * 2 ** (attempt - 1);
      await wait(delay);
    }
  }

  throw lastError || new Error("Gemini request failed.");
}

function extractResponseText(response) {
  if (!response) {
    throw new Error("Gemini returned an empty response.");
  }

  if (typeof response.text === "string" && response.text.trim()) {
    return response.text.trim();
  }

  if (typeof response.text === "function") {
    const text = response.text();
    if (typeof text === "string" && text.trim()) {
      return text.trim();
    }
  }

  const parts =
    response?.candidates?.[0]?.content?.parts ||
    response?.response?.candidates?.[0]?.content?.parts ||
    [];

  const combined = parts
    .map((part) => part?.text || "")
    .join("")
    .trim();

  if (!combined) {
    throw new Error("Gemini returned no usable text.");
  }

  return combined;
}

export async function generateDietPlan(userData) {
  for (const model of MODEL_CANDIDATES) {
    try {
      const response = await generateWithRetry(
        () =>
          ai.models.generateContent({
            model,
            contents: buildPrompt(userData),
          }),
        { attempts: 2, baseDelayMs: 900 }
      );

      return extractResponseText(response);
    } catch (error) {
      console.error(`Diet plan failed with ${model}:`, error.message);
    }
  }

  return backupPlan(userData);
}

function extractJsonObject(value = "") {
  const cleaned = String(value)
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Gemini did not return valid meal data.");
  }

  return JSON.parse(cleaned.slice(start, end + 1));
}

function numberOrZero(value) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? Math.max(0, Math.round(parsed)) : 0;
}

const mealResponseSchema = {
  type: "object",
  properties: {
    mealName: { type: "string" },
    quantity: { type: "string" },
    calories: { type: "number" },
    protein: { type: "number" },
    carbs: { type: "number" },
    fat: { type: "number" },
    confidence: { type: "number" },
  },
  required: [
    "mealName",
    "quantity",
    "calories",
    "protein",
    "carbs",
    "fat",
    "confidence",
  ],
  additionalProperties: false,
};

function filenameFallback(imagePath = "") {
  const name = String(imagePath)
    .split(/[\\/]/)
    .pop()
    .toLowerCase()
    .replace(/[_-]+/g, " ");

  const foods = [
    {
      words: ["chicken biryani", "boneless chicken biryani", "biryani"],
      data: ["Chicken biryani", "1 plate (350 g)", 620, 32, 78, 20],
    },
    {
      words: ["idli", "idly"],
      data: ["Idli with sambar", "4 idlis with 1 cup sambar", 410, 14, 72, 7],
    },
    {
      words: ["dosa"],
      data: ["Dosa with chutney and sambar", "1 large dosa", 390, 10, 58, 13],
    },
    {
      words: ["chicken curry"],
      data: ["Chicken curry", "1 bowl (250 g)", 360, 32, 12, 20],
    },
    {
      words: ["fried rice"],
      data: ["Fried rice", "1 plate (300 g)", 520, 14, 78, 17],
    },
    {
      words: ["paneer"],
      data: ["Paneer curry", "1 bowl (250 g)", 430, 24, 18, 29],
    },
    {
      words: ["egg"],
      data: ["Egg meal", "2 eggs", 160, 13, 2, 11],
    },
    {
      words: ["oats"],
      data: ["Oats", "1 bowl (250 g)", 300, 11, 48, 8],
    },
  ];

  const match = foods.find((item) =>
    item.words.some((word) => name.includes(word))
  );

  if (!match) {
    return null;
  }

  const [mealName, quantity, calories, protein, carbs, fat] = match.data;

  return {
    mealName,
    quantity,
    calories,
    protein,
    carbs,
    fat,
    confidence: 25,
    fallbackEstimate: true,
  };
}

async function analyzeWithModel(model, imageBuffer, mimeType, prompt) {
  const response = await generateWithRetry(
    () =>
      ai.models.generateContent({
        model,
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
          responseSchema: mealResponseSchema,
          temperature: 0.1,
          maxOutputTokens: 700,
        },
      }),
    { attempts: 3, baseDelayMs: 1200 }
  );

  return extractJsonObject(extractResponseText(response));
}

export async function analyzeFoodImage(imagePath, mimeType = "image/jpeg") {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing on the server.");
  }

  const fs = await import("fs/promises");
  const imageBuffer = await fs.readFile(imagePath);

  if (!imageBuffer.length) {
    throw new Error("Uploaded food image is empty.");
  }

  const safeMimeType =
    typeof mimeType === "string" && mimeType.startsWith("image/")
      ? mimeType
      : "image/jpeg";

  const prompt = `
Identify the food shown in this photo and estimate nutrition for the complete visible serving.

Return:
- short meal name
- estimated visible quantity, such as "1 plate (350 g)"
- total calories
- protein in grams
- carbohydrates in grams
- fat in grams
- confidence from 0 to 100

Rules:
- Estimate the complete visible serving, not per 100 g.
- Identify Indian dishes and major visible components when possible.
- Use realistic whole-number estimates.
- If uncertain, still return a conservative estimate with lower confidence.
`;

  let lastError = null;

  for (const model of MODEL_CANDIDATES) {
    try {
      const parsed = await analyzeWithModel(
        model,
        imageBuffer,
        safeMimeType,
        prompt
      );

      return {
        mealName: String(parsed.mealName || "Detected meal").trim(),
        quantity: String(parsed.quantity || "1 serving").trim(),
        calories: numberOrZero(parsed.calories),
        protein: numberOrZero(parsed.protein),
        carbs: numberOrZero(parsed.carbs),
        fat: numberOrZero(parsed.fat),
        confidence: Math.min(100, numberOrZero(parsed.confidence)),
        fallbackEstimate: false,
      };
    } catch (error) {
      lastError = error;
      console.error(`Food analysis failed with ${model}:`, error.message);
    }
  }

  const fallback = filenameFallback(imagePath);

  if (fallback) {
    console.warn("Using filename-based nutrition estimate after Gemini failure.");
    return fallback;
  }

  const friendlyError = new Error(cleanGeminiError(lastError));
  friendlyError.status = 503;
  throw friendlyError;
}

const voiceMealResponseSchema = {
  type: "object",
  properties: {
    mealName: { type: "string" },
    quantity: { type: "string" },
    calories: { type: "number" },
    protein: { type: "number" },
    carbs: { type: "number" },
    fat: { type: "number" },
    confidence: { type: "number" },
  },
  required: [
    "mealName",
    "quantity",
    "calories",
    "protein",
    "carbs",
    "fat",
    "confidence",
  ],
  additionalProperties: false,
};

function normalizeVoiceText(value = "") {
  return String(value)
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 500);
}

function localVoiceMealFallback(spokenText = "") {
  const text = normalizeVoiceText(spokenText).toLowerCase();

  const knownMeals = [
    {
      terms: ["chicken biryani", "biryani"],
      result: {
        mealName: "Chicken biryani",
        quantity: text.match(/half/) ? "1/2 plate (200 g)" : "1 plate (350 g)",
        calories: text.match(/half/) ? 360 : 620,
        protein: text.match(/half/) ? 19 : 32,
        carbs: text.match(/half/) ? 45 : 78,
        fat: text.match(/half/) ? 12 : 20,
      },
    },
    {
      terms: ["boiled egg", "boiled eggs", "egg", "eggs"],
      result: {
        mealName: "Boiled eggs",
        quantity: text.match(/\b(three|3)\b/) ? "3 eggs" : text.match(/\b(one|1)\b/) ? "1 egg" : "2 eggs",
        calories: text.match(/\b(three|3)\b/) ? 234 : text.match(/\b(one|1)\b/) ? 78 : 156,
        protein: text.match(/\b(three|3)\b/) ? 19 : text.match(/\b(one|1)\b/) ? 6 : 13,
        carbs: 2,
        fat: text.match(/\b(three|3)\b/) ? 16 : text.match(/\b(one|1)\b/) ? 5 : 11,
      },
    },
    {
      terms: ["idli", "idly"],
      result: {
        mealName: "Idli with sambar",
        quantity: text.match(/\b(three|3)\b/) ? "3 idlis with sambar" : "4 idlis with sambar",
        calories: text.match(/\b(three|3)\b/) ? 330 : 410,
        protein: text.match(/\b(three|3)\b/) ? 11 : 14,
        carbs: text.match(/\b(three|3)\b/) ? 57 : 72,
        fat: text.match(/\b(three|3)\b/) ? 6 : 7,
      },
    },
    {
      terms: ["dosa"],
      result: {
        mealName: "Dosa with chutney and sambar",
        quantity: "1 large dosa",
        calories: 390,
        protein: 10,
        carbs: 58,
        fat: 13,
      },
    },
    {
      terms: ["grilled chicken", "chicken breast"],
      result: {
        mealName: "Grilled chicken",
        quantity: text.match(/200\s*(g|gram)/) ? "200 g" : "150 g",
        calories: text.match(/200\s*(g|gram)/) ? 330 : 248,
        protein: text.match(/200\s*(g|gram)/) ? 62 : 47,
        carbs: 0,
        fat: text.match(/200\s*(g|gram)/) ? 7 : 5,
      },
    },
    {
      terms: ["paneer"],
      result: {
        mealName: "Paneer meal",
        quantity: text.match(/200\s*(g|gram)/) ? "200 g" : "150 g",
        calories: text.match(/200\s*(g|gram)/) ? 530 : 400,
        protein: text.match(/200\s*(g|gram)/) ? 36 : 27,
        carbs: text.match(/200\s*(g|gram)/) ? 10 : 8,
        fat: text.match(/200\s*(g|gram)/) ? 40 : 30,
      },
    },
    {
      terms: ["banana"],
      result: {
        mealName: "Banana",
        quantity: text.match(/\b(two|2)\b/) ? "2 medium bananas" : "1 medium banana",
        calories: text.match(/\b(two|2)\b/) ? 210 : 105,
        protein: text.match(/\b(two|2)\b/) ? 3 : 1,
        carbs: text.match(/\b(two|2)\b/) ? 54 : 27,
        fat: 1,
      },
    },
    {
      terms: ["oats"],
      result: {
        mealName: "Oats",
        quantity: "1 bowl (250 g)",
        calories: 300,
        protein: 11,
        carbs: 48,
        fat: 8,
      },
    },
  ];

  const match = knownMeals.find((item) =>
    item.terms.some((term) => text.includes(term))
  );

  if (!match) {
    return null;
  }

  return {
    ...match.result,
    confidence: 35,
    fallbackEstimate: true,
  };
}

export async function analyzeVoiceMeal(spokenText) {
  const cleanText = normalizeVoiceText(spokenText);

  if (!cleanText) {
    const error = new Error("Please speak or enter a meal description.");
    error.status = 400;
    throw error;
  }

  const prompt = `
Convert this spoken meal description into a nutrition estimate for LeanFit:

"${cleanText}"

Return one JSON object containing:
- mealName: short clear meal name
- quantity: estimated total serving
- calories: total calories for the serving
- protein: grams
- carbs: grams
- fat: grams
- confidence: integer from 0 to 100

Rules:
- Interpret natural phrases such as "one plate", "two eggs", "200 grams", and Indian meal names.
- Include all foods mentioned in the combined meal.
- Estimate the whole spoken serving, not per 100 g.
- Use realistic whole numbers.
- Return no explanation.
`;

  let lastError = null;

  for (const model of MODEL_CANDIDATES) {
    try {
      const response = await generateWithRetry(
        () =>
          ai.models.generateContent({
            model,
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: voiceMealResponseSchema,
              temperature: 0.1,
              maxOutputTokens: 700,
            },
          }),
        { attempts: 3, baseDelayMs: 1000 }
      );

      const parsed = extractJsonObject(extractResponseText(response));

      return {
        mealName: String(parsed.mealName || "Spoken meal").trim(),
        quantity: String(parsed.quantity || "1 serving").trim(),
        calories: numberOrZero(parsed.calories),
        protein: numberOrZero(parsed.protein),
        carbs: numberOrZero(parsed.carbs),
        fat: numberOrZero(parsed.fat),
        confidence: Math.min(100, numberOrZero(parsed.confidence)),
        fallbackEstimate: false,
      };
    } catch (error) {
      lastError = error;
      console.error(`Voice meal analysis failed with ${model}:`, error.message);
    }
  }

  const fallback = localVoiceMealFallback(cleanText);

  if (fallback) {
    return fallback;
  }

  const friendlyError = new Error(cleanGeminiError(lastError));
  friendlyError.status = 503;
  throw friendlyError;
}

