function WelcomePage({ setPage }) {
  return (
    <main className="welcome-page">
      <section className="hero">
        <p className="brand-label">LEANFIT</p>

        <h1>Transform Your Body with AI</h1>

        <p className="hero-text">
          Personalized Diet Plans • Workout Plans • Lean Pro Membership
        </p>

        <div className="hero-buttons">
          <button
            className="primary-btn"
            onClick={() => setPage("login")}
          >
            Get My Plan
          </button>

          <button
            className="secondary-btn"
            onClick={() => setPage("customer-auth")}
          >
            Customer Login
          </button>

          <button
            className="secondary-btn"
            onClick={() => setPage("admin-login")}
          >
            Admin Login
          </button>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>🥗 AI Diet Plan</h3>
          <p>100% personalized Indian diet plan.</p>
        </div>

        <div className="feature-card">
          <h3>🏋️ Workout Plan</h3>
          <p>Gym & Home workouts based on your goal.</p>
        </div>

        <div className="feature-card">
          <h3>📊 Progress Tracking</h3>
          <p>Track calories, weight, water and workouts.</p>
        </div>

        <div className="feature-card">
          <h3>👑 Lean Pro</h3>
          <p>30-day dashboard with premium tracking features.</p>
        </div>
      </section>
    </main>
  );
}

export default WelcomePage;