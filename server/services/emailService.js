import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOrderEmail = async (
  userData,
  orderId,
  pdfBuffer,
  paymentScreenshot,
  port
) => {
  return await resend.emails.send({
    from: "LeanFit <onboarding@resend.dev>",
    to: process.env.ADMIN_EMAIL,
    subject: `New LeanFit Order - ${orderId}`,

    html: `
      <h2>New LeanFit Order</h2>

      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Name:</strong> ${userData.name}</p>
      <p><strong>Email:</strong> ${userData.email}</p>
      <p><strong>Mobile:</strong> ${userData.mobile}</p>
      <p><strong>Plan:</strong> ${userData.selectedPlan}</p>
      <p><strong>Amount:</strong> ₹${userData.selectedPrice}</p>
      <p><strong>Goal:</strong> ${userData.goal}</p>

      ${
        paymentScreenshot
          ? `<p><strong>Screenshot:</strong> http://127.0.0.1:${port}${paymentScreenshot}</p>`
          : ""
      }
    `,

    attachments: [
      {
        filename: `${orderId}.pdf`,
        content: pdfBuffer,
      },
    ],
  });
};