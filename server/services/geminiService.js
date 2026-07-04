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