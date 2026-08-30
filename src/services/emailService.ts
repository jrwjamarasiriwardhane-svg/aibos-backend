import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, "") : "",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendVerificationEmail = async (
  email: string,
  fullName: string,
  code: string
) => {
  await transporter.sendMail({
    from: `"AIBOS" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "AIBOS - Email Verification Code",

    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: 30px auto;
        padding: 30px;
        border: 1px solid #e5e7eb;
        border-radius: 14px;
        background: #ffffff;
      ">

        <h2 style="
          color: #2563eb;
          margin-bottom: 10px;
        ">
          Welcome to AIBOS
        </h2>

        <p>
          Hello <strong>${fullName}</strong>,
        </p>

        <p>
          Thank you for creating your AIBOS account.
          Please verify your email address using the
          verification code below.
        </p>

        <div style="
          margin: 25px 0;
          padding: 20px;
          background: #eff6ff;
          border-radius: 10px;
          text-align: center;
        ">

          <div style="
            font-size: 12px;
            color: #64748b;
            margin-bottom: 8px;
          ">
            YOUR VERIFICATION CODE
          </div>

          <div style="
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #1d4ed8;
          ">
            ${code}
          </div>

        </div>

        <p>
          This code will expire in
          <strong>10 minutes</strong>.
        </p>

        <p style="color: #64748b;">
          If you did not create an AIBOS account,
          please ignore this email.
        </p>

        <hr style="
          border: none;
          border-top: 1px solid #e5e7eb;
          margin: 25px 0;
        " />

        <p style="
          font-size: 12px;
          color: #94a3b8;
        ">
          AIBOS — AI Business Operating System
        </p>

      </div>
    `,
  });
};