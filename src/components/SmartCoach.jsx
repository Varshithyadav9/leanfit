import { useMemo, useState } from "react";

const activityFactors = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  "very-active": 1.9,
};

function calculateTargets(profile) {
  const age = Number(profile.age || 25);
  const height = Number(profile.height || 170);
  const weight = Number(profile.weight || 65);
  const gender = String(profile.gender || "male").toLowerCase();
  const factor = activityFactors[String(profile.activityLevel || "moderate").toLowerCase()] || 1.55;

  const bmr = gender === "female"
    ? 10 * weight + 6.25 * height - 5 * age - 161
    : 10 * weight + 6.25 * height - 5 * age + 5;

  let calories = Math.round(bmr * factor);
  const goal = String(profile.goal || "maintenance").toLowerCase();

  if (goal.includes("loss") || goal.includes("fat")) calories -= 350;
  if (goal.includes("gain") || goal.includes("muscle") || goal.includes("bulk")) calories += 300;

  calories = Math.max(1400, calories);
  const protein = Math.round(weight * (goal.includes("gain") ? 1.8 : 1.6));
  const fat = Math.round((calories * 0.25) / 9);
  const carbs = Math.max(100, Math.round((calories - protein * 4 - fat * 9) / 4));

  return { calories, protein, carbs, fat };
}

function buildWorkout(profile, days) {
  const experience = String(profile.experience || "beginner").toLowerCase();
  const goal = String(profile.goal || "general fitness").toLowerCase();
  const advanced = experience.includes("advanced") || experience.includes("intermediate");
  const reps = goal.includes("strength") ? "5–8 reps" : goal.includes("gain") || goal.includes("muscle") ? "8–12 reps" : "10–15 reps";

  const templates = {
    3: [
      ["Day 1", "Full Body A", ["Squat", "Push-up or Bench Press", "Lat Pulldown", "Romanian Deadlift", "Plank"]],
      ["Day 2", "Full Body B", ["Deadlift", "Shoulder Press", "Seated Row", "Split Squat", "Dead Bug"]],
      ["Day 3", "Full Body C", ["Leg Press", "Incline Press", "Cable Row", "Hip Thrust", "Farmer Carry"]],
    ],
    4: [
      ["Day 1", "Upper A", ["Bench Press", "Lat Pulldown", "Shoulder Press", "Seated Row", "Biceps Curl"]],
      ["Day 2", "Lower A", ["Squat", "Romanian Deadlift", "Leg Press", "Calf Raise", "Plank"]],
      ["Day 3", "Upper B", ["Incline Press", "One-arm Row", "Lateral Raise", "Face Pull", "Triceps Pressdown"]],
      ["Day 4", "Lower B", ["Deadlift", "Split Squat", "Hip Thrust", "Leg Curl", "Dead Bug"]],
    ],
    5: [
      ["Day 1", "Push", ["Bench Press", "Incline Dumbbell Press", "Shoulder Press", "Lateral Raise", "Triceps Pressdown"]],
      ["Day 2", "Pull", ["Lat Pulldown", "Barbell Row", "Seated Row", "Face Pull", "Biceps Curl"]],
      ["Day 3", "Legs", ["Squat", "Romanian Deadlift", "Leg Press", "Leg Curl", "Calf Raise"]],
      ["Day 4", "Upper", ["Incline Press", "Pull-up", "Cable Row", "Lateral Raise", "Arms Superset"]],
      ["Day 5", "Lower", ["Deadlift", "Front Squat", "Hip Thrust", "Walking Lunge", "Core Circuit"]],
    ],
    6: [
      ["Day 1", "Push A", ["Bench Press", "Incline Press", "Shoulder Press", "Lateral Raise", "Triceps Pressdown"]],
      ["Day 2", "Pull A", ["Lat Pulldown", "Barbell Row", "Seated Row", "Face Pull", "Biceps Curl"]],
      ["Day 3", "Legs A", ["Squat", "Romanian Deadlift", "Leg Press", "Leg Curl", "Calf Raise"]],
      ["Day 4", "Push B", ["Incline Dumbbell Press", "Machine Press", "Arnold Press", "Cable Fly", "Overhead Triceps Extension"]],
      ["Day 5", "Pull B", ["Pull-up", "One-arm Row", "Cable Row", "Rear Delt Fly", "Hammer Curl"]],
      ["Day 6", "Legs B", ["Deadlift", "Front Squat", "Hip Thrust", "Walking Lunge", "Core Circuit"]],
    ],
  };

  const selected = templates[days] || templates[4];
  return selected.map(([day, title, exercises]) => ({
    day,
    title,
    exercises: exercises.map((name) => ({ name, prescription: `${advanced ? 4 : 3} sets × ${reps}` })),
  }));
}

