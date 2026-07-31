import PDFDocument from "pdfkit";
import {
  getMealTemplate,
  proteinAlternatives,
  carbAlternatives,
  vegetables,
  fruits,
} from "../data/mealTemplates.js";
import { getWorkoutPlan } from "../data/workoutTemplates.js";

const COLORS = {
  green: "#16a34a",
  greenLight: "#dcfce7",
  dark: "#111827",
  text: "#374151",
  muted: "#6b7280",
  light: "#f9fafb",
  border: "#d1d5db",
  white: "#ffffff",
  amber: "#f59e0b",
  blue: "#2563eb",
};

const PAGE = {
  width: 595.28,
  height: 841.89,
  left: 40,
  right: 555,
  top: 105,
  bottom: 790,
};

function safeText(value, fallback = "-") {
  if (value === null || value === undefined || value === "") return fallback;
  return String(value);
}

function cleanLine(value = "") {
  return safeText(value, "")
    .replace(/\s+/g, " ")
    .replace(/^[•\-–—]\s*/, "")
    .trim();
}

const SAFE_MEAL_FALLBACKS = [
  "Dal 250 g cooked + rice 180 g cooked + mixed vegetables",
  "Soya chunks 70 g dry + 2 rotis + salad",
  "Black chana 180 g cooked + rice 150 g cooked",
  "Rajma 180 g cooked + 2 rotis + vegetables",
  "Oats 70 g + milk 250 ml + banana",
  "Roasted chana 50 g + fruit + buttermilk",
];

function getAvoidedFoods(userData = {}) {
  const foods = userData.foods && typeof userData.foods === "object"
    ? userData.foods
    : {};

  return Object.entries(foods)
    .filter(([, preference]) =>
      String(preference || "").toLowerCase().includes("avoid")
    )
    .map(([food]) => String(food).toLowerCase().trim())
    .filter(Boolean);
}

function optionContainsAvoidedFood(option, avoidedFoods = []) {
  const text = String(option || "").toLowerCase();

  return avoidedFoods.some((food) => {
    const aliases = [food];

    if (food === "soy") aliases.push("soya");
    if (food === "whey protein") aliases.push("whey");
    if (food === "roti") aliases.push("chapati", "chapatis");
    if (food === "eggs") aliases.push("egg");
    if (food === "milk") aliases.push("dairy milk");

    return aliases.some((alias) => text.includes(alias));
  });
}

function sanitizeOptions(options = [], avoidedFoods = []) {
  const allowed = options.filter(
    (option) => !optionContainsAvoidedFood(option, avoidedFoods)
  );

  for (const fallback of SAFE_MEAL_FALLBACKS) {
    if (allowed.length >= 3) break;
    if (
      !optionContainsAvoidedFood(fallback, avoidedFoods) &&
      !allowed.includes(fallback)
    ) {
      allowed.push(fallback);
    }
  }

  while (allowed.length < 3) {
    allowed.push("Choose a similar preferred food with the same portion size");
  }

  return allowed.slice(0, 3);
}

function sanitizeMealPlan(meals = [], userData = {}) {
  const avoidedFoods = getAvoidedFoods(userData);

  if (!avoidedFoods.length) return meals;

  return meals.map((meal) => ({
    ...meal,
    options: sanitizeOptions(meal.options, avoidedFoods),
  }));
}

function normalizeGoal(goal = "") {
  const value = String(goal).toLowerCase();

  if (
    value.includes("muscle") ||
    value.includes("bulk") ||
    value.includes("gain")
  ) {
    return "muscleGain";
  }

  if (
    value.includes("fat") ||
    value.includes("loss") ||
    value.includes("cut")
  ) {
    return "fatLoss";
  }

  return "generalFitness";
}

function caloriesByGoal(goal = "") {
  const normalized = normalizeGoal(goal);

  if (normalized === "fatLoss") {
    return {
      calories: "1800–2200 kcal",
      protein: "120–160 g",
      carbs: "170–240 g",
      fats: "50–70 g",
    };
  }

  if (normalized === "muscleGain") {
    return {
      calories: "2400–2800 kcal",
      protein: "120–160 g",
      carbs: "280–380 g",
      fats: "60–85 g",
    };
  }

  return {
    calories: "2100–2500 kcal",
    protein: "110–150 g",
    carbs: "220–320 g",
    fats: "55–80 g",
  };
}

function addHeader(doc, title, orderId) {
  doc
    .font("Helvetica-Bold")
    .fontSize(25)
    .fillColor(COLORS.green)
    .text("LEANFIT", PAGE.left, 34);

  doc
    .font("Helvetica-Bold")
    .fontSize(13)
    .fillColor(COLORS.dark)
    .text(title, PAGE.left, 70);

  doc
    .font("Helvetica")
    .fontSize(8.5)
    .fillColor(COLORS.muted)
    .text(`Plan ID: ${safeText(orderId)}`, 380, 45, {
      width: 175,
      align: "right",
    });

  doc
    .moveTo(PAGE.left, 95)
    .lineTo(PAGE.right, 95)
    .strokeColor(COLORS.border)
    .stroke();
}

