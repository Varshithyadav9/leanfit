import fs from "fs";

import Order from "../models/Order.js";

import { createPlanPDF } from "../services/pdfService.js";
import { generateDietPlan } from "../services/geminiService.js";
import { sendOrderEmail } from "../services/emailService.js";

function createOrderId() {
  const date = new Date();

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  const random = Math.floor(1000 + Math.random() * 9000);

  return `LF-${y}${m}${d}-${random}`;
}

export const generatePlan = async (req, res) => {
  try {
    const userData = JSON.parse(req.body.userData);

    const orderId = createOrderId();

    const paymentScreenshot = req.file
      ? `/uploads/${req.file.filename}`
      : "";

    const plan = await generateDietPlan(userData);

    const pdfBuffer = await createPlanPDF(userData, plan, orderId);

    const pdfFileName = `${orderId}.pdf`;
    const pdfPath = `pdfs/${pdfFileName}`;

    fs.writeFileSync(pdfPath, pdfBuffer);

    const isLeanPro =
      userData.selectedPlan === "Lean Pro Membership";

    const accessStartDate = isLeanPro ? new Date() : null;

    const accessEndDate = isLeanPro
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      : null;

    await Order.create({
      orderId,

      name: userData.name,
      email: userData.email,
      mobile: userData.mobile,

      goal: userData.goal,
      weight: Number(userData.weight),
      targetWeight: Number(userData.targetWeight),

      selectedPlan: userData.selectedPlan,
      selectedPrice: Number(userData.selectedPrice),

      status: "Pending",
      pdfSent: true,

      dashboardAccess: isLeanPro,
      accessStartDate,
      accessEndDate,
      membershipStatus: isLeanPro ? "Active" : "Not Applicable",

      paymentScreenshot,
      pdfPath,
    });

    await sendOrderEmail(
      userData,
      orderId,
      pdfBuffer,
      paymentScreenshot,
      process.env.PORT || 5000
    );

    res.json({
      success: true,
      orderId,
      plan,
      pdfPath,
      paymentScreenshot,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};