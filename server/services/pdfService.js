import PDFDocument from "pdfkit";

const GREEN = "#16a34a";
const DARK = "#111827";
const TEXT = "#374151";
const LIGHT = "#f9fafb";
const BORDER = "#d1d5db";

function text(doc, value, x, y, options = {}) {
  doc
    .font(options.bold ? "Helvetica-Bold" : "Helvetica")
    .fontSize(options.size || 8)
    .fillColor(options.color || DARK)
    .text(value || "", x, y, {
      width: options.width,
      align: options.align || "left",
    });
}

function title(doc, value) {
  doc.font("Helvetica-Bold").fontSize(24).fillColor(GREEN).text("LEANFIT", {
    align: "center",
  });

  doc.font("Helvetica-Bold").fontSize(13).fillColor(DARK).text(value, {
    align: "center",
  });

  doc.moveDown(0.6);
}

function footer(doc, page, total) {
  doc.font("Helvetica").fontSize(8).fillColor("#6b7280");
  doc.text(`Follow LeanFit on Instagram: @lean_varshith`, 35, 805, {
    width: 525,
    align: "center",
  });
  doc.text(`Page ${page} of ${total}`, 35, 820, {
    width: 525,
    align: "center",
  });
}

function section(doc, label, y) {
  doc.font("Helvetica-Bold").fontSize(12).fillColor(DARK).text(label, 35, y);
  return y + 20;
}

function table(doc, x, y, columns, rows, rowHeight = 30) {
  const width = columns.reduce((sum, c) => sum + c.width, 0);

  doc.rect(x, y, width, 26).fill(GREEN);

  let currentX = x;

  columns.forEach((col) => {
    text(doc, col.label, currentX + 5, y + 8, {
      width: col.width - 10,
      size: 8,
      bold: true,
      color: "#ffffff",
    });

    currentX += col.width;
  });

  y += 26;

  rows.forEach((row, index) => {
    currentX = x;

    columns.forEach((col) => {
      doc
        .rect(currentX, y, col.width, rowHeight)
        .fill(index % 2 === 0 ? LIGHT : "#ffffff")
        .stroke(BORDER);

      text(doc, row[col.key], currentX + 5, y + 8, {
        width: col.width - 10,
        size: 7.5,
      });

      currentX += col.width;
    });

    y += rowHeight;
  });

  return y;
}

function getCalories(userData) {
  const goal = userData.goal || "";

  if (goal.includes("Fat")) return "1800-2200 kcal";
  if (goal.includes("Muscle")) return "2400-2800 kcal";
  if (goal.includes("Recomposition")) return "2100-2400 kcal";

  return "2200-2500 kcal";
}

function getDietRows(userData) {
  const goal = userData.goal || "";
  const foods = userData.foods || {};

  const chicken = foods.chicken === "Preferred";
  const eggs = foods.eggs === "Preferred";
  const paneer = foods.paneer === "Preferred";

  if (goal.includes("Fat")) {
    return [
      {
        time: "6:30-8:00 AM",
        meal: "Breakfast",
        food: "Oats + Milk",
        alt: "Poha / Upma / Idli / Dalia",
        qty: "1 bowl",
      },
      {
        time: "10:00-11:00 AM",
        meal: "Snack",
        food: eggs ? "Boiled Eggs" : "Sprouts",
        alt: "Paneer / Chana / Roasted Peanuts",
        qty: eggs ? "3 eggs" : "1 bowl",
      },
      {
        time: "1:00-2:00 PM",
        meal: "Lunch",
        food: chicken ? "Chicken + Rice + Veg" : "Paneer/Soya + Rice",
        alt: "Paneer / Soya / Rajma / Chole",
        qty: "150g protein",
      },
      {
        time: "4:30-5:30 PM",
        meal: "Snack",
        food: "Fruit + Peanuts",
        alt: "Apple / Papaya / Sweet Potato",
        qty: "1 serving",
      },
      {
        time: "8:00-9:00 PM",
        meal: "Dinner",
        food: paneer ? "Paneer + Roti + Veg" : "Dal/Soya + Roti",
        alt: "Chicken / Fish / Eggs / Soya",
        qty: "2 roti",
      },
    ];
  }

  return [
    {
      time: "6:30-8:00 AM",
      meal: "Breakfast",
      food: "Oats + Milk + Banana",
      alt: "Poha / Upma / Idli / Dalia",
      qty: "1 large bowl",
    },
    {
      time: "10:00-11:00 AM",
      meal: "Snack",
      food: eggs ? "Whole Eggs" : "Paneer",
      alt: "Sprouts / Chana / Soya",
      qty: eggs ? "4 eggs" : "150g",
    },
    {
      time: "1:00-2:00 PM",
      meal: "Lunch",
      food: chicken ? "Chicken + Rice + Veg" : "Paneer/Soya + Rice",
      alt: "Paneer / Soya / Rajma / Chole",
      qty: "200g protein",
    },
    {
      time: "4:30-5:30 PM",
      meal: "Pre Workout",
      food: "Banana + Peanut Butter",
      alt: "Sweet Potato / Dates / Peanuts",
      qty: "1 serving",
    },
    {
      time: "8:00-9:00 PM",
      meal: "Dinner",
      food: chicken ? "Chicken + Roti + Veg" : "Soya/Paneer + Roti",
      alt: "Fish / Eggs / Paneer / Dal",
      qty: "200g protein",
    },
  ];
}

