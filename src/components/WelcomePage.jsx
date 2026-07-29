import { useState } from "react";

const benefits = [
  { icon: "🥗", title: "Personalized Nutrition", text: "Practical Indian meal guidance matched to your goal, preferences and routine." },
  { icon: "💪", title: "Structured Workouts", text: "Gym or home programs with exercises, sets, reps and progression guidance." },
  { icon: "📈", title: "Progress Tracking", text: "Keep your meals, weight, water and weekly progress together in one dashboard." },
  { icon: "🍚", title: "Familiar Foods", text: "Plans built around affordable foods you can find and prepare consistently." },
  { icon: "🎯", title: "Goal Focused", text: "Support for fat loss, muscle gain, maintenance and general fitness." },
  { icon: "🤝", title: "Simple Support", text: "Clear guidance designed for normal people—not extreme diets or confusing routines." },
];

const steps = [
  ["01", "Create your account", "Register securely using your email and mobile number."],
  ["02", "Tell us about yourself", "Complete your body profile, goal, food preferences and habits."],
  ["03", "Choose your plan", "Select diet, workout, combo or Lean Pro membership."],
  ["04", "Receive your plan", "After payment verification, download your personalized plan and begin."],
];

const plans = [
  { name: "Diet Plan", price: 199, text: "Calories, macros, Indian meals and suitable food alternatives." },
  { name: "Workout Plan", price: 199, text: "Workout split, exercises, sets, reps, cardio and progression." },
  { name: "Diet + Workout", price: 349, text: "A complete personalized diet and workout plan in PDF format.", },
  { name: "Lean Pro", price: 449, text: "Diet, workout, progress dashboard, monthly updates and support.", popular: true },
];

const faqs = [
  ["Is LeanFit suitable for beginners?", "Yes. Your plan is structured around your current experience, lifestyle and selected goal."],
  ["Can I choose vegetarian food?", "Yes. You can provide your food preferences while completing your profile."],
  ["Do I need to join a gym?", "No. Workout recommendations can be structured for gym or home training based on your situation."],
  ["How will I receive my plan?", "After payment verification, your plan is generated and made available through your customer portal. It may also be delivered manually through WhatsApp."],
  ["Is this medical advice?", "No. LeanFit provides general fitness and nutrition guidance and does not replace advice from a qualified medical professional."],
  ["Can I access my plan again later?", "Yes. Log in to the Customer Portal using the account used while placing your order."],
];

