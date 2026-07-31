import { useState } from "react";

function HabitsPage({ formData, setFormData, setPage }) {
  const [message, setMessage] = useState("");

  const updateField = (field, value) => {
    setMessage("");
    setFormData({ ...formData, [field]: value });
  };

  const continueToPlans = () => {
    const requiredFields = [
      "smoking",
      "alcohol",
      "sleep",
      "stress",
      "workoutTime",
      "waterIntake",
      "workoutDays",
      "workoutLocation",
      "workoutDuration",
      "trainingStyle",
    ];

    const missing = requiredFields.some(
      (field) => !String(formData[field] || "").trim()
    );

    if (missing) {
      setMessage("Complete all required fields before continuing.");
      return;
    }

    setPage("plans");
  };

  return (
    <main className="page">
      <section className="card">
        <p className="brand-label">STEP 4 OF 5</p>
        <h2>Habits & Training Preferences</h2>
        <p className="muted">
          These details help LeanFit build a practical diet and a workout plan that matches your real schedule.
        </p>

        <h3 className="form-section-title">Lifestyle</h3>
        <div className="form-grid two-col">
          <div>
            <label>Smoking *</label>
            <select value={formData.smoking || ""} onChange={(e) => updateField("smoking", e.target.value)}>
              <option value="">Select</option>
              <option>No</option>
              <option>Occasionally</option>
              <option>Yes</option>
            </select>
          </div>

          <div>
            <label>Alcohol *</label>
            <select value={formData.alcohol || ""} onChange={(e) => updateField("alcohol", e.target.value)}>
              <option value="">Select</option>
              <option>No</option>
              <option>Occasionally</option>
              <option>Yes</option>
            </select>
          </div>

          <div>
            <label>Sleep Duration *</label>
            <select value={formData.sleep || ""} onChange={(e) => updateField("sleep", e.target.value)}>
              <option value="">Select</option>
              <option>Less than 6 hours</option>
              <option>6-7 hours</option>
              <option>7-8 hours</option>
              <option>More than 8 hours</option>
            </select>
          </div>

          <div>
            <label>Stress Level *</label>
            <select value={formData.stress || ""} onChange={(e) => updateField("stress", e.target.value)}>
              <option value="">Select</option>
              <option>Low</option>
              <option>Moderate</option>
              <option>High</option>
            </select>
          </div>

          <div>
            <label>Preferred Workout Time *</label>
            <select value={formData.workoutTime || ""} onChange={(e) => updateField("workoutTime", e.target.value)}>
              <option value="">Select</option>
              <option>Morning</option>
              <option>Afternoon</option>
              <option>Evening</option>
              <option>Night</option>
            </select>
          </div>

          <div>
            <label>Water Intake *</label>
            <select value={formData.waterIntake || ""} onChange={(e) => updateField("waterIntake", e.target.value)}>
              <option value="">Select</option>
              <option>Less than 2L</option>
              <option>2L - 3L</option>
              <option>3L - 4L</option>
              <option>More than 4L</option>
            </select>
          </div>
        </div>

        <h3 className="form-section-title">Workout Plan Setup</h3>
        <p className="muted form-section-note">
          Required for creating your detailed exercise-by-exercise workout PDF.
        </p>

        <div className="form-grid two-col">
          <div>
            <label>Workout Days Per Week *</label>
            <select value={formData.workoutDays || ""} onChange={(e) => updateField("workoutDays", e.target.value)}>
              <option value="">Select</option>
              <option value="3">3 Days</option>
              <option value="4">4 Days</option>
              <option value="5">5 Days</option>
              <option value="6">6 Days</option>
            </select>
          </div>

          <div>
            <label>Workout Location *</label>
            <select value={formData.workoutLocation || ""} onChange={(e) => updateField("workoutLocation", e.target.value)}>
              <option value="">Select</option>
              <option>Gym</option>
              <option>Home + Dumbbells</option>
              <option>Home / Bodyweight</option>
            </select>
          </div>

          <div>
            <label>Session Duration *</label>
            <select value={formData.workoutDuration || ""} onChange={(e) => updateField("workoutDuration", e.target.value)}>
              <option value="">Select</option>
              <option>30-45 minutes</option>
              <option>45-60 minutes</option>
              <option>60-90 minutes</option>
            </select>
          </div>

          <div>
            <label>Training Style *</label>
            <select value={formData.trainingStyle || ""} onChange={(e) => updateField("trainingStyle", e.target.value)}>
              <option value="">Select</option>
              <option>Muscle Gain / Hypertrophy</option>
              <option>Strength</option>
              <option>Fat Loss Conditioning</option>
              <option>General Fitness</option>
            </select>
          </div>

          <div className="full-width-field">
            <label>Injury or Movement Limitation</label>
            <select value={formData.injuryLimitations || "None"} onChange={(e) => updateField("injuryLimitations", e.target.value)}>
              <option>None</option>
              <option>Shoulder discomfort</option>
              <option>Knee discomfort</option>
              <option>Lower-back discomfort</option>
              <option>Other / Prefer trainer review</option>
            </select>
            <p className="field-help">The plan is a general fitness guide. Pain or injury should be reviewed by a qualified professional.</p>
          </div>
        </div>

        {message && <p className="form-message error">{message}</p>}

        <div className="page-actions">
          <button className="text-btn" type="button" onClick={() => setPage("food")}>
            Previous
          </button>

          <button className="primary-btn" type="button" onClick={continueToPlans}>
            Continue
          </button>
        </div>
      </section>
    </main>
  );
}

export default HabitsPage;
