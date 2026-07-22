import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is missing.");
  }
  return new Resend(process.env.RESEND_API_KEY);
}

export const sendOrderEmail = async (
  userData,
  orderId,
  pdfBuffer,
  paymentScreenshot,
  port
) => {
  if (!userData?.email) {
    throw new Error("Customer email is missing.");
  }

  const resend = getResendClient();
  const from = process.env.EMAIL_FROM || "LeanFit <onboarding@resend.dev>";
  const adminEmail = process.env.ADMIN_EMAIL?.trim();

  const payload = {
    from,
    to: [String(userData.email).trim()],
    subject: `Your LeanFit Plan - ${orderId}`,
    html: `
      <h2>Your LeanFit plan is ready</h2>
      <p>Hello ${userData.name || "Customer"},</p>
      <p>Thank you for your payment. Your personalised plan is attached.</p>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Plan:</strong> ${userData.selectedPlan}</p>
      <p><strong>Amount:</strong> ₹${userData.selectedPrice}</p>
      <p>Regards,<br/>LeanFit</p>
    `,
    attachments: [
      {
        filename: `${orderId}.pdf`,
        content: pdfBuffer,
      },
    ],
  };

  if (adminEmail && adminEmail.toLowerCase() !== String(userData.email).toLowerCase()) {
    payload.bcc = [adminEmail];
  }

  return resend.emails.send(payload);
};
