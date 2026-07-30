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
            <button className="secondary-btn light" type="button" onClick={() => setPage("login")}>Customer Login</button>
          </div>
        </div>

        <div className="hero-summary" aria-label="LeanFit features">
          <div className="summary-item"><strong>Nutrition</strong><span>Indian meal plans and macros</span></div>
          <div className="summary-item"><strong>Training</strong><span>Goal-based workout programs</span></div>
          <div className="summary-item"><strong>Progress</strong><span>Track meals, weight and habits</span></div>
        </div>
      </section>

      <section className="features compact-features">
        <article className="feature-card compact-feature-card">
          <span className="feature-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M4 14c4.2 0 7.6-3.4 7.6-7.6V4C7.4 4 4 7.4 4 11.6V14Zm0 0c0 3.3 2.7 6 6 6h1v-2c0-2.2-1.8-4-4-4H4Zm8-2c4.4 0 8-3.6 8-8-4.4 0-8 3.6-8 8Z"/></svg>
          </span>
          <h2>Personalized Nutrition</h2>
          <p>Simple meal plans, calories, macros and practical food alternatives.</p>
        </article>
        <article className="feature-card compact-feature-card">
          <span className="feature-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M4 9v6m3-8v10m10-10v10m3-8v6M7 12h10"/></svg>
          </span>
          <h2>Workout Programs</h2>
          <p>Gym and home workout plans built around your experience and goal.</p>
        </article>
        <article className="feature-card compact-feature-card">
          <span className="feature-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M5 19V9m7 10V5m7 14v-7M3 19h18"/></svg>
          </span>
          <h2>Progress Tracking</h2>
          <p>Track daily meals, water, weight and weekly progress in one place.</p>
        </article>
      </section>

      <section className="compact-info-strip">
        <div><strong>Simple</strong><span>Clear steps without unnecessary complexity.</span></div>
        <div><strong>Affordable</strong><span>Practical plans designed for everyday life.</span></div>
        <div><strong>Personalized</strong><span>Guidance shaped around your goals and preferences.</span></div>
      </section>


      <section className="welcome-tools-section">
        <div className="welcome-tools-copy">
          <p className="section-kicker">FREE FITNESS TOOLS</p>
          <h2>Check your starting numbers in seconds.</h2>
          <p>
            Estimate your BMI, daily calories, protein target and water intake before choosing your personalized LeanFit plan.
          </p>
          <button className="primary-btn" type="button" onClick={() => setPage("calculators")}>
            Open Free Calculators
          </button>
        </div>

        <div className="welcome-tools-grid" aria-label="LeanFit free calculators">
          <article>
            <span>BMI</span>
            <h3>BMI Calculator</h3>
            <p>Check your body mass index using height and weight.</p>
          </article>
          <article>
            <span>CALORIES</span>
            <h3>Daily Calories</h3>
            <p>Estimate maintenance and goal-based calorie needs.</p>
          </article>
          <article>
            <span>PROTEIN</span>
            <h3>Protein Target</h3>
            <p>Get a practical daily protein estimate for your goal.</p>
          </article>
          <article>
            <span>WATER</span>
            <h3>Water Intake</h3>
            <p>Estimate your everyday hydration target.</p>
          </article>
        </div>
      </section>

      <footer className="compact-footer">
        <div className="footer-brand"><img src="/leanfit-logo.png" alt="LeanFit" /><p>Personalized fitness guidance for Indian lifestyles.</p></div>
        <div className="compact-footer-links">
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
