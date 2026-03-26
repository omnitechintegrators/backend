import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";
const generateReceipt = async (donation) => {

  return new Promise((resolve, reject) => {

    const doc = new PDFDocument({
      size: "A4",
      margin: 40
    });

    let buffers = [];

    doc.on("data", buffers.push.bind(buffers));

    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve(pdfBuffer);
    });

    /* ================= REGISTER FONT ================= */
const fontPath = path.join(process.cwd(), "fonts/NotoSans-Regular.ttf");

if (fs.existsSync(fontPath)) {
  doc.registerFont("normal", fontPath);
}

    /* ================= BORDER ================= */
    doc.rect(40, 40, 520, 740).stroke();

    /* ================= LOGO ================= */
const logoPath = path.join(process.cwd(), "assets/logo.png");

if (fs.existsSync(logoPath)) {
  doc.image(logoPath, 50, 50, { width: 80 });
}
    /* ================= HEADER ================= */
    doc
      .font("Helvetica-Bold")
      .fontSize(22)
      .text("Humrahi Foundation", 0, 55, { align: "center" });

    doc
      .font("Helvetica")
      .fontSize(12)
      .text("Parameshwar Niwas,", 0, 80, { align: "center" })
      .text("Gudiya jote, Matigara,", 0, 95, { align: "center" })
      .text("Darjeeling, West Bengal", 0, 110, { align: "center" });

    doc
      .fontSize(10)
      .text(
        "Phone No. : 8001880016     Email : humrahi2022@gmail.com     Website : www.myhumrahi.org",
        0,
        130,
        { align: "center" }
      );

    /* ================= LINE ================= */
    doc.moveTo(40, 155).lineTo(555, 155).stroke();

    /* ================= REG INFO ================= */
    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .text("Regd. No.: ", 60, 165, { continued: true })
      .font("Helvetica")
      .text("040200062");

    doc
      .font("Helvetica-Bold")
      .text("PAN No.: ", 300, 165, { continued: true })
      .font("Helvetica")
      .text("AACTH8636F");

    doc
      .font("Helvetica-Bold")
      .text("I.T. Exemption Cert. No. (80G No.): ", 60, 185, { continued: true })
      .font("Helvetica")
      .text("AACTH8636FF20251");

    /* ================= LINE ================= */
    doc.moveTo(40, 210).lineTo(555, 210).stroke();

    /* ================= TITLE ================= */
    doc
      .font("Helvetica-Bold")
      .fontSize(18)
      .text("Donation Receipt", 0, 225, { align: "center" });

    /* ================= DETAILS ================= */
    let y = 260;

    const field = (label, value) => {
      doc
        .font("Helvetica-Bold")
        .fontSize(11)
        .text(label, 60, y, { continued: true })
        .font("Helvetica")
        .text(value || "-");

      y += 25;
    };

    field("Date: ", new Date().toLocaleDateString("en-IN"));
    field("F.Y.: ", donation.financialYear);
    field("Receipt No.: ", donation.certificateId);
    field("Received with thanks from: ", donation.name);
    field("Address: ", donation.address);
    field("Tel. No.: ", donation.phone);
    field("Email: ", donation.email);
    field("PAN No.: ", donation.pan);
    field("Rupees: ", donation.amountWords);
    field("on a/c. of: ", "Voluntary");
    field("for: ", "Food Distribution");
    field("By: ", donation.paymentMethod);
    field("Payment Details: ", donation.transactionId);

    /* ================= AMOUNT BOX ================= */
    y += 20;

    doc.rect(60, y, 200, 40).stroke();

    doc
      .font("normal")
      .fontSize(14)
      .text(`₹ ${donation.amount}.00`, 80, y + 12);

    /* ================= SIGNATURE ================= */
    const footerTop = 720;
    const signY = footerTop - 140;

    doc
      .font("Helvetica-Bold")
      .fontSize(18)
      .text("Thank You", 320, signY);

const stampPath = path.join(process.cwd(), "assets/stamp.png");

if (fs.existsSync(stampPath)) {
  doc.image(stampPath, 250, signY + 50, { width: 100 });
}

    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("For Humrahi Foundation", 360, signY + 40);
const signPath = path.join(process.cwd(), "assets/signature.png");

if (fs.existsSync(signPath)) {
  doc.image(signPath, 380, signY + 60, { width: 100 });
}
    doc.font("Helvetica").text("Signature", 400, signY + 120);

    /* ================= FOOTER ================= */
    doc.moveTo(40, footerTop).lineTo(555, footerTop).stroke();

    doc.fontSize(9);

    doc.text(
      "This is a computer-generated receipt; no physical copy is required.",
      50,
      735,
      { width: 500, align: "center" }
    );

    doc.text(
      "80G Declaration: This donation is eligible for tax deduction under section 80G of the Income Tax Act, 1961",
      50,
      750,
      { width: 500, align: "center" }
    );

    doc.end();
  });
};

export default generateReceipt;