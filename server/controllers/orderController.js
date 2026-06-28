import Order from "../models/Order.js";

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch orders",
    });
  }
};

export const getCustomerOrders = async (req, res) => {
  try {
    const email = req.params.email;

    const orders = await Order.find({ email }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch customer orders",
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;

    if (
      status === "Verified" &&
      order.selectedPlan === "Lean Pro Membership"
    ) {
      order.dashboardAccess = true;
      order.membershipStatus = "Active";

      if (!order.accessStartDate) {
        order.accessStartDate = new Date();
      }

      if (!order.accessEndDate) {
        order.accessEndDate = new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        );
      }
    }

    await order.save();

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to update order",
    });
  }
};