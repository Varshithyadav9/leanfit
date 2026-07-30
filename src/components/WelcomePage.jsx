function WelcomePage({ setPage }) {
  const openInfo = (page) => setPage(page);

  return (
    <main className="welcome-page compact-welcome">
      <header className="topbar compact-topbar">
        <button className="brand-button" type="button" onClick={() => setPage("welcome")} aria-label="LeanFit home">
          <img src="/leanfit-logo.png" alt="LeanFit" className="welcome-logo" />
        </button>

        <nav className="compact-nav" aria-label="Main navigation">
          <button type="button" onClick={() => openInfo("about")}>About</button>
          <button type="button" onClick={() => openInfo("contact")}>Contact</button>
          <button type="button" className="customer-login-link" onClick={() => setPage("login")}>Customer Login</button>
          <button type="button" className="admin-login-btn" onClick={() => setPage("admin-login")}>Admin Login</button>
        </nav>
      </header>

      <section className="hero compact-hero">
        <div className="hero-content">
          <p className="brand-label">PERSONALISED FITNESS SUPPORT</p>
          <h1>Transform your body with a plan made for you.</h1>
          <p className="hero-text">
            Get practical Indian nutrition guidance, structured workouts and progress tracking based on your goal and lifestyle.
          </p>

          <div className="hero-actions">
            <button className="primary-btn" type="button" onClick={() => setPage("register")}>Get My Plan</button>
            <button className="secondary-btn light" type="button" onClick={() => setPage("customer-portal")}>View My Orders</button>
          </div>
        </div>

        <div className="hero-summary" aria-label="LeanFit features">
          <div className="summary-item"><strong>Nutrition</strong><span>Indian meal plans and macros</span></div>
          <div className="summary-item"><strong>Training</strong><span>Goal-based workout programs</span></div>
          <div className="summary-item"><strong>Progress</strong><span>Track meals, weight and habits</span></div>
        </div>
      </section>

      <section className="features compact-features">
        <article className="feature-card"><span className="feature-number">01</span><h2>Personalized Nutrition</h2><p>Simple meal plans, calories, macros and practical food alternatives.</p></article>
        <article className="feature-card"><span className="feature-number">02</span><h2>Workout Programs</h2><p>Gym and home workout plans built around your experience and goal.</p></article>
        <article className="feature-card"><span className="feature-number">03</span><h2>Progress Tracking</h2><p>Track daily meals, water, weight and weekly progress in one place.</p></article>
      </section>

      <section className="compact-info-strip">
        <div><strong>Simple</strong><span>Clear steps without unnecessary complexity.</span></div>
        <div><strong>Affordable</strong><span>Practical plans designed for everyday life.</span></div>
        <div><strong>Personalized</strong><span>Guidance shaped around your goals and preferences.</span></div>
      </section>

      <footer className="compact-footer">
        <div className="footer-brand"><img src="/leanfit-logo.png" alt="LeanFit" /><p>Personalized fitness support by Varshith.</p></div>
        <div className="compact-footer-links">
          <button type="button" onClick={() => openInfo("about")}>About</button>
          <button type="button" onClick={() => openInfo("contact")}>Contact</button>
          <button type="button" onClick={() => openInfo("privacy")}>Privacy Policy</button>
          <button type="button" onClick={() => openInfo("terms")}>Terms & Conditions</button>
        </div>
        <p className="footer-copy">© 2026 LeanFit. All rights reserved.</p>
      </footer>
    </main>
  );
}

export default WelcomePage;
