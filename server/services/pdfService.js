import PDFDocument from "pdfkit";

const COLORS = {
  green: "#16a34a",
  dark: "#111827",
  text: "#374151",
  light: "#f9fafb",
  border: "#d1d5db",
  white: "#ffffff",
};

function addHeader(doc, title, orderId) {
  doc.font("Helvetica-Bold").fontSize(26).fillColor(COLORS.green).text("LEANFIT", 40, 35);
  doc.font("Helvetica-Bold").fontSize(14).fillColor(COLORS.dark).text(title, 40, 70);
  doc.font("Helvetica").fontSize(9).fillColor(COLORS.text).text(`Plan ID: ${orderId}`, 400, 45, {
    width: 150,
    align: "right",
  });
  doc.moveTo(40, 95).lineTo(555, 95).strokeColor(COLORS.border).stroke();
}

function addFooter(doc, page, total) {
  doc.moveTo(40, 790).lineTo(555, 790).strokeColor(COLORS.border).stroke();
  doc.font("Helvetica").fontSize(8).fillColor(COLORS.text).text("@lean_varshith", 40, 805);
  doc.text(`Page ${page} of ${total}`, 430, 805, { width: 120, align: "right" });
}

function sectionTitle(doc, text, y) {
  doc.font("Helvetica-Bold").fontSize(12).fillColor(COLORS.dark).text(text, 40, y);
  return y + 18;
}

function table(doc, x, y, columns, rows, rowHeight = 34) {
  let cx = x;

  columns.forEach((col) => {
    doc.rect(cx, y, col.width, 28).fillAndStroke(COLORS.green, COLORS.green);
    doc.font("Helvetica-Bold").fontSize(8).fillColor(COLORS.white).text(col.label, cx + 6, y + 9, {
      width: col.width - 12,
    });
    cx += col.width;
  });

  y += 28;

  rows.forEach((row, index) => {
    cx = x;
    columns.forEach((col) => {
      doc.rect(cx, y, col.width, rowHeight).fillAndStroke(
        index % 2 === 0 ? COLORS.white : COLORS.light,
        COLORS.border
      );

      doc.font("Helvetica").fontSize(7.5).fillColor(COLORS.dark).text(String(row[col.key] || ""), cx + 6, y + 8, {
        width: col.width - 12,
      });

      cx += col.width;
    });

    y += rowHeight;
  });

  return y;
}

function extractSection(planText = "", heading = "") {
  const text = String(planText || "");
  const pattern = new RegExp(`${heading}:\\s*([\\s\\S]*?)(?=\\n[A-Z ]+:|$)`, "i");
  const match = text.match(pattern);
  return match ? match[1].trim() : "";
}

function caloriesByGoal(goal = "") {
  const g = goal.toLowerCase();
  if (g.includes("fat")) return "1800–2200 kcal";
  if (g.includes("muscle")) return "2400–2800 kcal";
  if (g.includes("recomposition")) return "2100–2400 kcal";
  return "2200–2500 kcal";
}

function customerRows(userData, orderId) {
  return [{
    id: orderId,
    name: userData.name || "Customer",
    age: userData.age || "-",
    height: `${userData.height || "-"} cm`,
    weight: `${userData.weight || "-"} kg`,
    goal: userData.goal || "-",
  }];
}

function dietRows() {
  return [
    { time: "7:00 AM", meal: "Breakfast", main: "Oats 70g + Milk 250ml + Banana 1", alt: "Poha 180g / Upma 180g / Idli 3 / Dalia 180g" },
    { time: "10:30 AM", meal: "Snack", main: "Eggs 3 whole", alt: "Paneer 120g / Soya 60g dry / Sprouts 180g / Chana 180g cooked" },
    { time: "1:30 PM", meal: "Lunch", main: "Rice 180g cooked + Chicken 150g + Veg 150g", alt: "Paneer 150g / Fish 150g / Soya 70g dry / Rajma 180g / Chana 180g" },
    { time: "5:00 PM", meal: "Evening", main: "Banana 1 + Peanuts 25g", alt: "Apple 1 / Sweet Potato 250g / Makhana 35g / Curd 200g" },
    { time: "8:30 PM", meal: "Dinner", main: "Roti 3 + Paneer 150g + Veg 200g", alt: "Chicken 150g / Fish 150g / Eggs 4 / Soya 70g dry / Dal 250g cooked" },
  ];
}

