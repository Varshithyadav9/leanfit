import { useEffect, useMemo, useState } from "react";
import { clearSession } from "../utils/auth";
import PageLoader from "./PageLoader";

const API_URL = (import.meta.env.VITE_API_URL || "https://leanfit.onrender.com").replace(/\/$/, "");

const STATUS_STEPS = ["Received", "Verified", "Ready", "Delivered"];
const RENEWAL_WARNING_DAYS = 15;

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
  const [portalNotice, setPortalNotice] = useState("");

  useEffect(() => {
    const savedCustomer = localStorage.getItem("leanfitCustomer");

    if (!savedCustomer) {
      setPage("login");
      return;
    }

    try {
      const parsedCustomer = JSON.parse(savedCustomer);
      setCustomer(parsedCustomer);
      const savedNotice = localStorage.getItem("leanfitPortalNotice");
      if (savedNotice) {
        setPortalNotice(savedNotice);
        localStorage.removeItem("leanfitPortalNotice");
      }
      fetchOrders(parsedCustomer.email);

      const refreshTimer = window.setInterval(() => {
        fetchOrders(parsedCustomer.email, true, true);
      }, 20000);

      return () => window.clearInterval(refreshTimer);
    } catch {
      localStorage.removeItem("leanfitCustomer");
      setPage("login");
    }
  }, []);

  const fetchOrders = async (email, isRefresh = false, silent = false) => {
    if (isRefresh && !silent) setRefreshing(true);

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
      if (!silent) setRefreshing(false);
    }
  };

  const stats = useMemo(() => ({
    total: orders.length,
    active: orders.filter((order) => ["Pending", "Verified"].includes(order.status)).length,
    delivered: orders.filter((order) => order.status === "Delivered").length,
  }), [orders]);

  const hasPendingRenewal = (membershipOrder) =>
    orders.some(
      (order) =>
        order.selectedPlan === "Lean Pro Renewal" &&
        order.status === "Pending" &&
        order.paymentStatus === "Pending" &&
        (
          order.renewalForOrderId === membershipOrder.orderId ||
          (!order.renewalForOrderId && order.email === membershipOrder.email)
        )
    );

  const getMembershipInfo = (order) => {
    const endDate = order.accessEndDate ? new Date(order.accessEndDate) : null;
    const expired = Boolean(endDate && endDate.getTime() <= Date.now());
    const remainingDays = endDate
      ? Math.max(0, Math.ceil((endDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)))
      : 0;

    return {
      expired,
      remainingDays,
      validUntil: endDate
        ? endDate.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })
        : "Not available",
    };
  };

  const startRenewal = (order) => {
    if (hasPendingRenewal(order)) {
      setPortalNotice(
        "Your ₹99 renewal payment is already awaiting admin verification."
      );
      return;
    }

    const renewalData = {
      selectedPlan: "Lean Pro Renewal",
      selectedPrice: 99,
      goal: order.goal,
      name: customer?.name || order.name,
      email: customer?.email || order.email,
      mobile: customer?.mobile || order.mobile,
      renewalForOrderId: order.orderId,
    };

    localStorage.setItem("leanfitRenewalPlan", JSON.stringify(renewalData));
    localStorage.setItem("leanfitSelectedPlan", JSON.stringify(renewalData));
    setPage("payment");
  };

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

      {portalNotice && <p className="portal-message">{portalNotice}</p>}
      {message && <p className="portal-message">{message}</p>}

      <section className="customer-orders-list">
        {orders.map((order) => {
          const progress = statusProgress(order);
          const isRenewalOrder = order.selectedPlan === "Lean Pro Renewal";
          const canDownload =
            !isRenewalOrder &&
            order.pdfPath &&
            ["Verified", "Delivered"].includes(order.status);
          const isLeanPro = ["Lean Pro Membership", "Lean Pro Renewal"].includes(order.selectedPlan);
          const membership = getMembershipInfo(order);
          const canOpenDashboard =
            !isRenewalOrder &&
            order.dashboardAccess &&
            ["Verified", "Delivered"].includes(order.status) &&
            !membership.expired;
          const renewalPending =
            order.selectedPlan === "Lean Pro Membership" &&
            hasPendingRenewal(order);
          const showRenewal =
            order.selectedPlan === "Lean Pro Membership" &&
            ["Verified", "Delivered"].includes(order.status) &&
            (
              membership.expired ||
              (membership.remainingDays > 0 &&
                membership.remainingDays <= RENEWAL_WARNING_DAYS)
            );

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
                <p><span>Membership</span><strong>{membership.expired ? "Expired" : order.membershipStatus || "Not Applicable"}</strong></p>
                <p><span>Delivery</span><strong>WhatsApp / Manual</strong></p>
              </div>

              {isLeanPro && ["Verified", "Delivered"].includes(order.status) && (
                <div className="leanpro-membership-card">
                  <div><span>Status</span><strong>{membership.expired ? "Expired" : "Active"}</strong></div>
                  <div><span>Valid Until</span><strong>{membership.validUntil}</strong></div>
                  <div><span>Remaining</span><strong>{membership.expired ? "0 Days" : `${membership.remainingDays} Days`}</strong></div>
                </div>
              )}

              {showRenewal && (
                <div className={membership.expired ? "order-rejected-note" : "portal-message"}>
                  <strong>
                    {membership.expired
                      ? "Your Lean Pro membership has expired."
                      : `Your Lean Pro membership expires in ${membership.remainingDays} day${membership.remainingDays === 1 ? "" : "s"}.`}
                  </strong>
                  <p>
                    {renewalPending
                      ? "Your ₹99 renewal request is awaiting admin verification."
                      : "Renew for ₹99 to receive another 90 days of Lean Pro access."}
                  </p>
                </div>
              )}

              <div className="customer-order-actions">
                {canDownload && (
                  <a href={`${API_URL}/api/orders/${order.orderId}/pdf`} target="_blank" rel="noreferrer">
                    <button className="primary-btn" type="button">Download Plan PDF</button>
                  </a>
                )}

                {canOpenDashboard && (
                  <button
                    className="secondary-btn"
                    type="button"
                    onClick={() => {
                      localStorage.setItem("leanfitActiveOrder", JSON.stringify(order));
                      setPage("dashboard");
                    }}
                  >
                    Open Lean Pro Dashboard
                  </button>
                )}

                {showRenewal && !renewalPending && (
                  <button
                    className="primary-btn"
                    type="button"
                    onClick={() => startRenewal(order)}
                  >
                    Renew Membership - ₹99 / 90 Days
                  </button>
                )}

                {showRenewal && renewalPending && (
                  <span className="order-waiting-note">
                    Renewal payment awaiting admin verification.
                  </span>
                )}

                {order.status === "Delivered" && (
                  <button
                    className="secondary-btn"
                    type="button"
                    onClick={() => {
                      localStorage.setItem("leanfitFeedbackOrder", JSON.stringify(order));
                      setPage("feedback");
                    }}
                  >
                    Give Feedback
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
