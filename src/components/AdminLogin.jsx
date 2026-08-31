import { useState } from "react";
import PasswordInput from "./PasswordInput";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "https://leanfit.onrender.com").replace(/\/$/, "");

function AdminLogin({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true); setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Invalid email or password.");
      localStorage.setItem("leanfitAdminToken", data.token);
      setPage("admin");
    } catch (err) { setError(err.message || "Unable to log in."); } finally { setLoading(false); }
  };

  return <main className="page"><section className="card admin-login-card">
    <p className="brand-label">LEANFIT ADMIN</p><h2>Administrator Login</h2><p className="muted">Login to manage customer orders, payments, memberships and coupons.</p>
    <div className="form-grid" onKeyDown={(event) => event.key === "Enter" && !loading && handleLogin()}>
      <div><label htmlFor="adminEmail">Email</label><input id="adminEmail" type="email" autoComplete="username" placeholder="Admin email" value={email} onChange={(e)=>setEmail(e.target.value)} /></div>
      <div><label htmlFor="adminPassword">Password</label><PasswordInput id="adminPassword" name="adminPassword" autoComplete="current-password" placeholder="Enter password" value={password} onChange={(e)=>setPassword(e.target.value)} /></div>
    </div>
    {error && <p className="form-message">{error}</p>}
    <button className="primary-btn full-btn" type="button" disabled={loading} onClick={handleLogin}>{loading ? "Logging in..." : "Login"}</button>
    <button className="text-btn full-btn" type="button" onClick={() => setPage("welcome")}>Back</button>
  </section></main>;
}
export default AdminLogin;
