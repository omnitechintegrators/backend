import axios from "axios";
import fs from "fs";
import path from "path";

const sendEmail = async (to, subject, html, attachmentPath = null) => {
  try {
    let attachments = [];

    // ================= FIX PATH =================
    if (attachmentPath) {
      // Convert relative path → absolute path
      let absolutePath = attachmentPath;

      if (!path.isAbsolute(attachmentPath)) {
        absolutePath = path.join(process.cwd(), attachmentPath);
      }

      console.log("📂 Attachment path:", absolutePath);
      console.log("📂 File exists:", fs.existsSync(absolutePath));

      // ================= ATTACH FILE =================
      if (fs.existsSync(absolutePath)) {
        const fileContent = fs.readFileSync(absolutePath, {
          encoding: "base64",
        });

        attachments.push({
          name: path.basename(absolutePath), // actual file name
          content: fileContent,
        });
      } else {
        console.error("❌ Attachment file not found:", absolutePath);
      }
    }

    // ================= SEND EMAIL =================
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

    console.log("✅ Email sent with attachment:", response.data);

    return { success: true };

  } catch (error) {
    console.error(
      "❌ Email API Error:",
      error.response?.data || error.message
    );

    return {
      success: false,
      error: error.response?.data || error.message,
    };
  }
};

export default sendEmail;