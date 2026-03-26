import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
{
  /* ================= DONOR INFO ================= */
  name: { type: String, required: true },
  email: { type: String, required: true, index: true },
  phone: String,
  address: String,
  pan: String,
  message: String,

  /* ================= AMOUNT ================= */
  amount: { type: Number, required: true },
  amountWords: String,

  /* ================= PAYMENT ================= */
  transactionId: { type: String, required: true, index: true },
  paymentMethod: String,

  /* ================= CERTIFICATE ================= */
  certificateId: { type: String, required: true, index: true },
  certificateUrl: String,
  certificatePublicId: String,

  /* ================= META ================= */
  financialYear: String,
  status: {
    type: String,
    enum: ["success", "failed", "pending"],
    default: "success",
  },
},
{
  timestamps: true,
}
);

export default mongoose.model("Donation", donationSchema);