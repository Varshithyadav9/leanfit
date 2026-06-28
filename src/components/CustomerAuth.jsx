import { useState } from "react";

function CustomerAuth({ setPage }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const updateField = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const submitAuth = async () => {
    setMessage("");

    const endpoint =
      mode === "login"
        ? "https://leanfit.onrender.com/api/customer/login"
        : "https://leanfit.onrender.com/api/customer/register";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!data.success) {
        setMessage(data.message || "Something went wrong");
        return;
      }

      localStorage.setItem("leanfitCustomer", JSON.stringify(data.customer));
      localStorage.setItem("leanfitToken", data.token);

      setPage("customer-portal");
    } catch (error) {
      setMessage("Server error. Please try again.");
    }
  };

  return (
    <main className="page">
      <section className="card auth-card">
        <p className="brand-label">LEANFIT CUSTOMER</p>
        <h2>{mode === "login" ? "Customer Login" : "Create Customer Account"}</h2>

        <p className="muted">
          Login to view your orders, download PDFs and access Lean Pro.
        </p>

        {mode === "register" && (
          <div>
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
            />
          </div>
        )}

        <div>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
          />
        </div>

        {mode === "register" && (
          <div>
            <label>Mobile</label>
            <input
              type="tel"
              placeholder="Enter mobile"
              value={form.mobile}
              onChange={(e) => updateField("mobile", e.target.value)}
            />
          </div>
        )}

        <div>
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={form.password}
            onChange={(e) => updateField("password", e.target.value)}
          />
        </div>

        {message && <p className="error-text">{message}</p>}

        <button className="primary-btn full-btn" onClick={submitAuth}>
          {mode === "login" ? "Login" : "Create Account"}
        </button>

        <button
          className="text-btn"
          onClick={() => {
            setMessage("");
            setMode(mode === "login" ? "register" : "login");
          }}
        >
          {mode === "login"
            ? "New customer? Create account"
            : "Already have an account? Login"}
        </button>

        <button className="text-btn" onClick={() => setPage("welcome")}>
          Back to Home
        </button>
      </section>
    </main>
  );
}

export default CustomerAuth;