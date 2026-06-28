import { useState } from "react";

function PaymentPage({ formData, setPage, setGeneratedPlan }) {
  const [paymentDone, setPaymentDone] = useState(false);
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const upiId = "varshith0409@axl";
  const payeeName = "Lean Varshith";

  const selectedPlan = formData.selectedPlan || "No plan selected";
  const selectedPrice = formData.selectedPrice || 0;

  const paymentLink =
    selectedPrice > 0
      ? `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
          payeeName
        )}&am=${selectedPrice}&cu=INR&tn=${encodeURIComponent(selectedPlan)}`
      : "#";

  const submitOrder = async () => {
    setGenerating(true);
    setError("");

    if (!paymentScreenshot) {
      setError("Please upload payment screenshot.");
      setGenerating(false);
      return;
    }

    try {
      const orderFormData = new FormData();
      orderFormData.append("userData", JSON.stringify(formData));
      orderFormData.append("paymentScreenshot", paymentScreenshot);

      const response = await fetch("http://127.0.0.1:5000/api/generate-plan", {
        method: "POST",
        body: orderFormData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Order failed");
      }

      setGeneratedPlan(data.plan);

      if (formData.selectedPlan === "Lean Pro Membership") {
        setPage("dashboard");
      } else {
        setPage("success");
      }
    } catch (err) {
      setError(err.message || "Unable to submit order.");
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
          Pay using UPI, return to this page, upload the payment screenshot and
          submit your order.
        </p>

        <div className="selected-plan-box">
          <p>Selected Plan</p>
          <h3>{selectedPlan}</h3>
          <strong>₹{selectedPrice}</strong>
        </div>

        <div className="summary-box">
          <h3>Order Summary</h3>

          <p>
            <strong>Name:</strong> {formData.name || "Not specified"}
          </p>

          <p>
            <strong>Plan:</strong> {selectedPlan}
          </p>

          <p>
            <strong>Amount:</strong> ₹{selectedPrice}
          </p>

          <p>
            <strong>UPI ID:</strong> {upiId}
          </p>
        </div>

        <div className="payment-box">
          {selectedPrice > 0 ? (
            <a href={paymentLink}>
              <button className="primary-btn full-btn" type="button">
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
            type="button"
            disabled={selectedPrice <= 0}
            onClick={() => setPaymentDone(true)}
          >
            I Have Completed Payment
          </button>
        </div>

        {paymentDone && (
          <div className="proof-box">
            <h3>Upload Payment Screenshot</h3>

            <p className="muted">
              Upload your PhonePe / Google Pay / Paytm payment screenshot.
            </p>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPaymentScreenshot(e.target.files[0])}
            />

            {paymentScreenshot && (
              <p className="muted">Selected: {paymentScreenshot.name}</p>
            )}

            <button
              className="primary-btn full-btn"
              onClick={submitOrder}
              disabled={generating}
              type="button"
            >
              {generating ? "Submitting Order..." : "Submit Order"}
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