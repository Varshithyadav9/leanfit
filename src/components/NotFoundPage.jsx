function NotFoundPage({ setPage }) {
  return <main className="not-found-page"><section className="not-found-card">
    <span className="not-found-code">404</span><h1>Page not found.</h1>
    <p>The page you tried to open does not exist or has been moved.</p>
    <button className="primary-btn" onClick={() => setPage("welcome")}>Return to LeanFit</button>
  </section></main>;
}
export default NotFoundPage;