function SmartCoach({ formData = {}, setPage }) {
  const stored = (() => {
    try {
      return JSON.parse(localStorage.getItem("leanfitCustomer") || "{}");
    } catch {
      return {};
    }
  })();

  const profile = { ...stored, ...formData };
  const [days, setDays] = useState(4);
  const targets = useMemo(() => calculateTargets(profile), [profile]);
  const workout = useMemo(() => buildWorkout(profile, days), [profile, days]);

  const goalLabel = profile.goal || "General fitness";

  return (
    <main className="coach-page">
      <header className="coach-header">
        <button type="button" className="secondary-btn" onClick={() => setPage("dashboard")}>Back to Dashboard</button>
        <div>
          <span className="eyebrow">LEANFIT V2.5</span>
          <h1>Smart Nutrition & Workout Coach</h1>
          <p>Practical daily targets and a training split based on your saved profile.</p>
        </div>
      </header>

      <section className="coach-grid">
        <article className="coach-card coach-highlight">
          <span>Current Goal</span>
          <h2>{goalLabel}</h2>
          <p>{profile.weight ? `${profile.weight} kg` : "Add your weight in Profile"} · {profile.experience || "Beginner"}</p>
        </article>
        <article className="coach-card"><span>Calories</span><strong>{targets.calories}</strong><small>kcal/day</small></article>
        <article className="coach-card"><span>Protein</span><strong>{targets.protein}g</strong><small>daily target</small></article>
        <article className="coach-card"><span>Carbs</span><strong>{targets.carbs}g</strong><small>daily target</small></article>
        <article className="coach-card"><span>Fats</span><strong>{targets.fat}g</strong><small>daily target</small></article>
      </section>

      <section className="coach-panel">
        <div className="section-head">
          <div>
            <h2>Simple Meal Structure</h2>
            <p>Use this as a flexible guide. Adjust portions to match your targets.</p>
          </div>
        </div>
        <div className="meal-guide-grid">
          <div><strong>Breakfast</strong><p>Oats or idli/dosa + eggs/milk + fruit</p></div>
          <div><strong>Lunch</strong><p>Rice/roti + chicken/fish/paneer/dal + vegetables + curd</p></div>
          <div><strong>Snack</strong><p>Fruit + peanuts/roasted chana or milk/curd</p></div>
          <div><strong>Dinner</strong><p>Protein source + rice/roti + vegetables; keep portions goal-based</p></div>
        </div>
      </section>

      <section className="coach-panel">
        <div className="section-head coach-workout-head">
          <div>
            <h2>Workout Plan</h2>
            <p>Select how many days you can train consistently.</p>
          </div>
          <select value={days} onChange={(event) => setDays(Number(event.target.value))}>
            {[3, 4, 5, 6].map((value) => <option key={value} value={value}>{value} days/week</option>)}
          </select>
        </div>

        <div className="workout-day-grid">
          {workout.map((item) => (
            <article className="workout-day-card" key={item.day}>
              <span>{item.day}</span>
              <h3>{item.title}</h3>
              <ul>
                {item.exercises.map((exercise) => (
                  <li key={exercise.name}><strong>{exercise.name}</strong><small>{exercise.prescription}</small></li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="coach-panel coach-note">
        <h2>Coach Notes</h2>
        <p>Increase weight or repetitions gradually, keep 1–3 reps in reserve on most sets, sleep 7–9 hours, and review progress every two weeks.</p>
      </section>
    </main>
  );
}

export default SmartCoach;
