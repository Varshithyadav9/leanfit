import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import Order from "../models/Order.js";
import { createPlanPDF } from "../services/pdfService.js";
import { generateDietPlan } from "../services/geminiService.js";
import { sendOrderEmail } from "../services/emailService.js";

const ALLOWED_STATUSES = ["Pending", "Verified", "Rejected", "Delivered"];
const SERVER_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);

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

function resolveStoredPdfPath(pdfPath = "") {
  if (!pdfPath) return "";
  return path.resolve(SERVER_ROOT, pdfPath);
}

async function getOrCreatePdf(order, userData, forceRegenerate = false) {
  let pdfBuffer;

  if (!forceRegenerate && order.pdfPath) {
    const existingPath = resolveStoredPdfPath(order.pdfPath);
    if (fs.existsSync(existingPath)) {
      pdfBuffer = fs.readFileSync(existingPath);
    }
  }

  if (pdfBuffer?.length) {
    if (order.pdfStatus !== "Generated") {
      order.pdfStatus = "Generated";
      order.pdfError = "";
      order.pdfGeneratedAt ||= new Date();
      await order.save();
    }
    return pdfBuffer;
  }

  order.pdfStatus = "Generating";
  order.pdfError = "";
  await order.save();

  try {
    if (!order.generatedPlan) {
      order.generatedPlan = await generateDietPlan(userData);
    }

    pdfBuffer = await createPlanPDF(
      userData,
      order.generatedPlan,
      order.orderId
    );

    if (!pdfBuffer?.length) {
      throw new Error("The PDF generator returned an empty file.");
    }

    const pdfDirectory = path.resolve(SERVER_ROOT, "pdfs");
    fs.mkdirSync(pdfDirectory, { recursive: true });

    const pdfFileName = `${order.orderId}.pdf`;
    fs.writeFileSync(path.join(pdfDirectory, pdfFileName), pdfBuffer);

    order.pdfPath = `pdfs/${pdfFileName}`;
    order.pdfStatus = "Generated";
    order.pdfError = "";
    order.pdfGeneratedAt = new Date();
    await order.save();

    return pdfBuffer;
  } catch (error) {
    order.pdfStatus = "Failed";
    order.pdfError = error.message || "PDF generation failed.";
    await order.save();
    throw error;
  }
}

async function emailOrderPdf(order, userData, pdfBuffer) {
  order.emailStatus = "Sending";
  order.emailError = "";
  await order.save();

  try {
    const emailResult = await sendOrderEmail(
      userData,
      order.orderId,
      pdfBuffer
    );

    order.pdfSent = true;
    order.emailStatus = "Sent";
    order.emailError = "";
    order.emailSentAt = new Date();
    order.emailProviderId = emailResult.id || "";
    await order.save();

    return { sent: true };
  } catch (error) {
    order.pdfSent = false;
    order.emailStatus = "Failed";
    order.emailError = error.message || "Email delivery failed.";
    await order.save();

    console.error(`Email failed for ${order.orderId}:`, error);
    return { sent: false, stage: "email", error: order.emailError };
  }
}

async function activateVerifiedOrder(order) {
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
}

async function prepareVerifiedOrder(order) {
  await activateVerifiedOrder(order);

  const userData = buildUserData(order);
  let pdfBuffer;

  try {
    pdfBuffer = await getOrCreatePdf(order, userData);
  } catch (error) {
    return {
      sent: false,
      stage: "pdf",
      error: error.message || "PDF generation failed.",
    };
  }

  if (order.pdfSent && order.emailStatus === "Sent") {
    return { sent: true, alreadySent: true };
  }

  return emailOrderPdf(order, userData, pdfBuffer);
}

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.json({ success: true, orders });
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
    return res.json({ success: true, orders });
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

    let workflowResult = null;

    if (status === "Verified") {
      workflowResult = await prepareVerifiedOrder(order);
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

    let message = `Order marked ${status}.`;

    if (status === "Verified") {
      if (workflowResult?.sent) {
        message = workflowResult.alreadySent
          ? "Payment verified. The PDF was already generated and emailed."
          : "Payment verified, PDF generated and email sent to the customer.";
      } else if (workflowResult?.stage === "pdf") {
        message =
          `Payment verified and membership activated, but PDF generation failed: ` +
          workflowResult.error;
      } else {
        message =
          `Payment verified, PDF generated and membership activated, but email failed: ` +
          (workflowResult?.error || "Unknown email error");
      }
    }

    return res.json({
      success: true,
      message,
      order,
      workflow: workflowResult,
    });
  } catch (error) {
    console.error("Update order error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Unable to update order.",
    });
  }
};

export const resendOrderEmail = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    if (order.paymentStatus !== "Paid") {
      return res.status(400).json({
        success: false,
        message: "Verify the payment before sending the PDF.",
      });
    }

    const userData = buildUserData(order);
    const pdfBuffer = await getOrCreatePdf(order, userData);
    const result = await emailOrderPdf(order, userData, pdfBuffer);

    if (!result.sent) {
      return res.status(502).json({
        success: false,
        message: `PDF is available, but email failed: ${result.error}`,
        order,
      });
    }

    return res.json({
      success: true,
      message: `PDF emailed to ${order.email}.`,
      order,
    });
  } catch (error) {
    console.error("Resend order email error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Unable to resend email.",
    });
  }
};

export const downloadOrderPdf = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    if (order.paymentStatus !== "Paid") {
      return res.status(403).json({
        success: false,
        message: "The PDF becomes available after payment verification.",
      });
    }

    const userData = buildUserData(order);
    const forceRegenerate =
      String(req.query.regenerate || "").toLowerCase() === "1" ||
      String(req.query.regenerate || "").toLowerCase() === "true";

    const pdfBuffer = await getOrCreatePdf(
      order,
      userData,
      forceRegenerate
    );

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${order.orderId}.pdf"`
    );
    res.setHeader("Content-Length", String(pdfBuffer.length));

    return res.send(pdfBuffer);
  } catch (error) {
    console.error("Download order PDF error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Unable to download PDF.",
    });
  }
};
