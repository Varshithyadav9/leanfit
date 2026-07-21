import { useEffect, useState } from "react";
import ProgressCharts from "./ProgressCharts";

function Dashboard({ formData, setPage }) {
  const [customer, setCustomer] = useState(null);
  const [water, setWater] = useState(0);
  const [weight, setWeight] = useState("");
  const [mealPhotoPreview, setMealPhotoPreview] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [analyzingPhoto, setAnalyzingPhoto] = useState(false);
  const [aiConfidence, setAiConfidence] = useState(0);
  const [photoUploadError, setPhotoUploadError] = useState("");
  const [loggedMeals, setLoggedMeals] = useState([]);
  const [history, setHistory] = useState([]);
  const [barcode, setBarcode] = useState("");
  const [barcodeStatus, setBarcodeStatus] = useState("");
  const [lookingUpBarcode, setLookingUpBarcode] = useState(false);

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
        `https://leanfit.onrender.com/api/progress/${email}/${today}`
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
        `https://leanfit.onrender.com/api/progress/history/${email}`
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
      await fetch("https://leanfit.onrender.com/api/progress", {
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

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setMealPhotoPreview(localPreview);
    setUploadedImageUrl("");
    setPhotoUploadError("");
    setAiConfidence(0);
    setUploadingPhoto(true);
    setAnalyzingPhoto(true);

    try {
      const formData = new FormData();
      formData.append("mealPhoto", file);

      const response = await fetch(
        "https://leanfit.onrender.com/api/food/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to upload meal photo.");
      }

      setUploadedImageUrl(data.imageUrl);

      if (data.analysis) {
        setMealForm({
          mealName: data.analysis.mealName || "",
          quantity: data.analysis.quantity || "",
          calories: String(data.analysis.calories ?? ""),
          protein: String(data.analysis.protein ?? ""),
          carbs: String(data.analysis.carbs ?? ""),
          fat: String(data.analysis.fat ?? ""),
        });
        setAiConfidence(Number(data.analysis.confidence || 0));
      } else {
        setPhotoUploadError(
          data.message ||
            "Photo uploaded, but automatic detection was unavailable. Enter the values manually."
        );
      }
    } catch (error) {
      console.error(error);
      setPhotoUploadError(error.message || "Unable to upload meal photo.");
    } finally {
      setUploadingPhoto(false);
      setAnalyzingPhoto(false);
    }
  };

  const applyBarcodeProduct = (product) => {
    setMealForm({
      mealName: product.mealName || "",
      quantity: product.quantity || "1 serving",
      calories: String(product.calories ?? ""),
      protein: String(product.protein ?? ""),
      carbs: String(product.carbs ?? ""),
      fat: String(product.fat ?? ""),
    });

    setUploadedImageUrl(product.imageUrl || "");
    setMealPhotoPreview(product.imageUrl || null);
    setAiConfidence(0);
  };

  const lookupBarcode = async (barcodeValue = barcode) => {
    const cleanBarcode = String(barcodeValue || "").replace(/\D/g, "");

    if (cleanBarcode.length < 8) {
      setBarcodeStatus("Enter or scan a valid barcode.");
      return;
    }

    setBarcode(cleanBarcode);
    setBarcodeStatus("Looking up product...");
    setLookingUpBarcode(true);

    try {
      const response = await fetch(
        `https://leanfit.onrender.com/api/food/barcode/${cleanBarcode}`
      );
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Product not found.");
      }

      applyBarcodeProduct(data.product);
      setBarcodeStatus("Product found. Nutrition fields were filled automatically.");
    } catch (error) {
      setBarcodeStatus(error.message || "Unable to look up this barcode.");
    } finally {
      setLookingUpBarcode(false);
    }
  };

  const handleBarcodeImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!("BarcodeDetector" in window)) {
      setBarcodeStatus(
        "Automatic scanning is not supported in this browser. Enter the barcode number manually."
      );
      return;
    }

    setBarcodeStatus("Scanning barcode...");

    try {
      const detector = new window.BarcodeDetector({
        formats: ["ean_13", "ean_8", "upc_a", "upc_e", "code_128"],
      });
      const bitmap = await createImageBitmap(file);
      const results = await detector.detect(bitmap);

      if (!results.length) {
        setBarcodeStatus("No barcode detected. Try a clearer photo or enter it manually.");
        return;
      }

      const detectedBarcode = results[0].rawValue;
      setBarcode(detectedBarcode);
      await lookupBarcode(detectedBarcode);
    } catch (error) {
      setBarcodeStatus("Could not scan this image. Try again or enter the barcode manually.");
    } finally {
      event.target.value = "";
    }
  };

  const updateMealForm = (field, value) => {
    setMealForm({ ...mealForm, [field]: value });
  };

  const addMeal = () => {
    if (!mealForm.mealName || !mealForm.calories || uploadingPhoto) return;

    const newMeal = {
      ...mealForm,
      imageUrl: uploadedImageUrl,
      aiConfidence,
      aiGenerated: aiConfidence > 0,
      createdAt: new Date().toISOString(),
    };

    const newMeals = [...loggedMeals, newMeal];

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

    if (mealPhotoPreview) {
      URL.revokeObjectURL(mealPhotoPreview);
    }

    setMealPhotoPreview(null);
    setUploadedImageUrl("");
    setPhotoUploadError("");
    setAiConfidence(0);
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

        <div className="barcode-scanner-card">
          <h4>Scan Packaged Food Barcode</h4>
          <p>Take a clear photo of the barcode or enter the number manually.</p>

          <div className="form-grid two-col">
            <div>
              <label>Barcode Number</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Enter 8–14 digit barcode"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value.replace(/\D/g, ""))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") lookupBarcode();
                }}
              />
            </div>

            <div>
              <label>Scan Barcode Photo</label>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleBarcodeImage}
              />
            </div>
          </div>

          <button
            type="button"
            className="secondary-btn full-btn"
            onClick={() => lookupBarcode()}
            disabled={lookingUpBarcode}
          >
            {lookingUpBarcode ? "Searching Product..." : "Find Product"}
          </button>

          {barcodeStatus && <p className="barcode-status">{barcodeStatus}</p>}
        </div>

        <h4>Or Upload a Meal Photo</h4>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handlePhotoUpload}
        />

        {mealPhotoPreview && (
          <img
            src={mealPhotoPreview}
            alt="Food preview"
            className="food-preview"
          />
        )}

        {uploadingPhoto && (
          <p>{analyzingPhoto ? "Analyzing food and estimating nutrition..." : "Uploading meal photo..."}</p>
        )}

        {!uploadingPhoto && uploadedImageUrl && aiConfidence > 0 && (
          <p>Food detected and fields filled automatically ({aiConfidence}% confidence).</p>
        )}

        {!uploadingPhoto && uploadedImageUrl && aiConfidence === 0 && !photoUploadError && (
          <p>Meal photo uploaded successfully.</p>
        )}

        {photoUploadError && (
          <p className="form-error">{photoUploadError}</p>
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

        <button
          className="primary-btn full-btn"
          onClick={addMeal}
          disabled={uploadingPhoto}
        >
          {uploadingPhoto ? "Analyzing Food..." : "Add Meal"}
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
            <div className="meal-card" key={meal._id || index}>
              {meal.imageUrl && (
                <img
                  src={meal.imageUrl}
                  alt={meal.mealName || "Logged meal"}
                  className="meal-history-image"
                />
              )}

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

                <div className="history-meal-images">
                  {(day.meals || [])
                    .filter((meal) => meal.imageUrl)
                    .slice(0, 4)
                    .map((meal, index) => (
                      <img
                        key={meal._id || `${day._id}-${index}`}
                        src={meal.imageUrl}
                        alt={meal.mealName || "Meal history"}
                        className="meal-history-thumbnail"
                      />
                    ))}
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