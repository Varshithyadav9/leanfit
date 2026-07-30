import { useMemo, useState } from "react";
import PasswordInput from "./PasswordInput";
import { getStoredCustomer, getStoredToken } from "../utils/auth";

const API_URL = (import.meta.env.VITE_API_URL || "https://leanfit.onrender.com").replace(/\/$/, "");

function readCustomer() {
  return getStoredCustomer();
}

function readFitnessProfile() {
  try {
    return JSON.parse(localStorage.getItem("leanfitFitnessProfile") || "{}");
  } catch {
    return {};
  }
}

function Profile({ setPage }) {
  const savedCustomer = useMemo(readCustomer, []);
  const savedFitness = useMemo(readFitnessProfile, []);
  const [account, setAccount] = useState({
    name: savedCustomer?.name || "",
    email: savedCustomer?.email || "",
    mobile: savedCustomer?.mobile || "",
  });
  const [fitness, setFitness] = useState({
    age: savedFitness.age || "",
    gender: savedFitness.gender || "",
    height: savedFitness.height || "",
    weight: savedFitness.weight || "",
    targetWeight: savedFitness.targetWeight || "",
    goal: savedFitness.goal || "Muscle Gain",
    activityLevel: savedFitness.activityLevel || "Moderately Active",
  });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [saving, setSaving] = useState("");

  const request = async (path, body) => {
    const token = getStoredToken();
    const response = await fetch(`${API_URL}${path}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Unable to update your account.");
    }
    return data;
  };

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
  };

  const saveAccount = async () => {
    setSaving("account");
    setMessage("");
    try {
      const mobile = account.mobile.replace(/\D/g, "");
      if (!account.name.trim()) throw new Error("Enter your full name.");
      if (!/^\S+@\S+\.\S+$/.test(account.email)) throw new Error("Enter a valid email address.");
      if (mobile.length !== 10) throw new Error("Enter a valid 10-digit mobile number.");
      const data = await request("/api/customer/profile", {
        name: account.name.trim(),
        email: account.email.trim(),
        mobile,
      });
      localStorage.setItem("leanfitCustomer", JSON.stringify(data.customer));
      setAccount((current) => ({ ...current, mobile }));
      showMessage("Account details updated successfully.");
    } catch (error) {
      showMessage(error.message, "error");
    } finally {
      setSaving("");
    }
  };

  const saveFitness = () => {
    if (fitness.age && Number(fitness.age) < 13) {
      showMessage("Enter a valid age.", "error");
      return;
    }
    localStorage.setItem("leanfitFitnessProfile", JSON.stringify(fitness));
    showMessage("Fitness profile saved successfully.");
  };

  const changePassword = async () => {
    setSaving("password");
    setMessage("");
    try {
      if (passwords.newPassword.length < 6) throw new Error("New password must contain at least 6 characters.");
      if (passwords.newPassword !== passwords.confirmPassword) throw new Error("New passwords do not match.");
      await request("/api/customer/password", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      showMessage("Password changed successfully.");
    } catch (error) {
      showMessage(error.message, "error");
    } finally {
      setSaving("");
    }
  };

  if (!savedCustomer) {
    return (
      <main className="page">
        <section className="card profile-login-required">
          <p className="brand-label">LEANFIT ACCOUNT</p>
          <h2>Please log in first</h2>
          <p className="muted">Your profile and settings are available after customer login.</p>
          <button className="primary-btn" onClick={() => setPage("login")}>Customer Login</button>
        </section>
      </main>
    );
  }

  return (
    <main className="profile-settings-page">
      <header className="settings-topbar">
        <div>
          <p className="brand-label">LEANFIT VERSION 1.5</p>
          <h1>Profile</h1>
          <p>Manage your account, fitness details, and password.</p>
        </div>
        <div className="settings-topbar-actions">
          <button className="secondary-btn" onClick={() => setPage("settings")}>Settings</button>
          <button className="secondary-btn" onClick={() => setPage("customer-portal")}>Back to Portal</button>
        </div>
      </header>

      {message && <p className={`settings-message ${messageType}`}>{message}</p>}

      <section className="settings-grid">
        <article className="settings-card">
          <div className="settings-card-heading"><span>01</span><div><h2>Account details</h2><p>Keep your contact information current.</p></div></div>
          <div className="settings-form-grid">
            <label>Full Name<input value={account.name} onChange={(e) => setAccount({ ...account, name: e.target.value })} /></label>
            <label>Email Address<input type="email" value={account.email} onChange={(e) => setAccount({ ...account, email: e.target.value })} /></label>
            <label>Mobile Number<input inputMode="numeric" value={account.mobile} onChange={(e) => setAccount({ ...account, mobile: e.target.value })} /></label>
          </div>
          <button className="primary-btn" disabled={saving === "account"} onClick={saveAccount}>{saving === "account" ? "Saving..." : "Save Account"}</button>
        </article>

        <article className="settings-card">
          <div className="settings-card-heading"><span>02</span><div><h2>Fitness profile</h2><p>Used to personalize your LeanFit experience.</p></div></div>
          <div className="settings-form-grid two-column">
            <label>Age<input type="number" min="13" max="100" value={fitness.age} onChange={(e) => setFitness({ ...fitness, age: e.target.value })} /></label>
            <label>Gender<select value={fitness.gender} onChange={(e) => setFitness({ ...fitness, gender: e.target.value })}><option value="">Select</option><option>Male</option><option>Female</option><option>Other</option></select></label>
            <label>Height (cm)<input type="number" min="100" max="250" value={fitness.height} onChange={(e) => setFitness({ ...fitness, height: e.target.value })} /></label>
            <label>Current Weight (kg)<input type="number" min="25" max="300" value={fitness.weight} onChange={(e) => setFitness({ ...fitness, weight: e.target.value })} /></label>
            <label>Target Weight (kg)<input type="number" min="25" max="300" value={fitness.targetWeight} onChange={(e) => setFitness({ ...fitness, targetWeight: e.target.value })} /></label>
            <label>Goal<select value={fitness.goal} onChange={(e) => setFitness({ ...fitness, goal: e.target.value })}><option>Muscle Gain</option><option>Fat Loss</option><option>Weight Maintenance</option><option>General Fitness</option></select></label>
            <label className="full-field">Activity Level<select value={fitness.activityLevel} onChange={(e) => setFitness({ ...fitness, activityLevel: e.target.value })}><option>Sedentary</option><option>Lightly Active</option><option>Moderately Active</option><option>Very Active</option></select></label>
          </div>
          <button className="primary-btn" onClick={saveFitness}>Save Fitness Profile</button>
        </article>

        <article className="settings-card settings-card-wide">
          <div className="settings-card-heading"><span>03</span><div><h2>Security</h2><p>Choose a strong password you do not use elsewhere.</p></div></div>
          <div className="settings-form-grid three-column">
            <label>Current Password<PasswordInput value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} /></label>
            <label>New Password<PasswordInput value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} /></label>
            <label>Confirm Password<PasswordInput value={passwords.confirmPassword} onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} /></label>
          </div>
          <button className="secondary-btn" disabled={saving === "password"} onClick={changePassword}>{saving === "password" ? "Updating..." : "Change Password"}</button>
        </article>
      </section>
    </main>
  );
}

export default Profile;
