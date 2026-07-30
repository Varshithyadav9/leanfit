const EXERCISES = {
  "Full Body A": [
    ["Barbell Back Squat", "3", "8-10", "120 sec", "2 RIR", "Brace the core and keep the knees tracking over the toes."],
    ["Dumbbell Bench Press", "3", "8-12", "90 sec", "2 RIR", "Lower with control and keep the shoulder blades set."],
    ["Lat Pulldown", "3", "10-12", "75 sec", "2 RIR", "Pull the elbows toward the ribs; avoid swinging."],
    ["Romanian Deadlift", "3", "8-10", "120 sec", "2 RIR", "Push the hips back and keep the spine neutral."],
    ["Seated Dumbbell Shoulder Press", "2", "10-12", "75 sec", "2 RIR", "Use a pain-free range and avoid excessive back arch."],
    ["Plank", "3", "30-45 sec", "45 sec", "Controlled", "Keep the ribs down and squeeze the glutes."],
  ],
  "Full Body B": [
    ["Leg Press", "3", "10-12", "90 sec", "2 RIR", "Use a comfortable depth without lifting the lower back."],
    ["Incline Dumbbell Press", "3", "8-12", "90 sec", "2 RIR", "Set the bench around 30 degrees."],
    ["Seated Cable Row", "3", "10-12", "75 sec", "2 RIR", "Pause briefly with the shoulder blades together."],
    ["Hip Thrust", "3", "10-12", "90 sec", "2 RIR", "Finish with the ribs down and full glute contraction."],
    ["Dumbbell Lateral Raise", "2", "12-15", "60 sec", "1-2 RIR", "Lead with the elbows and avoid shrugging."],
    ["Dead Bug", "3", "10/side", "45 sec", "Controlled", "Keep the lower back gently pressed down."],
  ],
  "Upper Strength": [
    ["Barbell Bench Press", "4", "4-6", "180 sec", "1-2 RIR", "Use a stable arch and consistent touch point."],
    ["Weighted Pull-up or Heavy Pulldown", "4", "5-8", "150 sec", "1-2 RIR", "Drive the elbows down without swinging."],
    ["Overhead Press", "3", "5-8", "150 sec", "1-2 RIR", "Brace the core and finish with the arms overhead."],
    ["Chest-Supported Row", "3", "6-10", "120 sec", "1-2 RIR", "Pull toward the lower chest and pause."],
    ["Incline Dumbbell Press", "3", "8-10", "90 sec", "1-2 RIR", "Control the lowering phase for 2-3 seconds."],
    ["Cable Curl + Rope Pushdown", "3", "10-12 each", "60 sec", "1 RIR", "Perform as a controlled superset."],
  ],
  "Lower Strength": [
    ["Back Squat", "4", "4-6", "180 sec", "1-2 RIR", "Brace before each rep and maintain a stable bar path."],
    ["Romanian Deadlift", "4", "6-8", "150 sec", "1-2 RIR", "Keep the bar close and stop before the back rounds."],
    ["Leg Press", "3", "8-10", "120 sec", "1-2 RIR", "Use controlled depth and do not lock the knees."],
    ["Bulgarian Split Squat", "3", "8-10/leg", "90 sec", "1-2 RIR", "Keep the front foot planted and torso controlled."],
    ["Seated Leg Curl", "3", "10-12", "75 sec", "1 RIR", "Pause in the shortened position."],
    ["Standing Calf Raise", "4", "8-12", "60 sec", "1 RIR", "Use a full stretch and pause at the top."],
  ],
  "Upper Hypertrophy": [
    ["Incline Dumbbell Press", "4", "8-12", "90 sec", "1-2 RIR", "Use a deep but comfortable stretch."],
    ["One-Arm Cable Row", "4", "8-12/side", "90 sec", "1-2 RIR", "Reach forward, then pull the elbow toward the hip."],
    ["Machine Chest Press", "3", "10-15", "75 sec", "1 RIR", "Keep continuous tension; do not bounce."],
    ["Neutral-Grip Lat Pulldown", "3", "10-15", "75 sec", "1 RIR", "Keep the torso stable and control the return."],
    ["Cable Lateral Raise", "4", "12-20", "45 sec", "0-1 RIR", "Use light weight and strict form."],
    ["EZ-Bar Curl + Overhead Cable Extension", "3", "10-15 each", "60 sec", "0-1 RIR", "Superset; keep elbows fixed."],
  ],
  "Lower Hypertrophy": [
    ["Hack Squat or Leg Press", "4", "8-12", "120 sec", "1-2 RIR", "Use a controlled eccentric and stable foot position."],
    ["Hip Thrust", "4", "8-12", "120 sec", "1 RIR", "Pause for one second at lockout."],
    ["Walking Lunge", "3", "10-12/leg", "90 sec", "1-2 RIR", "Take controlled steps and keep the front heel down."],
    ["Leg Extension", "3", "12-15", "60 sec", "0-1 RIR", "Squeeze at the top without swinging."],
    ["Lying Leg Curl", "4", "10-15", "60 sec", "0-1 RIR", "Keep the hips pressed into the pad."],
    ["Seated Calf Raise", "4", "12-20", "45 sec", "0-1 RIR", "Pause in both the stretch and contraction."],
  ],
  "Push Strength": [
    ["Barbell Bench Press", "4", "4-6", "180 sec", "1-2 RIR", "Maintain full-body tension and a repeatable touch point."],
    ["Overhead Press", "4", "5-8", "150 sec", "1-2 RIR", "Brace hard and avoid leaning back."],
    ["Incline Dumbbell Press", "3", "6-10", "120 sec", "1-2 RIR", "Use a 30-degree incline and controlled lowering."],
    ["Weighted Dip or Machine Dip", "3", "6-10", "120 sec", "1-2 RIR", "Use only a pain-free shoulder range."],
    ["Cable Lateral Raise", "3", "12-15", "60 sec", "1 RIR", "Keep tension throughout the set."],
    ["Rope Pushdown", "3", "10-15", "60 sec", "1 RIR", "Separate the rope at the bottom."],
  ],
  "Pull Strength": [
    ["Deadlift or Rack Pull", "3", "3-5", "180 sec", "2 RIR", "Stop the set if position or bar speed breaks down."],
    ["Weighted Pull-up", "4", "4-8", "150 sec", "1-2 RIR", "Begin each rep from a controlled hang."],
    ["Barbell Row", "4", "5-8", "150 sec", "1-2 RIR", "Keep the torso angle stable."],
    ["Chest-Supported Row", "3", "8-10", "90 sec", "1 RIR", "Pause at peak contraction."],
    ["Rear Delt Cable Fly", "3", "12-15", "60 sec", "1 RIR", "Move through the shoulders, not the lower back."],
    ["Incline Dumbbell Curl", "3", "8-12", "60 sec", "1 RIR", "Keep the upper arm behind the torso."],
  ],
  "Legs Strength": [
    ["Back Squat", "4", "4-6", "180 sec", "1-2 RIR", "Use a consistent stance and brace before descending."],
    ["Romanian Deadlift", "4", "5-8", "150 sec", "1-2 RIR", "Hinge at the hips and keep the lats tight."],
    ["Leg Press", "3", "8-10", "120 sec", "1 RIR", "Do not let the pelvis roll off the pad."],
    ["Bulgarian Split Squat", "3", "8/leg", "90 sec", "1-2 RIR", "Control the bottom position."],
    ["Leg Curl", "3", "10-12", "75 sec", "1 RIR", "Pause for one second in contraction."],
    ["Standing Calf Raise", "4", "8-12", "60 sec", "1 RIR", "Use a full range of motion."],
  ],
  "Push Hypertrophy": [
    ["Incline Smith Press", "4", "8-12", "90 sec", "1 RIR", "Lower toward the upper chest with control."],
    ["Machine Chest Press", "3", "10-15", "75 sec", "1 RIR", "Keep the shoulders down and back."],
    ["Cable Fly", "3", "12-20", "60 sec", "0-1 RIR", "Hold the shortened position briefly."],
    ["Machine Shoulder Press", "3", "8-12", "90 sec", "1 RIR", "Stop before the lower back arches."],
    ["Lateral Raise", "4", "12-20", "45 sec", "0-1 RIR", "Last set: optional controlled drop set."],
    ["Overhead Cable Extension + Pushdown", "3", "10-15 each", "60 sec", "0-1 RIR", "Superset without losing elbow position."],
  ],
  "Pull Hypertrophy": [
    ["Neutral-Grip Pulldown", "4", "8-12", "90 sec", "1 RIR", "Drive the elbows toward the hips."],
    ["Chest-Supported T-Bar Row", "4", "8-12", "90 sec", "1 RIR", "Avoid lifting the chest from the pad."],
    ["One-Arm Lat Pulldown", "3", "10-15/side", "75 sec", "1 RIR", "Use a long stretch at the top."],
    ["Seated Cable Row", "3", "10-15", "75 sec", "1 RIR", "Pause with the shoulder blades together."],
    ["Reverse Pec Deck", "4", "12-20", "45 sec", "0-1 RIR", "Keep the traps relaxed."],
    ["Cable Curl + Hammer Curl", "3", "10-15 each", "60 sec", "0-1 RIR", "Superset with strict tempo."],
  ],
  "Legs Hypertrophy": [
    ["Hack Squat", "4", "8-12", "120 sec", "1 RIR", "Use a deep range that preserves pelvic position."],
    ["Romanian Deadlift", "4", "8-12", "120 sec", "1 RIR", "Control the stretch for 2-3 seconds."],
    ["Leg Press", "3", "12-15", "90 sec", "1 RIR", "Use continuous tension."],
    ["Leg Extension", "3", "12-20", "60 sec", "0-1 RIR", "Last set: optional rest-pause for advanced users."],
    ["Seated Leg Curl", "4", "10-15", "60 sec", "0-1 RIR", "Do not lift the hips from the seat."],
    ["Calf Raise", "5", "10-20", "45 sec", "0-1 RIR", "Pause at the bottom and top."],
  ],
  "Push": [
    ["Bench Press", "4", "6-10", "120 sec", "1-2 RIR", "Use controlled technique and stable shoulders."],
    ["Incline Dumbbell Press", "3", "8-12", "90 sec", "1-2 RIR", "Keep the bench at 30 degrees."],
    ["Seated Shoulder Press", "3", "8-12", "90 sec", "1-2 RIR", "Avoid excessive back arch."],
    ["Cable Fly", "3", "12-15", "60 sec", "1 RIR", "Use a comfortable stretch."],
    ["Lateral Raise", "3", "12-20", "45 sec", "1 RIR", "Keep movement strict."],
    ["Rope Pushdown", "3", "10-15", "60 sec", "1 RIR", "Keep elbows close to the body."],
  ],
  "Pull": [
    ["Lat Pulldown", "4", "8-12", "90 sec", "1-2 RIR", "Pull the elbows down, not the bar with the hands."],
    ["Chest-Supported Row", "4", "8-12", "90 sec", "1-2 RIR", "Pause at the top."],
    ["Seated Cable Row", "3", "10-15", "75 sec", "1 RIR", "Maintain a neutral torso."],
    ["Straight-Arm Pulldown", "3", "12-15", "60 sec", "1 RIR", "Keep the arms nearly straight."],
    ["Rear Delt Fly", "3", "12-20", "45 sec", "1 RIR", "Avoid shrugging."],
    ["Dumbbell Curl", "3", "10-15", "60 sec", "1 RIR", "Do not swing the weight."],
  ],
  "Legs": [
    ["Back Squat or Hack Squat", "4", "6-10", "150 sec", "1-2 RIR", "Use a stable stance and controlled depth."],
    ["Romanian Deadlift", "4", "8-10", "120 sec", "1-2 RIR", "Hinge through the hips."],
    ["Leg Press", "3", "10-15", "90 sec", "1 RIR", "Keep the lower back against the pad."],
    ["Walking Lunge", "3", "10/leg", "75 sec", "1-2 RIR", "Take smooth, balanced steps."],
    ["Leg Curl", "3", "10-15", "60 sec", "1 RIR", "Control both directions."],
    ["Calf Raise", "4", "12-20", "45 sec", "1 RIR", "Use full range."],
  ],
};

