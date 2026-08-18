import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

/**
 * Send an email using the configured SMTP transport.
 * Fails silently (logs error) so the main flow is never blocked.
 */
export async function sendMail({ to, subject, html, text }) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Aritaro" <noreply@aritaro.com>',
      to,
      subject,
      text,
      html,
    });
  } catch (err) {
    console.error("[sendMail] Failed to send email:", err.message);
  }
}

/**
 * Build the branded HTML email for a new contact submission.
 */
export function buildContactEmailHtml({ name, email, company, phone, subject, message }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Contact Inquiry — Aritaro</title>
</head>
<body style="margin:0;padding:0;background:#090e17;font-family:'Segoe UI',Helvetica,Arial,sans-serif;color:#e2e8f0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#090e17;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#0f172a;border:1px solid #1e293b;border-radius:16px;overflow:hidden;max-width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1e3a5f,#0f2744);padding:32px 40px;border-bottom:1px solid #1e293b;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <span style="font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.5px;">ARITARO</span>
                  <span style="font-size:11px;color:#06B6D4;margin-left:10px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">Cybersecurity</span>
                </td>
                <td align="right">
                  <span style="background:#06B6D420;border:1px solid #06B6D440;color:#06B6D4;font-size:11px;font-weight:700;letter-spacing:1px;padding:4px 10px;border-radius:20px;text-transform:uppercase;">New Inquiry</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 40px;">
            <h2 style="margin:0 0 6px;font-size:20px;font-weight:700;color:#f1f5f9;">You have a new contact inquiry</h2>
            <p style="margin:0 0 28px;font-size:14px;color:#64748b;">Submitted via aritaro.com/contact</p>

            <!-- Info Grid -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              ${[
                ["Full Name", name],
                ["Email Address", `<a href="mailto:${email}" style="color:#3B82F6;text-decoration:none;">${email}</a>`],
                ["Company", company || "—"],
                ["Phone", phone || "—"],
              ]
                .map(
                  ([label, value]) => `
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #1e293b;width:40%;">
                  <span style="font-size:11px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:1px;">${label}</span>
                </td>
                <td style="padding:10px 0;border-bottom:1px solid #1e293b;">
                  <span style="font-size:14px;color:#e2e8f0;">${value}</span>
                </td>
              </tr>`
                )
                .join("")}
            </table>

            <!-- Subject -->
            <div style="background:#1e293b;border-radius:10px;padding:16px 20px;margin-bottom:20px;">
              <p style="margin:0 0 6px;font-size:11px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:1px;">Subject</p>
              <p style="margin:0;font-size:15px;color:#f1f5f9;font-weight:600;">${subject}</p>
            </div>

            <!-- Message -->
            <div style="background:#1e293b;border-radius:10px;padding:16px 20px;margin-bottom:28px;">
              <p style="margin:0 0 6px;font-size:11px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:1px;">Message</p>
              <p style="margin:0;font-size:14px;color:#e2e8f0;line-height:1.7;white-space:pre-wrap;">${message}</p>
            </div>

            <!-- CTA -->
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:linear-gradient(135deg,#3B82F6,#1D4ED8);border-radius:8px;">
                  <a href="mailto:${email}" style="display:inline-block;padding:12px 24px;color:#fff;font-size:14px;font-weight:600;text-decoration:none;">
                    Reply to ${name} →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#060a12;padding:20px 40px;border-top:1px solid #1e293b;">
            <p style="margin:0;font-size:12px;color:#475569;text-align:center;">
              Aritaro Cybersecurity Services • A-14, Sector 63, Noida, UP 201301, India<br/>
              This is an automated notification from your website contact form.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/**
 * Plain-text fallback for the contact email.
 */
export function buildContactEmailText({ name, email, company, phone, subject, message }) {
  return [
    "NEW CONTACT INQUIRY — ARITARO",
    "=".repeat(40),
    `Name:    ${name}`,
    `Email:   ${email}`,
    `Company: ${company || "—"}`,
    `Phone:   ${phone || "—"}`,
    "",
    `Subject: ${subject}`,
    "",
    "Message:",
    message,
    "",
    "=".repeat(40),
    "Aritaro Cybersecurity • aritaro.com",
  ].join("\n");
}
