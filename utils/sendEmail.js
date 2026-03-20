import nodemailer from "nodemailer";

const sendEmail = async (to, subject, html, attachmentPath = null) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS,
      },
    });

    const mailOptions = {
      from: `"Humrahi Foundation" <freefirelogin009@gmail.com>`,
      to,
      subject,
      html,
      text: html.replace(/<[^>]*>/g, ""),
    };

    if (attachmentPath) {
      mailOptions.attachments = [
        {
          filename: "certificate.pdf",
          path: attachmentPath,
        },
      ];
    }

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent:", to);
    console.log("📨 Message ID:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };

  } catch (error) {
    console.error("❌ Email sending failed:", error);

    return {
      success: false,
      error: error.message,
    };
  }
};

export default sendEmail;