function WelcomePage({ setPage }) {
  return (
    <main className="welcome-page">
      <header className="topbar">
        <div>
          <p className="topbar-brand">LEANFIT</p>
          <p className="topbar-subtitle">By Varshith</p>
        </div>

        <button
          className="admin-login-btn"
          type="button"
          onClick={() => {
            window.location.href = "/admin";
          }}
        >
          Admin Login
        </button>
      </header>

      <section className="hero">
        <div className="hero-content">
          <p className="brand-label">PERSONALISED FITNESS SUPPORT</p>
          <h1>Transform your body with a plan made for you.</h1>
          <p className="hero-text">
            Get practical Indian nutrition guidance, structured workouts and progress tracking based on your goal and lifestyle.
          </p>

          <div className="hero-actions">
            <button className="primary-btn" type="button" onClick={() => setPage("register")}>
              Get My Plan
            </button>
            <button className="secondary-btn light" type="button" onClick={() => setPage("login")}>
              Customer Login
            </button>
          </div>
        </div>

        <div className="hero-summary" aria-label="LeanFit features">
          <div className="summary-item">
            <strong>Nutrition</strong>
            <span>Indian meal plans and macros</span>
          </div>
          <div className="summary-item">
            <strong>Training</strong>
            <span>Goal-based workout programs</span>
          </div>
          <div className="summary-item">
            <strong>Progress</strong>
            <span>Track meals, weight and habits</span>
          </div>
        </div>
      </section>

      <section className="features">
        <article className="feature-card">
          <span className="feature-number">01</span>
          <h2>Personalized Nutrition</h2>
          <p>Simple meal plans, calories, macros and suitable food alternatives.</p>
        </article>

        <article className="feature-card">
          <span className="feature-number">02</span>
          <h2>Workout Programs</h2>
          <p>Gym and home workout plans structured around your experience and goal.</p>
        </article>

        <article className="feature-card">
          <span className="feature-number">03</span>
          <h2>Progress Tracking</h2>
          <p>Track daily meals, water, weight and weekly progress in one place.</p>
        </article>
      </section>
    </main>
  );
}

export default WelcomePage;
