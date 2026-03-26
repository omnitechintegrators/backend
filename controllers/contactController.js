import sendEmail from "../utils/sendEmail.js";

export const submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // ================= VALIDATION =================
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    // ================= EMAIL CONTENT =================
    const html = `
      <div style="font-family: Arial; padding: 20px;">
        <h2 style="color:#D9272B;">📩 New Contact Form Submission</h2>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p><strong>Subject:</strong> ${subject || "N/A"}</p>

        <hr/>

        <p><strong>Message:</strong></p>
        <p>${message}</p>

        <br/>
        <p style="font-size:12px;color:gray;">
          This message was sent from Humrahi website contact form.
        </p>
      </div>
    `;

    // ================= SEND EMAIL =================
    await sendEmail(
      process.env.EMAIL_FROM_ADDRESS, // 👈 your admin email
      "New Contact Form Submission",
      html
    );

    res.json({
      success: true,
      message: "Message sent successfully",
    });

  } catch (error) {
    console.error("Contact Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};