function getWorkoutRows(userData) {
  const goal = userData.goal || "";
  const level = userData.experience || "Beginner";

  if (goal.includes("Fat")) {
    return [
      { exercise: "Treadmill Walk", sets: "1", reps: "20 min", notes: "Moderate pace" },
      { exercise: "Leg Press", sets: "3", reps: "12-15", notes: "Controlled reps" },
      { exercise: "Chest Press", sets: "3", reps: "12", notes: "Full range" },
      { exercise: "Lat Pulldown", sets: "3", reps: "12", notes: "Pull to chest" },
      { exercise: "Shoulder Press", sets: "3", reps: "12", notes: "Avoid jerks" },
      { exercise: "Plank", sets: "3", reps: "30-45 sec", notes: "Core tight" },
    ];
  }

  if (level === "Advanced") {
    return [
      { exercise: "Bench Press", sets: "4", reps: "6-8", notes: "Progressive overload" },
      { exercise: "Barbell Row", sets: "4", reps: "8-10", notes: "Controlled pull" },
      { exercise: "Squats", sets: "4", reps: "6-10", notes: "Full depth" },
      { exercise: "Romanian Deadlift", sets: "3", reps: "8-10", notes: "Hamstring focus" },
      { exercise: "Shoulder Press", sets: "3", reps: "8-10", notes: "Strict form" },
      { exercise: "Arms Superset", sets: "3", reps: "12-15", notes: "Curl + Pushdown" },
    ];
  }

  return [
    { exercise: "Chest Press Machine", sets: "3", reps: "12", notes: "Learn form" },
    { exercise: "Lat Pulldown", sets: "3", reps: "12", notes: "Slow negative" },
    { exercise: "Leg Press", sets: "3", reps: "12", notes: "Do not lock knees" },
    { exercise: "Shoulder Press", sets: "3", reps: "12", notes: "Controlled reps" },
    { exercise: "Bicep Curl", sets: "3", reps: "12", notes: "No swinging" },
    { exercise: "Tricep Pushdown", sets: "3", reps: "12", notes: "Full squeeze" },
  ];
}

function userBox(doc, userData, orderId, y) {
  table(
    doc,
    35,
    y,
    [
      { label: "Plan ID", key: "orderId", width: 105 },
      { label: "Name", key: "name", width: 105 },
      { label: "Age", key: "age", width: 70 },
      { label: "Height", key: "height", width: 80 },
      { label: "Weight", key: "weight", width: 80 },
      { label: "Goal", key: "goal", width: 85 },
    ],
    [
      {
        orderId,
        name: userData.name || "Member",
        age: userData.age || "-",
        height: `${userData.height || "-"} cm`,
        weight: `${userData.weight || "-"} kg`,
        goal: userData.goal || "Fitness",
      },
    ],
    30
  );
}

function greeting(doc, userData, y) {
  text(doc, `Hello ${userData.name || "Member"},`, 35, y, {
    width: 525,
    size: 11,
    bold: true,
  });

  text(
    doc,
    "Welcome to LeanFit. Your personalized plan is designed to help you reach your goal safely and consistently. Stay disciplined, trust the process, and keep improving every day.",
    35,
    y + 18,
    {
      width: 525,
      size: 8.5,
      color: TEXT,
    }
  );
}

function drawDietPageOne(doc, userData, orderId, page, total) {
  title(doc, "Personalized Diet Plan");
  greeting(doc, userData, 92);
  userBox(doc, userData, orderId, 142);

  let y = section(doc, "Daily Calories & Macros", 210);

  y = table(
    doc,
    35,
    y,
    [
      { label: "Calories", key: "calories", width: 105 },
      { label: "Protein", key: "protein", width: 105 },
      { label: "Carbs", key: "carbs", width: 105 },
      { label: "Fats", key: "fats", width: 105 },
      { label: "Water", key: "water", width: 105 },
    ],
    [
      {
        calories: getCalories(userData),
        protein: "120-160g",
        carbs: "220-300g",
        fats: "55-75g",
        water: "3L",
      },
    ],
    30
  );

  y = section(doc, "Diet Plan", y + 28);

  table(
    doc,
    35,
    y,
    [
      { label: "Time", key: "time", width: 80 },
      { label: "Meal", key: "meal", width: 70 },
      { label: "Primary Food", key: "food", width: 155 },
      { label: "Affordable Alternatives", key: "alt", width: 155 },
      { label: "Qty", key: "qty", width: 65 },
    ],
    getDietRows(userData),
    52
  );

  footer(doc, page, total);
}

