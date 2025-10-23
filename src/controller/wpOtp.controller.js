import twilio from "twilio";
import WhatsappOtpModel from "../model/wpOTP.model.js";
import dotenv from "dotenv";
import UserModel from "../model/auth.model.js";
import { CatchError, TryError } from "../utils/errors.js";
dotenv.config();

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

export const sendOtp = async (req, res) => {
    try {
        const { mobile } = req.body;
        if (!mobile)
            throw TryError("Mobile number required", 400);

        const mobileAlreadyRegistered = await UserModel.findOne({ mobile });
        if (mobileAlreadyRegistered)
            throw TryError("This number is already registered", 400);

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await client.messages.create({
            from: process.env.TWILIO_WHATSAPP_FROM,
            to: `whatsapp:${mobile}`,
            body: `Your verification code is ${otp}`,
        });

        // Save OTP in DB with expiry
        await WhatsappOtpModel.create({
            mobile,
            otp,
            otpExpires: new Date(Date.now() + 5 * 60 * 1000),
        });
        res.json({ success: true, message: "OTP sent on WhatsApp" });
    } catch (err) {
        console.error(err);
        CatchError(err, res, "Failed to send OTP on WhatsApp");
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { email, mobile, otp } = req.body;

        // Check OTP record
        const record = await WhatsappOtpModel.findOne({ mobile });
        if (!record) {
            throw TryError("OTP not found", 404);
        }

        if (record.otp !== otp) {
            throw TryError("Invalid OTP", 400);
        }

        const user = await UserModel.findOneAndUpdate(
            { email },
            {
                $set: {
                    mobile,
                    mobileVerified: true,
                },
            },
            { new: true }
        ).select("-password -resetPasswordToken -resetPasswordExpires -__v -createdAt -updatedAt");;

        if (!user) {
            throw TryError("Email not found", 404);
        }
        await WhatsappOtpModel.deleteOne({ mobile });

        res.status(200).json({
            success: true,
            message: "OTP verified successfully and mobile updated!",
            user,
        });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        CatchError(error, res, "Error verifying OTP");
    }
};
