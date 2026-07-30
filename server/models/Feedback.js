import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true, trim: true, index: true },
    customerName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, index: true },
    selectedPlan: { type: String, default: "" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    subject: { type: String, trim: true, maxlength: 100, default: "" },
    comment: { type: String, required: true, trim: true, maxlength: 1000 },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);
