import { useState } from "react";
import PasswordInput from "./PasswordInput";

const API_URL = (import.meta.env.VITE_API_URL || "https://leanfit.onrender.com").replace(/\/$/, "");

function CustomerAuth({ setPage }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submitLogin = async () => {
    setMessage("");
    if (!identifier.trim() || !password) {
      setMessage("Enter your email or mobile number and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/customer/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: identifier.trim(),
          email: identifier.trim().toLowerCase(),
          password,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Login failed.");
      localStorage.setItem("leanfitCustomer", JSON.stringify(data.customer));
      localStorage.setItem("leanfitToken", data.token || "");
      setPage("customer-portal");
    } catch (error) {
      setMessage(error.message || "Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page">
      <section className="card auth-card standalone-auth-card">
        <p className="brand-label">LEANFIT CUSTOMER</p>
        <h2>Customer Login</h2>
        <p className="muted">Login using the email ID or mobile number used while creating your profile.</p>

        <div className="form-grid" onKeyDown={(event) => event.key === "Enter" && submitLogin()}>
          <div>
            <label htmlFor="customerIdentifier">Email ID or Mobile Number</label>
            <input
              id="customerIdentifier"
              type="text"
              autoComplete="username"
              placeholder="Enter email or mobile number"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="customerPassword">Password</label>
            <PasswordInput
              id="customerPassword"
              name="customerPassword"
              autoComplete="current-password"
              placeholder="Enter password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
        </div>

        {message && <p className="form-message">{message}</p>}
        <button className="primary-btn full-btn" type="button" disabled={loading} onClick={submitLogin}>
          {loading ? "Logging In..." : "Login"}
        </button>
        <button className="text-btn full-btn" type="button" onClick={() => setPage("register")}>New customer? Create account</button>
        <button className="text-btn full-btn" type="button" onClick={() => setPage("welcome")}>Back to Home</button>
      </section>
    </main>
  );
}

export default CustomerAuth;
