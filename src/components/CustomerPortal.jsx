import { useEffect, useMemo, useState } from "react";
import PageLoader from "./PageLoader";

const API_URL = (import.meta.env.VITE_API_URL || "https://leanfit.onrender.com").replace(/\/$/, "");

const STATUS_STEPS = ["Received", "Verified", "Ready", "Delivered"];

function statusProgress(order) {
  if (order.status === "Rejected") return -1;
  if (order.status === "Delivered") return 4;
  if (order.status === "Verified" && order.pdfPath) return 3;
  if (order.status === "Verified") return 2;
  return 1;
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function CustomerPortal({ setPage }) {
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("Loading your orders...");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const savedCustomer = localStorage.getItem("leanfitCustomer");

    if (!savedCustomer) {
      setPage("customer-auth");
      return;
    }

    try {
      const parsedCustomer = JSON.parse(savedCustomer);
      setCustomer(parsedCustomer);
      fetchOrders(parsedCustomer.email);
    } catch {
      localStorage.removeItem("leanfitCustomer");
      setPage("customer-auth");
    }
  }, []);

  const fetchOrders = async (email, isRefresh = false) => {
    if (isRefresh) setRefreshing(true);

    try {
      const response = await fetch(
        `${API_URL}/api/customer/orders/${encodeURIComponent(email)}`
      );
      const data = await response.json();

      if (response.ok && data.success) {
        const sorted = [...(data.orders || [])].sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        setOrders(sorted);
        setMessage(sorted.length === 0 ? "No orders found." : "");
      } else {
        setMessage(data.message || "Unable to load orders.");
      }
    } catch {
      setMessage("Server error. Please try again.");
    } finally {
      setRefreshing(false);
    }
  };

  const stats = useMemo(() => ({
    total: orders.length,
    active: orders.filter((order) => ["Pending", "Verified"].includes(order.status)).length,
    delivered: orders.filter((order) => order.status === "Delivered").length,
  }), [orders]);

  const logout = () => {
    localStorage.removeItem("leanfitCustomer");
    localStorage.removeItem("leanfitToken");
    setPage("welcome");
  };

  if (message === "Loading your orders...") {
    return <PageLoader label="Loading your LeanFit account..." />;
  }

  return (
    <main className="customer-portal-page">
      <header className="customer-portal-header">
        <div>
          <img src="/leanfit-logo.png" alt="LeanFit" className="customer-portal-logo" />
          <p className="brand-label">CUSTOMER PORTAL</p>
          <h1>Welcome, {customer?.name || "Customer"}</h1>
          <p>Track your orders, download completed plans and access Lean Pro.</p>
        </div>

        <div className="customer-portal-header-actions">
          <button
            className="secondary-btn"
            type="button"
            disabled={refreshing}
            onClick={() => fetchOrders(customer?.email, true)}
          >
            {refreshing ? "Refreshing..." : "Refresh Orders"}
          </button>
          <button className="secondary-btn" type="button" onClick={() => setPage("welcome")}>
            Home
          </button>
        </div>
      </header>

      <section className="customer-portal-stats" aria-label="Order summary">
        <article><span>Total Orders</span><strong>{stats.total}</strong></article>
        <article><span>In Progress</span><strong>{stats.active}</strong></article>
        <article><span>Delivered</span><strong>{stats.delivered}</strong></article>
      </section>

      {message && <p className="portal-message">{message}</p>}

      <section className="customer-orders-list">
        {orders.map((order) => {
          const progress = statusProgress(order);
          const canDownload = order.pdfPath && ["Verified", "Delivered"].includes(order.status);
          const canOpenDashboard = order.dashboardAccess && ["Verified", "Delivered"].includes(order.status);

          return (
            <article className="customer-order-card" key={order._id || order.orderId}>
              <div className="customer-order-topline">
                <div>
                  <span className={`order-status-pill status-${String(order.status || "pending").toLowerCase()}`}>
                    {order.status || "Pending"}
                  </span>
                  <h2>{order.selectedPlan}</h2>
                  <p>Ordered on {formatDate(order.createdAt)}</p>
                </div>
                <strong className="customer-order-price">₹{order.selectedPrice}</strong>
              </div>

              {order.status === "Rejected" ? (
                <div className="order-rejected-note">
                  Payment was not verified. Please contact LeanFit support with your Order ID.
                </div>
              ) : (
                <div className="order-timeline" aria-label={`Order progress: ${order.status}`}>
                  {STATUS_STEPS.map((step, index) => {
                    const stepNumber = index + 1;
                    const complete = progress >= stepNumber;
                    return (
                      <div className={complete ? "timeline-step complete" : "timeline-step"} key={step}>
                        <span>{complete ? "✓" : stepNumber}</span>
                        <small>{step}</small>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="customer-order-details">
                <p><span>Order ID</span><strong>{order.orderId}</strong></p>
                <p><span>Payment</span><strong>{order.paymentStatus || "Pending"}</strong></p>
                <p><span>Membership</span><strong>{order.membershipStatus || "Not Applicable"}</strong></p>
                <p><span>Delivery</span><strong>WhatsApp / Manual</strong></p>
              </div>

              <div className="customer-order-actions">
                {canDownload && (
                  <a href={`${API_URL}/api/orders/${order.orderId}/pdf`} target="_blank" rel="noreferrer">
                    <button className="primary-btn" type="button">Download Plan PDF</button>
                  </a>
                )}

                {canOpenDashboard && (
                  <button className="secondary-btn" type="button" onClick={() => setPage("dashboard")}>
                    Open Lean Pro Dashboard
                  </button>
                )}

                {!canDownload && order.status !== "Rejected" && (
                  <span className="order-waiting-note">Your plan will appear here after verification.</span>
                )}
              </div>
            </article>
          );
        })}
      </section>

      <section className="customer-portal-footer-actions">
        <button className="secondary-btn" type="button" onClick={() => setPage("profile-settings")}>
          Profile & Security
        </button>
        <button className="text-btn" type="button" onClick={logout}>Logout</button>
      </section>
    </main>
  );
}

export default CustomerPortal;
