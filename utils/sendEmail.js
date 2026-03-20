import nodemailer from "nodemailer";

const sendEmail = async (to, subject, html, attachmentPath = null) => {
  try {
    // ================= TRANSPORTER =================
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS,
  },
});

const mailOptions = {
  from: `"Humrahi Foundation" <freefirelogin009@gmail.com>`, // VERIFIED EMAIL
  to,
  subject,
  html,
};
    // ================= ATTACHMENT (OPTIONAL) =================
    if (attachmentPath) {
      mailOptions.attachments = [
        {
          filename: "certificate.pdf",
          path: attachmentPath,
        },
      ];
    }

    // ================= SEND EMAIL =================
    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully to:", to);
    console.log("📨 Message ID:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };

  } catch (error) {
    console.error("❌ Email sending failed:");
    console.error(error);

    return {
      success: false,
      error: error.message,
    };
  }
};

export default sendEmail;