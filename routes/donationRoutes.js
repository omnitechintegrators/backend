import express from "express";

import * as donationController from "../controllers/donationController.js";

const router = express.Router();

router.post("/create-order", donationController.createOrder);

router.post("/verify-payment", donationController.verifyPayment);


export default router;


