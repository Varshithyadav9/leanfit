
import DailyProgress from "../models/DailyProgress.js";
import { generateWeeklyProgressInsights } from "../services/geminiService.js";

export const saveProgress = async (req, res) => {
  try {
    const { email, date, meals, water, weight } = req.body;

    let progress = await DailyProgress.findOne({ email, date });

    if (!progress) {
      progress = new DailyProgress({
        email,
        date,
        meals: meals || [],
        water: water || 0,
        weight: weight || 0,
      });
    } else {
      progress.meals = meals || progress.meals;
      progress.water = water ?? progress.water;
      progress.weight = weight ?? progress.weight;
    }

    await progress.save();

    res.json({
      success: true,
      progress,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to save progress",
    });
  }
};

export const getProgress = async (req, res) => {
  try {
    const { email, date } = req.params;

    const progress = await DailyProgress.findOne({
      email,
      date,
    });

    res.json({
      success: true,
      progress,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to load progress",
    });
  }
};

export const getWeeklyProgress = async (req, res) => {
  try {
    const { email } = req.params;

    const history = await DailyProgress.find({ email })
      .sort({ date: -1 })
      .limit(7);

    res.json({
      success: true,
      history,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to load weekly progress",
    });
  }
};

const DAILY_GOALS = {
  calories: 2500,
  protein: 160,
  water: 3,
};

function round(value, digits = 0) {
  const number = Number(value || 0);
  const factor = 10 ** digits;
  return Math.round(number * factor) / factor;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function calculateWeeklySummary(history = []) {
  const orderedHistory = [...history].sort((a, b) =>
    String(a.date).localeCompare(String(b.date))
  );

  const totals = orderedHistory.reduce(
    (acc, day) => {
      const meals = Array.isArray(day.meals) ? day.meals : [];

      const dayTotals = meals.reduce(
        (mealAcc, meal) => ({
          calories: mealAcc.calories + Number(meal.calories || 0),
          protein: mealAcc.protein + Number(meal.protein || 0),
          carbs: mealAcc.carbs + Number(meal.carbs || 0),
          fat: mealAcc.fat + Number(meal.fat || 0),
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      );

      acc.calories += dayTotals.calories;
      acc.protein += dayTotals.protein;
      acc.carbs += dayTotals.carbs;
      acc.fat += dayTotals.fat;
      acc.water += Number(day.water || 0);
      acc.meals += meals.length;

      return acc;
    },
    {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      water: 0,
      meals: 0,
    }
  );

  const daysLogged = orderedHistory.length;
  const divisor = Math.max(daysLogged, 1);

  const weights = orderedHistory
    .map((day) => ({
      date: day.date,
      weight: Number(day.weight || 0),
    }))
    .filter((item) => item.weight > 0);

  const startingWeight = weights.length ? weights[0].weight : 0;
  const endingWeight = weights.length ? weights[weights.length - 1].weight : 0;
  const weightChange =
    startingWeight > 0 && endingWeight > 0
      ? round(endingWeight - startingWeight, 2)
      : 0;

  const averageCalories = round(totals.calories / divisor);
  const averageProtein = round(totals.protein / divisor, 1);
  const averageCarbs = round(totals.carbs / divisor, 1);
  const averageFat = round(totals.fat / divisor, 1);
  const averageWater = round(totals.water / divisor, 2);

  const calorieGoalPercent =
    averageCalories > 0
      ? round((averageCalories / DAILY_GOALS.calories) * 100)
      : 0;
  const proteinGoalPercent =
    averageProtein > 0
      ? round((averageProtein / DAILY_GOALS.protein) * 100)
      : 0;
  const waterGoalPercent =
    averageWater > 0
      ? round((averageWater / DAILY_GOALS.water) * 100)
      : 0;

  const loggingScore = clamp((daysLogged / 7) * 30, 0, 30);
  const proteinScore = clamp((proteinGoalPercent / 100) * 25, 0, 25);
  const waterScore = clamp((waterGoalPercent / 100) * 20, 0, 20);

  const calorieDistance = Math.abs(calorieGoalPercent - 100);
  const calorieScore =
    averageCalories > 0 ? clamp(20 - calorieDistance * 0.35, 0, 20) : 0;

  const weightScore = weights.length >= 2 ? 5 : weights.length === 1 ? 2 : 0;

  const score = Math.round(
    loggingScore + proteinScore + waterScore + calorieScore + weightScore
  );

  return {
    period: {
      from: orderedHistory[0]?.date || "",
      to: orderedHistory[orderedHistory.length - 1]?.date || "",
    },
    daysLogged,
    mealsLogged: totals.meals,
    averageCalories,
    averageProtein,
    averageCarbs,
    averageFat,
    averageWater,
    startingWeight: round(startingWeight, 2),
    endingWeight: round(endingWeight, 2),
    weightChange,
    calorieGoal: DAILY_GOALS.calories,
    proteinGoal: DAILY_GOALS.protein,
    waterGoal: DAILY_GOALS.water,
    calorieGoalPercent,
    proteinGoalPercent,
    waterGoalPercent,
    score: clamp(score, 0, 100),
  };
}

export const getWeeklyReport = async (req, res) => {
  try {
    const email = String(req.params.email || "").trim().toLowerCase();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const history = await DailyProgress.find({ email })
      .sort({ date: -1 })
      .limit(7)
      .lean();

    const summary = calculateWeeklySummary(history);
    const insights = await generateWeeklyProgressInsights(summary);

    return res.json({
      success: true,
      report: {
        ...summary,
        ...insights,
      },
    });
  } catch (error) {
    console.error("Unable to generate weekly report:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to generate weekly report.",
    });
  }
};

