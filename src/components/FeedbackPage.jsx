import { useEffect, useMemo, useState } from "react";

const API_URL = (import.meta.env.VITE_API_URL || "https://leanfit.onrender.com").replace(/\/$/, "");

async function readJson(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Something went wrong.");
  return data;
}

export default function FeedbackPage({ setPage, mode = "customer" }) {
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderId, setOrderId] = useState("");
  const [rating, setRating] = useState(5);
  const [subject, setSubject] = useState("");
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const customer = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("leanfitCustomer") || "null");
    } catch {
      return null;
    }
  }, []);

  const loadAdmin = async () => {
    const response = await fetch(`${API_URL}/api/feedback`);
    const data = await readJson(response);
    setItems(data.feedback || []);
  };

  const loadCustomer = async () => {
    if (!customer?.email) {
      setMessage("Please log in before submitting feedback.");
      return;
    }

    const [ordersRes, feedbackRes] = await Promise.all([
      fetch(`${API_URL}/api/customer/orders/${encodeURIComponent(customer.email)}`),
      fetch(`${API_URL}/api/feedback/customer/${encodeURIComponent(customer.email)}`),
    ]);

    const ordersData = await readJson(ordersRes);
    const feedbackData = await readJson(feedbackRes);
    const submittedOrderIds = new Set((feedbackData.feedback || []).map((item) => item.orderId));
    const availableOrders = (ordersData.orders || []).filter(
      (order) => order.status === "Delivered" && !submittedOrderIds.has(order.orderId)
    );

    setOrders(availableOrders);
    setOrderId((current) => current || availableOrders[0]?.orderId || "");
    setItems(feedbackData.feedback || []);
  };

  const reload = async () => {
    setLoading(true);
    setMessage("");
    try {
      if (mode === "admin") await loadAdmin();
      else await loadCustomer();
    } catch (error) {
      setMessage(error.message || "Unable to load feedback.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, [mode]);

  const submit = async (event) => {
    event.preventDefault();
    if (!customer?.email) {
      setMessage("Please log in before submitting feedback.");
      return;
    }

    setSaving(true);
    setMessage("");
    try {
      const response = await fetch(`${API_URL}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          email: customer.email,
          rating: Number(rating),
          subject: subject.trim(),
          comment: comment.trim(),
        }),
      });
      const data = await readJson(response);
      setMessage(data.message || "Feedback submitted successfully.");
      setComment("");
      setSubject("");
      setRating(5);
      setOrderId("");
      await loadCustomer();
    } catch (error) {
      setMessage(error.message || "Unable to submit feedback.");
    } finally {
      setSaving(false);
    }
  };

  const updateApproval = async (id, approved) => {
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch(`${API_URL}/api/feedback/${id}/approval`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved }),
      });
      const data = await readJson(response);
      setMessage(data.message || "Feedback updated.");
      await loadAdmin();
    } catch (error) {
      setMessage(error.message || "Unable to update feedback.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="feedback-page">
      <header className="feedback-header">
        <div>
          <p className="brand-label">{mode === "admin" ? "LEANFIT ADMIN" : "CUSTOMER EXPERIENCE"}</p>
          <h1>{mode === "admin" ? "Feedback Management" : "Your Feedback"}</h1>
          <p>{mode === "admin" ? "Approve customer feedback before using it as a testimonial." : "Share your experience after your plan is delivered."}</p>
        </div>
        <button className="secondary-btn" onClick={() => setPage(mode === "admin" ? "admin" : "customer-portal")}>Back</button>
      </header>

      {message && <p className="portal-message">{message}</p>}

      {mode === "customer" && (
        <form className="feedback-form card" onSubmit={submit}>
          <label>
            Delivered order
            <select value={orderId} onChange={(event) => setOrderId(event.target.value)} required>
              <option value="">Select order</option>
              {orders.map((order) => (
                <option key={order.orderId} value={order.orderId}>
                  {order.selectedPlan} — {order.orderId}
                </option>
              ))}
            </select>
          </label>

          <label>
            Rating
            <select value={rating} onChange={(event) => setRating(Number(event.target.value))}>
              {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} / 5</option>)}
            </select>
          </label>

          <label>
            Subject (optional)
            <input value={subject} maxLength={100} onChange={(event) => setSubject(event.target.value)} placeholder="What stood out?" />
          </label>

          <label>
            Comment
            <textarea value={comment} maxLength={1000} minLength={5} required onChange={(event) => setComment(event.target.value)} placeholder="Tell us what worked well and what we can improve." />
          </label>

          <button className="primary-btn" disabled={!orderId || saving}>
            {saving ? "Submitting..." : "Submit Feedback"}
          </button>

          {!loading && orders.length === 0 && (
            <p className="muted">No eligible order is available. Feedback can be submitted once per delivered order.</p>
          )}
        </form>
      )}

      <section className="feedback-list">
        {loading ? (
          <div className="empty-state">Loading feedback...</div>
        ) : items.length === 0 ? (
          <div className="empty-state">No feedback available.</div>
        ) : items.map((item) => (
          <article className="feedback-card" key={item._id}>
            <div>
              <strong>{item.customerName || "Customer"}</strong>
              <span aria-label={`${item.rating} out of 5 stars`}>{"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)}</span>
            </div>
            <h2>{item.subject || item.selectedPlan || "LeanFit experience"}</h2>
            <p>{item.comment}</p>
            <small>{item.orderId} · {item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-IN") : ""}</small>

            {mode === "admin" && (
              <div className="feedback-actions">
                <button className="primary-btn" disabled={saving || item.approved} onClick={() => updateApproval(item._id, true)}>Approve</button>
                <button className="secondary-btn" disabled={saving || !item.approved} onClick={() => updateApproval(item._id, false)}>Hide</button>
                <span className={item.approved ? "approved-badge" : "hidden-badge"}>{item.approved ? "Approved" : "Hidden"}</span>
              </div>
            )}
          </article>
        ))}
      </section>
    </main>
  );
}