function addFooter(doc, page, total) {
  const originalBottomMargin = doc.page.margins.bottom;
  doc.page.margins.bottom = 0;

  doc.save();

  doc
    .moveTo(PAGE.left, 790)
    .lineTo(PAGE.right, 790)
    .strokeColor(COLORS.border)
    .stroke();

  doc
    .font("Helvetica")
    .fontSize(8)
    .fillColor(COLORS.muted)
    .text("@lean_varshith", PAGE.left, 799, {
      width: 180,
      height: 12,
      lineBreak: false,
    });

  doc.text(`Page ${page} of ${total}`, 430, 799, {
    width: 125,
    height: 12,
    align: "right",
    lineBreak: false,
  });

  doc.restore();
  doc.page.margins.bottom = originalBottomMargin;
}

function sectionTitle(doc, text, y) {
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor(COLORS.dark)
    .text(text, PAGE.left, y);

  return y + 20;
}

function infoBox(doc, x, y, width, label, value) {
  doc
    .roundedRect(x, y, width, 47, 6)
    .fillAndStroke(COLORS.light, COLORS.border);

  doc
    .font("Helvetica-Bold")
    .fontSize(8)
    .fillColor(COLORS.muted)
    .text(label, x + 10, y + 9, { width: width - 20 });

  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor(COLORS.dark)
    .text(safeText(value), x + 10, y + 24, {
      width: width - 20,
      ellipsis: true,
    });
}

function extractSection(planText = "", heading = "") {
  const text = String(planText || "");
  if (!text || !heading) return "";

  const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(
    `${escapedHeading}\\s*:?\\s*([\\s\\S]*?)(?=\\n\\s*\\d+\\)|\\n\\s*[A-Z][A-Z &/]+\\s*:|$)`,
    "i"
  );

  const match = text.match(pattern);
  return match ? match[1].trim() : "";
}

function drawParagraph(doc, text, y, options = {}) {
  const width = options.width || 515;
  const fontSize = options.fontSize || 8.5;
  const lineGap = options.lineGap || 3;

  doc
    .font(options.bold ? "Helvetica-Bold" : "Helvetica")
    .fontSize(fontSize)
    .fillColor(options.color || COLORS.text)
    .text(safeText(text, ""), PAGE.left, y, {
      width,
      lineGap,
    });

  return doc.y;
}

function normalizeOption(option) {
  if (typeof option === "string") {
    return cleanLine(option);
  }

  if (Array.isArray(option)) {
    return option.map(normalizeOption).filter(Boolean).join(" + ");
  }

  if (option && typeof option === "object") {
    const preferredKeys = [
      "meal",
      "name",
      "title",
      "option",
      "food",
      "items",
      "description",
      "text",
    ];

    for (const key of preferredKeys) {
      if (option[key]) {
        const main = normalizeOption(option[key]);
        const qty = option.quantity || option.qty || option.amount || "";
        return cleanLine(qty ? `${main} (${qty})` : main);
      }
    }

    return Object.values(option)
      .map(normalizeOption)
      .filter(Boolean)
      .join(" + ");
  }

  return "";
}

function toOptions(value) {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.map(normalizeOption).filter(Boolean);
  }

  if (typeof value === "object") {
    const optionKeys = [
      "options",
      "choices",
      "meals",
      "items",
      "alternatives",
      "variants",
    ];

    for (const key of optionKeys) {
      if (Array.isArray(value[key])) {
        return value[key].map(normalizeOption).filter(Boolean);
      }
    }

    const abc = ["optionA", "optionB", "optionC", "a", "b", "c"]
      .map((key) => value[key])
      .filter(Boolean)
      .map(normalizeOption)
      .filter(Boolean);

    if (abc.length) return abc;

    const normalized = normalizeOption(value);
    return normalized ? [normalized] : [];
  }

  const normalized = normalizeOption(value);
  return normalized ? [normalized] : [];
}

function findMealSource(template, keys) {
  if (!template || typeof template !== "object") return null;

  for (const key of keys) {
    if (template[key]) return template[key];
  }

  const entries = Object.entries(template);
  for (const [key, value] of entries) {
    const normalizedKey = key.toLowerCase().replace(/[\s_-]/g, "");
    if (
      keys.some(
        (candidate) =>
          normalizedKey ===
          candidate.toLowerCase().replace(/[\s_-]/g, "")
      )
    ) {
      return value;
    }
  }

  return null;
}

