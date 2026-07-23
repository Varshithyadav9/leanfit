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
    emailStatus: {
      type: String,
      enum: ["Not Sent", "Sending", "Sent", "Failed"],
      default: "Not Sent",
    },
    emailError: { type: String, default: "" },
    emailSentAt: Date,
    emailProviderId: { type: String, default: "" },
    dashboardAccess: { type: Boolean, default: false },
    accessStartDate: Date,
    accessEndDate: Date,
    membershipStatus: { type: String, default: "Not Applicable" },
    paymentScreenshot: { type: String, default: "" },
    pdfPath: { type: String, default: "" },
    pdfStatus: {
      type: String,
      enum: ["Not Generated", "Generating", "Generated", "Failed"],
      default: "Not Generated",
    },
    pdfError: { type: String, default: "" },
    pdfGeneratedAt: Date,
    generatedPlan: { type: String, default: "" },

    // Keeps the complete form information needed to generate the plan
    // after the admin verifies a manual payment.
    userData: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
