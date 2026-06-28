import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderId: String,

    name: String,
    email: String,
    mobile: String,

    goal: String,

    weight: Number,
    targetWeight: Number,

    selectedPlan: String,
    selectedPrice: Number,

    status: {
      type: String,
      default: "Pending",
    },

    pdfSent: {
      type: Boolean,
      default: false,
    },

    dashboardAccess: {
      type: Boolean,
      default: false,
    },

    accessStartDate: Date,
    accessEndDate: Date,

    membershipStatus: {
      type: String,
      default: "Not Applicable",
    },

    paymentScreenshot: {
      type: String,
      default: "",
    },

    pdfPath: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", orderSchema);