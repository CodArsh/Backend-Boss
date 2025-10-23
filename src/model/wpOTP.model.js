import mongoose from "mongoose";

const whatsappOtpSchema = new mongoose.Schema({
    email: { type: String },
    mobile: { type: String, required: true },
    otp: { type: String, required: true },
    otpExpires: { type: Date, required: true },
}, { timestamps: true });

const WhatsappOtpModel = mongoose.model("WhatsappOtp", whatsappOtpSchema);
export default WhatsappOtpModel