function WelcomePage({ setPage }) {
  const [openFaq, setOpenFaq] = useState(0);

  const startPlan = () => setPage("register");
  const goTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <main className="landing-page">
      <header className="landing-nav">
        <button className="landing-logo-button" type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <img src="/leanfit-logo.png" alt="LeanFit" />
        </button>

        <nav className="landing-links" aria-label="Main navigation">
          <button type="button" onClick={() => goTo("how-it-works")}>How It Works</button>
          <button type="button" onClick={() => goTo("benefits")}>Benefits</button>
          <button type="button" onClick={() => goTo("pricing")}>Pricing</button>
          <button type="button" onClick={() => goTo("faq")}>FAQ</button>
        </nav>

        <div className="landing-nav-actions">
          <button className="landing-login" type="button" onClick={() => setPage("login")}>Login</button>
          <button className="primary-btn landing-get-started" type="button" onClick={startPlan}>Get My Plan</button>
        </div>
      </header>

      <section className="landing-hero">
        <div className="landing-hero-copy">
          <span className="landing-pill">PERSONALISED FITNESS SUPPORT</span>
          <h1>Eat smarter. Train better. Build a stronger you.</h1>
          <p>
            Get practical Indian nutrition guidance, structured workouts and simple progress tracking—built around your body goal and lifestyle.
          </p>
          <div className="landing-hero-actions">
            <button className="primary-btn landing-primary-large" type="button" onClick={startPlan}>Create My Plan</button>
            <button className="landing-outline-large" type="button" onClick={() => goTo("how-it-works")}>See How It Works</button>
          </div>
          <div className="landing-trust-row">
            <span>✓ Indian food options</span>
            <span>✓ Gym or home workouts</span>
            <span>✓ Easy customer access</span>
          </div>
        </div>

        <div className="landing-hero-panel" aria-label="LeanFit plan preview">
          <div className="hero-panel-top">
            <span>YOUR LEANFIT JOURNEY</span>
            <strong>Simple. Personal. Sustainable.</strong>
          </div>
          <div className="hero-metric-grid">
            <article><span>01</span><strong>Profile</strong><small>Your body and routine</small></article>
            <article><span>02</span><strong>Goal</strong><small>Your clear direction</small></article>
            <article><span>03</span><strong>Plan</strong><small>Your daily structure</small></article>
            <article><span>04</span><strong>Progress</strong><small>Your consistency</small></article>
          </div>
          <div className="hero-panel-note">No extreme promises. Just clear guidance you can follow.</div>
        </div>
      </section>

      <section className="landing-section landing-intro" id="how-it-works">
        <div className="landing-section-heading">
          <span>HOW IT WORKS</span>
          <h2>Your personalized plan in four simple steps</h2>
          <p>Start without complicated consultations or confusing forms.</p>
        </div>
        <div className="how-grid">
          {steps.map(([number, title, text]) => (
            <article className="how-card" key={number}>
              <span className="how-number">{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section landing-soft-section" id="benefits">
        <div className="landing-section-heading">
          <span>WHY LEANFIT</span>
          <h2>Everything you need to stay consistent</h2>
          <p>Designed to make fitness feel practical, organized and easier to maintain.</p>
        </div>
        <div className="benefit-grid">
          {benefits.map((benefit) => (
            <article className="benefit-card" key={benefit.title}>
              <span className="benefit-icon" aria-hidden="true">{benefit.icon}</span>
              <h3>{benefit.title}</h3>
              <p>{benefit.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section transformation-section">
        <div className="transformation-copy">
          <span className="landing-kicker">YOUR TRANSFORMATION STARTS WITH CONSISTENCY</span>
          <h2>Measure habits, not just mirror changes.</h2>
          <p>
            LeanFit helps you focus on the daily actions that matter: following meals, completing workouts, drinking water and tracking your weight over time.
          </p>
          <button className="primary-btn" type="button" onClick={startPlan}>Start My Journey</button>
        </div>
        <div className="transformation-board">
          <div className="transformation-column">
            <span>START</span>
            <strong>Set your baseline</strong>
            <p>Profile, habits and goal</p>
          </div>
          <div className="transformation-arrow">→</div>
          <div className="transformation-column active">
            <span>BUILD</span>
            <strong>Follow your plan</strong>
            <p>Meals, workouts and water</p>
          </div>
          <div className="transformation-arrow">→</div>
          <div className="transformation-column">
            <span>TRACK</span>
            <strong>Review progress</strong>
            <p>Weight and consistency</p>
          </div>
        </div>
      </section>

      <section className="landing-section" id="pricing">
        <div className="landing-section-heading">
          <span>SIMPLE PRICING</span>
          <h2>Choose the support you need</h2>
          <p>One clear payment. No hidden charges displayed at checkout.</p>
        </div>
        <div className="landing-pricing-grid">
          {plans.map((plan) => (
            <article className={`landing-price-card${plan.popular ? " popular" : ""}`} key={plan.name}>
              {plan.popular && <span className="popular-badge">MOST POPULAR</span>}
              <h3>{plan.name}</h3>
              <div className="landing-price"><small>₹</small>{plan.price}</div>
              <p>{plan.text}</p>
              <button className={plan.popular ? "primary-btn" : "landing-price-button"} type="button" onClick={startPlan}>
                Choose Plan
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section landing-soft-section reviews-section">
        <div className="landing-section-heading">
          <span>CUSTOMER REVIEWS</span>
          <h2>Real feedback will live here</h2>
          <p>Only genuine customer reviews should be published. Add them after receiving permission from your customers.</p>
        </div>
        <div className="review-grid">
          {["Diet plan experience", "Workout plan experience", "Lean Pro experience"].map((title) => (
            <article className="review-placeholder" key={title}>
              <div className="review-stars">☆☆☆☆☆</div>
              <h3>{title}</h3>
              <p>Your verified customer review can be added here after launch.</p>
              <span>Verified review placeholder</span>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section faq-section" id="faq">
        <div className="landing-section-heading">
          <span>FREQUENTLY ASKED QUESTIONS</span>
          <h2>Questions before you begin?</h2>
        </div>
        <div className="faq-list">
          {faqs.map(([question, answer], index) => {
            const isOpen = openFaq === index;
            return (
              <article className={`faq-item${isOpen ? " open" : ""}`} key={question}>
                <button type="button" onClick={() => setOpenFaq(isOpen ? -1 : index)} aria-expanded={isOpen}>
                  <span>{question}</span><strong>{isOpen ? "−" : "+"}</strong>
                </button>
                {isOpen && <p>{answer}</p>}
              </article>
            );
          })}
        </div>
      </section>

      <section className="landing-final-cta">
        <div>
          <span>READY TO BEGIN?</span>
          <h2>Your next step can be simple.</h2>
          <p>Create your profile and choose the plan that fits your goal.</p>
        </div>
        <button className="primary-btn landing-primary-large" type="button" onClick={startPlan}>Get My Plan</button>
      </section>

      <footer className="landing-footer">
        <div className="footer-brand">
          <img src="/leanfit-logo.png" alt="LeanFit" />
          <p>Practical nutrition, structured training and simple progress support.</p>
        </div>
        <div className="footer-links">
          <button type="button" onClick={() => goTo("how-it-works")}>How It Works</button>
          <button type="button" onClick={() => goTo("pricing")}>Pricing</button>
          <button type="button" onClick={() => goTo("faq")}>FAQ</button>
          <button type="button" onClick={() => setPage("login")}>Customer Login</button>
        </div>
        <div className="footer-legal">
          <strong>Important</strong>
          <p>LeanFit provides general fitness and nutrition guidance. It is not medical advice.</p>
          <button type="button" onClick={() => setPage("admin-login")}>Admin Login</button>
        </div>
        <div className="footer-bottom">© {new Date().getFullYear()} LeanFit. All rights reserved.</div>
      </footer>
    </main>
  );
}

export default WelcomePage;