function pickThree(options, fallback) {
  const combined = [...toOptions(options), ...fallback.map(cleanLine)].filter(
    Boolean
  );

  const unique = [];
  for (const option of combined) {
    if (!unique.includes(option)) unique.push(option);
    if (unique.length === 3) break;
  }

  while (unique.length < 3) {
    unique.push("Choose a similar food with the same portion size");
  }

  return unique;
}

function buildMealPlan(userData = {}) {
  const goalKey = normalizeGoal(userData.goal);
  let template = {};

  try {
    template = getMealTemplate(goalKey, userData) || {};
  } catch {
    try {
      template = getMealTemplate(userData.goal || goalKey) || {};
    } catch {
      template = {};
    }
  }

  const defaults = {
    breakfast: [
      "Oats 70 g + milk 250 ml + 1 banana",
      "3 idlis + sambar + 2 whole eggs",
      "Vegetable poha 200 g + curd 150 g",
    ],
    lunch: [
      "Rice 180 g cooked + chicken 150 g + vegetables",
      "3 rotis + paneer 150 g + salad",
      "Rice 180 g cooked + dal 250 g + curd 150 g",
    ],
    preWorkout: [
      "1 banana + black coffee",
      "2 bread slices + peanut butter 1 tbsp",
      "Sweet potato 200 g + curd 100 g",
    ],
    postWorkout: [
      "4 eggs + 1 banana",
      "Chicken 150 g + rice 150 g cooked",
      "Paneer 150 g + 2 rotis",
    ],
    snack: [
      "Curd 200 g + fruit",
      "Roasted chana 50 g + buttermilk",
      "Sprouts chaat 180 g",
    ],
    dinner: [
      "3 rotis + chicken 150 g + vegetables",
      "Rice 150 g cooked + fish 150 g + salad",
      "Paneer 150 g + vegetables + 2 rotis",
    ],
  };

  const meals = [
    {
      title: "Breakfast",
      time: "7:00–9:00 AM",
      accent: COLORS.green,
      options: pickThree(
        findMealSource(template, [
          "breakfast",
          "morningMeal",
          "meal1",
          "breakfastOptions",
        ]),
        defaults.breakfast
      ),
      tip: "Start the day with protein and a steady carbohydrate source.",
    },
    {
      title: "Lunch",
      time: "12:30–2:30 PM",
      accent: COLORS.green,
      options: pickThree(
        findMealSource(template, [
          "lunch",
          "middayMeal",
          "meal2",
          "lunchOptions",
        ]),
        defaults.lunch
      ),
      tip: "Keep vegetables or salad with the meal for fibre and fullness.",
    },
    {
      title: "Pre-Workout Meal",
      time: "45–90 min before training",
      accent: COLORS.amber,
      options: pickThree(
        findMealSource(template, [
          "preWorkout",
          "preworkout",
          "preWorkoutMeal",
          "beforeWorkout",
          "preWorkoutOptions",
        ]),
        defaults.preWorkout
      ),
      tip: "Choose one light option. Avoid very oily food before training.",
    },
    {
      title: "Post-Workout Meal",
      time: "Within 1–2 hours after training",
      accent: COLORS.blue,
      options: pickThree(
        findMealSource(template, [
          "postWorkout",
          "postworkout",
          "postWorkoutMeal",
          "afterWorkout",
          "postWorkoutOptions",
        ]),
        defaults.postWorkout
      ),
      tip: "Combine protein with carbohydrates to support recovery.",
    },
    {
      title: "Snack",
      time: "4:00–6:30 PM",
      accent: COLORS.green,
      options: pickThree(
        findMealSource(template, [
          "snack",
          "eveningSnack",
          "snacks",
          "meal3",
          "snackOptions",
        ]),
        defaults.snack
      ),
      tip: "Use this meal to control hunger and maintain daily protein intake.",
    },
    {
      title: "Dinner",
      time: "7:30–9:30 PM",
      accent: COLORS.green,
      options: pickThree(
        findMealSource(template, [
          "dinner",
          "nightMeal",
          "meal4",
          "dinnerOptions",
        ]),
        defaults.dinner
      ),
      tip: "Keep the meal balanced and finish it 1–2 hours before sleep.",
    },
  ];

  return sanitizeMealPlan(meals, userData);
}

function measureMealCard(doc, meal) {
  const optionWidth = 470;
  let optionsHeight = 0;

  meal.options.forEach((option, index) => {
    optionsHeight += doc.heightOfString(
      `Option ${String.fromCharCode(65 + index)}: ${option}`,
      {
        width: optionWidth,
        lineGap: 2,
      }
    );
    optionsHeight += 7;
  });

  const tipHeight = doc.heightOfString(meal.tip, {
    width: 470,
    lineGap: 2,
  });

  return Math.max(145, 53 + optionsHeight + tipHeight + 22);
}

