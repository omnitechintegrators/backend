import Comment from "../models/Comment.js";
import Volunteer from "../models/Volunteer.js";
import Donation from "../models/Donation.js";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";


// ================= OTP STORE (TEMPORARY MEMORY)
// Production upgrade later: Redis

const otpStore = new Map();



// ================= EMAIL TRANSPORT =================

const transporter = nodemailer.createTransport({

    service: "gmail",

    auth:
    {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }

});



// =====================================================
// SEND OTP
// =====================================================

export const sendCommentOTP = async (req, res) =>
{
    try
    {

        const { email } = req.body;


        if (!email)
        {
            return res.status(400).json({

                success: false,
                message: "Email is required"

            });
        }



        // CHECK VOLUNTEER

        const volunteer = await Volunteer.findOne({ email });


        // CHECK DONOR

        const donor = await Donation.findOne({ email });



        if (!volunteer && !donor)
        {

            return res.status(403).json({

                success: false,
                message: "This email is not registered as Volunteer or Donor"

            });

        }



        const userType = volunteer ? "volunteer" : "donor";



        // GENERATE OTP

        const otp = Math.floor(100000 + Math.random() * 900000).toString();



        // SAVE OTP

        otpStore.set(email, {

            otp,
            userType,
            expires: Date.now() + 5 * 60 * 1000

        });



        // SEND EMAIL

        await transporter.sendMail({

            from: `"Humrahi Foundation" <${process.env.EMAIL_USER}>`,

            to: email,

            subject: "Humrahi Foundation Comment Verification OTP",

            html: `

                <div style="font-family: Arial; padding:20px">

                    <h2>Your OTP: ${otp}</h2>

                    <p>This OTP is valid for 5 minutes.</p>

                </div>

            `

        });



        res.json({

            success: true,
            message: "OTP sent successfully"

        });



    }
    catch (error)
    {

        console.error(error);

        res.status(500).json({

            success: false,
            message: "Server Error"

        });

    }
};



// =====================================================
// VERIFY OTP AND SUBMIT COMMENT
// =====================================================

export const verifyOTPAndSubmitComment = async (req, res) =>
{
    try
    {

        const {

            name,
            email,
            rating,
            comment,
            otp

        } = req.body;



        if (!req.file)
        {

            return res.status(400).json({

                success: false,
                message: "Profile photo required"

            });

        }



        const storedOTP = otpStore.get(email);



        if (!storedOTP)
        {

            return res.status(400).json({

                success: false,
                message: "OTP expired"

            });

        }



        if (storedOTP.otp !== otp)
        {

            return res.status(400).json({

                success: false,
                message: "Invalid OTP"

            });

        }



        if (storedOTP.expires < Date.now())
        {

            otpStore.delete(email);

            return res.status(400).json({

                success: false,
                message: "OTP expired"

            });

        }



        // PHOTO PATH

        const photoPath = `/uploads/comments/${req.file.filename}`;



        // SAVE COMMENT

        const newComment = new Comment({

            name,
            email,
            photo: photoPath,
            rating,
            comment,
            userType: storedOTP.userType,
            isVerified: true

        });



        await newComment.save();



        otpStore.delete(email);



        res.json({

            success: true,
            message: "Comment submitted successfully"

        });



    }
    catch (error)
    {

        console.error(error);

        res.status(500).json({

            success: false,
            message: "Server Error"

        });

    }
};



// =====================================================
// PUBLIC GET COMMENTS
// =====================================================

export const getComments = async (req, res) =>
{
    try
    {

        const comments = await Comment.find()

        .sort({ createdAt: -1 })

        .limit(50);



        res.json({

            success: true,
            comments

        });

    }
    catch (error)
    {

        res.status(500).json({

            success: false,
            message: "Server Error"

        });

    }
};



// =====================================================
// ADMIN GET ALL COMMENTS
// =====================================================

export const getAllCommentsAdmin = async (req, res) =>
{
    try
    {

        const comments = await Comment.find()

        .sort({ createdAt: -1 });



        res.json({

            success: true,
            comments

        });

    }
    catch (error)
    {

        res.status(500).json({

            success: false,
            message: "Server Error"

        });

    }
};



// =====================================================
// DELETE COMMENT
// =====================================================

export const deleteComment = async (req, res) =>
{
    try
    {

        const { id } = req.params;



        const comment = await Comment.findById(id);



        if (!comment)
        {

            return res.status(404).json({

                success: false,
                message: "Comment not found"

            });

        }



        // DELETE IMAGE

        const imagePath = path.join(

            "backend",

            comment.photo

        );



        if (fs.existsSync(imagePath))
        {

            fs.unlinkSync(imagePath);

        }



        await Comment.findByIdAndDelete(id);



        res.json({

            success: true,
            message: "Comment deleted successfully"

        });



    }
    catch (error)
    {

        res.status(500).json({

            success: false,
            message: "Server Error"

        });

    }
};