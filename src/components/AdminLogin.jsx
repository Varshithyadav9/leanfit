import { useState } from "react";

function AdminLogin({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const adminEmail = "admin@leanfit.in";
    const adminPassword = "LeanFit@2026";

    if (email === adminEmail && password === adminPassword) {
      setPage("admin");
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <main className="page">
      <section className="card admin-login-card">
        <p className="brand-label">LEANFIT ADMIN</p>

        <h2>Administrator Login</h2>

        <p className="muted">
          Login to manage customer orders, payments and memberships.
        </p>

        <div className="form-group">
          <label>Email</label>

          <input
            type="email"
            placeholder="admin@leanfit.in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Password</label>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <p
            style={{
              color: "#dc2626",
              marginTop: "12px",
              fontWeight: "700",
            }}
          >
            {error}
          </p>
        )}

        <button className="primary-btn full-btn" onClick={handleLogin}>
          Login
        </button>

        <button
          className="text-btn"
          style={{ marginTop: "15px" }}
          onClick={() => setPage("welcome")}
        >
          Back
        </button>
      </section>
    </main>
  );
}

export default AdminLogin;