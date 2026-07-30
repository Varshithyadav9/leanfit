import express from "express";
import {
  submitFeedback,
  getCustomerFeedback,
  getAllFeedback,
  updateFeedbackApproval,
  getPublicFeedback,
} from "../controllers/feedbackController.js";

const router = express.Router();

router.get("/feedback/public", getPublicFeedback);
router.post("/feedback", submitFeedback);
router.get("/feedback/customer/:email", getCustomerFeedback);
router.get("/feedback", getAllFeedback);
router.patch("/feedback/:id/approval", updateFeedbackApproval);

export default router;
