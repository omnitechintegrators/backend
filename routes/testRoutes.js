import express from "express";
import generateCertificate from "../utils/generateCertificate.js";

const router = express.Router();

router.get("/preview", (req, res) => {

const dummy = {

name: "Test User",

email: "test@gmail.com",

phone: "9999999999",

address: "Lucknow",

amount: 500,

transactionId: "TEST123",

paymentMethod: "UPI",

certificateId: "TEST-CERT",

createdAt: new Date()

};

const path = generateCertificate(dummy);

res.sendFile(path, { root: "." });

});

export default router;
