import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is missing in the Render environment variables.");
  }

  return new Resend(apiKey);
}

export const sendOrderEmail = async (userData, orderId, pdfBuffer) => {
  const customerEmail = String(userData?.email || "").trim().toLowerCase();

  if (!customerEmail) {
    throw new Error("Customer email is missing.");
  }

  if (!pdfBuffer?.length) {
    throw new Error("The generated PDF is empty and cannot be emailed.");
  }

  const resend = getResendClient();
  const from = process.env.EMAIL_FROM?.trim() || "LeanFit <onboarding@resend.dev>";
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  const payload = {
    from,
    to: [customerEmail],
    subject: `Your LeanFit plan is ready - ${orderId}`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#172033">
        <h2 style="color:#147a40">Your LeanFit plan is ready</h2>
        <p>Hello ${userData.name || "Customer"},</p>
        <p>Your payment has been verified. Your personalised LeanFit plan is attached to this email.</p>
        <p><strong>Order ID:</strong> ${orderId}<br/>
        <strong>Plan:</strong> ${userData.selectedPlan}<br/>
        <strong>Amount:</strong> ₹${userData.selectedPrice}</p>
        <p>You can also download the PDF from your LeanFit Customer Portal.</p>
        <p>Regards,<br/><strong>LeanFit Team</strong></p>
      </div>
    `,
    attachments: [
      {
        filename: `${orderId}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  };

  if (adminEmail && adminEmail !== customerEmail) {
    payload.bcc = [adminEmail];
  }

  const result = await resend.emails.send(payload);

  // Resend may return an error object without rejecting the promise.
  if (result?.error) {
    throw new Error(result.error.message || "Resend rejected the email request.");
  }

  if (!result?.data?.id) {
    throw new Error("Email provider did not return a delivery request ID.");
  }

  return result.data;
};

export const sendPasswordResetOtp = async (customer, otp) => {
  const resend = getResendClient();
  const from = process.env.EMAIL_FROM?.trim() || "LeanFit <onboarding@resend.dev>";
  const result = await resend.emails.send({
    from,
    to: [customer.email],
    subject: "LeanFit password reset code",
    html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#172033"><h2 style="color:#147a40">Reset your LeanFit password</h2><p>Hello ${customer.name || "Customer"},</p><p>Your six-digit verification code is:</p><p style="font-size:28px;font-weight:700;letter-spacing:6px">${otp}</p><p>This code expires in 10 minutes. Do not share it with anyone.</p><p>If you did not request this, you can safely ignore this email.</p></div>`,
  });
  if (result?.error) throw new Error(result.error.message || "Email provider rejected the reset email.");
  if (!result?.data?.id) throw new Error("Email provider did not return a delivery request ID.");
  return result.data;
};