function proteinRows() {
  return [
    { food: "Chicken Breast", qty: "150g" },
    { food: "Fish", qty: "150g" },
    { food: "Paneer", qty: "150g" },
    { food: "Eggs", qty: "4 whole eggs" },
    { food: "Soya Chunks", qty: "70g dry" },
    { food: "Black Chana", qty: "180g cooked" },
    { food: "Rajma", qty: "180g cooked" },
    { food: "Moong Dal", qty: "250g cooked" },
  ];
}

function carbRows() {
  return [
    { food: "Rice", qty: "180g cooked" },
    { food: "Chapati", qty: "3 medium" },
    { food: "Oats", qty: "70g" },
    { food: "Poha", qty: "180g cooked" },
    { food: "Upma", qty: "180g cooked" },
    { food: "Sweet Potato", qty: "250g" },
    { food: "Idli", qty: "3 pieces" },
  ];
}

function workoutRows(userData) {
  const level = userData.experience || "Beginner";

  if (level === "Advanced") {
    return [
      { day: "Day 1", focus: "Chest + Triceps", exercises: "Bench Press, Incline DB Press, Fly, Pushdown", sets: "3–4", reps: "8–12" },
      { day: "Day 2", focus: "Back + Biceps", exercises: "Lat Pulldown, Row, Deadlift, Curl", sets: "3–4", reps: "8–12" },
      { day: "Day 3", focus: "Legs", exercises: "Squat, Leg Press, RDL, Leg Curl, Calf Raise", sets: "3–4", reps: "8–15" },
      { day: "Day 4", focus: "Shoulders + Abs", exercises: "Shoulder Press, Lateral Raise, Rear Delt, Plank", sets: "3–4", reps: "10–15" },
      { day: "Day 5", focus: "Upper Pump", exercises: "Chest Press, Row, Pulldown, Arms Superset", sets: "3", reps: "12–15" },
      { day: "Day 6", focus: "Cardio + Core", exercises: "Incline Walk, Cycling, Crunches, Leg Raises", sets: "3", reps: "20–30 min" },
    ];
  }

  return [
    { day: "Day 1", focus: "Full Body", exercises: "Chest Press, Lat Pulldown, Leg Press, Shoulder Press", sets: "3", reps: "12" },
    { day: "Day 2", focus: "Cardio + Core", exercises: "Walking, Cycling, Plank, Crunches", sets: "3", reps: "20–30 min" },
    { day: "Day 3", focus: "Upper Body", exercises: "Chest Press, Row, Shoulder Press, Curl, Pushdown", sets: "3", reps: "12" },
    { day: "Day 4", focus: "Lower Body", exercises: "Leg Press, Squat, Leg Curl, Calf Raise", sets: "3", reps: "12–15" },
    { day: "Day 5", focus: "Full Body", exercises: "Machines + Dumbbells + Core", sets: "3", reps: "12" },
  ];
}

