import { Schema, model } from "mongoose";

const otpSchema = new Schema({
    email: { type: String, required: true },
    username: { type: String, required: true },
    dob: { type: Date, required: true },
    password: { type: String, required: true },
    otp: { type: String, required: true },
    otpExpires: { type: Date, required: true },
}, { timestamps: true });

const OtpModel = model("Otp", otpSchema);
export default OtpModel;
