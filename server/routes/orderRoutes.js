import express from "express";

import {
  getOrders,
  getCustomerOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

const router = express.Router();

router.get("/orders", getOrders);

router.get(
  "/customer/orders/:email",
  getCustomerOrders
);

router.patch(
  "/orders/:orderId/status",
  updateOrderStatus
);

export default router;