import HelpButton from "./HelpButton";

function SiteHeader({ setPage, showBrand = true }) {
  const customerLoggedIn = Boolean(
    localStorage.getItem("leanfitCustomer") && localStorage.getItem("leanfitToken")
  );

  const handleLogout = () => {
    localStorage.removeItem("leanfitCustomer");
    localStorage.removeItem("leanfitToken");
    localStorage.removeItem("leanfitActiveOrder");
    setPage("welcome");
  };

  return (
    <header className={`topbar compact-topbar global-site-header${showBrand ? "" : " nav-only"}`}>
      {showBrand && (
        <div className="welcome-brand-block">
          <button className="brand-button" type="button" onClick={() => setPage("welcome")} aria-label="LeanFit home">
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
            <button type="button" className="customer-login-link" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <button type="button" className="customer-login-link" onClick={() => setPage("login")}>Customer Login</button>
            <button type="button" className="admin-login-btn" onClick={() => setPage("admin-login")}>Admin Login</button>
          </>
        )}
      </nav>
    </header>
  );
}

export default SiteHeader;
