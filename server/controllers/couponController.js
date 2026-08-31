import { validateCouponForOrder } from "../services/couponService.js";

const PLAN_PRICES = {
  "Diet Plan": 199,
  "Workout Plan": 199,
  "Diet + Workout": 349,
  "Diet + Workout Plan": 349,
  "Lean Pro Membership": 449,
  "Lean Pro Renewal": 99,
};

export const validateCoupon = async (req, res) => {
  try {
    const { code, selectedPlan, email } = req.body || {};
    const originalAmount = PLAN_PRICES[selectedPlan];

    if (!originalAmount) {
      return res.status(400).json({ success: false, message: "Invalid plan selected." });
    }

    const result = await validateCouponForOrder({
      code,
      plan: selectedPlan,
      orderAmount: originalAmount,
      email,
    });

    return res.json({
      success: true,
      message: `Coupon ${result.code} applied successfully.`,
      coupon: {
        code: result.code,
        discountType: result.discountType,
        discountValue: result.discountValue,
      },
      originalAmount: result.originalAmount,
      discountAmount: result.discountAmount,
      finalAmount: result.finalAmount,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Unable to apply coupon.",
    });
  }
};
