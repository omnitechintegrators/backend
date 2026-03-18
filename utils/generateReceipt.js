import fs from "fs";
import PDFDocument from "pdfkit";

const generateReceipt = async (donation) => {

const dir = "certificates";

if (!fs.existsSync(dir)) fs.mkdirSync(dir);

const filePath = `${dir}/${donation.certificateId}.pdf`;

const doc = new PDFDocument({
size: "A4",
margin: 40
});

doc.pipe(fs.createWriteStream(filePath));


/* ================= REGISTER FONT ================= */

doc.registerFont(
"normal",
"./fonts/NotoSans-Regular.ttf"
);


/* ================= BORDER ================= */

doc.rect(40, 40, 520, 740).stroke();


/* ================= LOGO ================= */

doc.image(
"assets/logo.png",
50,
50,
{ width: 80 }
);


/* ================= HEADER ================= */

doc
.font("Helvetica-Bold")
.fontSize(22)
.text("Humrahi Foundation",0,55,{ align:"center" });


doc
.font("Helvetica")
.fontSize(12)
.text("Parameshwar Niwas,",0,80,{ align:"center" })
.text("Gudiya jote, Matigara,",0,95,{ align:"center" })
.text("Darjeeling, West Bengal",0,110,{ align:"center" });


doc
.fontSize(10)
.text(
"Phone No. : 8001880016     Email : humrahi2022@gmail.com     Website : www.myhumrahi.org",
0,
130,
{ align:"center" }
);


/* ================= LINE ================= */

doc.moveTo(40,155).lineTo(555,155).stroke();


/* ================= REG INFO ================= */

doc
.font("Helvetica-Bold")
.fontSize(11)
.text("Regd. No.: ",60,165,{ continued:true })
.font("Helvetica")
.text("040200062");


doc
.font("Helvetica-Bold")
.text("PAN No.: ",300,165,{ continued:true })
.font("Helvetica")
.text("AACTH8636F");


doc
.font("Helvetica-Bold")
.text("I.T. Exemption Cert. No. (80G No.): ",60,185,{ continued:true })
.font("Helvetica")
.text("AACTH8636FF20251");


/* ================= LINE ================= */

doc.moveTo(40,210).lineTo(555,210).stroke();


/* ================= TITLE ================= */

doc
.font("Helvetica-Bold")
.fontSize(18)
.text("Donation Receipt",0,225,{ align:"center" });



/* ================= DETAILS ================= */

let y = 260;


const field = (label,value)=>{

doc
.font("Helvetica-Bold")
.fontSize(11)
.text(label,60,y,{ continued:true })
.font("Helvetica")
.text(value || "-");

y += 25;

};


/* AUTO DATE */

field("Date: ", new Date(donation.createdAt).toLocaleDateString("en-IN"));


/* AUTO FY */

field("F.Y.: ", donation.financialYear);


/* AUTO RECEIPT */

field("Receipt No.: ", donation.certificateId);


/* DONOR DETAILS */

field(
"Received with thanks from M/s. / Mr./Mrs.: ",
donation.name
);

field("Address: ", donation.address);

field("Tel. No.: ", donation.phone);

field("Email: ", donation.email);

field("PAN No.: ", donation.pan);



/* AMOUNT WORDS */

field("Rupees: ", donation.amountWords);


/* FIXED */

field("on a/c. of: ", "Voluntary");

field("for: ", "Food Distribution");


/* AUTO PAYMENT METHOD */

field("By: ", donation.paymentMethod.toUpperCase());

field("Payment Details: ", donation.transactionId);



/* ================= AMOUNT BOX ================= */

y += 20;

doc.rect(60,y,200,40).stroke();


doc
.font("normal")
.fontSize(14)
.text(
"₹ " + donation.amount + ".00",
80,
y+12
);



/* ================= SAFE SIGNATURE AREA ================= */

const footerTop = 720;

const signY = footerTop - 140;


/* THANK YOU */

doc
.font("Helvetica-Bold")
.fontSize(18)
.text("Thank You",320,signY);



/* STAMP */

doc.image(
"assets/stamp.png",
250,
signY + 50,
{ width:100 }
);



/* SIGNATURE */

doc
.font("Helvetica-Bold")
.fontSize(12)
.text("For Humrahi Foundation",360,signY + 40);


doc.image(
"assets/signature.png",
380,
signY + 60,
{ width:100 }
);


doc
.font("Helvetica")
.text("Signature",400,signY + 120);



/* ================= FOOTER ================= */

doc.moveTo(40,footerTop).lineTo(555,footerTop).stroke();


doc.fontSize(9);


doc.text(
"This is a computer-generated receipt; no physical copy is required.",
50,
735,
{
width:500,
align:"center"
}
);


doc.text(
"80G Declaration: This donation is eligible for tax deduction under section 80G of the Income Tax Act, 1961",
50,
750,
{
width:500,
align:"center"
}
);



doc.end();

return filePath;

};

export default generateReceipt;