const SPLITS = {
  beginner: {
    3: ["Full Body A", "Full Body B", "Full Body A"],
    4: ["Upper Hypertrophy", "Lower Hypertrophy", "Upper Hypertrophy", "Lower Hypertrophy"],
    5: ["Push", "Pull", "Legs", "Upper Hypertrophy", "Lower Hypertrophy"],
    6: ["Push", "Pull", "Legs", "Push", "Pull", "Legs"],
  },
  intermediate: {
    3: ["Full Body A", "Full Body B", "Full Body A"],
    4: ["Upper Strength", "Lower Strength", "Upper Hypertrophy", "Lower Hypertrophy"],
    5: ["Push", "Pull", "Legs", "Upper Hypertrophy", "Lower Hypertrophy"],
    6: ["Push", "Pull", "Legs", "Push Hypertrophy", "Pull Hypertrophy", "Legs Hypertrophy"],
  },
  advanced: {
    3: ["Full Body A", "Full Body B", "Full Body A"],
    4: ["Upper Strength", "Lower Strength", "Upper Hypertrophy", "Lower Hypertrophy"],
    5: ["Push Strength", "Pull Strength", "Legs Strength", "Upper Hypertrophy", "Lower Hypertrophy"],
    6: ["Push Strength", "Pull Strength", "Legs Strength", "Push Hypertrophy", "Pull Hypertrophy", "Legs Hypertrophy"],
  },
};

