import razorpay from "../utils/razorpay.js";
import Donation from "../models/Donation.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
import generateReceipt from "../utils/generateReceipt.js";
import numberToWords from "number-to-words";

const { toWords } = numberToWords;


/* ================= CREATE ORDER ================= */

export const createOrder = async (req, res) => {

try {

const { amount } = req.body;

const order = await razorpay.orders.create({

amount: amount * 100,

currency: "INR"

});

res.json(order);

}

catch (error) {

console.log(error);

res.status(500).json({

success:false,

message:"Create order failed"

});

}

};



/* ================= FINANCIAL YEAR ================= */

const getFinancialYear = () => {

const today = new Date();

const year = today.getFullYear();

const month = today.getMonth() + 1;

if (month >= 4) {

return `${year}-${year+1}`;

}

return `${year-1}-${year}`;

};



/* ================= RECEIPT NUMBER ================= */

const generateReceiptNumber = async () => {

const count = await Donation.countDocuments();

const month =
String(new Date().getMonth()+1).padStart(2,"0");

const year =
new Date().getFullYear();

const number =
String(count+1).padStart(4,"0");

return `HUM-${month}-${year}-${number}`;

};



/* ================= VERIFY PAYMENT ================= */

export const verifyPayment = async (req, res) => {

try {

const {

razorpay_payment_id,

razorpay_order_id,

razorpay_signature,

donor

} = req.body;



/* VERIFY SIGNATURE */

const body =
razorpay_order_id + "|" + razorpay_payment_id;

const expectedSignature =
crypto
.createHmac(
"sha256",
process.env.RAZORPAY_KEY_SECRET
)
.update(body)
.digest("hex");


if (expectedSignature !== razorpay_signature) {

return res.status(400).json({

success:false,

message:"Invalid signature"

});

}



/* FETCH PAYMENT DETAILS */

const payment =
await razorpay.payments.fetch(
razorpay_payment_id
);



/* GENERATE AUTO VALUES */

const certificateId =
await generateReceiptNumber();

const financialYear =
getFinancialYear();


/* AMOUNT IN WORDS */

const amountWords =
toWords(donor.amount)
.replace(/\b\w/g, c => c.toUpperCase()) + " Only";



/* SAVE DONATION */

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


/* Razorpay real method */

paymentMethod: payment.method,


certificateId,

financialYear,

status:"success",

createdAt: new Date()

});


await donation.save();



/* GENERATE RECEIPT PDF */

const receiptPath =
await generateReceipt(donation);


donation.certificateUrl =
receiptPath;

await donation.save();



/* SEND EMAIL */
const emailResult = await sendEmail(
  donation.email,
  "Donation Receipt",
  "<h2>Thank you for your donation</h2><p>Your receipt is attached.</p>",
  receiptPath
);

// ❗ DO NOT BREAK PAYMENT FLOW
if (!emailResult.success) {
  console.error("❌ Email failed but payment successful:", emailResult.error);
}



/* FINAL RESPONSE */

res.json({

success:true,

certificateUrl:receiptPath

});


}

catch(error){

console.log(error);

res.status(500).json({

success:false,

message:"Payment verification failed"

});

}

};



/* ================= SEND CERTIFICATE EMAIL ================= */

export const sendCertificateEmail = async (req,res)=>{

try{

const { donationId } = req.body;

const donation =
await Donation.findById(donationId);


const emailResult = await sendEmail(
  donation.email,
  "Donation Receipt",
  "<h2>Your receipt is attached</h2>",
  donation.certificateUrl
);

if (!emailResult.success) {
  return res.status(500).json({
    success: false,
    message: "Failed to send email",
    error: emailResult.error
  });
}


res.json({success:true});

}

catch(error){

console.log(error);

res.status(500).json({

success:false

});

}

};
