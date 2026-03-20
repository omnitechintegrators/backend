import axios from "axios";
import fs from "fs";

const sendEmail = async (to, subject, html, attachmentPath = null) => {
  try {

    let attachments = [];

    // ✅ HANDLE ATTACHMENT
    if (attachmentPath && fs.existsSync(attachmentPath)) {
      const fileContent = fs.readFileSync(attachmentPath).toString("base64");

      attachments.push({
        name: "receipt.pdf",
        content: fileContent,
      });
    }

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Humrahi Foundation",
          email: "freefirelogin009@gmail.com",
        },
        to: [{ email: to }],
        subject: subject,
        htmlContent: html,
        attachments: attachments.length > 0 ? attachments : undefined,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Email sent with attachment");

    return { success: true };

  } catch (error) {
    console.error("❌ Email API Error:", error.response?.data || error.message);

    return {
      success: false,
      error: error.response?.data || error.message,
    };
  }
};

export default sendEmail;