function drawMealCard(doc, meal, y) {
  doc.font("Helvetica").fontSize(8.5);
  const height = measureMealCard(doc, meal);

  doc
    .roundedRect(PAGE.left, y, 515, height, 8)
    .fillAndStroke(COLORS.white, COLORS.border);

  doc
    .roundedRect(PAGE.left, y, 7, height, 4)
    .fill(meal.accent || COLORS.green);

  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor(COLORS.dark)
    .text(meal.title, PAGE.left + 18, y + 13, {
      width: 285,
    });

  doc
    .font("Helvetica")
    .fontSize(8)
    .fillColor(COLORS.muted)
    .text(meal.time, PAGE.left + 315, y + 15, {
      width: 220,
      align: "right",
    });

  let cy = y + 39;

  meal.options.forEach((option, index) => {
    const prefix = `Option ${String.fromCharCode(65 + index)}:`;

    doc
      .font("Helvetica-Bold")
      .fontSize(8.5)
      .fillColor(COLORS.dark)
      .text(prefix, PAGE.left + 18, cy, {
        width: 60,
      });

    doc
      .font("Helvetica")
      .fontSize(8.5)
      .fillColor(COLORS.text)
      .text(option, PAGE.left + 78, cy, {
        width: 445,
        lineGap: 2,
      });

    cy = Math.max(doc.y, cy + 15) + 6;
  });

  doc
    .roundedRect(PAGE.left + 16, cy + 1, 483, 26, 5)
    .fill(COLORS.light);

  doc
    .font("Helvetica-Bold")
    .fontSize(7.5)
    .fillColor(COLORS.green)
    .text("COACH TIP", PAGE.left + 24, cy + 9, {
      width: 58,
    });

  doc
    .font("Helvetica")
    .fontSize(7.5)
    .fillColor(COLORS.text)
    .text(meal.tip, PAGE.left + 84, cy + 8, {
      width: 402,
      lineGap: 1,
    });

  return y + height + 12;
}

function normalizeAlternativeRows(source, fallbackRows) {
  if (!source) return fallbackRows;

  if (Array.isArray(source)) {
    const rows = source
      .map((item) => {
        if (typeof item === "string") {
          return { food: cleanLine(item), qty: "Use equivalent serving" };
        }

        if (item && typeof item === "object") {
          return {
            food: safeText(
              item.food || item.name || item.title || item.option,
              "Food option"
            ),
            qty: safeText(
              item.quantity || item.qty || item.amount || item.serving,
              "Use equivalent serving"
            ),
          };
        }

        return null;
      })
      .filter(Boolean);

    return rows.length ? rows.slice(0, 9) : fallbackRows;
  }

  if (typeof source === "object") {
    const rows = Object.entries(source).map(([food, qty]) => ({
      food: cleanLine(food),
      qty: normalizeOption(qty) || "Use equivalent serving",
    }));

    return rows.length ? rows.slice(0, 9) : fallbackRows;
  }

  return fallbackRows;
}

function basicTable(doc, x, y, columns, rows, rowHeight = 30) {
  let currentX = x;

  columns.forEach((column) => {
    doc
      .rect(currentX, y, column.width, 28)
      .fillAndStroke(COLORS.green, COLORS.green);

    doc
      .font("Helvetica-Bold")
      .fontSize(8)
      .fillColor(COLORS.white)
      .text(column.label, currentX + 6, y + 9, {
        width: column.width - 12,
      });

    currentX += column.width;
  });

  let currentY = y + 28;

  rows.forEach((row, index) => {
    currentX = x;

    columns.forEach((column) => {
      doc
        .rect(currentX, currentY, column.width, rowHeight)
        .fillAndStroke(
          index % 2 === 0 ? COLORS.white : COLORS.light,
          COLORS.border
        );

      doc
        .font("Helvetica")
        .fontSize(7.7)
        .fillColor(COLORS.dark)
        .text(safeText(row[column.key], ""), currentX + 6, currentY + 8, {
          width: column.width - 12,
          height: rowHeight - 12,
          ellipsis: true,
        });

      currentX += column.width;
    });

    currentY += rowHeight;
  });

  return currentY;
}

