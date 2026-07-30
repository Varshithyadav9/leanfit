const WHATSAPP_NUMBER = String(
  import.meta.env.VITE_WHATSAPP_NUMBER || "916302993318"
).replace(/\D/g, "");

function getStoredOrder() {
  try {
    return JSON.parse(localStorage.getItem("leanfitLastSubmittedOrder") || "null");
  } catch {
    return null;
  }
}

function SuccessPage({ formData, submittedOrder, setPage }) {
  const order = submittedOrder || getStoredOrder() || {};
  const orderId = order.orderId || "Not available";
  const customerName = order.name || formData.name || "Customer";
  const customerEmail = order.email || formData.email || "Not provided";
  const customerMobile = order.mobile || formData.mobile || "Not provided";
  const plan = order.selectedPlan || formData.selectedPlan || "Not selected";
  const price = order.selectedPrice || formData.selectedPrice || "0";

  const whatsappMessage = [
    "Hi LeanFit Team,",
    "",
    "I have submitted my payment screenshot for verification.",
    "",
    `Name: ${customerName}`,
    `Email: ${customerEmail}`,
    `Mobile: ${customerMobile}`,
    `Order ID: ${orderId}`,
    `Plan: ${plan}`,
    `Amount: ₹${price}`,
    "",
    "Please verify my payment and update my order status.",
    "Thank you.",
  ].join("\n");

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <main className="success-animated page">
      <section className="card">
        <p className="brand-label">PAYMENT SUBMITTED</p>
        <h2>Your Payment Is Awaiting Verification</h2>

        <p className="muted">
          We received your payment screenshot. Send the pre-filled WhatsApp
          message below so the LeanFit team can quickly identify your order.
        </p>

        <div className="selected-plan-box">
          <p>Selected Plan</p>
          <h3>{plan}</h3>
          <strong>₹{price}</strong>
        </div>

        <div className="summary-box">
          <h3>Submission Details</h3>
          <p><strong>Order ID:</strong> {orderId}</p>
          <p><strong>Status:</strong> Awaiting verification</p>
        </div>

        <a
          className="primary-btn full-btn"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Send Details on WhatsApp
        </a>

        <p className="muted" style={{ marginTop: "12px" }}>
          The message includes your name, email, mobile number, order ID, plan
          and payment amount. Your screenshot is already stored with the order.
        </p>

        <button
          className="secondary-btn full-btn"
          type="button"
          onClick={() => setPage("customer-portal")}
        >
          Check Order Status
        </button>

        <button className="text-btn" type="button" onClick={() => setPage("welcome")}>
          Back to Home
        </button>
      </section>
    </main>
  );
}

export default SuccessPage;
