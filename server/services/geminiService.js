import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function generateDietPlan(userData) {
  const prompt = `
You are a professional Indian dietician and fitness coach.

Generate a detailed personalized diet and workout plan.

User Details:

Name: ${userData.name}
Age: ${userData.age}
Gender: ${userData.gender}
Height: ${userData.height} cm
Weight: ${userData.weight} kg
Target Weight: ${userData.targetWeight} kg
Goal: ${userData.goal}
Activity Level: ${userData.activityLevel}
Experience: ${userData.experience}

Food Preferences:
${JSON.stringify(userData.foods)}

Habits:
Smoking: ${userData.smoking}
Alcohol: ${userData.alcohol}
Sleep: ${userData.sleep}
Stress: ${userData.stress}

Create:

1. Daily Calories
2. Protein / Carbs / Fat
3. Meal Plan
4. Workout Plan
5. Cardio
6. Recovery
7. Lifestyle Tips

Keep it practical for an Indian user.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text;
}