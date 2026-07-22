import { useMemo, useState } from "react";

const API_BASE_URL = "https://leanfit.onrender.com/api";
const UPI_ID = "varshith0409@axl";

function PaymentPage({ formData, setPage }) {
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const selectedPlan = formData.selectedPlan || "No plan selected";
  const selectedPrice = Number(formData.selectedPrice || 0);

  const upiLink = useMemo(() => {
    const params = new URLSearchParams({
      pa: UPI_ID,
      pn: "LeanFit",
      am: String(selectedPrice || 0),
      cu: "INR",
      tn: selectedPlan,
    });

    return `upi://pay?${params.toString()}`;
  }, [selectedPlan, selectedPrice]);

  const handleScreenshotChange = (event) => {
    const file = event.target.files?.[0];

    setError("");

    if (!file) {
      setPaymentScreenshot(null);
      setPreviewUrl("");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setPaymentScreenshot(null);
      setPreviewUrl("");
      setError("Please upload a JPG, PNG or WEBP payment screenshot.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPaymentScreenshot(null);
      setPreviewUrl("");
      setError("Payment screenshot must be smaller than 5 MB.");
      return;
    }

    setPaymentScreenshot(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const submitPayment = async () => {
    if (!formData.selectedPlan || selectedPrice <= 0) {
      setError("Please select a plan first.");
      return;
    }

    if (!formData.name || !formData.email) {
      setError("Name and email are required.");
      return;
    }

    if (!paymentScreenshot) {
      setError("Please upload your payment screenshot.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const payload = new FormData();
      payload.append("paymentScreenshot", paymentScreenshot);
      payload.append("userData", JSON.stringify(formData));

      const response = await fetch(`${API_BASE_URL}/manual-payment/submit`, {
        method: "POST",
        body: payload,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to submit payment.");
      }

      setPage("success");
    } catch (submitError) {
      setError(
        submitError.message ||
          "Unable to submit payment. Please check your internet and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page">
      <section className="card">
        <p className="brand-label">UPI PAYMENT</p>
        <h2>Complete Your Order</h2>
        <p className="muted">
          Pay using PhonePe, Google Pay, Paytm or any UPI app, then upload the
          payment screenshot for verification.
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
            <strong>Email:</strong> {formData.email || "Not specified"}
          </p>
          <p>
            <strong>Plan:</strong> {selectedPlan}
          </p>
          <p>
            <strong>Amount:</strong> ₹{selectedPrice}
          </p>
        </div>

        <div className="summary-box">
          <h3>Pay by UPI</h3>
          <p>
            <strong>UPI ID:</strong> {UPI_ID}
          </p>
          <p>
            <strong>Amount:</strong> ₹{selectedPrice}
          </p>

          <a
            className="primary-btn full-btn"
            href={upiLink}
            aria-disabled={selectedPrice <= 0}
            onClick={(event) => {
              if (selectedPrice <= 0) {
                event.preventDefault();
                setError("Please select a plan first.");
              }
            }}
          >
            Open UPI App and Pay ₹{selectedPrice}
          </a>
        </div>

        <div className="summary-box">
          <h3>Upload Payment Screenshot</h3>

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleScreenshotChange}
            disabled={submitting}
          />

          {previewUrl && (
            <img
              src={previewUrl}
              alt="Payment screenshot preview"
              style={{
                width: "100%",
                maxHeight: "320px",
                objectFit: "contain",
                marginTop: "16px",
                borderRadius: "12px",
                border: "1px solid #d1d5db",
              }}
            />
          )}
        </div>

        <button
          className="primary-btn full-btn"
          type="button"
          onClick={submitPayment}
          disabled={submitting || selectedPrice <= 0}
        >
          {submitting ? "Submitting Payment..." : "I Have Completed Payment"}
        </button>

        {error && <p className="error-text">{error}</p>}

        <div className="page-actions">
          <button
            className="text-btn"
            type="button"
            onClick={() => setPage("plans")}
            disabled={submitting}
          >
            Previous
          </button>
        </div>
      </section>
    </main>
  );
}

export default PaymentPage;
