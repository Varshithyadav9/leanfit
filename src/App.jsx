import { useState } from "react";
import "./App.css";
import WelcomePage from "./components/WelcomePage";
import LoginPage from "./components/LoginPage";

function App() {
  const [page, setPage] = useState("welcome");
  const [customer, setCustomer] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("leanfitCustomer")) || null;
    } catch {
      return null;
    }
  });

  const handleAuthenticated = (customerData, token) => {
    localStorage.setItem("leanfitToken", token);
    localStorage.setItem("leanfitCustomer", JSON.stringify(customerData));
    setCustomer(customerData);
    setPage("customerHome");
  };

  const handleLogout = () => {
    localStorage.removeItem("leanfitToken");
    localStorage.removeItem("leanfitCustomer");
    setCustomer(null);
    setPage("welcome");
  };

  return (
    <>
      {page === "welcome" && <WelcomePage setPage={setPage} />}

      {page === "login" && (
        <LoginPage
          initialMode="login"
          setPage={setPage}
          onAuthenticated={handleAuthenticated}
        />
      )}

      {page === "register" && (
        <LoginPage
          initialMode="register"
          setPage={setPage}
          onAuthenticated={handleAuthenticated}
        />
      )}

      {page === "customerHome" && (
        <main className="page">
          <section className="card customer-home-card">
            <p className="brand-label">LEANFIT</p>
            <h1>Welcome, {customer?.name || "Customer"}</h1>
            <p className="muted">
              Your account is ready. Your plan and Lean Pro access will appear here after payment verification.
            </p>
            <div className="customer-actions">
              <button className="primary-btn" type="button" onClick={() => setPage("welcome")}>
                Home
              </button>
              <button className="secondary-btn" type="button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </section>
        </main>
      )}
    </>
  );
}

export default App;