function drawDietPage(doc, userData, planText, orderId, page, total) {
  addHeader(doc, "Personalized Diet Plan", orderId);

  let y = 115;
  const personSnapshot = extractSection(planText, "PERSON SNAPSHOT");
  const goalStrategy = extractSection(planText, "GOAL STRATEGY");

  y = sectionTitle(doc, "Customer Details", y);
  y = table(doc, 40, y, [
    { label: "Name", key: "name", width: 110 },
    { label: "Age", key: "age", width: 50 },
    { label: "Height", key: "height", width: 80 },
    { label: "Weight", key: "weight", width: 80 },
    { label: "Goal", key: "goal", width: 195 },
  ], customerRows(userData, orderId), 32);

  y += 18;

  if (personSnapshot) {
    y = sectionTitle(doc, "Person Snapshot", y);
    doc.font("Helvetica").fontSize(8.5).fillColor(COLORS.text).text(personSnapshot, 40, y, {
      width: 515,
      lineGap: 3,
    });
    y += 42;
  }

  if (goalStrategy) {
    y = sectionTitle(doc, "Goal Strategy", y);
    doc.font("Helvetica").fontSize(8.5).fillColor(COLORS.text).text(goalStrategy, 40, y, {
      width: 515,
      lineGap: 3,
    });
    y += 48;
  }

  y = sectionTitle(doc, "Calories & Macros", y);
  y = table(doc, 40, y, [
    { label: "Calories", key: "cal", width: 130 },
    { label: "Protein", key: "protein", width: 120 },
    { label: "Carbs", key: "carbs", width: 120 },
    { label: "Fats", key: "fat", width: 120 },
  ], [{ cal: caloriesByGoal(userData.goal), protein: "120–160g", carbs: "220–300g", fat: "55–75g" }], 32);

  y += 16;
  y = sectionTitle(doc, "Daily Meal Plan", y);

  table(doc, 40, y, [
    { label: "Time", key: "time", width: 65 },
    { label: "Meal", key: "meal", width: 65 },
    { label: "Main Option", key: "main", width: 195 },
    { label: "Alternatives with Quantity", key: "alt", width: 230 },
  ], dietRows(), 54);

  doc.font("Helvetica-Bold").fontSize(8.5).fillColor(COLORS.dark)
    .text("Note: Choose ONE main option or ONE alternative. Do not eat all alternatives together.", 40, 735, { width: 515 });

  addFooter(doc, page, total);
}

function drawFoodGuidePage(doc, planText, orderId, page, total) {
  addHeader(doc, "Food Alternatives & Practical Notes", orderId);

  const supplementUse =
    extractSection(planText, "SUPPLEMENT USE") ||
    "Supplements are optional. Whole foods are enough for most users.";

  const lifestyleTips =
    extractSection(planText, "LIFESTYLE TIPS") ||
    "Sleep 7–8 hours daily.\nDrink 3–4 litres water.\nPrepare simple meals in advance.\nTrack weight once weekly.\nStay consistent for 30 days.";

  const mindsetReminder =
    extractSection(planText, "MINDSET REMINDER") ||
    "One missed meal or workout does not ruin progress.\nReturn to the plan from the next meal or next session.";

  let y = 115;

  y = sectionTitle(doc, "Protein Replacement Options", y);
  y = table(doc, 40, y, [
    { label: "Protein Food", key: "food", width: 260 },
    { label: "Quantity", key: "qty", width: 250 },
  ], proteinRows(), 28);

  y += 18;
  y = sectionTitle(doc, "Carbohydrate Replacement Options", y);
  y = table(doc, 40, y, [
    { label: "Carb Food", key: "food", width: 260 },
    { label: "Quantity", key: "qty", width: 250 },
  ], carbRows(), 28);

  y += 18;
  y = sectionTitle(doc, "Supplement Use", y);
  doc.font("Helvetica").fontSize(8.5).fillColor(COLORS.text).text(supplementUse, 40, y, {
    width: 515,
    lineGap: 3,
  });

  y += 55;
  y = sectionTitle(doc, "Lifestyle Tips", y);
  doc.font("Helvetica").fontSize(8.5).fillColor(COLORS.text).text(lifestyleTips, 40, y, {
    width: 515,
    lineGap: 3,
  });

  y += 90;
  y = sectionTitle(doc, "Mindset Reminder", y);
  doc.font("Helvetica").fontSize(8.5).fillColor(COLORS.text).text(mindsetReminder, 40, y, {
    width: 515,
    lineGap: 3,
  });

  addFooter(doc, page, total);
}

