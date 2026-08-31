import { useState } from "react";
import HelpButton from "./HelpButton";

function SiteHeader({ setPage, showBrand = true }) {
  const [, forceRender] = useState(0);

  const hasCustomerSession = Boolean(
    (localStorage.getItem("leanfitCustomer") && localStorage.getItem("leanfitToken")) ||
    (sessionStorage.getItem("leanfitCustomer") && sessionStorage.getItem("leanfitToken"))
  );

  // The main homepage should always show the public navigation.
  // Customer session controls are only shown on the other customer pages.
  const customerLoggedIn = !showBrand && hasCustomerSession;

  const handleLogout = () => {
    for (const storage of [localStorage, sessionStorage]) {
      storage.removeItem("leanfitCustomer");
      storage.removeItem("leanfitToken");
      storage.removeItem("leanfitActiveOrder");
    }

    forceRender((value) => value + 1);
    setPage("welcome");
  };

  return (
    <header className={`topbar compact-topbar global-site-header${showBrand ? "" : " nav-only"}`}>
      {showBrand && (
        <div className="welcome-brand-block">
          <button
            className="brand-button"
            type="button"
            onClick={() => setPage("welcome")}
            aria-label="LeanFit home"
          >
            <img src="/leanfit-logo.png" alt="LeanFit" className="welcome-logo" />
          </button>
          <span className="welcome-brand-author">BY VARSHITH</span>
        </div>
      )}

      <nav className="compact-nav" aria-label="Main navigation">
        <button type="button" onClick={() => setPage("about")}>About</button>
        <HelpButton navMode />

        {customerLoggedIn ? (
          <>
            <button type="button" onClick={() => setPage("customer-portal")}>Home</button>
            <button
              type="button"
              className="customer-login-link"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="customer-login-link"
              onClick={() => setPage("login")}
            >
              Customer Login
            </button>
            <button
              type="button"
              className="admin-login-btn"
              onClick={() => setPage("admin-login")}
            >
              Admin Login
            </button>
          </>
        )}
      </nav>
    </header>
  );
}

export default SiteHeader;
