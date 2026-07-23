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