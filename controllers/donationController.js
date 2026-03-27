import razorpay from "../utils/razorpay.js";
import Donation from "../models/Donation.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
import generateReceipt from "../utils/generateReceipt.js";
import numberToWords from "number-to-words";
import cloudinary from "../config/cloudinary.js";


const { toWords } = numberToWords;

/* ================= CLOUDINARY UPLOAD ================= */
const uploadPDFToCloudinary = (buffer, certificateId) => {
  return new Promise((resolve, reject) => {
  const stream = cloudinary.uploader.upload_stream(
  {
    folder: "humrahi/certificates",
    resource_type: "raw",   // ✅ changed
    public_id: certificateId,
    format: "pdf",            // ✅ keep
  },
  (error, result) => {
    if (error) reject(error);
    else resolve(result);
  }
);

    stream.end(buffer); // ✅ IMPORTANT FIX
  });
};

/* ================= CREATE ORDER ================= */

export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
    });

    res.json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Create order failed",
    });
  }
};

/* ================= FINANCIAL YEAR ================= */

const getFinancialYear = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  if (month >= 4) {
    return `${year}-${year + 1}`;
  }
  return `${year - 1}-${year}`;
};

/* ================= RECEIPT NUMBER ================= */

const generateReceiptNumber = async () => {
  const count = await Donation.countDocuments();

  const month = String(new Date().getMonth() + 1).padStart(2, "0");
  const year = new Date().getFullYear();
  const number = String(count + 1).padStart(4, "0");

  return `HUM-${month}-${year}-${number}`;
};

/* ================= VERIFY PAYMENT ================= */

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      donor,
    } = req.body;

    /* VERIFY SIGNATURE */
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }

    /* FETCH PAYMENT DETAILS */
    const payment = await razorpay.payments.fetch(
      razorpay_payment_id
    );

    /* GENERATE AUTO VALUES */
    const certificateId = await generateReceiptNumber();
    const financialYear = getFinancialYear();

    /* AMOUNT IN WORDS */
    const amountWords =
      toWords(donor.amount).replace(/\b\w/g, (c) => c.toUpperCase()) +
      " Only";

    /* CREATE DONATION OBJECT (NOT SAVED YET) */
    const donation = new Donation({
      name: donor.name,
      email: donor.email,
      phone: donor.phone,
      address: donor.address,
      pan: donor.pan,
      message: donor.message,
      amount: donor.amount,
      amountWords,
      transactionId: razorpay_payment_id,
      paymentMethod: payment.method?.toUpperCase(),
      certificateId,
      financialYear,
      status: "success",
    });

    /* GENERATE PDF BUFFER */
    const pdfBuffer = await generateReceipt(donation);

    /* UPLOAD TO CLOUDINARY (SAFE) */
    let cloudinaryResult;

    try {
      cloudinaryResult = await uploadPDFToCloudinary(
        pdfBuffer,
        donation.certificateId
      );
    } catch (err) {
      console.error("❌ Cloudinary upload failed:", err);
      return res.status(500).json({
        success: false,
        message: "Certificate upload failed",
      });
    }

    /* SAVE CLOUDINARY DATA */
const rawUrl = cloudinaryResult.secure_url;
const pdfUrl = rawUrl.endsWith(".pdf") ? rawUrl : rawUrl + ".pdf";
donation.certificateUrl = pdfUrl;
donation.certificatePublicId = cloudinaryResult.public_id;

    /* SAVE ONCE */
    await donation.save();

    /* SEND EMAIL (NON-BLOCKING SAFE) */
    const emailResult = await sendEmail(
  donation.email,
  "Thank You for Your Donation ❤️",
  `<h2>Thank you for supporting Humrahi Foundation</h2>
   <p>Your donation of ₹${donation.amount} has been received successfully.</p>
   <p>Receipt No: ${donation.certificateId}</p>
   <p>You can view and download your receipt here:</p>
   <a href="${donation.certificateUrl}" target="_blank">Download Receipt</a>`
);
    if (!emailResult?.success) {
      console.error(
        "❌ Email failed but payment successful:",
        emailResult?.error
      );
    }

    /* FINAL RESPONSE */
    res.json({
      success: true,
      certificateUrl: donation.certificateUrl,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};