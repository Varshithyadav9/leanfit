import { useMemo, useState } from "react";

function number(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export default function Calculators({ setPage }) {
  const [weight, setWeight] = useState(60);
  const [height, setHeight] = useState(175);
  const [age, setAge] = useState(22);
  const [gender, setGender] = useState("male");
  const [activity, setActivity] = useState(1.55);
  const [goal, setGoal] = useState("maintain");

  const results = useMemo(() => {
    const w = number(weight);
    const h = number(height);
    const a = number(age);
    if (!w || !h || !a) return null;
    const bmi = w / ((h / 100) ** 2);
    const bmr = gender === "female" ? 10 * w + 6.25 * h - 5 * a - 161 : 10 * w + 6.25 * h - 5 * a + 5;
    const maintenance = Math.round(bmr * number(activity));
    const calories = maintenance + (goal === "gain" ? 300 : goal === "loss" ? -350 : 0);
    const proteinFactor = goal === "gain" ? 1.8 : goal === "loss" ? 1.7 : 1.6;
    const protein = Math.round(w * proteinFactor);
    const water = Math.round(w * 35);
    return { bmi: bmi.toFixed(1), maintenance, calories, protein, water };
  }, [weight, height, age, gender, activity, goal]);

  return (
    <main className="tools-page">
      <header className="simple-header">
        <img src="/leanfit-logo.png" alt="LeanFit" className="simple-logo" />
        <button className="secondary-btn" onClick={() => setPage("welcome")}>Back to Home</button>
      </header>
      <section className="tools-hero">
        <p className="brand-label">FREE FITNESS TOOLS</p>
        <h1>Know your starting numbers.</h1>
        <p>Simple estimates for calories, protein, BMI and water. These are general guidelines, not medical advice.</p>
      </section>
      <section className="tools-layout">
        <div className="tools-form card">
          <label>Weight (kg)<input type="number" min="30" max="250" value={weight} onChange={(e) => setWeight(e.target.value)} /></label>
          <label>Height (cm)<input type="number" min="120" max="230" value={height} onChange={(e) => setHeight(e.target.value)} /></label>
          <label>Age<input type="number" min="15" max="90" value={age} onChange={(e) => setAge(e.target.value)} /></label>
          <label>Gender<select value={gender} onChange={(e) => setGender(e.target.value)}><option value="male">Male</option><option value="female">Female</option></select></label>
          <label>Activity<select value={activity} onChange={(e) => setActivity(e.target.value)}><option value="1.2">Low activity</option><option value="1.375">Light activity</option><option value="1.55">Moderate activity</option><option value="1.725">High activity</option></select></label>
          <label>Goal<select value={goal} onChange={(e) => setGoal(e.target.value)}><option value="loss">Fat loss</option><option value="maintain">Maintain</option><option value="gain">Muscle gain</option></select></label>
        </div>
        <div className="tools-results">
          <article><span>Daily calorie target</span><strong>{results?.calories || "—"} kcal</strong><small>Maintenance: {results?.maintenance || "—"} kcal</small></article>
          <article><span>Protein target</span><strong>{results?.protein || "—"} g</strong><small>Based on body weight and goal</small></article>
          <article><span>BMI</span><strong>{results?.bmi || "—"}</strong><small>Screening estimate only</small></article>
          <article><span>Water target</span><strong>{results?.water || "—"} ml</strong><small>Adjust for heat and exercise</small></article>
        </div>
      </section>
      <section className="tools-cta"><h2>Need a complete plan?</h2><p>Get a personalized Indian diet and workout plan built around your lifestyle.</p><button className="primary-btn" onClick={() => setPage("register")}>Get My Plan</button></section>
    </main>
  );
}
