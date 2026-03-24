import express from "express";

import multer from "multer";

import path from "path";

import fs from "fs";

import {

sendCommentOTP,
verifyOTPAndSubmitComment,
getComments,
getAllCommentsAdmin,
deleteComment

} from "../controllers/commentController.js";


const router = express.Router();


// ================= UPLOAD FOLDER =================

const uploadDir = "uploads/comments";

if (!fs.existsSync(uploadDir))
{
fs.mkdirSync(uploadDir, { recursive: true });
}


// ================= MULTER =================

const upload = multer({ dest: "temp/" });


// ================= ROUTES =================


// SEND OTP

router.post(

"/send-otp",

sendCommentOTP

);


// VERIFY AND SUBMIT

router.post(

"/verify-submit",

upload.single("photo"),

verifyOTPAndSubmitComment

);


// PUBLIC GET COMMENTS

router.get(

"/",

getComments

);


// ADMIN GET

router.get(

"/admin",

getAllCommentsAdmin

);


// DELETE

router.delete(

"/:id",

deleteComment

);


export default router;