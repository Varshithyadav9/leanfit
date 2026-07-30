import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: true, minlength: 2, maxlength: 80 },
  email: { type: String, unique: true, required: true, lowercase: true, trim: true, index: true },
  mobile: { type: String, unique: true, required: true, trim: true, index: true },
  password: { type: String, required: true, select: false },
  resetPasswordOtpHash: { type: String, select: false },
  resetPasswordOtpExpires: { type: Date, select: false },
  resetPasswordAttempts: { type: Number, default: 0, select: false },
}, { timestamps: true });

customerSchema.index({ email: 1 }, { unique: true });
customerSchema.index({ mobile: 1 }, { unique: true });
export default mongoose.model("Customer", customerSchema);
