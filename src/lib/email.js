import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: Number(process.env.SMTP_PORT) || 587,
	secure: false,
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASSWORD,
	},
});

export async function sendEmail({ to, subject, html }) {
	if (!process.env.SMTP_USER) {
		console.log(`[Email Mock] To: ${to}, Subject: ${subject}`);
		return { success: true, mock: true };
	}

	await transporter.sendMail({
		from: process.env.SMTP_FROM || "CipherShield <noreply@ciphershield.com>",
		to,
		subject,
		html,
	});

	return { success: true };
}

export function verificationEmailHtml(name, token) {
	const url = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;
	return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #06b6d4;">Verify Your Email — CipherShield</h2>
      <p>Hi ${name},</p>
      <p>Please verify your email address to activate your CipherShield account.</p>
      <a href="${url}" style="display: inline-block; background: #06b6d4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">Verify Email</a>
      <p style="color: #666; font-size: 14px;">This link expires in 24 hours.</p>
    </div>
  `;
}

export function resetPasswordEmailHtml(name, token) {
	const url = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
	return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #06b6d4;">Reset Your Password — CipherShield</h2>
      <p>Hi ${name},</p>
      <p>We received a request to reset your password. Click below to proceed.</p>
      <a href="${url}" style="display: inline-block; background: #06b6d4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">Reset Password</a>
      <p style="color: #666; font-size: 14px;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
    </div>
  `;
}

export function quoteConfirmationEmailHtml(name, quoteId, items, totalPrice) {
	const itemsHtml = items
		.map(
			(item) => `
		<li style="margin-bottom: 8px;">
			<strong>${item.title}</strong> — ${item.months} ${item.months === 1 ? "month" : "months"} coverage (estimated: ₹${item.totalCost.toLocaleString("en-IN")})
		</li>
	`,
		)
		.join("");

	return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.6;">
      <h2 style="color: #6366f1; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Quote Request Confirmed</h2>
      <p>Hi ${name},</p>
      <p>Thank you for submitting your custom quote request with CipherShield (Quote ID: <strong>${quoteId}</strong>). Someone from our security team will contact you via email soon to discuss your requirements and customize your coverage details.</p>
      
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin: 20px 0;">
        <h4 style="margin-top: 0; color: #475569; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">Requested Coverage Summary</h4>
        <ul style="padding-left: 20px; margin-bottom: 15px;">
          ${itemsHtml}
        </ul>
        <div style="font-size: 15px; font-weight: 700; color: #1e293b;">
          Estimated Total Cost: ₹${totalPrice.toLocaleString("en-IN")}
        </div>
      </div>
      
      <p style="color: #64748b; font-size: 13px;">If you have any immediate questions, feel free to reply directly to this email.</p>
      <p style="margin-top: 24px; font-size: 14px; font-weight: 600; color: #475569;">Best regards,<br/>The CipherShield Team</p>
    </div>
  `;
}

export function reportUploadEmailHtml(name, message, reportUrl) {
	return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.6;">
      <h2 style="color: #6366f1; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Security Assessment Report Available</h2>
      <p>Hi ${name},</p>
      <p>We are pleased to inform you that a new security assessment report has been generated and uploaded to your Aritaro/CipherShield workspace.</p>
      
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin: 20px 0;">
        <h4 style="margin-top: 0; color: #475569; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">Message from Security Auditor</h4>
        <p style="white-space: pre-line; font-style: italic; color: #334155; margin: 0;">${message}</p>
      </div>

      <div style="text-align: center; margin: 28px 0;">
        <a href="${reportUrl}" style="display: inline-block; background: #6366f1; color: white; padding: 12px 26px; text-decoration: none; border-radius: 8px; font-weight: 700; box-shadow: 0 4px 12px rgba(99,102,241,0.3);">Download Security Report</a>
      </div>
      
      <p style="color: #64748b; font-size: 13px;">If you have any questions or require support on remediating these findings, please feel free to reply directly to this email.</p>
      <p style="margin-top: 24px; font-size: 14px; font-weight: 600; color: #475569;">Best regards,<br/>The CipherShield Security Team</p>
    </div>
  `;
}
