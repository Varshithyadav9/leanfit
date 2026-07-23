import { useEffect, useState } from "react";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "https://leanfit.onrender.com").replace(/\/$/, "");

function fileUrl(filePath = "") {
  if (!filePath) return "";

  const normalized = String(filePath).replace(/\\/g, "/");

  return `${API_BASE_URL}/${normalized.replace(/^\/+/, "")}`;
}

function AdminDashboard({ setPage }) {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");

  const fetchOrders = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`);
      const data = await response.json();

      if (data.success) {
        setOrders(data.orders);

        if (selectedOrder) {
          const refreshed = data.orders.find(
            (order) => order.orderId === selectedOrder.orderId
          );
          setSelectedOrder(refreshed || null);
        }
      } else {
        setMessage(data.message || "Unable to load orders.");
      }
    } catch {
      setMessage("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    setUpdating(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to update the order.");
      }

      setSelectedOrder(data.order);
      setMessage(data.message || `Order marked ${status}.`);
      await fetchOrders();
    } catch (error) {
      setMessage(error.message || "Unable to update the order.");
    } finally {
      setUpdating(false);
    }
  };

  const resendEmail = async (orderId) => {
    setUpdating(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/resend-email`, {
        method: "POST",
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Unable to send email.");
      setSelectedOrder(data.order);
      setMessage(data.message);
      await fetchOrders();
    } catch (error) {
      setMessage(error.message || "Unable to send email.");
    } finally {
      setUpdating(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const text =
      `${order.orderId} ${order.name} ${order.mobile} ${order.email} ${order.selectedPlan}`.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  const paidOrders = orders.filter(
    (order) => order.paymentStatus === "Paid"
  );

  const totalRevenue = paidOrders.reduce(
    (sum, order) => sum + Number(order.selectedPrice || 0),
    0
  );

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  );

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  );

  return (
    <main className="admin-page">
      <section className="admin-header">
        <div>
          <p className="brand-label">LEANFIT ADMIN</p>
          <h2>Order Management</h2>
          <p>Verify payments and deliver customer plans.</p>
        </div>

        <button className="secondary-btn" onClick={() => setPage("welcome")}>
          Back to Website
        </button>
      </section>

      {message && <p className="muted">{message}</p>}

      <section className="admin-stats-grid">
        <div className="admin-stat-card">
          <span>Total Orders</span>
          <strong>{orders.length}</strong>
        </div>

        <div className="admin-stat-card">
          <span>Pending Verification</span>
          <strong>{pendingOrders.length}</strong>
        </div>

        <div className="admin-stat-card">
          <span>Delivered</span>
          <strong>{deliveredOrders.length}</strong>
        </div>

        <div className="admin-stat-card">
          <span>Verified Revenue</span>
          <strong>₹{totalRevenue}</strong>
        </div>
      </section>

      <section className="admin-layout">
        <div className="admin-card">
          <h3>Orders</h3>

          <input
            type="text"
            placeholder="Search by name, mobile, email, order ID or plan"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          {loading ? (
            <p>Loading orders...</p>
          ) : filteredOrders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            filteredOrders.map((order) => (
              <button
                key={order._id}
                className={
                  selectedOrder?._id === order._id
                    ? "admin-order-row active"
                    : "admin-order-row"
                }
                onClick={() => {
                  setSelectedOrder(order);
                  setMessage("");
                }}
              >
                <div>
                  <strong>{order.name || "Customer"}</strong>
                  <span>{order.orderId}</span>
                </div>

                <div>
                  <strong>₹{order.selectedPrice}</strong>
                  <span>{order.status}</span>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="admin-card">
          {!selectedOrder ? (
            <div className="empty-state">Select an order to view details.</div>
          ) : (
            <>
              <h3>Order Details</h3>

              <div className="admin-detail-grid">
                <p><strong>Order ID:</strong> {selectedOrder.orderId}</p>
                <p><strong>Name:</strong> {selectedOrder.name}</p>
                <p><strong>Email:</strong> {selectedOrder.email}</p>
                <p><strong>Mobile:</strong> {selectedOrder.mobile}</p>
                <p><strong>Plan:</strong> {selectedOrder.selectedPlan}</p>
                <p><strong>Amount:</strong> ₹{selectedOrder.selectedPrice}</p>
                <p><strong>Goal:</strong> {selectedOrder.goal}</p>
                <p><strong>Status:</strong> {selectedOrder.status}</p>
                <p><strong>Payment:</strong> {selectedOrder.paymentStatus}</p>
                <p>
                  <strong>Email:</strong>{" "}
                  <span className={`email-status ${selectedOrder.emailStatus === "Sent" ? "sent" : selectedOrder.emailStatus === "Failed" ? "failed" : ""}`}>
                    {selectedOrder.emailStatus || (selectedOrder.pdfSent ? "Sent" : "Not Sent")}
                  </span>
                </p>
                <p><strong>Method:</strong> {selectedOrder.paymentMethod}</p>
                <p>
                  <strong>Dashboard Access:</strong>{" "}
                  {selectedOrder.dashboardAccess ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Membership:</strong>{" "}
                  {selectedOrder.membershipStatus}
                </p>
              </div>

              {selectedOrder.paymentScreenshot ? (
                <div className="screenshot-box">
                  <h4>Payment Screenshot</h4>
                  <a
                    href={fileUrl(selectedOrder.paymentScreenshot)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      src={fileUrl(selectedOrder.paymentScreenshot)}
                      alt="Payment Screenshot"
                    />
                  </a>
                </div>
              ) : (
                <div className="empty-state">
                  No payment screenshot uploaded.
                </div>
              )}

              {selectedOrder.emailError && <p className="email-error"><strong>Email error:</strong> {selectedOrder.emailError}</p>}

              <div className="admin-actions">
                {selectedOrder.status === "Pending" && (
                  <>
                    <button
                      className="primary-btn"
                      disabled={updating}
                      onClick={() =>
                        updateStatus(selectedOrder.orderId, "Verified")
                      }
                    >
                      {updating ? "Processing..." : "Verify Payment"}
                    </button>

                    <button
                      className="secondary-btn"
                      disabled={updating}
                      onClick={() =>
                        updateStatus(selectedOrder.orderId, "Rejected")
                      }
                    >
                      Reject Payment
                    </button>
                  </>
                )}

                {selectedOrder.paymentStatus === "Paid" &&
                  selectedOrder.status !== "Delivered" && (
                    <button
                      className="secondary-btn"
                      disabled={updating}
                      onClick={() =>
                        updateStatus(selectedOrder.orderId, "Delivered")
                      }
                    >
                      Mark Delivered
                    </button>
                  )}

                {selectedOrder.paymentStatus === "Paid" && selectedOrder.pdfPath && (
                  <button
                    className="secondary-btn"
                    disabled={updating}
                    onClick={() => resendEmail(selectedOrder.orderId)}
                  >
                    {updating ? "Sending..." : selectedOrder.pdfSent ? "Resend PDF Email" : "Send PDF Email"}
                  </button>
                )}

                {selectedOrder.pdfPath && (
                  <a
                    href={fileUrl(selectedOrder.pdfPath)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <button className="primary-btn">Download PDF</button>
                  </a>
                )}

                {selectedOrder.mobile && (
                  <a
                    href={`https://wa.me/91${String(
                      selectedOrder.mobile
                    ).replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <button className="primary-btn">Open WhatsApp</button>
                  </a>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

export default AdminDashboard;
