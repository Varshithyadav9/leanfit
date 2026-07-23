import Order from "../models/Order.js";

const PLAN_PRICES = {
  "Diet Plan": 199,
  "Workout Plan": 199,
  "Diet + Workout Plan": 349,
  "Lean Pro Membership": 449,
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

function screenshotPath(file) {
  return `uploads/${file.filename}`.replace(/\\/g, "/");
}

export const submitManualPayment = async (req, res) => {
  try {
    const userData = parseUserData(req.body?.userData);
    const selectedPrice = validateUserData(userData);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload the payment screenshot.",
      });
    }

    const email = String(userData.email).toLowerCase().trim();
    const paymentScreenshot = screenshotPath(req.file);

    const existingPendingOrder = await Order.findOne({
      email,
      selectedPlan: userData.selectedPlan,
      status: "Pending",
      paymentStatus: "Pending",
    }).sort({ createdAt: -1 });

    if (existingPendingOrder) {
      existingPendingOrder.name = userData.name;
      existingPendingOrder.mobile = userData.mobile || "";
      existingPendingOrder.goal = userData.goal || "";
      existingPendingOrder.weight = Number(userData.weight || 0);
      existingPendingOrder.targetWeight = Number(userData.targetWeight || 0);
      existingPendingOrder.selectedPrice = selectedPrice;
      existingPendingOrder.paymentMethod = "Manual UPI";
      existingPendingOrder.paymentScreenshot = paymentScreenshot;
      existingPendingOrder.userData = {
        ...userData,
        selectedPrice,
      };

      await existingPendingOrder.save();

      return res.json({
        success: true,
        message: "Payment screenshot submitted for verification.",
        orderId: existingPendingOrder.orderId,
        status: existingPendingOrder.status,
      });
    }

    const isLeanPro = userData.selectedPlan === "Lean Pro Membership";

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
      membershipStatus: isLeanPro ? "Pending" : "Not Applicable",
      pdfPath: "",
      generatedPlan: "",
      userData: {
        ...userData,
        selectedPrice,
      },
    });

    return res.status(201).json({
      success: true,
      message:
        "Payment screenshot submitted successfully. Your payment is awaiting verification.",
      orderId: savedOrder.orderId,
      status: savedOrder.status,
    });
  } catch (error) {
    console.error("Submit manual payment error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to submit payment.",
    });
  }
};
