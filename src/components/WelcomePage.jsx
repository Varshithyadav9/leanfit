function WelcomePage({ setPage }) {
  return (
    <main className="welcome-page">
      <section className="hero">
        <p className="brand-label">LEANFIT BY VARSHITH</p>

        <h1>Transform Your Body. One Plan at a Time.</h1>

        <p className="hero-text">
          Personalized nutrition, workout guidance and progress tracking
          designed around your body, lifestyle and fitness goals.
        </p>

        <button className="primary-btn" onClick={() => setPage("login")}>
          Start Your Journey
        </button>

        <button
          className="text-btn"
          onClick={() => setPage("admin-login")}
          style={{ marginTop: "18px", color: "#d1d5db" }}
        >
          Admin Login
        </button>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>Personalized Nutrition</h3>
          <p>Indian meal plans, calories, macros and food alternatives.</p>
        </div>

        <div className="feature-card">
          <h3>Workout Programs</h3>
          <p>Gym and home workout plans based on your goal.</p>
        </div>

        <div className="feature-card">
          <h3>Progress Tracking</h3>
          <p>Track calories, water, weight and weekly progress.</p>
        </div>

        <div className="feature-card">
          <h3>Lean Pro</h3>
          <p>Monthly updates, dashboard access and WhatsApp support.</p>
        </div>
      </section>
    </main>
  );
}

export default WelcomePage;