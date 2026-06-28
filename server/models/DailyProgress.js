import mongoose from "mongoose";

const dailyProgressSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    meals: [
      {
        mealName: String,
        quantity: String,
        calories: Number,
        protein: Number,
        carbs: Number,
        fat: Number,
      },
    ],

    water: {
      type: Number,
      default: 0,
    },

    weight: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("DailyProgress", dailyProgressSchema);