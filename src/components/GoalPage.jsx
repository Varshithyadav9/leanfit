function GoalPage({ formData, setFormData, setPage }) {
  const goals = [
    {
      title: "Muscle Gain",
      description: "Gain muscle mass, improve strength and increase body weight steadily.",
    },
    {
      title: "Fat Loss",
      description: "Reduce body fat while maintaining muscle and energy levels.",
    },
    {
      title: "Body Recomposition",
      description: "Build muscle and lose fat together with a balanced approach.",
    },
    {
      title: "Maintenance",
      description: "Maintain your current body shape while improving fitness habits.",
    },
  ];

  return (
    <main className="page">
      <section className="card">
        <p className="brand-label">STEP 2 OF 5</p>
        <h2>Choose Your Goal</h2>
        <p className="muted">
          Your goal helps us prepare the right nutrition and workout direction.
        </p>

        <div className="goal-grid">
          {goals.map((goal) => (
            <div
              key={goal.title}
              className={
                formData.goal === goal.title
                  ? "goal-card selected-card"
                  : "goal-card"
              }
              onClick={() =>
                setFormData({ ...formData, goal: goal.title })
              }
            >
              <h3>{goal.title}</h3>
              <p>{goal.description}</p>
            </div>
          ))}
        </div>

        <div className="page-actions">
          <button className="text-btn" onClick={() => setPage("profile")}>
            Previous
          </button>

          <button
            className="primary-btn"
            disabled={!formData.goal}
            onClick={() => setPage("food")}
          >
            Continue
          </button>
        </div>
      </section>
    </main>
  );
}

export default GoalPage;