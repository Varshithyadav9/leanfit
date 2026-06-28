function HabitsPage({ formData, setFormData, setPage }) {
  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <main className="page">
      <section className="card">
        <p className="brand-label">STEP 4 OF 5</p>
        <h2>Habits & Lifestyle</h2>
        <p className="muted">
          These details help us make your plan practical and easy to follow.
        </p>

        <div className="form-grid two-col">
          <div>
            <label>Smoking</label>
            <select value={formData.smoking} onChange={(e) => updateField("smoking", e.target.value)}>
              <option value="">Select</option>
              <option>No</option>
              <option>Occasionally</option>
              <option>Yes</option>
            </select>
          </div>

          <div>
            <label>Alcohol</label>
            <select value={formData.alcohol} onChange={(e) => updateField("alcohol", e.target.value)}>
              <option value="">Select</option>
              <option>No</option>
              <option>Occasionally</option>
              <option>Yes</option>
            </select>
          </div>

          <div>
            <label>Sleep Duration</label>
            <select value={formData.sleep} onChange={(e) => updateField("sleep", e.target.value)}>
              <option value="">Select</option>
              <option>Less than 6 hours</option>
              <option>6-7 hours</option>
              <option>7-8 hours</option>
              <option>More than 8 hours</option>
            </select>
          </div>

          <div>
            <label>Stress Level</label>
            <select value={formData.stress} onChange={(e) => updateField("stress", e.target.value)}>
              <option value="">Select</option>
              <option>Low</option>
              <option>Moderate</option>
              <option>High</option>
            </select>
          </div>

          <div>
            <label>Workout Time</label>
            <select value={formData.workoutTime} onChange={(e) => updateField("workoutTime", e.target.value)}>
              <option value="">Select</option>
              <option>Morning</option>
              <option>Afternoon</option>
              <option>Evening</option>
              <option>Night</option>
            </select>
          </div>

          <div>
            <label>Water Intake</label>
            <select value={formData.waterIntake} onChange={(e) => updateField("waterIntake", e.target.value)}>
              <option value="">Select</option>
              <option>Less than 2L</option>
              <option>2L - 3L</option>
              <option>3L - 4L</option>
              <option>More than 4L</option>
            </select>
          </div>
        </div>

        <div className="page-actions">
          <button className="text-btn" onClick={() => setPage("food")}>
            Previous
          </button>

          <button className="primary-btn" onClick={() => setPage("plans")}>
            Continue
          </button>
        </div>
      </section>
    </main>
  );
}

export default HabitsPage;