import { useEffect, useState } from "react";

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
        `http://127.0.0.1:5000/api/customer/orders/${email}`
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

  return (
    <main className="page">
      <section className="card">
        <p className="brand-label">LEANFIT CUSTOMER PORTAL</p>

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

                {order.pdfPath && order.status === "Delivered" && (
                  <a
                    href={`http://127.0.0.1:5000/${order.pdfPath}`}
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

        <button className="text-btn" onClick={logout}>
          Logout
        </button>
      </section>
    </main>
  );
}

export default CustomerPortal;