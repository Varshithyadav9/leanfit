import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  registerCustomer,
  loginCustomer,
  updateCustomerProfile,
  changeCustomerPassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/customer/register", registerCustomer);
router.post("/customer/login", loginCustomer);
router.patch("/customer/profile", authMiddleware, updateCustomerProfile);
router.patch("/customer/password", authMiddleware, changeCustomerPassword);

export default router;