function drawDietOverviewPage(
  doc,
  userData,
  planText,
  orderId,
  mealPlan,
  page,
  total
) {
  addHeader(doc, "Personalized Diet Plan", orderId);

  let y = 115;
  const boxGap = 8;
  const boxWidth = (515 - boxGap * 4) / 5;

  infoBox(doc, PAGE.left, y, boxWidth, "NAME", userData.name || "Customer");
  infoBox(
    doc,
    PAGE.left + (boxWidth + boxGap),
    y,
    boxWidth,
    "AGE",
    userData.age || "-"
  );
  infoBox(
    doc,
    PAGE.left + (boxWidth + boxGap) * 2,
    y,
    boxWidth,
    "HEIGHT",
    userData.height ? `${userData.height} cm` : "-"
  );
  infoBox(
    doc,
    PAGE.left + (boxWidth + boxGap) * 3,
    y,
    boxWidth,
    "WEIGHT",
    userData.weight ? `${userData.weight} kg` : "-"
  );
  infoBox(
    doc,
    PAGE.left + (boxWidth + boxGap) * 4,
    y,
    boxWidth,
    "GOAL",
    userData.goal || "-"
  );

  y += 66;

  const snapshot = extractSection(planText, "PERSON SNAPSHOT");
  const strategy = extractSection(planText, "GOAL STRATEGY");

  if (snapshot || strategy) {
    y = sectionTitle(doc, "Plan Overview", y);

    if (snapshot) {
      y = drawParagraph(doc, snapshot, y, {
        width: 515,
        fontSize: 8.5,
      });
      y += 8;
    }

    if (strategy) {
      y = drawParagraph(doc, strategy, y, {
        width: 515,
        fontSize: 8.5,
      });
      y += 10;
    }
  }

  y = sectionTitle(doc, "Daily Calorie & Macro Target", y);
  const macros = caloriesByGoal(userData.goal);

  y = basicTable(
    doc,
    PAGE.left,
    y,
    [
      { label: "Calories", key: "calories", width: 130 },
      { label: "Protein", key: "protein", width: 128 },
      { label: "Carbohydrates", key: "carbs", width: 130 },
      { label: "Fats", key: "fats", width: 127 },
    ],
    [macros],
    34
  );

  y += 18;

  y = sectionTitle(doc, "Meal Plan — First Half", y);
  y = drawMealCard(doc, mealPlan[0], y);
  drawMealCard(doc, mealPlan[1], y);

  doc
    .font("Helvetica-Bold")
    .fontSize(8)
    .fillColor(COLORS.dark)
    .text(
      "Choose only ONE option from each meal card. Portions can be adjusted later based on progress.",
      PAGE.left,
      735,
      { width: 515 }
    );

  addFooter(doc, page, total);
}

function drawWorkoutNutritionPage(doc, orderId, mealPlan, page, total) {
  addHeader(doc, "Workout Nutrition & Remaining Meals", orderId);

  let y = 115;

  y = sectionTitle(doc, "Around Your Workout", y);
  y = drawMealCard(doc, mealPlan[2], y);
  y = drawMealCard(doc, mealPlan[3], y);

  y += 2;
  y = sectionTitle(doc, "Later Meals", y);
  y = drawMealCard(doc, mealPlan[4], y);
  drawMealCard(doc, mealPlan[5], y);

  addFooter(doc, page, total);
}

