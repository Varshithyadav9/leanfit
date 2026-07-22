import fs from "fs";
import path from "path";

import Order from "../models/Order.js";
import { createPlanPDF } from "../services/pdfService.js";
import { generateDietPlan } from "../services/geminiService.js";
import { sendOrderEmail } from "../services/emailService.js";

const ALLOWED_STATUSES = ["Pending", "Verified", "Rejected", "Delivered"];

function buildUserData(order) {
  return {
    ...(order.userData || {}),
    name: order.name,
    email: order.email,
    mobile: order.mobile,
    goal: order.goal,
    weight: order.weight,
    targetWeight: order.targetWeight,
    selectedPlan: order.selectedPlan,
    selectedPrice: order.selectedPrice,
  };
}

async function prepareVerifiedOrder(order) {
  const userData = buildUserData(order);

  if (!order.generatedPlan) {
    order.generatedPlan = await generateDietPlan(userData);
  }

  let pdfBuffer;

  if (order.pdfPath) {
    const existingPath = path.resolve(order.pdfPath);

    if (fs.existsSync(existingPath)) {
      pdfBuffer = fs.readFileSync(existingPath);
    }
  }

  if (!pdfBuffer) {
    pdfBuffer = await createPlanPDF(
      userData,
      order.generatedPlan,
      order.orderId
    );

    const pdfDirectory = path.resolve("pdfs");
    fs.mkdirSync(pdfDirectory, { recursive: true });

    const pdfFileName = `${order.orderId}.pdf`;
    fs.writeFileSync(path.join(pdfDirectory, pdfFileName), pdfBuffer);
    order.pdfPath = `pdfs/${pdfFileName}`;
  }

  order.status = "Verified";
  order.paymentStatus = "Paid";

  if (order.selectedPlan === "Lean Pro Membership") {
    order.dashboardAccess = true;
    order.membershipStatus = "Active";
    order.accessStartDate ||= new Date();
    order.accessEndDate ||= new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    );
  }

  await order.save();

  if (!order.pdfSent) {
    try {
      await sendOrderEmail(
        userData,
        order.orderId,
        pdfBuffer,
        order.paymentScreenshot || "",
        process.env.PORT || 5000
      );

      order.pdfSent = true;
      await order.save();
    } catch (emailError) {
      console.error("Order verified, but email failed:", emailError);
    }
  }
}

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    return res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Fetch orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch orders.",
    });
  }
};

export const getCustomerOrders = async (req, res) => {
  try {
    const email = String(req.params.email || "").toLowerCase().trim();

    const orders = await Order.find({ email }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Fetch customer orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch customer orders.",
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status.",
      });
    }

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    if (status === "Verified") {
      await prepareVerifiedOrder(order);
    } else if (status === "Rejected") {
      order.status = "Rejected";
      order.paymentStatus = "Rejected";
      order.dashboardAccess = false;

      if (order.selectedPlan === "Lean Pro Membership") {
        order.membershipStatus = "Rejected";
        order.accessStartDate = null;
        order.accessEndDate = null;
      }

      await order.save();
    } else if (status === "Delivered") {
      if (order.paymentStatus !== "Paid") {
        return res.status(400).json({
          success: false,
          message: "Verify the payment before marking the order delivered.",
        });
      }

      order.status = "Delivered";
      await order.save();
    } else {
      order.status = "Pending";
      order.paymentStatus = "Pending";
      order.dashboardAccess = false;

      if (order.selectedPlan === "Lean Pro Membership") {
        order.membershipStatus = "Pending";
        order.accessStartDate = null;
        order.accessEndDate = null;
      }

      await order.save();
    }

    return res.json({
      success: true,
      message:
        status === "Verified"
          ? "Payment verified and plan prepared."
          : `Order marked ${status}.`,
      order,
    });
  } catch (error) {
    console.error("Update order error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to update order.",
    });
  }
};