function normalizeLevel(value = "") {
  const text = String(value).toLowerCase();
  if (text.includes("advanced")) return "advanced";
  if (text.includes("intermediate")) return "intermediate";
  return "beginner";
}

function normalizeDays(value) {
  const days = Number(value);
  return [3, 4, 5, 6].includes(days) ? days : 4;
}

function adaptExerciseName(name, location = "Gym") {
  const home = String(location).toLowerCase().includes("home");
  if (!home) return name;
  return name
    .replace(/Barbell Back Squat|Back Squat|Hack Squat or Leg Press|Hack Squat|Leg Press/g, "Goblet Squat")
    .replace(/Barbell Bench Press|Bench Press|Machine Chest Press|Incline Smith Press/g, "Dumbbell or Push-up Press")
    .replace(/Lat Pulldown|Neutral-Grip Pulldown|One-Arm Lat Pulldown/g, "Band Pulldown or One-Arm Dumbbell Row")
    .replace(/Seated Cable Row|One-Arm Cable Row|Chest-Supported T-Bar Row/g, "One-Arm Dumbbell Row")
    .replace(/Cable Fly/g, "Dumbbell Fly or Band Fly")
    .replace(/Cable Lateral Raise/g, "Dumbbell Lateral Raise")
    .replace(/Rope Pushdown/g, "Band Pushdown or Dumbbell Extension")
    .replace(/Leg Extension/g, "Heel-Elevated Squat")
    .replace(/Seated Leg Curl|Lying Leg Curl|Leg Curl/g, "Sliding Leg Curl")
    .replace(/Machine Shoulder Press/g, "Dumbbell Shoulder Press")
    .replace(/Reverse Pec Deck|Rear Delt Cable Fly/g, "Bent-Over Rear Delt Raise");
}

