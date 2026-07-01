import PDFDocument from "pdfkit";

function drawTable(doc, startX, startY, columns, rows, options = {}) {
  const rowHeight = options.rowHeight || 28;
  const headerHeight = options.headerHeight || 30;
  let y = startY;

  doc
    .rect(startX, y, columns.reduce((sum, col) => sum + col.width, 0), headerHeight)
    .fill("#16a34a");

  let x = startX;
  columns.forEach((col) => {
    doc
      .fillColor("#ffffff")
      .fontSize(9)
      .font("Helvetica-Bold")
      .text(col.label, x + 5, y + 9, {
        width: col.width - 10,
      });
    x += col.width;
  });

  y += headerHeight;

  rows.forEach((row) => {
    x = startX;

    columns.forEach((col) => {
      doc.rect(x, y, col.width, rowHeight).stroke("#d1d5db");

      doc
        .fillColor("#111827")
        .fontSize(8)
        .font("Helvetica")
        .text(row[col.key] || "", x + 5, y + 7, {
          width: col.width - 10,
        });

      x += col.width;
    });

    y += rowHeight;
  });

  return y;
}

function getDietRows(userData) {
  return [
    {
      time: "7:00 AM",
      meal: "Breakfast",
      food: "Oats + milk + banana",
      alternatives: "Poha / Upma / Idli / Dosa",
      qty: "1 bowl",
    },
    {
      time: "10:30 AM",
      meal: "Snack",
      food: "Eggs",
      alternatives: "Paneer / Sprouts / Roasted chana",
      qty: "3 eggs",
    },
    {
      time: "1:30 PM",
      meal: "Lunch",
      food: "Rice + chicken + vegetables",
      alternatives: "Paneer / Soya / Chana / Rajma / Fish",
      qty: "150g protein",
    },
    {
      time: "5:00 PM",
      meal: "Pre-workout",
      food: "Banana + peanuts",
      alternatives: "Apple / Sweet potato / Dates",
      qty: "1 serving",
    },
    {
      time: "8:30 PM",
      meal: "Dinner",
      food: "Roti + protein curry",
      alternatives: "Chicken / Paneer / Soya / Dal / Fish",
      qty: "2-3 roti",
    },
  ];
}

function getWorkoutRows() {
  return [
    {
      day: "Day 1",
      focus: "Upper Body",
      exercise: "Bench Press, Rows, Shoulder Press, Pulldown",
      sets: "3-4",
      reps: "8-12",
    },
    {
      day: "Day 2",
      focus: "Lower Body",
      exercise: "Squats, RDL, Leg Press, Leg Curl, Calves",
      sets: "3-4",
      reps: "8-15",
    },
    {
      day: "Day 3",
      focus: "Back & Biceps",
      exercise: "Lat Pulldown, Cable Row, DB Row, Curls",
      sets: "3",
      reps: "10-12",
    },
    {
      day: "Day 4",
      focus: "Legs",
      exercise: "Leg Extension, Hack Squat, Lunges, Hip Thrust",
      sets: "3-4",
      reps: "10-15",
    },
    {
      day: "Day 5",
      focus: "Chest & Triceps",
      exercise: "Incline Press, Chest Fly, Dips, Pushdown",
      sets: "3",
      reps: "10-12",
    },
    {
      day: "Day 6",
      focus: "Shoulders & Traps",
      exercise: "Lateral Raise, Shoulder Press, Rear Delt, Shrugs",
      sets: "3-4",
      reps: "12-15",
    },
  ];
}

export function createPlanPDF(userData, planText, orderId) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 35 });
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    const calories = userData.goal === "Fat Loss" ? "1800-2200" : "2200-2600";
    const protein = "120-160g";
    const carbs = "220-300g";
    const fats = "55-75g";

    // PAGE 1 - DIET
    doc
      .font("Helvetica-Bold")
      .fontSize(24)
      .fillColor("#16a34a")
      .text("LEANFIT", { align: "center" });

    doc
      .fontSize(14)
      .fillColor("#111827")
      .text("Personalized Diet Plan", { align: "center" });

    doc.moveDown(0.8);

    doc
      .fontSize(9)
      .font("Helvetica")
      .fillColor("#374151")
      .text(`Plan ID: ${orderId}`)
      .text(`Name: ${userData.name || "Member"}`)
      .text(`Goal: ${userData.goal || "Fitness"}`)
      .text(`Current Weight: ${userData.weight || "-"} kg`)
      .text(`Target Weight: ${userData.targetWeight || "-"} kg`);

    doc.moveDown(0.8);

    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor("#111827")
      .text("Daily Target");

    drawTable(
      doc,
      35,
      doc.y + 8,
      [
        { label: "Calories", key: "calories", width: 120 },
        { label: "Protein", key: "protein", width: 120 },
        { label: "Carbs", key: "carbs", width: 120 },
        { label: "Fats", key: "fats", width: 120 },
      ],
      [
        {
          calories: `${calories} kcal`,
          protein,
          carbs,
          fats,
        },
      ],
      { rowHeight: 30 }
    );

    doc.y += 55;

    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor("#111827")
      .text("Diet Plan");

    drawTable(
      doc,
      35,
      doc.y + 8,
      [
        { label: "Time", key: "time", width: 65 },
        { label: "Meal", key: "meal", width: 75 },
        { label: "Primary Food", key: "food", width: 140 },
        { label: "Affordable Alternatives", key: "alternatives", width: 190 },
        { label: "Qty", key: "qty", width: 70 },
      ],
      getDietRows(userData),
      { rowHeight: 45 }
    );

    doc.y += 255;

    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor("#111827")
      .text("Protein Replacement Options");

    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor("#374151")
      .text("Chicken 150g = Paneer 150g OR Soya Chunks 70-80g OR Chana/Rajma 150g OR Fish 150g OR 4 Eggs.")
      .text("Choose based on budget and availability. Keep protein in every main meal.");

    // PAGE 2 - WORKOUT
    doc.addPage();

    doc
      .font("Helvetica-Bold")
      .fontSize(24)
      .fillColor("#16a34a")
      .text("LEANFIT", { align: "center" });

    doc
      .fontSize(14)
      .fillColor("#111827")
      .text("Workout Plan", { align: "center" });

    doc.moveDown(1);

    drawTable(
      doc,
      35,
      doc.y + 8,
      [
        { label: "Day", key: "day", width: 55 },
        { label: "Focus", key: "focus", width: 95 },
        { label: "Exercises", key: "exercise", width: 260 },
        { label: "Sets", key: "sets", width: 55 },
        { label: "Reps", key: "reps", width: 65 },
      ],
      getWorkoutRows(),
      { rowHeight: 50 }
    );

    doc.y += 330;

    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor("#111827")
      .text("Workout Notes");

    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor("#374151")
      .text("• Warm up for 5-10 minutes before lifting.")
      .text("• Use progressive overload. Increase weight or reps slowly.")
      .text("• Rest 60-90 seconds for normal sets and 2 minutes for heavy compound lifts.")
      .text("• Do 20-30 minutes walking or cycling 3-4 times per week.")
      .text("• Sleep 7-8 hours and drink 3 litres of water daily.");

    doc.moveDown(1);

    doc
      .fontSize(8)
      .fillColor("#6b7280")
      .text(
        "This plan is for general fitness guidance. Adjust based on comfort, progress, and medical conditions.",
        { align: "center" }
      );

    doc.end();
  });
}