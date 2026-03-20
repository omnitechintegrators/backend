import nodemailer from "nodemailer";

const sendEmail = async (to, subject, html, attachmentPath = null) => {
  try {
    // ================= TRANSPORTER =================
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // IMPORTANT
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
    // ================= MAIL OPTIONS =================
    const mailOptions = {
      from: `"Humrahi Foundation" <${process.env.EMAIL_USER}>`,
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