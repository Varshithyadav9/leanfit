import Coupon from "../models/Coupon.js";
import Order from "../models/Order.js";

const allowedPlans = ["All", "Diet Plan", "Workout Plan", "Diet + Workout", "Lean Pro Membership", "Lean Pro Renewal"];

function cleanPayload(body = {}) {
  const code = String(body.code || "").trim().toUpperCase();
  const discountType = body.discountType === "fixed" ? "fixed" : "percentage";
  const discountValue = Number(body.discountValue);
  const minimumOrderAmount = Number(body.minimumOrderAmount || 0);
  const maximumDiscount = body.maximumDiscount === "" || body.maximumDiscount == null ? null : Number(body.maximumDiscount);
  const totalUsageLimit = body.totalUsageLimit === "" || body.totalUsageLimit == null ? null : Number(body.totalUsageLimit);
  const perUserUsageLimit = body.perUserUsageLimit === "" || body.perUserUsageLimit == null ? 1 : Number(body.perUserUsageLimit);
  const applicablePlans = Array.isArray(body.applicablePlans) ? body.applicablePlans.filter((p) => allowedPlans.includes(p)) : ["All"];

  if (!code) throw new Error("Coupon code is required.");
  if (!Number.isFinite(discountValue) || discountValue <= 0) throw new Error("Enter a valid discount value.");
  if (discountType === "percentage" && discountValue > 100) throw new Error("Percentage discount cannot exceed 100%.");
  if (minimumOrderAmount < 0) throw new Error("Minimum order cannot be negative.");
  if (maximumDiscount !== null && maximumDiscount < 0) throw new Error("Maximum discount cannot be negative.");
  if (totalUsageLimit !== null && totalUsageLimit < 1) throw new Error("Total usage limit must be at least 1.");
  if (perUserUsageLimit < 1) throw new Error("Per-user limit must be at least 1.");

  const startDate = body.startDate ? new Date(body.startDate) : null;
  const expiryDate = body.expiryDate ? new Date(body.expiryDate) : null;
  if (startDate && Number.isNaN(startDate.getTime())) throw new Error("Invalid start date.");
  if (expiryDate && Number.isNaN(expiryDate.getTime())) throw new Error("Invalid expiry date.");
  if (startDate && expiryDate && expiryDate < startDate) throw new Error("Expiry date must be after the start date.");

  return { code, discountType, discountValue, minimumOrderAmount, maximumDiscount, startDate, expiryDate, totalUsageLimit, perUserUsageLimit, active: body.active !== false, applicablePlans: applicablePlans.length ? applicablePlans : ["All"] };
}

export const listCoupons = async (_req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
    const usage = await Order.aggregate([
      { $match: { couponCode: { $nin: [null, ""] } } },
      { $group: { _id: "$couponCode", count: { $sum: 1 } } },
    ]);
    const usageMap = Object.fromEntries(usage.map((item) => [String(item._id).toUpperCase(), item.count]));
    res.json({ success: true, coupons: coupons.map((c) => ({ ...c, usedCount: usageMap[c.code] || 0 })) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Unable to load coupons." });
  }
};

export const createCoupon = async (req, res) => {
  try {
    const payload = cleanPayload(req.body);
    const exists = await Coupon.findOne({ code: payload.code });
    if (exists) return res.status(409).json({ success: false, message: "A coupon with this code already exists." });
    const coupon = await Coupon.create(payload);
    res.status(201).json({ success: true, message: `Coupon ${coupon.code} created.`, coupon });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || "Unable to create coupon." });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const payload = cleanPayload(req.body);
    const duplicate = await Coupon.findOne({ code: payload.code, _id: { $ne: req.params.id } });
    if (duplicate) return res.status(409).json({ success: false, message: "A coupon with this code already exists." });
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
    if (!coupon) return res.status(404).json({ success: false, message: "Coupon not found." });
    res.json({ success: true, message: `Coupon ${coupon.code} updated.`, coupon });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || "Unable to update coupon." });
  }
};

export const toggleCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: "Coupon not found." });
    coupon.active = !coupon.active;
    await coupon.save();
    res.json({ success: true, message: `${coupon.code} is now ${coupon.active ? "active" : "inactive"}.`, coupon });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || "Unable to change coupon status." });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: "Coupon not found." });
    res.json({ success: true, message: `Coupon ${coupon.code} deleted.` });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || "Unable to delete coupon." });
  }
};
