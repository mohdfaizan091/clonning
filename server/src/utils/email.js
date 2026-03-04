import { Resend } from "resend";
import logger from "./logger.js";

// ← Lazy initialize — import hote waqt nahi, use hote waqt banao
let resendClient = null;

const getResend = () => {
    console.log("RESEND KEY:", process.env.RESEND_API_KEY); 
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
};

export const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  try {
    await getResend().emails.send({
      from: process.env.FROM_EMAIL,
      to: email,
      subject: "Password Reset Request — CareerTrack",
      html: `
        <div style="font-family: monospace; max-width: 480px; margin: 0 auto; padding: 32px; background: #13131a; color: #e8e8f0; border-radius: 12px;">
          <h2 style="color: #5b9cf6; margin-bottom: 16px;">Password Reset</h2>
          <p style="color: #9090a8; margin-bottom: 24px;">
            You requested a password reset. Click the button below to set a new password.
            This link expires in <strong style="color: #e8e8f0;">1 hour</strong>.
          </p>
          <a href="${resetUrl}" 
             style="display: inline-block; background: #5b9cf6; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500;">
            Reset Password
          </a>
          <p style="color: #5a5a72; font-size: 12px; margin-top: 24px;">
            If you did not request this, ignore this email. Your password will not change.
          </p>
        </div>
      `,
    });

    logger.info(`Password reset email sent to ${email}`);
  } catch (err) {
    logger.error(`Failed to send email: ${err.message}`);
    throw new Error("Email could not be sent");
  }
};