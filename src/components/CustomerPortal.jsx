import { useEffect, useState } from "react";
import PageLoader from "./PageLoader";

const API_URL = (import.meta.env.VITE_API_URL || "https://leanfit.onrender.com").replace(/\/$/, "");

function CustomerPortal({ setPage }) {
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("Loading your orders...");

  useEffect(() => {
    const savedCustomer = localStorage.getItem("leanfitCustomer");

    if (!savedCustomer) {
      setPage("customer-auth");
      return;
    }

    const parsedCustomer = JSON.parse(savedCustomer);
    setCustomer(parsedCustomer);

    fetchOrders(parsedCustomer.email);
  }, []);

  const fetchOrders = async (email) => {
    try {
      const response = await fetch(
        `${API_URL}/api/customer/orders/${encodeURIComponent(email)}`
      );

      const data = await response.json();

      if (data.success) {
        setOrders(data.orders);
        setMessage(data.orders.length === 0 ? "No orders found." : "");
      } else {
        setMessage("Unable to load orders.");
      }
    } catch (error) {
      setMessage("Server error. Please try again.");
    }
  };

  const logout = () => {
    localStorage.removeItem("leanfitCustomer");
    localStorage.removeItem("leanfitToken");
    setPage("welcome");
  };

  if (message === "Loading your orders...") return <PageLoader label="Loading your LeanFit account..." />;

  return (
    <main className="page">
      <section className="card">
        <img
          src="/leanfit-logo.png"
          alt="LeanFit"
          style={{
            width: "190px",
            maxWidth: "70%",
            height: "auto",
            display: "block",
            margin: "0 auto 18px",
          }}
        />
        <p className="brand-label">CUSTOMER PORTAL</p>

        <h2>Welcome, {customer?.name || "Customer"}</h2>

        <p className="muted">
          View your orders, download delivered PDFs and access Lean Pro.
        </p>

        {message && <p className="error-text">{message}</p>}

        {orders.length > 0 && (
          <div className="customer-orders">
            {orders.map((order) => (
              <div className="customer-order-card" key={order._id}>
                <h3>{order.selectedPlan}</h3>

                <p>
                  <strong>Order ID:</strong> {order.orderId}
                </p>

                <p>
                  <strong>Status:</strong> {order.status}
                </p>

                <p>
                  <strong>Amount:</strong> ₹{order.selectedPrice}
                </p>

                <p>
                  <strong>Membership:</strong>{" "}
                  {order.membershipStatus || "Not Applicable"}
                </p>
                <p><strong>Delivery:</strong> WhatsApp / Manual</p>

                {order.pdfPath && ["Verified", "Delivered"].includes(order.status) && (
                  <a
                    href={`${API_URL}/api/orders/${order.orderId}/pdf`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <button className="primary-btn full-btn">
                      Download Plan PDF
                    </button>
                  </a>
                )}

                {order.dashboardAccess && order.status === "Verified" && (
                  <button
                    className="secondary-btn full-btn"
                    onClick={() => setPage("dashboard")}
                  >
                    Open Lean Pro Dashboard
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <button className="secondary-btn full-btn" type="button" onClick={() => setPage("profile-settings")}>Profile & Security</button>

        <button className="text-btn" onClick={logout}>
          Logout
        </button>
      </section>
    </main>
  );
}

export default CustomerPortal;