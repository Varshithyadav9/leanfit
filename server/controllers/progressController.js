
import DailyProgress from "../models/DailyProgress.js";

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