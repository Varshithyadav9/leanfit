import { useState } from "react";

const API_BASE_URL = "https://leanfit.onrender.com/api";

function PaymentPage({ formData, setPage, setGeneratedPlan }) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const selectedPlan = formData.selectedPlan || "No plan selected";
  const selectedPrice = Number(formData.selectedPrice || 0);

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const startPayment = async () => {
    if (!selectedPrice || !formData.selectedPlan) {
      setError("Please select a plan first.");
      return;
    }

    setProcessing(true);
    setError("");

    try {
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        throw new Error("Razorpay could not load. Check your internet and try again.");
      }

      const createResponse = await fetch(`${API_BASE_URL}/razorpay/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userData: formData }),
      });

      const createData = await createResponse.json();

      if (!createResponse.ok || !createData.success) {
        throw new Error(createData.message || "Unable to start payment.");
      }

      const options = {
        key: createData.keyId,
        amount: createData.order.amount,
        currency: createData.order.currency,
        name: "LeanFit",
        description: selectedPlan,
        order_id: createData.order.id,
        prefill: {
          name: formData.name || "",
          email: formData.email || "",
          contact: formData.mobile || "",
        },
        notes: {
          plan: selectedPlan,
        },
        theme: {
          color: "#16a34a",
        },
        handler: async (paymentResponse) => {
          try {
            const verifyResponse = await fetch(
              `${API_BASE_URL}/razorpay/verify-payment`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  userData: formData,
                  ...paymentResponse,
                }),
              }
            );

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok || !verifyData.success) {
              throw new Error(verifyData.message || "Payment verification failed.");
            }

            setGeneratedPlan(verifyData.plan || "");

            if (verifyData.dashboardAccess) {
              setPage("dashboard");
            } else {
              setPage("success");
            }
          } catch (verificationError) {
            setError(
              verificationError.message ||
                "Payment was made, but verification failed. Contact support with your payment ID."
            );
          } finally {
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
            setError("Payment was cancelled. You can try again.");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", (response) => {
        setProcessing(false);
        setError(response.error?.description || "Payment failed. Please try again.");
      });
      razorpay.open();
    } catch (paymentError) {
      setProcessing(false);
      setError(paymentError.message || "Unable to start payment.");
    }
  };

  return (
    <main className="page">
      <section className="card">
        <p className="brand-label">SECURE PAYMENT</p>
        <h2>Complete Your Order</h2>
        <p className="muted">
          Pay securely using UPI, card, net banking or another method available in Razorpay.
        </p>

        <div className="selected-plan-box">
          <p>Selected Plan</p>
          <h3>{selectedPlan}</h3>
          <strong>₹{selectedPrice}</strong>
        </div>

        <div className="summary-box">
          <h3>Order Summary</h3>
          <p><strong>Name:</strong> {formData.name || "Not specified"}</p>
          <p><strong>Email:</strong> {formData.email || "Not specified"}</p>
          <p><strong>Plan:</strong> {selectedPlan}</p>
          <p><strong>Amount:</strong> ₹{selectedPrice}</p>
        </div>

        <button
          className="primary-btn full-btn"
          type="button"
          onClick={startPayment}
          disabled={processing || selectedPrice <= 0}
        >
          {processing ? "Processing Payment..." : `Pay ₹${selectedPrice} Securely`}
        </button>

        {error && <p className="error-text">{error}</p>}

        <div className="page-actions">
          <button className="text-btn" onClick={() => setPage("plans")} disabled={processing}>
            Previous
          </button>
        </div>
      </section>
    </main>
  );
}

export default PaymentPage;
