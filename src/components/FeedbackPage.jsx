import { useEffect, useState } from "react";

const API_URL = (import.meta.env.VITE_API_URL || "https://leanfit.onrender.com").replace(/\/$/, "");

export default function FeedbackPage({ setPage, mode = "customer" }) {
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderId, setOrderId] = useState("");
  const [rating, setRating] = useState(5);
  const [subject, setSubject] = useState("");
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const customer = JSON.parse(localStorage.getItem("leanfitCustomer") || "null");

  const loadAdmin = async () => {
    const response = await fetch(`${API_URL}/api/feedback`);
    const data = await response.json();
    setItems(data.feedback || []);
  };

  const loadCustomer = async () => {
    if (!customer?.email) return;
    const [ordersRes, feedbackRes] = await Promise.all([
      fetch(`${API_URL}/api/customer/orders/${encodeURIComponent(customer.email)}`),
      fetch(`${API_URL}/api/feedback/customer/${encodeURIComponent(customer.email)}`),
    ]);
    const ordersData = await ordersRes.json();
    const feedbackData = await feedbackRes.json();
    const delivered = (ordersData.orders || []).filter((order) => order.status === "Delivered");
    setOrders(delivered);
    setOrderId((current) => current || delivered[0]?.orderId || "");
    setItems(feedbackData.feedback || []);
  };

  useEffect(() => { mode === "admin" ? loadAdmin() : loadCustomer(); }, [mode]);

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    const response = await fetch(`${API_URL}/api/feedback`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, email: customer?.email, rating: Number(rating), subject, comment }),
    });
    const data = await response.json();
    setMessage(data.message || "Unable to submit feedback.");
    if (response.ok) { setComment(""); setSubject(""); loadCustomer(); }
  };

  const approve = async (id, approved) => {
    const response = await fetch(`${API_URL}/api/feedback/${id}/approval`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ approved }),
    });
    const data = await response.json();
    setMessage(data.message || "Updated.");
    if (response.ok) loadAdmin();
  };

  return (
    <main className="feedback-page">
      <header className="feedback-header">
        <div><p className="brand-label">{mode === "admin" ? "LEANFIT ADMIN" : "CUSTOMER EXPERIENCE"}</p><h1>{mode === "admin" ? "Feedback Management" : "Your Feedback"}</h1><p>{mode === "admin" ? "Review and approve customer testimonials." : "Share your experience after your plan is delivered."}</p></div>
        <button className="secondary-btn" onClick={() => setPage(mode === "admin" ? "admin" : "customer-portal")}>Back</button>
      </header>
      {message && <p className="portal-message">{message}</p>}
      {mode === "customer" && (
        <form className="feedback-form card" onSubmit={submit}>
          <label>Delivered order<select value={orderId} onChange={(e) => setOrderId(e.target.value)} required><option value="">Select order</option>{orders.map((order) => <option key={order.orderId} value={order.orderId}>{order.selectedPlan} — {order.orderId}</option>)}</select></label>
          <label>Rating<select value={rating} onChange={(e) => setRating(e.target.value)}>{[5,4,3,2,1].map((value) => <option key={value} value={value}>{value} / 5</option>)}</select></label>
          <label>Subject (optional)<input value={subject} maxLength="100" onChange={(e) => setSubject(e.target.value)} placeholder="What stood out?" /></label>
          <label>Comment<textarea value={comment} maxLength="1000" required onChange={(e) => setComment(e.target.value)} placeholder="Tell us what worked well and what we can improve." /></label>
          <button className="primary-btn" disabled={!orderId}>Submit Feedback</button>
          {orders.length === 0 && <p className="muted">Feedback becomes available after a plan is delivered.</p>}
        </form>
      )}
      <section className="feedback-list">
        {items.length === 0 ? <div className="empty-state">No feedback available.</div> : items.map((item) => (
          <article className="feedback-card" key={item._id}>
            <div><strong>{item.customerName || "Customer"}</strong><span>{"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)}</span></div>
            <h2>{item.subject || item.selectedPlan || "LeanFit experience"}</h2><p>{item.comment}</p>
            <small>{item.orderId} · {item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-IN") : ""}</small>
            {mode === "admin" && <div className="feedback-actions"><button className="primary-btn" onClick={() => approve(item._id, true)}>Approve</button><button className="secondary-btn" onClick={() => approve(item._id, false)}>Hide</button><span className={item.approved ? "approved-badge" : "hidden-badge"}>{item.approved ? "Approved" : "Hidden"}</span></div>}
          </article>
        ))}
      </section>
    </main>
  );
}
