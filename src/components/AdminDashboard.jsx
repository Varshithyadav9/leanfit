import { useEffect, useState } from "react";

function AdminDashboard({ setPage }) {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    setLoading(true);

    fetch("http://127.0.0.1:5000/api/orders")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrders(data.orders);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((order) => order.status === "Pending").length;
  const deliveredOrders = orders.filter((order) => order.status === "Delivered").length;
  const revenue = orders.reduce(
    (sum, order) => sum + Number(order.selectedPrice || 0),
    0
  );

  const updateStatus = async (orderId, status) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (data.success) {
        fetchOrders();
        setSelectedOrder(data.order);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="admin-page">
      <section className="admin-header">
        <div>
          <p className="brand-label">LEANFIT ADMIN</p>
          <h2>Order Management</h2>
          <p>Manage customer orders, payments and delivery status.</p>
        </div>

        <button className="secondary-btn" onClick={() => setPage("welcome")}>
          Back to Website
        </button>
      </section>

      <section className="admin-stats-grid">
        <div className="admin-stat-card">
          <span>Total Orders</span>
          <strong>{totalOrders}</strong>
        </div>

        <div className="admin-stat-card">
          <span>Pending</span>
          <strong>{pendingOrders}</strong>
        </div>

        <div className="admin-stat-card">
          <span>Delivered</span>
          <strong>{deliveredOrders}</strong>
        </div>

        <div className="admin-stat-card">
          <span>Revenue</span>
          <strong>₹{revenue}</strong>
        </div>
      </section>

      {loading ? (
        <section className="admin-card">
          <p>Loading orders...</p>
        </section>
      ) : (
        <section className="admin-layout">
          <div className="admin-card">
            <h3>Orders</h3>

            {orders.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              orders.map((order) => (
                <button
                  key={order._id}
                  className={
                    selectedOrder?._id === order._id
                      ? "admin-order-row active"
                      : "admin-order-row"
                  }
                  onClick={() => setSelectedOrder(order)}
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
                  <p>
                    <strong>Order ID:</strong> {selectedOrder.orderId}
                  </p>
                  <p>
                    <strong>Name:</strong> {selectedOrder.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedOrder.email}
                  </p>
                  <p>
                    <strong>Mobile:</strong> {selectedOrder.mobile}
                  </p>
                  <p>
                    <strong>Plan:</strong> {selectedOrder.selectedPlan}
                  </p>
                  <p>
                    <strong>Amount:</strong> ₹{selectedOrder.selectedPrice}
                  </p>
                  <p>
                    <strong>Goal:</strong> {selectedOrder.goal}
                  </p>
                  <p>
                    <strong>Current Weight:</strong> {selectedOrder.weight} kg
                  </p>
                  <p>
                    <strong>Target Weight:</strong>{" "}
                    {selectedOrder.targetWeight} kg
                  </p>
                  <p>
                    <strong>Status:</strong> {selectedOrder.status}
                  </p>
                  <p>
                    <strong>PDF Sent:</strong>{" "}
                    {selectedOrder.pdfSent ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>Dashboard Access:</strong>{" "}
                    {selectedOrder.dashboardAccess ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>Membership:</strong>{" "}
                    {selectedOrder.membershipStatus}
                  </p>
                </div>

                <div className="admin-actions">
                  <button
                    className="primary-btn"
                    onClick={() =>
                      updateStatus(selectedOrder.orderId, "Verified")
                    }
                  >
                    Mark Verified
                  </button>

                  <button
                    className="secondary-btn"
                    onClick={() =>
                      updateStatus(selectedOrder.orderId, "Delivered")
                    }
                  >
                    Mark Delivered
                  </button>

                  <a
                    href={`https://wa.me/91${selectedOrder.mobile}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <button className="primary-btn">Open WhatsApp</button>
                  </a>
                </div>
              </>
            )}
          </div>
        </section>
      )}
    </main>
  );
}

export default AdminDashboard;