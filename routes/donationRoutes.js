import express from "express";

import * as donationController from "../controllers/donationController.js";
import { sendCertificateEmail } from "../controllers/donationController.js";
const router = express.Router();

router.post("/create-order", donationController.createOrder);

router.post("/verify-payment", donationController.verifyPayment);

router.post("/send-certificate-email", sendCertificateEmail);
export default router;


