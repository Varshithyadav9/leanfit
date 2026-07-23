import { useEffect, useState } from "react";

const API_URL = (
  import.meta.env.VITE_API_URL || "https://leanfit.onrender.com"
).replace(/\/$/, "");

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

    try {
      const parsedCustomer = JSON.parse(savedCustomer);
      setCustomer(parsedCustomer);
      fetchOrders(parsedCustomer.email);
    } catch {
      localStorage.removeItem("leanfitCustomer");
      setPage("customer-auth");
    }
  }, [setPage]);

  const fetchOrders = async (email) => {
    try {
      const response = await fetch(
        `${API_URL}/api/customer/orders/${encodeURIComponent(email)}`
      );

      const data = await response.json();

      if (data.success) {
        setOrders(data.orders || []);
        setMessage(
          data.orders?.length === 0 ? "No orders found." : ""
        );
      } else {
        setMessage(data.message || "Unable to load orders.");
      }
    } catch {
      setMessage("Server error. Please try again.");
    }
  };

  const logout = () => {
    localStorage.removeItem("leanfitCustomer");
    localStorage.removeItem("leanfitToken");
    setPage("welcome");
  };

  return (
    <main className="page">
      <section className="card">
        <p className="brand-label">LEANFIT CUSTOMER PORTAL</p>

        <h2>Welcome, {customer?.name || "Customer"}</h2>

        <p className="muted">
          View your orders, download verified PDFs and access Lean Pro.
        </p>

        {message && <p className="error-text">{message}</p>}

        {orders.length > 0 && (
          <div className="customer-orders">
            {orders.map((order) => {
              const canDownloadPdf =
                order.paymentStatus === "Paid" &&
                ["Verified", "Delivered"].includes(order.status);

              return (
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

                  <p>
                    <strong>PDF Email:</strong>{" "}
                    <span
                      className={`email-status ${
                        order.emailStatus === "Sent"
                          ? "sent"
                          : order.emailStatus === "Failed"
                          ? "failed"
                          : ""
                      }`}
                    >
                      {order.emailStatus ||
                        (order.pdfSent ? "Sent" : "Not Sent")}
                    </span>
                  </p>

                  {canDownloadPdf && (
                    <a
                      href={`${API_URL}/api/orders/${order.orderId}/pdf`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <button className="primary-btn full-btn" type="button">
                        Download Plan PDF
                      </button>
                    </a>
                  )}

                  {order.dashboardAccess &&
                    ["Verified", "Delivered"].includes(order.status) && (
                      <button
                        className="secondary-btn full-btn"
                        type="button"
                        onClick={() => setPage("dashboard")}
                      >
                        Open Lean Pro Dashboard
                      </button>
                    )}
                </div>
              );
            })}
          </div>
        )}

        <button className="text-btn" type="button" onClick={logout}>
          Logout
        </button>
      </section>
    </main>
  );
}

export default CustomerPortal;
