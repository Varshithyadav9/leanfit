import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, unique: true, index: true },
    name: String,
    email: { type: String, index: true },
    mobile: String,
    goal: String,
    weight: Number,
    targetWeight: Number,
    selectedPlan: String,
    selectedPrice: Number,
    status: { type: String, default: "Pending" },
    paymentStatus: { type: String, default: "Pending" },
    paymentMethod: { type: String, default: "" },
    razorpayOrderId: { type: String, default: "" },
    razorpayPaymentId: { type: String, unique: true, sparse: true },
    razorpaySignature: { type: String, default: "" },
    pdfSent: { type: Boolean, default: false },
    dashboardAccess: { type: Boolean, default: false },
    accessStartDate: Date,
    accessEndDate: Date,
    membershipStatus: { type: String, default: "Not Applicable" },
    paymentScreenshot: { type: String, default: "" },
    pdfPath: { type: String, default: "" },
    generatedPlan: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
