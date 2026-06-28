function SuccessPage({ formData, setPage }) {
  const whatsappNumber = "916302993318";

  const whatsappMessage = `Hello Lean Varshith,

I have completed the payment.

Plan: ${formData.selectedPlan}
Amount: ₹${formData.selectedPrice}

My Details:
Name: ${formData.name || "Not specified"}
Mobile: ${formData.mobile || "Not specified"}
Goal: ${formData.goal || "Not specified"}
Current Weight: ${formData.weight || "Not specified"} kg
Target Weight: ${formData.targetWeight || "Not specified"} kg

I am attaching my payment screenshot.`;

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <main className="page">
      <section className="card">
        <p className="brand-label">ORDER SUCCESSFUL</p>

        <h2>Your Order Has Been Received</h2>

        <p className="muted">
          Your details have been submitted successfully. After payment
          verification, your personalized PDF plan will be prepared and shared
          with you.
        </p>

        <div className="selected-plan-box">
          <p>Selected Plan</p>
          <h3>{formData.selectedPlan}</h3>
          <strong>₹{formData.selectedPrice}</strong>
        </div>

        <div className="summary-box">
          <h3>Next Step</h3>
          <p>
            Send your payment screenshot on WhatsApp. Your personalized PDF plan
            will be sent after verification.
          </p>
        </div>

        <a href={whatsappLink} target="_blank" rel="noreferrer">
          <button className="primary-btn full-btn">
            Send Screenshot on WhatsApp
          </button>
        </a>

        <button className="text-btn" onClick={() => setPage("welcome")}>
          Back to Home
        </button>
      </section>
    </main>
  );
}

export default SuccessPage;