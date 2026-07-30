import { useState } from "react";
import PasswordInput from "./PasswordInput";

const API_URL = (import.meta.env.VITE_API_URL || "https://leanfit.onrender.com").replace(/\/$/, "");
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

function ForgotPassword({ setPage }) {
  const [step, setStep] = useState("request");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);

  const requestOtp = async () => {
    const value = email.trim().toLowerCase();
    if (!EMAIL_RE.test(value)) return setMessage("Enter a valid email address.");
    setLoading(true); setMessage("");
    try {
      const response = await fetch(`${API_URL}/api/customer/forgot-password`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: value }) });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Could not send verification code.");
      setType("success"); setMessage(data.message); setStep("reset");
    } catch (error) { setType("error"); setMessage(error.message); }
    finally { setLoading(false); }
  };

  const resetPassword = async () => {
    if (!/^\d{6}$/.test(otp)) return setMessage("Enter the 6-digit verification code.");
    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) return setMessage("Password must be at least 8 characters and include a letter and number.");
    if (password !== confirmPassword) return setMessage("Passwords do not match.");
    setLoading(true); setMessage("");
    try {
      const response = await fetch(`${API_URL}/api/customer/reset-password`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: email.trim().toLowerCase(), otp, password }) });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Password reset failed.");
      setType("success"); setMessage(data.message);
      setTimeout(() => setPage("login"), 1200);
    } catch (error) { setType("error"); setMessage(error.message); }
    finally { setLoading(false); }
  };

  return <main className="auth-page"><section className="auth-shell"><aside className="auth-side"><img src="/leanfit-logo.png" alt="LeanFit" style={{width:"230px",maxWidth:"82%",height:"auto",display:"block",marginBottom:"22px"}}/><p className="brand-label">ACCOUNT RECOVERY</p><h1>Reset your password.</h1><p>We will send a secure six-digit verification code to your registered email address.</p><button className="back-home-btn" onClick={() => setPage("login")}>← Back to Login</button></aside><section className="auth-card"><div className="auth-heading"><h2>{step === "request" ? "Forgot Password" : "Enter Verification Code"}</h2><p className="muted">{step === "request" ? "Use the email registered with your LeanFit account." : `A code was sent to ${email.trim().toLowerCase()}.`}</p></div><div className="form-grid">
  <div><label htmlFor="resetEmail">Email ID</label><input id="resetEmail" type="email" value={email} disabled={step === "reset"} onChange={(e)=>setEmail(e.target.value)} placeholder="Enter your registered email" /></div>
  {step === "reset" && <><div><label htmlFor="resetOtp">6-digit Code</label><input id="resetOtp" inputMode="numeric" maxLength="6" value={otp} onChange={(e)=>setOtp(e.target.value.replace(/\D/g, ""))} placeholder="Enter verification code" /></div><div><label htmlFor="newPassword">New Password</label><PasswordInput id="newPassword" name="newPassword" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Minimum 8 characters" /></div><div><label htmlFor="confirmNewPassword">Confirm Password</label><PasswordInput id="confirmNewPassword" name="confirmNewPassword" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} placeholder="Enter password again" /></div></>}
</div>{message && <p className={`form-message ${type}`} role="status">{message}</p>}<button className="primary-btn full-btn" disabled={loading} onClick={step === "request" ? requestOtp : resetPassword}>{loading ? "Please wait..." : step === "request" ? "Send Verification Code" : "Reset Password"}</button>{step === "reset" && <button className="text-btn full-btn" disabled={loading} onClick={requestOtp}>Resend Code</button>}</section></section></main>;
}
export default ForgotPassword;
