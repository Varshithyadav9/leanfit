import express from "express";

import {
  registerCustomer,
  loginCustomer,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/customer/register", registerCustomer);
router.post("/customer/login", loginCustomer);

export default router;