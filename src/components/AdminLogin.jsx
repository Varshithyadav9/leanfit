import { useState } from "react";
import PasswordInput from "./PasswordInput";

function AdminLogin({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const adminEmail = "admin@leanfit.in";
    const adminPassword = "LeanFit@2026";

    if (email.trim().toLowerCase() === adminEmail && password === adminPassword) {
      setError("");
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
        <p className="muted">Login to manage customer orders, payments and memberships.</p>

        <div className="form-grid" onKeyDown={(event) => event.key === "Enter" && handleLogin()}>
          <div>
            <label htmlFor="adminEmail">Email</label>
            <input
              id="adminEmail"
              type="email"
              autoComplete="username"
              placeholder="admin@leanfit.in"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div>
            <label htmlFor="adminPassword">Password</label>
            <PasswordInput
              id="adminPassword"
              name="adminPassword"
              autoComplete="current-password"
              placeholder="Enter password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
        </div>

        {error && <p className="form-message">{error}</p>}

        <button className="primary-btn full-btn" type="button" onClick={handleLogin}>
          Login
        </button>
        <button className="text-btn full-btn" type="button" onClick={() => setPage("welcome")}>Back</button>
      </section>
    </main>
  );
}

export default AdminLogin;
