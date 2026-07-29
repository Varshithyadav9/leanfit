import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Customer from "../models/Customer.js";

export const registerCustomer = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const normalizedMobile = String(mobile || "").replace(/\D/g, "");

    if (!name || !normalizedEmail || !normalizedMobile || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingCustomer = await Customer.findOne({
      $or: [{ email: normalizedEmail }, { mobile: normalizedMobile }],
    });

    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: "Customer already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const customer = await Customer.create({
      name,
      email: normalizedEmail,
      mobile: normalizedMobile,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: customer._id, email: customer.email },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      success: true,
      token,
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        mobile: customer.mobile,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Registration failed",
    });
  }
};

export const loginCustomer = async (req, res) => {
  try {
    const { identifier, email, password } = req.body;
    const loginValue = String(identifier || email || "").trim();
    const normalizedEmail = loginValue.toLowerCase();
    const normalizedMobile = loginValue.replace(/\D/g, "");

    if (!loginValue || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/mobile number and password are required",
      });
    }

    const customer = await Customer.findOne({
      $or: [
        { email: normalizedEmail },
        ...(normalizedMobile ? [{ mobile: normalizedMobile }] : []),
      ],
    });

    if (!customer) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, customer.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: customer._id, email: customer.email },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      success: true,
      token,
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        mobile: customer.mobile,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
};

export const updateCustomerProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.customerAuth.id);
    if (!customer) return res.status(404).json({ success: false, message: "Customer not found" });
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const mobile = String(req.body.mobile || "").replace(/\D/g, "");
    if (!name || !email || mobile.length !== 10) return res.status(400).json({ success: false, message: "Enter valid profile details" });
    const duplicate = await Customer.findOne({ _id: { $ne: customer._id }, $or: [{ email }, { mobile }] });
    if (duplicate) return res.status(400).json({ success: false, message: "Email or mobile number is already in use" });
    customer.name=name; customer.email=email; customer.mobile=mobile; await customer.save();
    res.json({ success:true, customer:{ id:customer._id,name:customer.name,email:customer.email,mobile:customer.mobile } });
  } catch (error) { res.status(500).json({ success:false,message:error.message||"Profile update failed" }); }
};

export const changeCustomerPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 6) return res.status(400).json({ success:false,message:"Enter your current password and a valid new password" });
    const customer=await Customer.findById(req.customerAuth.id);
    if(!customer)return res.status(404).json({success:false,message:"Customer not found"});
    const matches=await bcrypt.compare(currentPassword,customer.password);
    if(!matches)return res.status(400).json({success:false,message:"Current password is incorrect"});
    customer.password=await bcrypt.hash(newPassword,10); await customer.save();
    res.json({success:true,message:"Password changed successfully"});
  } catch(error){res.status(500).json({success:false,message:error.message||"Password update failed"});}
};
