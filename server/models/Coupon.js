import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      index: true,
      uppercase: true,
      trim: true,
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    discountValue: { type: Number, required: true, min: 0 },
    minimumOrderAmount: { type: Number, default: 0, min: 0 },
    maximumDiscount: { type: Number, default: null, min: 0 },
    startDate: { type: Date, default: null },
    expiryDate: { type: Date, default: null },
    totalUsageLimit: { type: Number, default: null, min: 1 },
    perUserUsageLimit: { type: Number, default: 1, min: 1 },
    active: { type: Boolean, default: true },
    applicablePlans: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

couponSchema.pre("save", function normalizeCouponCode() {
  if (this.code) this.code = String(this.code).trim().toUpperCase();
});

export default mongoose.model("Coupon", couponSchema);
