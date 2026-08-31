import { useMemo, useState } from "react";
import HelpButton from "./HelpButton";

const API_BASE_URL = `${(
  import.meta.env.VITE_API_URL || "https://leanfit.onrender.com"
).replace(/\/$/, "")}/api`;
const UPI_ID = "varshith0409@axl";

function PaymentPage({ formData, setPage, setSubmittedOrder }) {
  const renewalData = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("leanfitRenewalPlan") || "null");
    } catch {
      return null;
    }
  }, []);

  const paymentData =
    renewalData?.selectedPlan === "Lean Pro Renewal"
      ? { ...formData, ...renewalData }
      : formData;

  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const selectedPlan = paymentData.selectedPlan || "No plan selected";
  const originalPrice = Number(paymentData.selectedPrice || 0);
  const finalPrice = Number(appliedCoupon?.finalAmount ?? originalPrice);
  const discountAmount = Number(appliedCoupon?.discountAmount || 0);
  const isRenewal = selectedPlan === "Lean Pro Renewal";

  const upiLink = useMemo(() => {
    const params = new URLSearchParams({
      pa: UPI_ID,
      pn: "LeanFit",
      am: String(finalPrice || 0),
      cu: "INR",
      tn: appliedCoupon?.code
        ? `${selectedPlan} - Coupon ${appliedCoupon.code}`
        : selectedPlan,
    });

    return `upi://pay?${params.toString()}`;
  }, [selectedPlan, finalPrice, appliedCoupon]);

  const applyCoupon = async () => {
    const code = couponInput.trim().toUpperCase();
    setCouponError("");
    setError("");

    if (!code) {
      setCouponError("Enter a coupon code.");
      return;
    }

    if (!paymentData.selectedPlan || originalPrice <= 0) {
      setCouponError("Please select a plan first.");
      return;
    }

    setCouponLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/coupons/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          selectedPlan,
          email: paymentData.email || "",
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to apply coupon.");
      }

      setAppliedCoupon({
        code: data.coupon.code,
        discountType: data.coupon.discountType,
        discountValue: data.coupon.discountValue,
        originalAmount: Number(data.originalAmount || originalPrice),
        discountAmount: Number(data.discountAmount || 0),
        finalAmount: Number(data.finalAmount || 0),
      });
      setCouponInput(data.coupon.code);
    } catch (couponApplyError) {
      setAppliedCoupon(null);
      setCouponError(couponApplyError.message || "Unable to apply coupon.");
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError("");
  };

  const handleScreenshotChange = (event) => {
    const file = event.target.files?.[0];
    setError("");

    if (!file) {
      setPaymentScreenshot(null);
      setPreviewUrl("");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setPaymentScreenshot(null);
      setPreviewUrl("");
      setError("Please upload a JPG, PNG or WEBP payment screenshot.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPaymentScreenshot(null);
      setPreviewUrl("");
      setError("Payment screenshot must be smaller than 5 MB.");
      return;
    }

    setPaymentScreenshot(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const submitPayment = async () => {
    if (!paymentData.selectedPlan || finalPrice <= 0) {
      setError("Please select a plan first.");
      return;
    }

    if (!paymentData.name || !paymentData.email) {
      setError("Name and email are required.");
      return;
    }

    if (!paymentScreenshot) {
      setError("Please upload your payment screenshot.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const payload = new FormData();
      payload.append("paymentScreenshot", paymentScreenshot);
      payload.append(
        "userData",
        JSON.stringify({
          ...paymentData,
          couponCode: appliedCoupon?.code || "",
        })
      );

      const response = await fetch(`${API_BASE_URL}/manual-payment/submit`, {
        method: "POST",
        body: payload,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to submit payment.");
      }

      const orderDetails = {
        orderId: data.orderId,
        status: data.status || "Pending",
        name: paymentData.name,
        email: paymentData.email,
        mobile: paymentData.mobile || "",
        selectedPlan,
        selectedPrice: Number(data.finalAmount ?? finalPrice),
        originalPrice: Number(data.originalAmount ?? originalPrice),
        discountAmount: Number(data.discountAmount ?? discountAmount),
        couponCode: data.couponCode || appliedCoupon?.code || "",
        submittedAt: new Date().toISOString(),
      };

      localStorage.setItem("leanfitLastSubmittedOrder", JSON.stringify(orderDetails));
      localStorage.removeItem("leanfitRenewalPlan");
      localStorage.removeItem("leanfitSelectedPlan");
      setSubmittedOrder?.(orderDetails);
      setPage("success");
    } catch (submitError) {
      setError(
        submitError.message ||
          "Unable to submit payment. Please check your internet and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page">
      <section className="card" style={{ position: "relative" }}>
        <div style={{ position: "absolute", top: "18px", right: "18px", zIndex: 2 }}>
          <HelpButton variant="default" />
        </div>
        <p className="brand-label">UPI PAYMENT</p>
        <h2>{isRenewal ? "Renew Lean Pro Membership" : "Complete Your Order"}</h2>
        <p className="muted">
          {isRenewal
            ? "Pay ₹99 to renew Lean Pro for another 90 days, then upload the payment screenshot for admin verification."
            : "Pay using PhonePe, Google Pay, Paytm or any UPI app, then upload the payment screenshot for verification."}
        </p>

        <div className="selected-plan-box">
          <p>Selected Plan</p>
          <h3>{selectedPlan}</h3>
          {appliedCoupon ? (
            <div className="coupon-price-stack">
              <span className="coupon-original-price">₹{originalPrice.toFixed(2)}</span>
              <strong>₹{finalPrice.toFixed(2)}</strong>
            </div>
          ) : (
            <strong>₹{originalPrice}</strong>
          )}
        </div>

        <div className="summary-box coupon-box">
          <h3>Have a Coupon?</h3>
          <p className="muted">Enter your coupon code before making the UPI payment.</p>

          <div className="coupon-input-row">
            <input
              type="text"
              value={couponInput}
              onChange={(event) => {
                setCouponInput(event.target.value.toUpperCase());
                if (appliedCoupon) setAppliedCoupon(null);
                setCouponError("");
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  applyCoupon();
                }
              }}
              placeholder="Enter coupon code"
              maxLength={30}
              disabled={couponLoading || submitting}
            />
            <button
              className="secondary-btn coupon-apply-btn"
              type="button"
              onClick={appliedCoupon ? removeCoupon : applyCoupon}
              disabled={couponLoading || submitting}
            >
              {couponLoading ? "Checking..." : appliedCoupon ? "Remove" : "Apply Coupon"}
            </button>
          </div>

          {appliedCoupon && (
            <div className="coupon-success">
              <strong>✓ {appliedCoupon.code} applied</strong>
              <span>You save ₹{discountAmount.toFixed(2)}</span>
            </div>
          )}

          {couponError && <p className="coupon-error">{couponError}</p>}
        </div>

        <div className="summary-box">
          <h3>Order Summary</h3>
          <p><strong>Name:</strong> {paymentData.name || "Not specified"}</p>
          <p><strong>Email:</strong> {paymentData.email || "Not specified"}</p>
          <p><strong>Plan:</strong> {selectedPlan}</p>
          <div className="price-breakdown">
            <p><span>Plan Price</span><strong>₹{originalPrice.toFixed(2)}</strong></p>
            {appliedCoupon && (
              <>
                <p className="discount-line"><span>Coupon ({appliedCoupon.code})</span><strong>- ₹{discountAmount.toFixed(2)}</strong></p>
                <p className="final-price-line"><span>Final Payable Amount</span><strong>₹{finalPrice.toFixed(2)}</strong></p>
              </>
            )}
          </div>
        </div>

        <div className="summary-box">
          <h3>Pay by UPI</h3>
          <p><strong>UPI ID:</strong> {UPI_ID}</p>
          <p><strong>Amount:</strong> ₹{finalPrice.toFixed(2)}</p>

          <a
            className="primary-btn full-btn"
            href={upiLink}
            aria-disabled={finalPrice <= 0}
            onClick={(event) => {
              if (finalPrice <= 0) {
                event.preventDefault();
                setError("Please select a plan first.");
              }
            }}
          >
            Open UPI App and Pay ₹{finalPrice.toFixed(2)}
          </a>
        </div>

        <div className="summary-box">
          <h3>Upload Payment Screenshot</h3>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleScreenshotChange}
            disabled={submitting}
          />

          {previewUrl && (
            <img
              src={previewUrl}
              alt="Payment screenshot preview"
              style={{
                width: "100%",
                maxHeight: "320px",
                objectFit: "contain",
                marginTop: "16px",
                borderRadius: "12px",
                border: "1px solid #d1d5db",
              }}
            />
          )}
        </div>

        <button
          className="primary-btn full-btn"
          type="button"
          onClick={submitPayment}
          disabled={submitting || finalPrice <= 0}
        >
          {submitting ? "Submitting Payment..." : "I Have Completed Payment"}
        </button>

        {error && <p className="error-text">{error}</p>}

        <div className="page-actions">
          <button
            className="text-btn"
            type="button"
            onClick={() => setPage(isRenewal ? "customer-portal" : "plans")}
            disabled={submitting}
          >
            {isRenewal ? "Back to My Orders" : "Previous"}
          </button>
        </div>
      </section>
    </main>
  );
}

export default PaymentPage;