function drawFoodGuidePage(doc, userData, planText, orderId, page, total) {
  addHeader(doc, "Food Alternatives & Practical Notes", orderId);

  const proteinFallback = [
    { food: "Chicken breast", qty: "150 g cooked" },
    { food: "Fish", qty: "150 g cooked" },
    { food: "Paneer", qty: "150 g" },
    { food: "Whole eggs", qty: "4 eggs" },
    { food: "Soya chunks", qty: "70 g dry" },
    { food: "Black chana", qty: "180 g cooked" },
    { food: "Rajma", qty: "180 g cooked" },
    { food: "Moong dal", qty: "250 g cooked" },
  ];

  const carbFallback = [
    { food: "Rice", qty: "180 g cooked" },
    { food: "Chapati", qty: "3 medium" },
    { food: "Oats", qty: "70 g dry" },
    { food: "Poha", qty: "180–200 g cooked" },
    { food: "Upma", qty: "180–200 g cooked" },
    { food: "Sweet potato", qty: "200–250 g" },
    { food: "Idli", qty: "3 pieces" },
  ];

  const avoidedFoods = getAvoidedFoods(userData);

  const proteinRows = normalizeAlternativeRows(
    proteinAlternatives,
    proteinFallback
  ).filter((row) => !optionContainsAvoidedFood(row.food, avoidedFoods));

  const carbRows = normalizeAlternativeRows(
    carbAlternatives,
    carbFallback
  ).filter((row) => !optionContainsAvoidedFood(row.food, avoidedFoods));

  const vegetableList = toOptions(vegetables).slice(0, 10);
  const fruitList = toOptions(fruits).slice(0, 10);

  const wheyAvoided = avoidedFoods.some((food) => food.includes("whey"));

  const supplementUse = wheyAvoided
    ? "Whey protein has been excluded because it was marked Avoid. Supplements are optional; use preferred whole-food protein sources instead."
    : extractSection(planText, "SUPPLEMENT USE") ||
      "Supplements are optional. A consistent diet made from normal foods is enough for most users.";

  const lifestyleTips =
    extractSection(planText, "HABIT & LIFESTYLE TIPS") ||
    extractSection(planText, "LIFESTYLE TIPS") ||
    "Drink 3–4 litres of water, sleep 7–8 hours, prepare simple meals in advance and track body weight once per week.";

  let y = 115;

  y = sectionTitle(doc, "Protein Replacement Options", y);
  y = basicTable(
    doc,
    PAGE.left,
    y,
    [
      { label: "Food", key: "food", width: 265 },
      { label: "Equivalent Quantity", key: "qty", width: 250 },
    ],
    proteinRows,
    24
  );

  y += 9;
  y = sectionTitle(doc, "Carbohydrate Replacement Options", y);
  y = basicTable(
    doc,
    PAGE.left,
    y,
    [
      { label: "Food", key: "food", width: 265 },
      { label: "Equivalent Quantity", key: "qty", width: 250 },
    ],
    carbRows,
    24
  );

  y += 16;

  doc
    .roundedRect(PAGE.left, y, 250, 68, 7)
    .fillAndStroke(COLORS.light, COLORS.border);

  doc
    .font("Helvetica-Bold")
    .fontSize(9)
    .fillColor(COLORS.dark)
    .text("Vegetable choices", PAGE.left + 12, y + 11);

  doc
    .font("Helvetica")
    .fontSize(7.8)
    .fillColor(COLORS.text)
    .text(
      vegetableList.length
        ? vegetableList.join(", ")
        : "Beans, carrot, cucumber, spinach, tomato, capsicum, bottle gourd and mixed vegetables.",
      PAGE.left + 12,
      y + 29,
      { width: 226, lineGap: 2 }
    );

  doc
    .roundedRect(PAGE.left + 265, y, 250, 68, 7)
    .fillAndStroke(COLORS.light, COLORS.border);

  doc
    .font("Helvetica-Bold")
    .fontSize(9)
    .fillColor(COLORS.dark)
    .text("Fruit choices", PAGE.left + 277, y + 11);

  doc
    .font("Helvetica")
    .fontSize(7.8)
    .fillColor(COLORS.text)
    .text(
      fruitList.length
        ? fruitList.join(", ")
        : "Banana, apple, orange, papaya, guava, watermelon and seasonal fruits.",
      PAGE.left + 277,
      y + 29,
      { width: 226, lineGap: 2 }
    );

  y += 76;

  y = sectionTitle(doc, "Supplement Use", y);
  y = drawParagraph(doc, supplementUse, y, {
    width: 515,
    fontSize: 7.8,
    lineGap: 1.5,
  });

  y += 6;
  y = sectionTitle(doc, "Lifestyle Tips", y);
  drawParagraph(doc, lifestyleTips, y, {
    width: 515,
    fontSize: 7.6,
    lineGap: 1.5,
  });

  addFooter(doc, page, total);
}

function workoutSummaryRows(workoutPlan) {
  return workoutPlan.sessions.map((session) => ({
    day: session.day,
    focus: session.focus,
    exercises: session.exercises.map((item) => item.exercise).join(", "),
  }));
}

function drawWorkoutOverviewPage(doc, userData, orderId, page, total, workoutPlan) {
  addHeader(doc, "Personalized Workout Plan", orderId);

  let y = 115;
  const gap = 8;
  const boxWidth = (515 - gap * 4) / 5;

  infoBox(doc, PAGE.left, y, boxWidth, "LEVEL", String(workoutPlan.level).toUpperCase());
  infoBox(doc, PAGE.left + (boxWidth + gap), y, boxWidth, "DAYS", `${workoutPlan.days} / WEEK`);
  infoBox(doc, PAGE.left + (boxWidth + gap) * 2, y, boxWidth, "LOCATION", workoutPlan.location);
  infoBox(doc, PAGE.left + (boxWidth + gap) * 3, y, boxWidth, "DURATION", workoutPlan.duration);
  infoBox(doc, PAGE.left + (boxWidth + gap) * 4, y, boxWidth, "STYLE", workoutPlan.style);

  y += 66;
  y = sectionTitle(doc, "Weekly Training Split", y);
  y = basicTable(
    doc,
    PAGE.left,
    y,
    [
      { label: "Day", key: "day", width: 62 },
      { label: "Focus", key: "focus", width: 135 },
      { label: "Main Exercises", key: "exercises", width: 318 },
    ],
    workoutSummaryRows(workoutPlan),
    48
  );

  y += 18;
  y = sectionTitle(doc, "How To Use This Plan", y);
  const rules = workoutPlan.rules.slice(0, 5).map((rule, index) => ({
    number: String(index + 1),
    rule,
  }));
  basicTable(
    doc,
    PAGE.left,
    y,
    [
      { label: "#", key: "number", width: 35 },
      { label: "Training Rule", key: "rule", width: 480 },
    ],
    rules,
    41
  );

  addFooter(doc, page, total);
}

