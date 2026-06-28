import { useState } from "react";

function PaymentPage({ formData, setPage, setGeneratedPlan }) {
  const [paymentDone, setPaymentDone] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const upiId = "varshith0409@axl";
  const payeeName = "Lean Varshith";
  const orderId = `LF-${Date.now().toString().slice(-6)}`;

  const selectedPlan = formData.selectedPlan || "No plan selected";
  const selectedPrice = formData.selectedPrice || 0;

  const paymentLink =
    selectedPrice > 0
      ? `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
          payeeName
        )}&am=${selectedPrice}&cu=INR&tn=${encodeURIComponent(selectedPlan)}`
      : "#";

  const generatePlan = async () => {
    setGenerating(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/generate-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Plan generation failed");
      }

   setGeneratedPlan(data.plan);

if (formData.selectedPlan === "Lean Pro Membership") {
  setPage("dashboard");
} else {
  setPage("success");
}
    } catch (err) {
      setError("Unable to generate plan. Please check backend is running.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <main className="page">
      <section className="card">
        <p className="brand-label">PAYMENT</p>
        <h2>Complete Your Order</h2>
        <p className="muted">
          Review your order, complete payment using UPI, then continue to
          generate your personalized plan.
        </p>

        <div className="selected-plan-box">
          <p>Selected Plan</p>
          <h3>{selectedPlan}</h3>
          <strong>₹{selectedPrice}</strong>
        </div>

        <div className="summary-box">
          <h3>Order Summary</h3>
          <p>
            <strong>Order ID:</strong> {orderId}
          </p>
          <p>
            <strong>Name:</strong> {formData.name || "Not specified"}
          </p>
          <p>
            <strong>Goal:</strong> {formData.goal || "Not specified"}
          </p>
          <p>
            <strong>Current Weight:</strong>{" "}
            {formData.weight || "Not specified"} kg
          </p>
          <p>
            <strong>Target Weight:</strong>{" "}
            {formData.targetWeight || "Not specified"} kg
          </p>
          <p>
            <strong>UPI ID:</strong> {upiId}
          </p>
        </div>

        <div className="payment-box">
          {selectedPrice > 0 ? (
            <a href={paymentLink}>
              <button className="primary-btn full-btn">
                Pay ₹{selectedPrice} Now
              </button>
            </a>
          ) : (
            <button className="primary-btn full-btn" disabled>
              Select a Plan First
            </button>
          )}

          <button
            className="secondary-btn full-btn"
            disabled={selectedPrice <= 0}
            onClick={() => setPaymentDone(true)}
          >
            I Have Completed Payment
          </button>
        </div>

        {paymentDone && (
          <div className="proof-box">
            <h3>Generate Your Plan</h3>
            <p className="muted">
              After payment, click below. Your personalized plan will be
              prepared and opened in your dashboard.
            </p>

            <button
              className="primary-btn full-btn"
              onClick={generatePlan}
              disabled={generating}
            >
              {generating ? "Generating Plan..." : "Generate My Plan"}
            </button>

            {error && <p className="error-text">{error}</p>}
          </div>
        )}

        <div className="page-actions">
          <button className="text-btn" onClick={() => setPage("plans")}>
            Previous
          </button>
        </div>
      </section>
    </main>
  );
}

export default PaymentPage;