import Order from "../models/Order.js";
import { uploadPaymentScreenshot } from "../config/cloudinary.js";
import { validateCouponForOrder, normalizeCouponCode } from "../services/couponService.js";

const PLAN_PRICES = {
  "Diet Plan": 199,
  "Workout Plan": 199,
  "Diet + Workout": 349,
  "Diet + Workout Plan": 349,
  "Lean Pro Membership": 449,
  "Lean Pro Renewal": 99,
};

function createOrderId() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const random = Math.floor(1000 + Math.random() * 9000);

  return `LF-${year}${month}${day}-${random}`;
}

function parseUserData(rawUserData) {
  if (!rawUserData) {
    throw new Error("Payment details are missing.");
  }

  if (typeof rawUserData === "string") {
    try {
      return JSON.parse(rawUserData);
    } catch {
      throw new Error("Invalid payment details.");
    }
  }

  return rawUserData;
}

function validateUserData(userData) {
  if (!userData?.name || !userData?.email || !userData?.selectedPlan) {
    throw new Error("Name, email and selected plan are required.");
  }

  const selectedPrice = PLAN_PRICES[userData.selectedPlan];

  if (!selectedPrice) {
    throw new Error("Invalid plan selected.");
  }

  return selectedPrice;
}

export const submitManualPayment = async (req, res) => {
  try {
    const userData = parseUserData(req.body?.userData);
    const originalPrice = validateUserData(userData);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload the payment screenshot.",
      });
    }

    const email = String(userData.email).toLowerCase().trim();
    const requestedCouponCode = normalizeCouponCode(userData.couponCode || "");

    const existingPendingOrder = await Order.findOne({
      email,
      selectedPlan: userData.selectedPlan,
      status: "Pending",
      paymentStatus: "Pending",
    }).sort({ createdAt: -1 });

    let pricing = {
      code: "",
      originalAmount: originalPrice,
      discountAmount: 0,
      finalAmount: originalPrice,
    };

    if (requestedCouponCode) {
      pricing = await validateCouponForOrder({
        code: requestedCouponCode,
        plan: userData.selectedPlan,
        orderAmount: originalPrice,
        email,
        excludeOrderMongoId: existingPendingOrder?._id || null,
      });
    }

    const selectedPrice = pricing.finalAmount;

    const uploadedScreenshot = await uploadPaymentScreenshot(req.file);
    const paymentScreenshot = uploadedScreenshot.url;

    if (existingPendingOrder) {
      existingPendingOrder.name = userData.name;
      existingPendingOrder.mobile = userData.mobile || "";
      existingPendingOrder.goal = userData.goal || "";
      existingPendingOrder.weight = Number(userData.weight || 0);
      existingPendingOrder.targetWeight = Number(userData.targetWeight || 0);
      existingPendingOrder.selectedPrice = selectedPrice;
      existingPendingOrder.originalPrice = pricing.originalAmount;
      existingPendingOrder.discountAmount = pricing.discountAmount;
      existingPendingOrder.couponCode = pricing.code || "";
      existingPendingOrder.paymentMethod = "Manual UPI";
      existingPendingOrder.paymentScreenshot = paymentScreenshot;
      existingPendingOrder.renewalForOrderId =
        userData.selectedPlan === "Lean Pro Renewal"
          ? String(
              userData.renewalForOrderId ||
                existingPendingOrder.renewalForOrderId ||
                ""
            )
          : "";
      existingPendingOrder.membershipStatus =
        userData.selectedPlan === "Lean Pro Renewal"
          ? "Renewal Pending"
          : existingPendingOrder.membershipStatus;
      existingPendingOrder.userData = {
        ...userData,
        selectedPrice,
        originalPrice: pricing.originalAmount,
        discountAmount: pricing.discountAmount,
        couponCode: pricing.code || "",
      };

      await existingPendingOrder.save();

      return res.json({
        success: true,
        message: "Payment screenshot submitted for verification.",
        orderId: existingPendingOrder.orderId,
        status: existingPendingOrder.status,
        originalAmount: pricing.originalAmount,
        discountAmount: pricing.discountAmount,
        finalAmount: selectedPrice,
        couponCode: pricing.code || "",
      });
    }

    const isLeanPro = ["Lean Pro Membership", "Lean Pro Renewal"].includes(
      userData.selectedPlan
    );

    const savedOrder = await Order.create({
      orderId: createOrderId(),
      name: userData.name,
      email,
      mobile: userData.mobile || "",
      goal: userData.goal || "",
      weight: Number(userData.weight || 0),
      targetWeight: Number(userData.targetWeight || 0),
      selectedPlan: userData.selectedPlan,
      selectedPrice,
      originalPrice: pricing.originalAmount,
      discountAmount: pricing.discountAmount,
      couponCode: pricing.code || "",
      status: "Pending",
      paymentStatus: "Pending",
      paymentMethod: "Manual UPI",
      paymentScreenshot,
      pdfSent: false,
      emailStatus: "Not Sent",
      emailError: "",
      dashboardAccess: false,
      accessStartDate: null,
      accessEndDate: null,
      membershipStatus:
        userData.selectedPlan === "Lean Pro Renewal"
          ? "Renewal Pending"
          : isLeanPro
            ? "Pending"
            : "Not Applicable",
      renewalForOrderId:
        userData.selectedPlan === "Lean Pro Renewal"
          ? String(userData.renewalForOrderId || "")
          : "",
      pdfPath: "",
      generatedPlan: "",
      userData: {
        ...userData,
        selectedPrice,
        originalPrice: pricing.originalAmount,
        discountAmount: pricing.discountAmount,
        couponCode: pricing.code || "",
      },
    });

    return res.status(201).json({
      success: true,
      message:
        "Payment screenshot submitted successfully. Your payment is awaiting verification.",
      orderId: savedOrder.orderId,
      status: savedOrder.status,
      originalAmount: pricing.originalAmount,
      discountAmount: pricing.discountAmount,
      finalAmount: selectedPrice,
      couponCode: pricing.code || "",
    });
  } catch (error) {
    console.error("Submit manual payment error:", error);

    const isCouponError = /coupon|minimum order|usage limit|already used|not active|expired/i.test(
      error.message || ""
    );

    return res.status(isCouponError ? 400 : 500).json({
      success: false,
      message: error.message || "Unable to submit payment.",
    });
  }
};
