function BasicProfile({ formData, setFormData, setPage }) {
  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <main className="page">
      <section className="card">
        <p className="brand-label">STEP 1 OF 5</p>
        <h2>Basic Profile</h2>
        <p className="muted">
          These details help us understand your body, goal and daily activity.
        </p>

        <div className="form-grid two-col">
          <div>
            <label>Age</label>
            <input
              type="number"
              placeholder="Example: 22"
              value={formData.age}
              onChange={(e) => updateField("age", e.target.value)}
            />
          </div>

          <div>
            <label>Gender</label>
            <select
              value={formData.gender}
              onChange={(e) => updateField("gender", e.target.value)}
            >
              <option value="">Select gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>

          <div>
            <label>Height (cm)</label>
            <input
              type="number"
              placeholder="Example: 175"
              value={formData.height}
              onChange={(e) => updateField("height", e.target.value)}
            />
          </div>

          <div>
            <label>Current Weight (kg)</label>
            <input
              type="number"
              placeholder="Example: 60"
              value={formData.weight}
              onChange={(e) => updateField("weight", e.target.value)}
            />
          </div>

          <div>
            <label>Target Weight (kg)</label>
            <input
              type="number"
              placeholder="Example: 70"
              value={formData.targetWeight}
              onChange={(e) => updateField("targetWeight", e.target.value)}
            />
          </div>

          <div>
            <label>Activity Level</label>
            <select
              value={formData.activityLevel}
              onChange={(e) => updateField("activityLevel", e.target.value)}
            >
              <option value="">Select activity level</option>
              <option>Sedentary</option>
              <option>Lightly Active</option>
              <option>Moderately Active</option>
              <option>Very Active</option>
            </select>
          </div>

          <div>
            <label>Workout Experience</label>
            <select
              value={formData.experience}
              onChange={(e) => updateField("experience", e.target.value)}
            >
              <option value="">Select experience</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>

          <div>
            <label>Country / State</label>
            <input
              type="text"
              placeholder="Example: India, Telangana"
              value={formData.location}
              onChange={(e) => updateField("location", e.target.value)}
            />
          </div>
        </div>

        <div className="page-actions">
          <button className="text-btn" onClick={() => setPage("login")}>
            Back
          </button>

          <button className="primary-btn" onClick={() => setPage("goal")}>
            Continue
          </button>
        </div>
      </section>
    </main>
  );
}

export default BasicProfile;