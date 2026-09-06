import "dotenv/config";
import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;

if (!RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is missing");
}

const resend = new Resend(RESEND_API_KEY);

export const sendVerificationEmail = async (
  email: string,
  fullName: string,
  code: string
) => {
  try {
    console.log("=================================");
    console.log("📧 SENDING VERIFICATION EMAIL");
    console.log("📩 To:", email);
    console.log("👤 Name:", fullName);
    console.log("=================================");

    const { data, error } = await resend.emails.send({
      from: "AIBOS <onboarding@resend.dev>",
      to: [email],
      subject: `🔐 ${code} is your AIBOS Verification Code`,

      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >
  <title>AIBOS Verification</title>
</head>

<body style="
  margin:0;
  padding:40px 15px;
  background:#0b0f19;
  font-family:Arial,sans-serif;
">

  <div style="
    max-width:540px;
    margin:auto;
    background:#111827;
    border:1px solid #1e293b;
    border-radius:20px;
    padding:36px;
    color:#f8fafc;
  ">

    <h1 style="
      text-align:center;
      color:#38bdf8;
      margin-bottom:5px;
    ">
      AIBOS
    </h1>

    <p style="
      text-align:center;
      color:#94a3b8;
      font-size:13px;
      letter-spacing:1px;
    ">
      AI BUSINESS OPERATING SYSTEM
    </p>

    <h2 style="
      text-align:center;
      margin-top:35px;
      color:#f8fafc;
    ">
      Verify Your Account
    </h2>

    <p style="
      color:#cbd5e1;
      line-height:1.6;
    ">
      Hello <strong>${fullName}</strong>,
    </p>

    <p style="
      color:#cbd5e1;
      line-height:1.6;
    ">
      Welcome to AIBOS! Use the verification code below
      to complete your registration.
    </p>

    <div style="
      margin:30px 0;
      padding:25px;
      text-align:center;
      background:#1e293b;
      border:2px dashed #38bdf8;
      border-radius:16px;
    ">

      <div style="
        font-size:11px;
        font-weight:bold;
        letter-spacing:2px;
        color:#94a3b8;
      ">
        VERIFICATION CODE
      </div>

      <div style="
        margin-top:12px;
        font-size:38px;
        font-weight:bold;
        letter-spacing:10px;
        color:#38bdf8;
        font-family:'Courier New',monospace;
      ">
        ${code}
      </div>

    </div>

    <p style="
      text-align:center;
      color:#94a3b8;
      line-height:1.6;
    ">
      This code will expire in
      <strong style="color:#f59e0b;">
        10 minutes
      </strong>.
    </p>

    <p style="
      text-align:center;
      color:#64748b;
      font-size:12px;
      margin-top:30px;
    ">
      If you did not create an AIBOS account,
      please ignore this email.
    </p>

  </div>

</body>
</html>
      `,
    });

    if (error) {
      console.error("❌ RESEND ERROR:", error);
      throw new Error(error.message);
    }

    console.log("=================================");
    console.log("✅ EMAIL SENT SUCCESSFULLY");
    console.log("📩 To:", email);
    console.log("📧 Resend ID:", data?.id);
    console.log("=================================");

    return data;

  } catch (error) {
    console.error("=================================");
    console.error("❌ EMAIL SEND FAILED");
    console.error("=================================");
    console.error(error);
    console.error("=================================");

    throw error;
  }
};