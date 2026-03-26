import axios from "axios";

const sendEmail = async (to, subject, html) => {
  try {
   

    // ================= SEND EMAIL =================
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Humrahi Foundation",
          email: "humrahi2022@gmail.com",
        },
        to: [{ email: to }],
        subject: subject,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Email sent", response.data);

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