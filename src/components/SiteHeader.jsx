import { useEffect, useState } from "react";
import HelpButton from "./HelpButton";

function SiteHeader({ setPage, showBrand = true }) {
  const [, forceRender] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const hasCustomerSession = Boolean(
    (localStorage.getItem("leanfitCustomer") && localStorage.getItem("leanfitToken")) ||
    (sessionStorage.getItem("leanfitCustomer") && sessionStorage.getItem("leanfitToken"))
  );

  // The main homepage should always show the public navigation.
  // Customer session controls are only shown on the other customer pages.
  const customerLoggedIn = !showBrand && hasCustomerSession;

  useEffect(() => {
    const closeOnResize = () => {
      if (window.innerWidth > 760) setMenuOpen(false);
    };
    window.addEventListener("resize", closeOnResize);
    return () => window.removeEventListener("resize", closeOnResize);
  }, []);

  const goTo = (page) => {
    setMenuOpen(false);
    setPage(page);
  };

  const handleLogout = () => {
    for (const storage of [localStorage, sessionStorage]) {
      storage.removeItem("leanfitCustomer");
      storage.removeItem("leanfitToken");
      storage.removeItem("leanfitActiveOrder");
    }

    setMenuOpen(false);
    forceRender((value) => value + 1);
    setPage("welcome");
  };

  return (
    <header className={`topbar compact-topbar global-site-header${showBrand ? "" : " nav-only"}`}>
      <div className="site-header-left">
        {showBrand ? (
          <div className="welcome-brand-block">
            <button
              className="brand-button"
              type="button"
              onClick={() => goTo("welcome")}
              aria-label="LeanFit home"
            >
              <img src="/leanfit-logo.png" alt="LeanFit" className="welcome-logo" />
            </button>
            <span className="welcome-brand-author">BY VARSHITH</span>
          </div>
        ) : (
          <button
            className="site-header-mini-brand"
            type="button"
            onClick={() => goTo("welcome")}
            aria-label="LeanFit home"
          >
            <img src="/leanfit-logo.png" alt="LeanFit" />
          </button>
        )}
      </div>

      <button
        className={`site-menu-toggle${menuOpen ? " is-open" : ""}`}
        type="button"
        onClick={() => setMenuOpen((value) => !value)}
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={menuOpen}
      >
        <span />
        <span />
        <span />
      </button>

      <nav className={`compact-nav site-header-nav${menuOpen ? " is-open" : ""}`} aria-label="Main navigation">
        <button type="button" onClick={() => goTo("welcome")}>Home</button>
        <button type="button" onClick={() => goTo("about")}>About</button>
        <HelpButton navMode />

        {customerLoggedIn ? (
          <>
            <button type="button" onClick={() => goTo("customer-portal")}>My Account</button>
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
              onClick={() => goTo("login")}
            >
              Customer Login
            </button>
            <button
              type="button"
              className="admin-login-btn"
              onClick={() => goTo("admin-login")}
            >
              Admin Login
            </button>
          </>
        )}
      </nav>

      {menuOpen && (
        <button
          type="button"
          className="site-menu-backdrop"
          aria-label="Close navigation menu"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </header>
  );
}

export default SiteHeader;
