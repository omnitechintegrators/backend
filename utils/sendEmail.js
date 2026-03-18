import nodemailer from "nodemailer";

const sendEmail = async (to, subject, html, attachmentPath = null) => {

try {

const transporter = nodemailer.createTransport({

host: process.env.EMAIL_HOST,

port: process.env.EMAIL_PORT,

secure: true,

auth: {

user: process.env.EMAIL_USER,

pass: process.env.EMAIL_PASS,

},

});


const mailOptions = {

from: `"Humrahi Foundation" <${process.env.EMAIL_USER}>`,

to,

subject,

html,

};


// ✅ ADD ATTACHMENT SUPPORT (for donation certificate)

if (attachmentPath) {

mailOptions.attachments = [

{

path: attachmentPath

}

];

}


await transporter.sendMail(mailOptions);


console.log("Email sent successfully");

} catch (error) {

console.log("Email error:", error);

}

};

export default sendEmail;
