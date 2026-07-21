import { useState } from "react";

const API_URL = (import.meta.env.VITE_API_URL || "https://leanfit.onrender.com").replace(/\/$/, "");

function LoginPage({ formData, setFormData, setPage }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const createAccount = async () => {
    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const mobile = formData.mobile.replace(/\D/g, "");

    setMessage("");

    if (!name || !email || !mobile || !password || !confirmPassword) {
      setMessage("Please complete all fields.");
      return;
    }

    if (mobile.length < 10) {
      setMessage("Enter a valid mobile number.");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/customer/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, mobile, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to create account.");
      }

      localStorage.setItem("leanfitCustomer", JSON.stringify(data.customer));
      localStorage.setItem("leanfitToken", data.token || "");

      setFormData((current) => ({
        ...current,
        name,
        email,
        mobile,
      }));

      setPage("profile");
    } catch (error) {
      setMessage(error.message || "Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page">
      <section className="card auth-card">
        <p className="brand-label">LEANFIT</p>
        <h2>Create Your Profile</h2>
        <p className="muted">
          Create your account so your plan, payment and future login can be matched correctly.
        </p>

        <div>
          <label>Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={formData.name}
            onChange={(event) => updateField("name", event.target.value)}
          />
        </div>

        <div>
          <label>Email ID</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(event) => updateField("email", event.target.value)}
          />
        </div>

        <div>
          <label>Mobile Number</label>
          <input
            type="tel"
            inputMode="numeric"
            placeholder="Enter mobile number"
            value={formData.mobile}
            onChange={(event) => updateField("mobile", event.target.value)}
          />
        </div>

        <div>
          <label>Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Create password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              style={{ paddingRight: "48px" }}
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              title={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((current) => !current)}
              style={{
                position: "absolute",
                right: "8px",
                top: "50%",
                transform: "translateY(-50%)",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                padding: "6px",
              }}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        <div>
          <label>Confirm Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              style={{ paddingRight: "48px" }}
            />
            <button
              type="button"
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              title={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              onClick={() => setShowConfirmPassword((current) => !current)}
              style={{
                position: "absolute",
                right: "8px",
                top: "50%",
                transform: "translateY(-50%)",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                padding: "6px",
              }}
            >
              {showConfirmPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {message && <p className="error-text">{message}</p>}

        <button
          className="primary-btn full-btn"
          type="button"
          disabled={loading}
          onClick={createAccount}
        >
          {loading ? "Creating Account..." : "Create Account & Continue"}
        </button>

        <button className="text-btn" type="button" onClick={() => setPage("customer-auth")}>
          Already have an account? Login
        </button>

        <button className="text-btn" type="button" onClick={() => setPage("welcome")}>
          Back to Home
        </button>
      </section>
    </main>
  );
}

export default LoginPage;
