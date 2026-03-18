import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";

const generateCertificate = (donation) => {

const dir = "certificates";

if (!fs.existsSync(dir)) {

fs.mkdirSync(dir);

}

const filePath = `${dir}/${donation.certificateId}.pdf`;

const doc = new PDFDocument({

size: "A4",

margin: 40

});

doc.pipe(fs.createWriteStream(filePath));



/* ================= HEADER ================= */

doc
.fontSize(18)
.text("Humrahi Foundation", { align: "center" });

doc
.fontSize(11)
.text("Parameshwar Niwas,   ", { align: "center" });

doc.text("Gudiya jote, Matigara,", { align: "center" });

doc.text("Darjeeling, West Bengal", { align: "center" });

doc.text(
"Phone: 8001880016   Email: humrahi2022@gmail.com   Website: www.myhumrahi.org",
{ align: "center" }
);

doc.moveDown();

doc.text(
"Regd No: 040200062        PAN No: AACTH8636F",
{ align: "center" }
);

doc.text(
"80G No: AACTH8636FF20251",
{ align: "center" }
);



/* ================= TITLE ================= */

doc.moveDown();

doc
.fontSize(20)
.text("Donation Receipt", {

align: "center",

underline: true

});

doc.moveDown();



/* ================= RECEIPT DETAILS ================= */

const date = new Date(donation.createdAt);

const formattedDate = date.toLocaleDateString("en-IN", {

day: "2-digit",

month: "long",

year: "numeric"

});

doc
.fontSize(12)
.text(`Receipt No: ${donation.certificateId}`);

doc.text(`Date: ${formattedDate}`);

doc.moveDown();



/* ================= DONOR DETAILS ================= */

doc.text(`Received with thanks from: ${donation.name}`);

doc.text(`Address: ${donation.address}`);

doc.text(`Phone: ${donation.phone}`);

doc.text(`Email: ${donation.email}`);

doc.text(`Pan: ${donation.pan}`);

doc.moveDown();



/* ================= AMOUNT ================= */

doc
.fontSize(14)
.text(`Amount: ₹ ${donation.amount}`, {

bold: true

});

doc.text(`Payment Method: ${donation.paymentMethod}`);

doc.text(`Transaction ID: ${donation.transactionId}`);

doc.moveDown();



/* ================= SIGNATURE ================= */

doc.moveDown(2);

doc.text("For Humrahi Foundation", {

align: "right"

});

doc.text("Authorized Signature", {

align: "right"

});



/* ================= FOOTER ================= */

doc.moveDown(2);

doc
.fontSize(10)
.text(

"This is a computer generated receipt. No signature required.",

{

align: "center"

}

);



doc.end();



return filePath;

};



export default generateCertificate;
