import { useState } from "react";

const DEFAULTS = {
  theme: "light",
  emailNotifications: true,
  whatsappNotifications: true,
  orderUpdates: true,
  feedbackReminders: true,
  calorieGoal: 2500,
  proteinGoal: 160,
  waterGoal: 3000,
  weeklyWeightReminder: true,
};

function readSettings() {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem("leanfitSettings") || "{}") };
  } catch {
    return DEFAULTS;
  }
}

function Toggle({ checked, onChange, label, description }) {
  return (
    <label className="settings-toggle-row">
      <div><strong>{label}</strong><span>{description}</span></div>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <i aria-hidden="true" />
    </label>
  );
}

function Settings({ setPage }) {
  const [settings, setSettings] = useState(readSettings);
  const [message, setMessage] = useState("");

  const update = (key, value) => setSettings((current) => ({ ...current, [key]: value }));

  const save = () => {
    localStorage.setItem("leanfitSettings", JSON.stringify(settings));
    document.documentElement.dataset.leanfitTheme = settings.theme;
    setMessage("Settings saved successfully.");
    window.setTimeout(() => setMessage(""), 3000);
  };

  const logout = () => {
    localStorage.removeItem("leanfitToken");
    localStorage.removeItem("leanfitCustomer");
    setPage("welcome");
  };

  return (
    <main className="profile-settings-page">
      <header className="settings-topbar">
        <div><p className="brand-label">LEANFIT VERSION 1.5</p><h1>Settings</h1><p>Control notifications, targets, appearance, and account access.</p></div>
        <div className="settings-topbar-actions"><button className="secondary-btn" onClick={() => setPage("profile-settings")}>Profile</button><button className="secondary-btn" onClick={() => setPage("customer-portal")}>Back to Portal</button></div>
      </header>

      {message && <p className="settings-message success">{message}</p>}

      <section className="settings-grid">
        <article className="settings-card">
          <div className="settings-card-heading"><span>01</span><div><h2>Notifications</h2><p>Choose which LeanFit updates you receive.</p></div></div>
          <div className="settings-toggle-list">
            <Toggle checked={settings.emailNotifications} onChange={(v) => update("emailNotifications", v)} label="Email notifications" description="Receive important account and plan updates by email." />
            <Toggle checked={settings.whatsappNotifications} onChange={(v) => update("whatsappNotifications", v)} label="WhatsApp updates" description="Allow order and delivery updates on WhatsApp." />
            <Toggle checked={settings.orderUpdates} onChange={(v) => update("orderUpdates", v)} label="Order status updates" description="Notify me when payment or delivery status changes." />
            <Toggle checked={settings.feedbackReminders} onChange={(v) => update("feedbackReminders", v)} label="Feedback reminders" description="Remind me to review a delivered plan." />
          </div>
        </article>

        <article className="settings-card">
          <div className="settings-card-heading"><span>02</span><div><h2>Daily targets</h2><p>Set default tracking targets for your dashboard.</p></div></div>
          <div className="settings-form-grid">
            <label>Calories (kcal)<input type="number" min="1000" max="6000" value={settings.calorieGoal} onChange={(e) => update("calorieGoal", Number(e.target.value))} /></label>
            <label>Protein (g)<input type="number" min="20" max="400" value={settings.proteinGoal} onChange={(e) => update("proteinGoal", Number(e.target.value))} /></label>
            <label>Water (ml)<input type="number" min="500" max="8000" step="250" value={settings.waterGoal} onChange={(e) => update("waterGoal", Number(e.target.value))} /></label>
          </div>
          <Toggle checked={settings.weeklyWeightReminder} onChange={(v) => update("weeklyWeightReminder", v)} label="Weekly weight reminder" description="Show a reminder to record weight once every week." />
        </article>

        <article className="settings-card">
          <div className="settings-card-heading"><span>03</span><div><h2>Appearance</h2><p>Select your preferred interface mode.</p></div></div>
          <div className="theme-options">
            <button className={settings.theme === "light" ? "active" : ""} onClick={() => update("theme", "light")}><strong>Light</strong><span>Bright and clean</span></button>
            <button className={settings.theme === "dark" ? "active" : ""} onClick={() => update("theme", "dark")}><strong>Dark</strong><span>Reduced brightness</span></button>
          </div>
        </article>

        <article className="settings-card account-danger-card">
          <div className="settings-card-heading"><span>04</span><div><h2>Account access</h2><p>Sign out of this browser when using a shared device.</p></div></div>
          <button className="secondary-btn" onClick={logout}>Log Out</button>
        </article>
      </section>

      <div className="settings-save-bar"><p>Your preferences are stored securely in this browser.</p><button className="primary-btn" onClick={save}>Save Settings</button></div>
    </main>
  );
}

export default Settings;