function drawDietPageTwo(doc, page, total) {
  title(doc, "Food Replacement Guide");

  let y = 105;

  y = table(
    doc,
    35,
    y,
    [
      { label: "Instead Of", key: "main", width: 145 },
      { label: "Affordable Alternatives", key: "alts", width: 380 },
    ],
    [
      { main: "Chicken", alts: "Paneer / Eggs / Soya Chunks / Chana / Rajma / Fish" },
      { main: "Fish", alts: "Chicken / Paneer / Eggs / Soya" },
      { main: "Paneer", alts: "Eggs / Chicken / Soya / Chana" },
      { main: "Rice", alts: "Roti / Millet / Sweet Potato / Poha / Idli" },
      { main: "Oats", alts: "Dalia / Poha / Upma / Idli" },
      { main: "Milk", alts: "Curd / Soy Milk / Buttermilk" },
      { main: "Banana", alts: "Apple / Orange / Papaya / Sweet Potato" },
    ],
    36
  );

  y = section(doc, "Daily Success Checklist", y + 35);

  table(
    doc,
    35,
    y,
    [
      { label: "Checklist", key: "item", width: 525 },
    ],
    [
      { item: "[ ] Drink 3L Water" },
      { item: "[ ] Hit Protein Goal" },
      { item: "[ ] Eat Fruits" },
      { item: "[ ] Eat Vegetables" },
      { item: "[ ] Sleep 7-8 Hours" },
      { item: "[ ] Walk 20 Minutes" },
    ],
    28
  );

  text(doc, "Stay consistent. Small improvements every day create big results.", 35, 700, {
    width: 525,
    size: 10,
    bold: true,
    align: "center",
  });

  footer(doc, page, total);
}

function drawWorkoutPageOne(doc, userData, orderId, page, total) {
  title(doc, "Personalized Workout Plan");
  greeting(doc, userData, 92);
  userBox(doc, userData, orderId, 142);

  const y = section(doc, "Workout Plan", 210);

  table(
    doc,
    35,
    y,
    [
      { label: "Exercise", key: "exercise", width: 190 },
      { label: "Sets", key: "sets", width: 65 },
      { label: "Reps", key: "reps", width: 90 },
      { label: "Notes", key: "notes", width: 180 },
    ],
    getWorkoutRows(userData),
    55
  );

  footer(doc, page, total);
}

function drawWorkoutPageTwo(doc, page, total) {
  title(doc, "Training Guidelines");

  let y = 105;

  y = table(
    doc,
    35,
    y,
    [
      { label: "Area", key: "area", width: 145 },
      { label: "Guideline", key: "guide", width: 380 },
    ],
    [
      { area: "Warm Up", guide: "5-10 minutes light cardio + mobility before lifting." },
      { area: "Rest Time", guide: "60-90 seconds for normal sets. 2 minutes for heavy lifts." },
      { area: "Cardio", guide: "20-30 minutes walking or cycling 3-4 times per week." },
      { area: "Progressive Overload", guide: "Increase weight or reps slowly when form is good." },
      { area: "Recovery", guide: "Sleep 7-8 hours and avoid training same muscle daily." },
      { area: "Stretching", guide: "Stretch after workout. Do not bounce during stretches." },
    ],
    44
  );

  y = section(doc, "Recovery Checklist", y + 35);

  table(
    doc,
    35,
    y,
    [{ label: "Checklist", key: "item", width: 525 }],
    [
      { item: "[ ] Warm-up done" },
      { item: "[ ] Workout completed" },
      { item: "[ ] Cardio / walking completed" },
      { item: "[ ] Water intake completed" },
      { item: "[ ] 7-8 hours sleep" },
    ],
    30
  );

  footer(doc, page, total);
}

export function createPlanPDF(userData, planText, orderId) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 35, size: "A4" });
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    const selectedPlan = (userData.selectedPlan || "").toLowerCase();

    if (selectedPlan.includes("diet") && !selectedPlan.includes("workout")) {
      drawDietPageOne(doc, userData, orderId, 1, 2);
      doc.addPage();
      drawDietPageTwo(doc, 2, 2);
    } else if (selectedPlan.includes("workout") && !selectedPlan.includes("diet")) {
      drawWorkoutPageOne(doc, userData, orderId, 1, 2);
      doc.addPage();
      drawWorkoutPageTwo(doc, 2, 2);
    } else {
      drawDietPageOne(doc, userData, orderId, 1, 4);
      doc.addPage();
      drawDietPageTwo(doc, 2, 4);
      doc.addPage();
      drawWorkoutPageOne(doc, userData, orderId, 3, 4);
      doc.addPage();
      drawWorkoutPageTwo(doc, 4, 4);
    }

    doc.end();
  });
}