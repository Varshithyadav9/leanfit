import crypto from "crypto";
import fs from "fs";
import path from "path";
import Razorpay from "razorpay";

import Order from "../models/Order.js";
import { createPlanPDF } from "../services/pdfService.js";
import { generateDietPlan } from "../services/geminiService.js";
import { sendOrderEmail } from "../services/emailService.js";

const PLAN_PRICES = {
  "Diet Plan": 199,
  "Workout Plan": 199,
  "Diet + Workout Plan": 349,
  "Lean Pro Membership": 349,
};

function getRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay environment variables are missing.");
  }

  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

function createOrderId() {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `LF-${y}${m}${d}-${random}`;
}

function validateUserData(userData) {
  if (!userData?.name || !userData?.email || !userData?.selectedPlan) {
    throw new Error("Name, email and selected plan are required.");
  }

  const expectedPrice = PLAN_PRICES[userData.selectedPlan];

  if (!expectedPrice) {
    throw new Error("Invalid plan selected.");
  }

  return expectedPrice;
}

export const createRazorpayOrder = async (req, res) => {
  try {
    const { userData } = req.body;
    const amount = validateUserData(userData);
    const razorpay = getRazorpayClient();

    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `leanfit_${Date.now()}`,
      notes: {
        customerEmail: userData.email,
        selectedPlan: userData.selectedPlan,
      },
    });

    res.json({
      success: true,
      keyId: process.env.RAZORPAY_KEY_ID,
      order: razorpayOrder,
      amount,
    });
  } catch (error) {
    console.error("Create Razorpay order error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Unable to create payment order.",
    });
  }
};

export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      userData,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const selectedPrice = validateUserData(userData);

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Incomplete Razorpay payment details.",
      });
    }

    const existingOrder = await Order.findOne({ razorpayPaymentId: razorpay_payment_id });

    if (existingOrder) {
      return res.json({
        success: true,
        orderId: existingOrder.orderId,
        plan: existingOrder.generatedPlan || "",
        pdfPath: existingOrder.pdfPath,
        dashboardAccess: existingOrder.dashboardAccess,
      });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(razorpay_signature)
    );

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed.",
      });
    }

    const razorpay = getRazorpayClient();
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    if (payment.status !== "captured" || payment.amount !== selectedPrice * 100) {
      return res.status(400).json({
        success: false,
        message: "Payment is not captured or the amount does not match.",
      });
    }

    const orderId = createOrderId();
    const plan = await generateDietPlan({ ...userData, selectedPrice });
    const pdfBuffer = await createPlanPDF(
      { ...userData, selectedPrice },
      plan,
      orderId
    );

    const pdfDirectory = path.resolve("pdfs");
    fs.mkdirSync(pdfDirectory, { recursive: true });

    const pdfFileName = `${orderId}.pdf`;
    const pdfPath = `pdfs/${pdfFileName}`;
    fs.writeFileSync(path.join(pdfDirectory, pdfFileName), pdfBuffer);

    const isLeanPro = userData.selectedPlan === "Lean Pro Membership";
    const accessStartDate = isLeanPro ? new Date() : null;
    const accessEndDate = isLeanPro
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      : null;

    const savedOrder = await Order.create({
      orderId,
      name: userData.name,
      email: String(userData.email).toLowerCase().trim(),
      mobile: userData.mobile,
      goal: userData.goal,
      weight: Number(userData.weight || 0),
      targetWeight: Number(userData.targetWeight || 0),
      selectedPlan: userData.selectedPlan,
      selectedPrice,
      status: "Verified",
      paymentStatus: "Paid",
      paymentMethod: payment.method || "Razorpay",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature,
      pdfSent: true,
      dashboardAccess: isLeanPro,
      accessStartDate,
      accessEndDate,
      membershipStatus: isLeanPro ? "Active" : "Not Applicable",
      paymentScreenshot: "",
      pdfPath,
      generatedPlan: plan,
    });

    try {
      await sendOrderEmail(
        { ...userData, selectedPrice },
        orderId,
        pdfBuffer,
        "",
        process.env.PORT || 5000
      );
    } catch (emailError) {
      console.error("Order saved, but email failed:", emailError);
    }

    res.json({
      success: true,
      orderId: savedOrder.orderId,
      plan,
      pdfPath,
      dashboardAccess: savedOrder.dashboardAccess,
    });
  } catch (error) {
    console.error("Verify Razorpay payment error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Unable to verify payment.",
    });
  }
};