export function getWorkoutPlan(userData = {}) {
  const level = normalizeLevel(userData.experience);
  const days = normalizeDays(userData.workoutDays);
  const duration = userData.workoutDuration || "60-90 minutes";
  const location = userData.workoutLocation || "Gym";
  const split = SPLITS[level][days];

  const sessions = split.map((focus, index) => ({
    day: `Day ${index + 1}`,
    focus,
    warmup: "5-8 minutes easy cardio, dynamic mobility, then 2-4 progressive warm-up sets for the first compound exercise.",
    exercises: EXERCISES[focus].map(([exercise, sets, reps, rest, intensity, notes]) => ({
      exercise: adaptExerciseName(exercise, location),
      sets,
      reps,
      rest,
      intensity,
      notes,
    })),
    finisher:
      level === "advanced"
        ? "Optional: one controlled intensity technique on the final isolation exercise only. Skip it when recovery is poor."
        : "Optional: 8-12 minutes easy cardio or one light core circuit.",
    cooldown: "Walk slowly for 3-5 minutes, then hold 2-3 relevant stretches for 20-30 seconds without forcing the range.",
  }));

  return {
    level,
    days,
    duration,
    location,
    style: userData.trainingStyle || userData.goal || "General Fitness",
    sessions,
    rules: [
      "Compounds: finish most sets with 1-2 good repetitions in reserve.",
      "Isolation exercises: the final set may reach 0-1 repetitions in reserve when technique remains controlled.",
      "When all sets reach the top of the rep range, increase load by 2.5-5% and restart near the lower end.",
      "Rest 2-3 minutes for heavy compounds, 75-120 seconds for moderate lifts and 45-75 seconds for isolation work.",
      "Use a lighter deload week after 6-8 hard weeks, or earlier if performance, sleep and motivation decline together.",
    ],
  };
}

export const workoutTemplates = SPLITS;