function drawWorkoutPage(doc, userData, planText, orderId, page, total) {
  addHeader(doc, "Personalized Workout Plan", orderId);

  const workoutNotes =
    extractSection(planText, "WORKOUT NOTES") ||
    "Train with proper form first. Increase weight or reps slowly when form is good.";

  let y = 115;

  y = sectionTitle(doc, "Weekly Workout Schedule", y);
  y = table(doc, 40, y, [
    { label: "Day", key: "day", width: 60 },
    { label: "Focus", key: "focus", width: 110 },
    { label: "Exercises", key: "exercises", width: 250 },
    { label: "Sets", key: "sets", width: 55 },
    { label: "Reps", key: "reps", width: 80 },
  ], workoutRows(userData), 50);

  y += 18;
  y = sectionTitle(doc, "Workout Notes", y);
  doc.font("Helvetica").fontSize(8.5).fillColor(COLORS.text).text(workoutNotes, 40, y, {
    width: 515,
    lineGap: 3,
  });

  y += 55;
  y = sectionTitle(doc, "Workout Rules", y);
  table(doc, 40, y, [
    { label: "Rule", key: "rule", width: 150 },
    { label: "Instruction", key: "instruction", width: 360 },
  ], [
    { rule: "Warm-up", instruction: "5–10 minutes before lifting." },
    { rule: "Rest", instruction: "60–90 seconds between sets." },
    { rule: "Progression", instruction: "Increase weight or reps slowly when form is good." },
    { rule: "Cardio", instruction: "20–30 minutes walking 3–4 times weekly." },
    { rule: "Recovery", instruction: "Sleep 7–8 hours daily." },
  ], 34);

  addFooter(doc, page, total);
}

function drawRecoveryPage(doc, planText, orderId, page, total) {
  addHeader(doc, "Recovery & Progress Checklist", orderId);

  const lifestyleTips =
    extractSection(planText, "LIFESTYLE TIPS") ||
    "Sleep 7–8 hours daily.\nDrink 3–4 litres water.\nTrack body weight once weekly.";

  let y = 115;

  y = sectionTitle(doc, "Daily Checklist", y);
  y = table(doc, 40, y, [{ label: "Checklist", key: "item", width: 510 }], [
    { item: "[ ] Complete meals" },
    { item: "[ ] Hit protein target" },
    { item: "[ ] Drink 3–4 litres water" },
    { item: "[ ] Workout / walk completed" },
    { item: "[ ] Sleep 7–8 hours" },
    { item: "[ ] Check weight once weekly" },
  ], 34);

  y += 28;
  y = sectionTitle(doc, "Important Tips", y);
  doc.font("Helvetica").fontSize(8.5).fillColor(COLORS.text).text(lifestyleTips, 40, y, {
    width: 515,
    lineGap: 3,
  });

  addFooter(doc, page, total);
}

export function createPlanPDF(userData, planText, orderId) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 40 });
    const buffers = [];

    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    const selectedPlan = (userData.selectedPlan || "").toLowerCase();

    if (selectedPlan.includes("diet") && !selectedPlan.includes("workout")) {
      drawDietPage(doc, userData, planText, orderId, 1, 2);
      doc.addPage();
      drawFoodGuidePage(doc, planText, orderId, 2, 2);
    } else if (selectedPlan.includes("workout") && !selectedPlan.includes("diet")) {
      drawWorkoutPage(doc, userData, planText, orderId, 1, 2);
      doc.addPage();
      drawRecoveryPage(doc, planText, orderId, 2, 2);
    } else {
      drawDietPage(doc, userData, planText, orderId, 1, 4);
      doc.addPage();
      drawFoodGuidePage(doc, planText, orderId, 2, 4);
      doc.addPage();
      drawWorkoutPage(doc, userData, planText, orderId, 3, 4);
      doc.addPage();
      drawRecoveryPage(doc, planText, orderId, 4, 4);
    }

    doc.end();
  });
}

export function createPlanPDFV2(userData, orderId) {
  return createPlanPDF(userData, "", orderId);
}