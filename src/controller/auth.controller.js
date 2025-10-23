import UserModel from "../model/auth.model.js"
import OtpModel from "../model/otp.model.js";
import bcrypt from "bcrypt"
import crypto from 'crypto'
import jwt from "jsonwebtoken"
import { sendEmail } from "../utils/emailService.js";
import { TryError, CatchError } from "../utils/errors.js";

const signupRequest = async (req, res) => {
    try {
        const { username, email, password, dob } = req.body;

        const emailAlreadyExist = await UserModel.findOne({ email });
        if (emailAlreadyExist) throw TryError("Email already registered", 400);

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 2 * 60 * 1000);

        const encryptedPassword = await bcrypt.hash(password.toString(), 12);

        await OtpModel.deleteMany({ email });
        await OtpModel.create({
            username,
            email,
            dob,
            password: encryptedPassword,
            otp,
            otpExpires,
        });

        await sendEmail(
            email,
            "Your OTP Code",
            otp
        );

        return res.status(200).json({
            message: "OTP sent successfully. Please verify within 2 minutes.",
        });
    } catch (err) {
        CatchError(err, res, "Failed to send signup OTP");
    }
};


const verifySignupOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const record = await OtpModel.findOne({ email });
        if (!record)
            throw TryError("No signup request found for this email", 404);

        if (record.otp !== otp)
            throw TryError("Invalid OTP", 400);

        if (record.otpExpires < new Date())
            throw TryError("OTP expired. Please signup again.", 400);

        await UserModel.create({
            username: record.username,
            email: record.email,
            dob: record.dob,
            password: record.password,
        });

        // remove temp record
        await OtpModel.deleteOne({ email });

        return res.status(201).json({ message: "Account created successfully" });
    } catch (error) {
        console.error("OTP Verification Error:", error);
        CatchError(error, res, "OTP verification failed");
    }
};

const resendSignupOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const record = await OtpModel.findOne({ email });

        if (!record)
            throw TryError("No signup request found for this email", 404);

        // Generate new OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 2 * 60 * 1000); // valid for 2 min
        record.otp = otp;
        record.otpExpires = otpExpires;
        await record.save();

        await sendEmail(email, "Your New OTP Code", otp);

        return res.status(200).json({ message: "New OTP sent successfully." });
    } catch (error) {
        console.error("Resend OTP Error:", error);
        CatchError(error, res, "Failed to resend OTP");
    }
};

const login = async (req, res) => {
    try {
        const { email, mobile, password } = req.body

        if ((!email && !mobile) || !password) {
            throw TryError("Email or phone and password are required", 400);
        }

        const user = await UserModel.findOne({
            $or: [{ email: email }, { mobile: mobile }]
        }, { id: 1, email: 1, mobile: 1, username: 1, dob: 1, password: 1 })

        if (!user) {
            throw TryError("Invalid email/phone or password", 400);
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            throw TryError("Invalid email/phone or password", 400);
        }
        const tokenData = {
            id: user._id,
            email: user.email,
            username: user.username,
            dob: user.dob
        }

        const accessToken = jwt.sign(
            tokenData,
            process.env.TOKEN_SECRET_KEY,
            { expiresIn: "50m" }
        )

        const refreshToken = jwt.sign(
            tokenData,
            process.env.REFRESH_SECRET_KEY,
            { expiresIn: "3d" }
        );

        const userData = user.toObject();
        delete userData.password;

        res.status(200).json({
            message: "Login successful",
            status: 200,
            data: userData,
            accessToken,
            refreshToken
        })

    } catch (error) {
        CatchError(error, res, "Login failed, please try again");
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body

        const user = await UserModel.findOne({ email })
        if (!user) {
            throw TryError("User not found", 404);
        }

        const resetToken = crypto.randomBytes(32).toString("hex")
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex")

        user.resetPasswordToken = hashedToken
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000 // 10 mins
        await user.save()

        const resetUrl = `http://localhost:3000/reset-password/${resetToken}`

        await sendEmail(
            email,
            "Password Reset Request",
            `Click the link to reset your password: ${resetUrl}`,
        )

        res.status(200).json({ message: "Reset link sent to your email", token: resetToken })
    } catch (error) {
        CatchError(error, res, "Something went wrong, please try again");
    }
}

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params
        const { newPassword } = req.body

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

        const user = await UserModel.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        })

        if (!user) {
            throw TryError("Invalid or expired token", 404);
        }
        const updatedPassword = await bcrypt.hash(newPassword.toString(), 12)
        user.password = updatedPassword
        user.set("resetPasswordToken", undefined);
        user.set("resetPasswordExpires", undefined);
        await user.save()

        res.status(200).json({ message: "Password reset successful" })
    } catch (error) {
        CatchError(error, res, "Something went wrong, please try again");
    }
}

export {
    signupRequest,
    verifySignupOTP,
    resendSignupOTP,
    login,
    forgotPassword,
    resetPassword
}