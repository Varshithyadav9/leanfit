function PlanPage({ formData, setFormData, setPage }) {
  const plans = [
    {
      name: "Diet Plan",
      price: 199,
      description:
        "Personalized diet plan with calories, macros, Indian meals and food alternatives.",
    },
    {
      name: "Workout Plan",
      price: 199,
      description:
        "Workout split with exercises, sets, reps, cardio and progression guidance.",
    },
    {
      name: "Diet + Workout",
      price: 349,
      description:
        "Complete personalized diet and workout plan in PDF format.",
    },
    {
      name: "Lean Pro Membership",
      price: 449,
      description:
        "Diet, workout, progress tracking, monthly updates and WhatsApp support.",
    },
  ];

  const selectPlan = (plan) => {
    setFormData({
      ...formData,
      selectedPlan: plan.name,
      selectedPrice: plan.price,
    });
  };

  const hasSelectedPlan = Boolean(formData.selectedPlan);

  return (
    <main className="page">
      <section className="card">
        <p className="brand-label">STEP 5 OF 5</p>
        <h2>Choose Your Plan</h2>
        <p className="muted">
          Select one plan to continue. Your selected plan will appear below.
        </p>

        <div className="plan-grid">
          {plans.map((plan) => {
            const isSelected = formData.selectedPlan === plan.name;

            return (
              <div
                key={plan.name}
                className={isSelected ? "plan-card selected-card" : "plan-card"}
                onClick={() => selectPlan(plan)}
              >
                {isSelected && <span className="selected-badge">Selected</span>}

                <h3>{plan.name}</h3>
                <p>{plan.description}</p>
                <strong>₹{plan.price}</strong>
              </div>
            );
          })}
        </div>

        {hasSelectedPlan && (
          <div className="selected-summary">
            <p>Selected Plan</p>
            <h3>{formData.selectedPlan}</h3>
            <strong>₹{formData.selectedPrice}</strong>
          </div>
        )}

        <div className="page-actions">
          <button className="text-btn" onClick={() => setPage("habits")}>
            Previous
          </button>

          <button
            className="primary-btn"
            disabled={!hasSelectedPlan}
            onClick={() => setPage("payment")}
          >
            Continue
          </button>
        </div>
      </section>
    </main>
  );
}

export default PlanPage;