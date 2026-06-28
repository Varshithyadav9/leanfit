function LoginPage({ formData, setFormData, setPage }) {
  return (
    <main className="page">
      <section className="card auth-card">
        <p className="brand-label">LEANFIT</p>
        <h2>Create Your Profile</h2>
        <p className="muted">
          Enter your contact details so your plan and payment confirmation can be matched correctly.
        </p>

        <div className="form-grid">
          <div>
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label>Email ID</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label>Mobile Number</label>
            <input
              type="tel"
              placeholder="Enter mobile number"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
            />
          </div>
        </div>

        <button className="primary-btn full-btn" onClick={() => setPage("profile")}>
          Continue
        </button>

        <button className="text-btn" onClick={() => setPage("welcome")}>
          Back to Home
        </button>
      </section>
    </main>
  );
}

export default LoginPage;