function drawCompactWorkoutBlock(doc, session, y) {
  const titleHeight = 30;
  const rowHeight = 31;
  const rows = Array.isArray(session.exercises) ? session.exercises : [];
  const tableHeight = 28 + rows.length * rowHeight;
  const blockHeight = titleHeight + tableHeight + 18;

  doc
    .roundedRect(PAGE.left, y, 515, titleHeight, 7)
    .fillAndStroke(COLORS.greenLight, COLORS.green);

  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .fillColor(COLORS.green)
    .text(`${safeText(session.day)} - ${safeText(session.focus)}`, PAGE.left + 12, y + 9, {
      width: 491,
    });

  basicTable(
    doc,
    PAGE.left,
    y + titleHeight + 6,
    [
      { label: "Exercise", key: "exercise", width: 365 },
      { label: "Sets", key: "sets", width: 70 },
      { label: "Reps", key: "reps", width: 80 },
    ],
    rows,
    rowHeight
  );

  return y + blockHeight;
}

function drawWorkoutPairPage(doc, sessions, orderId, page, total) {
  addHeader(doc, "Weekly Workout Schedule", orderId);

  let y = 112;

  sessions.forEach((session, index) => {
    y = drawCompactWorkoutBlock(doc, session, y);

    if (index < sessions.length - 1) {
      y += 14;
    }
  });

  doc
    .roundedRect(PAGE.left, 742, 515, 34, 6)
    .fillAndStroke(COLORS.light, COLORS.border);

  doc
    .font("Helvetica")
    .fontSize(8)
    .fillColor(COLORS.text)
    .text(
      "Rest guide: 60-90 seconds for isolation exercises and 2-3 minutes for heavy compound exercises.",
      PAGE.left + 12,
      754,
      { width: 491, align: "center" }
    );

  addFooter(doc, page, total);
}

function drawWorkoutRecoveryPagefunction drawWorkoutRecoveryPage(doc, userData, orderId, page, total, workoutPlan) {
  addHeader(doc, "Workout Guidance & Recovery", orderId);

  let y = 115;

  y = sectionTitle(doc, "Warm-up", y);
  y = basicTable(
    doc,
    PAGE.left,
    y,
    [
      { label: "Step", key: "step", width: 105 },
      { label: "Guideline", key: "guideline", width: 410 },
    ],
    [
      { step: "General", guideline: "Begin with 5-10 minutes of easy cardio and dynamic mobility." },
      { step: "Main lift", guideline: "Perform 2-3 lighter warm-up sets before the first heavy working set." },
      { step: "Preparation", guideline: "Use controlled repetitions and stop if movement causes sharp pain." },
    ],
    39
  );

  y += 15;
  y = sectionTitle(doc, "Progressive Overload", y);
  y = basicTable(
    doc,
    PAGE.left,
    y,
    [
      { label: "Step", key: "step", width: 70 },
      { label: "What To Do", key: "instruction", width: 445 },
    ],
    [
      { step: "1", instruction: "Start with a weight you can control at the lower end of the rep range." },
      { step: "2", instruction: "Add repetitions gradually while maintaining good technique." },
      { step: "3", instruction: "After reaching the top of the rep range for every set, add 2.5-5% weight." },
    ],
    43
  );

  y += 15;
  y = sectionTitle(doc, "Recovery & Coach Tips", y);
  basicTable(
    doc,
    PAGE.left,
    y,
    [
      { label: "Area", key: "area", width: 105 },
      { label: "Guideline", key: "guideline", width: 410 },
    ],
    [
      { area: "Sleep", guideline: "Aim for 7-9 hours each night to support recovery and performance." },
      { area: "Hydration", guideline: "Drink approximately 3-4 litres of water daily, adjusted for heat and activity." },
      { area: "Stretching", guideline: "Use 5-10 minutes of easy stretching after training." },
      { area: "Tracking", guideline: "Record weights and repetitions so progress is easy to review." },
      { area: "Pain", guideline: `Current limitation: ${userData.injuryLimitations || "None reported"}. Stop movements that cause sharp or worsening pain.` },
    ],
    45
  );

  addFooter(doc, page, total);
}

