import Otp from "../models/Otp.js";
import Donation from "../models/Donation.js";
import sendEmail from "../utils/sendEmail.js";



export const sendOtp = async (req, res) => {
  try {
    const { email, phone } = req.body;

    const donor = await Donation.findOne({ email, phone });

    if (!donor) {
      return res.status(404).json({ success: false });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.deleteMany({ email });

    await Otp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    // ✅ HANDLE EMAIL SAFELY
    const emailResult = await sendEmail(
      email,
      "OTP Verification",
      `<h2>Your OTP: ${otp}</h2>`
    );

    if (!emailResult.success) {
      console.error("❌ OTP Email failed:", emailResult.error);

      return res.status(500).json({
        success: false,
        message: "OTP generated but email failed",
        error: emailResult.error,
      });
    }

    res.json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.error("❌ OTP error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await Otp.findOne({ email, otp });

    if (!record) {
      return res.status(400).json({ success: false });
    }

    const donations = await Donation.find({ email }).sort({ createdAt: -1 });

    res.json({
      success: true,
      donations,
    });

  } catch (error) {
    console.error("❌ Verify OTP error:", error);

    res.status(500).json({
      success: false,
    });
  }
};
