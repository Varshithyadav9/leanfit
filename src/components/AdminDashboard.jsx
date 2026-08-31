import { useEffect, useState } from "react";
import PageLoader from "./PageLoader";
import Notifications from "./Notifications";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "https://leanfit.onrender.com").replace(/\/$/, "");

function fileUrl(filePath = "") {
  if (!filePath) return "";

  const normalized = String(filePath).replace(/\\/g, "/");

  // Cloudinary (or any full URL)
  if (
    normalized.startsWith("http://") ||
    normalized.startsWith("https://")
  ) {
    return normalized;
  }

  // Local uploads
  return `${API_BASE_URL}/${normalized.replace(/^\/+/, "")}`;
}

function getWhatsAppNumber(mobile = "") {
  let digits = String(mobile).replace(/\D/g, "");

  if (digits.startsWith("0") && digits.length === 11) {
    digits = digits.slice(1);
  }

  if (digits.length === 10) {
    return `91${digits}`;
  }

  if (digits.startsWith("91") && digits.length === 12) {
    return digits;
  }

  return "";
}

function AdminDashboard({ setPage }) {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
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

  const filteredOrders = orders
    .filter((order) => {
      const text = `${order.orderId} ${order.name} ${order.mobile} ${order.email} ${order.selectedPlan}`.toLowerCase();
      const matchesSearch = text.includes(search.trim().toLowerCase());
      const matchesStatus = statusFilter === "All" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const aTime = new Date(a.createdAt || 0).getTime();
      const bTime = new Date(b.createdAt || 0).getTime();
      return sortOrder === "oldest" ? aTime - bTime : bTime - aTime;
    });

  const exportOrders = () => {
    if (filteredOrders.length === 0) {
      setMessage("No orders available to export.");
      return;
    }

    const columns = [
      "Order ID", "Name", "Email", "Mobile", "Plan", "Amount",
      "Status", "Payment Status", "Created At"
    ];

    const escapeCsv = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
    const rows = filteredOrders.map((order) => [
      order.orderId, order.name, order.email, order.mobile, order.selectedPlan,
      order.selectedPrice, order.status, order.paymentStatus,
      order.createdAt ? new Date(order.createdAt).toLocaleString("en-IN") : ""
    ]);

    const csv = [columns, ...rows]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\n");

    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `leanfit-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setMessage(`${filteredOrders.length} order(s) exported successfully.`);
  };

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

  const deliveredOrders = orders.filter((order) => order.status === "Delivered");
  const verifiedOrders = orders.filter((order) => order.status === "Verified");
  const rejectedOrders = orders.filter((order) => order.status === "Rejected");
  const todayKey = new Date().toDateString();
  const todayOrders = orders.filter((order) => new Date(order.createdAt).toDateString() === todayKey);
  const maxCount = Math.max(orders.length, 1);
  const adminNotifications = [
    ...pendingOrders.slice(0, 5).map((order) => ({
      id: `pending-${order.orderId}`,
      title: "Payment verification required",
      message: `${order.name || "Customer"} submitted order ${order.orderId}.`,
      time: order.createdAt ? new Date(order.createdAt).toLocaleString("en-IN") : "Recently",
      type: "warning",
    })),
    ...todayOrders.slice(0, 3).map((order) => ({
      id: `new-${order.orderId}`,
      title: "New order received",
      message: `${order.selectedPlan || "Plan"} order from ${order.name || "Customer"}.`,
      time: order.createdAt ? new Date(order.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "Today",
      type: "info",
    })),
    ...deliveredOrders.slice(0, 2).map((order) => ({
      id: `delivered-${order.orderId}`,
      title: "Plan delivered",
      message: `Order ${order.orderId} has been completed.`,
      time: "Completed",
      type: "success",
    })),
  ];

  if (loading && orders.length === 0) return <PageLoader label="Loading LeanFit analytics..." />;

  return (
    <main className="admin-page">
      <section className="admin-header">
        <div>
          <p className="brand-label">LEANFIT ADMIN</p>
          <h2>Order Management</h2>
          <p>Verify payments and deliver customer plans.</p>
        </div>

        <div className="admin-header-actions"><Notifications items={adminNotifications} storageKey="leanfitAdminNotificationReads" title="Admin notifications" /><button className="secondary-btn" onClick={() => setPage("admin-coupons")}>Coupons</button><button className="secondary-btn" onClick={() => setPage("admin-feedback")}>Feedback</button><button className="secondary-btn" onClick={() => setPage("email-templates")}>Email Templates</button><button className="secondary-btn" onClick={() => setPage("welcome")}>Back to Website</button></div>
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

        <div className="admin-stat-card"><span>Verified Revenue</span><strong>₹{totalRevenue}</strong></div>
        <div className="admin-stat-card"><span>Today’s Orders</span><strong>{todayOrders.length}</strong></div>
        <div className="admin-stat-card"><span>Verified</span><strong>{verifiedOrders.length}</strong></div>
      </section>
      <section className="analytics-card"><div><h3>Order Status Overview</h3><p className="muted">Live breakdown from all loaded orders.</p></div>{[["Pending",pendingOrders.length],["Verified",verifiedOrders.length],["Delivered",deliveredOrders.length],["Rejected",rejectedOrders.length]].map(([label,count])=><div className="analytics-row" key={label}><span>{label}</span><div><i style={{width:`${Math.max((count/maxCount)*100,count?5:0)}%`}}/></div><strong>{count}</strong></div>)}</section>

      <section className="admin-layout">
        <div className="admin-card">
          <h3>Orders</h3>

          <div className="admin-order-tools">
            <input
              type="text"
              placeholder="Search name, mobile, email, order ID or plan"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <div className="admin-filter-row">
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option value="All">All statuses</option>
                <option value="Pending">Pending</option>
                <option value="Verified">Verified</option>
                <option value="Delivered">Delivered</option>
                <option value="Rejected">Rejected</option>
              </select>

              <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </div>

            <button className="secondary-btn admin-export-btn" type="button" onClick={exportOrders}>
              Export Visible Orders
            </button>
          </div>

          <p className="admin-result-count">Showing {filteredOrders.length} of {orders.length} orders</p>

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
                <p><strong>Delivery:</strong> WhatsApp / Manual</p>
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
{selectedOrder.pdfPath && (
                  <a
                    href={`${API_BASE_URL}/api/orders/${selectedOrder.orderId}/pdf`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <button className="primary-btn">Download PDF</button>
                  </a>
                )}

                {getWhatsAppNumber(selectedOrder.mobile) ? (
                  <a
                    href={`https://wa.me/${getWhatsAppNumber(selectedOrder.mobile)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <button className="primary-btn">Open WhatsApp</button>
                  </a>
                ) : selectedOrder.mobile ? (
                  <span className="email-error">
                    Invalid mobile number. Enter a valid 10-digit Indian number.
                  </span>
                ) : null}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

export default AdminDashboard;