function drawRecoveryPagefunction drawRecoveryPage(doc, orderId, page, total) {
  addHeader(doc, "Recovery & Progress Checklist", orderId);

  let y = 115;

  y = sectionTitle(doc, "Daily Checklist", y);
  y = basicTable(
    doc,
    PAGE.left,
    y,
    [{ label: "Checklist", key: "item", width: 515 }],
    [
      { item: "[ ] Complete the planned meals" },
      { item: "[ ] Reach the daily protein target" },
      { item: "[ ] Drink 3–4 litres of water" },
      { item: "[ ] Complete the workout or daily walk" },
      { item: "[ ] Sleep 7–8 hours" },
      { item: "[ ] Record body weight only once per week" },
    ],
    38
  );

  y += 28;

  y = sectionTitle(doc, "Important Reminders", y);
  y = basicTable(
    doc,
    PAGE.left,
    y,
    [{ label: "Reminder", key: "tip", width: 515 }],
    [
      {
        tip: "Choose one option from each meal card; alternatives are replacements, not extra meals.",
      },
      {
        tip: "Use affordable foods and repeat meals when that makes consistency easier.",
      },
      {
        tip: "Adjust portions only after checking progress for at least 2–3 weeks.",
      },
      {
        tip: "A missed meal or workout does not ruin progress—continue from the next one.",
      },
      {
        tip: "For pain, illness, allergies or medical conditions, consult a qualified professional.",
      },
    ],
    42
  );

  y += 28;

  doc
    .roundedRect(PAGE.left, y, 515, 92, 8)
    .fillAndStroke(COLORS.greenLight, COLORS.green);

  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor(COLORS.green)
    .text("Consistency beats perfection", PAGE.left + 16, y + 15);

  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor(COLORS.dark)
    .text(
      "Follow the plan most of the time, train safely and review your weekly progress. Small improvements repeated for several weeks create meaningful results.",
      PAGE.left + 16,
      y + 39,
      { width: 483, lineGap: 3 }
    );

  addFooter(doc, page, total);
}

export function createPlanPDF(userData = {}, planText = "", orderId = "") {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 40,
      autoFirstPage: true,
      bufferPages: false,
    });

    const buffers = [];

    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    try {
      const selectedPlan = String(userData.selectedPlan || "")
        .toLowerCase()
        .trim();

      const dietOnly =
        selectedPlan.includes("diet") && !selectedPlan.includes("workout");

      const workoutOnly =
        selectedPlan.includes("workout") && !selectedPlan.includes("diet");

      const mealPlan = buildMealPlan(userData);

      const workoutPlan = getWorkoutPlan(userData);

      if (dietOnly) {
        const total = 3;

        drawDietOverviewPage(
          doc,
          userData,
          planText,
          orderId,
          mealPlan,
          1,
          total
        );

        doc.addPage();
        drawWorkoutNutritionPage(doc, orderId, mealPlan, 2, total);

        doc.addPage();
        drawFoodGuidePage(doc, userData, planText, orderId, 3, total);
      } else if (workoutOnly) {
        const workoutPairs = [];
        for (let index = 0; index < workoutPlan.sessions.length; index += 2) {
          workoutPairs.push(workoutPlan.sessions.slice(index, index + 2));
        }

        const total = workoutPairs.length + 2;
        let page = 1;

        drawWorkoutOverviewPage(doc, userData, orderId, page, total, workoutPlan);

        for (const pair of workoutPairs) {
          doc.addPage();
          page += 1;
          drawWorkoutPairPage(doc, pair, orderId, page, total);
        }

        doc.addPage();
        page += 1;
        drawWorkoutRecoveryPage(doc, userData, orderId, page, total, workoutPlan);
      } else {
        const workoutPairs = [];
        for (let index = 0; index < workoutPlan.sessions.length; index += 2) {
          workoutPairs.push(workoutPlan.sessions.slice(index, index + 2));
        }

        const total = 3 + workoutPairs.length + 2;
        let page = 1;

        drawDietOverviewPage(
          doc,
          userData,
          planText,
          orderId,
          mealPlan,
          page,
          total
        );

        doc.addPage();
        page += 1;
        drawWorkoutNutritionPage(doc, orderId, mealPlan, page, total);

        doc.addPage();
        page += 1;
        drawFoodGuidePage(doc, userData, planText, orderId, page, total);

        doc.addPage();
        page += 1;
        drawWorkoutOverviewPage(doc, userData, orderId, page, total, workoutPlan);

        for (const pair of workoutPairs) {
          doc.addPage();
          page += 1;
          drawWorkoutPairPage(doc, pair, orderId, page, total);
        }

        doc.addPage();
        page += 1;
        drawWorkoutRecoveryPage(doc, userData, orderId, page, total, workoutPlan);
      }

      doc.end();
    } catch (error) {
      doc.destroy();
      reject(error);
    }
  });
}

export function createPlanPDFV2(userData = {}, orderId = "") {
  return createPlanPDF(userData, "", orderId);
}
