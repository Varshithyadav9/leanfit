import { useEffect, useState } from "react";
import PasswordInput from "./PasswordInput";

const API_URL = (
  import.meta.env.VITE_API_URL || "https://leanfit.onrender.com"
).replace(/\/$/, "");

function LoginPage({ initialMode = "login", setPage, onAuthenticated }) {
  const [mode, setMode] = useState(initialMode);
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    identifier: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMode(initialMode);
    setMessage("");
  }, [initialMode]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const showMessage = (text, type = "error") => {
    setMessage(text);
    setMessageType(type);
  };

  const handleLogin = async () => {
    if (!form.identifier.trim() || !form.password) {
      showMessage("Enter your email or phone number and password.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/api/customer/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: form.identifier.trim(),
          email: form.identifier.trim().toLowerCase(),
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Login failed.");
      }

      showMessage("Login successful.", "success");
      onAuthenticated(data.customer, data.token);
    } catch (error) {
      showMessage(error.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    const cleanMobile = form.mobile.replace(/\D/g, "");

    if (!form.name.trim() || !form.email.trim() || !cleanMobile || !form.password) {
      showMessage("Complete all required fields.");
      return;
    }

    if (cleanMobile.length < 10) {
      showMessage("Enter a valid mobile number.");
      return;
    }

    if (form.password.length < 6) {
      showMessage("Password must contain at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      showMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/api/customer/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          mobile: cleanMobile,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Registration failed.");
      }

      showMessage("Account created successfully.", "success");
      onAuthenticated(data.customer, data.token);
    } catch (error) {
      showMessage(error.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const submit = () => {
    if (loading) return;
    if (mode === "login") handleLogin();
    else handleRegister();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") submit();
  };

  const changeMode = (nextMode) => {
    setMode(nextMode);
    setMessage("");
  };

  return (
    <main className="auth-page">
      <section className="auth-shell">
        <aside className="auth-side">
          <p className="brand-label">LEANFIT BY VARSHITH</p>
          <h1>{mode === "login" ? "Welcome back." : "Start your LeanFit journey."}</h1>
          <p>
            {mode === "login"
              ? "Login with the email address or mobile number used when creating your account."
              : "Create one account to access your plans, orders and progress dashboard."}
          </p>
          <button className="back-home-btn" type="button" onClick={() => setPage("welcome")}>
            ← Back to Home
          </button>
        </aside>

        <section className="auth-card">
          <div className="auth-tabs" role="tablist" aria-label="Account access">
            <button
              type="button"
              className={mode === "login" ? "active" : ""}
              onClick={() => changeMode("login")}
            >
              Customer Login
            </button>
            <button
              type="button"
              className={mode === "register" ? "active" : ""}
              onClick={() => changeMode("register")}
            >
              Create Account
            </button>
          </div>

          <div className="auth-heading">
            <h2>{mode === "login" ? "Login to your account" : "Create Your Profile"}</h2>
            <p className="muted">
              {mode === "login"
                ? "Use either your email ID or mobile number."
                : "Create your login details before continuing to your personalized plan."}
            </p>
          </div>

          <div className="form-grid" onKeyDown={handleKeyDown}>
            {mode === "register" && (
              <>
                <div>
                  <label htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={updateField}
                  />
                </div>

                <div>
                  <label htmlFor="email">Email ID</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={updateField}
                  />
                </div>

                <div>
                  <label htmlFor="mobile">Mobile Number</label>
                  <input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    placeholder="Enter your mobile number"
                    value={form.mobile}
                    onChange={updateField}
                  />
                </div>
              </>
            )}

            {mode === "login" && (
              <div>
                <label htmlFor="identifier">Email ID or Mobile Number</label>
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  autoComplete="username"
                  placeholder="Email or mobile number"
                  value={form.identifier}
                  onChange={updateField}
                />
              </div>
            )}

            <div>
              <label htmlFor="password">Password</label>
              <PasswordInput
                id="password"
                name="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                placeholder="Enter your password"
                value={form.password}
                onChange={updateField}
              />
            </div>

            {mode === "register" && (
              <div>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <PasswordInput
                  id="confirmPassword"
                  name="confirmPassword"
                  autoComplete="new-password"
                  placeholder="Enter password again"
                  value={form.confirmPassword}
                  onChange={updateField}
                />
              </div>
            )}
          </div>

          {message && (
            <p className={`form-message ${messageType}`} role="status">
              {message}
            </p>
          )}

          <button className="primary-btn full-btn" type="button" onClick={submit} disabled={loading}>
            {loading ? "Please wait..." : mode === "login" ? "Login" : "Create Account & Continue"}
          </button>

          <p className="auth-switch-text">
            {mode === "login" ? "New to LeanFit?" : "Already have an account?"}{" "}
            <button type="button" onClick={() => changeMode(mode === "login" ? "register" : "login")}>
              {mode === "login" ? "Create Account & Continue" : "Customer Login"}
            </button>
          </p>
        </section>
      </section>
    </main>
  );
}

export default LoginPage;
