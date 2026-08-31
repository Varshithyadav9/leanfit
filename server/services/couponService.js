import Coupon from "../models/Coupon.js";
import Order from "../models/Order.js";

export function normalizeCouponCode(value = "") {
  return String(value).trim().toUpperCase();
}

function normalizePlanName(plan = "") {
  const value = String(plan).trim();
  if (value === "Diet + Workout Plan") return "Diet + Workout";
  return value;
}

function roundMoney(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

export async function validateCouponForOrder({
  code,
  plan,
  orderAmount,
  email,
  excludeOrderMongoId = null,
}) {
  const normalizedCode = normalizeCouponCode(code);
  const amount = Number(orderAmount || 0);
  const normalizedPlan = normalizePlanName(plan);
  const normalizedEmail = String(email || "").trim().toLowerCase();

  if (!normalizedCode) {
    throw new Error("Enter a coupon code.");
  }

  const coupon = await Coupon.findOne({ code: normalizedCode });

  if (!coupon) throw new Error("Coupon code is invalid.");
  if (!coupon.active) throw new Error("This coupon is currently inactive.");

  const now = new Date();
  if (coupon.startDate && now < coupon.startDate) {
    throw new Error("This coupon is not active yet.");
  }
  if (coupon.expiryDate && now > coupon.expiryDate) {
    throw new Error("This coupon has expired.");
  }

  const applicablePlans = (coupon.applicablePlans || []).map(normalizePlanName);
  if (
    applicablePlans.length > 0 &&
    !applicablePlans.includes("All") &&
    !applicablePlans.includes(normalizedPlan)
  ) {
    throw new Error("This coupon is not valid for the selected plan.");
  }

  if (amount < Number(coupon.minimumOrderAmount || 0)) {
    throw new Error(
      `Minimum order amount for this coupon is ₹${coupon.minimumOrderAmount}.`
    );
  }

  const baseOrderQuery = { couponCode: normalizedCode };
  if (excludeOrderMongoId) {
    baseOrderQuery._id = { $ne: excludeOrderMongoId };
  }

  if (coupon.totalUsageLimit) {
    const totalUsed = await Order.countDocuments(baseOrderQuery);
    if (totalUsed >= coupon.totalUsageLimit) {
      throw new Error("This coupon has reached its usage limit.");
    }
  }

  if (coupon.perUserUsageLimit && normalizedEmail) {
    const userQuery = { ...baseOrderQuery, email: normalizedEmail };
    const userUsed = await Order.countDocuments(userQuery);
    if (userUsed >= coupon.perUserUsageLimit) {
      throw new Error("You have already used this coupon the maximum number of times.");
    }
  }

  let discountAmount = 0;
  if (coupon.discountType === "percentage") {
    discountAmount = (amount * Number(coupon.discountValue || 0)) / 100;
    if (coupon.maximumDiscount !== null && coupon.maximumDiscount !== undefined) {
      discountAmount = Math.min(discountAmount, Number(coupon.maximumDiscount));
    }
  } else {
    discountAmount = Number(coupon.discountValue || 0);
  }

  discountAmount = Math.min(discountAmount, amount);
  discountAmount = roundMoney(Math.max(0, discountAmount));
  const finalAmount = roundMoney(Math.max(0, amount - discountAmount));

  return {
    coupon,
    code: normalizedCode,
    discountType: coupon.discountType,
    discountValue: Number(coupon.discountValue || 0),
    originalAmount: roundMoney(amount),
    discountAmount,
    finalAmount,
  };
}
