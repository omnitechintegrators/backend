import Comment from "../models/Comment.js";
import Volunteer from "../models/Volunteer.js";
import Donation from "../models/Donation.js";
import sendEmail from "../utils/sendEmail.js"; // ✅ USE BREVO API
import cloudinary from "../config/cloudinary.js";

// ================= OTP STORE (TEMPORARY MEMORY)
const otpStore = new Map();

// =====================================================
// SEND OTP
// =====================================================

export const sendCommentOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // CHECK VOLUNTEER
    const volunteer = await Volunteer.findOne({ email });

    // CHECK DONOR
    const donor = await Donation.findOne({ email });

    if (!volunteer && !donor) {
      return res.status(403).json({
        success: false,
        message: "This email is not registered as Volunteer or Donor",
      });
    }

    const userType = volunteer ? "volunteer" : "donor";

    // GENERATE OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // SAVE OTP
    otpStore.set(email, {
      otp,
      userType,
      expires: Date.now() + 5 * 60 * 1000,
    });

    // ================= SEND EMAIL (BREVO API) =================
    const emailResult = await sendEmail(
      email,
      "Humrahi Foundation Comment Verification OTP",
      `
        <div style="font-family: Arial; padding:20px">
          <h2>Your OTP: ${otp}</h2>
          <p>This OTP is valid for 5 minutes.</p>
        </div>
      `
    );

    if (!emailResult.success) {
      console.error("❌ Comment OTP Email failed:", emailResult.error);

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
    console.error("❌ sendCommentOTP error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =====================================================
// VERIFY OTP AND SUBMIT COMMENT
// =====================================================

export const verifyOTPAndSubmitComment = async (req, res) => {
  try {
    const { name, email, rating, comment, otp } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Profile photo required",
      });
    }

    const storedOTP = otpStore.get(email);

    if (!storedOTP) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    if (storedOTP.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (storedOTP.expires < Date.now()) {
      otpStore.delete(email);

      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // PHOTO PATH
let photo = "";
let public_id = "";

if (req.file) {
  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: "humrahi/comments"
  });

  photo = result.secure_url;
  public_id = result.public_id;
}

    // SAVE COMMENT
    const newComment = new Comment({
      name,
      email,
 photo,
public_id,
      rating,
      comment,
      userType: storedOTP.userType,
      isVerified: true,
    });

    await newComment.save();

    otpStore.delete(email);

    res.json({
      success: true,
      message: "Comment submitted successfully",
    });

  } catch (error) {
    console.error("❌ verifyOTPAndSubmitComment error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =====================================================
// PUBLIC GET COMMENTS
// =====================================================

export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      comments,
    });

  } catch (error) {
    console.error("❌ getComments error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =====================================================
// ADMIN GET ALL COMMENTS
// =====================================================

export const getAllCommentsAdmin = async (req, res) => {
  try {
    const comments = await Comment.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      comments,
    });

  } catch (error) {
    console.error("❌ getAllCommentsAdmin error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =====================================================
// DELETE COMMENT
// =====================================================

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // DELETE IMAGE
 // 🔥 DELETE FROM CLOUDINARY
if (comment.public_id) {
  await cloudinary.uploader.destroy(comment.public_id);
}

    await Comment.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Comment deleted successfully",
    });

  } catch (error) {
    console.error("❌ deleteComment error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};