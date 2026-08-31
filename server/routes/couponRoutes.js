import express from "express";
import { validateCoupon } from "../controllers/couponController.js";
import adminAuthMiddleware from "../middleware/adminAuthMiddleware.js";
import { createCoupon, deleteCoupon, listCoupons, toggleCoupon, updateCoupon } from "../controllers/couponAdminController.js";

const router = express.Router();
router.post("/coupons/validate", validateCoupon);
router.get("/coupons", adminAuthMiddleware, listCoupons);
router.post("/coupons", adminAuthMiddleware, createCoupon);
router.put("/coupons/:id", adminAuthMiddleware, updateCoupon);
router.patch("/coupons/:id/toggle", adminAuthMiddleware, toggleCoupon);
router.delete("/coupons/:id", adminAuthMiddleware, deleteCoupon);
export default router;
