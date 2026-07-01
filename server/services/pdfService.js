import PDFDocument from "pdfkit";

function drawSectionTitle(doc, title) {
  doc.moveDown(0.6);
  doc.font("Helvetica-Bold").fontSize(12).fillColor("#111827").text(title);
  doc.moveDown(0.3);
}

function drawTable(doc, startX, startY, columns, rows, options = {}) {
  const rowHeight = options.rowHeight || 32;
  const headerHeight = options.headerHeight || 28;
  const tableWidth = columns.reduce((sum, col) => sum + col.width, 0);
  let y = startY;

  doc.rect(startX, y, tableWidth, headerHeight).fill("#16a34a");

  let x = startX;
  columns.forEach((col) => {
    doc
      .fillColor("#ffffff")
      .font("Helvetica-Bold")
      .fontSize(8)
      .text(col.label, x + 5, y + 9, {
        width: col.width - 10,
      });
    x += col.width;
  });

  y += headerHeight;

  rows.forEach((row, index) => {
    x = startX;

    columns.forEach((col) => {
      doc
        .rect(x, y, col.width, rowHeight)
        .fill(index % 2 === 0 ? "#f9fafb" : "#ffffff")
        .stroke("#d1d5db");

      doc
        .fillColor("#111827")
        .font("Helvetica")
        .fontSize(8)
        .text(row[col.key] || "", x + 5, y + 8, {
          width: col.width - 10,
        });

      x += col.width;
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

  const prefersChicken = foods.chicken === "Preferred";
  const prefersEggs = foods.eggs === "Preferred";
  const prefersPaneer = foods.paneer === "Preferred";

  if (goal.includes("Fat")) {
    return [
      {
        time: "6:30-8:00 AM",
        meal: "Breakfast",
        food: "Oats + Milk / Idli + Sambar",
        qty: "1 bowl",
        protein: "18-25g",
      },
      {
        time: "10:00-11:00 AM",
        meal: "Snack",
        food: prefersEggs ? "Boiled Eggs" : "Sprouts / Roasted Chana",
        qty: prefersEggs ? "3 eggs" : "1 bowl",
        protein: "18-22g",
      },
      {
        time: "1:00-2:00 PM",
        meal: "Lunch",
        food: prefersChicken ? "Chicken + Rice + Veg" : "Paneer/Soya + Rice + Veg",
        qty: "150g protein",
        protein: "35-40g",
      },
      {
        time: "4:30-5:30 PM",
        meal: "Snack",
        food: "Fruit + Peanuts",
        qty: "1 fruit + 20g",
        protein: "6-8g",
      },
      {
        time: "8:00-9:00 PM",
        meal: "Dinner",
        food: prefersPaneer ? "Paneer + Roti + Veg" : "Dal/Soya + Roti + Veg",
        qty: "2 roti",
        protein: "30-35g",
      },
    ];
  }

  return [
    {
      time: "6:30-8:00 AM",
      meal: "Breakfast",
      food: "Oats + Milk + Banana",
      qty: "1 large bowl",
      protein: "25g",
    },
    {
      time: "10:00-11:00 AM",
      meal: "Snack",
      food: prefersEggs ? "Whole Eggs" : "Paneer / Sprouts",
      qty: prefersEggs ? "4 eggs" : "150g",
      protein: "24-30g",
    },
    {
      time: "1:00-2:00 PM",
      meal: "Lunch",
      food: prefersChicken ? "Chicken + Rice + Veg" : "Paneer/Soya + Rice + Veg",
      qty: "200g protein",
      protein: "40-45g",
    },
    {
      time: "4:30-5:30 PM",
      meal: "Pre Workout",
      food: "Banana + Peanut Butter",
      qty: "1 banana + 2 tbsp",
      protein: "8-10g",
    },
    {
      time: "8:00-9:00 PM",
      meal: "Dinner",
      food: prefersChicken ? "Chicken + Roti + Veg" : "Soya/Paneer + Roti + Veg",
      qty: "200g protein",
      protein: "35-45g",
    },
  ];
}

function getWorkoutRows(userData) {
  const level = userData.experience || "Beginner";
  const goal = userData.goal || "";

  if (goal.includes("Fat")) {
    return [
      { exercise: "Treadmill Walk", sets: "1", reps: "20 min", rest: "-", notes: "Moderate pace" },
      { exercise: "Leg Press", sets: "3", reps: "12-15", rest: "60s", notes: "Controlled reps" },
      { exercise: "Chest Press", sets: "3", reps: "12", rest: "60s", notes: "Full range" },
      { exercise: "Lat Pulldown", sets: "3", reps: "12", rest: "60s", notes: "Pull to chest" },
      { exercise: "Shoulder Press", sets: "3", reps: "12", rest: "60s", notes: "Avoid jerks" },
      { exercise: "Plank", sets: "3", reps: "30-45s", rest: "45s", notes: "Core tight" },
    ];
  }

  if (level === "Advanced") {
    return [
      { exercise: "Bench Press", sets: "4", reps: "6-8", rest: "90s", notes: "Progressive overload" },
      { exercise: "Barbell Row", sets: "4", reps: "8-10", rest: "90s", notes: "Controlled pull" },
      { exercise: "Squats", sets: "4", reps: "6-10", rest: "120s", notes: "Full depth" },
      { exercise: "Romanian Deadlift", sets: "3", reps: "8-10", rest: "90s", notes: "Hamstring focus" },
      { exercise: "Shoulder Press", sets: "3", reps: "8-10", rest: "75s", notes: "Strict form" },
      { exercise: "Arms Superset", sets: "3", reps: "12-15", rest: "60s", notes: "Curl + Pushdown" },
    ];
  }

  return [
    { exercise: "Chest Press Machine", sets: "3", reps: "12", rest: "60s", notes: "Learn form" },
    { exercise: "Lat Pulldown", sets: "3", reps: "12", rest: "60s", notes: "Slow negative" },
    { exercise: "Leg Press", sets: "3", reps: "12", rest: "75s", notes: "Do not lock knees" },
    { exercise: "Shoulder Press", sets: "3", reps: "12", rest: "60s", notes: "Controlled reps" },
    { exercise: "Bicep Curl", sets: "3", reps: "12", rest: "45s", notes: "No swinging" },
    { exercise: "Tricep Pushdown", sets: "3", reps: "12", rest: "45s", notes: "Full squeeze" },
  ];
}

function drawHeader(doc, title, orderId, userData) {
  doc.font("Helvetica-Bold").fontSize(24).fillColor("#16a34a").text("LEANFIT", {
    align: "center",
  });

  doc.fontSize(13).fillColor("#111827").text(title, {
    align: "center",
  });

  doc.moveDown(0.6);

  doc.font("Helvetica").fontSize(8).fillColor("#374151");
  doc.text(`Plan ID: ${orderId}`);
  doc.text(`Name: ${userData.name || "Member"}`);
  doc.text(`Goal: ${userData.goal || "Fitness"}`);
  doc.text(`Age: ${userData.age || "-"} | Height: ${userData.height || "-"} cm`);
  doc.text(`Current Weight: ${userData.weight || "-"} kg | Target Weight: ${userData.targetWeight || "-"} kg`);
}

function drawDietPage(doc, userData, orderId) {
  drawHeader(doc, "Personalized Diet Plan", orderId, userData);

  drawSectionTitle(doc, "Daily Nutrition Target");

  drawTable(
    doc,
    35,
    doc.y,
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
        water: "3L daily",
      },
    ],
    { rowHeight: 28 }
  );

  doc.y += 58;

  drawSectionTitle(doc, "Meal Plan");

  drawTable(
    doc,
    35,
    doc.y,
    [
      { label: "Time", key: "time", width: 80 },
      { label: "Meal", key: "meal", width: 70 },
      { label: "Recommended Food", key: "food", width: 185 },
      { label: "Quantity", key: "qty", width: 95 },
      { label: "Protein", key: "protein", width: 80 },
    ],
    getDietRows(userData),
    { rowHeight: 38 }
  );

  doc.y += 210;

  drawSectionTitle(doc, "Food Replacement Guide");

  drawTable(
    doc,
    35,
    doc.y,
    [
      { label: "If unavailable", key: "main", width: 150 },
      { label: "Use these alternatives", key: "alts", width: 360 },
    ],
    [
      { main: "Chicken", alts: "Paneer / Soya Chunks / Fish / Eggs / Chana / Rajma" },
      { main: "Rice", alts: "Roti / Millet / Sweet Potato / Poha / Idli" },
      { main: "Milk", alts: "Curd / Soy Milk / Buttermilk" },
    ],
    { rowHeight: 30 }
  );

  doc.y += 120;

  drawSectionTitle(doc, "Daily Checklist");

  doc.font("Helvetica").fontSize(9).fillColor("#111827");
  doc.text("☐ 3L Water   ☐ Protein Target   ☐ Fruits & Vegetables   ☐ 7-8 Hours Sleep", 35);
}

function drawWorkoutPage(doc, userData, orderId) {
  drawHeader(doc, "Personalized Workout Plan", orderId, userData);

  drawSectionTitle(doc, "Workout Plan");

  drawTable(
    doc,
    35,
    doc.y,
    [
      { label: "Exercise", key: "exercise", width: 160 },
      { label: "Sets", key: "sets", width: 55 },
      { label: "Reps", key: "reps", width: 70 },
      { label: "Rest", key: "rest", width: 65 },
      { label: "Notes", key: "notes", width: 160 },
    ],
    getWorkoutRows(userData),
    { rowHeight: 42 }
  );

  doc.y += 270;

  drawSectionTitle(doc, "Training Rules");

  doc.font("Helvetica").fontSize(9).fillColor("#374151");
  doc.text("• Warm up for 5-10 minutes before workout.");
  doc.text("• Increase weight or reps slowly when form is good.");
  doc.text("• Keep rest time controlled. Do not rush heavy sets.");
  doc.text("• Add 20-30 minutes walking or cycling 3-4 times per week.");
  doc.text("• Stop any exercise that causes sharp pain.");
}

export function createPlanPDF(userData, planText, orderId) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 35, size: "A4" });
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    const selectedPlan = userData.selectedPlan || "";

    if (selectedPlan.includes("Diet")) {
      drawDietPage(doc, userData, orderId);
    } else if (selectedPlan.includes("Workout")) {
      drawWorkoutPage(doc, userData, orderId);
    } else {
      drawDietPage(doc, userData, orderId);
      doc.addPage();
      drawWorkoutPage(doc, userData, orderId);
    }

    doc.end();
  });
}