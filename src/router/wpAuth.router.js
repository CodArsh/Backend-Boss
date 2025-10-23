import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { sendOtp, verifyOtp } from "../controller/wpOtp.controller.js";

const WpRouter = Router()

WpRouter.post('/send-otp',verifyToken, sendOtp)
WpRouter.post('/verify-otp', verifyToken, verifyOtp)

export default WpRouter