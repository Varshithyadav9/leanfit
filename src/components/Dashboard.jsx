import { useState } from "react";

function Dashboard({ formData, setPage }) {
  const [water, setWater] = useState(0);
  const [mealPhoto, setMealPhoto] = useState(null);
  const [mealForm, setMealForm] = useState({
    mealName: "",
    quantity: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  });

  const [loggedMeals, setLoggedMeals] = useState([]);

  const calorieGoal = 2500;
  const proteinGoal = 160;
  const carbsGoal = 280;
  const fatGoal = 70;

  const totalCalories = loggedMeals.reduce(
    (sum, meal) => sum + Number(meal.calories || 0),
    0
  );

  const totalProtein = loggedMeals.reduce(
    (sum, meal) => sum + Number(meal.protein || 0),
    0
  );

  const totalCarbs = loggedMeals.reduce(
    (sum, meal) => sum + Number(meal.carbs || 0),
    0
  );

  const totalFat = loggedMeals.reduce(
    (sum, meal) => sum + Number(meal.fat || 0),
    0
  );

  const caloriePercent = Math.min(
    Math.round((totalCalories / calorieGoal) * 100),
    100
  );

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMealPhoto(URL.createObjectURL(file));
    }
  };

  const updateMealForm = (field, value) => {
    setMealForm({ ...mealForm, [field]: value });
  };

  const addMeal = () => {
    if (!mealForm.mealName || !mealForm.calories) return;

    setLoggedMeals([...loggedMeals, mealForm]);

    setMealForm({
      mealName: "",
      quantity: "",
      calories: "",
      protein: "",
      carbs: "",
      fat: "",
    });

    setMealPhoto(null);
  };

  const progressWidth = (value, goal) => {
    return `${Math.min((value / goal) * 100, 100)}%`;
  };

  return (
    <main className="dashboard-page">
      <section className="dashboard-header-card">
        <div>
          <p className="brand-label">LEAN PRO DASHBOARD</p>
          <h2>Welcome, {formData.name || "Member"}</h2>
          <p>Track your nutrition, meals, water intake and progress.</p>

          {formData.selectedPlan === "Lean Pro Membership" && (
            <div className="access-card">
              <h3>Lean Pro Access</h3>
              <p>Membership active for 30 days from purchase.</p>
              <strong>Access: Active</strong>
            </div>
          )}
        </div>

        <button className="secondary-btn" onClick={() => setPage("welcome")}>
          Home
        </button>
      </section>

      <section className="calorie-card">
        <div
          className="calorie-ring"
          style={{
            background: `conic-gradient(#16a34a 0% ${caloriePercent}%, #e5e7eb ${caloriePercent}% 100%)`,
          }}
        >
          <div>
            <strong>{caloriePercent}%</strong>
            <span>completed</span>
          </div>
        </div>

        <div className="calorie-info">
          <p>Today’s Calories</p>
          <h2>
            {totalCalories} / {calorieGoal} kcal
          </h2>
          <span>
            {calorieGoal - totalCalories > 0
              ? calorieGoal - totalCalories
              : 0}{" "}
            kcal remaining
          </span>
        </div>
      </section>

      <section className="nutrition-progress-section">
        <h3>Nutrition Progress</h3>

        <div className="progress-item">
          <div>
            <span>Protein</span>
            <strong>
              {totalProtein} / {proteinGoal}g
            </strong>
          </div>
          <div className="progress-bar">
            <div style={{ width: progressWidth(totalProtein, proteinGoal) }} />
          </div>
        </div>

        <div className="progress-item">
          <div>
            <span>Carbs</span>
            <strong>
              {totalCarbs} / {carbsGoal}g
            </strong>
          </div>
          <div className="progress-bar">
            <div style={{ width: progressWidth(totalCarbs, carbsGoal) }} />
          </div>
        </div>

        <div className="progress-item">
          <div>
            <span>Fat</span>
            <strong>
              {totalFat} / {fatGoal}g
            </strong>
          </div>
          <div className="progress-bar">
            <div style={{ width: progressWidth(totalFat, fatGoal) }} />
          </div>
        </div>

        <div className="progress-item">
          <div>
            <span>Water</span>
            <strong>{water} / 3L</strong>
          </div>
          <div className="progress-bar">
            <div style={{ width: progressWidth(water, 3) }} />
          </div>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-head">
          <div>
            <h3>Food Photo Tracker</h3>
            <p>Upload food photo and enter nutrition details.</p>
          </div>
        </div>

        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handlePhotoUpload}
        />

        {mealPhoto && (
          <img src={mealPhoto} alt="Food preview" className="food-preview" />
        )}

        <div className="form-grid two-col">
          <div>
            <label>Meal Name</label>
            <input
              type="text"
              placeholder="Rice and chicken curry"
              value={mealForm.mealName}
              onChange={(e) => updateMealForm("mealName", e.target.value)}
            />
          </div>

          <div>
            <label>Quantity</label>
            <input
              type="text"
              placeholder="1 plate / 200g / 1 cup"
              value={mealForm.quantity}
              onChange={(e) => updateMealForm("quantity", e.target.value)}
            />
          </div>

          <div>
            <label>Calories</label>
            <input
              type="number"
              placeholder="450"
              value={mealForm.calories}
              onChange={(e) => updateMealForm("calories", e.target.value)}
            />
          </div>

          <div>
            <label>Protein</label>
            <input
              type="number"
              placeholder="25"
              value={mealForm.protein}
              onChange={(e) => updateMealForm("protein", e.target.value)}
            />
          </div>

          <div>
            <label>Carbs</label>
            <input
              type="number"
              placeholder="60"
              value={mealForm.carbs}
              onChange={(e) => updateMealForm("carbs", e.target.value)}
            />
          </div>

          <div>
            <label>Fat</label>
            <input
              type="number"
              placeholder="12"
              value={mealForm.fat}
              onChange={(e) => updateMealForm("fat", e.target.value)}
            />
          </div>
        </div>

        <button className="primary-btn full-btn" onClick={addMeal}>
          Add Meal
        </button>
      </section>

      <section className="dashboard-section">
        <div className="section-head">
          <div>
            <h3>Today’s Meals</h3>
            <p>Your logged foods appear here.</p>
          </div>
        </div>

        {loggedMeals.length === 0 ? (
          <div className="empty-state">No meals added yet.</div>
        ) : (
          loggedMeals.map((meal, index) => (
            <div className="meal-card" key={index}>
              <div>
                <h4>{meal.mealName}</h4>
                <p>{meal.quantity || "Quantity not added"}</p>
                <p>
                  Protein {meal.protein || 0}g | Carbs {meal.carbs || 0}g |
                  Fat {meal.fat || 0}g
                </p>
              </div>

              <strong>{meal.calories} kcal</strong>
            </div>
          ))
        )}
      </section>

      <section className="dashboard-section">
        <div className="section-head">
          <div>
            <h3>Water Intake</h3>
            <p>Track your daily water goal.</p>
          </div>
        </div>

        <div className="water-actions">
          <button onClick={() => setWater(water + 0.25)}>+250 ml</button>
          <button onClick={() => setWater(water + 0.5)}>+500 ml</button>
          <button onClick={() => setWater(0)}>Reset</button>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-head">
          <div>
            <h3>Weight Progress</h3>
            <p>Stay consistent with your target.</p>
          </div>
        </div>

        <div className="weight-grid">
          <div>
            <span>Current Weight</span>
            <strong>{formData.weight || "0"} kg</strong>
          </div>

          <div>
            <span>Target Weight</span>
            <strong>{formData.targetWeight || "0"} kg</strong>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;