function SuccessPage({ formData, setPage }) {
  return (
    <main className="page">
      <section className="card">
        <p className="brand-label">PAYMENT SUBMITTED</p>

        <h2>Your Payment Is Awaiting Verification</h2>

        <p className="muted">
          We received your payment screenshot. The LeanFit admin will verify it
          before preparing your personalised plan.
        </p>

        <div className="selected-plan-box">
          <p>Selected Plan</p>
          <h3>{formData.selectedPlan}</h3>
          <strong>₹{formData.selectedPrice}</strong>
        </div>

        <div className="summary-box">
          <h3>What Happens Next?</h3>
          <p>
            After payment verification, your plan will be generated and sent to
            your registered email. You can also check its status in the
            Customer Portal.
          </p>
        </div>

        <button
          className="primary-btn full-btn"
          type="button"
          onClick={() => setPage("customer-auth")}
        >
          Check Order Status
        </button>

        <button
          className="text-btn"
          type="button"
          onClick={() => setPage("welcome")}
        >
          Back to Home
        </button>
      </section>
    </main>
  );
}

export default SuccessPage;
