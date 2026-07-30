import Feedback from "../models/Feedback.js";
import Order from "../models/Order.js";

export async function submitFeedback(req, res) {
  try {
    const { orderId, email, rating, subject = "", comment } = req.body;
    const numericRating = Number(rating);

    if (!orderId || !email || !comment?.trim()) {
      return res.status(400).json({ success: false, message: "Order, email and feedback are required." });
    }

    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ success: false, message: "Please select a rating from 1 to 5." });
    }

    const order = await Order.findOne({
      orderId: String(orderId).trim(),
      email: String(email).trim().toLowerCase(),
    });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found for this account." });
    }

    if (order.status !== "Delivered") {
      return res.status(403).json({ success: false, message: "Feedback is available after the plan is delivered." });
    }

    const existing = await Feedback.findOne({ orderId: order.orderId });
    if (existing) {
      return res.status(409).json({ success: false, message: "Feedback has already been submitted for this order." });
    }

    const feedback = await Feedback.create({
      orderId: order.orderId,
      customerName: order.name || "Customer",
      email: order.email,
      selectedPlan: order.selectedPlan || "",
      rating: numericRating,
      subject: String(subject).trim(),
      comment: String(comment).trim(),
    });

    return res.status(201).json({ success: true, message: "Thank you. Your feedback has been submitted.", feedback });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ success: false, message: "Feedback has already been submitted for this order." });
    }
    console.error("submitFeedback error:", error);
    return res.status(500).json({ success: false, message: "Unable to submit feedback." });
  }
}

export async function getCustomerFeedback(req, res) {
  try {
    const email = String(req.params.email || "").trim().toLowerCase();
    const feedback = await Feedback.find({ email }).sort({ createdAt: -1 });
    return res.json({ success: true, feedback });
  } catch (error) {
    console.error("getCustomerFeedback error:", error);
    return res.status(500).json({ success: false, message: "Unable to load feedback." });
  }
}

export async function getAllFeedback(req, res) {
  try {
    const feedback = await Feedback.find({}).sort({ createdAt: -1 });
    return res.json({ success: true, feedback });
  } catch (error) {
    console.error("getAllFeedback error:", error);
    return res.status(500).json({ success: false, message: "Unable to load feedback." });
  }
}

export async function updateFeedbackApproval(req, res) {
  try {
    const { approved } = req.body;
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { approved: Boolean(approved) },
      { new: true }
    );

    if (!feedback) {
      return res.status(404).json({ success: false, message: "Feedback not found." });
    }

    return res.json({ success: true, message: approved ? "Feedback approved." : "Feedback hidden.", feedback });
  } catch (error) {
    console.error("updateFeedbackApproval error:", error);
    return res.status(500).json({ success: false, message: "Unable to update feedback." });
  }
}


export async function getPublicFeedback(req, res) {
  try {
    const feedback = await Feedback.find({ approved: true })
      .select("customerName selectedPlan rating subject comment createdAt")
      .sort({ createdAt: -1 })
      .limit(12);
    return res.json({ success: true, feedback });
  } catch (error) {
    console.error("getPublicFeedback error:", error);
    return res.status(500).json({ success: false, message: "Unable to load testimonials." });
  }
}
