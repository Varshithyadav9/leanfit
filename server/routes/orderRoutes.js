import express from "express";
import {
  getOrders,
  getCustomerOrders,
  updateOrderStatus,
  resendOrderEmail,
  downloadOrderPdf,
} from "../controllers/orderController.js";

const router = express.Router();

router.get("/orders", getOrders);
router.get("/customer/orders/:email", getCustomerOrders);
router.get("/orders/:orderId/pdf", downloadOrderPdf);
router.patch("/orders/:orderId/status", updateOrderStatus);
router.post("/orders/:orderId/resend-email", resendOrderEmail);

export default router;
