import "dotenv/config";
import nodemailer from "nodemailer";
import dns from "dns";

// Ensure Node.js resolves IPv4 addresses first to avoid Windows/ISP IPv6 ECONNREFUSED issues on Gmail SMTP
try {
  dns.setDefaultResultOrder("ipv4first");
} catch (e) {
  // Ignore if unsupported in older Node
}

const getTransporter = () => {
  const user = process.env.EMAIL_USER?.trim();
  const pass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, "") : "";

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Port 465 uses SSL direct
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
};

const getFallbackTransporter = () => {
  const user = process.env.EMAIL_USER?.trim();
  const pass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, "") : "";

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Port 587 uses STARTTLS
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
};

// Verify connection configuration on startup
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  const transporter = getTransporter();
  transporter.verify((error) => {
    if (error) {
      console.warn("⚠️ Primary Port 465 SMTP test warning, checking fallback 587:", error.message);
      const fallback = getFallbackTransporter();
      fallback.verify((fbErr) => {
        if (fbErr) {
          console.error("❌ Email Transporters Failed:", fbErr.message);
        } else {
          console.log("✅ Email Transporter Ready (SMTP Port 587 STARTTLS Connected)");
        }
      });
    } else {
      console.log("✅ Email Transporter Ready (SMTP Port 465 SSL Connected)");
    }
  });
} else {
  console.warn("⚠️ EMAIL_USER or EMAIL_PASS environment variables are not set. Emails will not send.");
}

export const sendVerificationEmail = async (
  email: string,
  fullName: string,
  code: string
) => {
  const mailOptions = {
    from: `"AIBOS Security" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `🔐 ${code} is your AIBOS Verification Code`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AIBOS Verification</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #0b0f19; padding: 40px 15px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" style="max-width: 540px; background: linear-gradient(180deg, #111827 0%, #0f172a 100%); border: 1px solid #1e293b; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px -15px rgba(0,0,0,0.7);" cellspacing="0" cellpadding="0" border="0">
                
                <!-- HEADER BANNER -->
                <tr>
                  <td style="padding: 36px 36px 20px 36px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.06);">
                    <div style="display: inline-flex; align-items: center; justify-content: center; gap: 8px;">
                      <span style="font-size: 26px; font-weight: 800; letter-spacing: -0.5px; background: linear-gradient(135deg, #38bdf8 0%, #818cf8 100%); -webkit-background-clip: text; color: #38bdf8;">
                        AIBOS
                      </span>
                    </div>
                    <div style="color: #94a3b8; font-size: 13px; margin-top: 4px; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 600;">
                      AI Business Operating System
                    </div>
                  </td>
                </tr>

                <!-- MAIN CONTENT -->
                <tr>
                  <td style="padding: 36px 36px 24px 36px;">
                    <h1 style="color: #f8fafc; font-size: 22px; font-weight: 700; margin: 0 0 14px 0; text-align: center;">
                      Verify Your Account
                    </h1>
                    <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0; text-align: center;">
                      Hello <strong style="color: #38bdf8;">${fullName}</strong>, welcome to AIBOS! Use the 6-digit confirmation code below to complete your registration.
                    </p>

                    <!-- CODE BOX -->
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 28px 0;">
                      <tr>
                        <td align="center">
                          <div style="display: inline-block; background: #1e293b; border: 2px dashed #38bdf8; border-radius: 16px; padding: 22px 36px; text-align: center;">
                            <div style="font-size: 11px; font-weight: 700; letter-spacing: 2px; color: #94a3b8; text-transform: uppercase; margin-bottom: 8px;">
                              Verification Code
                            </div>
                            <div style="font-size: 38px; font-weight: 800; letter-spacing: 12px; color: #38bdf8; font-family: 'Courier New', Courier, monospace; margin-left: 12px;">
                              ${code}
                            </div>
                          </div>
                        </td>
                      </tr>
                    </table>

                    <p style="color: #94a3b8; font-size: 13px; line-height: 1.6; text-align: center; margin: 20px 0 0 0;">
                      ⏱ This code will expire in <strong style="color: #f59e0b;">10 minutes</strong>.<br/>
                      Do not share this code with anyone.
                    </p>
                  </td>
                </tr>

                <!-- FOOTER -->
                <tr>
                  <td style="padding: 24px 36px; background-color: #090d16; border-top: 1px solid rgba(255,255,255,0.06); text-align: center;">
                    <p style="color: #64748b; font-size: 12px; margin: 0; line-height: 1.5;">
                      If you did not request this verification email, please safely ignore it.<br/>
                      &copy; 2026 AIBOS Network Inc. All rights reserved.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };

  try {
    const primaryTransporter = getTransporter();
    const info = await primaryTransporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to ${email} (MsgID: ${info.messageId})`);
    return info;
  } catch (primaryErr: any) {
    console.warn("⚠️ Primary Port 465 send failed, attempting fallback Port 587...", primaryErr?.message);
    const fallbackTransporter = getFallbackTransporter();
    const info = await fallbackTransporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent via fallback 587 to ${email} (MsgID: ${info.messageId})`);
    return info;
  }
};