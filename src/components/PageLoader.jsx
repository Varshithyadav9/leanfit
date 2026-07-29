function PageLoader({ label = "Loading..." }) {
  return <div className="page-loader" role="status" aria-live="polite"><span className="loader-ring"/><p>{label}</p></div>;
}
export default PageLoader;
