import { useEffect, useState } from "react";
import ProgressCharts from "./ProgressCharts";

function Dashboard({ formData, setPage }) {
  const [customer, setCustomer] = useState(null);
  const [water, setWater] = useState(0);
  const [weight, setWeight] = useState("");
  const [mealPhoto, setMealPhoto] = useState(null);
  const [loggedMeals, setLoggedMeals] = useState([]);
  const [history, setHistory] = useState([]);

  const [mealForm, setMealForm] = useState({
    mealName: "",
    quantity: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  });

  const today = new Date().toISOString().split("T")[0];

  const calorieGoal = 2500;
  const proteinGoal = 160;
  const carbsGoal = 280;
  const fatGoal = 70;

  useEffect(() => {
    const savedCustomer = localStorage.getItem("leanfitCustomer");

    if (!savedCustomer) return;

    const parsedCustomer = JSON.parse(savedCustomer);
    setCustomer(parsedCustomer);

    loadProgress(parsedCustomer.email);
    loadHistory(parsedCustomer.email);
  }, []);

  const loadProgress = async (email) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/progress/${email}/${today}`
      );

      const data = await response.json();

      if (data.success && data.progress) {
        setLoggedMeals(data.progress.meals || []);
        setWater(data.progress.water || 0);
        setWeight(data.progress.weight || "");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadHistory = async (email) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/progress/history/${email}`
      );

      const data = await response.json();

      if (data.success) {
        setHistory(data.history || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const saveProgress = async (updatedMeals, updatedWater, updatedWeight) => {
    if (!customer?.email) return;

    try {
      await fetch("http://127.0.0.1:5000/api/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: customer.email,
          date: today,
          meals: updatedMeals,
          water: updatedWater,
          weight: updatedWeight,
        }),
      });

      loadHistory(customer.email);
    } catch (error) {
      console.log(error);
    }
  };

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

  const progressWidth = (value, goal) => {
    return `${Math.min((value / goal) * 100, 100)}%`;
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) setMealPhoto(URL.createObjectURL(file));
  };

  const updateMealForm = (field, value) => {
    setMealForm({ ...mealForm, [field]: value });
  };

  const addMeal = () => {
    if (!mealForm.mealName || !mealForm.calories) return;

    const newMeals = [...loggedMeals, mealForm];

    setLoggedMeals(newMeals);
    saveProgress(newMeals, water, weight);

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

  const updateWater = (amount) => {
    const newWater = Math.max(0, Number((water + amount).toFixed(2)));
    setWater(newWater);
    saveProgress(loggedMeals, newWater, weight);
  };

  const saveWeight = () => {
    saveProgress(loggedMeals, water, weight);
  };

  return (
    <main className="dashboard-page">
      <section className="dashboard-header-card">
        <div>
          <p className="brand-label">LEAN PRO DASHBOARD</p>
          <h2>Welcome, {customer?.name || formData.name || "Member"}</h2>
          <p>Track your nutrition, meals, water intake and progress.</p>

          <div className="access-card">
            <h3>Lean Pro Access</h3>
            <p>Membership active for 30 days from purchase.</p>
            <strong>Access: Active</strong>
          </div>
        </div>

        <button
          className="secondary-btn"
          onClick={() => setPage("customer-portal")}
        >
          My Orders
        </button>
      </section>

      <section className="summary-grid">
        <div className="summary-card">
          <span>Calories</span>
          <strong>
            {totalCalories} / {calorieGoal}
          </strong>
          <p>
            {calorieGoal - totalCalories > 0
              ? calorieGoal - totalCalories
              : 0}{" "}
            kcal left
          </p>
        </div>

        <div className="summary-card">
          <span>Protein</span>
          <strong>
            {totalProtein} / {proteinGoal}g
          </strong>
          <p>
            {proteinGoal - totalProtein > 0
              ? proteinGoal - totalProtein
              : 0}
            g left
          </p>
        </div>

        <div className="summary-card">
          <span>Water</span>
          <strong>{water} / 3L</strong>
          <p>{3 - water > 0 ? Number((3 - water).toFixed(2)) : 0}L left</p>
        </div>

        <div className="summary-card">
          <span>Weight</span>
          <strong>{weight || formData.weight || "0"} kg</strong>
          <p>Today’s weight</p>
        </div>
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
            <strong>{totalProtein} / {proteinGoal}g</strong>
          </div>
          <div className="progress-bar">
            <div style={{ width: progressWidth(totalProtein, proteinGoal) }} />
          </div>
        </div>

        <div className="progress-item">
          <div>
            <span>Carbs</span>
            <strong>{totalCarbs} / {carbsGoal}g</strong>
          </div>
          <div className="progress-bar">
            <div style={{ width: progressWidth(totalCarbs, carbsGoal) }} />
          </div>
        </div>

        <div className="progress-item">
          <div>
            <span>Fat</span>
            <strong>{totalFat} / {fatGoal}g</strong>
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
            <h3>Food Tracker</h3>
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
            <p>Your logged foods are saved for today.</p>
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
          <button onClick={() => updateWater(0.25)}>+250 ml</button>
          <button onClick={() => updateWater(0.5)}>+500 ml</button>
          <button onClick={() => updateWater(-water)}>Reset</button>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-head">
          <div>
            <h3>Weight Progress</h3>
            <p>Save today’s body weight.</p>
          </div>
        </div>

        <div className="form-grid two-col">
          <div>
            <label>Today’s Weight</label>
            <input
              type="number"
              placeholder="Enter weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>

          <div>
            <label>Target Weight</label>
            <input value={formData.targetWeight || "Not specified"} disabled />
          </div>
        </div>

        <button className="primary-btn full-btn" onClick={saveWeight}>
          Save Weight
        </button>
      </section>

      <section className="dashboard-section">
        <div className="section-head">
          <div>
            <h3>Last 7 Days</h3>
            <p>Your recent calories, water and weight history.</p>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="empty-state">No history available yet.</div>
        ) : (
          history.map((day) => {
            const calories = day.meals.reduce(
              (sum, meal) => sum + Number(meal.calories || 0),
              0
            );

            return (
              <div className="meal-card" key={day._id}>
                <div>
                  <h4>{day.date}</h4>
                  <p>Calories: {calories} kcal</p>
                  <p>Water: {day.water || 0} L</p>
                </div>

                <strong>{day.weight || "-"} kg</strong>
              </div>
            );
          })
        )}
      </section>
      <ProgressCharts history={history} />
    </main>
  );
}

export default Dashboard;