import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Customer from "../models/Customer.js";
import { sendPasswordResetOtp } from "../services/emailService.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const normalizeEmail = (value) => String(value || "").trim().toLowerCase();
const normalizeMobile = (value) => String(value || "").replace(/\D/g, "");
const strongPassword = (value) => typeof value === "string" && value.length >= 8 && /[A-Za-z]/.test(value) && /\d/.test(value);
const publicCustomer = (customer) => ({ id: customer._id, name: customer.name, email: customer.email, mobile: customer.mobile });
const signToken = (customer) => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is missing in the server environment.");
  return jwt.sign({ id: customer._id, email: customer.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const registerCustomer = async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = normalizeEmail(req.body.email);
    const mobile = normalizeMobile(req.body.mobile);
    const password = req.body.password;
    if (name.length < 2) return res.status(400).json({ success: false, message: "Enter your full name." });
    if (!EMAIL_RE.test(email)) return res.status(400).json({ success: false, message: "Enter a valid email address." });
    if (mobile.length !== 10) return res.status(400).json({ success: false, message: "Enter a valid 10-digit mobile number." });
    if (!strongPassword(password)) return res.status(400).json({ success: false, message: "Password must be at least 8 characters and include a letter and number." });

    const duplicate = await Customer.findOne({ $or: [{ email }, { mobile }] }).lean();
    if (duplicate) {
      const field = duplicate.email === email ? "email address" : "mobile number";
      return res.status(409).json({ success: false, message: `An account already exists with this ${field}.` });
    }
    const customer = await Customer.create({ name, email, mobile, password: await bcrypt.hash(password, 12) });
    return res.status(201).json({ success: true, token: signToken(customer), customer: publicCustomer(customer) });
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ success: false, message: "Email address or mobile number is already registered." });
    return res.status(500).json({ success: false, message: error.message || "Registration failed." });
  }
};

export const loginCustomer = async (req, res) => {
  try {
    const loginValue = String(req.body.identifier || req.body.email || "").trim();
    const password = req.body.password;
    if (!loginValue || !password) return res.status(400).json({ success: false, message: "Email/mobile number and password are required." });
    const email = normalizeEmail(loginValue);
    const mobile = normalizeMobile(loginValue);
    const customer = await Customer.findOne({ $or: [{ email }, ...(mobile.length === 10 ? [{ mobile }] : [])] }).select("+password");
    if (!customer || !(await bcrypt.compare(password, customer.password))) return res.status(401).json({ success: false, message: "Invalid email/mobile number or password." });
    return res.json({ success: true, token: signToken(customer), customer: publicCustomer(customer) });
  } catch (error) { return res.status(500).json({ success: false, message: error.message || "Login failed." }); }
};

export const requestPasswordReset = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    if (!EMAIL_RE.test(email)) return res.status(400).json({ success: false, message: "Enter a valid email address." });
    const customer = await Customer.findOne({ email }).select("+resetPasswordOtpHash +resetPasswordOtpExpires +resetPasswordAttempts");
    const generic = "If this email is registered, a verification code has been sent.";
    if (!customer) return res.json({ success: true, message: generic });
    const otp = String(crypto.randomInt(100000, 1000000));
    customer.resetPasswordOtpHash = crypto.createHash("sha256").update(otp).digest("hex");
    customer.resetPasswordOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
    customer.resetPasswordAttempts = 0;
    await customer.save();
    await sendPasswordResetOtp(customer, otp);
    return res.json({ success: true, message: generic });
  } catch (error) { return res.status(500).json({ success: false, message: error.message || "Could not send the verification code." }); }
};

export const resetCustomerPassword = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const otp = String(req.body.otp || "").trim();
    const password = req.body.password;
    if (!EMAIL_RE.test(email) || !/^\d{6}$/.test(otp)) return res.status(400).json({ success: false, message: "Enter a valid email and six-digit code." });
    if (!strongPassword(password)) return res.status(400).json({ success: false, message: "Password must be at least 8 characters and include a letter and number." });
    const customer = await Customer.findOne({ email }).select("+password +resetPasswordOtpHash +resetPasswordOtpExpires +resetPasswordAttempts");
    if (!customer?.resetPasswordOtpHash || !customer.resetPasswordOtpExpires) return res.status(400).json({ success: false, message: "Request a new verification code." });
    if (customer.resetPasswordAttempts >= 5) return res.status(429).json({ success: false, message: "Too many incorrect attempts. Request a new code." });
    if (customer.resetPasswordOtpExpires.getTime() < Date.now()) return res.status(400).json({ success: false, message: "Verification code expired. Request a new code." });
    const hash = crypto.createHash("sha256").update(otp).digest("hex");
    if (!crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(customer.resetPasswordOtpHash))) {
      customer.resetPasswordAttempts += 1; await customer.save();
      return res.status(400).json({ success: false, message: "Incorrect verification code." });
    }
    customer.password = await bcrypt.hash(password, 12);
    customer.resetPasswordOtpHash = undefined; customer.resetPasswordOtpExpires = undefined; customer.resetPasswordAttempts = 0;
    await customer.save();
    return res.json({ success: true, message: "Password reset successfully. You can now log in." });
  } catch (error) { return res.status(500).json({ success: false, message: error.message || "Password reset failed." }); }
};

export const updateCustomerProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.customerAuth.id);
    if (!customer) return res.status(404).json({ success: false, message: "Customer not found." });
    const name = String(req.body.name || "").trim(), email = normalizeEmail(req.body.email), mobile = normalizeMobile(req.body.mobile);
    if (name.length < 2 || !EMAIL_RE.test(email) || mobile.length !== 10) return res.status(400).json({ success: false, message: "Enter valid profile details." });
    const duplicate = await Customer.findOne({ _id: { $ne: customer._id }, $or: [{ email }, { mobile }] }).lean();
    if (duplicate) return res.status(409).json({ success: false, message: "Email address or mobile number is already in use." });
    customer.name = name; customer.email = email; customer.mobile = mobile; await customer.save();
    return res.json({ success: true, customer: publicCustomer(customer) });
  } catch (error) { return res.status(500).json({ success: false, message: error.message || "Profile update failed." }); }
};

export const changeCustomerPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !strongPassword(newPassword)) return res.status(400).json({ success: false, message: "New password must be at least 8 characters and include a letter and number." });
    const customer = await Customer.findById(req.customerAuth.id).select("+password");
    if (!customer) return res.status(404).json({ success: false, message: "Customer not found." });
    if (!(await bcrypt.compare(currentPassword, customer.password))) return res.status(400).json({ success: false, message: "Current password is incorrect." });
    customer.password = await bcrypt.hash(newPassword, 12); await customer.save();
    return res.json({ success: true, message: "Password changed successfully." });
  } catch (error) { return res.status(500).json({ success: false, message: error.message || "Password update failed." }); }
};
